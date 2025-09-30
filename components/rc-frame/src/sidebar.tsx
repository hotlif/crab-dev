import { type HTMLAttributes, type FC, useState, useEffect, type Key } from "react";
import {
    width,
    padding,
} from "@crab-dev/styleify";
import { cx, css } from "@linaria/core";
import RcMenu, { MenuItem } from "@crab-dev/rc-menu";

export interface SidebarProps extends Omit< HTMLAttributes<HTMLElement>, ""> {
    loadMenus?: () => Promise<MenuItem[]>
}

const Sidebar: FC<SidebarProps> = ({
    className,
    loadMenus,
    ...restProps
}) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [openKeys, setOpenKeys] = useState<Key[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (loadMenus) {
            setLoading(true);
            loadMenus()
                .then((items) => {
                    setMenuItems(items)
                })
                .finally(() => {
                    setLoading(false)
                });
        }
    }, [])

    return (
        <aside
            className={cx(className, css`
                ${width(64)}
                ${padding(3, "y")}
                ${padding(1, "x")}
                box-sizing: border-box;
                overflow-y: auto;
                border-inline-end: 1px solid rgba(5, 5, 5, 0.06);
            `)}
            {...restProps}
        >
            <RcMenu
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                items={menuItems}
            />
        </aside>
    )
}

export default Sidebar;
