/**
 * title = "拖拽排序"
 * description = "通过 `draggable` 属性启用拖拽功能，支持节点的拖拽排序和层级调整。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData } from "../../src/index.js";

const DraggableDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData();

    const loadData = (parentNode: Node | null) => {
        if (parentNode === null) {
            const nodes: Node[] = [];
            for (let i = 1; i < 2; i += 1) {
                nodes.push({
                    id: i,
                    type: NodeType.FOLDER,
                    title: `节点 ${i}`,
                    parent: null,
                    loadState: LoadStateType.UNLOADED,
                });
            }
            return new Promise<Node[]>((resolve) => {
                resolve(nodes);
            });
        } else {
            const depth = getTreeNodeDepth(parentNode);
            if (depth <= 10) {
                return new Promise<Node[]>((resolve) => {
                    setTimeout(() => {
                        const data: Node[] = [];
                        for (let i = 0; i < 2065; i += 1) {
                            if (i % 9 === 0) {
                                data.push({
                                    id: `${parentNode.id}-${i}`,
                                    type: NodeType.FOLDER,
                                    title: `节点 - ${parentNode.id} - ${i} 这是一个非常非常非常长的节点信息`,
                                    parent: parentNode,
                                    loadState: LoadStateType.UNLOADED,
                                });
                            } else {
                                data.push({
                                    id: `${parentNode.id}-${i}`,
                                    type: NodeType.FOLDER,
                                    title: `节点 - ${parentNode.id} - ${i}`,
                                    parent: parentNode,
                                    loadState: LoadStateType.UNLOADED,
                                });
                            }
                        }
                        resolve(data);
                    }, 0);
                });
            }
            return new Promise<Node[]>((resolve) => {
                resolve([]);
            });
        }
    };

    return (
        <RcTree
            height={400}
            width={300}
            treeData={treeData}
            draggable
            onTreeNodeChange={setTreeData}
            expandedKeys={expandedKeys}
            selectKeys={selectKeys}
            onSelect={({ selectKeys }: { selectKeys: Key[] }) => {
                setSelectKeys(selectKeys);
            }}
            rendererContextMenu={({ node, hide }: { node: Node | null, hide: () => void }) => {
                if (node === null) {
                    return (
                        <div
                            style={{
                                backgroundColor: "red",
                                padding: "1rem",
                            }}
                        >
                            <button disabled>添加</button>
                            <br />
                            <button disabled>删除</button>
                            <br />
                            <button
                                onClick={() => {
                                    treeDataUtils.reloadChildrenByParent({
                                        parent: null,
                                        loadData,
                                        expandedKeys,
                                    });
                                    hide();
                                }}
                            >
                                刷新所有节点
                            </button>
                        </div>
                    );
                }
                return (
                    <div
                        style={{
                            backgroundColor: "red",
                            padding: "1rem",
                        }}
                    >
                        <button>添加</button>
                        <br />
                        <button
                            onClick={() => {
                                treeDataUtils.delete(node.id);
                                hide();
                            }}
                        >
                            删除
                        </button>
                        <br />
                        <button
                            onClick={() => {
                                treeDataUtils.reloadChildrenByParent({
                                    parent: node,
                                    loadData,
                                    expandedKeys,
                                });
                                hide();
                            }}
                        >
                            刷新子节点数据
                        </button>
                    </div>
                );
            }}
            onDragEnd={(event: any, context: any) => {
                const over = event.over;
                const active = event.active;
                if (context.overState?.state != null) {
                    treeDataUtils.moveNodeOnDrag(active!.id, over!.id, context.overState.state);
                }
            }}
            onExpanded={({ node }: { node: Node }) => {
                if (expandedKeys.includes(node.id)) {
                    const keys = expandedKeys.filter((element) => element !== node.id);
                    setExpandedKeys(keys);
                } else {
                    expandedKeys.push(node.id);
                    setExpandedKeys([...expandedKeys]);
                }
            }}
            loadData={loadData}
        />
    );
};

export default DraggableDemo;
