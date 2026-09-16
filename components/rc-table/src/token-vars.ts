import { vars } from './token.js';

type LegacyTableKey = 'root.focus.color' | 'root.focus.width' | 'root.focus.offset'
    | 'cell.border-color-vertical' | 'resize-handle.indicator-width' | 'tree.button.size';

/** Existing public keys and CSS overrides remain valid during canonical naming migration. */
export const TokenVars: typeof vars & Readonly<Record<LegacyTableKey, string>> = {
    ...vars,
    'root.focus.color': '--table-root-focus-color',
    'root.focus.width': '--table-root-focus-width',
    'root.focus.offset': '--table-root-focus-offset',
    'cell.border-color-vertical': '--table-cell-border-color-vertical',
    'resize-handle.indicator-width': '--table-resize-handle-indicator-width',
    'tree.button.size': '--table-tree-button-size',
};
