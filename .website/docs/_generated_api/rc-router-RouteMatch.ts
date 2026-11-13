// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Handle = DocsTypePlaceholder;
type Params = DocsTypePlaceholder;

export interface RouteMatch {
    /**
     * 暂无说明。
     */
    "id": string;

    /**
     * 暂无说明。
     */
    "pathname": string;

    /**
     * 暂无说明。
     */
    "pathnameBase": string;

    /**
     * 暂无说明。
     */
    "params": Params;

    /**
     * 暂无说明。
     */
    "handle": Handle | undefined;
}
