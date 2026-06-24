/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'border.color': '--table-border-color',
    'cell.bg-color': '--table-cell-bg-color',
    'cell.padding-inline': '--table-cell-padding-inline',
    'header.bg-color': '--table-header-bg-color',
    'filter-cell.padding': '--table-filter-cell-padding',
    'resize-handle.width': '--table-resize-handle-width',
    'group.bg-color': '--table-group-bg-color',
    'group.color': '--table-group-color',
    'group.count-color': '--table-group-count-color',
    'group.chevron-color': '--table-group-chevron-color',
    'group.gap': '--table-group-gap',
    'group.padding-inline': '--table-group-padding-inline',
    'group.text-gap': '--table-group-text-gap',
    'group.font-weight': '--table-group-font-weight',
    'group.count-font-size': '--table-group-count-font-size',
    'group.chevron-size': '--table-group-chevron-size',
    'group.chevron-transition': '--table-group-chevron-transition',
    'selection.border-color': '--table-selection-border-color',
    'selection.bg-color': '--table-selection-bg-color',
    'selection.border-width': '--table-selection-border-width',
    'selection.outline-offset': '--table-selection-outline-offset',
    'highlight.bg': '--table-highlight-bg',
    'highlight.color': '--table-highlight-color',
    'highlight.active-bg': '--table-highlight-active-bg',
    'highlight.active-color': '--table-highlight-active-color',
    'highlight.border-radius': '--table-highlight-border-radius',
    'edited-indicator.color': '--table-edited-indicator-color',
    'edited-indicator.size': '--table-edited-indicator-size'
};

const token = {
    'border': {
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
    },
    'cell': {
        'bg-color': `var(${vars['cell.bg-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'padding-inline': `var(${vars['cell.padding-inline']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'header': {
        'bg-color': `var(${vars['header.bg-color']}, oklch(0.975 0.002 286))`
    },
    'filter-cell': {
        'padding': `var(${vars['filter-cell.padding']}, 2px)`
    },
    'resize-handle': {
        'width': `var(${vars['resize-handle.width']}, 4px)`
    },
    'group': {
        'bg-color': `var(${vars['group.bg-color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'color': `var(${vars['group.color']}, oklch(0.267 0 0))`,
        'count-color': `var(${vars['group.count-color']}, oklch(0.508 0 0))`,
        'chevron-color': `var(${vars['group.chevron-color']}, oklch(0.400 0 0))`,
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'padding-inline': `var(${vars['group.padding-inline']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'text-gap': `var(${vars['group.text-gap']}, 6px)`,
        'font-weight': `var(${vars['group.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'count-font-size': `var(${vars['group.count-font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
        'chevron-size': `var(${vars['group.chevron-size']}, 14px)`,
        'chevron-transition': `var(${vars['group.chevron-transition']}, transform 150ms cubic-bezier(0.4, 0, 0.2, 1))`
    },
    'selection': {
        'border-color': `var(${vars['selection.border-color']}, oklch(0.506 0.174 260))`,
        'bg-color': `var(${vars['selection.bg-color']}, oklch(0.506 0.174 260 / 0.08))`,
        'border-width': `var(${vars['selection.border-width']}, 2px)`,
        'outline-offset': `var(${vars['selection.outline-offset']}, -2px)`
    },
    'highlight': {
        'bg': `var(${vars['highlight.bg']}, oklch(0.937 0.171 98))`,
        'color': `var(${vars['highlight.color']}, inherit)`,
        'active-bg': `var(${vars['highlight.active-bg']}, oklch(0.760 0.183 52))`,
        'active-color': `var(${vars['highlight.active-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'border-radius': `var(${vars['highlight.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
    },
    'edited-indicator': {
        'color': `var(${vars['edited-indicator.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`,
        'size': `var(${vars['edited-indicator.size']}, 6px)`
    }
};

export default token;
