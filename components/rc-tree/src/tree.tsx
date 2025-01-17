import { type Key, useEffect, useState, type FC, type ReactNode, HTMLAttributes, useRef } from "react";
import { createPortal } from "react-dom";
import { css } from "@linaria/core";
import { DndContext, DragOverlay, type UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import RcVirtual from "@crab/rc-virtual";
import { boxShadow, position } from "@crab/styleify";
import {
    useKeyDown
} from "@crab/rc-hooks";
import { LoadStateType, type Node } from "./type";
import NodeItem, { type NodeItemProps } from "./nodeItem";
import { getLoadReadyTreeNodeData, getTreeNodeDepth } from "./util";

export interface TreeProps extends HTMLAttributes<HTMLDivElement>{

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
     * 默认节点高度
     */
    defaultNodeHeight?: number

    /**
     * 缩进宽度
     */
    indentSize?: number;

    /**
     * 是否启用初始化组件的时候就开始加载数据, 默认情况下第一次会加载数据
     */
    enableFirstLoadData?: boolean

    /**
     * 加载节点信息
     * @param parentNode 父节点, 如果没有父节点, 则表示为 null
     * @returns 返回当前父节点下的节点信息 
     */
    loadData: (parentNode: Node | null) => Promise<Node[]>

    /**
     * 渲染右键菜单
     */
    rendererContextMenu?: (node: Node | null) => ReactNode

    /**
     * 展开节点的事件
     */
    onExpanded?: NodeItemProps["onExpanded"]
}

const Tree: FC<TreeProps> = ({
    width,
    height,
    expandedKeys = [],
    enableFirstLoadData = true,
    draggable = false,
    defaultNodeHeight = 24,
    indentSize = 24,
    loadData,
    onExpanded: _onExpanded,
    rendererContextMenu,
    ...restProps
}) => {
    const [loadReadyNodeData, setLoadReadyNodeData] = useState<Node[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [selectNodeKeys, setSelectNodeKeys] = useState<Key[]>([])
    const [keyboardEvent] = useKeyDown();
    const [mouseContextMenuNodeTitlePosition, setContextMenuNodeTitlePosition] = useState<number[]>([0, 0]);
    const [isOpenContextMenu, setIsOpenContextMenu] = useState<boolean>(false);
    const contextMenuNode = useRef<Node | null>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const contextMenuDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (enableFirstLoadData === true) {
            loadData(null)
                .then((nodes) => {
                    setLoadReadyNodeData(nodes.map(node => ({...node, path: []})))
                });
        }
        const onClick = (event: MouseEvent) => {
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

    const _displayedNodes = loadReadyNodeData.filter(node => node.parent === null || expandedKeys?.includes(node.parent.id))
    const activeNode = _displayedNodes.find(element => element.id === activeId);

    const getDisplayedNodes = (nodes: Node[]) => {
        return getLoadReadyTreeNodeData(null, nodes);;
    }

    const displayedNodes = getDisplayedNodes(_displayedNodes);

    const onExpanded: TreeProps["onExpanded"] = (e) => {
        if (e.node.loadState === LoadStateType.UNLOADED && !expandedKeys?.includes(e.node.id)) {
            setLoadReadyNodeData(oldNodes => {
                const node = oldNodes.find(element => element.id === e.node.id);
                if (node != null) {
                    node.loadState = LoadStateType.LOADING;
                }
                return oldNodes
            })
            loadData(e.node)
            .then((nodes) => {
                setLoadReadyNodeData((oldNodes) => {
                    const node = oldNodes.find(element => element.id === e.node.id);
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
    return (
        <DndContext
            onDragEnd={(event) => {
                const { active, over } = event;
                if (!over) return;
                const oldIndex = loadReadyNodeData.findIndex(node => node.id === active.id);
                const newIndex = loadReadyNodeData.findIndex(node => node.id === over.id);
            }}
            onDragStart={({
                active,
                activatorEvent
            }) => {
                setActiveId(active.id);
                activatorEvent.preventDefault();
            }}
        >
             <SortableContext disabled={!draggable} items={displayedNodes}>
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
                            for (; rowIndex <= rowRange[1]; rowIndex += 1) {
                                const node = displayedNodes[rowIndex];
                                nodes.push((
                                    <NodeItem
                                        key={node.id}
                                        node={node}
                                        selectd={selectNodeKeys.includes(node.id)}
                                        loading={node.loadState === LoadStateType.LOADING}
                                        expanded={expandedKeys?.includes(node.id) === true}
                                        draggable={draggable}
                                        style={{
                                            gridRowStart: rowIndex + 1,
                                            paddingLeft: getTreeNodeDepth(node) * indentSize,
                                        }}
                                        onTitleClick={() => {
                                            if (keyboardEvent.current?.ctrlKey === true) {
                                                if (selectNodeKeys.includes(node.id)) {
                                                    const newSelectNodeKeys = selectNodeKeys.filter(element => element !== node.id);
                                                    setSelectNodeKeys?.(newSelectNodeKeys)
                                                } else {
                                                    selectNodeKeys.push(node.id);
                                                    setSelectNodeKeys?.([...selectNodeKeys])
                                                }
                                            } else {
                                                setSelectNodeKeys?.([node.id])
                                            }
                                        }}
                                        onExpanded={onExpanded}
                                        onTitleContextMenu={(e) => {
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            setContextMenuNodeTitlePosition([x, y]);
                                            setIsOpenContextMenu(true);
                                            contextMenuNode.current = node;
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                    />
                                ))
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

                    <div
                        style={{
                            position: 'absolute',
                            visibility: isOpenContextMenu ? 'visible' : 'hidden',
                            left: mouseContextMenuNodeTitlePosition[0] - divLeft,
                            top: mouseContextMenuNodeTitlePosition[1] - divTop
                        }}
                        ref={contextMenuDivRef}
                    >
                        {rendererContextMenu?.(contextMenuNode.current)}
                    </div>
                </div>
             </SortableContext>
        </DndContext>
    )
}

export default Tree;
