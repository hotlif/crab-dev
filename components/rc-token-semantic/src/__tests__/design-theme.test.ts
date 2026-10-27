import { describe, expect, it } from '@crab-dev/wake/test';
import { designColorContract } from '../design-theme.js';
import { appleColorContract } from '../apple-theme.js';
import { shadcnColorContract } from '../shadcn-theme.js';
import { md3ColorContract } from '../theme.js';

function colors(expression: string): readonly { lightness: number; chroma: number; hue: number }[] {
    return [...expression.matchAll(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/g)].map(match => ({
        lightness: Number(match[1]),
        chroma: Number(match[2]),
        hue: Number(match[3]),
    }));
}

function strings(value: unknown): string[] {
    if (typeof value === 'string') return [value];
    if (typeof value !== 'object' || value === null) return [];
    return Object.values(value).flatMap(strings);
}

function contrast(first: string, second: string): number {
    // Evaluate the default OKLCh fallback in linear sRGB. L cubed alone
    // is only valid for neutral colors and cannot test MD3/Apple chroma.
    // Consumer CSS-variable overrides require separate rendered evidence.
    const luminance = (expression: string) => {
        const color = colors(expression).at(-1);
        if (!color) throw new Error(`Expected an opaque OKLCh fallback: ${expression}`);
        const { lightness: L, chroma: C, hue: H } = color;
        const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
        const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
        const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
        const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
        const channels = [
            4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
        ];
        // Permit matrix rounding at black/white, not unreviewed gamut mapping.
        if (channels.some(channel => channel < -0.000001 || channel > 1.000001)) {
            throw new Error(`Out-of-sRGB contract color needs explicit handling: ${expression}`);
        }
        const [red, green, blue] = channels.map(channel => Math.max(0, Math.min(1, channel)));
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const a = luminance(first), b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('design color contracts', () => {
    it('keeps every design as an independent Light / Dark contract', () => {
        expect(designColorContract.md3).toBe(md3ColorContract);
        expect(designColorContract.shadcn).toBe(shadcnColorContract);
        expect(designColorContract.apple).toBe(appleColorContract);
        expect(designColorContract.md3.light.brand.primary).toContain('--token-global-purple-40');
        expect(designColorContract.md3.dark.brand.primary).toContain('--token-global-purple-80');
        expect(designColorContract.md3.light.surface.container).toContain('--token-global-material-neutral-94');
        expect(designColorContract.shadcn.light.brand.primary).toContain('--token-global-neutral-900');
        expect(designColorContract.shadcn.dark.brand.primary).toContain('--token-global-neutral-50');
        expect(designColorContract.apple.light.brand.primary).toContain('--token-global-blue-700');
        expect(designColorContract.apple.dark.brand.primary).toContain('--token-global-blue-400');
    });

    it('reserves Apple blue for accents while keeping content and window surfaces neutral', () => {
        for (const theme of [appleColorContract.light, appleColorContract.dark]) {
            for (const expression of strings([theme.surface, theme.workspace, theme.text.primary, theme.text.secondary])) {
                const values = colors(expression);
                expect(values.length).toBeGreaterThan(0);
                for (const value of values) expect(value.chroma).toBeLessThanOrEqual(0.014);
            }
            for (const expression of strings([theme.brand, theme.selection, theme.fill.active, theme.text.link])) {
                expect(expression).toContain('--token-global-blue-');
            }
            expect(theme.focusRing).toContain('var(--token-semantic-color-border-focus,');
            expect(theme.brandContainer.background).toContain('var(--token-semantic-color-selection-background,');
            expect(theme.brandContainer.foreground).toContain('var(--token-semantic-color-selection-foreground,');
        }
    });

    it('uses zero-chroma structural colors in both shadcn modes', () => {
        for (const theme of [shadcnColorContract.light, shadcnColorContract.dark]) {
            const expressions = strings([
                theme.surface, theme.workspace, theme.brandContainer, theme.secondary, theme.tertiary,
                theme.brand, theme.control, theme.background, theme.text, theme.selection, theme.fill,
                theme.focusRing, theme.focusShadow,
                Object.entries(theme.border).filter(([role]) => role !== 'error').map(([, value]) => value),
            ]);
            for (const expression of expressions) {
                const values = colors(expression);
                expect(values.length).toBeGreaterThan(0);
                for (const value of values) expect(value.chroma).toBe(0);
            }
        }
    });

    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`keeps default primary/secondary text readable on ${designSystem}/${colorMode} surfaces`, () => {
                const theme = designColorContract[designSystem][colorMode];
                // Surface/workspace roles are ordinary content backgrounds.
                // Inverse, brand, selection and disabled roles have different
                // paired foregrounds and are not silently included here.
                for (const surface of [...Object.values(theme.surface), ...Object.values(theme.workspace)]) {
                    expect(contrast(theme.text.primary, surface)).toBeGreaterThanOrEqual(4.5);
                    expect(contrast(theme.text.secondary, surface)).toBeGreaterThanOrEqual(4.5);
                }
            });
        }
    }

    it('keeps text, filled actions, selections and focus indicators readable', () => {
        for (const theme of [shadcnColorContract.light, shadcnColorContract.dark]) {
            for (const surface of [...Object.values(theme.surface), ...Object.values(theme.workspace)]) {
                expect(contrast(theme.text.primary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(theme.text.secondary, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(theme.focusRing, surface)).toBeGreaterThanOrEqual(3);
            }
            for (const background of [theme.brand.primary, theme.brand.hover, theme.brand.active]) {
                expect(contrast(theme.text.onBrand, background)).toBeGreaterThanOrEqual(4.5);
            }
            expect(contrast(theme.text.inverse, theme.background.inverse)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(theme.selection.foreground, theme.selection.background)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(theme.selection.border, theme.selection.background)).toBeGreaterThanOrEqual(3);
            for (const accent of [theme.secondary, theme.tertiary]) {
                expect(contrast(accent.onPrimary, accent.primary)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(accent.onContainer, accent.container)).toBeGreaterThanOrEqual(4.5);
            }
        }
    });

    it('preserves semantic feedback colors across visual designs', () => {
        for (const mode of ['light', 'dark'] as const) {
            for (const design of [shadcnColorContract, appleColorContract]) {
                expect(design[mode].feedback).toEqual(md3ColorContract[mode].feedback);
                expect(design[mode].border.error).toBe(md3ColorContract[mode].border.error);
                expect(design[mode].highlight).toEqual(md3ColorContract[mode].highlight);
            }
        }
    });
});
