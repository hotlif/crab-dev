import { useComponentSize, useConfig, useLocale, type ConfigSize, type ConfigDensity } from '@crab-dev/rc-config-provider';
import { type HTMLAttributes, type ReactNode, type Key, useState, useRef } from "react";
import Table, { type Row, type FilterEditorParam, type MergeCell, type GroupCellRenderParam, type SortColumn, type RowSelection, type CellEditRecord, type TableStateProps } from "@crab-dev/rc-table";
import Tree, { NodeType, OverStateEnum } from "@crab-dev/rc-tree";
import Checkbox from "@crab-dev/rc-checkbox";
import LineEdit from "@crab-dev/rc-line-edit";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Pagination from "@crab-dev/rc-pagination";
import Spin from "@crab-dev/rc-spin";
import Button from "@crab-dev/rc-button";
import { cx } from "@crab-dev/css";
import type { ProtocolColumnType, DataTypeLoader, ProtocolTableState, TableDataSource } from "./types.js";
import { collectAllLeafColumnNames, collectLeafColumns, exportToCSV, buildCurrentState } from "./columnUtils.js";
import { useColumnManagement } from "./hooks/useColumnManagement.js";
import { useTableData } from "./hooks/useTableData.js";
import { useSearchBar } from "./hooks/useSearchBar.js";
import { ColumnsIcon, FiltersIcon, ExpandAllIcon, CollapseAllIcon, ResetWidthIcon, RefreshIcon, ExportIcon, SearchPrevIcon, SearchNextIcon, ErrorIcon } from "./icons.js";
import { flexColumnStyle, tableFlexStyle, tableFillStyle, loadingOverlayStyle, paginationBarStyle, iconButtonStyle, tableAndPanelRowStyle, tableAreaStyle, sideToolbarStyle, sideBarStyle, sideBarToolbarStyle, sideBarSearchStyle, sideBarBodyStyle, searchBarStyle, searchBarInputWrapStyle, searchBarCountStyle, sideBarFooterStyle, resetWidthBtnStyle, clearAllBtnStyle, filterPanelScrollStyle, filterPanelRowStyle, filterPanelLabelStyle, filterPanelEditorWrapStyle, filterPanelEmptyStyle, errorOverlayStyle, errorMessageStyle, retryBtnStyle } from "./table.styles.js";
/* ───────────────────────────── Props ───────────────────────────── */

interface BaseProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onCopy" | "onError"> {
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

export type TableProProps<T extends Row> = BaseProps<T> & TableDataSource<T> & TableStateProps;

/* ───────────────────────────── 组件 ───────────────────────────── */

