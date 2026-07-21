/**
 * 绘制层颜色常量。
 *
 * WebGL 渲染无法解析 CSS 变量，rc-canvas 的颜色入参必须是可求值的颜色
 * 字面量（与 rc-flow-diagram 同一先例），因此绘制层颜色不走 token.ts
 * （其产物为 CSS var 映射）；HTML 层（图例 / 悬浮提示）样式仍走设计令牌。
 */

import { parseColor } from '@crab-dev/rc-canvas';

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
    /** 悬停类目列的背景水洗色（renderer 修正 alpha 合成后按有效透明度取值） */
    hoverWash: 'oklch(0.9055 0.0095 100 / 0.25)',
} as const;

/** 亮色画布背景假设——与绘制层不响应主题的既有限制同一前提 */
const CANVAS_BG: readonly [number, number, number] = [1, 1, 1];

const dimCache = new Map<string, string>();

/**
 * 把系列色向画布背景混合为「不透明的淡化色」：keep ∈ (0, 1]，1 为原色。
 * 用不透明混色而非 opacity 淡化，柱体与其圆角补丁矩形的重叠区不会
 * 因半透明叠加出现深色条带。keep 量化到 1/64，限制补间期间的缓存增长。
 */
export function dimColor(color: string, keep: number): string {
    const q = Math.min(1, Math.max(0, Math.round(keep * 64) / 64));
    if (q === 1) return color;
    const key = `${color}|${q}`;
    const hit = dimCache.get(key);
    if (hit) return hit;
    const [r, g, b] = parseColor(color);
    const mix = (c: number, bg: number) => Math.round((bg + (c - bg) * q) * 255);
    const out = `rgb(${mix(r, CANVAS_BG[0])}, ${mix(g, CANVAS_BG[1])}, ${mix(b, CANVAS_BG[2])})`;
    dimCache.set(key, out);
    return out;
}
