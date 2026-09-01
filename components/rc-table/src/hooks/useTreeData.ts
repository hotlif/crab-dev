import { type Key, useCallback, useMemo, useState } from "react";
import type { Row, TreeRowMeta } from "../types.js";
import { buildTreeDisplayRows } from "../util.js";

export function useTreeData<T extends Row>(params: {
    rows: T[]
    treeData?: boolean
    getChildRows?: (row: T) => T[] | undefined | null
    expandedRowIds?: Set<Key>
    defaultExpandedRowIds?: Set<Key>
    defaultTreeExpandAll?: boolean
    onExpandedRowIdsChange?: (ids: Set<Key>) => void
}): {
    flatRows: T[]
    treeRowMetaMap: Map<Key, TreeRowMeta>
    isTree: boolean
    toggleTreeRow: (id: Key) => void
} {
    const {
        rows, treeData = false, getChildRows,
        expandedRowIds, defaultExpandedRowIds,
        defaultTreeExpandAll = false, onExpandedRowIdsChange
    } = params;

    const [innerExpandedIds, setInnerExpandedIds] = useState<Set<Key> | null>(() => {
        if (defaultExpandedRowIds != null) return new Set(defaultExpandedRowIds);
        return null;
    });

    const currentExpandedSet: Set<Key> | null = expandedRowIds ?? innerExpandedIds;

    const { flatRows, treeRowMetaMap, allExpandableIds } = useMemo(() => {
        if (!treeData || !getChildRows) {
            return {
                flatRows: rows,
                treeRowMetaMap: new Map<Key, TreeRowMeta>(),
                allExpandableIds: [] as Key[]
            };
        }
        const result = buildTreeDisplayRows<T>({
            rows,
            getChildRows,
            expandedSet: currentExpandedSet,
            defaultExpanded: defaultTreeExpandAll
        });
        return {
            flatRows: result.displayRows,
            treeRowMetaMap: result.treeRowMetaMap,
            allExpandableIds: result.allExpandableIds
        };
    }, [rows, treeData, getChildRows, currentExpandedSet, defaultTreeExpandAll]);

    const isTree = treeData && !!getChildRows;

    const toggleTreeRow = useCallback((id: Key) => {
        const base: Set<Key> = (() => {
            if (currentExpandedSet != null) return new Set(currentExpandedSet);
            if (defaultTreeExpandAll) return new Set<Key>(allExpandableIds);
            return new Set<Key>();
        })();
        if (base.has(id)) {
            base.delete(id);
        } else {
            base.add(id);
        }
        if (expandedRowIds == null) setInnerExpandedIds(base);
        onExpandedRowIdsChange?.(base);
    }, [currentExpandedSet, defaultTreeExpandAll, allExpandableIds, expandedRowIds, onExpandedRowIdsChange]);

    return { flatRows, treeRowMetaMap, isTree, toggleTreeRow };
}
