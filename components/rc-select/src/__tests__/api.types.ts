import type { SelectProps } from '../types.js';
export const eventConsumer: SelectProps = { options: [], onValueChange: (_value, details) => { details.event?.preventDefault(); } };
export const readonlySingle: SelectProps = { options: [], value: null };
export const readonlyMultiple: SelectProps = { options: [], multiple: true, value: [] };
// @ts-expect-error Controlled and default values are mutually exclusive.
export const conflictingValues: SelectProps = { options: [], value: 'a', defaultValue: 'b' };
// @ts-expect-error A single selection cannot receive an array.
export const invalidSingle: SelectProps = { options: [], value: ['a'] };
// @ts-expect-error Open state follows the same controlled/default contract.
export const conflictingOpen: SelectProps = { options: [], open: true, defaultOpen: false };
