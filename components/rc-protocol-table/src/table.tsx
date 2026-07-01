import { type HTMLAttributes, type ReactNode, type Key, useState, useRef } from "react";
import Table, { type Row, type FilterEditorParam, type MergeCell, type GroupCellRenderParam, type SortColumn, type RowSelection, type CellEditRecord } from "@crab-dev/rc-table";
import Tree, { NodeType, OverStateEnum } from "@crab-dev/rc-tree";
import Checkbox from "@crab-dev/rc-checkbox";
import LineEdit from "@crab-dev/rc-line-edit";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Pagination from "@crab-dev/rc-pagination";
import { css, cx } from "@linaria/core";
import type { ProtocolColumnType, DataTypeLoader, PaginationConfig, ProtocolTableState } from "./types.js";
import { collectAllLeafColumnNames, collectLeafColumns, exportToCSV, buildCurrentState } from "./columnUtils.js";
import { useColumnManagement } from "./hooks/useColumnManagement.js";
import { useTableData } from "./hooks/useTableData.js";
import { useSearchBar } from "./hooks/useSearchBar.js";
import { ColumnsIcon, FiltersIcon, ExpandAllIcon, CollapseAllIcon, ResetWidthIcon, RefreshIcon, ExportIcon, SearchPrevIcon, SearchNextIcon, ErrorIcon } from "./icons.js";

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
    gap: 6px;
    padding: 6px 12px;
    flex-shrink: 0;
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
    border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
`;

const paginationRefreshBtnStyle = css`
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: oklch(50% 0 0);
    padding: 0;
    flex-shrink: 0;

    &:hover {
        background-color: oklch(88% 0 0);
        color: oklch(30% 0 0);
    }
`;

const tableAndPanelRowStyle = css`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
`;

const tableAreaStyle = css`
    flex: 1;
    min-width: 0;
    position: relative;
`;

const sideToolbarStyle = css`
    width: 36px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4px;
    gap: 2px;
    border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
`;

const sideToolbarBtnStyle = css`
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: oklch(45% 0 0);
    padding: 0;

    &:hover {
        background-color: oklch(88% 0 0);
        color: oklch(30% 0 0);
    }
`;

const sideToolbarBtnActiveStyle = css`
    background-color: oklch(88% 0.04 262);
    color: oklch(50% 0.18 262);

    &:hover {
        background-color: oklch(84% 0.06 262);
        color: oklch(45% 0.18 262);
    }
