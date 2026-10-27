import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { WebGLRenderer } from '../../renderer/renderer.js';
import type { DrawCommand, SdfRectCommand } from '../../renderer/draw-command.js';
import { identityMat3 } from '../../math/matrix.js';
import { SDF_FRAG } from '../../shaders/sdf.frag.js';

const red = [1, 0, 0, 1] as const;
const blue = [0, 0, 1, 1] as const;
const clear = [0, 0, 0, 0] as const;

function rectangle(overrides: Partial<SdfRectCommand> = {}): SdfRectCommand {
    return {
        id: 1, kind: 'sdf-rect', worldMatrix: identityMat3(), zIndexPath: [0],
        x: 7, y: 7, width: 56, height: 56, radius: 8,
        fill: [...red], stroke: [...blue], strokeWidth: 3,
        ...overrides,
    };
}

function shaderSourceOwner(gl: WebGL2RenderingContext): WebGL2RenderingContext {
    let owner: object | null = gl;
    while (owner) {
        if (Object.getOwnPropertyDescriptor(owner, 'shaderSource')) {
            // This verified prototype owns the native WebGL method; Wake's
            // spyOn requires an own descriptor rather than an inherited one.
            return owner as WebGL2RenderingContext;
        }
        owner = Object.getPrototypeOf(owner) as object | null;
    }
    throw new Error('WebGL shaderSource descriptor is unavailable');
}

function draw(command: DrawCommand, diagnostic = false, width = 96, height = 96) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw new Error('Real WebGL 2 is required for shader pixel regression');
    let renderer: WebGLRenderer | undefined;
    let diagnosticReplacements = 0;
    const shaderSource = gl.shaderSource;
    // Diagnostic-only output: keep the production distance function and real
    // GPU derivatives, expose zero fwidth as red and positive fwidth as green.
    // Zero-derivative locations depend on the GPU's derivative implementation.
    // This is not a CPU reimplementation or a fake WebGL context.
    const sourceSpy = diagnostic ? mock.spyOn(shaderSourceOwner(gl), 'shaderSource').implement(function (this: WebGL2RenderingContext, shader, source) {
        if (this === gl && source === SDF_FRAG) {
            diagnosticReplacements += 1;
            shaderSource.call(this, shader, source.replace('out_color = color;', 'out_color = vec4(fwidth(dist) == 0.0 ? 1.0 : 0.0, fwidth(dist) > 0.0 ? 1.0 : 0.0, 0.0, 1.0);'));
        } else {
            shaderSource.call(this, shader, source);
        }
    }) : undefined;
    try {
        renderer = new WebGLRenderer(gl, width, height, 1);
        if (diagnostic) expect(diagnosticReplacements).toBe(1);
        renderer.render(new Map([[command.id, command]]), 1);
        const pixels = new Uint8Array(width * height * 4);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        expect(gl.getError()).toBe(gl.NO_ERROR);
        return {
            pixel(x: number, y: number) {
                const offset = ((height - y - 1) * width + x) * 4;
                return Array.from(pixels.subarray(offset, offset + 4));
            },
        };
    } finally {
        sourceSpy?.restore();
        renderer?.dispose();
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
}

function expectSolidInterior(image: ReturnType<typeof draw>, bounds: { x: number; y: number; width: number; height: number }, inset: number) {
    const holes: Array<{ x: number; y: number; rgba: number[] }> = [];
    for (let y = Math.ceil(bounds.y + inset); y < bounds.y + bounds.height - inset; y += 1) {
        for (let x = Math.ceil(bounds.x + inset); x < bounds.x + bounds.width - inset; x += 1) {
            const rgba = image.pixel(x, y);
            if (rgba[0] < 254 || rgba[1] > 1 || rgba[2] > 1 || rgba[3] < 254) holes.push({ x, y, rgba });
        }
    }
    expect(holes.slice(0, 8)).toEqual([]);
}

describe('SDF renderer pixels', () => {
    it('keeps fill in the interior, stroke at the edge and the outside transparent', () => {
        const command = rectangle();
        const image = draw(command);
        expect(image.pixel(35, 35)).toEqual([255, 0, 0, 255]);
        expect(image.pixel(8, 35)).toEqual([0, 0, 255, 255]);
        expect(image.pixel(2, 35)).toEqual([0, 0, 0, 0]);
        expect(image.pixel(7, 7)).toEqual([0, 0, 0, 0]);
        expectSolidInterior(image, command, 8);
    });

    it('preserves a transparent interior for an outlined shape', () => {
        const image = draw(rectangle({ fill: [...clear] }));
        expect(image.pixel(35, 35)).toEqual([0, 0, 0, 0]);
        expect(image.pixel(8, 35)).toEqual([0, 0, 255, 255]);
        expect(image.pixel(2, 35)).toEqual([0, 0, 0, 0]);
    });

    it('applies dash gaps only to the stroke band, leaving the fill intact', () => {
        const image = draw(rectangle({ dashLength: 4, gapLength: 4 }));
        expect(image.pixel(25, 8)).toEqual([0, 0, 255, 255]);
        expect(image.pixel(29, 8)).toEqual([0, 0, 0, 0]);
        expect(image.pixel(35, 35)).toEqual([255, 0, 0, 255]);
    });

    it('ignores stroke color when strokeWidth is zero, including tall chart-bar interiors', () => {
        const command = rectangle({ x: 183, y: 85, width: 24, height: 236, radius: 4, strokeWidth: 0 });
        const image = draw(command, false, 512, 384);
        expect(image.pixel(184, 180)).toEqual([255, 0, 0, 255]);
        expect(image.pixel(180, 180)).toEqual([0, 0, 0, 0]);
        expectSolidInterior(image, command, 5);
    });

    it('classifies real GPU derivatives for the affected chart geometry and keeps the production fill solid', () => {
        const command = rectangle({ x: 183, y: 85, width: 24, height: 236, radius: 4, strokeWidth: 0 });
        const diagnostic = draw(command, true, 512, 384);
        let zeroDerivativePixels = 0;
        let positiveDerivativePixels = 0;
        let sampledPixels = 0;
        for (let y = command.y + 5; y < command.y + command.height - 5; y += 1) {
            for (let x = command.x + 5; x < command.x + command.width - 5; x += 1) {
                const rgba = diagnostic.pixel(x, y);
                if (rgba[0] === 255 && rgba[1] === 0) zeroDerivativePixels += 1;
                if (rgba[0] === 0 && rgba[1] === 255) positiveDerivativePixels += 1;
                sampledPixels += 1;
            }
        }
        // Different GPUs may return a positive coarse derivative on every
        // medial fragment. Do not require a zero sample or infer one from a
        // CPU formula; all actual samples must be classified and observable.
        expect(positiveDerivativePixels).toBeGreaterThan(0);
        expect(zeroDerivativePixels + positiveDerivativePixels).toBe(sampledPixels);
        console.info('SDF raw derivative samples', { zeroDerivativePixels, positiveDerivativePixels, sampledPixels });
        expectSolidInterior(draw(command, false, 512, 384), command, 5);
    });

    it('uses the same fill/stroke ownership for circles', () => {
        const image = draw({
            id: 1, kind: 'sdf-circle', worldMatrix: identityMat3(), zIndexPath: [0],
            cx: 35, cy: 35, r: 28, fill: [...red], stroke: [...blue], strokeWidth: 3,
        });
        expect(image.pixel(35, 35)).toEqual([255, 0, 0, 255]);
        expect(image.pixel(8, 35)).toEqual([0, 0, 255, 255]);
        expect(image.pixel(2, 35)).toEqual([0, 0, 0, 0]);
    });
});
