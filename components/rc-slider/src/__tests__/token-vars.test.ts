import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('slider canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['rail.height']).toBe('--slider-rail-height');
        expect(token.rail.height).toBe('var(--slider-rail-height, 16px)');
        expect(token.rail['fill-inactive']).toContain('--token-semantic-color-secondary-container');
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["rail.thickness","rail.inactive.fill","thumb.halo.scale.factor"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--slider-rail-thickness,","--slider-rail-inactive-fill,","--slider-thumb-halo-scale-factor,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
