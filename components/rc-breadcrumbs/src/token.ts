/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.font-size': '--breadcrumbs-root-font-size',
    'root.line-height': '--breadcrumbs-root-line-height',
    'root.gap': '--breadcrumbs-root-gap',
    'item.color': '--breadcrumbs-item-color',
    'item.color-hover': '--breadcrumbs-item-color-hover',
    'item.color-active': '--breadcrumbs-item-color-active',
    'item.color-disabled': '--breadcrumbs-item-color-disabled',
    'separator.color': '--breadcrumbs-separator-color',
    'separator.padding': '--breadcrumbs-separator-padding',
    'ellipsis.color': '--breadcrumbs-ellipsis-color',
    'interaction.touch.min-width': '--breadcrumbs-interaction-touch-min-width',
    'interaction.touch.min-height': '--breadcrumbs-interaction-touch-min-height',
    'interaction.outline-color-focus': '--breadcrumbs-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--breadcrumbs-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--breadcrumbs-interaction-outline-offset-focus',
    'interaction.transition': '--breadcrumbs-interaction-transition'
});

const token = defineTokens({
    'root': {
        'font-size': `var(${vars['root.font-size']}, var(--breadcrumbs-font-size, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px))))`,
        'line-height': `var(${vars['root.line-height']}, var(--breadcrumbs-line-height, var(--token-semantic-typography-label-line-height, var(--token-global-line-height-14-20, 1.4285714285714286))))`,
        'gap': `var(${vars['root.gap']}, var(--breadcrumbs-gap, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px))))`
    },
    'item': {
        'color': `var(${vars['item.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['item.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-active': `var(${vars['item.color-active']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['item.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'separator': {
        'color': `var(${vars['separator.color']}, var(--token-semantic-color-text-disabled, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'padding': `var(${vars['separator.padding']}, 0 4px)`
    },
    'ellipsis': {
        'color': `var(${vars['ellipsis.color']}, var(--token-semantic-color-text-tertiary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
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
