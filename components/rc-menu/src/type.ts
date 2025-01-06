import { ReactNode, type Key } from "react";

export enum ItemType {
    // 单个元素
    Item = "item",
    // 带有分组信息的元素
    ItemGroup = "itemGroup",
}

/**
 * 菜单的类型
 */
export interface Item {
    /**
     * 项的类型。
     */
    type: ItemType;

    /**
     * 显示在项旁边的图标。
     */
    icon?: ReactNode;

    /**
     * 项的标题。
     */
    title?: string;

    /**
     * 项的唯一键。
     */
    key: Key;

    /**
     * 此项的子项。
     */
    children?: Item[];
}
