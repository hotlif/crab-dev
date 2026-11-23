import { useComponentSize, useConfig, useLocale, type ConfigSize, type ConfigDensity } from '@crab-dev/rc-config-provider';
import { type HTMLAttributes, type ReactNode, type Key, type Ref, useEffect, useEffectEvent, useMemo, useState, useRef, useImperativeHandle } from "react";
import Table, { type Row, type TableProps, type FilterEditorParam, type MergeCell, type GroupCellRenderParam, type SortColumn, type RowSelection, type CellEditRecord, type TableStateProps, type TableHandle, type TableRowRange } from "@crab-dev/rc-table";
import Tree, { NodeType, OverStateEnum } from "@crab-dev/rc-tree";
import Checkbox from "@crab-dev/rc-checkbox";
import LineEdit from "@crab-dev/rc-line-edit";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Pagination from "@crab-dev/rc-pagination";
import Spin from "@crab-dev/rc-spin";
import Button from "@crab-dev/rc-button";
import { cx } from "@crab-dev/css";
import type { ProtocolColumnType, DataTypeLoader, ProtocolTableState, TablePagedDataSource, TableRemoteDataSource, TableProHandle } from "./types.js";
import { collectAllLeafColumnNames, collectLeafColumns, exportToCSV, buildCurrentState } from "./columnUtils.js";
import { useColumnManagement } from "./hooks/useColumnManagement.js";
import { useTableData, type UseTableDataReturn } from "./hooks/useTableData.js";
import { useRemoteTableData, type RemoteTableData } from "./hooks/useRemoteTableData.js";
import { useSearchBar } from "./hooks/useSearchBar.js";
import { columnsWithSummary } from './util.js';
import { pageSelection, sameScope } from './resultSelection.js';
import type { ResultSelectionConfig, TableQuery } from './types.js';
import { ColumnsIcon, FiltersIcon, ExpandAllIcon, CollapseAllIcon, ResetWidthIcon, RefreshIcon, ExportIcon, SearchPrevIcon, SearchNextIcon, ErrorIcon } from "./icons.js";
import { flexColumnStyle, tableFlexStyle, tableFillStyle, loadingOverlayStyle, paginationBarStyle, iconButtonStyle, sideToolbarButtonStyle, tableAndPanelRowStyle, tableAreaStyle, sideToolbarStyle, sideBarStyle, sideBarToolbarStyle, sideBarSearchStyle, sideBarBodyStyle, searchBarStyle, searchBarInputWrapStyle, searchBarCountStyle, sideBarFooterStyle, resetWidthBtnStyle, clearAllBtnStyle, filterPanelScrollStyle, filterPanelRowStyle, filterPanelLabelStyle, filterPanelEditorWrapStyle, filterPanelEmptyStyle, errorOverlayStyle, errorMessageStyle, retryBtnStyle } from "./table.styles.js";
/* ───────────────────────────── Props ───────────────────────────── */

interface BaseProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy" | "onError"> {
    /** 刷新当前查询、定位可展示行或恢复表格焦点。 */
    ref?: Ref<TableProHandle>;
    size?: ConfigSize;
    /** 数据与导航密度，独立于控件尺寸。 */
    density?: ConfigDensity;
    filterBar?: boolean;
    typeLoaders?: DataTypeLoader<T>[];
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    expandedGroupIds?: Set<Key>;
    onExpandedGroupIdsChange?: (ids: Set<Key>) => void;
    renderDefaultFilterEditor?: (param: FilterEditorParam<T>) => ReactNode;
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
    /** server 仅维护排序状态，排序结果由 request 返回。默认 client。 */
    sortMode?: 'client' | 'server';
    defaultSortColumns?: SortColumn[];
    onSortColumnsChange?: (columns: SortColumn[]) => void;
    /** 由服务端导出当前筛选的所有行。 */
    onExportAll?: (query: Omit<TableQuery, 'page' | 'pageSize'>) => void | Promise<void>;
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
    onRowCommit?: TableProps<T>['onRowCommit'];
    /** 点击数据行或键盘激活时回调。 */
    onRowClick?: TableProps<T>['onRowClick'];
    /** 双击数据行时回调，保留行内编辑器与控件的事件优先级。 */
    onRowDoubleClick?: TableProps<T>['onRowDoubleClick'];
    onCellsChange?: TableProps<T>['onCellsChange'];
    onRedo?: TableProps<T>['onRedo'];
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

