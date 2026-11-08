import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, waitFor } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import LineEdit from '../../../esm/index.mjs';
import token from '../../token.js';
import compiledCss from '../../../.cache/browser-css.json';

type Rgb = readonly [red: number, green: number, blue: number];
type Rgba = readonly [red: number, green: number, blue: number, alpha: number];

function nativeColor(value: string): Rgba {
    if (!globalThis.CSS.supports('color', value)) throw new Error(`Unsupported computed color: ${value}`);
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Native sRGB color parser unavailable');
    context.fillStyle = value;
    context.fillRect(0, 0, 1, 1);
    const pixel = context.getImageData(0, 0, 1, 1).data;
    return [pixel[0] / 255, pixel[1] / 255, pixel[2] / 255, pixel[3] / 255];
}

function over(foreground: Rgba, background: Rgb): Rgb {
    return [
        foreground[0] * foreground[3] + background[0] * (1 - foreground[3]),
        foreground[1] * foreground[3] + background[1] * (1 - foreground[3]),
        foreground[2] * foreground[3] + background[2] * (1 - foreground[3]),
    ];
}

function effectiveBackground(input: HTMLInputElement): Rgb {
    const layers: Rgba[] = [];
    let opaqueFound = false;
    for (let node: HTMLElement | null = input; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        // These fixtures use ordinary CSS surfaces. Fail closed if composition
        // becomes more complex; never assume white or ignore group opacity.
        if (style.opacity !== '1' || style.filter !== 'none' || style.mixBlendMode !== 'normal') {
            throw new Error('Placeholder ancestry needs explicit opacity/filter/blend compositing');
        }
        if (opaqueFound) continue;
        if (style.backgroundImage !== 'none') throw new Error('Placeholder background image is not a flat color');
        const color = nativeColor(style.backgroundColor);
        layers.push(color);
        opaqueFound = color[3] === 1;
    }
    if (!opaqueFound) throw new Error('No observed opaque placeholder background');
    const opaque = layers[layers.length - 1];
    let background: Rgb = [opaque[0], opaque[1], opaque[2]];
    for (let index = layers.length - 2; index >= 0; index -= 1) background = over(layers[index], background);
    return background;
}

function visiblePlaceholderContrast(input: HTMLInputElement): number {
    expect(input.disabled).toBe(false);
    expect(input.value).toBe('');
    expect(input.matches(':placeholder-shown')).toBe(true);
    const pseudo = getComputedStyle(input, '::placeholder');
    expect(pseudo.visibility).toBe('visible');
    const color = nativeColor(pseudo.color), opacity = Number(pseudo.opacity);
    expect(Number.isFinite(opacity)).toBe(true);
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThanOrEqual(1);
    expect(color[3]).toBeGreaterThan(0);
    const background = effectiveBackground(input);
    const foreground = over([color[0], color[1], color[2], color[3] * opacity], background);
    const luminance = (rgb: Rgb) => {
        const linear = rgb.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const first = luminance(foreground), second = luminance(background);
    const contrast = (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
    if (contrast < 4.5) throw new Error(JSON.stringify({ placeholderColor: pseudo.color, placeholderOpacity: opacity, background, contrast }));
    return contrast;
}

describe('Published placeholder roles and actual contrast', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const appearance of ['outlined', 'filled'] as const) {
                it(`preserves ${designSystem}/${colorMode}/${appearance} enabled/readonly contrast and disabled roles`, async () => {
                    const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <style>{compiledCss}</style>
                        <LineEdit label="Enabled" placeholder="Choose a date" appearance={appearance} />
                        <LineEdit label="Read only" placeholder="Choose a date" appearance={appearance} readOnly />
                        <LineEdit label="Disabled" placeholder="Choose a date" appearance={appearance} disabled />
                        <span data-witness="enabled" style={{ color: token.field.placeholder.color }} />
                        <span data-witness="disabled" style={{ color: token.field.placeholder['color-disabled'] }} />
                    </ConfigProvider>);
                    const inputs = view.container.querySelectorAll<HTMLInputElement>('input');
                    const enabled = getComputedStyle(inputs[0], '::placeholder').color;
                    const disabled = getComputedStyle(inputs[2], '::placeholder').color;
                    expect(enabled).toBe(getComputedStyle(view.container.querySelector<HTMLElement>('[data-witness="enabled"]')!).color);
                    expect(disabled).toBe(getComputedStyle(view.container.querySelector<HTMLElement>('[data-witness="disabled"]')!).color);
                    expect(inputs[2].disabled).toBe(true);
                    expect(disabled).not.toBe(enabled);
                    expect(disabled).not.toBe('rgba(0, 0, 0, 0)');
                    expect(inputs.length).toBe(3);
                    expect(inputs[0].readOnly).toBe(false);
                    expect(inputs[1].readOnly).toBe(true);
                    for (const input of [inputs[0], inputs[1]]) {
                        // Readonly is still readable content, not a disabled exemption.
                        expect(input.disabled).toBe(false);
                        expect(input.matches(':focus')).toBe(false);
                        expect(visiblePlaceholderContrast(input)).toBeGreaterThanOrEqual(4.5);
                        // Real focus changes the public field state; no pseudo override,
                        // color witness, host input.color or fabricated event substitutes.
                        await act(() => input.focus());
                        expect(document.activeElement).toBe(input);
                        expect(visiblePlaceholderContrast(input)).toBeGreaterThanOrEqual(4.5);
                        await act(() => input.blur());
                    }
                });
            }
        }
    }
});

