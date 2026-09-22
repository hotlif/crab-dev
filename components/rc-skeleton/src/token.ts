/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.background-color': '--skeleton-root-background-color',
    'wave.background-color': '--skeleton-wave-background-color',
    'item.border-radius': '--skeleton-item-border-radius',
    'text.border-radius': '--skeleton-text-border-radius',
    'text.size.small.height': '--skeleton-text-size-small-height',
    'text.size.medium.height': '--skeleton-text-size-medium-height',
    'text.size.large.height': '--skeleton-text-size-large-height',
    'text.rows.gap': '--skeleton-text-rows-gap',
    'text.last-row.width': '--skeleton-text-last-row-width',
    'pill.border-radius': '--skeleton-pill-border-radius',
    'rect.default.width': '--skeleton-rect-default-width',
    'rect.default.height': '--skeleton-rect-default-height',
    'circle.default.width': '--skeleton-circle-default-width',
    'button.default.width': '--skeleton-button-default-width',
    'button.default.height': '--skeleton-button-default-height',
    'avatar.default.width': '--skeleton-avatar-default-width',
    'animation.pulse.animation-duration': '--skeleton-animation-pulse-animation-duration',
    'animation.pulse.animation-timing-function': '--skeleton-animation-pulse-animation-timing-function',
    'animation.pulse.minimum.opacity': '--skeleton-animation-pulse-minimum-opacity',
    'animation.pulse.maximum.opacity': '--skeleton-animation-pulse-maximum-opacity',
    'animation.wave.animation-duration': '--skeleton-animation-wave-animation-duration',
    'animation.wave.animation-timing-function': '--skeleton-animation-wave-animation-timing-function'
});

const token = defineTokens({
    'root': {
        'background-color': `var(${vars['root.background-color']}, var(--skeleton-background-color, var(--skeleton-color-background, var(--token-semantic-color-background-hover-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))))`
    },
    'wave': {
        'background-color': `var(${vars['wave.background-color']}, var(--skeleton-color-highlight, var(--token-semantic-color-background-active-subtle, color-mix(in oklch, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695)) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957))))))`
    },
    'item': {
        'border-radius': `var(${vars['item.border-radius']}, var(--skeleton-radius-default, var(--token-semantic-shape-control, var(--token-global-radius-2, 4px))))`
    },
    'text': {
        'border-radius': `var(${vars['text.border-radius']}, var(--skeleton-radius-text, var(--token-semantic-radius-sm, var(--token-global-radius-2, 4px))))`,
        'size': {
            'small': {
                'height': `var(${vars['text.size.small.height']}, 12px)`
            },
            'medium': {
                'height': `var(${vars['text.size.medium.height']}, 16px)`
            },
            'large': {
                'height': `var(${vars['text.size.large.height']}, 20px)`
            }
        },
        'rows': {
            'gap': `var(${vars['text.rows.gap']}, var(--token-semantic-space-stack-gap, var(--token-global-space-3, 12px)))`
        },
        'last-row': {
            'width': `var(${vars['text.last-row.width']}, 65%)`
        }
    },
    'pill': {
        'border-radius': `var(${vars['pill.border-radius']}, var(--skeleton-radius-pill, var(--token-semantic-radius-pill, var(--token-global-radius-full, 9999px))))`
    },
    'rect': {
        'default': {
            'width': `var(${vars['rect.default.width']}, 100%)`,
            'height': `var(${vars['rect.default.height']}, 120px)`
        }
    },
    'circle': {
        'default': {
            'width': `var(${vars['circle.default.width']}, var(--skeleton-circle-default-size, 40px))`
        }
    },
    'button': {
        'default': {
            'width': `var(${vars['button.default.width']}, 88px)`,
            'height': `var(${vars['button.default.height']}, 32px)`
        }
    },
    'avatar': {
        'default': {
            'width': `var(${vars['avatar.default.width']}, var(--skeleton-avatar-default-size, 40px))`
        }
    },
    'animation': {
        'pulse': {
            'animation-duration': `var(${vars['animation.pulse.animation-duration']}, var(--skeleton-animation-pulse-duration, 1600ms))`,
            'animation-timing-function': `var(${vars['animation.pulse.animation-timing-function']}, var(--skeleton-animation-pulse-easing, cubic-bezier(0.4, 0, 0.6, 1)))`,
            'minimum': {
                'opacity': `var(${vars['animation.pulse.minimum.opacity']}, var(--skeleton-animation-pulse-opacity-min, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5))))`
            },
            'maximum': {
                'opacity': `var(${vars['animation.pulse.maximum.opacity']}, var(--skeleton-animation-pulse-opacity-max, 1))`
            }
        },
        'wave': {
            'animation-duration': `var(${vars['animation.wave.animation-duration']}, var(--skeleton-animation-wave-duration, 1600ms))`,
            'animation-timing-function': `var(${vars['animation.wave.animation-timing-function']}, var(--skeleton-animation-wave-easing, cubic-bezier(0.4, 0, 0.2, 1)))`
        }
    }
});

export default token;
