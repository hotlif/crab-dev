import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type HTMLAttributes, type Key, type ReactNode, useRef } from "react";
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
    // 高亮关键字
    highlightKeyword?: string
    activeMatchIndex?: number
    onMatchCountChange?: (count: number) => void
    // 是否允许拖拽调整列宽（默认 false；可通过 ColumnType.resizable 逐列覆盖）
    resizable?: boolean
    onColumnResize?: (columnName: string, width: number) => void
    // 按下 Ctrl/Cmd+C 时触发；携带当前选区内所有单元格的数据
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
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
    highlightKeyword,
    activeMatchIndex,
    onMatchCountChange,
    resizable = false,
    onColumnResize,
    onCopy,
    ...restProps
}: TableProps<T>) {

    // ====== 行分组 ======
    const { groupBy, displayRows, isGrouped, toggleGroup } = useRowGroup<T>({
        rows, groupBy: groupByProp, expandedGroupIds, defaultExpandedGroupIds,
        defaultExpandAll, onExpandedGroupIdsChange
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
            if (currentRow && isGroupRow(currentRow)) {
                bodyRows.push(renderGroupBannerRow(rowIndex, currentRow, columnRange));
                continue;
            }

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
                        selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                        dataVersion={undoDataVersion}
                        highlightKeyword={highlightKeyword}
                        activeOccurrenceInCell={activeMatchMeta?.rowIndex === rowIndex && activeMatchMeta?.columnIndex === columnIndex ? activeMatchMeta.occurrenceInCell : undefined}
                        onCellMouseDown={handleCellMouseDown}
                        onCellMouseEnter={handleCellMouseEnter}
                        style={{ width: gridTemplateColumns[columnIndex] }}
                    />
                );
            }

            const makeFixedBodyCell = (column: ColumnType<T>, columnIndex: number, fixed: "left" | "right") => {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const mergeCell = mergeCellMap.get(currentCellKey);
                return (
                    <TableBodyCell
                        className={cx(css`position: sticky;`, !isSkipCell && css`
                            z-index: 9;
                            background-color: ${token.cell['bg-color']};
                        `)}
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
                        onCellMouseDown={handleCellMouseDown}
                        onCellMouseEnter={handleCellMouseEnter}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                            [fixed === "left" ? "left" : "right"]: fixed === "left"
                                ? stickyLeftOffsets[columnIndex]
                                : stickyRightOffsets[columnIndex]
                        }}
                    />
                );
            };

            bodyRows.push(
                <BodyRow
                    key={`table-body-row-${rowIndex}`}
                    style={{ height: gridTemplateRows[rowIndex], width: actualHeight }}
                >
                    {fixedLeftColumns.map((column, index) => makeFixedBodyCell(column, fixedLeftColumnsIdx[index], "left"))}
                    {paddingLeft}
                    {tableCells}
                    {paddingRight}
                    {fixedRightColumns.map((column, index) => makeFixedBodyCell(column, fixedRightColumnsIdx[index], "right"))}
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
                    border-left: 1px solid ${token.border.color};
                    border-bottom: 1px solid ${token.border.color};
                    box-shadow: inset -1px 0 0 ${token.border.color};
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
