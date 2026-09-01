import { type Key, useCallback, useMemo, useState } from "react";
import { buildGroupedDisplayRows, KEY_SEP } from "../util.js";
import type { Row } from "../types.js";

export function useRowGroup<T extends Row>(params: {
    rows: T[]
    groupBy?: string[]
    expandedGroupIds?: Set<Key>
    defaultExpandedGroupIds?: Set<Key>
    defaultExpandAll?: boolean
    onExpandedGroupIdsChange?: (ids: Set<Key>) => void
}): {
    groupBy: string[];
    displayRows: (T | import("../util.js").InternalGroupRow<T>)[];
    isGrouped: boolean;
    toggleGroup: (groupId: Key) => void;
} {
    const {
        rows, groupBy: groupByProp, expandedGroupIds,
        defaultExpandedGroupIds, defaultExpandAll = true, onExpandedGroupIdsChange
    } = params;

    // 稳定化引用，避免字面量数组每次创建新引用导致下游 memo 雪崩
    const groupBy = useMemo(() => groupByProp ?? [], [(groupByProp ?? []).join(KEY_SEP)]);

    const [innerExpandedGroupIds, setInnerExpandedGroupIds] = useState<Set<Key> | null>(() => {
        if (defaultExpandedGroupIds != null) return new Set(defaultExpandedGroupIds);
        // null 表示"采用 defaultExpandAll 策略"，区别于显式空集合（全部收起）
        return null;
    });

    const currentExpandedSet: Set<Key> | null = expandedGroupIds ?? innerExpandedGroupIds;

    const { displayRows, allPossibleGroupIds } = useMemo(() => {
        return buildGroupedDisplayRows<T>({
            rows,
            groupBy,
            expandedSet: currentExpandedSet,
            defaultExpanded: defaultExpandAll
        });
    }, [rows, groupBy, currentExpandedSet, defaultExpandAll]);

    const isGrouped = groupBy.length > 0;

    const toggleGroup = useCallback((groupId: Key) => {
        const base: Set<Key> = (() => {
            if (currentExpandedSet != null) return new Set(currentExpandedSet);
            if (defaultExpandAll) return new Set<Key>(allPossibleGroupIds);
            return new Set<Key>();
        })();
        if (base.has(groupId)) {
            base.delete(groupId);
        } else {
            base.add(groupId);
        }
        if (expandedGroupIds == null) setInnerExpandedGroupIds(base);
        onExpandedGroupIdsChange?.(base);
    }, [currentExpandedSet, defaultExpandAll, allPossibleGroupIds, expandedGroupIds, onExpandedGroupIdsChange]);

    return { groupBy, displayRows, isGrouped, toggleGroup };
}
