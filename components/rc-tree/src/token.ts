/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'indent.size': '--tree-indent-size',
    'border.radius': '--tree-border-radius',
    'node.draggable.border.width': '--tree-node-draggable-border-width',
    'node.draggable.border.style': '--tree-node-draggable-border-style',
    'node.draggable.border.color': '--tree-node-draggable-border-color',
    'node.icon.hover.background.color': '--tree-node-icon-hover-background-color',
    'node.icon.loading.color': '--tree-node-icon-loading-color',
    'node.hover.background.color': '--tree-node-hover-background-color',
    'node.select.background.color': '--tree-node-select-background-color'
};

const token = {
    'indent': {
        'size': `var(${vars['indent.size']}, var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`
    },
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
    },
    'node': {
        'draggable': {
            'border': {
                'width': `var(${vars['node.draggable.border.width']}, 1px)`,
                'style': `var(${vars['node.draggable.border.style']}, solid)`,
                'color': `var(${vars['node.draggable.border.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
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
        'hover': {
            'background': {
                'color': `var(${vars['node.hover.background.color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
            }
        },
        'select': {
            'background': {
                'color': `var(${vars['node.select.background.color']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
            }
        }
    }
};

export default token;
