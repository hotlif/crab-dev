/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.transition': '--badge-root-transition',
    'size.default.height': '--badge-size-default-height',
    'size.default.min-width': '--badge-size-default-min-width',
    'size.default.padding': '--badge-size-default-padding',
    'size.default.font-size': '--badge-size-default-font-size',
    'size.default.border-width': '--badge-size-default-border-width',
    'size.small.height': '--badge-size-small-height',
    'size.small.min-width': '--badge-size-small-min-width',
    'size.small.padding': '--badge-size-small-padding',
    'size.small.font-size': '--badge-size-small-font-size',
    'size.small.border-width': '--badge-size-small-border-width',
    'dot.default.width': '--badge-dot-default-width',
    'dot.small.width': '--badge-dot-small-width',
    'count.color': '--badge-count-color',
    'count.background-color': '--badge-count-background-color',
    'count.border-color': '--badge-count-border-color',
    'count.font-weight': '--badge-count-font-weight',
    'status.default.color': '--badge-status-default-color',
    'status.processing.color': '--badge-status-processing-color',
    'status.success.color': '--badge-status-success-color',
    'status.warning.color': '--badge-status-warning-color',
    'status.color-error': '--badge-status-color-error',
    'status.text.color': '--badge-status-text-color',
    'status.text.gap': '--badge-status-text-gap',
    'status.text.font-size': '--badge-status-text-font-size',
    'indicator.transform': '--badge-indicator-transform'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--badge-transition, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90)))))`
    },
    'size': {
        'default': {
            'height': `var(${vars['size.default.height']}, 16px)`,
            'min-width': `var(${vars['size.default.min-width']}, 16px)`,
            'padding': `var(${vars['size.default.padding']}, 0 4px)`,
            'font-size': `var(${vars['size.default.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
            'border-width': `var(${vars['size.default.border-width']}, 0px)`
        },
        'small': {
            'height': `var(${vars['size.small.height']}, 16px)`,
            'min-width': `var(${vars['size.small.min-width']}, 16px)`,
            'padding': `var(${vars['size.small.padding']}, 0 4px)`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`,
            'border-width': `var(${vars['size.small.border-width']}, 1px)`
        }
    },
    'dot': {
        'default': {
            'width': `var(${vars['dot.default.width']}, var(--badge-dot-size-default, 6px))`
        },
        'small': {
            'width': `var(${vars['dot.small.width']}, var(--badge-dot-size-small, 6px))`
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-feedback-error-on-solid, var(--token-global-material-error-100, oklch(0.99999999 0.00000004 0))))`,
        'background-color': `var(${vars['count.background-color']}, var(--token-semantic-color-feedback-error-solid, var(--token-semantic-color-feedback-error, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727)))))`,
        'border-color': `var(${vars['count.border-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'font-weight': `var(${vars['count.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`
    },
    'status': {
        'default': {
            'color': `var(${vars['status.default.color']}, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286)))))`
        },
        'processing': {
            'color': `var(${vars['status.processing.color']}, var(--token-semantic-color-feedback-info-icon, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262)))))`
        },
        'success': {
            'color': `var(${vars['status.success.color']}, var(--token-semantic-color-feedback-success-icon, var(--token-semantic-color-feedback-success, var(--token-global-green-700, oklch(0.527 0.154 154)))))`
        },
        'warning': {
            'color': `var(${vars['status.warning.color']}, var(--token-semantic-color-feedback-warning-icon, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))))`
        },
        'color-error': `var(${vars['status.color-error']}, var(--badge-status-error-color, var(--token-semantic-color-feedback-error-icon, var(--token-semantic-color-feedback-error, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))))`,
        'text': {
            'color': `var(${vars['status.text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'gap': `var(${vars['status.text.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['status.text.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`
        }
    },
    'indicator': {
        'transform': `var(${vars['indicator.transform']}, translate(var(--badge-offset-x, 50%), var(--badge-offset-y, -50%)))`
    }
});

export default token;
