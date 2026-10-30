import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('date-picker canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['navigation.width']).toBe('--date-picker-navigation-width');
        expect(token.navigation.width).toContain('--token-semantic-size-32');
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

    it('uses one semantic source for input, dial-field and period geometry', () => {
        expect(token.time.input.width).toContain('--token-semantic-picker-time-input-width');
        expect(token.time.input.height).toContain('--token-semantic-picker-time-input-height');
        expect(token.time.input['font-size']).toContain('--token-semantic-picker-time-input-font-size');
        expect(token.time.input['line-height']).toContain('--token-semantic-picker-time-input-line-height');
        expect(token.time.dial.field.width).toContain('--token-semantic-picker-time-dial-field-width');
        expect(token.time.dial.field['24h'].width).toContain('--token-semantic-picker-time-dial-field-width-24h');
        expect(token.time.dial.field.height).toContain('--token-semantic-picker-time-dial-field-height');
        expect(token.time.period.horizontal.width).toContain('--token-semantic-picker-time-period-horizontal-width');
        expect(token.time.period.horizontal.height).toContain('--token-semantic-picker-time-period-horizontal-height');
    });
});
