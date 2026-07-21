/**
 * 布局纯函数：刻度、比例尺与柱矩形计算。
 * 不依赖 React 与渲染层，便于独立单测。
 *
 * 轴向说明：`vertical`（默认）类目沿 x、值沿 y；`horizontal` 类目沿 y、值沿 x。
 * 输出中与轴向相关的坐标统一为「轴向无关」语义：
 * - `ChartTick.pos`：值轴刻度线在值轴方向上的坐标（vertical 为 y，horizontal 为 x）；
 * - `ChartBand.start / size / center`：类目 band 在类目轴方向上的区间；
 * - `zeroPos`：零值基线在值轴方向上的坐标。
 * 柱矩形 `BarRect` 始终是屏幕坐标系下的 (x, y, width, height)。
 */

export type ChartOrientation = 'vertical' | 'horizontal';

/** 视觉规格常量（px） */
export const CHART_METRICS = {
    /** 轴文本字号 */
    fontSize: 12,
    /** 绘图区顶部留白 */
    plotTopPad: 8,
    /** 绘图区右侧留白 */
    plotRightPad: 8,
    /** 轴刻度文本与绘图区边缘的间距 */
    axisLabelGap: 8,
    /** 值轴刻度带高（vertical 的 x 轴带 / horizontal 的底部值轴带） */
    xAxisBand: 24,
    /** 柱最大厚度 */
    maxBarThickness: 24,
    /** 相邻柱与堆叠段之间的表面留白 */
    barGap: 2,
    /** 数据端圆角半径 */
    barRadius: 4,
    /** 类目 band 内容区占比（两侧各留 15% 空气） */
    bandInnerRatio: 0.7,
    /** y 轴目标刻度数 */
    tickTarget: 5,
    /** 柱端数值标签字号 */
    valueLabelSize: 11,
    /** 数值标签与柱端 / 参考线与其标签的间距 */
    valueLabelGap: 4,
} as const;

/** 单根柱（或堆叠段）的绘制矩形（屏幕坐标） */
export interface BarRect {
    x: number;
    y: number;
    width: number;
    height: number;
    categoryIndex: number;
    seriesIndex: number;
    value: number;
    /** 数据端（圆角端）方向；null 为堆叠的中间/贴基线段（全方角） */
    dataEnd: 'top' | 'bottom' | 'left' | 'right' | null;
}

export interface ChartTick {
    value: number;
    /** 值轴方向上的坐标：vertical 为 y，horizontal 为 x */
    pos: number;
    label: string;
}

/** 类目 band（悬停命中区与类目标签定位），沿类目轴方向 */
export interface ChartBand {
    start: number;
    size: number;
    center: number;
}

export interface ChartLayout {
    plotLeft: number;
    plotTop: number;
    plotRight: number;
    plotBottom: number;
    /** 零值基线在值轴方向上的坐标：vertical 为 y，horizontal 为 x */
    zeroPos: number;
    ticks: ChartTick[];
    bands: ChartBand[];
    bars: BarRect[];
    /** 各参考值在值轴方向上的坐标，与 referenceValues 同序 */
    referencePositions: number[];
}

export interface LayoutOptions {
    width: number;
    height: number;
    categories: string[];
    series: { data: number[] }[];
    stacked: boolean;
    formatValue: (value: number) => string;
    orientation?: ChartOrientation;
    /** 参考线数值，参与值域计算（保证参考线始终落在图内） */
    referenceValues?: number[];
}

interface MeasureContext {
    font: string;
    measureText(text: string): { width: number };
}

/** 惰性单例：undefined 未初始化，null 表示环境不支持（SSR / jsdom），走估宽回退 */
let measureCtx: MeasureContext | null | undefined;

/** CJK 表意 / 假名 / 谚文 / 全角形，占 1em；其余字符按 0.6em 估 */
const FULL_WIDTH_RE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/;

/**
 * 轴标签测宽：优先用 canvas 2d 真实测量（与 Text 绘制同为 system-ui，
 * formatValue 返回中文 / 任意字符也准确）；环境无 OffscreenCanvas 时分档估宽。
 */
export function measureLabelWidth(text: string, fontSize: number): number {
    if (measureCtx === undefined) {
        try {
            measureCtx = new OffscreenCanvas(1, 1).getContext('2d');
        } catch {
            measureCtx = null;
        }
    }
    if (measureCtx) {
        measureCtx.font = `${fontSize}px system-ui`;
        return measureCtx.measureText(text).width;
    }
    let em = 0;
    for (const ch of text) {
        em += FULL_WIDTH_RE.test(ch) ? 1 : 0.6;
    }
    return em * fontSize;
}

/**
 * 计算「整洁刻度」：步长取 1/2/5 × 10^n，起止对齐到步长整数倍。
 * 返回从起点到终点（含）的等距刻度值，min === max 时扩为单位跨度。
 */
