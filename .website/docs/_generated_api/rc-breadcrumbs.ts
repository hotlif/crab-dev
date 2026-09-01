/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type BreadcrumbsItem = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface BreadcrumbsPropsSearchIndex {
    /**
     * 暂无说明。
     * @default '... '
     */
    "ellipsis"?: ReactNode;

    /**
     * 暂无说明。
     */
    "items": BreadcrumbsItem[];

    /**
     * 暂无说明。
     */
    "maxCount"?: number;

    /**
     * 暂无说明。
     * @default '/'
     */
    "separator"?: ReactNode;
}
