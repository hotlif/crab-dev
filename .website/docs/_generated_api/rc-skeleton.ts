/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type SkeletonAnimation = DocsTypePlaceholder;
type SkeletonSize = DocsTypePlaceholder;
type SkeletonVariant = DocsTypePlaceholder;

export interface SkeletonPropsSearchIndex {
    /**
     * 是否启用动画。关闭后骨架以静态背景展示。
     * @default true
     */
    "active"?: boolean;

    /**
     * 动画形态
     * @default "pulse"
     */
    "animation"?: SkeletonAnimation;

    /**
     * 加载完成后要渲染的真实内容
     */
    "children"?: ReactNode;

    /**
     * 显式高度。数字按像素处理；字符串原样下发。
     */
    "height"?: number | string;

    /**
     * 是否处于加载态。为 `false` 时渲染 `children`。
     * @default true
     */
    "loading"?: boolean;

    /**
     * 是否强制圆角为 pill（常用于按钮 / 胶囊占位）
     * @default false
     */
    "round"?: boolean;

    /**
     * `text` 变体的行数；最后一行自动变短以模拟段落排版。
     * @default 1
     */
    "rows"?: number;

    /**
     * 尺寸阶梯（仅作用于 `text` 变体）
     * @default "medium"
     */
    "size"?: SkeletonSize;

    /**
     * 透传到容器根节点的内联样式（不推荐在组件层使用；仅在变量桥接时使用）
     */
    "style"?: CSSProperties;

    /**
     * 骨架形状
     * @default "text"
     */
    "variant"?: SkeletonVariant;

    /**
     * 显式宽度。数字按像素处理；字符串原样下发。
     */
    "width"?: number | string;
}
