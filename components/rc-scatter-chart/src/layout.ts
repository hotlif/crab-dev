import type { ScatterChartPoint, ScatterChartSeries } from './types.js';

export const CHART_METRICS = {
    fontSize: 12,
    axisLabelGap: 8,
    plotTopPad: 8,
    xAxisBand: 24,
} as const;

interface LayoutOptions {
    width: number;
    height: number;
    series: readonly ScatterChartSeries[];
    formatX: (value: number) => string;
    formatY: (value: number) => string;
    xTitle?: string;
    yTitle?: string;
}

export interface ScatterPlotPoint {
    x: number;
    y: number;
    valueX: number;
    valueY: number;
    label?: string;
    seriesIndex: number;
    pointIndex: number;
}

interface Tick {
    value: number;
    pos: number;
    label: string;
}

interface AxisTitle {
    x: number;
    y: number;
    label: string;
}

export interface ScatterChartLayout {
    plotLeft: number;
    plotRight: number;
    plotTop: number;
    plotBottom: number;
    xTicks: Tick[];
    yTicks: Tick[];
    xTickLabels: Tick[];
    yTickLabels: Tick[];
    xTitle: AxisTitle | null;
    yTitle: AxisTitle | null;
    points: ScatterPlotPoint[];
}

let measureContext: OffscreenCanvasRenderingContext2D | null | undefined;
const fullWidth = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/;

function measureLabel(text: string): number {
    if (measureContext === undefined) {
        try {
            measureContext = new OffscreenCanvas(1, 1).getContext('2d');
        } catch {
            measureContext = null;
        }
    }
    if (measureContext) {
        measureContext.font = `${CHART_METRICS.fontSize}px system-ui`;
        return measureContext.measureText(text).width;
    }
    let em = 0;
    for (const character of text) em += fullWidth.test(character) ? 1 : 0.6;
    return em * CHART_METRICS.fontSize;
}

function fitTitle(title: string | undefined, width: number): string {
    if (!title) return '';
    if (measureLabel(title) <= width) return title;
    if (measureLabel('…') > width) return '';
    const characters = Array.from(title);
    let low = 0;
    let high = characters.length;
    while (low < high) {
        const middle = Math.ceil((low + high) / 2);
        if (measureLabel(characters.slice(0, middle).join('') + '…') <= width) low = middle;
        else high = middle - 1;
    }
    return characters.slice(0, low).join('') + '…';
}

/** 两轴分别从有效点取域，只在所有坐标相等时向两端扩展。 */
function niceTicks(min: number, max: number): number[] {
    if (min > max) return [0, 1];
    if (min === max) {
        const pad = min === 0 ? 1 : Math.max(Number.MIN_VALUE, Math.abs(min) / 20);
        min = Math.max(-Number.MAX_VALUE, min - pad);
        max = Math.min(Number.MAX_VALUE, max + pad);
    }
    const span = max - min;
    const target = Math.max(Number.MIN_VALUE, Number.isFinite(span) ? span / 5 : max / 5 - min / 5);
    const exponent = Math.floor(Math.log10(target));
    const magnitude = Math.max(Number.MIN_VALUE, 10 ** exponent);
    const factor = [1, 2, 5, 10].find(value => value * magnitude >= target) ?? 10;
    const step = magnitude * factor;
    const first = Math.floor(min / step);
    const last = Math.ceil(max / step);
    // 极大偏移上的微小跨度可能无法用可精确递增的整数刻度序号表达。
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first === last) return [min, max];
    const ticks: number[] = [];
    for (let i = first; i <= last; i++) {
        const raw = i * step;
        // 消除 0.1 等十进制步长的乘法误差，保留大偏移上的有效位数。
        const rounded = exponent < 0 && exponent >= -100 ? Number(raw.toFixed(-exponent)) : raw;
        let value = Number.isFinite(rounded) ? rounded : i < 0 ? min : max;
        if (i === first) value = Math.min(value, min);
        if (i === last) value = Math.max(value, max);
        if (ticks.at(-1) !== value) ticks.push(value === 0 ? 0 : value);
    }
    return ticks;
}

function makeScale(values: number[], start: number, end: number): (value: number) => number {
    const min = values[0];
    const max = values[values.length - 1];
    const span = max - min;
    return value => {
        const ratio = Number.isFinite(span)
            ? (value - min) / span
            : (value / 2 - min / 2) / (max / 2 - min / 2);
        return start + ratio * (end - start);
    };
}

