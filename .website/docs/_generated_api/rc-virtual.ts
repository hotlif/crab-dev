/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactNode = DocsTypePlaceholder;
type RefObject<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type VirtualHandle = DocsTypePlaceholder;

export interface VirtualPropsSearchIndex {
    /**
     * 每列的宽度数组，单位为 px
     */
    "gridTemplateColumns": number[];

    /**
     * 每行的高度数组，单位为 px
     */
    "gridTemplateRows": number[];

    /**
     * 可视区域宽度，单位为 px
     */
    "viewportWidth": number;

    /**
     * 可视区域高度，单位为 px
     */
    "viewportHeight": number;

    /**
     * 可视区顶部被常驻（sticky）内容占据的高度，单位为 px。 例如表格在滚动容器内渲染的固定表头 / 过滤栏：它们占用可视区却不在 gridTemplateRows 中， 因此需要计入纵向滚动总高度，否则末尾内容会被裁切且无法滚动到底。
     */
    "reservedTopHeight"?: number;

    /**
     * 可视区底部被常驻（sticky）内容占据的高度，单位为 px。 例如表格底部固定的汇总 / 合计行：它贴在可视区底部却不在 gridTemplateRows 中， 因此需要计入纵向滚动总高度，否则末尾数据行会被汇总行遮挡且无法滚动出来。
     */
    "reservedBottomHeight"?: number;

    /**
     * 可视范围上下额外渲染的行数，默认 0
     */
    "overscanRowCount"?: number;

    /**
     * 可视范围左右额外渲染的列数，默认 0
     */
    "overscanColumnCount"?: number;

    /**
     * 渲染回调，根据当前可见的行列范围返回对应的 ReactNode
     */
    "renderRows": (rowRange: [ number, number ], columnRange: [ number, number ]) => ReactNode;

    /**
     * 组件实例引用，可通过 scrollToCell 和 getScrollCellPosition 编程式控制滚动
     */
    "gridRef"?: RefObject<VirtualHandle | null>;
}
