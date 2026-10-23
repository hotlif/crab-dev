import { cloneElement, useState, useEffect, useId, useRef } from "react";
import type { ReactElement, HTMLAttributes, ReactNode } from "react";
import { css, cx } from "@crab-dev/css";
import semanticToken from "@crab-dev/rc-token-semantic";
import { CircleAlert, TriangleAlert, CircleCheck } from "lucide-react";
import { SpinIndicator, TokenVars as spinVars } from '@crab-dev/rc-spin';

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

interface FormItemBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

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

export type FormItemProps = FormItemBaseProps & (
    | {
        /** 由 Item 显示外部标签，兼容横排布局与任意编辑器。 */
        labelPlacement?: 'external';
        label?: ReactNode;
        supportingText?: never;
    }
    | {
        /** 将标签与校验说明交给支持 label/errorText 的字段组件。 */
        labelPlacement: 'control';
        label: string;
        /** 字段下方的辅助说明，校验消息会临时替换它。 */
        supportingText?: string;
    }
);

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
    grid-row: 1;
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
    order: ${semanticToken.field.required.order};
    line-height: 1;
`;

// 编辑器占据第 2 列（1fr）；min-width: 0 允许在窄容器内正常收缩
const editorWrapStyle = css`
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
`;

// 将表单轨道贯通到自带标签的字段；L2 决定浮动标签或同排标签布局。
const controlEditorWrapStyle = css`
    grid-column: 1 / -1;
    min-width: 0;
    display: grid;
    grid-template-columns: subgrid;
    && > [data-field-root][data-labeled="true"]:not([data-bordered="false"]) {
        grid-column: 1 / -1;
        grid-template-columns: ${semanticToken.form.field.columns};
        column-gap: ${token.item.gap};
    }
    && > [data-field-root][data-labeled="true"]:not([data-bordered="false"]) > label {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        max-width: 100%;
    }
    && > [data-field-root][data-labeled="true"]:not([data-bordered="false"]) > :is([data-field-control], [data-control]) {
        grid-column: ${semanticToken.form.field['control-column']};
        grid-row: 1;
    }
    && > [data-field-root][data-labeled="true"]:not([data-bordered="false"]) > :is([data-field-support], [data-support]) {
        grid-column: ${semanticToken.form.field['control-column']};
        grid-row: 2;
    }
`;

// 状态槽：固定尺寸，无论有无校验结果都占位，从根本上杜绝图标出现 / 消失引发的布局抖动
const statusSlotStyle = css`
    grid-column: 3;
    grid-row: 1;
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
// 校验文案在字段下方显示；状态图标不增加额外的交互目标。
const validatingStyle = css`
    color: ${token.status.validating.color};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

const validationMessageStyle = css`
    grid-column: 2 / -1;
    grid-row: 2;
    min-width: 0;
    padding-inline: ${token.message['padding-inline']};
    margin-block-start: ${token.message.gap};
    font-size: ${token.message['font-size']};
    line-height: ${token.message['line-height']};
    white-space: pre-line;
    overflow-wrap: anywhere;
`;

function FormItemComponent({
    className,
    hidden,
    label,
    labelPlacement = 'external',
    supportingText,
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
    // 可变实例状态：忽略编辑、重置或卸载前发起的异步校验结果。
    const validationVersion = useRef(0);
    useEffect(() => () => { validationVersion.current += 1; }, []);

    const isInvalid = validateState === ValidateState.ERROR || validateState === ValidateState.WARNING;
    // 精简状态映射，透传给编辑器驱动其边框等即时反馈
    const editorStatus: "error" | "warning" | undefined =
        validateState === ValidateState.ERROR ? "error"
            : validateState === ValidateState.WARNING ? "warning"
                : undefined;
    const controlLabel = labelPlacement === 'control' && typeof label === 'string' ? label : undefined;
    const editorClassName = labelPlacement === 'control' ? controlEditorWrapStyle : editorWrapStyle;

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
        if (labelPlacement === 'control' || label == null) {
            return null;
        }
        const renderedLabel = requiredIndicatorRenderer ? requiredIndicatorRenderer({
            label,
            required: required === true
        }) : (
            <>
                <span>{label}</span>
                {renderRequiredElement()}
            </>
        );
        return (
            <label htmlFor={typeof children === 'function' ? id : children?.props.id ?? id} className={labelStyle}>
                {renderedLabel}
            </label>
        );
    };

    // 错误和警告说明持续显示在字段下方，末尾图标仅提供额外的非颜色提示。
    const renderStatusElement = () => {
        // control 模式由编辑器显示错误/警告，不重复渲染外部状态槽。
        if (labelPlacement === 'control') return null;
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
                <span className={cx.call(undefined, statusSlotStyle, colorStyle)} aria-hidden>
                    <Icon />
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
            eventBus?.dispatch({ type: MessageEnum.ON_ITEM_VALUE_CHANGE, payload: [{ name, value: newValue }] });
        };
        const field: FormItemEditor = {
            id: props.id ?? id,
            value,
            validateState,
            status: editorStatus,
            'aria-invalid': validateState === ValidateState.ERROR || undefined,
            'aria-describedby': [props['aria-describedby'], isInvalid && labelPlacement !== 'control' ? messageId : undefined].filter(Boolean).join(' ') || undefined,
            onChange: changeValue,
            ...(labelPlacement === 'control' ? {
                label: props.label ?? controlLabel,
                required: required ?? props.required,
                errorText: validateState === ValidateState.ERROR ? validateMessage : props.errorText,
                supportingText: validateState === ValidateState.WARNING ? validateMessage : props.supportingText ?? supportingText,
                'aria-busy': validateState === ValidateState.VALIDATING || undefined,
            } : {}),
        };
        if (typeof children === 'function') return <div className={editorClassName}>{children(field)}</div>;
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
            <div className={editorClassName}>
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
            data-label-placement={labelPlacement}
            className={cx.call(undefined, rowStyle, className)}
            {...restProps}
        >
            {renderLabelElement()}
            {renderEditorElement()}
            {renderStatusElement()}
            {labelPlacement !== 'control' && isInvalid && <span
                id={messageId}
                data-form-message=""
                className={cx(validationMessageStyle, validateState === ValidateState.ERROR ? errorColorStyle : warningColorStyle)}
                role="alert"
            >
                {validateMessage}
            </span>}
        </div>
    )
}

export type FormItem = FormItemProps;

export default FormItemComponent;
