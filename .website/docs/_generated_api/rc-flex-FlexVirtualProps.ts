// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type FlexVirtualOptions = DocsTypePlaceholder;

export interface FlexVirtualProps {
    /**
     * 数据数量、项目尺寸与按索引渲染的回调。
     */
    "virtual": FlexVirtualOptions;

    /**
     * 横纵间距，单位为 px，默认 0，末项之后不留间距。
     */
    "gap"?: number;

    /**
     * 每行卡片在可用宽度内的水平对齐方式。
     */
    "justify"?: CSSProperties['justifyContent'];

    /**
     * 虚拟集合使用 list 语义，每个挂载项报告它在全集中的位置。
     */
    "role"?: 'list';

    /**
     * 虚拟集合沿纵向滚动。
     */
    "direction"?: never;

    /**
     * 每行容纳的项目数量由 itemWidth 和容器宽度决定。
     */
    "wrap"?: never;

    /**
     * 每个虚拟行使用 itemHeight 指定的高度。
     */
    "align"?: never;

    /**
     * 虚拟条目由 renderItem 按需渲染。
     */
    "children"?: never;
}
