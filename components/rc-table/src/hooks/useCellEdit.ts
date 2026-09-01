import { type Key, useCallback, useMemo, useState } from "react";
import type { CellEditRecord, Row } from "../types.js";
import { isInternalRow, makeCellIdentityKey, setValueByJsonPath } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";

export function useCellEdit<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    cellEditRecords?: CellEditRecord[]
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void
    onUndo?: (record: CellEditRecord) => void
}): {
    committedEditRecords: CellEditRecord[];
    undoDataVersion: number;
    editedCellKeys: Set<string>;
    handleCellCommit: (rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => void;
    handleUndo: () => boolean;
} {
    const { displayRows, cellEditRecords, onCellEditRecordsChange, onUndo } = params;

    const [innerEditRecords, setInnerEditRecords] = useState<CellEditRecord[]>([]);
    const [undoDataVersion, setUndoDataVersion] = useState(0);

    const committedEditRecords = cellEditRecords ?? innerEditRecords;

    const editedCellKeys = useMemo(() => {
        const set = new Set<string>();
        committedEditRecords.forEach((r) => set.add(makeCellIdentityKey(r.rowId, r.columnName)));
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
        const rowObj = displayRows.find(r => !isInternalRow(r) && r.id === last.rowId);
        if (rowObj && !isInternalRow(rowObj)) {
            const scalar = Array.isArray(last.oldValue) && last.oldValue.length > 0
                ? last.oldValue[0]
                : last.oldValue;
            setValueByJsonPath((rowObj as T).dataRef, last.columnName, scalar);
        }
        setUndoDataVersion(v => v + 1);
        return true;
    }, [committedEditRecords, cellEditRecords, onCellEditRecordsChange, onUndo, displayRows]);

    return { committedEditRecords, undoDataVersion, editedCellKeys, handleCellCommit, handleUndo };
}
