import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';
import { TokenVars, vars } from '../token-vars.js';

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
        expect(token.color.feedback.error.text).toContain('--token-global-red-800');
        expect(token.color.feedback.success['on-solid']).toContain('--token-global-white');
        expect(token.color.focus.ring).toContain('--token-global-blue-600');
        expect(token.color.selection.foreground).toContain('--token-global-zinc-950');
        expect(token.color.highlight.foreground).toContain('--token-global-zinc-950');
    });
});
