import { describe, it, expect } from '@jest/globals';
import {
    easeOutCubic,
    barProgress,
    sampleBars,
    staggerStep,
    totalSpan,
    barKey,
    type BarGeom,
} from '../hooks/useBarTransition.js';
import type { BarRect } from '../layout.js';

const bar = (over: Partial<BarRect> = {}): BarRect => ({
    x: 0,
    y: 100,
    width: 20,
    height: 100,
    categoryIndex: 0,
    seriesIndex: 0,
    value: 10,
    dataEnd: 'top',
    ...over,
});

describe('easeOutCubic', () => {
    it('端点固定为 0 与 1', () => {
        expect(easeOutCubic(0)).toBeCloseTo(0);
        expect(easeOutCubic(1)).toBeCloseTo(1);
    });

    it('起步快于收尾（out 缓动）', () => {
        expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
    });
});

describe('barProgress', () => {
    it('elapsed=0 时进度为 0', () => {
        expect(barProgress(0, 0, 50)).toBeCloseTo(0);
    });

    it('超过时长后钳制为 1', () => {
        expect(barProgress(0, 10000, 50)).toBeCloseTo(1);
    });

    it('类目错峰：靠后的类目在同一时刻进度更小', () => {
        const early = barProgress(0, 100, 50);
        const late = barProgress(3, 100, 50);
        expect(early).toBeGreaterThan(late);
    });
});

describe('staggerStep / totalSpan', () => {
    it('类目多时压缩每档错峰，总量有上限', () => {
        expect(staggerStep(2)).toBe(50);
        expect(staggerStep(100)).toBeLessThan(50);
    });

    it('总跨度随类目数增加（含错峰累计）', () => {
        expect(totalSpan(1, 50)).toBeLessThan(totalSpan(5, 50));
    });
});

describe('sampleBars', () => {
    const target = [bar({ categoryIndex: 0, y: 40, height: 160 })];

    it('elapsed=0、无起点：从基线（height=0）生长', () => {
        const [b] = sampleBars(target, new Map(), 200, 'vertical',0, 50);
        expect(b.height).toBeCloseTo(0);
        expect(b.y).toBeCloseTo(200); // zeroY
    });

    it('时长走完：精确抵达目标几何', () => {
        const [b] = sampleBars(target, new Map(), 200, 'vertical',10000, 50);
        expect(b.height).toBeCloseTo(160);
        expect(b.y).toBeCloseTo(40);
    });

    it('给定起点几何：从旧几何补间而非基线（数据更新场景）', () => {
        const from = new Map<string, BarGeom>([
            [barKey(target[0]), { x: 0, y: 120, width: 20, height: 80 }],
        ]);
        const [b] = sampleBars(target, from, 200, 'vertical', 0, 50);
        expect(b.y).toBeCloseTo(120);
        expect(b.height).toBeCloseTo(80);
    });

    it('横向位置也补间：系列显隐引起的重排平滑滑动', () => {
        const moved = [bar({ x: 60, width: 24 })];
        const from = new Map<string, BarGeom>([
            [barKey(moved[0]), { x: 0, y: 40, width: 20, height: 160 }],
        ]);
        const [start] = sampleBars(moved, from, 200, 'vertical', 0, 50);
        expect(start.x).toBeCloseTo(0);
        const [end] = sampleBars(moved, from, 200, 'vertical', 10000, 50);
        expect(end.x).toBeCloseTo(60);
        expect(end.width).toBeCloseTo(24);
    });

    it('horizontal 轴向：缺省起点贴零值基线、宽度为 0（沿 x 生长）', () => {
        const hTarget = [bar({ x: 100, y: 30, width: 80, height: 20, dataEnd: 'right' })];
        const [start] = sampleBars(hTarget, new Map(), 100, 'horizontal', 0, 50);
        expect(start.x).toBeCloseTo(100); // zeroPos
        expect(start.width).toBeCloseTo(0);
        expect(start.y).toBeCloseTo(30);
        expect(start.height).toBeCloseTo(20);
        const [end] = sampleBars(hTarget, new Map(), 100, 'horizontal', 10000, 50);
        expect(end.width).toBeCloseTo(80);
    });

    it('透传非几何字段（value / dataEnd / x / width / 下标）', () => {
        const [b] = sampleBars(target, new Map(), 200, 'vertical',300, 50);
        expect(b.value).toBe(10);
        expect(b.dataEnd).toBe('top');
        expect(b.categoryIndex).toBe(0);
        expect(b.width).toBe(20);
    });
});
