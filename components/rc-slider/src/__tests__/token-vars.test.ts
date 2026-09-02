import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';
import { TokenVars } from '../token-vars.js';

describe('Slider TokenVars compatibility', () => {
    it('retains the original public keys and values', () => {
        expect(TokenVars['rail.thickness']).toBe('--slider-rail-thickness');
        expect(TokenVars['rail.inactive.fill']).toBe('--slider-rail-inactive-fill');
        expect(TokenVars['rail.active.fill']).toBe('--slider-rail-active-fill');
        expect(TokenVars['thumb.radius']).toBe('--slider-thumb-radius');
        expect(TokenVars['thumb.stroke.color']).toBe('--slider-thumb-stroke-color');
        expect(TokenVars['thumb.stroke.width']).toBe('--slider-thumb-stroke-width');
        expect(TokenVars['thumb.halo.scale.factor']).toBe('--slider-thumb-halo-scale-factor');
    });

    it('also exposes canonical keys with new-variable precedence', () => {
        expect(TokenVars['rail.fill-inactive']).toBe('--slider-rail-fill-inactive');
        expect(TokenVars['rail.height']).toBe('--slider-rail-height');
        expect(TokenVars['thumb.border-radius']).toBe('--slider-thumb-border-radius');
        expect(TokenVars['thumb.halo.scale.width']).toBe('--slider-thumb-halo-scale-width');
        expect(token.rail['fill-inactive']).toContain(
            'var(--slider-rail-fill-inactive, var(--slider-rail-inactive-fill,',
        );
        expect(token.rail.height).toContain(
            'var(--slider-rail-height, var(--slider-rail-thickness,',
        );
    });
});
