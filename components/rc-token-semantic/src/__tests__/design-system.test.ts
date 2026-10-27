import { describe, expect, it } from '@crab-dev/wake/test';
import { defaultDesignSystem, designSystemRegistry } from '../design-system.js';
import { designColorContract } from '../design-theme.js';
import { densityGeometry } from '../density-geometry.js';
import token, { vars } from '../token.js';

describe('public design-system contract', () => {
    it('uses one registry for public identities, labels and the default', () => {
        expect(Object.keys(designSystemRegistry)).toEqual(['md3', 'apple', 'shadcn']);
        expect(Object.keys(designColorContract)).toEqual(Object.keys(designSystemRegistry));
        expect(defaultDesignSystem).toBe('md3');
        expect(designSystemRegistry.md3.label).toBe('MD3 Expressive');
        expect(designSystemRegistry.md3.fullName).toBe('Material Design 3 Expressive');
        expect(designSystemRegistry.apple.label).toBe('Apple');
        expect(designSystemRegistry.shadcn.label).toBe('shadcn/ui');
    });

    it('keeps density presets separate from component-size roles', () => {
        const roles = ['navigation', 'item', 'gap', 'padding', 'cell-padding'] as const;
        for (const density of ['compact', 'standard', 'comfortable'] as const) {
            for (const role of roles) {
                expect(vars[`density.${density}.${role}`]).toBe(`--token-semantic-density-${density}-${role}`);
                expect(token.density[density][role]).toContain('--token-global-');
            }
        }
        for (const role of roles) {
            expect(token.density[role]).toContain(`--token-semantic-density-standard-${role}`);
        }
        for (const size of ['small', 'medium', 'large'] as const) {
            expect(token.sizing[size].control).not.toContain('--token-semantic-density-');
        }
        expect('sizing.middle.control' in vars).toBe(false);
    });

    it('keeps generated virtual geometry equal to the L2 CSS fallbacks', () => {
        for (const density of ['compact', 'standard', 'comfortable'] as const) {
            for (const metric of ['row', 'header', 'navigation', 'item'] as const) {
                expect(token.density[density][metric]).toContain(`${densityGeometry[density][metric]}px`);
            }
        }
    });
});
