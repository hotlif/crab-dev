// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SpinSize = DocsTypePlaceholder;
type SVGSVGElement = DocsTypePlaceholder;

export interface SpinIndicatorProps {
    /**
     * 尺寸。缺省时不写入尺寸变量, 由外层的 --rc-spin-size 决定（可为 1em 等相对值）
     */
    "size"?: SpinSize;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<SVGSVGElement>;
}
