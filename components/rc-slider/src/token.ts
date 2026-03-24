/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

export const vars = {
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
};

const token = {
    'rail': {
        'interact': {
            'height': `var(${vars['rail.interact.height']}, 12px)`
        },
        'thickness': `var(${vars['rail.thickness']}, 4px)`,
        'inactive': {
            'fill': `var(${vars['rail.inactive.fill']}, #e5e7eb)`
        },
        'active': {
            'fill': `var(${vars['rail.active.fill']}, #3b82f6)`
        }
    },
    'thumb': {
        'radius': `var(${vars['thumb.radius']}, 8px)`,
        'fill': `var(${vars['thumb.fill']}, #ffffff)`,
        'stroke': {
            'color': `var(${vars['thumb.stroke.color']}, #3b82f6)`,
            'width': `var(${vars['thumb.stroke.width']}, 2.5px)`
        },
        'halo': {
            'scale': {
                'factor': `var(${vars['thumb.halo.scale.factor']}, 1.8)`
            },
            'fill': `var(${vars['thumb.halo.fill']}, #3b82f6)`
        }
    }
};

export default token;
