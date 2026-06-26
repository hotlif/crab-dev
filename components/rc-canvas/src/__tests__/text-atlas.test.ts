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

    it('channels=1（SDF），data 长度等于 width * height', () => {
        const glyph = generateGlyph('Hi', 20, 'monospace');
        expect(glyph.channels).toBe(1);
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

    it('含 \\n 的文字高度大于单行', () => {
        const single = generateGlyph('Hello', 16, 'sans-serif');
        const multi  = generateGlyph('Hello\nWorld', 16, 'sans-serif');
        expect(multi.worldHeight).toBeGreaterThan(single.worldHeight);
        expect(multi.data.length).toBe(multi.width * multi.height * multi.channels);
    });

    it('lineHeight 影响 key 唯一性', () => {
        const g1 = generateGlyph('Hi', 14, 'sans-serif');
        const g2 = generateGlyph('Hi', 14, 'sans-serif', 24);
        expect(g1.key).not.toBe(g2.key);
    });

    it('maxWidth 影响 key 唯一性', () => {
        const g1 = generateGlyph('Hi', 14, 'sans-serif');
        const g2 = generateGlyph('Hi', 14, 'sans-serif', undefined, 100);
        expect(g1.key).not.toBe(g2.key);
    });

    it('maxWidth 较小时高度大于不限宽', () => {
        // mock measureText 对所有字符串返回 width:80（超采样后为 80px）
        // maxWidth=10（超采样 40px）< 80px，每个词都会单独换行
        const single  = generateGlyph('a b c', 16, 'sans-serif');
        const wrapped = generateGlyph('a b c', 16, 'sans-serif', undefined, 10);
        expect(wrapped.worldHeight).toBeGreaterThan(single.worldHeight);
    });
});
