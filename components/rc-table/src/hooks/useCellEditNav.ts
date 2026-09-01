import { useCallback, useEffect, useState, type Key, type RefObject } from "react";
import type { ColumnType, Row } from "../types.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { isInternalRow } from "../util.js";

/** Tab-forward / Tab-backward：行内左右；Enter / Shift-Enter：列内上下；Escape：退出 */
export type CellNavDirection = 'tab-forward' | 'tab-backward' | 'enter' | 'shift-enter' | 'escape';

interface UseCellEditNavOptions<T extends Row> {
    editType?: "cell" | "row";
    displayRows: (T | InternalGroupRow<T> | InternalExpandedRow<T>)[];
    bottomColumnsRef: RefObject<ColumnType<T>[]>;
    skipCellSet: Set<string>;
    getCellKey: (rowIndex: number, columnIndex: number) => string;
    selectionColumnName: string;
}

export interface CellEditPosition {
    rowId: Key;
    columnName: string;
}

export interface CellNavigationTarget {
    rowIndex: number;
    columnIndex: number;
}

export interface UseCellEditNavResult {
    editingCellPos: CellEditPosition | null;
    startCellEdit: (rowIndex: number, columnIndex: number) => void;
    exitCellEdit: () => void;
    navigateCellEdit: (
        rowIndex: number,
        columnIndex: number,
        direction: Exclude<CellNavDirection, "escape">,
    ) => CellNavigationTarget | null;
}

export function useCellEditNav<T extends Row>({
    editType,
    displayRows,
    bottomColumnsRef,
    skipCellSet,
    getCellKey,
    selectionColumnName,
}: UseCellEditNavOptions<T>): UseCellEditNavResult {
    // 编辑身份必须跟随数据而不是可变的视图坐标。排序、树展开或拖列后，
    // rowIndex / columnIndex 可能指向完全不同的记录与列。
    const [editingCellPos, setEditingCellPos] = useState<{ rowId: Key; columnName: string } | null>(null);

    useEffect(() => {
        if (editType !== 'cell') setEditingCellPos(null);
    }, [editType]);

    useEffect(() => {
        if (!editingCellPos) return;
        const rowExists = displayRows.some(row => !isInternalRow(row) && row.id === editingCellPos.rowId);
        const columnExists = (bottomColumnsRef.current ?? []).some(column => column.name === editingCellPos.columnName);
        if (!rowExists || !columnExists) setEditingCellPos(null);
    }, [editingCellPos, displayRows, bottomColumnsRef]);

    const isEditableCell = useCallback((rowIndex: number, columnIndex: number): boolean => {
        const row = displayRows[rowIndex];
        if (!row || isInternalRow(row)) return false;
        if (skipCellSet.has(getCellKey(rowIndex, columnIndex))) return false;
        const col = (bottomColumnsRef.current ?? [])[columnIndex];
        if (!col || !col.editRender || col.name === selectionColumnName) return false;
        return true;
    }, [displayRows, bottomColumnsRef, skipCellSet, getCellKey, selectionColumnName]);

    const findNext = useCallback((
        rowIndex: number,
        columnIndex: number,
        direction: Exclude<CellNavDirection, 'escape'>,
    ): { rowIndex: number; columnIndex: number } | null => {
        const columns = bottomColumnsRef.current ?? [];
        const totalRows = displayRows.length;
        const totalCols = columns.length;

        if (direction === 'tab-forward') {
            let r = rowIndex;
            let c = columnIndex + 1;
            while (r < totalRows) {
                while (c < totalCols) {
                    if (isEditableCell(r, c)) return { rowIndex: r, columnIndex: c };
                    c++;
                }
                r++;
                c = 0;
            }
        } else if (direction === 'tab-backward') {
            let r = rowIndex;
            let c = columnIndex - 1;
            while (r >= 0) {
                while (c >= 0) {
                    if (isEditableCell(r, c)) return { rowIndex: r, columnIndex: c };
                    c--;
                }
                r--;
                c = totalCols - 1;
            }
        } else if (direction === 'enter') {
            for (let r = rowIndex + 1; r < totalRows; r++) {
                if (isEditableCell(r, columnIndex)) return { rowIndex: r, columnIndex };
            }
        } else if (direction === 'shift-enter') {
            for (let r = rowIndex - 1; r >= 0; r--) {
                if (isEditableCell(r, columnIndex)) return { rowIndex: r, columnIndex };
            }
        }
        return null;
    }, [displayRows, bottomColumnsRef, isEditableCell]);

    const startCellEdit = useCallback((rowIndex: number, columnIndex: number) => {
        if (editType !== 'cell') return;
        const row = displayRows[rowIndex];
        const column = (bottomColumnsRef.current ?? [])[columnIndex];
        if (!row || isInternalRow(row) || !column) return;
        setEditingCellPos({ rowId: row.id, columnName: column.name });
    }, [editType, displayRows, bottomColumnsRef]);

    const exitCellEdit = useCallback(() => {
        setEditingCellPos(null);
    }, []);

    const navigateCellEdit = useCallback((
        rowIndex: number,
        columnIndex: number,
        direction: Exclude<CellNavDirection, 'escape'>,
    ) => {
        const next = findNext(rowIndex, columnIndex, direction);
        if (!next) {
            setEditingCellPos(null);
            return next;
        }
        const row = displayRows[next.rowIndex];
        const column = (bottomColumnsRef.current ?? [])[next.columnIndex];
        setEditingCellPos(row && !isInternalRow(row) && column
            ? { rowId: row.id, columnName: column.name }
            : null);
        return next;
    }, [findNext, displayRows, bottomColumnsRef]);

    return { editingCellPos, startCellEdit, exitCellEdit, navigateCellEdit };
}
