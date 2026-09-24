import { cloneElement, useState, useEffect, useId, useRef } from "react";
import type { ReactElement, HTMLAttributes, ReactNode } from "react";
import { css, cx } from "@crab-dev/css";
import { CircleAlert, TriangleAlert, CircleCheck } from "lucide-react";
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';
import Tooltip from "@crab-dev/rc-tooltip";

import token from "./token.js";
import { RuleType, ValidateState } from "./types.js";
import type { FormItemEditor, NamePath, Rule, FieldValidationResult } from "./types.js";
import useFormContext from "./hooks/useFormContext.js";
import { MessageEnum } from "./bus.js";
import {
    getRecordValue,
    equalsNamePath
} from "./util.js";

const EMPTY_RULES: Rule[] = [];

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

    /** 字段协议：value（默认）、原生事件、checked 或 onValueChange。 */
    binding?: 'value' | 'event' | 'checked' | 'valueChange';
    valuePropName?: string;
    trigger?: string;
    getValueFromEvent?: (...args: unknown[]) => unknown;

    /**
     * 是否隐藏字段
     */
    hidden?: boolean

    /**
     * 文本的标签
     */
    label?: ReactNode

    /**
     * 字段名称
     */
    name: NamePath

    /**
     * 是否必填
     */
    required?: boolean

    /**
     * 校验规则
     */
    rules?: Rule[]

    /**
     * 编辑器
     */
    children?: ReactElement<FormItemEditor> | ((field: FormItemEditor) => ReactNode)
}

// ─── 样式 ────────────────────────────────────────────────────────────────────

// 字段行：以 subgrid 复用 Form 定义的三列轨道（标签 / 编辑器 / 状态图标），
// 使所有字段的标签列宽度自动对齐到最长标签；不再用绝对定位承载校验文案，
// 因此没有任何"为消息硬留的" margin，行高由内容自然决定。
const rowStyle = css`
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
`;

const labelStyle = css`
    grid-column: 1;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: ${token.required.gap};
    box-sizing: border-box;
    font-size: ${token.label['font-size']};
    font-weight: ${token.label['font-weight']};
    color: ${token.label.color};
`;

const requiredStyle = css`
    color: ${token.required.color};
    font-family: SimSun, sans-serif;
    line-height: 1;
`;

// 编辑器占据第 2 列（1fr）；min-width: 0 允许在窄容器内正常收缩
const editorWrapStyle = css`
    grid-column: 2;
    min-width: 0;
`;

// 状态槽：固定尺寸，无论有无校验结果都占位，从根本上杜绝图标出现 / 消失引发的布局抖动
const statusSlotStyle = css`
    grid-column: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.status.width};
    height: ${token.status.width};

    & svg {
        display: block;
        width: 100%;
        height: 100%;
    }
`;

// error / warning 状态下的图标是可点击 / 可聚焦的触发器（用于唤起 Tooltip 展示消息）
const statusTriggerStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    cursor: pointer;

    &:focus-visible {
        border-radius: 50%;
        outline: 2px solid currentColor;
        outline-offset: 1px;
    }
`;

const errorColorStyle = css`
    color: ${token.status['color-error']};
`;

const warningColorStyle = css`
    color: ${token.status.warning.color};
`;

const successColorStyle = css`
    color: ${token.status.success.color};
`;

// 校验中：复用 rc-spin 的纯视觉环（旋转与 reduced-motion 降级由其统一承担）。
// 校验文案已由下方 srOnly 的 role="alert" 播报，故此处只是视觉意符，描边跟随槽位前景色。
const validatingStyle = css`
    color: ${token.status.validating.color};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

// 视觉隐藏但保留在无障碍树中：承载完整校验文案，供屏幕阅读器播报（role="alert"），
// 与末尾图标 + Tooltip 的视觉呈现互补。
const srOnlyStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

