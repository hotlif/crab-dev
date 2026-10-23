import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { Eye, EyeOff, X } from "lucide-react";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";

import semanticToken from "@crab-dev/rc-token-semantic";

import token, { vars } from "./token.js";


export interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 与输入框关联的可见标签；Material 浮动，macOS 与 shadcn 上置。 */
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
     * 是否允许一键清除内容；触发 onChange，受控模式由父组件接受新值
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
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.root['opacity-disabled']};
    }
    @media (pointer: coarse) {
        && { padding-block: 0; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(input:focus-visible) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`

// 按尺寸预生成容器高度/内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        min-height: max(${token.size.large.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.large.height};
        ${vars['action.min-width']}: ${token.size.large.action.width};
        ${vars['action.height']}: ${token.size.large.action.width};
        padding: ${token.size.large.padding};
    `,
    middle: css`
        min-height: max(${token.size.middle.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.middle.height};
        ${vars['action.min-width']}: ${token.size.middle.action.width};
        ${vars['action.height']}: ${token.size.middle.action.width};
        padding: ${token.size.middle.padding};
    `,
    small: css`
        min-height: max(${token.size.small.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.small.height};
        ${vars['action.min-width']}: ${token.size.small.action.width};
        ${vars['action.height']}: ${token.size.small.action.width};
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

// M3 用同一条轮廓的颜色与粗细表达焦点，验证状态不额外叠加外发光。
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
    // 无边框模式没有自身的轮廓或底线，保留独立的键盘焦点提示。
    &:has(input:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
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
        width: ${token.field.icon.width};
        height: ${token.field.icon.height};
    }
`

const prefixStyle = css`
    margin-inline-end: ${token.icon.gap};
`

const suffixStyle = css`
    margin-inline-start: ${token.icon.gap};
`

// 复用 Button 的键盘、禁用、焦点与媒体偏好行为；L3 仅负责输入框内部布局。
const actionButtonStyle = css`
    flex-shrink: 0;
    margin-inline-start: ${token.icon.gap};
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
    margin-inline-start: ${token.icon.gap};
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`

// The hidden notch must reserve the same required-marker spacing as the label.
const legendRequiredStyle = css`
    margin-inline-start: ${token.field.required.gap};
`;


const fieldStyle = css`
    position: relative;
    display: inline-grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    min-width: 0;
    max-width: 100%;
    row-gap: ${token.field.layout['row-gap']};
    & > label {
        display: inline-flex;
        align-items: center;
        gap: ${token.field.required.gap};
        & > [data-field-label-text] {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        & > [data-required-marker] {
            flex-shrink: 0;
            order: ${semanticToken.field.required.order};
            color: ${token.field.required.color};
        }
    }
    &[data-labeled="true"] > [data-field-support] { grid-column: 1; grid-row: ${semanticToken.field.layout['support-row']}; }
    &[data-labeled="true"] > [data-field-control] {
        grid-column: 1;
        grid-row: ${semanticToken.field.layout['control-row']};
        min-height: max(${token.field.control['min-height']}, ${token.field.control.height});
        padding-inline: ${token.field.control['padding-inline']};
        padding-block: 0;
        column-gap: ${token.field.control['column-gap']};
        &[data-prefix="true"] { padding-inline-start: ${token.field.control['padding-inline-start']}; }
        &[data-suffix="true"] { padding-inline-end: ${token.field.control['padding-inline-end']}; }
        & > [data-field-prefix], & > [data-field-suffix] {
            min-width: ${token.field.icon.width};
            margin: 0;
            justify-content: center;
        }
        & > button { margin: 0; }
        & > [data-field-prefix] svg, & > [data-field-suffix] svg, & > button svg {
            width: ${token.field.icon.width};
            height: ${token.field.icon.height};
        }
    }
    &[data-labeled="true"] input {
        font-size: ${token.field.input['font-size']};
        line-height: ${token.field.input['line-height']};
    }
    &[data-labeled="true"] > label {
        grid-column: 1;
        grid-row: ${semanticToken.field.layout['label-row']};
        z-index: 1;
        align-self: ${semanticToken.field.label.align};
        justify-self: start;
        margin-inline: ${semanticToken.field.label['margin-inline']};
        max-width: calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: text;
        color: ${token.field.label.color};
        font-size: ${token.field.label['font-size']};
        line-height: ${token.field.label['line-height']};
        transition: ${token.field.transition};
    }
    &[data-labeled="true"][data-prefix="true"] > label {
        margin-inline-start: ${semanticToken.field.label['prefix-margin-inline']};
    }
    &[data-labeled="true"]:not(:focus-within) input:placeholder-shown::placeholder {
        color: ${token.field.placeholder.color};
    }
    &[data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        align-self: ${semanticToken.field.label.floating.align};
        margin-inline-start: ${semanticToken.field.label.floating['margin-inline']};
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
        transform: ${token.field.label.floating.transform};
    }
    &:focus-within > label { color: ${token.field.label['color-focus']}; }
    &[data-labeled="true"][data-appearance="filled"] input {
        padding-top: ${token.field.input.filled['padding-top']};
    }
    &[data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        margin-block-start: ${token.field.label.filled['margin-top']};
        transform: none;
    }
    &[data-labeled="true"][data-appearance="filled"][data-prefix="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        margin-inline-start: ${semanticToken.field.label['prefix-margin-inline']};
    }
    &[data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) legend {
        max-width: calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']});
        padding-inline: ${token.field.outline.legend.padding};
    }
    &[data-status="error"] > label { color: ${token.field['color-error']}; }
    &[data-status="warning"] > label { color: ${token.field['color-warning']}; }
    &[data-disabled="true"] > label { cursor: not-allowed; color: ${token.field['color-disabled']}; }
    &&[data-disabled="true"] > label > [data-required-marker] { color: inherit; }
    &[data-disabled="true"] > [data-field-support] { color: ${token.field['color-disabled']}; }
    @media (prefers-reduced-motion: reduce) { & > label { transition: none; } }
    @media (forced-colors: active) {
        & > label { color: CanvasText; }
        &:focus-within > label { color: Highlight; background: Canvas; }
        &[data-disabled="true"] > label { color: GrayText; }
        && > label > [data-required-marker] { color: inherit; }
    }
`;

// The semantic layout contract chooses floating Material or static shadcn labels.
const labeledControlStyle = css`
    position: relative;
    &[data-appearance="outlined"] {
        border-color: ${token.field.outlined['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-hover']}; }
        &:focus-within { border-color: ${token.field.outlined['border-color-focus']}; box-shadow: ${token.field.outlined['box-shadow-focus']}; }
    }
    &&[data-appearance="outlined"][data-status="error"] {
        border-color: ${token.field.outlined['border-color-error']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-error']}; }
    }
    &&[data-appearance="outlined"][data-status="warning"] {
        border-color: ${token.field.outlined['border-color-warning']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-warning']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-warning']}; }
    }
    & > fieldset {
        display: ${semanticToken.field.outline.display};
        position: absolute;
        inset: calc(0px - ${token.field.outline.legend.height} / 2) 0 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        border: ${token.root['border-width']} solid ${token.root['border-color']};
        border-radius: inherit;
        pointer-events: none;
    }
    & > fieldset > legend {
        visibility: hidden;
        overflow: hidden;
        max-width: 0;
        height: ${token.field.outline.legend.height};
        margin-inline-start: ${token.field.outline.legend.margin};
        padding: 0;
        color: transparent;
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.outline.legend['line-height']};
        white-space: nowrap;
    }
    &:hover:not(:focus-within):not([aria-disabled="true"]) > fieldset { border-color: ${token.root['border-color-hover']}; }
    &:focus-within > fieldset { border-color: ${token.root['border-color-focus']}; border-width: ${token.field.outline['border-width-focus']}; }
    &&[data-status="error"] > fieldset { border-color: ${token.status['border-color-error']}; }
    &&[data-status="warning"] > fieldset { border-color: ${token.status.warning['border-color']}; }
    &&[data-status="error"]:hover:not([aria-disabled="true"]) > fieldset { border-color: ${token.status['border-color-error']}; }
    &&[data-status="warning"]:hover:not([aria-disabled="true"]) > fieldset { border-color: ${token.status.warning['border-color']}; }
    &[data-appearance="filled"] > fieldset { display: none; }
    &&[aria-disabled="true"] {
        opacity: 1;
        color: ${token.field['color-disabled']};
        border-color: ${token.field['border-color-disabled']};
        box-shadow: none;
        & > fieldset { border-color: ${token.field['border-color-disabled']}; }
        & input::placeholder { color: ${token.field['color-disabled']}; }
        & > div, & button { color: ${token.field['color-disabled']}; }
    }
    &&[data-appearance="outlined"][aria-disabled="true"]:has(fieldset) { border-color: ${token.field.outlined['border-color']}; }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        & > fieldset { display: none; }
        &&[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`;

const filledControlStyle = css`
    && {
        border-radius: ${token.field.filled['border-radius']};
        border-width: ${token.field.filled['border-width']};
        border-color: ${token.field.filled['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &&:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.field.filled['border-color-hover']};
        background: ${token.field.filled['background-color-hover']};
    }
    &&:focus-within {
        border-color: ${token.field.filled['border-color-focus']};
        box-shadow: ${token.field.filled['box-shadow-focus']};
    }
    &&[data-status="error"] {
        border-color: ${token.status['border-color-error']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.status['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-error']}; }
    }
    &&[data-status="warning"] {
        border-color: ${token.status.warning['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.status.warning['border-color']}; }
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-warning']}; }
    }
    &&&[aria-disabled="true"] {
        opacity: 1;
        color: ${token.field['color-disabled']};
        border-color: ${token.field.filled['border-color-disabled']};
        background: ${token.field.filled['background-color-disabled']};
        box-shadow: none;
        & > div, & button { color: ${token.field['color-disabled']}; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; box-shadow: none; }
        &&&[aria-disabled="true"] { border-color: GrayText; background: Canvas; color: GrayText; }
    }
`;

const supportingStyle = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${token.icon.gap};
    padding-inline: ${token.field.support['padding-inline']};
    color: ${token.field.label['color']};
    font-size: ${token.field.support['font-size']};
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
    size: sizeProp,
    prefix,
    suffix,
    type,
    value,
    defaultValue,
    onChange,
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
    const size = useComponentSize(sizeProp);
    // 密码可见性：内部 UI 状态，与业务无关
    const [showPassword, setShowPassword] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
    const displayValue = value ?? uncontrolledValue;
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasValue = typeof displayValue === "string" && displayValue.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const fieldStatus = errorText ? "error" : status;
    const enhancedField = Boolean(label || supportingText || errorText);
    const description = errorText || supportingText;
    const descriptionId = `${generatedId}-description`;
    const countId = `${generatedId}-count`;
    const count = showCount && typeof displayValue === "string" ? (
        <span id={countId} className={countStyle} aria-label={`字符计数：${displayValue.length}${maxLength != null ? `，最多 ${maxLength}` : ""}`}>{displayValue.length}{maxLength != null ? `/${maxLength}` : ""}</span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            data-field-control=""
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
            data-prefix={Boolean(prefix)}
            data-suffix={Boolean(suffix || isPassword || showClearButton)}
            data-status={fieldStatus}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && fieldStatus === "error" && errorStyle,
                bordered && fieldStatus === "warning" && warningStyle,
                bordered && label && labeledControlStyle,
                bordered && appearance === "filled" && filledControlStyle,
                className
            )}
        >
            {label && bordered && appearance === "outlined" && <fieldset aria-hidden="true"><legend>{label}{rest.required && <span className={legendRequiredStyle}>*</span>}</legend></fieldset>}
            {prefix && (
                <div data-field-prefix="" className={cx(iconBaseStyle, prefixStyle, sizeTextStyles[size])}>
                    {prefix}
                </div>
            )}
            <input
                ref={ref}
                id={inputId}
                type={inputType}
                value={value}
                defaultValue={defaultValue}
                onChange={(event) => {
                    setUncontrolledValue(event.currentTarget.value);
                    onChange?.(event);
                }}
                maxLength={maxLength}
                placeholder={placeholder ?? (label ? " " : undefined)}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(inputBaseStyle, bordered ? sizeTextStyles[size] : borderlessInputStyle)}
                {...rest}
                aria-invalid={rest['aria-invalid'] ?? (fieldStatus === "error" || undefined)}
                aria-describedby={[rest['aria-describedby'], description ? descriptionId : undefined, count ? countId : undefined].filter(Boolean).join(" ") || undefined}
            />
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
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) {
                            input.focus();
                            // 原生 setter 触发 React 的 change 流程，保留受控值恢复语义。
                            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, '');
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        onClear?.();
                    }}
                />
            )}
            {suffix && (
                <div data-field-suffix="" className={cx(iconBaseStyle, suffixStyle, sizeTextStyles[size])}>
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
    return enhancedField ? <div data-field-root="" className={fieldStyle} data-labeled={Boolean(label && bordered)} data-appearance={appearance} data-status={fieldStatus} data-disabled={disabled || undefined} data-prefix={Boolean(prefix)}>
        {label && <label htmlFor={inputId}><span data-field-label-text="">{label}</span>{rest.required && <span data-required-marker="" aria-hidden="true">*</span>}</label>}
        {control}
        {(description || count) && <div className={supportingStyle} data-field-support="" data-status={fieldStatus}>
            <span id={descriptionId} role={errorText ? "alert" : undefined} aria-live={errorText ? undefined : "polite"}>{description}</span>
            {count}
        </div>}
    </div> : control;
}

export default LineEdit;
