import { describe, expect, it } from '@crab-dev/wake/test';
import { readFile } from 'node:fs/promises';
import token, { vars, type DesignSystem } from '@crab-dev/rc-token-semantic';
import { designTypographyContract, designMotionContract } from '../type-motion-values.js';

const designs = ['md3', 'apple', 'shadcn'] as const satisfies readonly DesignSystem[];

function declaredProperties(source: string, design: DesignSystem): string[] {
    const selector = `[data-crab-design='${design}'] {`;
    const start = source.indexOf(selector);
    expect(start).toBeGreaterThanOrEqual(0);
    const block = source.slice(start, source.indexOf('\n    }', start));
    return [...block.matchAll(/(--token-semantic-[\w-]+):/g)].map(match => match[1]).sort();
}

describe('complete design typography and motion', () => {
    it('restores every public typography and motion role at each design boundary', async () => {
        const typographySource = await readFile(new URL('../typography-theme.ts', import.meta.url), 'utf8');
        const motionSource = await readFile(new URL('../motion-theme.ts', import.meta.url), 'utf8');
        const typographyRoles = Object.entries(vars)
            .filter(([role]) => role.startsWith('typography.') || role.startsWith('font.'))
            .map(([, variable]) => variable).sort();
        const motionRoles = Object.entries(vars)
            .filter(([role]) => role.startsWith('motion.'))
            .map(([, variable]) => variable).sort();
        for (const design of designs) {
            expect(declaredProperties(typographySource, design)).toEqual(typographyRoles);
            expect(declaredProperties(motionSource, design)).toEqual(motionRoles);
        }
    });

    it('preserves the default MD3 scale while giving desktop designs their own hierarchy', () => {
        for (const role of ['display', 'headline', 'title', 'body', 'label', 'caption'] as const) {
            const style = designTypographyContract.md3.legacy[role];
            expect(token.typography[role]['font-size']).toContain(style.fontSize);
            expect(token.typography[role]['font-weight']).toContain(style.fontWeight);
            expect(token.typography[role]['line-height']).toContain(style.lineHeight);
        }
        expect(designTypographyContract.apple.typescale.displayLarge.fontSize)
            .not.toBe(designTypographyContract.md3.typescale.displayLarge.fontSize);
        expect(designTypographyContract.apple.typescale.titleLarge.fontWeight)
            .not.toBe(designTypographyContract.md3.typescale.titleLarge.fontWeight);
        expect(designTypographyContract.shadcn.typescale.bodyLarge.lineHeight)
            .not.toBe(designTypographyContract.md3.typescale.bodyLarge.lineHeight);
    });

    it('keeps spatial motion expressive only in MD3 and effects free of overshoot', () => {
        expect(token.motion.spatial.default).toContain(designMotionContract.md3.spatialDefault);
        expect(token.motion.effects.default).toContain(designMotionContract.md3.effectsDefault);
        for (const design of ['apple', 'shadcn'] as const) {
            for (const value of Object.values(designMotionContract[design])) {
                expect(value).not.toContain('expressive');
            }
            expect(designMotionContract[design].spatialDefault).not.toBe(designMotionContract.md3.spatialDefault);
        }
        expect(designMotionContract.apple.sheetEasing).not.toBe(designMotionContract.md3.sheetEasing);
        expect(designMotionContract.shadcn.sheetEnterDuration).not.toBe(designMotionContract.md3.sheetEnterDuration);
    });
});
