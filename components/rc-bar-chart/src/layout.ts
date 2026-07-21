/**
 * 布局纯函数：刻度、比例尺与柱矩形计算。
 * 不依赖 React 与渲染层，便于独立单测。
 */

/** 视觉规格常量（px） */
export const CHART_METRICS = {
    /** 轴文本字号 */
    fontSize: 12,
    /** 绘图区顶部留白 */
    plotTopPad: 8,
    /** 绘图区右侧留白 */
    plotRightPad: 8,
    /** y 轴刻度文本与绘图区左缘的间距 */
    axisLabelGap: 8,
    /** x 轴类目标签带高 */
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
} as const;

/** 单根柱（或堆叠段）的绘制矩形 */
export interface BarRect {
    x: number;
    y: number;
    width: number;
    height: number;
    categoryIndex: number;
    seriesIndex: number;
    value: number;
    /** 数据端（圆角端）方向；null 为堆叠的中间/贴基线段（全方角） */
    dataEnd: 'top' | 'bottom' | null;
}

export interface ChartTick {
    value: number;
    y: number;
    label: string;
}

/** 类目 band（悬停命中区与类目标签定位） */
export interface ChartBand {
    x: number;
    width: number;
    centerX: number;
}

export interface ChartLayout {
    plotLeft: number;
    plotTop: number;
    plotRight: number;
    plotBottom: number;
    /** 零值基线的 y 坐标 */
    zeroY: number;
    ticks: ChartTick[];
    bands: ChartBand[];
    bars: BarRect[];
}

export interface LayoutOptions {
    width: number;
    height: number;
    categories: string[];
    series: { data: number[] }[];
    stacked: boolean;
    formatValue: (value: number) => string;
}

interface MeasureContext {
    font: string;
    measureText(text: string): { width: number };
}

/** 惰性单例：undefined 未初始化，null 表示环境不支持（SSR / jsdom），走估宽回退 */
let measureCtx: MeasureContext | null | undefined;

/** CJK 表意 / 假名 / 谚文 / 全角形，占 1em；其余字符按 0.6em 估 */
const FULL_WIDTH_RE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/;

/**
 * y 轴刻度标签测宽：优先用 canvas 2d 真实测量（与 Text 绘制同为 system-ui，
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

export function computeLayout(options: LayoutOptions): ChartLayout {
    const { width, height, categories, series, stacked, formatValue } = options;
    const M = CHART_METRICS;
    const n = categories.length;
    const m = series.length;

    const [dataMin, dataMax] = computeDomain(categories, series, stacked);
    const tickValues = niceTicks(dataMin, dataMax);
    const domainMin = tickValues[0];
    const domainMax = tickValues[tickValues.length - 1];

    const labels = tickValues.map(formatValue);
    const maxLabelW = labels.reduce((w, l) => Math.max(w, measureLabelWidth(l, M.fontSize)), 0);
    const plotLeft = Math.max(24, Math.ceil(maxLabelW) + M.axisLabelGap);
    const plotTop = M.plotTopPad;
    const plotRight = Math.max(plotLeft, width - M.plotRightPad);
    const plotBottom = Math.max(plotTop, height - M.xAxisBand);

    const plotH = plotBottom - plotTop;
    const span = domainMax - domainMin;
    const yFor = (v: number): number => plotBottom - ((v - domainMin) / span) * plotH;
    // 几何全部对齐到整数像素：非整数坐标经线性采样会让 hairline 与柱缘发糊
    const zeroY = Math.round(yFor(0));

    const ticks: ChartTick[] = tickValues.map((value, i) => ({ value, y: Math.round(yFor(value)), label: labels[i] }));

    const bandWidth = n > 0 ? (plotRight - plotLeft) / n : 0;
    const bands: ChartBand[] = categories.map((_, i) => {
        const x = plotLeft + i * bandWidth;
        return { x, width: bandWidth, centerX: x + bandWidth / 2 };
    });

    const inner = bandWidth * M.bandInnerRatio;
    const bars: BarRect[] = [];

    if (stacked) {
        const barW = Math.round(Math.max(1, Math.min(M.maxBarThickness, inner)));
        for (let i = 0; i < n; i++) {
            const x = Math.round(bands[i].x + (bandWidth - barW) / 2);
            let posAcc = 0;
            let negAcc = 0;
            let lastPos = -1;
            let lastNeg = -1;
            for (let j = 0; j < m; j++) {
                const v = series[j].data[i] ?? 0;
                if (v === 0) continue;
                if (v > 0) {
                    const y0 = Math.round(yFor(posAcc));
                    const y1 = Math.round(yFor(posAcc + v));
                    // 非贴基线段在其底部收进 barGap，形成段间表面留白
                    const gap = posAcc > 0 ? M.barGap : 0;
                    const h = y0 - y1 - gap;
                    posAcc += v;
                    if (h <= 0) continue;
                    bars.push({ x, y: y1, width: barW, height: h, categoryIndex: i, seriesIndex: j, value: v, dataEnd: null });
                    lastPos = bars.length - 1;
                } else {
                    const y0 = Math.round(yFor(negAcc));
                    const y1 = Math.round(yFor(negAcc + v));
                    const gap = negAcc < 0 ? M.barGap : 0;
                    const h = y1 - y0 - gap;
                    negAcc += v;
                    if (h <= 0) continue;
                    bars.push({ x, y: y0 + gap, width: barW, height: h, categoryIndex: i, seriesIndex: j, value: v, dataEnd: null });
                    lastNeg = bars.length - 1;
                }
            }
            // 仅最外侧段是数据端，获得圆角
            if (lastPos >= 0) bars[lastPos].dataEnd = 'top';
            if (lastNeg >= 0) bars[lastNeg].dataEnd = 'bottom';
        }
    } else {
        const barW = Math.round(Math.max(1, Math.min(M.maxBarThickness, (inner - (m - 1) * M.barGap) / m)));
        const contentW = m * barW + (m - 1) * M.barGap;
        for (let i = 0; i < n; i++) {
            const baseX = bands[i].x + (bandWidth - contentW) / 2;
            for (let j = 0; j < m; j++) {
                const v = series[j].data[i] ?? 0;
                if (v === 0) continue;
                const x = Math.round(baseX + j * (barW + M.barGap));
                if (v > 0) {
                    const y = Math.min(zeroY - 1, Math.round(yFor(v)));
                    bars.push({ x, y, width: barW, height: zeroY - y, categoryIndex: i, seriesIndex: j, value: v, dataEnd: 'top' });
                } else {
                    const y1 = Math.max(zeroY + 1, Math.round(yFor(v)));
                    bars.push({ x, y: zeroY, width: barW, height: y1 - zeroY, categoryIndex: i, seriesIndex: j, value: v, dataEnd: 'bottom' });
                }
            }
        }
    }

    return { plotLeft, plotTop, plotRight, plotBottom, zeroY, ticks, bands, bars };
}
