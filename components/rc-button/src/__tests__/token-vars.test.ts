import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('button canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['root.transition']).toBe('--button-root-transition');
        expect(token.root.transition).toContain('--token-semantic-motion-interaction');
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["transition","selected.background.color"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--button-transition,","--button-selected-background-color,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
