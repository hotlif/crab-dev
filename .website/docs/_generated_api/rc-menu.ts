// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLElement = DocsTypePlaceholder;
type Item = DocsTypePlaceholder;
type Key = DocsTypePlaceholder;
type MenuOpenKeysChangeDetails = DocsTypePlaceholder;
type MenuSelectionChangeDetails = DocsTypePlaceholder;
type MouseEvent<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface MenuProps {
    /**
     * 垂直、水平、和内嵌模式三种, 默认情况下为垂直模式 `vertical`
     * @default "vertical"
     */
    "mode"?: "vertical" | "horizontal" | "inline";

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
    "onSelectedKeysChange"?: (selectedKeys: Key[], details: MenuSelectionChangeDetails) => void;

    /**
     * 展开/关闭的回调
     */
    "onOpenKeysChange"?: (openKeys: Key[], details: MenuOpenKeysChangeDetails) => void;

    /**
     * 点击事件
     */
    "onClick"?: (param: { event: MouseEvent<HTMLElement>; item: Item; }) => void;

    /**
     * 受控的选中键集合 与 defaultSelectedKeys 互斥，不能同时提供。
     */
    "selectedKeys"?: Key[];

    /**
     * 暂无说明。 与 selectedKeys 互斥，不能同时提供。
     * @default []
     */
    "defaultSelectedKeys"?: Key[];

    /**
     * 受控的展开键集合 与 defaultOpenKeys 互斥，不能同时提供。
     */
    "openKeys"?: Key[];

    /**
     * 暂无说明。 与 openKeys 互斥，不能同时提供。
     * @default []
     */
    "defaultOpenKeys"?: Key[];
}
