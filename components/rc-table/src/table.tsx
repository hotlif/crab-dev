import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type HTMLAttributes, type ReactNode, useMemo } from "react";
import { css, cx } from "@linaria/core";

import TableRow from "./tableRow.js";
import TableBodyCell from "./bodyCell.js";
import TableHeaderCell from "./headerCell.js";
import { sortColumns, getBottomColumns, getMaxDepth, HeaderCellType, getHeaderCellsTwoDimensionalArray, buildMergeCellLookup } from "./util.js";
import type { ColumnType, MergeCell, Row } from "./types.js";

interface TableProps<T extends Row> extends HTMLAttributes<HTMLDivElement> {
	// 表格的宽度
	width: number,
	// 表格的高度
	height: number,
	// 表格的数据行
	rows: T[],
	// 表格的列定义
	columns: ColumnType<T>[],
	// 合并单元格的信息
	mergeCells?: MergeCell[]
	// 自定义行高（优先级高于 row.height）
	getRowHeight?: (row: T, rowIndex: number) => number | undefined
	// 表格头部的高度
	headerRowHeight?: number
}

// 虚拟列表左侧占位：用于在可视区中预留被横向裁剪的区域
const paddingLeft = (
    <div
        key="table-virtual-left-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			width: calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px));
			height: 100%;
		`}
    />
)

// 虚拟列表右侧占位：用于在可视区中补齐右侧被裁剪宽度
const paddingRight = (
    <div
        key="table-virtual-right-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			width: var(--crab-rc-virtual-right-padding-width, 0px);
			height: 100%;
		`}
    />
)

// 虚拟列表底部占位：用于在纵向滚动时补齐不可见区域
const paddingBottom = (
    <div
        key="table-virtual-bottom-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			height: var(--crab-rc-virtual-bottom-padding-height, 0px);
			width: 100%;
		`}
    />
)

// 虚拟列表顶部占位：用于在纵向滚动时补齐不可见区域
const _paddingTop = (
    <div
        key="table-virtual-top-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			height: calc(var(--crab-rc-virtual-top-padding-height, 0px) - var(--crab-rc-virtual-top-padding-height-offset, 0px));
			width: 100%;
		`}
    />
)

