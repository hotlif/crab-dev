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
    'info.border-color': '--alert-info-border-color'
});

const token = defineTokens({
    'root': {
        'transition': `var(${vars['root.transition']}, var(--alert-transition, background-color 100ms cubic-bezier(0.4, 0, 0.2, 1), border-color 100ms cubic-bezier(0.4, 0, 0.2, 1), color 100ms cubic-bezier(0.4, 0, 0.2, 1)))`,
        'padding': `var(${vars['root.padding']}, var(--alert-padding, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--alert-border-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
        'font-size': `var(${vars['root.font-size']}, var(--alert-font-size, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px))))`,
        'line-height': `var(${vars['root.line-height']}, var(--alert-line-height, 1.625))`,
        'color-error': `var(${vars['root.color-error']}, var(--alert-error-color, var(--token-semantic-color-feedback-error-text, var(--token-semantic-color-feedback-error, var(--token-global-red-800, oklch(0.444 0.177 26))))))`,
        'background-color-error': `var(${vars['root.background-color-error']}, var(--alert-error-background-color, var(--token-semantic-color-feedback-error-background, var(--token-global-red-50, oklch(0.971 0.013 17)))))`,
        'border-color-error': `var(${vars['root.border-color-error']}, var(--alert-error-border-color, var(--token-semantic-color-feedback-error-border, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25))))))`
    },
    'title': {
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'font-weight': `var(${vars['title.font-weight']}, var(--token-semantic-font-weight-label, var(--token-global-font-weight-medium, 500)))`,
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'icon': {
        'width': `var(${vars['icon.width']}, var(--alert-icon-size, 16px))`,
        'with-title': {
            'width': `var(${vars['icon.with-title.width']}, var(--alert-icon-size-with-title, 20px))`
        },
        'margin-right': `var(${vars['icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'color-error': `var(${vars['icon.color-error']}, var(--alert-error-icon-color, var(--token-semantic-color-feedback-error-icon, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25))))))`
    },
    'close': {
        'width': `var(${vars['close.width']}, var(--alert-close-size, 16px))`,
        'color': `var(${vars['close.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'color-hover': `var(${vars['close.color-hover']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'success': {
        'color': `var(${vars['success.color']}, var(--token-semantic-color-feedback-success-text, var(--token-semantic-color-feedback-success, var(--token-global-green-800, oklch(0.448 0.119 155)))))`,
        'icon': {
            'color': `var(${vars['success.icon.color']}, var(--token-semantic-color-feedback-success-icon, var(--token-semantic-color-feedback-success, var(--token-global-green-700, oklch(0.527 0.154 154)))))`
        },
        'background-color': `var(${vars['success.background-color']}, var(--token-semantic-color-feedback-success-background, var(--token-global-green-50, oklch(0.982 0.018 149))))`,
        'border-color': `var(${vars['success.border-color']}, var(--token-semantic-color-feedback-success-border, var(--token-semantic-color-feedback-success, var(--token-global-green-700, oklch(0.527 0.154 154)))))`
    },
    'warning': {
        'color': `var(${vars['warning.color']}, var(--token-semantic-color-feedback-warning-text, var(--token-semantic-color-feedback-warning, var(--token-global-amber-900, oklch(0.414 0.112 68)))))`,
        'icon': {
            'color': `var(${vars['warning.icon.color']}, var(--token-semantic-color-feedback-warning-icon, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))))`
        },
        'background-color': `var(${vars['warning.background-color']}, var(--token-semantic-color-feedback-warning-background, var(--token-global-amber-50, oklch(0.987 0.022 85))))`,
        'border-color': `var(${vars['warning.border-color']}, var(--token-semantic-color-feedback-warning-border, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71)))))`
    },
    'info': {
        'color': `var(${vars['info.color']}, var(--token-semantic-color-feedback-info-text, var(--token-semantic-color-feedback-info, var(--token-global-blue-800, oklch(0.424 0.199 265)))))`,
        'icon': {
            'color': `var(${vars['info.icon.color']}, var(--token-semantic-color-feedback-info-icon, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262)))))`
        },
        'background-color': `var(${vars['info.background-color']}, var(--token-semantic-color-feedback-info-background, var(--token-global-blue-50, oklch(0.970 0.014 254))))`,
        'border-color': `var(${vars['info.border-color']}, var(--token-semantic-color-feedback-info-border, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262)))))`
    }
});

export default token;
