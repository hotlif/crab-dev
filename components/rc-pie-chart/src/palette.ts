import token from './token.js';

/** 画布和图例共享的分类色板。 */
export interface PieChartPalette {
    /** 按原始数据下标循环取色。局部覆盖可保留其余分类的主题色。 */
    series: readonly string[];
    /** 绘图区域的表面颜色。 */
    canvasBackground: string;
}

const seriesColors = [
    token.palette.series[1].color,
    token.palette.series[2].color,
    token.palette.series[3].color,
    token.palette.series[4].color,
    token.palette.series[5].color,
    token.palette.series[6].color,
    token.palette.series[7].color,
    token.palette.series[8].color,
] as const;

export const SEMANTIC_PIE_CHART_PALETTE: PieChartPalette = {
    series: seriesColors,
    canvasBackground: token.palette.canvas['background-color'],
};

export function mergePieChartPalette(override?: Partial<PieChartPalette>): PieChartPalette {
    if (!override) return SEMANTIC_PIE_CHART_PALETTE;
    const length = Math.max(seriesColors.length, override.series?.length ?? 0);
    return {
        series: Array.from({ length }, (_, index) =>
            override.series?.[index] ?? seriesColors[index % seriesColors.length]!,
        ),
        canvasBackground: override.canvasBackground ?? SEMANTIC_PIE_CHART_PALETTE.canvasBackground,
    };
}

/** 分类显隐只影响占比，原始下标始终对应同一颜色。 */
export function resolveSliceColor(
    explicitColor: string | undefined,
    index: number,
    palette: PieChartPalette,
): string {
    return explicitColor ?? palette.series[index % palette.series.length]!;
}
