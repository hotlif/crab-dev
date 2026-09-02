import { vars as generatedVars } from './token.js';

type LegacyRealmKey = 'motion.appear';

/** @deprecated Prefer TokenVars. Legacy keys remain until the next major version. */
export const vars: typeof generatedVars & Readonly<Record<LegacyRealmKey, string>> = {
    ...generatedVars,
    'motion.appear': '--realm-motion-appear',
};
