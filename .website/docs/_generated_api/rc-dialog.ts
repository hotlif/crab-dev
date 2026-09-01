/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DialogI18n = DocsTypePlaceholder;
type DialogResultHandler = DocsTypePlaceholder;
type HTMLDialogElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface DialogPropsSearchIndex {
    /**
     * 对话框根元素（原生 dialog）的 ref
     */
    "ref"?: Ref<HTMLDialogElement>;

    /**
     * 国际化内容
     * @default {}
     */
    "i18n"?: DialogI18n;

    /**
     * 标题
     */
    "title"?: ReactNode;

    /**
     * 是否开启
     */
    "open": boolean;

    /**
     * 是否在关闭的时候重置内容
     * @default true
     */
    "shouldResetContent"?: boolean;

    /**
     * 点击遮罩（对话框外部区域）是否触发取消并关闭，默认 `false`
     */
    "maskClosable"?: boolean;

    /**
     * 状态发生改变的时候触发的事件
     */
    "onOpenChange": (open: boolean) => void;

    /**
     * 确定按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭
     */
    "onConfirm"?: DialogResultHandler;

    /**
     * 取消按钮点击时触发的事件，返回 `false` 则保持对话框打开，其余情况关闭
     */
    "onCancel"?: DialogResultHandler;
}
