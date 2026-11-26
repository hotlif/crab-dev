import { describe, expect, it } from '@crab-dev/wake/test';
import { CHART_METRICS, computeLayout, measureLabelWidth } from '../layout.js';

const options = {
    width: 480,
    height: 240,
    categories: ['一', '二', '三'],
    series: [{ data: [-10, 0, 20] }],
    formatValue: (value: number) => String(value),
};

describe('折线点和线段', () => {
    it('共用数值轴，按类目顺序输出键盘目标，只连同系列相邻点', () => {
        const layout = computeLayout({
            ...options,
            series: [...options.series, { data: [20, 0, -10] }],
        });
        const [a, b, c, d, e, f] = layout.points;
        expect(layout.points.map(point => point.seriesIndex)).toEqual([0, 1, 0, 1, 0, 1]);
        expect(a.x).toBe(b.x);
        expect(a.x).toBeLessThan(c.x);
        expect(c.x).toBeLessThan(e.x);
        expect(a.y).toBe(f.y);
        expect(a.y).toBeGreaterThan(layout.zeroPos);
        expect(c.y).toBe(layout.zeroPos);
        expect(d.y).toBe(layout.zeroPos);
        expect(e.y).toBeLessThan(layout.zeroPos);
        expect(layout.segments.map(({ from, to }) => [from.value, to.value])).toEqual([
            [-10, 0], [20, 0], [0, 20], [0, -10],
        ]);
    });

    it('缺测、非有限值和短数组都断线，越过类目范围的数据不影响值域', () => {
        const layout = computeLayout({
            ...options,
            categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            series: [
                { data: [1, null, 0, 3, Infinity, 5, 6, 999] },
                { data: [NaN, -Infinity, 2] },
            ],
        });
        expect(layout.points.map(point => point.value)).toEqual([1, 0, 2, 3, 5, 6]);
        expect(layout.segments.map(({ from, to }) => [from.categoryIndex, to.categoryIndex])).toEqual([
            [2, 3], [5, 6],
        ]);
        expect(layout.ticks.at(-1)!.value).toBeLessThan(999);
    });

    it('单点居中，全零仍绘制点标记，空系列和空类目不产生点', () => {
        const layout = computeLayout({ ...options, categories: ['A'], series: [{ data: [0] }] });
        expect(layout.points).toHaveLength(1);
        expect(layout.points[0].x).toBe((layout.plotLeft + layout.plotRight) / 2);
        expect(layout.points[0].y).toBe(layout.zeroPos);
        expect(layout.ticks.at(-1)!.value).toBe(1);
        expect(layout.segments).toHaveLength(0);
        expect(computeLayout({ ...options, categories: [] }).points).toHaveLength(0);
        expect(computeLayout({ ...options, series: [] }).points).toHaveLength(0);
    });
});

describe('坐标轴和类目命中区', () => {
    it('全负数域止于零，有限参考线参与缩放并保留索引', () => {
        const layout = computeLayout({
            ...options, series: [{ data: [-8, -4, -2] }], referenceValues: [-30, NaN, -4],
        });
        expect(layout.ticks.at(-1)!.value).toBe(0);
        expect(layout.referencePositions[0]).toBeGreaterThan(layout.points[0].y);
        expect(layout.referencePositions[0]).toBeLessThanOrEqual(layout.plotBottom);
        expect(layout.referencePositions[1]).toBeNull();
        expect(layout.referencePositions[2]).toBe(layout.points[1].y);
    });

    it('极大和极小的有限数值均产生有限坐标', () => {
        for (const magnitude of [Number.MAX_VALUE, Number.MIN_VALUE]) {
            const layout = computeLayout({ ...options, series: [{ data: [-magnitude, 0, magnitude] }] });
            expect(layout.points.every(point =>
                Number.isFinite(point.y) && point.y >= layout.plotTop && point.y <= layout.plotBottom,
            )).toBe(true);
            expect(layout.ticks.every(tick => Number.isFinite(tick.value) && Number.isFinite(tick.pos))).toBe(true);
        }
    });

    it('窄图保留绘图区并裁短过长的刻度，类目标签避开画布边缘', () => {
        const width = 180;
        const layout = computeLayout({
            ...options, width, categories: Array.from({ length: 9 }, (_, i) => `很长的日期名称${i}`),
            formatValue: value => `很长的单位名称${value}`,
        });
        expect(layout.plotRight - layout.plotLeft).toBeGreaterThan(width / 3);
        expect(layout.categoryLabels.length).toBeGreaterThan(0);
        expect(layout.categoryLabels.length).toBeLessThan(layout.bands.length);
        for (const tick of layout.tickLabels) {
            expect(measureLabelWidth(tick.label, CHART_METRICS.fontSize))
                .toBeLessThanOrEqual(layout.plotLeft - CHART_METRICS.axisLabelGap);
        }
        for (const { x, label } of layout.categoryLabels) {
            const half = measureLabelWidth(label, CHART_METRICS.fontSize) / 2;
            expect(x - half).toBeGreaterThanOrEqual(0);
            expect(x + half).toBeLessThanOrEqual(width);
        }
        expect(layout.bands[0].start).toBe(layout.plotLeft);
        for (let i = 1; i < layout.bands.length; i++) {
            const previous = layout.bands[i - 1];
            expect(previous.start + previous.size).toBeCloseTo(layout.bands[i].start);
        }
        const last = layout.bands.at(-1)!;
        expect(last.start + last.size).toBeCloseTo(layout.plotRight);
    });
});
