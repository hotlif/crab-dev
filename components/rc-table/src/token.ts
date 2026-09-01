/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
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
    'edited-indicator.size': '--table-edited-indicator-size',
    'tree.indent': '--table-tree-indent',
    'tree.chevron-size': '--table-tree-chevron-size',
    'tree.chevron-color': '--table-tree-chevron-color',
    'tree.chevron-transition': '--table-tree-chevron-transition',
    'tree.button-radius': '--table-tree-button-radius',
    'tree.button-gap': '--table-tree-button-gap',
    'row-edit.row-bg': '--table-row-edit-row-bg',
    'row-edit.cell-bg': '--table-row-edit-cell-bg',
    'row-edit.ring-color': '--table-row-edit-ring-color',
    'row-edit.card-shadow': '--table-row-edit-card-shadow',
    'row-edit.card-radius': '--table-row-edit-card-radius',
    'row-edit.transition': '--table-row-edit-transition',
    'row-edit.actions-bg': '--table-row-edit-actions-bg',
    'row-edit.actions-border': '--table-row-edit-actions-border',
    'row-edit.actions-radius': '--table-row-edit-actions-radius',
    'row-edit.actions-shadow': '--table-row-edit-actions-shadow',
    'row-edit.actions-padding': '--table-row-edit-actions-padding',
    'row-edit.actions-gap': '--table-row-edit-actions-gap',
    'row-edit.confirm-bg': '--table-row-edit-confirm-bg',
    'row-edit.confirm-color': '--table-row-edit-confirm-color',
    'row-edit.confirm-hover-bg': '--table-row-edit-confirm-hover-bg',
    'row-edit.confirm-active-bg': '--table-row-edit-confirm-active-bg',
    'row-edit.cancel-color': '--table-row-edit-cancel-color',
    'row-edit.cancel-hover-bg': '--table-row-edit-cancel-hover-bg',
    'row-edit.cancel-border': '--table-row-edit-cancel-border',
    'row-edit.button-height': '--table-row-edit-button-height',
    'row-edit.button-padding-x': '--table-row-edit-button-padding-x',
    'row-edit.button-radius': '--table-row-edit-button-radius',
    'row-edit.button-font-size': '--table-row-edit-button-font-size',
    'row-edit.button-font-weight': '--table-row-edit-button-font-weight',
    'row-edit.button-gap': '--table-row-edit-button-gap',
    'column-drag.indicator-color': '--table-column-drag-indicator-color',
    'column-drag.indicator-width': '--table-column-drag-indicator-width',
    'column-drag.dragging-opacity': '--table-column-drag-dragging-opacity',
    'sort.icon-color': '--table-sort-icon-color',
    'sort.icon-active-color': '--table-sort-icon-active-color',
    'sort.header-cursor': '--table-sort-header-cursor',
    'sort.badge-color': '--table-sort-badge-color',
    'sort.badge-font-size': '--table-sort-badge-font-size',
    'row-selection.selected-bg': '--table-row-selection-selected-bg',
    'row-click.cursor': '--table-row-click-cursor',
    'row-click.hover-bg': '--table-row-click-hover-bg',
    'row-click.row-bg-transition': '--table-row-click-row-bg-transition',
    'summary.color': '--table-summary-color',
    'summary.font-weight': '--table-summary-font-weight',
    'summary.padding-inline': '--table-summary-padding-inline',
    'expand.chevron-size': '--table-expand-chevron-size',
    'expand.chevron-color': '--table-expand-chevron-color',
    'expand.chevron-transition': '--table-expand-chevron-transition',
    'expand.button-radius': '--table-expand-button-radius',
    'expand.content-bg': '--table-expand-content-bg',
    'expand.content-padding': '--table-expand-content-padding'
});

