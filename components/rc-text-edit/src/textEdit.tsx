import { useComponentSize } from '@crab-dev/rc-config-provider';
import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import semanticToken from "@crab-dev/rc-token-semantic";
import { X } from "lucide-react";
import { useId, useState, type Ref, type TextareaHTMLAttributes } from "react";

import token, { vars } from "./token.js";


export interface TextEditProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "ref"> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 可见标签；Material 使用浮动标签，shadcn 使用上方标签。 */
    label?: string;
    /** 文本域下方的辅助说明，自动加入 aria-describedby。 */
    supportingText?: string;
    /** 错误说明；提供时自动启用 error 状态并替换辅助说明。 */
    errorText?: string;
    /**
     * textarea 元素的 ref
     */
    ref?: Ref<HTMLTextAreaElement>;

    /**
     * 容器 div 的 ref
     */
    containerRef?: Ref<HTMLDivElement>;

    /**
     * 设置多行文本输入框的大小（内边距与排版），默认为 middle；
     * 可视高度由 rows / autoSize 决定
     */
    size?: "large" | "middle" | "small"

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    status?: "error" | "warning"

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。
     * 设为 false 时容器变为无样式（透明、无边框），
     * 用于嵌入到已有边框的宿主容器中（例如作为表单项内部的备注框）
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

    /**
     * 高度随内容自动增长（CSS field-sizing: content，浏览器不支持时按 rows 回退）；
     * 开启后禁用手动拖拽调整尺寸，避免两种高度控制方式互相冲突
     */
    autoSize?: boolean

    /**
     * 手动拖拽调整尺寸的方向，默认为 vertical；autoSize 开启时忽略
     */
    resize?: "none" | "vertical" | "both"
}


// --- 容器样式 ---

const containerBaseStyle = css`
    display: inline-flex;
    flex-direction: column;
    position: relative;
    min-width: 0;
    max-width: 100%;
    width: 100%;
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
    &:has(> button) { min-height: calc(${token.clear.height} + 2 * ${token.clear['inset-block-start']}); }
    @media (pointer: coarse) {
        &:has(> button) { min-height: calc(${token.clear.touch.height} + 2 * ${token.clear['inset-block-start']}); }
    }
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.root['border-color-hover']};
    }
    &:focus-within {
        border-color: ${token.root['border-color-focus']};
        box-shadow: ${token.root['box-shadow-focus-within']};
    }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        color: ${token.field['color-disabled']};
        border-color: ${token.field['border-color-disabled']};
        box-shadow: none;
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(textarea:focus-visible) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`

// 按尺寸预生成容器内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        padding: ${token.size.large.padding};
        ${vars['clear.width']}: ${token.size.large.action.width};
        ${vars['clear.height']}: ${token.size.large.action.width};
    `,
    middle: css`
        padding: ${token.size.middle.padding};
        ${vars['clear.width']}: ${token.size.middle.action.width};
        ${vars['clear.height']}: ${token.size.middle.action.width};
    `,
    small: css`
        padding: ${token.size.small.padding};
        ${vars['clear.width']}: ${token.size.small.action.width};
        ${vars['clear.height']}: ${token.size.small.action.width};
    `,
} as const;

// 按尺寸预生成字体样式，共享给 textarea 和操作区
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

// 验证状态沿用同一条边界，聚焦时向内加粗。
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
    border-color: ${token.status['border-color-warning']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-warning']};
    }
    &:focus-within {
        border-color: ${token.status['border-color-warning']};
        box-shadow: ${token.status['box-shadow-warning']};
    }
`

// bordered=false：容器无边框/背景/阴影，交由宿主容器提供外观。
// 与 sizeContainerStyles/errorStyle/warningStyle 互斥选用（而非叠加覆盖），
// 避免依赖 Crab CSS 抽取后的规则顺序来决定优先级
const borderlessStyle = css`
    border-width: 0;
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: transparent;
    }
    &:focus-within {
        border-color: transparent;
        box-shadow: none;
    }
    &:has(textarea:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    @media (forced-colors: active) {
        &:has(textarea:focus-visible) { outline-color: Highlight; }
    }
`


// --- 文本域样式 ---

const textareaBaseStyle = css`
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: unset;
    border-radius: inherit;
    outline: none;
    background-color: transparent;
    color: inherit;
    caret-color: ${token.root['border-color-focus']};
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
const borderlessTextareaStyle = css`
    font-size: inherit;
    line-height: inherit;
