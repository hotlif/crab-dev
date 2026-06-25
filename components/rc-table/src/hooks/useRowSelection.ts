import { useCallback, useMemo, useRef, useState, type Key } from "react";
import type { Row, RowSelection } from "../types.js";

interface UseRowSelectionOptions<T extends Row> {
    dataRows: T[]
    rowSelection: RowSelection<T> | undefined
}

export interface UseRowSelectionResult {
    selectedRowIds: Set<Key>
    isAllSelected: boolean
    isIndeterminate: boolean
    toggleRow: (rowId: Key) => void
    selectAllRows: () => void
    clearAllRows: () => void
}

export function useRowSelection<T extends Row>({
    dataRows,
    rowSelection,
}: UseRowSelectionOptions<T>): UseRowSelectionResult {
    const isControlled = rowSelection?.selectedRowIds !== undefined;

    const [uncontrolledIds, setUncontrolledIds] = useState<Set<Key>>(
        () => rowSelection?.defaultSelectedRowIds ?? new Set()
    );

    const selectedRowIds = isControlled
        ? (rowSelection!.selectedRowIds as Set<Key>)
        : uncontrolledIds;

    const enabledRows = useMemo(
        () => dataRows.filter(row => !(rowSelection?.getDisabled?.(row) ?? false)),
        [dataRows, rowSelection]
    );

    const isAllSelected =
        enabledRows.length > 0 && enabledRows.every(row => selectedRowIds.has(row.id));
    const isIndeterminate =
        !isAllSelected && enabledRows.some(row => selectedRowIds.has(row.id));

    const rowMap = useMemo(() => {
        const map = new Map<Key, T>();
        dataRows.forEach(row => map.set(row.id, row));
        return map;
    }, [dataRows]);

    // ref 持有最新状态，供稳定的回调函数读取，避免闭包陈旧问题
    const stateRef = useRef({ selectedRowIds, rowSelection, isControlled, rowMap, enabledRows });
    stateRef.current = { selectedRowIds, rowSelection, isControlled, rowMap, enabledRows };

    const applyChange = useCallback((nextIds: Set<Key>) => {
        const { isControlled: ctrl, rowSelection: rs, rowMap: rm } = stateRef.current;
        if (!ctrl) setUncontrolledIds(nextIds);
        const nextRows = Array.from(nextIds)
            .map(id => rm.get(id))
            .filter((r): r is T => r !== undefined);
        rs?.onChange?.(nextIds, nextRows);
    }, []);

    const toggleRow = useCallback((rowId: Key) => {
        const { selectedRowIds: ids, rowSelection: rs } = stateRef.current;
        if (rs?.type === 'radio') {
            applyChange(new Set<Key>([rowId]));
            return;
        }
        const next = new Set(ids);
        if (next.has(rowId)) next.delete(rowId);
        else next.add(rowId);
        applyChange(next);
    }, [applyChange]);

    const selectAllRows = useCallback(() => {
        const { selectedRowIds: ids, enabledRows: rows } = stateRef.current;
        const next = new Set(ids);
        rows.forEach(row => next.add(row.id));
        applyChange(next);
    }, [applyChange]);

    const clearAllRows = useCallback(() => {
        applyChange(new Set<Key>());
    }, [applyChange]);

    return { selectedRowIds, isAllSelected, isIndeterminate, toggleRow, selectAllRows, clearAllRows };
}
