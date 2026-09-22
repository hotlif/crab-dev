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
    'motion.spatial.transition': '--notification-motion-spatial-transition',
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
        'background-color': `var(${vars['root.background-color']}, var(--notification-background-color, var(--token-semantic-color-surface-overlay, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074)))))`,
        'padding': `var(${vars['root.padding']}, var(--notification-padding, var(--token-semantic-space-card-padding, var(--token-global-space-5, 20px)) var(--token-semantic-space-dialog-padding, var(--token-global-space-6, 24px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--notification-border-radius, var(--token-semantic-shape-medium, var(--token-global-radius-6, 12px))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--notification-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15)))))`,
        'width': `var(${vars['root.width']}, 360px)`,
        'border-color': `var(${vars['root.border-color']}, var(--token-semantic-color-border-subtle, var(--token-global-material-neutral-variant-80, oklch(0.82874810 0.01775809 308.222736))))`
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'title': {
        'margin-bottom': `var(${vars['title.margin-bottom']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'font-size': `var(${vars['title.font-size']}, var(--token-semantic-typography-title-medium-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['title.line-height']}, var(--token-semantic-typography-title-medium-line-height, var(--token-global-line-height-16-24, 1.5)))`
    },
    'content': {
        'font-size': `var(${vars['content.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`,
        'line-height': `var(${vars['content.line-height']}, var(--token-semantic-typography-body-line-height, var(--token-global-line-height-16-24, 1.5)))`
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
            'transition': `var(${vars['motion.interaction.transition']}, var(--notification-motion-interaction, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`
        },
        'spatial': {
            'transition': `var(${vars['motion.spatial.transition']}, var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
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
            'background-color': `var(${vars['stack.second.background-color']}, color-mix(in oklch, var(--token-semantic-color-surface-overlay, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074))) 94%, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`
        },
        'third': {
            'z-index': `var(${vars['stack.third.z-index']}, 1)`,
            'scale': `var(${vars['stack.third.scale']}, 0.92)`,
            'background-color': `var(${vars['stack.third.background-color']}, color-mix(in oklch, var(--token-semantic-color-surface-overlay, var(--token-global-material-neutral-92, oklch(0.93250577 0.01478797 312.240074))) 88%, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)))))`
        },
        'box-shadow': `var(${vars['stack.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-material-2, 0 1px 2px 0 oklch(0 0 0 / 0.3), 0 2px 6px 2px oklch(0 0 0 / 0.15))))`
    }
});

export default token;
