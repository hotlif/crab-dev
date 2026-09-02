import { vars as generatedVars } from './token.js';

type LegacySpinKey =
    | 'ring.track-color'
    | 'ring.indicator-color'
    | 'ring.dash'
    | 'motion.duration'
    | 'motion.easing'
    | 'motion.reduced-duration'
    | 'motion.reduced-opacity'
    | 'motion.appear'
    | 'size.small.size'
    | 'size.middle.size'
    | 'size.large.size'
    | 'content.blur';

/** @deprecated Prefer TokenVars. Legacy keys remain until the next major version. */
export const vars: typeof generatedVars & Readonly<Record<LegacySpinKey, string>> = {
    ...generatedVars,
    'ring.track-color': '--spin-ring-track-color',
    'ring.indicator-color': '--spin-ring-indicator-color',
    'ring.dash': '--spin-ring-dash',
    'motion.duration': '--spin-motion-duration',
    'motion.easing': '--spin-motion-easing',
    'motion.reduced-duration': '--spin-motion-reduced-duration',
    'motion.reduced-opacity': '--spin-motion-reduced-opacity',
    'motion.appear': '--spin-motion-appear',
    'size.small.size': '--spin-size-small-size',
    'size.middle.size': '--spin-size-middle-size',
    'size.large.size': '--spin-size-large-size',
    'content.blur': '--spin-content-blur',
};
