/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'rail.interact.height': '--slider-rail-interact-height',
    'rail.height': '--slider-rail-height',
    'rail.fill-inactive': '--slider-rail-fill-inactive',
    'rail.fill-active': '--slider-rail-fill-active',
    'rail.gap': '--slider-rail-gap',
    'rail.border-radius': '--slider-rail-border-radius',
    'rail.inner.border-radius': '--slider-rail-inner-border-radius',
    'thumb.border-radius': '--slider-thumb-border-radius',
    'thumb.fill': '--slider-thumb-fill',
    'thumb.stroke-color': '--slider-thumb-stroke-color',
    'thumb.stroke-width': '--slider-thumb-stroke-width',
    'thumb.box-shadow': '--slider-thumb-box-shadow',
    'thumb.halo.scale.width': '--slider-thumb-halo-scale-width',
    'thumb.halo.fill': '--slider-thumb-halo-fill',
    'thumb.halo.opacity-hover': '--slider-thumb-halo-opacity-hover',
    'thumb.halo.opacity-focus': '--slider-thumb-halo-opacity-focus',
    'thumb.halo.opacity-dragging': '--slider-thumb-halo-opacity-dragging',
    'thumb.halo.width': '--slider-thumb-halo-width',
    'thumb.width': '--slider-thumb-width',
    'thumb.height': '--slider-thumb-height',
    'thumb.width-active': '--slider-thumb-width-active',
    'thumb.transition': '--slider-thumb-transition',
    'root.transition': '--slider-root-transition',
    'root.touch.min-height': '--slider-root-touch-min-height',
    'root.outline-color-focus': '--slider-root-outline-color-focus',
    'root.outline-width-focus': '--slider-root-outline-width-focus',
    'root.outline-offset-focus': '--slider-root-outline-offset-focus',
    'root.opacity-disabled': '--slider-root-opacity-disabled',
    'stop.width': '--slider-stop-width',
    'stop.background-color': '--slider-stop-background-color',
    'size.xs.track.height': '--slider-size-xs-track-height',
    'size.xs.track.border-radius': '--slider-size-xs-track-border-radius',
    'size.xs.thumb.height': '--slider-size-xs-thumb-height',
    'size.s.track.height': '--slider-size-s-track-height',
    'size.s.track.border-radius': '--slider-size-s-track-border-radius',
    'size.s.thumb.height': '--slider-size-s-thumb-height',
    'size.m.track.height': '--slider-size-m-track-height',
    'size.m.track.border-radius': '--slider-size-m-track-border-radius',
    'size.m.thumb.height': '--slider-size-m-thumb-height',
    'size.l.track.height': '--slider-size-l-track-height',
    'size.l.track.border-radius': '--slider-size-l-track-border-radius',
    'size.l.thumb.height': '--slider-size-l-thumb-height',
    'size.xl.track.height': '--slider-size-xl-track-height',
    'size.xl.track.border-radius': '--slider-size-xl-track-border-radius',
    'size.xl.thumb.height': '--slider-size-xl-thumb-height'
});

