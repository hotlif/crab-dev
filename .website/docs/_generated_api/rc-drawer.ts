// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DrawerOpenChangeDetails = DocsTypePlaceholder;
type DrawerPlacement = DocsTypePlaceholder;
type DrawerSize = DocsTypePlaceholder;
type KeyboardEvent = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SyntheticEvent = DocsTypePlaceholder;

export interface DrawerProps {
    /**
     * 关闭前回调。返回 `false` 或 resolve 为 `false` 时可阻止关闭。
     */
    "onClose"?: (event: SyntheticEvent | KeyboardEvent) => boolean | Promise<boolean> | void | Promise<void>;

    /**
     * 抽屉标题
     */
    "title"?: ReactNode;

    /**
     * 抽屉底部操作区
     */
    "footer"?: ReactNode;

    /**
     * 弹出位置
     * @default "right"
     */
    "placement"?: DrawerPlacement;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    "size"?: DrawerSize;

    /**
     * 是否展示关闭图标按钮
     * @default true
     */
    "closable"?: boolean;

    /**
     * 点击遮罩是否关闭
     * @default true
     */
    "maskClosable"?: boolean;

    /**
     * 关闭后是否卸载内容
     * @default true
     */
    "shouldResetContent"?: boolean;

    /**
     * 关闭按钮的无障碍标签
     * @default "Close"
     */
    "closeLabel"?: string;

    /**
     * 暂无说明。 与 defaultOpen 互斥，不能同时提供。
     */
    "open"?: boolean;

    /**
     * 暂无说明。 与 open 互斥，不能同时提供。
     */
    "defaultOpen"?: boolean;

    /**
     * 暂无说明。
     */
    "onOpenChange"?: ((open: boolean, details: DrawerOpenChangeDetails) => void);
}
