import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';
import { TokenVars, vars } from '../token-vars.js';
import { themeColorContract } from '../theme.js';

describe('semantic token contract', () => {
    it('keeps legacy CSS custom property names stable', () => {
        for (const intent of ['error', 'success', 'warning', 'info'] as const) {
            expect(vars[`color.feedback.${intent}`]).toBe(
                `--token-semantic-color-feedback-${intent}`,
            );
            expect(vars[`color.feedback.${intent}-background`]).toBe(
                `--token-semantic-color-feedback-${intent}-background`,
            );
        }
        expect(TokenVars['color.text.secondary']).toBe('--token-semantic-color-text-secondary');
    });

    it('exposes role-specific feedback and selection tokens', () => {
        for (const intent of ['error', 'success', 'warning', 'info'] as const) {
            for (const role of [
                'text',
                'icon',
                'border',
                'background',
                'background-hover',
                'solid',
                'solid-hover',
                'solid-active',
                'on-solid',
            ] as const) {
                expect(TokenVars[`color.feedback.${intent}.${role}`]).toBe(
                    `--token-semantic-color-feedback-${intent}-${role}`,
                );
            }
        }
        expect(token.color.feedback.error.text).toContain('--token-global-material-error-10');
        expect(token.color.feedback.success['on-solid']).toContain('--token-global-white');
        expect(token.color.focus.ring).toContain('--token-global-purple-40');
        expect(token.color.selection.foreground).toContain('--token-global-purple-10');
        expect(token.color.highlight.foreground).toContain('--token-global-zinc-950');
    });

    it('keeps standalone L2 brand fallbacks equal to the default Light theme', () => {
        const light = themeColorContract.light;
        for (const [fallback, themed] of [
            [token.color.brand.primary, light.brand.primary],
            [token.color.brand['primary-hover'], light.brand.hover],
            [token.color.brand['primary-active'], light.brand.active],
            [token.color.text['on-brand'], light.text.onBrand],
            [token.color.text.link, light.text.link],
            [token.color.selection.background, light.selection.background],
            [token.color.selection.foreground, light.selection.foreground],
            [token.color.fill.active, light.fill.active],
            [token.color.brand.container, light.brandContainer.background],
            [token.color.brand['on-container'], light.brandContainer.foreground],
            ...Object.keys(light.surface).map(key => {
                const role = key as keyof typeof light.surface;
                return [token.color.surface[role], light.surface[role]];
            }),
        ]) expect(fallback).toContain(themed);
    });
});