function FormItemComponent({
    className,
    hidden,
    label,
    name,
    required,
    binding = 'value',
    valuePropName = binding === 'checked' ? 'checked' : 'value',
    trigger = binding === 'valueChange' ? 'onValueChange' : 'onChange',
    getValueFromEvent,
    rules = EMPTY_RULES,
    children,
    ...restProps
}: FormItemProps) {
    const id = useId();
    const messageId = `${id}-message`;
    const {
        eventBus,
        getFieldValue,
        requiredIndicatorRenderer
    } = useFormContext();

    // 实际上存储的值
    const [value, setValue] = useState<unknown>();
    // 可变实例状态：同一事件中的 setFieldValue 和 validateFields 共享最新值。
    const valueRef = useRef<unknown>(undefined);
    const fieldKey = JSON.stringify(typeof name === 'string' ? [name] : name);
    useEffect(() => {
        const next = getFieldValue?.(JSON.parse(fieldKey) as string[]);
        valueRef.current = next;
        setValue(next);
    }, [getFieldValue, fieldKey]);
    // 校验状态
    const [validateState, setValidateState] = useState<ValidateState>(ValidateState.DEFAULT);
    // 校验消息
    const [validateMessage, setValidateMessage] = useState<string>("");
    // Tooltip 显隐：受控。点击图标切换；Tooltip 内部 hover / focus / 外部点击也会回写此状态。
    const [messageOpen, setMessageOpen] = useState(false);
    // 可变实例状态：忽略编辑、重置或卸载前发起的异步校验结果。
    const validationVersion = useRef(0);
    useEffect(() => () => { validationVersion.current += 1; }, []);

    const isInvalid = validateState === ValidateState.ERROR || validateState === ValidateState.WARNING;
    // 精简状态映射，透传给编辑器驱动其边框等即时反馈
    const editorStatus: "error" | "warning" | undefined =
        validateState === ValidateState.ERROR ? "error"
            : validateState === ValidateState.WARNING ? "warning"
                : undefined;

    const renderRequiredElement = () => {
        if (required) {
            return (
                <span aria-hidden className={requiredStyle}>*</span>
            );
        }
        return null;
    };

    // 渲染 label
    const renderLabelElement = () => {
        if (label == null) {
            return null;
        }
        const renderedLabel = requiredIndicatorRenderer ? requiredIndicatorRenderer({
            label,
            required: required === true
        }) : (
            <>
                {renderRequiredElement()}
                {label}
            </>
        );
        return (
            <label htmlFor={typeof children === 'function' ? id : children?.props.id ?? id} className={labelStyle}>
                {renderedLabel}
            </label>
        );
    };

    // 渲染末尾状态图标：default 空占位（保持槽位尺寸）/ validating 转圈 / success 对勾 /
    // error / warning 为可点击图标，点击（或 hover / focus）唤起 Tooltip 展示对应消息。
    const renderStatusElement = () => {
        if (validateState === ValidateState.VALIDATING) {
            return (
                <span className={cx.call(undefined, statusSlotStyle, validatingStyle)} aria-hidden>
                    <SpinIndicator />
                </span>
            );
        }
        if (validateState === ValidateState.SUCCESS) {
            return (
                <span className={cx.call(undefined, statusSlotStyle, successColorStyle)} aria-hidden>
                    <CircleCheck />
                </span>
            );
        }
        if (isInvalid) {
            const Icon = validateState === ValidateState.ERROR ? CircleAlert : TriangleAlert;
            const colorStyle = validateState === ValidateState.ERROR ? errorColorStyle : warningColorStyle;
            return (
                <span className={cx.call(undefined, statusSlotStyle, colorStyle)}>
                    <Tooltip
                        title={validateMessage}
                        placement="top"
                        open={messageOpen}
                        onOpenChange={setMessageOpen}
                    >
                        <button
                            type="button"
                            className={statusTriggerStyle}
                            aria-label="查看校验提示"
                            aria-describedby={messageId}
                            onClick={() => setMessageOpen((prev) => !prev)}
                        >
                            <Icon />
                        </button>
                    </Tooltip>
                </span>
            );
        }
        // DEFAULT：空占位，槽位固定尺寸保证布局稳定
        return <span className={statusSlotStyle} aria-hidden />;
    };

    // 渲染编辑器
    const renderEditorElement = () => {
        if (children == null) {
            return null;
        }
        const props = typeof children === 'function' ? {} : children.props;
        const changeValue = (newValue: unknown) => {
            validationVersion.current += 1;
            valueRef.current = newValue;
            setValue(newValue);
            setValidateState(ValidateState.DEFAULT);
            setValidateMessage('');
            setMessageOpen(false);
            eventBus?.dispatch({ type: MessageEnum.ON_ITEM_VALUE_CHANGE, payload: [{ name, value: newValue }] });
        };
        const field: FormItemEditor = {
            id: props.id ?? id,
            value,
            validateState,
            status: editorStatus,
            'aria-invalid': validateState === ValidateState.ERROR || undefined,
            'aria-describedby': [props['aria-describedby'], isInvalid ? messageId : undefined].filter(Boolean).join(' ') || undefined,
            onChange: changeValue,
        };
        if (typeof children === 'function') return <div className={editorWrapStyle}>{children(field)}</div>;
        const childProps = props as Record<string, unknown>;
        const handleChange = (...args: unknown[]) => {
            let next = args[0];
            if (getValueFromEvent) next = getValueFromEvent(...args);
            else if (next && typeof next === 'object' && 'target' in next) {
                const target = next.target;
                if (target && typeof target === 'object') {
                    if (valuePropName === 'checked' && 'checked' in target) next = target.checked;
                    else if ('value' in target) next = target.value;
                }
            }
            changeValue(next);
            const handler = childProps[trigger];
            if (typeof handler === 'function') handler(...args);
        };
        const editorProps = {
            ...field,
            [valuePropName]: valuePropName === 'checked' ? Boolean(value) : binding === 'event' ? value ?? '' : value,
            [trigger]: handleChange,
        };
        if (valuePropName !== 'value') delete editorProps.value;
        if (trigger !== 'onChange') delete editorProps.onChange;
        if (binding !== 'value' || typeof children.type === 'string') delete editorProps.validateState;
        if (typeof children.type === 'string') delete editorProps.status;
        return (
            <div className={editorWrapStyle}>
                {cloneElement(children, editorProps)}
            </div>
        );
    };

    useEffect(() => {
        const onSendToChangeItemValue = (param: {
            name: NamePath,
            value: unknown
        }) => {
            if (equalsNamePath(param.name, name)) {
                validationVersion.current += 1;
                valueRef.current = param.value;
                setValue(param.value);
                eventBus?.dispatch({
                    type: MessageEnum.ON_ITEM_VALUE_CHANGE,
                    payload: [{
                        name,
                        value: param.value
                    }]
                })
            }
        }

        const subscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
            ring: onSendToChangeItemValue
        }
        eventBus?.subscribe(subscriber);
        const onTriggerItemVerification = async (fields?: readonly NamePath[], snapshot?: object): Promise<FieldValidationResult | undefined> => {
            if (fields != null && !fields.some(field => equalsNamePath(field, name))) {
                return;
            }
            const version = ++validationVersion.current;
            const result: FieldValidationResult = { name, errors: [], warnings: [] };
            const currentValue = snapshot ? getRecordValue(snapshot, name) : valueRef.current;
            setValidateState(ValidateState.VALIDATING);
            if (required === true && (currentValue == null || currentValue === "")) {
                const message = `请输入${label?.toString() ?? ""}`;
                result.errors.push(message);
            }
            for (let i = 0; i < rules.length; i += 1) {
                const rule = rules[i];
                if (rule.type == RuleType.ERROR || rule.type == RuleType.WARNING) {
                    try {
                        await rule.validator(currentValue)
                    } catch (error) {
                        const message = error instanceof Error ? error.message : String(error);
                        if (rule.type == RuleType.ERROR) {
                            result.errors.push(message);
                        } else {
                            result.warnings.push(message);
                        }
                    }
                }
            }
            if (validationVersion.current === version) {
                setValidateMessage([...result.errors, ...result.warnings].join('\n'));
                setValidateState(result.errors.length ? ValidateState.ERROR : result.warnings.length ? ValidateState.WARNING : ValidateState.SUCCESS);
            }
            return result;
        }
        const verificationSubscriber = {
            id,
            type: MessageEnum.TRIGGER_ITEM_VERIFICATION,
            ring: onTriggerItemVerification
        }
        eventBus?.subscribe(verificationSubscriber);

        const onParentReady = () => {
            onSendToChangeItemValue({
                name,
                value
            })
        }
        const parentReadySubscriber = {
            id,
            type: MessageEnum.ON_PARENT_READY,
            ring: onParentReady
        }
        eventBus?.subscribe(parentReadySubscriber)

        const onChangeValues = (values: Record<string, unknown>) => {
            validationVersion.current += 1;
            const newValue = getRecordValue(values, name);
            valueRef.current = newValue;
            setValue(newValue);
        }

        const changeValuesSubscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_VALUES,
            ring: onChangeValues
        }
        eventBus?.subscribe(changeValuesSubscriber)

        const resetSubscriber = {
            id,
            type: MessageEnum.RESET_VALIDATION,
            ring: (names?: readonly NamePath[]) => {
                if (names && !names.some(field => equalsNamePath(field, name))) return;
                validationVersion.current += 1;
                setValidateState(ValidateState.DEFAULT);
                setValidateMessage('');
                setMessageOpen(false);
            },
        };
        eventBus?.subscribe(resetSubscriber);

        return () => {
            eventBus?.unSubscribe(resetSubscriber);
            eventBus?.unSubscribe(subscriber);
            eventBus?.unSubscribe(verificationSubscriber);
            eventBus?.unSubscribe(parentReadySubscriber);
            eventBus?.unSubscribe(changeValuesSubscriber)
        }
    }, [eventBus, id, label, name, required, requiredIndicatorRenderer, rules, value])

    if (hidden) {
        return null;
    }
    return (
        <div
            data-form-item
            className={cx.call(undefined, rowStyle, className)}
            {...restProps}
        >
            {renderLabelElement()}
            {renderEditorElement()}
            {renderStatusElement()}
            <span
                id={messageId}
                className={srOnlyStyle}
                role={isInvalid ? "alert" : undefined}
            >
                {validateMessage}
            </span>
        </div>
    )
}

export type FormItem = FormItemProps;

export default FormItemComponent;
