import type { FC, HTMLAttributes, Key, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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
    /** 点击铃铛 */
    onBell?: () => void
    /** 是否有未读通知 */
    hasNotification?: boolean
    /** 点击用户区域 */
    onUserClick?: () => void
    /** 是否显示全屏按钮，默认 true */
    fullscreenable?: boolean
    /** 全屏状态变化回调 */
    onFullscreenChange?: (fullscreen: boolean) => void
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
    onBell,
    hasNotification,
    onUserClick,
    fullscreenable = true,
    onFullscreenChange,
    ...restProps
}) => {
    const { state, dispatch } = useAppMainLayoutContext();
    const { tabs, activeKey, reloadVersions } = state;
    const resolvedActiveKey = activeKey ?? tabs[0]?.key;
    const activeTab = tabs.find((t) => t.key === resolvedActiveKey);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const layoutRef = useRef<HTMLDivElement>(null);

    const fullscreenSupported = typeof document !== "undefined"
        && typeof document.exitFullscreen === "function"
        && typeof Element !== "undefined"
        && typeof Element.prototype.requestFullscreen === "function";

    const syncFullscreenState = useCallback(() => {
        if (!fullscreenable || !fullscreenSupported) {
            setIsFullscreen(false);
            return;
        }
        const next = document.fullscreenElement === layoutRef.current;
        setIsFullscreen((prev) => {
            if (prev !== next) {
                onFullscreenChange?.(next);
            }
            return next;
        });
    }, [fullscreenSupported, fullscreenable, onFullscreenChange]);

    useEffect(() => {
        if (!fullscreenable || !fullscreenSupported) {
            return;
        }
        syncFullscreenState();
        document.addEventListener("fullscreenchange", syncFullscreenState);
        return () => {
            document.removeEventListener("fullscreenchange", syncFullscreenState);
        };
    }, [fullscreenSupported, fullscreenable, syncFullscreenState]);

    const handleFullscreenToggle = useCallback(() => {
        if (!fullscreenable || !fullscreenSupported) {
            return;
        }
        const element = layoutRef.current;
        if (!element) {
            return;
        }
        if (document.fullscreenElement === element) {
            void document.exitFullscreen();
            return;
        }
        void element.requestFullscreen();
    }, [fullscreenSupported, fullscreenable]);

    return (
        <div ref={layoutRef} className={cx(layoutStyle, className)} {...restProps}>
            <Sidebar
                logo={sidebarLogo}
                title={sidebarTitle}
                onLogoClick={onLogoClick}
                loadMenus={sidebarLoadMenus}
                onMenuItemClick={onSidebarMenuItemClick}
                collapsed={sidebarCollapsed}
            />
            <div className={mainColStyle}>
                <Header
                    username={headerUserName}
                    userAvatar={headerUserAvatar}
                    onMenuToggle={() => setSidebarCollapsed((v) => !v)}
                    menuToggled={sidebarCollapsed}
                    onBell={onBell}
                    hasNotification={hasNotification}
                    onUserClick={onUserClick}
                    tabs={tabs}
                    activeTabKey={resolvedActiveKey}
                    onTabChange={(key: Key) => dispatch({ type: "activate", key })}
                    onTabClose={(key: Key) => dispatch({ type: "close", key })}
                    onTabCloseOthers={(key: Key) => dispatch({ type: "closeOthers", key })}
                    onTabCloseRight={(key: Key) => dispatch({ type: "closeRight", key })}
                    onTabCloseAll={() => dispatch({ type: "closeAll" })}
                    onTabReload={(key: Key) => dispatch({ type: "reload", key })}
                    onTabReorder={(keys: Key[]) => dispatch({ type: "reorder", keys })}
                    breadcrumbs={activeTab?.breadcrumbs}
                    fullscreenActive={isFullscreen}
                    onFullscreenToggle={fullscreenable ? handleFullscreenToggle : undefined}
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
