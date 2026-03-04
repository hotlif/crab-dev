import type { ColumnType, MergeCell } from "./types";

export interface HeaderCellType {
    column?: ColumnType<any>;
    rowSpan: number
    colSpan: number
    rowIndex: number
    columnIndex: number
    fixed?: "left" | "right"
}

/**
 * 递归计算列树结构的最大深度。
 *
 * @param columns - 当前计算的列节点，通常包含可选的 `children` 子列属性。
 * @param depth - 当前递归的深度，通常从 1 开始。
 * @returns 列树结构中的最大深度。
 */
export const calculateColumnDepth = (columns: ColumnType<any>, depth: number): number => {
    let maxNumber = depth;
    columns?.children?.forEach(element => {
        const nextDepthNumber = calculateColumnDepth(element, depth + 1);
        if (nextDepthNumber > maxNumber) {
            maxNumber = nextDepthNumber;
        }
    })
    return maxNumber;
}

/**
 * 从给定的列数组中返回最大深度的列。
 * 列的深度由 `calculateColumnDepth` 函数确定。
 *
 * @param columns - 需要评估的列定义数组。
 * @returns 拥有最大深度的列对象。
 */
export const getMaxDepth = (columns: ColumnType<any>[]) => {
    let maxColumnDepth = calculateColumnDepth(columns[0], 1);
    columns.forEach(element => {
        const nextColumnDepth = calculateColumnDepth(element, 1);
        if (nextColumnDepth > maxColumnDepth) {
            maxColumnDepth = nextColumnDepth;
        }
    })
    return maxColumnDepth;
}

/**
 * 递归获取嵌套列结构中的所有底层列。
 *
 * @param columns - 列定义数组，可能包含嵌套的子列。
 * @returns 不包含任何子列（即底层列）的列数组。
 */
export const getBottomColumns = (columns: ColumnType<any>[], fixed?: "left" | "right" ) => {
    const result: ColumnType<any>[] = []
    columns.forEach(element => {
        if (element.children && element.children.length > 0) {
            result.push(...getBottomColumns(element.children, element.fixed ?? fixed));
        } else {
            result.push({
                ...element,
                fixed: element.fixed ?? fixed
            });
        }
    })
    return result;
}

/**
 * 根据提供的列定义生成表头单元格的元数据数组。
 * 
 * 此函数遍历列的树形结构，计算每个表头单元格的 `colSpan`、`rowSpan`、`rowIndex` 和 `columnIndex`，
 * 适用于渲染具有嵌套列的复杂表头。
 * 
 * @param columns - 用于生成表头单元格的列定义数组。
 * @returns 一个 `HeaderCellType` 对象数组，每个对象表示一个带有计算后跨度和索引属性的表头单元格。
 */
export const getHeaderCells = (columns: ColumnType<any>[]) => {
    const maxDepth = getMaxDepth(columns);
    const traverse = (cols: ColumnType<any>[], depth: number, startColumnIndex: number, parent: HeaderCellType | null) => {
        const headerCells: HeaderCellType[] = [];
        let currentColumnIndex = startColumnIndex;
        cols.forEach((element) => {
            const bottomColumn = getBottomColumns([element]);
            const currentMaxDepth = calculateColumnDepth(element, 1);

            const rowIndex = depth;
            const colSpan = bottomColumn.length - 1;
            const headerCell = {
                column: element,
                colSpan,
                rowSpan: maxDepth - currentMaxDepth - depth,
                rowIndex,
                columnIndex: currentColumnIndex,
                fixed: element.fixed ?? parent?.fixed
            }
            headerCells.push(headerCell);
            if (element.children && element.children.length > 0) {
                const childCells = traverse(element.children, depth + 1, currentColumnIndex, headerCell);
                headerCells.push(...childCells);
            }
            currentColumnIndex += colSpan + 1;
        })
        return headerCells;
    }
    return traverse(columns, 0, 0, null);
}

export const getHeaderCellsTwoDimensionalArray = (columns: ColumnType<any>[]) => {
    const headerCells = getHeaderCells(columns);
    const maxRowIndex = Math.max(...headerCells.map(cell => cell.rowIndex));
    const maxColIndex = Math.max(...headerCells.map(cell => cell.columnIndex + (cell.colSpan || 0)));

    const result: (HeaderCellType | null)[][] = Array.from({ length: maxRowIndex + 1 }, () =>
        Array.from({ length: maxColIndex + 1 }, () => null)
    );
    headerCells.forEach(cell => {
        for (let r = 0; r <= (cell.rowSpan || 0); r += 1) {
            for (let c = 0; c <= (cell.colSpan || 0); c += 1) {
                const row = cell.rowIndex + r;
                const col = cell.columnIndex + c;
                if (r === 0 && c === 0) {
                    result[row][col] = cell;
                } else {
                    result[row][col] = null;
                }
            }
        }
    });
    return result;
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

export function buildMergeCellLookup(mergeCells: MergeCell[]) {
    const getCellKey = (rowIndex: number, columnIndex: number) => `${rowIndex}:${columnIndex}`;
    const skipCellSet = new Set<string>();
    const mergeCellMap = new Map<string, MergeCell>();

    mergeCells.forEach((mergeCell) => {
        const { rowIndex, columnIndex, rowSpan, colSpan } = mergeCell;
        mergeCellMap.set(getCellKey(rowIndex, columnIndex), mergeCell);
        for (let c = 0; c <= colSpan; c += 1) {
            for (let r = 0; r <= rowSpan; r += 1) {
                if (c === 0 && r === 0) {
                    continue;
                }
                skipCellSet.add(getCellKey(rowIndex + r, columnIndex + c));
            }
        }
    })

    return {
        getCellKey,
        skipCellSet,
        mergeCellMap
    }
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
    let height = 0;
    let width = 0;
    for (let r = 0; r <= rowSpan; r += 1) {
        height += gridTemplateRows[mergeCell.rowIndex + r];
    }
    for (let c = 0; c <= colSpan; c += 1) {
        width += gridTemplateColumns[mergeCell.columnIndex + c];
    }
    return {
        height,
        width
    }
}
