import { type Key, useCallback, useMemo, useRef, useState } from "react";
import type { CellEditRecord, CellsChangeHandler, Row } from "../types.js";
import { isInternalRow, makeCellIdentityKey, setValueByJsonPath } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";

export function useCellEdit<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    cellEditRecords?: CellEditRecord[]
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void
    onCellsChange?: CellsChangeHandler
    onRedo?: (record: CellEditRecord) => void
    onUndo?: (record: CellEditRecord) => void
}): {
    committedEditRecords: CellEditRecord[];
    undoDataVersion: number;
    editedCellKeys: Set<string>;
    handleCellCommit: (rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => void;
    handleUndo: () => boolean;
    handleRedo: () => boolean;
    pasteRecords: (records: CellEditRecord[]) => void;
} {
    const { displayRows, cellEditRecords, onCellEditRecordsChange, onUndo, onRedo, onCellsChange } = params;

    const [innerEditRecords, setInnerEditRecords] = useState<CellEditRecord[]>([]);
    const [undoDataVersion, setUndoDataVersion] = useState(0);

    const committedEditRecords = cellEditRecords ?? innerEditRecords;

    const redoHistory = useRef<{ before: CellEditRecord[]; records: CellEditRecord[] }[]>([]);
    const publish = useCallback((records: CellEditRecord[]) => {
        if (cellEditRecords == null) setInnerEditRecords(records);
        onCellEditRecordsChange?.(records);
    }, [cellEditRecords, onCellEditRecordsChange]);

    const pasteRecords = (records: CellEditRecord[]) => {
        if (!records.length || !onCellsChange) return;
        onCellsChange(records, { reason: 'paste' });
        redoHistory.current = [];
        publish([...committedEditRecords, ...records]);
    };

    const editedCellKeys = useMemo(() => {
        const set = new Set<string>();
        committedEditRecords.forEach((r) => set.add(makeCellIdentityKey(r.rowId, r.columnName)));
        return set;
    }, [committedEditRecords]);

    const handleCellCommit = useCallback((rowId: Key, columnName: string, columnIndex: number, oldValue: unknown, newValue: unknown) => {
        const scalarOld = Array.isArray(oldValue) && oldValue.length > 0 ? oldValue[0] : oldValue;
        if (scalarOld === newValue) return;
        const record: CellEditRecord = { rowId, columnName, columnIndex, oldValue, newValue, timestamp: Date.now() };
        redoHistory.current = [];
        publish([...committedEditRecords, record]);
    }, [committedEditRecords, publish]);

    const replay = (records: CellEditRecord[], reason: 'undo' | 'redo') => {
        onCellsChange?.(records, { reason });
        for (const record of records) {
            (reason === 'undo' ? onUndo : onRedo)?.(record);
            // Existing consumers without a batch writer use the original in-place replay.
            if (onCellsChange) continue;
            const row = displayRows.find(item => !isInternalRow(item) && item.id === record.rowId);
            if (!row) continue;
            const old = record.oldValue;
            const previous = !record.batchId && Array.isArray(old) && old.length ? old[0] : old;
            setValueByJsonPath(row.dataRef, record.columnName, reason === 'undo' ? previous : record.newValue);
        }
        setUndoDataVersion(version => version + 1);
    };

    const handleUndo = () => {
        const last = committedEditRecords.at(-1);
        if (!last) return false;
        let start = committedEditRecords.length - 1;
        while (start > 0 && last.batchId && committedEditRecords[start - 1].batchId === last.batchId) start--;
        const before = committedEditRecords.slice(0, start);
        const records = committedEditRecords.slice(start);
        replay([...records].reverse(), 'undo');
        redoHistory.current.push({ before, records });
        publish(before);
        return true;
    };
    const handleRedo = () => {
        const entry = redoHistory.current.at(-1);
        if (!entry || entry.before.length !== committedEditRecords.length
            || !entry.before.every((record, index) => record === committedEditRecords[index])) return false;
        replay(entry.records, 'redo');
        redoHistory.current.pop();
        publish([...committedEditRecords, ...entry.records]);
        return true;
    };

    return { committedEditRecords, undoDataVersion, editedCellKeys, handleCellCommit, handleUndo, handleRedo, pasteRecords };
}
