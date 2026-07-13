/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
    'ring.track-color': '--spin-ring-track-color',
    'ring.indicator-color': '--spin-ring-indicator-color',
    'ring.stroke-width': '--spin-ring-stroke-width',
    'ring.dash': '--spin-ring-dash',
    'motion.duration': '--spin-motion-duration',
    'motion.easing': '--spin-motion-easing',
    'motion.reduced-duration': '--spin-motion-reduced-duration',
    'motion.reduced-opacity': '--spin-motion-reduced-opacity',
    'motion.appear': '--spin-motion-appear',
    'size.small.size': '--spin-size-small-size',
    'size.small.font-size': '--spin-size-small-font-size',
    'size.middle.size': '--spin-size-middle-size',
    'size.middle.font-size': '--spin-size-middle-font-size',
    'size.large.size': '--spin-size-large-size',
    'size.large.font-size': '--spin-size-large-font-size',
    'tip.color': '--spin-tip-color',
    'tip.gap': '--spin-tip-gap',
    'content.opacity': '--spin-content-opacity',
    'content.blur': '--spin-content-blur',
    'overlay.z-index': '--spin-overlay-z-index'
};

const token = {
    'ring': {
        'track-color': `var(${vars['ring.track-color']}, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`,
        'indicator-color': `var(${vars['ring.indicator-color']}, var(--token-semantic-color-brand-primary, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
        'stroke-width': `var(${vars['ring.stroke-width']}, 4)`,
        'dash': `var(${vars['ring.dash']}, 31.4 125.7)`
    },
    'motion': {
        'duration': `var(${vars['motion.duration']}, 0.9s)`,
        'easing': `var(${vars['motion.easing']}, linear)`,
        'reduced-duration': `var(${vars['motion.reduced-duration']}, 1.6s)`,
        'reduced-opacity': `var(${vars['motion.reduced-opacity']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-30, 0.3)))`,
        'appear': `var(${vars['motion.appear']}, var(--token-semantic-motion-fade, var(--token-global-duration-normal, 200ms) var(--token-global-easing-default, cubic-bezier(0.4, 0, 0.2, 1))))`
    },
    'size': {
        'small': {
            'size': `var(${vars['size.small.size']}, 16px)`,
            'font-size': `var(${vars['size.small.font-size']}, var(--token-semantic-font-size-caption, var(--token-global-font-size-xs, 12px)))`
        },
        'middle': {
            'size': `var(${vars['size.middle.size']}, 24px)`,
            'font-size': `var(${vars['size.middle.font-size']}, var(--token-semantic-font-size-body, var(--token-global-font-size-sm, 14px)))`
        },
        'large': {
            'size': `var(${vars['size.large.size']}, 40px)`,
            'font-size': `var(${vars['size.large.font-size']}, var(--token-semantic-font-size-subhead, var(--token-global-font-size-md, 16px)))`
        }
    },
    'tip': {
        'color': `var(${vars['tip.color']}, var(--token-semantic-color-text-secondary, var(--token-global-zinc-500, oklch(0.660 0.014 286))))`,
        'gap': `var(${vars['tip.gap']}, var(--token-semantic-space-component-gap, var(--token-global-space-2, 8px)))`
    },
    'content': {
        'opacity': `var(${vars['content.opacity']}, var(--token-semantic-opacity-secondary, var(--token-global-opacity-50, 0.5)))`,
        'blur': `var(${vars['content.blur']}, 1px)`
    },
    'overlay': {
        'z-index': `var(${vars['overlay.z-index']}, var(--token-semantic-z-index-float, var(--token-global-z-index-10, 1000)))`
    }
};

export default token;
