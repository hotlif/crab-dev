/**
 * 柱状图绘制层色板。
 *
 * 默认色板保持旧视觉；语义色板消费本包 L3 token。rc-canvas 会在所在
 * DOM 主题继承上下文中解析 CSS var / color-mix / 系统色后交给 WebGL。
 */

import { parseColor } from '@crab-dev/rc-canvas';
import token from './token.js';

export interface BarChartPalette {
    series: readonly string[];
    gridline: string;
    baseline: string;
    axisLabel: string;
    canvasBackground: string;
}

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

export const DEFAULT_BAR_CHART_PALETTE: BarChartPalette = {
    series: CATEGORICAL_PALETTE,
    gridline: 'oklch(0.9055 0.0095 100)',
    baseline: 'oklch(0.8118 0.0152 102.51)',
    axisLabel: 'oklch(0.660 0.014 286)',
    canvasBackground: '#ffffff',
};

export const SEMANTIC_BAR_CHART_PALETTE: BarChartPalette = {
    series: [
        token.palette.series.blue.color,
        token.palette.series.orange.color,
        token.palette.series.aqua.color,
        token.palette.series.yellow.color,
        token.palette.series.magenta.color,
        token.palette.series.green.color,
        token.palette.series.violet.color,
        token.palette.series.red.color,
    ],
    gridline: token.palette.gridline.color,
    baseline: token.palette.baseline.color,
    axisLabel: token.palette['axis-label'].color,
    canvasBackground: token.palette.canvas['background-color'],
};

export function mergeBarChartPalette(palette?: Partial<BarChartPalette>): BarChartPalette {
    if (!palette) return DEFAULT_BAR_CHART_PALETTE;
    const series = palette.series
        ? DEFAULT_BAR_CHART_PALETTE.series.map((fallback, index) => palette.series?.[index] ?? fallback)
        : DEFAULT_BAR_CHART_PALETTE.series;
    return { ...DEFAULT_BAR_CHART_PALETTE, ...palette, series };
}

export function resolveSeriesColor(
    explicitColor: string | undefined,
    seriesIndex: number,
    palette: BarChartPalette,
): string {
    return explicitColor ?? palette.series[seriesIndex] ?? CATEGORICAL_PALETTE[seriesIndex]!;
}

export function resolveReferenceLineColor(
    explicitColor: string | undefined,
    palette: BarChartPalette,
): string {
    return explicitColor ?? palette.axisLabel;
}

/** 支持的最大系列数，超出部分不渲染并在开发期告警 */
export const MAX_SERIES = CATEGORICAL_PALETTE.length;

/** 图表基底（网格 / 基线 / 轴文本 / 悬停背景）用色 */
export const CHART_INK: {
    readonly gridline: string;
    readonly baseline: string;
    readonly axisLabel: string;
} = {
    /** 横向网格线（hairline，退居背景） */
    gridline: DEFAULT_BAR_CHART_PALETTE.gridline,
    /** 零值基线（比网格线深一档） */
    baseline: DEFAULT_BAR_CHART_PALETTE.baseline,
    /** 轴文本（= semantic color.text.secondary → global zinc.500 的字面量） */
    axisLabel: DEFAULT_BAR_CHART_PALETTE.axisLabel,
} as const;

const dimCache = new Map<string, string>();

function parseLiteralColor(value: string): readonly [number, number, number] | null {
    const normalized = value.trim();
    let supportedSyntax = normalized === 'transparent'
        || /^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(normalized);
    if (/^rgba?\([^%]+\)$/i.test(normalized) && normalized.includes(',')) {
        const parts = normalized.replace(/^rgba?\(/i, '').replace(/\)$/, '').split(',');
        supportedSyntax = (parts.length === 3 || parts.length === 4)
            && parts.every(part => Number.isFinite(Number(part.trim())));
    } else if (/^oklch\([^%]+\)$/i.test(normalized)) {
        const [channels, alpha] = normalized.replace(/^oklch\(/i, '').replace(/\)$/, '').split('/');
        const parts = channels?.trim().split(/\s+/) ?? [];
        supportedSyntax = parts.length === 3
            && parts.every(part => Number.isFinite(Number(part)))
            && (alpha === undefined || Number.isFinite(Number(alpha.trim())));
    }
    if (!supportedSyntax) return null;
    const [red, green, blue] = parseColor(normalized);
    return [red, green, blue].every(Number.isFinite) ? [red, green, blue] : null;
}

/**
 * 把系列色向画布背景混合为「不透明的淡化色」：keep ∈ (0, 1]，1 为原色。
 * 用不透明混色而非 opacity 淡化，柱体与其圆角补丁矩形的重叠区不会
 * 因半透明叠加出现深色条带。keep 量化到 1/64，限制补间期间的缓存增长。
 */
export function dimColor(
    color: string,
    keep: number,
    canvasBackground: string = DEFAULT_BAR_CHART_PALETTE.canvasBackground,
): string {
    const q = Math.min(1, Math.max(0, Math.round(keep * 64) / 64));
    if (q === 1) return color;
    const key = `${color}|${q}|${canvasBackground}`;
    const hit = dimCache.get(key);
    if (hit) return hit;
    let out: string;
    const foregroundChannels = parseLiteralColor(color);
    const backgroundChannels = parseLiteralColor(canvasBackground);
    if (foregroundChannels && backgroundChannels) {
        const [r, g, b] = foregroundChannels;
        const [bgR, bgG, bgB] = backgroundChannels;
        const mix = (component: number, background: number) =>
            Math.round((background + (component - background) * q) * 255);
        out = `rgb(${mix(r, bgR)}, ${mix(g, bgG)}, ${mix(b, bgB)})`;
    } else {
        out = `color-mix(in oklch, ${color} ${q * 100}%, ${canvasBackground})`;
    }
    dimCache.set(key, out);
    return out;
}

export function resolveDimmedBarColor(
    color: string,
    keep: number,
    palette: BarChartPalette,
): string {
    return dimColor(color, keep, palette.canvasBackground);
}
