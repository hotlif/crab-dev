import { type Key, type FC, type HTMLAttributes } from "react";
import { type Item } from "./type";
import VerticalMenu from "./vertical";
import HorizontalMenu from "./horizontal";


interface OnSelectItemParam {
    item: Item,
    selectedKeys: Key[]
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLUListElement>, "onClick"> {
    
    /**
     * 垂直、水平、和内嵌模式三种, 默认情况下为垂直模式 `vertical`
     */
    mode?: "vertical" | "horizontal" | "inline"

    /**
     * 当前展开的 Menu 节点
     */
    openKeys?: Key[]

    /**
     * 当前选中的菜单项 key 数组
     */
    selectedKeys?: Key[]

    /**
     * 菜单内容
     */
    items?: Item[]

    /**
     * 选中时, 进行调用
     */
    onSelectItem?: (param: OnSelectItemParam) => void

    /**
     * 展开/关闭的回调
     */
    onOpenChange?: (openKeys: Key[]) => void

    /**
     * 点击事件
     */
    onClick?: (param: {
        event: React.MouseEvent<HTMLElement>,
        item: Item,
    }) => void
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
    } else if (mode === "horizontal") {
        return (
            <HorizontalMenu
                selectedKeys={selectedKeys}
                items={items}
                {...props}   
            />
        )
    } else {
        throw new Error(`[${mode}] The parameter \`mode\` is incorrect, please check.`)
    }
}

export default Menu;
