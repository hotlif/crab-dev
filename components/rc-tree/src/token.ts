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
        'size': `var(${vars['indent.size']}, 24px)`
    },
    'border': {
        'radius': `var(${vars['border.radius']}, 4px)`
    },
    'node': {
        'draggable': {
            'border': {
                'width': `var(${vars['node.draggable.border.width']}, 1px)`,
                'style': `var(${vars['node.draggable.border.style']}, solid)`,
                'color': `var(${vars['node.draggable.border.color']}, #1677ff)`
            }
        },
        'icon': {
            'hover': {
                'background': {
                    'color': `var(${vars['node.icon.hover.background.color']}, rgba(0, 0, 0, 0.06))`
                }
            },
            'loading': {
                'color': `var(${vars['node.icon.loading.color']}, #0088f0)`
            }
        },
        'hover': {
            'background': {
                'color': `var(${vars['node.hover.background.color']}, rgba(0,0,0,0.04))`
            }
        },
        'select': {
            'background': {
                'color': `var(${vars['node.select.background.color']}, #e6f4ff)`
            }
        }
    }
};

export default token;
