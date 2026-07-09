/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'track.background': '--segmented-track-background',
    'track.border.radius': '--segmented-track-border-radius',
    'font.weight': '--segmented-font-weight',
    'size.large.height': '--segmented-size-large-height',
    'size.large.font-size': '--segmented-size-large-font-size',
    'size.large.padding-x': '--segmented-size-large-padding-x',
    'size.large.gap': '--segmented-size-large-gap',
    'size.large.track-pad': '--segmented-size-large-track-pad',
    'size.large.radius': '--segmented-size-large-radius',
    'size.middle.height': '--segmented-size-middle-height',
    'size.middle.font-size': '--segmented-size-middle-font-size',
    'size.middle.padding-x': '--segmented-size-middle-padding-x',
    'size.middle.gap': '--segmented-size-middle-gap',
    'size.middle.track-pad': '--segmented-size-middle-track-pad',
    'size.middle.radius': '--segmented-size-middle-radius',
    'size.small.height': '--segmented-size-small-height',
    'size.small.font-size': '--segmented-size-small-font-size',
    'size.small.padding-x': '--segmented-size-small-padding-x',
    'size.small.gap': '--segmented-size-small-gap',
    'size.small.track-pad': '--segmented-size-small-track-pad',
    'size.small.radius': '--segmented-size-small-radius',
    'item.color': '--segmented-item-color',
    'item.color-hover': '--segmented-item-color-hover',
    'item.color-selected': '--segmented-item-color-selected',
    'item.color-disabled': '--segmented-item-color-disabled',
    'thumb.background': '--segmented-thumb-background',
    'thumb.shadow': '--segmented-thumb-shadow',
    'thumb.transition': '--segmented-thumb-transition',
    'focus.ring.color': '--segmented-focus-ring-color',
    'focus.ring.width': '--segmented-focus-ring-width',
    'focus.ring.offset': '--segmented-focus-ring-offset',
    'disabled.opacity': '--segmented-disabled-opacity',
    'motion.item': '--segmented-motion-item'
};

const token = {
    'track': {
        'background': `var(${vars['track.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'border': {
            'radius': `var(${vars['track.border.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
        }
    },
    'font': {
        'weight': `var(${vars['font.weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, 40px)`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'padding-x': `var(${vars['size.large.padding-x']}, 16px)`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track-pad': `var(${vars['size.large.track-pad']}, 4px)`,
            'radius': `var(${vars['size.large.radius']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, 32px)`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
            'padding-x': `var(${vars['size.middle.padding-x']}, 12px)`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track-pad': `var(${vars['size.middle.track-pad']}, 3px)`,
            'radius': `var(${vars['size.middle.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 24px)`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`,
            'padding-x': `var(${vars['size.small.padding-x']}, 8px)`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'track-pad': `var(${vars['size.small.track-pad']}, 2px)`,
            'radius': `var(${vars['size.small.radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-selected': `var(${vars['item.color-selected']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-300, oklch(0.840 0.008 286))))`
    },
    'thumb': {
        'background': `var(${vars['thumb.background']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'shadow': `var(${vars['thumb.shadow']}, 0 1px 2px 0 oklch(0 0 0 / 0.08), 0 1px 3px 0 oklch(0 0 0 / 0.12))`,
        'transition': `var(${vars['thumb.transition']}, transform 240ms cubic-bezier(0.4, 0, 0.2, 1), width 240ms cubic-bezier(0.4, 0, 0.2, 1))`
    },
    'focus': {
        'ring': {
            'color': `var(${vars['focus.ring.color']}, var(--token-semantic-color-border-focus, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
            'width': `var(${vars['focus.ring.width']}, 2px)`,
            'offset': `var(${vars['focus.ring.offset']}, 2px)`
        }
    },
    'disabled': {
        'opacity': `var(${vars['disabled.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`
    },
    'motion': {
        'item': `var(${vars['motion.item']}, var(--token-semantic-motion-interaction, var(--token-global-duration-fast, 100ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
    }
};

export default token;
