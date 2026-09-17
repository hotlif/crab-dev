import { describe, expect, it } from '@crab-dev/wake/test';
import { createBrandTheme, themeColorContract, TokenVars } from '@crab-dev/rc-token-semantic';
import token from '../token.js';
import { vars } from '../token-vars.js';
import { contrast, resolveColor, type Variables } from './colorContrast.js';

function themeVariables(mode: 'light' | 'dark', seed?: string): Variables {
    const theme = themeColorContract[mode];
    return {
        [TokenVars['color.brand.primary']]: theme.brand.primary,
        [TokenVars['color.text.primary']]: theme.text.primary,
        [TokenVars['color.text.on-brand']]: theme.text.onBrand,
        [TokenVars['color.background.surface']]: theme.background.surface,
        [TokenVars['color.background.elevated']]: theme.background.elevated,
        [TokenVars['color.focus.ring']]: theme.focusRing,
        ...(seed ? createBrandTheme(seed)[mode] : {}),
    };
}

const states = [
    ['color', 'background-color'],
    ['color-hover', 'background-color-hover'],
    ['color-active', 'background-color-active'],
] as const;

function checkReadableStates(mode: 'light' | 'dark', seed?: string) {
    const variables = themeVariables(mode, seed);
    const brandHue = resolveColor(variables[TokenVars['color.brand.primary']], variables)[2];
    for (const [foreground, background] of states) {
        expect(contrast(token.subtle[foreground], token.subtle[background], variables)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(token.root['outline-color-focus'], token.subtle[background], variables)).toBeGreaterThanOrEqual(3);
        if (foreground !== 'color') {
            expect(resolveColor(token.subtle[foreground], variables)[2]).toBe(brandHue);
            expect(resolveColor(token.subtle[background], variables)[2]).toBe(brandHue);
        }
    }
    // Idle buttons stay neutral across seeds; the brand appears on interaction.
    const neutralVariables = themeVariables(mode);
    for (const role of ['color', 'background-color'] as const) {
        expect(resolveColor(token.subtle[role], variables)).toEqual(resolveColor(token.subtle[role], neutralVariables));
    }
    expect(resolveColor(token.subtle.color, variables)).toEqual(resolveColor(themeColorContract[mode].text.primary, variables));
    expect(resolveColor(token.subtle['background-color'], variables)).toEqual(resolveColor(themeColorContract[mode].background.elevated, variables));
    // The 2px outline offset also places the focus ring against the surrounding surface.
    expect(contrast(token.root['outline-color-focus'], themeColorContract[mode].background.surface, variables)).toBeGreaterThanOrEqual(3);
    expect(contrast(token.root['color-selected'], token.root['background-color-selected'], variables)).toBeGreaterThanOrEqual(4.5);
    const colors = states.map(([foreground]) => resolveColor(token.subtle[foreground], variables));
    expect(colors[2]).toEqual(colors[1]);
    const lightness = states.map(([, background]) => resolveColor(token.subtle[background], variables)[0]);
    expect(lightness).toEqual([...lightness].sort((a, b) => mode === 'dark' ? a - b : b - a));
}

describe('subtle button theme', () => {
    it('keeps text, selected state and focus readable in both default themes', () => {
        checkReadableStates('light');
        checkReadableStates('dark');
    });

    it('keeps neutral idle colors and readable branded interactions across extreme and saturated seeds', () => {
        const values = [0, 64, 128, 192, 255];
        const seeds = ['#6750a4', '#1677ff', '#087f5b'];
        for (const r of values) for (const g of values) for (const b of values) {
            seeds.push(`#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`);
        }
        for (const seed of seeds) for (const mode of ['light', 'dark'] as const) {
            checkReadableStates(mode, seed);
        }
    });

    it('preserves legacy background overrides while exposing independent state colors', () => {
        const variables = { [vars['subtle.background.color']]: 'oklch(0.8 0.1 280)' };
        expect(resolveColor(token.subtle['background-color'], variables)).toEqual([0.8, 0.1, 280]);
        expect(resolveColor(token.subtle['background-color-hover'], variables)).not.toEqual([0.8, 0.1, 280]);
        expect(vars['subtle.background.color-disabled']).toBe(vars['subtle.background-color-disabled']);
    });
});
