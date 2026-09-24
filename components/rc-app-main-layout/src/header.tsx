import { css, cx } from "@crab-dev/css";
import { useEffect, useRef, useState } from "react";
import type { FC, Key, HTMLAttributes } from "react";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { usePresence } from "@crab-dev/rc-hooks";
import Breadcrumbs, { type BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";
import Skeleton from "@crab-dev/rc-skeleton";
import Avatar, { TokenVars as avatarVars } from "@crab-dev/rc-avatar";
import Button, { TokenVars as buttonVars } from "@crab-dev/rc-button";

import token from "./token.js";
import TabBar from "./tabBar.js";
import type { HeaderUserEntity, TabItem } from "./types.js";
import {
    BellIcon,
    EnterFullscreenIcon,
    ExitFullscreenIcon,
    LogoutIcon,
    MenuIcon,
    SwitchRoleIcon,
} from "./icons.js";

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

const headerStyle = css`
    display: flex;
    flex-direction: column;
    box-shadow: ${token.header["box-shadow"]};
    z-index: ${token.header['z-index']};
    box-sizing: border-box;
    flex-shrink: 0;
`;

const tabStripStyle = css`
    display: flex;
    align-items: flex-end;
    background-color: ${token.tab.strip["background-color"]};
    padding: ${token.tab.strip.padding};
    min-height: ${token.tab.strip.height};
    box-sizing: border-box;
    min-width: 0;
    &[hidden] { display: none; }
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.header.toolbar.gap};
    height: ${token.header.toolbar.height};
    padding: ${token.header.toolbar.padding};
    background-color: ${token.header.toolbar["background-color"]};
    box-sizing: border-box;

    @media (max-width: 767px) {
        gap: 4px;
        padding-inline: 8px;
    }
`;

const toolbarSpacerStyle = css`
    flex: 1;
`;

const breadcrumbsStyle = css`
    min-width: 0;
    flex: 0 1 auto;
    overflow: hidden;

    @media (max-width: 767px) {
        display: none;
    }
`;

const mobileTitleStyle = css`
    display: none;

    @media (max-width: 767px) {
        display: block;
        min-width: 0;
        flex: 1;
        font-size: ${token.header.user.name["font-size"]};
        font-weight: 600;
        color: ${token.header.user.name.color};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const navBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: ${token.header['nav-btn'].width};
    height: ${token.header['nav-btn'].width};
    border-radius: ${token.header['nav-btn']["border-radius"]};
    color: ${token.header['nav-btn'].color};
    cursor: pointer;
    flex-shrink: 0;
    background: transparent;
    border: none;
    padding: 0;
    transition: color ${token.motion.interaction.transition}, background-color ${token.motion.interaction.transition}, transform ${token.motion.spatial.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }

    &:hover {
        color: ${token.header['nav-btn']['color-hover']};
        background-color: ${token.header['nav-btn']['background-color-hover']};
    }

    &:active {
        background-color: ${token.header['nav-btn']['background-color-active']};
        transform: scale(0.96);
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    & > svg {
        width: ${token.header['nav-btn'].icon.width};
        height: ${token.header['nav-btn'].icon.width};
    }
`;

const notificationDotStyle = css`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${token.header['nav-btn'].dot["background-color"]};
    box-shadow: 0 0 0 2px ${token.header.toolbar["background-color"]};
    pointer-events: none;
`;

const userPillStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.header.user.pill['border-radius']};
        ${buttonVars['text.color']}: ${token.header.user.name.color};
        ${buttonVars['text.background-color-hover']}: ${token.header.user.pill['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.header.user.pill['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.header['nav-btn']['background-color-active']};
        min-width: ${token.header.user.pill.height};
        height: ${token.header.user.pill.height};
        padding: ${token.header.user.pill.padding};
        border-radius: ${token.header.user.pill['border-radius']};
        flex-shrink: 0;
        > span:last-child { display: inline-flex; }
    }
`;

const userPillContentStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.header.user.pill.gap};
`;

const userMenuWrapStyle = css`
    position: relative;
    display: inline-flex;
`;

