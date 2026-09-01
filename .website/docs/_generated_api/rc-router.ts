/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type RouteObject = DocsTypePlaceholder;
type Window = DocsTypePlaceholder;

export interface RouterPropsSearchIndex {
    /**
     * 暂无说明。
     * @default '/'
     */
    "basename"?: string;

    /**
     * 暂无说明。
     */
    "routes": readonly RouteObject[];

    /**
     * 暂无说明。
     */
    "window"?: Window;
}
