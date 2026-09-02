/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'control.transition': '--radio-control-transition',
    'control.border-width': '--radio-control-border-width',
    'control.border-style': '--radio-control-border-style',
    'control.border-color': '--radio-control-border-color',
    'control.border-color-hover': '--radio-control-border-color-hover',
    'control.background-color': '--radio-control-background-color',
    'control.checked.background-color': '--radio-control-checked-background-color',
    'control.checked.background-color-hover': '--radio-control-checked-background-color-hover',
    'control.checked.border-color': '--radio-control-checked-border-color',
    'control.background-color-disabled': '--radio-control-background-color-disabled',
    'control.border-color-disabled': '--radio-control-border-color-disabled',
    'label.gap': '--radio-label-gap',
    'label.color': '--radio-label-color',
    'label.color-disabled': '--radio-label-color-disabled',
    'group.gap': '--radio-group-gap',
    'size.large.box.width': '--radio-size-large-box-width',
    'size.large.dot.width': '--radio-size-large-dot-width',
    'size.large.label.font-size': '--radio-size-large-label-font-size',
    'size.middle.box.width': '--radio-size-middle-box-width',
    'size.middle.dot.width': '--radio-size-middle-dot-width',
    'size.middle.label.font-size': '--radio-size-middle-label-font-size',
    'size.small.box.width': '--radio-size-small-box-width',
    'size.small.dot.width': '--radio-size-small-dot-width',
    'size.small.label.font-size': '--radio-size-small-label-font-size',
    'dot.checked.color': '--radio-dot-checked-color',
    'dot.color-disabled': '--radio-dot-color-disabled'
});

const token = defineTokens({
    'control': {
        'transition': `var(${vars['control.transition']}, var(--radio-root-transition, var(--radio-transition, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1))))`,
        'border-width': `var(${vars['control.border-width']}, var(--radio-root-border-width, var(--radio-border-width, 1px)))`,
        'border-style': `var(${vars['control.border-style']}, var(--radio-root-border-style, var(--radio-border-style, solid)))`,
        'border-color': `var(${vars['control.border-color']}, var(--radio-root-border-color, var(--radio-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286))))))`,
        'border-color-hover': `var(${vars['control.border-color-hover']}, var(--radio-root-border-color-hover, var(--radio-border-color-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-600, oklch(0.550 0.014 286))))))`,
        'background-color': `var(${vars['control.background-color']}, var(--radio-root-background-color, var(--radio-background-color, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))))`,
        'checked': {
            'background-color': `var(${vars['control.checked.background-color']}, var(--radio-root-background-color-checked, var(--radio-background-color-checked, var(--radio-checked-background-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`,
            'background-color-hover': `var(${vars['control.checked.background-color-hover']}, var(--radio-root-background-color-hover-checked, var(--radio-background-color-hover-checked, var(--radio-checked-background-color-hover, var(--token-semantic-color-brand-primary-hover, var(--token-global-zinc-800, oklch(0.320 0.008 286)))))))`,
            'border-color': `var(${vars['control.checked.border-color']}, var(--radio-root-border-color-checked, var(--radio-border-color-checked, var(--radio-checked-border-color, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286)))))))`
        },
        'background-color-disabled': `var(${vars['control.background-color-disabled']}, var(--radio-root-background-color-disabled, var(--radio-background-color-disabled, var(--radio-disabled-background-color, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))))`,
        'border-color-disabled': `var(${vars['control.border-color-disabled']}, var(--radio-root-border-color-disabled, var(--radio-border-color-disabled, var(--radio-disabled-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))))`
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
                'width': `var(${vars['size.large.box.width']}, var(--radio-size-large-box-size, 20px))`
            },
            'dot': {
                'width': `var(${vars['size.large.dot.width']}, var(--radio-size-large-dot-size, 10px))`
            },
            'label': {
                'font-size': `var(${vars['size.large.label.font-size']}, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px)))`
            }
        },
        'middle': {
            'box': {
                'width': `var(${vars['size.middle.box.width']}, var(--radio-size-middle-box-size, 16px))`
            },
            'dot': {
                'width': `var(${vars['size.middle.dot.width']}, var(--radio-size-middle-dot-size, 8px))`
            },
            'label': {
                'font-size': `var(${vars['size.middle.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        },
        'small': {
            'box': {
                'width': `var(${vars['size.small.box.width']}, var(--radio-size-small-box-size, 14px))`
            },
            'dot': {
                'width': `var(${vars['size.small.dot.width']}, var(--radio-size-small-dot-size, 6px))`
            },
            'label': {
                'font-size': `var(${vars['size.small.label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        }
    },
    'dot': {
        'checked': {
            'color': `var(${vars['dot.checked.color']}, var(--radio-dot-color-checked, var(--radio-checked-dot-color, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))))`
        },
        'color-disabled': `var(${vars['dot.color-disabled']}, var(--radio-disabled-dot-color, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286)))))`
    }
});

export default token;