const userMenuStyle = css`
    width: ${token.header.user.menu['min-width']};
    min-width: ${token.header.user.menu['min-width']};
    padding: ${token.header.user.menu.padding};
    background-color: ${token.header.user.menu['background-color']};
    border: 0;
    border-radius: ${token.header.user.menu['border-radius']};
    box-shadow: ${token.header.user.menu['box-shadow']};
    z-index: ${token.tab['context-menu']['z-index']};
    box-sizing: border-box;
    transform-origin: top right;
    opacity: 1;
    translate: 0 0;
    transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition};
    @starting-style { opacity: 0; translate: 0 ${token.motion.offset.translate}; }
    &[data-state="closed"] { opacity: 0; translate: 0 ${token.motion.offset.translate}; }

    /* Keep the hover path continuous across the visual gap below the trigger. */
    &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        inset-inline: 0;
        height: ${token.header.user.menu.gap};
    }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const userMenuItemStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.header.user.menu.item['border-radius']};
        ${buttonVars['text.color']}: ${token.tab['context-menu'].item.color};
        ${buttonVars['text.background-color-hover']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.header['nav-btn']['background-color-active']};
        justify-content: flex-start;
        gap: ${token.header.user.menu.item.gap};
        width: 100%;
        height: ${token.header.user.menu.item.height};
        padding: ${token.header.user.menu.item.padding};
        border-radius: ${token.header.user.menu.item['border-radius']};
        font-size: ${token.header.user.menu.item['font-size']};
        font-weight: ${token.header.user.menu.item['font-weight']};
        line-height: ${token.header.user.menu.item['line-height']};
        text-align: start;
        &:focus-visible { outline-offset: ${token.tab.item['outline-offset-focus']}; }
        @media (pointer: coarse) { height: ${token.header.user.pill.height}; }
    }
`;

const userMenuItemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.header.user.menu.item.icon.width};
    height: ${token.header.user.menu.item.icon.width};
    color: ${token.tab['context-menu'].item.icon.color};

    & > svg {
        width: 100%;
        height: 100%;
    }
`;

const usernameStyle = css`
    font-size: ${token.header.user.name["font-size"]};
    color: ${token.header.user.name.color};
    font-weight: ${token.header.user.name["font-weight"]};
    white-space: nowrap;

    @media (max-width: 640px) {
        display: none;
    }
`;

const userInfoStyle = css`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 0;
    line-height: 1.15;

    @media (max-width: 640px) {
        display: none;
    }
`;

const userRoleStyle = css`
    margin-top: 2px;
    font-size: calc(${token.tab["font-size"]} - 2px);
    color: ${token.header['nav-btn'].color};
    white-space: nowrap;
`;

const userInfoSkeletonStyle = css`
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    width: 76px;

    @media (max-width: 640px) {
        display: none;
    }
`;

const avatarStyle = css`
    ${avatarVars['size.small.width']}: ${token.header.user.avatar.width};
    ${avatarVars['size.small.font-size']}: ${token.header.user.avatar['font-size']};
    ${avatarVars['icon.small.font-size']}: ${token.header.user.avatar.icon.width};
    ${avatarVars['default.background-color']}: ${token.header.user.avatar['background-color']};
    ${avatarVars['default.color']}: ${token.header.user.avatar.color};
    & > span:has(> img), & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

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
                        activeKey={activeTabKey}
                        onChange={onTabChange}
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
                <button
                    ref={menuButtonRef}
                    type="button"
                    className={navBtnStyle}
                    onClick={onMenuToggle}
                    aria-label="Toggle sidebar"
                    aria-expanded={!menuToggled}
                    aria-pressed={menuToggled}
                >
                    <MenuIcon />
                </button>
                {mobileTitle ? <span className={mobileTitleStyle}>{mobileTitle}</span> : null}
                {breadcrumbs?.length ? (
                    <Breadcrumbs className={breadcrumbsStyle} items={breadcrumbs} />
                ) : null}
                <div className={toolbarSpacerStyle} />
                {onFullscreenToggle ? (
                    <button
                        type="button"
                        className={navBtnStyle}
                        onClick={onFullscreenToggle}
                        aria-label={fullscreenActive ? "Exit fullscreen" : "Enter fullscreen"}
                        aria-pressed={fullscreenActive}
                    >
                        {fullscreenActive ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
                    </button>
                ) : null}
                <button className={navBtnStyle} onClick={onBell} aria-label="Notifications">
                    <BellIcon />
                    {hasNotification ? <span className={notificationDotStyle} aria-hidden /> : null}
                </button>
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
                        aria-label={userLoading ? "Loading user" : (typeof resolvedUser.name === "string" ? resolvedUser.name : "User menu")}
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
                                    {resolvedUser.name ? <span className={usernameStyle}>{resolvedUser.name}</span> : null}
                                    {resolvedUser.roleName ? <span className={userRoleStyle}>{resolvedUser.roleName}</span> : null}
                                </span>
                            ) : null}
                            {userLoading ? (
                                <Skeleton variant="avatar" width={token.header.user.avatar.width} height={token.header.user.avatar.width} aria-hidden />
                            ) : (
                                <Avatar size="small" className={avatarStyle} aria-label="用户头像" aria-hidden>
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
                            aria-label="User actions"
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
                                切换角色
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
                                退出登录
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
};

export default Header;
