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

    /**
     * 用户头像
     */
    userAvatar?: ReactNode

}


const Header: FC<HeaderProps> = ({
    className,
    logoIconUrl,
    title,
    username,
    userAvatar,
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
                    user-select: none;
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
                    padding: 10px;
                    margin-right: 1rem;
                    display: flex;
                    align-items: center;
                    user-select: none;
                    &:hover {
                        background-color: rgba(0, 0, 0, 0.03);
                    }
                `}
            >
                <span
                    className={css`
                        width: 28px;
                        height: 28px;
                        font-size: 18px;
                        overflow: hidden; 
                        margin-right: .5rem;
                    `}
                >
                    {userAvatar}
                </span>
                <span
                    className={css`
                        font-size: 14px;
                        color: rgba(0, 0, 0, 0.45);
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
