import { useFilterRowHeight } from "./hooks/useFilterRowHeight.js";
import { useRowEditFocus } from "./hooks/useRowEditFocus.js";
import type { TableProps } from "./table-props.js";
export type { TableProps } from "./table-props.js";
import ExpandedRowContent from "./expanded-row-content.js";
import { paddingLeft, paddingLeftWithCompensation, paddingRight, paddingBottom, paddingTop } from "./virtual-spacers.js";
import { makeRowReactKey, makeColumnReactKey } from "./util.js";
import { useComponentSize, useConfig, useLocale, componentDensityMetrics, densityStyles } from '@crab-dev/rc-config-provider';
import { RuntimeDirectionProvider } from '@crab-dev/rc-config-provider/internal';
import Button from '@crab-dev/rc-button';
import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type Key, type ReactNode, useCallback, useMemo, useRef } from "react";
import { css, cx } from "@crab-dev/css";
import Checkbox from "@crab-dev/rc-checkbox";
import Radio from "@crab-dev/rc-radio";
import Empty from "@crab-dev/rc-empty";
import { useAnimatedRows, useMediaQuery } from "@crab-dev/rc-hooks";
import BodyRow from "./bodyRow.js";
import TableIconButton from "./iconButton.js";
import token from "./token.js";
import TableBodyCell from "./bodyCell.js";
import TableHeaderCell from "./headerCell.js";
import { type HeaderCellType, makeCellIdentityKey } from "./util.js";
import type { ColumnType, MergeCell, Row } from "./types.js";
import { useRowSelection } from "./hooks/useRowSelection.js";
import { useRowGroup } from "./hooks/useRowGroup.js";
import { useColumnLayout } from "./hooks/useColumnLayout.js";
import { useColumnResize } from "./hooks/useColumnResize.js";
import { useCellEdit } from "./hooks/useCellEdit.js";
import { useCellSelection } from "./hooks/useCellSelection.js";
import { useTableFilter } from "./hooks/useTableFilter.js";
import { useKeywordMatch } from "./hooks/useKeywordMatch.js";
import { useTreeData } from "./hooks/useTreeData.js";
import { useRowEdit } from "./hooks/useRowEdit.js";
import { useColumnDrag } from "./hooks/useColumnDrag.js";
import { useColumnSort } from "./hooks/useColumnSort.js";
import { useCellEditNav } from "./hooks/useCellEditNav.js";
import type { CellNavDirection } from "./hooks/useCellEditNav.js";
import { useSummary } from "./hooks/useSummary.js";
import { useRowExpansion } from "./hooks/useRowExpansion.js";
import { useRowNumber, ROW_NUMBER_COLUMN_NAME } from "./hooks/useRowNumber.js";
import { useRowEvents } from "./hooks/useRowEvents.js";

import { useTableInteractionScope } from "./hooks/useTableInteractionScope.js";
import { ROW_BG_VAR } from "./rowBg.js";
import type { InternalExpandedRow, InternalGroupRow } from "./util.js";
import { EXPAND_COLUMN_NAME, isExpandedContentRow, isGroupRow } from "./util.js";
import { tableRootStyle, tableFocusRingStyle, filterSizeProbeStyle, selectionCellStyle, expandChevronStyle, selectedRowStyle, clickableRowStyle, fixedCellBgWithRowVar, filterCellBorderShadow, emptyContainerStyle, emptyBodyStyle, rowEditingRowStyle, rowEditBorderOverlayStyle, rowEditActionsWrapperStyle, rowEditActionsInnerStyle, fixedCellRowEditBgStyle, filterCellBottomOnlyShadow } from "./table.styles.js";

const SELECTION_COLUMN_NAME = '__rc_table_selection__';
const EMPTY_MERGE_CELLS: MergeCell[] = [];

// Table owns the action-bar placement; Button owns appearance, state layers,
// typography, shape, focus and touch targets in each design system.
const rowEditActionSizes = { small: 'xs', medium: 's', large: 'm' } as const;


