import { css, cx } from "@linaria/core";
import { useEffect, useRef, useState } from "react";
import type { FC, Key, HTMLAttributes } from "react";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { AnimatePresence, motion } from "motion/react";
import Breadcrumbs, { type BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";
import Skeleton from "@crab-dev/rc-skeleton";

import token from "./token.js";
import TabBar, { TabItem } from "./tabBar.js";
import type { HeaderUserEntity } from "./types.js";
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
    box-shadow: ${token.header.shadow};
    z-index: ${token.header['z-index']};
    box-sizing: border-box;
    flex-shrink: 0;
`;

const tabStripStyle = css`
    display: flex;
    align-items: flex-end;
    background-color: ${token.tab.strip.background.color};
    padding: ${token.tab.strip.padding};
    min-height: ${token.tab.strip.height};
    box-sizing: border-box;

    @media (max-width: 767px) {
        display: none;
    }
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.header.toolbar.gap};
    height: ${token.header.toolbar.height};
    padding: ${token.header.toolbar.padding};
    background-color: ${token.header.toolbar.background.color};
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
        font-size: ${token.header.user.name.font.size};
        font-weight: 600;
        color: ${token.header.user.name.color};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const dividerStyle = css`
    width: 1px;
    height: 20px;
    background-color: ${token.header.divider.color};
    margin: 0 6px;
    flex-shrink: 0;

    @media (max-width: 767px) {
        display: none;
    }
`;

const navBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: ${token.header['nav-btn'].size};
    height: ${token.header['nav-btn'].size};
    border-radius: ${token.header['nav-btn'].border.radius};
    color: ${token.header['nav-btn'].color};
    cursor: pointer;
    flex-shrink: 0;
    background: transparent;
    border: none;
    padding: 0;
    transition: color 160ms ease, background-color 160ms ease, transform 160ms ease;

    &:hover {
        color: ${token.header['nav-btn']['color-hover']};
        background-color: ${token.header['nav-btn'].background['color-hover']};
    }

    &:active {
        background-color: ${token.header['nav-btn'].background['color-active']};
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
        width: 18px;
        height: 18px;
    }
`;

const notificationDotStyle = css`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${token.header['nav-btn'].dot.color};
    box-shadow: 0 0 0 2px ${token.header.toolbar.background.color};
    pointer-events: none;
`;

const userPillStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.header.user.pill.gap};
    padding: ${token.header.user.pill.padding};
    border-radius: ${token.header.user.pill.border.radius};
    background: transparent;
    border: none;
    cursor: pointer;
    user-select: none;
    transition: background-color 160ms ease;

    &:hover {
        background-color: ${token.header.user.pill.background['color-hover']};
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    @media (max-width: 767px) {
        padding: 4px;
    }
`;

const userMenuWrapStyle = css`
    position: relative;
    display: inline-flex;
`;

const userMenuStyle = css`
    min-width: ${token.tab['context-menu']['min-width']};
    padding: ${token.tab['context-menu'].padding};
    background-color: ${token.tab['context-menu'].background.color};
    border: 1px solid ${token.tab['context-menu'].border.color};
    border-radius: ${token.tab['context-menu'].border.radius};
    box-shadow: ${token.tab['context-menu'].shadow};
    z-index: ${token.tab['context-menu']['z-index']};
    box-sizing: border-box;
    transform-origin: top center;
    will-change: transform, opacity;
`;

const userMenuItemStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tab['context-menu'].item.gap};
    width: 100%;
    height: ${token.tab['context-menu'].item.height};
    padding: ${token.tab['context-menu'].item.padding};
    border: none;
    border-radius: ${token.tab['context-menu'].item.border.radius};
    background: transparent;
    color: ${token.tab['context-menu'].item.color};
    font-size: ${token.tab['context-menu'].item.font.size};
    text-align: left;
    white-space: nowrap;
    cursor: pointer;

    &:hover {
        background-color: ${token.tab['context-menu'].item.background['color-hover']};
    }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -2px;
    }
`;

const userMenuItemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.tab['context-menu'].item.icon.size};
    height: ${token.tab['context-menu'].item.icon.size};
    color: ${token.tab['context-menu'].item.icon.color};

    & > svg {
        width: 100%;
        height: 100%;
    }
`;

const usernameStyle = css`
    font-size: ${token.header.user.name.font.size};
    color: ${token.header.user.name.color};
    font-weight: ${token.header.user.name.font.weight};
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
    font-size: calc(${token.tab.font.size} - 2px);
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.header.user.avatar.size};
    height: ${token.header.user.avatar.size};
    font-size: ${token.header.user.avatar.font.size};
    font-weight: 600;
    border-radius: 50%;
    background-color: ${token.header.user.avatar.background.color};
    color: ${token.header.user.avatar.color};
    overflow: hidden;
    flex-shrink: 0;

    & > img {
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
    const userMenuCloseTimerRef = useRef<number | null>(null);
    const canShowUserMenu = !userLoading && userMenuOpen;
    const { refs, floatingStyles } = useFloating({
        placement: "bottom",
        strategy: "absolute",
        transform: false,
        open: canShowUserMenu,
        onOpenChange: setUserMenuOpen,
        middleware: [
            offset(0),
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
                <div className={tabStripStyle}>
                    <TabBar
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
                <div className={dividerStyle} aria-hidden />
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
                    <button
                        ref={refs.setReference}
                        type="button"
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
                            <Skeleton variant="avatar" width={token.header.user.avatar.size} height={token.header.user.avatar.size} aria-hidden />
                        ) : (
                            <span className={avatarStyle}>{resolvedUser.avatar}</span>
                        )}
                    </button>
                    <AnimatePresence>
                        {canShowUserMenu ? (
                            <motion.div
                                ref={refs.setFloating}
                                className={userMenuStyle}
                                style={floatingStyles}
                                role="menu"
                                aria-label="User actions"
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={userMenuItemStyle}
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        onSwitchRole?.();
                                    }}
                                >
                                    <span className={userMenuItemIconStyle} aria-hidden>
                                        <SwitchRoleIcon />
                                    </span>
                                    切换角色
                                </button>
                                <button
                                    type="button"
                                    role="menuitem"
                                    className={userMenuItemStyle}
                                    onClick={() => {
                                        setUserMenuOpen(false);
                                        onLogout?.();
                                    }}
                                >
                                    <span className={userMenuItemIconStyle} aria-hidden>
                                        <LogoutIcon />
                                    </span>
                                    退出登录
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
