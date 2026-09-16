/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import { defineTokens } from '@crab-dev/css';

export const vars = defineTokens({
    'rail.interact.height': '--slider-rail-interact-height',
    'rail.height': '--slider-rail-height',
    'rail.fill-inactive': '--slider-rail-fill-inactive',
    'rail.fill-active': '--slider-rail-fill-active',
    'thumb.border-radius': '--slider-thumb-border-radius',
    'thumb.fill': '--slider-thumb-fill',
    'thumb.stroke-color': '--slider-thumb-stroke-color',
    'thumb.stroke-width': '--slider-thumb-stroke-width',
    'thumb.box-shadow': '--slider-thumb-box-shadow',
    'thumb.halo.scale.width': '--slider-thumb-halo-scale-width',
    'thumb.halo.fill': '--slider-thumb-halo-fill'
});

const token = defineTokens({
    'rail': {
        'interact': {
            'height': `var(${vars['rail.interact.height']}, 12px)`
        },
        'height': `var(${vars['rail.height']}, var(--slider-rail-thickness, 4px))`,
        'fill-inactive': `var(${vars['rail.fill-inactive']}, var(--slider-rail-inactive-fill, var(--token-semantic-color-fill-default, var(--token-semantic-color-fill-inactive, var(--token-global-zinc-300, oklch(0.840 0.008 286))))))`,
        'fill-active': `var(${vars['rail.fill-active']}, var(--slider-rail-active-fill, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078)))))`
    },
    'thumb': {
        'border-radius': `var(${vars['thumb.border-radius']}, var(--slider-thumb-radius, 8px))`,
        'fill': `var(${vars['thumb.fill']}, var(--token-semantic-color-background-surface, var(--token-global-white, oklch(1.000 0 0))))`,
        'stroke-color': `var(${vars['thumb.stroke-color']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`,
        'stroke-width': `var(${vars['thumb.stroke-width']}, 2.5px)`,
        'box-shadow': `var(${vars['thumb.box-shadow']}, var(--token-semantic-shadow-float, var(--token-global-shadow-md, 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1))))`,
        'halo': {
            'scale': {
                'width': `var(${vars['thumb.halo.scale.width']}, var(--slider-thumb-halo-scale-factor, 1.8))`
            },
            'fill': `var(${vars['thumb.halo.fill']}, var(--token-semantic-color-brand-primary, var(--token-global-purple-40, oklch(0.49552086 0.13045663 293.709078))))`
        }
    }
});

export default token;
