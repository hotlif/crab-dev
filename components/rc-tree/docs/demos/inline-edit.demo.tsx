import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import { css, cx } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { treeMeasureStyle, demoStackStyle, demoNoteStyle } from "../demo-layout.js";
export const meta = {
    title: "Inline 节点编辑",
    description: "双击节点标题进入 inline 编辑模式。本例通过 renderEditInput 复用 LineEdit，演示字数限制与实时校验。onCommit(value) 提交，onCancel() 取消。",
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

const editorStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.space["inline-gap"]};
    flex: 1 1 auto;
    min-width: 0;
`;
const inputStyle = css`flex: 1 1 auto; min-width: 0;`;
const countStyle = css`font-size: ${token.font.size.caption}; flex-shrink: 0; color: ${token.color.text.secondary};`;
const errorCountStyle = css`color: ${token.color.feedback.error.text};`;
const createButtonStyle = css`align-self: flex-start;`;

interface CustomInputProps {
    defaultValue: string;
    onCommit: (value: string) => void;
    onCancel: () => void;
}

const CustomInput = ({ defaultValue, onCommit, onCancel }: CustomInputProps) => {
    // 可变实例状态：编辑器挂载时聚焦并选择文本，提交时退出焦点。
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(defaultValue);
    // 可变实例状态：Enter 后的 blur 不能重复提交同一次编辑。
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
            className={editorStyle}
            onClick={(e) => e.stopPropagation()}
        >
            <LineEdit
                ref={inputRef}
                size="small"
                aria-label="节点名称"
                aria-invalid={isError}
                status={isError ? "error" : undefined}
                className={inputStyle}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    e.stopPropagation();
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
            />
            <span className={cx(countStyle, isError && errorCountStyle)}>
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
        <div className={demoStackStyle}>
            <p className={demoNoteStyle}>
                双击节点名称进入编辑，<kbd>Enter</kbd> 保存，<kbd>Esc</kbd> 取消。
                自定义编辑器带字数限制（最多 {MAX_LEN} 字），超出或为空时失焦自动取消。
            </p>
            <Button
                className={createButtonStyle}
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
            </Button>
            <AutoSizer disableHeight className={treeMeasureStyle}>
                {({ width }) => (
                    <RcTree
                        height={320}
                        width={Math.min(width, 460)}
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
                )}
            </AutoSizer>
        </div>
    );
};

export default InlineEditDemo;
