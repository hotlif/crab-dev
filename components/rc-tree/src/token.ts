/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'indent.width': '--tree-indent-width',
    'root.border-radius': '--tree-root-border-radius',
    'root.font-family': '--tree-root-font-family',
    'root.font-size': '--tree-root-font-size',
    'root.line-height': '--tree-root-line-height',
    'root.color': '--tree-root-color',
    'root.transition': '--tree-root-transition',
    'root.outline-color-focus': '--tree-root-outline-color-focus',
    'root.outline-width-focus': '--tree-root-outline-width-focus',
    'root.outline-offset-focus': '--tree-root-outline-offset-focus',
    'node.background-color-hover': '--tree-node-background-color-hover',
    'node.background-color-selected': '--tree-node-background-color-selected',
    'node.selection.border-color': '--tree-node-selection-border-color',
    'node.selection.border-width': '--tree-node-selection-border-width',
    'node.selection.width': '--tree-node-selection-width',
    'node.selection.touch.width': '--tree-node-selection-touch-width',
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
    'node.color-selected': '--tree-node-color-selected',
    'node.opacity-disabled': '--tree-node-opacity-disabled',
    'node.touch.min-width': '--tree-node-touch-min-width',
    'node.touch.min-height': '--tree-node-touch-min-height',
    'drag-overlay.box-shadow': '--tree-drag-overlay-box-shadow',
    'context-menu.z-index': '--tree-context-menu-z-index',
    'context-menu.box-shadow': '--tree-context-menu-box-shadow'
});

const token = defineTokens({
    'indent': {
        'width': `var(${vars['indent.width']}, var(--tree-indent-size, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`
    },
    'root': {
        'border-radius': `var(${vars['root.border-radius']}, var(--tree-border-radius, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px))))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-label-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'font-size': `var(${vars['root.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5)))`,
        'color': `var(${vars['root.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'transition': `var(${vars['root.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`
    },
    'node': {
        'background-color-hover': `var(${vars['node.background-color-hover']}, var(--tree-node-hover-background-color, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
        'background-color-selected': `var(${vars['node.background-color-selected']}, var(--tree-node-select-background-color, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047)))))`,
        'selection': {
            'border-color': `var(${vars['node.selection.border-color']}, var(--tree-node-select-indicator-color, var(--token-semantic-color-selection-border, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
            'border-width': `var(${vars['node.selection.border-width']}, var(--tree-node-select-indicator-width, 3px))`,
            'width': `var(${vars['node.selection.width']}, var(--token-semantic-size-selection-target, var(--token-global-size-48, 48px)))`,
            'touch': {
                'width': `var(${vars['node.selection.touch.width']}, var(--token-semantic-size-selection-target, var(--token-global-size-48, 48px)))`
            }
        },
        'expand': {
            'icon': {
                'color': `var(${vars['node.expand.icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
            }
        },
        'icon': {
            'background-color-hover': `var(${vars['node.icon.background-color-hover']}, var(--tree-node-icon-hover-background-color, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
            'color-loading': `var(${vars['node.icon.color-loading']}, var(--tree-node-icon-loading-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
        },
        'indent-line': {
            'border-color': `var(${vars['node.indent-line.border-color']}, var(--tree-node-indent-line-color, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`
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
        'color-disabled': `var(${vars['node.color-disabled']}, var(--tree-node-disabled-color, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`,
        'background-color-disabled': `var(${vars['node.background-color-disabled']}, var(--tree-node-disabled-background-color, transparent))`,
        'color-selected': `var(${vars['node.color-selected']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'opacity-disabled': `var(${vars['node.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'touch': {
            'min-width': `var(${vars['node.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['node.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        }
    },
    'drag-overlay': {
        'box-shadow': `var(${vars['drag-overlay.box-shadow']}, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15))))`
    },
    'context-menu': {
        'z-index': `var(${vars['context-menu.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100)))`,
        'box-shadow': `var(${vars['context-menu.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`
    }
});

export default token;
