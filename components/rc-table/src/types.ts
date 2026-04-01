import { Key, type ReactNode } from "react";

export type Align = "left" | "right" | "center";


export interface Row {
    id: Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataRef: any,
    height?: number
}

interface RenderParam<T extends Row> {
	row: T
	rowIndex: number,
	columnIndex: number,
	column: ColumnType<T>
	originalElement: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
	name: string

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
	 */
	width?: number

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
