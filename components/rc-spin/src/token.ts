/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'ring.track.stroke': '--spin-ring-track-stroke',
    'ring.indicator.stroke': '--spin-ring-indicator-stroke',
    'ring.stroke-width': '--spin-ring-stroke-width',
    'ring.stroke-dasharray': '--spin-ring-stroke-dasharray',
    'indicator.animation-duration': '--spin-indicator-animation-duration',
    'indicator.animation-timing-function': '--spin-indicator-animation-timing-function',
    'indicator.reduced-motion.animation-duration': '--spin-indicator-reduced-motion-animation-duration',
    'indicator.reduced-motion.opacity': '--spin-indicator-reduced-motion-opacity',
    'expressive.color': '--spin-expressive-color',
    'expressive.orbit.animation-duration': '--spin-expressive-orbit-animation-duration',
    'expressive.shape.animation-duration': '--spin-expressive-shape-animation-duration',
    'expressive.shape.animation-timing-function': '--spin-expressive-shape-animation-timing-function',
    'expressive.shape.top': '--spin-expressive-shape-top',
    'expressive.shape.left': '--spin-expressive-shape-left',
    'expressive.shape.width': '--spin-expressive-shape-width',
    'expressive.shape.height': '--spin-expressive-shape-height',
    'root.animation': '--spin-root-animation',
    'content.transition': '--spin-content-transition',
    'content.opacity': '--spin-content-opacity',
    'content.filter': '--spin-content-filter',
    'size.small.width': '--spin-size-small-width',
    'size.small.font-size': '--spin-size-small-font-size',
    'size.middle.width': '--spin-size-middle-width',
    'size.middle.font-size': '--spin-size-middle-font-size',
    'size.large.width': '--spin-size-large-width',
    'size.large.font-size': '--spin-size-large-font-size',
    'tip.color': '--spin-tip-color',
    'tip.gap': '--spin-tip-gap',
    'overlay.z-index': '--spin-overlay-z-index'
});

const token = defineTokens({
    'ring': {
        'track': {
            'stroke': `var(${vars['ring.track.stroke']}, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286)))))`
        },
        'indicator': {
            'stroke': `var(${vars['ring.indicator.stroke']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        },
        'stroke-width': `var(${vars['ring.stroke-width']}, 4)`,
        'stroke-dasharray': `var(${vars['ring.stroke-dasharray']}, 31.4 125.7)`
    },
    'indicator': {
        'animation-duration': `var(${vars['indicator.animation-duration']}, 0.9s)`,
        'animation-timing-function': `var(${vars['indicator.animation-timing-function']}, linear)`,
        'reduced-motion': {
            'animation-duration': `var(${vars['indicator.reduced-motion.animation-duration']}, 1.6s)`,
            'opacity': `var(${vars['indicator.reduced-motion.opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
        }
    },
    'expressive': {
        'color': `var(${vars['expressive.color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'orbit': {
            'animation-duration': `var(${vars['expressive.orbit.animation-duration']}, 1.6s)`
        },
        'shape': {
            'animation-duration': `var(${vars['expressive.shape.animation-duration']}, 1.2s)`,
            'animation-timing-function': `var(${vars['expressive.shape.animation-timing-function']}, var(--token-semantic-motion-easing-spatial-default, var(--token-global-easing-expressive-spatial-default, cubic-bezier(0.38, 1.21, 0.22, 1.00))))`,
            'top': `var(${vars['expressive.shape.top']}, 12.5%)`,
            'left': `var(${vars['expressive.shape.left']}, 12.5%)`,
            'width': `var(${vars['expressive.shape.width']}, 75%)`,
            'height': `var(${vars['expressive.shape.height']}, 75%)`
        }
    },
    'root': {
        'animation': `var(${vars['root.animation']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-expressive-effects-default, cubic-bezier(0.34, 0.80, 0.34, 1.00))))`
    },
    'content': {
        'transition': `var(${vars['content.transition']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-expressive-effects-default, cubic-bezier(0.34, 0.80, 0.34, 1.00))))`,
        'opacity': `var(${vars['content.opacity']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
        'filter': `var(${vars['content.filter']}, blur(1px))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, 16px)`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-typography-caption-font-size, var(--token-global-font-size-xs, 12px)))`
        },
        'middle': {
            'width': `var(${vars['size.middle.width']}, 24px)`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-typography-body-font-size, var(--token-global-font-size-md, 16px)))`
        },
        'large': {
            'width': `var(${vars['size.large.width']}, 40px)`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        }
    },
    'tip': {
        'color': `var(${vars['tip.color']}, var(--token-semantic-color-text-secondary, var(--token-global-material-neutral-variant-30, oklch(0.39805288 0.01735545 303.720936))))`,
        'gap': `var(${vars['tip.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'overlay': {
        'z-index': `var(${vars['overlay.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100)))`
    }
});

export default token;
