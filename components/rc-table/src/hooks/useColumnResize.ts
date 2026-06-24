import { type MouseEvent as ReactMouseEvent, type MutableRefObject, type RefObject, useCallback, useEffect, useRef, useState } from "react";

export function useColumnResize(params: {
    bottomColumnsRef: RefObject<{ name: string }[]>
    onColumnResize?: (columnName: string, width: number) => void
}) {
    const { bottomColumnsRef, onColumnResize } = params;

    const [resizedWidths, setResizedWidths] = useState<Record<string, number>>({});
    const resizeDragRef = useRef<{ columnName: string; startX: number; startWidth: number } | null>(null);
    const gridTemplateColumnsRef = useRef<number[]>([]) as MutableRefObject<number[]>;
    const onColumnResizeRef = useRef(onColumnResize);
    onColumnResizeRef.current = onColumnResize;

    const handleResizeMouseDown = useCallback((columnIndex: number, e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const column = bottomColumnsRef.current[columnIndex];
        if (!column) return;
        resizeDragRef.current = {
            columnName: column.name,
            startX: e.clientX,
            startWidth: gridTemplateColumnsRef.current[columnIndex],
        };
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    }, [bottomColumnsRef]);

    useEffect(() => {
        const MIN_COL_WIDTH = 30;
        const onMouseMove = (e: MouseEvent) => {
            if (!resizeDragRef.current) return;
            const { columnName, startX, startWidth } = resizeDragRef.current;
            const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
            setResizedWidths(prev => ({ ...prev, [columnName]: newWidth }));
        };
        const onMouseUp = (e: MouseEvent) => {
            if (!resizeDragRef.current) return;
            const { columnName, startX, startWidth } = resizeDragRef.current;
            const newWidth = Math.max(MIN_COL_WIDTH, startWidth + e.clientX - startX);
            setResizedWidths(prev => ({ ...prev, [columnName]: newWidth }));
            onColumnResizeRef.current?.(columnName, newWidth);
            resizeDragRef.current = null;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return { resizedWidths, handleResizeMouseDown, gridTemplateColumnsRef };
}
