import { type HTMLAttributes, type FC, useState, useEffect, type Key, type ReactNode } from "react";
import { cx } from "@crab-dev/css";
import { useLocale } from '@crab-dev/rc-config-provider';
import RcMenu from "@crab-dev/rc-menu";
import Button from "@crab-dev/rc-button";
import type { MenuItem } from "@crab-dev/rc-menu";
import Skeleton from "@crab-dev/rc-skeleton";
import type { HeaderUserEntity } from "./types.js";
import { sidebarStyle, logoRowStyle, logoActionStyle, logoRowCollapsedStyle, logoStyle, logoTitleStyle, menuWrapStyle, menuSkeletonWrapStyle, menuSkeletonItemStyle } from "./sidebar.styles.js";
export interface SidebarBodyProps {
    logo?: ReactNode
    title?: ReactNode
    onLogoClick?: () => void
    loadMenus?: (headerUser?: HeaderUserEntity) => Promise<MenuItem[]>
    onMenuItemClick?: (param: { item: MenuItem; path: MenuItem[] }) => void
    /** Layout 提供的受控展示键；不负责业务路由与菜单键推断。 */
    selectedKeys?: Key[]
    collapsed?: boolean
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, "title">, SidebarBodyProps {}

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
    selectedKeys,
    collapsed = false,
}) => {
    const { messages } = useLocale();
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
                onLogoClick ? <Button
                    type="button"
                    appearance="text"
                    className={logoActionStyle}
                    onClick={onLogoClick}
                    aria-label={typeof title === 'string' ? title : messages.appLayout.logo}
                >
                    <span className={cx(logoRowStyle, collapsed && logoRowCollapsedStyle)}>
                        {logo ? <span className={logoStyle}>{logo}</span> : null}
                        {title && !collapsed ? <span className={logoTitleStyle}>{title}</span> : null}
                    </span>
                </Button> : <div
                    className={cx.call(undefined, logoRowStyle, collapsed && logoRowCollapsedStyle)}
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
                        selectedKeys={selectedKeys}
                        openKeys={openKeys}
                        onOpenKeysChange={setOpenKeys}
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
    selectedKeys,
    collapsed,
    ...restProps
}) => {
    return (
        <aside
            className={cx.call(undefined, sidebarStyle, className)}
            data-collapsed={collapsed ? "true" : "false"}
            {...restProps}
        >
            <SidebarBody
                logo={logo}
                title={title}
                onLogoClick={onLogoClick}
                loadMenus={loadMenus}
                onMenuItemClick={onMenuItemClick}
                selectedKeys={selectedKeys}
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