const token = defineTokens({
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
    },
    'tree': {
        'indent': `var(${vars['tree.indent']}, 20px)`,
        'chevron-size': `var(${vars['tree.chevron-size']}, 16px)`,
        'chevron-color': `var(${vars['tree.chevron-color']}, oklch(0.400 0 0))`,
        'chevron-transition': `var(${vars['tree.chevron-transition']}, transform 150ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'button-radius': `var(${vars['tree.button-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'button-gap': `var(${vars['tree.button-gap']}, 4px)`
    },
    'row-edit': {
        'row-bg': `var(${vars['row-edit.row-bg']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'cell-bg': `var(${vars['row-edit.cell-bg']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'ring-color': `var(${vars['row-edit.ring-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'card-shadow': `var(${vars['row-edit.card-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))`,
        'card-radius': `var(${vars['row-edit.card-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
        'transition': `var(${vars['row-edit.transition']}, 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'actions-bg': `var(${vars['row-edit.actions-bg']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`,
        'actions-border': `var(${vars['row-edit.actions-border']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'actions-radius': `var(${vars['row-edit.actions-radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`,
        'actions-shadow': `var(${vars['row-edit.actions-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))`,
        'actions-padding': `var(${vars['row-edit.actions-padding']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'actions-gap': `var(${vars['row-edit.actions-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'confirm-bg': `var(${vars['row-edit.confirm-bg']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'confirm-color': `var(${vars['row-edit.confirm-color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'confirm-hover-bg': `var(${vars['row-edit.confirm-hover-bg']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286))))`,
        'confirm-active-bg': `var(${vars['row-edit.confirm-active-bg']}, var(--token-semantic-color-brand-primary-active, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'cancel-color': `var(${vars['row-edit.cancel-color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'cancel-hover-bg': `var(${vars['row-edit.cancel-hover-bg']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'cancel-border': `var(${vars['row-edit.cancel-border']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'button-height': `var(${vars['row-edit.button-height']}, 28px)`,
        'button-padding-x': `var(${vars['row-edit.button-padding-x']}, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px)))`,
        'button-radius': `var(${vars['row-edit.button-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'button-font-size': `var(${vars['row-edit.button-font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'button-font-weight': `var(${vars['row-edit.button-font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'button-gap': `var(${vars['row-edit.button-gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
    },
    'column-drag': {
        'indicator-color': `var(${vars['column-drag.indicator-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'indicator-width': `var(${vars['column-drag.indicator-width']}, 2px)`,
        'dragging-opacity': `var(${vars['column-drag.dragging-opacity']}, 0.45)`
    },
    'sort': {
        'icon-color': `var(${vars['sort.icon-color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`,
        'icon-active-color': `var(${vars['sort.icon-active-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'header-cursor': `var(${vars['sort.header-cursor']}, pointer)`,
        'badge-color': `var(${vars['sort.badge-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'badge-font-size': `var(${vars['sort.badge-font-size']}, 11px)`
    },
    'row-selection': {
        'selected-bg': `var(${vars['row-selection.selected-bg']}, oklch(0.506 0.174 260 / 0.08))`
    },
    'row-click': {
        'cursor': `var(${vars['row-click.cursor']}, pointer)`,
        'hover-bg': `var(${vars['row-click.hover-bg']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'row-bg-transition': `var(${vars['row-click.row-bg-transition']}, 90ms cubic-bezier(0, 0, 0.2, 1))`
    },
    'summary': {
        'color': `var(${vars['summary.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'font-weight': `var(${vars['summary.font-weight']}, var(--token-semantic-font-weight-strong, var(--token-global-font-weight-bold, 700)))`,
        'padding-inline': `var(${vars['summary.padding-inline']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'expand': {
        'chevron-size': `var(${vars['expand.chevron-size']}, 16px)`,
        'chevron-color': `var(${vars['expand.chevron-color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'chevron-transition': `var(${vars['expand.chevron-transition']}, transform 150ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'button-radius': `var(${vars['expand.button-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'content-bg': `var(${vars['expand.content-bg']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'content-padding': `var(${vars['expand.content-padding']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    }
});

export default token;
