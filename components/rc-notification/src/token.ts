/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background-color': '--notification-root-background-color',
    'root.padding': '--notification-root-padding',
    'root.border-radius': '--notification-root-border-radius',
    'root.box-shadow': '--notification-root-box-shadow',
    'root.width': '--notification-root-width',
    'root.border-color': '--notification-root-border-color',
    'text.color': '--notification-text-color',
    'title.margin-bottom': '--notification-title-margin-bottom',
    'title.font-size': '--notification-title-font-size',
    'title.line-height': '--notification-title-line-height',
    'content.font-size': '--notification-content-font-size',
    'content.line-height': '--notification-content-line-height',
    'progress.start.color': '--notification-progress-start-color',
    'progress.end.color': '--notification-progress-end-color',
    'progress.height': '--notification-progress-height',
    'progress.animation-duration': '--notification-progress-animation-duration',
    'progress.animation-delay': '--notification-progress-animation-delay',
    'close.opacity': '--notification-close-opacity',
    'motion.interaction.transition': '--notification-motion-interaction-transition',
    'stack.translate': '--notification-stack-translate',
    'stack.gap': '--notification-stack-gap',
    'stack.front.z-index': '--notification-stack-front-z-index',
    'stack.second.z-index': '--notification-stack-second-z-index',
    'stack.second.scale': '--notification-stack-second-scale',
    'stack.second.background-color': '--notification-stack-second-background-color',
    'stack.third.z-index': '--notification-stack-third-z-index',
    'stack.third.scale': '--notification-stack-third-scale',
    'stack.third.background-color': '--notification-stack-third-background-color',
    'stack.box-shadow': '--notification-stack-box-shadow'
});

const token = defineTokens({
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--notification-background-color, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0)))))`,
        'padding': `var(${vars['root.padding']}, var(--notification-padding, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--notification-border-radius, var(--token-semantic-radius-lg, var(--token-global-radius-4, 8px))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--notification-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-lg, 0 0 0 1px oklch(0 0 0 / 0.03), 0 4px 8px -2px oklch(0 0 0 / 0.06), 0 12px 20px -4px oklch(0 0 0 / 0.08)))))`,
        'width': `var(${vars['root.width']}, 360px)`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
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
        'font-size': `var(${vars['content.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'line-height': `var(${vars['content.line-height']}, var(--token-semantic-font-line-height-body, var(--token-global-line-height-normal, 1.5)))`
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`,
        'animation-duration': `var(${vars['progress.animation-duration']}, var(--notification-progress-duration, var(--notification-countdown-duration, 0ms)))`,
        'animation-delay': `var(${vars['progress.animation-delay']}, var(--notification-progress-delay, var(--notification-countdown-delay, 0ms)))`
    },
    'close': {
        'opacity': `var(${vars['close.opacity']}, var(--token-semantic-opacity-tertiary, var(--token-global-opacity-70, 0.7)))`
    },
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--notification-motion-interaction, var(--token-semantic-motion-interaction, calc((var(--token-global-duration-fast, 100ms) + var(--token-global-duration-normal, 200ms)) / 2) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`
        }
    },
    'stack': {
        'translate': `var(${vars['stack.translate']}, var(--notification-stack-offset, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px))))`,
        'gap': `var(${vars['stack.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'front': {
            'z-index': `var(${vars['stack.front.z-index']}, 3)`
        },
        'second': {
            'z-index': `var(${vars['stack.second.z-index']}, 2)`,
            'scale': `var(${vars['stack.second.scale']}, 0.96)`,
            'background-color': `var(${vars['stack.second.background-color']}, color-mix(in oklch, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))) 94%, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
        },
        'third': {
            'z-index': `var(${vars['stack.third.z-index']}, 1)`,
            'scale': `var(${vars['stack.third.scale']}, 0.92)`,
            'background-color': `var(${vars['stack.third.background-color']}, color-mix(in oklch, var(--token-semantic-color-background-elevated, var(--token-global-white, oklch(1.000 0 0))) 88%, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286)))))`
        },
        'box-shadow': `var(${vars['stack.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`
    }
});

export default token;
