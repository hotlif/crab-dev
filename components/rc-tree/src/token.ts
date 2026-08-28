/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'indent.size': '--tree-indent-size',
    'border.radius': '--tree-border-radius',
    'node.hover.background.color': '--tree-node-hover-background-color',
    'node.select.background.color': '--tree-node-select-background-color',
    'node.select.indicator.color': '--tree-node-select-indicator-color',
    'node.select.indicator.width': '--tree-node-select-indicator-width',
    'node.expand.icon.color': '--tree-node-expand-icon-color',
    'node.icon.hover.background.color': '--tree-node-icon-hover-background-color',
    'node.icon.loading.color': '--tree-node-icon-loading-color',
    'node.indent.line.color': '--tree-node-indent-line-color',
    'node.draggable.border.width': '--tree-node-draggable-border-width',
    'node.draggable.border.style': '--tree-node-draggable-border-style',
    'node.draggable.border.color': '--tree-node-draggable-border-color',
    'node.drag.indicator.color': '--tree-node-drag-indicator-color',
    'node.drag.inside.background.color': '--tree-node-drag-inside-background-color',
    'node.drag.inside.border.color': '--tree-node-drag-inside-border-color',
    'node.disabled.color': '--tree-node-disabled-color',
    'node.disabled.background.color': '--tree-node-disabled-background-color'
});

const token = defineTokens({
    'indent': {
        'size': `var(${vars['indent.size']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)))`
    },
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
    },
    'node': {
        'hover': {
            'background': {
                'color': `var(${vars['node.hover.background.color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
            }
        },
        'select': {
            'background': {
                'color': `var(${vars['node.select.background.color']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
            },
            'indicator': {
                'color': `var(${vars['node.select.indicator.color']}, var(--token-semantic-color-fill-active, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
                'width': `var(${vars['node.select.indicator.width']}, 3px)`
            }
        },
        'expand': {
            'icon': {
                'color': `var(${vars['node.expand.icon.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
            }
        },
        'icon': {
            'hover': {
                'background': {
                    'color': `var(${vars['node.icon.hover.background.color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
                }
            },
            'loading': {
                'color': `var(${vars['node.icon.loading.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
            }
        },
        'indent': {
            'line': {
                'color': `var(${vars['node.indent.line.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
            }
        },
        'draggable': {
            'border': {
                'width': `var(${vars['node.draggable.border.width']}, 1px)`,
                'style': `var(${vars['node.draggable.border.style']}, solid)`,
                'color': `var(${vars['node.draggable.border.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
            }
        },
        'drag': {
            'indicator': {
                'color': `var(${vars['node.drag.indicator.color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`
            },
            'inside': {
                'background': {
                    'color': `var(${vars['node.drag.inside.background.color']}, var(--token-semantic-color-feedback-info-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`
                },
                'border': {
                    'color': `var(${vars['node.drag.inside.border.color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`
                }
            }
        },
        'disabled': {
            'color': `var(${vars['node.disabled.color']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
            'background': {
                'color': `var(${vars['node.disabled.background.color']}, transparent)`
            }
        }
    }
});

export default token;
