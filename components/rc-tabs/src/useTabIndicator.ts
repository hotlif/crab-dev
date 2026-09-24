import { useLayoutEffect, useRef } from 'react';
import { useMediaQuery } from '@crab-dev/rc-hooks';

/** Animate between label bounds, including the current position of an interrupted move. */
export function useTabIndicator(activeKey: string, enabled: boolean) {
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    // Mutable DOM and animation handles are only read in effects and ref callbacks.
    const indicators = useRef(new Map<string, HTMLSpanElement>());
    const previous = useRef<HTMLSpanElement | null>(null);
    const running = useRef<Animation | null>(null);

    useLayoutEffect(() => {
        const next = enabled ? indicators.current.get(activeKey) ?? null : null;
        const from = previous.current;
        if (from === next && !reducedMotion) return;
        // Measure before cancelling: an interrupted indicator may be between tabs.
        const fromRect = from?.isConnected ? from.getBoundingClientRect() : null;
        running.current?.cancel();
        running.current = null;
        previous.current = next;
        if (!next || !fromRect || reducedMotion || typeof next.animate !== 'function') return;
        const toRect = next.getBoundingClientRect();
        if (fromRect.width <= 0 || toRect.width <= 0) return;

        // CSS resolves the component token, including consumer overrides and reduced motion.
        const style = getComputedStyle(next);
        const time = style.transitionDuration.split(',')[0].trim();
        const duration = Number.parseFloat(time) * (time.endsWith('ms') ? 1 : 1000);
        if (!(duration > 0)) return;
        running.current = next.animate([
            { transform: `translateX(${fromRect.left - toRect.left}px) scaleX(${fromRect.width / toRect.width})` },
            { transform: 'none' },
        ], { duration, easing: style.transitionTimingFunction });
    }, [activeKey, enabled, reducedMotion]);

    useLayoutEffect(() => () => {
        running.current?.cancel();
        running.current = null;
        previous.current = null;
    }, []);

    return (key: string) => (element: HTMLSpanElement | null) => {
        if (!element) return;
        indicators.current.set(key, element);
        return () => { indicators.current.delete(key); };
    };
}
