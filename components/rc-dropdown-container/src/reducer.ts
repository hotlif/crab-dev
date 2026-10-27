import type { DropdownOpenChangeDetails } from './dropdownContainer.js';

/** Consumers may preserve a semantic reason and the original native event. */
export type DropdownAction = { type: 'setOpen'; payload: boolean; details?: DropdownOpenChangeDetails };

export interface DropdownState {
    open: boolean;
}

export const initialDropdownState: DropdownState = { open: false };

export function dropdownReducer(state: DropdownState, action: DropdownAction): DropdownState {
    switch (action.type) {
        case 'setOpen':
            return { ...state, open: action.payload };
        default:
            return state;
    }
}
