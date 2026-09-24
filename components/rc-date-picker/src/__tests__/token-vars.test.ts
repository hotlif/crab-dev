import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('date-picker canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['navigation.width']).toBe('--date-picker-navigation-width');
        expect(token.navigation.width).toContain('--token-semantic-size-48');
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["navigation.size"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--date-picker-navigation-size,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
