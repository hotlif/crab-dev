import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type HTMLAttributes, type Key, type MouseEvent as ReactMouseEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css, cx } from "@linaria/core";

import TableRow from "./tableRow.js";
import TableBodyCell, { type TableCellProps } from "./bodyCell.js";
import TableHeaderCell from "./headerCell.js";
import { sortColumns, getBottomColumns, getMaxDepth, HeaderCellType, getHeaderCellsTwoDimensionalArray, buildMergeCellLookup, buildGroupedDisplayRows, isGroupRow, type InternalGroupRow } from "./util.js";
import type { CellSelectionState, ColumnType, FilterEditorParam, GroupCellRenderParam, MergeCell, Row } from "./types.js";

interface TableProps<T extends Row> extends HTMLAttributes<HTMLDivElement> {
	// 表格的宽度
	width: number
    // 编辑模式
    editType?: TableCellProps<T>["editType"],
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
    // 按列 name 分组（顺序敏感），如 ['$.country', '$.city']。
    // 仅按相邻同值合并，不会隐式重排数据，保留消费方对排序的掌控。
    groupBy?: string[]
    // 分组行高度（默认 35）
    groupRowHeight?: number
    // 受控：展开的分组 id 集合；与 onExpandedGroupIdsChange 配套使用
    expandedGroupIds?: Set<Key>
    // 非受控：初始展开的分组 id 集合
    defaultExpandedGroupIds?: Set<Key>
    // 缺省展开策略（仅在 expandedGroupIds / defaultExpandedGroupIds 均未提供时生效）。默认 true
    defaultExpandAll?: boolean
    // 展开状态变化回调
    onExpandedGroupIdsChange?: (expandedGroupIds: Set<Key>) => void
    // 自定义分组 banner 渲染
    renderGroupCell?: (param: GroupCellRenderParam<T>) => ReactNode
}

// 虚拟列表左侧占位：用于在可视区中预留被横向裁剪的区域
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
)

// 虚拟列表右侧占位：用于在可视区中补齐右侧被裁剪宽度
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
)

// 虚拟列表底部占位：用于在纵向滚动时补齐不可见区域
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
)

// 虚拟列表顶部占位：用于在纵向滚动时补齐不可见区域
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
)

// 选区 key 形如 `${row.id}${SELECT_KEY_SEP}${columnIndex}`。
// 用行 id（而非位置索引）作为锚定，排序 / 过滤导致行重排时选区不会跟着错位
// SEP 用 \u0000（不可见控制字符），确保即便 row.id 含 ":" / "-" 也不会与列下标拼接冲突
const SELECT_KEY_SEP = "\u0000";

const makeSelectKey = (rowId: Key, columnIndex: number): string => `${rowId}${SELECT_KEY_SEP}${columnIndex}`;

interface SelectionAnchor {
    rowId: Key
    columnIndex: number
}

