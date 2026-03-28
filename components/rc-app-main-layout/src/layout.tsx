import type { FC, HTMLAttributes, ReactNode } from "react";
import { cx, css } from "@linaria/core";
import Header from "./header.js";
import Sidebar, { SidebarProps } from "./sidebar.js";
import Content from "./content.js";

interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {
    /** 顶部标题文本 */
    headerTitle?: string
    /** 顶部 logo 图标的 URL */
    headerLogoIconUrl?: string
    /** 顶部用户名节点（可为 React 元素） */
    headerUserName?: ReactNode
    /** 顶部用户头像节点（可为 React 元素） */
    headerUserAvatar?: ReactNode
    /** 侧边栏菜单加载函数 */
    sidebarLoadMenus?: SidebarProps["loadMenus"]
}

const Layout: FC<LayoutProps> = ({
    className,
    headerTitle,
    headerLogoIconUrl,
    headerUserName,
    headerUserAvatar,
    sidebarLoadMenus,
    children,
    ...restProps
}) => {
    return (
        <div
            className={cx(className, css`
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                overflow: hidden;
            `)}
            {...restProps}
        >
            <Header
                title={headerTitle}
                username={headerUserName}
                logoIconUrl={headerLogoIconUrl}
                userAvatar={headerUserAvatar}
            />
            <div
                className={css`
                    display: flex;
                    height: 100%;
                    flex-grow: 1;
                `}
            >
                <Sidebar
                    loadMenus={sidebarLoadMenus}
                />
                <Content>
                    {children}
                </Content>
            </div>
        </div>
    )
}

export default Layout;
