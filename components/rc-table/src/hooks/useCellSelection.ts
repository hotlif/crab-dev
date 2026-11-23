import { type Key, type MouseEvent as ReactMouseEvent, type RefObject, useCallback, useEffect, useEffectEvent, useId, useMemo, useRef, useState } from "react";
import { getPasteRecords } from '../clipboard.js';
import type { CellEditRecord, CellSelectionState, ColumnType, MergeCell, Row } from "../types.js";
import { KEY_SEP, isInternalRow, makeSelectKey } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { getDataValueAccessor } from "../valueAccess.js";

interface SelectionAnchor {
    rowId: Key
    columnIndex: number
}

const buildRectKeys = <T extends Row>(
    rows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>,
    indexedRows: ReadonlyMap<number, T> | undefined,
    a: { rowIndex: number; columnIndex: number },
    b: { rowIndex: number; columnIndex: number },
    isSelectable: (rowIndex: number, columnIndex: number) => boolean
): Key[] => {
    const r1 = Math.min(a.rowIndex, b.rowIndex);
    const r2 = Math.max(a.rowIndex, b.rowIndex);
    const c1 = Math.min(a.columnIndex, b.columnIndex);
    const c2 = Math.max(a.columnIndex, b.columnIndex);
    const keys: Key[] = [];
    const appendRow = (r: number, row: T | InternalGroupRow<T> | InternalExpandedRow<T> | undefined) => {
        if (!row || isInternalRow(row)) return;
        for (let c = c1; c <= c2; c += 1) {
            if (!isSelectable(r, c)) continue;
            keys.push(makeSelectKey(row.id, c));
        }
    };
    if (indexedRows) {
        // A rectangle can span millions of unloaded rows. Visit the cached keys only.
        const indexes = [...indexedRows.keys()].filter(index => index >= r1 && index <= r2).sort((a, b) => a - b);
        for (const index of indexes) appendRow(index, indexedRows.get(index));
    } else {
        for (let index = r1; index <= r2; index += 1) appendRow(index, rows[index]);
    }
    return keys;
};

