import { css, cx } from "@linaria/core";
import type { FC, InputHTMLAttributes, ReactNode, Ref } from "react";

import token from "./token.js";


export interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
    /**
     * 编辑器的对象
     */
    inputRef?: Ref<HTMLInputElement>;

    /**
     * 输入框的 props 信息
     */
    inputProps?: InputHTMLAttributes<HTMLInputElement>;

    /**
     * 是否只读
     */
    readOnly?: boolean;

    /**
     * 容器的对象
     */
    containerRef?: Ref<HTMLDivElement>;

    /**
     * 单行输入框的值
     */
    value?: string

    /**
     * 文本输入框类型
     */
    type?: InputHTMLAttributes<HTMLInputElement>["type"]

    /**
     * 设置当行文本输入框的大小, 默认为 middle
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

}


const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${token.icon.color};
`

const prefixStyle = css`
    margin-right: ${token.icon.gap};
`

const suffixStyle = css`
    margin-left: ${token.icon.gap};
`

const LineEdit: FC<LineEditProps> = ({
    size = "middle",
    prefix,
    suffix,
    type,
    value,
    containerRef,
    inputRef,
    className,
    inputProps = {},
    readOnly,
    ...restProps
}) => {
    const getContainerSize = () => {
        if (size === "large") {
            return css`
                height: ${token.size.large.height};
                padding: ${token.size.large.padding};
            `
        } else if (size === "small") {
            return css`
                height: ${token.size.small.height};
                padding: ${token.size.small.padding};
            `
        } else {
            return css`
                height: ${token.size.middle.height};
                padding: ${token.size.middle.padding};
            `
        }
    }

    const getSizeStyle = () => {
        if (size === "large") {
            return css`
                font-size: ${token.size.large.font.size};
                line-height: ${token.size.large["line-height"]};
            `
        } else if (size === "small") {
            return css`
                font-size: ${token.size.small.font.size};
                line-height: ${token.size.small["line-height"]};
            `
        } else {
            return css`
                font-size: ${token.size.middle.font.size};
                line-height: ${token.size.middle["line-height"]};
            `
        }
    }

    const renderPrefixIcon = () => {
        if (prefix) {
            return (
                <div
                    className={cx(iconBaseStyle, prefixStyle, getSizeStyle())}
                >
                    {prefix}
                </div>
            )
        }
        return null;
    }

    const renderSuffixIcon = () => {
        if (suffix) {
            return (
                <div
                    className={cx(iconBaseStyle, suffixStyle, getSizeStyle())}
                >
                    {suffix}
                </div>
            )
        }
        return null;
    }

    return (
        <div
            ref={containerRef}
            className={cx(
                css`
                    display: inline-flex;
                    align-items: center;
                    border-radius: ${token.border.radius};
                    border-width: ${token.border.width};
                    border-style: ${token.border.style};
                    border-color: ${token.border.color};
                    background-color: ${token.background.color};
                    color: ${token.text.color};
                    box-shadow: ${token["box-shadow"].default};
                    transition: ${token.transition};
                    outline: none;
                    box-sizing: border-box;
                    &:hover:not(:focus-within):not([aria-disabled="true"]) {
                        border-color: ${token.border["color-hover"]};
                    }
                    &:focus-within {
                        border-color: ${token.border["color-focus"]};
                        box-shadow: ${token["box-shadow"]["focus-within"]};
                    }
                    &[aria-disabled="true"] {
                        pointer-events: none;
                        opacity: 0.5;
                    }
                `,
                getContainerSize(),
                className
            )}
            {...restProps}
            
        >
            {renderPrefixIcon()}
            <input
                ref={inputRef}
                type={type}
                value={value}
                className={cx(
                    css`
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
                    `,
                    getSizeStyle()
                )}
                readOnly={readOnly}
                {...inputProps}
            />
            {renderSuffixIcon()}
        </div>
    )
}

export default LineEdit;
