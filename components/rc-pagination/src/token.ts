/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'gap': '--pagination-gap',
    'group.gap': '--pagination-group-gap',
    'font.size': '--pagination-font-size',
    'font.weight': '--pagination-font-weight',
    'size.medium.height': '--pagination-size-medium-height',
    'size.medium.min-width': '--pagination-size-medium-min-width',
    'size.medium.padding': '--pagination-size-medium-padding',
    'size.medium.font.size': '--pagination-size-medium-font-size',
    'size.small.height': '--pagination-size-small-height',
    'size.small.min-width': '--pagination-size-small-min-width',
    'size.small.padding': '--pagination-size-small-padding',
    'size.small.font.size': '--pagination-size-small-font-size',
    'item.color': '--pagination-item-color',
    'item.color-hover': '--pagination-item-color-hover',
    'item.color-active': '--pagination-item-color-active',
    'item.color-disabled': '--pagination-item-color-disabled',
    'item.background.color': '--pagination-item-background-color',
    'item.background.color-hover': '--pagination-item-background-color-hover',
    'item.background.color-active': '--pagination-item-background-color-active',
    'item.radius': '--pagination-item-radius',
    'ellipsis.color': '--pagination-ellipsis-color',
    'total.color': '--pagination-total-color',
    'quick-jumper.gap': '--pagination-quick-jumper-gap',
    'quick-jumper.input.width': '--pagination-quick-jumper-input-width',
    'quick-jumper.input.padding': '--pagination-quick-jumper-input-padding',
    'input.color': '--pagination-input-color',
    'input.color-disabled': '--pagination-input-color-disabled',
    'input.background.color': '--pagination-input-background-color',
    'input.border.color': '--pagination-input-border-color',
    'input.border.color-hover': '--pagination-input-border-color-hover',
    'input.border.color-focus': '--pagination-input-border-color-focus',
    'input.border.width': '--pagination-input-border-width',
    'input.border.radius': '--pagination-input-border-radius',
    'focus.outline.color': '--pagination-focus-outline-color',
    'focus.outline.offset': '--pagination-focus-outline-offset',
    'focus.outline.width': '--pagination-focus-outline-width',
    'transition': '--pagination-transition'
});

const token = defineTokens({
    'gap': `var(${vars['gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'font': {
        'size': `var(${vars['font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'weight': `var(${vars['font.weight']}, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400)))`
    },
    'size': {
        'medium': {
            'height': `var(${vars['size.medium.height']}, 32px)`,
            'min-width': `var(${vars['size.medium.min-width']}, 32px)`,
            'padding': `var(${vars['size.medium.padding']}, 0 var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font': {
                'size': `var(${vars['size.medium.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
            }
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 28px)`,
            'min-width': `var(${vars['size.small.min-width']}, 28px)`,
            'padding': `var(${vars['size.small.padding']}, 0 var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'font': {
                'size': `var(${vars['size.small.font.size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
            }
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-active': `var(${vars['item.color-active']}, var(--token-semantic-color-text-on-brand, var(--token-global-zinc-50, oklch(0.980 0.002 286))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'background': {
            'color': `var(${vars['item.background.color']}, transparent)`,
            'color-hover': `var(${vars['item.background.color-hover']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
            'color-active': `var(${vars['item.background.color-active']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        },
        'radius': `var(${vars['item.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
    },
    'ellipsis': {
        'color': `var(${vars['ellipsis.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-zinc-400, oklch(0.760 0.012 286))))`
    },
    'total': {
        'color': `var(${vars['total.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'quick-jumper': {
        'gap': `var(${vars['quick-jumper.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'input': {
            'width': `var(${vars['quick-jumper.input.width']}, 48px)`,
            'padding': `var(${vars['quick-jumper.input.padding']}, 0 var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'input': {
        'color': `var(${vars['input.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['input.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
        'background': {
            'color': `var(${vars['input.background.color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        },
        'border': {
            'color': `var(${vars['input.border.color']}, var(--token-semantic-color-border-default, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
            'color-hover': `var(${vars['input.border.color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`,
            'color-focus': `var(${vars['input.border.color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'width': `var(${vars['input.border.width']}, 1px)`,
            'radius': `var(${vars['input.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
        }
    },
    'focus': {
        'outline': {
            'color': `var(${vars['focus.outline.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'offset': `var(${vars['focus.outline.offset']}, 2px)`,
            'width': `var(${vars['focus.outline.width']}, 2px)`
        }
    },
    'transition': `var(${vars['transition']}, background-color 120ms cubic-bezier(0.4, 0, 0.2, 1), color 120ms cubic-bezier(0.4, 0, 0.2, 1), border-color 120ms cubic-bezier(0.4, 0, 0.2, 1))`
});

export default token;
