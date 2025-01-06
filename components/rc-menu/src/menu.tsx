import { type Key, type FC, type HTMLAttributes } from "react";
import { type Item } from "./type";
import VerticalMenu from "./vertical";

export interface MenuProps extends HTMLAttributes<HTMLUListElement> {
    
    /**
     * 垂直、水平、和内嵌模式三种, 默认情况下为垂直模式 `vertical`
     */
    mode?: "vertical" | "horizontal" | "inline"

    /**
     * 当前选中的菜单项 key 数组
     */
    selectedKeys?: Key[]

    /**
     * 菜单内容
     */
    items?: Item[]
}


const Menu: FC<MenuProps> = ({
    mode = "vertical",
    selectedKeys,
    items,
    ...props
}) => {
    if (mode === "vertical") {
        return (
            <VerticalMenu
                selectedKeys={selectedKeys}
                items={items}
                {...props}
            />
        )

    }
    return null;
}

export default Menu;
