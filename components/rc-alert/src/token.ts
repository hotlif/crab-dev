/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--alert-root-transition',
    'root.padding': '--alert-root-padding',
    'root.border-radius': '--alert-root-border-radius',
    'root.font-size': '--alert-root-font-size',
    'root.line-height': '--alert-root-line-height',
    'root.color-error': '--alert-root-color-error',
    'root.background-color-error': '--alert-root-background-color-error',
    'root.border-color-error': '--alert-root-border-color-error',
    'title.font-size': '--alert-title-font-size',
    'title.font-weight': '--alert-title-font-weight',
    'title.margin-bottom': '--alert-title-margin-bottom',
    'icon.width': '--alert-icon-width',
    'icon.with-title.width': '--alert-icon-with-title-width',
    'icon.margin-right': '--alert-icon-margin-right',
    'icon.color-error': '--alert-icon-color-error',
    'close.width': '--alert-close-width',
    'close.color': '--alert-close-color',
    'close.color-hover': '--alert-close-color-hover',
    'close.background-color-hover': '--alert-close-background-color-hover',
    'close.background-color-focus': '--alert-close-background-color-focus',
    'close.background-color-active': '--alert-close-background-color-active',
    'success.color': '--alert-success-color',
    'success.icon.color': '--alert-success-icon-color',
    'success.background-color': '--alert-success-background-color',
    'success.border-color': '--alert-success-border-color',
    'warning.color': '--alert-warning-color',
    'warning.icon.color': '--alert-warning-icon-color',
    'warning.background-color': '--alert-warning-background-color',
    'warning.border-color': '--alert-warning-border-color',
    'info.color': '--alert-info-color',
    'info.icon.color': '--alert-info-icon-color',
    'info.background-color': '--alert-info-background-color',
    'info.border-color': '--alert-info-border-color',
    'interaction.touch.min-width': '--alert-interaction-touch-min-width',
    'interaction.touch.min-height': '--alert-interaction-touch-min-height',
    'interaction.outline-color-focus': '--alert-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--alert-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--alert-interaction-outline-offset-focus',
    'interaction.transition': '--alert-interaction-transition',
    'motion.collapse.transition': '--alert-motion-collapse-transition'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), border-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'padding': `var(${vars['root.padding']}, var(--token-semantic-feedback-banner-padding, var(--token-global-space-4, 16px)))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--token-semantic-feedback-banner-shape, var(--token-global-radius-6, 12px)))`,
        'font-size': `var(${vars['root.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-sm, 14px)))`,
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'color-error': `var(${vars['root.color-error']}, var(--token-semantic-color-feedback-error-text, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, color-mix(in oklab, var(--token-semantic-color-feedback-error-background, var(--token-global-material-error-90, oklch(0.92214553 0.03006356 22.785053))) var(--token-semantic-feedback-banner-tint, 100%), var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-color-error': `var(${vars['root.border-color-error']}, color-mix(in oklab, var(--token-semantic-color-feedback-error-border, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))) var(--token-semantic-feedback-banner-border-tint, 100%), var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`
    },
    'title': {
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-feedback-banner-title-font-size, var(--token-global-font-size-md, 16px)))`,
        'font-weight': `var(${vars['title.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'icon': {
        'width': `var(${vars['icon.width']}, 16px)`,
        'with-title': {
            'width': `var(${vars['icon.with-title.width']}, 20px)`
        },
        'margin-right': `var(${vars['icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'color-error': `var(${vars['icon.color-error']}, var(--token-semantic-color-feedback-error-icon, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`
    },
    'close': {
        'width': `var(${vars['close.width']}, 16px)`,
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color-hover': `var(${vars['close.background-color-hover']}, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'background-color-focus': `var(${vars['close.background-color-focus']}, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'background-color-active': `var(${vars['close.background-color-active']}, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-global-green-800, oklch(0.448 0.119 155))))`,
        'icon': {
            'color': `var(${vars['success.icon.color']}, var(--token-semantic-color-feedback-success-icon, var(--token-global-green-700, oklch(0.527 0.154 154))))`
        },
        'background-color': `var(${vars['success.background-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))) var(--token-semantic-feedback-banner-tint, 100%), var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-color': `var(${vars['success.border-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-success-border, var(--token-global-green-700, oklch(0.527 0.154 154))) var(--token-semantic-feedback-banner-border-tint, 100%), var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning-text, var(--token-global-amber-900, oklch(0.414 0.112 68))))`,
        'icon': {
            'color': `var(${vars['warning.icon.color']}, var(--token-semantic-color-feedback-warning-icon, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        },
        'background-color': `var(${vars['warning.background-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))) var(--token-semantic-feedback-banner-tint, 100%), var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-color': `var(${vars['warning.border-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-warning-border, var(--token-global-amber-700, oklch(0.555 0.163 71))) var(--token-semantic-feedback-banner-border-tint, 100%), var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`
    },
    'info': {
        'color': `var(${vars['info.color']}, var(--token-semantic-color-feedback-info-text, var(--token-global-blue-800, oklch(0.424 0.199 265))))`,
        'icon': {
            'color': `var(${vars['info.icon.color']}, var(--token-semantic-color-feedback-info-icon, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
        },
        'background-color': `var(${vars['info.background-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-info-background, var(--token-global-blue-50, oklch(0.970 0.014 254))) var(--token-semantic-feedback-banner-tint, 100%), var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`,
        'border-color': `var(${vars['info.border-color']}, color-mix(in oklab, var(--token-semantic-color-feedback-info-border, var(--token-global-blue-600, oklch(0.546 0.245 262))) var(--token-semantic-feedback-banner-border-tint, 100%), var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736)))))`
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
    },
    'motion': {
        'collapse': {
            'transition': `var(${vars['motion.collapse.transition']}, var(--token-semantic-motion-layout, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))))`
        }
    }
});

export default token;
