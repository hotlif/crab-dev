/**
 * 柱几何过渡动画。
 *
 * 纯函数部分（easing / 单帧采样）不依赖 React 与 DOM，便于独立单测；
 * hook 部分用 requestAnimationFrame 驱动，每帧重算显示几何并触发重渲染，
 * 由 rc-canvas 的 Rect（props 变化即刷新绘制命令）落到一次 GPU 重绘。
 *
 * 生长统一公式：每根柱的上边 y 与高度 height 同时从「起点」补间到「终点」。
 * - 入场：起点 = 基线（y = zeroY, height = 0），柱从零值线生长到目标高度；
 * - 数据更新：起点 = 上一帧显示几何，柱从旧几何平滑补间到新几何。
 * 该式对分组 / 堆叠、正 / 负值一致成立（负值段的 y、height 同样朝基线收缩）。
 */

import { useEffect, useRef, useState } from 'react';
import type { BarRect } from '../layout.js';

/** 入场 / 更新的基准时长（ms） */
const DURATION = 600;
/** 每类目错峰延迟（ms），形成自左向右的涌现 */
const STAGGER = 50;
/** 错峰总量上限（ms）：类目多时压缩每档延迟，避免整体过长 */
const MAX_TOTAL_STAGGER = 300;

export interface BarGeom {
    y: number;
    height: number;
}

/** ease-out-cubic：起步快、收尾稳，符合「物体落定」的物理直觉 */
export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

export function barKey(bar: { categoryIndex: number; seriesIndex: number }): string {
    return `${bar.categoryIndex}-${bar.seriesIndex}`;
}

/** 每类目错峰后的实际档距（ms） */
export function staggerStep(categoryCount: number): number {
    return Math.min(STAGGER, MAX_TOTAL_STAGGER / Math.max(1, categoryCount));
}

/** 动画总跨度（ms）：最后一个错峰档的柱走完 DURATION 的时刻 */
export function totalSpan(categoryCount: number, stagger: number): number {
    return DURATION + Math.max(0, categoryCount - 1) * stagger;
}

/** 某根柱在 elapsed 时刻的 eased 进度（含类目错峰），钳制到 [0, 1] */
export function barProgress(categoryIndex: number, elapsed: number, stagger: number): number {
    const t = (elapsed - categoryIndex * stagger) / DURATION;
    return easeOutCubic(Math.min(1, Math.max(0, t)));
}

/** 采样某一帧的显示几何：从 fromMap（缺省为基线）补间到 target */
export function sampleBars(
    target: BarRect[],
    fromMap: Map<string, BarGeom>,
    zeroY: number,
    elapsed: number,
    stagger: number,
): BarRect[] {
    return target.map(bar => {
        const e = barProgress(bar.categoryIndex, elapsed, stagger);
        const from = fromMap.get(barKey(bar)) ?? { y: zeroY, height: 0 };
        return {
            ...bar,
            y: from.y + (bar.y - from.y) * e,
            height: from.height + (bar.height - from.height) * e,
        };
    });
}

/** 几何签名：仅当柱的位置 / 高度实际改变时才重启动画 */
function signature(bars: BarRect[], zeroY: number): string {
    let s = `${zeroY}`;
    for (const b of bars) s += `|${b.categoryIndex}:${b.seriesIndex}:${b.y}:${b.height}`;
    return s;
}

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function baselineBars(bars: BarRect[], zeroY: number): BarRect[] {
    return bars.map(b => ({ ...b, y: zeroY, height: 0 }));
}

/**
 * 返回当前帧应渲染的柱几何。`animate` 关闭或系统偏好「减弱动态」时直接返回终态。
 */
export function useBarTransition(
    bars: BarRect[],
    zeroY: number,
    categoryCount: number,
    animate: boolean,
): BarRect[] {
    // 首帧即为基线态，避免「先闪终态再回落」；reduce / 关闭动画时直接终态
    const [display, setDisplay] = useState<BarRect[]>(() =>
        animate && !prefersReducedMotion() ? baselineBars(bars, zeroY) : bars,
    );

    // 可变实例状态 ref：rAF 句柄，跨渲染持有、不应触发重渲染
    const rafRef = useRef(0);
    // 可变实例状态 ref：当前帧显示几何，供动画被打断时作为新起点续接
    const displayRef = useRef<BarRect[]>(display);
    // 可变实例状态 ref：上次 target 签名，用于判定是否需要重启动画
    const sigRef = useRef<string>('');

    useEffect(() => {
        const sig = signature(bars, zeroY);
        if (sig === sigRef.current) return; // target 未变（含每帧动画重渲染），不重启
        const isFirst = sigRef.current === '';
        sigRef.current = sig;

        if (!animate || prefersReducedMotion()) {
            cancelAnimationFrame(rafRef.current);
            displayRef.current = bars;
            setDisplay(bars);
            return;
        }

        // 首次入场从基线生长；后续更新从当前显示几何补间
        const fromMap = new Map<string, BarGeom>();
        if (!isFirst) {
            for (const b of displayRef.current) fromMap.set(barKey(b), { y: b.y, height: b.height });
        }

        const stagger = staggerStep(categoryCount);
        const span = totalSpan(categoryCount, stagger);
        const start = performance.now();

        cancelAnimationFrame(rafRef.current);
        const tick = () => {
            const elapsed = performance.now() - start;
            if (elapsed >= span) {
                displayRef.current = bars;
                setDisplay(bars); // 精确落到终态，消除累计误差
                return;
            }
            const sampled = sampleBars(bars, fromMap, zeroY, elapsed, stagger);
            displayRef.current = sampled;
            setDisplay(sampled);
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
    }, [bars, zeroY, categoryCount, animate]);

    // 卸载时停止动画
    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    return display;
}
