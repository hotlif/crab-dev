import { createContext, type Context, type Dispatch, type Ref, use } from 'react';
import type { DropdownAction, DropdownState } from './reducer.js';

export interface DropdownContextValue<T extends HTMLElement = HTMLElement> {
    state: DropdownState;
    dispatch: Dispatch<DropdownAction>;
    refs: {
        setReference: Ref<T>;
    };
}

export const DropdownContext: Context<DropdownContextValue | null> = createContext<DropdownContextValue | null>(null);

export function useDropdownContext<T extends HTMLElement = HTMLElement>(): DropdownContextValue<T> {
    const context = use(DropdownContext);
    if (!context) {
        throw new Error('useDropdownContext must be used within a DropdownContainer');
    }
    return context as DropdownContextValue<T>;
}
