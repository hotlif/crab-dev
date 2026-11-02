import { useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from 'react';

// Native arrow navigation moves between separate Radio instances. Remember the
// initiating modality per document, including controls rendered in an iframe.
const keyboardDocuments = new WeakSet<Document>();
const navigationKeys = new Set(['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter']);

export interface NativeRadioFocus {
    keyboardFocus: boolean;
    onKeyDownCapture: (event: KeyboardEvent<HTMLElement>) => void;
    onPointerDownCapture: (event: PointerEvent<HTMLElement>) => void;
    onFocus: (event: FocusEvent<HTMLElement>) => void;
    onBlur: () => void;
}

/** Internal fallback for engines that lose :focus-visible during native radio navigation. */
export function useNativeRadioFocus(): NativeRadioFocus {
    const [keyboardFocus, setKeyboardFocus] = useState(false);
    return {
        keyboardFocus,
        onKeyDownCapture(event: KeyboardEvent<HTMLElement>) {
            if (event.altKey || event.ctrlKey || event.metaKey || !navigationKeys.has(event.key)) return;
            keyboardDocuments.add(event.currentTarget.ownerDocument);
            setKeyboardFocus(true);
        },
        onPointerDownCapture(event: PointerEvent<HTMLElement>) {
            keyboardDocuments.delete(event.currentTarget.ownerDocument);
            setKeyboardFocus(false);
        },
        onFocus(event: FocusEvent<HTMLElement>) {
            setKeyboardFocus(keyboardDocuments.has(event.currentTarget.ownerDocument));
        },
        onBlur() { setKeyboardFocus(false); },
    };
}
