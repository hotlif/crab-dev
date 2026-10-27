import type { DialogProps } from '../dialog.js';
import type { ConfirmProps } from '../hooks/useConfirm.js';

export const readOnlyDialog: DialogProps = { open: true, title: 'Snapshot' };
export const initialDialog: DialogProps = { defaultOpen: true };
// @ts-expect-error A controlled modal cannot have a default open state.
export const conflictingDialog: DialogProps = { open: true, defaultOpen: false };
// @ts-expect-error Confirm owns its initial and current open state.
export const conflictingConfirm: ConfirmProps = { defaultOpen: true };
