import { describe, expect, it } from '@crab-dev/wake/test';
import { createBrandTheme, themeColorContract, TokenVars } from '@crab-dev/rc-token-semantic';
import token from '../token.js';
import { vars } from '../token.js';
import { contrast, resolveColor, type Variables } from './colorContrast.js';

function themeVariables(mode: 'light' | 'dark', seed?: string): Variables {
    const theme = themeColorContract[mode];
    return {
        [TokenVars['color.brand.primary']]: theme.brand.primary,
        [TokenVars['color.text.primary']]: theme.text.primary,
        [TokenVars['color.text.secondary']]: theme.text.secondary,
        [TokenVars['color.text.inverse']]: theme.text.inverse,
        [TokenVars['color.text.on-brand']]: theme.text.onBrand,
        [TokenVars['color.background.surface']]: theme.background.surface,
        [TokenVars['color.background.inverse']]: theme.background.inverse,
        [TokenVars['color.focus.ring']]: theme.focusRing,
        [TokenVars['color.border.subtle']]: theme.border.subtle,
        [TokenVars['color.surface.low']]: theme.surface.low,
        [TokenVars['color.secondary.container']]: theme.secondary.container,
        [TokenVars['color.secondary.on-container']]: theme.secondary.onContainer,
        [TokenVars['color.secondary.primary']]: theme.secondary.primary,
        [TokenVars['color.secondary.on-primary']]: theme.secondary.onPrimary,
        [TokenVars['color.feedback.error.border']]: theme.feedback.error.border,
        [TokenVars['color.feedback.error.solid']]: theme.feedback.error.solid,
        [TokenVars['color.feedback.error.on-solid']]: theme.feedback.error.onSolid,
        [TokenVars['color.feedback.error.background']]: theme.feedback.error.background,
        [TokenVars['color.feedback.error.text']]: theme.feedback.error.text,
        ...(seed ? createBrandTheme(seed)[mode] : {}),
    };
}

const backgrounds = ['background-color', 'background-color-hover', 'background-color-focus', 'background-color-active'] as const;

function checkReadableStates(mode: 'light' | 'dark', seed?: string) {
    const variables = themeVariables(mode, seed);
    const theme = themeColorContract[mode];
    for (const surface of [theme.surface.canvas, theme.surface.low]) {
        for (const background of backgrounds) {
            expect(contrast(token.outlined.color, token.outlined[background], variables, surface)).toBeGreaterThanOrEqual(4.5);
        }
        expect(contrast(token.root['outline-color-focus'], surface, variables)).toBeGreaterThanOrEqual(3);
        for (const opacity of [0, 8, 10]) {
            const mixed = `color-mix(in srgb, ${token.text.color} ${opacity}%, ${surface})`;
            expect(contrast(token.text.color, mixed, variables)).toBeGreaterThanOrEqual(4.5);
        }
    }
    for (const opacity of [0, 8, 10]) {
        const mixed = `color-mix(in srgb, ${token.tonal.color} ${opacity}%, ${token.tonal['background-color']})`;
        expect(contrast(token.tonal.color, mixed, variables)).toBeGreaterThanOrEqual(4.5);
    }
    for (const appearance of ['primary', 'elevated'] as const) {
        for (const background of backgrounds) {
            expect(contrast(token[appearance].color, token[appearance][background], variables)).toBeGreaterThanOrEqual(4.5);
        }
    }
    expect(contrast(token.outlined['color-selected'], token.outlined['background-color-selected'], variables)).toBeGreaterThanOrEqual(4.5);
    for (const appearance of ['outlined', 'tonal'] as const) {
        const foreground = token[appearance]['color-selected'];
        for (const opacity of [0, 8, 10]) {
            const background = `color-mix(in srgb, ${foreground} ${opacity}%, ${token[appearance]['background-color-selected']})`;
            expect(contrast(foreground, background, variables)).toBeGreaterThanOrEqual(4.5);
        }
    }
    // Outlined uses Outline variant; readable labels and the focus ring identify the action.
    expect(resolveColor(token.outlined['border-color'], variables)).toEqual(resolveColor(theme.border.subtle, variables));
    const neutralVariables = themeVariables(mode);
    expect(resolveColor(token.outlined.color, variables)).toEqual(resolveColor(token.outlined.color, neutralVariables));
    expect(resolveColor(token.elevated['background-color'], variables)).toEqual(resolveColor(theme.surface.low, variables));
}

describe('Material button themes', () => {
    it('keeps error filled and tonal color pairs readable in both themes', () => {
        for (const mode of ['light', 'dark'] as const) {
            const variables = themeVariables(mode);
            for (const background of backgrounds) {
                expect(contrast(token.danger.color, token.danger[background], variables)).toBeGreaterThanOrEqual(4.5);
            }
            for (const opacity of [0, 8, 10]) {
                const background = `color-mix(in srgb, ${token.danger.tonal.color} ${opacity}%, ${token.danger.tonal['background-color']})`;
                expect(contrast(token.danger.tonal.color, background, variables)).toBeGreaterThanOrEqual(4.5);
            }
        }
    });
    it('keeps danger text readable on light and dark surfaces', () => {
        for (const mode of ['light', 'dark'] as const) {
            const variables = themeVariables(mode);
            const surface = themeColorContract[mode].surface.canvas;
            for (const state of ['background-color', 'background-color-hover', 'background-color-active'] as const) {
                expect(contrast(token.danger.content.color, token.danger.subtle[state], variables, surface)).toBeGreaterThanOrEqual(4.5);
            }
        }
    });

    it('keeps all five appearances and focus readable in both default themes', () => {
        checkReadableStates('light');
        checkReadableStates('dark');
    });

    it('preserves neutral surfaces and readable states across extreme and saturated seeds', () => {
        const values = [0, 64, 128, 192, 255];
        const seeds = ['#6750a4', '#1677ff', '#087f5b'];
        for (const r of values) for (const g of values) for (const b of values) {
            seeds.push(`#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`);
        }
        for (const seed of seeds) for (const mode of ['light', 'dark'] as const) {
            checkReadableStates(mode, seed);
        }
    });

    it('gives outlined overrides precedence over shared subtle tokens', () => {
        const variables = { [vars['subtle.background-color']]: 'oklch(0.8 0.1 280)' };
        expect(resolveColor(token.outlined['background-color'], variables)).toEqual([0.8, 0.1, 280]);
        expect(resolveColor(token.outlined['background-color'], {
            ...variables,
            [vars['outlined.background-color']]: 'oklch(0.7 0.1 260)',
        })).toEqual([0.7, 0.1, 260]);
    });
});
