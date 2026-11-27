import { describe, expect, it } from '@crab-dev/wake/test';
import { buildPieSlices, getPieGeometry } from '../layout.js';

const quarterTurn = Math.PI / 2;
const startAngle = -quarterTurn;
const endAngle = 3 * quarterTurn;

describe('饼图扇区', () => {
    it('从十二点顺时针按值分配，共用边界并闭合整圆', () => {
        const slices = buildPieSlices([
            { name: '甲', value: 1 }, { name: '乙', value: 1 }, { name: '丙', value: 2 },
        ]);
        expect(slices.map(slice => slice.percentage)).toEqual([25, 25, 50]);
        expect(slices.map(slice => [slice.startAngle, slice.endAngle])).toEqual([
            [startAngle, 0], [0, quarterTurn], [quarterTurn, endAngle],
        ]);
    });

    it('跳过隐藏项、非正值和非有限数值；按原始下标区分同名项并重算占比', () => {
        const data = [
            { name: '同名', value: 5 }, { name: '零', value: 0 }, { name: '负', value: -2 },
            { name: '同名', value: 15, color: 'red' }, { name: '无穷', value: Infinity },
            { name: '缺测', value: NaN }, { name: '同名', value: 30 }, { name: '负无穷', value: -Infinity },
        ];
        const slices = buildPieSlices(data, new Set([6]));
        expect(slices.map(({ index, percentage }) => [index, percentage])).toEqual([[0, 25], [3, 75]]);
        expect(slices[1]).toMatchObject({ name: '同名', value: 15, color: 'red' });
        expect(slices[1].endAngle).toBe(endAngle);
        expect(buildPieSlices(data, new Set([0, 3, 6]))).toEqual([]);
    });

    it('单个有效值覆盖整圆，空数据不产生扇区', () => {
        expect(buildPieSlices([])).toEqual([]);
        expect(buildPieSlices([{ name: '甲', value: 2 }])).toEqual([
            { index: 0, name: '甲', value: 2, percentage: 100, startAngle, endAngle },
        ]);
    });

    it('极大值和次正规值均能形成有限、闭合的扇区', () => {
        for (const value of [Number.MAX_VALUE, Number.MIN_VALUE]) {
            const [first, second] = buildPieSlices([{ name: '一半', value }, { name: '一半', value }]);
            expect(first.percentage).toBe(50);
            expect(second.percentage).toBe(50);
            expect(first.endAngle).toBe(quarterTurn);
            expect(second.startAngle).toBe(first.endAngle);
            expect(second.endAngle).toBe(endAngle);
        }
    });
});

describe('画布内的饼和圆环', () => {
    it('居中并按画布短边取半径，宽图和高图有相同的绘制留白', () => {
        expect(getPieGeometry(280, 200)).toEqual({ centerX: 140, centerY: 100, outerRadius: 92, innerRadius: 0 });
        expect(getPieGeometry(200, 280, 0.5)).toEqual({ centerX: 100, centerY: 140, outerRadius: 92, innerRadius: 46 });
    });

    it('内径限制在外径的 0 到 90%，非有限比例回退为实心', () => {
        expect(getPieGeometry(216, 216, -1).innerRadius).toBe(0);
        expect(getPieGeometry(216, 216, 2).innerRadius).toBe(90);
        expect(getPieGeometry(216, 216, NaN).innerRadius).toBe(0);
        expect(getPieGeometry(216, 216, Infinity).innerRadius).toBe(0);
    });

    it('不可用或窄于留白的画布返回零半径', () => {
        for (const shortSide of [-20, 0, 1, 15, 16, NaN, Infinity]) {
            const { centerX, outerRadius, innerRadius } = getPieGeometry(shortSide, 200, 0.5);
            expect(Number.isFinite(centerX)).toBe(true);
            expect(outerRadius).toBe(0);
            expect(innerRadius).toBe(0);
        }
    });
});
