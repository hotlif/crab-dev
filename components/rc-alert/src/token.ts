/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'transition': '--alert-transition',
    'padding': '--alert-padding',
    'border.radius': '--alert-border-radius',
    'font.size': '--alert-font-size',
    'line.height': '--alert-line-height',
    'title.font.size': '--alert-title-font-size',
    'title.font.weight': '--alert-title-font-weight',
    'title.margin.bottom': '--alert-title-margin-bottom',
    'icon.size': '--alert-icon-size',
    'icon.size-with-title': '--alert-icon-size-with-title',
    'icon.margin.right': '--alert-icon-margin-right',
    'close.size': '--alert-close-size',
    'close.color': '--alert-close-color',
    'close.color-hover': '--alert-close-color-hover',
    'success.color': '--alert-success-color',
    'success.background.color': '--alert-success-background-color',
    'success.border-color': '--alert-success-border-color',
    'warning.color': '--alert-warning-color',
    'warning.background.color': '--alert-warning-background-color',
    'warning.border-color': '--alert-warning-border-color',
    'error.color': '--alert-error-color',
    'error.background.color': '--alert-error-background-color',
    'error.border-color': '--alert-error-border-color',
    'info.color': '--alert-info-color',
    'info.background.color': '--alert-info-background-color',
    'info.border-color': '--alert-info-border-color'
});

const token = defineTokens({
    'transition': `var(${vars['transition']}, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1))`,
    'padding': `var(${vars['padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
    },
    'font': {
        'size': `var(${vars['font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
    },
    'line': {
        'height': `var(${vars['line.height']}, 1.625)`
    },
    'title': {
        'font': {
            'size': `var(${vars['title.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
            'weight': `var(${vars['title.font.weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`
        },
        'margin': {
            'bottom': `var(${vars['title.margin.bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'icon': {
        'size': `var(${vars['icon.size']}, 16px)`,
        'size-with-title': `var(${vars['icon.size-with-title']}, 20px)`,
        'margin': {
            'right': `var(${vars['icon.margin.right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        }
    },
    'close': {
        'size': `var(${vars['close.size']}, 16px)`,
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`,
        'background': {
            'color': `var(${vars['success.background.color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`
        },
        'border-color': `var(${vars['success.border-color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`,
        'background': {
            'color': `var(${vars['warning.background.color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`
        },
        'border-color': `var(${vars['warning.border-color']}, var(--token-semantic-color-feedback-warning, var(--token-global-amber-500, oklch(0.769 0.188 75))))`
    },
    'error': {
        'color': `var(${vars['error.color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`,
        'background': {
            'color': `var(${vars['error.background.color']}, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17))))`
        },
        'border-color': `var(${vars['error.border-color']}, var(--token-semantic-color-feedback-error, var(--token-global-red-500, oklch(0.637 0.237 24))))`
    },
    'info': {
        'color': `var(${vars['info.color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`,
        'background': {
            'color': `var(${vars['info.background.color']}, var(--token-semantic-color-feedback-info-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`
        },
        'border-color': `var(${vars['info.border-color']}, var(--token-semantic-color-feedback-info, var(--token-global-blue-500, oklch(0.623 0.214 261))))`
    }
});

export default token;
