import { type HTMLAttributes, type ReactNode, useState, useEffect, useCallback, useRef, type Key } from "react";
import Table, { type ColumnType, type Row, type FilterEditorParam, type MergeCell, type GroupCellRenderParam, type SortColumn, type RowSelection, type CellEditRecord } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Pagination from "@crab-dev/rc-pagination";
import { css, cx } from "@linaria/core";
import type { ProtocolColumnType, DataTypeLoader, PaginationConfig } from "./types.js";
import { transformColumns } from "./util.js";

/* ───────────────────────────── 样式 ───────────────────────────── */

const flexColumnStyle = css`
    display: flex;
    flex-direction: column;
`;

const tableFlexStyle = css`
    flex: 1;
    min-height: 0;
    position: relative;
`;

const tableFillStyle = css`
    position: relative;
    width: 100%;
    height: 100%;
`;

const loadingOverlayStyle = css`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.65);
    z-index: 10;
`;

const spinnerStyle = css`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 3px solid var(--crab-rc-table-border-color, #ddd);
    border-top-color: oklch(55% 0.2 262);

    @keyframes protocol-table-spin {
        to { transform: rotate(360deg); }
    }
    animation: protocol-table-spin 0.8s linear infinite;
`;

const paginationBarStyle = css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 6px 12px;
    flex-shrink: 0;
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
    border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
