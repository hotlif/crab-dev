import {
    flex,
    height,
    boxShadow,
    fontSize,
    padding,
    width,
    margin,
    flexAlignItems
} from "@crab-dev/styleify";
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
                ${flex()}
                ${height(14)}
                ${boxShadow("sm")}
                ${flexAlignItems("center")}
                box-sizing: border-box;
                flex-shrink: 0;
            `)}
            {...restProps}
        >
            <div
                className={css`
                    ${flex()}
                    cursor: pointer;
                    ${flexAlignItems("center")} 
                    ${width(64)}
                    box-sizing: border-box;
                    ${padding(5)} 
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
                        display: inline-block;
                        ${fontSize("lg")}
                        ${padding(4)}
                    `}
                >
                    {title}
                </div>
            </div>
            <div
                className={css`
                    flex-grow: 1;
                    flex-basis: auto;
                `}
            >
            </div>

            <div
                className={css`
                    ${margin(4)}    
                `}
            >
                <span
                    className={css`
                        ${fontSize("sm")}
                        cursor: pointer;
                    `}
                >
                    {username}
                </span>
            </div>
        </header>
    )
}

export default Header;
