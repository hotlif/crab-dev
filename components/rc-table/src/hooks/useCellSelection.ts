import { type Key, type MouseEvent as ReactMouseEvent, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CellSelectionState, ColumnType, MergeCell, Row } from "../types.js";
import { KEY_SEP, isInternalRow, makeSelectKey } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { getDataValueAccessor } from "../valueAccess.js";

interface SelectionAnchor {
    rowId: Key
    columnIndex: number
}

const buildRectKeys = (
    rows: Array<{ id: Key }>,
    a: { rowIndex: number; columnIndex: number },
    b: { rowIndex: number; columnIndex: number },
    isColumnSelectable?: (columnIndex: number) => boolean
): Key[] => {
    const r1 = Math.min(a.rowIndex, b.rowIndex);
    const r2 = Math.max(a.rowIndex, b.rowIndex);
    const c1 = Math.min(a.columnIndex, b.columnIndex);
    const c2 = Math.max(a.columnIndex, b.columnIndex);
    const keys: Key[] = [];
    for (let r = r1; r <= r2; r += 1) {
        const row = rows[r];
        if (!row) continue;
        for (let c = c1; c <= c2; c += 1) {
            if (isColumnSelectable && !isColumnSelectable(c)) continue;
            keys.push(makeSelectKey(row.id, c));
        }
    }
    return keys;
};

