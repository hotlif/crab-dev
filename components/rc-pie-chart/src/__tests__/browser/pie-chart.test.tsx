import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import compiledCss from '../../../.cache/browser-css.json';
import PieChart from '../../../esm/index.mjs';

const data = [
    { name: 'Direct', value: 1, color: '#ff0000' },
    { name: 'Search', value: 3 },
];
const palette = { series: ['#00ff00', '#0000ff'] };

async function waitUntil(ready: () => boolean) {
    const deadline = performance.now() + 4000;
    while (!ready()) {
        if (performance.now() >= deadline) throw new Error('Timed out waiting for chart layout or WebGL draw');
        await act(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
    }
}

async function tap(canvas: HTMLCanvasElement, x: number, y: number, end: 'pointerup' | 'pointercancel' = 'pointerup') {
    const box = canvas.getBoundingClientRect();
    const init = {
        bubbles: true, pointerId: 1, pointerType: 'touch', button: 0,
        clientX: box.left + x * box.width, clientY: box.top + y * box.height,
    };
    await fireEvent(canvas, new PointerEvent('pointerdown', init));
    await fireEvent(canvas, new PointerEvent(end, init));
}

describe('published PieChart', () => {
    it('draws clockwise sectors and leaves the donut hole and outer corners unpainted and inactive', async () => {
        const onSliceClick = mock.fn();
        const chart = (innerRadiusRatio: number) => <>
            <style>{compiledCss}</style>
            <PieChart width={160} height={160} data={data} palette={palette}
                innerRadiusRatio={innerRadiusRatio} onSliceClick={onSliceClick} />
        </>;
        const view = await render(chart(0));
        const canvas = view.container.querySelector('canvas');
        const gl = canvas?.getContext('webgl2');
        if (!canvas || !gl) throw new Error('Expected a WebGL 2 chart');
        // Fractional coordinates refer to the visible canvas and stay valid at any device pixel ratio.
        const pixel = (x: number, y: number) => {
            const result = new Uint8Array(4);
            gl.readPixels(Math.floor(x * canvas.width), canvas.height - 1 - Math.floor(y * canvas.height),
                1, 1, gl.RGBA, gl.UNSIGNED_BYTE, result);
            return Array.from(result);
        };
        try {
            await waitUntil(() => pixel(0.72, 0.28)[0] === 255);
            expect(pixel(0.72, 0.28)).toEqual([255, 0, 0, 255]);
            expect(pixel(0.53, 0.47)).toEqual([255, 0, 0, 255]);
            expect(pixel(0.72, 0.72)).toEqual([0, 0, 255, 255]);
            expect(pixel(0.02, 0.02)[3]).toBe(0);
            await view.rerender(chart(0.5));
            await waitUntil(() => pixel(0.53, 0.47)[3] === 0);
            expect(pixel(0.72, 0.28)).toEqual([255, 0, 0, 255]);
            await tap(canvas, 0.53, 0.47);
            await tap(canvas, 0.02, 0.02);
            await tap(canvas, 0.72, 0.28, 'pointercancel');
            expect(onSliceClick).toHaveBeenCalledTimes(0);
            await tap(canvas, 0.72, 0.28);
            expect(onSliceClick).toHaveBeenCalledWith({ index: 0, name: 'Direct', value: 1, percentage: 25 });
            const bounds = canvas.getBoundingClientRect();
            const move = (x: number, y: number) => fireEvent(canvas, new PointerEvent('pointermove', {
                bubbles: true, pointerType: 'mouse', pointerId: 2,
                clientX: bounds.left + x * bounds.width, clientY: bounds.top + y * bounds.height,
            }));
            const tooltip = () => view.container.querySelector('[aria-hidden="true"] > span')?.textContent;
            await move(0.72, 0.72);
            expect(tooltip()).toBe('Search');
            await move(0.02, 0.02);
            expect(tooltip()).toBe('Direct');
            await fireEvent.keyDown(document.body, { key: 'Escape' });
            expect(tooltip()).toBeUndefined();
            await fireEvent.click(screen.getByRole('button', { name: 'Direct', pressed: true }));
            await waitUntil(() => pixel(0.72, 0.28)[2] === 255);
            expect(pixel(0.53, 0.47)[3]).toBe(0);
            await tap(canvas, 0.72, 0.28);
            expect(onSliceClick).toHaveBeenCalledWith({ index: 1, name: 'Search', value: 3, percentage: 100 });
            expect(gl.getError()).toBe(gl.NO_ERROR);
        } finally {
            await view.unmount();
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });

    it('resizes the canvas and preserves the focused sector across design and color mode changes', async () => {
        const chart = (width: number, designSystem: 'md3' | 'macos' | 'shadcn', colorMode: 'light' | 'dark') => <>
            <style>{compiledCss}</style>
            <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                <div style={{ width }}><PieChart width="auto" height={180} data={data} /></div>
            </ConfigProvider>
        </>;
        const view = await render(chart(400, 'md3', 'light'));
        const canvas = view.container.querySelector('canvas');
        if (!canvas) throw new Error('Missing chart canvas');
        try {
            await waitUntil(() => canvas.getBoundingClientRect().width === 400);
            const first = screen.getByRole('button', { name: 'Direct 1 25%' });
            await act(() => first.focus({ focusVisible: true }));
            await fireEvent.keyDown(first, { key: 'ArrowRight' });
            const second = screen.getByRole('button', { name: 'Search 3 75%' });
            expect(document.activeElement).toBe(second);
            const wideLeft = second.getBoundingClientRect().left;
            for (const [width, design, mode] of [[280, 'macos', 'dark'], [300, 'shadcn', 'light']] as const) {
                await view.rerender(chart(width, design, mode));
                await waitUntil(() => canvas.getBoundingClientRect().width === width);
                expect(document.activeElement).toBe(second);
                expect(second.getBoundingClientRect().left).toBeLessThan(wideLeft);
                expect(second.matches(':focus-visible')).toBe(true);
                const style = getComputedStyle(second);
                expect(style.outlineStyle !== 'none' || style.boxShadow !== 'none').toBe(true);
            }
        } finally {
            const gl = canvas.getContext('webgl2');
            await view.unmount();
            gl?.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });
});
