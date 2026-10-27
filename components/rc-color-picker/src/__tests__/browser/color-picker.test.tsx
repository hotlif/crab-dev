import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import semanticToken from '@crab-dev/rc-token-semantic';
import type { OKLCHValue } from '../../types.js';
// Layout-only exception: these regressions must consume the actual extracted
// Slider, Masonry and ColorPicker styles, not the DOM suite's css() mock.
import ColorPicker, { ColorPickerPanel } from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

const presets: OKLCHValue[] = Array.from({ length: 8 }, (_, index) => ({ lightness: 0.6, chroma: 0.15, hue: index * 45 }));
const colors: OKLCHValue[] = [
    { lightness: 0, chroma: 0, hue: 0, alpha: 0 },
    { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0.5 },
    { lightness: 1, chroma: 0.4, hue: 360, alpha: 1 },
];

describe('ColorPicker actual trigger state CSS', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`provides separate enabled feedback and stable disabled geometry (${designSystem}/${colorMode})`, async () => {
                // These aliases probe the emitted selectors; native pointer states
                // are separately verified by the candidate capture runner.
                const stateCss = compiledCss.replaceAll(':hover', '[data-probe-hover]').replaceAll(':active', '[data-probe-active]');
                const changed = mock.fn();
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{stateCss}</style>
                    <ColorPicker value={colors[1]} onOpenChange={changed} />
                    <ColorPicker value={colors[1]} disabled onOpenChange={changed} />
                    <span data-witness="" style={{ borderColor: token.trigger['border-color-hover'], backgroundColor: token.trigger['background-color-hover'] }} />
                </ConfigProvider>);
                const triggers = view.container.querySelectorAll<HTMLElement>('[role="button"][aria-haspopup="dialog"]');
                expect(triggers.length).toBe(2);
                const expected = getComputedStyle(view.container.querySelector<HTMLElement>('[data-witness]')!);
                for (const trigger of triggers) {
                    const before = getComputedStyle(trigger).backgroundColor;
                    const bounds = trigger.getBoundingClientRect();
                    trigger.setAttribute('data-probe-hover', '');
                    if (trigger.getAttribute('aria-disabled') === 'true') {
                        expect(getComputedStyle(trigger).backgroundColor).toBe(before);
                        await fireEvent.click(trigger);
                        expect(trigger.getAttribute('aria-expanded')).toBe('false');
                    } else {
                        expect(getComputedStyle(trigger).borderColor).toBe(expected.borderColor);
                        expect(getComputedStyle(trigger).backgroundColor).toBe(expected.backgroundColor);
                        expect(getComputedStyle(trigger).backgroundColor).not.toBe(before);
                        trigger.setAttribute('data-probe-active', '');
                        const pressed = getComputedStyle(trigger).backgroundColor;
                        expect(pressed).not.toBe(before);
                        expect(pressed).not.toBe(expected.backgroundColor);
                    }
                    expect(trigger.getBoundingClientRect().width).toBe(bounds.width);
                    expect(trigger.getBoundingClientRect().height).toBe(bounds.height);
                }
                expect(changed).not.toHaveBeenCalled();
            });
        }
    }
});
const settleLayout = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    // Inspect the settled geometry after density/value transitions, without
    // replacing any product layout rule or guessing a fixed timeout.
    for (const animation of document.getAnimations()) {
        if (animation.effect?.getComputedTiming().iterations !== Infinity) animation.finish();
    }
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

function getPanel(container: HTMLElement): HTMLElement {
    const panel = container.querySelector<HTMLElement>('[data-testid="color-panel"]');
    if (!panel) throw new Error('Missing ColorPicker panel fixture');
    return panel;
}

