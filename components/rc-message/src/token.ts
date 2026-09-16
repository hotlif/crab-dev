/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.padding': '--message-root-padding',
    'root.border-radius': '--message-root-border-radius',
    'root.font-size': '--message-root-font-size',
    'root.line-height': '--message-root-line-height',
    'root.background-color': '--message-root-background-color',
    'root.box-shadow': '--message-root-box-shadow',
    'icon.width': '--message-icon-width',
    'icon.margin-right': '--message-icon-margin-right',
    'icon.color-error': '--message-icon-color-error',
    'success.icon.color': '--message-success-icon-color',
    'warning.icon.color': '--message-warning-icon-color',
    'info.icon.color': '--message-info-icon-color',
    'text.color': '--message-text-color',
    'progress.start.color': '--message-progress-start-color',
    'progress.end.color': '--message-progress-end-color',
    'progress.height': '--message-progress-height'
});

const token = defineTokens({
    'root': {
        'padding': `var(${vars['root.padding']}, var(--message-padding, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)) var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--message-border-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
        'font-size': `var(${vars['root.font-size']}, var(--message-font-size, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px))))`,
        'line-height': `var(${vars['root.line-height']}, var(--message-line-height, 1.625))`,
        'background-color': `var(${vars['root.background-color']}, var(--message-background-color, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--message-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`
    },
    'icon': {
        'width': `var(${vars['icon.width']}, var(--message-icon-size, 18px))`,
        'margin-right': `var(${vars['icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'color-error': `var(${vars['icon.color-error']}, var(--message-error-icon-color, var(--message-error-color, var(--token-semantic-color-feedback-error-icon, var(--token-semantic-color-feedback-error, var(--token-global-red-600, oklch(0.577 0.245 25)))))))`
    },
    'success': {
        'icon': {
            'color': `var(${vars['success.icon.color']}, var(--message-success-color, var(--token-semantic-color-feedback-success-icon, var(--token-semantic-color-feedback-success, var(--token-global-green-700, oklch(0.527 0.154 154))))))`
        }
    },
    'warning': {
        'icon': {
            'color': `var(${vars['warning.icon.color']}, var(--message-warning-color, var(--token-semantic-color-feedback-warning-icon, var(--token-semantic-color-feedback-warning, var(--token-global-amber-700, oklch(0.555 0.163 71))))))`
        }
    },
    'info': {
        'icon': {
            'color': `var(${vars['info.icon.color']}, var(--message-info-color, var(--token-semantic-color-feedback-info-icon, var(--token-semantic-color-feedback-info, var(--token-global-blue-600, oklch(0.546 0.245 262))))))`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    }
});

export default token;
