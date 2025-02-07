import { 
	type ReactNode,
	type HTMLAttributes,
	type MouseEvent,
	useRef,
	useState,
	Ref,
	useImperativeHandle
} from "react";
import { useDefaultState, useViewportSize } from "@crab/rc-hooks";
import { css, cx } from "@linaria/core";
import RcVirtual, { type VirtualHandle } from "@crab/rc-virtual";
import type { Align, MergeCell, ColumnType, SelectCellType } from "./types";
import {
	headerContainerStyle,
	rowContainerStyle,
	containerStyle,
	fixedAndHeaderZIndexStyle,
	fixedLeftStyle,
	headerZIndexStyle,
	leftAlignStyle,
	rightAlignStyle,
	centerAlignStyle,
	fixedZIndexStyle,
	fixedRightStyle,
	fixedLeftFirstStyle,
	fixedRightFirstStyle,
	cellSelectStyle,
	cellGroupContainerStyle,
	cellContainerFirstCell
} from "./style/index";
import Cell from "./cell";
import { type Row } from "./types";
import { getGroupAllKeys } from "./util";

export interface TableHandle {

	/**
	 * 滚动到指定的位置的单元格, 坐标从 0 开始
	 * 	 
	 * 	- rowIndex 第几行
	 * 	- columnIndex 第几列
	 * @param position 
	 * @returns 
	 */
	scrollToCell: (position: {
		rowIndex?: number,
		columnIndex?: number
	}) => void;

	/**
	 * 根据 groupBy 获取当前所有可以展开的 Keys, 一般用来进行分组后控制展开所有
	 */
	getAllExpandedGroupKeys: (groupBy: TableProps<Row>["groupBy"]) => Set<string>
}


interface RowParam<T> {
	event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
	row: T
}

interface RowCellParam<T extends Row> extends RowParam<T> {
	column: ColumnType<T>
}


export interface TableProps<T extends Row> extends HTMLAttributes<HTMLDivElement> {

	/**
	 * table 的一些方法
	 */
	tableRef?: Ref<TableHandle>

	/**
	 * 列信息
	 */
	columns: ColumnType<T>[]

	/**
	 * 行信息
	 */
	rows: T[]

	/**
	 * 单元格合并信息
	 */
	bodyMergeCells?: MergeCell[]

	/**
	 * 根据字段进行分组
	 * 
	 * 注意: 当指定分组的时候, 分组的字段的值不能为 `null` 或者 `undefined`, 这样会导致一些不可预见的错误
	 */
	groupBy?: string[]

	/**
	 * 展开的分组
	 * 
	 */
	expandedGroupKeys?: Set<string>

	/**
	 * 改变行数据触发的事件
	 */
	onRowsChange?: (newRows: T[]) => void

	/**
	 * 点击单元格
	 */
	onCellClick?: (param: RowCellParam<T>) => void;

	/**
	 * 双击单元格
	 */
	onCellDoubleClick?: (param: RowCellParam<T>) => void;

	/**
	 * 单元格右键事件
	 */
	onCellContextMenu?: (param: RowCellParam<T>) => void

	/**
	 * 点击行事件
	 */
	onRowClick?: (param: RowParam<T>) => void

	/**
	 * 双击行事件
	 */
	onRowDoubleClick?: (param: RowParam<T>) => void

	/**
	 * 改变展开的分组数据
	 * 
	 * @param newKeys 展开的 Key 信息
	 */
	onExpandedGroupKeysChange?: (newKeys: Set<string>) => void;

}

function getHeaderAlignStyle<T extends Row>(column: ColumnType<T>) {
	let align: Align = "left";
	if (typeof column.align === "string") {
		align = column.align;
	} else if (Array.isArray(column.align) && column.align?.[0] != null){
		align = column.align[0];
	}
	if (align === "center") {
		return css`${centerAlignStyle}`;
	} else if (align === "right") {
		return css`${rightAlignStyle}`;
	} else {
		return css`${leftAlignStyle}`;
	}
};

function getBodyAlignStyle<T extends Row>(column: ColumnType<T>) {
	let align: Align = "left";
	if (typeof column.align === "string") {
		align = column.align;
	} else if (Array.isArray(column.align) && column.align?.[1] != null){
		align = column.align[1];
	}
	if (align === "center") {
		return css`${centerAlignStyle}`;
	} else if (align === "right") {
		return css`${rightAlignStyle}`;
	} else {
		return css`${leftAlignStyle}`;
	}
};

