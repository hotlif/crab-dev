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
            'stroke': `var(${vars['ring.track.stroke']}, var(--spin-ring-track-color, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286))))))`
        },
        'indicator': {
            'stroke': `var(${vars['ring.indicator.stroke']}, var(--spin-ring-indicator-color, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
        },
        'stroke-width': `var(${vars['ring.stroke-width']}, 4)`,
        'stroke-dasharray': `var(${vars['ring.stroke-dasharray']}, var(--spin-ring-dash, 31.4 125.7))`
    },
    'indicator': {
        'animation-duration': `var(${vars['indicator.animation-duration']}, var(--spin-motion-duration, 0.9s))`,
        'animation-timing-function': `var(${vars['indicator.animation-timing-function']}, var(--spin-motion-easing, linear))`,
        'reduced-motion': {
            'animation-duration': `var(${vars['indicator.reduced-motion.animation-duration']}, var(--spin-motion-reduced-duration, 1.6s))`,
            'opacity': `var(${vars['indicator.reduced-motion.opacity']}, var(--spin-motion-reduced-opacity, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3))))`
        }
    },
    'root': {
        'animation': `var(${vars['root.animation']}, var(--spin-motion-appear, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`
    },
    'content': {
        'transition': `var(${vars['content.transition']}, var(--spin-motion-appear, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-out, cubic-bezier(0, 0, 0.2, 1)))))`,
        'opacity': `var(${vars['content.opacity']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
        'filter': `var(${vars['content.filter']}, blur(var(--spin-content-blur, 1px)))`
    },
    'size': {
        'small': {
            'width': `var(${vars['size.small.width']}, var(--spin-size-small-size, 16px))`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        },
        'middle': {
            'width': `var(${vars['size.middle.width']}, var(--spin-size-middle-size, 24px))`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'large': {
            'width': `var(${vars['size.large.width']}, var(--spin-size-large-size, 40px))`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        }
    },
    'tip': {
        'color': `var(${vars['tip.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-700, oklch(0.430 0.012 286))))`,
        'gap': `var(${vars['tip.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'overlay': {
        'z-index': `var(${vars['overlay.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-20, 1100)))`
    }
});

export default token;
