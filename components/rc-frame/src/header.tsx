import {
    height,
    boxShadow,
    display,
    alignItems,
    boxSizing,
    fontSize,
    padding,
    cursor,
    flexGrow,
    flexBasis,
    width,
    flexShrink,
    margin
} from "@crab/styleify";
import { css, cx } from "@linaria/core";
import { FC, ReactNode, type HTMLAttributes } from "react";

interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, ""> {
    
    /**
     * 显示 Logo 图标的地址
     */
    logoIconUrl?: string

    /**
     * 标题信息
     */
    title?: string

    /**
     * 用户名信息
     */
    username?: ReactNode
}


const Header: FC<HeaderProps> = ({
    className,
    logoIconUrl,
    title,
    username,
    ...restProps
}) => {
    return (
        <header
            className={cx(className, css`
                ${display("flex")}
                ${height("14")}
                ${boxShadow("sm")}
                ${alignItems("center")}
                ${boxSizing("border")}
                ${flexShrink(0)}
            `)}
            {...restProps}
        >
            <div
                className={css`
                    ${display("flex")}
                    ${cursor("pointer")}
                    ${alignItems("center")} 
                    ${width("64")}
                    ${boxSizing("border")}
                    ${padding("pl-5")} 
                `}
            >
                {
                    logoIconUrl ? (
                        <img
                            width="auto"
                            height={22}
                            src={logoIconUrl}
                            alt="Logo"
                        />
                    ) : null
                }
                
                <div
                    className={css`
                        ${display("inline-block")}
                        ${fontSize("lg")}
                        ${padding("pl-4")}
                    `}
                >
                    {title}
                </div>
            </div>
            <div
                className={css`
                    ${flexGrow(1)}
                    ${flexBasis("auto")}
                `}
            >
            </div>

            <div
                className={css`
                    ${margin("mr-4")}    
                `}
            >
                <span
                    className={css`
                        ${fontSize("sm")}
                        ${cursor("pointer")}
                    `}
                >
                    {username}
                </span>
            </div>
        </header>
    )
}

export default Header;
