/**
 * title = "全部展开 / 折叠"
 * description = "通过 `TreeDataUtil` 提供的 `expandAll` 与 `collapseAll` 方法，一键展开或折叠所有 FOLDER 节点。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "../../src/index.js";

const buildNodes = (): Node[] => {
    const fe: Node = { id: "fe", type: NodeType.FOLDER, title: "前端", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const be: Node = { id: "be", type: NodeType.FOLDER, title: "后端", parent: null, loadState: LoadStateType.LOADING_COMPLETED };

    const react: Node = { id: "react", type: NodeType.FOLDER, title: "React", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };
    const vue: Node = { id: "vue", type: NodeType.FOLDER, title: "Vue", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };

    const node: Node = { id: "node", type: NodeType.FOLDER, title: "Node.js", parent: be, loadState: LoadStateType.LOADING_COMPLETED };
    const go: Node = { id: "go", type: NodeType.FOLDER, title: "Go", parent: be, loadState: LoadStateType.LOADING_COMPLETED };

    const hooks: Node = { id: "hooks", type: NodeType.FOLDER, title: "Hooks", parent: react, loadState: LoadStateType.LOADING_COMPLETED };
    const components: Node = { id: "components", type: NodeType.FOLDER, title: "Components", parent: react, loadState: LoadStateType.LOADING_COMPLETED };

    const useState_: Node = { id: "useState", type: NodeType.FILE, title: "useState.ts", parent: hooks, loadState: LoadStateType.LOADING_COMPLETED };
    const useEffect_: Node = { id: "useEffect", type: NodeType.FILE, title: "useEffect.ts", parent: hooks, loadState: LoadStateType.LOADING_COMPLETED };
    const button: Node = { id: "button", type: NodeType.FILE, title: "Button.tsx", parent: components, loadState: LoadStateType.LOADING_COMPLETED };

    const composable: Node = { id: "composable", type: NodeType.FOLDER, title: "Composables", parent: vue, loadState: LoadStateType.LOADING_COMPLETED };
    const ref_: Node = { id: "ref", type: NodeType.FILE, title: "ref.ts", parent: composable, loadState: LoadStateType.LOADING_COMPLETED };

    const koa: Node = { id: "koa", type: NodeType.FILE, title: "koa.ts", parent: node, loadState: LoadStateType.LOADING_COMPLETED };
    const gin: Node = { id: "gin", type: NodeType.FILE, title: "gin.go", parent: go, loadState: LoadStateType.LOADING_COMPLETED };

    return [fe, be, react, vue, node, go, hooks, components, composable, useState_, useEffect_, button, ref_, koa, gin];
};

const ExpandAllDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData, treeDataUtils] = useTreeData(buildNodes());

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => treeDataUtils.expandAll(keys => setExpandedKeys(keys))}>
                    展开全部
                </button>
                <button onClick={() => treeDataUtils.collapseAll(keys => setExpandedKeys(keys))}>
                    折叠全部
                </button>
            </div>
            <RcTree
                height={320}
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
        </div>
    );
};

export default ExpandAllDemo;
