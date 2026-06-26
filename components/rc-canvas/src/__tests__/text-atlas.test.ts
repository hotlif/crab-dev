import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { generateGlyph } from '../renderer/text-atlas.js';

beforeEach(() => {
    // jsdom 不支持 OffscreenCanvas，用最小 mock 代替
    const mockCtx = {
        font: '',
        fillStyle: '',
        fillRect: jest.fn(),
        fillText: jest.fn(),
        measureText: jest.fn(() => ({ width: 80 })),
        getImageData: jest.fn((_x: unknown, _y: unknown, w: number, h: number) => ({
            data: new Uint8Array(w * h * 4).fill(200),   // 每像素 R=G=B=A=200
        })),
    };

    (globalThis as Record<string, unknown>).OffscreenCanvas = class {
        width: number;
        height: number;
        constructor(w: number, h: number) { this.width = w; this.height = h; }
        getContext() { return mockCtx; }
    };
});

afterEach(() => {
    delete (globalThis as Record<string, unknown>).OffscreenCanvas;
    jest.restoreAllMocks();
});

describe('generateGlyph', () => {
    it('返回 key、width、height 和 Uint8Array data', () => {
        const glyph = generateGlyph('Hello', 16, 'sans-serif');
        expect(typeof glyph.key).toBe('string');
        expect(glyph.width).toBeGreaterThan(0);
        expect(glyph.height).toBeGreaterThan(0);
        expect(glyph.data).toBeInstanceOf(Uint8Array);
    });

    it('data 长度等于 width * height（R8 单通道）', () => {
        const glyph = generateGlyph('Hi', 20, 'monospace');
        expect(glyph.data.length).toBe(glyph.width * glyph.height);
    });

    it('key 随 text/fontSize/fontFamily 唯一确定', () => {
        const g1 = generateGlyph('A', 14, 'sans-serif');
        const g2 = generateGlyph('A', 16, 'sans-serif');
        const g3 = generateGlyph('B', 14, 'sans-serif');
        expect(g1.key).not.toBe(g2.key);
        expect(g1.key).not.toBe(g3.key);
        expect(g2.key).not.toBe(g3.key);
    });

    it('相同参数产生相同 key', () => {
        const g1 = generateGlyph('Hello', 16, 'Arial');
        const g2 = generateGlyph('Hello', 16, 'Arial');
        expect(g1.key).toBe(g2.key);
    });

    it('全内部像素（mock R=200 > 127）经 SDF 变换后结果均为 255', () => {
        const glyph = generateGlyph('T', 14, 'sans-serif');
        // mock R=200 > 127，所有像素均为内部，外部距离 ∞，SDF 归一化为 255
        for (const v of glyph.data) {
            expect(v).toBe(255);
        }
    });
});
