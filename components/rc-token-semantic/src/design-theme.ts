import { appleColorContract } from './apple-theme.js';
import { shadcnColorContract } from './shadcn-theme.js';
import { md3ColorContract } from './theme.js';
import type { DesignColorContract } from './types.js';

/** Style and color mode are independent; Material remains the default contract. */
export const designColorContract: DesignColorContract = {
    md3: md3ColorContract,
    apple: appleColorContract,
    shadcn: shadcnColorContract,
};
