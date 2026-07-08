import { useState, type RefObject } from "react";
import { useEventCallback } from "./useEventCallback.js";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";

/**
 * 观察目标元素的尺寸变化并回调。`callback` 引用可不稳定（内部经 useEventCallback
 * 兜底读取最新实现），`ResizeObserver` 仅在 `target` ref 对象变化时重建。
 *
 * 环境无 `ResizeObserver`（如部分 SSR / 测试环境）时静默跳过。
 */
export function useResizeObserver<T extends Element>(
    target: RefObject<T | null>,
    callback: (entry: ResizeObserverEntry) => void,
): void {
    const onResize = useEventCallback(callback);

    useIsomorphicLayoutEffect(() => {
        const el = target.current;
        if (!el || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                onResize(entry);
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);
}

export interface Size {
    width: number;
    height: number;
}

/**
 * 便捷封装：返回目标元素的 content-box 尺寸，随尺寸变化触发重渲染；测量前为 `undefined`。
 */
export function useSize<T extends Element>(
    target: RefObject<T | null>,
): Size | undefined {
    const [size, setSize] = useState<Size | undefined>(undefined);

    useResizeObserver(target, (entry) => {
        const { width, height } = entry.contentRect;
        setSize((prev) =>
            prev && prev.width === width && prev.height === height
                ? prev
                : { width, height },
        );
    });

    return size;
}
