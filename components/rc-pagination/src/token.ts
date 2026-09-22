/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.gap': '--pagination-root-gap',
    'root.font-size': '--pagination-root-font-size',
    'root.font-weight': '--pagination-root-font-weight',
    'root.outline-color-focus': '--pagination-root-outline-color-focus',
    'root.outline-offset-focus': '--pagination-root-outline-offset-focus',
    'root.outline-width-focus': '--pagination-root-outline-width-focus',
    'root.transition': '--pagination-root-transition',
    'group.gap': '--pagination-group-gap',
    'size.medium.height': '--pagination-size-medium-height',
    'size.medium.min-width': '--pagination-size-medium-min-width',
    'size.medium.padding': '--pagination-size-medium-padding',
    'size.medium.font-size': '--pagination-size-medium-font-size',
    'size.small.height': '--pagination-size-small-height',
    'size.small.min-width': '--pagination-size-small-min-width',
    'size.small.padding': '--pagination-size-small-padding',
    'size.small.font-size': '--pagination-size-small-font-size',
    'item.color': '--pagination-item-color',
    'item.color-hover': '--pagination-item-color-hover',
    'item.color-active': '--pagination-item-color-active',
    'item.color-disabled': '--pagination-item-color-disabled',
    'item.background-color': '--pagination-item-background-color',
    'item.background-color-hover': '--pagination-item-background-color-hover',
    'item.background-color-active': '--pagination-item-background-color-active',
    'item.border-radius': '--pagination-item-border-radius',
    'ellipsis.color': '--pagination-ellipsis-color',
    'total.color': '--pagination-total-color',
    'quick-jumper.gap': '--pagination-quick-jumper-gap',
    'quick-jumper.input.width': '--pagination-quick-jumper-input-width',
    'quick-jumper.input.padding': '--pagination-quick-jumper-input-padding',
    'input.color': '--pagination-input-color',
    'input.color-disabled': '--pagination-input-color-disabled',
    'input.background-color': '--pagination-input-background-color',
    'input.border-color': '--pagination-input-border-color',
    'input.border-color-hover': '--pagination-input-border-color-hover',
    'input.border-color-focus': '--pagination-input-border-color-focus',
    'input.border-width': '--pagination-input-border-width',
    'input.border-radius': '--pagination-input-border-radius',
    'interaction.touch.min-width': '--pagination-interaction-touch-min-width',
    'interaction.touch.min-height': '--pagination-interaction-touch-min-height',
    'interaction.outline-color-focus': '--pagination-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--pagination-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--pagination-interaction-outline-offset-focus',
    'interaction.transition': '--pagination-interaction-transition'
});

const token = defineTokens({
    'root': {
        'gap': `var(${vars['root.gap']}, var(--pagination-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`,
        'font-size': `var(${vars['root.font-size']}, var(--pagination-font-size, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px))))`,
        'font-weight': `var(${vars['root.font-weight']}, var(--pagination-font-weight, var(--token-semantic-font-weight-body, var(--token-global-font-weight-regular, 400))))`,
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--pagination-focus-outline-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, var(--pagination-focus-outline-offset, 2px))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, var(--pagination-focus-outline-width, 2px))`,
        'transition': `var(${vars['root.transition']}, var(--pagination-transition, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`
    },
    'group': {
        'gap': `var(${vars['group.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
    },
    'size': {
        'medium': {
            'height': `var(${vars['size.medium.height']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`,
            'min-width': `var(${vars['size.medium.min-width']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`,
            'padding': `var(${vars['size.medium.padding']}, 0 var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['size.medium.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`,
            'min-width': `var(${vars['size.small.min-width']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`,
            'padding': `var(${vars['size.small.padding']}, 0 var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
        }
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-active': `var(${vars['item.color-active']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['item.background-color']}, transparent)`,
        'background-color-hover': `var(${vars['item.background-color-hover']}, var(--token-semantic-color-state-hover, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'background-color-active': `var(${vars['item.background-color-active']}, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047))))`,
        'border-radius': `var(${vars['item.border-radius']}, var(--pagination-item-radius, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px))))`
    },
    'ellipsis': {
        'color': `var(${vars['ellipsis.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
    },
    'total': {
        'color': `var(${vars['total.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
    },
    'quick-jumper': {
        'gap': `var(${vars['quick-jumper.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'input': {
            'width': `var(${vars['quick-jumper.input.width']}, 48px)`,
            'padding': `var(${vars['quick-jumper.input.padding']}, 0 var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'input': {
        'color': `var(${vars['input.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['input.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['input.background-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'border-color': `var(${vars['input.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-hover': `var(${vars['input.border-color-hover']}, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'border-color-focus': `var(${vars['input.border-color-focus']}, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'border-width': `var(${vars['input.border-width']}, 1px)`,
        'border-radius': `var(${vars['input.border-radius']}, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px)))`
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
