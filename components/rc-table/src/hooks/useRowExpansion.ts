import { type Key, type ReactNode, useCallback, useMemo, useState } from "react";
import type { Row } from "../types.js";
import { buildExpansionDisplayRows } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";

export function useRowExpansion<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T>>
    expandedRowRender?: (row: T) => ReactNode
    isRowExpandable?: (row: T) => boolean
    expandedRowKeys?: Set<Key>
    defaultExpandedRowKeys?: Set<Key>
    onExpandedRowKeysChange?: (keys: Set<Key>) => void
    expandedRowHeight: number
    getExpandedRowHeight?: (row: T) => number | undefined
}): {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    expandedKeySet: Set<Key>
    isExpansion: boolean
    toggleExpandRow: (id: Key) => void
} {
    const {
        displayRows, expandedRowRender, isRowExpandable,
        expandedRowKeys, defaultExpandedRowKeys, onExpandedRowKeysChange,
        expandedRowHeight, getExpandedRowHeight
    } = params;

    const [innerExpandedKeys, setInnerExpandedKeys] = useState<Set<Key>>(() => {
        if (defaultExpandedRowKeys != null) return new Set(defaultExpandedRowKeys);
        return new Set<Key>();
    });

    const currentExpandedSet: Set<Key> = expandedRowKeys ?? innerExpandedKeys;

    const isExpansion = !!expandedRowRender;

    const expandedDisplayRows = useMemo(() => {
        if (!isExpansion) return displayRows;
        return buildExpansionDisplayRows<T>({
            displayRows,
            expandedSet: currentExpandedSet,
            isRowExpandable,
            expandedRowHeight,
            getExpandedRowHeight
        }).displayRows;
    }, [displayRows, isExpansion, currentExpandedSet, isRowExpandable, expandedRowHeight, getExpandedRowHeight]);

    const toggleExpandRow = useCallback((id: Key) => {
        const base = new Set<Key>(currentExpandedSet);
        if (base.has(id)) {
            base.delete(id);
        } else {
            base.add(id);
        }
        if (expandedRowKeys == null) setInnerExpandedKeys(base);
        onExpandedRowKeysChange?.(base);
    }, [currentExpandedSet, expandedRowKeys, onExpandedRowKeysChange]);

    return {
        displayRows: expandedDisplayRows,
        expandedKeySet: currentExpandedSet,
        isExpansion,
        toggleExpandRow
    };
}
