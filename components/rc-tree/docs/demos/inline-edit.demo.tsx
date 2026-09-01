export const meta = {
    title: "Inline 节点编辑",
    description: "双击节点标题进入 inline 编辑模式。默认使用内置 `<input>`；通过 `renderEditInput` 提供自定义编辑器——本例演示带字数限制与实时校验的自定义输入框。`onCommit(value)` 提交，`onCancel()` 取消。",
};

import { type Key, useState, useRef, useEffect } from "react";
import RcTree, { LoadStateType, NodeType, NodeEditStateType, type Node, useTreeData } from "../../src/index.js";

let nextId = 100;

const buildNodes = (): Node[] => {
    const root: Node = { id: "docs", type: NodeType.FOLDER, title: "文档", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const n1: Node = { id: "guide", type: NodeType.FOLDER, title: "使用指南", parent: root, loadState: LoadStateType.LOADING_COMPLETED };
    const n2: Node = { id: "api", type: NodeType.FOLDER, title: "API 参考", parent: root, loadState: LoadStateType.LOADING_COMPLETED };

    const f1: Node = { id: "quick-start", type: NodeType.FILE, title: "快速开始.md", parent: n1, loadState: LoadStateType.LOADING_COMPLETED };
    const f2: Node = { id: "install", type: NodeType.FILE, title: "安装说明.md", parent: n1, loadState: LoadStateType.LOADING_COMPLETED };
    const f3: Node = { id: "tree-api", type: NodeType.FILE, title: "Tree.md", parent: n2, loadState: LoadStateType.LOADING_COMPLETED };
    const f4: Node = { id: "button-api", type: NodeType.FILE, title: "Button.md", parent: n2, loadState: LoadStateType.LOADING_COMPLETED };

    return [root, n1, n2, f1, f2, f3, f4];
};

const MAX_LEN = 20;

interface CustomInputProps {
    defaultValue: string;
    onCommit: (value: string) => void;
    onCancel: () => void;
}

const CustomInput = ({ defaultValue, onCommit, onCancel }: CustomInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(defaultValue);
    const committed = useRef(false);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const commit = (v: string) => {
        if (committed.current) return;
        committed.current = true;
        onCommit(v);
    };

    const cancel = () => {
        if (committed.current) return;
        committed.current = true;
        onCancel();
    };

    const isError = value.trim() === "" || value.length > MAX_LEN;

    return (
        <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem", flex: "1 1 auto", minWidth: 0 }}
            onClick={(e) => e.stopPropagation()}
        >
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !isError) {
                        commit(value.trim());
                        inputRef.current?.blur();
                    } else if (e.key === "Escape") {
                        cancel();
                        inputRef.current?.blur();
                    }
                }}
                onBlur={() => {
                    if (!isError) {
                        commit(value.trim());
                    } else {
                        cancel();
                    }
                }}
                style={{
                    flex: "1 1 auto",
                    minWidth: 0,
                    padding: "0 0.375rem",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                    border: `1px solid ${isError ? "#f5222d" : "#1677ff"}`,
                    borderRadius: "3px",
                    outline: "none",
                    background: "transparent",
                    color: "inherit",
                    boxSizing: "border-box",
                }}
            />
            <span style={{
                fontSize: "0.75rem",
                flexShrink: 0,
                color: value.length > MAX_LEN ? "#f5222d" : "#999",
            }}>
                {value.length}/{MAX_LEN}
            </span>
        </div>
    );
};

const InlineEditDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>(["docs", "guide", "api"]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());

    const handleEditEnd = (node: Node, newTitle: string, cancelled: boolean) => {
        if (cancelled || newTitle.trim() === "") {
            treeDataUtils.update({ ...node, editState: undefined });
        } else {
            treeDataUtils.update({ ...node, title: newTitle.trim(), editState: undefined });
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontSize: "0.875rem", color: "#666", margin: 0 }}>
                双击节点名称进入编辑，<kbd>Enter</kbd> 保存，<kbd>Esc</kbd> 取消。
                自定义编辑器带字数限制（最多 {MAX_LEN} 字），超出或为空时失焦自动取消。
            </p>
            <button
                style={{ alignSelf: "flex-start" }}
                onClick={() => {
                    const newNode: Node = {
                        id: `new-${nextId++}`,
                        type: NodeType.FILE,
                        title: "新文件",
                        parent: null,
                        loadState: LoadStateType.LOADING_COMPLETED,
                        editState: NodeEditStateType.UPDATE,
                    };
                    setTreeData(prev => [...prev, newNode]);
                }}
            >
                + 新建根节点（直接进入编辑）
            </button>
            <RcTree
                height={320}
                width={460}
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
                onNodeDoubleClick={(node) => {
                    if (node.disabled) return;
                    treeDataUtils.update({ ...node, editState: NodeEditStateType.UPDATE });
                }}
                onEditEnd={handleEditEnd}
                renderEditInput={({ defaultValue, onCommit, onCancel }) => (
                    <CustomInput
                        defaultValue={defaultValue}
                        onCommit={onCommit}
                        onCancel={onCancel}
                    />
                )}
            />
        </div>
    );
};

export default InlineEditDemo;
