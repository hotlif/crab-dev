import {
    useEffect,
    useState,
    useRef,
    type Key,
    type FC,
    type ReactNode,
    type HTMLAttributes,
    type MouseEvent,
    type SetStateAction,
    type Dispatch
} from "react";
import {
    createPortal
} from "react-dom";
import { css } from "@linaria/core";
import {
    DndContext,
    DragAbortEvent,
    DragCancelEvent,
    DragEndEvent,
    DragMoveEvent,
    DragOverEvent,
    DragOverlay,
    DragPendingEvent,
    DragStartEvent,
    type UniqueIdentifier
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import RcVirtual from "@crab/rc-virtual";
import { boxShadow, position } from "@crab/styleify";
import {
    useKeyDown
} from "@crab/rc-hooks";
import { LoadStateType, OverStateEnum, type Node } from "./type";
import NodeItem, { type NodeItemProps } from "./nodeItem";
import { getLoadReadyTreeNodeData } from "./util";


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
    treeData: Node[]

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
    loadData?: (parentNode: Node | null) => Promise<Node[]>

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
     * 节点改变时触发的事件
     */
    onTreeNodeChange: Dispatch<SetStateAction<TreeProps["treeData"]>>;
}

interface OverState {
    id: UniqueIdentifier,
    state: OverStateEnum
} 

const Tree: FC<TreeProps> = ({
    treeData,
    width,
    height,
    expandedKeys = [],
    selectKeys = [],
    draggable = false,
    showLine,
    defaultNodeHeight = 24,
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

    useEffect(() => {
        loadData?.(null)
            .then((nodes) => {
                onTreeNodeChange(nodes.map((node, index) => ({...node, priority: node.priority ?? index, path: [node.id]})))
            });
        const onClick = (event: globalThis.MouseEvent) => {
            if (!contextMenuDivRef.current?.contains(event.target as globalThis.Node)) {
                contextMenuNode.current = null;
                setIsOpenContextMenu(false);
            }
        }
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        }
    }, [])


    const hide = () => {
        setIsOpenContextMenu(false);
    }

    const _displayedNodes = treeData.filter(node => node.parent === null || expandedKeys?.includes(node.parent.id))
    const activeNode = _displayedNodes.find(element => element.id === activeId);

    const getDisplayedNodes = (nodes: Node[]) => {
        return getLoadReadyTreeNodeData(null, nodes);;
    }

    const displayedNodes = getDisplayedNodes(_displayedNodes);

    const onExpanded: TreeProps["onExpanded"] = (e) => {
        if (e.node.loadState === LoadStateType.UNLOADED && !expandedKeys?.includes(e.node.id)) {
            onTreeNodeChange(oldNodes => {
                const node = oldNodes.find(element => element.id === e.node.id);
                if (node != null) {
                    node.loadState = LoadStateType.LOADING;
                }
                return oldNodes
            })

            loadData?.(e.node)
            .then((_nodes) => {
                const nodes = _nodes.map((element, index) => ({
                    ...element,
                    parent: e.node,
                    priority: element.priority ?? index + 1,
                    path: [...(e.node.path ?? []), element.id]
                }));

                onTreeNodeChange((oldNodes) => {
                    const nodeIndex = oldNodes.findIndex(element => element.id === e.node.id);
                    const node = oldNodes[nodeIndex];
                    if (node != null) {
                        node.loadState = LoadStateType.LOADING_COMPLETED;
                    }
                    return [...oldNodes, ...nodes]
                })
            });
        }
        _onExpanded?.(e);
    }

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
                    if (left >=  rect.width / 3) {
                        setOverState({
                            id: event.over.id,
                            state: OverStateEnum.INSIDE
                        })
                    } else if (top <= rect.height / 3) {
                        setOverState({
                            id: event.over.id,
                            state: OverStateEnum.UPWARD
                        })
                    } else {
                        setOverState({
                            id: event.over.id,
                            state: OverStateEnum.DOWN
                        })
                    }
                } else {
                    setOverState(null)
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
                dragStartPosition.current.x = 0;
                dragStartPosition.current.y = 0;
                setOverState(null);
                onDragEnd?.(event, {
                    overState
                })
            }}
            onDragCancel={(event) => {
                onDragCancel?.(event, {
                    overState
                })
            }}
        >
             <SortableContext
                disabled={!draggable}
                items={displayedNodes}
            >
                <div
                    ref={divRef}
                    className={css`
                        ${position('relative')}    
                    `}
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
                        gridTemplateColumns={[width]}
                        gridTemplateRows={displayedNodes.map(({ height = defaultNodeHeight }) => height)}
                        viewportWidth={width}
                        viewportHeight={height}
                        onWheel={() => {
                            setIsOpenContextMenu(false);
                        }}
                        renderRows={(rowRange) => {
                            const nodes: ReactNode[] = [];
                            let rowIndex = rowRange[0];
                            if (rowIndex > 0) {
                                rowIndex -= 1;
                            }

                            const getNodeItemElement = (node: Node) => {
                                return (
                                    <NodeItem
                                        key={node.id}
                                        node={node}
                                        overState={node.id === overState?.id ? overState.state : undefined}
                                        selectd={selectKeys.includes(node.id)}
                                        loading={node.loadState === LoadStateType.LOADING}
                                        expanded={expandedKeys?.includes(node.id) === true}
                                        draggable={draggable}
                                        showLine={showLine}
                                        style={{
                                            gridRowStart: rowIndex + 1,
                                        }}
                                        onTitleClick={(e) => {
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
                                        }}
                                        onExpanded={onExpanded}
                                        onTitleContextMenu={(e) => {
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            setContextMenuNodeTitlePosition([x, y]);
                                            setIsOpenContextMenu(true);
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
                                nodes.push(getNodeItemElement(node))
                            }
                            return nodes;
                        }}
                        {...restProps}
                    />
                    {activeNode ? (
                        createPortal(
                            <DragOverlay
                                className={css`
                                    pointer-events: none;
                                    ${boxShadow("sm")};
                                `}
                            >
                                <NodeItem
                                    loading={false}
                                    node={activeNode}
                                    selectd={false}
                                    style={{
                                        height: activeNode.height ?? defaultNodeHeight,
                                        width: width,
                                    }}
                                    expanded={expandedKeys?.includes(activeNode.id) === true}
                                />
                            </DragOverlay>,
                            document.body
                        )
                    ): null}

                    {isOpenContextMenu ? (
                        <div
                            style={{
                                position: 'absolute',
                                visibility: isOpenContextMenu ? 'visible' : 'hidden',
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
                    ) : null}

                </div>
             </SortableContext>
        </DndContext>
    )
}

export default Tree;
