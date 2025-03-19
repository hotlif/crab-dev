import { css, cx } from "@linaria/core";
import { fontSize, padding, borderRadius } from '@crab/styleify';
import type { FC, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

import { LineEditBorderRadius, globals } from "./token";

interface LineEditProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {

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
    ...restProps
}) => {

    const getContainerPadding = () => {
        if (size === "large") {
            return css`
                ${padding("px-2")}
                ${padding("py-1.5")}  
            `
        } else if (size === "small") {
            return css`
                ${padding("px-2")}
            `
        } else {
            return css`
                ${padding("px-2")}
                ${padding("py-1")}  
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


    const renderPrefixIcon = () => {
        if (prefix) {
            return (
                <div
                    className={iconStyle}
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
                    className={iconStyle}
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
                    border-color: rgb(217, 217, 217);
                    transition: all 200ms;
                    &:focus-within {
                        border-color: rgb(22, 119, 255);
                        box-shadow: rgba(5, 145, 255, 0.1) 0px 0px 0px 2px;
                    }
                `,
                getContainerPadding()
            )}
            {...restProps}
        >
            {renderPrefixIcon()}
            <input
                type={type}
                className={cx(
                    css`
                        border-radius: inherit;
                        outline: unset;
                        border: unset;
                        height: 100%;
                    `,
                    getSizeStyle()
                )}
            />
            {renderSuffixIcon()}
        </div>
    )
}

export default LineEdit;
