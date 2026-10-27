import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Divider from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

// Rasterize the actual published SVG and its resolved paint, not a hand-written
// dash formula. Explicit output scaling tests DPR 1 and 2 independently of the
// host display; phase is always in CSS pixels, while samples are bitmap pixels.
async function rasterLine(svg: SVGSVGElement, vertical: boolean, phase: number, dpr: number) {
    const rect = svg.getBoundingClientRect();
    const width = Math.ceil(rect.width), height = Math.ceil(rect.height);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    const source = svg.querySelector('line');
    if (!source) throw new Error('Divider did not render an SVG line');
    const paint = getComputedStyle(source);
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.removeAttribute('class');
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(width));
    clone.setAttribute('height', String(height));
    clone.setAttribute('viewBox', `${vertical ? 0 : -phase} ${vertical ? -phase : 0} ${width} ${height}`);
    const line = clone.querySelector('line')!;
    for (const property of ['stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap', 'fill']) {
        line.setAttribute(property, paint.getPropertyValue(property));
    }
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new globalThis.XMLSerializer().serializeToString(clone))}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Real canvas rasterization is required');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    const alphas: number[] = [];
    for (let axis = 8 * dpr; axis < (vertical ? canvas.height : canvas.width) - 8 * dpr; axis += 1) {
        const x = vertical ? Math.floor(canvas.width / 2) : axis;
        const y = vertical ? axis : Math.floor(canvas.height / 2);
        alphas.push(data[(y * canvas.width + x) * 4 + 3]!);
    }
    return alphas;
}

describe('published Divider dotted raster at DPR 1 and 2', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps background pixels between dots (${designSystem}/${colorMode})`, async () => {
                const view = await render(<>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <div style={{ width: 240 }}>
                            <Divider variant="dotted" data-testid="horizontal" />
                            <Divider variant="dotted" data-testid="text">标题</Divider>
                            <Divider direction="vertical" variant="dotted" style={{ height: 192 }} data-testid="vertical" />
                            <Divider data-testid="solid" />
                        </div>
                    </ConfigProvider>
                </>);
                await act(async () => { await new Promise<void>(resolve => requestAnimationFrame(() => resolve())); });
                for (const id of ['horizontal', 'text', 'vertical']) {
                    const svgs = view.container.querySelectorAll<SVGSVGElement>(`[data-testid="${id}"] svg`);
                    expect(svgs.length).toBe(id === 'text' ? 2 : 1);
                    for (const svg of svgs) for (const phase of [0, 0.5]) for (const dpr of [1, 2]) {
                        const alphas = await rasterLine(svg, id === 'vertical', phase, dpr);
                        expect(alphas.length).toBeGreaterThan(20);
                        // The former 1px cap / 2px pitch paints every DPR-1 pixel.
                        expect(alphas.filter(alpha => alpha === 0).length).toBeGreaterThan(5);
                        expect(alphas.filter(alpha => alpha > 0).length).toBeGreaterThan(5);
                    }
                }
                const solid = view.container.querySelector<SVGSVGElement>('[data-testid="solid"] svg')!;
                for (const dpr of [1, 2]) {
                    expect((await rasterLine(solid, false, 0, dpr)).every(alpha => alpha > 0)).toBe(true);
                }
            });
        }
    }
});
