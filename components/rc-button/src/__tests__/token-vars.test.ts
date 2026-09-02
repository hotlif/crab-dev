import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars as TokenVars } from '../token.js';
import { vars } from '../token-vars.js';

describe('Button token variable compatibility', () => {
    it('keeps the legacy vars keys and values', () => {
        expect(vars.transition).toBe('--button-transition');
        expect(vars['size.large.border.radius']).toBe('--button-size-large-border-radius');
        expect(vars['danger.background.color-hover']).toBe(
            '--button-danger-background-color-hover',
        );
        expect(vars['selected.background.color']).toBe('--button-selected-background-color');
    });

    it('exposes canonical TokenVars with new-variable precedence', () => {
        expect(TokenVars['root.transition']).toBe('--button-root-transition');
        expect(TokenVars['danger.background-color-hover']).toBe(
            '--button-danger-background-color-hover',
        );
        expect(token.root.transition).toContain(
            'var(--button-root-transition, var(--button-transition,',
        );
    });
});
