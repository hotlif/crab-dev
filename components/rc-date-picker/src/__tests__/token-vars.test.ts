import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';
import { TokenVars } from '../token-vars.js';

describe('DatePicker navigation override compatibility', () => {
    it('preserves the public size key and its fallback after canonical naming', () => {
        expect(TokenVars['navigation.size']).toBe('--date-picker-navigation-size');
        expect(TokenVars['navigation.width']).toBe('--date-picker-navigation-width');
        expect(token.navigation.width).toContain('var(--date-picker-navigation-width, var(--date-picker-navigation-size,');
    });
});
