import RcVirtual from "@crab/rc-virtual";
import { ReactNode, useMemo } from "react";
import { css } from "@linaria/core";

import TableRow from "./tableRow";
import TableBodyCell from "./bodyCell";
import TableHeaderCell from "./headerCell";
import { getSkippedCells, sortColumns, getBottomColumns, getHeaderCells, getMaxDepth } from "./util";
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
		className={css`
			display: inline-block;
			box-sizing: border-box;
			width: var(--crab-rc-virtual-left-padding-width, 0px);
			height: 100%;
		`}
	/>
)

const paddingRight = (
	<div
		className={css`
			display: inline-block;
			box-sizing: border-box;
			width: var(--crab-rc-virtual-right-padding-width, 0px);
			height: 100%;
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
		return sortColumns(columns);
	}, [columns])

	const bottomColumns = useMemo(() => {
		return getBottomColumns(sColumns)
	}, [sColumns]);

	const headerCells = useMemo(() => {
		return getHeaderCells(sColumns);
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
	
	const generateBodyElement = ({
		rowRange,
		columnRange,
	}:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {
		const bodyRows: ReactNode[] = [
			<div
				className={css`
					display: inline-block;
					box-sizing: border-box;
					height: var(--crab-rc-virtual-top-padding-height, 0px);
					width: 100%;
				`}
			/>
		];
		for (let rowIndex = rowRange[0]; rowIndex <= rowRange[1]; rowIndex += 1) {
			const tableCells: ReactNode[] = [];
			for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
				const isSkipCell = skipCells.find(element => element.rowIndex === rowIndex && element.columnIndex === columnIndex) != null;
				const column = bottomColumns[columnIndex];
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
					}}
				>
					{paddingLeft}
					{tableCells}
					{paddingRight}
				</TableRow>
			);
		}
		bodyRows.push(
			<div
				className={css`
					display: inline-block;
					box-sizing: border-box;
					height: var(--crab-rc-virtual-bottom-padding-height, 0px);
					width: 100%;
				`}
			/>
		)
		return bodyRows;
	}

	const generateHeaderElement = ({
		rowRange,
		columnRange,
	}:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {

		const nodeRows: ReactNode[] = []
		for (let r = 0; r < maxDepth; r += 1) {
			const cells: ReactNode[] = [];
			for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
				const cell = headerCells.find(element => element.columnIndex == columnIndex && element.rowIndex === r);
				const getMergeCell = () => {
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

				cells.push(
					<TableHeaderCell
						key={`table-header-cell-${r}-${columnIndex}`}
						columnIndex={columnIndex}
						column={cell?.column}
						gridTemplateColumns={gridTemplateColumns}
						gridTemplateRows={gridTemplateRows}
						isSkipCell={cell == null ? true : false}
						mergeCell={getMergeCell()}
						style={{
							width: gridTemplateColumns[columnIndex],
						}}
					/>
				)
			}
			nodeRows.push(
				<TableRow
					key={`table-header-row-${r}`}
					className={css`
						position: sticky;
						z-index: 10;
						will-change: transform;
					`}
					style={{
						height: 35,
						top: (r * 35) + 1 
					}}
				>
					{paddingLeft}
					{cells}
					{paddingRight}
				</TableRow>,
			)
		}
		return nodeRows;
	}

	return (
		<div
			{...restProps}
		>
			<RcVirtual
				className={css`
					border: 1px solid var(--crab-rc-table-border-color, #ddd);
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