function Table<T extends Row>({
    width,
    height,
    rows,
    columns,
    mergeCells = [],
    getRowHeight,
    headerRowHeight = 35,
    ...restProps
}: TableProps<T>) {

    // 先剔除隐藏列，再按列配置（含 children）排序，作为后续所有列计算基础
    const sColumns = useMemo(() => {
        return sortColumns(columns.filter(element => element.hidden !== true));
    }, [columns])

    // 拍平到叶子列（真正参与 body 渲染的列）
    const bottomColumns = useMemo(() => {
        return getBottomColumns(sColumns)
    }, [sColumns]);

    // 表头最大层级深度（用于生成多行表头）
    const maxDepth = useMemo(() => {
        return getMaxDepth(sColumns);
    }, [sColumns]);

    // 二维表头矩阵：headerCells[rowIndex][columnIndex]
    const headerCells = useMemo(() => {
        return getHeaderCellsTwoDimensionalArray(sColumns);
    }, [sColumns]);

    const headerGridTemplateRows = useMemo(() => {
        return Array.from({ length: maxDepth }, () => headerRowHeight);
    }, [maxDepth, headerRowHeight]);

    const gridTemplateColumns = useMemo(() => {
        return bottomColumns.filter(element => element.hidden !== true).map((column) => column.width ?? 120)
    }, [width, bottomColumns])

    // 行高优先级：getRowHeight > row.height > 默认 35
    const gridTemplateRows = useMemo(() => {
        return rows.map((row, rowIndex) => getRowHeight?.(row, rowIndex) ?? row.height ?? 35);
    }, [height, rows, getRowHeight])

    const {
        skipCellSet,
        mergeCellMap,
        getCellKey
    } = useMemo(() => {
        // 预计算合并单元格查找结构：
        // 1) skipCellSet: 被合并覆盖、无需渲染的单元格
        // 2) mergeCellMap: 主单元格 -> 合并信息
        return buildMergeCellLookup(mergeCells);
    }, [mergeCells]);

    const {
        fixedLeftColumns,
        fixedRightColumns,
        fixedLeftColumnsIdx,
        fixedRightColumnsIdx
    } = useMemo(() => {
        // 将叶子列分组为左固定列/右固定列，并保留其原始索引
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leftColumns: ColumnType<any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rightColumns: ColumnType<any>[] = [];
        const leftColumnsIdx: number[] = [];
        const rightColumnsIdx: number[] = [];
        bottomColumns.forEach((column, index) => {
            if (column.fixed === "left") {
                leftColumns.push(column);
                leftColumnsIdx.push(index);
            } else if (column.fixed === "right") {
                rightColumns.push(column);
                rightColumnsIdx.push(index);
            }
        })
        return {
            fixedLeftColumns: leftColumns,
            fixedRightColumns: rightColumns,
            fixedLeftColumnsIdx: leftColumnsIdx,
            fixedRightColumnsIdx: rightColumnsIdx
        }
    }, [bottomColumns]);


    const actualHeight = useMemo(() => {
        // 实际总宽度
        return gridTemplateColumns.reduce((acc, cur) => acc + cur, 0)
    }, [gridTemplateColumns]);

    const stickyLeftOffsets = useMemo(() => {
        // 每一列作为 left sticky 时的起始偏移
        const offsets: number[] = [];
        let offset = 0;
        for (let i = 0; i < gridTemplateColumns.length; i += 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    const stickyRightOffsets = useMemo(() => {
        // 每一列作为 right sticky 时的起始偏移（从右向左累计）
        const offsets: number[] = Array.from({ length: gridTemplateColumns.length }, () => 0);
        let offset = 0;
        for (let i = gridTemplateColumns.length - 1; i >= 0; i -= 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    const generateBodyElement = ({
        rowRange,
        columnRange,
    }:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {
        // body 由 "顶部占位 + 可见行 + 底部占位" 构成，降低大数据量渲染成本
        const renderedColumnSet = new Set<number>([
            ...fixedLeftColumnsIdx,
            ...fixedRightColumnsIdx
        ]);
        for (let c = columnRange[0]; c <= columnRange[1]; c += 1) {
            if (bottomColumns[c]?.fixed !== "left" && bottomColumns[c]?.fixed !== "right") {
                renderedColumnSet.add(c);
            }
        }

        const getBodyRenderStart = (startRowIndex: number) => {
            let renderStart = startRowIndex;
            mergeCells.forEach((mergeCell) => {
                if (!renderedColumnSet.has(mergeCell.columnIndex)) {
                    return;
                }
                const endRowIndex = mergeCell.rowIndex + mergeCell.rowSpan;
                if (mergeCell.rowIndex < startRowIndex && endRowIndex >= startRowIndex) {
                    renderStart = Math.min(renderStart, mergeCell.rowIndex);
                }
            })
            return renderStart;
        }

        const getBodyTopPaddingCompensation = (renderStart: number, startRowIndex: number) => {
            let offset = 0;
            for (let r = renderStart; r < startRowIndex; r += 1) {
                offset += gridTemplateRows[r];
            }
            return offset;
        }

        const renderStart = getBodyRenderStart(rowRange[0]);
        const topPaddingCompensation = getBodyTopPaddingCompensation(renderStart, rowRange[0]);

        const bodyRows: ReactNode[] = [
            <div
                key="table-virtual-top-padding-body"
                className={css`
					display: inline-block;
					box-sizing: border-box;
					width: 100%;
				`}
                style={{
                    height: `calc(var(--crab-rc-virtual-top-padding-height, 0px) - var(--crab-rc-virtual-top-padding-height-offset, 0px) - ${topPaddingCompensation}px)`
                }}
            />
        ];

        for (let rowIndex = renderStart; rowIndex <= rowRange[1]; rowIndex += 1) {
            const tableCells: ReactNode[] = [];
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const column = bottomColumns[columnIndex];
                if (column.fixed === "left" || column.fixed === "right") {
                    // 固定列在两侧单独渲染，这里跳过
                    continue
                }
                const mergeCell = mergeCellMap.get(currentCellKey);

                tableCells.push(
                    <TableBodyCell
                        key={`table-body-cell-${rowIndex}-${columnIndex}`}
                        row={rows[rowIndex]}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        column={column}
                        isSkipCell={isSkipCell}
                        mergeCell={mergeCell}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={gridTemplateRows}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                        }}
                    />
                );
            }
            bodyRows.push(
                <TableRow
                    key={`table-body-row-${rowIndex}`}
                    style={{
                        height: gridTemplateRows[rowIndex],
                        width: actualHeight
                    }}
                >
                    {fixedLeftColumns.map((column, index) => {
                        const columnIndex = fixedLeftColumnsIdx[index];
                        const currentCellKey = getCellKey(rowIndex, columnIndex);
                        const isSkipCell = skipCellSet.has(currentCellKey);
                        const mergeCell = mergeCellMap.get(currentCellKey);
                        return (
                            <TableBodyCell
                                className={cx(css`
									position: sticky;
								`, !isSkipCell && css`
									z-index: 9;
									background-color: #fff;
								`)}
                                key={`table-body-cell-${rowIndex}-${fixedLeftColumnsIdx[index]}`}
                                row={rows[rowIndex]}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                                column={column}
                                isSkipCell={isSkipCell}
                                mergeCell={mergeCell}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={gridTemplateRows}
                                fixed="left"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    left: stickyLeftOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                    {paddingLeft}
                    {tableCells}
                    {paddingRight}
                    {fixedRightColumns.map((column, index) => {
                        const columnIndex = fixedRightColumnsIdx[index];
                        const currentCellKey = getCellKey(rowIndex, columnIndex);
                        const isSkipCell = skipCellSet.has(currentCellKey);
                        const mergeCell = mergeCellMap.get(currentCellKey);
                        return (
                            <TableBodyCell
                                className={cx(css`
									position: sticky;
								`, !isSkipCell && css`
									background-color: #fff;
									z-index: 9;
								`)}
                                key={`table-body-cell-${rowIndex}-${fixedRightColumnsIdx[index]}`}
                                row={rows[rowIndex]}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                                column={column}
                                isSkipCell={isSkipCell}
                                mergeCell={mergeCell}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={gridTemplateRows}
                                fixed="right"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    right: stickyRightOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                </TableRow>
            );
        }
        bodyRows.push(paddingBottom)
        return bodyRows;
    }

    const generateHeaderElement = ({
        columnRange,
    }:{
		columnRange: [number, number],
	}) => {
        // 将 header cell 转换为 TableHeaderCell 需要的 mergeCell 结构
        const getMergeCell = (cell?: HeaderCellType | null) => {
            if (cell) {
                return {
                    rowIndex: cell.rowIndex,
                    columnIndex: cell.columnIndex,
                    rowSpan: cell.rowSpan,
                    colSpan: cell.colSpan
                }
            }
            return undefined;
        }

        const nodeRows: ReactNode[] = []

        const getHeaderRowRenderStart = (rowIndex: number, startColumnIndex: number) => {
            let renderStart = startColumnIndex;
            for (let c = startColumnIndex - 1; c >= 0; c -= 1) {
                const cell = headerCells[rowIndex]?.[c] ?? null;
                if (cell == null) {
                    continue;
                }
                if (cell.fixed === "left" || cell.fixed === "right") {
                    continue;
                }
                const endColumnIndex = cell.columnIndex + cell.colSpan;
                if (cell.columnIndex < startColumnIndex && endColumnIndex >= startColumnIndex) {
                    renderStart = Math.min(renderStart, cell.columnIndex);
                }
            }
            return renderStart;
        }

        const getHeaderRowLeftPaddingCompensation = (renderStart: number, startColumnIndex: number) => {
            let offset = 0;
            for (let c = renderStart; c < startColumnIndex; c += 1) {
                const column = bottomColumns[c];
                if (column?.fixed === "left" || column?.fixed === "right") {
                    continue;
                }
                offset += gridTemplateColumns[c];
            }
            return offset;
        }

        const getBottomBorderStyle = (rowIndex: number, maxRowIndex: number) => {
            if (rowIndex === maxRowIndex) {
                return css`
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
				`;
            }
            return "";
        }
	
        for (let r = 0; r < maxDepth; r += 1) {
            // 按 "行" 渲染表头，支持多级表头与跨行跨列
            // 若合并表头从左侧不可视区跨入可视区，则将该行渲染起点左扩，确保“可见即显示”
            const renderStart = getHeaderRowRenderStart(r, columnRange[0]);
            const leftPaddingCompensation = getHeaderRowLeftPaddingCompensation(renderStart, columnRange[0]);
            const cells: ReactNode[] = [];
            for (let columnIndex = renderStart; columnIndex <= columnRange[1]; columnIndex += 1) {
                const cell = headerCells[r]?.[columnIndex];
			
                if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") {
                    // 固定列头在左右区域单独渲染，主滚动区跳过
                    continue;
                }
                cells.push(
                    <TableHeaderCell
                        key={`table-header-cell-${r}-${columnIndex}`}
                        columnIndex={columnIndex}
                        rowIndex={r}
                        maxRowIndex={maxDepth - 1}
                        column={cell?.column}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={headerGridTemplateRows}
                        isSkipCell={cell == null ? true : false}
                        mergeCell={getMergeCell(cell)}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                        }}
                    />
                )
            }

            nodeRows.push(
                <TableRow
                    key={`table-header-row-${r}`}
                    className={cx(css`
						position: sticky;
						z-index: 10;
					`, getBottomBorderStyle(r, maxDepth - 1))}
                    style={{
                        height: headerRowHeight,
                        width: actualHeight,
                        top: r * headerRowHeight
                    }}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => {
                        const cell = headerCells[r]?.[columnIndex] ?? null;
                        return (
                            <TableHeaderCell
                                key={`table-header-cell-${r}-${columnIndex}`}
                                className={css`
								position: sticky;
								z-index: 11;
							`}
                                columnIndex={columnIndex}
                                rowIndex={r}
                                maxRowIndex={maxDepth - 1}
                                column={cell?.column}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={headerGridTemplateRows}
                                isSkipCell={cell === null}
                                mergeCell={getMergeCell(cell)}
                                fixed="left"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    left: stickyLeftOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                    <div
                        key={`table-header-left-padding-${r}`}
                        className={css`
							display: inline-block;
							box-sizing: border-box;
							height: 100%;
						`}
                        style={{
                            width: `calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px) - ${leftPaddingCompensation}px)`
                        }}
                    />
                    {cells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => {
                        const cell = headerCells[r]?.[columnIndex] ?? null;
                        return (
                            <TableHeaderCell
                                key={`table-header-cell-${r}-${columnIndex}`}
                                className={css`
								position: sticky;
								z-index: 11;
							`}
                                columnIndex={columnIndex}
                                column={cell?.column}
                                rowIndex={r}
                                maxRowIndex={maxDepth - 1}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={headerGridTemplateRows}
                                isSkipCell={cell === null}
                                mergeCell={getMergeCell(cell)}
                                fixed="right"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    right: stickyRightOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                </TableRow>,
            )
        }
        return nodeRows;
    }

    return (
        <div
            {...restProps}
            style={{
                '--crab-rc-virtual-left-padding-width-offset': `${fixedLeftColumns.reduce((acc, cur) => acc + (cur.width ?? 120), 0)}px`,
                '--crab-rc-virtual-top-padding-height-offset':  `${maxDepth * headerRowHeight}px`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as CSSProperties & Record<string, any>}
        >
            <RcVirtual
                className={css`
					border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
					box-sizing: border-box;
				`}
                gridTemplateColumns={gridTemplateColumns}
                gridTemplateRows={gridTemplateRows}
                viewportWidth={width}
                viewportHeight={height}
                renderRows={(rowRange, columnRange) => {
                    // 同一可视窗口内，先渲染 header 再渲染 body，保证层级与遮挡关系正确
                    const headers = generateHeaderElement({
                        columnRange
                    });

                    const bodys = generateBodyElement({
                        rowRange,
                        columnRange
                    });
                    return [...headers, ...bodys]
                }}		
            />
        </div>
    )
}


export default Table;
