import type { ReactNode, Key } from "react";

export enum ItemType {
    // 单个元素
    Item,
    // 带有分组信息的元素
    ItemGroup,
}

/**
 * 菜单的类型
 */
export interface Item {

    /**
     * 用户绑定的数据
     */
    data?: unknown;

    /**
     * 类型
     */
    type: ItemType;

    /**
     * 图标
     */
    icon?: ReactNode;

    /**
     * 标题
     */
    title?: string;

    /**
     * 唯一键
     */
    key: Key;

    /**
     * 子节点信息
     */
    children?: Item[];
}
