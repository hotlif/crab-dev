import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import compiledCss from '../../../.cache/browser-css.json';
// Exercise the publicly built ESM and the CSS that aligns the keyboard controls with the drawing.
import ScatterChart from '../../../esm/index.mjs';

const right = { x: 3, y: 2, label: 'Right' };
const left = { x: -7, y: -2, label: 'Left' };
const middle = { x: -5, y: 8, label: 'High' };
const twin = { x: 3, y: 2, label: 'Twin' };
const series = [{ name: 'A', color: '#ff0000', data: [right, left, middle, twin] }];

function buttonFor(point: typeof right) {
    return screen.getByRole('button', { name: `A ${point.label} X ${point.x} Y ${point.y}` });
}

function center(point: typeof right) {
    const box = buttonFor(point).getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

async function waitUntil(ready: () => boolean) {
    const deadline = performance.now() + 4000;
    while (!ready()) {
        if (performance.now() >= deadline) throw new Error('Timed out waiting for scatter chart measurement or WebGL pixels');
        await act(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
    }
}

describe('published ScatterChart', () => {
    it('paints isolated marks at numeric coordinates and selects the topmost overlapping observation', async () => {
        const onPointClick = mock.fn();
        const view = await render(<>
            <style>{compiledCss}</style>
            <ScatterChart width={440} height={220} series={series} onPointClick={onPointClick} />
        </>);
        const canvas = view.container.querySelector('canvas');
        const gl = canvas?.getContext('webgl2');
        if (!canvas || !gl) throw new Error('Expected the published chart to mount a WebGL 2 canvas');
        try {
            const a = center(left);
            const b = center(middle);
            const c = center(right);
            expect((c.x - b.x) / (b.x - a.x)).toBeCloseTo(4, 2);
            expect((a.y - b.y) / (c.y - b.y)).toBeCloseTo(10 / 6, 2);
            expect(center(twin)).toEqual(c);
            const bounds = canvas.getBoundingClientRect();
            // Look along a whole column so a line at any height between samples fails the assertion.
            const hasPointInk = (clientX: number, clientY?: number) => {
                const x = Math.floor((clientX - bounds.left) * canvas.width / bounds.width);
                const y = clientY === undefined ? 0 : canvas.height - 1 - Math.floor((clientY - bounds.top) * canvas.height / bounds.height);
                const height = clientY === undefined ? canvas.height : 1;
                const pixels = new Uint8Array(height * 4);
                gl.readPixels(x, y, 1, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i] > 200 && pixels[i + 1] < 50 && pixels[i + 2] < 50 && pixels[i + 3] > 180) return true;
                }
                return false;
            };
            await waitUntil(() => hasPointInk(a.x, a.y));
            expect(hasPointInk(b.x, b.y)).toBe(true);
            expect(hasPointInk(c.x, c.y)).toBe(true);
            expect(hasPointInk((b.x + c.x) / 2)).toBe(false);
            expect(hasPointInk((a.x + b.x) / 2)).toBe(false);
            expect(gl.getError()).toBe(gl.NO_ERROR);
            for (const target of [{ x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 }, c]) {
                const touch = { bubbles: true, pointerId: 1, pointerType: 'touch', button: 0, clientX: target.x, clientY: target.y };
                await fireEvent(canvas, new PointerEvent('pointerdown', touch));
                await fireEvent(canvas, new PointerEvent('pointerup', touch));
            }
            expect(onPointClick).toHaveBeenCalledTimes(1);
            expect(onPointClick).toHaveBeenCalledWith({ seriesIndex: 0, pointIndex: 3, seriesName: 'A', point: twin });
        } finally {
            await view.unmount();
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });

    it('repositions the points on container resize and preserves keyboard focus across themes', async () => {
        const fixture = (width: number, designSystem: 'md3' | 'macos' | 'shadcn', colorMode: 'light' | 'dark') => <>
            <style>{compiledCss}</style>
            <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                <div style={{ width }}><ScatterChart width="auto" height={200} series={series} /></div>
            </ConfigProvider>
        </>;
        const view = await render(fixture(480, 'md3', 'light'));
        const canvas = view.container.querySelector('canvas');
        if (!canvas) throw new Error('Missing chart canvas');
        try {
            await waitUntil(() => canvas.getBoundingClientRect().width === 480);
            const point = buttonFor(right);
            await act(() => point.focus({ focusVisible: true }));
            const wideX = center(right).x;
            for (const [width, design, mode] of [[290, 'macos', 'dark'], [320, 'shadcn', 'light']] as const) {
                await view.rerender(fixture(width, design, mode));
                await waitUntil(() => canvas.getBoundingClientRect().width === width);
                expect(document.activeElement).toBe(point);
                expect(point.matches(':focus-visible')).toBe(true);
                expect(center(right).x).toBeLessThan(wideX);
                const style = getComputedStyle(point);
                expect(style.outlineStyle !== 'none' || style.boxShadow !== 'none').toBe(true);
            }
        } finally {
            const gl = canvas.getContext('webgl2');
            await view.unmount();
            gl?.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });
});
