import { JSONPath } from "jsonpath-plus";
import { type Key, type MouseEvent as ReactMouseEvent, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CellSelectionState, ColumnType, MergeCell, Row } from "../types.js";
import { KEY_SEP, isGroupRow, makeSelectKey } from "../util.js";
import type { InternalGroupRow } from "../util.js";

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
    displayRows: Array<T | InternalGroupRow<T>>
    bottomColumnsRef: RefObject<ColumnType<T>[]>
    selectCells?: Key[]
    onSelectCellsChange?: (cells: Key[]) => void
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
    onCtrlZ?: () => boolean
}) {
    const { displayRows, bottomColumnsRef, selectCells, onSelectCellsChange, onCopy, onCtrlZ } = params;

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

    const committedSelectCells = selectCells ?? innerSelectCells;

    const rowIdToIndex = useMemo(() => {
        const map = new Map<Key, number>();
        displayRows.forEach((row, index) => map.set(row.id, index));
        return map;
    }, [displayRows]);

    const emitSelectCells = useCallback((next: Key[]) => {
        if (selectCells == null) setInnerSelectCells(next);
        onSelectCellsChange?.(next);
    }, [selectCells, onSelectCellsChange]);

    const selectedKeySet = useMemo(() => {
        const set = new Set<string>();
        if (dragRect) {
            buildRectKeys(displayRows, dragRect.anchor, dragRect.end,
                (c) => bottomColumnsRef.current[c]?.selectable !== false)
                .forEach((key) => set.add(String(key)));
        } else {
            committedSelectCells.forEach((key) => set.add(String(key)));
        }
        return set;
    }, [dragRect, displayRows, committedSelectCells, bottomColumnsRef]);

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
        if (!row || isGroupRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        const cell = { rowIndex, columnIndex };
        const keyString = makeSelectKey(row.id, columnIndex);

        if (event.shiftKey && anchorCell && anchorRowIndex >= 0) {
            setDragRect({ anchor: { rowIndex: anchorRowIndex, columnIndex: anchorCell.columnIndex }, end: cell });
            isDraggingRef.current = true;
        } else if (event.ctrlKey || event.metaKey) {
            const next = selectedKeySet.has(keyString)
                ? committedSelectCells.filter((k) => String(k) !== keyString)
                : [...committedSelectCells, keyString];
            emitSelectCells(next);
            setAnchorCell({ rowId: row.id, columnIndex });
        } else {
            setAnchorCell({ rowId: row.id, columnIndex });
            setDragRect({ anchor: cell, end: cell });
            isDraggingRef.current = true;
        }
        (document.activeElement as HTMLElement | null)?.blur?.();
        event.preventDefault();
    }, [anchorCell, anchorRowIndex, committedSelectCells, emitSelectCells, displayRows, selectedKeySet, bottomColumnsRef]);

    const handleCellMouseEnter = useCallback((_rowIndex: number, _columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        if (event.buttons === 0) { isDraggingRef.current = false; return; }
        if (isGroupRow(displayRows[_rowIndex])) return;
        setDragRect((prev) => {
            if (!prev) return prev;
            if (prev.end.rowIndex === _rowIndex && prev.end.columnIndex === _columnIndex) return prev;
            return { anchor: prev.anchor, end: { rowIndex: _rowIndex, columnIndex: _columnIndex } };
        });
    }, [displayRows]);

    const getCellSelectionState = useCallback((rowIndex: number, columnIndex: number, mergeCell?: MergeCell): CellSelectionState | undefined => {
        const row = displayRows[rowIndex];
        if (!row || isGroupRow(row)) return undefined;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return undefined;
        const key = makeSelectKey(row.id, columnIndex);
        if (!selectedKeySet.has(key)) return undefined;
        const bottomRowIdx = rowIndex + (mergeCell ? mergeCell.rowSpan + 1 : 1);
        const rightColIdx = columnIndex + (mergeCell ? mergeCell.colSpan + 1 : 1);
        const prevRow = displayRows[rowIndex - 1];
        const bottomRow = displayRows[bottomRowIdx];
        const prevSelected = prevRow && !isGroupRow(prevRow) && selectedKeySet.has(makeSelectKey(prevRow.id, columnIndex));
        const bottomSelected = bottomRow && !isGroupRow(bottomRow) && selectedKeySet.has(makeSelectKey(bottomRow.id, columnIndex));
        return {
            selected: true,
            isAnchor: anchorCell?.rowId === row.id && anchorCell?.columnIndex === columnIndex,
            edgeTop: !prevSelected,
            edgeBottom: !bottomSelected,
            edgeLeft: !selectedKeySet.has(makeSelectKey(row.id, columnIndex - 1)),
            edgeRight: !selectedKeySet.has(makeSelectKey(row.id, rightColIdx))
        };
    }, [anchorCell, displayRows, selectedKeySet, bottomColumnsRef]);

    useEffect(() => {
        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const finalRect = dragRectRef.current;
            if (finalRect) {
                emitSelectCells(buildRectKeys(displayRows, finalRect.anchor, finalRect.end,
                    (c) => bottomColumnsRef.current[c]?.selectable !== false));
            }
            setDragRect(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
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
                            const row = displayRows.find(r => !isGroupRow(r) && String(r.id) === rowIdRaw);
                            const rowIndex = row ? (rowIdToIndex.get(row.id) ?? -1) : -1;
                            const value = row && !isGroupRow(row)
                                ? (() => {
                                    const res = JSONPath({ path: column.name, json: (row as T).dataRef });
                                    return Array.isArray(res) && res.length > 0 ? res[0] : undefined;
                                })()
                                : undefined;
                            return [{ rowId: row?.id ?? rowIdRaw as Key, rowIndex, columnIndex, columnName: column.name, value }];
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
    }, [displayRows, emitSelectCells, committedSelectCells, anchorCell, rowIdToIndex, bottomColumnsRef]);

    const selectSingleCell = useCallback((rowIndex: number, columnIndex: number) => {
        const row = displayRows[rowIndex];
        if (!row || isGroupRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        setAnchorCell({ rowId: row.id, columnIndex });
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
