import { useCallback, useEffect, useState, type RefObject } from "react";
import type { ColumnType, Row } from "../types.js";
import type { InternalGroupRow } from "../util.js";
import { isGroupRow } from "../util.js";

/** Tab-forward / Tab-backward：行内左右；Enter / Shift-Enter：列内上下；Escape：退出 */
export type CellNavDirection = 'tab-forward' | 'tab-backward' | 'enter' | 'shift-enter' | 'escape';

interface UseCellEditNavOptions<T extends Row> {
    editType?: "cell" | "row";
    displayRows: (T | InternalGroupRow<T>)[];
    bottomColumnsRef: RefObject<ColumnType<T>[]>;
    skipCellSet: Set<string>;
    getCellKey: (rowIndex: number, columnIndex: number) => string;
    selectionColumnName: string;
}

export function useCellEditNav<T extends Row>({
    editType,
    displayRows,
    bottomColumnsRef,
    skipCellSet,
    getCellKey,
    selectionColumnName,
}: UseCellEditNavOptions<T>) {
    const [editingCellPos, setEditingCellPos] = useState<{ rowIndex: number; columnIndex: number } | null>(null);

    useEffect(() => {
        if (editType !== 'cell') setEditingCellPos(null);
    }, [editType]);

    const isEditableCell = useCallback((rowIndex: number, columnIndex: number): boolean => {
        const row = displayRows[rowIndex];
        if (!row || isGroupRow(row)) return false;
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
        setEditingCellPos({ rowIndex, columnIndex });
    }, [editType]);

    const exitCellEdit = useCallback(() => {
        setEditingCellPos(null);
    }, []);

    const navigateCellEdit = useCallback((
        rowIndex: number,
        columnIndex: number,
        direction: Exclude<CellNavDirection, 'escape'>,
    ) => {
        const next = findNext(rowIndex, columnIndex, direction);
        setEditingCellPos(next);
        return next;
    }, [findNext]);

    return { editingCellPos, startCellEdit, exitCellEdit, navigateCellEdit };
}
