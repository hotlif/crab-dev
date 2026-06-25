import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type HTMLAttributes, type Key, type ReactNode, useMemo, useRef } from "react";
import { css, cx } from "@linaria/core";

import BodyRow from "./bodyRow.js";
import token from "./token.js";
import TableBodyCell, { type TableCellProps } from "./bodyCell.js";
import TableHeaderCell from "./headerCell.js";
import { type HeaderCellType, makeSelectKey } from "./util.js";
import type { CellEditRecord, ColumnType, FilterEditorParam, GroupCellRenderParam, MergeCell, Row } from "./types.js";
import { useRowGroup } from "./hooks/useRowGroup.js";
import { useColumnLayout } from "./hooks/useColumnLayout.js";
import { useColumnResize } from "./hooks/useColumnResize.js";
import { useCellEdit } from "./hooks/useCellEdit.js";
import { useCellSelection } from "./hooks/useCellSelection.js";
import { useTableFilter } from "./hooks/useTableFilter.js";
import { useKeywordMatch } from "./hooks/useKeywordMatch.js";
import { useTreeData } from "./hooks/useTreeData.js";
import { useRowEdit } from "./hooks/useRowEdit.js";
import type { InternalGroupRow } from "./util.js";
import { isGroupRow } from "./util.js";

interface TableProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>, "onCopy"> {
    // 表格的宽度
    width: number
    // 编辑模式
    editType?: TableCellProps<T>["editType"]
    // 表格的高度
    height: number
    // 表格的数据行
    rows: T[]
    // 表格的列定义
    columns: ColumnType<T>[]
    // 合并单元格的信息
    mergeCells?: MergeCell[]
    // 选择单元格的
    selectCells?: Key[]
    // 选择单元格改变后触发的事件
    onSelectCellsChange?: (selectCells: Key[]) => void
    // 自定义行高（优先级高于 row.height）
    getRowHeight?: (row: T, rowIndex: number) => number | undefined
    // 表格头部的高度
    headerRowHeight?: number
    // 是否展示过滤栏
    filterBar?: boolean
    // 过滤栏高度
    filterRowHeight?: number
    // 过滤栏单元格样式类名（可传入 css`` 生成的 className）
    filterCellClassName?: string
    // 外部受控过滤条件（key 为列 name）
    filters?: Record<string, string>
    // 自定义默认过滤编辑器（列级 filterEditor 优先级更高）
    renderDefaultFilterEditor?: (param: FilterEditorParam<T>) => ReactNode
    // 过滤条件变化回调
    onFilterChange?: (filters: Record<string, string>) => void
    // ====== 行分组 ======
    groupBy?: string[]
    groupRowHeight?: number
    expandedGroupIds?: Set<Key>
    defaultExpandedGroupIds?: Set<Key>
    defaultExpandAll?: boolean
    onExpandedGroupIdsChange?: (expandedGroupIds: Set<Key>) => void
    renderGroupCell?: (param: GroupCellRenderParam<T>) => ReactNode
    // 受控编辑操作记录
    cellEditRecords?: CellEditRecord[]
    onCellEditRecordsChange?: (records: CellEditRecord[]) => void
    onUndo?: (record: CellEditRecord) => void
    // ====== 行编辑（editType="row" 时生效） ======
    /** 受控当前编辑行 ID */
    editingRowId?: Key | null
    /** 非受控初始编辑行 ID */
    defaultEditingRowId?: Key | null
    /** 编辑行 ID 变化回调 */
    onEditingRowIdChange?: (id: Key | null) => void
    /** 确认整行编辑：changes 为各列 name → 编辑后值的映射 */
    onRowCommit?: (rowId: Key, changes: Record<string, unknown>) => void
    /** 取消整行编辑 */
    onRowCancel?: (rowId: Key) => void
    // 高亮关键字
    highlightKeyword?: string
    activeMatchIndex?: number
    onMatchCountChange?: (count: number) => void
    // 是否允许拖拽调整列宽（默认 false；可通过 ColumnType.resizable 逐列覆盖）
    resizable?: boolean
    onColumnResize?: (columnName: string, width: number) => void
    // 按下 Ctrl/Cmd+C 时触发；携带当前选区内所有单元格的数据
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
    // ====== 树形数据 ======
    /** 启用树形数据模式 */
    treeData?: boolean
    /** 获取每行的子行；返回空数组或 null/undefined 表示叶子节点 */
    getChildRows?: (row: T) => T[] | undefined | null
    /** 显示缩进和展开/收起按钮的列名；默认使用第一个非 fixed="right" 的叶子列 */
    treeColumn?: string
    /** 受控展开行 id 集合 */
    expandedRowIds?: Set<Key>
    /** 非受控初始展开行 id 集合 */
    defaultExpandedRowIds?: Set<Key>
    /** 是否默认全部展开（默认 false） */
    defaultTreeExpandAll?: boolean
    /** 展开状态变化回调 */
    onExpandedRowIdsChange?: (ids: Set<Key>) => void
}

