import type { CSSProperties, Ref } from 'react';
import type { LineChartPalette } from './palette.js';

/** 一条按类目顺序绘制的折线。 */
export interface LineChartSeries {
    /** 图例、提示和数据表中显示的系列名。 */
    name: string;
    /** 与 categories 按下标对应。null、非有限值或缺位会使折线在该处断开。 */
    data: readonly (number | null)[];
    /** 系列颜色，优先于调色板。 */
    color?: string;
}

/** 沿值轴定位的水平参考线。 */
export interface LineChartReferenceLine {
    /** 参与值轴范围计算的参考值。 */
    value: number;
    /** 参考线的标签，默认使用 formatValue 格式化参考值。 */
    label?: string;
    /** 参考线及其标签的颜色。 */
    color?: string;
}

/** 指针或键盘激活数据点时的原始数据和下标。 */
export interface PointClickInfo {
    categoryIndex: number;
    seriesIndex: number;
    category: string;
    seriesName: string;
    value: number;
}

export interface LineChartProps {
    /** 横轴类目，依照传入的顺序等距排列。 */
    categories: readonly string[];
    /** 最多绘制前八条系列，按原始系列顺序分配颜色。 */
    series: readonly LineChartSeries[];
    /** 对主题色板的局部覆盖。 */
    palette?: Partial<LineChartPalette>;
    /** 画布宽度（px），传 auto 跟随容器宽度，默认 600。 */
    width?: number | 'auto';
    /** 画布高度（px），默认 320，图例高度另计。 */
    height?: number;
    /** 目标、阈值等水平参考线。 */
    referenceLines?: readonly LineChartReferenceLine[];
    /** 格式化提示、数据表和默认刻度值。 */
    formatValue?: (value: number) => string;
    /** 单独格式化纵轴刻度，默认沿用 formatValue。 */
    formatAxisValue?: (value: number) => string;
    /** 点击数据点或用键盘激活时触发。 */
    onPointClick?: (info: PointClickInfo) => void;
    /** 无障碍数据表的标题。 */
    'aria-label'?: string;
    /** 覆盖图例名称和数据表的类目列表头。 */
    labels?: { legend?: string; category?: string };
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
}