`

// resize 方向拆为静态类，运行时用 cx() 选用（Crab CSS 零运行时约束）
const resizeStyles = {
    none: css`
        resize: none;
    `,
    vertical: css`
        resize: vertical;
    `,
    both: css`
        resize: both;
    `,
} as const;

// 高度随内容自动增长；同时禁用手动 resize，两种高度控制方式互斥（限制原则：防错于未然）。
// 不支持 field-sizing 的浏览器忽略该声明，按 rows 回退
const autoSizeStyle = css`
    field-sizing: content;
    resize: none;
`

// allowClear 开启时常驻预留清除按钮空间：按钮随值出现/消失不得引起文本回流（反馈原则：稳态布局）
const clearSpaceStyle = css`
    box-sizing: border-box;
    padding-inline-end: calc(${token.clear.width} + ${token.icon.gap});
    @media (pointer: coarse) {
        padding-inline-end: calc(${token.clear.touch.width} + ${token.icon.gap});
    }
`


// --- 操作区样式 ---

// 清除按钮绝对定位于容器右上角，与首行文本对齐
const clearButtonStyle = css`
    && {
        position: absolute;
        width: ${token.clear.width};
        height: ${token.clear.height};
        padding: 0;
        color: ${token.icon.color};
    }
    inset-block-start: ${token.clear['inset-block-start']};
    inset-inline-end: ${token.clear['inset-inline-end']};
    @media (pointer: coarse) {
        && { width: ${token.clear.touch.width}; height: ${token.clear.touch.height}; }
    }
