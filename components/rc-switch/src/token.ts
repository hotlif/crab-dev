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
    'size.middle.track.width': '--switch-size-middle-track-width',
    'size.middle.track.height': '--switch-size-middle-track-height',
    'size.middle.track.border-radius': '--switch-size-middle-track-border-radius',
    'size.middle.handle.width': '--switch-size-middle-handle-width',
    'size.middle.handle.left': '--switch-size-middle-handle-left',
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
    'handle.background-color-disabled': '--switch-handle-background-color-disabled',
    'handle.unchecked.scale': '--switch-handle-unchecked-scale',
    'handle.pressed.scale': '--switch-handle-pressed-scale',
    'handle.interactive.background-color': '--switch-handle-interactive-background-color'
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
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-typography-body-large-line-height, var(--token-global-line-height-16-24, 1.5)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`,
        'transition': `var(${vars['root.transition']}, transform var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), translate var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), scale var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), background-color var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))), box-shadow var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    },
    'track': {
        'border-width': `var(${vars['track.border-width']}, 2px)`,
        'background-color': `var(${vars['track.background-color']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'background-color-hover': `var(${vars['track.background-color-hover']}, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))))`,
        'background-color-checked': `var(${vars['track.background-color-checked']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'checked': {
            'background-color-hover': `var(${vars['track.checked.background-color-hover']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'background-color-disabled': `var(${vars['track.checked.background-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 12%, transparent))`,
            'state-layer': {
                'background-color-hover': `var(${vars['track.checked.state-layer.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), transparent))`,
                'background-color-active': `var(${vars['track.checked.state-layer.background-color-active']}, color-mix(in oklch, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`
            }
        },
        'background-color-disabled': `var(${vars['track.background-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-surface-highest, var(--token-global-material-neutral-90, oklch(0.91401081 0.01366394 314.754144))) 12%, transparent))`,
        'border-color-disabled': `var(${vars['track.border-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) 12%, transparent))`,
        'border-color': `var(${vars['track.border-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'state-layer': {
            'background-color-hover': `var(${vars['track.state-layer.background-color-hover']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)) * 100%), transparent))`,
            'background-color-active': `var(${vars['track.state-layer.background-color-active']}, color-mix(in oklch, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-state-opacity-pressed, var(--token-global-opacity-12, 0.12)) * 100%), transparent))`
        },
        'halo': {
            'width': `var(${vars['track.halo.width']}, 40px)`,
            'left': `var(${vars['track.halo.left']}, -4px)`,
            'translate-checked': `var(${vars['track.halo.translate-checked']}, 20px)`
        }
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font-size': `var(${vars['label.font-size']}, var(--token-semantic-typography-body-large-font-size, var(--token-global-font-size-md, 16px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))))`
    },
    'size': {
        'large': {
            'track': {
                'width': `var(${vars['size.large.track.width']}, 52px)`,
                'height': `var(${vars['size.large.track.height']}, 32px)`,
                'border-radius': `var(${vars['size.large.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.large.handle.width']}, 24px)`,
                'left': `var(${vars['size.large.handle.left']}, 4px)`
            }
        },
        'middle': {
            'track': {
                'width': `var(${vars['size.middle.track.width']}, 52px)`,
                'height': `var(${vars['size.middle.track.height']}, 32px)`,
                'border-radius': `var(${vars['size.middle.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.middle.handle.width']}, 24px)`,
                'left': `var(${vars['size.middle.handle.left']}, 4px)`
            }
        },
        'small': {
            'track': {
                'width': `var(${vars['size.small.track.width']}, 52px)`,
                'height': `var(${vars['size.small.track.height']}, 32px)`,
                'border-radius': `var(${vars['size.small.track.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`
            },
            'handle': {
                'width': `var(${vars['size.small.handle.width']}, 24px)`,
                'left': `var(${vars['size.small.handle.left']}, 4px)`
            }
        }
    },
    'handle': {
        'background-color': `var(${vars['handle.background-color']}, var(--token-semantic-color-border-default, var(--token-global-material-neutral-variant-50, oklch(0.56674707 0.01627446 308.142182))))`,
        'checked': {
            'background-color': `var(${vars['handle.checked.background-color']}, var(--switch-handle-background-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0)))))`,
            'background-color-disabled': `var(${vars['handle.checked.background-color-disabled']}, var(--token-semantic-color-surface-content, var(--token-semantic-color-background-surface, var(--token-global-material-neutral-98, oklch(0.98379491 0.01284496 321.893957)))))`,
            'interactive': {
                'background-color': `var(${vars['handle.checked.interactive.background-color']}, var(--token-semantic-color-brand-container, var(--token-semantic-color-selection-background, var(--token-global-purple-90, oklch(0.91829316 0.04770250 302.827510)))))`
            }
        },
        'box-shadow': `var(${vars['handle.box-shadow']}, none)`,
        'background-color-disabled': `var(${vars['handle.background-color-disabled']}, color-mix(in srgb, var(--token-semantic-color-text-primary, var(--token-global-material-neutral-10, oklch(0.22652446 0.00999107 303.713695))) calc(var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)) * 100%), transparent))`,
        'unchecked': {
            'scale': `var(${vars['handle.unchecked.scale']}, 0.666667)`
        },
        'pressed': {
            'scale': `var(${vars['handle.pressed.scale']}, 1.166667)`
        },
        'interactive': {
            'background-color': `var(${vars['handle.interactive.background-color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`
        }
    }
});

export default token;