describe('Published decorated field label geometry', () => {
    it('uses the nearest design boundary while preserving focus, selection, refs and draft', async () => {
        let current: HTMLInputElement | null = null;
        let cleanups = 0;
        const ref = (node: HTMLInputElement | null) => {
            current = node;
            return () => { current = null; cleanups += 1; };
        };
        const field = <><style>{compiledCss}</style><div style={{ width: 180 }}><LineEdit label="Retained decorated draft" prefix="$" suffix="%" appearance="filled" defaultValue="preserved draft" ref={ref} /></div></>;
        const view = await render(<ConfigProvider designSystem="md3"><ConfigProvider designSystem="apple">{field}</ConfigProvider></ConfigProvider>);
        const input = current!;
        await act(() => { input.focus(); input.setSelectionRange(2, 7); });
        for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
            for (const colorMode of ['light', 'dark'] as const) {
                await view.rerender(<ConfigProvider designSystem={designSystem === 'md3' ? 'apple' : 'md3'}><ConfigProvider designSystem={designSystem} colorMode={colorMode} direction="rtl">{field}</ConfigProvider></ConfigProvider>);
                expect(current === input).toBe(true);
                expect(document.activeElement === input).toBe(true);
                expect(input.value).toBe('preserved draft');
                expect([input.selectionStart, input.selectionEnd]).toEqual([2, 7]);
                // Wait for published theme transitions after
                // the theme's layout. Keep every bound assertion and wait for
                // that real delivery rather than reading the previous layout.
                await waitFor(() => {
                    const label = input.closest('[data-field-root]')!.querySelector('label')!.getBoundingClientRect();
                    expect(label.bottom).toBeLessThanOrEqual(input.parentElement!.getBoundingClientRect().top - 3);
                });
            }
        }
        await view.unmount();
        expect(current).toBe(null);
        expect(cleanups).toBeGreaterThan(0);
    });
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            for (const direction of ['ltr', 'rtl'] as const) {
                for (const appearance of ['outlined', 'filled'] as const) {
                    it(`keeps ${designSystem}/${colorMode}/${direction}/${appearance} labels clear of decorations`, async () => {
                        const label = '完整的预警阈值 · decorated field';
                        const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode} direction={direction}>
                            <style>{compiledCss}</style>
                            <div style={{ width: 180 }}>
                                <LineEdit label={label} appearance={appearance} prefix="$" suffix="%" required />
                                <LineEdit label={label} appearance={appearance} prefix="$" suffix="US dollars" required dir={direction === 'ltr' ? 'rtl' : 'ltr'} />
                            </div>
                        </ConfigProvider>);
                        for (const input of view.container.querySelectorAll<HTMLInputElement>('input')) {
                            const field = input.closest<HTMLElement>('[data-field-root]')!;
                            const visibleLabel = field.querySelector<HTMLLabelElement>('label')!;
                            const assertGeometry = () => {
                                const bounds = visibleLabel.getBoundingClientRect();
                                expect(bounds.bottom).toBeLessThanOrEqual(input.parentElement!.getBoundingClientRect().top - 3);
                                expect(getComputedStyle(visibleLabel.querySelector('[data-field-label-text]')!).textOverflow).toBe('ellipsis');
                                expect(visibleLabel.htmlFor).toBe(input.id);
                                expect(visibleLabel.textContent).toBe(`${label}*`);
                            };
                            assertGeometry();
                            await act(() => input.focus());
                            assertGeometry();
                            expect(document.activeElement === input).toBe(true);
                            await act(() => input.blur());
                            assertGeometry();
                        }
                    });
                }
            }
        }
    }
});

