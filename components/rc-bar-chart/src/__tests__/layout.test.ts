import { describe, it, expect } from '@jest/globals';
import { niceTicks, computeLayout, CHART_METRICS } from '../layout.js';

const fmt = (v: number): string => String(v);

describe('niceTicks', () => {
    it('步长取 1/2/5 × 10^n，起止对齐步长整数倍', () => {
        expect(niceTicks(0, 97)).toEqual([0, 20, 40, 60, 80, 100]);
        expect(niceTicks(0, 40)).toEqual([0, 10, 20, 30, 40]);
    });

    it('负值域包含 0 且两端对齐', () => {
        const ticks = niceTicks(-30, 80);
        expect(ticks[0]).toBeLessThanOrEqual(-30);
        expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(80);
        expect(ticks).toContain(0);
    });

    it('全 0 数据扩为单位跨度', () => {
        const ticks = niceTicks(0, 0);
        expect(ticks[0]).toBe(0);
        expect(ticks[ticks.length - 1]).toBe(1);
    });

    it('刻度严格单调递增', () => {
        const ticks = niceTicks(-7, 133);
        for (let i = 1; i < ticks.length; i++) {
            expect(ticks[i]).toBeGreaterThan(ticks[i - 1]);
        }
    });
});

describe('computeLayout（分组）', () => {
    const base = {
        width: 600,
        height: 320,
        categories: ['一', '二', '三'],
        series: [{ data: [10, 20, 30] }, { data: [20, 10, 40] }],
        stacked: false,
        formatValue: fmt,
    };

    it('每个非零值产生一根柱，厚度不超过上限', () => {
        const layout = computeLayout(base);
        expect(layout.bars).toHaveLength(6);
        for (const bar of layout.bars) {
            expect(bar.width).toBeLessThanOrEqual(CHART_METRICS.maxBarThickness);
        }
    });

    it('同类目相邻柱之间保持表面留白', () => {
        const layout = computeLayout(base);
        const first = layout.bars.filter(b => b.categoryIndex === 0);
        expect(first).toHaveLength(2);
        const [a, b] = first;
        expect(b.x - (a.x + a.width)).toBeCloseTo(CHART_METRICS.barGap);
    });

    it('正值柱从零值基线向上生长，数据端在顶部', () => {
        const layout = computeLayout(base);
        for (const bar of layout.bars) {
            expect(bar.dataEnd).toBe('top');
            expect(bar.y + bar.height).toBeCloseTo(layout.zeroY);
            expect(bar.y).toBeLessThan(layout.zeroY);
        }
    });

    it('负值柱从基线向下生长，数据端在底部', () => {
        const layout = computeLayout({ ...base, series: [{ data: [10, -20, 30] }] });
        const negative = layout.bars.find(b => b.value < 0);
        expect(negative).toBeDefined();
        expect(negative!.dataEnd).toBe('bottom');
        expect(negative!.y).toBeCloseTo(layout.zeroY);
    });

    it('零值不产生柱', () => {
        const layout = computeLayout({ ...base, series: [{ data: [10, 0, 30] }] });
        expect(layout.bars).toHaveLength(2);
    });

    it('数据缺位按 0 处理', () => {
        const layout = computeLayout({ ...base, series: [{ data: [10] }] });
        expect(layout.bars).toHaveLength(1);
    });
});

describe('computeLayout（堆叠）', () => {
    const base = {
        width: 600,
        height: 320,
        categories: ['一', '二'],
        series: [{ data: [10, 20] }, { data: [20, 10] }],
        stacked: true,
        formatValue: fmt,
    };

    it('同类目各段共用同一 x 与厚度', () => {
        const layout = computeLayout(base);
        const segments = layout.bars.filter(b => b.categoryIndex === 0);
        expect(segments).toHaveLength(2);
        expect(segments[0].x).toBeCloseTo(segments[1].x);
        expect(segments[0].width).toBeCloseTo(segments[1].width);
    });

    it('段间保持表面留白，仅最外侧段是数据端', () => {
        const layout = computeLayout(base);
        const [bottom, top] = layout.bars.filter(b => b.categoryIndex === 0);
        // 底段贴基线，顶段的底缘与底段的顶缘相距 barGap
        expect(bottom.y + bottom.height).toBeCloseTo(layout.zeroY);
        expect(bottom.y - (top.y + top.height)).toBeCloseTo(CHART_METRICS.barGap);
        expect(bottom.dataEnd).toBeNull();
        expect(top.dataEnd).toBe('top');
    });

    it('值域取各类目正值累计和', () => {
        const layout = computeLayout(base);
        // 两类目累计和均为 30，最高段的顶缘不越过绘图区顶部
        const minY = Math.min(...layout.bars.map(b => b.y));
        expect(minY).toBeGreaterThanOrEqual(layout.plotTop);
    });

    it('负值向下堆叠，最外侧负段数据端在底部', () => {
        const layout = computeLayout({
            ...base,
            series: [{ data: [10, 20] }, { data: [-20, -10] }],
        });
        const negative = layout.bars.filter(b => b.value < 0);
        expect(negative).toHaveLength(2);
        for (const seg of negative) {
            expect(seg.dataEnd).toBe('bottom');
            expect(seg.y).toBeGreaterThanOrEqual(layout.zeroY);
        }
    });
});
