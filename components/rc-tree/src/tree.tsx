import { useEffect, useState, useRef, useMemo } from "react";
import type { Key, FC, ReactNode, HTMLAttributes, MouseEvent, SetStateAction, Dispatch } from "react";
import { createPortal } from "react-dom";
import { css } from "@crab-dev/css";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type {
    DragAbortEvent,
    DragCancelEvent,
    DragEndEvent,
    DragMoveEvent,
    DragOverEvent,
    DragPendingEvent,
    DragStartEvent,
    UniqueIdentifier,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import RcVirtual from "@crab-dev/rc-virtual";
import { useKeyDown } from "@crab-dev/rc-hooks";
import token from "./token.js";
import { LoadStateType, NodeType, OverStateEnum, type Node, type OverState } from "./type.js";
import NodeItem, { type NodeItemProps } from "./nodeItem.js";
import { belongsToNode, getDescendantIds, getHalfCheckedKeys, getLoadReadyTreeNodeData, loadDataFunc } from "./util.js";

interface Context {
    overState: OverState | null
}

export interface TreeProps extends Omit<
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
    expandedKeys?: Key[]

    /**
     * 选择节点
     */
    selectKeys?: Key[]

    /**
     * 是否展示连接线
     */
    showLine?: boolean

    /**
     * 默认节点高度
     */
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
    onExpanded?: NodeItemProps["onExpanded"]

    /**
     * 选择节点事件
     */
    onSelect?: (param: {
        event: MouseEvent<HTMLSpanElement, globalThis.MouseEvent>,
        selectKeys: Key[],
        node: Node,
        isSelect: boolean
    }) => void

    /**
     * 拖拽中止事件
     */
    onDragAbort?: (event: DragAbortEvent, context: Context) => void;

    /**
     * 拖拽待定事件
     */
    onDragPending?: (event: DragPendingEvent, context: Context) => void;

    /**
     * 拖拽开始事件
     */
    onDragStart?: (event: DragStartEvent, context: Context) => void;

    /**
     * 拖拽移动事件
     */
    onDragMove?: (event: DragMoveEvent, context: Context) => void;

    /**
     * 拖拽悬停事件
     */
    onDragOver?: (event: DragOverEvent, context: Context) => void;

    /**
     * 拖拽结束事件
     */
    onDragEnd?: (event: DragEndEvent, context: Context) => void;

    /**
     * 拖拽取消事件
     */
    onDragCancel?: (event: DragCancelEvent, context: Context) => void;

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
    checkedKeys?: Key[]

    /**
     * 复选框勾选/取消时触发。内部已完成级联计算，halfCheckedKeys 由组件自动计算。
     */
    onCheck?: (param: {
        checkedKeys: Key[]
        halfCheckedKeys: Key[]
        node: Node
        checked: boolean
    }) => void

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


const Tree: FC<TreeProps> = ({
    treeData,
    width,
    height,
    expandedKeys = [],
    selectKeys = [],
    draggable = false,
    showLine,
    defaultNodeHeight = 28,
    loadData,
    onTreeNodeChange,
    onExpanded: _onExpanded,
    rendererContextMenu,
    onDragAbort,
    onDragPending,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    onContextMenu,
    onSelect,
    allowDrop,
    filterTreeNode,
    checkable,
    checkedKeys = [],
    onCheck,
    onEditEnd,
    renderEditInput,
    dragBadgeLabels,
    onNodeDoubleClick,
    ...restProps
}) => {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
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

    const onExpanded: TreeProps["onExpanded"] = (e) => {
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
        _onExpanded?.(e);
    }

    const handleCheck = (node: Node, checked: boolean) => {
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
        onCheck?.({ checkedKeys: newCheckedKeys, halfCheckedKeys, node, checked });
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


    const gridTemplateRows = useMemo(() => {
        return displayedNodes.map(({ height = defaultNodeHeight }) => height)
    }, [displayedNodes]);

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
                    className={css`
                        display: inline-block;
                        position: relative;
                        outline: none;
                    `}
                    onKeyDown={(e) => {
                        const focusedId = selectKeys[selectKeys.length - 1];
                        const focusedIndex = focusedId != null
                            ? displayedNodes.findIndex(n => n.id === focusedId)
                            : -1;

                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            for (let i = focusedIndex + 1; i < displayedNodes.length; i++) {
                                const n = displayedNodes[i];
                                if (!n.disabled) {
                                    onSelect?.({ event: e as unknown as MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, selectKeys: [n.id], node: n, isSelect: true });
                                    break;
                                }
                            }
                        } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            for (let i = focusedIndex - 1; i >= 0; i--) {
                                const n = displayedNodes[i];
                                if (!n.disabled) {
                                    onSelect?.({ event: e as unknown as MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, selectKeys: [n.id], node: n, isSelect: true });
                                    break;
                                }
                            }
                        } else if (e.key === "ArrowRight") {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (n.type === NodeType.FOLDER && !expandedKeys?.includes(n.id)) {
                                    onExpanded({ node: n });
                                }
                            }
                        } else if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (n.type === NodeType.FOLDER && expandedKeys?.includes(n.id)) {
                                    onExpanded({ node: n });
                                } else if (n.parent != null) {
                                    const parentIndex = displayedNodes.findIndex(p => p.id === n.parent!.id);
                                    if (parentIndex >= 0) {
                                        const parent = displayedNodes[parentIndex];
                                        onSelect?.({ event: e as unknown as MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, selectKeys: [parent.id], node: parent, isSelect: true });
                                    }
                                }
                            }
                        } else if (e.key === "Enter") {
                            e.preventDefault();
                            if (focusedIndex >= 0) {
                                const n = displayedNodes[focusedIndex];
                                if (!n.disabled) {
                                    const isSelect = !selectKeys.includes(n.id);
                                    onSelect?.({ event: e as unknown as MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, selectKeys: isSelect ? [n.id] : [], node: n, isSelect });
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
                                    className={css`
                                            display: inline-block;
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
                                        node={node}
                                        overState={overState}
                                        selectKeys={selectKeys}
                                        loading={node.loadState === LoadStateType.LOADING}
                                        expanded={expandedKeys?.includes(node.id) === true}
                                        draggable={draggable}
                                        showLine={showLine}
                                        checkable={checkable}
                                        checked={checkedKeys.includes(node.id)}
                                        indeterminate={halfCheckedKeys.includes(node.id)}
                                        onCheck={(c) => handleCheck(node, c)}
                                        onEditEnd={onEditEnd}
                                        renderEditInput={renderEditInput}
                                        dragBadgeLabels={dragBadgeLabels}
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                            onNodeDoubleClick?.(node, e);
                                        }}
                                        onTitleClick={(e) => {
                                            divRef.current?.focus();
                                            if (keyboardEvent.current?.ctrlKey === true) {
                                                if (selectKeys.includes(node.id)) {
                                                    const newSelectNodeKeys = selectKeys.filter(element => element !== node.id);
                                                    onSelect?.({
                                                        event: e,
                                                        selectKeys: newSelectNodeKeys,
                                                        node: node,
                                                        isSelect: false
                                                    })
                                                } else {
                                                    selectKeys.push(node.id);
                                                    onSelect?.({
                                                        event: e,
                                                        selectKeys: [...selectKeys],
                                                        node: node,
                                                        isSelect: true
                                                    })
                                                }
                                            } else {
                                                if (selectKeys.includes(node.id)) {
                                                    onSelect?.({
                                                        event: e,
                                                        selectKeys: [],
                                                        node: node,
                                                        isSelect: false
                                                    })
                                                } else {
                                                    onSelect?.({
                                                        event: e,
                                                        selectKeys: [node.id],
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
                                const node = displayedNodes[rowIndex];
                                nodes.push(
                                    <div
                                        key={node.id}
                                        className={css`
                                            white-space: nowrap;
                                            overflow: visible;
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
                                    className={css`
                                        display: inline-block;
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
                            <DragOverlay
                                className={css`
                                    pointer-events: none;
                                    border-radius: 4px;
                                    box-shadow:
                                        0 0 0 1px rgba(0,0,0,0.06),
                                        0 4px 8px rgba(0,0,0,0.1),
                                        0 8px 16px rgba(0,0,0,0.08);
                                `}
                            >
                                <NodeItem
                                    loading={false}
                                    node={activeNode}
                                    overState={null}
                                    selectKeys={[]}
                                    style={{
                                        height: (activeNode as Node)?.height ?? defaultNodeHeight,
                                        width: width,
                                        borderRadius: 4,
                                        opacity: 1,
                                    }}
                                    expanded={expandedKeys?.includes((activeNode as Node )?.id) === true}
                                />
                            </DragOverlay>,
                            document.body
                        )
                    ): null}

                    <div
                        className={css`
                            z-index: ${token['context-menu']['z-index']};
                            position: absolute;
                            box-shadow: 0 6px 10px rgba(0,0,0,0.035), 0 6px 16px rgba(0,0,0,0.045);
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
