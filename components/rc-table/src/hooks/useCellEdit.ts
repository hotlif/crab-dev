import { type Key, type RefObject, useCallback, useMemo, useState } from "react";
import type { CellEditRecord, ColumnType, Row } from "../types.js";
import { isGroupRow, makeSelectKey, setValueByJsonPath } from "../util.js";
import type { InternalGroupRow } from "../util.js";

export function useCellEdit<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T>>
    bottomColumnsRef: RefObject<ColumnType<T>[]>
    cellEditRecords?: CellEditRecord[]
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void
    onUndo?: (record: CellEditRecord) => void
}) {
    const { displayRows, bottomColumnsRef, cellEditRecords, onCellEditRecordsChange, onUndo } = params;

    const [innerEditRecords, setInnerEditRecords] = useState<CellEditRecord[]>([]);
    const [undoDataVersion, setUndoDataVersion] = useState(0);

    const committedEditRecords = cellEditRecords ?? innerEditRecords;

    const editedCellKeys = useMemo(() => {
        const set = new Set<string>();
        committedEditRecords.forEach((r) => set.add(makeSelectKey(r.rowId, r.columnIndex)));
        return set;
    }, [committedEditRecords]);

    const handleCellCommit = useCallback((rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => {
        const scalarOld = Array.isArray(oldValue) && oldValue.length > 0 ? oldValue[0] : oldValue;
        if (scalarOld === newValue) return;
        const record: CellEditRecord = { rowId, columnName, columnIndex, oldValue, newValue, timestamp: Date.now() };
        const next = [...committedEditRecords, record];
        if (cellEditRecords == null) setInnerEditRecords(next);
        onCellEditRecordsChange?.(next);
    }, [committedEditRecords, cellEditRecords, onCellEditRecordsChange]);

    // 返回 true 表示撤销成功，供调用方决定是否 preventDefault
    const handleUndo = useCallback((): boolean => {
        if (committedEditRecords.length === 0) return false;
        const last = committedEditRecords[committedEditRecords.length - 1];
        const next = committedEditRecords.slice(0, -1);
        if (cellEditRecords == null) setInnerEditRecords(next);
        onCellEditRecordsChange?.(next);
        onUndo?.(last);
        const rowObj = displayRows.find(r => !isGroupRow(r) && r.id === last.rowId);
        const col = bottomColumnsRef.current[last.columnIndex];
        if (rowObj && !isGroupRow(rowObj) && col) {
            const scalar = Array.isArray(last.oldValue) && last.oldValue.length > 0
                ? last.oldValue[0]
                : last.oldValue;
            setValueByJsonPath((rowObj as T).dataRef, col.name, scalar);
        }
        setUndoDataVersion(v => v + 1);
        return true;
    }, [committedEditRecords, cellEditRecords, onCellEditRecordsChange, onUndo, displayRows, bottomColumnsRef]);

    return { committedEditRecords, undoDataVersion, editedCellKeys, handleCellCommit, handleUndo };
}