`;

const sideBarStyle = css`
    width: 220px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
    background-color: var(--crab-rc-table-bg-color, #fff);
    overflow: hidden;
`;

const sideBarToolbarStyle = css`
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    gap: 6px;
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
    flex-shrink: 0;
`;

const sideBarSearchStyle = css`
    flex: 1;
    min-width: 0;
`;

const sideBarBodyStyle = css`
    flex: 1;
    min-height: 0;
    overflow: hidden;
`;

const panelIconBtnStyle = css`
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    color: oklch(45% 0 0);
    padding: 0;
    &:hover { background-color: oklch(88% 0 0); color: oklch(25% 0 0); }
`;

const searchBarStyle = css`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    flex-shrink: 0;
    background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
`;

const searchBarInputWrapStyle = css`
    flex: 1;
    min-width: 0;
    max-width: 240px;
`;

const searchBarCountStyle = css`
    font-size: 11px;
    color: oklch(55% 0 0);
    white-space: nowrap;
    padding: 0 4px;
`;

const searchBarNavBtnStyle = css`
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    padding: 0;
    color: oklch(45% 0 0);
    &:hover { background-color: oklch(90% 0 0); }
    &:disabled { opacity: 0.4; cursor: default; }
`;

const sideBarFooterStyle = css`
    flex-shrink: 0;
    border-top: 1px solid var(--crab-rc-table-border-color, #ddd);
    padding: 4px 8px;
    display: flex;
    justify-content: flex-end;
`;

const resetWidthBtnStyle = css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    height: 24px;
    font-size: 11px;
    border: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    color: oklch(40% 0 0);
    &:hover { background-color: oklch(92% 0 0); }
`;

const clearAllBtnStyle = css`
    padding: 0 6px;
    height: 22px;
    font-size: 11px;
    border: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    color: oklch(45% 0 0);
    white-space: nowrap;
    &:hover { background-color: oklch(92% 0 0); }
`;

const filterPanelScrollStyle = css`
    overflow-y: auto;
`;

const filterPanelRowStyle = css`
    padding: 6px 8px;
    border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
`;

const filterPanelLabelStyle = css`
    font-size: 11px;
    color: oklch(50% 0 0);
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const filterPanelEditorWrapStyle = css`
    height: 28px;
    border: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-radius: 4px;
    overflow: hidden;
`;

const filterPanelEmptyStyle = css`
    padding: 20px 8px;
    text-align: center;
    font-size: 12px;
    color: oklch(65% 0 0);
`;

const errorOverlayStyle = css`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background-color: rgba(255, 255, 255, 0.92);
    z-index: 10;
    color: oklch(45% 0.15 25);
`;

const errorMessageStyle = css`
    font-size: 12px;
    color: oklch(50% 0 0);
    max-width: 280px;
    text-align: center;
    word-break: break-word;
    margin: 0;
`;

const retryBtnStyle = css`
    padding: 0 12px;
    height: 26px;
    font-size: 12px;
    border: 1px solid oklch(70% 0.08 25);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    color: oklch(45% 0.15 25);
    margin-top: 2px;
    &:hover { background-color: oklch(96% 0.01 25); }
`;

/* ───────────────────────────── Props ───────────────────────────── */

interface BaseProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy" | "onError"> {
    filterBar?: boolean;
    typeLoaders?: DataTypeLoader[];
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    expandedGroupIds?: Set<Key>;
    onExpandedGroupIdsChange?: (ids: Set<Key>) => void;
    renderDefaultFilterEditor?: (param: FilterEditorParam<Row>) => ReactNode;
    empty?: ReactNode;
    mergeCells?: MergeCell[];
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void;
    getRowHeight?: (row: T, rowIndex: number) => number | undefined;
    headerRowHeight?: number;
    filterRowHeight?: number;
    filterCellClassName?: string;
    resizable?: boolean;
    onColumnResize?: (columnName: string, width: number) => void;
    draggableColumns?: boolean;
    onColumnOrderChange?: (orderedColumnNames: string[]) => void;
    onGroupColumnOrderChange?: (groupName: string, orderedChildNames: string[]) => void;
    groupBy?: string[];
    groupRowHeight?: number;
    defaultExpandedGroupIds?: Set<Key>;
    defaultExpandAll?: boolean;
    renderGroupCell?: (param: GroupCellRenderParam<T>) => ReactNode;
    sortColumns?: SortColumn[];
    defaultSortColumns?: SortColumn[];
    onSortColumnsChange?: (columns: SortColumn[]) => void;
    rowSelection?: RowSelection<T>;
    highlightKeyword?: string;
    activeMatchIndex?: number;
    onMatchCountChange?: (count: number) => void;
    showSummary?: boolean;
    summaryRowHeight?: number;
    selectCells?: Key[];
    onSelectCellsChange?: (selectCells: Key[]) => void;
    treeData?: boolean;
    getChildRows?: (row: T) => T[] | undefined | null;
    treeColumn?: string;
    expandedRowIds?: Set<Key>;
    defaultExpandedRowIds?: Set<Key>;
    defaultTreeExpandAll?: boolean;
    onExpandedRowIdsChange?: (ids: Set<Key>) => void;
    expandedRowRender?: (row: T) => ReactNode;
    isRowExpandable?: (row: T) => boolean;
    expandedRowKeys?: Set<Key>;
    defaultExpandedRowKeys?: Set<Key>;
    onExpandedRowKeysChange?: (keys: Set<Key>) => void;
    expandedRowHeight?: number;
    getExpandedRowHeight?: (row: T) => number | undefined;
    expandColumnWidth?: number;
    expandColumnFixed?: boolean;
    editType?: "cell" | "row";
    editingRowId?: Key | null;
    defaultEditingRowId?: Key | null;
    onEditingRowIdChange?: (id: Key | null) => void;
    onRowCommit?: (rowId: Key, changes: Record<string, unknown>) => void;
    onRowCancel?: (rowId: Key) => void;
    cellEditRecords?: CellEditRecord[];
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void;
    onUndo?: (record: CellEditRecord) => void;
    sideBar?: boolean;
    defaultSideBarOpen?: boolean;
    initialState?: ProtocolTableState;
    onStateChange?: (state: ProtocolTableState) => void;
    autoRefreshInterval?: number;
    exportFileName?: string;
    showSearchBar?: boolean;
    onError?: (error: Error, source: "columns" | "data") => void;
    /** 是否在最左侧显示行序号列（默认 true） */
    showRowNumber?: boolean;
}

interface NoPaginationProps<T extends Row> extends BaseProps<T> {
    fetchData: (filters: Record<string, string>) => Promise<T[]>;
    pagination?: false;
}

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
        sideBar,
        defaultSideBarOpen,
        initialState,
        onStateChange,
        autoRefreshInterval,
        exportFileName,
        showSearchBar,
        onError,
        showRowNumber = true,
        ...rest
    } = props;

    const { fetchData: _fetchData, ...cleanRest } = rest as typeof rest & { fetchData?: unknown };

    /* ─── Hooks（colMgmt 先于 tableData，通过 ref 桥接互相依赖） ─── */

    // 可变实例状态 ref（例外 §4.1-1）：桥接 colMgmt.onInitialFiltersResolved → tableData.restoreFilters
    const restoreFiltersRef = useRef<(f: Record<string, string>) => void>(() => {});

    const colMgmt = useColumnManagement<T>({
        fetchColumns,
        typeLoaders,
        initialState,
        onStateChange,
        sideBar,
        defaultSideBarOpen,
        onColumnResize,
        onInitialFiltersResolved: (f) => restoreFiltersRef.current(f),
        onError: onError ? (e) => onError(e, "columns") : undefined,
    });

    const tableData = useTableData<T>({
        fetchData: props.fetchData,
        pagination,
        autoRefreshInterval,
        onError: onError ? (e) => onError(e, "data") : undefined,
    });

    // 连接 ref 桥：让 colMgmt 可以调用 tableData.restoreFilters（fetchColumns 完成后恢复 filters）
    restoreFiltersRef.current = tableData.restoreFilters;
    // 每次 render 同步 filters → colMgmt 内部 ref，确保列 handlers 内 notify 使用正确 filters
    colMgmt.latestFiltersRef.current = tableData.filters;

    const searchBar = useSearchBar();

    /* ─── 过滤器面板搜索框（仅 UI 状态，无跨 hook 依赖） ─── */
    const [filterPanelSearch, setFilterPanelSearch] = useState("");

    /* ─── 跨 hook 协调：filter 变更同时触发数据加载 + onStateChange 通知 ─── */
    const handleFilterChange = (nextFilters: Record<string, string>) => {
        colMgmt.latestFiltersRef.current = nextFilters;  // 立即同步，保证 notify 内读到最新 filters
        tableData.handleFilterChange(nextFilters);
        onStateChange?.(buildCurrentState(colMgmt.rawColumnsRef.current, nextFilters));
    };

    /* ─── 渲染 ─── */

    const loading = colMgmt.columnsLoading || tableData.dataLoading;

    const typedRenderDefaultFilterEditor = renderDefaultFilterEditor as unknown as ((param: FilterEditorParam<T>) => ReactNode);
    const typedRenderGroupCell = renderGroupCell as unknown as ((param: GroupCellRenderParam<T>) => ReactNode);

    const tableContent = (
        <>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        width={width}
                        height={height}
                        rows={tableData.rows}
                        columns={colMgmt.columns}
                        expandedGroupIds={expandedGroupIds}
                        onExpandedGroupIdsChange={onExpandedGroupIdsChange}
                        filterBar={filterBar}
                        filters={tableData.filters}
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
                        onColumnResize={colMgmt.handleColumnResize}
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
                        highlightKeyword={showSearchBar ? searchBar.searchKeyword : highlightKeyword}
                        activeMatchIndex={showSearchBar ? searchBar.searchActiveIndex : activeMatchIndex}
                        onMatchCountChange={showSearchBar ? searchBar.setSearchMatchCount : onMatchCountChange}
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
                        showRowNumber={showRowNumber}
                    />
                )}
            </AutoSizer>
            {colMgmt.columnsError && (
                <div className={errorOverlayStyle} data-testid="protocol-table-columns-error">
                    <ErrorIcon />
                    <span>列定义加载失败</span>
                    <p className={errorMessageStyle}>{colMgmt.columnsError.message}</p>
                    <button type="button" className={retryBtnStyle} onClick={colMgmt.retryLoadColumns}>重试</button>
                </div>
            )}
            {!colMgmt.columnsError && tableData.dataError && (
                <div className={errorOverlayStyle} data-testid="protocol-table-data-error">
                    <ErrorIcon />
                    <span>数据加载失败</span>
                    <p className={errorMessageStyle}>{tableData.dataError.message}</p>
                    <button type="button" className={retryBtnStyle} onClick={() => tableData.loadData(tableData.page, tableData.pageSize, tableData.filters)}>重试</button>
                </div>
            )}
            {loading && !colMgmt.columnsError && !tableData.dataError && (
                <div className={loadingOverlayStyle} data-testid="protocol-table-loading">
                    <div className={spinnerStyle} />
                </div>
            )}
        </>
    );

    const handleTabClick = (tab: "columns" | "filters") => {
        if (colMgmt.panelOpen && colMgmt.sideBarTab === tab) {
            colMgmt.setPanelOpen(false);
        } else {
            colMgmt.setSideBarTab(tab);
            colMgmt.setPanelOpen(true);
        }
    };

    const columnsPanelContent = (() => {
        const rawCols = colMgmt.rawColumnsRef.current;
        const allLeafNames = collectAllLeafColumnNames(rawCols);
        const allChecked = allLeafNames.length > 0 && allLeafNames.every(n => colMgmt.panelCheckedKeys.includes(n));
        const indeterminate = !allChecked && allLeafNames.some(n => colMgmt.panelCheckedKeys.includes(n));
        const hasFolders = colMgmt.panelTreeData.some(n => n.type === NodeType.FOLDER);
        const leafTitleMap = colMgmt.getLeafTitleMap(rawCols);

        return (
            <div className={sideBarStyle}>
                <div className={sideBarToolbarStyle}>
                    <Checkbox
                        checked={allChecked}
                        indeterminate={indeterminate}
                        onChange={() => colMgmt.handleSelectAll()}
                        aria-label="全选列"
                    />
                    <div className={sideBarSearchStyle}>
                        <LineEdit
                            size="small"
                            value={colMgmt.panelSearchText}
                            placeholder="搜索列…"
                            onChange={(e) => colMgmt.setPanelSearchText(e.target.value)}
                            allowClear
                            onClear={() => colMgmt.setPanelSearchText("")}
                        />
                    </div>
                    {hasFolders && (
                        <>
                            <button
                                type="button"
                                className={panelIconBtnStyle}
                                title="展开全部"
                                onClick={colMgmt.handleExpandAll}
                            >
                                <ExpandAllIcon />
                            </button>
                            <button
                                type="button"
                                className={panelIconBtnStyle}
                                title="折叠全部"
                                onClick={colMgmt.handleCollapseAll}
                            >
                                <CollapseAllIcon />
                            </button>
                        </>
                    )}
                </div>
                <div className={sideBarBodyStyle}>
                    <AutoSizer>
                        {({ width, height }) => (
                            <Tree
                                treeData={colMgmt.panelTreeData}
                                onTreeNodeChange={colMgmt.setPanelTreeData}
                                width={width}
                                height={height}
                                checkable
                                checkedKeys={colMgmt.panelCheckedKeys}
                                onCheck={colMgmt.handleTreeCheck}
                                expandedKeys={colMgmt.panelExpandedKeys}
                                onExpanded={colMgmt.handlePanelExpandedChange}
                                defaultNodeHeight={32}
                                draggable
                                allowDrop={({ dragNode, targetNode, position }) => {
                                    // 列重排只有 UPWARD / DOWN 两种有意义的操作，INSIDE 一律拒绝
                                    if (position === OverStateEnum.INSIDE) return false;
                                    // 不允许跨层级拖拽
                                    const sameParent = (dragNode.parent?.id ?? null) === (targetNode.parent?.id ?? null);
                                    if (!sameParent) return false;
                                    // 顶层列只允许在同一 fixed 组内拖拽（"left" / undefined / "right" 三组隔离）；
                                    // 这同时解决了 rc-table 内部 sortColumns 按 fixed 重排导致列顺序不更新的问题
                                    if (dragNode.parent === null) {
                                        const rawCols = colMgmt.rawColumnsRef.current;
                                        const dragFixed = rawCols.find(c => c.name === dragNode.id)?.fixed;
                                        const targetFixed = rawCols.find(c => c.name === targetNode.id)?.fixed;
                                        if (dragFixed !== targetFixed) return false;
                                    }
                                    return true;
                                }}
                                onDragEnd={colMgmt.handleColumnDragEnd}
                                filterTreeNode={colMgmt.panelSearchText.trim()
                                    ? (node) => {
                                        const keyword = colMgmt.panelSearchText.trim().toLowerCase();
                                        const label = typeof node.title === "string"
                                            ? node.title
                                            : (leafTitleMap.get(node.id as string | number) ?? String(node.id));
                                        return label.toLowerCase().includes(keyword);
                                    }
                                    : undefined
                                }
                            />
                        )}
                    </AutoSizer>
                </div>
                <div className={sideBarFooterStyle}>
                    <button
                        type="button"
                        className={resetWidthBtnStyle}
                        title="将所有列宽恢复为默认值"
                        onClick={colMgmt.handleResetColumnWidths}
                    >
                        <ResetWidthIcon />
                        重置列宽
                    </button>
                </div>
            </div>
        );
    })();

    type FilterEditorFn = (param: { value: string; onValueChange: (v: string) => void }) => ReactNode;

    const filtersPanelContent = (() => {
        const leafCols = collectLeafColumns(colMgmt.rawColumnsRef.current);
        const allFilterable = leafCols.filter(col => {
            const loader = typeLoaders?.find(l => l.name === col.dataType);
            return loader?.filterEditor != null || renderDefaultFilterEditor != null;
        });
        const keyword = filterPanelSearch.trim().toLowerCase();
        const filterableCols = keyword
            ? allFilterable.filter(col => String(col.title ?? col.name).toLowerCase().includes(keyword))
            : allFilterable;
        const hasActiveFilter = Object.values(tableData.filters).some(v => v !== "");

        return (
            <div className={sideBarStyle}>
                <div className={sideBarToolbarStyle}>
                    <div className={sideBarSearchStyle}>
                        <LineEdit
                            size="small"
                            value={filterPanelSearch}
                            placeholder="搜索过滤器…"
                            onChange={(e) => setFilterPanelSearch(e.target.value)}
                            allowClear
                            onClear={() => setFilterPanelSearch("")}
                        />
                    </div>
                    {hasActiveFilter && (
                        <button
                            type="button"
                            className={clearAllBtnStyle}
                            onClick={() => handleFilterChange({})}
                        >
                            清除全部
                        </button>
                    )}
                </div>
                <div className={cx(sideBarBodyStyle, filterPanelScrollStyle)}>
                    {filterableCols.length === 0 ? (
                        <div className={filterPanelEmptyStyle}>
                            {allFilterable.length === 0 ? "暂无可过滤列" : "无匹配列"}
                        </div>
                    ) : filterableCols.map(col => {
                        const loader = typeLoaders?.find(l => l.name === col.dataType);
                        const editorFn = (loader?.filterEditor ?? typedRenderDefaultFilterEditor) as FilterEditorFn | undefined;
                        if (!editorFn) return null;
                        const colName = col.name as string;
                        return (
                            <div key={colName} className={filterPanelRowStyle}>
                                <div className={filterPanelLabelStyle}>
                                    {String(col.title ?? col.name)}
                                </div>
                                <div className={filterPanelEditorWrapStyle}>
                                    {editorFn({
                                        value: tableData.filters[colName] ?? "",
                                        onValueChange: (v) => {
                                            const next = { ...tableData.filters, [colName]: v };
                                            if (!v) delete next[colName];
                                            handleFilterChange(next);
                                        },
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    })();

    const searchBarEl = showSearchBar ? (
        <div className={searchBarStyle}>
            <div className={searchBarInputWrapStyle}>
                <LineEdit
                    size="small"
                    value={searchBar.searchKeyword}
                    placeholder="在表格中搜索…"
                    onChange={(e) => { searchBar.setSearchKeyword(e.target.value); searchBar.setSearchActiveIndex(0); }}
                    allowClear
                    onClear={() => { searchBar.setSearchKeyword(""); searchBar.setSearchMatchCount(0); searchBar.setSearchActiveIndex(0); }}
                />
            </div>
            {searchBar.searchKeyword && (
                <>
                    <span className={searchBarCountStyle}>
                        {searchBar.searchMatchCount > 0
                            ? `${searchBar.searchActiveIndex + 1}/${searchBar.searchMatchCount}`
                            : "无匹配"}
                    </span>
                    <button
                        type="button"
                        className={searchBarNavBtnStyle}
                        title="上一个"
                        disabled={searchBar.searchMatchCount === 0}
                        onClick={() => searchBar.setSearchActiveIndex(i => Math.max(0, i - 1))}
                    >
                        <SearchPrevIcon />
                    </button>
                    <button
                        type="button"
                        className={searchBarNavBtnStyle}
                        title="下一个"
                        disabled={searchBar.searchMatchCount === 0}
                        onClick={() => searchBar.setSearchActiveIndex(i => Math.min(searchBar.searchMatchCount - 1, i + 1))}
                    >
                        <SearchNextIcon />
                    </button>
                </>
            )}
        </div>
    ) : null;

    const needsFlexCol = showSearchBar || !!pagination;

    const tableAreaContent = sideBar ? (
        <div className={tableAndPanelRowStyle}>
            <div className={tableAreaStyle}>
                {tableContent}
            </div>
            {colMgmt.panelOpen && (colMgmt.sideBarTab === "columns" ? columnsPanelContent : filtersPanelContent)}
            <div className={sideToolbarStyle}>
                <button
                    className={cx(sideToolbarBtnStyle, colMgmt.panelOpen && colMgmt.sideBarTab === "columns" && sideToolbarBtnActiveStyle)}
                    type="button"
                    title="列"
                    onClick={() => handleTabClick("columns")}
                >
                    <ColumnsIcon />
                </button>
                <button
                    className={cx(sideToolbarBtnStyle, colMgmt.panelOpen && colMgmt.sideBarTab === "filters" && sideToolbarBtnActiveStyle)}
                    type="button"
                    title="过滤器"
                    onClick={() => handleTabClick("filters")}
                >
                    <FiltersIcon />
                </button>
                {exportFileName && (
                    <button
                        className={sideToolbarBtnStyle}
                        type="button"
                        title="导出 CSV"
                        onClick={() => exportToCSV(colMgmt.rawColumnsRef.current, tableData.rows, typeLoaders, exportFileName)}
                    >
                        <ExportIcon />
                    </button>
                )}
            </div>
        </div>
    ) : (
        <div className={needsFlexCol ? tableAreaStyle : tableFillStyle}>
            {tableContent}
        </div>
    );

    if (!pagination) {
        return (
            <div {...cleanRest} className={cx(needsFlexCol && flexColumnStyle, className)}>
                {searchBarEl}
                {needsFlexCol ? <div className={tableFlexStyle}>{tableAreaContent}</div> : tableAreaContent}
            </div>
        );
    }

    const { position = "bottom", showSizeChanger, showQuickJumper, showTotal, pageSizeOptions, size } = pagination;

    const paginationBar = (
        <div className={paginationBarStyle}>
            <Pagination
                total={tableData.total}
                current={tableData.page}
                pageSize={tableData.pageSize}
                onChange={tableData.handlePageChange}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal}
                pageSizeOptions={pageSizeOptions}
                size={size}
            />
            <button
                className={paginationRefreshBtnStyle}
                type="button"
                title="立即刷新"
                onClick={() => tableData.loadData(tableData.page, tableData.pageSize, tableData.filters)}
            >
                <RefreshIcon />
            </button>
        </div>
    );

    return (
        <div {...cleanRest} className={cx(flexColumnStyle, className)}>
            {position !== "bottom" && paginationBar}
            <div className={tableFlexStyle}>
                {tableAreaContent}
            </div>
            {position !== "top" && paginationBar}
        </div>
    );
}

export default ProtocolTable;