export function niceTicks(min: number, max: number, targetCount: number = CHART_METRICS.tickTarget): number[] {
    let lo = Math.min(min, max);
    let hi = Math.max(min, max);
    if (lo === hi) {
        if (lo === 0) {
            hi = 1;
        } else if (lo > 0) {
            lo = 0;
        } else {
            hi = 0;
        }
    }
    const rawStep = (hi - lo) / Math.max(1, targetCount);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalized = rawStep / magnitude;
    const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;

    const start = Math.floor(lo / step) * step;
    const end = Math.ceil(hi / step) * step;
    const ticks: number[] = [];
    const count = Math.round((end - start) / step);
    for (let i = 0; i <= count; i++) {
        const v = start + i * step;
        // 消除浮点累计误差（如 0.30000000000000004）
        ticks.push(Math.abs(v) < step * 1e-9 ? 0 : Number(v.toPrecision(12)));
    }
    return ticks;
}

/** 数据值域：分组取全量最值，堆叠取各类目正/负累计和的最值；两端都夹到 0 */
function computeDomain(categories: string[], series: { data: number[] }[], stacked: boolean): [number, number] {
    let min = 0;
    let max = 0;
    if (stacked) {
        for (let i = 0; i < categories.length; i++) {
            let posSum = 0;
            let negSum = 0;
            for (const s of series) {
                const v = s.data[i] ?? 0;
                if (v > 0) posSum += v;
                else negSum += v;
            }
            if (posSum > max) max = posSum;
            if (negSum < min) min = negSum;
        }
    } else {
        for (const s of series) {
            for (let i = 0; i < categories.length; i++) {
                const v = s.data[i] ?? 0;
                if (v > max) max = v;
                if (v < min) min = v;
            }
        }
    }
    return [min, max];
}

/** 计算类目内各柱 / 堆叠段，输出与轴向无关的「值轴区间 + 类目轴区间」，由调用方落到屏幕坐标 */
interface BarSpan {
    /** 值轴方向区间（沿值增长方向：vertical 向上 / horizontal 向右） */
    valueStart: number;
    valueSize: number;
    /** 类目轴方向区间 */
    bandStart: number;
    bandSize: number;
    categoryIndex: number;
    seriesIndex: number;
    value: number;
    /** 数据端在值增长方向（true）还是负方向（false）；null 为中间段 */
    dataAtPositive: boolean | null;
}

