import { css, cx } from "@linaria/core";
import type { FC, InputHTMLAttributes, ReactNode } from "react";

import Token from "./token";

export interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {

    /**
     * 编辑器的对象
     */
    inputRef?: React.Ref<HTMLInputElement>;

    /**
     * 容器的对象
     */
    containerRef?: React.Ref<HTMLDivElement>;

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


const iconStyle = css`
    display: flex;
    align-items: center;
    margin-right: 0.2rem;
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
    ...restProps
}) => {

    const getContainerPadding = () => {
        if (size === "large") {
            return css`
                padding: 7px 11px;
            `
        } else if (size === "small") {
            return css`
                padding: 0px 11px;
            `
        } else {
            return css`
                padding: 4px 11px;
            `
        }
    }

    const getSizeStyle = () => {
        if (size === "large") {
            return css`
                font-size: 1.125rem;
                line-height: 1.4;
            `
        } else if (size === "small") {
            return css`
                font-size: 0.75rem;
                line-height: 1.3; 
            `
        } else {
            return css`
                font-size: 1rem;
                line-height: 1.5;
            `
        }
    }

    const getIconSizeStyle = () => {
        if (size === "large") {
            return css`
                font-size: 1.125rem;
                line-height: 1.4;
            `
        } else if (size === "small") {
            return css`
                font-size: 0.75rem;
                line-height: 1.3;
            `
        } else {
            return css`
                font-size: 1rem;
                line-height: 1.5;
            `
        }
    }

    const renderPrefixIcon = () => {
        if (prefix) {
            return (
                <div
                    className={cx(iconStyle, getIconSizeStyle())}
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
                    className={cx(iconStyle, getIconSizeStyle())}
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
                    border-radius: ${Token.border.radius};
                    border-width: 1px;
                    border-style: solid;
                    border-color: ${Token.border.color.normal};
                    transition: ${Token.transition};
                    vertical-align: middle;
                    box-sizing: border-box;
                    &:focus-within {
                        border-color: ${Token.border.color.focusWithin};
                        box-shadow: ${Token.boxShadow.focusWithin}
                    }
                `,
                getContainerPadding(),
                className
            )}
            
        >
            {renderPrefixIcon()}
            <input
                ref={inputRef}
                type={type}
                value={value}
                className={cx(
                    css`
                        border-radius: inherit;
                        outline: unset;
                        border: unset;
                        background-color: inherit;
                        &::placeholder {
                            font-size: inherit;
                            color: rgba(0, 0, 0, 0.3);
                        }
                    `,
                    getSizeStyle()
                )}
                {...restProps}
            />
            {renderSuffixIcon()}
        </div>
    )
}

export default LineEdit;
