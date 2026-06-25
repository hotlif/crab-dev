import { useCallback, useMemo, useRef, useState } from "react";
import type { ColumnType, Row, SortColumn, SortDirection } from "../types.js";

function getFieldValue(dataRef: unknown, columnName: string): unknown {
    if (dataRef == null || typeof dataRef !== "object") return undefined;
    // 支持 $.a.b.c 和 a.b.c 两种点路径格式
    const path = columnName.startsWith("$.") ? columnName.slice(2) : columnName;
    const parts = path.split(".");
    let value: unknown = dataRef;
    for (const part of parts) {
        if (value == null || typeof value !== "object") return undefined;
        value = (value as Record<string, unknown>)[part];
    }
    return value;
}

function defaultCompare(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function useColumnSort<T extends Row>(params: {
    rows: T[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnType<any>[]
    sortColumns?: SortColumn[]
    defaultSortColumns?: SortColumn[]
    onSortColumnsChange?: (columns: SortColumn[]) => void
}) {
    const { rows, columns, sortColumns: sortColumnsProp, defaultSortColumns, onSortColumnsChange } = params;

    const isControlled = sortColumnsProp !== undefined;
    const [innerSortColumns, setInnerSortColumns] = useState<SortColumn[]>(defaultSortColumns ?? []);
    const sortColumns = isControlled ? sortColumnsProp : innerSortColumns;

    const onSortColumnsChangeRef = useRef(onSortColumnsChange);
    onSortColumnsChangeRef.current = onSortColumnsChange;

    // 构建 columnName → { sortable, sorter } 查找表（递归含子列）
    const columnInfoMap = useMemo(() => {
        const map = new Map<string, { sortable?: boolean; sorter?: (a: T, b: T) => number }>();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const visit = (cols: ColumnType<any>[]) => {
            for (const col of cols) {
                map.set(col.name, { sortable: col.sortable, sorter: col.sorter as ((a: T, b: T) => number) | undefined });
                if (col.children?.length) visit(col.children);
            }
        };
        visit(columns);
        return map;
    }, [columns]);

    const handleSort = useCallback((columnName: string, isMulti: boolean = false) => {
        const current = sortColumns.find(sc => sc.columnName === columnName);
        let next: SortColumn[];

        if (isMulti) {
            // Shift+点击：追加/切换当前列，保留其余列排序
            if (!current) {
                next = [...sortColumns, { columnName, direction: "asc" as SortDirection }];
            } else if (current.direction === "asc") {
                next = sortColumns.map(sc => sc.columnName === columnName ? { ...sc, direction: "desc" as SortDirection } : sc);
            } else {
                next = sortColumns.filter(sc => sc.columnName !== columnName);
            }
        } else {
            // 普通点击：单列排序，asc → desc → 无，清除其余列
            if (!current) {
                next = [{ columnName, direction: "asc" as SortDirection }];
            } else if (current.direction === "asc") {
                next = [{ columnName, direction: "desc" as SortDirection }];
            } else {
                next = [];
            }
        }

        if (!isControlled) setInnerSortColumns(next);
        onSortColumnsChangeRef.current?.(next);
    }, [sortColumns, isControlled]);

    const sortedRows = useMemo(() => {
        if (sortColumns.length === 0) return rows;

        return [...rows].sort((a, b) => {
            for (const sc of sortColumns) {
                const info = columnInfoMap.get(sc.columnName);
                let result: number;

                if (info?.sorter) {
                    result = info.sorter(a, b);
                } else {
                    const aVal = getFieldValue(a.dataRef, sc.columnName);
                    const bVal = getFieldValue(b.dataRef, sc.columnName);
                    result = defaultCompare(aVal, bVal);
                }

                if (sc.direction === "desc") result = -result;
                if (result !== 0) return result;
            }
            return 0;
        });
    }, [rows, sortColumns, columnInfoMap]);

    const getSortState = useCallback((columnName: string): { direction: SortDirection; priority: number } | null => {
        const idx = sortColumns.findIndex(sc => sc.columnName === columnName);
        if (idx < 0) return null;
        return {
            direction: sortColumns[idx].direction,
            // priority > 0 表示多列排序，显示序号；0 = 单列，不显示
            priority: sortColumns.length > 1 ? idx + 1 : 0,
        };
    }, [sortColumns]);

    const isSortable = useCallback((columnName: string): boolean => {
        return !!columnInfoMap.get(columnName)?.sortable;
    }, [columnInfoMap]);

    return { sortedRows, sortColumns, handleSort, getSortState, isSortable };
}
