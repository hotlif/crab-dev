import { describe, expect, it } from '@crab-dev/wake/test';
import { designColorContract } from '../design-theme.js';
import { macosColorContract } from '../macos-theme.js';
import { shadcnColorContract } from '../shadcn-theme.js';
import { themeColorContract } from '../theme.js';

function colors(expression: string): readonly { lightness: number; chroma: number }[] {
    return [...expression.matchAll(/oklch\(([\d.]+) ([\d.]+) [\d.]+\)/g)].map(match => ({
        lightness: Number(match[1]),
        chroma: Number(match[2]),
    }));
}

function strings(value: unknown): string[] {
    if (typeof value === 'string') return [value];
    if (typeof value !== 'object' || value === null) return [];
    return Object.values(value).flatMap(strings);
}

function contrast(first: string, second: string): number {
    // Structural shadcn colors have zero chroma, so linear luminance is L cubed.
    const luminance = (expression: string) => {
        const color = colors(expression).at(-1);
        if (!color || color.chroma !== 0) throw new Error(`Expected a neutral OKLCh color: ${expression}`);
        return color.lightness ** 3;
    };
    const a = luminance(first), b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('design color contracts', () => {
    it('keeps every design as an independent Light / Dark contract', () => {
        expect(designColorContract.material).toBe(themeColorContract);
        expect(designColorContract.shadcn).toBe(shadcnColorContract);
        expect(designColorContract.macos).toBe(macosColorContract);
        expect(designColorContract.material.light.brand.primary).toContain('--token-global-purple-40');
        expect(designColorContract.material.dark.brand.primary).toContain('--token-global-purple-80');
        expect(designColorContract.material.light.surface.container).toContain('--token-global-material-neutral-94');
        expect(designColorContract.shadcn.light.brand.primary).toContain('--token-global-neutral-900');
        expect(designColorContract.shadcn.dark.brand.primary).toContain('--token-global-neutral-50');
        expect(designColorContract.macos.light.brand.primary).toContain('--token-global-blue-700');
        expect(designColorContract.macos.dark.brand.primary).toContain('--token-global-blue-400');
    });

    it('reserves macOS blue for accents while keeping content and window surfaces neutral', () => {
        for (const theme of [macosColorContract.light, macosColorContract.dark]) {
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
            for (const design of [shadcnColorContract, macosColorContract]) {
                expect(design[mode].feedback).toEqual(themeColorContract[mode].feedback);
                expect(design[mode].border.error).toBe(themeColorContract[mode].border.error);
                expect(design[mode].highlight).toEqual(themeColorContract[mode].highlight);
            }
        }
    });
});
