import { css, cx } from "@linaria/core";
import { fontSize, padding } from '@crab/styleify';
import type { FC, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

import {
    LineEditBorderRadius,
    LineEditBorderColor,
    LineEditBorderColorFocusWithin,
    LineEditBoxShadowFocusWithin,
    LineEditTransition,
    globals,
} from "./token";

interface LineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {

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

export {
    globals
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
                ${fontSize("lg")}
            `
        } else if (size === "small") {
            return css`
                ${fontSize("sm")}
            `
        } else {
            return css`
                ${fontSize("base")}
            `
        }
    }

    const getIconSizeStyle = () => {
        if (size === "large") {
            return css`
                ${fontSize("lg")}
            `
        } else if (size === "small") {
            return css`
                ${fontSize("sm")}
            `
        } else {
            return css`
                ${fontSize("base")}
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
            className={cx(
                css`
                    display: inline-flex;
                    border-radius: ${LineEditBorderRadius};
                    border-width: 1px;
                    border-style: solid;
                    border-color: ${LineEditBorderColor};
                    transition: ${LineEditTransition};
                    vertical-align: middle;
                    box-sizing: border-box;
                    &:focus-within {
                        border-color: ${LineEditBorderColorFocusWithin};
                        box-shadow: ${LineEditBoxShadowFocusWithin}
                    }
                `,
                getContainerPadding(),
                className
            )}
            
        >
            {renderPrefixIcon()}
            <input
                type={type}
                value={value}
                className={cx(
                    css`
                        border-radius: inherit;
                        outline: unset;
                        border: unset;
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
