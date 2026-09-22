import { describe, expect, it } from '@crab-dev/wake/test';
import { createBrandTheme, normalizeBrandColor } from '../brand-theme.js';

function channels(value: string): readonly [number, number, number] {
    const match = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/.exec(value);
    if (!match) throw new Error(`Expected an opaque OKLCh color: ${value}`);
    const L = Number(match[1]), C = Number(match[2]), H = Number(match[3]) * Math.PI / 180;
    const a = C * Math.cos(H), b = C * Math.sin(H);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
}

function contrast(a: string, b: string): number {
    const luminance = (color: string) => {
        const [r, g, b] = channels(color);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const first = luminance(a), second = luminance(b);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe('brand theme', () => {
    it('normalizes opaque hex and rejects arbitrary CSS and alpha', () => {
        expect(normalizeBrandColor(' #AbC ')).toBe('#aabbcc');
        expect(normalizeBrandColor('#1234AB')).toBe('#1234ab');
        for (const invalid of ['red', '#abcd', '#11223344', '#12', '#ggg', 'var(--brand)', '#123;}body{color:red']) {
            expect(() => createBrandTheme(invalid)).toThrow(RangeError);
        }
    });

    it('is deterministic and limits overrides to brand roles', () => {
        const theme = createBrandTheme('#1677ff');
        expect(createBrandTheme(' #1677FF ')).toEqual(theme);
        expect(createBrandTheme('#e76f00')).not.toEqual(theme);
        const keys = Object.keys(theme.light);
        expect(Object.keys(theme.dark)).toEqual(keys);
        expect(keys).toHaveLength(23);
        expect(keys.every(key => key.startsWith('--token-semantic-'))).toBe(true);
        expect(keys.some(key => /feedback|control|surface|sunken|elevated/.test(key))).toBe(false);
    });

    it('keeps extreme and saturated seeds readable and in sRGB across all states', () => {
        // Include every RGB cube corner, neutrals, and intermediate hues/brightnesses.
        const values = [0, 64, 128, 192, 255];
        for (const r of values) for (const g of values) for (const b of values) {
            const seed = `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
            const theme = createBrandTheme(seed);
            for (const mode of ['light', 'dark'] as const) {
                const vars = theme[mode];
                const get = (role: string) => vars[`--token-semantic-${role}`];
                const surface = mode === 'light' ? 'oklch(1 0 0)' : 'oklch(0.14 0.004 286)';
                for (const state of ['primary', 'primary-hover', 'primary-active']) {
                    expect(contrast(get('color-text-on-brand'), get(`color-brand-${state}`))).toBeGreaterThanOrEqual(4.5);
                }
                expect(contrast(get('color-text-link'), surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(get('color-focus-ring'), surface)).toBeGreaterThanOrEqual(3);
                expect(contrast(get('color-selection-foreground'), get('color-selection-background'))).toBeGreaterThanOrEqual(4.5);
                for (const role of ['secondary', 'tertiary']) {
                    expect(contrast(get(`color-${role}-on-primary`), get(`color-${role}-primary`))).toBeGreaterThanOrEqual(4.5);
                    expect(contrast(get(`color-${role}-on-container`), get(`color-${role}-container`))).toBeGreaterThanOrEqual(4.5);
                }
                for (const value of Object.values(vars).filter(value => value.startsWith('oklch('))) {
                    for (const channel of channels(value)) {
                        // Six-digit CSS rounding is allowed to move a boundary by 0.00001.
                        expect(channel).toBeGreaterThanOrEqual(-0.00001);
                        expect(channel).toBeLessThanOrEqual(1.00001);
                    }
                }
            }
        }
    });

    it('keeps a continuous hue and ordered brightness through hover and press', () => {
        for (const mode of ['light', 'dark'] as const) {
            const vars = createBrandTheme('#1677ff')[mode];
            const colors = ['primary', 'primary-hover', 'primary-active'].map(state =>
                vars[`--token-semantic-color-brand-${state}`].slice(6, -1).split(' ').map(Number),
            );
            expect(new Set(colors.map(color => color[2])).size).toBe(1);
            const lightness = colors.map(color => color[0]);
            expect(lightness).toEqual([...lightness].sort((a, b) => mode === 'dark' ? a - b : b - a));
            expect(colors.every(color => color[1] > 0)).toBe(true);
        }
    });
});
