import { createContext, type Dispatch, type Ref, use } from 'react';
import type { DropdownAction, DropdownState } from './reducer';

export interface DropdownContextValue<T extends HTMLElement = HTMLElement> {
    state: DropdownState;
    dispatch: Dispatch<DropdownAction>;
    refs: {
        setReference: Ref<T>;
    };
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext<T extends HTMLElement = HTMLElement>() {
    const context = use(DropdownContext);
    if (!context) {
        throw new Error('useDropdownContext must be used within a DropdownContainer');
    }
    return context as DropdownContextValue<T>;
}
