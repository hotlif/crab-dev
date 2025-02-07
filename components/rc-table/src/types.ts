import { type ReactNode } from "react";

export type Align = "left" | "right" | "center";

export interface SelectCellType {
	rowIndex: number
	columnIndex: number
}

export interface CellType {
	type?: "group"
	groupKey?: string
	groupField?: string
	parentGroupKeys?: string[]
	height?: number
	groupChildren?: Row[]
}

export interface Row {
	$__cell_proto__?: CellType
	children?: Row
	[x: string]: CellType | string | number | unknown | null | undefined | bigint | Date;
}

interface RenderParam<T extends Row> {
	row: T
	rowIndex: number,
	columnIndex: number,
	column: ColumnType<T>
	originalElement: ReactNode
}

interface ColumnChildrenType<T extends Row> extends Omit<ColumnType<T>, "fixed">{

}

export interface ColumnType<T extends Row> {

	/**
	 * 设置列的对齐方式, 如果是数组, 第一个表示设置 Header 的对其方式, 第二个表示 Body 的对其方式
	 */
	align?: Align | Align[]

	/**
	 * 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
	 */
	name?: string

	/**
	 * 列头显示文字
	 */
	title: string

	/**
	 * 隐藏列
	 */
	hidden?: boolean

	/**
	 * 列宽度
	 * 
	 * - numner 表示占用的宽度单位为 px
	 * - `auto`  则表示占用剩下的宽度， 如果多个 `auto` 则表示平分剩下的宽度
	 * - string  仅支持百分比， 表示占用整体宽度的百分比
	 */
	width?: number | "auto" | string

	/**
	 * 固定列
	 */
	fixed?: "left" | "right"

	/**
	 * 表格头部分组
	 */
	children?: ColumnChildrenType<T>[]

	/**
	 * 自定义渲染单元格数据
	 */
	render?: (param: RenderParam<T>) => ReactNode
}

export interface MergeCell {
	/**
	 * 单元格所在行
	 */
	rowIndex: number,

	/**
	 * 单元格所在列
	 */
	columnIndex: number

	/**
	 * 跨几行
	 */
	rowSpan: number

	/**
	 * 跨几列
	 */
	colSpan: number
}
