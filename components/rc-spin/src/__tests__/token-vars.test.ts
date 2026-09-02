import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars as TokenVars } from '../token.js';
import { vars } from '../token-vars.js';

describe('Spin token variable compatibility', () => {
    it('keeps the legacy vars keys and CSS variable names', () => {
        expect(vars['ring.track-color']).toBe('--spin-ring-track-color');
        expect(vars['ring.indicator-color']).toBe('--spin-ring-indicator-color');
        expect(vars['ring.dash']).toBe('--spin-ring-dash');
        expect(vars['motion.appear']).toBe('--spin-motion-appear');
        expect(vars['size.middle.size']).toBe('--spin-size-middle-size');
        expect(vars['content.blur']).toBe('--spin-content-blur');
    });

    it('exposes canonical TokenVars before legacy fallbacks', () => {
        expect(TokenVars['ring.track.stroke']).toBe('--spin-ring-track-stroke');
        expect(TokenVars['ring.indicator.stroke']).toBe('--spin-ring-indicator-stroke');
        expect(TokenVars['ring.stroke-dasharray']).toBe('--spin-ring-stroke-dasharray');
        expect(TokenVars['indicator.animation-duration']).toBe(
            '--spin-indicator-animation-duration',
        );
        expect(TokenVars['size.middle.width']).toBe('--spin-size-middle-width');
        expect(TokenVars['content.filter']).toBe('--spin-content-filter');
        expect(token.ring.track.stroke).toContain(
            'var(--spin-ring-track-stroke, var(--spin-ring-track-color,',
        );
    });
});
