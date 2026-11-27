import { describe, expect, it } from '@crab-dev/wake/test';
import { CHART_METRICS, computeLayout } from '../layout.js';
import type { ScatterChartPoint } from '../types.js';

const options = {
    width: 480,
    height: 240,
    formatX: String,
    formatY: String,
    series: [{ name: '样本', data: [{ x: 4, y: 2 }, { x: 0, y: -2 }, { x: 1, y: 6 }] }],
};

describe('连续散点坐标', () => {
    it('保留输入顺序，两条数轴按数值差成比例定位', () => {
        const layout = computeLayout(options);
        const [a, b, c] = layout.points;
        expect((a.x - b.x) / (c.x - b.x)).toBeCloseTo(4);
        expect((c.y - b.y) / (a.y - b.y)).toBeCloseTo(2);
        expect(c.y).toBeLessThan(a.y);
        expect(a.y).toBeLessThan(b.y);
        expect(layout.yTicks.map(tick => tick.value)).toContain(0);
        expect(layout.points.map(point => [point.valueX, point.valueY])).toEqual([[4, 2], [0, -2], [1, 6]]);
    });

    it('高偏移的窄值域充分使用绘图区，分别计算横纵轴的刻度', () => {
        const layout = computeLayout({
            ...options,
            series: [{ name: '偏移', data: [{ x: 999.5, y: -8002 }, { x: 999.7, y: -8001 }] }],
        });
        expect(layout.xTicks[0].value).toBeGreaterThan(990);
        expect(layout.yTicks.at(-1)!.value).toBeLessThan(-8000);
        const [a, b] = layout.points;
        expect(b.x - a.x).toBeGreaterThan((layout.plotRight - layout.plotLeft) / 2);
        expect(a.y - b.y).toBeGreaterThan((layout.plotBottom - layout.plotTop) / 2);
    });

    it('保留重复观测和原始下标，任一无效坐标均不影响两个轴的值域', () => {
        const sparse: ScatterChartPoint[] = [];
        sparse[2] = { x: 1, y: 2, label: '观测甲' };
        sparse[3] = { x: 500, y: NaN };
        sparse[4] = { x: -Infinity, y: -100 };
        sparse[5] = { x: 1, y: 2, label: '观测乙' };
        const layout = computeLayout({ ...options, series: [
            { name: 'A', data: sparse }, { name: 'B', data: [{ x: 10, y: 3 }] },
        ] });
        expect(layout.points.map(p => [p.seriesIndex, p.pointIndex])).toEqual([[0, 2], [0, 5], [1, 0]]);
        const [a, b] = layout.points;
        expect([a.x, a.y]).toEqual([b.x, b.y]);
        expect([a.label, b.label]).toEqual(['观测甲', '观测乙']);
        expect(layout.xTicks.at(-1)!.value).toBeLessThan(500);
        expect(layout.yTicks[0].value).toBeGreaterThan(-100);
    });

    it('空输入仍有有限坐标系，单点和相同值的轴都有正跨度', () => {
        const empty = computeLayout({ ...options, series: [] });
        expect(empty.points).toHaveLength(0);
        expect(empty.xTicks.map(tick => tick.value)).toEqual([0, 1]);
        for (const value of [0, 4, -4]) {
            const layout = computeLayout({
                ...options, series: [{ name: '样本', data: [{ x: value, y: value }] }],
            });
            expect(layout.xTicks[0].value).toBeLessThan(value);
            expect(layout.xTicks.at(-1)!.value).toBeGreaterThan(value);
            expect(layout.points[0].y).toBeGreaterThan(layout.plotTop);
            expect(layout.points[0].y).toBeLessThan(layout.plotBottom);
        }
    });

    it('可表示的极端数值、极小差值和跨零溢出的值域均保持有限单调坐标', () => {
        const ranges = [
            [-Number.MAX_VALUE, Number.MAX_VALUE], [-Number.MIN_VALUE, Number.MIN_VALUE],
            [1e15, 1e15 + 0.125], [1, 1 + Number.EPSILON], [Number.MAX_VALUE, Number.MAX_VALUE],
        ];
        for (const [min, max] of ranges) {
            const layout = computeLayout({
                ...options, series: [{ name: '极值', data: [{ x: min, y: max }, { x: max, y: min }] }],
            });
            for (const ticks of [layout.xTicks, layout.yTicks]) {
                expect(ticks[0].value).toBeLessThanOrEqual(min);
                expect(ticks.at(-1)!.value).toBeGreaterThanOrEqual(max);
                expect(ticks.length).toBeGreaterThanOrEqual(2);
                ticks.forEach((tick, index) => {
                    expect(Number.isFinite(tick.pos)).toBe(true);
                    expect(Number.isFinite(tick.value)).toBe(true);
                    if (index) expect(tick.value).toBeGreaterThan(ticks[index - 1].value);
                });
            }
            for (const point of layout.points) {
                expect(point.x).toBeGreaterThanOrEqual(layout.plotLeft);
                expect(point.x).toBeLessThanOrEqual(layout.plotRight);
                expect(point.y).toBeGreaterThanOrEqual(layout.plotTop);
                expect(point.y).toBeLessThanOrEqual(layout.plotBottom);
            }
            if (min < max) expect(layout.points[0].x).toBeLessThan(layout.points[1].x);
        }
    });
});

