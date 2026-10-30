import { useLayoutEffect, useRef, type Key, type RefObject } from "react";

/** Recover only focus lost when an editor is actually removed from this table. */
export function useRowEditFocus(editingRowId: Key | null | undefined, rootRef: RefObject<HTMLElement | null>, isActive: () => boolean): RefObject<HTMLElement | null> {
    const focusRef = useRef<HTMLElement | null>(null);
    useLayoutEffect(() => {
        const previous = focusRef.current;
        if (editingRowId != null) {
            if (previous && !previous.isConnected) focusRef.current = null;
            return;
        }
        focusRef.current = null;
        const root = rootRef.current;
        if (!previous || previous.isConnected || !root?.isConnected || !isActive()) return;
        const document = root.ownerDocument;
        // A controlled owner may reject closing, move focus or replace the table.
        if (document.activeElement === document.body || document.activeElement === document.documentElement) {
            root.focus({ preventScroll: true });
        }
    }, [editingRowId, rootRef, isActive]);
    return focusRef;
}