function fitHorizontalLabels(ticks: Tick[], widths: number[], width: number): Tick[] {
    const candidates = ticks.map((tick, i) => ({
        tick, left: tick.pos - widths[i] / 2, right: tick.pos + widths[i] / 2,
    })).filter(({ tick, left, right }) => tick.label && left >= 0 && right <= width);
    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    if (!first) return [];
    const selected = [first.tick];
    if (first === last || first.right + 4 > last.left) return selected;
    let previousRight = first.right;
    for (const { tick, left, right } of candidates.slice(1, -1)) {
        if (left >= previousRight + 4 && right + 4 <= last.left) {
            selected.push(tick);
            previousRight = right;
        }
    }
    selected.push(last.tick);
    return selected;
}

export function isFinitePoint(point: ScatterChartPoint | null | undefined): point is ScatterChartPoint {
    return point != null && Number.isFinite(point.x) && Number.isFinite(point.y);
}

export function computeLayout({
    width, height, series, formatX, formatY, xTitle: horizontalTitle, yTitle: verticalTitle,
}: LayoutOptions): ScatterChartLayout {
    const points: ScatterPlotPoint[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    series.forEach((item, seriesIndex) => {
        item.data.forEach((point, pointIndex) => {
            if (!isFinitePoint(point)) return;
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
            points.push({ x: 0, y: 0, valueX: point.x, valueY: point.y, label: point.label, seriesIndex, pointIndex });
        });
    });
    const valuesX = niceTicks(minX, maxX);
    const valuesY = niceTicks(minY, maxY);
    const labelsX = valuesX.map(value => formatX(value));
    const labelsY = valuesY.map(value => formatY(value));
    const widthsX = labelsX.map(measureLabel);
    const widthsY = labelsY.map(measureLabel);
    const { fontSize, axisLabelGap } = CHART_METRICS;
    const plotLeft = Math.min(width, Math.max(
        24, Math.min(Math.ceil(Math.max(...widthsY)), width / 3) + axisLabelGap,
        Math.min(width / 6, Math.ceil(widthsX[0] / 2)),
    ));
    const rightPad = Math.max(8, Math.min(width / 6, Math.ceil(widthsX[widthsX.length - 1] / 2)));
    const plotRight = Math.max(plotLeft, width - rightPad);
    const titleBand = fontSize + 4;
    const titleRoom = height - CHART_METRICS.xAxisBand - CHART_METRICS.plotTopPad - 2 * fontSize;
    const xLabel = titleRoom >= titleBand ? fitTitle(horizontalTitle, plotRight - plotLeft) : '';
    const xTitle = xLabel ? { x: (plotLeft + plotRight) / 2, y: height - titleBand / 2, label: xLabel } : null;
    const yLabel = titleRoom - (xTitle ? titleBand : 0) >= titleBand ? fitTitle(verticalTitle, width - 8) : '';
    const yLabelHalf = measureLabel(yLabel) / 2;
    const yTitle = yLabel ? {
        x: Math.min(width - 4 - yLabelHalf, Math.max(plotLeft, 4 + yLabelHalf)),
        y: titleBand / 2,
        label: yLabel,
    } : null;
    const plotTop = Math.min(height, CHART_METRICS.plotTopPad + (yTitle ? titleBand : 0));
    const plotBottom = Math.max(plotTop, height - CHART_METRICS.xAxisBand - (xTitle ? titleBand : 0));
    const xFor = makeScale(valuesX, plotLeft, plotRight);
    const yFor = makeScale(valuesY, plotBottom, plotTop);
    for (const point of points) {
        point.x = xFor(point.valueX);
        point.y = yFor(point.valueY);
    }
    const xTicks = valuesX.map((value, i) => ({ value, label: labelsX[i], pos: xFor(value) }));
    const yTicks = valuesY.map((value, i) => ({ value, label: labelsY[i], pos: yFor(value) }));
    const xTickLabels = height - plotBottom >= fontSize + axisLabelGap ? fitHorizontalLabels(xTicks, widthsX, width) : [];
    let previousY = Infinity;
    const yTickLabels = yTicks.filter((tick, i) => {
        if (!tick.label || widthsY[i] > plotLeft - axisLabelGap || tick.pos < fontSize / 2
            || tick.pos + fontSize / 2 > height || previousY - tick.pos < fontSize + 2) return false;
        previousY = tick.pos;
        return true;
    });
    return { plotLeft, plotRight, plotTop, plotBottom, xTicks, yTicks, xTickLabels, yTickLabels, xTitle, yTitle, points };
}
