import { css, cx } from "@crab-dev/css";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode, type Ref } from "react";

import token from "./token.js";


export interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
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
    align-items: center;
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

// 按尺寸预生成容器高度/内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        height: ${token.size.large.height};
        padding: ${token.size.large.padding};
    `,
    middle: css`
        height: ${token.size.middle.height};
        padding: ${token.size.middle.padding};
    `,
    small: css`
        height: ${token.size.small.height};
        padding: ${token.size.small.padding};
    `,
} as const;

// 按尺寸预生成字体样式，共享给 input 和图标
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

// 清除按钮、密码切换按钮：reset button 样式，图标跟随字体大小
const actionButtonStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: ${token.icon.gap};
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    color: ${token.icon.color};
    cursor: pointer;
    transition: ${token.transition};
    font-size: inherit;
    line-height: inherit;
    & > svg {
        width: 1em;
        height: 1em;
    }
    &:hover {
        opacity: 0.7;
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


function LineEdit({
    ref,
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
    ...rest
}: LineEditProps) {
    // 密码可见性：内部 UI 状态，与业务无关
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
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
            {prefix && (
                <div className={cx(iconBaseStyle, prefixStyle, sizeTextStyles[size])}>
                    {prefix}
                </div>
            )}
            <input
                ref={ref}
                type={inputType}
                value={value}
                maxLength={maxLength}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(inputBaseStyle, bordered ? sizeTextStyles[size] : borderlessInputStyle)}
                {...rest}
            />
            {showClearButton && (
                <button
                    type="button"
                    aria-label="清除"
                    className={cx(actionButtonStyle, sizeTextStyles[size])}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear?.();
                    }}
                >
                    <X />
                </button>
            )}
            {suffix && (
                <div className={cx(iconBaseStyle, suffixStyle, sizeTextStyles[size])}>
                    {suffix}
                </div>
            )}
            {isPassword && (
                <button
                    type="button"
                    aria-label={showPassword ? "隐藏密码" : "显示密码"}
                    className={cx(actionButtonStyle, sizeTextStyles[size])}
                    onClick={() => setShowPassword(prev => !prev)}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
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

export default LineEdit;
