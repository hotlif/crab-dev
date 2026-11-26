import token from './token.js';

export interface ScatterChartPalette {
    /** 系列按输入顺序取色。局部覆盖保留其余系列的主题色。 */
    series: readonly string[];
    gridline: string;
    baseline: string;
    axisLabel: string;
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

export const MAX_SERIES: number = seriesColors.length;

export const SEMANTIC_SCATTER_CHART_PALETTE: ScatterChartPalette = {
    series: seriesColors,
    gridline: token.palette.gridline.color,
    baseline: token.palette.baseline.color,
    axisLabel: token.palette['axis-label'].color,
    canvasBackground: token.palette.canvas['background-color'],
};

export function mergeScatterChartPalette(override?: Partial<ScatterChartPalette>): ScatterChartPalette {
    if (!override) return SEMANTIC_SCATTER_CHART_PALETTE;
    return {
        ...SEMANTIC_SCATTER_CHART_PALETTE,
        ...override,
        series: seriesColors.map((fallback, index) => override.series?.[index] ?? fallback),
    };
}