type RemoteTableProps<T extends Row> = TableRemoteDataSource<T> & {
    mergeCells?: never;
    getRowHeight?: never;
    groupBy?: never;
    treeData?: false;
    expandedRowRender?: never;
    editType?: never;
    onCellsChange?: never;
    exportFileName?: never;
};

export type TableProProps<T extends Row> = BaseProps<T> & (TablePagedDataSource<T> | RemoteTableProps<T>) & TableStateProps & (
    | { rowSelection?: RowSelection<T>; resultSelection?: never }
    | {
        /** 按查询条件和排除项跨页选择全部符合条件的记录。 */
        resultSelection: ResultSelectionConfig<T>;
        rowSelection?: never;
    }
);

/* ───────────────────────────── 组件 ───────────────────────────── */

function TablePro<T extends Row>(props: TableProProps<T>): ReactNode {
    if (props.remoteRows !== undefined) return <RemoteTablePro props={props} />;
    return <PagedTablePro props={props} />;
}

function RemoteTablePro<T extends Row>({ props }: { props: TableProProps<T> & RemoteTableProps<T> }): ReactNode {
    const data = useRemoteTableData<T>(props);
    return <TableProView props={props} tableData={data} />;
}

function PagedTablePro<T extends Row>({ props }: { props: TableProProps<T> & TablePagedDataSource<T> }): ReactNode {
    const data = useTableData<T>({
        ...props,
        onError: props.onError ? error => props.onError?.(error, 'data') : undefined,
    });
    return <TableProView props={props} tableData={data} />;
}

