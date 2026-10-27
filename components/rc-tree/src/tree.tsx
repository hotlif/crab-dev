import { ConfigBoundary, useComponentSize, useConfig, componentDensityMetrics, densityStyles, type ConfigSize, type ConfigDensity } from '@crab-dev/rc-config-provider';
import { useEffect, useState, useRef, useMemo, useId } from "react";
import type { Key, FC, ReactNode, HTMLAttributes, MouseEvent, SetStateAction, Dispatch, SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { css, cx } from "@crab-dev/css";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { TreeDragAbortEvent, TreeDragCancelEvent, TreeDragContext, TreeDragEndEvent, TreeDragMoveEvent, TreeDragOverEvent, TreeDragPendingEvent, TreeDragStartEvent } from './drag-types.js';
import { SortableContext } from "@dnd-kit/sortable";
import RcVirtual, { type VirtualHandle } from "@crab-dev/rc-virtual";
import { useAnimatedRows, useKeyDown, useMediaQuery, useControllableValue } from "@crab-dev/rc-hooks";
import token from "./token.js";
import { LoadStateType, NodeType, OverStateEnum, type Node, type OverState } from "./type.js";
import NodeItem, { type NodeItemProps } from "./nodeItem.js";
import { belongsToNode, getDescendantIds, getHalfCheckedKeys, getLoadReadyTreeNodeData, loadDataFunc } from "./util.js";

interface TreeBaseProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onDrag" |
    "onDragCapture" |
    "onDragEnd" |
    "onDragEndCapture" |
    "onDragEnter" |
    "onDragEnterCapture" |
    "onDragExit" |
    "onDragExitCapture" |
    "onDragLeave" |
    "onDragLeaveCapture" |
    "onDragOver" |
    "onDragOverCapture" |
    "onDragStart" |
    "onDragStartCapture" |
    "onContextMenu" |
    "onSelect"
> {

    /**
     * 树组件的数据信息
     */
    treeData: Array<Node>

    /**
     * 高度
     */
    height: number

    /**
     * 宽度
     */
    width: number

    /**
     * 设置节点可拖拽
     */
    draggable?: boolean

    /**
     * 拖拽放置前的校验回调，返回 false 则阻止此次放置。
     * @param param.dragNode 被拖拽的节点
     * @param param.targetNode 放置目标节点
     * @param param.position 放置位置
     */
    allowDrop?: (param: {
        dragNode: Node
        targetNode: Node
        position: OverStateEnum
    }) => boolean

    /**
     * 展开指定的树节点
     */


    /**
     * 选择节点
     */


    /**
     * 是否展示连接线
     */
    showLine?: boolean

    /** 内部控件尺寸；省略时继承 ConfigProvider，与节点密度独立。 */
    size?: ConfigSize;
    /** 节点与容器密度；省略时继承 ConfigProvider。 */
    density?: ConfigDensity;
    /** 显式默认节点高度，优先于 density 和粗指针自适应默认值。调用方负责触控目标。 */
    defaultNodeHeight?: number

    /**
     * 加载节点信息
     * @param parentNode 父节点, 如果没有父节点, 则表示为 null
     * @returns 返回当前父节点下的节点信息 
     */
    loadData?: (parentNode: Node | null) => Promise<Array<Node>>

    /**
     * 渲染右键菜单
     */
    rendererContextMenu?: (param: {
        node: Node | null,
        hide: () => void
    }) => ReactNode

    /**
     * 展开节点的事件
     */
    onExpandedKeysChange?: (keys: Key[], details: TreeExpandedKeysChangeDetails) => void

    /**
     * 选择节点事件
     */
    onSelectedKeysChange?: (keys: Key[], details: TreeSelectedKeysChangeDetails) => void

    /**
     * 拖拽中止事件
     */
    onDragAbort?: (event: TreeDragAbortEvent, context: TreeDragContext) => void;

    /**
     * 拖拽待定事件
     */
    onDragPending?: (event: TreeDragPendingEvent, context: TreeDragContext) => void;

    /**
     * 拖拽开始事件
     */
    onDragStart?: (event: TreeDragStartEvent, context: TreeDragContext) => void;

    /**
     * 拖拽移动事件
     */
    onDragMove?: (event: TreeDragMoveEvent, context: TreeDragContext) => void;

    /**
     * 拖拽悬停事件
     */
    onDragOver?: (event: TreeDragOverEvent, context: TreeDragContext) => void;

    /**
     * 拖拽结束事件
     */
    onDragEnd?: (event: TreeDragEndEvent, context: TreeDragContext) => void;

    /**
     * 拖拽取消事件
     */
    onDragCancel?: (event: TreeDragCancelEvent, context: TreeDragContext) => void;

    /**
     * 右键点击的时候触发的事件
     */
    onContextMenu?: (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>, node: Node | null) => void;

    /**
     * 是否开启复选框
     */
    checkable?: boolean

    /**
     * 受控的已选中节点 key 列表
     */


    /**
     * 复选框勾选/取消时触发。内部已完成级联计算，halfCheckedKeys 由组件自动计算。
     */
    onCheckedKeysChange?: (keys: Key[], details: TreeCheckedKeysChangeDetails) => void

    /**
     * 过滤树节点。返回 true 则保留该节点（及其所有祖先）；返回 false 则隐藏。
     * 不传时不过滤，显示全部可见节点。
     */
    filterTreeNode?: (node: Node) => boolean

    /**
     * 双击节点标题行时触发。常用于进入 inline 编辑模式。
     */
    onNodeDoubleClick?: (node: Node, event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void

    /**
     * 节点 inline 编辑完成时触发。
     * cancelled=true 表示按 Esc 取消，此时 newTitle 无意义。
     * 调用方应在此回调里更新标题并清除 editState。
     */
    onEditEnd?: (node: Node, newTitle: string, cancelled: boolean) => void
    /**
     * 自定义编辑器渲染函数，替换默认 `<input>`。
     * 消费方负责聚焦管理，调用 `onCommit(value)` 提交，`onCancel()` 取消。
     */
    renderEditInput?: NodeItemProps["renderEditInput"]
    /** 拖拽位置 badge 文字，用于国际化覆盖。默认中文。 */
    dragBadgeLabels?: NodeItemProps["dragBadgeLabels"]

    /**
     * 节点改变时触发的事件
     */
    onTreeNodeChange: Dispatch<SetStateAction<TreeProps["treeData"]>>;
}


export interface TreeSelectedKeysChangeDetails { reason: 'select'; node: Node; event?: SyntheticEvent<HTMLElement>; selected: boolean; }
export interface TreeCheckedKeysChangeDetails { reason: 'check'; node: Node; event?: SyntheticEvent<HTMLElement>; checked: boolean; halfCheckedKeys: Key[]; }
export interface TreeExpandedKeysChangeDetails { reason: 'expand'; node: Node; event?: SyntheticEvent<HTMLElement>; expanded: boolean; }

export type TreeProps = TreeBaseProps
    & ({ selectedKeys: Key[]; defaultSelectedKeys?: never } | { selectedKeys?: undefined; defaultSelectedKeys?: Key[] })
    & ({ checkedKeys: Key[]; defaultCheckedKeys?: never } | { checkedKeys?: undefined; defaultCheckedKeys?: Key[] })
    & ({ expandedKeys: Key[]; defaultExpandedKeys?: never } | { expandedKeys?: undefined; defaultExpandedKeys?: Key[] });

const Tree: FC<TreeProps> = ({
    treeData,
    width,
    height,
    expandedKeys: expandedKeysProp,
    defaultExpandedKeys = [],
    selectedKeys: selectedKeysProp,
    defaultSelectedKeys = [],
    draggable = false,
    showLine,
    size: sizeProp,
    density: densityProp,
    defaultNodeHeight: nodeHeight,
    loadData,
    onTreeNodeChange,
    onExpandedKeysChange,
    rendererContextMenu,
    onDragAbort,
    onDragPending,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    onContextMenu,
    onSelectedKeysChange,
    allowDrop,
    filterTreeNode,
    checkable,
    checkedKeys: checkedKeysProp,
    defaultCheckedKeys = [],
    onCheckedKeysChange,
    onEditEnd,
    renderEditInput,
    dragBadgeLabels,
    onNodeDoubleClick,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    role = 'tree',
    ...restProps
}) => {
    const size = useComponentSize(sizeProp);
    const config = useConfig();
    const density = densityProp ?? config.density;
    const coarsePointer = useMediaQuery('(pointer: coarse)');
    const densityNodeHeight = componentDensityMetrics[density].navigation;
    const defaultNodeHeight = nodeHeight ?? (coarsePointer ? Math.max(densityNodeHeight, 48) : densityNodeHeight);
    const resolveNodeHeight = (node: Pick<Node, 'height'> | null) => node?.height ?? defaultNodeHeight;
    const [selectedKeys, setSelectedKeys] = useControllableValue<Key[], [TreeSelectedKeysChangeDetails]>({ value: selectedKeysProp, defaultValue: defaultSelectedKeys, onValueChange: onSelectedKeysChange });
    const [checkedKeys, setCheckedKeys] = useControllableValue<Key[], [TreeCheckedKeysChangeDetails]>({ value: checkedKeysProp, defaultValue: defaultCheckedKeys, onValueChange: onCheckedKeysChange });
    const [expandedKeys, setExpandedKeys] = useControllableValue<Key[], [TreeExpandedKeysChangeDetails]>({ value: expandedKeysProp, defaultValue: defaultExpandedKeys, onValueChange: onExpandedKeysChange });
    const onSelect = (details: { event?: SyntheticEvent<HTMLElement>; selectedKeys: Key[]; node: Node; isSelect: boolean }) => {
        setSelectedKeys(details.selectedKeys, { reason: 'select', node: details.node, event: details.event, selected: details.isSelect });
    };
    const nodeId = useId();
    // 可变实例状态：选择变化时定位虚拟列表，不参与节点渲染。
    const gridRef = useRef<VirtualHandle>(null);
    const [activeId, setActiveId] = useState<Node['id'] | null>(null);
    const [keyboardEvent] = useKeyDown();
    const [mouseContextMenuNodeTitlePosition, setContextMenuNodeTitlePosition] = useState<number[]>([0, 0]);
    const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false);
    const contextMenuNode = useRef<Node | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const contextMenuDivRef = useRef<HTMLDivElement>(null);
    const [overState, setOverState] = useState<OverState | null>(null);
    // ref 同步追踪最新 overState，让 onDragEnd 在 React 尚未重新渲染时也能读到正确值
    const overStateRef = useRef<OverState | null>(null);
    // 动态 <style> 标签，用 !important 覆盖所有子节点的 cursor，body.style.cursor 会被子节点自身 cursor 覆盖
    const dragCursorStyleRef = useRef<HTMLStyleElement | null>(null);

    useEffect(() => {
        if (loadData) {
            loadDataFunc({
                parentNode: null,
                loadData,
                expandedKeys
            }).then((nodes) => {
                onTreeNodeChange?.(nodes)
            });
        }

        const onClick = (event: globalThis.MouseEvent) => {
            if (!contextMenuDivRef.current?.contains(event.target as globalThis.Node)) {
                contextMenuNode.current = null;
                setIsOpenContextMenu(false);
            }
        }
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
            dragCursorStyleRef.current?.remove();
            dragCursorStyleRef.current = null;
        }
    }, [])


    const hide = () => {
        setIsOpenContextMenu(false);
    }

    const getDisplayedNodes = (nodes: Node[]) => {
        return getLoadReadyTreeNodeData(null, nodes);;
    }

    let activeNode: Node | null = null;
    // 昂贵计算：大型树的筛选会重复遍历祖先关系，保留缓存避免无关拖拽状态触发重算。
    const displayedNodes = useMemo(() => {
        const visibleData = filterTreeNode
            ? treeData.filter(node =>
                filterTreeNode(node) ||
                treeData.some(other => filterTreeNode(other) && belongsToNode(node, other))
            )
            : treeData;

        const _displayedNodes: Node[] = [];
        visibleData.forEach((node) => {
            if (node.parent === null || expandedKeys?.includes(node.parent.id)) {
                _displayedNodes.push(node);
                if (activeId === node.id) {
                    activeNode = node;
                }
            }
        });
        return getDisplayedNodes(_displayedNodes);
    }, [treeData, expandedKeys, filterTreeNode]);

    const motionRows = useAnimatedRows(displayedNodes, {
        keyFor: node => node.id,
        sizeFor: resolveNodeHeight,
        trigger: JSON.stringify(expandedKeys),
        rootRef: divRef,
        motionProperty: '--tree-row-motion',
        enabled: activeId === null && !filterTreeNode,
    });
    const selectedId = selectedKeys[selectedKeys.length - 1];
    const selectedIndex = displayedNodes.findIndex(node => node.id === selectedId);
    useEffect(() => {
        const rowIndex = motionRows.findIndex(row => row.key === selectedId && !row.exiting);
        if (height > 0 && rowIndex >= 0) gridRef.current?.scrollToCell({ rowIndex });
    }, [height, selectedIndex]);

    const onExpanded: NonNullable<NodeItemProps["onExpanded"]> = (e) => {
        if (e.node.loadState === LoadStateType.UNLOADED && !expandedKeys?.includes(e.node.id)) {
            onTreeNodeChange(oldNodes => {
                return oldNodes.map(element =>
                    element.id === e.node.id
                        ? { ...element, loadState: LoadStateType.LOADING }
                        : element
                );
            })

            loadDataFunc({
                parentNode: e.node,
                loadData,
                expandedKeys
            }).then((nodes) => {
                onTreeNodeChange((oldNodes) => {
                    return [
                        ...oldNodes.map(element =>
                            element.id === e.node.id
                                ? { ...element, loadState: LoadStateType.LOADING_COMPLETED }
                                : element
                        ),
                        ...nodes
                    ];
                })
            });
        }
        const expanded = !expandedKeys.includes(e.node.id);
        setExpandedKeys(expanded ? [...expandedKeys, e.node.id] : expandedKeys.filter(key => key !== e.node.id), { reason: 'expand', node: e.node, event: e.event, expanded });
    }

    const handleCheck = (node: Node, checked: boolean, event?: SyntheticEvent<HTMLElement>) => {
        const descendants = getDescendantIds(node, treeData);
        let newCheckedKeys: Key[];
        if (checked) {
            newCheckedKeys = [...new Set([...checkedKeys, node.id, ...descendants])];
        } else {
            const ancestors: Key[] = [];
            let p: Node | null = node.parent;
            while (p != null) {
                ancestors.push(p.id);
                p = p.parent;
            }
            const removeIds = new Set([node.id, ...descendants, ...ancestors]);
            newCheckedKeys = checkedKeys.filter(k => !removeIds.has(k));
        }
        const halfCheckedKeys = getHalfCheckedKeys(newCheckedKeys as Node["id"][], treeData);
        setCheckedKeys(newCheckedKeys, { reason: 'check', halfCheckedKeys, node, checked, event });
    };

    const getLeftAndTop = () => {
        const rect = divRef.current?.getBoundingClientRect()
        if (rect) {
            return [rect.left, rect.top]
        } else {
            return [0, 0]
        }
    }

    const [divLeft, divTop] = getLeftAndTop();

    const dragStartPosition = useRef<{
        x: number
        y: number
    }>({
        x: 0,
        y: 0
    })

    const getContextMenuPosition = (x: number, y: number) => {
        let nY = y;
        let nX = x;
        const contextMenuDiv = contextMenuDivRef.current?.getBoundingClientRect();
        if (contextMenuDiv && contextMenuDiv.height + y > window.innerHeight) {
            nY = y - contextMenuDiv.height;
        }

        if (contextMenuDiv && contextMenuDiv.width + x > window.innerWidth) {
            nX = x - contextMenuDiv.width;
        }
        return {
            x: nX,
            y: nY
        }
    }


    // Keep the virtual offsets and rendered rows in agreement when input mode changes.
    const gridTemplateRows = motionRows.map(row => row.size);

    return (
        <DndContext
            onDragAbort={(event) => {
                onDragAbort?.(event, {
                    overState
                })
            }}
            onDragPending={(event) => {
                onDragPending?.(event, {
                    overState
                })
            }}
            onDragStart={(event) => {
                setActiveId(event.active.id);
                const activatorEvent = event.activatorEvent as PointerEvent;
                dragStartPosition.current.x = activatorEvent.clientX;
                dragStartPosition.current.y = activatorEvent.clientY;
                activatorEvent.preventDefault();
                onDragStart?.(event, {
                    overState,
                })
            }}
            onDragMove={(event) => {
                if (event.over && event.over.id !== event.active.id) {
                    const rect = event.over.rect;
                    const top = dragStartPosition.current.y + event.delta.y - rect.top
                    const left = dragStartPosition.current.x + event.delta.x - rect.left

                    let nextPosition: OverStateEnum;
                    if (left >= rect.width / 3) {
                        nextPosition = OverStateEnum.INSIDE;
                    } else if (top <= rect.height / 3) {
                        nextPosition = OverStateEnum.UPWARD;
                    } else {
                        nextPosition = OverStateEnum.DOWN;
                    }

                    const dragNode = treeData.find(n => n.id === event.active.id) ?? null;
                    const targetNode = treeData.find(n => n.id === event.over!.id) ?? null;
                    const allowed = dragNode && targetNode && allowDrop
                        ? allowDrop({ dragNode, targetNode, position: nextPosition })
                        : true;

                    if (allowed) {
                        const next = { id: event.over.id, state: nextPosition };
                        overStateRef.current = next;
                        setOverState(next);
                        if (dragCursorStyleRef.current) {
                            dragCursorStyleRef.current.textContent = '';
                        }
                    } else {
                        overStateRef.current = null;
                        setOverState(null);
                        if (!dragCursorStyleRef.current) {
                            dragCursorStyleRef.current = document.createElement('style');
                            document.head.appendChild(dragCursorStyleRef.current);
                        }
                        dragCursorStyleRef.current.textContent = '* { cursor: not-allowed !important; }';
                    }
                } else {
                    overStateRef.current = null;
                    setOverState(null);
                    if (dragCursorStyleRef.current) {
                        dragCursorStyleRef.current.textContent = '';
                    }
                }
                onDragMove?.(event, {
                    overState
                })
            }}
            onDragOver={(event) => {
                onDragOver?.(event, {
                    overState
                })
            }}
            onDragEnd={(event) => {
                const latestOverState = overStateRef.current;
                overStateRef.current = null;
                dragStartPosition.current.x = 0;
                dragStartPosition.current.y = 0;
                setOverState(null);
                if (dragCursorStyleRef.current) {
                    dragCursorStyleRef.current.textContent = '';
                }
                onDragEnd?.(event, {
                    overState: latestOverState
                })
            }}
            onDragCancel={(event) => {
                overStateRef.current = null;
                if (dragCursorStyleRef.current) {
                    dragCursorStyleRef.current.textContent = '';
                }
                onDragCancel?.(event, {
                    overState
                })
            }}
        >
            <SortableContext
                disabled={!draggable}
                items={activeId !== null ? displayedNodes : []}
            >
                <div
                    ref={divRef}
                    tabIndex={0}
                    dir={restProps.dir}
                    role={role}
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                    aria-activedescendant={selectedId != null && selectedIndex >= 0 ? `${nodeId}-${encodeURIComponent(String(selectedId))}` : undefined}
                    className={cx(densityStyles[density], css`
                        display: inline-block;
                        position: relative;
                        --tree-row-motion: ${token.motion.rows.transition};
                        color: ${token.root.color};
                        font-family: ${token.root['font-family']};
                        &:focus-visible { outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']}; outline-offset: ${token.root['outline-offset-focus']}; }
                        /* Paint above positioned selected rows without changing the measured box. */
                        &:focus-visible::after {
                            content: '';
                            position: absolute;
                            inset: 0;
                            z-index: 2;
                            pointer-events: none;
                            outline: inherit;
                            outline-offset: inherit;
                        }
                        @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }
                    `)}
                    onKeyDown={(e) => {
                        // Use the rendered direction, including native dir overrides
                        // and the current Document, so keys follow the visible hierarchy.
                        const isRtl = e.currentTarget.ownerDocument.defaultView?.getComputedStyle(e.currentTarget).direction === 'rtl';
                        const focusedId = selectedKeys[selectedKeys.length - 1];
                        const focusedIndex = focusedId != null
                            ? displayedNodes.findIndex(n => n.id === focusedId)
                            : -1;

                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            for (let i = focusedIndex + 1; i < displayedNodes.length; i++) {
                                const n = displayedNodes[i];
                                if (!n.disabled) {
                                    onSelect?.({ event: e, selectedKeys: [n.id], node: n, isSelect: true });
                                    break;
                                }
                            }
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            for (let i = focusedIndex - 1; i >= 0; i--) {
                                const n = displayedNodes[i];
                                if (!n.disabled) {
                                    onSelect?.({ event: e, selectedKeys: [n.id], node: n, isSelect: true });
                                    break;
                                }
                            }
                        } else if (e.key === (isRtl ? "ArrowLeft" : "ArrowRight")) {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (n.type === NodeType.FOLDER && !expandedKeys?.includes(n.id)) {
                                    onExpanded({ node: n, event: e });
                                }
                            }
                        } else if (e.key === (isRtl ? "ArrowRight" : "ArrowLeft")) {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (n.type === NodeType.FOLDER && expandedKeys?.includes(n.id)) {
                                    onExpanded({ node: n, event: e });
                                } else if (n.parent != null) {
                                    const parentIndex = displayedNodes.findIndex(p => p.id === n.parent!.id);
                                    if (parentIndex >= 0) {
                                        const parent = displayedNodes[parentIndex];
                                        onSelect?.({ event: e, selectedKeys: [parent.id], node: parent, isSelect: true });
                                    }
                                }
                            }
                        } else if (e.key === "Enter") {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (!n.disabled) {
                                    const isSelect = !selectedKeys.includes(n.id);
                                    onSelect?.({ event: e, selectedKeys: isSelect ? [n.id] : [], node: n, isSelect });
                                }
                            }
                        }
                    }}
                    onContextMenu={e => {
                        const x = e.clientX;
                        const y = e.clientY;

                        setContextMenuNodeTitlePosition([x, y]);
                        setIsOpenContextMenu(true);
                        contextMenuNode.current = null;
                        e.preventDefault();
                        onContextMenu?.(e, null);
                    }}
                >
                    <RcVirtual
                        {...restProps}
                        gridRef={gridRef}
                        gridTemplateColumns={[width]}
                        gridTemplateRows={gridTemplateRows}
                        viewportWidth={width}
                        viewportHeight={height}
                        onWheel={() => {
                            setIsOpenContextMenu(false);
                        }}
                        renderRows={(rowRange) => {
                            const nodes: ReactNode[] = [
                                <div
                                    key="__tree-top-padding__"
                                    aria-hidden="true"
                                    className={css`
                                            display: block;
                                            height: var(--crab-rc-virtual-top-padding-height, 0px);
                                            width: 100%;
                                        `}
                                />
                            ];
                            let rowIndex = rowRange[0];

                            const halfCheckedKeys = checkable
                                ? getHalfCheckedKeys(checkedKeys as Node["id"][], treeData)
                                : [];

                            const getNodeItemElement = (node: Node) => {
                                return (
                                    <NodeItem
                                        key={node.id}
                                        id={`${nodeId}-${encodeURIComponent(String(node.id))}`}
                                        node={node}
                                        overState={overState}
                                        selectedKeys={selectedKeys}
                                        size={size}
                                        loading={node.loadState === LoadStateType.LOADING}
                                        expanded={expandedKeys?.includes(node.id) === true}
                                        draggable={draggable}
                                        showLine={showLine}
                                        checkable={checkable}
                                        checked={checkedKeys.includes(node.id)}
                                        indeterminate={halfCheckedKeys.includes(node.id)}
                                        onCheck={(c, event) => handleCheck(node, c, event)}
                                        onEditEnd={onEditEnd}
                                        keyboardFocusRef={divRef}
                                        renderEditInput={renderEditInput}
                                        dragBadgeLabels={dragBadgeLabels}
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            onNodeDoubleClick?.(node, e);
                                        }}
                                        onTitleClick={(e) => {
                                            divRef.current?.focus();
                                            if (keyboardEvent.current?.ctrlKey === true) {
                                                if (selectedKeys.includes(node.id)) {
                                                    const newSelectNodeKeys = selectedKeys.filter(element => element !== node.id);
                                                    onSelect?.({
                                                        event: e,
                                                        selectedKeys: newSelectNodeKeys,
                                                        node: node,
                                                        isSelect: false
                                                    })
                                                } else {
                                                    const nextSelectedKeys = [...selectedKeys, node.id];
                                                    onSelect?.({
                                                        event: e,
                                                        selectedKeys: nextSelectedKeys,
                                                        node: node,
                                                        isSelect: true
                                                    })
                                                }
                                            } else {
                                                if (selectedKeys.includes(node.id)) {
                                                    onSelect?.({
                                                        event: e,
                                                        selectedKeys: [],
                                                        node: node,
                                                        isSelect: false
                                                    })
                                                } else {
                                                    onSelect?.({
                                                        event: e,
                                                        selectedKeys: [node.id],
                                                        node: node,
                                                        isSelect: true
                                                    })
                                                }
                                            }
                                            setIsOpenContextMenu(false);
                                        }}
                                        onExpanded={onExpanded}
                                        onTitleContextMenu={(e) => {
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            setIsOpenContextMenu(true);
                                            const {
                                                x: nX,
                                                y: nY
                                            } = getContextMenuPosition(x, y);
                                            setContextMenuNodeTitlePosition([nX, nY]);
                                            contextMenuNode.current = node;
                                            onContextMenu?.(e, node)
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    />
                                )
                            }

                            for (; rowIndex <= rowRange[1]; rowIndex += 1) {
                                const motionRow = motionRows[rowIndex];
                                if (!motionRow) continue;
                                const node = motionRow.item;
                                nodes.push(
                                    <div
                                        key={node.id}
                                        inert={motionRow.exiting}
                                        aria-hidden={motionRow.exiting || undefined}
                                        data-moving={motionRow.exiting || motionRow.size !== resolveNodeHeight(node) || undefined}
                                        className={css`
                                            white-space: nowrap;
                                            overflow: visible;
                                            &[data-moving] { overflow: clip; }
                                            position: relative;
                                        `}
                                        style={{
                                            height: gridTemplateRows[rowIndex],
                                        }}
                                    >
                                        {getNodeItemElement(node)}
                                    </div>
                                )
                            }
                            nodes.push(
                                <div
                                    key="__tree-bottom-padding__"
                                    aria-hidden="true"
                                    className={css`
                                        display: block;
                                        height: var(--crab-rc-virtual-bottom-padding-height, 0px);
                                        width: 100%;
                                    `}
                                />
                            )
                            return nodes;
                        }}
                    />
                    {activeNode ? (
                        createPortal(
                            <ConfigBoundary>
                                <DragOverlay
                                    className={css`
                                        pointer-events: none;
                                        border-radius: 4px;
                                        box-shadow: ${token["drag-overlay"]["box-shadow"]};
                                    `}
                                >
                                    <NodeItem
                                        loading={false}
                                        node={activeNode}
                                        overState={null}
                                        selectedKeys={[]}
                                        style={{
                                            height: resolveNodeHeight(activeNode),
                                            width: width,
                                            borderRadius: 4,
                                            opacity: 1,
                                        }}
                                        expanded={expandedKeys?.includes((activeNode as Node )?.id) === true}
                                    />
                                </DragOverlay>
                            </ConfigBoundary>,
                            document.body
                        )
                    ): null}

                    <div
                        className={css`
                            z-index: ${token['context-menu']['z-index']};
                            position: absolute;
                            box-shadow: ${token["context-menu"]["box-shadow"]};
                        `}
                        style={{
                            visibility: isOpenContextMenu ? "visible" : "hidden",
                            left: mouseContextMenuNodeTitlePosition[0] - divLeft,
                            top: mouseContextMenuNodeTitlePosition[1] - divTop
                        }}
                        ref={contextMenuDivRef}
                    >
                        {rendererContextMenu?.({
                            node: contextMenuNode.current,
                            hide
                        })}
                    </div>

                </div>
            </SortableContext>
        </DndContext>
    )
}

export default Tree;
