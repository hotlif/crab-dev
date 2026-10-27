import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import LineEdit, { TokenVars as lineEditVars } from "@crab-dev/rc-line-edit";
import { css, cx } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { treeMeasureStyle, demoStackStyle, demoNoteStyle } from "../demo-layout.js";
export const meta = {
    title: "Inline 节点编辑",
    description: "双击节点标题进入 inline 编辑模式。本例通过 renderEditInput 复用 LineEdit，演示字数限制与实时校验。onCommit(value) 提交，onCancel() 取消。",
};

import { type Key, useState, useRef, useEffect, useLayoutEffect } from "react";
import RcTree, { LoadStateType, NodeType, NodeEditStateType, TokenVars as treeVars, type Node, useTreeData } from "@crab-dev/rc-tree";

/** Private example helper: a custom editor owns focus after keyboard completion. */
export function useKeyboardEditFocus() {
    const [attempt, setAttempt] = useState<symbol | null>(null);
    // Mutable ownership lasts only until this attempt's first React commit.
    const pendingFocus = useRef<{
        attempt: symbol;
        input: HTMLInputElement;
        row: HTMLElement;
        tree: HTMLElement;
        moved: boolean;
        cleanup: () => void;
    } | null>(null);
    useLayoutEffect(() => {
        const pending = pendingFocus.current;
        if (!pending || pending.attempt !== attempt) return;
        pendingFocus.current = null;
        pending.cleanup();
        const document = pending.input.ownerDocument;
        if (!pending.moved && !pending.input.isConnected && pending.row.isConnected
            && pending.tree.contains(pending.row)
            && (document.activeElement === document.body || document.activeElement === null)) {
            pending.tree.focus({ preventScroll: true });
        }
    });
    useLayoutEffect(() => () => {
        pendingFocus.current?.cleanup();
        pendingFocus.current = null;
    }, []);

    return (input: HTMLInputElement, finish: () => void) => {
        const row = input.closest<HTMLElement>('[role="treeitem"]');
        const tree = row?.closest<HTMLElement>('[role="tree"]');
        const document = input.ownerDocument;
        pendingFocus.current?.cleanup();
        pendingFocus.current = null;
        if (row && tree && document.activeElement === input) {
            const pending = { attempt: Symbol('custom-tree-edit-end'), input, row, tree, moved: false, cleanup: () => {
                document.removeEventListener('focusin', onFocus);
            } };
            const onFocus = (event: Event) => { if (event.target !== input) pending.moved = true; };
            document.addEventListener('focusin', onFocus);
            pendingFocus.current = pending;
            // Also commit when a controlled owner rejects completion. Never let
            // a later, unrelated removal reuse this keyboard focus request.
            setAttempt(pending.attempt);
        }
        const request = pendingFocus.current;
        finish();
        // Respect an explicit synchronous blur while the editor still exists.
        // A native removal may emit blur before isConnected changes, so observing
        // blur itself cannot distinguish removal from a consumer's decision.
        if (request && pendingFocus.current === request && input.isConnected
            && document.activeElement !== input) {
            request.moved = true;
        }
    };
}

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
    height: 100%;
    min-height: 0;
`;
const inputStyle = css`
    /* Same embedded contract as Tree's default editor. The real row supplies
       its resolved height; standalone MD3 fields retain their 56px minimum. */
    ${lineEditVars['root.touch.min-height']}: 0px;
    ${lineEditVars['root.outline-color-focus']}: currentColor;
    ${lineEditVars['root.outline-width-focus']}: var(${treeVars['root.outline-width-focus']});
    ${lineEditVars['root.outline-offset-focus']}: calc(-1 * var(${treeVars['root.outline-width-focus']}));
    flex: 1 1 auto;
    min-width: 0;
    font-size: inherit;
    line-height: inherit;
    && {
        height: 100%;
        max-height: 100%;
        padding-inline: 0.375rem;
        border-radius: var(${treeVars['root.border-radius']});
        color: inherit;
    }
    /* A borderless editor still has a visible invalid state, paired with its
       own background instead of error text on an arbitrary selected row. */
    &&[data-status="error"] {
        color: ${token.color.feedback.error.text};
        background-color: ${token.color.feedback.error.background};
    }
`;
/* The selected row owns ordinary text; errors own both sides of their pair. */
const countStyle = css`font-size: ${token.font.size.caption}; flex-shrink: 0; color: inherit;`;
const errorCountStyle = css`
    color: ${token.color.feedback.error.text};
    background-color: ${token.color.feedback.error.background};
`;
const createButtonStyle = css`align-self: flex-start;`;

interface CustomInputProps {
    defaultValue: string;
    onCommit: (value: string) => void;
    onCancel: () => void;
    onKeyboardEnd: (input: HTMLInputElement, finish: () => void) => void;
}

// Exported only by this example so the published-demo regression uses the same editor.
export const CustomInput = ({ defaultValue, onCommit, onCancel, onKeyboardEnd }: CustomInputProps) => {
    // 可变实例状态：编辑器挂载时聚焦并选择文本。
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
                bordered={false}
                aria-label="节点名称"
                aria-invalid={isError}
                status={isError ? "error" : undefined}
                className={inputStyle}
                value={value}
                onValueChange={(next) => setValue(next)}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                    if (e.key === "Enter" && !isError) {
                        e.preventDefault();
                        onKeyboardEnd(e.currentTarget, () => commit(value.trim()));
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        onKeyboardEnd(e.currentTarget, cancel);
                    } else if (e.key === "Enter") {
                        e.preventDefault();
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
            <span data-node-editor-count="" className={cx(countStyle, isError && errorCountStyle)}>
                {value.length}/{MAX_LEN}
            </span>
        </div>
    );
};

const InlineEditDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>(["docs", "guide", "api"]);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());
    // 自定义编辑器负责焦点；拒绝、主动移焦或卸载会结束本次恢复所有权。
    const finishKeyboardEdit = useKeyboardEditFocus();

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
                自定义编辑器复用 LineEdit 的无边框嵌入模式，跟随当前树行高度，不改变虚拟列表测量。
                字数限制为最多 {MAX_LEN} 字，超出或为空时失焦自动取消。
                键盘保存或取消后返回树；校验失败保持输入焦点，点击其它控件退出时不抢回焦点。
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
                    setSelectedKeys([newNode.id]);
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
                        selectedKeys={selectedKeys}
                        onSelectedKeysChange={(keys: Key[]) => setSelectedKeys(keys)}
                        onExpandedKeysChange={setExpandedKeys}
                        onNodeDoubleClick={(node) => {
                            if (node.disabled) return;
                            setSelectedKeys([node.id]);
                            treeDataUtils.update({ ...node, editState: NodeEditStateType.UPDATE });
                        }}
                        onEditEnd={handleEditEnd}
                        renderEditInput={({ defaultValue, onCommit, onCancel }) => (
                            <CustomInput
                                defaultValue={defaultValue}
                                onCommit={onCommit}
                                onCancel={onCancel}
                                onKeyboardEnd={finishKeyboardEdit}
                            />
                        )}
                    />
                )}
            </AutoSizer>
        </div>
    );
};

export default InlineEditDemo;
