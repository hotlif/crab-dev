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
    'progress.height': '--message-progress-height',
    'progress.animation-duration': '--message-progress-animation-duration',
    'progress.animation-delay': '--message-progress-animation-delay',
    'motion.interaction.transition': '--message-motion-interaction-transition',
    'motion.spatial.transition': '--message-motion-spatial-transition',
    'stack.translate': '--message-stack-translate'
});

const token = defineTokens({
    'root': {
        'padding': `var(${vars['root.padding']}, var(--message-padding, var(--token-semantic-space-section-gap, var(--token-global-space-4, 16px))))`,
        'border-radius': `var(${vars['root.border-radius']}, var(--message-border-radius, var(--token-semantic-shape-extra-small, var(--token-global-radius-2, 4px))))`,
        'font-size': `var(${vars['root.font-size']}, var(--message-font-size, var(--token-semantic-typography-body-medium-font-size, var(--token-global-font-size-sm, 14px))))`,
        'line-height': `var(${vars['root.line-height']}, var(--message-line-height, var(--token-semantic-typography-body-medium-line-height, var(--token-global-line-height-14-20, 1.4285714285714286))))`,
        'background-color': `var(${vars['root.background-color']}, var(--message-background-color, var(--token-semantic-color-background-inverse, var(--token-global-material-neutral-20, oklch(0.31065597 0.01134802 308.055889)))))`,
        'box-shadow': `var(${vars['root.box-shadow']}, var(--message-box-shadow, var(--token-semantic-shadow-overlay, var(--token-global-shadow-material-3, 0 1px 3px 0 oklch(0 0 0 / 0.3), 0 4px 8px 3px oklch(0 0 0 / 0.15)))))`
    },
    'icon': {
        'width': `var(${vars['icon.width']}, var(--message-icon-size, 18px))`,
        'margin-right': `var(${vars['icon.margin-right']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`,
        'color-error': `var(${vars['icon.color-error']}, var(--message-error-icon-color, var(--message-error-color, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))))))`
    },
    'success': {
        'icon': {
            'color': `var(${vars['success.icon.color']}, var(--message-success-color, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090)))))`
        }
    },
    'warning': {
        'icon': {
            'color': `var(${vars['warning.icon.color']}, var(--message-warning-color, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090)))))`
        }
    },
    'info': {
        'icon': {
            'color': `var(${vars['info.icon.color']}, var(--message-info-color, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090)))))`
        }
    },
    'text': {
        'color': `var(${vars['text.color']}, var(--token-semantic-color-text-inverse, var(--token-global-material-neutral-95, oklch(0.95905613 0.01234763 317.742090))))`
    },
    'progress': {
        'start': {
            'color': `var(${vars['progress.start.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'end': {
            'color': `var(${vars['progress.end.color']}, var(--token-semantic-color-brand-primary-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951))))`
        },
        'height': `var(${vars['progress.height']}, 3px)`,
        'animation-duration': `var(${vars['progress.animation-duration']}, var(--message-progress-duration, var(--message-countdown-duration, 0ms)))`,
        'animation-delay': `var(${vars['progress.animation-delay']}, var(--message-progress-delay, var(--message-countdown-delay, 0ms)))`
    },
    'motion': {
        'interaction': {
            'transition': `var(${vars['motion.interaction.transition']}, var(--message-motion-interaction, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00)))))`
        },
        'spatial': {
            'transition': `var(${vars['motion.spatial.transition']}, var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))))`
        }
    },
    'stack': {
        'translate': `var(${vars['stack.translate']}, var(--message-stack-offset, var(--token-semantic-space-group-gap, var(--token-global-space-6, 24px))))`
    }
});

export default token;
