import type { FC, HTMLAttributes, Key, ReactNode } from "react";
import { cx, css } from "@linaria/core";
import token from "./token.js";
import Header from "./header.js";
import Sidebar, { SidebarProps } from "./sidebar.js";
import Content from "./content.js";
import { useAppMainLayoutContext } from "./context.js";

interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /** 侧边栏顶部 Logo */
    sidebarLogo?: ReactNode
    /** 侧边栏顶部标题 */
    sidebarTitle?: ReactNode
    /** 点击 Logo */
    onLogoClick?: () => void
    /** 侧边栏菜单加载函数 */
    sidebarLoadMenus?: SidebarProps["loadMenus"]
    /** 点击侧边栏菜单项 */
    onSidebarMenuItemClick?: SidebarProps["onMenuItemClick"]
    /** 顶部用户名 */
    headerUserName?: ReactNode
    /** 顶部用户头像节点 */
    headerUserAvatar?: ReactNode
    /** 点击菜单按钮 */
    onMenuToggle?: () => void
    /** 点击铃铛 */
    onBell?: () => void
    /** 是否有未读通知 */
    hasNotification?: boolean
    /** 点击用户区域 */
    onUserClick?: () => void
}

const layoutStyle = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background-color: ${token.background.color};
`;

const mainColStyle = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
`;

const paneStyle = css`
    height: 100%;

    &[hidden] {
        display: none;
    }
`;

/**
 * 管理后台主布局。
 *
 * 必须在 `<AppMainLayoutProvider>` 中使用；tabs 状态由 Provider 提供的 reducer 管理。
 */
const Layout: FC<LayoutProps> = ({
    className,
    sidebarLogo,
    sidebarTitle,
    onLogoClick,
    sidebarLoadMenus,
    onSidebarMenuItemClick,
    headerUserName,
    headerUserAvatar,
    onMenuToggle,
    onBell,
    hasNotification,
    onUserClick,
    ...restProps
}) => {
    const { state, dispatch } = useAppMainLayoutContext();
    const { tabs, activeKey, reloadVersions } = state;
    const resolvedActiveKey = activeKey ?? tabs[0]?.key;
    const activeTab = tabs.find((t) => t.key === resolvedActiveKey);

    return (
        <div className={cx(layoutStyle, className)} {...restProps}>
            <Sidebar
                logo={sidebarLogo}
                title={sidebarTitle}
                onLogoClick={onLogoClick}
                loadMenus={sidebarLoadMenus}
                onMenuItemClick={onSidebarMenuItemClick}
            />
            <div className={mainColStyle}>
                <Header
                    username={headerUserName}
                    userAvatar={headerUserAvatar}
                    onMenuToggle={onMenuToggle}
                    onBell={onBell}
                    hasNotification={hasNotification}
                    onUserClick={onUserClick}
                    tabs={tabs}
                    activeTabKey={resolvedActiveKey}
                    onTabChange={(key: Key) => dispatch({ type: "activate", key })}
                    onTabClose={(key: Key) => dispatch({ type: "close", key })}
                    onTabReorder={(keys: Key[]) => dispatch({ type: "reorder", keys })}
                    breadcrumbs={activeTab?.breadcrumbs}
                />
                <Content>
                    {tabs.map((tab) => {
                        const isActive = tab.key === resolvedActiveKey;
                        const version = reloadVersions.get(tab.key) ?? 0;
                        return (
                            <div
                                key={`${String(tab.key)}::${version}`}
                                className={paneStyle}
                                role="tabpanel"
                                aria-hidden={!isActive}
                                hidden={!isActive}
                            >
                                {tab.children}
                            </div>
                        );
                    })}
                </Content>
            </div>
        </div>
    );
};

export default Layout;
