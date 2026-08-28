/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'background.color': '--notification-background-color',
    'text.color': '--notification-text-color',
    'padding': '--notification-padding',
    'border.radius': '--notification-border-radius',
    'title.margin.bottom': '--notification-title-margin-bottom',
    'title.font.size': '--notification-title-font-size',
    'title.line.height': '--notification-title-line-height',
    'content.font.size': '--notification-content-font-size',
    'progress.start.color': '--notification-progress-start-color',
    'progress.end.color': '--notification-progress-end-color',
    'progress.height': '--notification-progress-height',
    'close.opacity': '--notification-close-opacity'
});

const token = defineTokens({
    'background': {
        'color': `var(${vars['background.color']}, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`
    },
    'padding': `var(${vars['padding']}, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px)))`,
    'border': {
        'radius': `var(${vars['border.radius']}, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px)))`
    },
    'title': {
        'margin': {
            'bottom': `var(${vars['title.margin.bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
        },
        'font': {
            'size': `var(${vars['title.font.size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        },
        'line': {
            'height': `var(${vars['title.line.height']}, 1.5)`
        }
    },
    'content': {
        'font': {
            'size': `var(${vars['content.font.size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        }
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-feedback-success, var(--token-global-green-500, oklch(0.723 0.219 152))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`
    },
    'close': {
        'opacity': `var(${vars['close.opacity']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    }
});

export default token;
