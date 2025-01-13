import { type Key, useEffect, useState, type FC, type ReactNode, HTMLAttributes } from "react";
import RcVirtual from "@crab/rc-virtual";
import { createPortal } from "react-dom";
import { css } from "@linaria/core";
import { DndContext, DragOverlay, type UniqueIdentifier } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { boxShadow } from "@crab/styleify";
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
     * 搜索
     * @param keyword 根据关键字搜索节点
     * @returns 返回对应搜索的节点信息
     */
    onSearch?: (keyword: string) => Promise<Node[]>

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
    onSearch,
    onExpanded: _onExpanded,
    ...restProps
}) => {
    const [loadReadyNodeData, setLoadReadyNodeData] = useState<Node[]>([]);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [loadingNodeKeys, setLoadingNodeKeys] = useState<Key[]>([])
    useEffect(() => {
        if (enableFirstLoadData === true) {
            loadData(null)
                .then((nodes) => {
                    setLoadReadyNodeData([...loadReadyNodeData, ...nodes])
                });
        }
    }, [])

    const _displayedNodes = loadReadyNodeData.filter(node => node.parent === null || expandedKeys?.includes(node.parent.id))
    const activeNode = _displayedNodes.find(element => element.id === activeId);

    const getDisplayedNodes = (nodes: Node[]) => {
        const [rootNodes, childNodes] = getLoadReadyTreeNodeData(nodes);
        const resultDisplayedNodes: Node[] = [];
        rootNodes.forEach(element => {
            const elementNodes = childNodes.find(node => node?.[0]?.parent?.id === element.id);
            resultDisplayedNodes.push(element);
            if (elementNodes != null) {
                resultDisplayedNodes.push(...elementNodes);
            }
        })
        return resultDisplayedNodes;
    }

    const displayedNodes = getDisplayedNodes(_displayedNodes);

    const onExpanded: TreeProps["onExpanded"] = (e) => {
        if (e.node.loadState === LoadStateType.UNLOADED && !expandedKeys?.includes(e.node.id)) {
            loadData(e.node)
            .then((nodes) => {
                e.node.loadState = LoadStateType.LOADING_COMPLETED;
                setLoadReadyNodeData([...loadReadyNodeData, ...nodes])
            });
        }
        _onExpanded?.(e);
    }

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
                <RcVirtual
                    gridTemplateColumns={[width]}
                    gridTemplateRows={displayedNodes.map(({ height = defaultNodeHeight }) => height)}
                    viewportWidth={width}
                    viewportHeight={height}
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
                                    loading={false}
                                    expanded={expandedKeys?.includes(node.id) === true}
                                    draggable={draggable}
                                    style={{
                                        gridRowStart: rowIndex + 1,
                                        paddingLeft: getTreeNodeDepth(node) * indentSize
                                    }}
                                    onExpanded={onExpanded}

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
             </SortableContext>
        </DndContext>
    )
}

export default Tree;
