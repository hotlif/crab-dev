/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'selected.background.color': '--date-picker-selected-background-color',
    'selected.text.color': '--date-picker-selected-text-color',
    'cell.background.color-hover': '--date-picker-cell-background-color-hover',
    'cell.text.color-hover': '--date-picker-cell-text-color-hover',
    'cell.padding': '--date-picker-cell-padding',
    'cell.border.radius': '--date-picker-cell-border-radius',
    'cell.content.size': '--date-picker-cell-content-size',
    'cell.font.size': '--date-picker-cell-font-size',
    'cell.font.weight': '--date-picker-cell-font-weight',
    'cell.transition': '--date-picker-cell-transition',
    'header.padding': '--date-picker-header-padding',
    'header.cell.height': '--date-picker-header-cell-height',
    'header.font.size': '--date-picker-header-font-size',
    'header.font.weight': '--date-picker-header-font-weight',
    'action.bar.margin.top': '--date-picker-action-bar-margin-top',
    'action.bar.gap': '--date-picker-action-bar-gap',
    'panel.font.size': '--date-picker-panel-font-size',
    'timezone.font.size': '--date-picker-timezone-font-size',
    'opacity.out-of-range': '--date-picker-opacity-out-of-range',
    'opacity.icon': '--date-picker-opacity-icon',
    'opacity.icon-hover': '--date-picker-opacity-icon-hover',
    'opacity.timezone': '--date-picker-opacity-timezone'
};

const token = {
    'selected': {
        'background': {
            'color': `var(${vars['selected.background.color']}, oklch(0.2855 0.0113 271))`
        },
        'text': {
            'color': `var(${vars['selected.text.color']}, oklch(1 0 0))`
        }
    },
    'cell': {
        'background': {
            'color-hover': `var(${vars['cell.background.color-hover']}, oklch(0.2855 0.0113 271 / 75%))`
        },
        'text': {
            'color-hover': `var(${vars['cell.text.color-hover']}, oklch(1 0 0))`
        },
        'padding': `var(${vars['cell.padding']}, 3px 4px)`,
        'border': {
            'radius': `var(${vars['cell.border.radius']}, 4px)`
        },
        'content': {
            'size': `var(${vars['cell.content.size']}, 24px)`
        },
        'font': {
            'size': `var(${vars['cell.font.size']}, 14px)`,
            'weight': `var(${vars['cell.font.weight']}, 400)`
        },
        'transition': `var(${vars['cell.transition']}, background-color 0.2s, color 0.2s)`
    },
    'header': {
        'padding': `var(${vars['header.padding']}, 16px 8px)`,
        'cell': {
            'height': `var(${vars['header.cell.height']}, 40px)`
        },
        'font': {
            'size': `var(${vars['header.font.size']}, 12px)`,
            'weight': `var(${vars['header.font.weight']}, 400)`
        }
    },
    'action': {
        'bar': {
            'margin': {
                'top': `var(${vars['action.bar.margin.top']}, 0.5rem)`
            },
            'gap': `var(${vars['action.bar.gap']}, 0.5rem)`
        }
    },
    'panel': {
        'font': {
            'size': `var(${vars['panel.font.size']}, 14px)`
        }
    },
    'timezone': {
        'font': {
            'size': `var(${vars['timezone.font.size']}, 10px)`
        }
    },
    'opacity': {
        'out-of-range': `var(${vars['opacity.out-of-range']}, 0.3)`,
        'icon': `var(${vars['opacity.icon']}, 0.5)`,
        'icon-hover': `var(${vars['opacity.icon-hover']}, 0.8)`,
        'timezone': `var(${vars['opacity.timezone']}, 0.6)`
    }
};

export default token;
