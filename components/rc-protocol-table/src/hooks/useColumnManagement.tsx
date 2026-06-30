import { useState, useEffect, useRef, type MutableRefObject, type Dispatch, type SetStateAction, type Key, type ReactNode } from "react";
import { css, cx } from "@linaria/core";
import { NodeType, LoadStateType, type Node as TreeNode, type OverState } from "@crab-dev/rc-tree";
import type { ColumnType, Row } from "@crab-dev/rc-table";
import type { ProtocolColumnType, DataTypeLoader, ProtocolTableState } from "../types.js";
import { transformColumns } from "../util.js";
import {
    collectAllLeafColumnNames,
    collectLeafColumns,
    collectVisibleLeafColumnNames,
    applyHiddenToColumns,
    reorderColumnsByDrag,
    resetColumnWidths,
    buildInitWidthMap,
    buildCurrentState,
    applyInitialState,
} from "../columnUtils.js";

/* ─── 列节点样式（必须在 columnsToTreeNodes 之前声明，否则 Linaria 静态分析触发 TDZ） ─── */

const colNodeNameStyle = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const colPinBtnStyle = css`
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    color: oklch(55% 0 0);
    transition: opacity 0.1s;
    &:hover { background-color: oklch(85% 0 0); color: oklch(25% 0 0); }
`;

const colPinBtnActiveStyle = css`
    opacity: 1 !important;
    color: oklch(50% 0.18 262);
    &:hover { background-color: oklch(85% 0.06 262); color: oklch(40% 0.18 262); }
`;

const sortableBtnStyle = css`
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    color: oklch(55% 0 0);
    transition: opacity 0.1s;
    &:hover { background-color: oklch(85% 0 0); color: oklch(25% 0 0); }
`;

const sortableBtnActiveStyle = css`
    opacity: 1 !important;
    color: oklch(50% 0.18 140);
    &:hover { background-color: oklch(85% 0.06 140); color: oklch(40% 0.18 140); }
`;

const colNodeHoverGroupStyle = css`
    &:hover .${colPinBtnStyle} { opacity: 1; }
    &:hover .${sortableBtnStyle} { opacity: 1; }
`;

/* ─── 图标（仅列面板节点使用，Bootstrap Icons） ─── */

interface PinIconProps { direction: "left" | "right"; active: boolean }
function PinIcon({ direction, active }: PinIconProps) {
    return (
        <svg
            width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
            style={{ transform: direction === "right" ? "scaleX(-1)" : undefined }}
        >
            {active
                ? /* pin-angle-fill */ <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
                : /* pin-angle */ <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.458 4.458 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.46 4.46 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.228-.04.343a1.776 1.776 0 0 0 .062.46z"/>
            }
        </svg>
    );
}

interface SortableIconProps { active: boolean }
function SortableIcon({ active }: SortableIconProps) {
    return (
        /* Bootstrap Icons: arrow-down-up */
        <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
            style={{ opacity: active ? 1 : 0.45 }}>
            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
        </svg>
    );
}

/* ─── 类型 ─── */

export type PinChangeHandler = (colName: string | number, fixed: "left" | "right" | undefined) => void;
export type SortableChangeHandler = (colName: string | number, sortable: boolean) => void;

export interface UseColumnManagementOptions {
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    typeLoaders?: DataTypeLoader[];
    initialState?: ProtocolTableState;
    onStateChange?: (state: ProtocolTableState) => void;
    sideBar?: boolean;
    defaultSideBarOpen?: boolean;
    onColumnResize?: (columnName: string, width: number) => void;
    /** fetchColumns 完成时如发现需要恢复的过滤器，通过此回调通知外部 */
    onInitialFiltersResolved?: (filters: Record<string, string>) => void;
    onError?: (error: Error) => void;
}

