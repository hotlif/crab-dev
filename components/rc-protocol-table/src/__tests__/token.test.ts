import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('ProtocolTable token contract', () => {
    it('uses its own public CSS variable namespace', () => {
        for (const variable of Object.values(vars)) {
            expect(variable).toMatch(/^--protocol-table-/);
        }
    });

    it('keeps the legacy rc-table-looking variables as fallbacks', () => {
        expect(token.surface['background-color']).toContain(
            'var(--protocol-table-surface-background-color, var(--crab-rc-table-bg-color,',
        );
        expect(token.chrome['background-color']).toContain(
            'var(--protocol-table-chrome-background-color, var(--crab-rc-table-header-bg-color,',
        );
        expect(token.root['border-color']).toContain(
            'var(--protocol-table-root-border-color, var(--crab-rc-table-border-color,',
        );
    });

    it('pairs the selection hover colors through highlight roles', () => {
        expect(token.icon.selection['background-color-hover']).toContain(
            '--token-semantic-color-highlight-background-active',
        );
        expect(token.icon.selection['color-hover']).toContain(
            '--token-semantic-color-highlight-foreground',
        );
    });

    it('uses neutral selection roles for selected sorting controls', () => {
        expect(token.sort['color-selected']).toContain(
            '--token-semantic-color-brand-primary',
        );
        expect(token.sort.selection['color-hover']).toContain(
            '--token-semantic-color-selection-foreground',
        );
        expect(token.sort.selection['background-color-hover']).toContain(
            '--token-semantic-color-selection-background',
        );
    });
});
