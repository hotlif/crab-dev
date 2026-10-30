/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'root.outline-color-focus': '--switch-root-outline-color-focus',
    'root.outline-width-focus': '--switch-root-outline-width-focus',
    'root.outline-offset-focus': '--switch-root-outline-offset-focus',
    'root.touch.min-width': '--switch-root-touch-min-width',
    'root.touch.min-height': '--switch-root-touch-min-height',
    'root.line-height': '--switch-root-line-height',
    'root.font-family': '--switch-root-font-family',
    'root.min-height': '--switch-root-min-height',
    'root.opacity-disabled': '--switch-root-opacity-disabled',
    'root.transition': '--switch-root-transition',
    'track.border-width': '--switch-track-border-width',
    'track.background-color': '--switch-track-background-color',
    'track.background-color-hover': '--switch-track-background-color-hover',
    'track.background-color-checked': '--switch-track-background-color-checked',
    'track.checked.background-color-hover': '--switch-track-checked-background-color-hover',
    'track.checked.background-color-disabled': '--switch-track-checked-background-color-disabled',
    'track.checked.state-layer.background-color-hover': '--switch-track-checked-state-layer-background-color-hover',
    'track.checked.state-layer.background-color-active': '--switch-track-checked-state-layer-background-color-active',
    'track.background-color-disabled': '--switch-track-background-color-disabled',
    'track.border-color-disabled': '--switch-track-border-color-disabled',
    'track.border-color': '--switch-track-border-color',
    'track.border-color-error': '--switch-track-border-color-error',
    'track.background-color-error': '--switch-track-background-color-error',
    'track.state-layer.background-color-hover': '--switch-track-state-layer-background-color-hover',
    'track.state-layer.background-color-active': '--switch-track-state-layer-background-color-active',
    'track.halo.width': '--switch-track-halo-width',
    'track.halo.left': '--switch-track-halo-left',
    'track.halo.translate-checked': '--switch-track-halo-translate-checked',
    'label.gap': '--switch-label-gap',
    'label.font-size': '--switch-label-font-size',
    'label.color': '--switch-label-color',
    'label.color-disabled': '--switch-label-color-disabled',
    'size.large.track.width': '--switch-size-large-track-width',
    'size.large.track.height': '--switch-size-large-track-height',
    'size.large.track.border-radius': '--switch-size-large-track-border-radius',
    'size.large.handle.width': '--switch-size-large-handle-width',
    'size.large.handle.left': '--switch-size-large-handle-left',
    'size.medium.track.width': '--switch-size-medium-track-width',
    'size.medium.track.height': '--switch-size-medium-track-height',
    'size.medium.track.border-radius': '--switch-size-medium-track-border-radius',
    'size.medium.handle.width': '--switch-size-medium-handle-width',
    'size.medium.handle.left': '--switch-size-medium-handle-left',
    'size.small.track.width': '--switch-size-small-track-width',
    'size.small.track.height': '--switch-size-small-track-height',
    'size.small.track.border-radius': '--switch-size-small-track-border-radius',
    'size.small.handle.width': '--switch-size-small-handle-width',
    'size.small.handle.left': '--switch-size-small-handle-left',
    'handle.background-color': '--switch-handle-background-color',
    'handle.checked.background-color': '--switch-handle-checked-background-color',
    'handle.checked.background-color-disabled': '--switch-handle-checked-background-color-disabled',
    'handle.checked.interactive.background-color': '--switch-handle-checked-interactive-background-color',
    'handle.box-shadow': '--switch-handle-box-shadow',
    'handle.unchecked.border-width': '--switch-handle-unchecked-border-width',
    'handle.unchecked.border-color': '--switch-handle-unchecked-border-color',
    'handle.unchecked.scale': '--switch-handle-unchecked-scale',
    'handle.background-color-disabled': '--switch-handle-background-color-disabled',
    'handle.pressed.scale': '--switch-handle-pressed-scale',
    'handle.interactive.background-color': '--switch-handle-interactive-background-color',
    'handle.background-color-error': '--switch-handle-background-color-error'
});

