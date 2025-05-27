import RcVirtual from "@crab/rc-virtual";
import { ReactNode, useMemo } from "react";
import TableRow from "./tableRow";
import TableBodyCell from "./bodyCell";
import TableHeaderCell from "./headerCell";

import type { ColumnType, MergeCell, Row } from "./types";
import { css } from "@linaria/core";

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

function Table<T extends Row>({
	width,
	height,
	rows,
	columns,
	mergeCells = [],
	...restProps
}: TableProps<T>) {

	const gridTemplateColumns = useMemo(() => {
		return columns.filter(element => element.hidden !== true).map((column) => column.width ?? 120)
	}, [width, columns])

	const gridTemplateRows = useMemo(() => {
		return rows.map((row) => row.height ?? 35);
	}, [height, rows])

	const skipCells = useMemo(() => {
		const _skipCells: { rowIndex: number, columnIndex: number }[] = [];
		mergeCells.forEach(mergeCell => {
			const { rowIndex, columnIndex, rowSpan, colSpan} = mergeCell;
			for (let c = 0; c <= colSpan; c += 1) {
				for (let r = 0; r <= rowSpan; r += 1) {
					if (c === 0 && r === 0) {
						continue;
					}
					_skipCells.push({
						rowIndex: rowIndex + r,
						columnIndex: columnIndex + c
					});
				}
			}
		});
		return _skipCells;
	}, [mergeCells]);


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
					const headerRows: ReactNode[] = [];

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

					for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
						const column = columns[columnIndex];
						headerRows.push(
							<TableHeaderCell
								key={`table-header-cell-${columnIndex}`}
								columnIndex={columnIndex}
								column={column}
								isSkipCell={false}
								style={{
									width: gridTemplateColumns[columnIndex],
								}}
							/>
						)
					}

					const bodyRows: ReactNode[] = [
						<TableRow
							key={`table-header-row`}
							className={css`
								position: sticky;
								top: 0;
								z-index: 10;
								will-change: transform;
							`}
							style={{
								height: 35,
							}}
						>
							{paddingLeft}
							{headerRows}
							{paddingRight}
						</TableRow>,
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
							const column = columns[columnIndex];

							const mergeCell = mergeCells.find(mergeCell => mergeCell.rowIndex === rowIndex && mergeCell.columnIndex === columnIndex);

							tableCells.push(
								<TableBodyCell
									key={`table-body-cell-${rowIndex}-${columnIndex}`}
									row={rows[rowIndex]}
									rowIndex={rowIndex}
									columnIndex={columnIndex}
									column={column}
									isSkipCell={isSkipCell}
									style={{
										width: gridTemplateColumns[columnIndex],
									}}
									renderElement={(originalElement) => {
										if (mergeCell) {
											const { rowSpan, colSpan } = mergeCell;
											let height = gridTemplateRows[rowIndex];
											let width = gridTemplateColumns[columnIndex];
											for (let r = 0; r < rowSpan; r += 1) {
												height += gridTemplateRows[rowIndex + r];
											}
											for (let c = 0; c < colSpan; c += 1) {
												width += gridTemplateColumns[columnIndex + c];
											}
											return (
												<div
													className={css`
														position: absolute;
														z-index: 1;
														top: 0;
														box-sizing: border-box;
														background-color: #fff;
														display: inline-flex;
														align-items: center;
														border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
														border-top: 1px solid var(--crab-rc-table-border-color, #ddd);
														border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
													`}
													style={{
														width,
														height
													}}
												>
													{originalElement}
												</div>
											)
										} else {
											return originalElement;
										}
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
				}}		
			/>
		</div>
	)
}


export default Table;


