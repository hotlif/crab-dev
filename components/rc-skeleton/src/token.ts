/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'color.background': '--skeleton-color-background',
    'color.highlight': '--skeleton-color-highlight',
    'radius.default': '--skeleton-radius-default',
    'radius.text': '--skeleton-radius-text',
    'radius.pill': '--skeleton-radius-pill',
    'text.size.small.height': '--skeleton-text-size-small-height',
    'text.size.medium.height': '--skeleton-text-size-medium-height',
    'text.size.large.height': '--skeleton-text-size-large-height',
    'text.rows.gap': '--skeleton-text-rows-gap',
    'text.last-row.width': '--skeleton-text-last-row-width',
    'rect.default.width': '--skeleton-rect-default-width',
    'rect.default.height': '--skeleton-rect-default-height',
    'circle.default.size': '--skeleton-circle-default-size',
    'button.default.width': '--skeleton-button-default-width',
    'button.default.height': '--skeleton-button-default-height',
    'avatar.default.size': '--skeleton-avatar-default-size',
    'animation.pulse.duration': '--skeleton-animation-pulse-duration',
    'animation.pulse.easing': '--skeleton-animation-pulse-easing',
    'animation.pulse.opacity-min': '--skeleton-animation-pulse-opacity-min',
    'animation.pulse.opacity-max': '--skeleton-animation-pulse-opacity-max',
    'animation.wave.duration': '--skeleton-animation-wave-duration',
    'animation.wave.easing': '--skeleton-animation-wave-easing'
};

const token = {
    'color': {
        'background': `var(${vars['color.background']}, var(--token-semantic-color-background-hover-subtle, var(--token-global-zinc-100, oklch(0.950 0.003 286))))`,
        'highlight': `var(${vars['color.highlight']}, var(--token-semantic-color-background-active-subtle, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
    },
    'radius': {
        'default': `var(${vars['radius.default']}, var(--token-semantic-radius-md, var(--token-global-radius-3, 6px)))`,
        'text': `var(${vars['radius.text']}, var(--token-semantic-radius-sm, var(--token-global-radius-1, 2px)))`,
        'pill': `var(${vars['radius.pill']}, var(--token-semantic-radius-pill, var(--token-global-radius-full, 9999px)))`
    },
    'text': {
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
    'rect': {
        'default': {
            'width': `var(${vars['rect.default.width']}, 100%)`,
            'height': `var(${vars['rect.default.height']}, 120px)`
        }
    },
    'circle': {
        'default': {
            'size': `var(${vars['circle.default.size']}, 40px)`
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
            'size': `var(${vars['avatar.default.size']}, 40px)`
        }
    },
    'animation': {
        'pulse': {
            'duration': `var(${vars['animation.pulse.duration']}, 1600ms)`,
            'easing': `var(${vars['animation.pulse.easing']}, cubic-bezier(0.4, 0, 0.6, 1))`,
            'opacity-min': `var(${vars['animation.pulse.opacity-min']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
            'opacity-max': `var(${vars['animation.pulse.opacity-max']}, 1)`
        },
        'wave': {
            'duration': `var(${vars['animation.wave.duration']}, 1600ms)`,
            'easing': `var(${vars['animation.wave.easing']}, cubic-bezier(0.4, 0, 0.2, 1))`
        }
    }
};

export default token;
