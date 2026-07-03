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
            'color': `var(${vars['selected.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'text': {
            'color': `var(${vars['selected.text.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`
        }
    },
    'cell': {
        'background': {
            'color-hover': `var(${vars['cell.background.color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'text': {
            'color-hover': `var(${vars['cell.text.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
        },
        'padding': `var(${vars['cell.padding']}, 3px 4px)`,
        'border': {
            'radius': `var(${vars['cell.border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
        },
        'content': {
            'size': `var(${vars['cell.content.size']}, 24px)`
        },
        'font': {
            'size': `var(${vars['cell.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'weight': `var(${vars['cell.font.weight']}, 400)`
        },
        'transition': `var(${vars['cell.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
    },
    'header': {
        'padding': `var(${vars['header.padding']}, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px)) var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'cell': {
            'height': `var(${vars['header.cell.height']}, 40px)`
        },
        'font': {
            'size': `var(${vars['header.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'weight': `var(${vars['header.font.weight']}, 400)`
        }
    },
    'action': {
        'bar': {
            'margin': {
                'top': `var(${vars['action.bar.margin.top']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
            },
            'gap': `var(${vars['action.bar.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'panel': {
        'font': {
            'size': `var(${vars['panel.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        }
    },
    'timezone': {
        'font': {
            'size': `var(${vars['timezone.font.size']}, 10px)`
        }
    },
    'opacity': {
        'out-of-range': `var(${vars['opacity.out-of-range']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`,
        'icon': `var(${vars['opacity.icon']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
        'icon-hover': `var(${vars['opacity.icon-hover']}, var(--token-semantic-opacity-hover, var(--token-global-opacity-80, 0.8)))`,
        'timezone': `var(${vars['opacity.timezone']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    }
};

export default token;
