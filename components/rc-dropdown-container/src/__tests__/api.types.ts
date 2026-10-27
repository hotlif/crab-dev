import type { DropdownContainerProps, DropdownOpenChangeDetails } from '../dropdownContainer.js';
export const readOnlyDropdown: DropdownContainerProps = { open: true, overlay: null };
export const focusDismissal: DropdownContainerProps = { closeOnFocusOut: true, overlay: null };
export const focusDetails: DropdownOpenChangeDetails = { reason: 'focus-out', event: new FocusEvent('focusout') };
// @ts-expect-error Controlled and initial open values are mutually exclusive.
export const conflictingDropdown: DropdownContainerProps = { open: true, defaultOpen: false, overlay: null };
