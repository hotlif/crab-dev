export const meta = {
    title: "图标插槽与禁用节点",
    description: "通过 `icon` 字段为节点设置前置图标；`disabled` 字段禁用节点，禁用节点不可点击、不可拖拽、样式置灰。",
};

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "../../src/index.js";

const folderIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const fileIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
    </svg>
);

const lockIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const buildNodes = (): Node[] => {
    const root1: Node = { id: "src", type: NodeType.FOLDER, title: "src", parent: null, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon };
    const root2: Node = { id: "public", type: NodeType.FOLDER, title: "public（禁用）", parent: null, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon, disabled: true };

    const components: Node = { id: "components", type: NodeType.FOLDER, title: "components", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon };
    const utils: Node = { id: "utils", type: NodeType.FOLDER, title: "utils（禁用）", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: folderIcon, disabled: true };

    const appFile: Node = { id: "app.tsx", type: NodeType.FILE, title: "App.tsx", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };
    const indexFile: Node = { id: "index.ts", type: NodeType.FILE, title: "index.ts", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };
    const secretFile: Node = { id: "secret.ts", type: NodeType.FILE, title: "secret.ts（禁用）", parent: root1, loadState: LoadStateType.LOADING_COMPLETED, icon: lockIcon, disabled: true };

    const btnFile: Node = { id: "button.tsx", type: NodeType.FILE, title: "Button.tsx", parent: components, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };
    const inputFile: Node = { id: "input.tsx", type: NodeType.FILE, title: "Input.tsx", parent: components, loadState: LoadStateType.LOADING_COMPLETED, icon: fileIcon };

    return [root1, root2, components, utils, appFile, indexFile, secretFile, btnFile, inputFile];
};

const IconAndDisabledDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>(["src", "components"]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useTreeData(buildNodes());

    return (
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
    );
};

export default IconAndDisabledDemo;
