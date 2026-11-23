// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type AbortSignal = DocsTypePlaceholder;
type Readonly<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Record<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type SortColumn = DocsTypePlaceholder;

export interface TableBlockQuery {
    /**
     * 暂无说明。
     */
    "filters": Readonly<Record<string, string>>;

    /**
     * 暂无说明。
     */
    "keyword"?: string;

    /**
     * 暂无说明。
     */
    "startIndex": number;

    /**
     * 暂无说明。
     */
    "endIndex": number;

    /**
     * 暂无说明。
     */
    "sort": readonly SortColumn[];

    /**
     * 暂无说明。
     */
    "signal": AbortSignal;
}
