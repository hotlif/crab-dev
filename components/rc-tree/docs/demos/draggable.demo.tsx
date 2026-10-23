import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { treeMeasureStyle } from "../demo-layout.js";
export const meta = {
    title: "拖拽排序",
    description: "通过 `draggable` 属性启用拖拽功能，支持节点的拖拽排序和层级调整。",
};

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, getTreeNodeDepth, useTreeData } from "../../src/index.js";

const contextActionsStyle = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${token.space["inline-gap"]};
    min-width: calc(${token.size["touch-target"]} * 4);
    padding: ${token.space["component-gap"]};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.overlay};
    color: ${token.color.text.primary};
    box-shadow: ${token.shadow.overlay};
`;

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
        <AutoSizer disableHeight className={treeMeasureStyle}>
            {({ width }) => (
                <RcTree
                    height={400}
                    width={Math.min(width, 300)}
                    treeData={treeData}
                    draggable
                    onTreeNodeChange={setTreeData}
                    expandedKeys={expandedKeys}
                    selectKeys={selectKeys}
                    onSelect={({ selectKeys }: { selectKeys: Key[] }) => {
                        setSelectKeys(selectKeys);
                    }}
                    rendererContextMenu={({ node, hide }: { node: Node | null, hide: () => void }) => (
                        <div className={contextActionsStyle} role="group" aria-label="节点操作">
                            <Button appearance="text" disabled title="本示例仅演示删除和刷新">添加</Button>
                            <Button appearance="text" danger disabled={node === null} onClick={() => {
                                if (node !== null) treeDataUtils.delete(node.id);
                                hide();
                            }}>删除</Button>
                            <Button appearance="text" onClick={() => {
                                treeDataUtils.reloadChildrenByParent({ parent: node, loadData, expandedKeys });
                                hide();
                            }}>{node === null ? "刷新所有节点" : "刷新子节点数据"}</Button>
                        </div>
                    )}
                    // wake-lint-disable-next-line ts/no-explicit-any -- Existing test mock boundary.
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
            )}
        </AutoSizer>
    );
};

export default DraggableDemo;
