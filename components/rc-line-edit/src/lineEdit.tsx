import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { Eye, EyeOff, X } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";

import token from "./token.js";


export interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 可见的浮动标签，与输入框自动关联。 */
    label?: string;
    /** 输入框下方的辅助说明，自动加入 aria-describedby。 */
    supportingText?: string;
    /** 错误说明；提供时自动启用 error 状态并替换辅助说明。 */
    errorText?: string;
    /**
     * input 元素的 ref
     */
    ref?: Ref<HTMLInputElement>;

    /**
     * 容器 div 的 ref
     */
    containerRef?: Ref<HTMLDivElement>;

    /**
     * 设置单行文本输入框的大小，默认为 middle
     */
    size?: "large" | "middle" | "small"

    /**
     * 前缀图标
     */
    prefix?: ReactNode

    /**
     * 后缀图标
     */
    suffix?: ReactNode

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    status?: "error" | "warning"

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。
     * 设为 false 时容器变为无样式（透明、无边框、高度随内容自适应），
     * 用于嵌入到已有边框的宿主容器中（例如作为另一个组件内部的搜索框）
     */
    bordered?: boolean

    /**
     * 是否允许一键清除内容（仅受控模式生效）
     */
    allowClear?: boolean

    /**
     * 点击清除按钮时的回调
     */
    onClear?: () => void

    /**
     * 是否显示字符计数，配合 maxLength 使用
     */
    showCount?: boolean
}


// --- 容器样式 ---

const containerBaseStyle = css`
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    border-radius: ${token.root['border-radius']};
    border-width: ${token.root['border-width']};
    border-style: ${token.root['border-style']};
    border-color: ${token.root['border-color']};
    background-color: ${token.root['background-color']};
    color: ${token.text.color};
    box-shadow: ${token.root['box-shadow']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    outline: none;
    box-sizing: border-box;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.root['border-color-hover']};
    }
    &:focus-within {
        border-color: ${token.root['border-color-focus']};
        box-shadow: ${token.root['box-shadow-focus-within']};
    }
    &:has(input:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.root['opacity-disabled']};
    }
    @media (pointer: coarse) {
        && { padding-block: 0; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(input:focus-visible) { outline-color: Highlight; }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`

// 按尺寸预生成容器高度/内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        min-height: ${token.size.large.height};
        padding: ${token.size.large.padding};
    `,
    middle: css`
        min-height: ${token.size.middle.height};
        padding: ${token.size.middle.padding};
    `,
    small: css`
        min-height: ${token.size.small.height};
        padding: ${token.size.small.padding};
    `,
} as const;

// 按尺寸预生成字体样式，共享给 input 和图标
const sizeTextStyles = {
    large: css`
        font-size: ${token.size.large['font-size']};
        line-height: ${token.size.large['line-height']};
    `,
    middle: css`
        font-size: ${token.size.middle['font-size']};
        line-height: ${token.size.middle['line-height']};
    `,
    small: css`
        font-size: ${token.size.small['font-size']};
        line-height: ${token.size.small['line-height']};
    `,
} as const;

// 验证状态样式：覆盖 hover/focus 时的边框颜色和焦点光环颜色，保持视觉一致性
const errorStyle = css`
    border-color: ${token.status['border-color-error']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-error']};
    }
    &:focus-within {
        border-color: ${token.status['border-color-error']};
        box-shadow: ${token.status['box-shadow-error']};
    }
`

const warningStyle = css`
    border-color: ${token.status.warning['border-color']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status.warning['border-color']};
    }
    &:focus-within {
        border-color: ${token.status.warning['border-color']};
        box-shadow: ${token.status.warning['box-shadow-focus-within']};
    }
`

// bordered=false：容器无边框/背景/阴影，高度随内容自适应，交由宿主容器提供外观。
// 与 sizeContainerStyles/errorStyle/warningStyle 互斥选用（而非叠加覆盖），
// 避免依赖 Crab CSS 抽取后的规则顺序来决定优先级
const borderlessStyle = css`
    border-width: 0;
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    height: auto;
    padding: 0;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: transparent;
    }
    &:focus-within {
        border-color: transparent;
        box-shadow: none;
    }
