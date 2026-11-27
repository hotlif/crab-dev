/** 折线、命中区域和坐标轴共用同一套 CSS 像素坐标。 */
export const CHART_METRICS = {
    fontSize: 12,
    axisLabelGap: 8,
    valueLabelSize: 11,
    valueLabelGap: 4,
    plotTopPad: 8,
    xAxisBand: 24,
} as const;

interface LayoutOptions {
    width: number;
    height: number;
    categories: readonly string[];
    series: readonly { data: readonly (number | null)[] }[];
    formatValue: (value: number) => string;
    referenceValues?: readonly number[];
}

export interface LinePoint {
    x: number;
    y: number;
    value: number;
    categoryIndex: number;
    seriesIndex: number;
}

interface LineChartTick {
    value: number;
    pos: number;
    label: string;
}

export interface LineChartLayout {
    plotLeft: number;
    plotRight: number;
    plotTop: number;
    plotBottom: number;
    zeroPos: number;
    ticks: LineChartTick[];
    tickLabels: LineChartTick[];
    bands: { start: number; center: number; size: number }[];
    categoryLabels: { categoryIndex: number; x: number; label: string }[];
    points: LinePoint[];
    segments: { from: LinePoint; to: LinePoint }[];
    referencePositions: (number | null)[];
}

let measureContext: OffscreenCanvasRenderingContext2D | null | undefined;
const fullWidth = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/;

export function measureLabelWidth(text: string, fontSize: number): number {
    if (measureContext === undefined) {
        try {
            measureContext = new OffscreenCanvas(1, 1).getContext('2d');
        } catch {
            measureContext = null;
        }
    }
    if (measureContext) {
        measureContext.font = `${fontSize}px system-ui`;
        return measureContext.measureText(text).width;
    }
    let em = 0;
    for (const character of text) em += fullWidth.test(character) ? 1 : 0.6;
    return em * fontSize;
}

/** 按 Unicode 码点裁短，画布之外的图例、提示及数据表仍使用原文。 */
export function fitCategoryLabel(text: string, maxWidth: number): string {
    const fontSize = CHART_METRICS.fontSize;
    if (measureLabelWidth(text, fontSize) <= maxWidth) return text;
    if (measureLabelWidth('…', fontSize) > maxWidth) return '';
    const characters = Array.from(text);
    let low = 0;
    let high = characters.length;
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        const prefix = characters.slice(0, middle).join('');
        if (measureLabelWidth(prefix + '…', fontSize) <= maxWidth) low = middle;
        else high = middle - 1;
    }
    return characters.slice(0, low).join('') + '…';
}

/** 选择 1、2、5 × 10ⁿ 的刻度步长，零值始终在域内。 */
function makeTicks(min: number, max: number): number[] {
    if (min === 0 && max === 0) max = 1;
    const targetStep = Math.max(Number.MIN_VALUE, max / 5 - min / 5);
    const magnitude = Math.max(Number.MIN_VALUE, 10 ** Math.floor(Math.log10(targetStep)));
    const scaled = targetStep / magnitude;
    const factor = [1, 2, 5, 10].find(candidate => candidate >= scaled) ?? 10;
    const step = factor * magnitude;
    const first = Math.floor(min / step);
    const last = Math.ceil(max / step);
    const ticks: number[] = [];
    for (let i = first; i <= last; i++) {
        const rounded = Number((i * step).toPrecision(14));
        // 对齐后的端点可能超出 JS 可表示范围，保留原始有限极值。
        let value = Number.isFinite(rounded) ? rounded : i < 0 ? min : max;
        if (i === first) value = Math.min(min, value);
        if (i === last) value = Math.max(max, value);
        ticks.push(value === 0 ? 0 : value);
    }
    return ticks;
}

function finiteValue(value: number | null | undefined): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

