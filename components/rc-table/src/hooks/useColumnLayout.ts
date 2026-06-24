import { type MutableRefObject, useEffect, useMemo } from "react";
import type { ColumnType, MergeCell, Row } from "../types.js";
import {
    buildMergeCellLookup, getBottomColumns, getHeaderCellsTwoDimensionalArray,
    getMaxDepth, isGroupRow, sortColumns
} from "../util.js";
import type { InternalGroupRow } from "../util.js";

export function useColumnLayout<T extends Row>(params: {
    columns: ColumnType<T>[]
    width: number
    resizedWidths: Record<string, number>
    isGrouped: boolean
    groupBy: string[]
    headerRowHeight: number
    displayRows: Array<T | InternalGroupRow<T>>
    getRowHeight?: (row: T, rowIndex: number) => number | undefined
    groupRowHeight: number
    mergeCells: MergeCell[]
    bottomColumnsRef: MutableRefObject<ColumnType<T>[]>
}) {
    const {
        columns, width, resizedWidths, isGrouped, groupBy, headerRowHeight,
        displayRows, getRowHeight, groupRowHeight, mergeCells, bottomColumnsRef
    } = params;

    const groupBySet = useMemo(() => new Set(groupBy), [groupBy]);

    const sColumns = useMemo(() => {
        const wrapped = isGrouped
            ? columns.map((column) => {
                if (!column.name || !groupBySet.has(column.name)) return column;
                return { ...column, render: () => null, editRender: undefined };
            })
            : columns;
        return sortColumns(wrapped.filter(element => element.hidden !== true));
    }, [columns, isGrouped, groupBySet]);

    const bottomColumns = useMemo(() => getBottomColumns(sColumns), [sColumns]);

    useEffect(() => {
        bottomColumnsRef.current = bottomColumns;
    }, [bottomColumns, bottomColumnsRef]);

    const maxDepth = useMemo(() => getMaxDepth(sColumns), [sColumns]);

    const headerCells = useMemo(() => getHeaderCellsTwoDimensionalArray(sColumns), [sColumns]);

    const headerGridTemplateRows = useMemo(
        () => Array.from({ length: maxDepth }, () => headerRowHeight),
        [maxDepth, headerRowHeight]
    );

    const gridTemplateColumns = useMemo(() => {
        const cols = bottomColumns.filter(element => element.hidden !== true);
        const getEffectiveWidth = (col: ColumnType<T>) => resizedWidths[col.name] ?? col.width;
        const fixedWidthTotal = cols.reduce((acc, col) => {
            const w = getEffectiveWidth(col);
            return acc + (w != null ? w : 0);
        }, 0);
        const autoColCount = cols.filter(col => getEffectiveWidth(col) == null).length;
        const autoColWidth = autoColCount > 0 ? Math.max(0, (width - fixedWidthTotal) / autoColCount) : 0;
        return cols.map((column) => getEffectiveWidth(column) ?? autoColWidth);
    }, [bottomColumns, width, resizedWidths]);

    const { fixedLeftColumns, fixedRightColumns, fixedLeftColumnsIdx, fixedRightColumnsIdx } = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leftColumns: ColumnType<any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rightColumns: ColumnType<any>[] = [];
        const leftColumnsIdx: number[] = [];
        const rightColumnsIdx: number[] = [];
        bottomColumns.forEach((column, index) => {
            if (column.fixed === "left") { leftColumns.push(column); leftColumnsIdx.push(index); }
            else if (column.fixed === "right") { rightColumns.push(column); rightColumnsIdx.push(index); }
        });
        return {
            fixedLeftColumns: leftColumns,
            fixedRightColumns: rightColumns,
            fixedLeftColumnsIdx: leftColumnsIdx,
            fixedRightColumnsIdx: rightColumnsIdx
        };
    }, [bottomColumns]);

    const actualHeight = useMemo(
        () => gridTemplateColumns.reduce((acc, cur) => acc + cur, 0),
        [gridTemplateColumns]
    );

    const stickyLeftOffsets = useMemo(() => {
        const offsets: number[] = [];
        let offset = 0;
        for (let i = 0; i < gridTemplateColumns.length; i += 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    const stickyRightOffsets = useMemo(() => {
        const offsets: number[] = Array.from({ length: gridTemplateColumns.length }, () => 0);
        let offset = 0;
        for (let i = gridTemplateColumns.length - 1; i >= 0; i -= 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    const columnByName = useMemo(() => {
        const map = new Map<string, ColumnType<T>>();
        const walk = (cols: ColumnType<T>[]) => {
            cols.forEach((col) => {
                if (col.name) map.set(col.name, col);
                if (col.children && col.children.length > 0) walk(col.children as ColumnType<T>[]);
            });
        };
        walk(columns);
        return map;
    }, [columns]);

    const gridTemplateRows = useMemo(() => {
        return displayRows.map((row, rowIndex) => {
            if (isGroupRow(row)) return row.height ?? groupRowHeight;
            return getRowHeight?.(row, rowIndex) ?? row.height ?? 35;
        });
    }, [displayRows, getRowHeight, groupRowHeight]);

    const { skipCellSet, mergeCellMap, getCellKey } = useMemo(() => {
        if (isGrouped) return buildMergeCellLookup([]);
        return buildMergeCellLookup(mergeCells);
    }, [mergeCells, isGrouped]);

    return {
        sColumns,
        bottomColumns,
        maxDepth,
        headerCells,
        headerGridTemplateRows,
        gridTemplateColumns,
        fixedLeftColumns,
        fixedRightColumns,
        fixedLeftColumnsIdx,
        fixedRightColumnsIdx,
        actualHeight,
        stickyLeftOffsets,
        stickyRightOffsets,
        columnByName,
        gridTemplateRows,
        skipCellSet,
        mergeCellMap,
        getCellKey,
    };
}