const token = defineTokens({
    'rail': {
        'interact': {
            'height': `var(${vars['rail.interact.height']}, var(--token-semantic-size-48, var(--token-global-size-48, 48px)))`
        },
        'height': `var(${vars['rail.height']}, 16px)`,
        'fill-inactive': `var(${vars['rail.fill-inactive']}, var(--token-semantic-color-secondary-container, var(--token-global-material-secondary-90, oklch(0.91633372 0.03651492 303.106047))))`,
        'fill-active': `var(${vars['rail.fill-active']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'gap': `var(${vars['rail.gap']}, 6px)`,
        'border-radius': `var(${vars['rail.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`,
        'inner': {
            'border-radius': `var(${vars['rail.inner.border-radius']}, 2px)`
        }
    },
    'thumb': {
        'border-radius': `var(${vars['thumb.border-radius']}, var(--token-semantic-shape-full, var(--token-global-radius-full, 9999px)))`,
        'fill': `var(${vars['thumb.fill']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'stroke-color': `var(${vars['thumb.stroke-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'stroke-width': `var(${vars['thumb.stroke-width']}, 0px)`,
        'box-shadow': `var(${vars['thumb.box-shadow']}, none)`,
        'halo': {
            'scale': {
                'width': `var(${vars['thumb.halo.scale.width']}, 1.8)`
            },
            'fill': `var(${vars['thumb.halo.fill']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
            'opacity-hover': `var(${vars['thumb.halo.opacity-hover']}, var(--token-semantic-state-opacity-hover, var(--token-global-opacity-8, 0.08)))`,
            'opacity-focus': `var(${vars['thumb.halo.opacity-focus']}, var(--token-semantic-state-opacity-focus, var(--token-global-opacity-12, 0.12)))`,
            'opacity-dragging': `var(${vars['thumb.halo.opacity-dragging']}, var(--token-semantic-state-opacity-dragged, var(--token-global-opacity-16, 0.16)))`,
            'width': `var(${vars['thumb.halo.width']}, 40px)`
        },
        'width': `var(${vars['thumb.width']}, 4px)`,
        'height': `var(${vars['thumb.height']}, 44px)`,
        'width-active': `var(${vars['thumb.width-active']}, 2px)`,
        'transition': `var(${vars['thumb.transition']}, width var(--token-semantic-motion-spatial-fast, var(--token-global-duration-350, 350ms) var(--token-global-easing-expressive-spatial-fast, cubic-bezier(0.42, 1.67, 0.21, 0.90))), background-color var(--token-semantic-motion-effects-fast, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`
    },
    'root': {
        'transition': `var(${vars['root.transition']}, var(--token-semantic-motion-interaction, var(--token-global-duration-150, 150ms) var(--token-global-easing-expressive-effects-fast, cubic-bezier(0.31, 0.94, 0.34, 1.00))))`,
        'touch': {
            'min-height': `var(${vars['root.touch.min-height']}, var(--token-semantic-size-touch-target, var(--token-global-size-48, 48px)))`
        },
        'outline-color-focus': `var(${vars['root.outline-color-focus']}, var(--token-semantic-color-focus-ring, var(--token-semantic-color-border-focus, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`,
        'outline-width-focus': `var(${vars['root.outline-width-focus']}, 2px)`,
        'outline-offset-focus': `var(${vars['root.outline-offset-focus']}, 3px)`,
        'opacity-disabled': `var(${vars['root.opacity-disabled']}, var(--token-semantic-opacity-disabled, var(--token-global-opacity-38, 0.38)))`
    },
    'stop': {
        'width': `var(${vars['stop.width']}, 4px)`,
        'background-color': `var(${vars['stop.background-color']}, var(--token-semantic-color-secondary-on-container, var(--token-global-material-secondary-10, oklch(0.22720107 0.03472821 293.650491))))`
    },
    'size': {
        'xs': {
            'track': {
                'height': `var(${vars['size.xs.track.height']}, 16px)`,
                'border-radius': `var(${vars['size.xs.track.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`
            },
            'thumb': {
                'height': `var(${vars['size.xs.thumb.height']}, 44px)`
            }
        },
        's': {
            'track': {
                'height': `var(${vars['size.s.track.height']}, 24px)`,
                'border-radius': `var(${vars['size.s.track.border-radius']}, var(--token-semantic-shape-small, var(--token-global-radius-4, 8px)))`
            },
            'thumb': {
                'height': `var(${vars['size.s.thumb.height']}, 44px)`
            }
        },
        'm': {
            'track': {
                'height': `var(${vars['size.m.track.height']}, 40px)`,
                'border-radius': `var(${vars['size.m.track.border-radius']}, var(--token-semantic-shape-medium, var(--token-global-radius-6, 12px)))`
            },
            'thumb': {
                'height': `var(${vars['size.m.thumb.height']}, 52px)`
            }
        },
        'l': {
            'track': {
                'height': `var(${vars['size.l.track.height']}, 56px)`,
                'border-radius': `var(${vars['size.l.track.border-radius']}, var(--token-semantic-shape-large, var(--token-global-radius-8, 16px)))`
            },
            'thumb': {
                'height': `var(${vars['size.l.thumb.height']}, 68px)`
            }
        },
        'xl': {
            'track': {
                'height': `var(${vars['size.xl.track.height']}, 96px)`,
                'border-radius': `var(${vars['size.xl.track.border-radius']}, var(--token-semantic-shape-extra-large, var(--token-global-radius-14, 28px)))`
            },
            'thumb': {
                'height': `var(${vars['size.xl.thumb.height']}, 108px)`
            }
        }
    }
});

export default token;
