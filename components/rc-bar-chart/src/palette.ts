/**
 * 绘制层颜色常量。
 *
 * WebGL 渲染无法解析 CSS 变量，rc-canvas 的颜色入参必须是可求值的颜色
 * 字面量（与 rc-flow-diagram 同一先例），因此绘制层颜色不走 token.ts
 * （其产物为 CSS var 映射）；HTML 层（图例 / 悬浮提示）样式仍走设计令牌。
 */

/**
 * 分类系列色板（≤ 8 系列）。
 *
 * 取自经色觉障碍模拟验证的分类色板（相邻对 CVD ΔE ≥ 8）：
 * 顺序即安全机制，按序分配、不得循环复用；超出 8 个系列应在数据层
 * 合并为「其他」或拆分为多张小图。
 */
export const CATEGORICAL_PALETTE = [
    'oklch(0.5753 0.1626 255.53)', // blue
    'oklch(0.6708 0.175 40.64)',   // orange
    'oklch(0.669 0.1408 162.11)',  // aqua
    'oklch(0.7644 0.1612 75.12)',  // yellow
    'oklch(0.7163 0.1412 357.39)', // magenta
    'oklch(0.5285 0.1798 142.5)',  // green
    'oklch(0.4331 0.1671 283.62)', // violet
    'oklch(0.6226 0.1909 24.91)',  // red
] as const;

/** 支持的最大系列数，超出部分不渲染并在开发期告警 */
export const MAX_SERIES = CATEGORICAL_PALETTE.length;

/** 图表基底（网格 / 基线 / 轴文本 / 悬停背景）用色 */
export const CHART_INK = {
    /** 横向网格线（hairline，退居背景） */
    gridline: 'oklch(0.9055 0.0095 100)',
    /** 零值基线（比网格线深一档） */
    baseline: 'oklch(0.8118 0.0152 102.51)',
    /** 轴文本（= semantic color.text.secondary → global zinc.500 的字面量） */
    axisLabel: 'oklch(0.660 0.014 286)',
    /** 悬停类目列的背景水洗色 */
    hoverWash: 'oklch(0.9055 0.0095 100 / 0.45)',
} as const;
