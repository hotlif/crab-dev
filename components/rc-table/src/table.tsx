import RcVirtual from "@crab-dev/rc-virtual";
import { type CSSProperties, type FC, type HTMLAttributes, type Key, type ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { css, cx } from "@crab-dev/css";
import Checkbox from "@crab-dev/rc-checkbox";
import Radio from "@crab-dev/rc-radio";
import Empty from "@crab-dev/rc-empty";

import BodyRow from "./bodyRow.js";
import token from "./token.js";
import TableBodyCell, { type TableCellProps } from "./bodyCell.js";
import TableHeaderCell from "./headerCell.js";
import { type HeaderCellType, makeSelectKey } from "./util.js";
import type { CellEditRecord, ColumnType, FilterEditorParam, GroupCellRenderParam, MergeCell, Row, RowSelection, SortColumn } from "./types.js";
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
import type { RowEventHandler } from "./hooks/useRowEvents.js";
import { ROW_BG_VAR, ROW_BG_TRANSITION } from "./rowBg.js";
import type { InternalExpandedRow, InternalGroupRow } from "./util.js";
import { EXPAND_COLUMN_NAME, isExpandedContentRow, isGroupRow } from "./util.js";

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
    // 是否允许拖拽列头改变列顺序（默认 false；非固定的顶层列及分组内子列均生效）
    draggableColumns?: boolean
    // 顶层列顺序变化回调，参数为非固定顶层列的新 name 顺序
    onColumnOrderChange?: (orderedColumnNames: string[]) => void
    // 分组内子列顺序变化回调，groupName 为父分组列名，orderedChildNames 为新子列顺序
    onGroupColumnOrderChange?: (groupName: string, orderedChildNames: string[]) => void
    // 按下 Ctrl/Cmd+C 时触发；携带当前选区内所有单元格的数据
    onCopy?: (cells: Array<{ rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown }>) => void
    // ====== 列排序 ======
    /** 受控排序列配置 */
    sortColumns?: SortColumn[]
    /** 非受控初始排序 */
    defaultSortColumns?: SortColumn[]
    /** 排序变化回调 */
    onSortColumnsChange?: (columns: SortColumn[]) => void
    // ====== 行选中 ======
    rowSelection?: RowSelection<T>
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
    // ====== 底部汇总 / 合计行 ======
    /** 是否显示底部固定汇总行；各列内容由 ColumnType.summaryRender 提供，未设置的列为空 */
    showSummary?: boolean
    /** 汇总行高度（默认 35） */
    summaryRowHeight?: number
    // ====== 行展开（详情面板，独立于 treeData） ======
    /** 提供即启用行展开：返回某行展开后在其下方插入的详情内容 */
    expandedRowRender?: (row: T) => ReactNode
    /** 控制某行能否展开；默认所有数据行均可展开 */
    isRowExpandable?: (row: T) => boolean
    /** 受控展开行 key 集合（与树形 expandedRowIds 相互独立） */
    expandedRowKeys?: Set<Key>
    /** 非受控初始展开行 key 集合 */
    defaultExpandedRowKeys?: Set<Key>
    /** 展开行 key 集合变化回调 */
    onExpandedRowKeysChange?: (keys: Set<Key>) => void
    /** 展开内容区默认高度（默认 200） */
    expandedRowHeight?: number
    /** 逐行覆盖展开内容区高度 */
    getExpandedRowHeight?: (row: T) => number | undefined
    /** 展开图标列宽度（默认 40） */
    expandColumnWidth?: number
    /** 展开图标列是否固定到左侧（默认 true） */
    expandColumnFixed?: boolean
    /**
     * 无数据时渲染的空状态内容（rows 为空时显示）。
     * - 不传（undefined）：显示默认 <Empty /> 组件
     * - 传 null：不显示任何空状态
     * - 传 ReactNode：显示自定义内容
     */
    empty?: ReactNode
    // ====== 行序号 ======
    /** 是否在最左侧（功能列之后）显示行序号列，从 1 开始，分组行与展开内容行不计入序号 */
    showRowNumber?: boolean
    /** 序号列宽度（默认 50） */
    rowNumberColumnWidth?: number
    /** 序号列是否固定到左侧（默认 true） */
    rowNumberColumnFixed?: boolean
    // ====== 行事件 ======
    /**
     * 点击数据行。传入后该行即成为可点击目标（pointer 光标 + hover 反馈），
     * 并可用键盘触发：选中行内任一单元格后按 Enter。
     *
     * 以下情形**不会**触发，避免与既有交互打架：
     * - 点在行内的控件上（展开图标、行选择复选框、单选框、按钮、链接、输入框等）；
     * - 单元格拖选之后的那次 click（按下与抬起之间发生了拖动）；
     * - 该行正处于行编辑态。
     *
     * 注意：双击会先产生两次 click（浏览器语义），如需与 onRowDoubleClick 互斥请自行去抖。
     */
    onRowClick?: RowEventHandler<T>
    /**
     * 双击数据行。以下情形**不会**触发：
     * - `editType="cell"` 下双击可编辑单元格（该次双击已被单元格编辑消费）；
     * - `editType="row"` 下双击进入行编辑（该次双击已被行编辑消费）；
     * - 点在行内控件上，或该行正处于行编辑态。
     */
    onRowDoubleClick?: RowEventHandler<T>
}

