/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'track.background-color': '--segmented-track-background-color',
    'track.border-radius': '--segmented-track-border-radius',
    'track.border-color': '--segmented-track-border-color',
    'track.border-color-disabled': '--segmented-track-border-color-disabled',
    'root.font-weight': '--segmented-root-font-weight',
    'root.font-family': '--segmented-root-font-family',
    'root.line-height': '--segmented-root-line-height',
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
    'item.background-color-disabled': '--segmented-item-background-color-disabled',
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
        'background-color': `var(${vars['track.background-color']}, transparent)`,
        'border-radius': `var(${vars['track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'border-color': `var(${vars['track.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-disabled': `var(${vars['track.border-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 12%, transparent))`
    },
    'root': {
        'font-weight': `var(${vars['root.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-label-large-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-label-large-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, var(--token-semantic-sizing-large-control, var(--token-global-size-56, 56px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.large.padding-inline']}, var(--token-semantic-sizing-large-padding, var(--token-global-space-6, 24px)))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.large.track.padding']}, 0px)`
            },
            'border-radius': `var(${vars['size.large.border-radius']}, 0px)`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, var(--token-semantic-sizing-middle-control, var(--token-global-size-40, 40px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.middle.padding-inline']}, var(--token-semantic-sizing-middle-padding, var(--token-global-space-4, 16px)))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.middle.track.padding']}, 0px)`
            },
            'border-radius': `var(${vars['size.middle.border-radius']}, 0px)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-sizing-small-control, var(--token-global-size-32, 32px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.small.padding-inline']}, var(--token-semantic-sizing-small-padding, var(--token-global-space-3, 12px)))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'track': {
                'padding': `var(${vars['size.small.track.padding']}, 0px)`
            },
            'border-radius': `var(${vars['size.small.border-radius']}, 0px)`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-selected': `var(${vars['item.color-selected']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--segmented-root-opacity-disabled, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38))) * 100%), transparent))`,
        'background-color-disabled': `var(${vars['item.background-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 12%, transparent))`,
        'outline-color-focus': `var(${vars['item.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['item.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['item.outline-offset-focus']}, -2px)`,
        'transition': `var(${vars['item.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
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
        'background-color': `var(${vars['thumb.background-color']}, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047))))`,
        'box-shadow': `var(${vars['thumb.box-shadow']}, none)`,
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
