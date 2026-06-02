import { type HTMLAttributes, type FC, useState, useEffect, type Key, type ReactNode } from "react";
import { cx, css } from "@linaria/core";
import RcMenu, { MenuItem } from "@crab-dev/rc-menu";
import Skeleton from "@crab-dev/rc-skeleton";
import token from "./token.js";
import type { HeaderUserEntity } from "./types.js";

export interface SidebarBodyProps {
    logo?: ReactNode
    title?: ReactNode
    onLogoClick?: () => void
    loadMenus?: (headerUser?: HeaderUserEntity) => Promise<MenuItem[]>
    onMenuItemClick?: (param: { item: MenuItem; path: MenuItem[] }) => void
    collapsed?: boolean
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title">, SidebarBodyProps {}

const sidebarStyle = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: ${token.sidebar.width};
    padding: ${token.sidebar.padding};
    gap: ${token.sidebar.gap};
    background-color: ${token.sidebar.background.color};
    border-inline-end: 1px solid ${token.sidebar.border.color};
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden auto;
    transition:
        width 300ms cubic-bezier(0, 0, 0.2, 1),
        padding 300ms cubic-bezier(0, 0, 0.2, 1);

    &[data-collapsed="true"] {
        width: ${token.sidebar.collapsed.width};
        padding: ${token.sidebar.collapsed.padding};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const logoRowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.sidebar.logo.gap};
    padding: ${token.sidebar.logo.padding};
    cursor: pointer;
    user-select: none;
    min-width: 0;
`;

const logoRowCollapsedStyle = css`
    justify-content: center;
    gap: 0;
    padding-inline: 0;
`;

const logoStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.sidebar.logo.size};
    height: ${token.sidebar.logo.size};
    border-radius: ${token.sidebar.logo.border.radius};
    background-color: ${token.sidebar.logo.background.color};
    color: ${token.sidebar.logo.color};
    flex-shrink: 0;

    & > svg {
        width: 60%;
        height: 60%;
    }

    & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const logoTitleStyle = css`
    font-size: ${token.sidebar.logo.title.font.size};
    color: ${token.sidebar.logo.title.color};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const menuWrapStyle = css`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const menuSkeletonWrapStyle = css`
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
`;

const menuSkeletonItemStyle = css`
    display: inline-flex;
`;

/**
 * 侧边栏内容体（logo 区 + 菜单），不含容器样式。
 * 可在桌面端 Sidebar 和移动端 Drawer 中共用。
 */
export const SidebarBody: FC<SidebarBodyProps> = ({
    logo,
    title,
    onLogoClick,
    loadMenus,
    onMenuItemClick,
    collapsed = false,
}) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [menuLoading, setMenuLoading] = useState(false);
    const [openKeys, setOpenKeys] = useState<Key[]>([]);

    useEffect(() => {
        if (!loadMenus) {
            setMenuLoading(false);
            return;
        }
        let cancelled = false;
        setMenuLoading(true);
        void loadMenus()
            .then((items) => {
                if (!cancelled) {
                    setMenuItems(items);
                    setMenuLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setMenuItems([]);
                    setMenuLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [loadMenus]);

    return (
        <>
            {logo || title ? (
                <div
                    className={cx(logoRowStyle, collapsed && logoRowCollapsedStyle)}
                    onClick={onLogoClick}
                    role="button"
                    aria-label="Logo"
                >
                    {logo ? <span className={logoStyle}>{logo}</span> : null}
                    {title && !collapsed ? <span className={logoTitleStyle}>{title}</span> : null}
                </div>
            ) : null}
            <div className={menuWrapStyle}>
                {menuLoading ? (
                    <div className={menuSkeletonWrapStyle} aria-hidden>
                        <span className={menuSkeletonItemStyle}><Skeleton variant="text" width="90%" size="medium" /></span>
                        <span className={menuSkeletonItemStyle}><Skeleton variant="text" width="82%" size="medium" /></span>
                        <span className={menuSkeletonItemStyle}><Skeleton variant="text" width="86%" size="medium" /></span>
                        <span className={menuSkeletonItemStyle}><Skeleton variant="text" width="74%" size="medium" /></span>
                        <span className={menuSkeletonItemStyle}><Skeleton variant="text" width="80%" size="medium" /></span>
                    </div>
                ) : (
                    <RcMenu
                        inlineCollapsed={collapsed}
                        openKeys={openKeys}
                        onOpenChange={setOpenKeys}
                        items={menuItems}
                        onClick={({ item }) => {
                            if (!onMenuItemClick) return;
                            const path = findMenuPath(menuItems, item.key);
                            onMenuItemClick({ item, path });
                        }}
                    />
                )}
            </div>
        </>
    );
};

const Sidebar: FC<SidebarProps> = ({
    className,
    loadMenus,
    logo,
    title,
    onLogoClick,
    onMenuItemClick,
    collapsed,
    ...restProps
}) => {
    return (
        <aside
            className={cx(sidebarStyle, className)}
            data-collapsed={collapsed ? "true" : "false"}
            {...restProps}
        >
            <SidebarBody
                logo={logo}
                title={title}
                onLogoClick={onLogoClick}
                loadMenus={loadMenus}
                onMenuItemClick={onMenuItemClick}
                collapsed={collapsed}
            />
        </aside>
    );
}

function findMenuPath(items: MenuItem[], key: Key): MenuItem[] {
    for (const item of items) {
        if (item.key === key) return [item];
        if (item.children?.length) {
            const sub = findMenuPath(item.children, key);
            if (sub.length) return [item, ...sub];
        }
    }
    return [];
}

export default Sidebar;
