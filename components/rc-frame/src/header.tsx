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
                display: flex;
                height: 3.5rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.025), 0 2px 6px rgba(0,0,0,0.035);
                align-items: center;
                box-sizing: border-box;
                flex-shrink: 0;
            `)}
            {...restProps}
        >
            <div
                className={css`
                    display: flex;
                    cursor: pointer;
                    align-items: center;
                    width: 15rem;
                    box-sizing: border-box;
                    padding: 1.25rem;
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
                        font-size: 1.125rem;
                        line-height: 1.4;
                        padding: 1rem;
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
                    cursor: pointer;
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
                    `}
                >
                    {username}
                </span>
            </div>
        </header>
    )
}

export default Header;