describe('ColorPicker published CSS in both inline directions', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const direction of ['ltr', 'rtl'] as const) {
            it(`keeps full-range gradients, mirrored values and every preset visible (${designSystem}/${direction})`, async () => {
                const changed = mock.fn();
                const fixture = (value: OKLCHValue, density: 'compact' | 'standard' | 'comfortable') => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} direction={direction} density={density}>
                        <div style={{ width: 360 }}>
                            <ColorPickerPanel value={value} presets={presets} onValueChange={changed} showEyeDropper={false} data-testid="color-panel" />
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture(colors[1], 'standard'));
                const panel = getPanel(view.container);
                for (const density of ['compact', 'standard', 'comfortable'] as const) {
                    for (const color of colors) {
                        await view.rerender(fixture(color, density));
                        await settleLayout();
                        const sliders = Array.from(panel.querySelectorAll<HTMLElement>('[role="slider"]'));
                        expect(sliders).toHaveLength(4);
                        for (const slider of sliders) {
                            const rail = slider.querySelector<HTMLElement>('[data-slot="slider-rail"]');
                            const handle = slider.querySelector<HTMLElement>('[data-slot="slider-handle-container"]');
                            if (!rail || !handle) throw new Error('Missing actual Slider rail or handle');
                            const bounds = slider.getBoundingClientRect();
                            const railBounds = rail.getBoundingClientRect();
                            const handleBounds = handle.getBoundingClientRect();
                            expect(bounds.width).toBeGreaterThan(0);
                            expect(railBounds.width).toBeCloseTo(bounds.width, 1);
                            expect(railBounds.left).toBeCloseTo(bounds.left, 1);
                            expect(railBounds.right).toBeCloseTo(bounds.right, 1);
                            expect(getComputedStyle(rail).backgroundImage.startsWith(`linear-gradient(to ${direction === 'rtl' ? 'left' : 'right'},`)).toBe(true);
                            const fraction = (Number(slider.getAttribute('aria-valuenow')) - Number(slider.getAttribute('aria-valuemin')))
                                / (Number(slider.getAttribute('aria-valuemax')) - Number(slider.getAttribute('aria-valuemin')));
                            const expectedCenter = bounds.left + bounds.width * (direction === 'rtl' ? 1 - fraction : fraction);
                            expect(handleBounds.left + handleBounds.width / 2).toBeCloseTo(expectedCenter, 1);
                        }

                        const swatches = Array.from(panel.querySelectorAll<HTMLButtonElement>('button[aria-label^="#"]'));
                        expect(swatches).toHaveLength(presets.length);
                        const panelBounds = panel.getBoundingClientRect();
                        for (const swatch of swatches) {
                            const bounds = swatch.getBoundingClientRect();
                            expect(bounds.width).toBeGreaterThan(0);
                            expect(bounds.left).toBeGreaterThanOrEqual(panelBounds.left - 0.1);
                            expect(bounds.right).toBeLessThanOrEqual(panelBounds.right + 0.1);
                            expect(bounds.bottom).toBeLessThanOrEqual(panelBounds.bottom + 0.1);
                            const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
                            expect(hit !== null && swatch.contains(hit)).toBe(true);
                        }
                        // Slider endpoints locate the handle's centre, so a maximum
                        // value intentionally extends half a handle beyond the panel.
                        // Scrollable overflow alone is not a scrollbar or clipping.
                        const overflow = Array.from(panel.querySelectorAll<HTMLElement>('*')).filter(element => {
                            const bounds = element.getBoundingClientRect();
                            return bounds.left < panelBounds.left - 0.1 || bounds.right > panelBounds.right + 0.1;
                        });
                        try {
                            let endpointOutset = 0;
                            for (const element of overflow) {
                                expect(['slider-handle-container', 'slider-handle']).toContain(element.getAttribute('data-slot'));
                                const slider = element.closest<HTMLElement>('[role="slider"]');
                                const handle = slider?.querySelector<HTMLElement>('[data-slot="slider-handle"]');
                                if (!slider || !handle) throw new Error('Overflow is not owned by an actual Slider handle');
                                expect(slider.getAttribute('aria-valuenow')).toBe(slider.getAttribute('aria-valuemax'));
                                const bounds = element.getBoundingClientRect();
                                const handleBounds = handle.getBoundingClientRect();
                                const outset = direction === 'rtl' ? panelBounds.left - bounds.left : bounds.right - panelBounds.right;
                                expect(outset).toBeCloseTo(handleBounds.width / 2, 1);
                                expect(direction === 'rtl' ? bounds.right <= panelBounds.right : bounds.left >= panelBounds.left).toBe(true);
                                endpointOutset = Math.max(endpointOutset, outset);
                                // The outer quarter must remain visible and hit-testable;
                                // neither hiding overflow nor shortening the rail is a fix.
                                const x = direction === 'rtl' ? handleBounds.left + handleBounds.width / 4 : handleBounds.right - handleBounds.width / 4;
                                const hit = document.elementFromPoint(x, handleBounds.top + handleBounds.height / 2);
                                expect(hit !== null && handle.contains(hit)).toBe(true);
                                for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
                                    expect(getComputedStyle(ancestor).overflowX).toBe('visible');
                                }
                            }
                            // Every extra scrollable pixel must be accounted for by
                            // those measured half handles, never other panel content.
                            expect(panel.scrollWidth - panel.clientWidth).toBe(Math.round(endpointOutset));
                            expect(getComputedStyle(panel).overflowX).toBe('visible');
                            expect(panel.offsetHeight).toBe(panel.clientHeight);
                            expect(document.documentElement.scrollWidth).toBe(document.documentElement.clientWidth);
                        } catch (error) {
                            const geometry = (element: HTMLElement) => {
                                const rect = element.getBoundingClientRect();
                                const style = getComputedStyle(element);
                                return {
                                    tag: element.tagName, slot: element.getAttribute('data-slot'), className: element.className,
                                    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, left: rect.left, right: rect.right },
                                    width: style.width, minWidth: style.minWidth, maxWidth: style.maxWidth,
                                    boxSizing: style.boxSizing, direction: style.direction,
                                    marginInlineStart: style.marginInlineStart, marginInlineEnd: style.marginInlineEnd,
                                    paddingInlineStart: style.paddingInlineStart, paddingInlineEnd: style.paddingInlineEnd,
                                    borderInlineStartWidth: style.borderInlineStartWidth, borderInlineEndWidth: style.borderInlineEndWidth,
                                    position: style.position, transform: style.transform,
                                    clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
                                };
                            };
                            throw new Error(`ColorPicker unexpected horizontal overflow: ${JSON.stringify({
                                designSystem, direction, density, color,
                                panel: geometry(panel), overflowingDescendants: overflow.map(geometry),
                            })}`, { cause: error });
                        }
                        const first = swatches[0].getBoundingClientRect();
                        const second = swatches[1].getBoundingClientRect();
                        expect(direction === 'rtl' ? first.left > second.left : first.left < second.left).toBe(true);
                    }
                }

                // All eight presets remain independently actionable after layout and density changes.
                changed.clear();
                const swatches = Array.from(panel.querySelectorAll<HTMLButtonElement>('button[aria-label^="#"]'));
                for (const swatch of swatches) await fireEvent.click(swatch);
                expect(changed).toHaveBeenCalledTimes(presets.length);
                presets.forEach((color, index) => expect(changed.calls.calls[index][0]).toEqual(color));
            });
        }
    }
});