const SELECTION_COLUMN_NAME = '__rc_table_selection__';

// 选择列 body cell 居中容器
const selectionCellStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`;

// 展开图标按钮：方形可点区域 + 焦点环，hover 提亮底，内嵌旋转 chevron
const expandButtonStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.expand['chevron-size']};
    height: ${token.expand['chevron-size']};
    flex-shrink: 0;
    cursor: pointer;
    border-radius: ${token.expand['button-radius']};
    color: ${token.expand['chevron-color']};
    background: transparent;
    border: none;
    padding: 0;
    outline: none;
    &:focus-visible {
        outline: ${token.selection['border-width']} solid ${token.selection['border-color']};
        outline-offset: ${token.selection['outline-offset']};
    }
`;

const expandChevronStyle = css`
    transition: ${token.expand['chevron-transition']};
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

// 展开内容区：跨所有列、宽度等于内容总宽，作为整行内容随表格一起横向滚动；
// 微提亮底 + 顶边分隔，内容超高时纵向独立可滚（横向交给表格，故 overflow-x 隐藏）
const expandContentStyle = css`
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: ${token.expand['content-padding']};
    background-color: ${token.expand['content-bg']};
    box-shadow: inset 0 1px 0 ${token.border.color},
                inset 0 -1px 0 ${token.border.color};
`;

// 展开内容容器：RcVirtual 在网格容器上挂了原生 wheel 监听并 preventDefault 劫持滚轮去滚表格，
// 导致面板自身的 overflow:auto 无法用滚轮滚动。这里在面板上挂冒泡阶段的原生 wheel 监听：
// 当面板内部在该方向上仍可滚动时 stopPropagation（阻止冒泡到 RcVirtual 容器监听，浏览器默认行为即滚动面板）；
// 滚到边界时不拦截，事件照常冒泡给表格，形成自然的嵌套滚动。
const ExpandedRowContent: FC<{ width: number; children: ReactNode }> = ({ width, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        /* istanbul ignore if -- ref 挂载后必有值 */
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            // 按住 Shift 表示横向滚动意图，始终交给表格（面板随表格一起横向滚动）
            if (e.shiftKey) return;
            if (el.scrollHeight <= el.clientHeight) return;
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
            if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
                e.stopPropagation();
            }
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);
    return (
        <div ref={ref} className={expandContentStyle} style={{ width }}>
            {children}
        </div>
    );
};

// 选中行背景色（通过 CSS 变量向下传递，固定列与合并单元格均通过 var() 继承；见 rowBg.ts）
const selectedRowStyle = css`
    background-color: var(${ROW_BG_VAR}, ${token.cell['bg-color']});
    transition: ${ROW_BG_TRANSITION};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

/*
 * 可点击行的示能 —— 仅在使用方传入 onRowClick / onRowDoubleClick 时才施加。
 * 纯展示的表格不得伪造交互暗示（无 pointer、无 hover 高亮）。
 *
 * hover 底色写进行级 CSS 变量而非直接 background-color：只有走同一个变量，
 * 左右固定列才会跟着一起变，否则 hover 时整行会被固定列切成三段。
 */