`

// 字符计数：容器 flex column 下常驻底部右对齐；计数变化不改变行高，不引起布局跳动
const countStyle = css`
    flex-shrink: 0;
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`

const fieldStyle = css`
    display: inline-grid;
    position: relative;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    row-gap: ${token.field.layout['row-gap']};
    & > label {
        display: inline-flex;
        align-items: center;
        gap: ${token.field.required.gap};
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        color: ${token.field.label.color};
        font-size: ${token.field.label['font-size']};
        line-height: ${token.field.label['line-height']};
        cursor: text;
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
    & > [data-control] { grid-column: 1; grid-row: 2; }
    & > [data-support] { grid-column: 1; grid-row: 3; }
    &[data-labeled="false"] > [data-control] { grid-row: 1; }
    &[data-labeled="false"] > [data-support] { grid-row: 2; }
    &[data-bordered="true"][data-labeled="true"] > [data-control] {
        grid-row: ${semanticToken.field.layout['control-row']};
        min-height: ${token.field.control['min-height']};
        padding-inline: ${token.field.control['padding-inline']};
        padding-block: ${token.field.input.multiline['padding-block']};
        cursor: text;
        & > textarea { font-size: ${token.field.input['font-size']}; line-height: ${token.field.input['line-height']}; }
        & > button { inset-block-start: ${token.field.input.multiline['padding-block']}; inset-inline-end: ${token.field.control['padding-inline']}; }
    }
    &[data-bordered="true"][data-labeled="true"] > [data-support] {
        grid-row: ${semanticToken.field.layout['support-row']};
    }
    &[data-bordered="true"][data-labeled="true"] > label {
        grid-row: ${semanticToken.field.layout['label-row']};
        position: relative;
        align-self: start;
        justify-self: start;
        z-index: 2;
        top: ${token.field.label.multiline.top};
        margin-inline: ${semanticToken.field.label['margin-inline']};
        max-width: calc(100% - 2 * ${semanticToken.field.label['margin-inline']});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: ${token.field.transition};
    }
    &[data-bordered="true"][data-labeled="true"]:not(:focus-within) textarea:placeholder-shown::placeholder {
        color: ${token.field.placeholder.color};
    }
    &[data-bordered="true"][data-labeled="true"]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: 0;
        align-self: ${semanticToken.field.label.floating.align};
        margin-inline: ${semanticToken.field.label.floating['margin-inline']};
        transform: ${token.field.label.floating.transform};
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"] > [data-control] {
        border-color: ${token.field.outlined['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-hover']}; }
        &:focus-within { border-color: ${token.field.outlined['border-color-focus']}; box-shadow: ${token.field.outlined['box-shadow-focus']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"][data-status="error"]:not([aria-disabled="true"]) > [data-control] {
        border-color: ${token.field.outlined['border-color-error']};
        &:hover { border-color: ${token.field.outlined['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-error']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"][data-status="warning"]:not([aria-disabled="true"]) > [data-control] {
        border-color: ${token.field.outlined['border-color-warning']};
        &:hover { border-color: ${token.field.outlined['border-color-warning']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-warning']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"] > [data-control] {
        padding-block-start: ${token.field.input.multiline.filled['padding-top']};
        padding-block-end: ${token.field.input.multiline.filled.padding};
        & > button { inset-block-start: ${token.field.input.multiline.filled['padding-top']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: ${token.field.label.filled.top};
        transform: none;
    }
    &:focus-within:not([aria-disabled="true"]) > label { color: ${token.field.label['color-focus']}; }
    &[data-status="error"]:not([aria-disabled="true"]) > label { color: ${token.field['color-error']}; }
    &[data-status="warning"]:not([aria-disabled="true"]) > label { color: ${token.field['color-warning']}; }
    &[aria-disabled="true"] > label { color: ${token.field['color-disabled']}; cursor: not-allowed; }
    &&[aria-disabled="true"] > label > [data-required-marker] { color: inherit; }
    &[aria-disabled="true"] > [data-support] { color: ${token.field['color-disabled']}; }
    &[data-bordered="true"][data-labeled="true"][aria-disabled="true"] > [data-control] {
        border-color: ${token.field.outlined['border-color']};
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"][aria-disabled="true"] > [data-control] {
        border-color: ${token.field.filled['border-color-disabled']};
    }
    @media (prefers-reduced-motion: reduce) { & > label { transition: none; } }
    @media (forced-colors: active) {
        & > label { color: CanvasText; }
        &:focus-within > label { color: Highlight; }
        &[aria-disabled="true"] > label { color: GrayText; }
        && > label > [data-required-marker] { color: inherit; }
    }
`;

const legendRequiredStyle = css`
    margin-inline-start: ${token.field.required.gap};
`;

const outlineStyle = css`
    display: ${semanticToken.field.outline.display};
    position: absolute;
    z-index: 1;
    pointer-events: none;
    inset: calc(${token.field.label.floating['line-height']} / -2) 0 0;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: ${token.root['border-width']} solid ${token.root['border-color']};
    border-radius: inherit;
    box-sizing: border-box;
    & > legend {
        width: auto;
        max-width: 0;
        height: ${token.field.label.floating['line-height']};
        margin-inline-start: ${token.field.outline.legend.margin};
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        visibility: hidden;
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
    }
    [data-control]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > & > legend {
        max-width: calc(100% - 2 * ${token.field.control['padding-inline']});
        padding-inline: ${token.field.outline.legend.padding};
    }
    [data-control]:hover:not(:focus-within):not([aria-disabled="true"]) > & { border-color: ${token.root['border-color-hover']}; }
    [data-control]:focus-within > & { border-color: ${token.root['border-color-focus']}; border-width: ${token.field.outline['border-width-focus']}; }
    [data-control][data-status="error"]:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-error']}; }
    [data-control][data-status="warning"]:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-warning']}; }
    [data-control][data-status="error"]:hover:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-error']}; }
    [data-control][data-status="warning"]:hover:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-warning']}; }
    [data-control][aria-disabled="true"] > & { border-color: ${token.field['border-color-disabled']}; }
    @media (forced-colors: active) {
        [data-control] > & { border-color: CanvasText; }
        [data-control]:focus-within > & { border-color: Highlight; }
        [data-control][aria-disabled="true"] > & { border-color: GrayText; }
    }
`;

const appearanceStyle = css`
    &[data-appearance="filled"] {
        border-radius: ${token.field.filled['border-radius']};
        border-width: ${token.field.filled['border-width']};
        border-color: ${token.field.filled['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &[data-appearance="filled"]:hover:not([aria-disabled="true"]):not(:focus-within) {
        background: ${token.field.filled['background-color-hover']};
        border-color: ${token.field.filled['border-color-hover']};
    }
    &[data-appearance="filled"]:focus-within {
        border-color: ${token.field.filled['border-color-focus']};
        box-shadow: ${token.field.filled['box-shadow-focus']};
    }
    &&[data-appearance="filled"][data-status="error"]:not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-error']};
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-error']}; }
    }
    &&[data-appearance="filled"][data-status="warning"]:not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-warning']};
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-warning']}; }
    }
    &[data-appearance="filled"][aria-disabled="true"] {
        background: ${token.field.filled['background-color-disabled']};
        border-color: ${token.field.filled['border-color-disabled']};
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; }
        &[aria-disabled="true"] { border-color: GrayText; }
    }
`;

const supportingStyle = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${token.icon.gap};
    padding-inline: ${token.field.support['padding-inline']};
    color: ${token.field.label.color};
    font-size: ${token.field.label.floating['font-size']};
    line-height: ${token.field.support['line-height']};
    overflow-wrap: anywhere;
    & > span:first-child { min-width: 0; }
    &[data-status="error"] { color: ${token.field['color-error']}; }
    &[data-status="warning"] { color: ${token.field['color-warning']}; }
    @media (forced-colors: active) { color: CanvasText; }
`;


function TextEdit({
    ref,
    id,
    size: sizeProp,
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
    autoSize,
    resize = "vertical",
    bordered = true,
    appearance = "outlined",
    label,
    supportingText,
    errorText,
    placeholder,
    ...rest
}: TextEditProps) {
    const size = useComponentSize(sizeProp);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
    const displayValue = value ?? uncontrolledValue;
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasValue = typeof displayValue === "string" && displayValue.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const fieldStatus = errorText ? "error" : status;
    const enhancedField = Boolean(label || supportingText || errorText || showCount);
    const description = errorText || supportingText;
    const descriptionId = `${generatedId}-description`;
    const countId = `${generatedId}-count`;
    const count = showCount && typeof displayValue === "string" ? (
        <span id={countId} className={countStyle}>
            {displayValue.length}{maxLength != null ? `/${maxLength}` : ""}
        </span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            data-control=""
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
            data-status={fieldStatus}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && !disabled && fieldStatus === "error" && errorStyle,
                bordered && !disabled && fieldStatus === "warning" && warningStyle,
                bordered && appearanceStyle,
                className
            )}
        >
            <textarea
                ref={ref}
                id={inputId}
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
                className={cx(
                    textareaBaseStyle,
                    bordered ? sizeTextStyles[size] : borderlessTextareaStyle,
                    autoSize ? autoSizeStyle : resizeStyles[resize],
                    allowClear && clearSpaceStyle
                )}
                {...rest}
                aria-invalid={rest['aria-invalid'] ?? (fieldStatus === "error" || undefined)}
                aria-describedby={[rest['aria-describedby'], description ? descriptionId : undefined, count ? countId : undefined].filter(Boolean).join(" ") || undefined}
            />
            {label && bordered && appearance === "outlined" && (
                <fieldset aria-hidden="true" className={outlineStyle}>
                    <legend>{label}{rest.required && <span className={legendRequiredStyle}>*</span>}</legend>
                </fieldset>
            )}
            {showClearButton && (
                <Button
                    type="button"
                    appearance="text"
                    size="small"
                    aria-label="清除"
                    aria-controls={inputId}
                    icon={<X aria-hidden="true" />}
                    className={clearButtonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        // 清除后按钮可能消失，焦点留在可继续输入的文本域。
                        const input = e.currentTarget.parentElement?.querySelector('textarea');
                        if (input) {
                            input.focus();
                            // 原生 setter 触发 React 的 change 流程，保留受控值恢复语义。
                            Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(input, '');
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        onClear?.();
                    }}
                />
            )}
        </div>
    );

    return enhancedField ? (
        <div
            data-field-root=""
            className={fieldStyle}
            data-bordered={bordered}
            data-labeled={Boolean(label)}
            data-appearance={appearance}
            data-status={fieldStatus}
            aria-disabled={disabled || undefined}
        >
            {label && <label htmlFor={inputId}><span data-field-label-text="">{label}</span>{rest.required && <span data-required-marker="" aria-hidden="true">*</span>}</label>}
            {control}
            {(description || count) && (
                <div className={supportingStyle} data-support="" data-status={disabled ? undefined : fieldStatus}>
                    <span id={description ? descriptionId : undefined} role={errorText ? "alert" : undefined}>{description}</span>
                    {count}
                </div>
            )}
        </div>
    ) : control;
}

export default TextEdit;
