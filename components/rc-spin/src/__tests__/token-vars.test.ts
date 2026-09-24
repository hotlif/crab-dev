import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('spin canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['ring.track.stroke']).toBe('--spin-ring-track-stroke');
        expect(token.ring.track.stroke).toContain('--token-semantic-color-fill-default');
        expect(token.indicator['animation-duration']).toBe('var(--spin-indicator-animation-duration, 0.9s)');
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["ring.track-color","motion.duration","content.blur"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--spin-ring-track-color,","--spin-motion-duration,","--spin-content-blur,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
