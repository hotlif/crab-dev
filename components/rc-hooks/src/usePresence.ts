import { useEffectEvent, useLayoutEffect, useState } from "react";

/** Keep content mounted until its own CSS transitions/animations have settled. */
export function usePresence<T extends HTMLElement>(open: boolean, onExitComplete?: () => void): {
    present: boolean;
    ref: (element: T | null) => void;
    state: "open" | "closed";
} {
    const [present, setPresent] = useState(open);
    const [element, setElement] = useState<T | null>(null);
    const complete = useEffectEvent(() => {
        setPresent(false);
        onExitComplete?.();
    });

    useLayoutEffect(() => {
        if (open) {
            setPresent(true);
            return;
        }
        if (!present) return;

        let cancelled = false;
        // getAnimations flushes pending styles. Observe only this element, so a
        // descendant spinner or countdown cannot delay removal. CSS owns timing.
        const animations = element?.getAnimations?.().filter(animation =>
            animation.playState !== "finished"
            && animation.effect?.getTiming().iterations !== Infinity,
        ) ?? [];
        if (animations.length === 0) {
            complete();
        } else {
            void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
                if (!cancelled) complete();
            });
        }
        // Reopening or unmounting invalidates an in-flight exit, including a
        // rejected finished promise when reduced motion cancels a transition.
        return () => { cancelled = true; };
    }, [open, present, element]);

    return { present: open || present, ref: setElement, state: open ? "open" : "closed" };
}
