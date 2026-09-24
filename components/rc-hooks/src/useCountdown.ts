import { useEffect, useEffectEvent, useRef, useState } from "react";

/** A pausable one-shot deadline; never updates React on animation frames. */
export function useCountdown(duration: number, paused: boolean, onFinish?: () => void, resetKey?: unknown): number {
    // Mutable instance state: elapsed time survives pauses without rendering.
    const remaining = useRef(duration);
    const previous = useRef({ duration, resetKey });
    const [snapshot, setSnapshot] = useState(duration);
    const enabled = Boolean(onFinish);
    const finish = useEffectEvent(() => onFinish?.());

    useEffect(() => {
        if (previous.current.duration !== duration || !Object.is(previous.current.resetKey, resetKey)) {
            remaining.current = duration;
            previous.current = { duration, resetKey };
        }
        setSnapshot(remaining.current);
        if (duration <= 0 || paused || !enabled) return;
        const startedAt = Date.now();
        const timer = setTimeout(() => finish(), Math.max(0, remaining.current));
        return () => {
            clearTimeout(timer);
            remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
        };
        // Callback identity must not restart a deadline on unrelated renders.
    }, [duration, paused, enabled, resetKey]);
    return snapshot;
}
