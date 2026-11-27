import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import compiledCss from '../../../.cache/browser-css.json';
// Browser tests exercise the public build with the CSS used to position its point controls.
import LineChart from '../../../esm/index.mjs';

const categories = ['Mon', 'Tue', 'Wed', 'Thu'];
const series = [{ name: 'Observed', color: '#ff0000', data: [2, 5, null, 3] }];

function pointCenter(name: string) {
    const box = screen.getByRole('button', { name }).getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

async function waitUntil(ready: () => boolean) {
    const until = performance.now() + 4000;
    while (!ready()) {
        if (performance.now() >= until) throw new Error('Timed out waiting for chart layout or WebGL draw');
        await act(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
    }
}

describe('published LineChart', () => {
    it('draws a segment, an open gap and an isolated point, and hit-tests the point on touch', async () => {
        const onPointClick = mock.fn();
        const view = await render(<>
            <style>{compiledCss}</style>
            <LineChart width={420} height={180} categories={categories} series={series} onPointClick={onPointClick} />
        </>);
        const canvas = view.container.querySelector('canvas');
        const gl = canvas?.getContext('webgl2');
        if (!canvas || !gl) throw new Error('Expected a real WebGL 2 chart');
        try {
            const first = pointCenter('Mon 2');
            const second = pointCenter('Tue 5');
            const last = pointCenter('Thu 3');
            const bounds = canvas.getBoundingClientRect();
            // Sampling a whole physical-pixel column also catches a false bridge
            // drawn via zero, which need not cross the interpolated y coordinate.
            const hasSeriesInk = (clientX: number) => {
                const x = Math.floor((clientX - bounds.left) * canvas.width / bounds.width);
                const pixels = new Uint8Array(canvas.height * 4);
                gl.readPixels(x, 0, 1, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
                for (let i = 0; i < pixels.length; i += 4) {
                    if (pixels[i] > 200 && pixels[i + 1] < 50 && pixels[i + 2] < 50 && pixels[i + 3] > 180) return true;
                }
                return false;
            };
            await waitUntil(() => hasSeriesInk((first.x + second.x) / 2));
            expect(hasSeriesInk(last.x)).toBe(true);
            expect(hasSeriesInk((second.x + last.x) / 2)).toBe(false);
            expect(gl.getError()).toBe(gl.NO_ERROR);

            const touch = { bubbles: true, pointerId: 1, pointerType: 'touch', button: 0, clientX: last.x, clientY: last.y };
            await fireEvent(canvas, new PointerEvent('pointerdown', touch));
            await fireEvent(canvas, new PointerEvent('pointerup', touch));
            expect(onPointClick).toHaveBeenCalledWith({
                categoryIndex: 3, seriesIndex: 0, category: 'Thu', seriesName: 'Observed', value: 3,
            });
        } finally {
            await view.unmount();
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    });

    it('tracks the parent width and preserves keyboard focus across resize and theme changes', async () => {
        const chart = (width: number, designSystem: 'md3' | 'macos' | 'shadcn', colorMode: 'light' | 'dark') => <>
            <style>{compiledCss}</style>
            <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                <div style={{ width }}><LineChart width="auto" height={180} categories={categories} series={series} /></div>
            </ConfigProvider>
        </>;
        const view = await render(chart(480, 'md3', 'light'));
        const canvas = view.container.querySelector('canvas');
        if (!canvas) throw new Error('Missing chart canvas');
        try {
            await waitUntil(() => canvas.getBoundingClientRect().width === 480);
            const point = screen.getByRole('button', { name: 'Thu 3' });
            await act(() => point.focus({ focusVisible: true }));
            const wideX = pointCenter('Thu 3').x;
            for (const [width, design, mode] of [[300, 'macos', 'dark'], [320, 'shadcn', 'light']] as const) {
                await view.rerender(chart(width, design, mode));
                await waitUntil(() => canvas.getBoundingClientRect().width === width);
                expect(document.activeElement).toBe(point);
                expect(pointCenter('Thu 3').x).toBeLessThan(wideX);
                expect(point.matches(':focus-visible')).toBe(true);
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
