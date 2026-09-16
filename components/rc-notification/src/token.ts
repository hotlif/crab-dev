/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background-color': '--notification-root-background-color',
    'root.padding': '--notification-root-padding',
    'root.border-radius': '--notification-root-border-radius',
    'root.box-shadow': '--notification-root-box-shadow',
    'text.color': '--notification-text-color',
    'title.margin-bottom': '--notification-title-margin-bottom',
    'title.font-size': '--notification-title-font-size',
    'title.line-height': '--notification-title-line-height',
    'content.font-size': '--notification-content-font-size',
    'progress.start.color': '--notification-progress-start-color',
    'progress.end.color': '--notification-progress-end-color',
    'progress.height': '--notification-progress-height',
    'close.opacity': '--notification-close-opacity'
});

const token = defineTokens({
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--notification-background-color, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'padding': `var(${vars['root.padding']}, var(--notification-padding, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--notification-border-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--notification-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'title': {
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['title.line-height']}, 1.5)`
    },
    'content': {
        'font-size': `var(${vars['content.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    },
    'close': {
        'opacity': `var(${vars['close.opacity']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    }
});

export default token;
