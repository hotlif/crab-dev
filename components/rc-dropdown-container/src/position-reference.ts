import { createContext, use, type Context } from 'react';
import type { VirtualElement } from '@floating-ui/react';

type PositionReferenceSetter = (element: HTMLElement | VirtualElement | null) => void;

/** Internal positioning seam: the DOM reference still owns focus and dismissal. */
export const DropdownPositionReference: Context<PositionReferenceSetter | null> = createContext<PositionReferenceSetter | null>(null);

export function useDropdownPositionReference(): PositionReferenceSetter {
    const setPositionReference = use(DropdownPositionReference);
    if (!setPositionReference) throw new Error('Position reference requires a DropdownContainer');
    return setPositionReference;
}
