import { describe, expect, it } from '@crab-dev/wake/test';
import { WebGLRenderer } from '../../renderer/renderer.js';
import { generateGlyph, generateBitmapGlyph } from '../../renderer/text-atlas.js';
import type { GlyphInfo } from '../../renderer/text-atlas.js';
import type { DrawCommand } from '../../renderer/draw-command.js';
import { identityMat3, makeScaleMat3 } from '../../math/matrix.js';

function renderGlyph(glyph: GlyphInfo, dpr: number, zoom = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = 512 * dpr;
    canvas.height = 64 * dpr;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw new Error('Real WebGL 2 is required for text pixel regression');
    const renderer = new WebGLRenderer(gl, 512, 64, dpr);
    try {
        renderer.uploadGlyph(glyph.key, glyph.data, glyph.width, glyph.height);
        renderer.setViewMatrix(makeScaleMat3(zoom, zoom));
        renderer.render(new Map<number, DrawCommand>([[1, {
            id: 1, kind: 'sdf-text', worldMatrix: identityMat3(), zIndexPath: [0],
            x: 0, y: 0, glyphKey: glyph.key, glyphWidth: glyph.worldWidth, glyphHeight: glyph.worldHeight,
            color: [0, 0, 0, 1],
        }]]), 1);
        const pixels = new Uint8Array(canvas.width * canvas.height * 4);
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        expect(gl.getError()).toBe(gl.NO_ERROR);
        return pixels;
    } finally {
        renderer.dispose();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
}

describe('text renderer pixels', () => {
    it('keeps flat distance-field interiors opaque and exteriors transparent', () => {
        for (const value of [0, 255]) {
            const pixels = renderGlyph({ key: `flat-${value}`, width: 8, height: 8,
                worldWidth: 8, worldHeight: 8, channels: 1, data: new Uint8Array(64).fill(value) }, 1);
            for (let y = 1; y < 7; y++) {
                for (let x = 1; x < 7; x++) expect(pixels[((64 - y - 1) * 512 + x) * 4 + 3]).toBe(value);
            }
        }
    });

    it('preserves small mixed-script stroke coverage at default and fractional scales', () => {
        for (const fontSize of [10, 12, 14]) {
            const text = '商品模型 products revision name price';
            const glyph = generateGlyph(text, fontSize, 'system-ui');
            // The native rasterizer at the same 4x sampling rate is the
            // reference, before distance-field reconstruction. Integrate ink
            // rather than requiring platform-specific font pixel snapshots.
            const reference = generateBitmapGlyph(text, fontSize, 'system-ui', 4);
            const referenceInk = reference.data.reduce((sum, alpha) => sum + alpha, 0) / 16;
            for (const [dpr, zoom] of [[1, 1], [1.25, 1], [2, 1], [1, 0.75], [1, 1.5]]) {
                const pixels = renderGlyph(glyph, dpr, zoom);
                let ink = 0;
                for (let i = 3; i < pixels.length; i += 4) ink += pixels[i];
                const ratio = ink / (referenceInk * (dpr * zoom) ** 2);
                // Allow undersampling at reduced zoom, but never inflate the
                // ink by more than 10% (the old contour bias exceeded this).
                expect(ratio).toBeGreaterThan(zoom < 1 ? 0.8 : 0.85);
                expect(ratio).toBeLessThan(1.1);
            }
        }
    });
});
