import { vars } from './token.js';

/** Keep the original public key and override alongside the property-specific key. */
export const TokenVars: typeof vars & Readonly<Record<'navigation.size', string>> = {
    ...vars,
    'navigation.size': '--date-picker-navigation-size',
};