export function useCellSelection<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    indexedRows?: ReadonlyMap<number, T>
    indexedRowCount?: number
    findBrowseStart?: () => number
    bottomColumnsRef: RefObject<ColumnType<T>[]>
    rootRef?: RefObject<HTMLElement | null>
    selectCells?: Key[]
    onSelectCellsChange?: (cells: Key[]) => void
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
    editing: boolean
    isCovered: (row: number, column: number) => boolean
    onNavigate: (row: number, column: number) => void
    onPasteRecords?: (records: CellEditRecord[]) => void
    onCtrlY?: () => boolean
    onCtrlZ?: () => boolean
    isInteractionActive: () => boolean
}): {
    pasteError: string | undefined;
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
    const { displayRows, indexedRows, bottomColumnsRef, rootRef, selectCells, onSelectCellsChange, onCopy, onCtrlZ,
        isInteractionActive } = params;

    // Stable index lookup for the memoized cell handlers, in either row model.
    const getRow = useCallback((index: number) => indexedRows ? indexedRows.get(index) : displayRows[index], [indexedRows, displayRows]);

    const instanceId = useId();
    const batchSequence = useRef(0);
    const rangeOrigin = useRef<SelectionAnchor | null>(null);
    const [pasteError, setPasteError] = useState<string>();
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
        (indexedRows ?? displayRows).forEach((row, index) => map.set(row.id, index));
        return map;
    }, [displayRows, indexedRows]);

    const canCopy = onCopy !== undefined;
    const serializedRowMap = useMemo(() => {
        const map = new Map<string, { row: T; rowIndex: number }>();
        if (!canCopy) return map;
        (indexedRows ?? displayRows).forEach((row, rowIndex) => {
            if (isInternalRow(row)) return;
            const serializedId = String(row.id);
            // 保持旧版 displayRows.find 的“第一个同字符串 id 命中”语义。
            if (!map.has(serializedId)) map.set(serializedId, { row: row as T, rowIndex });
        });
        return map;
    }, [displayRows, indexedRows, canCopy]);

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
        const row = getRow(rowIndex);
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
    }, [getRow, bottomColumnsRef, dragRect, selectedKeySet]);

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
        const row = getRow(rowIndex);
        if (!row || isInternalRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        rangeOrigin.current = null;
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
        const document = event.currentTarget?.ownerDocument ?? rootRef?.current?.ownerDocument ?? globalThis.document;
        (document.activeElement as HTMLElement | null)?.blur?.();
        event.preventDefault();
    }, [rootRef, anchorCell, anchorRowIndex, committedSelectCells, emitSelectCells, getRow, selectedKeySet, bottomColumnsRef]);

    const handleCellMouseEnter = useCallback((_rowIndex: number, _columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;
        if (event.buttons === 0) {
            isDraggingRef.current = false;
            cancelDragFrame();
            pendingDragEndRef.current = null;
            return;
        }
        const row = getRow(_rowIndex);
        if (!row || isInternalRow(row)) return;
        scheduleDragEnd({ rowIndex: _rowIndex, columnIndex: _columnIndex });
    }, [getRow, scheduleDragEnd, cancelDragFrame]);

    const getCellSelectionState = useCallback((rowIndex: number, columnIndex: number, mergeCell?: MergeCell): CellSelectionState | undefined => {
        if (!dragRect && selectedKeySet.size === 0) return undefined;
        const row = getRow(rowIndex);
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
    }, [anchorCell, getRow, bottomColumnsRef, dragRect, isCellSelected, selectedKeySet]);

    const selectable = (rowIndex: number, columnIndex: number) =>
        bottomColumnsRef.current[columnIndex]?.selectable !== false && !params.isCovered(rowIndex, columnIndex);
    const canBrowse = () => {
        const root = rootRef?.current;
        const active = root?.ownerDocument.activeElement;
        return root && isInteractionActive() && !params.editing
            && (!active || active === root || active === root.ownerDocument.body);
    };
    const handleBrowseKey = useEffectEvent((event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing || event.altKey || !canBrowse()) return false;
        if (event.ctrlKey || event.metaKey) {
            const key = event.key.toLowerCase();
            if ((key === 'y' && !event.shiftKey) || (key === 'z' && event.shiftKey)) {
                if (params.onCtrlY?.()) event.preventDefault();
                return true;
            }
            return false;
        }
        const directions: Record<string, [number, number]> = {
            ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
        };
        const delta = directions[event.key];
        if (!delta) return false;
        const columns = bottomColumnsRef.current;
        let r = anchorRowIndex;
        let c = anchorCell?.columnIndex ?? -1;
        if (r < 0 || c < 0 || c >= columns.length) {
            r = params.findBrowseStart?.() ?? displayRows.findIndex(row => !isInternalRow(row));
            c = r < 0 ? -1 : columns.findIndex((_, index) => selectable(r, index));
        } else {
            let nextRow;
            do {
                r += delta[0];
                c += delta[1];
                nextRow = getRow(r);
            } while (nextRow && columns[c] && (isInternalRow(nextRow) || !selectable(r, c)));
        }
        event.preventDefault();
        const row = getRow(r);
        if (!columns[c]) return true;
        if (!row) {
            if (r >= 0 && r < (params.indexedRowCount ?? 0)) params.onNavigate(r, c);
            return true;
        }
        const target = { rowId: row.id, columnIndex: c };
        if (!event.shiftKey || !rangeOrigin.current) rangeOrigin.current = event.shiftKey ? anchorCell ?? target : target;
        const origin = rangeOrigin.current;
        const originRow = rowIdToIndex.get(origin.rowId) ?? r;
        emitSelectCells(buildRectKeys(displayRows, indexedRows, { rowIndex: originRow, columnIndex: origin.columnIndex },
            { rowIndex: r, columnIndex: c }, selectable));
        setAnchorCell(target);
        rootRef?.current?.focus({ preventScroll: true });
        params.onNavigate(r, c);
        return true;
    });
    const handlePaste = useEffectEvent((event: ClipboardEvent) => {
        if (event.defaultPrevented || !canBrowse() || !params.onPasteRecords || !anchorCell || anchorRowIndex < 0 || !event.clipboardData) return;
        if (!Array.from(event.clipboardData.types).includes('text/plain')) return;
        event.preventDefault();
        try {
            const records = getPasteRecords(event.clipboardData.getData('text/plain'), anchorRowIndex, anchorCell.columnIndex,
                displayRows, bottomColumnsRef.current, params.isCovered, instanceId + '-' + (++batchSequence.current));
            params.onPasteRecords(records);
            setPasteError(undefined);
        } catch (error) {
            setPasteError(error instanceof Error ? error.message : String(error));
        }
    });
    const finishRange = useEffectEvent((a: { rowIndex: number; columnIndex: number }, b: typeof a) =>
        emitSelectCells(buildRectKeys(displayRows, indexedRows, a, b, selectable)));

    useEffect(() => {
        const document = rootRef?.current?.ownerDocument ?? globalThis.document;
        const target = document.defaultView ?? document;
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
                finishRange(finalRect.anchor, finalRect.end);
            }
            dragRectRef.current = null;
            setDragRect(null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isInteractionActive() || event.defaultPrevented || event.isComposing || handleBrowseKey(event)) return;
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
                            if (indexedRows && !rowEntry) return [];
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
            rangeOrigin.current = null;
            setPasteError(undefined);
            setAnchorCell(null);
            setDragRect(null);
            isDraggingRef.current = false;
            if (committedSelectCells.length > 0) emitSelectCells([]);
        };

        target.addEventListener('paste', handlePaste as EventListener);
        target.addEventListener("mouseup", handleMouseUp);
        target.addEventListener("keydown", handleKeyDown as EventListener);
        return () => {
            target.removeEventListener('paste', handlePaste as EventListener);
            target.removeEventListener("mouseup", handleMouseUp);
            target.removeEventListener("keydown", handleKeyDown as EventListener);
        };
    }, [rootRef, indexedRows, emitSelectCells, committedSelectCells, anchorCell, serializedRowMap, bottomColumnsRef, isInteractionActive, cancelDragFrame]);

    useEffect(() => () => {
        cancelDragFrame();
        pendingDragEndRef.current = null;
    }, [cancelDragFrame]);

    const selectSingleCell = useCallback((rowIndex: number, columnIndex: number) => {
        const row = getRow(rowIndex);
        if (!row || isInternalRow(row)) return;
        if (bottomColumnsRef.current[columnIndex]?.selectable === false) return;
        rangeOrigin.current = null;
        setAnchorCell({ rowId: row.id, columnIndex });
        dragRectRef.current = null;
        setDragRect(null);
        emitSelectCells([makeSelectKey(row.id, columnIndex)]);
    }, [getRow, bottomColumnsRef, emitSelectCells]);

    return {
        pasteError,
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
