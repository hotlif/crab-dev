import { shadcnColorContract } from './shadcn-theme.js';
import { themeColorContract } from './theme.js';
import type { DesignColorContract } from './types.js';

/** Style and color mode are independent; Material remains the default contract. */
export const designColorContract: DesignColorContract = {
    material: themeColorContract,
    shadcn: shadcnColorContract,
};
