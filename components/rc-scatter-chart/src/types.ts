import type { CSSProperties, Ref } from 'react';
import type { ScatterChartPalette } from './palette.js';

/** 一次观测在两个数值维度上的读数。 */
export interface ScatterChartPoint {
    /** 横轴数值。 */
    x: number;
    /** 纵轴数值。 */
    y: number;
    /** 标识该观测的可读名称，例如样本编号。 */
    label?: string;
}

export interface ScatterChartSeries {
    /** 图例和数据表中显示的系列名称。 */
    name: string;
    /** 坐标对。任一坐标非有限的观测会被跳过，其余点保留原始下标。 */
    data: readonly ScatterChartPoint[];
    /** 覆盖该系列的主题色。 */
    color?: string;
}

/** 点击或用键盘激活观测点时传给回调的详情。 */
export interface ScatterPointClickInfo {
    seriesIndex: number;
    pointIndex: number;
    seriesName: string;
    /** 调用方传入的原始观测对象。 */
    point: ScatterChartPoint;
}

export interface ScatterChartProps {
    /** 按输入顺序绘制前八个系列，每条系列可以有不同的横坐标和样本数。 */
    series: readonly ScatterChartSeries[];
    /** 画布宽度（px），默认 600。传 auto 时跟随父容器宽度。 */
    width?: number | 'auto';
    /** 画布高度（px），默认 320，图例高度另计。 */
    height?: number;
    /** 局部覆盖图表的语义色板。 */
    palette?: Partial<ScatterChartPalette>;
    /** 格式化横轴刻度和观测的横坐标读数。 */
    formatX?: (value: number) => string;
    /** 格式化纵轴刻度和观测的纵坐标读数。 */
    formatY?: (value: number) => string;
    /** 用指针或键盘激活数据点时触发。 */
    onPointClick?: (info: ScatterPointClickInfo) => void;
    /** 说明图表内容的无障碍名称。 */
    'aria-label'?: string;
    /** 图例名称，以及系列、观测和两个坐标维度的文案。 */
    labels?: { legend?: string; series?: string; point?: string; x?: string; y?: string };
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
}
