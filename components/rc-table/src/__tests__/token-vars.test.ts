import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';
import { TokenVars } from '../token-vars.js';

describe('Table theme override compatibility', () => {
    it('preserves existing public keys and gives canonical variables precedence', () => {
        expect(TokenVars['root.focus.color']).toBe('--table-root-focus-color');
        expect(TokenVars['tree.button.size']).toBe('--table-tree-button-size');
        expect(TokenVars['resize-handle.indicator-width']).toBe('--table-resize-handle-indicator-width');
        expect(token.root['outline-color-focus']).toContain('var(--table-root-outline-color-focus, var(--table-root-focus-color,');
        expect(token.tree.button.width).toContain('var(--table-tree-button-width, var(--table-tree-button-size,');
        expect(token.cell.separator['border-color']).toContain('var(--table-cell-separator-border-color, var(--table-cell-border-color-vertical, var(--table-cell-vertical-border-color,');
    });

    it('keeps the cell override without a self-referencing fallback', () => {
        expect(token.cell['border-color'].split('--table-cell-border-color')).toHaveLength(2);
        expect(token.cell['border-color']).toContain('var(--table-cell-border-color, var(--table-border-color,');
    });
});
