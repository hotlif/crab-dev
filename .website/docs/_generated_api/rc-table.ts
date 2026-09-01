/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 * Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。
 */

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type Array<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type CellEditRecord = DocsTypePlaceholder;
type ColumnType<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type FilterEditorParam<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type GroupCellRenderParam<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Key = DocsTypePlaceholder;
type MergeCell = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Record<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type RowEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type RowSelection<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Set<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SortColumn = DocsTypePlaceholder;
type T = DocsTypePlaceholder;
type TableCellProps<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface TablePropsSearchIndex {
    /**
     * 表格的宽度
     */
    "width": number;

    /**
     * 编辑模式
     */
    "editType"?: TableCellProps<T>["editType"];

    /**
     * 表格的高度
     */
    "height": number;

    /**
     * 表格的数据行
     */
    "rows": T[];

    /**
     * 表格的列定义
     */
    "columns": ColumnType<T>[];

    /**
     * 合并单元格的信息
     */
    "mergeCells"?: MergeCell[];

    /**
     * 选择单元格的
     */
    "selectCells"?: Key[];

    /**
     * 选择单元格改变后触发的事件
     */
    "onSelectCellsChange"?: (selectCells: Key[]) => void;

    /**
     * 自定义行高（优先级高于 row.height）
     */
    "getRowHeight"?: (row: T, rowIndex: number) => number | undefined;

    /**
     * 表格头部的高度
     */
    "headerRowHeight"?: number;

    /**
     * 是否展示过滤栏
     */
    "filterBar"?: boolean;

    /**
     * 过滤栏高度
     */
    "filterRowHeight"?: number;

    /**
     * 过滤栏单元格样式类名（可传入 css`` 生成的 className）
     */
    "filterCellClassName"?: string;

    /**
     * 外部受控过滤条件（key 为列 name）
     */
    "filters"?: Record<string, string>;

    /**
     * 自定义默认过滤编辑器（列级 filterEditor 优先级更高）
     */
    "renderDefaultFilterEditor"?: (param: FilterEditorParam<T>) => ReactNode;

    /**
     * 过滤条件变化回调
     */
    "onFilterChange"?: (filters: Record<string, string>) => void;

    /**
     * ====== 行分组 ======
     */
    "groupBy"?: string[];

    /**
     * 暂无说明。
     */
    "groupRowHeight"?: number;

    /**
     * 暂无说明。
     */
    "expandedGroupIds"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "defaultExpandedGroupIds"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "defaultExpandAll"?: boolean;

    /**
     * 暂无说明。
     */
    "onExpandedGroupIdsChange"?: (expandedGroupIds: Set<Key>) => void;

    /**
     * 暂无说明。
     */
    "renderGroupCell"?: (param: GroupCellRenderParam<T>) => ReactNode;

    /**
     * 受控编辑操作记录
     */
    "cellEditRecords"?: CellEditRecord[];

    /**
     * 暂无说明。
     */
    "onCellEditRecordsChange"?: (records: CellEditRecord[]) => void;

    /**
     * 暂无说明。
     */
    "onUndo"?: (record: CellEditRecord) => void;

    /**
     * 受控当前编辑行 ID
     */
    "editingRowId"?: Key | null;

    /**
     * 非受控初始编辑行 ID
     */
    "defaultEditingRowId"?: Key | null;

    /**
     * 编辑行 ID 变化回调
     */
    "onEditingRowIdChange"?: (id: Key | null) => void;

    /**
     * 确认整行编辑：changes 为各列 name → 编辑后值的映射
     */
    "onRowCommit"?: (rowId: Key, changes: Record<string, unknown>) => void;

    /**
     * 取消整行编辑
     */
    "onRowCancel"?: (rowId: Key) => void;

    /**
     * 高亮关键字
     */
    "highlightKeyword"?: string;

    /**
     * 暂无说明。
     */
    "activeMatchIndex"?: number;

    /**
     * 暂无说明。
     */
    "onMatchCountChange"?: (count: number) => void;

    /**
     * 是否允许拖拽调整列宽（默认 false；可通过 ColumnType.resizable 逐列覆盖）
     */
    "resizable"?: boolean;

    /**
     * 暂无说明。
     */
    "onColumnResize"?: (columnName: string, width: number) => void;

    /**
     * 是否允许拖拽列头改变列顺序（默认 false；非固定的顶层列及分组内子列均生效）
     */
    "draggableColumns"?: boolean;

    /**
     * 顶层列顺序变化回调，参数为非固定顶层列的新 name 顺序
     */
    "onColumnOrderChange"?: (orderedColumnNames: string[]) => void;

    /**
     * 分组内子列顺序变化回调，groupName 为父分组列名，orderedChildNames 为新子列顺序
     */
    "onGroupColumnOrderChange"?: (groupName: string, orderedChildNames: string[]) => void;

    /**
     * 按下 Ctrl/Cmd+C 时触发；携带当前选区内所有单元格的数据
     */
    "onCopy"?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown; }>) => void;

    /**
     * 受控排序列配置
     */
    "sortColumns"?: SortColumn[];

    /**
     * 非受控初始排序
     */
    "defaultSortColumns"?: SortColumn[];

    /**
     * 排序变化回调
     */
    "onSortColumnsChange"?: (columns: SortColumn[]) => void;

    /**
     * ====== 行选中 ======
     */
    "rowSelection"?: RowSelection<T>;

    /**
     * 启用树形数据模式
     */
    "treeData"?: boolean;

    /**
     * 获取每行的子行；返回空数组或 null/undefined 表示叶子节点
     */
    "getChildRows"?: (row: T) => T[] | undefined | null;

    /**
     * 显示缩进和展开/收起按钮的列名；默认使用第一个非 fixed="right" 的叶子列
     */
    "treeColumn"?: string;

    /**
     * 受控展开行 id 集合
     */
    "expandedRowIds"?: Set<Key>;

    /**
     * 非受控初始展开行 id 集合
     */
    "defaultExpandedRowIds"?: Set<Key>;

    /**
     * 是否默认全部展开（默认 false）
     */
    "defaultTreeExpandAll"?: boolean;

    /**
     * 展开状态变化回调
     */
    "onExpandedRowIdsChange"?: (ids: Set<Key>) => void;

    /**
     * 是否显示底部固定汇总行；各列内容由 ColumnType.summaryRender 提供，未设置的列为空
     */
    "showSummary"?: boolean;

    /**
     * 汇总行高度（默认 35）
     */
    "summaryRowHeight"?: number;

    /**
     * 提供即启用行展开：返回某行展开后在其下方插入的详情内容
     */
    "expandedRowRender"?: (row: T) => ReactNode;

    /**
     * 控制某行能否展开；默认所有数据行均可展开
     */
    "isRowExpandable"?: (row: T) => boolean;

    /**
     * 受控展开行 key 集合（与树形 expandedRowIds 相互独立）
     */
    "expandedRowKeys"?: Set<Key>;

    /**
     * 非受控初始展开行 key 集合
     */
    "defaultExpandedRowKeys"?: Set<Key>;

    /**
     * 展开行 key 集合变化回调
     */
    "onExpandedRowKeysChange"?: (keys: Set<Key>) => void;

    /**
     * 展开内容区默认高度（默认 200）
     */
    "expandedRowHeight"?: number;

    /**
     * 逐行覆盖展开内容区高度
     */
    "getExpandedRowHeight"?: (row: T) => number | undefined;

    /**
     * 展开图标列宽度（默认 40）
     */
    "expandColumnWidth"?: number;

    /**
     * 展开图标列是否固定到左侧（默认 true）
     */
    "expandColumnFixed"?: boolean;

    /**
     * 无数据时渲染的空状态内容（rows 为空时显示）。 - 不传（undefined）：显示默认 <Empty /> 组件 - 传 null：不显示任何空状态 - 传 ReactNode：显示自定义内容
     */
    "empty"?: ReactNode;

    /**
     * 是否在最左侧（功能列之后）显示行序号列，从 1 开始，分组行与展开内容行不计入序号
     */
    "showRowNumber"?: boolean;

    /**
     * 序号列宽度（默认 50）
     */
    "rowNumberColumnWidth"?: number;

    /**
     * 序号列是否固定到左侧（默认 true）
     */
    "rowNumberColumnFixed"?: boolean;

    /**
     * 点击数据行。传入后该行即成为可点击目标（pointer 光标 + hover 反馈）， 并可用键盘触发：选中行内任一单元格后按 Enter。 以下情形**不会**触发，避免与既有交互打架： - 点在行内的控件上（展开图标、行选择复选框、单选框、按钮、链接、输入框等）； - 单元格拖选之后的那次 click（按下与抬起之间发生了拖动）； - 该行正处于行编辑态。 注意：双击会先产生两次 click（浏览器语义），如需与 onRowDoubleClick 互斥请自行去抖。
     */
    "onRowClick"?: RowEventHandler<T>;

    /**
     * 双击数据行。以下情形**不会**触发： - `editType="cell"` 下双击可编辑单元格（该次双击已被单元格编辑消费）； - `editType="row"` 下双击进入行编辑（该次双击已被行编辑消费）； - 点在行内控件上，或该行正处于行编辑态。
     */
    "onRowDoubleClick"?: RowEventHandler<T>;
}
