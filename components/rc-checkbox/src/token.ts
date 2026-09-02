/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'control.transition': '--checkbox-control-transition',
    'control.border-width': '--checkbox-control-border-width',
    'control.border-style': '--checkbox-control-border-style',
    'control.border-color': '--checkbox-control-border-color',
    'control.border-color-hover': '--checkbox-control-border-color-hover',
    'control.background-color': '--checkbox-control-background-color',
    'control.checked.background-color': '--checkbox-control-checked-background-color',
    'control.checked.background-color-hover': '--checkbox-control-checked-background-color-hover',
    'control.checked.border-color': '--checkbox-control-checked-border-color',
    'control.indeterminate.background-color': '--checkbox-control-indeterminate-background-color',
    'control.indeterminate.border-color': '--checkbox-control-indeterminate-border-color',
    'control.background-color-disabled': '--checkbox-control-background-color-disabled',
    'control.border-color-disabled': '--checkbox-control-border-color-disabled',
    'label.gap': '--checkbox-label-gap',
    'label.color': '--checkbox-label-color',
    'label.color-disabled': '--checkbox-label-color-disabled',
    'group.gap': '--checkbox-group-gap',
    'size.large.box.width': '--checkbox-size-large-box-width',
    'size.large.box.border-radius': '--checkbox-size-large-box-border-radius',
    'size.large.icon.width': '--checkbox-size-large-icon-width',
    'size.large.label.font-size': '--checkbox-size-large-label-font-size',
    'size.large.indeterminate.width': '--checkbox-size-large-indeterminate-width',
    'size.large.indeterminate.height': '--checkbox-size-large-indeterminate-height',
    'size.middle.box.width': '--checkbox-size-middle-box-width',
    'size.middle.box.border-radius': '--checkbox-size-middle-box-border-radius',
    'size.middle.icon.width': '--checkbox-size-middle-icon-width',
    'size.middle.label.font-size': '--checkbox-size-middle-label-font-size',
    'size.middle.indeterminate.width': '--checkbox-size-middle-indeterminate-width',
    'size.middle.indeterminate.height': '--checkbox-size-middle-indeterminate-height',
    'size.small.box.width': '--checkbox-size-small-box-width',
    'size.small.box.border-radius': '--checkbox-size-small-box-border-radius',
    'size.small.icon.width': '--checkbox-size-small-icon-width',
    'size.small.label.font-size': '--checkbox-size-small-label-font-size',
    'size.small.indeterminate.width': '--checkbox-size-small-indeterminate-width',
    'size.small.indeterminate.height': '--checkbox-size-small-indeterminate-height',
    'icon.checked.color': '--checkbox-icon-checked-color',
    'icon.indeterminate.color': '--checkbox-icon-indeterminate-color',
    'icon.color-disabled': '--checkbox-icon-color-disabled'
});

const token = defineTokens({
    'control': {
        'transition': `var(${vars['control.transition']}, var(--checkbox-root-transition, var(--checkbox-transition, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1))))`,
        'border-width': `var(${vars['control.border-width']}, var(--checkbox-root-border-width, var(--checkbox-border-width, 1px)))`,
        'border-style': `var(${vars['control.border-style']}, var(--checkbox-root-border-style, var(--checkbox-border-style, solid)))`,
        'border-color': `var(${vars['control.border-color']}, var(--checkbox-root-border-color, var(--checkbox-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))))))`,
        'border-color-hover': `var(${vars['control.border-color-hover']}, var(--checkbox-root-border-color-hover, var(--checkbox-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-600, oklch(0.550 0.014 286))))))`,
        'background-color': `var(${vars['control.background-color']}, var(--checkbox-root-background-color, var(--checkbox-background-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))))`,
        'checked': {
            'background-color': `var(${vars['control.checked.background-color']}, var(--checkbox-root-background-color-checked, var(--checkbox-background-color-checked, var(--checkbox-checked-background-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`,
            'background-color-hover': `var(${vars['control.checked.background-color-hover']}, var(--checkbox-root-background-color-hover-checked, var(--checkbox-background-color-hover-checked, var(--checkbox-checked-background-color-hover, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286)))))))`,
            'border-color': `var(${vars['control.checked.border-color']}, var(--checkbox-root-border-color-checked, var(--checkbox-border-color-checked, var(--checkbox-checked-border-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`
        },
        'indeterminate': {
            'background-color': `var(${vars['control.indeterminate.background-color']}, var(--checkbox-root-background-color-indeterminate, var(--checkbox-background-color-indeterminate, var(--checkbox-indeterminate-background-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`,
            'border-color': `var(${vars['control.indeterminate.border-color']}, var(--checkbox-root-border-color-indeterminate, var(--checkbox-border-color-indeterminate, var(--checkbox-indeterminate-border-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`
        },
        'background-color-disabled': `var(${vars['control.background-color-disabled']}, var(--checkbox-root-background-color-disabled, var(--checkbox-background-color-disabled, var(--checkbox-disabled-background-color, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))))`,
        'border-color-disabled': `var(${vars['control.border-color-disabled']}, var(--checkbox-root-border-color-disabled, var(--checkbox-border-color-disabled, var(--checkbox-disabled-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))))`
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'size': {
        'large': {
            'box': {
                'width': `var(${vars['size.large.box.width']}, var(--checkbox-size-large-box-size, 20px))`,
                'border-radius': `var(${vars['size.large.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.large.icon.width']}, var(--checkbox-size-large-icon-size, 14px))`
            },
            'label': {
                'font-size': `var(${vars['size.large.label.font-size']}, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.large.indeterminate.width']}, 10px)`,
                'height': `var(${vars['size.large.indeterminate.height']}, 2px)`
            }
        },
        'middle': {
            'box': {
                'width': `var(${vars['size.middle.box.width']}, var(--checkbox-size-middle-box-size, 16px))`,
                'border-radius': `var(${vars['size.middle.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.middle.icon.width']}, var(--checkbox-size-middle-icon-size, 12px))`
            },
            'label': {
                'font-size': `var(${vars['size.middle.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.middle.indeterminate.width']}, 8px)`,
                'height': `var(${vars['size.middle.indeterminate.height']}, 2px)`
            }
        },
        'small': {
            'box': {
                'width': `var(${vars['size.small.box.width']}, var(--checkbox-size-small-box-size, 14px))`,
                'border-radius': `var(${vars['size.small.box.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
            },
            'icon': {
                'width': `var(${vars['size.small.icon.width']}, var(--checkbox-size-small-icon-size, 10px))`
            },
            'label': {
                'font-size': `var(${vars['size.small.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            },
            'indeterminate': {
                'width': `var(${vars['size.small.indeterminate.width']}, 6px)`,
                'height': `var(${vars['size.small.indeterminate.height']}, 2px)`
            }
        }
    },
    'icon': {
        'checked': {
            'color': `var(${vars['icon.checked.color']}, var(--checkbox-icon-color-checked, var(--checkbox-checked-icon-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))))`
        },
        'indeterminate': {
            'color': `var(${vars['icon.indeterminate.color']}, var(--checkbox-icon-color-indeterminate, var(--checkbox-indeterminate-icon-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))))`
        },
        'color-disabled': `var(${vars['icon.color-disabled']}, var(--checkbox-disabled-icon-color, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`
    }
});

export default token;
