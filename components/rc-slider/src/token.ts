/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'rail.interact.height': '--slider-rail-interact-height',
    'rail.thickness': '--slider-rail-thickness',
    'rail.inactive.fill': '--slider-rail-inactive-fill',
    'rail.active.fill': '--slider-rail-active-fill',
    'thumb.radius': '--slider-thumb-radius',
    'thumb.fill': '--slider-thumb-fill',
    'thumb.stroke.color': '--slider-thumb-stroke-color',
    'thumb.stroke.width': '--slider-thumb-stroke-width',
    'thumb.halo.scale.factor': '--slider-thumb-halo-scale-factor',
    'thumb.halo.fill': '--slider-thumb-halo-fill'
});

const token = defineTokens({
    'rail': {
        'interact': {
            'height': `var(${vars['rail.interact.height']}, 12px)`
        },
        'thickness': `var(${vars['rail.thickness']}, 4px)`,
        'inactive': {
            'fill': `var(${vars['rail.inactive.fill']}, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-200, oklch(0.900 0.004 286))))`
        },
        'active': {
            'fill': `var(${vars['rail.active.fill']}, var(--token-semantic-color-fill-active, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        }
    },
    'thumb': {
        'radius': `var(${vars['thumb.radius']}, 8px)`,
        'fill': `var(${vars['thumb.fill']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'stroke': {
            'color': `var(${vars['thumb.stroke.color']}, var(--token-semantic-color-fill-active, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`,
            'width': `var(${vars['thumb.stroke.width']}, 2.5px)`
        },
        'halo': {
            'scale': {
                'factor': `var(${vars['thumb.halo.scale.factor']}, 1.8)`
            },
            'fill': `var(${vars['thumb.halo.fill']}, var(--token-semantic-color-fill-active, var(--token-global-zinc-900, oklch(0.220 0.005 286))))`
        }
    }
});

export default token;
