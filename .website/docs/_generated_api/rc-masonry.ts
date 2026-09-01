/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactElement = DocsTypePlaceholder;

export interface MasonryPropsSearchIndex {
    /**
     * 瀑布流子项
     */
    "children"?: ReactElement | ReactElement[];

    /**
     * 列数，默认为 2
     * @default 2
     */
    "columns"?: number;

    /**
     * 子元素间距（像素），默认使用 token 中的 gutter 值。 传入数值时覆盖 token 默认值。
     */
    "gutter"?: number;

    /**
     * 是否按 DOM 顺序排列（从左到右依次放置）， 默认 false，优先放入最短列。
     * @default false
     */
    "sequential"?: boolean;
}
