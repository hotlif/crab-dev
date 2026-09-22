/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.font-weight': '--tabs-root-font-weight',
    'root.line-height': '--tabs-root-line-height',
    'bar.gap': '--tabs-bar-gap',
    'bar.border-color': '--tabs-bar-border-color',
    'content.padding-top': '--tabs-content-padding-top',
    'size.small.height': '--tabs-size-small-height',
    'size.small.font-size': '--tabs-size-small-font-size',
    'size.small.padding-inline': '--tabs-size-small-padding-inline',
    'size.medium.height': '--tabs-size-medium-height',
    'size.medium.font-size': '--tabs-size-medium-font-size',
    'size.medium.padding-inline': '--tabs-size-medium-padding-inline',
    'size.large.height': '--tabs-size-large-height',
    'size.large.font-size': '--tabs-size-large-font-size',
    'size.large.padding-inline': '--tabs-size-large-padding-inline',
    'item.color': '--tabs-item-color',
    'item.color-hover': '--tabs-item-color-hover',
    'item.color-active': '--tabs-item-color-active',
    'item.color-disabled': '--tabs-item-color-disabled',
    'item.opacity-disabled': '--tabs-item-opacity-disabled',
    'item.icon.gap': '--tabs-item-icon-gap',
    'state-layer.opacity-hover': '--tabs-state-layer-opacity-hover',
    'state-layer.opacity-focus': '--tabs-state-layer-opacity-focus',
    'state-layer.opacity-pressed': '--tabs-state-layer-opacity-pressed',
    'state-layer.transition': '--tabs-state-layer-transition',
    'indicator.height': '--tabs-indicator-height',
    'indicator.min-width': '--tabs-indicator-min-width',
    'indicator.color': '--tabs-indicator-color',
    'indicator.transition': '--tabs-indicator-transition',
    'indicator.border-radius': '--tabs-indicator-border-radius',
    'card.background-color': '--tabs-card-background-color',
    'card.background-color-hover': '--tabs-card-background-color-hover',
    'card.background-color-active': '--tabs-card-background-color-active',
    'card.border-color': '--tabs-card-border-color',
    'card.border-radius': '--tabs-card-border-radius',
    'pill.background-color-hover': '--tabs-pill-background-color-hover',
    'pill.background-color-active': '--tabs-pill-background-color-active',
    'pill.color-active': '--tabs-pill-color-active',
    'pill.border-radius': '--tabs-pill-border-radius',
    'close.color': '--tabs-close-color',
    'close.color-hover': '--tabs-close-color-hover',
    'close.width': '--tabs-close-width',
    'close.touch-size': '--tabs-close-touch-size',
    'close.gap': '--tabs-close-gap',
    'close.border-radius': '--tabs-close-border-radius',
    'close.background-color-hover': '--tabs-close-background-color-hover',
    'close.outline-color-focus': '--tabs-close-outline-color-focus',
    'close.outline-width-focus': '--tabs-close-outline-width-focus',
    'close.outline-offset-focus': '--tabs-close-outline-offset-focus',
    'tab.outline-color-focus': '--tabs-tab-outline-color-focus',
    'tab.outline-width-focus': '--tabs-tab-outline-width-focus',
    'tab.outline-offset-focus': '--tabs-tab-outline-offset-focus',
    'motion.color': '--tabs-motion-color',
    'interaction.touch.min-width': '--tabs-interaction-touch-min-width',
    'interaction.touch.min-height': '--tabs-interaction-touch-min-height',
    'interaction.outline-color-focus': '--tabs-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--tabs-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--tabs-interaction-outline-offset-focus',
    'interaction.transition': '--tabs-interaction-transition'
});

const token = defineTokens({
    'root': {
        'font-weight': `var(${vars['root.font-weight']}, var(--tabs-font-weight, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500))))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-title-small-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`
    },
    'bar': {
        'gap': `var(${vars['bar.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'border-color': `var(${vars['bar.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`
    },
    'content': {
        'padding-top': `var(${vars['content.padding-top']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'size': {
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.small.padding-inline']}, var(--tabs-size-small-padding-x, 12px))`
        },
        'medium': {
            'height': `var(${vars['size.medium.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`,
            'font-size': `var(${vars['size.medium.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.medium.padding-inline']}, var(--tabs-size-medium-padding-x, 16px))`
        },
        'large': {
            'height': `var(${vars['size.large.height']}, var(--token-semantic-size-64, var(--token-global-size-64, 64px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'padding-inline': `var(${vars['size.large.padding-inline']}, var(--tabs-size-large-padding-x, 20px))`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-active': `var(${vars['item.color-active']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'opacity-disabled': `var(${vars['item.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'icon': {
            'gap': `var(${vars['item.icon.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        }
    },
    'state-layer': {
        'opacity-hover': `var(${vars['state-layer.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
        'opacity-focus': `var(${vars['state-layer.opacity-focus']}, var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)))`,
        'opacity-pressed': `var(${vars['state-layer.opacity-pressed']}, var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)))`,
        'transition': `var(${vars['state-layer.transition']}, opacity var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    },
    'indicator': {
        'height': `var(${vars['indicator.height']}, 3px)`,
        'min-width': `var(${vars['indicator.min-width']}, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px)))`,
        'color': `var(${vars['indicator.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'transition': `var(${vars['indicator.transition']}, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), width var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`,
        'border-radius': `var(${vars['indicator.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
    },
    'card': {
        'background-color': `var(${vars['card.background-color']}, var(--tabs-card-background, transparent))`,
        'background-color-hover': `var(${vars['card.background-color-hover']}, var(--tabs-card-background-hover, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
        'background-color-active': `var(${vars['card.background-color-active']}, var(--tabs-card-background-active, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-color': `var(${vars['card.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`,
        'border-radius': `var(${vars['card.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`
    },
    'pill': {
        'background-color-hover': `var(${vars['pill.background-color-hover']}, var(--tabs-pill-background-hover, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
        'background-color-active': `var(${vars['pill.background-color-active']}, var(--tabs-pill-background-active, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047)))))`,
        'color-active': `var(${vars['pill.color-active']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'border-radius': `var(${vars['pill.border-radius']}, var(--token-semantic-radius-pill, var(--token-global-radius-full, 9999px)))`
    },
    'close': {
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'width': `var(${vars['close.width']}, var(--tabs-close-size, 16px))`,
        'touch-size': `var(${vars['close.touch-size']}, var(--token-semantic-size-32, var(--token-global-size-32, 32px)))`,
        'gap': `var(${vars['close.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'border-radius': `var(${vars['close.border-radius']}, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px)))`,
        'background-color-hover': `var(${vars['close.background-color-hover']}, var(--tabs-close-background-hover, var(--token-semantic-color-state-pressed, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`,
        'outline-color-focus': `var(${vars['close.outline-color-focus']}, var(--tabs-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`,
        'outline-width-focus': `var(${vars['close.outline-width-focus']}, var(--tabs-focus-ring-width, 2px))`,
        'outline-offset-focus': `var(${vars['close.outline-offset-focus']}, 1px)`
    },
    'tab': {
        'outline-color-focus': `var(${vars['tab.outline-color-focus']}, var(--tabs-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`,
        'outline-width-focus': `var(${vars['tab.outline-width-focus']}, var(--tabs-focus-ring-width, 2px))`,
        'outline-offset-focus': `var(${vars['tab.outline-offset-focus']}, var(--tabs-focus-ring-offset, -2px))`
    },
    'motion': {
        'color': `var(${vars['motion.color']}, color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
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
