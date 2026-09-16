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
    'group.item.border-color': '--avatar-group-item-border-color'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--avatar-transition, box-shadow 120ms cubic-bezier(0.4, 0, 0.2, 1), transform 120ms cubic-bezier(0.4, 0, 0.2, 1), background-color 120ms cubic-bezier(0.4, 0, 0.2, 1), color 120ms cubic-bezier(0.4, 0, 0.2, 1)))`,
        'border-color': `var(${vars['root.border-color']}, var(--avatar-border-color, var(--token-semantic-color-border-default, var(--token-global-zinc-600, oklch(0.550 0.014 286)))))`,
        'border-color-hover': `var(${vars['root.border-color-hover']}, var(--avatar-border-color-hover, var(--avatar-border-hover, var(--token-semantic-color-border-hover, var(--token-global-zinc-700, oklch(0.430 0.012 286))))))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--avatar-opacity-disabled, var(--avatar-disabled-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))))`,
        'color-error': `var(${vars['root.color-error']}, var(--avatar-error-color, var(--token-semantic-color-feedback-error-text, var(--token-semantic-color-feedback-error, var(--token-global-red-800, oklch(0.444 0.177 26))))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, var(--avatar-error-background-color, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17)))))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, var(--avatar-size-small-value, 28px))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        },
        'middle': {
            'width': `var(${vars['size.middle.width']}, var(--avatar-size-middle-value, 40px))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
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
        'font-weight': `var(${vars['content.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
    },
    'shape': {
        'square': {
            'border-radius': `var(${vars['shape.square.border-radius']}, var(--avatar-shape-square-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`
        }
    },
    'ring': {
        'color-focus': `var(${vars['ring.color-focus']}, var(--avatar-focus-ring-color, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))))`
    },
    'default': {
        'color': `var(${vars['default.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'background-color': `var(${vars['default.background-color']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`
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
        'transition': `var(${vars['group.transition']}, transform 180ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 180ms cubic-bezier(0.4, 0, 0.2, 1))`,
        'transform-hover': `var(${vars['group.transform-hover']}, var(--avatar-group-translate-y-hover, translateY(var(--avatar-group-hover-translate-y, -2px))))`,
        'item': {
            'ring': {
                'width': `var(${vars['group.item.ring.width']}, 2px)`
            },
            'border-color': `var(${vars['group.item.border-color']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`
        }
    }
});

export default token;
