import { describe, it, expect, afterEach, mock } from '@crab-dev/wake/test';
import { createTextRasterContext } from '../renderer/text-surface.js';
import { generateBitmapGlyph } from '../renderer/text-atlas.js';

const originalOffscreen = Object.getOwnPropertyDescriptor(globalThis, 'OffscreenCanvas');
afterEach(() => {
    if (originalOffscreen) Object.defineProperty(globalThis, 'OffscreenCanvas', originalOffscreen);
    else Reflect.deleteProperty(globalThis, 'OffscreenCanvas');
    mock.restoreAll();
});

describe('text raster surface fallback', () => {
    it('uses the supplied owning document when OffscreenCanvas is unavailable', () => {
        Reflect.deleteProperty(globalThis, 'OffscreenCanvas');
        const owner = document.implementation.createHTMLDocument('raster owner');
        const surface = owner.createElement('canvas');
        const context = {
            font: '', fillStyle: '', textBaseline: '',
            fillRect: mock.fn(), fillText: mock.fn(),
            measureText: mock.fn(() => ({ width: 80, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 })),
            getImageData: mock.fn((_x: number, _y: number, width: number, height: number) => ({ data: new Uint8ClampedArray(width * height * 4).fill(200) })),
        };
        Object.defineProperty(surface, 'getContext', { value: mock.fn(() => context), configurable: true });
        const create = mock.fn(() => surface);
        Object.defineProperty(owner, 'createElement', { value: create, configurable: true });
        expect(createTextRasterContext(20, 10, owner)).toBe(context);
        expect(surface.width).toBe(20);
        expect(surface.height).toBe(10);
        const glyph = generateBitmapGlyph('WebKit 字形', 14, 'sans-serif', 1, undefined, undefined, owner);
        expect(glyph.width).toBe(82);
        expect(glyph.data.length).toBe(glyph.width * glyph.height);
        expect(glyph.data.every(value => value === 200)).toBe(true);
        expect(create).toHaveBeenCalledTimes(3);
    });

    it('reports a missing 2D context explicitly rather than returning an unusable surface', () => {
        Reflect.deleteProperty(globalThis, 'OffscreenCanvas');
        const owner = document.implementation.createHTMLDocument('no 2d');
        const surface = owner.createElement('canvas');
        Object.defineProperty(surface, 'getContext', { value: () => null, configurable: true });
        Object.defineProperty(owner, 'createElement', { value: () => surface, configurable: true });
        expect(() => createTextRasterContext(1, 1, owner)).toThrow('2D canvas context');
    });
});
