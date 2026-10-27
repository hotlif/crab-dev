import type { CronPickerProps } from '../types.js';
export const readonlyCron: CronPickerProps = { value: '* * * * *', open: true };
// @ts-expect-error Controlled and default values cannot coexist.
export const conflictingCron: CronPickerProps = { value: '* * * * *', defaultValue: '0 * * * *' };
