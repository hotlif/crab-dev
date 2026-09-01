/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DrawerPlacement = DocsTypePlaceholder;
type DrawerSize = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SyntheticEvent = DocsTypePlaceholder;

export interface DrawerPropsSearchIndex {
    /**
     * 是否展示关闭图标按钮
     * @default true
     */
    "closable"?: boolean;

    /**
     * 关闭按钮的无障碍标签
     * @default "Close"
     */
    "closeLabel"?: string;

    /**
     * 抽屉底部操作区
     */
    "footer"?: ReactNode;

    /**
     * 点击遮罩是否关闭
     * @default true
     */
    "maskClosable"?: boolean;

    /**
     * 关闭前回调。返回 `false` 或 resolve 为 `false` 时可阻止关闭。
     */
    "onClose"?: (event: SyntheticEvent) => boolean | Promise<boolean> | void | Promise<void>;

    /**
     * 打开状态改变时触发
     */
    "onOpenChange": (open: boolean) => void;

    /**
     * 是否打开抽屉
     */
    "open": boolean;

    /**
     * 弹出位置
     * @default "right"
     */
    "placement"?: DrawerPlacement;

    /**
     * 关闭后是否卸载内容
     * @default true
     */
    "shouldResetContent"?: boolean;

    /**
     * 尺寸阶梯
     * @default "medium"
     */
    "size"?: DrawerSize;

    /**
     * 抽屉标题
     */
    "title"?: ReactNode;
}
