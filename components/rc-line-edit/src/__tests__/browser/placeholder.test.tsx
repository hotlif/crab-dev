import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
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
                    if (designSystem === 'md3') {
                        // A floating idle label must not overlap a visible placeholder.
                        expect(disabled).toBe('rgba(0, 0, 0, 0)');
                    } else {
                        expect(disabled).not.toBe(enabled);
                        expect(disabled).not.toBe('rgba(0, 0, 0, 0)');
                    }
                    expect(inputs.length).toBe(3);
                    expect(inputs[0].readOnly).toBe(false);
                    expect(inputs[1].readOnly).toBe(true);
                    for (const input of [inputs[0], inputs[1]]) {
                        // Readonly is still readable content, not a disabled exemption.
                        expect(input.disabled).toBe(false);
                        expect(input.matches(':focus')).toBe(false);
                        if (designSystem === 'md3') {
                            // The idle floating label is the visible text. A deliberately
                            // transparent placeholder has no visible contrast pair here.
                            expect(nativeColor(getComputedStyle(input, '::placeholder').color)[3]).toBe(0);
                        } else {
                            expect(visiblePlaceholderContrast(input)).toBeGreaterThanOrEqual(4.5);
                        }
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
