/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'track.background-color': '--segmented-track-background-color',
    'track.border-radius': '--segmented-track-border-radius',
    'root.font-weight': '--segmented-root-font-weight',
    'root.opacity-disabled': '--segmented-root-opacity-disabled',
    'size.large.height': '--segmented-size-large-height',
    'size.large.font-size': '--segmented-size-large-font-size',
    'size.large.padding-inline': '--segmented-size-large-padding-inline',
    'size.large.gap': '--segmented-size-large-gap',
    'size.large.track.padding': '--segmented-size-large-track-padding',
    'size.large.border-radius': '--segmented-size-large-border-radius',
    'size.middle.height': '--segmented-size-middle-height',
    'size.middle.font-size': '--segmented-size-middle-font-size',
    'size.middle.padding-inline': '--segmented-size-middle-padding-inline',
    'size.middle.gap': '--segmented-size-middle-gap',
    'size.middle.track.padding': '--segmented-size-middle-track-padding',
    'size.middle.border-radius': '--segmented-size-middle-border-radius',
    'size.small.height': '--segmented-size-small-height',
    'size.small.font-size': '--segmented-size-small-font-size',
    'size.small.padding-inline': '--segmented-size-small-padding-inline',
    'size.small.gap': '--segmented-size-small-gap',
    'size.small.track.padding': '--segmented-size-small-track-padding',
    'size.small.border-radius': '--segmented-size-small-border-radius',
    'item.color': '--segmented-item-color',
    'item.color-hover': '--segmented-item-color-hover',
    'item.color-selected': '--segmented-item-color-selected',
    'item.color-disabled': '--segmented-item-color-disabled',
    'item.outline-color-focus': '--segmented-item-outline-color-focus',
    'item.outline-width-focus': '--segmented-item-outline-width-focus',
    'item.outline-offset-focus': '--segmented-item-outline-offset-focus',
    'item.transition': '--segmented-item-transition',
    'thumb.background-color': '--segmented-thumb-background-color',
    'thumb.box-shadow': '--segmented-thumb-box-shadow',
    'thumb.transition': '--segmented-thumb-transition'
});

const token = defineTokens({
    'track': {
        'background-color': `var(${vars['track.background-color']}, var(--segmented-track-background, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`,
        'border-radius': `var(${vars['track.border-radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
    },
    'root': {
        'font-weight': `var(${vars['root.font-weight']}, var(--segmented-font-weight, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--segmented-opacity-disabled, var(--segmented-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'padding-inline': `var(${vars['size.large.padding-inline']}, var(--segmented-size-large-padding-x, 16px))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track': {
                'padding': `var(${vars['size.large.track.padding']}, var(--segmented-size-large-track-pad, 4px))`
            },
            'border-radius': `var(${vars['size.large.border-radius']}, var(--segmented-size-large-radius, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px))))`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.middle.padding-inline']}, var(--segmented-size-middle-padding-x, 12px))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track': {
                'padding': `var(${vars['size.middle.track.padding']}, var(--segmented-size-middle-track-pad, 3px))`
            },
            'border-radius': `var(${vars['size.middle.border-radius']}, var(--segmented-size-middle-radius, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px))))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'padding-inline': `var(${vars['size.small.padding-inline']}, var(--segmented-size-small-padding-x, 8px))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track': {
                'padding': `var(${vars['size.small.track.padding']}, var(--segmented-size-small-track-pad, 2px))`
            },
            'border-radius': `var(${vars['size.small.border-radius']}, var(--segmented-size-small-radius, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px))))`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-selected': `var(${vars['item.color-selected']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'outline-color-focus': `var(${vars['item.outline-color-focus']}, var(--segmented-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-blue-600, oklch(0.546 0.245 262))))))`,
        'outline-width-focus': `var(${vars['item.outline-width-focus']}, var(--segmented-focus-ring-width, 2px))`,
        'outline-offset-focus': `var(${vars['item.outline-offset-focus']}, var(--segmented-focus-ring-offset, 2px))`,
        'transition': `var(${vars['item.transition']}, var(--segmented-motion-item, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1)))))`
    },
    'thumb': {
        'background-color': `var(${vars['thumb.background-color']}, var(--segmented-thumb-background, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0)))))`,
        'box-shadow': `var(${vars['thumb.box-shadow']}, var(--segmented-thumb-shadow, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1)))))`,
        'transition': `var(${vars['thumb.transition']}, transform 240ms cubic-bezier(0.4, 0, 0.2, 1), width 240ms cubic-bezier(0.4, 0, 0.2, 1))`
    }
});

export default token;
