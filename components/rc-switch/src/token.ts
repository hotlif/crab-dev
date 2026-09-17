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
    'track.background-color-disabled': '--switch-track-background-color-disabled',
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
    'handle.box-shadow': '--switch-handle-box-shadow',
    'handle.background-color-disabled': '--switch-handle-background-color-disabled'
});

const token = defineTokens({
    'root': {
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 2px)`,
        'touch': {
            'min-width': `var(${vars['root.touch.min-width']}, 44px)`,
            'min-height': `var(${vars['root.touch.min-height']}, 44px)`
        },
        'line-height': `var(${vars['root.line-height']}, var(--token-semantic-font-line-height-body, var(--token-global-line-height-normal, 1.5)))`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`,
        'transition': `var(${vars['root.transition']}, var(--switch-transition, transform var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), background-color var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1))), box-shadow var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`
    },
    'track': {
        'border-width': `var(${vars['track.border-width']}, 1px)`,
        'background-color': `var(${vars['track.background-color']}, var(--token-semantic-color-control-track, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'background-color-hover': `var(${vars['track.background-color-hover']}, var(--token-semantic-color-control-track-hover, var(--token-global-zinc-600, oklch(0.550 0.014 286))))`,
        'background-color-checked': `var(${vars['track.background-color-checked']}, var(--switch-checked-track-background-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'checked': {
            'background-color-hover': `var(${vars['track.checked.background-color-hover']}, var(--switch-checked-track-background-color-hover, var(--token-semantic-color-brand-primary-hover, var(--token-global-purple-30, oklch(0.41029262 0.13369038 292.705951)))))`,
            'background-color-disabled': `var(${vars['track.checked.background-color-disabled']}, var(--switch-disabled-checked-track-background-color, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`
        },
        'background-color-disabled': `var(${vars['track.background-color-disabled']}, var(--switch-disabled-track-background-color, var(--token-semantic-color-background-disabled, var(--token-global-zinc-100, oklch(0.950 0.003 286)))))`
    },
    'label': {
        'gap': `var(${vars['label.gap']}, var(--token-semantic-space-inline-gap, var(--token-global-space-1, 4px)))`,
        'font-size': `var(${vars['label.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`,
        'color': `var(${vars['label.color']}, var(--token-semantic-color-text-primary, var(--token-global-zinc-950, oklch(0.140 0.004 286))))`,
        'color-disabled': `var(${vars['label.color-disabled']}, var(--token-semantic-color-text-disabled, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`
    },
    'size': {
        'large': {
            'track': {
                'width': `var(${vars['size.large.track.width']}, 52px)`,
                'height': `var(${vars['size.large.track.height']}, 28px)`,
                'border-radius': `var(${vars['size.large.track.border-radius']}, 14px)`
            },
            'handle': {
                'width': `var(${vars['size.large.handle.width']}, var(--switch-size-large-handle-size, 24px))`,
                'left': `var(${vars['size.large.handle.left']}, var(--switch-size-large-handle-offset, 2px))`
            }
        },
        'middle': {
            'track': {
                'width': `var(${vars['size.middle.track.width']}, 44px)`,
                'height': `var(${vars['size.middle.track.height']}, 22px)`,
                'border-radius': `var(${vars['size.middle.track.border-radius']}, 11px)`
            },
            'handle': {
                'width': `var(${vars['size.middle.handle.width']}, var(--switch-size-middle-handle-size, 18px))`,
                'left': `var(${vars['size.middle.handle.left']}, var(--switch-size-middle-handle-offset, 2px))`
            }
        },
        'small': {
            'track': {
                'width': `var(${vars['size.small.track.width']}, 28px)`,
                'height': `var(${vars['size.small.track.height']}, 16px)`,
                'border-radius': `var(${vars['size.small.track.border-radius']}, 8px)`
            },
            'handle': {
                'width': `var(${vars['size.small.handle.width']}, var(--switch-size-small-handle-size, 12px))`,
                'left': `var(${vars['size.small.handle.left']}, var(--switch-size-small-handle-offset, 2px))`
            }
        }
    },
    'handle': {
        'background-color': `var(${vars['handle.background-color']}, var(--token-semantic-color-control-thumb, var(--token-global-white, oklch(1.000 0 0))))`,
        'checked': {
            'background-color': `var(${vars['handle.checked.background-color']}, var(--switch-handle-background-color, var(--token-semantic-color-text-on-brand, var(--token-global-white, oklch(1.000 0 0)))))`
        },
        'box-shadow': `var(${vars['handle.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
        'background-color-disabled': `var(${vars['handle.background-color-disabled']}, var(--switch-disabled-handle-background-color, var(--token-semantic-color-control-thumb, var(--token-global-white, oklch(1.000 0 0)))))`
    }
});

export default token;