`


// --- 输入框样式 ---

const inputBaseStyle = css`
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: unset;
    border-radius: inherit;
    outline: none;
    background-color: transparent;
    color: inherit;
    font-family: inherit;
    &::placeholder {
        font-size: inherit;
        color: ${token.placeholder.color};
    }
    &:disabled {
        cursor: not-allowed;
    }
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }
`

// bordered=false：字号/行高交由宿主容器继承，而非固定为某个 size 预设。
// 与 sizeTextStyles 互斥选用（而非叠加覆盖），理由同 borderlessStyle
const borderlessInputStyle = css`
    font-size: inherit;
    line-height: inherit;
`


// --- 图标与操作区样式 ---

const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${token.icon.color};
    & > svg {
        width: 1em;
        height: 1em;
    }
`

const prefixStyle = css`
    margin-right: ${token.icon.gap};
`

const suffixStyle = css`
    margin-left: ${token.icon.gap};
`

// 复用 Button 的键盘、禁用、焦点与媒体偏好行为；L3 仅负责输入框内部布局。
const actionButtonStyle = css`
    flex-shrink: 0;
    margin-left: ${token.icon.gap};
    && {
        padding: 0;
        min-width: ${token.action['min-width']};
        height: ${token.action.height};
        color: ${token.icon.color};
    }
    &&[aria-disabled="true"] { opacity: ${token.action['opacity-disabled']}; }
    @media (pointer: coarse) {
        && { min-width: ${token.action.touch['min-width']}; height: ${token.action.touch.height}; }
    }
`

// 字符计数
const countStyle = css`
    flex-shrink: 0;
    margin-left: ${token.icon.gap};
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`

const fieldStyle = css`
    display: inline-grid;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    gap: ${token.field.gap};
`;

const materialStyle = css`
    position: relative;
    cursor: text;
    &:has(button) { padding-block: 0; }
    &[data-labeled="true"] { padding-inline: ${token.field['padding-inline']}; }
    & > label {
        position: absolute;
        inset-inline-start: ${token.field['padding-inline']};
        top: 50%;
        transform: translateY(-50%);
        max-width: calc(100% - ${token.field.prefix.left});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: text;
        color: ${token.field.label['color']};
        font-size: ${token.size.middle['font-size']};
        line-height: ${token.field.label['line-height']};
        transition: ${token.field.transition};
    }
    &[data-prefix="true"] > label { inset-inline-start: ${token.field.prefix.left}; }
    &[data-labeled="true"]:not(:focus-within) input:placeholder-shown::placeholder { color: transparent; }
    &:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        top: 0;
        font-size: ${token.field.label['font-size']};
        padding-inline: ${token.field.label['padding-inline']};
        background: ${token.root['background-color']};
    }
    &:focus-within > label { color: ${token.field.label['color-focus']}; }
    &[data-appearance="filled"] {
        border-radius: ${token.root['border-radius']} ${token.root['border-radius']} 0 0;
        border-color: transparent;
        border-bottom-color: ${token.field.indicator['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &[data-appearance="filled"]:hover:not([aria-disabled="true"]):not(:focus-within) {
        background: ${token.field.filled['background-color-hover']};
        border-color: transparent;
        border-bottom-color: ${token.text.color};
    }
    &[data-appearance="filled"]:focus-within {
        border-color: transparent;
        border-bottom-color: ${token.root['border-color-focus']};
        box-shadow: inset 0 -1px 0 ${token.root['border-color-focus']};
    }
    &[data-appearance="filled"][data-labeled="true"] input { padding-top: ${token.field.input['padding-top']}; }
    &[data-appearance="filled"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        top: ${token.field.label['top']};
        transform: none;
        padding: 0;
        background: transparent;
    }
    &[data-status="error"] > label { color: ${token.field['color-error']}; }
    &[data-status="warning"] > label { color: ${token.field['color-warning']}; }
    &&[data-appearance="filled"][data-status="error"] {
        border-color: transparent;
        border-bottom-color: ${token.status['border-color-error']};
        &:focus-within { box-shadow: inset 0 -1px 0 ${token.status['border-color-error']}; }
    }
    &&[data-appearance="filled"][data-status="warning"] {
        border-color: transparent;
        border-bottom-color: ${token.status.warning['border-color']};
        &:focus-within { box-shadow: inset 0 -1px 0 ${token.status.warning['border-color']}; }
    }
    @media (prefers-reduced-motion: reduce) { & > label { transition: none; } }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; }
        & > label { color: CanvasText; }
        &:focus-within > label { color: Highlight; }
        &[aria-disabled="true"] > label { color: GrayText; }
    }
`;

