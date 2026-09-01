/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type HTMLDivElement = DocsTypePlaceholder;
type ProseSize = DocsTypePlaceholder;
type ProseTag = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface ProsePropsSearchIndex {
    /**
     * 根元素的 HTML 标签名
     * @default 'div'
     */
    "as"?: ProseTag;

    /**
     * 是否启用暗色排版（独立于全局 data-theme）
     * @default false
     */
    "invert"?: boolean;

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 排版尺寸变体
     * @default 'base'
     */
    "size"?: ProseSize;
}
