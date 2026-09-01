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
type DataTypeLoader = DocsTypePlaceholder;
type Error = DocsTypePlaceholder;
type FilterEditorParam<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type GroupCellRenderParam<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Key = DocsTypePlaceholder;
type MergeCell = DocsTypePlaceholder;
type PaginationConfig = DocsTypePlaceholder;
type Promise<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ProtocolColumnType = DocsTypePlaceholder;
type ProtocolTableState = DocsTypePlaceholder;
type ReactNode = DocsTypePlaceholder;
type Record<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type Row = DocsTypePlaceholder;
type RowSelection<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Set<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SortColumn = DocsTypePlaceholder;
type T = DocsTypePlaceholder;

export interface ProtocolTablePropsSearchIndex {
    /**
     * 暂无说明。
     */
    "filterBar"?: boolean;

    /**
     * 暂无说明。
     */
    "typeLoaders"?: DataTypeLoader[];

    /**
     * 暂无说明。
     */
    "fetchColumns": (() => Promise<ProtocolColumnType[]>);

    /**
     * 暂无说明。
     */
    "expandedGroupIds"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "onExpandedGroupIdsChange"?: ((ids: Set<Key>) => void);

    /**
     * 暂无说明。
     */
    "renderDefaultFilterEditor"?: ((param: FilterEditorParam<Row>) => ReactNode);

    /**
     * 暂无说明。
     */
    "empty"?: ReactNode;

    /**
     * 暂无说明。
     */
    "mergeCells"?: MergeCell[];

    /**
     * 暂无说明。
     */
    "onCopy"?: ((cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown; }>) => void);

    /**
     * 暂无说明。
     */
    "getRowHeight"?: ((row: T, rowIndex: number) => number | undefined);

    /**
     * 暂无说明。
     */
    "headerRowHeight"?: number;

    /**
     * 暂无说明。
     */
    "filterRowHeight"?: number;

    /**
     * 暂无说明。
     */
    "filterCellClassName"?: string;

    /**
     * 暂无说明。
     */
    "resizable"?: boolean;

    /**
     * 暂无说明。
     */
    "onColumnResize"?: ((columnName: string, width: number) => void);

    /**
     * 暂无说明。
     */
    "draggableColumns"?: boolean;

    /**
     * 暂无说明。
     */
    "onColumnOrderChange"?: ((orderedColumnNames: string[]) => void);

    /**
     * 暂无说明。
     */
    "onGroupColumnOrderChange"?: ((groupName: string, orderedChildNames: string[]) => void);

    /**
     * 暂无说明。
     */
    "groupBy"?: string[];

    /**
     * 暂无说明。
     */
    "groupRowHeight"?: number;

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
    "renderGroupCell"?: ((param: GroupCellRenderParam<T>) => ReactNode);

    /**
     * 暂无说明。
     */
    "sortColumns"?: SortColumn[];

    /**
     * 暂无说明。
     */
    "defaultSortColumns"?: SortColumn[];

    /**
     * 暂无说明。
     */
    "onSortColumnsChange"?: ((columns: SortColumn[]) => void);

    /**
     * 暂无说明。
     */
    "rowSelection"?: RowSelection<T>;

    /**
     * 暂无说明。
     */
    "highlightKeyword"?: string;

    /**
     * 暂无说明。
     */
    "activeMatchIndex"?: number;

    /**
     * 暂无说明。
     */
    "onMatchCountChange"?: ((count: number) => void);

    /**
     * 暂无说明。
     */
    "showSummary"?: boolean;

    /**
     * 暂无说明。
     */
    "summaryRowHeight"?: number;

    /**
     * 暂无说明。
     */
    "selectCells"?: Key[];

    /**
     * 暂无说明。
     */
    "onSelectCellsChange"?: ((selectCells: Key[]) => void);

    /**
     * 暂无说明。
     */
    "treeData"?: boolean;

    /**
     * 暂无说明。
     */
    "getChildRows"?: ((row: T) => T[] | undefined | null);

    /**
     * 暂无说明。
     */
    "treeColumn"?: string;

    /**
     * 暂无说明。
     */
    "expandedRowIds"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "defaultExpandedRowIds"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "defaultTreeExpandAll"?: boolean;

    /**
     * 暂无说明。
     */
    "onExpandedRowIdsChange"?: ((ids: Set<Key>) => void);

    /**
     * 暂无说明。
     */
    "expandedRowRender"?: ((row: T) => ReactNode);

    /**
     * 暂无说明。
     */
    "isRowExpandable"?: ((row: T) => boolean);

    /**
     * 暂无说明。
     */
    "expandedRowKeys"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "defaultExpandedRowKeys"?: Set<Key>;

    /**
     * 暂无说明。
     */
    "onExpandedRowKeysChange"?: ((keys: Set<Key>) => void);

    /**
     * 暂无说明。
     */
    "expandedRowHeight"?: number;

    /**
     * 暂无说明。
     */
    "getExpandedRowHeight"?: ((row: T) => number | undefined);

    /**
     * 暂无说明。
     */
    "expandColumnWidth"?: number;

    /**
     * 暂无说明。
     */
    "expandColumnFixed"?: boolean;

    /**
     * 暂无说明。
     */
    "editType"?: "cell" | "row";

    /**
     * 暂无说明。
     */
    "editingRowId"?: Key | null;

    /**
     * 暂无说明。
     */
    "defaultEditingRowId"?: Key | null;

    /**
     * 暂无说明。
     */
    "onEditingRowIdChange"?: ((id: Key | null) => void);

    /**
     * 暂无说明。
     */
    "onRowCommit"?: ((rowId: Key, changes: Record<string, unknown>) => void);

    /**
     * 暂无说明。
     */
    "onRowCancel"?: ((rowId: Key) => void);

    /**
     * 暂无说明。
     */
    "cellEditRecords"?: CellEditRecord[];

    /**
     * 暂无说明。
     */
    "onCellEditRecordsChange"?: ((records: CellEditRecord[]) => void);

    /**
     * 暂无说明。
     */
    "onUndo"?: ((record: CellEditRecord) => void);

    /**
     * 暂无说明。
     */
    "sideBar"?: boolean;

    /**
     * 暂无说明。
     */
    "defaultSideBarOpen"?: boolean;

    /**
     * 暂无说明。
     */
    "initialState"?: ProtocolTableState;

    /**
     * 暂无说明。
     */
    "onStateChange"?: ((state: ProtocolTableState) => void);

    /**
     * 暂无说明。
     */
    "autoRefreshInterval"?: number;

    /**
     * 暂无说明。
     */
    "exportFileName"?: string;

    /**
     * 暂无说明。
     */
    "showSearchBar"?: boolean;

    /**
     * 暂无说明。
     */
    "onError"?: ((error: Error, source: "columns" | "data") => void);

    /**
     * 是否在最左侧显示行序号列（默认 true）
     */
    "showRowNumber"?: boolean;

    /**
     * 暂无说明。
     */
    "fetchData": ((filters: Record<string, string>) => Promise<T[]>) | ((page: number, pageSize: number, filters: Record<string, string>) => Promise<{ rows: T[]; total: number; }>);

    /**
     * 暂无说明。
     */
    "pagination"?: false | PaginationConfig;
}
