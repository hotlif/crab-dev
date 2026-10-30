// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type DividerSpacing = DocsTypePlaceholder;
type DividerTextAlign = DocsTypePlaceholder;
type DividerVariant = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface DividerProps {
    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 线型, 默认 solid
     */
    "variant"?: DividerVariant;

    /**
     * 线两侧的留白, 默认 medium
     */
    "spacing"?: DividerSpacing;

    /**
     * 暂无说明。
     */
    "direction"?: 'horizontal' | 'vertical';

    /**
     * 暂无说明。 与 children、textAlign、textOffset、plain 互斥，不能同时提供。
     */
    "decorative"?: boolean;

    /**
     * 暂无说明。 与 decorative 互斥，不能同时提供。
     */
    "children"?: ReactNode;

    /**
     * 暂无说明。 与 decorative 互斥，不能同时提供。
     */
    "textAlign"?: DividerTextAlign;

    /**
     * 暂无说明。 与 decorative 互斥，不能同时提供。
     */
    "textOffset"?: number | string;

    /**
     * 暂无说明。 与 decorative 互斥，不能同时提供。
     */
    "plain"?: boolean;
}