const token = defineTokens({
    'root': {
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'touch': {
            'min-width': `var(${vars['root.touch.min-width']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
            'min-height': `var(${vars['root.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-medium-line-height, var(--token-global-line-height-14-20, 1.4285714285714286)))`,
        'font-family': `var(${vars['root.font-family']}, var(--token-semantic-typography-body-font-family, var(--token-global-font-family-material, 'Roboto', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei UI', sans-serif)))`,
        'min-height': `var(${vars['root.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'transition': `var(${vars['root.transition']}, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), translate var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), scale var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    },
    'track': {
        'border-width': `var(${vars['track.border-width']}, var(--token-semantic-border-toggle-width, var(--token-global-space-0-5, 2px)))`,
        'background-color': `var(${vars['track.background-color']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'background-color-hover': `var(${vars['track.background-color-hover']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'background-color-checked': `var(${vars['track.background-color-checked']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'checked': {
            'background-color-hover': `var(${vars['track.checked.background-color-hover']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'background-color-disabled': `var(${vars['track.checked.background-color-disabled']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-toggle-disabled-track-opacity, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`,
            'state-layer': {
                'background-color-hover': `var(${vars['track.checked.state-layer.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), transparent))`,
                'background-color-active': `var(${vars['track.checked.state-layer.background-color-active']}, color-mix(in oklch, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`
            }
        },
        'background-color-disabled': `var(${vars['track.background-color-disabled']}, color-mix(in oklch, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))) calc(var(--token-semantic-toggle-disabled-track-opacity, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`,
        'border-color-disabled': `var(${vars['track.border-color-disabled']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-toggle-disabled-track-opacity, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`,
        'border-color': `var(${vars['track.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'border-color-error': `var(${vars['track.border-color-error']}, var(--token-semantic-color-border-error, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'background-color-error': `var(${vars['track.background-color-error']}, var(--token-semantic-color-feedback-error-solid, var(--token-global-material-error-40, oklch(0.50128208 0.17831791 28.704727))))`,
        'state-layer': {
            'background-color-hover': `var(${vars['track.state-layer.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), transparent))`,
            'background-color-active': `var(${vars['track.state-layer.background-color-active']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`
        },
        'halo': {
            'width': `var(${vars['track.halo.width']}, var(--token-semantic-size-toggle-state-layer, var(--token-global-size-40, 40px)))`,
            'left': `var(${vars['track.halo.left']}, -5px)`,
            'translate-checked': `var(${vars['track.halo.translate-checked']}, 14px)`
        }
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font-size': `var(${vars['label.font-size']}, var(--token-semantic-typography-body-medium-font-size, var(--token-global-font-size-sm, 14px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'size': {
        'large': {
            'track': {
                'width': `var(${vars['size.large.track.width']}, var(--token-semantic-sizing-large-toggle-track-width, var(--token-global-size-52, 52px)))`,
                'height': `var(${vars['size.large.track.height']}, var(--token-semantic-sizing-large-toggle-track-height, var(--token-global-size-32, 32px)))`,
                'border-radius': `var(${vars['size.large.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.large.handle.width']}, var(--token-semantic-sizing-large-toggle-handle-width, var(--token-global-space-6, 24px)))`,
                'left': `var(${vars['size.large.handle.left']}, var(--token-semantic-sizing-large-toggle-handle-inset, var(--token-global-space-1, 4px)))`
            }
        },
        'medium': {
            'track': {
                'width': `var(${vars['size.medium.track.width']}, var(--token-semantic-sizing-medium-toggle-track-width, var(--token-global-size-52, 52px)))`,
                'height': `var(${vars['size.medium.track.height']}, var(--token-semantic-sizing-medium-toggle-track-height, var(--token-global-size-32, 32px)))`,
                'border-radius': `var(${vars['size.medium.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.medium.handle.width']}, var(--token-semantic-sizing-medium-toggle-handle-width, var(--token-global-space-6, 24px)))`,
                'left': `var(${vars['size.medium.handle.left']}, var(--token-semantic-sizing-medium-toggle-handle-inset, var(--token-global-space-1, 4px)))`
            }
        },
        'small': {
            'track': {
                'width': `var(${vars['size.small.track.width']}, var(--token-semantic-sizing-small-toggle-track-width, var(--token-global-space-7, 28px)))`,
                'height': `var(${vars['size.small.track.height']}, var(--token-semantic-sizing-small-toggle-track-height, var(--token-global-space-4, 16px)))`,
                'border-radius': `var(${vars['size.small.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.small.handle.width']}, var(--token-semantic-sizing-small-toggle-handle-width, var(--token-global-space-3, 12px)))`,
                'left': `var(${vars['size.small.handle.left']}, var(--token-semantic-sizing-small-toggle-handle-inset, var(--token-global-space-0-5, 2px)))`
            }
        }
    },
    'handle': {
        'background-color': `var(${vars['handle.background-color']}, var(--token-semantic-color-control-toggle-thumb, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'checked': {
            'background-color': `var(${vars['handle.checked.background-color']}, var(--token-semantic-toggle-handle-selected-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0)))))`,
            'background-color-disabled': `var(${vars['handle.checked.background-color-disabled']}, var(--token-semantic-toggle-disabled-selected-handle-color, var(--token-semantic-color-surface-content, var(--token-global-white, oklch(1.000 0 0)))))`,
            'interactive': {
                'background-color': `var(${vars['handle.checked.interactive.background-color']}, var(--token-semantic-toggle-handle-selected-interactive-color, var(--token-semantic-color-brand-container, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510)))))`
            }
        },
        'box-shadow': `var(${vars['handle.box-shadow']}, var(--token-semantic-toggle-handle-shadow, var(--token-global-shadow-none, none)))`,
        'unchecked': {
            'border-width': `var(${vars['handle.unchecked.border-width']}, var(--token-semantic-toggle-handle-unchecked-border-width, var(--token-global-space-0, 0px)))`,
            'border-color': `var(${vars['handle.unchecked.border-color']}, var(--token-semantic-toggle-handle-unchecked-border-color, var(--token-semantic-color-border-strong, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182)))))`,
            'scale': `var(${vars['handle.unchecked.scale']}, var(--token-semantic-toggle-handle-unchecked-scale, 0.666667))`
        },
        'background-color-disabled': `var(${vars['handle.background-color-disabled']}, var(--token-semantic-toggle-disabled-handle-color, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 38%, transparent)))`,
        'pressed': {
            'scale': `var(${vars['handle.pressed.scale']}, var(--token-semantic-toggle-handle-pressed-scale, 1.166667))`
        },
        'interactive': {
            'background-color': `var(${vars['handle.interactive.background-color']}, var(--token-semantic-toggle-handle-interactive-color, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936)))))`
        },
        'background-color-error': `var(${vars['handle.background-color-error']}, var(--token-semantic-color-feedback-error-on-solid, var(--token-global-material-error-100, oklch(0.99999999 0.00000004 0))))`
    }
});

export default token;