const supportingStyle = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${token.icon.gap};
    padding-inline: ${token.field['padding-inline']};
    color: ${token.field.label['color']};
    font-size: ${token.field.label['font-size']};
    line-height: ${token.field.support['line-height']};
    overflow-wrap: anywhere;
    & > span:first-child { min-width: 0; }
    &[data-status="error"] { color: ${token.field['color-error']}; }
    &[data-status="warning"] { color: ${token.field['color-warning']}; }
    @media (forced-colors: active) { color: CanvasText; }
`;


function LineEdit({
    ref,
    id,
    size = "middle",
    prefix,
    suffix,
    type,
    value,
    containerRef,
    className,
    style,
    readOnly,
    disabled,
    maxLength,
    status,
    allowClear,
    onClear,
    showCount,
    bordered = true,
    appearance = "outlined",
    label,
    supportingText,
    errorText,
    placeholder,
    ...rest
}: LineEditProps) {
    // 密码可见性：内部 UI 状态，与业务无关
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasValue = typeof value === "string" && value.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const fieldStatus = errorText ? "error" : status;
    const enhancedField = Boolean(label || supportingText || errorText);
    const description = errorText || supportingText;
    const descriptionId = `${generatedId}-description`;
    const countId = `${generatedId}-count`;
    const count = showCount && typeof value === "string" ? (
        <span id={countId} className={countStyle}>{value.length}{maxLength != null ? `/${maxLength}` : ""}</span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
            data-prefix={Boolean(prefix)}
            data-status={fieldStatus}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && fieldStatus === "error" && errorStyle,
                bordered && fieldStatus === "warning" && warningStyle,
                bordered && materialStyle,
                className
            )}
        >
            {prefix && (
                <div className={cx(iconBaseStyle, prefixStyle, sizeTextStyles[size])}>
                    {prefix}
                </div>
            )}
            <input
                ref={ref}
                id={inputId}
                type={inputType}
                value={value}
                maxLength={maxLength}
                placeholder={placeholder ?? (label ? " " : undefined)}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(inputBaseStyle, bordered ? sizeTextStyles[size] : borderlessInputStyle)}
                {...rest}
                aria-invalid={rest['aria-invalid'] ?? (fieldStatus === "error" || undefined)}
                aria-describedby={[rest['aria-describedby'], description ? descriptionId : undefined, count ? countId : undefined].filter(Boolean).join(" ") || undefined}
            />
            {label && bordered && <label htmlFor={inputId}>{label}{rest.required ? " *" : ""}</label>}
            {showClearButton && (
                <Button
                    type="button"
                    appearance="text"
                    size="small"
                    aria-label="清除"
                    aria-controls={inputId}
                    icon={<X aria-hidden="true" />}
                    className={actionButtonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        // 清除可能立即卸载按钮，先把焦点送回被操作的输入框。
                        e.currentTarget.parentElement?.querySelector('input')?.focus();
                        onClear?.();
                    }}
                />
            )}
            {suffix && (
                <div className={cx(iconBaseStyle, suffixStyle, sizeTextStyles[size])}>
                    {suffix}
                </div>
            )}
            {isPassword && (
                <Button
                    type="button"
                    appearance="text"
                    size="small"
                    disabled={disabled}
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    aria-controls={inputId}
                    icon={showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    className={actionButtonStyle}
                    onClick={() => setShowPassword(prev => !prev)}
                />
            )}
            {!enhancedField && count}
        </div>
    );
    return enhancedField ? <div className={fieldStyle}>
        {label && !bordered && <label htmlFor={inputId}>{label}{rest.required ? " *" : ""}</label>}
        {control}
        {(description || count) && <div className={supportingStyle} data-status={fieldStatus}>
            <span id={descriptionId} aria-live="polite">{description}</span>
            {count}
        </div>}
    </div> : control;
}

export default LineEdit;
