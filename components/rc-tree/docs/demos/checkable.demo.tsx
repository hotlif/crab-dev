/**
 * title = "复选框 checkable"
 * description = "通过 `checkable` 开启复选框模式。选中父节点自动级联选中所有子节点；取消选中子节点时，父节点自动变为半选状态。`checkedKeys` 与 `onCheck` 实现受控。"
 */

import { type Key, useState } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "../../src/index.js";

const buildNodes = (): Node[] => {
    const fe: Node = { id: "fe", type: NodeType.FOLDER, title: "前端技术", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const be: Node = { id: "be", type: NodeType.FOLDER, title: "后端技术", parent: null, loadState: LoadStateType.LOADING_COMPLETED };

    const react: Node = { id: "react", type: NodeType.FOLDER, title: "React 生态", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };
    const css: Node = { id: "css", type: NodeType.FOLDER, title: "CSS 方案", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };

    const spring: Node = { id: "spring", type: NodeType.FOLDER, title: "Spring 生态", parent: be, loadState: LoadStateType.LOADING_COMPLETED };
    const node: Node = { id: "node", type: NodeType.FOLDER, title: "Node.js", parent: be, loadState: LoadStateType.LOADING_COMPLETED };

    const rReact: Node = { id: "r-react", type: NodeType.FILE, title: "React", parent: react, loadState: LoadStateType.LOADING_COMPLETED };
    const rRouter: Node = { id: "r-router", type: NodeType.FILE, title: "React Router", parent: react, loadState: LoadStateType.LOADING_COMPLETED };
    const rQuery: Node = { id: "r-query", type: NodeType.FILE, title: "TanStack Query", parent: react, loadState: LoadStateType.LOADING_COMPLETED };

    const cLinaria: Node = { id: "c-linaria", type: NodeType.FILE, title: "Linaria", parent: css, loadState: LoadStateType.LOADING_COMPLETED };
    const cTailwind: Node = { id: "c-tailwind", type: NodeType.FILE, title: "Tailwind CSS", parent: css, loadState: LoadStateType.LOADING_COMPLETED };

    const sBoot: Node = { id: "s-boot", type: NodeType.FILE, title: "Spring Boot", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };
    const sCloud: Node = { id: "s-cloud", type: NodeType.FILE, title: "Spring Cloud", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };

    const nKoa: Node = { id: "n-koa", type: NodeType.FILE, title: "Koa", parent: node, loadState: LoadStateType.LOADING_COMPLETED };
    const nNestjs: Node = { id: "n-nestjs", type: NodeType.FILE, title: "NestJS", parent: node, loadState: LoadStateType.LOADING_COMPLETED };

    return [fe, be, react, css, spring, node, rReact, rRouter, rQuery, cLinaria, cTailwind, sBoot, sCloud, nKoa, nNestjs];
};

const CheckableDemo = () => {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>(["fe", "be", "react", "css"]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
    const [halfCheckedKeys, setHalfCheckedKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useTreeData(buildNodes());

    return (
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
            <RcTree
                height={320}
                width={320}
                treeData={treeData}
                onTreeNodeChange={setTreeData}
                expandedKeys={expandedKeys}
                selectKeys={selectKeys}
                checkable
                checkedKeys={checkedKeys}
                onCheck={({ checkedKeys: keys, halfCheckedKeys: half }) => {
                    setCheckedKeys(keys);
                    setHalfCheckedKeys(half);
                }}
                onSelect={({ selectKeys: keys }: { selectKeys: Key[] }) => setSelectKeys(keys)}
                onExpanded={({ node }: { node: Node }) => {
                    setExpandedKeys(prev =>
                        prev.includes(node.id)
                            ? prev.filter(k => k !== node.id)
                            : [...prev, node.id]
                    );
                }}
            />
            <div style={{ fontSize: "0.8125rem", color: "#555", lineHeight: 1.8, minWidth: 160 }}>
                <div><strong>已选中（{checkedKeys.length}）：</strong></div>
                {checkedKeys.length === 0
                    ? <div style={{ color: "#999" }}>无</div>
                    : checkedKeys.map(k => <div key={String(k)}>· {k}</div>)
                }
                {halfCheckedKeys.length > 0 && (
                    <>
                        <div style={{ marginTop: "0.5rem" }}><strong>半选（{halfCheckedKeys.length}）：</strong></div>
                        {halfCheckedKeys.map(k => <div key={String(k)}>· {k}</div>)}
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckableDemo;
