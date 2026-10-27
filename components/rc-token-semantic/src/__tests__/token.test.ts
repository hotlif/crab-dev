import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars as TokenVars } from '../token.js';
import { md3ColorContract } from '../theme.js';

describe('semantic token contract', () => {
    it('provides complete standalone Material multiline geometry for every size', () => {
        for (const size of ['small', 'medium', 'large'] as const) {
            const geometry = token.field.multiline[size];
            expect(geometry['min-height']).toContain('--token-global-size-56');
            expect(geometry['padding-inline']).toContain('--token-global-space-4');
            expect(geometry['padding-block']).toContain('--token-global-space-4');
            expect(geometry['filled-padding-top']).toContain('--token-global-space-6');
            expect(geometry['filled-padding-bottom']).toContain('--token-global-space-2');
            for (const role of ['min-height', 'padding-inline', 'padding-block', 'filled-padding-top', 'filled-padding-bottom'] as const) {
                expect(TokenVars[`field.multiline.${size}.${role}`]).toBe(`--token-semantic-field-multiline-${size}-${role}`);
            }
        }
    });

    it('provides standalone Material form layout fallbacks', () => {
        expect(TokenVars['form.layout.columns']).toBe('--token-semantic-form-layout-columns');
        expect(TokenVars['form.field.columns']).toBe('--token-semantic-form-field-columns');
        expect(TokenVars['form.field.control-column']).toBe('--token-semantic-form-field-control-column');
        expect(TokenVars['form.field.inline']).toBe('--token-semantic-form-field-inline');
        expect(token.form.layout.columns).toContain('auto minmax(0, 1fr) auto');
        expect(token.form.field.columns).toContain('minmax(0, 1fr)');
        expect(token.form.field['control-column']).toContain('1 / -1');
        expect(token.form.field.inline).toBe('var(--token-semantic-form-field-inline, 0)');
        expect(TokenVars['field.required.color']).toBe('--token-semantic-field-required-color');
        expect(token.field.required.color).toContain('inherit');
        expect(token.field.required.order).toContain('1');
        expect(token.field.required.gap).toContain('--token-global-space-1');
    });

    it('keeps feedback roles independent of removed catch-all aliases', () => {
        for (const intent of ['error', 'success', 'warning', 'info'] as const) {
            expect(`color.feedback.${intent}` in TokenVars).toBe(false);
            const legacyReference = `var(--token-semantic-color-feedback-${intent},`;
            expect(JSON.stringify(token.color.feedback[intent])).not.toContain(legacyReference);
            expect(JSON.stringify(md3ColorContract.light.feedback[intent])).not.toContain(legacyReference);
            expect(JSON.stringify(md3ColorContract.dark.feedback[intent])).not.toContain(legacyReference);
        }
    });

    it('exposes role-specific feedback and selection tokens', () => {
        for (const intent of ['error', 'success', 'warning', 'info'] as const) {
            for (const role of [
                'text',
                'icon',
                'border',
                'background',
                'background-hover',
                'solid',
                'solid-hover',
                'solid-active',
                'on-solid',
            ] as const) {
                expect(TokenVars[`color.feedback.${intent}.${role}`]).toBe(
                    `--token-semantic-color-feedback-${intent}-${role}`,
                );
            }
        }
        expect(token.color.feedback.error.text).toContain('--token-global-material-error-10');
        expect(token.color.feedback.success['on-solid']).toContain('--token-global-white');
        expect(token.color.focus.ring).toContain('--token-global-purple-40');
        expect(token.color.selection.foreground).toContain('--token-global-purple-10');
        expect(token.color.highlight.foreground).toContain('--token-global-zinc-950');
    });

    it('keeps standalone L2 brand fallbacks equal to the default Light theme', () => {
        const light = md3ColorContract.light;
        for (const [fallback, themed] of [
            [token.color.brand.primary, light.brand.primary],
            [token.color.brand['primary-hover'], light.brand.hover],
            [token.color.brand['primary-active'], light.brand.active],
            [token.color.text['on-brand'], light.text.onBrand],
            [token.color.text.link, light.text.link],
            [token.color.selection.background, light.selection.background],
            [token.color.selection.foreground, light.selection.foreground],
            [token.color.fill.active, light.fill.active],
            [token.color.brand.container, light.brandContainer.background],
            [token.color.brand['on-container'], light.brandContainer.foreground],
            ...Object.keys(light.surface).map(key => {
                const role = key as keyof typeof light.surface;
                return [token.color.surface[role], light.surface[role]];
            }),
            ...Object.keys(light.workspace).map(key => {
                const role = key as keyof typeof light.workspace;
                return [token.color.workspace[role], light.workspace[role]];
            }),
        ]) expect(fallback).toContain(themed);
    });
});
