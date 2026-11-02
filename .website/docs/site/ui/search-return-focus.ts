import { createContext } from "react";
import type { KeyboardEvent, RefObject } from "react";

// One focus request can outlive the surface that opened search. Keep it in the
// stable layout, so native close timing and reduced motion cannot change it.
export const SearchReturnFocusContext = createContext<RefObject<boolean> | null>(null);

export function isSearchShortcut(event: KeyboardEvent<HTMLElement>) {
    return (event.ctrlKey || event.metaKey) && !event.altKey
        && !event.nativeEvent.isComposing && event.key.toLowerCase() === "k";
}
