import type { FC, HTMLAttributes, Key, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cx, css } from "@crab-dev/css";
import Drawer from "@crab-dev/rc-drawer";
import token from "./token.js";
import Header from "./header.js";
import Sidebar, { SidebarBody, type SidebarProps } from "./sidebar.js";
import Content from "./content.js";
import { useAppMainLayoutContext } from "./context.js";
import type { HeaderUserEntity } from "./types.js";

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
    /** 远程加载顶部用户实体 */
    headerLoadUser?: () => Promise<HeaderUserEntity>
    /** 点击铃铛 */
    onBell?: () => void
    /** 是否有未读通知 */
    hasNotification?: boolean
    /** 点击用户区域 */
    onUserClick?: () => void
    /** 点击切换角色 */
    onSwitchRole?: () => void
    /** 点击退出登录 */
    onLogout?: () => void
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
    &[hidden] {
        display: none;
    }
`;

const mobileNavDrawerStyle = css`
    --drawer-body-padding: 0;
    --drawer-size-small-width: min(86vw, ${token.sidebar.width});
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
    headerLoadUser,
    onBell,
    hasNotification,
    onUserClick,
    onSwitchRole,
    onLogout,
    fullscreenable = true,
    onFullscreenChange,
    ...restProps
}) => {
    const { state, dispatch } = useAppMainLayoutContext();
    const { tabs, activeKey, reloadVersions } = state;
    const resolvedActiveKey = activeKey ?? tabs[0]?.key;
    const activeTab = tabs.find((t) => t.key === resolvedActiveKey);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(
        () => typeof window !== "undefined"
            && typeof window.matchMedia === "function"
            && window.matchMedia("(max-width: 767px)").matches,
    );
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined"
            && typeof window.matchMedia === "function"
            && window.matchMedia("(max-width: 767px)").matches,
    );
    const [isFullscreen, setIsFullscreen] = useState(false);
    const layoutRef = useRef<HTMLDivElement>(null);
    const headerUserPromiseRef = useRef<Promise<HeaderUserEntity> | null>(null);

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

    const handleSidebarMenuItemClick = useCallback<NonNullable<SidebarProps["onMenuItemClick"]>>(
        (param) => {
            onSidebarMenuItemClick?.(param);
            if (isMobile && !param.item.children?.length) {
                setSidebarCollapsed(true);
            }
        },
        [onSidebarMenuItemClick, isMobile],
    );

    useEffect(() => {
        headerUserPromiseRef.current = null;
    }, [headerLoadUser]);

    const loadResolvedHeaderUser = useCallback<NonNullable<LayoutProps["headerLoadUser"]>>(async () => {
        if (!headerLoadUser) {
            return {};
        }
        if (!headerUserPromiseRef.current) {
            headerUserPromiseRef.current = headerLoadUser()
                .then((user) => user ?? {});
        }
        return headerUserPromiseRef.current;
    }, [headerLoadUser]);

    const loadSidebarMenus = useCallback<NonNullable<SidebarProps["loadMenus"]>>(async () => {
        if (!sidebarLoadMenus) {
            return [];
        }
        const headerUser = await loadResolvedHeaderUser();
        return sidebarLoadMenus(headerUser);
    }, [loadResolvedHeaderUser, sidebarLoadMenus]);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const mq = window.matchMedia("(max-width: 767px)");
        const handler = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            setSidebarCollapsed(e.matches);
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <div ref={layoutRef} className={cx(layoutStyle, className)} {...restProps}>
            {isMobile ? (
                <Drawer
                    className={mobileNavDrawerStyle}
                    placement="left"
                    size="small"
                    open={!sidebarCollapsed}
                    onOpenChange={(open) => setSidebarCollapsed(!open)}
                    closable={false}
                    shouldResetContent={false}
                >
                    <SidebarBody
                        logo={sidebarLogo}
                        title={sidebarTitle}
                        onLogoClick={onLogoClick}
                        loadMenus={sidebarLoadMenus ? loadSidebarMenus : undefined}
                        onMenuItemClick={handleSidebarMenuItemClick}
                    />
                </Drawer>
            ) : (
                <Sidebar
                    logo={sidebarLogo}
                    title={sidebarTitle}
                    onLogoClick={onLogoClick}
                    loadMenus={sidebarLoadMenus ? loadSidebarMenus : undefined}
                    onMenuItemClick={handleSidebarMenuItemClick}
                    collapsed={sidebarCollapsed}
                />
            )}
            <div className={mainColStyle}>
                <Header
                    loadUser={headerLoadUser ? loadResolvedHeaderUser : undefined}
                    onMenuToggle={() => setSidebarCollapsed((v) => !v)}
                    menuToggled={sidebarCollapsed}
                    onBell={onBell}
                    hasNotification={hasNotification}
                    onUserClick={onUserClick}
                    onSwitchRole={onSwitchRole}
                    onLogout={onLogout}
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