describe('刻度标签', () => {
    it('显式轴标题各自留出空间，长标题按画布宽度裁短', () => {
        const plain = computeLayout(options);
        const layout = computeLayout({ ...options, xTitle: '速度', yTitle: '测量误差'.repeat(50) });
        expect(plain.xTitle).toBeNull();
        expect(plain.yTitle).toBeNull();
        expect(layout.xTitle?.label).toBe('速度');
        expect(layout.yTitle?.label.endsWith('…')).toBe(true);
        expect(layout.xTitle!.y).toBeGreaterThan(layout.plotBottom + CHART_METRICS.fontSize);
        expect(layout.yTitle!.y).toBeLessThan(layout.plotTop - CHART_METRICS.fontSize / 2);
        expect(layout.plotTop).toBeGreaterThan(plain.plotTop);
        expect(layout.plotBottom).toBeLessThan(plain.plotBottom);
        expect(computeLayout({ ...options, height: 48, xTitle: '速度', yTitle: '误差' }).xTitle).toBeNull();
    });

    it('分别应用格式化函数，窄屏上的横轴文本互不覆盖，也不越过画布边缘', () => {
        const width = 150;
        const layout = computeLayout({
            ...options, width, formatX: value => `x=${value}`, formatY: value => `y=${value}`,
        });
        expect(layout.xTicks.every(tick => tick.label === `x=${tick.value}`)).toBe(true);
        expect(layout.yTicks.every(tick => tick.label === `y=${tick.value}`)).toBe(true);
        expect(layout.xTickLabels.length).toBeGreaterThan(0);
        expect(layout.xTickLabels.length).toBeLessThan(layout.xTicks.length);
        let right = 0;
        for (const tick of layout.xTickLabels) {
            const half = tick.label.length * CHART_METRICS.fontSize * 0.6 / 2;
            expect(tick.pos - half).toBeGreaterThanOrEqual(right);
            right = tick.pos + half;
            expect(right).toBeLessThanOrEqual(width);
        }
    });

    it('过长和空标签不挤占绘图区，尺寸缩到零仍产生有限点坐标', () => {
        const layout = computeLayout({
            ...options, width: 96, height: 68, formatX: () => '过长单位'.repeat(20), formatY: () => '',
        });
        expect(layout.xTickLabels).toHaveLength(0);
        expect(layout.yTickLabels).toHaveLength(0);
        expect(layout.plotRight - layout.plotLeft).toBeGreaterThan(48);
        const zero = computeLayout({ ...options, width: 0, height: 0 });
        expect(zero.points.every(point => point.x === 0 && point.y === 0)).toBe(true);
        expect(zero.xTickLabels).toHaveLength(0);
        expect(zero.yTickLabels).toHaveLength(0);
    });
});
