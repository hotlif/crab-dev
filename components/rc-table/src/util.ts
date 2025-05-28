import type { ColumnType, MergeCell } from "./types";


export interface HeaderCellInfo {
    column: ColumnType<any>;
    colSpan: number;
    rowSpan: number;
    depth: number;
    rowIndex: number;
    colIndex: number;
}

export function calculateHeaderStructure(columns: ColumnType<any>[]) {
    // 计算最大深度
    function getMaxDepth(cols: ColumnType<any>[], depth = 1): number {
        return cols.reduce((max, col) => {
            if (col.children && col.children.length > 0) {
                return Math.max(max, getMaxDepth(col.children, depth + 1));
            }
            return Math.max(max, depth);
        }, depth);
    }

    // 计算 colSpan
    function getColSpan(col: ColumnType<any>): number {
        if (col.children && col.children.length > 0) {
            return col.children.reduce((sum, child) => sum + getColSpan(child), 0);
        }
        return 1;
    }

    const maxDepth = getMaxDepth(columns);
    const headerCells: HeaderCellInfo[] = [];
    const leafColumns: ColumnType<any>[] = [];

    function traverse(
        cols: ColumnType<any>[],
        depth: number,
        rowIndex: number,
        parentColIndex: number
    ) {
        let colIndex = parentColIndex;
        for (const col of cols) {
            const colSpan = getColSpan(col);
            const isLeaf = !col.children || col.children.length === 0;
            const rowSpan = isLeaf ? maxDepth - depth + 1 : 1;
            headerCells.push({
                column: col,
                colSpan,
                rowSpan,
                depth,
                rowIndex,
                colIndex,
            });
            if (isLeaf) {
                leafColumns.push(col);
            }
            if (col.children && col.children.length > 0) {
                traverse(col.children, depth + 1, rowIndex + 1, colIndex);
            }
            colIndex += colSpan;
        }
    }

    traverse(columns, 1, 0, 0);

    return {
        rowCount: maxDepth,
        headerCells,
        leafColumns,
    };
}

export function sortColumns(columns: ColumnType<any>[]) {
    const getOrder = (col: ColumnType<any>) => {
        if (col.fixed === "left") return -1;
        if (col.fixed === "right") return 1;
        return 0;
    };
    columns.sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
    return columns;
}

export function getSkippedCells(mergeCells: MergeCell[]) {
    const skipCells: { rowIndex: number, columnIndex: number }[] = [];
    mergeCells.forEach(mergeCell => {
        const { rowIndex, columnIndex, rowSpan, colSpan } = mergeCell;
        for (let c = 0; c <= colSpan; c += 1) {
            for (let r = 0; r <= rowSpan; r += 1) {
                if (c === 0 && r === 0) {
                    continue;
                }
                skipCells.push({
                    rowIndex: rowIndex + r,
                    columnIndex: columnIndex + c
                });
            }
        }
    });
    return skipCells;
}


export function getMergedCellSize({
    mergeCell,
    gridTemplateRows,
    gridTemplateColumns
}: {
    mergeCell: MergeCell,
    gridTemplateRows: number[],
    gridTemplateColumns: number[]
}) {
    const { rowSpan, colSpan } = mergeCell;
    let height = gridTemplateRows[mergeCell.rowIndex];
    let width = gridTemplateColumns[mergeCell.columnIndex];
    for (let r = 0; r < rowSpan; r += 1) {
        height += gridTemplateRows[mergeCell.rowIndex + r];
    }
    for (let c = 0; c < colSpan; c += 1) {
        width += gridTemplateColumns[mergeCell.columnIndex + c];
    }
    return {
        height,
        width
    }
}
