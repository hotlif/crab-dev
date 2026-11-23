import { createContext, use, type Context } from 'react';
import type { Middleware, VirtualElement } from '@floating-ui/react';

interface FieldPositionReference extends VirtualElement {
    controlElement?: HTMLElement;
}

type PositionReferenceSetter = (element: HTMLElement | FieldPositionReference | null) => void;

// A side label expands the field's collision bounds. Above and below the
// field, align the panel with the control in Floating UI's coordinate space.
export const alignFieldControl: Middleware = {
    name: 'crabFieldAlignment',
    async fn({ elements, placement, platform, rects, strategy }) {
        const field: Element | FieldPositionReference = elements.reference;
        if ((placement !== 'bottom-start' && placement !== 'top-start') ||
            !('controlElement' in field) || !field.controlElement) return {};
        const { reference } = await platform.getElementRects({
            reference: field.controlElement, floating: elements.floating, strategy,
        });
        const rtl = await platform.isRTL?.(elements.floating);
        return { x: rtl ? reference.x + reference.width - rects.floating.width : reference.x };
    },
};

/** Internal positioning seam: the DOM reference still owns focus and dismissal. */
export const DropdownPositionReference: Context<PositionReferenceSetter | null> = createContext<PositionReferenceSetter | null>(null);

export function useDropdownPositionReference(): PositionReferenceSetter {
    const setPositionReference = use(DropdownPositionReference);
    if (!setPositionReference) throw new Error('Position reference requires a DropdownContainer');
    return setPositionReference;
}
