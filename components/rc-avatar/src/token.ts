/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--avatar-root-transition',
    'root.border-color': '--avatar-root-border-color',
    'root.border-color-hover': '--avatar-root-border-color-hover',
    'root.opacity-disabled': '--avatar-root-opacity-disabled',
    'root.color-error': '--avatar-root-color-error',
    'root.background-color-error': '--avatar-root-background-color-error',
    'size.small.width': '--avatar-size-small-width',
    'size.small.font-size': '--avatar-size-small-font-size',
    'size.middle.width': '--avatar-size-middle-width',
    'size.middle.font-size': '--avatar-size-middle-font-size',
    'size.large.width': '--avatar-size-large-width',
    'size.large.font-size': '--avatar-size-large-font-size',
    'icon.small.font-size': '--avatar-icon-small-font-size',
    'icon.middle.font-size': '--avatar-icon-middle-font-size',
    'icon.large.font-size': '--avatar-icon-large-font-size',
    'content.max-width': '--avatar-content-max-width',
    'content.font-weight': '--avatar-content-font-weight',
    'shape.square.border-radius': '--avatar-shape-square-border-radius',
    'ring.color-focus': '--avatar-ring-color-focus',
    'default.color': '--avatar-default-color',
    'default.background-color': '--avatar-default-background-color',
    'primary.color': '--avatar-primary-color',
    'primary.background-color': '--avatar-primary-background-color',
    'success.color': '--avatar-success-color',
    'success.background-color': '--avatar-success-background-color',
    'warning.color': '--avatar-warning-color',
    'warning.background-color': '--avatar-warning-background-color',
    'group.margin': '--avatar-group-margin',
    'group.transition': '--avatar-group-transition',
    'group.transform-hover': '--avatar-group-transform-hover',
    'group.item.ring.width': '--avatar-group-item-ring-width',
    'group.item.border-color': '--avatar-group-item-border-color',
    'interaction.touch.min-width': '--avatar-interaction-touch-min-width',
    'interaction.touch.min-height': '--avatar-interaction-touch-min-height',
    'interaction.outline-color-focus': '--avatar-interaction-outline-color-focus',
    'interaction.outline-width-focus': '--avatar-interaction-outline-width-focus',
    'interaction.outline-offset-focus': '--avatar-interaction-outline-offset-focus'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--avatar-transition, box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`,
        'border-color': `var(${vars['root.border-color']}, var(--avatar-border-color, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--avatar-border-color-hover, var(--avatar-border-hover, var(--token-semantic-color-border-hover, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--avatar-opacity-disabled, var(--avatar-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))))`,
        'color-error': `var(${vars['root.color-error']}, var(--avatar-error-color, var(--token-semantic-color-feedback-error-text, var(--token-semantic-color-feedback-error, var(--token-global-material-error-10, oklch(0.25390329 0.07937181 27.605486))))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, var(--avatar-error-background-color, var(--token-semantic-color-feedback-error-background, var(--token-global-material-error-90, oklch(0.92214553 0.03006356 22.785053)))))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, var(--avatar-size-small-value, 28px))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
        },
        'middle': {
            'width': `var(${vars['size.middle.width']}, var(--avatar-size-middle-value, 40px))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`
        },
        'large': {
            'width': `var(${vars['size.large.width']}, var(--avatar-size-large-value, 48px))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        }
    },
    'icon': {
        'small': {
            'font-size': `var(${vars['icon.small.font-size']}, var(--avatar-icon-size-small, 14px))`
        },
        'middle': {
            'font-size': `var(${vars['icon.middle.font-size']}, var(--avatar-icon-size-middle, 18px))`
        },
        'large': {
            'font-size': `var(${vars['icon.large.font-size']}, var(--avatar-icon-size-large, 22px))`
        }
    },
    'content': {
        'max-width': `var(${vars['content.max-width']}, 70%)`,
        'font-weight': `var(${vars['content.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`
    },
    'shape': {
        'square': {
            'border-radius': `var(${vars['shape.square.border-radius']}, var(--avatar-shape-square-radius, var(--token-semantic-radius-lg, var(--token-global-radius-6, 12px))))`
        }
    },
    'ring': {
        'color-focus': `var(${vars['ring.color-focus']}, var(--avatar-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`
    },
    'default': {
        'color': `var(${vars['default.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'background-color': `var(${vars['default.background-color']}, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
    },
    'primary': {
        'color': `var(${vars['primary.color']}, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0))))`,
        'background-color': `var(${vars['primary.background-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-semantic-color-feedback-success, var(--token-global-green-800, oklch(0.448 0.119 155)))))`,
        'background-color': `var(${vars['success.background-color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning-text, var(--token-semantic-color-feedback-warning, var(--token-global-amber-900, oklch(0.414 0.112 68)))))`,
        'background-color': `var(${vars['warning.background-color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`
    },
    'group': {
        'margin': `var(${vars['group.margin']}, var(--avatar-group-overlap, -8px))`,
        'transition': `var(${vars['group.transition']}, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), box-shadow var(--token-semantic-motion-effects-fast, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'transform-hover': `var(${vars['group.transform-hover']}, var(--avatar-group-translate-y-hover, translateY(var(--avatar-group-hover-translate-y, -2px))))`,
        'item': {
            'ring': {
                'width': `var(${vars['group.item.ring.width']}, 2px)`
            },
            'border-color': `var(${vars['group.item.border-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`
        }
    },
    'interaction': {
        'touch': {
            'min-width': `var(${vars['interaction.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['interaction.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['interaction.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['interaction.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['interaction.outline-offset-focus']}, 2px)`
    }
});

export default token;
