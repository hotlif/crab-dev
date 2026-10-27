import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import Canvas, { DEFAULT_CANVAS_PALETTE, Rect } from '@crab-dev/rc-canvas';
import type { CSSProperties } from 'react';
import { dimColor } from '../../palette.js';

const keep = 0.45;
const backgrounds = [
    { name: 'light', color: '#ffffff', rgb: [255, 255, 255] },
    { name: 'dark', color: '#18181b', rgb: [24, 24, 27] },
] as const;
const series = [
    { name: 'blue', color: '#0066ff', rgb: [0, 102, 255] },
    { name: 'green', color: '#008a45', rgb: [0, 138, 69] },
    { name: 'orange', color: '#d98300', rgb: [217, 131, 0] },
] as const;

function pixels(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('The dim-color regression requires real WebGL 2');
    return {
        at(x: number, y: number): number[] {
            const result = new Uint8Array(4);
            gl.readPixels(x, canvas.height - y - 1, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, result);
            expect(gl.getError()).toBe(gl.NO_ERROR);
            return Array.from(result);
        },
        dispose() {
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        },
    };
}

async function waitForDraw(isReady: () => boolean): Promise<void> {
    await act(async () => {
        const deadline = performance.now() + 3000;
        while (performance.now() < deadline) {
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
            if (isReady()) return;
        }
        throw new Error('Canvas did not produce the expected opaque draw');
    });
}

function expectRgb(actual: number[], expected: readonly number[]): void {
    for (let channel = 0; channel < 3; channel += 1) {
        expect(Math.abs(actual[channel]! - expected[channel]!)).toBeLessThanOrEqual(1);
    }
    expect(actual[3]).toBe(255);
}

function fixture(color: string, background: string, onRender: () => void) {
    // Explicit fixture inputs exercise the production CSS inheritance bridge;
    // they are not alternate product tokens or a mocked color resolver.
    const style: CSSProperties & Record<'--series' | '--surface', string> = {
        '--series': color,
        '--surface': background,
    };
    const colors = [
        dimColor(color, keep, background),
        dimColor('var(--series)', keep, 'var(--surface)'),
        dimColor('var(--series)', 1, 'var(--surface)'),
        dimColor('var(--series)', 0, 'var(--surface)'),
    ];
    return <div style={style}>
        <Canvas width={240} height={80} dpr={1} palette={DEFAULT_CANVAS_PALETTE} onRender={onRender}>
            {colors.map((fill, index) => <Rect key={`bar-${index}`} x={8 + index * 56} y={8} width={32} height={56} radius={4} fill={fill} />)}
            {colors.map((fill, index) => <Rect key={`base-${index}`} x={8 + index * 56} y={56} width={32} height={8} fill={fill} />)}
        </Canvas>
    </div>;
}

describe('dimmed series through real CSS variables and Canvas pixels', () => {
    for (const background of backgrounds) {
        for (const color of series) {
            it(`${background.name}/${color.name}: matches literal sRGB, preserves original color and keeps overlaps opaque`, async () => {
                let draws = 0;
                const view = await render(fixture(color.color, background.color, () => { draws += 1; }));
                const canvas = view.container.querySelector('canvas');
                if (!canvas) throw new Error('Missing real Canvas element');
                const image = pixels(canvas);
                try {
                    await waitForDraw(() => draws > 0 && image.at(80, 32)[3] === 255);
                    const literal = image.at(24, 32);
                    const variable = image.at(80, 32);
                    // The old OKLCh fallback rotates blue/green/orange toward
                    // the surface hue. This compares real rendered pixels,
                    // not the spelling of a color-mix expression.
                    expectRgb(variable, literal);
                    expectRgb(image.at(24, 60), literal);
                    expectRgb(image.at(80, 60), variable);
                    expectRgb(image.at(136, 32), color.rgb);
                    expectRgb(image.at(192, 32), background.rgb);
                    expect(image.at(4, 4)).toEqual([0, 0, 0, 0]);
                } finally {
                    await view.unmount();
                    image.dispose();
                }
            });
        }
    }

    it('re-resolves cached CSS expressions when the inherited background changes on the same canvas', async () => {
        let draws = 0;
        const onRender = () => { draws += 1; };
        const view = await render(fixture(series[0].color, backgrounds[0].color, onRender));
        const canvas = view.container.querySelector('canvas');
        if (!canvas) throw new Error('Missing real Canvas element');
        const image = pixels(canvas);
        try {
            await waitForDraw(() => draws > 0 && image.at(80, 32)[3] === 255);
            const light = image.at(80, 32);
            expectRgb(light, image.at(24, 32));
            const previousDraws = draws;
            await view.rerender(fixture(series[0].color, backgrounds[1].color, onRender));
            expect(view.container.querySelector('canvas')).toBe(canvas);
            await waitForDraw(() => draws > previousDraws && image.at(80, 32)[0] !== light[0]);
            const dark = image.at(80, 32);
            expectRgb(dark, image.at(24, 32));
            expectRgb(image.at(80, 60), dark);
            expectRgb(image.at(192, 32), backgrounds[1].rgb);
            expect(dark[0]).toBeLessThan(light[0]!);
        } finally {
            await view.unmount();
            image.dispose();
        }
    });
});
