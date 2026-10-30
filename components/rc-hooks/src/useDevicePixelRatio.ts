import { useState, type RefObject } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect.js';

/** Internal raster resolution follows the element's actual document and display. */
export function useDevicePixelRatio(target: RefObject<Element | null>, enabled?: boolean): number {
    const observeResolution = enabled ?? true;
    const [ratio, setRatio] = useState(() => typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);
    useIsomorphicLayoutEffect(() => {
        if (!observeResolution) return;
        const view = target.current?.ownerDocument.defaultView ?? (typeof window === 'undefined' ? undefined : window);
        if (!view) return;
        let media: MediaQueryList | undefined;
        let previous = Number.NaN;
        const update = () => {
            const next = view.devicePixelRatio || 1;
            setRatio(next);
            if (previous === next) return;
            previous = next;
            media?.removeEventListener('change', update);
            media = typeof view.matchMedia === 'function' ? view.matchMedia(`(resolution: ${next}dppx)`) : undefined;
            media?.addEventListener('change', update);
        };
        update();
        view.addEventListener('resize', update);
        return () => { view.removeEventListener('resize', update); media?.removeEventListener('change', update); };
    }, [target, observeResolution]);
    return ratio;
}
