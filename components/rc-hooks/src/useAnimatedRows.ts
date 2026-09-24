import { useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Key, RefObject } from 'react';
import { useMediaQuery } from './useMediaQuery.js';

export interface AnimatedRow<T> {
    key: Key;
    item: T;
    size: number;
    exiting: boolean;
}

export interface AnimatedRowsOptions<T> {
    keyFor: (item: T) => Key;
    sizeFor: (item: T, index: number) => number;
    /** Only changes to this value start an expansion. Sorting/data refreshes stay immediate. */
    trigger: string;
    rootRef: RefObject<HTMLElement | null>;
    /** A CSS custom property resolving to a duration and bounded easing curve. */
    motionProperty: `--${string}`;
    enabled?: boolean;
    canAnimate?: (item: T) => boolean;
}

function timing(value: string): { duration: number; progress: (time: number) => number } {
    const match = value.trim().match(/^([\d.]+)(ms|s)\s+(.+)$/);
    const duration = match ? Number(match[1]) * (match[2] === 's' ? 1000 : 1) : 0;
    const named: Record<string, number[]> = {
        linear: [0, 0, 1, 1], ease: [.25, .1, .25, 1],
        'ease-in': [.42, 0, 1, 1], 'ease-out': [0, 0, .58, 1], 'ease-in-out': [.42, 0, .58, 1],
    };
    const easing = match?.[3] ?? '';
    const points = named[easing] ?? easing.match(/^cubic-bezier\(([^)]+)\)$/)?.[1].split(',').map(Number);
    if (!points || points.length !== 4 || points.some(n => !Number.isFinite(n)) || !(duration > 0)) {
        return { duration: 0, progress: t => t };
    }
    const [x1, y1, x2, y2] = points;
    const cubic = (t: number, p1: number, p2: number) => 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3;
    return { duration, progress: time => {
        let low = 0;
        let high = 1;
        for (let i = 0; i < 20; i++) {
            const mid = (low + high) / 2;
            if (cubic(mid, x1, x2) < time) low = mid;
            else high = mid;
        }
        // Virtual row sizes must never become negative or overshoot their target.
        return Math.max(0, Math.min(1, cubic((low + high) / 2, y1, y2)));
    } };
}

/**
 * Retain closing rows while interpolating the very same sizes supplied to a virtual grid.
 * Bounded to small lists (100 rows / 40 changed rows); no animation on initial mount,
 * ordinary virtual scrolling, sorting, data refresh, or reduced motion.
 */
export function useAnimatedRows<T>(items: readonly T[], options: AnimatedRowsOptions<T>): AnimatedRow<T>[] {
    const { keyFor, sizeFor, trigger, rootRef, motionProperty, enabled = true, canAnimate } = options;
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const targets = items.map((item, index) => ({ key: keyFor(item), item, size: sizeFor(item, index), exiting: false }));
    const signature = JSON.stringify(targets.map(row => [typeof row.key, String(row.key), row.size]));
    const [rows, setRows] = useState(targets);
    // Mutable animation state is only read/written in effects and frame callbacks.
    const current = useRef(targets);
    const previousTrigger = useRef(trigger);
    const frame = useRef<number | null>(null);
    const readTargets = useEffectEvent(() => targets);
    const eligible = useEffectEvent((item: T) => canAnimate?.(item) ?? true);

    useLayoutEffect(() => {
        let cancelled = false;
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
        const next = readTargets();
        const before = current.current;
        const changedTrigger = previousTrigger.current !== trigger;
        previousTrigger.current = trigger;
        const commit = (value: AnimatedRow<T>[]) => {
            current.current = value;
            setRows(value);
        };
        const root = rootRef.current;
        const motion = timing(root ? getComputedStyle(root).getPropertyValue(motionProperty) : '');
        const nextByKey = new Map(next.map(row => [row.key, row]));
        const beforeByKey = new Map(before.map(row => [row.key, row]));
        const changedCount = next.filter(row => !beforeByKey.has(row.key)).length
            + before.filter(row => !nextByKey.has(row.key)).length;
        if (!enabled || reducedMotion || !changedTrigger || motion.duration === 0
            || next.length > 100 || before.length > 100 || changedCount > 40) {
            commit(next);
            return;
        }

        // Closing entries keep their original position before the next surviving row.
        const closingBefore = new Map<Key, AnimatedRow<T>[]>();
        let pending: AnimatedRow<T>[] = [];
        for (const row of before) {
            if (!nextByKey.has(row.key) && eligible(row.item)) pending.push({ ...row, exiting: true });
            else if (nextByKey.has(row.key) && pending.length) {
                closingBefore.set(row.key, pending);
                pending = [];
            }
        }
        const merged = next.flatMap(row => [...(closingBefore.get(row.key) ?? []), row]).concat(pending);
        const paths = merged.map(row => ({
            row,
            from: eligible(row.item) ? beforeByKey.get(row.key)?.size ?? 0 : row.size,
            to: row.exiting ? 0 : row.size,
        }));
        if (!paths.some(path => path.from !== path.to)) {
            commit(next);
            return;
        }
        commit(paths.map(path => ({ ...path.row, size: path.from })));
        const start = performance.now();
        const tick = (now: number) => {
            if (cancelled) return;
            const time = Math.max(0, Math.min(1, (now - start) / motion.duration));
            if (time >= 1) {
                frame.current = null;
                commit(next);
                return;
            }
            const progress = motion.progress(time);
            commit(paths.map(path => ({ ...path.row, size: path.from + (path.to - path.from) * progress })));
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
        return () => {
            cancelled = true;
            if (frame.current !== null) cancelAnimationFrame(frame.current);
            frame.current = null;
        };
    }, [signature, trigger, enabled, reducedMotion, rootRef, motionProperty]);

    // Exception: keep this library result stable for virtual-grid consumers that
    // use row identity as an effect dependency, including without React Compiler.
    // items supplies content; signature supplies value-equal keys/sizes.
    return useMemo(() => {
        const latest = new Map(targets.map(row => [row.key, row.item]));
        return rows.map(row => ({ ...row, item: latest.get(row.key) ?? row.item, exiting: !latest.has(row.key) }));
    }, [rows, items, signature]);
}
