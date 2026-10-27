import { useControllableValue } from '@crab-dev/rc-hooks';
import { type Key, type FC, type HTMLAttributes, type MouseEvent, type KeyboardEvent } from "react";
import { type Item } from "./type.js";
import VerticalMenu from "./vertical/index.js";
import HorizontalMenu from "./horizontal/index.js";


export interface MenuSelectionChangeDetails {
    reason: 'select' | 'deselect';
    item: Item;
    event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
}

export interface MenuOpenKeysChangeDetails {
    reason: 'expand' | 'collapse';
    item: Item;
    event?: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | Event;
}

interface BaseMenuProps extends Omit<HTMLAttributes<HTMLUListElement>, "onClick"> {

    /**
     * 垂直、水平、和内嵌模式三种, 默认情况下为垂直模式 `vertical`
     */
    mode?: "vertical" | "horizontal" | "inline"

/**
     * 菜单内容
     */
    items?: Item[]

    /**
     * 仅在 `vertical` / `inline` 模式下生效：是否将菜单收起为仅图标宽度。
     * 收起状态下顶层子菜单通过浮层展开，其他项悬停显示 Tooltip。
     *
     * @default false
     */
    inlineCollapsed?: boolean

    /**
     * 选中时, 进行调用
     */
    onSelectedKeysChange?: (selectedKeys: Key[], details: MenuSelectionChangeDetails) => void

    /**
     * 展开/关闭的回调
     */
    onOpenKeysChange?: (openKeys: Key[], details: MenuOpenKeysChangeDetails) => void

    /**
     * 点击事件
     */
    onClick?: (param: {
        event: MouseEvent<HTMLElement>,
        item: Item,
    }) => void
}

export type MenuProps = BaseMenuProps &
    ({ /** 受控的选中键集合 */ selectedKeys?: Key[]; defaultSelectedKeys?: never } | { selectedKeys?: never; /** 仅初始化的选中键集合 */ defaultSelectedKeys?: Key[] }) &
    ({ /** 受控的展开键集合 */ openKeys?: Key[]; defaultOpenKeys?: never } | { openKeys?: never; /** 仅初始化的展开键集合 */ defaultOpenKeys?: Key[] });

const Menu: FC<MenuProps> = ({
    mode = "vertical",
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys = [],
    onSelectedKeysChange,
    openKeys: openKeysProp,
    defaultOpenKeys = [],
    onOpenKeysChange,
    items,
    inlineCollapsed,
    ...props
}) => {
    const [selectedKeys, setSelectedKeys] = useControllableValue<Key[], [MenuSelectionChangeDetails]>({ value: selectedKeysProp, defaultValue: defaultSelectedKeys, onValueChange: onSelectedKeysChange });
    const [openKeys, setOpenKeys] = useControllableValue<Key[], [MenuOpenKeysChangeDetails]>({ value: openKeysProp, defaultValue: defaultOpenKeys, onValueChange: onOpenKeysChange });
    const stateProps = { selectedKeys, onSelectedKeysChange: setSelectedKeys, openKeys, onOpenKeysChange: setOpenKeys };
    if (mode === "vertical" || mode === "inline") {
        return (
            <VerticalMenu
                {...stateProps}
                items={items}
                inlineCollapsed={inlineCollapsed}
                {...props}
            />
        )
    } else if (mode === "horizontal") {
        return (
            <HorizontalMenu
                {...stateProps}
                items={items}
                {...props}
            />
        )
    } else {
        throw new Error(`[${mode}] The parameter \`mode\` is incorrect, please check.`)
    }
}

export default Menu;