export function computeLayout(options: LayoutOptions): ChartLayout {
    const {
        width, height, categories, series, stacked, formatValue,
        orientation = 'vertical', referenceValues = [],
    } = options;
    const M = CHART_METRICS;
    const n = categories.length;
    const m = series.length;
    const horizontal = orientation === 'horizontal';

    let [dataMin, dataMax] = computeDomain(categories, series, stacked);
    for (const v of referenceValues) {
        if (v < dataMin) dataMin = v;
        if (v > dataMax) dataMax = v;
    }
    const tickValues = niceTicks(dataMin, dataMax);
    const domainMin = tickValues[0];
    const domainMax = tickValues[tickValues.length - 1];
    const labels = tickValues.map(formatValue);

    // 左缘留白：vertical 放值轴刻度文本，horizontal 放类目文本
    const leftLabels = horizontal ? categories : labels;
    const maxLabelW = leftLabels.reduce((w, l) => Math.max(w, measureLabelWidth(l, M.fontSize)), 0);
    const plotLeft = Math.max(24, Math.ceil(maxLabelW) + M.axisLabelGap);
    const plotTop = M.plotTopPad;
    const plotRight = Math.max(plotLeft, width - M.plotRightPad);
    const plotBottom = Math.max(plotTop, height - M.xAxisBand);

    // 值轴像素映射：vertical 沿 y 向上（屏幕坐标递减），horizontal 沿 x 向右（递增）
    const span = domainMax - domainMin;
    const valueExtent = horizontal ? plotRight - plotLeft : plotBottom - plotTop;
    const posFor = (v: number): number => {
        const ratio = (v - domainMin) / span;
        return horizontal ? plotLeft + ratio * valueExtent : plotBottom - ratio * valueExtent;
    };
    // 几何全部对齐到整数像素：非整数坐标经线性采样会让 hairline 与柱缘发糊
    const zeroPos = Math.round(posFor(0));

    const ticks: ChartTick[] = tickValues.map((value, i) => ({
        value,
        pos: Math.round(posFor(value)),
        label: labels[i],
    }));

    // 类目轴：vertical 沿 x（plotLeft → plotRight），horizontal 沿 y（plotTop → plotBottom）
    const bandExtent = horizontal ? plotBottom - plotTop : plotRight - plotLeft;
    const bandOrigin = horizontal ? plotTop : plotLeft;
    const bandSize = n > 0 ? bandExtent / n : 0;
    const bands: ChartBand[] = categories.map((_, i) => {
        const start = bandOrigin + i * bandSize;
        return { start, size: bandSize, center: start + bandSize / 2 };
    });

    // 值轴方向的有向长度（像素/值方向一致化）：valuePos(v) 相对 zeroPos 的偏移
    const spans: BarSpan[] = [];
    const inner = bandSize * M.bandInnerRatio;

    if (stacked) {
        const barW = Math.round(Math.max(1, Math.min(M.maxBarThickness, inner)));
        for (let i = 0; i < n; i++) {
            const bandStart = Math.round(bands[i].start + (bandSize - barW) / 2);
            let posAcc = 0;
            let negAcc = 0;
            let lastPos = -1;
            let lastNeg = -1;
            for (let j = 0; j < m; j++) {
                const v = series[j].data[i] ?? 0;
                if (v === 0) continue;
                if (v > 0) {
                    const p0 = Math.round(posFor(posAcc));
                    const p1 = Math.round(posFor(posAcc + v));
                    // 非贴基线段在其基线侧收进 barGap，形成段间表面留白
                    const gap = posAcc > 0 ? M.barGap : 0;
                    const len = Math.abs(p1 - p0) - gap;
                    posAcc += v;
                    if (len <= 0) continue;
                    // 值增长方向上的起点：从累计位置（含 gap）继续生长
                    const valueStart = horizontal ? p0 + gap : p0 - gap - len;
                    spans.push({
                        valueStart, valueSize: len, bandStart, bandSize: barW,
                        categoryIndex: i, seriesIndex: j, value: v, dataAtPositive: null,
                    });
                    lastPos = spans.length - 1;
                } else {
                    const p0 = Math.round(posFor(negAcc));
                    const p1 = Math.round(posFor(negAcc + v));
                    const gap = negAcc < 0 ? M.barGap : 0;
                    const len = Math.abs(p1 - p0) - gap;
                    negAcc += v;
                    if (len <= 0) continue;
                    const valueStart = horizontal ? p1 : p0 + gap;
                    spans.push({
                        valueStart, valueSize: len, bandStart, bandSize: barW,
                        categoryIndex: i, seriesIndex: j, value: v, dataAtPositive: null,
                    });
                    lastNeg = spans.length - 1;
                }
            }
            // 仅最外侧段是数据端，获得圆角
            if (lastPos >= 0) spans[lastPos].dataAtPositive = true;
            if (lastNeg >= 0) spans[lastNeg].dataAtPositive = false;
        }
    } else {
        const barW = Math.round(Math.max(1, Math.min(M.maxBarThickness, (inner - (m - 1) * M.barGap) / m)));
        const contentW = m * barW + (m - 1) * M.barGap;
        for (let i = 0; i < n; i++) {
            const base = bands[i].start + (bandSize - contentW) / 2;
            for (let j = 0; j < m; j++) {
                const v = series[j].data[i] ?? 0;
                if (v === 0) continue;
                const bandStart = Math.round(base + j * (barW + M.barGap));
                if (v > 0) {
                    // 正值柱至少 1px，避免小值在图上消失
                    const end = horizontal
                        ? Math.max(zeroPos + 1, Math.round(posFor(v)))
                        : Math.min(zeroPos - 1, Math.round(posFor(v)));
                    const valueStart = horizontal ? zeroPos : end;
                    spans.push({
                        valueStart, valueSize: Math.abs(end - zeroPos), bandStart, bandSize: barW,
                        categoryIndex: i, seriesIndex: j, value: v, dataAtPositive: true,
                    });
                } else {
                    const end = horizontal
                        ? Math.min(zeroPos - 1, Math.round(posFor(v)))
                        : Math.max(zeroPos + 1, Math.round(posFor(v)));
                    const valueStart = horizontal ? end : zeroPos;
                    spans.push({
                        valueStart, valueSize: Math.abs(end - zeroPos), bandStart, bandSize: barW,
                        categoryIndex: i, seriesIndex: j, value: v, dataAtPositive: false,
                    });
                }
            }
        }
    }

    // BarSpan 落到屏幕矩形：vertical 值轴=y（valueStart 为矩形顶），horizontal 值轴=x（valueStart 为矩形左）
    const bars: BarRect[] = spans.map(s => {
        const dataEnd = s.dataAtPositive === null
            ? null
            : horizontal
                ? (s.dataAtPositive ? 'right' as const : 'left' as const)
                : (s.dataAtPositive ? 'top' as const : 'bottom' as const);
        return horizontal
            ? {
                x: s.valueStart, y: s.bandStart, width: s.valueSize, height: s.bandSize,
                categoryIndex: s.categoryIndex, seriesIndex: s.seriesIndex, value: s.value, dataEnd,
            }
            : {
                x: s.bandStart, y: s.valueStart, width: s.bandSize, height: s.valueSize,
                categoryIndex: s.categoryIndex, seriesIndex: s.seriesIndex, value: s.value, dataEnd,
            };
    });

    const referencePositions = referenceValues.map(v => Math.round(posFor(v)));

    return { plotLeft, plotTop, plotRight, plotBottom, zeroPos, ticks, bands, bars, referencePositions };
}
