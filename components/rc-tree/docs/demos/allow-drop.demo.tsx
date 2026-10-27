import AutoSizer from "@crab-dev/rc-auto-sizer";
import { treeMeasureStyle, demoStackStyle, demoNoteStyle } from "../demo-layout.js";
export const meta = {
    title: "拖拽限制 allowDrop",
    description: "通过 `allowDrop` 回调控制节点的放置规则。本示例只允许同级排序：禁止 INSIDE（移入子节点），也禁止跨层级的 DOWN/UPWARD（那样会改变父节点）。",
};

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
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());

    return (
        <div className={demoStackStyle}>
            <p className={demoNoteStyle}>
                当前规则：只允许同级排序，禁止跨层级移动（拖入文件夹或移出文件夹）。
            </p>
            <AutoSizer disableHeight className={treeMeasureStyle}>
                {({ width }) => (
                    <RcTree
                        height={360}
                        width={Math.min(width, 400)}
                        treeData={treeData}
                        draggable
                        onTreeNodeChange={setTreeData}
                        expandedKeys={expandedKeys}
                        selectedKeys={selectedKeys}
                        allowDrop={({ position, dragNode, targetNode }) => {
                            if (position === OverStateEnum.INSIDE) return false;
                            // DOWN/UPWARD 会把 dragNode.parent 设为 targetNode.parent
                            // 只有同层级（相同 parent）才允许排序，避免跨文件夹移动
                            const dragParentId = dragNode.parent?.id ?? null;
                            const targetParentId = targetNode.parent?.id ?? null;
                            return dragParentId === targetParentId;
                        }}
                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}
                        onExpandedKeysChange={setExpandedKeys}
                        onDragEnd={((event, context) => {
                            if (context.overState?.state != null && event.over) {
                                treeDataUtils.moveNodeOnDrag(event.active.id, event.over.id, context.overState.state);
                            }
                        }) as TreeProps["onDragEnd"]}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

export default AllowDropDemo;
