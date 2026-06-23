import { Key, type ReactNode } from "react";

export type Align = "left" | "right" | "center";

/** 行的变更状态：new 新增、modified 已修改、deleted 已删除，undefined 表示未变更 */
export type RowState = "new" | "modified" | "deleted";

export interface Row {
    id: Key,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataRef: any,
    height?: number,
    state?: RowState
}

interface RenderParam<T extends Row> {
	row: T
	rowIndex: number,
	columnIndex: number,
	column: ColumnType<T>
	originalElement: ReactNode
	/** 当前高亮关键字，与 Table highlightKeyword 保持同步；originalElement 已自动处理高亮 */
	keyword?: string
	/** 当前单元格内第几个（0-based）匹配为活动匹配（橙色）；undefined 表示无活动匹配。自定义 render 若重新调用 highlightText，需将此值作为第三参数传入 */
	activeOccurrenceInCell?: number
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

	/**
	 * 是否允许该列的单元格被选中（默认 true）
	 */
	selectable?: boolean

	/**
	 * 是否允许拖拽调整该列宽度。
	 * - 未设置时由 Table 的 resizable prop 统一控制
	 * - 设为 true 可在全局关闭时单独开启；设为 false 可在全局开启时单独关闭
	 */
	resizable?: boolean

    /**
     * 自定义该列用于关键字高亮匹配的文本。
     * 当单元格显示内容与原始数据不同（如枚举值转换）时，通过此函数返回实际展示的文本，
     * 使 highlightKeyword 匹配计数正确。
     */
    getSearchText?: (row: T) => string
}

/**
 * 分组行的展示数据：由表格内部根据 `groupBy` + `rows` 自动构造，
 * 不会出现在用户传入的 `rows` 中。`renderGroupCell` 可拿到此结构以自定义渲染。
 */
export interface GroupRowMeta<T extends Row> {
    /** 该分组的稳定 id（包含层级路径，保证全局唯一），可用于受控 expandedGroupIds */
    groupId: Key
    /** 层级，从 0 开始 */
    level: number
    /** 该分组对应的列 name（即 groupBy 中的项） */
    columnName: string
    /** 该分组解析得到的列值（取自第一条命中行经 JSONPath 求值后的结果） */
    value: unknown
    /** 该分组直接 / 间接包含的叶子数据行数量 */
    count: number
    /** 是否当前展开 */
    expanded: boolean
    /** 直接归属此分组的叶子数据行（仅在最末级分组中包含完整列表） */
    leafRows: T[]
}

/**
 * 渲染分组行 banner 时的参数。
 */
export interface GroupCellRenderParam<T extends Row> {
    group: GroupRowMeta<T>
	/** 该 groupBy 列对应的列定义（若 groupBy 名称未命中任何列则为 undefined） */
	column?: ColumnType<T>
	/** 当前正在渲染的列 */
	currentColumn: ColumnType<T>
	/** 当前正在渲染的列下标（叶子列） */
	columnIndex: number
	/** 当前列是否就是本层分组列 */
	isGroupColumn: boolean
    /** 切换该分组的展开状态 */
    onToggle: () => void
    /** 缩进像素（基于 level） */
    indent: number
	/** 当前列的默认节点（分组列默认是 banner，其它列默认是 null） */
    originalElement: ReactNode
}

/**
 * 单次单元格编辑的操作记录，在消费方调用 onCommit 时由表格自动生成并追加到历史列表。
 */
export interface CellEditRecord {
    rowId: Key;
    columnName: string;
    columnIndex: number;
    /** 编辑前的值（进入编辑模式时 JSONPath 查到的原始值） */
    oldValue: unknown;
    /** 编辑后的值（editorValue，即消费方在编辑器中最后设置的值） */
    newValue: unknown;
    timestamp: number;
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
