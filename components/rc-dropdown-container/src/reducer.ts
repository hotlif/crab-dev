import type { CSSProperties } from 'react';

export type DropdownAction = { type: 'setOpen'; payload: boolean };

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
