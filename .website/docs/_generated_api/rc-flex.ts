// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;

export interface FlexLayoutProps {
    /**
     * 主轴方向，默认 row。
     */
    "direction"?: CSSProperties['flexDirection'];

    /**
     * 换行方式，默认 nowrap。
     */
    "wrap"?: CSSProperties['flexWrap'];

    /**
     * 交叉轴对齐方式。
     */
    "align"?: CSSProperties['alignItems'];

    /**
     * 主轴对齐方式。
     */
    "justify"?: CSSProperties['justifyContent'];

    /**
     * 项目间距。数值单位为 px，也可传入 CSS gap 值。
     */
    "gap"?: CSSProperties['gap'];

    /**
     * 保留原有 DOM 层级的布局内容。
     */
    "children"?: ReactNode;

    /**
     * 普通布局直接接收 children。
     */
    "virtual"?: never;
}