function Table<T extends Row>(props: TableProps<T>): ReactNode {
    const size = useComponentSize(props.size);
    const config = useConfig();
    const direction = props.dir === 'ltr' || props.dir === 'rtl' ? props.dir : config.direction;
    const { messages, locale } = useLocale();
    const density = props.density ?? config.density;
    const metrics = componentDensityMetrics[density];
    const coarsePointer = useMediaQuery('(pointer: coarse)');
    const defaultRowHeight = coarsePointer ? Math.max(metrics.row, 48) : metrics.row;
    const {
        size: _size,
        density: _density,
        width,
        height,
        rows,
        columns,
        mergeCells = EMPTY_MERGE_CELLS,
        getRowHeight,
        headerRowHeight = metrics.header,
        filterBar = false,
        filterRowHeight: suppliedFilterRowHeight,
        filterCellClassName,
        filters,
        editType,
        selectCells,
        onSelectCellsChange,
        renderDefaultFilterEditor,
        onFilterChange,
        groupBy: groupByProp,
        groupRowHeight = defaultRowHeight,
        expandedGroupIds,
        defaultExpandedGroupIds,
        defaultExpandAll = true,
        onExpandedGroupIdsChange,
        renderGroupCell,
        cellEditRecords,
        onCellEditRecordsChange,
        onUndo,
        editingRowId,
        defaultEditingRowId,
        onEditingRowIdChange,
        onRowCommit,
        onRowCancel,
        highlightKeyword,
        activeMatchIndex,
        onMatchCountChange,
        resizable = false,
        onColumnResize,
        draggableColumns = false,
        onColumnOrderChange,
        onGroupColumnOrderChange,
        onCopy,
        treeData,
        getChildRows,
        treeColumn: treeColumnProp,
        expandedRowIds,
        defaultExpandedRowIds,
        defaultTreeExpandAll,
        onExpandedRowIdsChange,
        sortColumns: sortColumnsProp,
        sortMode,
        defaultSortColumns,
        onSortColumnsChange,
        rowSelection,
        showSummary = false,
        summaryRowHeight = defaultRowHeight,
        expandedRowRender,
        isRowExpandable,
        expandedRowKeys,
        defaultExpandedRowKeys,
        onExpandedRowKeysChange,
        expandedRowHeight = 200,
        getExpandedRowHeight,
        expandColumnWidth,
        expandColumnFixed,
        empty,
        showRowNumber = false,
        rowNumberColumnWidth,
        rowNumberColumnFixed,
        onRowClick,
        onRowDoubleClick,
        ...restProps
    } = props;

    const { rootRef: interactionRootRef, activateInteraction, isInteractionActive } = useTableInteractionScope();
    const { filterSizeRef, filterRowHeight } = useFilterRowHeight(metrics.header, suppliedFilterRowHeight);

    // ====== 行选中 ======
    const { selectedRowIds, isAllSelected, isIndeterminate, toggleRow, selectAllRows, clearAllRows } = useRowSelection<T>({
        dataRows: rows,
        rowSelection,
    });

    // ref 持有最新选中状态，供选择列的 render 函数读取（避免 useMemo 闭包陈旧）
    const selectionStateRef = useRef({ selectedRowIds, toggleRow });
    selectionStateRef.current = { selectedRowIds, toggleRow };
    const selectionConfigRef = useRef(rowSelection);
    selectionConfigRef.current = rowSelection;
    const hasRowSelection = rowSelection != null;
    const selectionType = rowSelection?.type;
    const selectionFixed = rowSelection?.fixed;
    const selectionColumnWidth = rowSelection?.columnWidth;
    const selectionGetDisabled = rowSelection?.getDisabled;
    const selectionRenderVersion = useMemo(() => ({
        selectedRowIds,
        type: selectionType,
        getDisabled: selectionGetDisabled,
    }), [selectedRowIds, selectionType, selectionGetDisabled]);

    const selectionColumn = useMemo<ColumnType<T> | null>(() => {
        if (!hasRowSelection) return null;
        const isFixed = selectionFixed !== false;
        return {
            name: SELECTION_COLUMN_NAME,
            title: '',
            fixed: isFixed ? 'left' : undefined,
            width: selectionColumnWidth ?? 40,
            selectable: false,
            sortable: false,
            resizable: false,
            filterable: false,
            align: 'center',
            render: ({ row }) => {
                const { selectedRowIds: ids, toggleRow: toggle } = selectionStateRef.current;
                const currentSelection = selectionConfigRef.current;
                const isSelected = ids.has(row.id);
                const disabled = currentSelection?.getDisabled?.(row) ?? false;
                if (currentSelection?.type === 'checkbox') {
                    return (
                        <div data-table-selection-cell="" className={selectionCellStyle} onClick={event => {
                            if (event.target !== event.currentTarget) return;
                            event.stopPropagation();
                            if (!disabled) toggle(row.id, event);
                        }}>
                            <Checkbox
                                checked={isSelected}
                                disabled={disabled}
                                aria-label={messages.table.selectRow}
                                size={size}
                                onCheckedChange={(_, details) => toggle(row.id, details.event)}
                            />
                        </div>
                    );
                }
                return (
                    <div data-table-selection-cell="" className={selectionCellStyle} onClick={event => {
                        if (event.target !== event.currentTarget) return;
                        event.stopPropagation();
                        if (!disabled) toggle(row.id, event);
                    }}>
                        <Radio
                            checked={isSelected}
                            disabled={disabled}
                            aria-label={messages.table.selectRow}
                            size={size}
                            onCheckedChange={(_, details) => toggle(row.id, details.event)}
                        />
                    </div>
                );
            },
        };
    }, [
        selectionFixed,
        selectionColumnWidth,
        hasRowSelection,
        locale,
        size,
    ]);

    // ====== 行序号列 ======
    const { numberColumn, syncRowNumbers } = useRowNumber<T>({ showRowNumber, rowNumberColumnFixed, rowNumberColumnWidth });

    // 行展开状态 ref：供展开图标列 render 读取最新展开集合 / 切换函数（避免闭包陈旧，仿 selectionStateRef）
    const expansionStateRef = useRef<{ expandedKeySet: Set<Key>; toggleExpandRow: (id: Key) => void; isRowExpandable?: (row: T) => boolean }>({ expandedKeySet: new Set(), toggleExpandRow: () => { }, isRowExpandable });

    const expandColumn = useMemo<ColumnType<T> | null>(() => {
        if (!expandedRowRender) return null;
        const isFixed = expandColumnFixed !== false;
        return {
            name: EXPAND_COLUMN_NAME,
            title: '',
            fixed: isFixed ? 'left' : undefined,
            width: Math.max(expandColumnWidth ?? 40, coarsePointer ? 48 : 32),
            selectable: false,
            sortable: false,
            resizable: false,
            filterable: false,
            align: 'center',
            render: ({ row }) => {
                const { expandedKeySet, toggleExpandRow, isRowExpandable: canExpand } = expansionStateRef.current;
                const expandable = canExpand ? canExpand(row): true;
                if (!expandable) return null;
                const expanded = expandedKeySet.has(row.id);
                return (
                    <div className={selectionCellStyle}>
                        <TableIconButton
                            type="button"
                            aria-expanded={expanded}
                            aria-label={expanded ? messages.table.collapseRow : messages.table.expandRow}
                            onClick={(e) => { e.stopPropagation(); toggleExpandRow(row.id); }}
                            onMouseDown={(e) => e.stopPropagation()}
                            icon={<svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={expandChevronStyle}
                                style={{ transform: expanded ? 'rotate(0deg)' : direction === 'rtl' ? 'rotate(90deg)' : 'rotate(-90deg)' }}
                            >
                                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>}
                        />
                    </div>
                );
            },
        };
    }, [expandedRowRender, expandColumnFixed, expandColumnWidth, coarsePointer, locale, direction]);

    const effectiveColumns = useMemo(() => {
        const cols: ColumnType<T>[] = [];
        // 列顺序：序号 → 展开 → 选中 → 数据
        if (numberColumn) cols.push(numberColumn);
        if (expandColumn) cols.push(expandColumn);
        if (selectionColumn) cols.push(selectionColumn);
        cols.push(...columns);
        return cols;
    }, [numberColumn, selectionColumn, expandColumn, columns]);

    // ====== 列排序 ======
    const { sortedRows, handleSort, getSortState, isSortable } = useColumnSort<T>({
        rows, columns: effectiveColumns, sortColumns: sortColumnsProp, defaultSortColumns, onSortColumnsChange, sortMode
    });

    // ====== 树形数据 ======
    const { flatRows, treeRowMetaMap, isTree, toggleTreeRow } = useTreeData<T>({
        rows: sortedRows, treeData, getChildRows, expandedRowIds, defaultExpandedRowIds,
        defaultTreeExpandAll, onExpandedRowIdsChange
    });

    // ====== 行分组（树形模式下跳过分组） ======
    const { groupBy, displayRows: groupedDisplayRows, isGrouped, toggleGroup } = useRowGroup<T>({
        rows: flatRows, groupBy: isTree ? [] : groupByProp, expandedGroupIds,
        defaultExpandedGroupIds, defaultExpandAll, onExpandedGroupIdsChange
    });

    // ====== 行展开（详情面板）：在分组后向 displayRows 插入展开内容行 ======
    const { displayRows: targetRows, expandedKeySet, isExpansion, toggleExpandRow } = useRowExpansion<T>({
        displayRows: groupedDisplayRows, expandedRowRender, isRowExpandable,
        expandedRowKeys, defaultExpandedRowKeys, onExpandedRowKeysChange,
        expandedRowHeight, getExpandedRowHeight
    });
    expansionStateRef.current = { expandedKeySet, toggleExpandRow, isRowExpandable };
    const motionRows = useAnimatedRows(targetRows, {
        keyFor: row => row.id,
        sizeFor: (row, index) => isGroupRow(row) ? row.height ?? groupRowHeight
            : isExpandedContentRow(row) ? row.height ?? defaultRowHeight : getRowHeight?.(row as T, index) ?? row.height ?? defaultRowHeight,
        trigger: JSON.stringify([...expandedKeySet].map(key => [typeof key, String(key)])),
        rootRef: interactionRootRef,
        motionProperty: '--table-row-motion',
        canAnimate: isExpandedContentRow,
        enabled: isExpansion,
    });
    // Exception: downstream layout/selection effects depend on stable row identity.
    const displayRows = useMemo(() => motionRows.map(row => isExpandedContentRow(row.item) ? { ...row.item, height: row.size } : row.item), [motionRows]);

    // displayRows 确定后同步序号映射（直接写 ref，不触发 re-render）
    syncRowNumbers(displayRows);

    // ====== 列宽与布局（bottomColumnsRef 在 table 层创建并共享给多个 hook） ======
    const bottomColumnsRef = useRef<ColumnType<T>[]>([]);

    const { resizedWidths, handleResizeMouseDown, handleResizeKeyDown, gridTemplateColumnsRef } = useColumnResize({
        bottomColumnsRef, onColumnResize, rootRef: interactionRootRef
    });

    const {
        sColumns,
        bottomColumns, maxDepth, headerCells, headerCellOriginByRow, topLevelHeaderCellOriginByColumn, headerGridTemplateRows,
        gridTemplateColumns, fixedLeftColumns, fixedRightColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, actualHeight,
        stickyLeftOffsets, stickyRightOffsets, columnByName,
        gridTemplateRows, skipCellSet, mergeCellMap, mergeCellsByCoveredRow, mergeCellsByCoveredColumn, getCellKey
    } = useColumnLayout<T>({
        columns: effectiveColumns, width, resizedWidths, isGrouped, isTree, isExpansion, groupBy, headerRowHeight,
        displayRows, getRowHeight, groupRowHeight, defaultRowHeight, mergeCells, bottomColumnsRef
    });

    // 供 handleResizeMouseDown 读取当前列宽
    gridTemplateColumnsRef.current = gridTemplateColumns;

    // ====== 列拖拽排序 ======
    const {
        draggingColumnName, draggingGroupName, dropIndicator,
        handleDragStart, handleDragOver, handleDrop, handleDragEnd, handleDragLeave
    } = useColumnDrag({ sColumns, onColumnOrderChange, onGroupColumnOrderChange });

    // ====== 树形列解析 ======
    const resolvedTreeColumn = useMemo(() => {
        if (!isTree) return undefined;
        return treeColumnProp ?? bottomColumns.find(col => col.fixed !== 'right' && col.name !== SELECTION_COLUMN_NAME && col.name !== ROW_NUMBER_COLUMN_NAME)?.name;
    }, [isTree, treeColumnProp, bottomColumns]);

    const treeToggleHandlers = useMemo(() => new Map<Key, () => void>(), [toggleTreeRow]);

    // 获取指定行/列应注入的树形 props（非树形列或非数据行返回空对象）
    const getTreeCellProps = (row: T | InternalGroupRow<T> | InternalExpandedRow<T>, columnIndex: number) => {
        if (!isTree || isExpandedContentRow(row) || isGroupRow(row) || !resolvedTreeColumn) return {};
        const column = bottomColumns[columnIndex];
        if (!column || column.name !== resolvedTreeColumn) return {};
        const meta = treeRowMetaMap.get((row as T).id);
        if (!meta) return {};
        let onTreeToggle = treeToggleHandlers.get((row as T).id);
        if (!onTreeToggle) {
            onTreeToggle = () => toggleTreeRow((row as T).id);
            treeToggleHandlers.set((row as T).id, onTreeToggle);
        }
        return {
            treeNode: meta,
            onTreeToggle
        };
    };

    // ====== 行编辑 ======
    const { isRowEditMode, currentEditingRowId, editorValues, startRowEdit, setColumnValue, commitRowEdit, cancelRowEdit } = useRowEdit({
        editType, editingRowId, defaultEditingRowId, onEditingRowIdChange, onRowCommit, onRowCancel,
        isInteractionActive, rootRef: interactionRootRef
    });

    const rowEditFocusRef = useRowEditFocus(currentEditingRowId, interactionRootRef, isInteractionActive);

    // ====== 单元格编辑 ======
    const { undoDataVersion, editedCellKeys, handleCellCommit, handleUndo } = useCellEdit<T>({
        displayRows, cellEditRecords, onCellEditRecordsChange, onUndo
    });

    // ====== cell-edit 键盘导航 ======
    const { editingCellPos, startCellEdit, exitCellEdit, navigateCellEdit } = useCellEditNav<T>({
        editType, displayRows, bottomColumnsRef, skipCellSet, getCellKey,
        selectionColumnName: SELECTION_COLUMN_NAME,
    });

    // ====== 单元格选区（同时处理 Ctrl+Z/C/Esc 键盘事件） ======
    const {
        handleCellMouseDown, handleCellMouseEnter, getCellSelectionState, selectSingleCell,
        anchorCell, rowIdToIndex
    } = useCellSelection<T>({
        displayRows, bottomColumnsRef, selectCells, onSelectCellsChange,
        onCopy, onCtrlZ: handleUndo, isInteractionActive, rootRef: interactionRootRef
    });

    // ====== 行事件（点击 / 双击） ======
    // 依赖选区的锚点：键盘触发行点击时，以"最后点选的单元格所在行"为目标行。
    const { hasRowEvents, getRowEventProps } = useRowEvents<T>({
        onRowClick,
        onRowDoubleClick,
        isRowEditMode,
        startRowEdit,
        currentEditingRowId,
        displayRows,
        anchorCell,
        rowIdToIndex,
        isInteractionActive,
        rootRef: interactionRootRef,
    });

    const handleCellEditNavigate = useCallback((rowIndex: number, columnIndex: number, direction: CellNavDirection) => {
        if (direction === 'escape') {
            exitCellEdit();
        } else {
            const next = navigateCellEdit(rowIndex, columnIndex, direction);
            if (next) selectSingleCell(next.rowIndex, next.columnIndex);
        }
    }, [exitCellEdit, navigateCellEdit, selectSingleCell]);

    const getCellNavProps = (rowIndex: number, columnIndex: number) => {
        if (editType !== 'cell') return {};
        const row = displayRows[rowIndex];
        const column = bottomColumns[columnIndex];
        return {
            isActivatedByNav: editingCellPos !== null && row != null && column != null
                && !isGroupRow(row) && !isExpandedContentRow(row)
                && editingCellPos.rowId === row.id
                && editingCellPos.columnName === column.name,
            onCellEditStart: startCellEdit,
            onCellEditNavigate: handleCellEditNavigate,
        };
    };

    // ====== 过滤栏 ======
    const { filterKeywordMap, isFilterEnabled, handleFilterValueChange } = useTableFilter<T>({
        filterBar, filters, bottomColumns, onFilterChange
    });

    // ====== 关键字高亮 / 跳转 ======
    const reservedTopPx = maxDepth * headerRowHeight + (isFilterEnabled ? filterRowHeight : 0);
    const fixedLeftWidth = fixedLeftColumnsIdx.reduce((acc, idx) => acc + gridTemplateColumns[idx], 0);

    const { virtualRef, activeMatchMeta } = useKeywordMatch<T>({
        highlightKeyword, activeMatchIndex, displayRows, bottomColumns,
        skipCellSet, getCellKey, reservedTopPx, fixedLeftWidth, onMatchCountChange
    });

    // RcVirtual 的内部滚动 state 会反复调用下方 renderRows，但不会重新执行 Table。
    // 该对象因此在一次 Table render 生命周期内稳定，可作为行级 memo 的版本令牌。
    const virtualRenderVersion = {};

    // ====== 渲染：分组 banner 行 ======
    const renderGroupBannerRow = (rowIndex: number, groupRow: InternalGroupRow<T>, columnRange: [number, number]): ReactNode => {
        const { meta } = groupRow.dataRef;
        const handleToggle = () => { toggleGroup(meta.groupId); };
        const valueText = meta.value == null || meta.value === "" ? messages.table.emptyValue : String(meta.value);

        const renderBannerContent = (currentColumn: ColumnType<T>, columnIndex: number, isGroupColumn: boolean) => {
            const defaultBanner = (
                <div
                    className={css`
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: ${token.group.gap};
                        width: 100%;
                        height: 100%;
                        padding-inline: ${token.group['padding-inline']};
                        box-sizing: border-box;
                        cursor: pointer;
                        font-weight: ${token.group['font-weight']};
                        color: ${token.group.color};
                        &:focus-visible {
                            outline: ${token.selection['border-width']} solid ${token.selection['border-color']};
                            outline-offset: ${token.selection['outline-offset']};
                        }
                    `}
                    role="button"
                    tabIndex={0}
                    aria-expanded={meta.expanded}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggle(); }
                    }}
                >
                    <span
                        className={css`
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: inline-flex;
                            align-items: center;
                            gap: ${token.group.text.gap};
                        `}
                    >
                        <span>{valueText}</span>
                        <span
                            className={css`
                                color: ${token.group.count.color};
                                font-size: ${token.group.count["font-size"]};
                            `}
                        >({meta.count})</span>
                    </span>
                    <span
                        aria-hidden
                        className={css`
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: ${token.group.chevron.width};
                            height: ${token.group.chevron.width};
                            color: ${token.group.chevron.color};
                            transition: ${token.group.chevron.transition};
                        `}
                        style={{ transform: meta.expanded ? "rotate(0deg)" : direction === 'rtl' ? "rotate(90deg)" : "rotate(-90deg)" }}
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                </div>
            );

            if (renderGroupCell) {
                return renderGroupCell({
                    group: meta,
                    column: columnByName.get(meta.columnName),
                    currentColumn,
                    columnIndex,
                    isGroupColumn,
                    onToggle: handleToggle,
                    indent: meta.level * 16,
                    originalElement: defaultBanner
                });
            }
            return isGroupColumn ? defaultBanner : null;
        };

        const buildGroupCell = (columnIndex: number, opts?: { fixed?: "left" | "right" }): ReactNode => {
            const column = bottomColumns[columnIndex];
            if (!column) return null;
            const isMatchColumn = column.name === meta.columnName;
            const positionStyle: CSSProperties = {
                width: gridTemplateColumns[columnIndex],
                ...(opts?.fixed === "left" ? { left: stickyLeftOffsets[columnIndex] } : null),
                ...(opts?.fixed === "right" ? { right: stickyRightOffsets[columnIndex] } : null)
            };
            return (
                <div
                    key={`table-group-cell-${rowIndex}-${columnIndex}`}
                    dir={direction}
                    className={cx.call(undefined, css`
                        display: inline-flex;
                        align-items: center;
                        box-sizing: border-box;
                        vertical-align: top;
                        height: 100%;
                        box-shadow: inset 0 -1px 0 ${token.root["border-color"]};
                        background-color: ${token.group['background-color']};
                    `, opts?.fixed && css`
                        position: sticky;
                        z-index: 9;
                    `)}
                    style={positionStyle}
                    role="gridcell"
                    aria-colindex={columnIndex + 1}
                >
                    {renderBannerContent(column, columnIndex, isMatchColumn)}
                </div>
            );
        };

        const mainCells: ReactNode[] = [];
        for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
            const column = bottomColumns[columnIndex];
            if (!column || column.fixed === "left" || column.fixed === "right") continue;
            mainCells.push(buildGroupCell(columnIndex));
        }

        return (
            <BodyRow
                key={`table-group-row-${meta.groupId}`}
                style={{ height: gridTemplateRows[rowIndex], width: actualHeight }}
                role="row"
                renderVersion={virtualRenderVersion}
                virtualWindowKey={`${columnRange[0]}:${columnRange[1]}`}
            >
                {fixedLeftColumnsIdx.map((columnIndex) => buildGroupCell(columnIndex, { fixed: "left" }))}
                {paddingLeft}
                {mainCells}
                {paddingRight}
                {fixedRightColumnsIdx.map((columnIndex) => buildGroupCell(columnIndex, { fixed: "right" }))}
            </BodyRow>
        );
    };

    // ====== 渲染：body ======
    const generateBodyElement = ({ rowRange, columnRange }: { rowRange: [number, number]; columnRange: [number, number] }) => {
        const mergeIntersectsRenderedColumns = (mergeCell: MergeCell) => {
            const mergeEnd = mergeCell.columnIndex + mergeCell.colSpan;
            if (mergeCell.columnIndex <= columnRange[1] && mergeEnd >= columnRange[0]) return true;
            return fixedLeftColumnsIdx.some(index => index >= mergeCell.columnIndex && index <= mergeEnd)
                || fixedRightColumnsIdx.some(index => index >= mergeCell.columnIndex && index <= mergeEnd);
        };

        const getBodyRenderStart = (startRowIndex: number) => {
            let renderStart = startRowIndex;
            const coveringMergeCells = mergeCellsByCoveredRow.get(startRowIndex) ?? [];
            coveringMergeCells.forEach((mergeCell) => {
                if (!mergeIntersectsRenderedColumns(mergeCell)) return;
                renderStart = Math.min(renderStart, mergeCell.rowIndex);
            });
            return renderStart;
        };

        const getBodyColumnRenderStart = (startColumnIndex: number) => {
            let renderStart = startColumnIndex;
            const coveringMergeCells = mergeCellsByCoveredColumn.get(startColumnIndex) ?? [];
            coveringMergeCells.forEach((mergeCell) => {
                const mergeEndRow = mergeCell.rowIndex + mergeCell.rowSpan;
                const intersectsRenderedRows = mergeCell.rowIndex <= rowRange[1] && mergeEndRow >= rowRange[0];
                if (!intersectsRenderedRows) return;
                if (bottomColumns[mergeCell.columnIndex]?.fixed) return;
                renderStart = Math.min(renderStart, mergeCell.columnIndex);
            });
            return renderStart;
        };

        const getBodyTopPaddingCompensation = (renderStart: number, startRowIndex: number) => {
            let offset = 0;
            for (let r = renderStart; r < startRowIndex; r += 1) offset += gridTemplateRows[r];
            return offset;
        };

        const renderStart = getBodyRenderStart(rowRange[0]);
        const columnRenderStart = getBodyColumnRenderStart(columnRange[0]);
        const topPaddingCompensation = getBodyTopPaddingCompensation(renderStart, rowRange[0]);
        let leftPaddingCompensation = 0;
        for (let c = columnRenderStart; c < columnRange[0]; c += 1) {
            if (bottomColumns[c]?.fixed) continue;
            leftPaddingCompensation += gridTemplateColumns[c] ?? 0;
        }
        const bodyRows: ReactNode[] = [paddingTop(topPaddingCompensation)];

        for (let rowIndex = renderStart; rowIndex <= rowRange[1]; rowIndex += 1) {
            const currentRow = displayRows[rowIndex];
            if (!currentRow) continue;
            if (isGroupRow(currentRow)) {
                bodyRows.push(renderGroupBannerRow(rowIndex, currentRow, columnRange));
                continue;
            }
            if (isExpandedContentRow(currentRow)) {
                // 展开内容行：单个贴左固定容器，宽度等于视口宽，横向滚动时始终完整可见
                bodyRows.push(
                    <BodyRow
                        key={`table-expanded-row-${String(currentRow.id)}`}
                        inert={motionRows[rowIndex]?.exiting}
                        aria-hidden={motionRows[rowIndex]?.exiting || undefined}
                        className={css`overflow: clip;`}
                        style={{ height: gridTemplateRows[rowIndex], width: actualHeight }}
                        role="row"
                        renderVersion={virtualRenderVersion}
                        virtualWindowKey="expanded"
                    >
                        <ExpandedRowContent width={actualHeight} colSpan={bottomColumns.length} direction={direction}>
                            {expandedRowRender?.(currentRow.dataRef.sourceRow)}
                        </ExpandedRowContent>
                    </BodyRow>
                );
                continue;
            }

            const isEditingThisRow = isRowEditMode && currentEditingRowId === (currentRow as T).id;
            const isRowSelected = rowSelection != null && selectedRowIds.has((currentRow as T).id);

            const getRowEditCellProps = (col: ColumnType<T>) => isEditingThisRow ? {
                isRowEditing: true,
                rowEditorValue: editorValues[col.name] ?? null,
                onRowEditorValueChange: (value: unknown) => setColumnValue(col.name, value),
                onRowCancel: cancelRowEdit,
            } : {};

            const tableCells: ReactNode[] = [];
            for (let columnIndex = columnRenderStart; columnIndex <= columnRange[1]; columnIndex += 1) {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const column = bottomColumns[columnIndex];
                if (column.fixed === "left" || column.fixed === "right") continue;
                const mergeCell = mergeCellMap.get(currentCellKey);
                tableCells.push(
                    <TableBodyCell
                        key={makeColumnReactKey(column.name)}
                        dir={direction}
                        data-col-index={columnIndex}
                        row={currentRow as T}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        column={column}
                        isSkipCell={isSkipCell}
                        mergeCell={mergeCell}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={gridTemplateRows}
                        editType={editType}
                        isLastColumn={columnIndex === bottomColumns.length - 1 || (fixedRightColumnsIdx.length > 0 && columnIndex === fixedRightColumnsIdx[0] - 1)}
                        isEdited={editedCellKeys.has(makeCellIdentityKey((currentRow as T).id, column.name))}
                        onCellCommit={handleCellCommit}
                        selection={isEditingThisRow ? undefined : getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                        dataVersion={undoDataVersion}
                        renderVersion={column.name === SELECTION_COLUMN_NAME ? selectionRenderVersion : undefined}
                        highlightKeyword={highlightKeyword}
                        activeOccurrenceInCell={activeMatchMeta?.rowIndex === rowIndex && activeMatchMeta?.columnIndex === columnIndex ? activeMatchMeta.occurrenceInCell : undefined}
                        onCellMouseDown={isEditingThisRow ? undefined : handleCellMouseDown}
                        onCellMouseEnter={isEditingThisRow ? undefined : handleCellMouseEnter}
                        style={{ width: gridTemplateColumns[columnIndex] }}
                        {...getTreeCellProps(currentRow, columnIndex)}
                        {...getRowEditCellProps(column)}
                        {...getCellNavProps(rowIndex, columnIndex)}
                    />
                );
            }

            const makeFixedBodyCell = (column: ColumnType<T>, columnIndex: number, fixed: "left" | "right") => {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const mergeCell = mergeCellMap.get(currentCellKey);
                return (
                    <TableBodyCell
                        className={cx.call(undefined, !isSkipCell && (isEditingThisRow ? fixedCellRowEditBgStyle : fixedCellBgWithRowVar))}
                        dir={direction}
                        key={makeColumnReactKey(column.name)}
                        row={currentRow as T}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        column={column}
                        isSkipCell={isSkipCell}
                        mergeCell={mergeCell}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={gridTemplateRows}
                        fixed={fixed}
                        editType={editType}
                        isLastColumn={columnIndex === bottomColumns.length - 1}
                        isEdited={editedCellKeys.has(makeCellIdentityKey((currentRow as T).id, column.name))}
                        onCellCommit={handleCellCommit}
                        selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                        renderVersion={column.name === SELECTION_COLUMN_NAME ? selectionRenderVersion : undefined}
                        highlightKeyword={highlightKeyword}
                        activeOccurrenceInCell={activeMatchMeta?.rowIndex === rowIndex && activeMatchMeta?.columnIndex === columnIndex ? activeMatchMeta.occurrenceInCell : undefined}
                        onCellMouseDown={isEditingThisRow ? undefined : handleCellMouseDown}
                        onCellMouseEnter={isEditingThisRow ? undefined : handleCellMouseEnter}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                            [fixed === "left" ? "left" : "right"]: fixed === "left"
                                ? stickyLeftOffsets[columnIndex]
                                : stickyRightOffsets[columnIndex]
                        }}
                        {...getTreeCellProps(currentRow, columnIndex)}
                        {...getRowEditCellProps(column)}
                        {...getCellNavProps(rowIndex, columnIndex)}
                    />
                );
            };

            bodyRows.push(
                <BodyRow
                    key={makeRowReactKey((currentRow as T).id)}
                    // 数据行在 DOM 中的定位锚点（供测试与使用方的自动化脚本使用）
                    data-row-index={rowIndex}
                    data-table-row-editing={isEditingThisRow || undefined}
                    role="row"
                    aria-selected={rowSelection ? isRowSelected : undefined}
                    className={cx.call(undefined, isEditingThisRow ? rowEditingRowStyle : undefined,
                        // 可点击示能只给真正可点的数据行：编辑态的行此时不响应行点击
                        hasRowEvents && !isEditingThisRow ? clickableRowStyle : undefined,
                        isRowSelected ? selectedRowStyle : undefined,
                    )}
                    style={{
                        height: gridTemplateRows[rowIndex],
                        width: actualHeight,
                        ...(isRowSelected ? { [ROW_BG_VAR]: token['row-selection']['background-color-selected'] } : null)
                    } as CSSProperties & Record<`--${string}`, string | number>}
                    {...getRowEventProps(currentRow as T, rowIndex, isEditingThisRow)}
                    renderVersion={virtualRenderVersion}
                    virtualWindowKey={`${columnRenderStart}:${columnRange[0]}:${columnRange[1]}`}
                >
                    {isEditingThisRow && <div className={rowEditBorderOverlayStyle} aria-hidden />}
                    {fixedLeftColumns.map((column, index) => makeFixedBodyCell(column, fixedLeftColumnsIdx[index], "left"))}
                    {paddingLeftWithCompensation(leftPaddingCompensation)}
                    {tableCells}
                    {paddingRight}
                    {fixedRightColumns.map((column, index) => makeFixedBodyCell(column, fixedRightColumnsIdx[index], "right"))}
                    {isEditingThisRow && (
                        <div
                            dir={direction}
                            className={rowEditActionsWrapperStyle}
                            // Keep controls after the editors in DOM/Tab order.
                            // actualHeight is the resolved sum of column widths
                            // (the legacy name for row inline width, not viewport
                            // width or block height). The zero-width RTL anchor
                            // starts at physical left without altering cell widths;
                            // its inline-end sticky constraint then tracks that edge.
                            style={direction === 'rtl' ? { marginLeft: -actualHeight } : undefined}
                        >
                            <div
                                className={rowEditActionsInnerStyle}
                                data-table-row-edit-actions=""
                                onMouseDown={e => e.stopPropagation()}
                                onKeyDown={event => {
                                    // Native button activation still runs; its
                                    // Enter/Space must not trigger grid shortcuts.
                                    if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
                                }}
                            >
                                <Button
                                    type="button"
                                    appearance="primary"
                                    size={rowEditActionSizes[size]}
                                    onClick={commitRowEdit}
                                >
                                    {messages.common.confirm}
                                </Button>
                                <Button
                                    type="button"
                                    appearance="outlined"
                                    size={rowEditActionSizes[size]}
                                    onClick={cancelRowEdit}
                                >
                                    {messages.common.cancel}
                                </Button>
                            </div>
                        </div>
                    )}
                </BodyRow>
            );
        }

        bodyRows.push(paddingBottom);
        return bodyRows;
    };

    // ====== 底部汇总 / 合计行 ======
    const { generateSummaryElement } = useSummary<T>({
        showSummary, summaryRowHeight, rows, bottomColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, gridTemplateColumns,
        stickyLeftOffsets, stickyRightOffsets, actualHeight,
        paddingLeft, paddingRight, selectionColumnName: SELECTION_COLUMN_NAME,
        renderVersion: virtualRenderVersion, direction
    });

    // ====== 渲染：过滤栏单元格 ======
    const renderFilterCell = (columnIndex: number, fixed?: "left" | "right") => {
        const column = bottomColumns[columnIndex];
        const canFilter = column?.filterable !== false;
        const keyword = column ? (filterKeywordMap[column.name] ?? ""): "";
        return (
            <div
                key={`table-filter-cell-${columnIndex}`}
                dir={direction}
                className={cx.call(undefined, css`
                    display: inline-flex;
                    align-items: center;
                    box-sizing: border-box;
                    vertical-align: top;
                    height: 100%;
                    padding: ${token['filter-cell'].padding};
                    background-color: ${token.header['background-color']};
                `, fixed && css`
                    position: sticky;
                    z-index: 11;
                `, columnIndex === bottomColumns.length - 1 ? filterCellBottomOnlyShadow : filterCellBorderShadow,
                filterCellClassName, column?.filterCellClassName)}
                style={{
                    width: gridTemplateColumns[columnIndex],
                    left: fixed === "left" ? stickyLeftOffsets[columnIndex] : undefined,
                    right: fixed === "right" ? stickyRightOffsets[columnIndex] : undefined
                }}
                role="gridcell"
                aria-colindex={columnIndex + 1}
            >
                {canFilter ? (
                    column?.filterEditor
                        ? column.filterEditor({
                            column, columnIndex, value: keyword,
                            onValueChange: (nextValue) => handleFilterValueChange(columnIndex, nextValue)
                        })
                        : renderDefaultFilterEditor
                            ? renderDefaultFilterEditor({
                                column, columnIndex, value: keyword,
                                onValueChange: (nextValue) => handleFilterValueChange(columnIndex, nextValue)
                            })
                            : null
                ): null}
            </div>
        );
    };

    // ====== 渲染：表头 ======
    const generateHeaderElement = ({ columnRange }: { columnRange: [number, number] }) => {
        const getMergeCell = (cell?: HeaderCellType<T> | null) => cell
            ? { rowIndex: cell.rowIndex, columnIndex: cell.columnIndex, rowSpan: cell.rowSpan, colSpan: cell.colSpan }
            : undefined;

        const getBottomBorderStyle = (rowIndex: number, maxRowIndex: number) =>
            rowIndex === maxRowIndex
                ? css`box-shadow: inset 0 -1px 0 ${token.root["border-color"]};`
                : "";

        const getHeaderRowRenderStart = (rowIndex: number, startColumnIndex: number) => {
            const originIndex = headerCellOriginByRow[rowIndex]?.[startColumnIndex] ?? -1;
            if (originIndex < 0 || originIndex >= startColumnIndex) return startColumnIndex;
            const originCell = headerCells[rowIndex]?.[originIndex] ?? null;
            return originCell?.fixed ? startColumnIndex : originIndex;
        };

        const getHeaderRowLeftPaddingCompensation = (renderStart: number, startColumnIndex: number) => {
            let offset = 0;
            for (let c = renderStart; c < startColumnIndex; c += 1) {
                const column = bottomColumns[c];
                if (column?.fixed === "left" || column?.fixed === "right") continue;
                offset += gridTemplateColumns[c];
            }
            return offset;
        };

        const nodeRows: ReactNode[] = [];

        for (let r = 0; r < maxDepth; r += 1) {
            const renderStart = getHeaderRowRenderStart(r, columnRange[0]);
            const leftPaddingCompensation = getHeaderRowLeftPaddingCompensation(renderStart, columnRange[0]);

            const makeHeaderCell = (columnIndex: number, extraClassName?: string, extraStyle?: CSSProperties) => {
                const cell = headerCells[r]?.[columnIndex] ?? null;
                const isSkipCell = cell === null;
                const isLeafColumn = !cell?.column?.children?.length;
                const colResizable = cell?.column?.resizable;
                const showResizeHandle = (resizable || colResizable === true) && colResizable !== false && !isSkipCell && isLeafColumn;

                const columnName = cell?.column?.name ?? '';

                // 顶层（r=0）父单元格
                // 分组的非第一个子列在 r=0 行是 skip cell（null），向左追溯找到父分组 cell
                const topLevelOrigin = topLevelHeaderCellOriginByColumn[columnIndex] ?? -1;
                const topLevelCell = topLevelOrigin >= 0
                    ? headerCells[0]?.[topLevelOrigin] ?? null
                    : null;
                const topLevelColumnName = topLevelCell?.column?.name ?? '';
                const topLevelFixed = topLevelCell?.fixed;

                // 当前单元格的拖拽 scope：r=0 为顶层（null），r>0 为其父分组名
                const currentScope = r === 0 ? null : topLevelColumnName;

                // 拖拽源：
                //   r=0 非固定非 skip → 顶层列/分组可拖
                //   r=1 非固定非 skip 且父分组有子列 → 组内子列可拖（仅在同一分组内重排）
                const isTopLevelDraggable = draggableColumns && r === 0 && !isSkipCell && !topLevelFixed;
                const isChildDraggable = draggableColumns && r === 1 && !isSkipCell && !topLevelFixed
                    && !!(topLevelCell?.column?.children?.length);

                // Drop 目标：所有行的非固定、非跳过单元格（scope 匹配由 handleDragOver 内部校验）
                const isDropTarget = draggableColumns && !isSkipCell && !topLevelFixed;

                // 当前是否正在被拖拽（顶层或子列）
                const isDragging = draggingColumnName === columnName && draggingGroupName === currentScope;

                // 顶层拖拽时 r>0 的单元格作为传播点：使用顶层列名和 null scope
                // 子列拖拽时 r>0 的单元格作为真实 drop 目标：使用自身列名和父分组 scope
                const isDragTopLevel = draggingGroupName === null;
                const effectiveColumnName = isDragTopLevel && r > 0 ? topLevelColumnName : columnName;
                const effectiveScope = isDragTopLevel && r > 0 ? null : currentScope;
                const isSubCellPropagation = isDragTopLevel && r > 0;

                // Drop 指示器显示条件：
                //   顶层拖拽时 → 仅在 r=0 的顶层列头上显示（代表整个分组/列的边界）
                //   子列拖拽时 → 仅在 r>0 的同一父分组内的子列上显示
                const dropIndicatorSide = (() => {
                    if (!isDropTarget || !dropIndicator) return null;
                    if (draggingGroupName === null) {
                        // 顶层拖拽：r=0 且列名匹配
                        return r === 0 && dropIndicator.columnName === columnName ? dropIndicator.side : null;
                    }
                    // 子列拖拽：r>0 且在相同父分组内且列名匹配
                    return r > 0 && draggingGroupName === topLevelColumnName && dropIndicator.columnName === columnName
                        ? dropIndicator.side
                        : null;
                })();

                const onDragStart = isTopLevelDraggable
                    ? (e: Parameters<typeof handleDragStart>[2]) => handleDragStart(columnName, null, e)
                    : isChildDraggable
                        ? (e: Parameters<typeof handleDragStart>[2]) => handleDragStart(columnName, topLevelColumnName, e)
                        : undefined;

                const isSelectionCol = cell?.column?.name === SELECTION_COLUMN_NAME;
                const selectionHeaderContent = (() => {
                    if (!isSelectionCol || isSkipCell || rowSelection?.type !== 'checkbox') return undefined;
                    return (
                        <div className={selectionCellStyle}>
                            <Checkbox
                                checked={isAllSelected}
                                indeterminate={isIndeterminate}
                                aria-label={isAllSelected ? messages.table.deselectAll : messages.table.selectAll}
                                size={size}
                                onCheckedChange={(checked, details) => { if (checked) selectAllRows(details.event); else clearAllRows(details.event); }}
                            />
                        </div>
                    );
                })();

                return (
                    <TableHeaderCell
                        dir={direction}
                        key={`table-header-cell-${r}-${columnIndex}`}
                        className={extraClassName}
                        columnIndex={columnIndex}
                        rowIndex={r}
                        maxRowIndex={maxDepth - 1}
                        column={cell?.column}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={headerGridTemplateRows}
                        isSkipCell={isSkipCell}
                        isLastColumn={(() => { const lastIdx = columnIndex + (cell?.colSpan ?? 0); return lastIdx === bottomColumns.length - 1 || (fixedRightColumnsIdx.length > 0 && lastIdx === fixedRightColumnsIdx[0] - 1); })()}
                        mergeCell={getMergeCell(cell)}
                        fixed={extraStyle?.left != null ? "left" : extraStyle?.right != null ? "right" : undefined}
                        onResizeMouseDown={showResizeHandle ? (e) => handleResizeMouseDown(columnIndex, e): undefined}
                        onResizeKeyboard={showResizeHandle ? (delta) => handleResizeKeyDown(columnIndex, delta): undefined}
                        style={{ width: gridTemplateColumns[columnIndex], ...extraStyle }}
                        draggable={(isTopLevelDraggable || isChildDraggable) || undefined}
                        isDragging={isDragging}
                        dropIndicatorSide={dropIndicatorSide}
                        onDragStart={onDragStart}
                        onDragOver={isDropTarget ? (e) => handleDragOver(effectiveColumnName, effectiveScope, e, isSubCellPropagation): undefined}
                        onDrop={isDropTarget ? (e) => handleDrop(effectiveColumnName, effectiveScope, e): undefined}
                        onDragEnd={(isTopLevelDraggable || isChildDraggable) ? handleDragEnd : undefined}
                        onDragLeave={isDropTarget ? handleDragLeave : undefined}
                        isSortable={!isSelectionCol && isLeafColumn && !isSkipCell && isSortable(columnName)}
                        sortState={!isSelectionCol && isLeafColumn && !isSkipCell ? getSortState(columnName): null}
                        onSortClick={!isSelectionCol && isLeafColumn && !isSkipCell && isSortable(columnName) ? (isMulti) => handleSort(columnName, isMulti): undefined}
                        customContent={selectionHeaderContent}
                        renderVersion={virtualRenderVersion}
                    />
                );
            };

            const cells: ReactNode[] = [];
            for (let columnIndex = renderStart; columnIndex <= columnRange[1]; columnIndex += 1) {
                if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") continue;
                cells.push(makeHeaderCell(columnIndex));
            }

            nodeRows.push(
                <BodyRow
                    key={`table-header-row-${r}`}
                    role="row"
                    className={cx.call(undefined, css`
                        position: sticky;
                    `, getBottomBorderStyle(r, maxDepth - 1))}
                    style={{ height: headerRowHeight, width: actualHeight, top: r * headerRowHeight, zIndex: 10 + maxDepth - r }}
                    renderVersion={virtualRenderVersion}
                    virtualWindowKey={`${renderStart}:${columnRange[0]}:${columnRange[1]}`}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => makeHeaderCell(
                        columnIndex,
                        css`z-index: 11;`,
                        { left: stickyLeftOffsets[columnIndex] }
                    ))}
                    <div
                        key={`table-header-left-padding-${r}`}
                        className={css`display: inline-block; vertical-align: top; box-sizing: border-box; height: 100%;`}
                        style={{ width: `calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px) - ${leftPaddingCompensation}px)` }}
                    />
                    {cells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => makeHeaderCell(
                        columnIndex,
                        css`z-index: 11;`,
                        { right: stickyRightOffsets[columnIndex] }
                    ))}
                </BodyRow>
            );
        }

        if (isFilterEnabled) {
            const filterCells: ReactNode[] = [];
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") continue;
                filterCells.push(renderFilterCell(columnIndex));
            }
            nodeRows.push(
                <BodyRow
                    key="table-header-filter-row"
                    data-table-filter-row=""
                    role="row"
                    className={css`position: sticky; z-index: 10;`}
                    style={{ height: filterRowHeight, width: actualHeight, top: maxDepth * headerRowHeight }}
                    renderVersion={virtualRenderVersion}
                    virtualWindowKey={`${columnRange[0]}:${columnRange[1]}`}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => renderFilterCell(columnIndex, "left"))}
                    {paddingLeft}
                    {filterCells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => renderFilterCell(columnIndex, "right"))}
                </BodyRow>
            );
        }

        return nodeRows;
    };

    const emptyNode = rows.length === 0
        ? (empty === undefined ? <Empty /> : empty)
        : null;

    const tableElement = (
        <div
            {...restProps}
            dir={direction}
            ref={interactionRootRef}
            role={restProps.role ?? "grid"}
            tabIndex={restProps.tabIndex ?? 0}
            aria-rowcount={restProps["aria-rowcount"] ?? maxDepth + (isFilterEnabled ? 1 : 0) + targetRows.length + (showSummary ? 1 : 0)}
            aria-colcount={restProps["aria-colcount"] ?? bottomColumns.length}
            onMouseDownCapture={(event) => {
                activateInteraction();
                restProps.onMouseDownCapture?.(event);
            }}
            onPointerDownCapture={(event) => {
                activateInteraction();
                restProps.onPointerDownCapture?.(event);
            }}
            onClickCapture={(event) => {
                activateInteraction();
                restProps.onClickCapture?.(event);
            }}
            onDoubleClickCapture={(event) => {
                activateInteraction();
                restProps.onDoubleClickCapture?.(event);
            }}
            onFocusCapture={(event) => {
                activateInteraction();
                if (currentEditingRowId != null && event.target instanceof HTMLElement
                    && event.target.closest('[data-table-row-editing]')) rowEditFocusRef.current = event.target;
                restProps.onFocusCapture?.(event);
            }}
            className={cx.call(undefined, tableRootStyle, densityStyles[density], emptyNode !== null && emptyContainerStyle, restProps.className)}
            data-fixed-left={actualHeight > width && fixedLeftColumnsIdx.length > 0 || undefined}
            data-fixed-right={actualHeight > width && fixedRightColumnsIdx.length > 0 || undefined}
            style={{
                ...restProps.style,
                "--rc-table-fixed-left-width": `${fixedLeftColumnsIdx.reduce((acc, idx) => acc + gridTemplateColumns[idx], 0)}px`,
                "--rc-table-fixed-right-width": `${fixedRightColumnsIdx.reduce((acc, idx) => acc + gridTemplateColumns[idx], 0)}px`,
                "--crab-rc-virtual-left-padding-width-offset": `${fixedLeftColumnsIdx.reduce((acc, idx) => acc + gridTemplateColumns[idx], 0)}px`
            } as CSSProperties & Record<`--${string}`, string | number>}
        >
            <RcVirtual
                gridRef={virtualRef}
                // Table column indices, fixed left/right and scroll offsets are
                // physical data coordinates. Restore content direction at cell
                // boundaries instead of reversing this geometry in RTL.
                dir="ltr"
                className={css`
                    box-shadow: -1px 0 0 0 ${token.root["border-color"]},
                                0 1px 0 0 ${token.root["border-color"]},
                                1px 0 0 0 ${token.root["border-color"]};
                    box-sizing: border-box;
                    user-select: none;
                `}
                gridTemplateColumns={gridTemplateColumns}
                gridTemplateRows={gridTemplateRows}
                viewportWidth={width}
                viewportHeight={height}
                reservedTopHeight={reservedTopPx}
                reservedBottomHeight={showSummary ? summaryRowHeight : 0}
                overscanRowCount={4}
                overscanColumnCount={1}
                renderRows={(rowRange, columnRange) => {
                    return [
                        ...generateHeaderElement({ columnRange }),
                        ...generateBodyElement({ rowRange, columnRange }),
                        generateSummaryElement({ columnRange })
                    ];
                }}
            />
            <span ref={filterSizeRef} className={filterSizeProbeStyle} data-table-filter-size="" aria-hidden="true" />
            {emptyNode !== null && (
                <div
                    className={emptyBodyStyle}
                    style={{ top: reservedTopPx, width }}
                    role="status"
                    aria-live="polite"
                >
                    {emptyNode}
                </div>
            )}
            <span className={tableFocusRingStyle} data-table-focus-ring="" aria-hidden="true" />
        </div>
    );
    return <RuntimeDirectionProvider direction={direction}>{tableElement}</RuntimeDirectionProvider>;
}

export default Table;
