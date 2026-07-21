import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useControllableValue } from "./useControllableValue.js";
import { useEventCallback } from "./useEventCallback.js";

export interface DragResizeOptions {
    /** 受控尺寸（px）：非 `undefined` 即进入受控模式 */
    size?: number;
    /** 非受控模式的初始尺寸（px），同时是 `reset()` 的复位目标 */
    defaultSize: number;
    /** 尺寸下限（px） */
    min?: number;
    /** 尺寸上限（px） */
    max?: number;
    /** 轴向：`x` 调宽（默认），`y` 调高 */
    axis?: "x" | "y";
    /**
     * 把手位于被调整目标的哪一缘，决定拖拽方向与尺寸增减的映射：
     * - `end`（默认）：右 / 下缘，向正方向拖增大；
     * - `start`：左 / 上缘，向负方向拖增大（目标在把手的正方向一侧）。
     */
    edge?: "start" | "end";
    /** 尺寸变化回调（拖拽过程中逐帧触发） */
    onChange?: (size: number) => void;
    /** 拖拽开始 / 结束回调；消费方常用来在拖拽期间临时关闭过渡动画 */
    onDraggingChange?: (dragging: boolean) => void;
}

export interface DragResizeResult {
    /** 当前尺寸（px，已夹在 min/max 内） */
    size: number;
    /** 是否正在拖拽 */
    dragging: boolean;
    /** 编程式设置尺寸（自动夹取），供键盘步进等场景 */
    setSize: (size: number) => void;
    /** 复位到 defaultSize */
    reset: () => void;
    /** 铺到分隔条元素上的事件 props */
    handleProps: {
        onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
    };
}

/**
 * 拖拽分隔条调整面板尺寸。
 *
 * 骨架里的几个细节都是实战踩出来的，不是装饰：
 * - **move/up 监听挂 window 而非把手**——拖快了指针必然甩出把手，仍要跟手；
 *   同时尝试 `setPointerCapture`（指针拖出窗口外也不丢，jsdom 等无此 API 的环境静默跳过）；
 * - **拖拽期间锁全局 `user-select` 与 `cursor`**——不锁的话会顺手选中路过的整片文字，
 *   光标也会在离开把手的瞬间变回默认样式；
 * - **方向系数由 `edge` 参数化**——把手在目标的左缘还是右缘决定 delta 符号，
 *   消费方不必再各写一份只差正负号的拷贝。
 *
 * 用 Pointer Events 而非 mouse 事件：触屏 / 触控笔同样可拖（把手元素记得配
 * `touch-action: none`，否则触屏拖动会触发页面滚动）。
 */
export function useDragResize(options: DragResizeOptions): DragResizeResult {
    const {
        size: sizeProp,
        defaultSize,
        min = 0,
        max = Number.POSITIVE_INFINITY,
        axis = "x",
        edge = "end",
        onChange,
        onDraggingChange,
    } = options;

    const clamp = (value: number) => Math.min(max, Math.max(min, value));

    const [size, setSizeRaw] = useControllableValue<number>({
        value: sizeProp,
        defaultValue: clamp(defaultSize),
        onChange,
    });
    const [dragging, setDraggingState] = useState(false);

    // 拖拽读起点尺寸走 ref：pointermove 闭包建立于 pointerdown 时刻，读 state 会滞后一帧
    const sizeRef = useRef(size);
    sizeRef.current = size;

    const setDragging = useEventCallback((next: boolean) => {
        setDraggingState(next);
        onDraggingChange?.(next);
    });

    const setSize = useEventCallback((next: number) => {
        setSizeRaw(clamp(next));
    });

    const reset = useEventCallback(() => {
        setSizeRaw(clamp(defaultSize));
    });

    // 进行中拖拽的清理函数；组件卸载时兜底执行，不让 window 监听与全局样式锁泄漏
    const cleanupRef = useRef<(() => void) | null>(null);
    useEffect(() => () => cleanupRef.current?.(), []);

    const onPointerDown = useEventCallback((event: ReactPointerEvent<HTMLElement>) => {
        // 鼠标仅响应主键；触屏 / 触控笔的 button 同为 0，天然放行
        if (event.button !== 0) {
            return;
        }
        event.preventDefault();

        const startPos = axis === "x" ? event.clientX : event.clientY;
        const startSize = sizeRef.current;
        const sign = edge === "end" ? 1 : -1;
        const handle = event.currentTarget;

        try {
            handle.setPointerCapture?.(event.pointerId);
        } catch {
            // 捕获失败无碍：window 监听是主通道，capture 只是出窗兜底
        }

        const previousUserSelect = document.body.style.userSelect;
        const previousCursor = document.body.style.cursor;
        document.body.style.userSelect = "none";
        document.body.style.cursor = axis === "x" ? "col-resize" : "row-resize";
        setDragging(true);

        const onMove = (moveEvent: globalThis.PointerEvent) => {
            const current = axis === "x" ? moveEvent.clientX : moveEvent.clientY;
            setSizeRaw(clamp(startSize + sign * (current - startPos)));
        };
        const cleanup = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", cleanup);
            window.removeEventListener("pointercancel", cleanup);
            document.body.style.userSelect = previousUserSelect;
            document.body.style.cursor = previousCursor;
            cleanupRef.current = null;
            setDragging(false);
        };
        cleanupRef.current = cleanup;
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", cleanup);
        window.addEventListener("pointercancel", cleanup);
    });

    return { size, dragging, setSize, reset, handleProps: { onPointerDown } };
}
