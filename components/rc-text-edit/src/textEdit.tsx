import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { X } from "lucide-react";
import { useId, type Ref, type TextareaHTMLAttributes } from "react";

import token from "./token.js";


export interface TextEditProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 可见的浮动标签，与文本域自动关联。 */
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
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.root['border-color-hover']};
    }
    &:focus-within {
        border-color: ${token.root['border-color-focus']};
        box-shadow: ${token.root['box-shadow-focus-within']};
    }
    &:has(textarea:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.root['opacity-disabled']};
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(textarea:focus-visible) { outline-color: Highlight; }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`

// 按尺寸预生成容器内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        padding: ${token.size.large.padding};
    `,
    middle: css`
        padding: ${token.size.middle.padding};
    `,
    small: css`
        padding: ${token.size.small.padding};
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
    width: 100%;
    min-width: 0;
    max-width: 100%;
    gap: ${token.field.gap};
`;

const materialStyle = css`
    position: relative;
    cursor: text;
    &[data-labeled="true"] { padding-top: ${token.field.input['padding-top']}; }
    & > label {
        position: absolute;
        z-index: 1;
        inset-inline-start: ${token.field['padding-inline']};
        top: ${token.field.label.top};
        max-width: calc(100% - 2 * ${token.field['padding-inline']});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: text;
        color: ${token.field.label.color};
        font-size: ${token.size.middle['font-size']};
        line-height: ${token.field.label['line-height']};
        transition: ${token.field.transition};
    }
    &[data-labeled="true"]:not(:focus-within) textarea:placeholder-shown::placeholder { color: transparent; }
    &:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: 0;
        transform: translateY(-50%);
        padding-inline: ${token.field.label['padding-inline']};
        background: ${token.root['background-color']};
        font-size: ${token.field.label['font-size']};
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
    &[data-appearance="filled"]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: ${token.field.filled.label.top};
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
        border-bottom-color: ${token.status['border-color-warning']};
        &:focus-within { box-shadow: inset 0 -1px 0 ${token.status['border-color-warning']}; }
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
    color: ${token.field.label.color};
    font-size: ${token.field.label['font-size']};
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
    size = "middle",
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
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hasValue = typeof value === "string" && value.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const fieldStatus = errorText ? "error" : status;
    const enhancedField = Boolean(label || supportingText || errorText || showCount);
    const description = errorText || supportingText;
    const descriptionId = `${generatedId}-description`;
    const countId = `${generatedId}-count`;
    const count = showCount && typeof value === "string" ? (
        <span id={countId} className={countStyle}>
            {value.length}{maxLength != null ? `/${maxLength}` : ""}
        </span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
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
            <textarea
                ref={ref}
                id={inputId}
                value={value}
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
            {label && bordered && <label htmlFor={inputId}>{label}{rest.required ? " *" : ""}</label>}
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
                        e.currentTarget.parentElement?.querySelector('textarea')?.focus();
                        onClear?.();
                    }}
                />
            )}
            {!enhancedField && count}
        </div>
    );

    return enhancedField ? (
        <div className={fieldStyle}>
            {label && !bordered && <label htmlFor={inputId}>{label}{rest.required ? " *" : ""}</label>}
            {control}
            {(description || count) && (
                <div className={supportingStyle} data-status={fieldStatus}>
                    <span id={description ? descriptionId : undefined}>{description}</span>
                    {count}
                </div>
            )}
        </div>
    ) : control;
}

export default TextEdit;
