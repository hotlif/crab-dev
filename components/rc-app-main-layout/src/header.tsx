import { cx } from "@crab-dev/css";
import { useLocale } from '@crab-dev/rc-config-provider';
import { useEffect, useRef, useState } from "react";
import type { FC, Key, HTMLAttributes } from "react";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { usePresence } from "@crab-dev/rc-hooks";
import Breadcrumbs, { type BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";
import Skeleton from "@crab-dev/rc-skeleton";
import Avatar from "@crab-dev/rc-avatar";
import Button from "@crab-dev/rc-button";
import token from "./token.js";
import TabBar from "./tabBar.js";
import type { HeaderUserEntity, TabItem } from "./types.js";
import { BellIcon, EnterFullscreenIcon, ExitFullscreenIcon, LogoutIcon, MenuIcon, SwitchRoleIcon } from "./icons.js";
import { headerStyle, tabStripStyle, toolbarStyle, toolbarSpacerStyle, breadcrumbsStyle, mobileTitleStyle, navBtnStyle, notificationDotStyle, userPillStyle, userPillContentStyle, userMenuWrapStyle, userMenuStyle, userMenuItemStyle, userMenuItemIconStyle, usernameStyle, userInfoStyle, userRoleStyle, userInfoSkeletonStyle, avatarStyle } from "./header.styles.js";
interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, ""> {
    /** 远程加载顶部用户实体 */
    loadUser?: () => Promise<HeaderUserEntity>
    /** 点击菜单按钮 */
    onMenuToggle?: () => void
    /** 菜单按钮的激活状态（侧边栏是否已折叠） */
    menuToggled?: boolean
    /** 点击铃铛（通知） */
    onBell?: () => void
    /** 是否有未读通知 */
    hasNotification?: boolean
    /** 点击用户区域 */
    onUserClick?: () => void
    /** 点击切换角色 */
    onSwitchRole?: () => void
    /** 点击退出登录 */
    onLogout?: () => void
    /** 标签页列表 */
    tabs?: TabItem[]
    /** 布局生成的标签 / 面板 ID 前缀 */
    tabIdPrefix?: string
    /** 当前激活的标签 key */
    activeTabKey?: Key
    /** 切换标签时的回调 */
    onTabChange?: (key: Key) => void
    /** 关闭标签时的回调 */
    onTabClose?: (key: Key) => void
    /** 关闭除指定 key 之外的全部可关闭标签 */
    onTabCloseOthers?: (key: Key) => void
    /** 关闭指定 key 右侧的全部可关闭标签 */
    onTabCloseRight?: (key: Key) => void
    /** 关闭全部可关闭标签 */
    onTabCloseAll?: () => void
    /** 重新加载指定标签页 */
    onTabReload?: (key: Key) => void
    /** 拖拽重排后的回调；传入则启用拖拽排序 */
    onTabReorder?: (keys: Key[]) => void
    /** 当前激活标签的路径面包屑；渲染于 toolbar */
    breadcrumbs?: BreadcrumbsItem[]
    /** 当前是否处于全屏 */
    fullscreenActive?: boolean
    /** 点击全屏按钮 */
    onFullscreenToggle?: () => void
}

const Header: FC<HeaderProps> = ({
    className,
    loadUser,
    onMenuToggle,
    menuToggled,
    onBell,
    hasNotification,
    onUserClick,
    onSwitchRole,
    onLogout,
    tabs,
    tabIdPrefix,
    activeTabKey,
    onTabChange,
    onTabClose,
    onTabCloseOthers,
    onTabCloseRight,
    onTabCloseAll,
    onTabReload,
    onTabReorder,
    breadcrumbs,
    fullscreenActive,
    onFullscreenToggle,
    ...restProps
}) => {
    const { messages } = useLocale();
    const mobileTitle = breadcrumbs?.[breadcrumbs.length - 1]?.title;
    const [userLoading, setUserLoading] = useState(false);
    const [resolvedUser, setResolvedUser] = useState<HeaderUserEntity>({});
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuWrapRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const userMenuCloseTimerRef = useRef<number | null>(null);
    const canShowUserMenu = !userLoading && userMenuOpen;
    const presence = usePresence<HTMLDivElement>(canShowUserMenu);
    const { refs, floatingStyles } = useFloating({
        placement: "bottom-end",
        strategy: "absolute",
        transform: false,
        open: canShowUserMenu,
        onOpenChange: setUserMenuOpen,
        middleware: [
            offset(8),
            flip(),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
        if (!loadUser) {
            setUserLoading(false);
            setResolvedUser({});
            return;
        }

        let cancelled = false;
        setUserLoading(true);
        void loadUser().then((next) => {
            if (!cancelled) {
                setResolvedUser(next ?? {});
                setUserLoading(false);
            }
        }).catch(() => {
            if (!cancelled) {
                setResolvedUser({});
                setUserLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [loadUser]);

    useEffect(() => {
        if (userLoading) {
            setUserMenuOpen(false);
        }
    }, [userLoading]);

    useEffect(() => {
        return () => {
            if (userMenuCloseTimerRef.current !== null) {
                window.clearTimeout(userMenuCloseTimerRef.current);
                userMenuCloseTimerRef.current = null;
            }
        };
    }, []);

    const clearUserMenuCloseTimer = () => {
        if (userMenuCloseTimerRef.current !== null) {
            window.clearTimeout(userMenuCloseTimerRef.current);
            userMenuCloseTimerRef.current = null;
        }
    };

    const scheduleUserMenuClose = () => {
        clearUserMenuCloseTimer();
        userMenuCloseTimerRef.current = window.setTimeout(() => {
            setUserMenuOpen(false);
            userMenuCloseTimerRef.current = null;
        }, 120);
    };

    const openUserMenu = () => {
        clearUserMenuCloseTimer();
        if (!userLoading) {
            setUserMenuOpen(true);
        }
    };

    return (
        <header className={cx(headerStyle, className)} {...restProps}>
            {tabs ? (
                <div className={tabStripStyle} hidden={tabs.length === 0}>
                    <TabBar
                        idPrefix={tabIdPrefix}
                        onEmpty={() => menuButtonRef.current?.focus()}
                        items={tabs}
                        value={activeTabKey}
                        onValueChange={onTabChange}
                        onClose={onTabClose}
                        onCloseOthers={onTabCloseOthers}
                        onCloseRight={onTabCloseRight}
                        onCloseAll={onTabCloseAll}
                        onReload={onTabReload}
                        onReorder={onTabReorder}
                    />
                </div>
            ) : null}
            <div className={toolbarStyle}>
                <Button
                    ref={menuButtonRef}
                    type="button"
                    appearance="text"
                    shape="circle"
                    icon={<MenuIcon />}
                    title={messages.appLayout.toggleSidebar}
                    className={navBtnStyle}
                    onClick={onMenuToggle}
                    aria-label={messages.appLayout.toggleSidebar}
                    aria-expanded={!menuToggled}
                    aria-pressed={menuToggled}
                />
                {mobileTitle ? <span className={mobileTitleStyle}>{mobileTitle}</span> : null}
                {breadcrumbs?.length ? (
                    <Breadcrumbs className={breadcrumbsStyle} items={breadcrumbs} />
                ) : null}
                <div className={toolbarSpacerStyle} />
                {onFullscreenToggle ? (
                    <Button
                        type="button"
                        appearance="text"
                        shape="circle"
                        icon={fullscreenActive ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
                        title={fullscreenActive ? messages.appLayout.exitFullscreen : messages.appLayout.enterFullscreen}
                        className={navBtnStyle}
                        onClick={onFullscreenToggle}
                        aria-label={fullscreenActive ? messages.appLayout.exitFullscreen : messages.appLayout.enterFullscreen}
                        aria-pressed={fullscreenActive}
                    />
                ) : null}
                <Button type="button" appearance="text" shape="circle" icon={<BellIcon />} className={navBtnStyle} onClick={onBell} aria-label={messages.appLayout.notifications} title={messages.appLayout.notifications}>
                    {hasNotification ? <span className={notificationDotStyle} aria-hidden /> : null}
                </Button>
                <div
                    ref={userMenuWrapRef}
                    className={userMenuWrapStyle}
                    onMouseEnter={openUserMenu}
                    onMouseLeave={scheduleUserMenuClose}
                    onFocusCapture={openUserMenu}
                    onBlurCapture={(e) => {
                        const next = e.relatedTarget;
                        if (next instanceof Node && userMenuWrapRef.current?.contains(next)) {
                            return;
                        }
                        setUserMenuOpen(false);
                    }}
                >
                    <Button
                        ref={refs.setReference}
                        type="button"
                        appearance="text"
                        className={userPillStyle}
                        onClick={onUserClick}
                        aria-label={userLoading ? messages.appLayout.loadingUser : (typeof resolvedUser.name === "string" ? resolvedUser.name : messages.appLayout.userMenu)}
                        aria-haspopup="menu"
                        aria-expanded={userMenuOpen}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                setUserMenuOpen(false);
                            }
                        }}
                    >
                        <span className={userPillContentStyle}>
                            {userLoading ? (
                                <span className={userInfoSkeletonStyle} aria-hidden>
                                    <Skeleton variant="text" width="72px" size="small" />
                                    <Skeleton variant="text" width="56px" size="small" />
                                </span>
                            ) : (resolvedUser.name || resolvedUser.roleName) ? (
                                <span className={userInfoStyle}>
                                    {resolvedUser.name ? <span className={usernameStyle} title={typeof resolvedUser.name === 'string' ? resolvedUser.name : undefined}>{resolvedUser.name}</span> : null}
                                    {resolvedUser.roleName ? <span className={userRoleStyle} title={typeof resolvedUser.roleName === 'string' ? resolvedUser.roleName : undefined}>{resolvedUser.roleName}</span> : null}
                                </span>
                            ) : null}
                            {userLoading ? (
                                <Skeleton variant="avatar" width={token.header.user.avatar.width} height={token.header.user.avatar.width} aria-hidden />
                            ) : (
                                <Avatar size="small" className={avatarStyle} aria-label={messages.appLayout.userAvatar} aria-hidden>
                                    {resolvedUser.avatar ?? (typeof resolvedUser.name === 'string' ? resolvedUser.name.trim().slice(0, 1) || undefined : undefined)}
                                </Avatar>
                            )}
                        </span>
                    </Button>
                    {presence.present ? (
                        <div
                            ref={(node) => { refs.setFloating(node); presence.ref(node); }}
                            data-state={presence.state}
                            inert={!canShowUserMenu}
                            className={userMenuStyle}
                            style={floatingStyles}
                            role="menu"
                            aria-label={messages.appLayout.userActions}
                        >
                            <Button
                                type="button"
                                appearance="text"
                                role="menuitem"
                                className={userMenuItemStyle}
                                icon={<span className={userMenuItemIconStyle} aria-hidden><SwitchRoleIcon /></span>}
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    onSwitchRole?.();
                                }}
                            >
                                {messages.appLayout.switchRole}
                            </Button>
                            <Button
                                type="button"
                                appearance="text"
                                role="menuitem"
                                className={userMenuItemStyle}
                                icon={<span className={userMenuItemIconStyle} aria-hidden><LogoutIcon /></span>}
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    onLogout?.();
                                }}
                            >
                                {messages.appLayout.logout}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Header;
