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
    'count.default.color': '--badge-count-default-color',
    'count.default.background-color': '--badge-count-default-background-color',
    'count.processing.color': '--badge-count-processing-color',
    'count.processing.background-color': '--badge-count-processing-background-color',
    'count.success.color': '--badge-count-success-color',
    'count.success.background-color': '--badge-count-success-background-color',
    'count.warning.color': '--badge-count-warning-color',
    'count.warning.background-color': '--badge-count-warning-background-color',
    'count.color-error': '--badge-count-color-error',
    'count.background-color-error': '--badge-count-background-color-error',
    'status.default.color': '--badge-status-default-color',
    'status.processing.color': '--badge-status-processing-color',
    'status.success.color': '--badge-status-success-color',
    'status.warning.color': '--badge-status-warning-color',
    'status.color-error': '--badge-status-color-error',
    'status.text.color': '--badge-status-text-color',
    'status.text.gap': '--badge-status-text-gap',
    'status.text.font-size': '--badge-status-text-font-size',
    'indicator.anchor.left': '--badge-indicator-anchor-left',
    'indicator.offset.left': '--badge-indicator-offset-left',
    'indicator.offset.top': '--badge-indicator-offset-top',
    'indicator.transform': '--badge-indicator-transform'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
    },
    'size': {
        'default': {
            'height': `var(${vars['size.default.height']}, var(--token-semantic-status-badge-height, var(--token-global-space-4, 16px)))`,
            'min-width': `var(${vars['size.default.min-width']}, var(--token-semantic-status-badge-height, var(--token-global-space-4, 16px)))`,
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
            'width': `var(${vars['dot.default.width']}, 6px)`
        },
        'small': {
            'width': `var(${vars['dot.small.width']}, 6px)`
        }
    },
    'count': {
        'color': `var(${vars['count.color']}, var(--token-semantic-color-feedback-error-on-solid, var(--token-global-material-error-100, oklch(0.99999999 0.00000004 0))))`,
        'background-color': `var(${vars['count.background-color']}, var(--token-semantic-color-feedback-error-solid, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'border-color': `var(${vars['count.border-color']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
        'font-weight': `var(${vars['count.font-weight']}, var(--token-semantic-typography-label-font-weight, var(--token-global-font-weight-medium, 500)))`,
        'default': {
            'color': `var(${vars['count.default.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'background-color': `var(${vars['count.default.background-color']}, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286)))))`
        },
        'processing': {
            'color': `var(${vars['count.processing.color']}, var(--token-semantic-color-feedback-info-on-solid, var(--token-global-white, oklch(1.000 0 0))))`,
            'background-color': `var(${vars['count.processing.background-color']}, var(--token-semantic-color-feedback-info-solid, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
        },
        'success': {
            'color': `var(${vars['count.success.color']}, var(--token-semantic-color-feedback-success-on-solid, var(--token-global-white, oklch(1.000 0 0))))`,
            'background-color': `var(${vars['count.success.background-color']}, var(--token-semantic-color-feedback-success-solid, var(--token-global-green-700, oklch(0.527 0.154 154))))`
        },
        'warning': {
            'color': `var(${vars['count.warning.color']}, var(--token-semantic-color-feedback-warning-on-solid, var(--token-global-white, oklch(1.000 0 0))))`,
            'background-color': `var(${vars['count.warning.background-color']}, var(--token-semantic-color-feedback-warning-solid, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        },
        'color-error': `var(${vars['count.color-error']}, var(--token-semantic-color-feedback-error-on-solid, var(--token-global-material-error-100, oklch(0.99999999 0.00000004 0))))`,
        'background-color-error': `var(${vars['count.background-color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`
    },
    'status': {
        'default': {
            'color': `var(${vars['status.default.color']}, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286)))))`
        },
        'processing': {
            'color': `var(${vars['status.processing.color']}, var(--token-semantic-color-feedback-info-icon, var(--token-global-blue-600, oklch(0.546 0.245 262))))`
        },
        'success': {
            'color': `var(${vars['status.success.color']}, var(--token-semantic-color-feedback-success-icon, var(--token-global-green-700, oklch(0.527 0.154 154))))`
        },
        'warning': {
            'color': `var(${vars['status.warning.color']}, var(--token-semantic-color-feedback-warning-icon, var(--token-global-amber-700, oklch(0.555 0.163 71))))`
        },
        'color-error': `var(${vars['status.color-error']}, var(--token-semantic-color-feedback-error-icon, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'text': {
            'color': `var(${vars['status.text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
            'gap': `var(${vars['status.text.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
            'font-size': `var(${vars['status.text.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-sm, 14px)))`
        }
    },
    'indicator': {
        'anchor': {
            'left': `var(${vars['indicator.anchor.left']}, 50%)`
        },
        'offset': {
            'left': `var(${vars['indicator.offset.left']}, 0px)`,
            'top': `var(${vars['indicator.offset.top']}, 0px)`
        },
        'transform': `var(${vars['indicator.transform']}, translate(calc(var(--badge-indicator-anchor-left, 50%) + var(--badge-indicator-offset-left, 0px)), calc(-50% + var(--badge-indicator-offset-top, 0px))))`
    }
});

export default token;
