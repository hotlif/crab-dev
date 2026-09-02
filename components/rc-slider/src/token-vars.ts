import { vars as generatedVars } from './token.js';

type LegacySliderKey =
    | 'rail.thickness'
    | 'rail.inactive.fill'
    | 'rail.active.fill'
    | 'thumb.radius'
    | 'thumb.stroke.color'
    | 'thumb.stroke.width'
    | 'thumb.halo.scale.factor';

/**
 * Public variable map. Canonical keys and the pre-migration Slider keys are
 * both retained until the next major version.
 */
export const TokenVars: typeof generatedVars & Readonly<Record<LegacySliderKey, string>> = {
    ...generatedVars,
    'rail.thickness': '--slider-rail-thickness',
    'rail.inactive.fill': '--slider-rail-inactive-fill',
    'rail.active.fill': '--slider-rail-active-fill',
    'thumb.radius': '--slider-thumb-radius',
    'thumb.stroke.color': '--slider-thumb-stroke-color',
    'thumb.stroke.width': '--slider-thumb-stroke-width',
    'thumb.halo.scale.factor': '--slider-thumb-halo-scale-factor',
};
