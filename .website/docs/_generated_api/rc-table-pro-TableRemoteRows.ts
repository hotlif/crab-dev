// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type T = DocsTypePlaceholder;
type TableBlockRequest<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface TableRemoteRows {
    /**
     * 返回请求范围内的连续行、完整匹配总数，以及可选服务端汇总。
     */
    "request": TableBlockRequest<T>;

    /**
     * 每块行数。默认 100。
     */
    "blockSize"?: number;

    /**
     * 保留的块数。默认 8，至少保留视口当前所需的块。
     */
    "maxCachedBlocks"?: number;

    /**
     * 同一查询允许的并发请求数。默认 2。
     */
    "maxConcurrentRequests"?: number;

    /**
     * 切换数据集时更改此值，开始新的查询并回到首行。
     */
    "cacheKey"?: string | number;

    /**
     * 全部行的固定高度（px）。缺省时跟随表格密度。
     */
    "rowHeight"?: number;
}