export function useCellSelection<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    bottomColumnsRef: RefObject<ColumnType<T>[]>
    selectCells?: Key[]
    onSelectCellsChange?: (cells: Key[]) => void
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
    onCtrlZ?: () => boolean
    isInteractionActive: () => boolean
}): {
    committedSelectCells: Key[];
    selectedKeySet: Set<string>;
    anchorCell: SelectionAnchor | null;
    rowIdToIndex: Map<Key, number>;
    emitSelectCells: (next: Key[]) => void;
    selectSingleCell: (rowIndex: number, columnIndex: number) => void;
    handleCellMouseDown: (rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void;
    handleCellMouseEnter: (_rowIndex: number, _columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => void;
    getCellSelectionState: (rowIndex: number, columnIndex: number, mergeCell?: MergeCell) => CellSelectionState | undefined;
} {
    const { displayRows, bottomColumnsRef, selectCells, onSelectCellsChange, onCopy, onCtrlZ, isInteractionActive } = params;

    const onCopyRef = useRef(onCopy);
    onCopyRef.current = onCopy;
    const onCtrlZRef = useRef(onCtrlZ);
    onCtrlZRef.current = onCtrlZ;

    const [innerSelectCells, setInnerSelectCells] = useState<Key[]>([]);
    const [anchorCell, setAnchorCell] = useState<SelectionAnchor | null>(null);
    const [dragRect, setDragRect] = useState<{
        anchor: { rowIndex: number; columnIndex: number }
        end: { rowIndex: number; columnIndex: number }
    } | null>(null);
    const isDraggingRef = useRef(false);
    const dragRectRef = useRef<typeof dragRect>(null);
    dragRectRef.current = dragRect;
    const pendingDragEndRef = useRef<{ rowIndex: number; columnIndex: number } | null>(null);
    const dragFrameRef = useRef<number | null>(null);

    const cancelDragFrame = useCallback(() => {
        if (dragFrameRef.current == null) return;
        if (typeof globalThis.cancelAnimationFrame === "function") {
            globalThis.cancelAnimationFrame(dragFrameRef.current);
        } else {
            globalThis.clearTimeout(dragFrameRef.current);
        }
        dragFrameRef.current = null;
    }, []);

    const scheduleDragEnd = useCallback((end: { rowIndex: number; columnIndex: number }) => {
        pendingDragEndRef.current = end;
        if (dragFrameRef.current != null) return;
        const flush = () => {
            dragFrameRef.current = null;
            const nextEnd = pendingDragEndRef.current;
            pendingDragEndRef.current = null;
            if (!nextEnd) return;
            setDragRect((prev) => {
                if (!prev || (prev.end.rowIndex === nextEnd.rowIndex && prev.end.columnIndex === nextEnd.columnIndex)) {
                    return prev;
                }
                const next = { anchor: prev.anchor, end: nextEnd };
                dragRectRef.current = next;
                return next;
            });
        };
        // 先写哨兵，兼容测试环境提供的同步 requestAnimationFrame。
        dragFrameRef.current = -1;
        const frameId = typeof globalThis.requestAnimationFrame === "function"
            ? globalThis.requestAnimationFrame(flush)
            : globalThis.setTimeout(flush, 16) as unknown as number;
        if (dragFrameRef.current === -1) dragFrameRef.current = frameId;
    }, []);

    const committedSelectCells = selectCells ?? innerSelectCells;

    const rowIdToIndex = useMemo(() => {
        const map = new Map<Key, number>();
        displayRows.forEach((row, index) => map.set(row.id, index));
        return map;
    }, [displayRows]);

    const serializedRowMap = useMemo(() => {
        const map = new Map<string, { row: T; rowIndex: number }>();
        displayRows.forEach((row, rowIndex) => {
            if (isInternalRow(row)) return;
            const serializedId = String(row.id);
            // 保持旧版 displayRows.find 的“第一个同字符串 id 命中”语义。
            if (!map.has(serializedId)) map.set(serializedId, { row: row as T, rowIndex });
        });
        return map;
    }, [displayRows]);

    const emitSelectCells = useCallback((next: Key[]) => {
        if (selectCells == null) setInnerSelectCells(next);
        onSelectCellsChange?.(next);
    }, [selectCells, onSelectCellsChange]);

    const selectedKeySet = useMemo(() => {
        const set = new Set<string>();
        committedSelectCells.forEach((key) => set.add(String(key)));
        return set;
    }, [committedSelectCells]);

    const isCellSelected = useCallback((rowIndex: number, columnIndex: number): boolean => {
        const row = displayRows[rowIndex];
        if (!row || isInternalRow(row)) return false;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return false;
        if (dragRect) {
            const minRow = Math.min(dragRect.anchor.rowIndex, dragRect.end.rowIndex);
            const maxRow = Math.max(dragRect.anchor.rowIndex, dragRect.end.rowIndex);
            const minColumn = Math.min(dragRect.anchor.columnIndex, dragRect.end.columnIndex);
            const maxColumn = Math.max(dragRect.anchor.columnIndex, dragRect.end.columnIndex);
            return rowIndex >= minRow && rowIndex <= maxRow
                && columnIndex >= minColumn && columnIndex <= maxColumn;
        }
        return selectedKeySet.has(makeSelectKey(row.id, columnIndex));
    }, [displayRows, bottomColumnsRef, dragRect, selectedKeySet]);

    const anchorRowIndex = useMemo(() => {
        if (!anchorCell) return -1;
        return rowIdToIndex.get(anchorCell.rowId) ?? -1;
    }, [anchorCell, rowIdToIndex]);

    // rows 重排后若锚点行已不存在，清除锚点与选区
    useEffect(() => {
        if (anchorCell && !rowIdToIndex.has(anchorCell.rowId)) {
            setAnchorCell(null);
            if (committedSelectCells.length > 0) emitSelectCells([]);
        }
    }, [anchorCell, rowIdToIndex, committedSelectCells, emitSelectCells]);

    const handleCellMouseDown = useCallback((rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return;
        const row = displayRows[rowIndex];
        if (!row || isInternalRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        const cell = { rowIndex, columnIndex };
        const keyString = makeSelectKey(row.id, columnIndex);

        if (event.shiftKey && anchorCell && anchorRowIndex >= 0) {
            const nextRect = { anchor: { rowIndex: anchorRowIndex, columnIndex: anchorCell.columnIndex }, end: cell };
            dragRectRef.current = nextRect;
            setDragRect(nextRect);
            isDraggingRef.current = true;
        } else if (event.ctrlKey || event.metaKey) {
            const next = selectedKeySet.has(keyString)
                ? committedSelectCells.filter((k) => String(k) !== keyString)
                : [...committedSelectCells, keyString];
            emitSelectCells(next);
            setAnchorCell({ rowId: row.id, columnIndex });
        } else {
            setAnchorCell({ rowId: row.id, columnIndex });
            const nextRect = { anchor: cell, end: cell };
            dragRectRef.current = nextRect;
            setDragRect(nextRect);
            isDraggingRef.current = true;
        }
        (document.activeElement as HTMLElement | null)?.blur?.();
        event.preventDefault();
    }, [anchorCell, anchorRowIndex, committedSelectCells, emitSelectCells, displayRows, selectedKeySet, bottomColumnsRef]);

    const handleCellMouseEnter = useCallback((_rowIndex: number, _columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        if (event.buttons === 0) {
            isDraggingRef.current = false;
            cancelDragFrame();
            pendingDragEndRef.current = null;
            return;
        }
        if (isInternalRow(displayRows[_rowIndex])) return;
        scheduleDragEnd({ rowIndex: _rowIndex, columnIndex: _columnIndex });
    }, [displayRows, scheduleDragEnd, cancelDragFrame]);

    const getCellSelectionState = useCallback((rowIndex: number, columnIndex: number, mergeCell?: MergeCell): CellSelectionState | undefined => {
        const row = displayRows[rowIndex];
        if (!row || isInternalRow(row)) return undefined;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return undefined;
        if (!isCellSelected(rowIndex, columnIndex)) return undefined;
        const bottomRowIdx = rowIndex + (mergeCell ? mergeCell.rowSpan + 1 : 1);
        const rightColIdx = columnIndex + (mergeCell ? mergeCell.colSpan + 1 : 1);
        return {
            selected: true,
            isAnchor: anchorCell?.rowId === row.id && anchorCell?.columnIndex === columnIndex,
            edgeTop: !isCellSelected(rowIndex - 1, columnIndex),
            edgeBottom: !isCellSelected(bottomRowIdx, columnIndex),
            edgeLeft: !isCellSelected(rowIndex, columnIndex - 1),
            edgeRight: !isCellSelected(rowIndex, rightColIdx)
        };
    }, [anchorCell, displayRows, bottomColumnsRef, isCellSelected]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const pendingEnd = pendingDragEndRef.current;
            const currentRect = dragRectRef.current;
            const finalRect = currentRect && pendingEnd
                ? { anchor: currentRect.anchor, end: pendingEnd }
                : currentRect;
            cancelDragFrame();
            pendingDragEndRef.current = null;
            if (finalRect) {
                emitSelectCells(buildRectKeys(displayRows, finalRect.anchor, finalRect.end,
                    (c) => bottomColumnsRef.current[c]?.selectable !== false));
            }
            dragRectRef.current = null;
            setDragRect(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isInteractionActive()) return;
            const isMod = event.ctrlKey || event.metaKey;

            // Ctrl/Cmd+Z：撤销
            if (isMod && !event.shiftKey && event.key === "z") {
                const tag = (document.activeElement as HTMLElement | null)?.tagName?.toLowerCase();
                if (tag !== "input" && tag !== "textarea" && tag !== "select") {
                    if (onCtrlZRef.current?.()) event.preventDefault();
                    return;
                }
            }

            // Ctrl/Cmd+C：复制选区数据
            if (isMod && !event.shiftKey && event.key === "c") {
                const tag = (document.activeElement as HTMLElement | null)?.tagName?.toLowerCase();
                if (tag !== "input" && tag !== "textarea" && tag !== "select") {
                    if (committedSelectCells.length > 0 && onCopyRef.current) {
                        const cells = committedSelectCells.flatMap((key) => {
                            const str = String(key);
                            const sepIdx = str.indexOf(KEY_SEP);
                            const rowIdRaw = str.substring(0, sepIdx);
                            const columnIndex = Number(str.substring(sepIdx + 1));
                            const column = bottomColumnsRef.current[columnIndex];
                            if (!column) return [];
                            const rowEntry = serializedRowMap.get(rowIdRaw);
                            const value = rowEntry
                                ? getDataValueAccessor(column.name).get(rowEntry.row.dataRef)
                                : undefined;
                            return [{
                                rowId: rowEntry?.row.id ?? rowIdRaw as Key,
                                rowIndex: rowEntry?.rowIndex ?? -1,
                                columnIndex,
                                columnName: column.name,
                                value,
                            }];
                        });
                        onCopyRef.current(cells);
                        event.preventDefault();
                    }
                    return;
                }
            }

            // Esc：清空选区与锚点
            if (event.key !== "Escape") return;
            if (committedSelectCells.length === 0 && anchorCell == null && dragRectRef.current == null) return;
            setAnchorCell(null);
            setDragRect(null);
            isDraggingRef.current = false;
            if (committedSelectCells.length > 0) emitSelectCells([]);
        };

        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [displayRows, emitSelectCells, committedSelectCells, anchorCell, serializedRowMap, bottomColumnsRef, isInteractionActive, cancelDragFrame]);

    useEffect(() => () => {
        cancelDragFrame();
        pendingDragEndRef.current = null;
    }, [cancelDragFrame]);

    const selectSingleCell = useCallback((rowIndex: number, columnIndex: number) => {
        const row = displayRows[rowIndex];
        if (!row || isInternalRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        setAnchorCell({ rowId: row.id, columnIndex });
        dragRectRef.current = null;
        setDragRect(null);
        emitSelectCells([makeSelectKey(row.id, columnIndex)]);
    }, [displayRows, bottomColumnsRef, emitSelectCells]);

    return {
        committedSelectCells,
        selectedKeySet,
        anchorCell,
        rowIdToIndex,
        emitSelectCells,
        selectSingleCell,
        handleCellMouseDown,
        handleCellMouseEnter,
        getCellSelectionState,
    };
}
