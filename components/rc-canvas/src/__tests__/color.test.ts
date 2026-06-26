import { describe, it, expect } from '@jest/globals';
import { parseColor } from '../math/color.js';

describe('parseColor', () => {
    it('transparent → [0,0,0,0]', () => {
        expect(parseColor('transparent')).toEqual([0, 0, 0, 0]);
    });

    describe('#hex', () => {
        it('#rrggbb 解析', () => {
            const [r, g, b, a] = parseColor('#ff0000');
            expect(r).toBeCloseTo(1);
            expect(g).toBeCloseTo(0);
            expect(b).toBeCloseTo(0);
            expect(a).toBeCloseTo(1);
        });

        it('#rgb 简写解析', () => {
            const [r, g, b, a] = parseColor('#f00');
            expect(r).toBeCloseTo(1);
            expect(g).toBeCloseTo(0);
            expect(b).toBeCloseTo(0);
            expect(a).toBeCloseTo(1);
        });

        it('#rrggbbaa 含 alpha 解析', () => {
            const [r, g, b, a] = parseColor('#ffffff80');
            expect(r).toBeCloseTo(1);
            expect(g).toBeCloseTo(1);
            expect(b).toBeCloseTo(1);
            expect(a).toBeCloseTo(128 / 255);
        });

        it('#000000 → 黑色', () => {
            const [r, g, b, a] = parseColor('#000000');
            expect(r).toBeCloseTo(0);
            expect(g).toBeCloseTo(0);
            expect(b).toBeCloseTo(0);
            expect(a).toBeCloseTo(1);
        });
    });

    describe('rgb()', () => {
        it('rgb(255, 0, 0) → 红色', () => {
            const [r, g, b, a] = parseColor('rgb(255, 0, 0)');
            expect(r).toBeCloseTo(1);
            expect(g).toBeCloseTo(0);
            expect(b).toBeCloseTo(0);
            expect(a).toBeCloseTo(1);
        });

        it('rgba(0, 0, 255, 0.5) → 半透明蓝', () => {
            const [r, g, b, a] = parseColor('rgba(0, 0, 255, 0.5)');
            expect(r).toBeCloseTo(0);
            expect(g).toBeCloseTo(0);
            expect(b).toBeCloseTo(1);
            expect(a).toBeCloseTo(0.5);
        });
    });

    describe('oklch()', () => {
        it('oklch(0 0 0) → 黑色', () => {
            const [r, g, b, a] = parseColor('oklch(0 0 0)');
            expect(r).toBeCloseTo(0, 2);
            expect(g).toBeCloseTo(0, 2);
            expect(b).toBeCloseTo(0, 2);
            expect(a).toBeCloseTo(1);
        });

        it('oklch(1 0 0) → 白色', () => {
            const [r, g, b, a] = parseColor('oklch(1 0 0)');
            expect(r).toBeCloseTo(1, 2);
            expect(g).toBeCloseTo(1, 2);
            expect(b).toBeCloseTo(1, 2);
            expect(a).toBeCloseTo(1);
        });

        it('oklch(0.5 0 0) → 中灰（无色相）', () => {
            const [r, g, b] = parseColor('oklch(0.5 0 0)');
            // C=0 时 r≈g≈b（灰色）
            expect(r).toBeCloseTo(g, 2);
            expect(g).toBeCloseTo(b, 2);
        });

        it('oklch 带 / alpha 语法', () => {
            const [, , , a] = parseColor('oklch(0.5 0.1 30 / 0.7)');
            expect(a).toBeCloseTo(0.7);
        });

        it('结果各通道在 [0,1] 范围内', () => {
            const colors = [
                'oklch(0.6 0.2 30)',
                'oklch(0.5 0.3 250)',
                'oklch(0.8 0.15 120)',
            ];
            for (const c of colors) {
                const [r, g, b, a] = parseColor(c);
                expect(r).toBeGreaterThanOrEqual(0);
                expect(r).toBeLessThanOrEqual(1);
                expect(g).toBeGreaterThanOrEqual(0);
                expect(g).toBeLessThanOrEqual(1);
                expect(b).toBeGreaterThanOrEqual(0);
                expect(b).toBeLessThanOrEqual(1);
                expect(a).toBeCloseTo(1);
            }
        });
    });
});
