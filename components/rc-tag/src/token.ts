/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--tag-root-transition',
    'root.color-error': '--tag-root-color-error',
    'root.background-color-error': '--tag-root-background-color-error',
    'root.border-color-error': '--tag-root-border-color-error',
    'size.large.height': '--tag-size-large-height',
    'size.large.padding': '--tag-size-large-padding',
    'size.large.border-radius': '--tag-size-large-border-radius',
    'size.large.font-size': '--tag-size-large-font-size',
    'size.large.gap': '--tag-size-large-gap',
    'size.middle.height': '--tag-size-middle-height',
    'size.middle.padding': '--tag-size-middle-padding',
    'size.middle.border-radius': '--tag-size-middle-border-radius',
    'size.middle.font-size': '--tag-size-middle-font-size',
    'size.middle.gap': '--tag-size-middle-gap',
    'size.small.height': '--tag-size-small-height',
    'size.small.padding': '--tag-size-small-padding',
    'size.small.border-radius': '--tag-size-small-border-radius',
    'size.small.font-size': '--tag-size-small-font-size',
    'size.small.gap': '--tag-size-small-gap',
    'default.color': '--tag-default-color',
    'default.background-color': '--tag-default-background-color',
    'default.border-color': '--tag-default-border-color',
    'primary.color': '--tag-primary-color',
    'primary.background-color': '--tag-primary-background-color',
    'primary.border-color': '--tag-primary-border-color',
    'success.color': '--tag-success-color',
    'success.background-color': '--tag-success-background-color',
    'success.border-color': '--tag-success-border-color',
    'warning.color': '--tag-warning-color',
    'warning.background-color': '--tag-warning-background-color',
    'warning.border-color': '--tag-warning-border-color',
    'close.width': '--tag-close-width',
    'close.color': '--tag-close-color',
    'close.color-hover': '--tag-close-color-hover',
    'interaction.touch.min-width': '--tag-interaction-touch-min-width',
    'interaction.touch.min-height': '--tag-interaction-touch-min-height',
    'interaction.outline-color-focus': '--tag-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--tag-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--tag-interaction-outline-offset-focus',
    'checkable.color-selected': '--tag-checkable-color-selected',
    'checkable.background-color-selected': '--tag-checkable-background-color-selected',
    'checkable.border-color-selected': '--tag-checkable-border-color-selected',
    'checkable.icon.width': '--tag-checkable-icon-width',
    'checkable.state.opacity-hover': '--tag-checkable-state-opacity-hover',
    'checkable.state.opacity-focus': '--tag-checkable-state-opacity-focus',
    'checkable.state.opacity-active': '--tag-checkable-state-opacity-active',
    'checkable.state.transition': '--tag-checkable-state-transition',
    'checkable.opacity-disabled': '--tag-checkable-opacity-disabled'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--tag-transition, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`,
        'color-error': `var(${vars['root.color-error']}, var(--tag-error-color, var(--token-semantic-color-feedback-error-text, var(--token-semantic-color-feedback-error, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, var(--tag-error-background-color, var(--token-semantic-color-feedback-error-background, var(--token-global-material-error-90, oklch(0.92214553 0.03006356 22.785053)))))`,
        'border-color-error': `var(${vars['root.border-color-error']}, var(--tag-error-border-color, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))))`
    },
    'size': {
        'large': {
            'height': `var(${vars['size.large.height']}, var(--token-semantic-size-40, var(--token-global-size-40, 40px)))`,
            'padding': `var(${vars['size.large.padding']}, 0 10px)`,
            'border-radius': `var(${vars['size.large.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'gap': `var(${vars['size.large.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'middle': {
            'height': `var(${vars['size.middle.height']}, var(--token-semantic-size-32, var(--token-global-size-32, 32px)))`,
            'padding': `var(${vars['size.middle.padding']}, 0 8px)`,
            'border-radius': `var(${vars['size.middle.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'gap': `var(${vars['size.middle.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, var(--token-semantic-size-32, var(--token-global-size-32, 32px)))`,
            'padding': `var(${vars['size.small.padding']}, 0 6px)`,
            'border-radius': `var(${vars['size.small.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-label-large-font-size, var(--token-global-font-size-sm, 14px)))`,
            'gap': `var(${vars['size.small.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`
        }
    },
    'default': {
        'color': `var(${vars['default.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['default.background-color']}, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'border-color': `var(${vars['default.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`
    },
    'primary': {
        'color': `var(${vars['primary.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))`,
        'background-color': `var(${vars['primary.background-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'border-color': `var(${vars['primary.border-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-semantic-color-feedback-success, var(--token-global-green-800, oklch(0.448 0.119 155)))))`,
        'background-color': `var(${vars['success.background-color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`,
        'border-color': `var(${vars['success.border-color']}, var(--token-semantic-color-feedback-success-border, var(--token-semantic-color-feedback-success, var(--token-global-green-700, oklch(0.527 0.154 154)))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning-text, var(--token-semantic-color-feedback-warning, var(--token-global-amber-900, oklch(0.414 0.112 68)))))`,
        'background-color': `var(${vars['warning.background-color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`,
        'border-color': `var(${vars['warning.border-color']}, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))))`
    },
    'close': {
        'width': `var(${vars['close.width']}, var(--tag-close-size, 14px))`,
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'interaction': {
        'touch': {
            'min-width': `var(${vars['interaction.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['interaction.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['interaction.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['interaction.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['interaction.outline-offset-focus']}, 2px)`
    },
    'checkable': {
        'color-selected': `var(${vars['checkable.color-selected']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`,
        'background-color-selected': `var(${vars['checkable.background-color-selected']}, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047))))`,
        'border-color-selected': `var(${vars['checkable.border-color-selected']}, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047))))`,
        'icon': {
            'width': `var(${vars['checkable.icon.width']}, 18px)`
        },
        'state': {
            'opacity-hover': `var(${vars['checkable.state.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
            'opacity-focus': `var(${vars['checkable.state.opacity-focus']}, var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)))`,
            'opacity-active': `var(${vars['checkable.state.opacity-active']}, var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)))`,
            'transition': `var(${vars['checkable.state.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
        },
        'opacity-disabled': `var(${vars['checkable.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    }
});

export default token;
