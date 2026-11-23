import { useState, useEffect, useRef, type MutableRefObject, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { css } from "@crab-dev/css";
import { NodeType, LoadStateType } from "@crab-dev/rc-tree";
import type { Node as TreeNode, TreeProps } from "@crab-dev/rc-tree";
import type { ColumnType, Row } from "@crab-dev/rc-table";
import type { ProtocolColumnType, DataTypeLoader, ProtocolTableState } from "../types.js";
import { transformColumns } from "../util.js";
import token from "../token.js";
import ColumnActions from '../columnActions.js';
import {
    collectAllLeafColumnNames,
    collectLeafColumns,
    collectVisibleLeafColumnNames,
    applyHiddenToColumns,
    reorderColumnsByDrag,
    resetColumnWidths,
    buildInitWidthMap,
    applyInitialState,
    buildCurrentState,
} from "../columnUtils.js";

/* ─── 列节点样式（必须在 columnsToTreeNodes 之前声明，否则静态样式分析会触发 TDZ） ─── */

const colNodeNameStyle = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const colNodeStyle = css`
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
    gap: ${token.toolbar.gap};
`;
/* ─── 类型 ─── */

export type PinChangeHandler = (colName: string | number, fixed: "left" | "right" | undefined) => void;
export type SortableChangeHandler = (colName: string | number, sortable: boolean) => void;

export interface UseColumnManagementOptions<T extends Row = Row> {
    fetchColumns: () => Promise<ProtocolColumnType[]>;
    typeLoaders?: DataTypeLoader<T>[];
    initialState?: ProtocolTableState;

    sideBar?: boolean;
    defaultSideBarOpen?: boolean;
    onColumnResize?: (columnName: string, width: number) => void;
    onError?: (error: Error) => void;
}

export interface UseColumnManagementReturn<T extends Row> {
    columns: ColumnType<T>[];
    columnsLoading: boolean;
    rawColumnsRef: MutableRefObject<ProtocolColumnType[]>;
    revision: number;
    changeOrder: (names: string[], group?: string) => void;
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
    handleColumnDragEnd: NonNullable<TreeProps["onDragEnd"]>;
    handleExpandAll: () => void;
    handleCollapseAll: () => void;
    handleResetColumnWidths: () => void;
    handleTreeCheck: NonNullable<TreeProps['onCheckedKeysChange']>;
    handlePanelExpandedChange: NonNullable<TreeProps['onExpandedKeysChange']>;
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
                    <span className={colNodeStyle}>
                        <span className={colNodeNameStyle}>{(col.title ?? col.name) as string}</span>
                        <ColumnActions name={colName} label={typeof col.title === 'string' ? col.title : String(col.name)}
                            fixed={fixed} sortable={sortable} onPinChange={onPinChange} onSortableChange={onSortableChange} />
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
    options: UseColumnManagementOptions<T>
): UseColumnManagementReturn<T> {
    const {
        fetchColumns,
        typeLoaders,
        initialState,
        sideBar,
        defaultSideBarOpen,
        onColumnResize,
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
    const [revision, setRevision] = useState(0);
    const savedLayout = useRef(initialState);

    const [panelTreeData, setPanelTreeData] = useState<TreeNode[]>([]);
    const [panelExpandedKeys, setPanelExpandedKeys] = useState<(string | number)[]>([]);
    const [panelCheckedKeys, setPanelCheckedKeys] = useState<(string | number)[]>([]);
    const [panelOpen, setPanelOpen] = useState(defaultSideBarOpen ?? false);
    const [panelSearchText, setPanelSearchText] = useState("");
    const [sideBarTab, setSideBarTab] = useState<"columns" | "filters">("columns");

    // latest-ref 模式（例外 §4.1-2）：列操作读取最新 typeLoaders 和错误回调
    const latestTypeLoaders = useRef(typeLoaders);
    latestTypeLoaders.current = typeLoaders;
    const latestOnError = useRef(onError);
    latestOnError.current = onError;

    const notify = () => {
        savedLayout.current = buildCurrentState(rawColumnsRef.current, {});
        setRevision(value => value + 1);
    };
    const changeOrder = (names: string[], group?: string) => {
        const reorder = (items: ProtocolColumnType[], parent?: string): ProtocolColumnType[] => {
            if (parent !== group) return items.map(item => item.children ? { ...item, children: reorder(item.children, item.name) } : item);
            const byName = new Map(items.map(item => [item.name, item]));
            const ordered = names.flatMap(name => byName.get(name) ?? []);
            let index = 0;
            const moved = new Set(ordered);
            return items.map(item => moved.has(item) ? ordered[index++] : item);
        };
        const next = reorder(rawColumnsRef.current);
        rawColumnsRef.current = next;
        setPanelTreeData(columnsToTreeNodes(next, null, handlePinChange, handleSortableChange));
        setColumns(transformColumns(next, latestTypeLoaders.current));
        notify();
    };

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
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
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
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
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

    const handleColumnDragEnd: NonNullable<TreeProps["onDragEnd"]> = (event, { overState }) => {
        if (!overState) return;
        const dragId = event.active.id as string | number;
        const targetId = overState.id as string | number;
        if (dragId === targetId) return;
        rawColumnsRef.current = reorderColumnsByDrag(rawColumnsRef.current, dragId, targetId, overState.state);
        setPanelTreeData(columnsToTreeNodes(rawColumnsRef.current, null, handlePinChange, handleSortableChange));
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
        notify();
    };

    const handleExpandAll = () => {
        setPanelExpandedKeys(panelTreeData.filter(n => n.type === NodeType.FOLDER).map(n => n.id as string | number));
    };

    const handleCollapseAll = () => setPanelExpandedKeys([]);

    const handleResetColumnWidths = () => {
        rawColumnsRef.current = resetColumnWidths(rawColumnsRef.current, initWidthMapRef.current);
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
        notify();
    };

    const handleTreeCheck: NonNullable<TreeProps['onCheckedKeysChange']> = (nextCheckedKeys) => {
        setPanelCheckedKeys(nextCheckedKeys as (string | number)[]);
        const allLeafNames = new Set(collectAllLeafColumnNames(rawColumnsRef.current));
        const hiddenNames = new Set([...allLeafNames].filter(name => !nextCheckedKeys.includes(name)));
        rawColumnsRef.current = applyHiddenToColumns(rawColumnsRef.current, hiddenNames);
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
        notify();
    };

    const handlePanelExpandedChange: NonNullable<TreeProps['onExpandedKeysChange']> = (nextKeys) => {
        setPanelExpandedKeys(nextKeys as (string | number)[]);
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
        setColumns(transformColumns(rawColumnsRef.current, latestTypeLoaders.current));
        notify();
    };

    /* ─── fetchColumns useEffect ─── */

    useEffect(() => {
        setColumnsLoading(true);
        setColumnsError(null);
        let active = true;
        fetchColumns().then((resp: ProtocolColumnType[]) => {
            if (!active) return;
            const layout = savedLayout.current;
            const restored = layout ? applyInitialState(resp, layout) : resp;
            rawColumnsRef.current = restored;
            initWidthMapRef.current = buildInitWidthMap(resp);
            setColumns(transformColumns(restored, latestTypeLoaders.current));

            if (sideBar) {
                const nodes = columnsToTreeNodes(restored, null, handlePinChange, handleSortableChange);
                setPanelTreeData(nodes);
                setPanelExpandedKeys(nodes.filter(n => n.type === NodeType.FOLDER).map(n => n.id as string | number));
                setPanelCheckedKeys(collectVisibleLeafColumnNames(restored));
            }


            setColumnsLoading(false);
        }).catch((err: unknown) => {
            if (!active) return;
            const error = err instanceof Error ? err : new Error(String(err));
            setColumnsError(error);
            setColumnsLoading(false);
            latestOnError.current?.(error);
        });
        return () => { active = false; };
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
        revision,
        changeOrder,
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