export interface UseColumnManagementReturn<T extends Row> {
    columns: ColumnType<T>[];
    columnsLoading: boolean;
    rawColumnsRef: MutableRefObject<ProtocolColumnType[]>;
    /**
     * 由 table.tsx 在每次 render 时同步：`colMgmt.latestFiltersRef.current = filters`
     * handlers 内部通过此 ref 读取最新过滤器，以生成含 filters 的完整状态快照
     */
    latestFiltersRef: MutableRefObject<Record<string, string>>;
    panelTreeData: TreeNode[];
    setPanelTreeData: Dispatch<SetStateAction<TreeNode[]>>;
    panelExpandedKeys: (string | number)[];
    panelCheckedKeys: (string | number)[];
    panelOpen: boolean;
    setPanelOpen: Dispatch<SetStateAction<boolean>>;
    panelSearchText: string;
    setPanelSearchText: Dispatch<SetStateAction<string>>;
    sideBarTab: "columns" | "filters";
    setSideBarTab: Dispatch<SetStateAction<"columns" | "filters">>;
    handlePinChange: PinChangeHandler;
    handleSortableChange: SortableChangeHandler;
    handleColumnResize: (columnName: string, width: number) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleColumnDragEnd: (event: any, meta: { overState: OverState | null }) => void;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    handleResetColumnWidths: () => void;
    handleTreeCheck: (param: { checkedKeys: Key[]; halfCheckedKeys: Key[]; node: TreeNode; checked: boolean }) => void;
    handlePanelExpandedChange: (param: { node: TreeNode }) => void;
    handleSelectAll: () => void;
    /** 将 ProtocolColumnType[] 转为 Tree 所需 Node[]，列面板 JSX 内使用 */
    buildPanelTreeNodes: (cols: ProtocolColumnType[]) => TreeNode[];
    /** 叶子列标题映射（id → title 文字），供列面板搜索过滤 */
    getLeafTitleMap: (cols: ProtocolColumnType[]) => Map<string | number, string>;
    columnsError: Error | null;
    retryLoadColumns: () => void;
}

/* ─── columnsToTreeNodes（内部实现，依赖上方 CSS 常量） ─── */

function columnsToTreeNodes(
    columns: ProtocolColumnType[],
    parent: TreeNode | null = null,
    onPinChange?: PinChangeHandler,
    onSortableChange?: SortableChangeHandler
): TreeNode[] {
    const result: TreeNode[] = [];
    columns.forEach((col, index) => {
        const hasChildren = Array.isArray(col.children) && col.children.length > 0;
        const colName = col.name as string | number;
        const fixed = col.fixed as "left" | "right" | undefined;
        const sortable = !!col.sortable;

        const title: ReactNode = hasChildren
            ? ((col.title ?? col.name) as string)
            : (onPinChange || onSortableChange)
                ? (
                    <span className={colNodeHoverGroupStyle} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <span className={colNodeNameStyle}>{(col.title ?? col.name) as string}</span>
                        {onSortableChange && (
                            <button
                                type="button"
                                className={cx(sortableBtnStyle, sortable && sortableBtnActiveStyle)}
                                title={sortable ? "禁用排序" : "启用排序"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSortableChange(colName, !sortable);
                                }}
                            >
                                <SortableIcon active={sortable} />
                            </button>
                        )}
                        {onPinChange && (
                            <>
                                <button
                                    type="button"
                                    className={cx(colPinBtnStyle, fixed === "left" && colPinBtnActiveStyle)}
                                    title={fixed === "left" ? "取消左固定" : "固定到左侧"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPinChange(colName, fixed === "left" ? undefined : "left");
                                    }}
                                >
                                    <PinIcon direction="left" active={fixed === "left"} />
                                </button>
                                <button
                                    type="button"
                                    className={cx(colPinBtnStyle, fixed === "right" && colPinBtnActiveStyle)}
                                    title={fixed === "right" ? "取消右固定" : "固定到右侧"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPinChange(colName, fixed === "right" ? undefined : "right");
                                    }}
                                >
                                    <PinIcon direction="right" active={fixed === "right"} />
                                </button>
                            </>
                        )}
                    </span>
                )
                : ((col.title ?? col.name) as string);

        const node: TreeNode = {
            id: colName,
            title,
            type: hasChildren ? NodeType.FOLDER : NodeType.FILE,
            parent,
            loadState: LoadStateType.LOADING_COMPLETED,
            priority: index,
        };
        result.push(node);
        if (hasChildren) {
            result.push(...columnsToTreeNodes(col.children!, node, onPinChange, onSortableChange));
        }
    });
    return result;
}

/* ─── Hook ─── */

