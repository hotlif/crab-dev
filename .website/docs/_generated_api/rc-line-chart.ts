// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type LineChartPalette = DocsTypePlaceholder;
type LineChartReferenceLine = DocsTypePlaceholder;
type LineChartSeries = DocsTypePlaceholder;
type Partial<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type PointClickInfo = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface LineChartProps {
    /**
     * 横轴类目，依照传入的顺序等距排列。
     */
    "categories": readonly string[];

    /**
     * 最多绘制前八条系列，按原始系列顺序分配颜色。
     */
    "series": readonly LineChartSeries[];

    /**
     * 对主题色板的局部覆盖。
     */
    "palette"?: Partial<LineChartPalette>;

    /**
     * 画布宽度（px），传 auto 跟随容器宽度，默认 600。
     */
    "width"?: number | 'auto';

    /**
     * 画布高度（px），默认 320，图例高度另计。
     */
    "height"?: number;

    /**
     * 目标、阈值等水平参考线。
     */
    "referenceLines"?: readonly LineChartReferenceLine[];

    /**
     * 格式化提示、数据表和默认刻度值。
     */
    "formatValue"?: (value: number) => string;

    /**
     * 单独格式化纵轴刻度，默认沿用 formatValue。
     */
    "formatAxisValue"?: (value: number) => string;

    /**
     * 点击数据点或用键盘激活时触发。
     */
    "onPointClick"?: (info: PointClickInfo) => void;

    /**
     * 无障碍数据表的标题。
     */
    "aria-label"?: string;

    /**
     * 覆盖图例名称和数据表的类目列表头。
     */
    "labels"?: { legend?: string; category?: string; };

    /**
     * 暂无说明。
     */
    "className"?: string;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties;

    /**
     * 暂无说明。
     */
    "ref"?: Ref<HTMLDivElement>;
}
