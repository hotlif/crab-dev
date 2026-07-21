/**
 * 类目聚焦淡化系数。
 *
 * 悬停 / 固定某类目时，其余类目的柱降至 DIM_OPACITY，形成「聚焦-背景」层次；
 * 无活动类目时全部回到 1。系数逐帧补间（短时长，对齐「即时反馈」档），
 * `animate` 关闭或系统偏好「减弱动态」时瞬时切换。
 */

import { useEffect, useRef, useState } from 'react';

/** 非活动类目的保留系数：柱色向背景混合后仍清晰可辨，只是退居次要 */
export const DIM_OPACITY = 0.45;
/** 淡化补间时长（ms），对齐 semantic motion.interaction 的 duration.fast 档 */
const DIM_DURATION = 150;

export function dimTargets(activeIndex: number | null, count: number): number[] {
    return Array.from({ length: count }, (_, i) =>
        (activeIndex === null || i === activeIndex ? 1 : DIM_OPACITY),
    );
}

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** 返回每个类目当前帧的不透明度系数（下标 = categoryIndex） */
export function useCategoryDim(
    activeIndex: number | null,
    categoryCount: number,
    animate: boolean,
): number[] {
    const [dims, setDims] = useState<number[]>(() => dimTargets(activeIndex, categoryCount));

    // 可变实例状态 ref：rAF 句柄，跨渲染持有、不应触发重渲染
    const rafRef = useRef(0);
    // 可变实例状态 ref：当前帧系数，供补间被打断时作为新起点续接
    const dimsRef = useRef<number[]>(dims);
    // 可变实例状态 ref：上次目标签名，避免每帧重渲染时重启补间
    const keyRef = useRef(`${activeIndex}|${categoryCount}`);

    useEffect(() => {
        const key = `${activeIndex}|${categoryCount}`;
        if (key === keyRef.current) return;
        keyRef.current = key;

        const targets = dimTargets(activeIndex, categoryCount);
        cancelAnimationFrame(rafRef.current);

        if (!animate || prefersReducedMotion()) {
            dimsRef.current = targets;
            setDims(targets);
            return;
        }

        const from = dimsRef.current;
        const start = performance.now();
        const tick = () => {
            const t = Math.min(1, (performance.now() - start) / DIM_DURATION);
            const e = 1 - Math.pow(1 - t, 3);
            const next = targets.map((tv, i) => {
                const f = from[i] ?? 1;
                return f + (tv - f) * e;
            });
            dimsRef.current = next;
            setDims(next);
            if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
    }, [activeIndex, categoryCount, animate]);

    // 卸载时停止补间
    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    return dims;
}
