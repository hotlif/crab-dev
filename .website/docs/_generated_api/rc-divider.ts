/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

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

export interface DividerPropsSearchIndex {
    /**
     * 线型, 默认 solid
     */
    "variant"?: DividerVariant;

    /**
     * 线两侧的留白, 默认 middle
     */
    "spacing"?: DividerSpacing;

    /**
     * 根节点 ref
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 方向, 默认 horizontal
     */
    "direction"?: 'horizontal' | 'vertical';

    /**
     * 是否为纯装饰线。为 true 时从无障碍树移除（role=none + aria-hidden）, 读屏不再播报「分隔线」。 当线只是重复了已有的视觉分组时应设为 true, 避免噪声反馈。与 children 互斥
     */
    "decorative"?: boolean;

    /**
     * 嵌在线中的文字, 兼作分节小标题。仅横向分割线支持
     */
    "children"?: ReactNode;

    /**
     * 文字落点, 默认 center。仅在传入 children 时有效
     */
    "textAlign"?: DividerTextAlign;

    /**
     * 文字距起止端的偏移, 仅在 textAlign 为 start / end 时生效。数字按 px 处理, 默认 5%
     */
    "textOffset"?: number | string;

    /**
     * 文字是否降级为正文字重 + 次要色（仅作说明而非小标题时使用）
     */
    "plain"?: boolean;
}