describe('ColorPicker localized channel label geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const direction of ['ltr', 'rtl'] as const) {
            it('keeps complete labels, aligned rails and drafts at narrow width (' + designSystem + '/' + direction + ')', async () => {
                const changed = mock.fn();
                const fixture = (locale: 'en-US' | 'zh-CN', width: number) => <>
                    <style>{compiledCss}</style>
                    <ConfigProvider designSystem={designSystem} direction={direction} locale={locale} size="large" density="compact">
                        {/* Match the library workbench's inherited body typography. */}
                        <div style={{ width, fontSize: semanticToken.font.size.body, fontFamily: semanticToken.typography.body['font-family'] }}>
                            <ColorPickerPanel defaultValue={colors[1]} onValueChange={changed} showEyeDropper={false} data-testid="color-panel" />
                        </div>
                    </ConfigProvider>
                </>;
                const view = await render(fixture('en-US', 360));
                await settleLayout();
                const panel = getPanel(view.container);
                const input = panel.querySelector<HTMLInputElement>('input[aria-label="Color value"]');
                const sliders = Array.from(panel.querySelectorAll<HTMLElement>('[role="slider"]'));
                if (!input || sliders.length !== 4) throw new Error('Missing actual ColorPicker controls');
                const channelValues = sliders.map(slider => slider.getAttribute('aria-valuenow'));
                const user = userEvent.setup();
                await act(async () => {
                    await user.clear(input);
                    await user.type(input, '#unfinished-review-draft');
                });

                for (const locale of ['en-US', 'zh-CN'] as const) {
                    for (const width of [360, 250]) {
                        await view.rerender(fixture(locale, width));
                        await settleLayout();
                        expect(getPanel(view.container)).toBe(panel);
                        expect(panel.querySelector('input')).toBe(input);
                        expect(input.value).toBe('#unfinished-review-draft');
                        const currentSliders = Array.from(panel.querySelectorAll<HTMLElement>('[role="slider"]'));
                        expect(currentSliders).toHaveLength(4);
                        const expectedLabels = locale === 'en-US'
                            ? ['Lightness', 'Chroma', 'Hue', 'Alpha']
                            : ['亮度', '色度', '色相', '透明度'];
                        const panelBounds = panel.getBoundingClientRect();
                        let firstLabelBounds: DOMRect | undefined;
                        const firstSliderBounds = sliders[0].getBoundingClientRect();
                        for (const [index, slider] of currentSliders.entries()) {
                            expect(slider).toBe(sliders[index]);
                            expect(slider.getAttribute('aria-valuenow')).toBe(channelValues[index]);
                            const label = slider.parentElement?.querySelector('label');
                            if (!label) throw new Error('Missing actual channel label');
                            expect(label.textContent).toBe(expectedLabels[index]);
                            const labelBounds = label.getBoundingClientRect();
                            const text = document.createRange();
                            text.selectNodeContents(label);
                            const glyphs = Array.from(text.getClientRects());
                            // Text fragments test visible outcomes, not a token or CSS spelling.
                            expect(glyphs).toHaveLength(1);
                            expect(glyphs[0].left).toBeGreaterThanOrEqual(labelBounds.left - 0.5);
                            expect(glyphs[0].right).toBeLessThanOrEqual(labelBounds.right + 0.5);
                            firstLabelBounds ??= labelBounds;
                            expect(labelBounds.left).toBeCloseTo(firstLabelBounds.left, 1);
                            expect(labelBounds.right).toBeCloseTo(firstLabelBounds.right, 1);
                            const bounds = slider.getBoundingClientRect();
                            expect(bounds.left).toBeCloseTo(firstSliderBounds.left, 1);
                            expect(bounds.right).toBeCloseTo(firstSliderBounds.right, 1);
                            expect(bounds.width).toBeGreaterThan(0);
                            expect(labelBounds.left).toBeGreaterThanOrEqual(panelBounds.left - 0.5);
                            expect(labelBounds.right).toBeLessThanOrEqual(panelBounds.right + 0.5);
                            expect(direction === 'rtl' ? bounds.right <= labelBounds.left : labelBounds.right <= bounds.left).toBe(true);
                            for (const fraction of [0.2, 0.8]) {
                                const hit = document.elementFromPoint(bounds.left + bounds.width * fraction, bounds.top + bounds.height / 2);
                                expect(hit !== null && slider.contains(hit)).toBe(true);
                            }
                        }
                    }
                }

                // The final 250px fixture must still accept keyboard value changes.
                changed.clear();
                await fireEvent.keyDown(sliders[0], { key: 'ArrowUp' });
                expect(changed).toHaveBeenCalledTimes(1);
                expect(Number(sliders[0].getAttribute('aria-valuenow'))).toBeCloseTo(colors[1].lightness + 0.01, 6);
            });
        }
    }
});
