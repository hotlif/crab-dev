import RcVirtual from "@crab/rc-virtual";
import { ReactNode, useMemo } from "react";
import { css, cx } from "@linaria/core";

import TableRow from "./tableRow";
import TableBodyCell from "./bodyCell";
import TableHeaderCell from "./headerCell";
import { getSkippedCells, sortColumns, getBottomColumns, getMaxDepth, HeaderCellType, getHeaderCellsTwoDimensionalArray } from "./util";
import type { ColumnType, MergeCell, Row } from "./types";

interface TableProps<T extends Row> extends React.HTMLAttributes<HTMLDivElement> {
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
}

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

const paddingTop = (
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
	...restProps
}: TableProps<T>) {

	const sColumns = useMemo(() => {
		return sortColumns(columns.filter(element => element.hidden !== true));
	}, [columns])

	const bottomColumns = useMemo(() => {
		return getBottomColumns(sColumns)
	}, [sColumns]);

	const maxDepth = useMemo(() => {
		return getMaxDepth(sColumns);
	}, [sColumns]);

	const gridTemplateColumns = useMemo(() => {
		return bottomColumns.filter(element => element.hidden !== true).map((column) => column.width ?? 120)
	}, [width, bottomColumns])

	const gridTemplateRows = useMemo(() => {
		return rows.map((row) => row.height ?? 35);
	}, [height, rows])

	const skipCells = useMemo(() => getSkippedCells(mergeCells), [mergeCells]);

	const {
		fixedLeftColumns,
		fixedRightColumns,
		fixedLeftColumnsIdx,
		fixedRightColumnsIdx
	} = useMemo(() => {
		const leftColumns: ColumnType<any>[] = [];
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
		return gridTemplateColumns.reduce((acc, cur) => acc + cur, 0)
	}, [gridTemplateColumns]);
	

	const getStickyRightOffset = (currentIndex: number, widths: number[]) => {
		return widths.slice(currentIndex + 1).reduce((acc, cur) => acc + cur, 0);
	}

	const generateBodyElement = ({
		rowRange,
		columnRange,
	}:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {
		const bodyRows: ReactNode[] = [paddingTop];
		for (let rowIndex = rowRange[0]; rowIndex <= rowRange[1]; rowIndex += 1) {
			const tableCells: ReactNode[] = [];
			for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
				const isSkipCell = skipCells.find(element => element.rowIndex === rowIndex && element.columnIndex === columnIndex) != null;
				const column = bottomColumns[columnIndex];
				if (column.fixed === "left" || column.fixed === "right") {
					continue
				}
				const mergeCell = mergeCells.find(mergeCell => mergeCell.rowIndex === rowIndex && mergeCell.columnIndex === columnIndex);

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
						const mergeCell = mergeCells.find(mergeCell => mergeCell.rowIndex === rowIndex && mergeCell.columnIndex === fixedLeftColumnsIdx[index]);
						return (
							<TableBodyCell
								className={css`
									position: sticky;
									z-index: 9;
									background-color: #fff;
								`}
								key={`table-body-cell-${rowIndex}-${fixedLeftColumnsIdx[index]}`}
								row={rows[rowIndex]}
								rowIndex={rowIndex}
								columnIndex={fixedLeftColumnsIdx[index]}
								column={column}
								isSkipCell={false}
								mergeCell={mergeCell}
								gridTemplateColumns={gridTemplateColumns}
								gridTemplateRows={gridTemplateRows}
								fixed="left"
								style={{
									width: gridTemplateColumns[fixedLeftColumnsIdx[index]],
									left: gridTemplateColumns.slice(0, fixedLeftColumnsIdx[index]).reduce((acc, cur) => acc + cur, 0)
								}}
							/>
						)
					})}
					{paddingLeft}
					{tableCells}
					{paddingRight}
					{fixedRightColumns.map((column, index) => {
						const mergeCell = mergeCells.find(mergeCell => mergeCell.rowIndex === rowIndex && mergeCell.columnIndex === fixedRightColumnsIdx[index]);
						return (
							<TableBodyCell
								className={css`
									position: sticky;
									background-color: #fff;
									z-index: 9;	
								`}
								key={`table-body-cell-${rowIndex}-${fixedRightColumnsIdx[index]}`}
								row={rows[rowIndex]}
								rowIndex={rowIndex}
								columnIndex={fixedRightColumnsIdx[index]}
								column={column}
								isSkipCell={false}
								mergeCell={mergeCell}
								gridTemplateColumns={gridTemplateColumns}
								gridTemplateRows={gridTemplateRows}
								fixed="right"
								style={{
									width: gridTemplateColumns[fixedRightColumnsIdx[index]],
									right: getStickyRightOffset(index, fixedRightColumns.map(element => element.width ?? 120))
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
		rowRange,
		columnRange,
	}:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {
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

		const headerFixedRightColumns: ColumnType<any>[] = []
		const headerFixedLeftColumns: ColumnType<any>[] = []
		const headerNormalColumns: ColumnType<any>[] = []
		sColumns.forEach((column) => {
			if (column.fixed === "left") {
				headerFixedLeftColumns.push(column)
			} else if (column.fixed === "right") {
				headerFixedRightColumns.push(column)
			} else {
				headerNormalColumns.push(column);
			}
		});

		const headerFixedRightCells = getHeaderCellsTwoDimensionalArray(headerFixedRightColumns);
		const headerFixedLeftCells = getHeaderCellsTwoDimensionalArray(headerFixedLeftColumns);
		const headerNormalCells = getHeaderCellsTwoDimensionalArray(sColumns);

		const getBottomBorderStyle = (rowIndex: number, maxRowIndex: number) => {
			if (rowIndex === maxRowIndex) {
				return css`
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
				`;
			}
			return "";
		}
	
		for (let r = 0; r < maxDepth; r += 1) {
			const cells: ReactNode[] = [];
			for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
				const cell = headerNormalCells[r]?.[columnIndex];
			
				if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") {
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
						gridTemplateRows={Array.from({ length: maxDepth }, () => 35)}
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
						height: 35,
						width: actualHeight,
						top: r * 35
					}}
				>
					{headerFixedLeftCells?.[r]?.map((cell, columnIndex) => (
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
							gridTemplateRows={Array.from({ length: maxDepth }, () => 35)}
							isSkipCell={cell === null}
							mergeCell={getMergeCell(cell)}
							fixed="left"
							style={{
								width: gridTemplateColumns[columnIndex],
								left: gridTemplateColumns.slice(0, columnIndex).reduce((acc, cur) => acc + cur, 0)
							}}
						/>
					))}
					{paddingLeft}
					{cells}
					{paddingRight}
					{headerFixedRightCells?.[r]?.map((cell, columnIndex) => (
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
							gridTemplateRows={Array.from({ length: maxDepth }, () => 35)}
							isSkipCell={cell === null}
							mergeCell={getMergeCell(cell)}
							fixed="right"
							style={{
								width: gridTemplateColumns[fixedRightColumnsIdx[columnIndex]],
								right: getStickyRightOffset(columnIndex, gridTemplateColumns.slice(-headerFixedRightCells[r].length))
							}}
						/>
					))}
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
				'--crab-rc-virtual-top-padding-height-offset':  `${maxDepth * 35}px`
			} as React.CSSProperties & Record<string, any>}
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
					const headers = generateHeaderElement({
						rowRange,
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
