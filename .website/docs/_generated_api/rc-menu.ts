/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLElement = DocsTypePlaceholder;
type Item = DocsTypePlaceholder;
type Key = DocsTypePlaceholder;
type MouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type OnSelectItemParam = DocsTypePlaceholder;

export interface MenuPropsSearchIndex {
    /**
     * 垂直、水平、和内嵌模式三种, 默认情况下为垂直模式 `vertical`
     * @default "vertical"
     */
    "mode"?: "vertical" | "horizontal" | "inline";

    /**
     * 当前展开的 Menu 节点
     */
    "openKeys"?: Key[];

    /**
     * 当前选中的菜单项 key 数组
     */
    "selectedKeys"?: Key[];

    /**
     * 菜单内容
     */
    "items"?: Item[];

    /**
     * 仅在 `vertical` / `inline` 模式下生效：是否将菜单收起为仅图标宽度。 收起状态下顶层子菜单通过浮层展开，其他项悬停显示 Tooltip。
     */
    "inlineCollapsed"?: boolean;

    /**
     * 选中时, 进行调用
     */
    "onSelectItem"?: (param: OnSelectItemParam) => void;

    /**
     * 展开/关闭的回调
     */
    "onOpenChange"?: (openKeys: Key[]) => void;

    /**
     * 点击事件
     */
    "onClick"?: (param: { event: MouseEvent<HTMLElement>; item: Item; }) => void;
}
