import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * 骨架形状。
 * - `text`：文本行占位；支持 `rows` 多行
 * - `rect`：矩形块；常用于图片、卡片占位
 * - `circle`：圆形；常用于头像
 * - `button`：按钮占位
 * - `avatar`：头像占位（圆形 + 预设尺寸）
 * - `image`：图片占位（矩形 + 预设长宽比）
 */
export type SkeletonVariant = "text" | "rect" | "circle" | "button" | "avatar" | "image";

/**
 * 尺寸阶梯，仅作用于 `text` 变体的行高。
 * 其它变体的尺寸通过 `width` / `height` 控制。
 */
export type SkeletonSize = "small" | "medium" | "large";

/**
 * 占位动画形态。
 * - `pulse`：透明度脉动（稳态，性能开销最小）
 * - `wave`：高亮带从左向右扫过
 */
export type SkeletonAnimation = "pulse" | "wave";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    /**
     * 骨架形状
     * @default "text"
     */
    variant?: SkeletonVariant;

    /**
     * 尺寸阶梯（仅作用于 `text` 变体）
     * @default "medium"
     */
    size?: SkeletonSize;

    /**
     * 显式宽度。数字按像素处理；字符串原样下发。
     */
    width?: number | string;

    /**
     * 显式高度。数字按像素处理；字符串原样下发。
     */
    height?: number | string;

    /**
     * `text` 变体的行数；最后一行自动变短以模拟段落排版。
     * @default 1
     */
    rows?: number;

    /**
     * 是否强制圆角为 pill（常用于按钮 / 胶囊占位）
     * @default false
     */
    round?: boolean;

    /**
     * 是否启用动画。关闭后骨架以静态背景展示。
     * @default true
     */
    active?: boolean;

    /**
     * 动画形态
     * @default "pulse"
     */
    animation?: SkeletonAnimation;

    /**
     * 是否处于加载态。为 `false` 时渲染 `children`。
     * @default true
     */
    loading?: boolean;

    /**
     * 加载完成后要渲染的真实内容
     */
    children?: ReactNode;

    /**
     * 透传到容器根节点的内联样式（不推荐在组件层使用；仅在变量桥接时使用）
     */
    style?: CSSProperties;
}
