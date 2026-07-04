import {
    type ReactElement,
    type HTMLAttributes,
    type ReactNode,
    cloneElement,
    useState,
    useEffect,
    useId
} from "react";
import { css, cx } from "@linaria/core";
import { CircleAlert, TriangleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import Tooltip from "@crab-dev/rc-tooltip";

import token from "./token.js";
import { type FormItemEditor, type NamePath, type Rule, RuleType, ValidateState } from "./types.js";
import useFormContext from "./hooks/useFormContext.js";
import { MessageEnum } from "./bus.js";
import {
    getRecordValue,
    equalsNamePath
} from "./util.js";

export interface FormItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

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
    children?: ReactElement<FormItemEditor>
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
    width: ${token.status.size};
    height: ${token.status.size};

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
    color: ${token.status.error.color};
`;

const warningColorStyle = css`
    color: ${token.status.warning.color};
`;

const successColorStyle = css`
    color: ${token.status.success.color};
`;

// 校验中：图标持续旋转。@keyframes 内嵌于 css 块，命名唯一以避免全局冲突。
const validatingStyle = css`
    color: ${token.status.validating.color};

    @keyframes rc-form-status-spin {
        to {
            transform: rotate(360deg);
        }
    }

    & svg {
        animation: rc-form-status-spin 0.8s linear infinite;
    }
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
    rules = [],
    children,
    ...restProps
}: FormItemProps) {
    const id = useId();
    const messageId = `${id}-message`;
    const {
        eventBus,
        requiredIndicatorRenderer
    } = useFormContext();

    // 实际上存储的值
    const [value, setValue] = useState<unknown>();
    // 校验状态
    const [validateState, setValidateState] = useState<ValidateState>(ValidateState.DEFAULT);
    // 校验消息
    const [validateMessage, setValidateMessage] = useState<string>("");
    // Tooltip 显隐：受控。点击图标切换；Tooltip 内部 hover / focus / 外部点击也会回写此状态。
    const [messageOpen, setMessageOpen] = useState(false);

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
            <label htmlFor={id} className={labelStyle}>
                {renderedLabel}
            </label>
        );
    };

    // 渲染末尾状态图标：default 空占位（保持槽位尺寸）/ validating 转圈 / success 对勾 /
    // error / warning 为可点击图标，点击（或 hover / focus）唤起 Tooltip 展示对应消息。
    const renderStatusElement = () => {
        if (validateState === ValidateState.VALIDATING) {
            return (
                <span className={cx(statusSlotStyle, validatingStyle)} aria-hidden>
                    <LoaderCircle />
                </span>
            );
        }
        if (validateState === ValidateState.SUCCESS) {
            return (
                <span className={cx(statusSlotStyle, successColorStyle)} aria-hidden>
                    <CircleCheck />
                </span>
            );
        }
        if (isInvalid) {
            const Icon = validateState === ValidateState.ERROR ? CircleAlert : TriangleAlert;
            const colorStyle = validateState === ValidateState.ERROR ? errorColorStyle : warningColorStyle;
            return (
                <span className={cx(statusSlotStyle, colorStyle)}>
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
        const props = children.props;
        return (
            <div className={editorWrapStyle}>
                {cloneElement(children, {
                    ...props,
                    value,
                    validateState,
                    status: editorStatus,
                    onChange: (newValue: unknown) => {
                        setValue(newValue);
                        // 用户开始编辑：清除上一轮校验结果与提示浮层，避免残留状态误导
                        setValidateState(ValidateState.DEFAULT);
                        setValidateMessage("");
                        setMessageOpen(false);
                        eventBus?.dispatch({
                            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
                            payload: [{
                                name,
                                value: newValue
                            }]
                        });
                    },
                })}
            </div>
        );
    };

    useEffect(() => {
        const onSendToChangeItemValue = (param: {
            name: NamePath,
            value: unknown
        }) => {
            if (equalsNamePath(param.name, name)) {
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
        const onTriggerItemVerification = async (fields: NamePath[]) => {
            if (fields != null && !fields.some(field => equalsNamePath(field, name))) {
                return;
            }
            setValidateState(ValidateState.VALIDATING);
            if (required === true && (value == null || value === "")) {
                const message = `请输入${label?.toString() ?? ""}`;
                setValidateState(ValidateState.ERROR);
                setValidateMessage(message);
                throw new Error(message);
            }
            for (let i = 0; i < rules.length; i += 1) {
                const rule = rules[i];
                if (rule.type == RuleType.ERROR || rule.type == RuleType.WARNING) {
                    try {
                        await rule.validator()
                    } catch (error: unknown) {
                        const err = error as Error;
                        if (rule.type == RuleType.ERROR) {
                            setValidateState(ValidateState.ERROR);
                        } else {
                            setValidateState(ValidateState.WARNING);
                        }
                        setValidateMessage(err.message);
                        throw error;
                    }
                }
            }
            setValidateMessage("");
            setValidateState(ValidateState.SUCCESS);
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
            const newValue = getRecordValue(values, name);
            setValue(newValue);
        }

        const changeValuesSubscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_VALUES,
            ring: onChangeValues
        }
        eventBus?.subscribe(changeValuesSubscriber)

        return () => {
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
            className={cx(rowStyle, className)}
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