// 虚拟列表左侧占位
const paddingLeft = (
    <div
        key="table-virtual-left-padding"
        className={css`
            display: inline-block;
            box-sizing: border-box;
            width: calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px));
            height: 100%;
        `}
    />
);

// 虚拟列表右侧占位
const paddingRight = (
    <div
        key="table-virtual-right-padding"
        className={css`
            display: inline-block;
            box-sizing: border-box;
            width: var(--crab-rc-virtual-right-padding-width, 0px);
            height: 100%;
        `}
    />
);

// 虚拟列表底部占位
const paddingBottom = (
    <div
        key="table-virtual-bottom-padding"
        className={css`
            display: inline-block;
            box-sizing: border-box;
            height: var(--crab-rc-virtual-bottom-padding-height, 0px);
            width: 100%;
        `}
    />
);

// 虚拟列表顶部占位
const paddingTop = (topPaddingCompensation = 0) => (
    <div
        key="table-virtual-top-padding-body"
        className={css`
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
        `}
        style={{
            height: `calc(var(--crab-rc-virtual-top-padding-height, 0px) - var(--crab-rc-virtual-top-padding-height-offset, 0px) - ${topPaddingCompensation}px)`
        }}
    />
);

const filterCellBorderShadow = css`
    box-shadow: inset -1px 0 0 ${token.border.color},
                inset 0 -1px 0 ${token.border.color};
`;

const rowEditingRowStyle = css`
    position: relative;
    z-index: 1;
`;

// 编辑行整行描一道主题色边并浮起：用单层 overlay 画卡片边框 + 投影，
// 不占布局空间（pointer-events:none），避免 hover/编辑切换时单元格盒模型抖动。
// 底部留方角，与紧贴其下的操作浮条共用一条底边，二者衔接成连体卡片
const rowEditBorderOverlayStyle = css`
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid ${token['row-edit']['ring-color']};
    border-radius: ${token['row-edit']['card-radius']} ${token['row-edit']['card-radius']} 0 0;
    box-shadow: ${token['row-edit']['card-shadow']};
    pointer-events: none;
    z-index: 10;
`;

const rowEditActionsWrapperStyle = css`
    display: inline-block;
    position: sticky;
    right: 0;
    width: 0;
    height: 100%;
    vertical-align: top;
    z-index: 25;
    overflow: visible;
`;

// 操作浮条：紧贴编辑行底边右侧、省去顶边与卡片底边共线，从右下角连体延伸而出；
// 左/右/下三边沿用同一主题色描边，下两角圆角，与编辑行卡片拼成一张完整卡片
const rowEditActionsInnerStyle = css`
    position: absolute;
    top: 100%;
    right: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: ${token['row-edit']['actions-gap']};
    padding: ${token['row-edit']['actions-padding']};
    background-color: ${token['row-edit']['actions-bg']};
    border: 1px solid ${token['row-edit']['actions-border']};
    border-top: none;
    border-radius: 0 0 ${token['row-edit']['actions-radius']} ${token['row-edit']['actions-radius']};
    box-shadow: ${token['row-edit']['actions-shadow']};
`;

const rowEditConfirmBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: ${token['row-edit']['button-height']};
    padding: 0 ${token['row-edit']['button-padding-x']};
    border-radius: ${token['row-edit']['button-radius']};
    font-size: ${token['row-edit']['button-font-size']};
    font-weight: ${token['row-edit']['button-font-weight']};
    line-height: 1;
    cursor: pointer;
    border: 1px solid transparent;
    outline: none;
    background-color: ${token['row-edit']['confirm-bg']};
    color: ${token['row-edit']['confirm-color']};
    transition: background-color ${token['row-edit']['transition']};
    white-space: nowrap;
    &:hover {
        background-color: ${token['row-edit']['confirm-hover-bg']};
    }
    &:active {
        background-color: ${token['row-edit']['confirm-active-bg']};
    }
    &:focus-visible {
        outline: 2px solid ${token['row-edit']['ring-color']};
        outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const rowEditCancelBtnStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: ${token['row-edit']['button-height']};
    padding: 0 ${token['row-edit']['button-padding-x']};
    border-radius: ${token['row-edit']['button-radius']};
    font-size: ${token['row-edit']['button-font-size']};
    font-weight: ${token['row-edit']['button-font-weight']};
    line-height: 1;
    cursor: pointer;
    background: transparent;
    color: ${token['row-edit']['cancel-color']};
    border: 1px solid ${token['row-edit']['cancel-border']};
    outline: none;
    transition: background-color ${token['row-edit']['transition']},
                border-color ${token['row-edit']['transition']};
    white-space: nowrap;
    &:hover {
        background-color: ${token['row-edit']['cancel-hover-bg']};
        border-color: ${token['row-edit']['ring-color']};
    }
    &:active {
        background-color: ${token['row-edit']['cancel-hover-bg']};
    }
    &:focus-visible {
        outline: 2px solid ${token['row-edit']['ring-color']};
        outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const fixedCellRowEditBgStyle = css`
    z-index: 9;
    background-color: ${token['row-edit']['row-bg']};
`;

const filterCellBottomOnlyShadow = css`
    box-shadow: inset 0 -1px 0 ${token.border.color};
`;

function Table<T extends Row>({
    width,
    height,
    rows,
    columns,
    mergeCells = [],
    getRowHeight,
    headerRowHeight = 35,
    filterBar = false,
    filterRowHeight = 35,
    filterCellClassName,
    filters,
    editType,
    selectCells,
    onSelectCellsChange,
    renderDefaultFilterEditor,
    onFilterChange,
    groupBy: groupByProp,
    groupRowHeight = 35,
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
    onCopy,
    treeData,
    getChildRows,
    treeColumn: treeColumnProp,
    expandedRowIds,
    defaultExpandedRowIds,
    defaultTreeExpandAll,
    onExpandedRowIdsChange,
    ...restProps
}: TableProps<T>) {

    // ====== 树形数据 ======
    const { flatRows, treeRowMetaMap, isTree, toggleTreeRow } = useTreeData<T>({
        rows, treeData, getChildRows, expandedRowIds, defaultExpandedRowIds,
        defaultTreeExpandAll, onExpandedRowIdsChange
    });

    // ====== 行分组（树形模式下跳过分组） ======
    const { groupBy, displayRows, isGrouped, toggleGroup } = useRowGroup<T>({
        rows: flatRows, groupBy: isTree ? [] : groupByProp, expandedGroupIds,
        defaultExpandedGroupIds, defaultExpandAll, onExpandedGroupIdsChange
    });

    // ====== 列宽与布局（bottomColumnsRef 在 table 层创建并共享给多个 hook） ======
    const bottomColumnsRef = useRef<ColumnType<T>[]>([]);

    const { resizedWidths, handleResizeMouseDown, gridTemplateColumnsRef } = useColumnResize({
        bottomColumnsRef, onColumnResize
    });

    const {
        bottomColumns, maxDepth, headerCells, headerGridTemplateRows,
        gridTemplateColumns, fixedLeftColumns, fixedRightColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, actualHeight,
        stickyLeftOffsets, stickyRightOffsets, columnByName,
        gridTemplateRows, skipCellSet, mergeCellMap, getCellKey
    } = useColumnLayout<T>({
        columns, width, resizedWidths, isGrouped, groupBy, headerRowHeight,
        displayRows, getRowHeight, groupRowHeight, mergeCells, bottomColumnsRef
    });

    // 供 handleResizeMouseDown 读取当前列宽
    gridTemplateColumnsRef.current = gridTemplateColumns;

    // ====== 树形列解析 ======
    const resolvedTreeColumn = useMemo(() => {
        if (!isTree) return undefined;
        return treeColumnProp ?? bottomColumns.find(col => col.fixed !== 'right')?.name;
    }, [isTree, treeColumnProp, bottomColumns]);

    // 获取指定行/列应注入的树形 props（非树形列或分组行返回空对象）
    const getTreeCellProps = (row: T | InternalGroupRow<T>, columnIndex: number) => {
        if (!isTree || isGroupRow(row) || !resolvedTreeColumn) return {};
        const column = bottomColumns[columnIndex];
        if (!column || column.name !== resolvedTreeColumn) return {};
        const meta = treeRowMetaMap.get((row as T).id);
        if (!meta) return {};
        return {
            treeNode: meta,
            onTreeToggle: () => toggleTreeRow((row as T).id)
        };
    };

    // ====== 行编辑 ======
    const { isRowEditMode, currentEditingRowId, editorValues, startRowEdit, setColumnValue, commitRowEdit, cancelRowEdit } = useRowEdit({
        editType, editingRowId, defaultEditingRowId, onEditingRowIdChange, onRowCommit, onRowCancel
    });

    // ====== 单元格编辑 ======
    const { undoDataVersion, editedCellKeys, handleCellCommit, handleUndo } = useCellEdit<T>({
        displayRows, bottomColumnsRef, cellEditRecords, onCellEditRecordsChange, onUndo
    });

    // ====== 单元格选区（同时处理 Ctrl+Z/C/Esc 键盘事件） ======
    const {
        handleCellMouseDown, handleCellMouseEnter, getCellSelectionState
    } = useCellSelection<T>({
        displayRows, bottomColumnsRef, selectCells, onSelectCellsChange,
        onCopy, onCtrlZ: handleUndo
    });

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

    // ====== 渲染：分组 banner 行 ======
    const renderGroupBannerRow = (rowIndex: number, groupRow: InternalGroupRow<T>, columnRange: [number, number]): ReactNode => {
        const { meta } = groupRow.dataRef;
        const handleToggle = () => { toggleGroup(meta.groupId); };
        const valueText = meta.value == null || meta.value === "" ? "(空)" : String(meta.value);

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
                            gap: ${token.group['text-gap']};
                        `}
                    >
                        <span>{valueText}</span>
                        <span
                            className={css`
                                color: ${token.group['count-color']};
                                font-size: ${token.group['count-font-size']};
                            `}
                        >({meta.count})</span>
                    </span>
                    <span
                        aria-hidden
                        className={css`
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: ${token.group['chevron-size']};
                            height: ${token.group['chevron-size']};
                            color: ${token.group['chevron-color']};
                            transition: ${token.group['chevron-transition']};
                        `}
                        style={{ transform: meta.expanded ? "rotate(0deg)" : "rotate(-90deg)" }}
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
                    className={cx(css`
                        display: inline-flex;
                        align-items: center;
                        box-sizing: border-box;
                        vertical-align: top;
                        height: 100%;
                        box-shadow: inset 0 -1px 0 ${token.border.color};
                        background-color: ${token.group['bg-color']};
                    `, opts?.fixed && css`
                        position: sticky;
                        z-index: 9;
                    `)}
                    style={positionStyle}
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
        const renderedColumnSet = new Set<number>([...fixedLeftColumnsIdx, ...fixedRightColumnsIdx]);
        for (let c = columnRange[0]; c <= columnRange[1]; c += 1) {
            if (bottomColumns[c]?.fixed !== "left" && bottomColumns[c]?.fixed !== "right") renderedColumnSet.add(c);
        }

        const getBodyRenderStart = (startRowIndex: number) => {
            let renderStart = startRowIndex;
            mergeCellMap.forEach((mergeCell) => {
                if (!renderedColumnSet.has(mergeCell.columnIndex)) return;
                const endRowIndex = mergeCell.rowIndex + mergeCell.rowSpan;
                if (mergeCell.rowIndex < startRowIndex && endRowIndex >= startRowIndex) {
                    renderStart = Math.min(renderStart, mergeCell.rowIndex);
                }
            });
            return renderStart;
        };

        const getBodyTopPaddingCompensation = (renderStart: number, startRowIndex: number) => {
            let offset = 0;
            for (let r = renderStart; r < startRowIndex; r += 1) offset += gridTemplateRows[r];
            return offset;
        };

        const renderStart = getBodyRenderStart(rowRange[0]);
        const topPaddingCompensation = getBodyTopPaddingCompensation(renderStart, rowRange[0]);
        const bodyRows: ReactNode[] = [paddingTop(topPaddingCompensation)];

        for (let rowIndex = renderStart; rowIndex <= rowRange[1]; rowIndex += 1) {
            const currentRow = displayRows[rowIndex];
            if (!currentRow) continue;
            if (isGroupRow(currentRow)) {
                bodyRows.push(renderGroupBannerRow(rowIndex, currentRow, columnRange));
                continue;
            }

            const isEditingThisRow = isRowEditMode && currentEditingRowId === (currentRow as T).id;

            const getRowEditCellProps = (col: ColumnType<T>) => isEditingThisRow ? {
                isRowEditing: true,
                rowEditorValue: editorValues[col.name] ?? null,
                onRowEditorValueChange: (value: unknown) => setColumnValue(col.name, value),
                onRowCancel: cancelRowEdit,
            } : {};

            const tableCells: ReactNode[] = [];
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const column = bottomColumns[columnIndex];
                if (column.fixed === "left" || column.fixed === "right") continue;
                const mergeCell = mergeCellMap.get(currentCellKey);
                tableCells.push(
                    <TableBodyCell
                        key={`table-body-cell-${rowIndex}-${columnIndex}`}
                        row={currentRow as T}
                        rowIndex={rowIndex}
                        columnIndex={columnIndex}
                        column={column}
                        isSkipCell={isSkipCell}
                        mergeCell={mergeCell}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={gridTemplateRows}
                        editType={editType}
                        isLastColumn={columnIndex === bottomColumns.length - 1}
                        isEdited={editedCellKeys.has(makeSelectKey((currentRow as T).id, columnIndex))}
                        onCellCommit={handleCellCommit}
                        selection={isEditingThisRow ? undefined : getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                        dataVersion={undoDataVersion}
                        highlightKeyword={highlightKeyword}
                        activeOccurrenceInCell={activeMatchMeta?.rowIndex === rowIndex && activeMatchMeta?.columnIndex === columnIndex ? activeMatchMeta.occurrenceInCell : undefined}
                        onCellMouseDown={isEditingThisRow ? undefined : handleCellMouseDown}
                        onCellMouseEnter={isEditingThisRow ? undefined : handleCellMouseEnter}
                        style={{ width: gridTemplateColumns[columnIndex] }}
                        {...getTreeCellProps(currentRow, columnIndex)}
                        {...getRowEditCellProps(column)}
                    />
                );
            }

            const makeFixedBodyCell = (column: ColumnType<T>, columnIndex: number, fixed: "left" | "right") => {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const mergeCell = mergeCellMap.get(currentCellKey);
                return (
                    <TableBodyCell
                        className={cx(css`position: sticky;`, !isSkipCell && (isEditingThisRow ? fixedCellRowEditBgStyle : css`
                            z-index: 9;
                            background-color: ${token.cell['bg-color']};
                        `))}
                        key={`table-body-cell-${rowIndex}-${columnIndex}`}
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
                        isEdited={editedCellKeys.has(makeSelectKey((currentRow as T).id, columnIndex))}
                        onCellCommit={handleCellCommit}
                        selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
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
                    />
                );
            };

            bodyRows.push(
                <BodyRow
                    key={`table-body-row-${rowIndex}`}
                    className={isEditingThisRow ? rowEditingRowStyle : undefined}
                    style={{ height: gridTemplateRows[rowIndex], width: actualHeight }}
                    onDoubleClick={isRowEditMode && !isEditingThisRow ? () => startRowEdit((currentRow as T).id) : undefined}
                >
                    {isEditingThisRow && <div className={rowEditBorderOverlayStyle} aria-hidden />}
                    {fixedLeftColumns.map((column, index) => makeFixedBodyCell(column, fixedLeftColumnsIdx[index], "left"))}
                    {paddingLeft}
                    {tableCells}
                    {paddingRight}
                    {fixedRightColumns.map((column, index) => makeFixedBodyCell(column, fixedRightColumnsIdx[index], "right"))}
                    {isEditingThisRow && (
                        <div className={rowEditActionsWrapperStyle}>
                            <div
                                className={rowEditActionsInnerStyle}
                                onMouseDown={e => e.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    className={rowEditConfirmBtnStyle}
                                    onClick={commitRowEdit}
                                >
                                    确认
                                </button>
                                <button
                                    type="button"
                                    className={rowEditCancelBtnStyle}
                                    onClick={cancelRowEdit}
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}
                </BodyRow>
            );
        }

        bodyRows.push(paddingBottom);
        return bodyRows;
    };

    // ====== 渲染：过滤栏单元格 ======
    const renderFilterCell = (columnIndex: number, fixed?: "left" | "right") => {
        const column = bottomColumns[columnIndex];
        const canFilter = column?.filterable !== false;
        const keyword = column ? (filterKeywordMap[column.name] ?? "") : "";
        return (
            <div
                key={`table-filter-cell-${columnIndex}`}
                className={cx(css`
                    display: inline-flex;
                    align-items: center;
                    box-sizing: border-box;
                    vertical-align: top;
                    height: 100%;
                    padding: ${token['filter-cell'].padding};
                    background-color: ${token.header['bg-color']};
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
                ) : null}
            </div>
        );
    };

    // ====== 渲染：表头 ======
    const generateHeaderElement = ({ columnRange }: { columnRange: [number, number] }) => {
        const getMergeCell = (cell?: HeaderCellType | null) => cell
            ? { rowIndex: cell.rowIndex, columnIndex: cell.columnIndex, rowSpan: cell.rowSpan, colSpan: cell.colSpan }
            : undefined;

        const getBottomBorderStyle = (rowIndex: number, maxRowIndex: number) =>
            rowIndex === maxRowIndex
                ? css`box-shadow: inset 0 -1px 0 ${token.border.color};`
                : "";

        const getHeaderRowRenderStart = (rowIndex: number, startColumnIndex: number) => {
            let renderStart = startColumnIndex;
            for (let c = startColumnIndex - 1; c >= 0; c -= 1) {
                const cell = headerCells[rowIndex]?.[c] ?? null;
                if (cell == null || cell.fixed === "left" || cell.fixed === "right") continue;
                const endColumnIndex = cell.columnIndex + cell.colSpan;
                if (cell.columnIndex < startColumnIndex && endColumnIndex >= startColumnIndex) {
                    renderStart = Math.min(renderStart, cell.columnIndex);
                }
            }
            return renderStart;
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
                return (
                    <TableHeaderCell
                        key={`table-header-cell-${r}-${columnIndex}`}
                        className={extraClassName}
                        columnIndex={columnIndex}
                        rowIndex={r}
                        maxRowIndex={maxDepth - 1}
                        column={cell?.column}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={headerGridTemplateRows}
                        isSkipCell={isSkipCell}
                        isLastColumn={columnIndex === bottomColumns.length - 1}
                        mergeCell={getMergeCell(cell)}
                        fixed={extraStyle?.left != null ? "left" : extraStyle?.right != null ? "right" : undefined}
                        onResizeMouseDown={showResizeHandle ? (e) => handleResizeMouseDown(columnIndex, e) : undefined}
                        style={{ width: gridTemplateColumns[columnIndex], ...extraStyle }}
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
                    className={cx(css`
                        position: sticky;
                        z-index: 10;
                    `, getBottomBorderStyle(r, maxDepth - 1))}
                    style={{ height: headerRowHeight, width: actualHeight, top: r * headerRowHeight }}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => makeHeaderCell(
                        columnIndex,
                        css`position: sticky; z-index: 11;`,
                        { left: stickyLeftOffsets[columnIndex] }
                    ))}
                    <div
                        key={`table-header-left-padding-${r}`}
                        className={css`display: inline-block; box-sizing: border-box; height: 100%;`}
                        style={{ width: `calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px) - ${leftPaddingCompensation}px)` }}
                    />
                    {cells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => makeHeaderCell(
                        columnIndex,
                        css`position: sticky; z-index: 11;`,
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
                    className={css`position: sticky; z-index: 10;`}
                    style={{ height: filterRowHeight, width: actualHeight, top: maxDepth * headerRowHeight }}
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

    return (
        <div
            {...restProps}
            style={{
                "--crab-rc-virtual-left-padding-width-offset": `${fixedLeftColumnsIdx.reduce((acc, idx) => acc + gridTemplateColumns[idx], 0)}px`,
                "--crab-rc-virtual-top-padding-height-offset": `${reservedTopPx}px`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as CSSProperties & Record<string, any>}
        >
            <RcVirtual
                gridRef={virtualRef}
                className={css`
                    box-shadow: -1px 0 0 0 ${token.border.color},
                                0 1px 0 0 ${token.border.color},
                                1px 0 0 0 ${token.border.color};
                    box-sizing: border-box;
                    user-select: none;
                `}
                gridTemplateColumns={gridTemplateColumns}
                gridTemplateRows={gridTemplateRows}
                viewportWidth={width}
                viewportHeight={height}
                reservedTopHeight={reservedTopPx}
                renderRows={(rowRange, columnRange) => {
                    return [
                        ...generateHeaderElement({ columnRange }),
                        ...generateBodyElement({ rowRange, columnRange })
                    ];
                }}
            />
        </div>
    );
}

export default Table;
