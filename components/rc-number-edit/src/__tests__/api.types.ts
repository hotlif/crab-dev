import type { NumberEditProps } from '../types.js';
export const readonlyNumber: NumberEditProps = { value: null };
// @ts-expect-error Controlled and default values cannot coexist.
export const conflictingNumber: NumberEditProps = { value: 1, defaultValue: 2 };