// Published geometry also covers plain fields and explicit action variants.
describe('Desktop field and inherited action geometry', () => {
    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it('preserves desktop sizes, drafts and explicit variants: ' + designSystem + '/' + colorMode, async () => {
                const fixture = (size: 'small' | 'medium' | 'large', density: 'compact' | 'standard' | 'comfortable') =>
                    <ConfigProvider designSystem={designSystem === 'md3' ? 'apple' : 'md3'}>
                        <ConfigProvider designSystem={designSystem} colorMode={colorMode} size={size} density={density}>
                            <style>{compiledCss}</style>
                            <LineEdit label="Desktop field" defaultValue="Preserved text" allowClear />
                            <LineEdit aria-label="Plain field" />
                            <Button data-default-action="">Default action</Button>
                            <Button data-icon-action="" aria-label="Icon action" icon={<span aria-hidden="true">+</span>} />
                            <Button size="s" data-explicit-action="">Explicit action</Button>
                        </ConfigProvider>
                    </ConfigProvider>;
                const view = await render(fixture('small', 'standard'));
                const input = view.container.querySelector<HTMLInputElement>('input')!;
                await act(() => { input.focus(); input.setSelectionRange(1, 4); });
                for (const density of ['compact', 'standard', 'comfortable'] as const) {
                    for (const [index, size] of (['small', 'medium', 'large'] as const).entries()) {
                        await view.rerender(fixture(size, density));
                        await waitFor(() => {
                            const inputs = view.container.querySelectorAll('input');
                            expect(inputs[0]).toBe(input);
                            expect(input.value).toBe('Preserved text');
                            expect(document.activeElement).toBe(input);
                            expect([input.selectionStart, input.selectionEnd]).toEqual([1, 4]);
                            for (const field of inputs) expect(field.parentElement!.getBoundingClientRect().height).toBeCloseTo((designSystem === 'md3' ? [32, 40, 48] : [32, 36, 40])[index], 1);
                            const label = view.container.querySelector('label')!.getBoundingClientRect();
                            expect(label.bottom).toBeLessThanOrEqual(input.parentElement!.getBoundingClientRect().top - 3);
                            const expected = { md3: [32, 36, 40], apple: [24, 28, 32], shadcn: [32, 36, 40] }[designSystem][index];
                            expect(view.container.querySelector('[data-default-action]')!.getBoundingClientRect().height).toBeCloseTo(expected, 1);
                            const icon = view.container.querySelector('[data-icon-action]')!.getBoundingClientRect();
                            expect(icon.width).toBeCloseTo(expected, 1);
                            expect(icon.height).toBeCloseTo(expected, 1);
                            expect(view.container.querySelector('[data-explicit-action]')!.getBoundingClientRect().height).toBeCloseTo({ md3: 40, apple: 28, shadcn: 36 }[designSystem], 1);
                        });
                    }
                }
            });
        }
    }
});
