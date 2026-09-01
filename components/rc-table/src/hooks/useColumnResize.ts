import { type MouseEvent as ReactMouseEvent, type MutableRefObject, type RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useColumnResize(params: {
    bottomColumnsRef: RefObject<{ name: string }[]>
    onColumnResize?: (columnName: string, width: number) => void
}): {
    resizedWidths: Record<string, number>;
    handleResizeMouseDown: (columnIndex: number, e: ReactMouseEvent) => void;
    handleResizeKeyDown: (columnIndex: number, delta: number) => void;
    gridTemplateColumnsRef: MutableRefObject<number[]>;
} {
    const { bottomColumnsRef, onColumnResize } = params;

    const [resizedWidths, setResizedWidths] = useState<Record<string, number>>({});
    const resizeDragRef = useRef<{ columnName: string; startX: number; startWidth: number } | null>(null);
    const gridTemplateColumnsRef = useRef<number[]>([]) as MutableRefObject<number[]>;
    const resizeFrameRef = useRef<number | null>(null);
    const pendingResizeRef = useRef<{ columnName: string; width: number } | null>(null);
    const previousBodyStyleRef = useRef<{ cursor: string; userSelect: string } | null>(null);
    // latest-ref：全局 mouseup 监听只注册一次，但应调用最新的消费方回调。
    const onColumnResizeRef = useRef(onColumnResize);
    onColumnResizeRef.current = onColumnResize;

    const restoreBodyStyles = useCallback(() => {
        const previous = previousBodyStyleRef.current;
        if (!previous) return;
        document.body.style.cursor = previous.cursor;
        document.body.style.userSelect = previous.userSelect;
        previousBodyStyleRef.current = null;
    }, []);

    const handleResizeMouseDown = useCallback((columnIndex: number, e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const column = bottomColumnsRef.current[columnIndex];
        if (!column) return;
        if (!previousBodyStyleRef.current) {
            previousBodyStyleRef.current = {
                cursor: document.body.style.cursor,
                userSelect: document.body.style.userSelect,
            };
        }
        resizeDragRef.current = {
            columnName: column.name,
            startX: e.clientX,
            startWidth: gridTemplateColumnsRef.current[columnIndex],
        };
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, [bottomColumnsRef]);

    const handleResizeKeyDown = useCallback((columnIndex: number, delta: number) => {
        const MIN_COL_WIDTH = 30;
        const column = bottomColumnsRef.current[columnIndex];
        if (!column) return;
        const currentWidth = gridTemplateColumnsRef.current[columnIndex] ?? MIN_COL_WIDTH;
        const newWidth = Math.max(MIN_COL_WIDTH, currentWidth + delta);
        setResizedWidths(prev => ({ ...prev, [column.name]: newWidth }));
        onColumnResizeRef.current?.(column.name, newWidth);
    }, [bottomColumnsRef, gridTemplateColumnsRef]);

    useEffect(() => {
        const MIN_COL_WIDTH = 30;
        const onMouseMove = (e: MouseEvent) => {
            if (!resizeDragRef.current) return;
            const { columnName, startX, startWidth } = resizeDragRef.current;
            const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
            pendingResizeRef.current = { columnName, width: newWidth };
            if (resizeFrameRef.current !== null) return;
            resizeFrameRef.current = requestAnimationFrame(() => {
                resizeFrameRef.current = null;
                const pending = pendingResizeRef.current;
                pendingResizeRef.current = null;
                if (pending) setResizedWidths(prev => ({ ...prev, [pending.columnName]: pending.width }));
            });
        };
        const onMouseUp = (e: MouseEvent) => {
            if (!resizeDragRef.current) return;
            const { columnName, startX, startWidth } = resizeDragRef.current;
            const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
            if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current);
            resizeFrameRef.current = null;
            pendingResizeRef.current = null;
            setResizedWidths(prev => ({ ...prev, [columnName]: newWidth }));
            onColumnResizeRef.current?.(columnName, newWidth);
            resizeDragRef.current = null;
            restoreBodyStyles();
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current);
            resizeFrameRef.current = null;
            pendingResizeRef.current = null;
            resizeDragRef.current = null;
            restoreBodyStyles();
        };
    }, [restoreBodyStyles]);

    return { resizedWidths, handleResizeMouseDown, handleResizeKeyDown, gridTemplateColumnsRef };
}
