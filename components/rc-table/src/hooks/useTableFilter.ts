import { useCallback, useState } from "react";
import type { ColumnType, Row } from "../types.js";

export function useTableFilter<T extends Row>(params: {
    filterBar?: boolean
    filters?: Record<string, string>
    bottomColumns: ColumnType<T>[]
    onFilterChange?: (filters: Record<string, string>) => void
}): {
    filterKeywordMap: Record<string, string>;
    isFilterEnabled: boolean;
    handleFilterValueChange: (columnIndex: number, keyword: string) => void;
} {
    const { filterBar, filters, bottomColumns, onFilterChange } = params;

    const [innerFilterKeywordMap, setInnerFilterKeywordMap] = useState<Record<string, string>>({});

    const filterKeywordMap = filters ?? innerFilterKeywordMap;
    const isFilterEnabled = filterBar === true;

    const handleFilterValueChange = useCallback((columnIndex: number, keyword: string) => {
        const column = bottomColumns[columnIndex];
        if (!column) return;
        const next = { ...filterKeywordMap };
        if (keyword.trim() === "") {
            delete next[column.name];
        } else {
            next[column.name] = keyword;
        }
        const normalizedNext = Object.entries(next).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value.trim() !== "") acc[key] = value;
            return acc;
        }, {});
        if (filters == null) setInnerFilterKeywordMap(normalizedNext);
        onFilterChange?.(normalizedNext);
    }, [bottomColumns, filterKeywordMap, filters, onFilterChange]);

    return { filterKeywordMap, isFilterEnabled, handleFilterValueChange };
}
