/**
 * title = "显示连接线"
 * description = "通过 `showLine` 属性展示树节点之间的连接线。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "@crab-dev/rc-tree";

const ShowLineDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useTreeData();

    const loadData = (parentNode: Node | null) => {
        if (parentNode === null) {
            const nodes: Node[] = [];
            for (let i = 1; i <= 4; i += 1) {
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

        return new Promise<Node[]>((resolve) => {
            setTimeout(() => {
                const children: Node[] = [];
                for (let i = 0; i < 3; i += 1) {
                    children.push({
                        id: `${parentNode.id}-${i}`,
                        type: NodeType.FOLDER,
                        title: `子节点 ${parentNode.id}-${i}`,
                        parent: parentNode,
                        loadState: LoadStateType.UNLOADED,
                    });
                }
                resolve(children);
            }, 300);
        });
    };

    return (
        <RcTree
            height={300}
            width={400}
            showLine
            treeData={treeData}
            onTreeNodeChange={setTreeData}
            expandedKeys={expandedKeys}
            selectKeys={selectKeys}
            onSelect={({ selectKeys }: { selectKeys: Key[] }) => {
                setSelectKeys(selectKeys);
            }}
            onExpanded={({ node }: { node: Node }) => {
                if (expandedKeys.includes(node.id)) {
                    setExpandedKeys(expandedKeys.filter((key) => key !== node.id));
                } else {
                    setExpandedKeys([...expandedKeys, node.id]);
                }
            }}
            loadData={loadData}
        />
    );
};

export default ShowLineDemo;
