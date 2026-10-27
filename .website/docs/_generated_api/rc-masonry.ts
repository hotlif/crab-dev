// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type ReactElement = DocsTypePlaceholder;

export interface MasonryProps {
    /**
     * 列数，默认为 2
     * @default 2
     */
    "columns"?: number;

    /**
     * 子元素间距（像素），省略时从 `root.gap` 读取最近配置边界的 density 间距。 传入数值（包括 0）时覆盖密度与 token 默认值。
     */
    "gutter"?: number;

    /**
     * 是否按 DOM 顺序从行内起始侧排列（LTR 从左、RTL 从右）， 默认 false，优先放入最短列。
     * @default false
     */
    "sequential"?: boolean;

    /**
     * 瀑布流子项
     */
    "children"?: ReactElement | ReactElement[];
}