export function computeLayout({
    width, height, categories, series, formatValue, referenceValues = [],
}: LayoutOptions): LineChartLayout {
    let min = 0;
    let max = 0;
    for (const item of series) {
        for (let i = 0; i < Math.min(item.data.length, categories.length); i++) {
            const value = item.data[i];
            if (finiteValue(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
    }
    for (const value of referenceValues) {
        if (finiteValue(value)) {
            min = Math.min(min, value);
            max = Math.max(max, value);
        }
    }

    const values = makeTicks(min, max);
    const labels = values.map(value => formatValue(value));
    const { fontSize, axisLabelGap, plotTopPad, xAxisBand } = CHART_METRICS;
    const widest = Math.max(...labels.map(label => measureLabelWidth(label, fontSize)));
    const endpointPad = (text: string) =>
        Math.min(width / 6, 64, Math.ceil(measureLabelWidth(text, fontSize) / 2));
    const plotLeft = Math.min(width, Math.max(
        24, Math.min(width / 3, Math.ceil(widest)) + axisLabelGap,
        endpointPad(categories[0] ?? ''),
    ));
    const plotRight = Math.max(plotLeft, width - Math.max(8, endpointPad(categories.at(-1) ?? '')));
    const plotTop = Math.min(height, plotTopPad);
    const plotBottom = Math.max(plotTop, height - xAxisBand);
    const lower = values[0];
    const upper = values[values.length - 1];
    const span = upper - lower;
    const yFor = (value: number) => {
        const fraction = Number.isFinite(span)
            ? (value - lower) / span
            : (value / 2 - lower / 2) / (upper / 2 - lower / 2);
        return plotBottom - fraction * (plotBottom - plotTop);
    };
    const ticks = values.map((value, index) => ({
        value, pos: Math.round(yFor(value)), label: fitCategoryLabel(labels[index], plotLeft - axisLabelGap),
    }));
    const tickGap = Math.max(1, Math.ceil((fontSize + 2) * (ticks.length - 1) / Math.max(1, plotBottom - plotTop)));
    const tickLabels = ticks.filter((tick, index) => tick.label && index % tickGap === 0);

    const plotWidth = plotRight - plotLeft;
    const spacing = categories.length > 1 ? plotWidth / (categories.length - 1) : plotWidth;
    const bands = categories.map((_, index) => {
        const center = plotLeft + (categories.length === 1 ? plotWidth / 2 : index * spacing);
        const start = Math.max(plotLeft, center - spacing / 2);
        return { start, center, size: Math.min(plotRight, center + spacing / 2) - start };
    });
    const stride = Math.max(1, Math.ceil((fontSize * 3) / Math.max(1, spacing)));
    const categoryLabels = categories.flatMap((text, categoryIndex) => {
        if (categoryIndex % stride !== 0) return [];
        const x = bands[categoryIndex].center;
        const available = Math.min(spacing * stride - axisLabelGap, 2 * x, 2 * (width - x));
        const label = fitCategoryLabel(text, available);
        return label ? [{ categoryIndex, x, label }] : [];
    });

    const points: LinePoint[] = [];
    const segments: { from: LinePoint; to: LinePoint }[] = [];
    const previous: (LinePoint | undefined)[] = [];
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        for (let seriesIndex = 0; seriesIndex < series.length; seriesIndex++) {
            const value = series[seriesIndex].data[categoryIndex];
            if (!finiteValue(value)) {
                previous[seriesIndex] = undefined;
                continue;
            }
            const point = { categoryIndex, seriesIndex, value, x: bands[categoryIndex].center, y: yFor(value) };
            const from = previous[seriesIndex];
            if (from) segments.push({ from, to: point });
            points.push(point);
            previous[seriesIndex] = point;
        }
    }
    return {
        plotLeft, plotRight, plotTop, plotBottom, zeroPos: yFor(0),
        ticks, tickLabels, bands, categoryLabels, points, segments,
        referencePositions: referenceValues.map(value => finiteValue(value) ? yFor(value) : null),
    };
}
