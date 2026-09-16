/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'indent.width': '--tree-indent-width',
    'root.border-radius': '--tree-root-border-radius',
    'node.background-color-hover': '--tree-node-background-color-hover',
    'node.background-color-selected': '--tree-node-background-color-selected',
    'node.selection.border-color': '--tree-node-selection-border-color',
    'node.selection.border-width': '--tree-node-selection-border-width',
    'node.expand.icon.color': '--tree-node-expand-icon-color',
    'node.icon.background-color-hover': '--tree-node-icon-background-color-hover',
    'node.icon.color-loading': '--tree-node-icon-color-loading',
    'node.indent-line.border-color': '--tree-node-indent-line-border-color',
    'node.draggable.border-width': '--tree-node-draggable-border-width',
    'node.draggable.border-style': '--tree-node-draggable-border-style',
    'node.draggable.border-color': '--tree-node-draggable-border-color',
    'node.drag.indicator.background-color': '--tree-node-drag-indicator-background-color',
    'node.drag.inside.background-color': '--tree-node-drag-inside-background-color',
    'node.drag.inside.border-color': '--tree-node-drag-inside-border-color',
    'node.drag.badge.background-color': '--tree-node-drag-badge-background-color',
    'node.drag.badge.color': '--tree-node-drag-badge-color',
    'node.color-disabled': '--tree-node-color-disabled',
    'node.background-color-disabled': '--tree-node-background-color-disabled',
    'drag-overlay.box-shadow': '--tree-drag-overlay-box-shadow',
    'context-menu.z-index': '--tree-context-menu-z-index',
    'context-menu.box-shadow': '--tree-context-menu-box-shadow'
});

const token = defineTokens({
    'indent': {
        'width': `var(${vars['indent.width']}, var(--tree-indent-size, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`
    },
    'root': {
        'border-radius': `var(${vars['root.border-radius']}, var(--tree-border-radius, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px))))`
    },
    'node': {
        'background-color-hover': `var(${vars['node.background-color-hover']}, var(--tree-node-hover-background-color, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'background-color-selected': `var(${vars['node.background-color-selected']}, var(--tree-node-select-background-color, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510)))))`,
        'selection': {
            'border-color': `var(${vars['node.selection.border-color']}, var(--tree-node-select-indicator-color, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
            'border-width': `var(${vars['node.selection.border-width']}, var(--tree-node-select-indicator-width, 3px))`
        },
        'expand': {
            'icon': {
                'color': `var(${vars['node.expand.icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`
            }
        },
        'icon': {
            'background-color-hover': `var(${vars['node.icon.background-color-hover']}, var(--tree-node-icon-hover-background-color, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
            'color-loading': `var(${vars['node.icon.color-loading']}, var(--tree-node-icon-loading-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
        },
        'indent-line': {
            'border-color': `var(${vars['node.indent-line.border-color']}, var(--tree-node-indent-line-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`
        },
        'draggable': {
            'border-width': `var(${vars['node.draggable.border-width']}, 1px)`,
            'border-style': `var(${vars['node.draggable.border-style']}, solid)`,
            'border-color': `var(${vars['node.draggable.border-color']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'drag': {
            'indicator': {
                'background-color': `var(${vars['node.drag.indicator.background-color']}, var(--tree-node-drag-indicator-color, var(--token-semantic-color-feedback-info-border, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262))))))`
            },
            'inside': {
                'background-color': `var(${vars['node.drag.inside.background-color']}, var(--token-semantic-color-feedback-info-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`,
                'border-color': `var(${vars['node.drag.inside.border-color']}, var(--token-semantic-color-feedback-info-border, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262)))))`
            },
            'badge': {
                'background-color': `var(${vars['node.drag.badge.background-color']}, var(--token-semantic-color-feedback-info-solid, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262)))))`,
                'color': `var(${vars['node.drag.badge.color']}, var(--token-semantic-color-feedback-info-on-solid, var(--token-global-white, oklch(1.000 0 0))))`
            }
        },
        'color-disabled': `var(${vars['node.color-disabled']}, var(--tree-node-disabled-color, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`,
        'background-color-disabled': `var(${vars['node.background-color-disabled']}, var(--tree-node-disabled-background-color, transparent))`
    },
    'drag-overlay': {
        'box-shadow': `var(${vars['drag-overlay.box-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08))))`
    },
    'context-menu': {
        'z-index': `var(${vars['context-menu.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100)))`,
        'box-shadow': `var(${vars['context-menu.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`
    }
});

export default token;