function Table<T extends Row>({
	columns: _columns,
	rows: _rows,
	tableRef,
	bodyMergeCells = [],
	groupBy = [],
	expandedGroupKeys: _expandedGroupKeys,
	onCellContextMenu,
	onRowClick,
	onRowDoubleClick,
	onCellClick,
	onCellDoubleClick,
	onRowsChange,
	onExpandedGroupKeysChange: _onExpandedGroupKeysChange,
	...restProps
}: TableProps<T>) {

	const divRef = useRef<HTMLDivElement>(null);

	const gridRef = useRef<VirtualHandle>(null);
	const [selectCell, setSelectCell] = useState<SelectCellType | null>(null);


	const {
		value: expandedGroupKeys = new Set<string>(),
		onChange: onExpandedGroupKeysChange
	} = useDefaultState({
		value: _expandedGroupKeys,
		onChange: _onExpandedGroupKeysChange,
	});

	const [
		viewportWidth,
		viewportHeight
	] = useViewportSize(divRef);
	
	const getColumns = () => {
		const rights: ColumnType<T>[] = [];
		const lefts: ColumnType<T>[] = [];
		const normals: ColumnType<T>[] = [];
		_columns.filter(column => column.hidden !== true).forEach(column => {
			if (column.fixed === "left") {
				lefts.push(column);
			} else if (column.fixed === "right") {
				rights.push(column);
			} else {
				normals.push(column);
			}
		});
		return [...lefts, ...normals, ...rights];
	};

	/**
	 * 对数据进行分组
	 */
	const getGroupRows = (tableRows: T[], groupByIndex: number, groupKey: string[]) => {
		const resultRows: T[] = [];
		if (groupByIndex >= groupBy.length) {
			return tableRows;
		}

		const groupSort = (a: T, b: T) => {
			if (a?.$__cell_proto__?.groupKey != null && b?.$__cell_proto__?.groupKey) {
				return a.$__cell_proto__.groupKey?.toString().localeCompare(b.$__cell_proto__.groupKey.toString());
			} else {
				const av = (a as Record<string, unknown>)[groupBy[groupByIndex]] ?? "";
				const bv =  (b as Record<string, unknown>)[groupBy[groupByIndex]] ?? "";
				return ((av as string).toString() ?? "").localeCompare(bv as string);
			}
		};

		const groupData = Object.groupBy(tableRows.sort(groupSort), (element) => (
			(element as Record<string, unknown>)[groupBy[groupByIndex]] as PropertyKey
		));
		
		Object.keys(groupData).forEach(key => {
			const groupKeys = [...groupKey, key];
			const values = groupData[key]!.sort(groupSort);
			const children = getGroupRows(values, groupByIndex + 1, groupKeys);
			const k = [...groupKey, key].join("/");
			resultRows.push({
				$__cell_proto__: {
					type: "group",
					groupKey: k,
					groupField: groupBy[groupByIndex],
					groupChildren: values,
					parentGroupKeys: groupKey,
				},
				[groupBy[groupByIndex]]: key,
				children,
			} as unknown as T);

			if (expandedGroupKeys.has(k)) {
				resultRows.push(...children);
			}
		});
		return resultRows;
	};

	const isGroupRow = () => {
		if (groupBy.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	const getRows = () => {
		if (isGroupRow()) {
			return getGroupRows(_rows, 0, []);
		}
		return _rows;
	};

	const rows = getRows();

	let maxColumnDepth = 0;
	const getTheBottomColumns = (cols: ColumnType<T>[], depth: number) => {
		const resp: ColumnType<T>[] = [];
		cols.forEach((col) => {
			if (col.children) {
				const mapChildren = col.children.map(ele => ({
					...ele,
					fixed: col.fixed
				}));
				resp.push(...getTheBottomColumns(mapChildren, depth + 1));
			} else {
				if (depth > maxColumnDepth) {
					maxColumnDepth = depth;
				}
				resp.push({
					...col
				});
			}
		});
		return resp;
	};

	const rawColumns = getColumns();

	const columns = getTheBottomColumns(rawColumns, 1);

	const calcGridTemplateColumns = () => {
		if (viewportWidth > 0) {
			const gridTemplateColumns: number[] = [];
			let columnsNumber = 0;
			let notNumberColumnsCount = 0;
			columns.forEach(column => {
				if (typeof column.width === "number") {
					columnsNumber += column.width;
				} else {
					notNumberColumnsCount += 1;
				}
			});
			
			columns.forEach(column => {
				const width = column.width ?? "auto";
				let widthNumber: number = 0;
				if (width === "auto") {
					widthNumber = ((viewportWidth - columnsNumber) / notNumberColumnsCount);
				} else if (typeof width === "string" && /^[0-9]+%$/.test(width)) {
					const percentage = Number.parseFloat(width);
					widthNumber = (percentage / 100 * (viewportWidth - columnsNumber));
				} else {
					widthNumber = column.width as number;
				}
				gridTemplateColumns.push(widthNumber);
			});
			return gridTemplateColumns;
		}
		return [];
	};

	const calcGridTemplateRows = () => {
		return [...Array(maxColumnDepth).fill(35) , ...rows.map(() => 35)];
	};

	const gridTemplateColumns = calcGridTemplateColumns();
	const gridTemplateRows = calcGridTemplateRows();

	const isSelectCell = (rowIndex: number, columnIndex: number) => {
		if (selectCell?.rowIndex === rowIndex && selectCell.columnIndex === columnIndex) {
			return true;
		} else {
			return false;
		}
	};

	const onCellFocus = (rowIndex: number, columnIndex: number) => {
		setSelectCell({
			rowIndex: rowIndex,
			columnIndex
		});
	};

	const scrollToCell = (position: {
		rowIndex?: number,
		columnIndex?: number
	}) => {
		gridRef.current?.scrollToCell({
			rowIndex: position.rowIndex,
			columnIndex: position.columnIndex
		});
	};

	const skipCells: Array<{
		cellMerge: MergeCell
		rowIndex: number
		columnIndex: number
	}> = [];

	const selectToCell = (position: SelectCellType) => {
		setSelectCell({
			rowIndex: position.rowIndex + maxColumnDepth,
			columnIndex: position.columnIndex,
		});
	};

	useImperativeHandle(tableRef, () => ({
		scrollToCell: (position) => {
			scrollToCell(position);
		},
		getAllExpandedGroupKeys: (groupBy) => new Set<string>(getGroupAllKeys(_rows, groupBy, 0, []))
	}));

	let startColumnRange = 0;
	let endColumnRange = 0;
	let startRowRange = 0;
	let endRowRange = 0;

	return (
		<div
			ref={divRef}
			tabIndex={-1}
			className={css`${containerStyle}`}
			onKeyDown={(event) => {
				const navigation = (direction: "top" | "bottom" | "left" | "right") => {
					const gridTemplateRowsLength = gridTemplateRows.length;
					const columnEndIndex = columns.length - 1;
					if (direction === "right" && selectCell != null) {
						const selectCellRowIndex = selectCell.rowIndex - maxColumnDepth;
						if (selectCell && selectCell.columnIndex < columnEndIndex) {
							selectToCell({
								columnIndex: selectCell.columnIndex + 1,
								rowIndex: selectCellRowIndex,
							});
	
							if (gridRef.current && selectCell.columnIndex + 1 >= endColumnRange) {
								const {
									columnIndex,
									rowIndex
								} = gridRef.current.getScrollCellPosition();
								
								gridRef.current.scrollToCell({
									columnIndex: columnIndex + 1,
									rowIndex: rowIndex
								});
							}
						} else if (selectCell && selectCell.columnIndex >= columnEndIndex) {
							const nextRowIndex: number = selectCell.rowIndex + 1 <= gridTemplateRowsLength ? selectCell.rowIndex + 1 : gridTemplateRowsLength;
							selectToCell({
								columnIndex: 0,
								rowIndex: nextRowIndex,
							});
	
							if (gridRef.current) {
								const {
									rowIndex
								} = gridRef.current.getScrollCellPosition();
								if (nextRowIndex >= endRowRange) {
									gridRef.current.scrollToCell({
										columnIndex: 0,
										rowIndex: rowIndex + 1
									});
								} else {
									gridRef.current.scrollToCell({
										columnIndex: 0,
										rowIndex
									});
								}
							}
						}
					} else if (direction === "left" && selectCell != null) {
						const selectCellRowIndex = selectCell.rowIndex - maxColumnDepth;
						const nextColumnIndex = selectCell.columnIndex === 0 ? columnEndIndex : selectCell.columnIndex - 1;
						selectToCell({
							columnIndex: nextColumnIndex,
							rowIndex: selectCellRowIndex,
						});

						if (gridRef.current && selectCell.columnIndex <= startColumnRange) {
							const {
								columnIndex,
								rowIndex
							} = gridRef.current.getScrollCellPosition();
							if (selectCell.columnIndex > 0 ) {
								gridRef.current.scrollToCell({
									columnIndex: columnIndex - 1,
									rowIndex: rowIndex
								});
							} else {
								gridRef.current.scrollToCell({
									columnIndex: (columns.length - (endColumnRange - startColumnRange)),
									rowIndex: rowIndex <= 0 ? 0 : rowIndex - 1
								});
							}
						}
					} else if (direction === "top" && selectCell != null) {
						const selectCellRowIndex = selectCell.rowIndex - maxColumnDepth;
						if (selectCellRowIndex > 0) {
							selectToCell({
								columnIndex: selectCell.columnIndex,
								rowIndex: selectCellRowIndex - 1,
							});
						} else {
							selectToCell({
								columnIndex: selectCell.columnIndex,
								rowIndex: 0,
							});
						}

						if (gridRef.current && selectCell.rowIndex - 1 <= startRowRange) {
							const {
								columnIndex,
								rowIndex
							} = gridRef.current.getScrollCellPosition();
							
							console.log(rowIndex);
							gridRef.current.scrollToCell({
								columnIndex: columnIndex,
								rowIndex: rowIndex - 1
							});
						}
					} else if (direction === "bottom" && selectCell != null) {
						const selectCellRowIndex = selectCell.rowIndex - maxColumnDepth;
						if (selectCellRowIndex < gridTemplateRowsLength) {
							selectToCell({
								columnIndex: selectCell.columnIndex,
								rowIndex: selectCellRowIndex + 1,
							});
						} else {
							selectToCell({
								columnIndex: selectCell.columnIndex,
								rowIndex: 0,
							});
						}

						if (gridRef.current && selectCell.rowIndex + 1 >= endRowRange) {
							const {
								columnIndex,
								rowIndex
							} = gridRef.current.getScrollCellPosition();
							gridRef.current.scrollToCell({
								columnIndex: columnIndex,
								rowIndex: rowIndex + 1
							});
						}
					}
				};
				if ((event.key === "Tab" && event.shiftKey === false) || event.key === "ArrowRight") {
					navigation("right");
					event.preventDefault();
				} else if ((event.key === "Tab" && event.shiftKey) || event.key === "ArrowLeft") {
					navigation("left");
					event.preventDefault();
				} else if (event.key === "ArrowUp") {
					navigation("top");
					event.preventDefault();
				} else if (event.key === "ArrowDown") {
					navigation("bottom");
					event.preventDefault();
				}
			}}
			{...restProps}
		>
			{viewportWidth === 0 || viewportHeight === 0 ? null : (
				<RcVirtual
					gridRef={gridRef}
					viewportWidth={viewportWidth}
					viewportHeight={viewportHeight}
					gridTemplateColumns={gridTemplateColumns}
					gridTemplateRows={gridTemplateRows}
					renderRows={(rowRange: [number, number], columnRange: [number, number]) => {
						startColumnRange = columnRange[0];
						endColumnRange = columnRange[1];
						startRowRange = rowRange[0];
						endRowRange = rowRange[1];
						const reactNodes: ReactNode[] = [];
						const getHeaderBottomColumns = (cols: ColumnType<T>[]) => {
							const resp: ColumnType<T>[] = [];
							cols.forEach((col) => {
								if (col.children) {
									const mapChildren = col.children.map(ele => ({
										...ele,
										fixed: col.fixed
									}));
									resp.push(...getHeaderBottomColumns(mapChildren));
								} else {
									resp.push({
										...col
									});
								}
							});
							return resp;
						};

						let maxFixedLeftSpan = 0;
						const recursionHeaderColumns = (
							cols: ColumnType<T>[],
							depth: number,
							parentColStart: number,
							parentFixedLeft: number,
							parentFixedRight: number,
							fixed?: ColumnType<T>["fixed"],
						) => {
							let nextFiexdLeft = 0;
							let nextFiexdRight = 0;
							const topChildrenRows: ReactNode[] = [];
							const topCells: ReactNode[] = [];
							let left = parentFixedLeft;
							const rightFixedReactNode: ReactNode[] = [];
							let colEnd = parentColStart;
							let isHavingFirstOneRight = false;
							cols.forEach((column, colIndex) => {
								const childrens = getHeaderBottomColumns(column.children ?? []);
								const colSpan = childrens.length > 0 ? childrens.length - 1 : 0;
								const colStart = colEnd;
								colEnd = colEnd + 1 + colSpan;
								const top = (depth - 1) * 35;
								const gridRowEnd = (
									maxColumnDepth > depth && column.children == null
								) ? `span ${maxColumnDepth - depth + 1}` : undefined;

								if (column.fixed === "left" || fixed === "left") {

									const isLeftFirst = () => {
										if (fixed != null) {
											if (maxFixedLeftSpan === colEnd) {
												return true;
											} else {
												return false;
											}
										} else {
											if (colEnd > maxFixedLeftSpan) {
												maxFixedLeftSpan = colEnd;
											}
											return cols?.[colIndex + 1]?.fixed !== "left";
										}
									};

									topCells.push(
										<Cell
											className={cx(
												css`
													${headerContainerStyle}
													${fixedLeftStyle}
													${fixedAndHeaderZIndexStyle}
												`,
												getHeaderAlignStyle(column),
												isLeftFirst() ? css`${fixedLeftFirstStyle}` : null,
												colStart === 1 ? css`${cellContainerFirstCell}` : null,
											)}
											isHeaderCell
											rowIndex={depth}
											colStart={colStart}
											colEnd={colEnd}
											column={column}
											gridTemplateRows={gridTemplateRows}
											style={{
												left,
												top,
												gridRowEnd 
											}}
											key={`header-fixed-left-${depth}-${colStart}`}
										>
											{column.title}
										</Cell>
									);
									left += column.width as number;
									if (maxColumnDepth > depth && column.children == null) {
										nextFiexdLeft = left;
									}
								} else if (column.fixed === "right" || fixed === "right") {
									let right = parentFixedRight;
									for (let i = colIndex + 1; i < cols.length; i += 1) {
										right += cols[i].width as number;
									}

									const isRightFirst = () => {
										if (fixed !== null) {
											if (isHavingFirstOneRight === false) {
												isHavingFirstOneRight = true;
												return true;
											} else {
												return false;
											}
										} else {
											return cols?.[colIndex - 1]?.fixed !== "right";
										}
									};

									rightFixedReactNode.push(
										<Cell
											className={cx(
												css`
													${headerContainerStyle}
													${fixedRightStyle}
													${fixedAndHeaderZIndexStyle}
												`,
												getHeaderAlignStyle(column),
												isRightFirst() ? css`${fixedRightFirstStyle}` : null
											)}
											isHeaderCell
											rowIndex={depth}
											colStart={colStart}
											colEnd={colEnd}
											column={column}
											gridTemplateRows={gridTemplateRows}
											style={{
												right,
												top,
												gridRowEnd
											}}
											key={`header-fixed-right-${depth}-${colStart}`}
										>
											{column.title}
										</Cell>
									);
									if (maxColumnDepth > depth && (column.children?.length ?? 0) > 0) {
										nextFiexdRight = right;
									}
								} else if (colStart >= columnRange[0] && colStart - 1 <= columnRange[1]) {
									topCells.push(
										<Cell
											className={cx(
												css`
													${headerContainerStyle}
													${headerZIndexStyle}
												`,
												getHeaderAlignStyle(column),
												colStart === 1 ? css`${cellContainerFirstCell}` : null,
											)}
											key={`header-${depth}-${colStart}`}
											rowIndex={depth}
											colStart={colStart}
											colEnd={colEnd}
											column={column}
											gridTemplateRows={gridTemplateRows}
											isHeaderCell
											style={{
												top,
												gridRowEnd
											}}
										>
											{column.title}
										</Cell>
									);
								}
								if (column.children) {
									topChildrenRows.push(
										...recursionHeaderColumns(
											column.children,
											depth + 1,
											colStart,
											nextFiexdLeft,
											nextFiexdRight,
											fixed ?? column.fixed
										)
									);
								}
							});
						
							topCells.push(...rightFixedReactNode);

							return [
								(
									<div
										className={css`${rowContainerStyle}`}
										key={depth}
										style={{
											...{
												"--table-grid-row-start": depth
											} as Record<string, number>
										}}
									>
										{topCells}
									</div>
								),
								...topChildrenRows
							];
						};

						reactNodes.push(recursionHeaderColumns(rawColumns, 1, 1, 0, 0));
					
						const getCellValue = (column: ColumnType<T>, row: T): ReactNode => {
							const name = column.name;
							if (name != null) {
								return (row as unknown as Record<string, string | number>)[name];
							}
							return "";
						};

						for (let rowIndex = rowRange[0] + maxColumnDepth; rowIndex <= rowRange[1]; rowIndex += 1) {
							const dataRowIndex = rowIndex - maxColumnDepth;
							const row = rows.at(dataRowIndex)!;
							const colDiv: ReactNode[] = [];
							let left = 0;
							const rightFixedReactNode: ReactNode[] = [];
							let colEnd = 1;
							columns.forEach((column, index) => {
								const skipCell = skipCells.find(ele => (ele.rowIndex === rowIndex && ele.columnIndex === index));
								if (skipCell) {
									if (skipCell.cellMerge.rowIndex + maxColumnDepth !== rowIndex) {
										colEnd = colEnd + 1;
									}
									return;
								}

								const mergeCell = bodyMergeCells.filter(ele => (
									(ele.rowIndex + maxColumnDepth === rowIndex && ele.columnIndex === index)
								));

								if (mergeCell.length > 1) {
									console.warn("[Table]: When merging units, it was found that there are more than one identical configuration. Please check if the cellMerge property is configured correctly.");
								}

								const getCellType = () => {
									if (
										row?.$__cell_proto__?.type === "group" &&
										row?.$__cell_proto__?.groupField && 
										column.name === row?.$__cell_proto__?.groupField
									) {
										return "group";
									}
									return "normal";
								};

								const getExpandedGroupStatus = () => {
									if (
										row?.$__cell_proto__?.groupKey &&
										expandedGroupKeys.has(row?.$__cell_proto__?.groupKey)
									) {
										
										return true;
									}
									return false;
								};
							

								const _onCellClick = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
									if (getCellType() == "group" && row?.$__cell_proto__?.groupKey) {
										if(expandedGroupKeys.has(row.$__cell_proto__.groupKey)) {
											expandedGroupKeys.delete(row.$__cell_proto__.groupKey);
										} else {
											expandedGroupKeys.add(row.$__cell_proto__.groupKey);
										}
										onExpandedGroupKeysChange?.(new Set([...expandedGroupKeys]));
									}
									onCellClick?.({
										event,
										column,
										row
									});
									onCellFocus?.(rowIndex, index);
								};

								const colStart = colEnd;
								colEnd = colEnd + 1;
								let gridRowEnd;
								if (mergeCell?.[0]) {
									const colSpan = mergeCell?.[0].colSpan;
									colEnd += colSpan;
									for (let x = 0; x <= colSpan; x += 1) {
										for (let y = 0; y <= mergeCell?.[0]?.rowSpan; y += 1) {
											if (x === 0 && y === 0) {
												continue;
											}
											skipCells.push({
												cellMerge: mergeCell[0],
												rowIndex: rowIndex + y,
												columnIndex: x + index
											});
										}
									}
								}
								if (mergeCell?.[0]?.rowSpan) {
									gridRowEnd = `span ${mergeCell?.[0]?.rowSpan + 1}`;
								}

								if (column.fixed === "left") {
									colDiv.push(
										<Cell
											className={cx(
												css`
													${fixedZIndexStyle}
													${fixedLeftStyle}
												`,
												getBodyAlignStyle(column),
												row?.$__cell_proto__?.type === "group" ? null : (isSelectCell(rowIndex, index) ? css`${cellSelectStyle}` : null),
												columns?.[index + 1]?.fixed !== "left" ? css`${fixedLeftFirstStyle}` : null,
												row?.$__cell_proto__?.type === "group" ? css`${cellGroupContainerStyle}` : null,
												colStart === 1 ? css`${cellContainerFirstCell}` : null
											)}
											dataRowIndex={dataRowIndex}
											dataColumnIndex={index}
											rowIndex={rowIndex}
											colStart={colStart}
											colEnd={colEnd}
											type={getCellType()}
											key={`body-fixed-left-${rowIndex}-${index}`}
											style={{
												left
											}}
											column={column}
											gridTemplateRows={gridTemplateRows}
											row={row}
											expandedGroup={getExpandedGroupStatus()}
											onClick={_onCellClick}
											onDoubleClick={(event) => {
												onCellDoubleClick?.({
													event,
													column,
													row
												});
											}}
											onContextMenu={(event) => {
												onCellContextMenu?.({
													event,
													column,
													row
												});
											}}
										>
											{getCellValue(column, row)}
										</Cell>
									);
									left += gridTemplateColumns[index];

								} else if (column.fixed === "right") {
									let right = 0;
									for (let i = index + 1; i < columns.length; i += 1) {
										right += columns[i].width as number;
									}
									rightFixedReactNode.push(
										<Cell
											className={cx(
												css`
													${fixedZIndexStyle}
													${fixedRightStyle}
												`,
												getBodyAlignStyle(column),
												row?.$__cell_proto__?.type === "group" ? null : (isSelectCell(rowIndex, index) ? css`${cellSelectStyle}` : null),
												columns?.[index - 1]?.fixed !== "right"  ? css`${fixedRightFirstStyle}` : null,
												row?.$__cell_proto__?.type === "group" ? css`${cellGroupContainerStyle}` : null,
											)}
											dataRowIndex={dataRowIndex}
											dataColumnIndex={index}
											rowIndex={rowIndex}
											colStart={colStart}
											colEnd={colEnd}
											column={column}
											gridTemplateRows={gridTemplateRows}
											row={row}
											type={getCellType()}
											expandedGroup={getExpandedGroupStatus()}
											key={`body-fixed-right-cell-${rowIndex}-${index}`}
											style={{
												right,
											}}
											onContextMenu={(event) => {
												onCellContextMenu?.({
													event,
													column,
													row
												});
											}}
											onDoubleClick={(event) => {
												onCellDoubleClick?.({
													event,
													column,
													row
												});
											}}
											onClick={_onCellClick}
										>
											{getCellValue(column, row)}
										</Cell>
									);
								} else if (index >= columnRange[0] && index <= columnRange[1]) { 
									colDiv.push(
										<Cell
											className={cx(
												getBodyAlignStyle(column),
												row?.$__cell_proto__?.type === "group" ? null : (isSelectCell(rowIndex, index) ? css`${cellSelectStyle}` : null),
												row?.$__cell_proto__?.type === "group" ? css`${cellGroupContainerStyle}` : null,
												colStart === 1 ? css`${cellContainerFirstCell}` : null
											)}
											dataRowIndex={dataRowIndex}
											dataColumnIndex={index}
											rowIndex={rowIndex}
											colStart={colStart}
											colEnd={colEnd}
											type={getCellType()}
											column={column}
											gridTemplateRows={gridTemplateRows}
											row={row}
											expandedGroup={getExpandedGroupStatus()}
											style={{
												gridRowEnd
											}}
											onContextMenu={(event) => {
												onCellContextMenu?.({
													event,
													column,
													row
												});
											}}
											key={`body-cell-${rowIndex}-${index}`}
											onClick={_onCellClick}
											onDoubleClick={(event) => {
												onCellDoubleClick?.({
													event,
													column,
													row
												});
											}}
										>
											{getCellValue(columns[index], row)}
										</Cell>
									);
								} 
							});

							colDiv.push(...rightFixedReactNode);
							reactNodes.push(
								<div
									className={css`${rowContainerStyle}`}
									key={rowIndex}
									onClick={(event) => {
										onRowClick?.({
											event,
											row
										});
									}}
									onDoubleClick={(event) => {
										onRowDoubleClick?.({
											event,
											row
										});
									}}
									style={{
										...{
											"--table-grid-row-start": rowIndex + 1
										} as Record<string, number>
									}}
								>
									{colDiv}
								</div>
							);
						}
						return reactNodes;
					}}
				/>
			)}
		</div>
	);
};

export default Table;

