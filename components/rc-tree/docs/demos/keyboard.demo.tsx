export const meta = {
    title: "键盘导航",
    description: "点击树组件后可使用键盘操作：`↑↓` 移动焦点，`→` 展开文件夹，`←` 折叠文件夹或跳转到父节点，`Enter` 选中/取消选中当前节点。",
};

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "../../src/index.js";

const buildNodes = (): Node[] => {
    const root1: Node = { id: "r1", type: NodeType.FOLDER, title: "文档", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const root2: Node = { id: "r2", type: NodeType.FOLDER, title: "图片", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const root3: Node = { id: "r3", type: NodeType.FOLDER, title: "视频", parent: null, loadState: LoadStateType.LOADING_COMPLETED };

    const r1c1: Node = { id: "r1c1", type: NodeType.FOLDER, title: "工作", parent: root1, loadState: LoadStateType.LOADING_COMPLETED };
    const r1c2: Node = { id: "r1c2", type: NodeType.FOLDER, title: "学习", parent: root1, loadState: LoadStateType.LOADING_COMPLETED };

    const r1c1f1: Node = { id: "r1c1f1", type: NodeType.FILE, title: "季度报告.docx", parent: r1c1, loadState: LoadStateType.LOADING_COMPLETED };
    const r1c1f2: Node = { id: "r1c1f2", type: NodeType.FILE, title: "项目计划.xlsx", parent: r1c1, loadState: LoadStateType.LOADING_COMPLETED };
    const r1c2f1: Node = { id: "r1c2f1", type: NodeType.FILE, title: "React 笔记.md", parent: r1c2, loadState: LoadStateType.LOADING_COMPLETED };

    const r2f1: Node = { id: "r2f1", type: NodeType.FILE, title: "头像.png", parent: root2, loadState: LoadStateType.LOADING_COMPLETED };
    const r2f2: Node = { id: "r2f2", type: NodeType.FILE, title: "封面.jpg", parent: root2, loadState: LoadStateType.LOADING_COMPLETED };

    const r3f1: Node = { id: "r3f1", type: NodeType.FILE, title: "录屏.mp4", parent: root3, loadState: LoadStateType.LOADING_COMPLETED };

    return [root1, root2, root3, r1c1, r1c2, r1c1f1, r1c1f2, r1c2f1, r2f1, r2f2, r3f1];
};

const KeyboardDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useTreeData(buildNodes());

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{
                padding: "0.625rem 0.75rem",
                borderRadius: "6px",
                background: "#f5f5f5",
                fontSize: "0.8125rem",
                color: "#555",
                lineHeight: 1.6,
            }}>
                <strong>键盘快捷键：</strong>&nbsp;
                <kbd>↑</kbd><kbd>↓</kbd> 移动焦点 &nbsp;
                <kbd>→</kbd> 展开 &nbsp;
                <kbd>←</kbd> 折叠 / 跳父节点 &nbsp;
                <kbd>Enter</kbd> 选中
            </div>
            <RcTree
                height={300}
                width={400}
                treeData={treeData}
                onTreeNodeChange={setTreeData}
                expandedKeys={expandedKeys}
                selectKeys={selectKeys}
                onSelect={({ selectKeys: keys }: { selectKeys: Key[] }) => setSelectKeys(keys)}
                onExpanded={({ node }: { node: Node }) => {
                    setExpandedKeys(prev =>
                        prev.includes(node.id)
                            ? prev.filter(k => k !== node.id)
                            : [...prev, node.id]
                    );
                }}
            />
            {selectKeys.length > 0 && (
                <p style={{ fontSize: "0.875rem", margin: 0, color: "#666" }}>
                    已选中：{selectKeys.join(", ")}
                </p>
            )}
        </div>
    );
};

export default KeyboardDemo;