const clickableRowStyle = css`
    cursor: ${token['row-click'].cursor};
    background-color: var(${ROW_BG_VAR}, transparent);
    transition: ${ROW_BG_TRANSITION};

    &:hover {
        ${ROW_BG_VAR}: ${token['row-click']['hover-bg']};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

// 固定列背景 —— 通过 CSS 变量感知行选中 / hover 状态，过渡必须与行严格一致（见 rowBgTransition）
const fixedCellBgWithRowVar = css`
    z-index: 9;
    background-color: var(${ROW_BG_VAR}, ${token.cell['bg-color']});
    transition: ${ROW_BG_TRANSITION};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

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

// 外层容器开启相对定位，以便 emptyBodyStyle 通过 absolute 定位到 body 区域
const emptyContainerStyle = css`
    position: relative;
`;

// 空状态覆盖层：绝对定位到 body 区域（top/width 由内联样式注入，匹配 viewport 尺寸）
const emptyBodyStyle = css`
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
    defaultSortColumns,
    onSortColumnsChange,
    rowSelection,
    showSummary = false,
    summaryRowHeight = 35,
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
}: TableProps<T>) {

    // ====== 行选中 ======
    const { selectedRowIds, isAllSelected, isIndeterminate, toggleRow, selectAllRows, clearAllRows } = useRowSelection<T>({
        dataRows: rows,
        rowSelection,
    });

    // ref 持有最新选中状态，供选择列的 render 函数读取（避免 useMemo 闭包陈旧）
    const selectionStateRef = useRef({ selectedRowIds, toggleRow });
    selectionStateRef.current = { selectedRowIds, toggleRow };

    const selectionColumn = useMemo<ColumnType<T> | null>(() => {
        if (!rowSelection) return null;
        const isFixed = rowSelection.fixed !== false;
        return {
            name: SELECTION_COLUMN_NAME,
            title: '',
            fixed: isFixed ? 'left' : undefined,
            width: rowSelection.columnWidth ?? 40,
            selectable: false,
            sortable: false,
            resizable: false,
            filterable: false,
            align: 'center',
            render: ({ row }) => {
                const { selectedRowIds: ids, toggleRow: toggle } = selectionStateRef.current;
                const isSelected = ids.has(row.id);
                const disabled = rowSelection.getDisabled?.(row) ?? false;
                if (rowSelection.type === 'checkbox') {
                    return (
                        <div className={selectionCellStyle}>
                            <Checkbox
                                checked={isSelected}
                                disabled={disabled}
                                aria-label="选择此行"
                                onChange={() => toggle(row.id)}
                            />
                        </div>
                    );
                }
                return (
                    <div className={selectionCellStyle}>
                        <Radio
                            checked={isSelected}
                            disabled={disabled}
                            aria-label="选择此行"
                            onChange={() => toggle(row.id)}
                        />
                    </div>
                );
            },
        };
    }, [rowSelection]);

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
            width: expandColumnWidth ?? 40,
            selectable: false,
            sortable: false,
            resizable: false,
            filterable: false,
            align: 'center',
            render: ({ row }) => {
                const { expandedKeySet, toggleExpandRow, isRowExpandable: canExpand } = expansionStateRef.current;
                const expandable = canExpand ? canExpand(row) : true;
                if (!expandable) return null;
                const expanded = expandedKeySet.has(row.id);
                return (
                    <div className={selectionCellStyle}>
                        <button
                            type="button"
                            className={expandButtonStyle}
                            aria-expanded={expanded}
                            aria-label={expanded ? '收起此行' : '展开此行'}
                            onClick={(e) => { e.stopPropagation(); toggleExpandRow(row.id); }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={expandChevronStyle}
                                style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                            >
                                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                );
            },
        };
    }, [expandedRowRender, expandColumnFixed, expandColumnWidth]);

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
        rows, columns: effectiveColumns, sortColumns: sortColumnsProp, defaultSortColumns, onSortColumnsChange
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
    const { displayRows, expandedKeySet, isExpansion, toggleExpandRow } = useRowExpansion<T>({
        displayRows: groupedDisplayRows, expandedRowRender, isRowExpandable,
        expandedRowKeys, defaultExpandedRowKeys, onExpandedRowKeysChange,
        expandedRowHeight, getExpandedRowHeight
    });
    expansionStateRef.current = { expandedKeySet, toggleExpandRow, isRowExpandable };

    // displayRows 确定后同步序号映射（直接写 ref，不触发 re-render）
    syncRowNumbers(displayRows);

    // ====== 列宽与布局（bottomColumnsRef 在 table 层创建并共享给多个 hook） ======
    const bottomColumnsRef = useRef<ColumnType<T>[]>([]);

    const { resizedWidths, handleResizeMouseDown, gridTemplateColumnsRef } = useColumnResize({
        bottomColumnsRef, onColumnResize
    });

    const {
        sColumns,
        bottomColumns, maxDepth, headerCells, headerGridTemplateRows,
        gridTemplateColumns, fixedLeftColumns, fixedRightColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, actualHeight,
        stickyLeftOffsets, stickyRightOffsets, columnByName,
        gridTemplateRows, skipCellSet, mergeCellMap, getCellKey
    } = useColumnLayout<T>({
        columns: effectiveColumns, width, resizedWidths, isGrouped, isExpansion, groupBy, headerRowHeight,
        displayRows, getRowHeight, groupRowHeight, mergeCells, bottomColumnsRef
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

    // 获取指定行/列应注入的树形 props（非树形列或非数据行返回空对象）
    const getTreeCellProps = (row: T | InternalGroupRow<T> | InternalExpandedRow<T>, columnIndex: number) => {
        if (!isTree || isExpandedContentRow(row) || isGroupRow(row) || !resolvedTreeColumn) return {};
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
        onCopy, onCtrlZ: handleUndo
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
        return {
            isActivatedByNav: editingCellPos !== null
                && editingCellPos.rowIndex === rowIndex
                && editingCellPos.columnIndex === columnIndex,
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
            if (isExpandedContentRow(currentRow)) {
                // 展开内容行：单个贴左固定容器，宽度等于视口宽，横向滚动时始终完整可见
                bodyRows.push(
                    <BodyRow
                        key={`table-expanded-row-${String(currentRow.id)}`}
                        style={{ height: gridTemplateRows[rowIndex], width: actualHeight }}
                    >
                        <ExpandedRowContent width={actualHeight}>
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
            for (let columnIndex = columnRange[0]; columnIndex <= columnRange[1]; columnIndex += 1) {
                const currentCellKey = getCellKey(rowIndex, columnIndex);
                const isSkipCell = skipCellSet.has(currentCellKey);
                const column = bottomColumns[columnIndex];
                if (column.fixed === "left" || column.fixed === "right") continue;
                const mergeCell = mergeCellMap.get(currentCellKey);
                tableCells.push(
                    <TableBodyCell
                        key={`table-body-cell-${rowIndex}-${columnIndex}`}
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
                        className={cx(css`position: sticky;`, !isSkipCell && (isEditingThisRow ? fixedCellRowEditBgStyle : fixedCellBgWithRowVar))}
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
                        {...getCellNavProps(rowIndex, columnIndex)}
                    />
                );
            };

            bodyRows.push(
                <BodyRow
                    key={`table-body-row-${rowIndex}`}
                    // 数据行在 DOM 中的定位锚点（供测试与使用方的自动化脚本使用）
                    data-row-index={rowIndex}
                    className={cx(
                        isEditingThisRow ? rowEditingRowStyle : undefined,
                        // 可点击示能只给真正可点的数据行：编辑态的行此时不响应行点击
                        hasRowEvents && !isEditingThisRow ? clickableRowStyle : undefined,
                        isRowSelected ? selectedRowStyle : undefined,
                    )}
                    style={{
                        height: gridTemplateRows[rowIndex],
                        width: actualHeight,
                        ...(isRowSelected ? { [ROW_BG_VAR]: token['row-selection']['selected-bg'] } : null)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    } as CSSProperties & Record<string, any>}
                    {...getRowEventProps(currentRow as T, rowIndex, isEditingThisRow)}
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

    // ====== 底部汇总 / 合计行 ======
    const { generateSummaryElement } = useSummary<T>({
        showSummary, summaryRowHeight, rows, bottomColumns,
        fixedLeftColumnsIdx, fixedRightColumnsIdx, gridTemplateColumns,
        stickyLeftOffsets, stickyRightOffsets, actualHeight,
        paddingLeft, paddingRight, selectionColumnName: SELECTION_COLUMN_NAME
    });

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

                const columnName = cell?.column?.name ?? '';

                // 顶层（r=0）父单元格
                // 分组的非第一个子列在 r=0 行是 skip cell（null），向左追溯找到父分组 cell
                let topLevelCell = headerCells[0]?.[columnIndex] ?? null;
                if (!topLevelCell && r > 0) {
                    for (let c = columnIndex - 1; c >= 0; c -= 1) {
                        const candidate = headerCells[0]?.[c];
                        if (candidate !== null && candidate !== undefined) {
                            if (candidate.columnIndex + candidate.colSpan >= columnIndex) {
                                topLevelCell = candidate;
                            }
                            break;
                        }
                    }
                }
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
                                aria-label={isAllSelected ? "取消全选" : "全选"}
                                onChange={(checked) => { if (checked) selectAllRows(); else clearAllRows(); }}
                            />
                        </div>
                    );
                })();

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
                        isLastColumn={(() => { const lastIdx = columnIndex + (cell?.colSpan ?? 0); return lastIdx === bottomColumns.length - 1 || (fixedRightColumnsIdx.length > 0 && lastIdx === fixedRightColumnsIdx[0] - 1); })()}
                        mergeCell={getMergeCell(cell)}
                        fixed={extraStyle?.left != null ? "left" : extraStyle?.right != null ? "right" : undefined}
                        onResizeMouseDown={showResizeHandle ? (e) => handleResizeMouseDown(columnIndex, e) : undefined}
                        style={{ width: gridTemplateColumns[columnIndex], ...extraStyle }}
                        draggable={(isTopLevelDraggable || isChildDraggable) || undefined}
                        isDragging={isDragging}
                        dropIndicatorSide={dropIndicatorSide}
                        onDragStart={onDragStart}
                        onDragOver={isDropTarget ? (e) => handleDragOver(effectiveColumnName, effectiveScope, e, isSubCellPropagation) : undefined}
                        onDrop={isDropTarget ? (e) => handleDrop(effectiveColumnName, effectiveScope, e) : undefined}
                        onDragEnd={(isTopLevelDraggable || isChildDraggable) ? handleDragEnd : undefined}
                        onDragLeave={isDropTarget ? handleDragLeave : undefined}
                        isSortable={!isSelectionCol && isLeafColumn && !isSkipCell && isSortable(columnName)}
                        sortState={!isSelectionCol && isLeafColumn && !isSkipCell ? getSortState(columnName) : null}
                        onSortClick={!isSelectionCol && isLeafColumn && !isSkipCell && isSortable(columnName) ? (isMulti) => handleSort(columnName, isMulti) : undefined}
                        customContent={selectionHeaderContent}
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
                    `, getBottomBorderStyle(r, maxDepth - 1))}
                    style={{ height: headerRowHeight, width: actualHeight, top: r * headerRowHeight, zIndex: 10 + maxDepth - r }}
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

    const emptyNode = rows.length === 0
        ? (empty === undefined ? <Empty /> : empty)
        : null;

    return (
        <div
            {...restProps}
            className={cx(emptyNode !== null && emptyContainerStyle, restProps.className)}
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
                reservedBottomHeight={showSummary ? summaryRowHeight : 0}
                renderRows={(rowRange, columnRange) => {
                    return [
                        ...generateHeaderElement({ columnRange }),
                        ...generateBodyElement({ rowRange, columnRange }),
                        generateSummaryElement({ columnRange })
                    ];
                }}
            />
            {emptyNode !== null && (
                <div
                    className={emptyBodyStyle}
                    style={{ top: reservedTopPx, width }}
                >
                    {emptyNode}
                </div>
            )}
        </div>
    );
}

export default Table;
