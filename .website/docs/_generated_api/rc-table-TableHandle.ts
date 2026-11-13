// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Key = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TableScrollToRowOptions = DocsTypePlaceholder;

export interface TableHandle {
    /**
     * 定位当前可展示的数据行；不存在或被折叠隐藏时返回 false。 等待虚拟滚动提交后返回 true，不保证浏览器已绘制；不改变横向滚动或焦点。 连续定位以最后一次为准，被替代或卸载时以 AbortError 拒绝。
     */
    "scrollToRow": (rowId: Key, options?: TableScrollToRowOptions) => Promise<boolean>;

    /**
     * 恢复表格内最后一个有效焦点，否则聚焦表格入口；不修改选择或滚动位置。
     */
    "focus": () => void;
}
