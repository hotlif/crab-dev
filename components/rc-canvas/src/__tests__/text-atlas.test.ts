import { describe, it, expect, beforeEach, afterEach, mock } from "@crab-dev/wake/test";
import { generateGlyph, generateBitmapGlyph, generateAdaptiveGlyph, invalidateTextFonts } from '../renderer/text-atlas.js';
beforeEach(() => {
    // jsdom 不支持 OffscreenCanvas，用最小 mock 代替
    const mockCtx = {
        font: '',
        fillStyle: '',
        scale: mock.fn(),
        fillRect: mock.fn(),
        fillText: mock.fn(),
        measureText: mock.fn(() => ({ width: 80 })),
        getImageData: mock.fn((_x: unknown, _y: unknown, w: number, h: number) => ({
            data: new Uint8Array(w * h * 4).fill(200), // 每像素 R=G=B=A=200
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
    mock.restoreAll();
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
    it('保留灰度覆盖率中的亚像素边缘，而不是把半透明笔画当作实心区域', () => {
        const glyph = generateGlyph('T', 14, 'sans-serif');
        // R=200 is partial coverage: the edge is less than half a raster pixel
        // away, even when every sample has the same value. Binarizing it makes
        // the entire field opaque and loses the original stroke boundary.
        for (const v of glyph.data) {
            expect(v).toBeGreaterThan(127);
            expect(v).toBeLessThan(132);
        }
    });
    it('含 \\n 的文字高度大于单行', () => {
        const single = generateGlyph('Hello', 16, 'sans-serif');
        const multi = generateGlyph('Hello\nWorld', 16, 'sans-serif');
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
        const single = generateGlyph('a b c', 16, 'sans-serif');
        const wrapped = generateGlyph('a b c', 16, 'sans-serif', undefined, 10);
        expect(wrapped.worldHeight).toBeGreaterThan(single.worldHeight);
    });
});
describe('generateBitmapGlyph', () => {
    it('channels=1，data 长度等于 width * height', () => {
        const glyph = generateBitmapGlyph('Hi', 12, 'system-ui', 2);
        expect(glyph.channels).toBe(1);
        expect(glyph.data).toBeInstanceOf(Uint8Array);
        expect(glyph.data.length).toBe(glyph.width * glyph.height);
    });
    it('纹理为物理像素尺寸，world 尺寸 = 纹理 / dpr', () => {
        const dpr = 2;
        const glyph = generateBitmapGlyph('Hello', 12, 'system-ui', dpr);
        // mock measureText width=80，pad = ceil(dpr) = 2 → w = 80 + 2*2
        expect(glyph.width).toBe(84);
        expect(glyph.worldWidth).toBe(glyph.width / dpr);
        expect(glyph.worldHeight).toBe(glyph.height / dpr);
    });
    it('data 直接取光栅 R 通道（无 SDF 变换）', () => {
        const glyph = generateBitmapGlyph('T', 12, 'system-ui', 1);
        // mock getImageData 每像素 R=200 → coverage 原样保留
        for (const v of glyph.data) {
            expect(v).toBe(200);
        }
    });
    it('key 含 dpr，且与同参数的 SDF key 不冲突', () => {
        const bmp1 = generateBitmapGlyph('A', 14, 'sans-serif', 1);
        const bmp2 = generateBitmapGlyph('A', 14, 'sans-serif', 2);
        const sdf = generateGlyph('A', 14, 'sans-serif');
        expect(bmp1.key).not.toBe(bmp2.key);
        expect(bmp1.key).not.toBe(sdf.key);
    });
});

describe('adaptive text layout and cache', () => {
    it('keeps wrapping and world bounds stable across DPR, zoom and backend changes', () => {
        const base = generateAdaptiveGlyph('a b c', 13, 'system-ui', 1, 20, 60, document);
        for (const scale of [0.75, 1.25, 2, 4]) {
            for (const sdf of [false, true]) {
                const next = generateAdaptiveGlyph('a b c', 13, 'system-ui', scale, 20, 60, document, 400, sdf);
                expect(next.worldWidth).toBe(base.worldWidth);
                expect(next.worldHeight).toBe(base.worldHeight);
                expect(next.width).toBeLessThanOrEqual(2048);
            }
        }
    });
    it('reuses textures but invalidates loaded fonts and separates weights', () => {
        const glyph = () => generateAdaptiveGlyph('cache', 13, 'system-ui', 2, undefined, undefined, document);
        const before = glyph();
        expect(glyph()).toBe(before);
        expect(generateAdaptiveGlyph('cache', 13, 'system-ui', 2, undefined, undefined, document, 700).key).not.toBe(before.key);
        invalidateTextFonts(document);
        expect(glyph().key).not.toBe(before.key);
    });
    it('bounds large allocations and evicts least recently used entries', () => {
        const large = generateAdaptiveGlyph('large', 1000, 'system-ui', 8, undefined, undefined, document);
        expect(large.width).toBeLessThanOrEqual(2048);
        expect(large.height).toBeLessThanOrEqual(2048);
        const first = generateAdaptiveGlyph('entry-0', 13, 'system-ui', 1, undefined, undefined, document);
        for (let i = 1; i <= 128; i++) generateAdaptiveGlyph(`entry-${i}`, 13, 'system-ui', 1, undefined, undefined, document);
        expect(generateAdaptiveGlyph('entry-0', 13, 'system-ui', 1, undefined, undefined, document)).not.toBe(first);
    });
});
