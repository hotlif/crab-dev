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


interface EditorParam<T extends Row, V = unknown> extends RenderParam<T> {
    /** 当前编辑器值；首次进入编辑时为 null，需消费方自行回退到 row 中的原值 */
    editorValue: V | null
    onEditorValueChange: (value: V) => void
    /**
     * 通知表格退出编辑态。
     * 注意：表格不会自动写回 row.dataRef —— 最终值的落盘必须由消费方在调用 onCommit 之前完成
     * （如 setState / 接口提交）。本回调仅用于"关闭编辑器"。
     */
    onCommit?: () => void
    /** 通知表格放弃编辑并退出，缓存的 editorValue 会被清空 */
    onCancel?: () => void
}

export interface FilterEditorParam<T extends Row> {
	column: ColumnType<T>
	columnIndex: number
	value: string
	onValueChange: (value: string) => void
}

/**
 * 单元格选区状态：由表格父级聚合“当前选中集合 + 锚点”后下发到每个 BodyCell，
 * 用于决定该单元格是否填充淡蓝背景、以及在哪一边绘制选区描边。
 */
export interface CellSelectionState {
	selected: boolean
	isAnchor: boolean
	edgeTop: boolean
	edgeBottom: boolean
	edgeLeft: boolean
	edgeRight: boolean
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

    /**
     * 自定义单元格编辑器
     */
    editRender?: (param: EditorParam<T>) => ReactNode

	/**
	 * 是否开启当前列过滤输入（仅叶子列生效）
	 */
	filterable?: boolean

	/**
	 * 当前列过滤单元格 className
	 */
	filterCellClassName?: string

	/**
	 * 自定义当前列过滤编辑器
	 */
	filterEditor?: (param: FilterEditorParam<T>) => ReactNode
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
