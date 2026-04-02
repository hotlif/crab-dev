/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'transition': '--checkbox-transition',
    'box.size': '--checkbox-box-size',
    'box.border.radius': '--checkbox-box-border-radius',
    'label.gap': '--checkbox-label-gap',
    'label.font.size': '--checkbox-label-font-size',
    'label.color': '--checkbox-label-color',
    'label.color-disabled': '--checkbox-label-color-disabled',
    'group.gap': '--checkbox-group-gap',
    'border.width': '--checkbox-border-width',
    'border.style': '--checkbox-border-style',
    'border.color': '--checkbox-border-color',
    'border.color-hover': '--checkbox-border-color-hover',
    'background.color': '--checkbox-background-color',
    'checked.background.color': '--checkbox-checked-background-color',
    'checked.background.color-hover': '--checkbox-checked-background-color-hover',
    'checked.border.color': '--checkbox-checked-border-color',
    'checked.icon.color': '--checkbox-checked-icon-color',
    'indeterminate.background.color': '--checkbox-indeterminate-background-color',
    'indeterminate.border.color': '--checkbox-indeterminate-border-color',
    'indeterminate.icon.color': '--checkbox-indeterminate-icon-color',
    'disabled.background.color': '--checkbox-disabled-background-color',
    'disabled.border.color': '--checkbox-disabled-border-color',
    'disabled.icon.color': '--checkbox-disabled-icon-color'
};

const token = {
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'box': {
        'size': `var(${vars['box.size']}, 16px)`,
        'border': {
            'radius': `var(${vars['box.border.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
        }
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font': {
            'size': `var(${vars['label.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'border': {
        'width': `var(${vars['border.width']}, 1px)`,
        'style': `var(${vars['border.style']}, solid)`,
        'color': `var(${vars['border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'color-hover': `var(${vars['border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'checked': {
        'background': {
            'color': `var(${vars['checked.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
            'color-hover': `var(${vars['checked.background.color-hover']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286))))`
        },
        'border': {
            'color': `var(${vars['checked.border.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'icon': {
            'color': `var(${vars['checked.icon.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`
        }
    },
    'indeterminate': {
        'background': {
            'color': `var(${vars['indeterminate.background.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'border': {
            'color': `var(${vars['indeterminate.border.color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'icon': {
            'color': `var(${vars['indeterminate.icon.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`
        }
    },
    'disabled': {
        'background': {
            'color': `var(${vars['disabled.background.color']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'border': {
            'color': `var(${vars['disabled.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'icon': {
            'color': `var(${vars['disabled.icon.color']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
        }
    }
};

export default token;
