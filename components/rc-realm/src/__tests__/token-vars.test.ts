import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars as TokenVars } from '../token.js';
import { vars } from '../token-vars.js';

describe('Realm token variable compatibility', () => {
    it('keeps the legacy vars key and CSS variable name', () => {
        expect(vars['motion.appear']).toBe('--realm-motion-appear');
    });

    it('exposes the canonical animation key before the legacy fallback', () => {
        expect(TokenVars['root.animation']).toBe('--realm-root-animation');
        expect(token.root.animation).toContain(
            'var(--realm-root-animation, var(--realm-motion-appear,',
        );
    });
});
