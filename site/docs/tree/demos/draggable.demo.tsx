/**
 * title = "拖拽排序"
 * description = "通过 `draggable` 属性启用拖拽功能，支持节点的拖拽排序和层级调整。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData } from "@crab-dev/rc-tree";

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
            return Promise.resolve(nodes);
        }

        const depth = getTreeNodeDepth(parentNode);
        if (depth <= 3) {
            return new Promise<Node[]>((resolve) => {
                setTimeout(() => {
                    const data: Node[] = [];
                    for (let i = 0; i < 5; i += 1) {
                        data.push({
                            id: `${parentNode.id}-${i}`,
                            type: NodeType.FOLDER,
                            title: `节点 - ${parentNode.id} - ${i}`,
                            parent: parentNode,
                            loadState: LoadStateType.UNLOADED,
                        });
                    }
                    resolve(data);
                }, 0);
            });
        }
        return Promise.resolve([]);
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
