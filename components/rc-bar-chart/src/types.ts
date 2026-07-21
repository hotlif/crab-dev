import type { CSSProperties, Ref } from 'react';

/** 单个数据系列 */
export interface BarChartSeries {

    /** 系列名，用于图例、悬浮提示与数据表 */
    name: string;

    /** 数据值，与 categories 按下标一一对应；缺位按 0 处理 */
    data: number[];

    /** 自定义系列色（任意可求值颜色字面量）；缺省按分类色板顺序分配 */
    color?: string;
}

/** 横向参考线（均值 / 目标线等） */
export interface BarChartReferenceLine {

    /** 参考值（值轴数值域），自动纳入刻度值域，保证线始终落在图内 */
    value: number;

    /** 线右端的标签文本；缺省显示 formatValue(value) */
    label?: string;

    /** 线与标签颜色（任意可求值颜色字面量）；缺省用轴文本色 */
    color?: string;
}

/** 点击柱子时的回调信息 */
export interface BarClickInfo {
    categoryIndex: number;
    seriesIndex: number;
    category: string;
    seriesName: string;
    value: number;
}

export interface BarChartProps {

    /** 类目标签（x 轴） */
    categories: string[];

    /** 数据系列，最多 8 个；超出部分不渲染并在开发期告警 */
    series: BarChartSeries[];

    /**
     * 画布宽度（px，含坐标轴）
     * @default 600
     */
    width?: number;

    /**
     * 画布高度（px，含坐标轴；图例与空态另计）
     * @default 320
     */
    height?: number;

    /**
     * 堆叠模式；关闭时多系列在类目内并列分组。
     * 堆叠时正值向上、负值向下分别累计。
     * @default false
     */
    stacked?: boolean;

    /**
     * 柱几何过渡动画：入场时从零值基线生长，数据变化时平滑补间到新高度。
     * 系统偏好「减弱动态」(prefers-reduced-motion: reduce) 时自动降级为直接呈现。
     * @default true
     */
    animate?: boolean;

    /**
     * 在柱的数据端显示数值标签（堆叠模式显示各类目的正 / 负向合计）。
     * 空间不足以容纳而会互相叠压的标签自动省略。
     * @default false
     */
    showValues?: boolean;

    /** 横向参考线（均值 / 目标线等），以虚线绘制并纳入值轴刻度域 */
    referenceLines?: BarChartReferenceLine[];

    /** 数值格式化，作用于 y 轴刻度、悬浮提示与数据表 */
    formatValue?: (value: number) => string;

    /** 点击柱子时触发；提供后柱子呈现 pointer 光标 */
    onBarClick?: (info: BarClickInfo) => void;

    /** 图表的无障碍名称，作为隐藏数据表的 caption */
    'aria-label'?: string;

    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
}
