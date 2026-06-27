/**
 * title = "拖拽限制 allowDrop"
 * description = "通过 `allowDrop` 回调控制节点的放置规则。本示例禁止将节点拖入任意文件夹内部（只允许排序），演示如何过滤 INSIDE 放置位置。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, OverStateEnum, type Node, type TreeProps, useTreeData } from "../../src/index.js";

const buildNodes = (): Node[] => {
    const nodes: Node[] = [];
    for (let i = 1; i <= 5; i++) {
        const folder: Node = {
            id: `folder-${i}`,
            type: NodeType.FOLDER,
            title: `文件夹 ${i}`,
            parent: null,
            loadState: LoadStateType.LOADING_COMPLETED,
            priority: i,
        };
        nodes.push(folder);
        for (let j = 1; j <= 3; j++) {
            nodes.push({
                id: `file-${i}-${j}`,
                type: NodeType.FILE,
                title: `文件 ${i}-${j}`,
                parent: folder,
                loadState: LoadStateType.LOADING_COMPLETED,
                priority: j,
            });
        }
    }
    return nodes;
};

const AllowDropDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>(["folder-1", "folder-2"]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>
                当前规则：禁止拖入文件夹内（INSIDE），只允许同级排序。
            </p>
            <RcTree
                height={360}
                width={400}
                treeData={treeData}
                draggable
                onTreeNodeChange={setTreeData}
                expandedKeys={expandedKeys}
                selectKeys={selectKeys}
                allowDrop={({ position }) => position !== OverStateEnum.INSIDE}
                onSelect={({ selectKeys: keys }: { selectKeys: Key[] }) => setSelectKeys(keys)}
                onExpanded={({ node }: { node: Node }) => {
                    setExpandedKeys(prev =>
                        prev.includes(node.id)
                            ? prev.filter(k => k !== node.id)
                            : [...prev, node.id]
                    );
                }}
                onDragEnd={((event, context) => {
                    if (context.overState?.state != null && event.over) {
                        treeDataUtils.moveNodeOnDrag(event.active.id, event.over.id, context.overState.state);
                    }
                }) as TreeProps["onDragEnd"]}
            />
        </div>
    );
};

export default AllowDropDemo;