const buildRectKeys = (
    rows: Array<{ id: Key }>,
    a: { rowIndex: number; columnIndex: number },
    b: { rowIndex: number; columnIndex: number }
): Key[] => {
    const r1 = Math.min(a.rowIndex, b.rowIndex);
    const r2 = Math.max(a.rowIndex, b.rowIndex);
    const c1 = Math.min(a.columnIndex, b.columnIndex);
    const c2 = Math.max(a.columnIndex, b.columnIndex);
    const keys: Key[] = [];
    for (let r = r1; r <= r2; r += 1) {
        const row = rows[r];
        if (!row) continue;
        for (let c = c1; c <= c2; c += 1) {
            keys.push(makeSelectKey(row.id, c));
        }
    }
    return keys;
};

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
    ...restProps
}: TableProps<T>) {

    const [innerFilterKeywordMap, setInnerFilterKeywordMap] = useState<Record<string, string>>({});

    // 稳定化 groupBy 引用：消费方经常写成字面量数组，每次父组件重渲都会制造新引用，
    // 会让后续 memo 链（displayRows / sColumns / bottomColumns / gridTemplate*）雪崩失效
    const groupBy = useMemo(() => groupByProp ?? [], [(groupByProp ?? []).join("\u0001")]);

    // ====== 行分组状态 ======
    const [innerExpandedGroupIds, setInnerExpandedGroupIds] = useState<Set<Key> | null>(() => {
        if (defaultExpandedGroupIds != null) return new Set(defaultExpandedGroupIds);
        // null 表示"采用 defaultExpandAll 策略"，区别于显式空集合（全部收起）
        return null;
    });

    const currentExpandedSet: Set<Key> | null = expandedGroupIds ?? innerExpandedGroupIds;

    const { displayRows, allPossibleGroupIds } = useMemo(() => {
        return buildGroupedDisplayRows<T>({
            rows,
            groupBy,
            expandedSet: currentExpandedSet,
            defaultExpanded: defaultExpandAll
        });
    }, [rows, groupBy, currentExpandedSet, defaultExpandAll]);

    const isGrouped = groupBy.length > 0;

    const toggleGroup = useCallback((groupId: Key) => {
        // 受控模式只 emit，不改内部 state；非受控模式同步更新内部 state 并 emit
        const base: Set<Key> = (() => {
            if (currentExpandedSet != null) return new Set(currentExpandedSet);
            // 当 expandedSet 为 null 时，按 defaultExpandAll 推导可见集合，
            // 这样首次点击切换才能"反转"目标分组的实际状态。
            // 必须用 allPossibleGroupIds（全量）而不是 allGroupIds（仅当前可见），
            // 否则父级收起后再展开中间某个子分组时，子级会被误认为原本收起
            if (defaultExpandAll) return new Set<Key>(allPossibleGroupIds);
            return new Set<Key>();
        })();
        if (base.has(groupId)) {
            base.delete(groupId);
        } else {
            base.add(groupId);
        }
        if (expandedGroupIds == null) {
            setInnerExpandedGroupIds(base);
        }
        onExpandedGroupIdsChange?.(base);
    }, [currentExpandedSet, defaultExpandAll, allPossibleGroupIds, expandedGroupIds, onExpandedGroupIdsChange]);

    // ====== 单元格选区 ======
    // 设计要点：
    // 1. 对外暴露的 selectCells 是平铺 Key[]，但拖拽时若每次 mouseenter 都重算并
    //    emit 一个 W×H 大数组，会让受控父组件级联重渲、Set 重建、所有可见 cell
    //    重新 diff，大表里不可接受。因此内部用 dragRect 描述拖拽中的矩形，
    //    只在 mouseup 时把矩形展开成 keys 并 emit 一次。
    // 2. anchor 与 row.id 绑定（而非 rowIndex），排序 / 过滤后锚点仍指向同一行数据。
    // 3. row.id → rowIndex 用预建 Map，避免每次操作走 findIndex O(n)。
    const [innerSelectCells, setInnerSelectCells] = useState<Key[]>([]);
    const [anchorCell, setAnchorCell] = useState<SelectionAnchor | null>(null);
    const [dragRect, setDragRect] = useState<{
        anchor: { rowIndex: number; columnIndex: number }
        end: { rowIndex: number; columnIndex: number }
    } | null>(null);
    const isDraggingRef = useRef(false);
    const dragRectRef = useRef<typeof dragRect>(null);
    // 始终维护最新的 dragRect 引用，供 window mouseup 在闭包外读取
    dragRectRef.current = dragRect;

    const committedSelectCells = selectCells ?? innerSelectCells;

    const rowIdToIndex = useMemo(() => {
        const map = new Map<Key, number>();
        displayRows.forEach((row, index) => map.set(row.id, index));
        return map;
    }, [displayRows]);

    const emitSelectCells = useCallback((next: Key[]) => {
        if (selectCells == null) {
            setInnerSelectCells(next);
        }
        onSelectCellsChange?.(next);
    }, [selectCells, onSelectCellsChange]);

    // 拖拽期间用矩形覆盖原选区；非拖拽期间用 committed 集合
    const selectedKeySet = useMemo(() => {
        const set = new Set<string>();
        if (dragRect) {
            buildRectKeys(displayRows, dragRect.anchor, dragRect.end).forEach((key) => set.add(String(key)));
        } else {
            committedSelectCells.forEach((key) => set.add(String(key)));
        }
        return set;
    }, [dragRect, displayRows, committedSelectCells]);

    const anchorRowIndex = useMemo(() => {
        if (!anchorCell) return -1;
        return rowIdToIndex.get(anchorCell.rowId) ?? -1;
    }, [anchorCell, rowIdToIndex]);

    // rows 重排 / 缩短后若锚点对应行已不存在，必须主动清除锚点与选区，
    // 否则后续 Shift / 拖拽会静默失败
    useEffect(() => {
        if (anchorCell && !rowIdToIndex.has(anchorCell.rowId)) {
            setAnchorCell(null);
            if (committedSelectCells.length > 0) {
                emitSelectCells([]);
            }
        }
    }, [anchorCell, rowIdToIndex, committedSelectCells, emitSelectCells]);

    const handleCellMouseDown = useCallback((rowIndex: number, columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        // 仅响应鼠标左键；忽略中键 / 右键以保留滚轮与右键菜单
        if (event.button !== 0) {
            return;
        }
        const row = displayRows[rowIndex];
        // 分组 banner 行不参与选区
        if (!row || isGroupRow(row)) return;
        const cell = { rowIndex, columnIndex };
        const keyString = makeSelectKey(row.id, columnIndex);

        if (event.shiftKey && anchorCell && anchorRowIndex >= 0) {
            // Shift+点击：以现有锚点为原点，把矩形扩展到当前单元格（锚点不动）
            // 进入拖拽矩形态，本次只更新内部 state，不向外 emit；松开时再统一 emit
            setDragRect({
                anchor: { rowIndex: anchorRowIndex, columnIndex: anchorCell.columnIndex },
                end: cell
            });
            isDraggingRef.current = true;
        } else if (event.ctrlKey || event.metaKey) {
            // Ctrl/⌘+点击：在已有选区中切换该单元格的选中状态，并将锚点移动到这里
            // 离散操作，不进入拖拽矩形态
            const next = selectedKeySet.has(keyString)
                ? committedSelectCells.filter((k) => String(k) !== keyString)
                : [...committedSelectCells, keyString];
            emitSelectCells(next);
            setAnchorCell({ rowId: row.id, columnIndex });
        } else {
            // 普通点击：以该单元格为新的选区与锚点，进入拖拽态
            setAnchorCell({ rowId: row.id, columnIndex });
            setDragRect({ anchor: cell, end: cell });
            isDraggingRef.current = true;
        }
        // 阻止原生文本选择，避免拖拽过程中误选单元格内文字
        // 同时让页面上已聚焦的表单控件正常 blur，避免 preventDefault 带来的焦点滞留
        (document.activeElement as HTMLElement | null)?.blur?.();
        event.preventDefault();
    }, [anchorCell, anchorRowIndex, committedSelectCells, emitSelectCells, displayRows, selectedKeySet]);

    const handleCellMouseEnter = useCallback((_rowIndex: number, _columnIndex: number, event: ReactMouseEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) {
            return;
        }
        // 用户在表格外释放鼠标时浏览器可能错过 mouseup，借 buttons === 0 兜底
        if (event.buttons === 0) {
            isDraggingRef.current = false;
            return;
        }
        // 鼠标进入分组 banner 行时不更新拖拽矩形，避免选区跨 banner 连接上下两个区域
        if (isGroupRow(displayRows[_rowIndex])) {
            return;
        }
        setDragRect((prev) => {
            if (!prev) return prev;
            if (prev.end.rowIndex === _rowIndex && prev.end.columnIndex === _columnIndex) {
                return prev;
            }
            return { anchor: prev.anchor, end: { rowIndex: _rowIndex, columnIndex: _columnIndex } };
        });
    }, [displayRows]);

    useEffect(() => {
        // 在 window 上监听 mouseup：覆盖鼠标移出表格再释放的场景，并在松开时
        // 把拖拽矩形展开成最终 keys 一次性 emit，避免 enter 过程中的高频 emit
        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const finalRect = dragRectRef.current;
            if (finalRect) {
                emitSelectCells(buildRectKeys(displayRows, finalRect.anchor, finalRect.end));
            }
            setDragRect(null);
        };
        // Esc：清空选区与锚点（与 Excel 行为一致）
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (committedSelectCells.length === 0 && anchorCell == null && dragRectRef.current == null) return;
            setAnchorCell(null);
            setDragRect(null);
            isDraggingRef.current = false;
            if (committedSelectCells.length > 0) {
                emitSelectCells([]);
            }
        };
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [displayRows, emitSelectCells, committedSelectCells, anchorCell]);

    const getCellSelectionState = useCallback((rowIndex: number, columnIndex: number, mergeCell?: MergeCell): CellSelectionState | undefined => {
        const row = displayRows[rowIndex];
        if (!row || isGroupRow(row)) return undefined;
        const key = makeSelectKey(row.id, columnIndex);
        if (!selectedKeySet.has(key)) {
            return undefined;
        }
        // 本仓库 MergeCell 的 rowSpan / colSpan 是"额外跨越数"（与 getSkippedCells /
        // getMergedCellSize 中 `r <= rowSpan` 一致），合并区域占 rowSpan+1 行、colSpan+1 列。
        // 因此"视觉下边 / 右边"在 rowIndex + rowSpan + 1 / columnIndex + colSpan + 1；
        // 普通单元格无合并信息时退化为 +1
        const bottomRowIdx = rowIndex + (mergeCell ? mergeCell.rowSpan + 1 : 1);
        const rightColIdx = columnIndex + (mergeCell ? mergeCell.colSpan + 1 : 1);
        const prevRow = displayRows[rowIndex - 1];
        const bottomRow = displayRows[bottomRowIdx];
        // 分组 banner 行隔断的选区边界视为外边
        const prevSelected = prevRow && !isGroupRow(prevRow) && selectedKeySet.has(makeSelectKey(prevRow.id, columnIndex));
        const bottomSelected = bottomRow && !isGroupRow(bottomRow) && selectedKeySet.has(makeSelectKey(bottomRow.id, columnIndex));
        return {
            selected: true,
            isAnchor: anchorCell?.rowId === row.id && anchorCell?.columnIndex === columnIndex,
            edgeTop: !prevSelected,
            edgeBottom: !bottomSelected,
            edgeLeft: !selectedKeySet.has(makeSelectKey(row.id, columnIndex - 1)),
            edgeRight: !selectedKeySet.has(makeSelectKey(row.id, rightColIdx))
        };
    }, [anchorCell, displayRows, selectedKeySet]);

    // 先剔除隐藏列，再按列配置（含 children）排序，作为后续所有列计算基础
    const groupBySet = useMemo(() => new Set(groupBy), [groupBy]);
    const sColumns = useMemo(() => {
        // 当行分组开启时，被 groupBy 命中的列在叶子数据行中应留空 ——
        // 这些值已通过 banner 行展示一次，再次出现就成了重复信息。
        // 通过包装 render 把命中列的叶子单元格内容置空（保留列本身，确保 banner 能在该列位置上渲染）。
        // 同时禁用 editRender，避免用户双击分组列叶子单元格后进入一个空值编辑器
        const wrapped = isGrouped
            ? columns.map((column) => {
                if (!column.name || !groupBySet.has(column.name)) return column;
                return {
                    ...column,
                    render: () => null,
                    editRender: undefined
                };
            })
            : columns;
        return sortColumns(wrapped.filter(element => element.hidden !== true));
    }, [columns, isGrouped, groupBySet])

    // 拍平到叶子列（真正参与 body 渲染的列）
    const bottomColumns = useMemo(() => {
        return getBottomColumns(sColumns)
    }, [sColumns]);

    // 表头最大层级深度（用于生成多行表头）
    const maxDepth = useMemo(() => {
        return getMaxDepth(sColumns);
    }, [sColumns]);

    // 二维表头矩阵：headerCells[rowIndex][columnIndex]
    const headerCells = useMemo(() => {
        return getHeaderCellsTwoDimensionalArray(sColumns);
    }, [sColumns]);

    const headerGridTemplateRows = useMemo(() => {
        return Array.from({ length: maxDepth }, () => headerRowHeight);
    }, [maxDepth, headerRowHeight]);

    const gridTemplateColumns = useMemo(() => {
        return bottomColumns.filter(element => element.hidden !== true).map((column) => column.width ?? 120)
    }, [bottomColumns])

    const filterKeywordMap = filters ?? innerFilterKeywordMap;
    const isFilterEnabled = filterBar === true;

    // 行高优先级：getRowHeight > row.height > 默认 35；分组 banner 行用 groupRowHeight
    const gridTemplateRows = useMemo(() => {
        return displayRows.map((row, rowIndex) => {
            if (isGroupRow(row)) {
                return row.height ?? groupRowHeight;
            }
            return getRowHeight?.(row, rowIndex) ?? row.height ?? 35;
        });
    }, [displayRows, getRowHeight, groupRowHeight])

    const {
        skipCellSet,
        mergeCellMap,
        getCellKey
    } = useMemo(() => {
        // 预计算合并单元格查找结构：
        // 1) skipCellSet: 被合并覆盖、无需渲染的单元格
        // 2) mergeCellMap: 主单元格 -> 合并信息
        // 行分组下 row 顺序被重排，原 rowIndex 失去意义 —— 直接禁用合并
        if (isGrouped) {
            return buildMergeCellLookup([]);
        }
        return buildMergeCellLookup(mergeCells);
    }, [mergeCells, isGrouped]);

    const {
        fixedLeftColumns,
        fixedRightColumns,
        fixedLeftColumnsIdx,
        fixedRightColumnsIdx
    } = useMemo(() => {
        // 将叶子列分组为左固定列/右固定列，并保留其原始索引
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leftColumns: ColumnType<any>[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rightColumns: ColumnType<any>[] = [];
        const leftColumnsIdx: number[] = [];
        const rightColumnsIdx: number[] = [];
        bottomColumns.forEach((column, index) => {
            if (column.fixed === "left") {
                leftColumns.push(column);
                leftColumnsIdx.push(index);
            } else if (column.fixed === "right") {
                rightColumns.push(column);
                rightColumnsIdx.push(index);
            }
        })
        return {
            fixedLeftColumns: leftColumns,
            fixedRightColumns: rightColumns,
            fixedLeftColumnsIdx: leftColumnsIdx,
            fixedRightColumnsIdx: rightColumnsIdx
        }
    }, [bottomColumns]);


    const actualHeight = useMemo(() => {
        // 实际总宽度
        return gridTemplateColumns.reduce((acc, cur) => acc + cur, 0)
    }, [gridTemplateColumns]);

    const stickyLeftOffsets = useMemo(() => {
        // 每一列作为 left sticky 时的起始偏移
        const offsets: number[] = [];
        let offset = 0;
        for (let i = 0; i < gridTemplateColumns.length; i += 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    const stickyRightOffsets = useMemo(() => {
        // 每一列作为 right sticky 时的起始偏移（从右向左累计）
        const offsets: number[] = Array.from({ length: gridTemplateColumns.length }, () => 0);
        let offset = 0;
        for (let i = gridTemplateColumns.length - 1; i >= 0; i -= 1) {
            offsets[i] = offset;
            offset += gridTemplateColumns[i];
        }
        return offsets;
    }, [gridTemplateColumns]);

    // groupBy 列 name -> 列定义，便于分组行渲染（含自定义 renderGroupCell）
    const columnByName = useMemo(() => {
        const map = new Map<string, ColumnType<T>>();
        const walk = (cols: ColumnType<T>[]) => {
            cols.forEach((col) => {
                if (col.name) map.set(col.name, col);
                if (col.children && col.children.length > 0) {
                    walk(col.children as ColumnType<T>[]);
                }
            });
        };
        walk(columns);
        return map;
    }, [columns]);

    // 分组 banner 行：与普通行共用 grid 结构，但每个 cell 的内容由"该列是否是当前分组列"决定。
    // - 命中 meta.columnName 的列：默认渲染 chevron + 分组值 + 计数
    // - 其它列：默认留空；可通过 renderGroupCell 在这些列渲染聚合值（sum/avg/count 等）
    // 这样 banner 自然按 groupBy 的列位置错位，形成类似 react-data-grid 的"逐层缩进"效果。
    const renderGroupBannerRow = (rowIndex: number, groupRow: InternalGroupRow<T>, columnRange: [number, number]): ReactNode => {
        const { meta } = groupRow.dataRef;

        const handleToggle = () => { toggleGroup(meta.groupId); };

        const valueText = meta.value == null || meta.value === ""
            ? "(空)"
            : String(meta.value);

        const renderBannerContent = (currentColumn: ColumnType<T>, columnIndex: number, isGroupColumn: boolean) => {
            const defaultBanner = (
                <div
                    className={css`
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                        width: 100%;
                        height: 100%;
                        padding-inline: 8px;
                        box-sizing: border-box;
                        cursor: pointer;
                        user-select: none;
                        font-weight: 500;
                        color: var(--crab-rc-table-group-color, hsl(0deg 0% 20%));
                        &:focus-visible {
                            outline: 2px solid var(--crab-rc-table-selection-border-color, #1976d2);
                            outline-offset: -2px;
                        }
                    `}
                    role="button"
                    tabIndex={0}
                    aria-expanded={meta.expanded}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleToggle();
                        }
                    }}
                >
                    <span
                        className={css`
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: inline-flex;
                            align-items: center;
                            gap: 6px;
                        `}
                    >
                        <span>{valueText}</span>
                        <span
                            className={css`
                                color: var(--crab-rc-table-group-count-color, hsl(0deg 0% 45%));
                                font-weight: 400;
                                font-size: 12px;
                            `}
                        >({meta.count})</span>
                    </span>
                    <span
                        aria-hidden
                        className={css`
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 14px;
                            height: 14px;
                            color: var(--crab-rc-table-group-chevron-color, hsl(0deg 0% 35%));
                            transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
                        `}
                        style={{
                            transform: meta.expanded ? "rotate(0deg)" : "rotate(-90deg)"
                        }}
                    >
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 3.5L5 6.5L8 3.5"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
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
                        border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
                        background-color: var(--crab-rc-table-group-bg-color, hsl(0deg 0% 96%));
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
        // 主滚动区只渲染可视范围内的非固定列
        for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
            const column = bottomColumns[columnIndex];
            if (!column || column.fixed === "left" || column.fixed === "right") continue;
            mainCells.push(buildGroupCell(columnIndex));
        }

        return (
            <TableRow
                key={`table-group-row-${meta.groupId}`}
                style={{
                    height: gridTemplateRows[rowIndex],
                    width: actualHeight
                }}
            >
                {fixedLeftColumnsIdx.map((columnIndex) => buildGroupCell(columnIndex, { fixed: "left" }))}
                {paddingLeft}
                {mainCells}
                {paddingRight}
                {fixedRightColumnsIdx.map((columnIndex) => buildGroupCell(columnIndex, { fixed: "right" }))}
            </TableRow>
        );
    };

    const generateBodyElement = ({
        rowRange,
        columnRange,
    }:{
		rowRange: [number, number],
		columnRange: [number, number],
	}) => {
        // body 由 "顶部占位 + 可见行 + 底部占位" 构成，降低大数据量渲染成本
        const renderedColumnSet = new Set<number>([
            ...fixedLeftColumnsIdx,
            ...fixedRightColumnsIdx
        ]);
        for (let c = columnRange[0]; c <= columnRange[1]; c += 1) {
            if (bottomColumns[c]?.fixed !== "left" && bottomColumns[c]?.fixed !== "right") {
                renderedColumnSet.add(c);
            }
        }

        const getBodyRenderStart = (startRowIndex: number) => {
            let renderStart = startRowIndex;
            // 分组模式下 mergeCellMap 已被清空，必须使用其实际生效的合并信息，
            // 而不是 props 上的原始 mergeCells，否则可能错误地把 renderStart 往上扩
            mergeCellMap.forEach((mergeCell) => {
                if (!renderedColumnSet.has(mergeCell.columnIndex)) {
                    return;
                }
                const endRowIndex = mergeCell.rowIndex + mergeCell.rowSpan;
                if (mergeCell.rowIndex < startRowIndex && endRowIndex >= startRowIndex) {
                    renderStart = Math.min(renderStart, mergeCell.rowIndex);
                }
            })
            return renderStart;
        }

        const getBodyTopPaddingCompensation = (renderStart: number, startRowIndex: number) => {
            let offset = 0;
            for (let r = renderStart; r < startRowIndex; r += 1) {
                offset += gridTemplateRows[r];
            }
            return offset;
        }

        const renderStart = getBodyRenderStart(rowRange[0]);
        const topPaddingCompensation = getBodyTopPaddingCompensation(renderStart, rowRange[0]);

        const bodyRows: ReactNode[] = [paddingTop(topPaddingCompensation)];

        for (let rowIndex = renderStart; rowIndex <= rowRange[1]; rowIndex += 1) {
            const currentRow = displayRows[rowIndex];
            if (currentRow && isGroupRow(currentRow)) {
                // 分组 banner 行：与普通行共用 grid 结构，但每个单元格的内容由 buildGroupCell 决定
                bodyRows.push(renderGroupBannerRow(rowIndex, currentRow, columnRange));
                continue;
            }
            const tableCells: ReactNode[] = [];
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const column = bottomColumns[columnIndex];
                if (column.fixed === "left" || column.fixed === "right") {
                    // 固定列在两侧单独渲染，这里跳过
                    continue
                }
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
                        selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                        onCellMouseDown={handleCellMouseDown}
                        onCellMouseEnter={handleCellMouseEnter}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                        }}
                    />
                );
            }
            bodyRows.push(
                <TableRow
                    key={`table-body-row-${rowIndex}`}
                    style={{
                        height: gridTemplateRows[rowIndex],
                        width: actualHeight
                    }}
                >
                    {fixedLeftColumns.map((column, index) => {
                        const columnIndex = fixedLeftColumnsIdx[index];
                        const currentCellKey = getCellKey(rowIndex, columnIndex);
                        const isSkipCell = skipCellSet.has(currentCellKey);
                        const mergeCell = mergeCellMap.get(currentCellKey);
                        return (
                            <TableBodyCell
                                className={cx(css`
									position: sticky;
								`, !isSkipCell && css`
									z-index: 9;
									background-color: #fff;
								`)}
                                key={`table-body-cell-${rowIndex}-${fixedLeftColumnsIdx[index]}`}
                                row={currentRow as T}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                                column={column}
                                isSkipCell={isSkipCell}
                                mergeCell={mergeCell}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={gridTemplateRows}
                                fixed="left"
                                editType={editType}
                                selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                                onCellMouseDown={handleCellMouseDown}
                                onCellMouseEnter={handleCellMouseEnter}
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    left: stickyLeftOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                    {paddingLeft}
                    {tableCells}
                    {paddingRight}
                    {fixedRightColumns.map((column, index) => {
                        const columnIndex = fixedRightColumnsIdx[index];
                        const currentCellKey = getCellKey(rowIndex, columnIndex);
                        const isSkipCell = skipCellSet.has(currentCellKey);
                        const mergeCell = mergeCellMap.get(currentCellKey);
                        return (
                            <TableBodyCell
                                className={cx(css`
									position: sticky;
								`, !isSkipCell && css`
									background-color: #fff;
									z-index: 9;
								`)}
                                key={`table-body-cell-${rowIndex}-${fixedRightColumnsIdx[index]}`}
                                row={currentRow as T}
                                rowIndex={rowIndex}
                                columnIndex={columnIndex}
                                column={column}
                                isSkipCell={isSkipCell}
                                mergeCell={mergeCell}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={gridTemplateRows}
                                fixed="right"
                                editType={editType}
                                selection={getCellSelectionState(rowIndex, columnIndex, mergeCell)}
                                onCellMouseDown={handleCellMouseDown}
                                onCellMouseEnter={handleCellMouseEnter}
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    right: stickyRightOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                </TableRow>
            );
        }
        bodyRows.push(paddingBottom)
        return bodyRows;
    }

    const handleFilterValueChange = (columnIndex: number, keyword: string) => {
        const column = bottomColumns[columnIndex];
        if (!column) {
            return;
        }

        const next = {
            ...filterKeywordMap
        };
        if (keyword.trim() === "") {
            delete next[column.name];
        } else {
            next[column.name] = keyword;
        }

        const normalizedNext = Object.entries(next).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value.trim() === "") {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, {});

        if (filters == null) {
            setInnerFilterKeywordMap(normalizedNext);
        }

        onFilterChange?.(normalizedNext);
    }

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
                    padding: 2px;
					border-right: 1px solid var(--crab-rc-table-border-color, #ddd);
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
					background-color: var(--crab-rc-table-header-bg-color, hsl(0deg 0% 97.5%));
				`, fixed && css`
					position: sticky;
					z-index: 11;
				`, fixed === "right" && css`
					border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
					border-right: 0;
                `, filterCellClassName, column?.filterCellClassName)}
                style={{
                    width: gridTemplateColumns[columnIndex],
                    left: fixed === "left" ? stickyLeftOffsets[columnIndex] : undefined,
                    right: fixed === "right" ? stickyRightOffsets[columnIndex] : undefined
                }}
            >
                {canFilter ? (
                    column?.filterEditor
                        ? column.filterEditor({
                            column,
                            columnIndex,
                            value: keyword,
                            onValueChange: (nextValue) => {
                                handleFilterValueChange(columnIndex, nextValue);
                            }
                        })
                        : renderDefaultFilterEditor
                            ? renderDefaultFilterEditor({
                                column,
                                columnIndex,
                                value: keyword,
                                onValueChange: (nextValue) => {
                                    handleFilterValueChange(columnIndex, nextValue);
                                }
                            })
                            : null
                ) : null}
            </div>
        )
    }

    const generateHeaderElement = ({
        columnRange,
    }:{
		columnRange: [number, number],
	}) => {
        // 将 header cell 转换为 TableHeaderCell 需要的 mergeCell 结构
        const getMergeCell = (cell?: HeaderCellType | null) => {
            if (cell) {
                return {
                    rowIndex: cell.rowIndex,
                    columnIndex: cell.columnIndex,
                    rowSpan: cell.rowSpan,
                    colSpan: cell.colSpan
                }
            }
            return undefined;
        }

        const nodeRows: ReactNode[] = []

        const getHeaderRowRenderStart = (rowIndex: number, startColumnIndex: number) => {
            let renderStart = startColumnIndex;
            for (let c = startColumnIndex - 1; c >= 0; c -= 1) {
                const cell = headerCells[rowIndex]?.[c] ?? null;
                if (cell == null) {
                    continue;
                }
                if (cell.fixed === "left" || cell.fixed === "right") {
                    continue;
                }
                const endColumnIndex = cell.columnIndex + cell.colSpan;
                if (cell.columnIndex < startColumnIndex && endColumnIndex >= startColumnIndex) {
                    renderStart = Math.min(renderStart, cell.columnIndex);
                }
            }
            return renderStart;
        }

        const getHeaderRowLeftPaddingCompensation = (renderStart: number, startColumnIndex: number) => {
            let offset = 0;
            for (let c = renderStart; c < startColumnIndex; c += 1) {
                const column = bottomColumns[c];
                if (column?.fixed === "left" || column?.fixed === "right") {
                    continue;
                }
                offset += gridTemplateColumns[c];
            }
            return offset;
        }

        const getBottomBorderStyle = (rowIndex: number, maxRowIndex: number) => {
            if (rowIndex === maxRowIndex) {
                return css`
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
				`;
            }
            return "";
        }

        for (let r = 0; r < maxDepth; r += 1) {
            // 按 "行" 渲染表头，支持多级表头与跨行跨列
            // 若合并表头从左侧不可视区跨入可视区，则将该行渲染起点左扩，确保“可见即显示”
            const renderStart = getHeaderRowRenderStart(r, columnRange[0]);
            const leftPaddingCompensation = getHeaderRowLeftPaddingCompensation(renderStart, columnRange[0]);
            const cells: ReactNode[] = [];
            for (let columnIndex = renderStart; columnIndex <= columnRange[1]; columnIndex += 1) {
                const cell = headerCells[r]?.[columnIndex];

                if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") {
                    // 固定列头在左右区域单独渲染，主滚动区跳过
                    continue;
                }
                cells.push(
                    <TableHeaderCell
                        key={`table-header-cell-${r}-${columnIndex}`}
                        columnIndex={columnIndex}
                        rowIndex={r}
                        maxRowIndex={maxDepth - 1}
                        column={cell?.column}
                        gridTemplateColumns={gridTemplateColumns}
                        gridTemplateRows={headerGridTemplateRows}
                        isSkipCell={cell == null ? true : false}
                        mergeCell={getMergeCell(cell)}
                        style={{
                            width: gridTemplateColumns[columnIndex],
                        }}
                    />
                )
            }

            nodeRows.push(
                <TableRow
                    key={`table-header-row-${r}`}
                    className={cx(css`
						position: sticky;
						z-index: 10;
					`, getBottomBorderStyle(r, maxDepth - 1))}
                    style={{
                        height: headerRowHeight,
                        width: actualHeight,
                        top: r * headerRowHeight
                    }}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => {
                        const cell = headerCells[r]?.[columnIndex] ?? null;
                        return (
                            <TableHeaderCell
                                key={`table-header-cell-${r}-${columnIndex}`}
                                className={css`
								position: sticky;
								z-index: 11;
							`}
                                columnIndex={columnIndex}
                                rowIndex={r}
                                maxRowIndex={maxDepth - 1}
                                column={cell?.column}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={headerGridTemplateRows}
                                isSkipCell={cell === null}
                                mergeCell={getMergeCell(cell)}
                                fixed="left"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    left: stickyLeftOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                    <div
                        key={`table-header-left-padding-${r}`}
                        className={css`
							display: inline-block;
							box-sizing: border-box;
							height: 100%;
						`}
                        style={{
                            width: `calc(var(--crab-rc-virtual-left-padding-width, 0px) - var(--crab-rc-virtual-left-padding-width-offset, 0px) - ${leftPaddingCompensation}px)`
                        }}
                    />
                    {cells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => {
                        const cell = headerCells[r]?.[columnIndex] ?? null;
                        return (
                            <TableHeaderCell
                                key={`table-header-cell-${r}-${columnIndex}`}
                                className={css`
								position: sticky;
								z-index: 11;
							`}
                                columnIndex={columnIndex}
                                column={cell?.column}
                                rowIndex={r}
                                maxRowIndex={maxDepth - 1}
                                gridTemplateColumns={gridTemplateColumns}
                                gridTemplateRows={headerGridTemplateRows}
                                isSkipCell={cell === null}
                                mergeCell={getMergeCell(cell)}
                                fixed="right"
                                style={{
                                    width: gridTemplateColumns[columnIndex],
                                    right: stickyRightOffsets[columnIndex]
                                }}
                            />
                        )
                    })}
                </TableRow>,
            )
        }

        if (isFilterEnabled) {
            const filterCells: ReactNode[] = [];
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                if (bottomColumns[columnIndex].fixed === "left" || bottomColumns[columnIndex].fixed === "right") {
                    continue;
                }
                filterCells.push(renderFilterCell(columnIndex));
            }

            nodeRows.push(
                <TableRow
                    key="table-header-filter-row"
                    className={css`
					position: sticky;
					z-index: 10;
				`}
                    style={{
                        height: filterRowHeight,
                        width: actualHeight,
                        top: maxDepth * headerRowHeight
                    }}
                >
                    {fixedLeftColumnsIdx.map((columnIndex) => renderFilterCell(columnIndex, "left"))}
                    {paddingLeft}
                    {filterCells}
                    {paddingRight}
                    {fixedRightColumnsIdx.map((columnIndex) => renderFilterCell(columnIndex, "right"))}
                </TableRow>
            )
        }

        return nodeRows;
    }

    return (
        <div
            {...restProps}
            style={{
                '--crab-rc-virtual-left-padding-width-offset': `${fixedLeftColumns.reduce((acc, cur) => acc + (cur.width ?? 120), 0)}px`,
                '--crab-rc-virtual-top-padding-height-offset':  `${(maxDepth * headerRowHeight) + (isFilterEnabled ? filterRowHeight : 0)}px`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as CSSProperties & Record<string, any>}
        >
            <RcVirtual
                className={css`
					border-left: 1px solid var(--crab-rc-table-border-color, #ddd);
					border-bottom: 1px solid var(--crab-rc-table-border-color, #ddd);
					box-sizing: border-box;
				`}
                gridTemplateColumns={gridTemplateColumns}
                gridTemplateRows={gridTemplateRows}
                viewportWidth={width}
                viewportHeight={height}
                reservedTopHeight={(maxDepth * headerRowHeight) + (isFilterEnabled ? filterRowHeight : 0)}
                renderRows={(rowRange, columnRange) => {
                    // 同一可视窗口内，先渲染 header 再渲染 body，保证层级与遮挡关系正确
                    const headers = generateHeaderElement({
                        columnRange
                    });

                    const bodys = generateBodyElement({
                        rowRange,
                        columnRange
                    });
                    return [...headers, ...bodys]
                }}
            />
        </div>
    )
}


export default Table;
