// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactNode = DocsTypePlaceholder;
type ReadonlyMap<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type T = DocsTypePlaceholder;
type TableRowRange = DocsTypePlaceholder;

export interface TableIndexedRows {
    /**
     * 暂无说明。
     */
    "count": number;

    /**
     * 暂无说明。
     */
    "rows": ReadonlyMap<number, T>;

    /**
     * 行高（px），缺省时跟随表格密度。
     */
    "rowHeight"?: number;

    /**
     * 在虚拟视口提交后通知，适用于外部按需补全行数据。
     */
    "onRangeChange"?: (range: TableRowRange) => void;

    /**
     * 缺少该坐标的数据时渲染占位内容。
     */
    "renderPlaceholder"?: (rowIndex: number, range: TableRowRange) => ReactNode;
}
