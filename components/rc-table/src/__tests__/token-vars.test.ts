import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';

describe('table canonical token contract', () => {
    it('exposes canonical overrides with their semantic or static defaults', () => {
        expect(vars['root.outline-color-focus']).toBe('--table-root-outline-color-focus');
        expect(token.root['outline-color-focus']).toContain('--token-semantic-color-focus-ring');
        expect(token.cell['border-color'].split('--table-cell-border-color')).toHaveLength(2);
    });

    it('does not expose or consume removed aliases', () => {
        for (const key of ["root.focus.color","tree.button.size","cell.border-color-vertical"]) {
            expect(key in vars).toBe(false);
        }
        const values = JSON.stringify(token);
        for (const alias of ["--table-root-focus-color,","--table-tree-button-size,","--table-cell-border-color-vertical,","--table-border-color,"]) {
            expect(values).not.toContain(alias);
        }
    });
});
