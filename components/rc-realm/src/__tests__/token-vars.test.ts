import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('realm canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['root.animation']).toBe('--realm-root-animation');
        expect(token.root.animation).toContain('--token-semantic-motion-fade');
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["motion.appear"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--realm-motion-appear,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
