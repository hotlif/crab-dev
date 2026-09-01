/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--radio-transition',
    'label.gap': '--radio-label-gap',
    'label.color': '--radio-label-color',
    'label.color-disabled': '--radio-label-color-disabled',
    'group.gap': '--radio-group-gap',
    'size.large.box.size': '--radio-size-large-box-size',
    'size.large.dot.size': '--radio-size-large-dot-size',
    'size.large.label.font.size': '--radio-size-large-label-font-size',
    'size.middle.box.size': '--radio-size-middle-box-size',
    'size.middle.dot.size': '--radio-size-middle-dot-size',
    'size.middle.label.font.size': '--radio-size-middle-label-font-size',
    'size.small.box.size': '--radio-size-small-box-size',
    'size.small.dot.size': '--radio-size-small-dot-size',
    'size.small.label.font.size': '--radio-size-small-label-font-size',
    'border.width': '--radio-border-width',
    'border.style': '--radio-border-style',
    'border.color': '--radio-border-color',
    'border.color-hover': '--radio-border-color-hover',
    'background.color': '--radio-background-color',
    'checked.background.color': '--radio-checked-background-color',
    'checked.background.color-hover': '--radio-checked-background-color-hover',
    'checked.border.color': '--radio-checked-border-color',
    'checked.dot.color': '--radio-checked-dot-color',
    'disabled.background.color': '--radio-disabled-background-color',
    'disabled.border.color': '--radio-disabled-border-color',
    'disabled.dot.color': '--radio-disabled-dot-color'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'size': {
        'large': {
            'box': {
                'size': `var(${vars['size.large.box.size']}, 20px)`
            },
            'dot': {
                'size': `var(${vars['size.large.dot.size']}, 10px)`
            },
            'label': {
                'font': {
                    'size': `var(${vars['size.large.label.font.size']}, var(--token-semantic-font-size-heading, var(--token-global-font-size-lg, 18px)))`
                }
            }
        },
        'middle': {
            'box': {
                'size': `var(${vars['size.middle.box.size']}, 16px)`
            },
            'dot': {
                'size': `var(${vars['size.middle.dot.size']}, 8px)`
            },
            'label': {
                'font': {
                    'size': `var(${vars['size.middle.label.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
                }
            }
        },
        'small': {
            'box': {
                'size': `var(${vars['size.small.box.size']}, 14px)`
            },
            'dot': {
                'size': `var(${vars['size.small.dot.size']}, 6px)`
            },
            'label': {
                'font': {
                    'size': `var(${vars['size.small.label.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
                }
            }
        }
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
        'dot': {
            'color': `var(${vars['checked.dot.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`
        }
    },
    'disabled': {
        'background': {
            'color': `var(${vars['disabled.background.color']}, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
        },
        'border': {
            'color': `var(${vars['disabled.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'dot': {
            'color': `var(${vars['disabled.dot.color']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
        }
    }
});

export default token;