export function useColumnManagement<T extends Row>(
    options: UseColumnManagementOptions
): UseColumnManagementReturn<T> {
    const {
        fetchColumns,
        typeLoaders,
        initialState,
        onStateChange,
        sideBar,
        defaultSideBarOpen,
        onColumnResize,
        onInitialFiltersResolved,
        onError,
    } = options;

    const [columns, setColumns] = useState<ColumnType<T>[]>([]);
    const [columnsLoading, setColumnsLoading] = useState(true);
    const [columnsError, setColumnsError] = useState<Error | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // 可变实例状态 ref（例外 §4.1-1）：跨渲染持有原始列数据
    const rawColumnsRef = useRef<ProtocolColumnType[]>([]);
    // 可变实例状态 ref（例外 §4.1-1）：初始列宽快照，用于列宽重置
    const initWidthMapRef = useRef<Map<string | number, number | undefined>>(new Map());
    // 由外部 table.tsx 在每次 render 时同步，供 handlers 读取最新过滤器生成完整状态快照
    const latestFiltersRef = useRef<Record<string, string>>({});

    const [panelTreeData, setPanelTreeData] = useState<TreeNode[]>([]);
    const [panelExpandedKeys, setPanelExpandedKeys] = useState<(string | number)[]>([]);
    const [panelCheckedKeys, setPanelCheckedKeys] = useState<(string | number)[]>([]);
    const [panelOpen, setPanelOpen] = useState(defaultSideBarOpen ?? false);
    const [panelSearchText, setPanelSearchText] = useState("");
    const [sideBarTab, setSideBarTab] = useState<"columns" | "filters">("columns");

    // latest-ref 模式（例外 §4.1-2）：handlers 中读取最新 typeLoaders / onStateChange
    const latestTypeLoaders = useRef(typeLoaders);
    latestTypeLoaders.current = typeLoaders;
    const latestOnStateChange = useRef(onStateChange);
    latestOnStateChange.current = onStateChange;
    // latest-ref 模式（例外 §4.1-2）：fetchColumns useEffect 内读取最新回调
    const latestOnInitialFiltersResolved = useRef(onInitialFiltersResolved);
    latestOnInitialFiltersResolved.current = onInitialFiltersResolved;
    const latestOnError = useRef(onError);
    latestOnError.current = onError;

    const notify = () =>
        latestOnStateChange.current?.(buildCurrentState(rawColumnsRef.current, latestFiltersRef.current));

    /* ─── 列操作 handlers ─── */

    const handlePinChange: PinChangeHandler = (colName, fixed) => {
        const updateFixed = (cols: ProtocolColumnType[]): ProtocolColumnType[] =>
            cols.map(col => {
                if (col.children?.length) return { ...col, children: updateFixed(col.children) };
                if (col.name === colName) return { ...col, fixed };
                return col;
            });
        rawColumnsRef.current = updateFixed(rawColumnsRef.current);
        setPanelTreeData(columnsToTreeNodes(rawColumnsRef.current, null, handlePinChange, handleSortableChange));
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    const handleSortableChange: SortableChangeHandler = (colName, sortable) => {
        const update = (cols: ProtocolColumnType[]): ProtocolColumnType[] =>
            cols.map(col => {
                if (col.children?.length) return { ...col, children: update(col.children) };
                if (col.name === colName) return { ...col, sortable };
                return col;
            });
        rawColumnsRef.current = update(rawColumnsRef.current);
        setPanelTreeData(columnsToTreeNodes(rawColumnsRef.current, null, handlePinChange, handleSortableChange));
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    const handleColumnResize = (columnName: string, width: number) => {
        const update = (cols: ProtocolColumnType[]): ProtocolColumnType[] =>
            cols.map(col => {
                if (col.children?.length) return { ...col, children: update(col.children) };
                return String(col.name) === columnName ? { ...col, width } : col;
            });
        rawColumnsRef.current = update(rawColumnsRef.current);
        onColumnResize?.(columnName, width);
        notify();
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleColumnDragEnd = (event: any, { overState }: { overState: OverState | null }) => {
        if (!overState) return;
        const dragId = event.active.id as string | number;
        const targetId = overState.id as string | number;
        if (dragId === targetId) return;
        rawColumnsRef.current = reorderColumnsByDrag(rawColumnsRef.current, dragId, targetId, overState.state);
        setPanelTreeData(columnsToTreeNodes(rawColumnsRef.current, null, handlePinChange, handleSortableChange));
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    const handleExpandAll = () => {
        setPanelExpandedKeys(panelTreeData.filter(n => n.type === NodeType.FOLDER).map(n => n.id as string | number));
    };

    const handleCollapseAll = () => setPanelExpandedKeys([]);

    const handleResetColumnWidths = () => {
        rawColumnsRef.current = resetColumnWidths(rawColumnsRef.current, initWidthMapRef.current);
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    const handleTreeCheck = ({ checkedKeys: nextCheckedKeys }: {
        checkedKeys: Key[];
        halfCheckedKeys: Key[];
        node: TreeNode;
        checked: boolean;
    }) => {
        setPanelCheckedKeys(nextCheckedKeys as (string | number)[]);
        const allLeafNames = new Set(collectAllLeafColumnNames(rawColumnsRef.current));
        const hiddenNames = new Set([...allLeafNames].filter(name => !nextCheckedKeys.includes(name)));
        rawColumnsRef.current = applyHiddenToColumns(rawColumnsRef.current, hiddenNames);
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    const handlePanelExpandedChange = ({ node }: { node: TreeNode }) => {
        setPanelExpandedKeys(prev =>
            prev.includes(node.id)
                ? prev.filter(k => k !== node.id)
                : [...prev, node.id]
        );
    };

    const handleSelectAll = () => {
        const allLeafNames = collectAllLeafColumnNames(rawColumnsRef.current);
        const isAllChecked = allLeafNames.length > 0 &&
            allLeafNames.every(n => panelCheckedKeys.includes(n));

        if (isAllChecked) {
            setPanelCheckedKeys([]);
            rawColumnsRef.current = applyHiddenToColumns(rawColumnsRef.current, new Set(allLeafNames));
        } else {
            const allIds = columnsToTreeNodes(rawColumnsRef.current, null).map(n => n.id);
            setPanelCheckedKeys(allIds);
            rawColumnsRef.current = applyHiddenToColumns(rawColumnsRef.current, new Set());
        }
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current) as unknown as ColumnType<T>[]);
        notify();
    };

    /* ─── fetchColumns useEffect ─── */

    useEffect(() => {
        setColumnsLoading(true);
        setColumnsError(null);
        fetchColumns().then((resp: ProtocolColumnType[]) => {
            const restored = initialState ? applyInitialState(resp, initialState) : resp;
            rawColumnsRef.current = restored;
            initWidthMapRef.current = buildInitWidthMap(restored);
            setColumns(transformColumns(restored, latestTypeLoaders.current) as unknown as ColumnType<T>[]);

            if (sideBar) {
                const nodes = columnsToTreeNodes(restored, null, handlePinChange, handleSortableChange);
                setPanelTreeData(nodes);
                setPanelExpandedKeys(nodes.filter(n => n.type === NodeType.FOLDER).map(n => n.id as string | number));
                setPanelCheckedKeys(collectVisibleLeafColumnNames(restored));
            }

            if (initialState?.filters && Object.keys(initialState.filters).length > 0) {
                latestOnInitialFiltersResolved.current?.(initialState.filters);
            }

            setColumnsLoading(false);
        }).catch((err: unknown) => {
            const error = err instanceof Error ? err : new Error(String(err));
            setColumnsError(error);
            setColumnsLoading(false);
            latestOnError.current?.(error);
        });
    }, [fetchColumns, sideBar, retryCount]);

    const retryLoadColumns = () => setRetryCount(c => c + 1);

    /* ─── 辅助函数（供 table.tsx 列面板 JSX 使用） ─── */

    const buildPanelTreeNodes = (cols: ProtocolColumnType[]) =>
        columnsToTreeNodes(cols, null, handlePinChange, handleSortableChange);

    const getLeafTitleMap = (cols: ProtocolColumnType[]) =>
        new Map(collectLeafColumns(cols).map(col => [
            col.name as string | number,
            String(col.title ?? col.name),
        ]));

    return {
        columns,
        columnsLoading,
        rawColumnsRef,
        latestFiltersRef,
        panelTreeData,
        setPanelTreeData,
        panelExpandedKeys,
        panelCheckedKeys,
        panelOpen,
        setPanelOpen,
        panelSearchText,
        setPanelSearchText,
        sideBarTab,
        setSideBarTab,
        handlePinChange,
        handleSortableChange,
        handleColumnResize,
        handleColumnDragEnd,
        handleExpandAll,
        handleCollapseAll,
        handleResetColumnWidths,
        handleTreeCheck,
        handlePanelExpandedChange,
        handleSelectAll,
        buildPanelTreeNodes,
        getLeafTitleMap,
        columnsError,
        retryLoadColumns,
    };
}
