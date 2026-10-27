import { afterAll, beforeAll, describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';
import { TimePicker } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const temporalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'Temporal');
beforeAll(() => {
    // Use the real polyfill only on browsers without native Temporal; do not
    // replace layout, animation, pointer or other browser APIs in this suite.
    if (!temporalDescriptor) Object.defineProperty(globalThis, 'Temporal', { value: TemporalPolyfill, configurable: true });
});
afterAll(() => {
    if (!temporalDescriptor) Reflect.deleteProperty(globalThis, 'Temporal');
});

const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

// Rasterize the actual SVG paint/mask in the browser. HTML labels are removed
// only from these diagnostic bitmaps so the paint underneath them can be read.
// Their real DOM background and geometry are checked separately below.
async function rasterDial(dial: SVGSVGElement, selectionOnly: boolean) {
    const clone = dial.cloneNode(true) as SVGSVGElement;
    const sources = [dial, ...dial.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];
    for (let index = 0; index < sources.length; index += 1) {
        const source = sources[index]!;
        const copy = copies[index]!;
        if (!(source instanceof globalThis.SVGElement)) continue;
        const style = getComputedStyle(source);
        for (const property of ['fill', 'stroke', 'stroke-width', 'opacity', 'mask-type']) {
            copy.setAttribute(property, style.getPropertyValue(property));
        }
    }
    for (const foreignObject of clone.querySelectorAll('foreignObject')) foreignObject.remove();
    if (selectionOnly) {
        clone.querySelector('[data-clock-line]')?.remove();
        clone.querySelector('[data-clock-hand] circle:not([data-clock-selection])')?.remove();
        for (const node of clone.querySelectorAll('[mask]')) node.removeAttribute('mask');
    }
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '256');
    clone.setAttribute('height', '256');
    const image = new Image();
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new globalThis.XMLSerializer().serializeToString(clone))}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Real SVG/Canvas rasterization is required');
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, 256, 256).data;
}

function samePixel(actual: Uint8ClampedArray, baseline: Uint8ClampedArray, x: number, y: number) {
    const offset = (y * 256 + x) * 4;
    return [0, 1, 2, 3].every(channel => Math.abs(actual[offset + channel]! - baseline[offset + channel]!) <= 1);
}

describe('published clock label paint and geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`masks the hand behind labels without masking neighboring selection circles (${designSystem}/${colorMode})`, async () => {
                const fixture = (hour: number) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <TimePicker key={hour} open value={{ hour, minute: 38, second: 0 }}
                            panelProps={{ hourCycle: 24, defaultMode: 'dial' }} />
                    </ConfigProvider>
                </>;
                const view = await render(fixture(0));
                // Every hour includes inner/outer neighbors at diagonal as well
                // as cardinal positions. Only the line may be masked: neither an
                // HTML glyph background nor a mask on the whole hand is allowed.
                for (let hour = 0; hour < 24; hour += 1) {
                    if (hour !== 0) await view.rerender(fixture(hour));
                    await settle();
                    const dial = document.querySelector<SVGSVGElement>('svg[aria-label="小时表盘"]');
                    if (!dial) throw new Error('This layout regression requires a viewport of at least 360 × 560 and an open dial');
                    const selectedCircle = dial.querySelector<SVGCircleElement>('[data-clock-selection]')!;
                    const cx = selectedCircle.cx.baseVal.value, cy = selectedCircle.cy.baseVal.value;
                    const radius = selectedCircle.r.baseVal.value;
                    expect(radius).toBe(24);
                    expect(getComputedStyle(selectedCircle).maskImage).toBe('none');
                    expect(getComputedStyle(selectedCircle.parentElement!).maskImage).toBe('none');
                    const line = dial.querySelector('[data-clock-line]')!;
                    const mask = dial.querySelector('mask')!;
                    expect(line.getAttribute('mask')).toBe(`url(#${mask.id})`);
                    const actual = await rasterDial(dial, false);
                    const baseline = await rasterDial(dial, true);
                    // Inspect the full circle interior, including the parts under
                    // adjacent glyph boxes. A mask applied to its parent fails.
                    let circlePixels = 0;
                    for (let y = Math.ceil(cy - radius); y < cy + radius; y += 1) {
                        for (let x = Math.ceil(cx - radius); x < cx + radius; x += 1) {
                            if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) >= radius - 1) continue;
                            expect(samePixel(actual, baseline, x, y)).toBe(true);
                            circlePixels += 1;
                        }
                    }
                    expect(circlePixels).toBeGreaterThan(1000);
                    // The line must remain visible between the center dot and
                    // inner labels; an entirely hidden line is not a valid fix.
                    const distance = Math.hypot(cx - 128, cy - 128);
                    const middleX = Math.round(128 + (cx - 128) * 30 / distance);
                    const middleY = Math.round(128 + (cy - 128) * 30 / distance);
                    let linePixels = 0;
                    for (let y = middleY - 2; y <= middleY + 2; y += 1) {
                        for (let x = middleX - 2; x <= middleX + 2; x += 1) {
                            if (!samePixel(actual, baseline, x, y)) linePixels += 1;
                        }
                    }
                    expect(linePixels).toBeGreaterThan(0);
                    const bounds = dial.getBoundingClientRect();
                    const buttons = dial.querySelectorAll<HTMLButtonElement>('[data-clock-value]');
                    expect(buttons.length).toBe(24);
                    for (const button of buttons) {
                        const label = button.querySelector<HTMLElement>('[data-clock-label]');
                        if (!label) throw new Error('Every dial number must retain its own glyph wrapper');
                        const glyph = label.getBoundingClientRect();
                        const hit = button.getBoundingClientRect();
                        expect(glyph.width).toBeGreaterThan(0);
                        expect(glyph.height).toBeGreaterThan(0);
                        expect(glyph.width).toBeLessThan(hit.width);
                        expect(glyph.height).toBeLessThan(hit.height);
                        expect(getComputedStyle(label).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                        expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
                        if (button.getAttribute('aria-pressed') !== 'true') {
                            const left = Math.ceil((glyph.left - bounds.left) / bounds.width * 256);
                            const right = Math.floor((glyph.right - bounds.left) / bounds.width * 256);
                            const top = Math.ceil((glyph.top - bounds.top) / bounds.height * 256);
                            const bottom = Math.floor((glyph.bottom - bounds.top) / bounds.height * 256);
                            // Compare to the unmasked selection-only baseline:
                            // no line behind the real glyph box, but any portion
                            // of the neighboring selection circle is preserved.
                            for (let y = top; y < bottom; y += 1) for (let x = left; x < right; x += 1) {
                                expect(samePixel(actual, baseline, x, y)).toBe(true);
                            }
                        }
                    }
                }
            });
        }
    }
});
