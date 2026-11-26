import type { CSSProperties, Ref } from 'react';
import type { PieChartPalette } from './palette.js';

/** 一个类别及其在整体中的数值。 */
export interface PieChartDatum {
    /** 图例、提示与数据表使用的类目名称。 */
    name: string;
    /** 有限正数参与绘图。其余数据保留在无障碍数据表中。 */
    value: number;
    /** 此项的颜色，优先于调色板。 */
    color?: string;
}

/** 指针或键盘激活扇区时的原始数据及当前占比。 */
export interface SliceClickInfo {
    /** 输入 data 中的原始下标。 */
    index: number;
    name: string;
    value: number;
    /** 该项占当前可见有效数据总量的百分比，范围为 0 至 100。 */
    percentage: number;
}

export interface PieChartProps {
    /** 按输入顺序从十二点方向顺时针排列。 */
    data: readonly PieChartDatum[];
    /** 内外半径之比。默认 0 为实心饼图，正值绘制环形，最高 0.9。 */
    innerRadiusRatio?: number;
    /** 覆盖主题调色板。类目按输入下标循环取色。 */
    palette?: Partial<PieChartPalette>;
    /** 画布宽度（px）。默认 600，传 auto 跟随容器宽度。 */
    width?: number | 'auto';
    /** 画布高度（px），默认 320，图例高度另计。 */
    height?: number;
    /** 格式化提示和数据表中的原始数值。默认跟随最近 Provider 的 locale。 */
    formatValue?: (value: number) => string;
    /** 点击扇区或用键盘激活时触发。 */
    onSliceClick?: (info: SliceClickInfo) => void;
    /** 扇区键盘控件组的名称和无障碍数据表的标题。 */
    'aria-label'?: string;
    /** 覆盖图例名称和数据表的类目、数值、占比列标题。 */
    labels?: { legend?: string; category?: string; value?: string; percentage?: string };
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
}