function TablePro<T extends Row>(props: TableProProps<T>) {
    const tableSize = useComponentSize(props.size);
    const config = useConfig();
    const density = props.density ?? config.density;
    const { messages } = useLocale();
    const {
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
        sortColumns,
        sortMode = 'client',
        defaultSortColumns: _defaultSortColumns,
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

    const { fetchData: _fetchData, request: _request, ...cleanRest } = rest;

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
        ...props,
        sortColumns,
        onSortColumnsChange,
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

    const tableContent = (
        <>
            <AutoSizer>
                {({ width, height }) => (
                    <Table
                        {...groupState}
                        {...treeState}
                        {...expansionState}
                        {...editingState}
                        size={tableSize}
                        density={density}
                        width={width}
                        height={height}
                        rows={tableData.rows}
                        columns={colMgmt.columns}
                        onExpandedGroupIdsChange={onExpandedGroupIdsChange}
                        filterBar={filterBar}
                        filters={tableData.filters}
                        onFilterChange={handleFilterChange}
                        renderDefaultFilterEditor={typedRenderDefaultFilterEditor}
                        empty={requestHasFeedback ? null : empty}
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
                        renderGroupCell={typedRenderGroupCell}
                        sortColumns={tableData.sortColumns}
                        sortMode={sortMode}
                        onSortColumnsChange={tableData.handleSortChange}
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
                        onExpandedRowIdsChange={onExpandedRowIdsChange}
                        expandedRowRender={expandedRowRender}
                        isRowExpandable={isRowExpandable}
                        onExpandedRowKeysChange={onExpandedRowKeysChange}
                        expandedRowHeight={expandedRowHeight}
                        getExpandedRowHeight={getExpandedRowHeight}
                        expandColumnWidth={expandColumnWidth}
                        expandColumnFixed={expandColumnFixed}
                        editType={editType}
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
                    <Button type="button" appearance="outlined" className={retryBtnStyle} onClick={() => tableData.loadData(tableData.page, tableData.pageSize, tableData.filters)}>{messages.tablePro.retry}</Button>
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
                                appearance="text" shape="circle" size="s" aria-label={messages.tablePro.expandAll} icon={<ExpandAllIcon />}
                                className={iconButtonStyle}
                                title={messages.tablePro.expandAll}
                                onClick={colMgmt.handleExpandAll}
                            />
                            <Button
                                type="button"
                                appearance="text" shape="circle" size="s" aria-label={messages.tablePro.collapseAll} icon={<CollapseAllIcon />}
                                className={iconButtonStyle}
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
                        appearance="text" size="s" icon={<ResetWidthIcon />}
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
                            appearance="text" size="s"
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
                    value={searchBar.searchKeyword}
                    placeholder={messages.tablePro.searchTable}
                    aria-label={messages.tablePro.searchTable}
                    onValueChange={(value) => { searchBar.setSearchKeyword(value); searchBar.setSearchActiveIndex(0); }}
                    allowClear
                    onClear={() => { searchBar.setSearchKeyword(""); searchBar.setSearchMatchCount(0); searchBar.setSearchActiveIndex(0); }}
                />
            </div>
            {searchBar.searchKeyword && (
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

    const needsFlexCol = showSearchBar || !!pagination;

    const tableAreaContent = sideBar ? (
        <div className={tableAndPanelRowStyle}>
            <div className={tableAreaStyle}>
                {tableContent}
            </div>
            {colMgmt.panelOpen && (colMgmt.sideBarTab === "columns" ? columnsPanelContent : filtersPanelContent)}
            <div className={sideToolbarStyle}>
                <Button
                    className={iconButtonStyle}
                    appearance={colMgmt.panelOpen && colMgmt.sideBarTab === "columns" ? "tonal" : "text"}
                    isSelected={colMgmt.panelOpen && colMgmt.sideBarTab === "columns"}
                    aria-expanded={colMgmt.panelOpen && colMgmt.sideBarTab === "columns"}
                    shape="circle" size="s" aria-label={messages.tablePro.columns} icon={<ColumnsIcon />}
                    type="button"
                    title={messages.tablePro.columns}
                    onClick={() => handleTabClick("columns")}
                />
                <Button
                    className={iconButtonStyle}
                    appearance={colMgmt.panelOpen && colMgmt.sideBarTab === "filters" ? "tonal" : "text"}
                    isSelected={colMgmt.panelOpen && colMgmt.sideBarTab === "filters"}
                    aria-expanded={colMgmt.panelOpen && colMgmt.sideBarTab === "filters"}
                    shape="circle" size="s" aria-label={messages.tablePro.filters} icon={<FiltersIcon />}
                    type="button"
                    title={messages.tablePro.filters}
                    onClick={() => handleTabClick("filters")}
                />
                {exportFileName && (
                    <Button
                        className={iconButtonStyle}
                        type="button"
                        appearance="text" shape="circle" size="s" aria-label={messages.tablePro.exportCsv} icon={<ExportIcon />}
                        title={messages.tablePro.exportCsv}
                        onClick={() => exportToCSV(colMgmt.rawColumnsRef.current, tableData.rows, typeLoaders, exportFileName)}
                    />
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
            <div {...cleanRest} className={cx.call(undefined, needsFlexCol && flexColumnStyle, className)}>
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
                value={tableData.page}
                pageSize={tableData.pageSize}
                onValueChange={(page, details) => tableData.handlePageChange(page, details.pageSize, details.reason, details.event)}
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
                onClick={() => tableData.loadData(tableData.page, tableData.pageSize, tableData.filters)}
            />
        </div>
    );

    return (
        <div {...cleanRest} className={cx.call(undefined, flexColumnStyle, className)}>
            {position !== "bottom" && paginationBar}
            <div className={tableFlexStyle}>
                {tableAreaContent}
            </div>
            {position !== "top" && paginationBar}
        </div>
    );
}

export default TablePro;
