import { useLayoutEffect, useRef, useState, type RefObject } from "react";

interface FilterRowGeometry {
    filterSizeRef: RefObject<HTMLSpanElement | null>;
    filterRowHeight: number;
}

/** CSS owns field sizing; virtual layout reads its measured minimum. */
export function useFilterRowHeight(headerHeight: number, explicitHeight?: number): FilterRowGeometry {
    const filterSizeRef = useRef<HTMLSpanElement>(null);
    const [minimumHeight, setMinimumHeight] = useState(0);
    useLayoutEffect(() => {
        const element = filterSizeRef.current;
        if (!element) return;
        setMinimumHeight(element.getBoundingClientRect().height);
        const Observer = element.ownerDocument.defaultView?.ResizeObserver;
        if (!Observer) return;
        const observer = new Observer(entries => { setMinimumHeight(entries[0].contentRect.height); });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    return { filterSizeRef, filterRowHeight: explicitHeight ?? Math.max(headerHeight, minimumHeight) };
}
