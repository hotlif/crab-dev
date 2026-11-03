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
        // A theme/token change can replace an exiting CSS transition. Re-read
        // after settlement (including cancellation) instead of removing the
        // element while its replacement is still running. A restarted Animation
        // gets a new finished promise, even when the instance itself is reused.
        const settled = new Set<Promise<Animation>>();
        const observe = () => {
            if (cancelled) return;
            // getAnimations flushes pending styles. Observe only this element:
            // descendant spinners/countdowns must never delay removal.
            const pending = (element?.getAnimations?.() ?? [])
                .filter(animation => animation.playState !== "finished"
                    && animation.playState !== "idle"
                    && animation.effect?.getTiming().iterations !== Infinity)
                .map(animation => animation.finished)
                .filter(finished => !settled.has(finished));
            if (pending.length === 0) {
                complete();
                return;
            }
            void Promise.allSettled(pending).then(() => {
                for (const finished of pending) settled.add(finished);
                observe();
            });
        };
        observe();
        // Reopening or unmounting invalidates an in-flight exit, including a
        // rejected finished promise when reduced motion cancels a transition.
        return () => { cancelled = true; };
    }, [open, present, element]);

    return { present: open || present, ref: setElement, state: open ? "open" : "closed" };
}