function TableProView<T extends Row>({ props, tableData }: {
    props: TableProProps<T>;
    tableData: UseTableDataReturn<T> | RemoteTableData<T>;
}): ReactNode {
    const tableSize = useComponentSize(props.size);
    const config = useConfig();
    const density = props.density ?? config.density;
    const { messages } = useLocale();
    const {
        ref,
        size: _size,
        density: _density,
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
        sortColumns: _sortColumns,
        sortMode = 'client',
        defaultSortColumns: _defaultSortColumns,
        onSortColumnsChange: _onSortColumnsChange,
        rowSelection,
        resultSelection,
        onExportAll,
        searchMode,
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
        onRowClick,
        onRowDoubleClick,
        onCellsChange,
        onRedo,
        onRowCancel,
        cellEditRecords,
        onCellEditRecordsChange,
        onUndo,
        sideBar,
        defaultSideBarOpen,
        initialState,
        onStateChange,
        autoRefreshInterval: _autoRefreshInterval,
        exportFileName,
        showSearchBar,
        onError,
        showRowNumber = true,
        ...rest
    } = props;

    const { fetchData: _fetchData, request: _request, remoteRows: _remoteRows, ...cleanRest } = rest;
    const remoteData = 'indexedRows' in tableData ? tableData : undefined;
    const pageData = 'rows' in tableData ? tableData : undefined;

    const colMgmt = useColumnManagement<T>({
        fetchColumns,
        typeLoaders,
        initialState,
        sideBar,
        defaultSideBarOpen,
        onColumnResize,
        onError: onError ? (e) => onError(e, "columns") : undefined,
    });

    const { refresh } = tableData;
    const tableRef = useRef<TableHandle>(null);
    useImperativeHandle(ref, () => ({
        refresh,
        scrollToRow: (rowId, options) => tableRef.current?.scrollToRow(rowId, options) ?? Promise.resolve(false),
        scrollToRowIndex: (index, options) => tableRef.current?.scrollToRowIndex(index, options) ?? Promise.resolve(false),
        focus: () => { tableRef.current?.focus(); },
    }), [refresh]);

    const searchBar = useSearchBar(initialState?.keyword);
    const serverSearch = remoteData !== undefined || searchMode === 'server';
    const searchValue = serverSearch ? tableData.keyword : searchBar.searchKeyword;
    const scope = { filters: tableData.filters, ...(serverSearch ? { keyword: tableData.keyword } : {}) };
    const clearMatching = () => resultSelection?.onValueChange({ mode: 'ids', ids: new Set() });
    const changeSearch = (value: string) => {
        if (serverSearch) {
            if (value === tableData.keyword) return;
            if (resultSelection?.value.mode === 'all') clearMatching();
            tableData.handleKeywordChange(value);
        } else {
            searchBar.setSearchKeyword(value);
            searchBar.setSearchActiveIndex(0);
        }
    };
    const queryState = {
        ...(pageData ? { page: pageData.page, pageSize: pageData.pageSize } : {}),
        sortColumns: tableData.sortColumns,
        keyword: searchValue,
    };
    const viewKey = JSON.stringify([colMgmt.revision, queryState, tableData.filters]);
    const previousView = useRef(viewKey);
    const notifyView = useEffectEvent(() => onStateChange?.({
        ...buildCurrentState(colMgmt.rawColumnsRef.current, tableData.filters), ...queryState,
    }));
    useEffect(() => {
        if (!colMgmt.columnsLoading && !colMgmt.columnsError && previousView.current !== viewKey) {
            previousView.current = viewKey;
            notifyView();
        }
    }, [viewKey, colMgmt.columnsLoading, colMgmt.columnsError]);

    /* ─── 过滤器面板搜索框（仅 UI 状态，无跨 hook 依赖） ─── */
    const [filterPanelSearch, setFilterPanelSearch] = useState("");

    /* ─── 跨 hook 协调：filter 变更同时触发数据加载 + onStateChange 通知 ─── */
    const handleFilterChange = (nextFilters: Record<string, string>) => {
        if (resultSelection?.value.mode === 'all' && !sameScope(scope, { ...scope, filters: nextFilters })) clearMatching();
        tableData.handleFilterChange(nextFilters);
    };

    /* ─── 渲染 ─── */

    const loading = colMgmt.columnsLoading || tableData.dataLoading;
    // Pending/failed requests have not produced an empty result. Keep existing
    // rows during refresh, but do not paint a competing default/custom empty state.
    const requestHasFeedback = loading || colMgmt.columnsError !== null || tableData.dataError !== null;

    const typedRenderDefaultFilterEditor = renderDefaultFilterEditor;
    const typedRenderGroupCell = renderGroupCell;
    // Preserve each controlled/default union when forwarding; sorting is already
    // resolved by useTableData and is therefore controlled at the Table boundary.
    const groupState = expandedGroupIds === undefined
        ? { defaultExpandedGroupIds, defaultExpandAll }
        : { expandedGroupIds };
    const treeState = expandedRowIds === undefined
        ? { defaultExpandedRowIds, defaultTreeExpandAll }
        : { expandedRowIds };
    const expansionState = expandedRowKeys === undefined
        ? { defaultExpandedRowKeys }
        : { expandedRowKeys };
    const editingState = editingRowId === undefined
        ? { defaultEditingRowId }
        : { editingRowId };

    // Table's layout and virtual-cell caches depend on stable column identities.
    const tableColumns = useMemo(() => columnsWithSummary(colMgmt.columns, tableData.summary), [colMgmt.columns, tableData.summary]);
    const projectedSelection = resultSelection
        ? pageSelection(resultSelection, scope,
            pageData?.rows ?? Array.from(remoteData?.indexedRows.rows.values() ?? []), requestHasFeedback)
        : rowSelection;
    const rowProps = 'indexedRows' in tableData ? {
        sortMode: 'server' as const,
        indexedRows: {
            ...tableData.indexedRows,
            renderPlaceholder: (index: number, range: TableRowRange) => {
                if (index !== range.startIndex && index % tableData.blockSize !== 0) return null;
                const block = Math.floor(index / tableData.blockSize);
                const error = tableData.blockErrors.get(block);
                if (!error) return <span role="status">{messages.common.loading}</span>;
                return <span role="alert">
                    <Button type="button" size="xs" appearance="outlined" title={error.message} onClick={event => {
                        event.currentTarget.closest<HTMLElement>('[role="grid"]')?.focus({ preventScroll: true });
                        tableData.retryBlock(block);
                    }}>
                        {messages.tablePro.dataLoadError} · {messages.tablePro.retry}
                    </Button>
                </span>;
            },
        },
    } : {
        rows: tableData.rows, sortMode, mergeCells, getRowHeight, groupBy, treeData, expandedRowRender, editType, onCellsChange,
    };
    const tableContent = (
        <>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        ref={tableRef}
                        {...groupState}
                        {...treeState}
                        {...expansionState}
                        {...editingState}
                        {...rowProps}
                        size={tableSize}
                        density={density}
                        width={width}
                        height={height}
                        columns={tableColumns}
                        onExpandedGroupIdsChange={onExpandedGroupIdsChange}
                        filterBar={filterBar}
                        filters={tableData.filters}
                        onFilterChange={handleFilterChange}
                        renderDefaultFilterEditor={typedRenderDefaultFilterEditor}
                        empty={requestHasFeedback ? null : empty}
                        onCopy={onCopy}
                        headerRowHeight={headerRowHeight}
                        filterRowHeight={filterRowHeight}
                        filterCellClassName={filterCellClassName}
                        resizable={resizable}
                        onColumnResize={colMgmt.handleColumnResize}
                        draggableColumns={draggableColumns}
                        onColumnOrderChange={names => { colMgmt.changeOrder(names); onColumnOrderChange?.(names); }}
                        onGroupColumnOrderChange={(group, names) => { colMgmt.changeOrder(names, group); onGroupColumnOrderChange?.(group, names); }}
                        groupRowHeight={groupRowHeight}
                        renderGroupCell={typedRenderGroupCell}
                        sortColumns={tableData.sortColumns}
                        onSortColumnsChange={tableData.handleSortChange}
                        rowSelection={projectedSelection}
                        highlightKeyword={showSearchBar && !serverSearch ? searchBar.searchKeyword : highlightKeyword}
                        activeMatchIndex={showSearchBar && !serverSearch ? searchBar.searchActiveIndex : activeMatchIndex}
                        onMatchCountChange={showSearchBar && !serverSearch ? searchBar.setSearchMatchCount : onMatchCountChange}
                        showSummary={showSummary && (!remoteData || tableData.summary !== undefined)}
                        summaryRowHeight={summaryRowHeight}
                        selectCells={selectCells}
                        onSelectCellsChange={onSelectCellsChange}
                        getChildRows={getChildRows}
                        treeColumn={treeColumn}
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                        isRowExpandable={isRowExpandable}
                        onExpandedRowKeysChange={onExpandedRowKeysChange}
                        expandedRowHeight={expandedRowHeight}
                        getExpandedRowHeight={getExpandedRowHeight}
                        expandColumnWidth={expandColumnWidth}
                        expandColumnFixed={expandColumnFixed}
                        onEditingRowIdChange={onEditingRowIdChange}
                        onRowCommit={onRowCommit}
                        onRowClick={onRowClick}
                        onRowDoubleClick={onRowDoubleClick}
                        onRedo={onRedo}
                        onRowCancel={onRowCancel}
                        cellEditRecords={cellEditRecords}
                        onCellEditRecordsChange={onCellEditRecordsChange}
                        onUndo={onUndo}
                        showRowNumber={showRowNumber}
                    />
                )}
            </AutoSizer>
            {colMgmt.columnsError && (
                <div className={errorOverlayStyle} role="alert" data-testid="protocol-table-columns-error">
                    <ErrorIcon />
                    <span>{messages.tablePro.columnLoadError}</span>
                    <p className={errorMessageStyle}>{colMgmt.columnsError.message}</p>
                    <Button type="button" appearance="outlined" className={retryBtnStyle} onClick={colMgmt.retryLoadColumns}>{messages.tablePro.retry}</Button>
                </div>
            )}
            {!colMgmt.columnsError && tableData.dataError && (
                <div className={errorOverlayStyle} role="alert" data-testid="protocol-table-data-error">
                    <ErrorIcon />
                    <span>{messages.tablePro.dataLoadError}</span>
                    <p className={errorMessageStyle}>{tableData.dataError.message}</p>
                    <Button type="button" appearance="outlined" className={retryBtnStyle} onClick={() => { void refresh().catch(() => {}); }}>{messages.tablePro.retry}</Button>
                </div>
            )}
            {loading && !colMgmt.columnsError && !tableData.dataError && (
                <div className={loadingOverlayStyle} data-testid="protocol-table-loading">
                    {/* 复用 rc-spin：随之带来 role="status" / aria-live 与 reduced-motion 降级,
                        原先这层遮罩对读屏完全不可感知 */}
                    <Spin tip={messages.common.loading} />
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
                        onCheckedChange={() => colMgmt.handleSelectAll()}
                        aria-label={messages.tablePro.selectAllColumns}
                    />
                    <div className={sideBarSearchStyle}>
                        <LineEdit
                            size="small"
                            value={colMgmt.panelSearchText}
                            placeholder={messages.tablePro.searchColumns}
                            aria-label={messages.tablePro.searchColumns}
                            onValueChange={colMgmt.setPanelSearchText}
                            allowClear
                            onClear={() => colMgmt.setPanelSearchText("")}
                        />
                    </div>
                    {hasFolders && (
                        <>
                            <Button
                                type="button"
                                appearance="text" size="xs" aria-label={messages.tablePro.expandAll} icon={<ExpandAllIcon />}
                                className={sideToolbarButtonStyle}
                                title={messages.tablePro.expandAll}
                                onClick={colMgmt.handleExpandAll}
                            />
                            <Button
                                type="button"
                                appearance="text" size="xs" aria-label={messages.tablePro.collapseAll} icon={<CollapseAllIcon />}
                                className={sideToolbarButtonStyle}
                                title={messages.tablePro.collapseAll}
                                onClick={colMgmt.handleCollapseAll}
                            />
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
                                onCheckedKeysChange={colMgmt.handleTreeCheck}
                                expandedKeys={colMgmt.panelExpandedKeys}
                                onExpandedKeysChange={colMgmt.handlePanelExpandedChange}
                                density={density}
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
                    <Button
                        type="button"
                        appearance="text" size="xs" icon={<ResetWidthIcon />}
                        className={resetWidthBtnStyle}
                        title={messages.tablePro.resetWidthsDescription}
                        onClick={colMgmt.handleResetColumnWidths}
                    >
                        {messages.tablePro.resetWidths}
                    </Button>
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
                            placeholder={messages.tablePro.searchFilters}
                            aria-label={messages.tablePro.searchFilters}
                            onValueChange={setFilterPanelSearch}
                            allowClear
                            onClear={() => setFilterPanelSearch("")}
                        />
                    </div>
                    {hasActiveFilter && (
                        <Button
                            type="button"
                            appearance="text" size="xs"
                            className={clearAllBtnStyle}
                            onClick={() => handleFilterChange({})}
                        >
                            {messages.tablePro.clearAll}
                        </Button>
                    )}
                </div>
                <div className={cx.call(undefined, sideBarBodyStyle, filterPanelScrollStyle)}>
                    {filterableCols.length === 0 ? (
                        <div className={filterPanelEmptyStyle}>
                            {allFilterable.length === 0 ? messages.tablePro.noFilterableColumns : messages.tablePro.noMatchingColumns}
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
                    value={searchValue}
                    placeholder={serverSearch ? messages.tablePro.searchMatching : messages.tablePro.searchTable}
                    aria-label={serverSearch ? messages.tablePro.searchMatching : messages.tablePro.searchTable}
                    onValueChange={changeSearch}
                    allowClear
                    onClear={() => changeSearch('')}
                />
            </div>
            {!serverSearch && searchBar.searchKeyword && (
                <>
                    <span className={searchBarCountStyle}>
                        {searchBar.searchMatchCount > 0
                            ? `${searchBar.searchActiveIndex + 1}/${searchBar.searchMatchCount}`
                            : messages.tablePro.noMatches}
                    </span>
                    <Button
                        type="button"
                        appearance="text" shape="circle" size="s" aria-label={messages.tablePro.previousMatch} icon={<SearchPrevIcon />}
                        className={iconButtonStyle}
                        title={messages.tablePro.previousMatch}
                        disabled={searchBar.searchMatchCount === 0}
                        onClick={() => searchBar.setSearchActiveIndex(i => Math.max(0, i - 1))}
                    />
                    <Button
                        type="button"
                        appearance="text" shape="circle" size="s" aria-label={messages.tablePro.nextMatch} icon={<SearchNextIcon />}
                        className={iconButtonStyle}
                        title={messages.tablePro.nextMatch}
                        disabled={searchBar.searchMatchCount === 0}
                        onClick={() => searchBar.setSearchActiveIndex(i => Math.min(searchBar.searchMatchCount - 1, i + 1))}
                    />
                </>
            )}
        </div>
    ) : null;

    const exportController = useRef<AbortController | null>(null);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState('');
    useEffect(() => () => { exportController.current?.abort(); }, []);
    const exportAll = async () => {
        if (!onExportAll || exportController.current) return;
        const controller = new AbortController();
        exportController.current = controller;
        setExporting(true);
        setExportError('');
        try {
            await onExportAll({ ...scope, sort: tableData.sortColumns.map(item => ({ ...item })), signal: controller.signal });
        } catch (error) {
            if (!controller.signal.aborted) setExportError(error instanceof Error ? error.message : String(error));
        } finally {
            exportController.current = null;
            if (!controller.signal.aborted) setExporting(false);
        }
    };
    const allSelected = resultSelection?.value.mode === 'all' && sameScope(resultSelection.value.scope, scope);
    const resultActions = (resultSelection || onExportAll) && <div className={searchBarStyle}>
        {resultSelection && <Button type="button" size="xs" disabled={!allSelected && (requestHasFeedback || !tableData.total)}
            onClick={() => allSelected ? clearMatching() : resultSelection.onValueChange({ mode: 'all', scope, excludedIds: new Set() })}>
            {allSelected ? messages.tablePro.clearMatching : messages.tablePro.selectMatching}
        </Button>}
        {onExportAll && <Button type="button" size="xs" disabled={exporting || requestHasFeedback} onClick={exportAll}>
            {exporting ? messages.common.loading : messages.tablePro.exportMatching}
        </Button>}
        {exportError && <span role="alert">{exportError}</span>}
    </div>;
    const needsFlexCol = showSearchBar || !!pagination || !!resultActions;

    const tableAreaContent = sideBar ? (
        <div className={tableAndPanelRowStyle}>
            <div className={tableAreaStyle}>
                {tableContent}
            </div>
            {colMgmt.panelOpen && (colMgmt.sideBarTab === "columns" ? columnsPanelContent : filtersPanelContent)}
            <div className={sideToolbarStyle}>
                <Button
                    className={sideToolbarButtonStyle}
                    appearance={colMgmt.panelOpen && colMgmt.sideBarTab === "columns" ? "tonal" : "text"}
                    isSelected={colMgmt.panelOpen && colMgmt.sideBarTab === "columns"}
                    aria-expanded={colMgmt.panelOpen && colMgmt.sideBarTab === "columns"}
                    size="xs" aria-label={messages.tablePro.columns} icon={<ColumnsIcon />}
                    type="button"
                    title={messages.tablePro.columns}
                    onClick={() => handleTabClick("columns")}
                />
                <Button
                    className={sideToolbarButtonStyle}
                    appearance={colMgmt.panelOpen && colMgmt.sideBarTab === "filters" ? "tonal" : "text"}
                    isSelected={colMgmt.panelOpen && colMgmt.sideBarTab === "filters"}
                    aria-expanded={colMgmt.panelOpen && colMgmt.sideBarTab === "filters"}
                    size="xs" aria-label={messages.tablePro.filters} icon={<FiltersIcon />}
                    type="button"
                    title={messages.tablePro.filters}
                    onClick={() => handleTabClick("filters")}
                />
                {exportFileName && pageData && (
                    <Button
                        className={sideToolbarButtonStyle}
                        type="button"
                        appearance="text" size="xs" aria-label={messages.tablePro.exportCsv} icon={<ExportIcon />}
                        title={messages.tablePro.exportCsv}
                        onClick={() => exportToCSV(colMgmt.rawColumnsRef.current, pageData.rows, typeLoaders, exportFileName)}
                    />
                )}
            </div>
        </div>
    ) : (
        <div className={needsFlexCol ? tableAreaStyle : tableFillStyle}>
            {tableContent}
        </div>
    );

    if (!pagination || !pageData) {
        return (
            <div {...cleanRest} className={cx.call(undefined, needsFlexCol && flexColumnStyle, className)}>
                {searchBarEl}
                {resultActions}
                {needsFlexCol ? <div className={tableFlexStyle}>{tableAreaContent}</div> : tableAreaContent}
            </div>
        );
    }

    const { position = "bottom", showSizeChanger, showQuickJumper, showTotal, pageSizeOptions, size } = pagination;

    const paginationBar = (
        <div className={paginationBarStyle}>
            <Pagination
                total={tableData.total}
                value={pageData.page}
                pageSize={pageData.pageSize}
                onValueChange={(page, details) => pageData.handlePageChange(page, details.pageSize, details.reason, details.event)}
                onPageSizeChange={pagination.onPageSizeChange}
                showSizeChanger={showSizeChanger}
                showQuickJumper={showQuickJumper}
                showTotal={showTotal}
                pageSizeOptions={pageSizeOptions}
                size={size ?? tableSize}
            />
            <Button
                className={iconButtonStyle}
                type="button"
                appearance="text" shape="circle" size="s" aria-label={messages.tablePro.refresh} icon={<RefreshIcon />}
                title={messages.tablePro.refresh}
                onClick={() => { void refresh().catch(() => {}); }}
            />
        </div>
    );

    return (
        <div {...cleanRest} className={cx.call(undefined, flexColumnStyle, className)}>
            {searchBarEl}
            {resultActions}
            {position !== "bottom" && paginationBar}
            <div className={tableFlexStyle}>
                {tableAreaContent}
            </div>
            {position !== "top" && paginationBar}
        </div>
    );
}

export default TablePro;
