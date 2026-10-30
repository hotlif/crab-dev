import { type MouseEvent as ReactMouseEvent, type MutableRefObject, type RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useColumnResize(params: {
    bottomColumnsRef: RefObject<{ name: string }[]>
    rootRef?: RefObject<HTMLElement | null>
    onColumnResize?: (columnName: string, width: number) => void
}): {
    resizedWidths: Record<string, number>;
    handleResizeMouseDown: (columnIndex: number, e: ReactMouseEvent) => void;
    handleResizeKeyDown: (columnIndex: number, delta: number) => void;
    gridTemplateColumnsRef: MutableRefObject<number[]>;
} {
    const { bottomColumnsRef, onColumnResize, rootRef } = params;

    const [resizedWidths, setResizedWidths] = useState<Record<string, number>>({});
    const resizeDragRef = useRef<{ columnName: string; startX: number; startWidth: number } | null>(null);
    const gridTemplateColumnsRef = useRef<number[]>([]) as MutableRefObject<number[]>;
    const resizeFrameRef = useRef<number | null>(null);
    const pendingResizeRef = useRef<{ columnName: string; width: number } | null>(null);
    const previousBodyStyleRef = useRef<{ body: HTMLElement; cursor: string; userSelect: string } | null>(null);
    // latest-ref：全局 mouseup 监听只注册一次，但应调用最新的消费方回调。
    const onColumnResizeRef = useRef(onColumnResize);
    onColumnResizeRef.current = onColumnResize;

    const restoreBodyStyles = useCallback(() => {
        const previous = previousBodyStyleRef.current;
        if (!previous) return;
        previous.body.style.cursor = previous.cursor;
        previous.body.style.userSelect = previous.userSelect;
        previousBodyStyleRef.current = null;
    }, []);

    const handleResizeMouseDown = useCallback((columnIndex: number, e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const column = bottomColumnsRef.current[columnIndex];
        if (!column) return;
        const body = e.currentTarget?.ownerDocument.body ?? rootRef?.current?.ownerDocument.body ?? globalThis.document.body;
        if (!previousBodyStyleRef.current) {
            previousBodyStyleRef.current = {
                body,
                cursor: body.style.cursor,
                userSelect: body.style.userSelect,
            };
        }
        resizeDragRef.current = {
            columnName: column.name,
            startX: e.clientX,
            startWidth: gridTemplateColumnsRef.current[columnIndex],
        };
        body.style.cursor = "col-resize";
        body.style.userSelect = "none";
    }, [bottomColumnsRef, rootRef]);

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
        const document = rootRef?.current?.ownerDocument ?? globalThis.document;
        const target = document.defaultView ?? document;
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
        target.addEventListener("mousemove", onMouseMove as EventListener);
        target.addEventListener("mouseup", onMouseUp as EventListener);
        return () => {
            target.removeEventListener("mousemove", onMouseMove as EventListener);
            target.removeEventListener("mouseup", onMouseUp as EventListener);
            if (resizeFrameRef.current !== null) cancelAnimationFrame(resizeFrameRef.current);
            resizeFrameRef.current = null;
            pendingResizeRef.current = null;
            resizeDragRef.current = null;
            restoreBodyStyles();
        };
    }, [rootRef, restoreBodyStyles]);

    return { resizedWidths, handleResizeMouseDown, handleResizeKeyDown, gridTemplateColumnsRef };
}
