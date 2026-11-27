// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type Partial<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ScatterChartPalette = DocsTypePlaceholder;
type ScatterChartSeries = DocsTypePlaceholder;
type ScatterPointClickInfo = DocsTypePlaceholder;

export interface ScatterChartProps {
    /**
     * 按输入顺序绘制前八个系列，每条系列可以有不同的横坐标和样本数。
     */
    "series": readonly ScatterChartSeries[];

    /**
     * 画布宽度（px），默认 600。传 auto 时跟随父容器宽度。
     */
    "width"?: number | 'auto';

    /**
     * 画布高度（px），默认 320，图例高度另计。
     */
    "height"?: number;

    /**
     * 局部覆盖图表的语义色板。
     */
    "palette"?: Partial<ScatterChartPalette>;

    /**
     * 格式化横轴刻度和观测的横坐标读数。
     */
    "formatX"?: (value: number) => string;

    /**
     * 格式化纵轴刻度和观测的纵坐标读数。
     */
    "formatY"?: (value: number) => string;

    /**
     * 用指针或键盘激活数据点时触发。
     */
    "onPointClick"?: (info: ScatterPointClickInfo) => void;

    /**
     * 说明图表内容的无障碍名称。
     */
    "aria-label"?: string;

    /**
     * 图例名称，以及系列、观测和两个坐标维度的文案。
     */
    "labels"?: { legend?: string; series?: string; point?: string; x?: string; y?: string; };

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
