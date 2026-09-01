import { type MutableRefObject, useEffect, useMemo } from "react";
import type { ColumnType, MergeCell, Row } from "../types.js";
import { buildMergeCellLookup, getBottomColumns, getHeaderCellsTwoDimensionalArray, getMaxDepth, isExpandedContentRow, isGroupRow, sortColumns } from "../util.js";
import type { HeaderCellType } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";

export const buildHeaderCellOrigins = (
    headerCells: (HeaderCellType | null)[][],
    columnCount: number,
): number[][] => headerCells.map((row) => {
    const origins = Array.from({ length: columnCount }, () => -1);
    row.forEach((cell) => {
        if (!cell) return;
        for (let columnIndex = cell.columnIndex; columnIndex <= cell.columnIndex + cell.colSpan; columnIndex += 1) {
            origins[columnIndex] = cell.columnIndex;
        }
    });
    return origins;
});

export function useColumnLayout<T extends Row>(params: {
    columns: ColumnType<T>[]
    width: number
    resizedWidths: Record<string, number>
    isGrouped: boolean
    isTree: boolean
    isExpansion: boolean
    groupBy: string[]
    headerRowHeight: number
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    getRowHeight?: (row: T, rowIndex: number) => number | undefined
    groupRowHeight: number
    mergeCells: MergeCell[]
    bottomColumnsRef: MutableRefObject<ColumnType<T>[]>
}): {
    sColumns: ColumnType<T>[];
    bottomColumns: ColumnType<T>[];
    maxDepth: number;
    headerCells: (import("../util.js").HeaderCellType | null)[][];
    headerCellOriginByRow: number[][];
    topLevelHeaderCellOriginByColumn: number[];
    headerGridTemplateRows: number[];
    gridTemplateColumns: number[];
    fixedLeftColumns: ColumnType<T>[];
    fixedRightColumns: ColumnType<T>[];
    fixedLeftColumnsIdx: number[];
    fixedRightColumnsIdx: number[];
    actualHeight: number;
    stickyLeftOffsets: number[];
    stickyRightOffsets: number[];
    columnByName: Map<string, ColumnType<T>>;
    gridTemplateRows: number[];
    skipCellSet: Set<string>;
    mergeCellMap: Map<string, MergeCell>;
    mergeCellsByCoveredRow: Map<number, MergeCell[]>;
    mergeCellsByCoveredColumn: Map<number, MergeCell[]>;
    getCellKey: (rowIndex: number, columnIndex: number) => string;
} {
    const {
        columns, width, resizedWidths, isGrouped, isTree, isExpansion, groupBy, headerRowHeight,
        displayRows, getRowHeight, groupRowHeight, mergeCells, bottomColumnsRef
    } = params;

    const groupBySet = useMemo(() => new Set(groupBy), [groupBy]);

    const sColumns = useMemo(() => {
        const normalizeColumns = (source: ColumnType<T>[]): ColumnType<T>[] => source.flatMap((column) => {
            if (column.hidden === true) return [];

            const originalChildren = column.children as ColumnType<T>[] | undefined;
            const visibleChildren = originalChildren ? normalizeColumns(originalChildren): undefined;
            // 分组节点的子列全部隐藏时，父节点也不应退化成一个没有数据意义的叶子列。
            if (originalChildren && originalChildren.length > 0 && visibleChildren?.length === 0) return [];

            let normalized: ColumnType<T> = visibleChildren && visibleChildren !== originalChildren
                ? { ...column, children: visibleChildren }
                : column;
            if (isGrouped && normalized.name && groupBySet.has(normalized.name)) {
                normalized = { ...normalized, render: () => null, editRender: undefined };
            }
            return [normalized];
        });

        return sortColumns(normalizeColumns(columns));
    }, [columns, isGrouped, groupBySet]);

    const bottomColumns = useMemo(() => getBottomColumns(sColumns), [sColumns]);

    useEffect(() => {
        bottomColumnsRef.current = bottomColumns;
    }, [bottomColumns, bottomColumnsRef]);

    const maxDepth = useMemo(() => getMaxDepth(sColumns), [sColumns]);

    const headerCells = useMemo(() => getHeaderCellsTwoDimensionalArray(sColumns), [sColumns]);

    const headerCellOriginByRow = useMemo(
        () => buildHeaderCellOrigins(headerCells, bottomColumns.length),
        [headerCells, bottomColumns.length]
    );

    const topLevelHeaderCellOriginByColumn = headerCellOriginByRow[0] ?? [];

    const headerGridTemplateRows = useMemo(
        () => Array.from({ length: maxDepth }, () => headerRowHeight),
        [maxDepth, headerRowHeight]
    );

    const gridTemplateColumns = useMemo(() => {
        const cols = bottomColumns;
        const getEffectiveWidth = (col: ColumnType<T>) => resizedWidths[col.name] ?? col.width;
        const fixedWidthTotal = cols.reduce((acc, col) => {
            const w = getEffectiveWidth(col);
            return acc + (w != null ? w : 0);
        }, 0);
        const autoColCount = cols.filter(col => getEffectiveWidth(col) == null).length;
        const autoColWidth = autoColCount > 0 ? Math.max(0, (width - fixedWidthTotal) / autoColCount): 0;
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
            // 展开内容行的高度在构造时已写入 row.height（expandedRowHeight 或逐行覆盖值）
            if (isExpandedContentRow(row)) return row.height ?? 35;
            // 上方两个守卫已排除分组 / 展开内容行，此处必为数据行（泛型守卫无法自动收窄联合）
            const dataRow = row as T;
            return getRowHeight?.(dataRow, rowIndex) ?? dataRow.height ?? 35;
        });
    }, [displayRows, getRowHeight, groupRowHeight]);

    const { skipCellSet, mergeCellMap, mergeCellsByCoveredRow, mergeCellsByCoveredColumn, getCellKey } = useMemo(() => {
        // 分组 / 树 / 行展开均会插入或移除视图行，使 mergeCells 的 rowIndex 失准，故一并禁用合并
        if (isGrouped || isTree || isExpansion) return buildMergeCellLookup([]);
        return buildMergeCellLookup(mergeCells);
    }, [mergeCells, isGrouped, isTree, isExpansion]);

    return {
        sColumns,
        bottomColumns,
        maxDepth,
        headerCells,
        headerCellOriginByRow,
        topLevelHeaderCellOriginByColumn,
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
        mergeCellsByCoveredRow,
        mergeCellsByCoveredColumn,
        getCellKey,
    };
}
