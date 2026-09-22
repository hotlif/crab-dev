/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'track.background-color': '--segmented-track-background-color',
    'track.border-radius': '--segmented-track-border-radius',
    'track.border-color': '--segmented-track-border-color',
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
    'item.state-layer.opacity-hover': '--segmented-item-state-layer-opacity-hover',
    'item.state-layer.opacity-focus': '--segmented-item-state-layer-opacity-focus',
    'item.state-layer.opacity-active': '--segmented-item-state-layer-opacity-active',
    'item.icon.width': '--segmented-item-icon-width',
    'thumb.background-color': '--segmented-thumb-background-color',
    'thumb.box-shadow': '--segmented-thumb-box-shadow',
    'thumb.transition': '--segmented-thumb-transition',
    'interaction.touch.min-width': '--segmented-interaction-touch-min-width',
    'interaction.touch.min-height': '--segmented-interaction-touch-min-height',
    'interaction.outline-color-focus': '--segmented-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--segmented-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--segmented-interaction-outline-offset-focus',
    'interaction.transition': '--segmented-interaction-transition'
});

const token = defineTokens({
    'track': {
        'background-color': `var(${vars['track.background-color']}, var(--segmented-track-background, transparent))`,
        'border-radius': `var(${vars['track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'border-color': `var(${vars['track.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
    },
    'root': {
        'font-weight': `var(${vars['root.font-weight']}, var(--segmented-font-weight, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--segmented-opacity-disabled, var(--segmented-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, var(--token-semantic-size-control, var(--token-global-size-40, 40px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.large.padding-inline']}, var(--segmented-size-large-padding-x, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px))))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.large.track.padding']}, var(--segmented-size-large-track-pad, 0px))`
            },
            'border-radius': `var(${vars['size.large.border-radius']}, var(--segmented-size-large-radius, 0px))`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, var(--token-semantic-size-control, var(--token-global-size-40, 40px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.middle.padding-inline']}, var(--segmented-size-middle-padding-x, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px))))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.middle.track.padding']}, var(--segmented-size-middle-track-pad, 0px))`
            },
            'border-radius': `var(${vars['size.middle.border-radius']}, var(--segmented-size-middle-radius, 0px))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-size-control, var(--token-global-size-40, 40px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.small.padding-inline']}, var(--segmented-size-small-padding-x, var(--token-semantic-space-control-padding-x, var(--token-global-space-3, 12px))))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.small.track.padding']}, var(--segmented-size-small-track-pad, 0px))`
            },
            'border-radius': `var(${vars['size.small.border-radius']}, var(--segmented-size-small-radius, 0px))`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-selected': `var(${vars['item.color-selected']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'outline-color-focus': `var(${vars['item.outline-color-focus']}, var(--segmented-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`,
        'outline-width-focus': `var(${vars['item.outline-width-focus']}, var(--segmented-focus-ring-width, 2px))`,
        'outline-offset-focus': `var(${vars['item.outline-offset-focus']}, var(--segmented-focus-ring-offset, -2px))`,
        'transition': `var(${vars['item.transition']}, var(--segmented-motion-item, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`,
        'state-layer': {
            'opacity-hover': `var(${vars['item.state-layer.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
            'opacity-focus': `var(${vars['item.state-layer.opacity-focus']}, var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)))`,
            'opacity-active': `var(${vars['item.state-layer.opacity-active']}, var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)))`
        },
        'icon': {
            'width': `var(${vars['item.icon.width']}, 18px)`
        }
    },
    'thumb': {
        'background-color': `var(${vars['thumb.background-color']}, var(--segmented-thumb-background, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047)))))`,
        'box-shadow': `var(${vars['thumb.box-shadow']}, var(--segmented-thumb-shadow, none))`,
        'transition': `var(${vars['thumb.transition']}, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), width var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
    },
    'interaction': {
        'touch': {
            'min-width': `var(${vars['interaction.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['interaction.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['interaction.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['interaction.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['interaction.outline-offset-focus']}, 2px)`,
        'transition': `var(${vars['interaction.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    }
});

export default token;
