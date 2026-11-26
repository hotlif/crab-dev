// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type CSSProperties = DocsTypePlaceholder;
type HTMLDivElement = DocsTypePlaceholder;
type Partial<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type PieChartDatum = DocsTypePlaceholder;
type PieChartPalette = DocsTypePlaceholder;
type Ref<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SliceClickInfo = DocsTypePlaceholder;

export interface PieChartProps {
    /**
     * 按输入顺序从十二点方向顺时针排列。
     */
    "data": readonly PieChartDatum[];

    /**
     * 内外半径之比。默认 0 为实心饼图，正值绘制环形，最高 0.9。
     */
    "innerRadiusRatio"?: number;

    /**
     * 覆盖主题调色板。类目按输入下标循环取色。
     */
    "palette"?: Partial<PieChartPalette>;

    /**
     * 画布宽度（px）。默认 600，传 auto 跟随容器宽度。
     */
    "width"?: number | 'auto';

    /**
     * 画布高度（px），默认 320，图例高度另计。
     */
    "height"?: number;

    /**
     * 格式化提示和数据表中的原始数值。默认跟随最近 Provider 的 locale。
     */
    "formatValue"?: (value: number) => string;

    /**
     * 点击扇区或用键盘激活时触发。
     */
    "onSliceClick"?: (info: SliceClickInfo) => void;

    /**
     * 扇区键盘控件组的名称和无障碍数据表的标题。
     */
    "aria-label"?: string;

    /**
     * 覆盖图例名称和数据表的类目、数值、占比列标题。
     */
    "labels"?: { legend?: string; category?: string; value?: string; percentage?: string; };

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
