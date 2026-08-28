import { css, cx } from "@crab-dev/css";
import { X } from "lucide-react";
import type { Ref, TextareaHTMLAttributes } from "react";

import token from "./token.js";


export interface TextEditProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
    width: 100%;
    border-radius: ${token.border.radius};
    border-width: ${token.border.width};
    border-style: ${token.border.style};
    border-color: ${token.border.color};
    background-color: ${token.background.color};
    color: ${token.text.color};
    box-shadow: ${token['box-shadow'].default};
    transition: ${token.transition};
    outline: none;
    box-sizing: border-box;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.border['color-hover']};
    }
    &:focus-within {
        border-color: ${token.border['color-focus']};
        box-shadow: ${token['box-shadow']['focus-within']};
    }
    &[aria-disabled="true"] {
        pointer-events: none;
        opacity: 0.5;
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
        font-size: ${token.size.large.font.size};
        line-height: ${token.size.large['line-height']};
    `,
    middle: css`
        font-size: ${token.size.middle.font.size};
        line-height: ${token.size.middle['line-height']};
    `,
    small: css`
        font-size: ${token.size.small.font.size};
        line-height: ${token.size.small['line-height']};
    `,
} as const;

// 验证状态样式：覆盖 hover/focus 时的边框颜色和焦点光环颜色，保持视觉一致性
const errorStyle = css`
    border-color: ${token.status.error.border.color};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status.error.border.color};
    }
    &:focus-within {
        border-color: ${token.status.error.border.color};
        box-shadow: ${token.status.error['box-shadow']['focus-within']};
    }
`

const warningStyle = css`
    border-color: ${token.status.warning.border.color};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status.warning.border.color};
    }
    &:focus-within {
        border-color: ${token.status.warning.border.color};
        box-shadow: ${token.status.warning['box-shadow']['focus-within']};
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
    padding-inline-end: calc(1em + ${token.icon.gap});
`


// --- 操作区样式 ---

// 清除按钮绝对定位于容器右上角，与首行文本对齐
const clearButtonStyle = css`
    position: absolute;
    inset-block-start: ${token.clear['inset-block-start']};
    inset-inline-end: ${token.clear['inset-inline-end']};
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: ${token.icon.color};
    cursor: pointer;
    transition: ${token.transition};
    & > svg {
        width: 1em;
        height: 1em;
    }
    &:hover {
        opacity: 0.7;
    }
`

// 字符计数：容器 flex column 下常驻底部右对齐；计数变化不改变行高，不引起布局跳动
const countStyle = css`
    align-self: flex-end;
    flex-shrink: 0;
    margin-top: ${token.icon.gap};
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`


function TextEdit({
    ref,
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
    ...rest
}: TextEditProps) {
    const hasValue = typeof value === "string" && value.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;

    return (
        <div
            ref={containerRef}
            aria-disabled={disabled || undefined}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && status === "error" && errorStyle,
                bordered && status === "warning" && warningStyle,
                className
            )}
        >
            <textarea
                ref={ref}
                value={value}
                maxLength={maxLength}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(
                    textareaBaseStyle,
                    bordered ? sizeTextStyles[size] : borderlessTextareaStyle,
                    autoSize ? autoSizeStyle : resizeStyles[resize],
                    allowClear && clearSpaceStyle
                )}
                {...rest}
            />
            {showClearButton && (
                <button
                    type="button"
                    aria-label="清除"
                    className={cx(clearButtonStyle, sizeTextStyles[size])}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear?.();
                    }}
                >
                    <X />
                </button>
            )}
            {showCount && typeof value === "string" && (
                <span className={countStyle}>
                    {value.length}{maxLength != null ? `/${maxLength}` : ""}
                </span>
            )}
        </div>
    )
}

export default TextEdit;
