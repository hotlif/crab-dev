/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type BarChartReferenceLine = DocsTypePlaceholder;
type BarChartSeries = DocsTypePlaceholder;
type BarClickInfo = DocsTypePlaceholder;
type CSSProperties = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface BarChartPropsSearchIndex {
    /**
     * 柱几何过渡动画：入场时从零值基线生长，数据变化时平滑补间到新高度。 系统偏好「减弱动态」(prefers-reduced-motion: reduce) 时自动降级为直接呈现。
     * @default true
     */
    "animate"?: boolean;

    /**
     * 图表的无障碍名称，作为隐藏数据表的 caption
     */
    "aria-label"?: string;

    /**
     * 类目标签（x 轴）
     */
    "categories": string[];

    /**
     * 暂无说明。
     */
    "className"?: string;

    /**
     * 数值格式化，作用于 y 轴刻度、悬浮提示与数据表
     */
    "formatValue"?: (value: number) => string;

    /**
     * 画布高度（px，含坐标轴；图例与空态另计）
     * @default 320
     */
    "height"?: number;

    /**
     * 点击柱子时触发；提供后柱子呈现 pointer 光标
     */
    "onBarClick"?: (info: BarClickInfo) => void;

    /**
     * 轴向：`vertical` 类目沿横轴、柱纵向生长；`horizontal` 类目沿纵轴、 条横向生长（类目名较长时更耐读）。
     * @default 'vertical'
     */
    "orientation"?: 'vertical' | 'horizontal';

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;

    /**
     * 横向参考线（均值 / 目标线等），以虚线绘制并纳入值轴刻度域
     */
    "referenceLines"?: BarChartReferenceLine[];

    /**
     * 数据系列，最多 8 个；超出部分不渲染并在开发期告警
     */
    "series": BarChartSeries[];

    /**
     * 在柱的数据端显示数值标签（堆叠模式显示各类目的正 / 负向合计）。 空间不足以容纳而会互相叠压的标签自动省略。
     * @default false
     */
    "showValues"?: boolean;

    /**
     * 堆叠模式；关闭时多系列在类目内并列分组。 堆叠时正值向上、负值向下分别累计。
     * @default false
     */
    "stacked"?: boolean;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties;

    /**
     * 画布宽度（px，含坐标轴）；传 `'auto'` 时跟随父容器宽度 （内部复用 `@crab-dev/rc-auto-sizer`，父容器需有确定宽度）。
     * @default 600
     */
    "width"?: number | 'auto';
}