`;

/* ───────────────────────────── Props ───────────────────────────── */

/** 公共基础属性 */
interface BaseProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy"> {
    filterBar?: boolean;
    typeLoaders?: DataTypeLoader[];
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    expandedGroupIds?: Set<Key>;
    onExpandedGroupIdsChange?: (ids: Set<Key>) => void;
    /** 当列的 DataTypeLoader 未提供 filterEditor 时的兜底编辑器 */
    renderDefaultFilterEditor?: (param: FilterEditorParam<Row>) => ReactNode;
    /** 无数据时的空状态（undefined=默认 Empty，null=不显示，ReactNode=自定义） */
    empty?: ReactNode;
    /** 合并单元格配置 */
    mergeCells?: MergeCell[];
    /** Ctrl/Cmd+C 触发，携带选区内所有单元格数据 */
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void;
    /** 自定义行高，优先级高于 row.height */
    getRowHeight?: (row: T, rowIndex: number) => number | undefined;
    /** 表头行高 */
    headerRowHeight?: number;
    /** 过滤栏行高 */
    filterRowHeight?: number;
    /** 过滤栏单元格样式类名 */
    filterCellClassName?: string;
    /** 是否允许拖拽调整列宽（默认 false；可通过 ProtocolColumnType.resizable 逐列覆盖） */
    resizable?: boolean;
    /** 列宽变化回调 */
    onColumnResize?: (columnName: string, width: number) => void;
    /** 是否允许拖拽列头改变列顺序（默认 false） */
    draggableColumns?: boolean;
    /** 顶层列顺序变化回调 */
    onColumnOrderChange?: (orderedColumnNames: string[]) => void;
    /** 分组内子列顺序变化回调 */
    onGroupColumnOrderChange?: (groupName: string, orderedChildNames: string[]) => void;
    // ── 行分组（补全） ──
    /** 分组列名列表 */
    groupBy?: string[];
    /** 分组行高 */
    groupRowHeight?: number;
    /** 非受控初始展开分组 id 集合 */
    defaultExpandedGroupIds?: Set<Key>;
    /** 是否默认全部展开 */
    defaultExpandAll?: boolean;
    /** 自定义分组行单元格渲染 */
    renderGroupCell?: (param: GroupCellRenderParam<T>) => ReactNode;
    // ── 列排序 ──
    /** 受控排序列配置 */
    sortColumns?: SortColumn[];
    /** 非受控初始排序 */
    defaultSortColumns?: SortColumn[];
    /** 排序变化回调 */
    onSortColumnsChange?: (columns: SortColumn[]) => void;
    // ── 行选中 ──
    rowSelection?: RowSelection<T>;
    // ── 关键字高亮 ──
    highlightKeyword?: string;
    activeMatchIndex?: number;
    onMatchCountChange?: (count: number) => void;
    // ── 底部汇总 ──
    /** 是否显示底部固定汇总行 */
    showSummary?: boolean;
    /** 汇总行高度 */
    summaryRowHeight?: number;
    // ── 单元格选择 ──
    selectCells?: Key[];
    onSelectCellsChange?: (selectCells: Key[]) => void;
    // ── 树形数据 ──
    treeData?: boolean;
    getChildRows?: (row: T) => T[] | undefined | null;
    treeColumn?: string;
    expandedRowIds?: Set<Key>;
    defaultExpandedRowIds?: Set<Key>;
    defaultTreeExpandAll?: boolean;
    onExpandedRowIdsChange?: (ids: Set<Key>) => void;
    // ── 行展开详情 ──
    expandedRowRender?: (row: T) => ReactNode;
    isRowExpandable?: (row: T) => boolean;
    expandedRowKeys?: Set<Key>;
    defaultExpandedRowKeys?: Set<Key>;
    onExpandedRowKeysChange?: (keys: Set<Key>) => void;
    expandedRowHeight?: number;
    getExpandedRowHeight?: (row: T) => number | undefined;
    expandColumnWidth?: number;
    expandColumnFixed?: boolean;
    // ── 编辑模式 ──
    editType?: "cell" | "row";
    editingRowId?: Key | null;
    defaultEditingRowId?: Key | null;
    onEditingRowIdChange?: (id: Key | null) => void;
    onRowCommit?: (rowId: Key, changes: Record<string, unknown>) => void;
    onRowCancel?: (rowId: Key) => void;
    cellEditRecords?: CellEditRecord[];
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void;
    onUndo?: (record: CellEditRecord) => void;
}

/** 无分页：fetchData 接收筛选条件，直接返回全量数据 */
interface NoPaginationProps<T extends Row> extends BaseProps<T> {
    fetchData: (filters: Record<string, string>) => Promise<T[]>;
    pagination?: false;
}

/** 服务端分页：fetchData 接收 page/pageSize/filters，返回当前页数据和总条数 */
interface WithPaginationProps<T extends Row> extends BaseProps<T> {
    fetchData: (page: number, pageSize: number, filters: Record<string, string>) => Promise<{ rows: T[]; total: number }>;
    pagination: PaginationConfig;
}

type ProtocolTableProps<T extends Row> = NoPaginationProps<T> | WithPaginationProps<T>;

/* ───────────────────────────── 组件 ───────────────────────────── */

function ProtocolTable<T extends Row>(props: ProtocolTableProps<T>) {
    const {
        fetchColumns,
        typeLoaders,
        expandedGroupIds,
        onExpandedGroupIdsChange,
        renderDefaultFilterEditor,
        pagination,
        className,
        filterBar,
        empty,
        mergeCells,
        onCopy,
        getRowHeight,
        headerRowHeight,
        filterRowHeight,
        filterCellClassName,
        resizable,
        onColumnResize,
        draggableColumns,
        onColumnOrderChange,
        onGroupColumnOrderChange,
        groupBy,
        groupRowHeight,
        defaultExpandedGroupIds,
        defaultExpandAll,
        renderGroupCell,
        sortColumns,
        defaultSortColumns,
        onSortColumnsChange,
        rowSelection,
        highlightKeyword,
        activeMatchIndex,
        onMatchCountChange,
        showSummary,
        summaryRowHeight,
        selectCells,
        onSelectCellsChange,
        treeData,
        getChildRows,
        treeColumn,
        expandedRowIds,
        defaultExpandedRowIds,
        defaultTreeExpandAll,
        onExpandedRowIdsChange,
        expandedRowRender,
        isRowExpandable,
        expandedRowKeys,
        defaultExpandedRowKeys,
        onExpandedRowKeysChange,
        expandedRowHeight,
        getExpandedRowHeight,
        expandColumnWidth,
        expandColumnFixed,
        editType,
        editingRowId,
        defaultEditingRowId,
        onEditingRowIdChange,
        onRowCommit,
        onRowCancel,
        cellEditRecords,
        onCellEditRecordsChange,
        onUndo,
        ...rest
    } = props;

    // fetchData 属于 NoPaginationProps/WithPaginationProps，不在 BaseProps 里，
    // 会被 rest spread 到 DOM 元素上。在此剔除，数据通过 latestFetchData ref 读取。
    const { fetchData: _fetchData, ...cleanRest } = rest as typeof rest & { fetchData?: unknown };

    const [columns, setColumns] = useState<ColumnType<T>[]>([]);
    const [rows, setRows] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(
        pagination ? (pagination.defaultPageSize ?? 10) : 10
    );
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [columnsLoading, setColumnsLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true);

    // latest-ref 模式（例外 §4.1-2）：loadData 回调中需读取最新 fetchData/pagination，
    // 但不希望它们进入 useCallback 依赖而触发 useEffect 重复拉数据
    const latestFetchData = useRef(props.fetchData);
    latestFetchData.current = props.fetchData;
    const latestPagination = useRef(pagination);
    latestPagination.current = pagination;

    useEffect(() => {
        setColumnsLoading(true);
        fetchColumns().then((resp: ProtocolColumnType[]) => {
            setColumns(transformColumns(resp, typeLoaders) as unknown as ColumnType<T>[]);
            setColumnsLoading(false);
        });
    }, [fetchColumns]); // fetchColumns 变化时重新拉列定义

    const loadData = useCallback((nextPage: number, nextPageSize: number, nextFilters: Record<string, string>) => {
        setDataLoading(true);
        if (latestPagination.current) {
            // 类型断言拆到独立变量，避免 Babel v8 在 TSX 中误解析 `(expr as Generic<T>["key"])(args)` 模式
            const paginatedFetch = latestFetchData.current as unknown as WithPaginationProps<T>["fetchData"];
            paginatedFetch(nextPage, nextPageSize, nextFilters).then(({ rows: r, total: t }) => {
                setRows(r);
                setTotal(t);
                setDataLoading(false);
            });
        } else {
            const simpleFetch = latestFetchData.current as unknown as NoPaginationProps<T>["fetchData"];
            simpleFetch(nextFilters).then((r) => {
                setRows(r);
                setTotal(r.length);
                setDataLoading(false);
            });
        }
    }, []); // 稳定引用：通过 ref 读取最新 fetchData/pagination

    useEffect(() => {
        loadData(page, pageSize, filters);
    }, [loadData]); // loadData 稳定（deps []），实际仅 mount 时运行一次

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
        loadData(newPage, newPageSize, filters);
        if (pagination) {
            pagination.onChange?.(newPage, newPageSize);
        }
    };

    const handleFilterChange = (nextFilters: Record<string, string>) => {
        setFilters(nextFilters);
        setPage(1);
        loadData(1, pageSize, nextFilters);
    };

    /* ─── 渲染 ─── */

    const loading = columnsLoading || dataLoading;

    // 类型断言拆出，避免 Babel v8 在 TSX 中误解析泛型与联合类型（| undefined 也会触发此问题）
    const typedRenderDefaultFilterEditor = renderDefaultFilterEditor as unknown as ((param: FilterEditorParam<T>) => ReactNode);
    const typedRenderGroupCell = renderGroupCell as unknown as ((param: GroupCellRenderParam<T>) => ReactNode);

    const tableContent = (
        <>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        width={width}
                        height={height}
                        rows={rows}
                        columns={columns}
                        expandedGroupIds={expandedGroupIds}
                        onExpandedGroupIdsChange={onExpandedGroupIdsChange}
                        filterBar={filterBar}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        renderDefaultFilterEditor={typedRenderDefaultFilterEditor}
                        empty={empty}
                        mergeCells={mergeCells}
                        onCopy={onCopy}
                        getRowHeight={getRowHeight}
                        headerRowHeight={headerRowHeight}
                        filterRowHeight={filterRowHeight}
                        filterCellClassName={filterCellClassName}
                        resizable={resizable}
                        onColumnResize={onColumnResize}
                        draggableColumns={draggableColumns}
                        onColumnOrderChange={onColumnOrderChange}
                        onGroupColumnOrderChange={onGroupColumnOrderChange}
                        groupBy={groupBy}
                        groupRowHeight={groupRowHeight}
                        defaultExpandedGroupIds={defaultExpandedGroupIds}
                        defaultExpandAll={defaultExpandAll}
                        renderGroupCell={typedRenderGroupCell}
                        sortColumns={sortColumns}
                        defaultSortColumns={defaultSortColumns}
                        onSortColumnsChange={onSortColumnsChange}
                        rowSelection={rowSelection}
                        highlightKeyword={highlightKeyword}
                        activeMatchIndex={activeMatchIndex}
                        onMatchCountChange={onMatchCountChange}
                        showSummary={showSummary}
                        summaryRowHeight={summaryRowHeight}
                        selectCells={selectCells}
                        onSelectCellsChange={onSelectCellsChange}
                        treeData={treeData}
                        getChildRows={getChildRows}
                        treeColumn={treeColumn}
                        expandedRowIds={expandedRowIds}
                        defaultExpandedRowIds={defaultExpandedRowIds}
                        defaultTreeExpandAll={defaultTreeExpandAll}
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                        expandedRowRender={expandedRowRender}
                        isRowExpandable={isRowExpandable}
                        expandedRowKeys={expandedRowKeys}
                        defaultExpandedRowKeys={defaultExpandedRowKeys}
                        onExpandedRowKeysChange={onExpandedRowKeysChange}
                        expandedRowHeight={expandedRowHeight}
                        getExpandedRowHeight={getExpandedRowHeight}
                        expandColumnWidth={expandColumnWidth}
                        expandColumnFixed={expandColumnFixed}
                        editType={editType}
                        editingRowId={editingRowId}
                        defaultEditingRowId={defaultEditingRowId}
                        onEditingRowIdChange={onEditingRowIdChange}
                        onRowCommit={onRowCommit}
                        onRowCancel={onRowCancel}
                        cellEditRecords={cellEditRecords}
                        onCellEditRecordsChange={onCellEditRecordsChange}
                        onUndo={onUndo}
                    />
                )}
            </AutoSizer>
            {loading && (
                <div className={loadingOverlayStyle} data-testid="protocol-table-loading">
                    <div className={spinnerStyle} />
                </div>
            )}
        </>
    );

    if (!pagination) {
        return (
            <div {...cleanRest} className={className}>
                <div className={tableFillStyle}>
                    {tableContent}
                </div>
            </div>
        );
    }

    const { position = "bottom", showSizeChanger, showQuickJumper, showTotal, pageSizeOptions, size } = pagination;

    const paginationBar = (
        <div className={paginationBarStyle}>
            <Pagination
                total={total}
                current={page}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal}
                pageSizeOptions={pageSizeOptions}
                size={size}
            />
        </div>
    );

    return (
        <div {...cleanRest} className={cx(flexColumnStyle, className)}>
            {position !== "bottom" && paginationBar}
            <div className={tableFlexStyle}>
                {tableContent}
            </div>
            {position !== "top" && paginationBar}
        </div>
    );
}


export default ProtocolTable;
