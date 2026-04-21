import { css, cx } from "@linaria/core";
import type { FC, Key, ReactNode, HTMLAttributes } from "react";
import Breadcrumbs, { type BreadcrumbsItem } from "@crab-dev/rc-breadcrumbs";
import token from "./token.js";
import TabBar, { TabItem } from "./tabBar.js";

interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, ""> {
    /** 用户名 */
    username?: ReactNode
    /** 用户头像 */
    userAvatar?: ReactNode
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
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.header.toolbar.gap};
    height: ${token.header.toolbar.height};
    padding: ${token.header.toolbar.padding};
    background-color: ${token.header.toolbar.background.color};
    box-sizing: border-box;
`;

const toolbarSpacerStyle = css`
    flex: 1;
`;

const breadcrumbsStyle = css`
    min-width: 0;
    flex: 0 1 auto;
    overflow: hidden;
`;

const dividerStyle = css`
    width: 1px;
    height: 20px;
    background-color: ${token.header.divider.color};
    margin: 0 6px;
    flex-shrink: 0;
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

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="14" y2="17" />
    </svg>
);


const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const EnterFullscreenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 3 3 3 3 9" />
        <polyline points="15 21 21 21 21 15" />
        <polyline points="21 9 21 3 15 3" />
        <polyline points="3 15 3 21 9 21" />
    </svg>
);

const ExitFullscreenIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 9 3 9 3 3" />
        <polyline points="15 15 21 15 21 21" />
        <polyline points="21 3 21 9 15 9" />
        <polyline points="3 21 3 15 9 15" />
    </svg>
);

const Header: FC<HeaderProps> = ({
    className,
    username,
    userAvatar,
    onMenuToggle,
    menuToggled,
    onBell,
    hasNotification,
    onUserClick,
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
                <button className={navBtnStyle} onClick={onBell} aria-label="Notifications" disabled={!onBell}>
                    <BellIcon />
                    {hasNotification ? <span className={notificationDotStyle} aria-hidden /> : null}
                </button>
                <div className={dividerStyle} aria-hidden />
                <button
                    type="button"
                    className={userPillStyle}
                    onClick={onUserClick}
                    aria-label={typeof username === "string" ? username : "User menu"}
                >
                    {username ? <span className={usernameStyle}>{username}</span> : null}
                    <span className={avatarStyle}>{userAvatar}</span>
                </button>
            </div>
        </header>
    );
};

export default Header;