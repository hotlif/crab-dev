/**
 * title = "搜索过滤 filterTreeNode"
 * description = "通过 `filterTreeNode` prop 过滤节点。返回 `true` 的节点及其所有祖先节点均会保留显示，其余节点被隐藏。结合展开所有匹配路径，可实现完整的搜索体验。"
 */

import { type Key, useState, useEffect } from "react";
import RcTree, { LoadStateType, NodeType, type Node, useTreeData } from "../../src/index.js";

const buildNodes = (): Node[] => {
    const fe: Node = { id: "fe", type: NodeType.FOLDER, title: "前端", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const be: Node = { id: "be", type: NodeType.FOLDER, title: "后端", parent: null, loadState: LoadStateType.LOADING_COMPLETED };
    const mobile: Node = { id: "mobile", type: NodeType.FOLDER, title: "移动端", parent: null, loadState: LoadStateType.LOADING_COMPLETED };

    const react: Node = { id: "react", type: NodeType.FOLDER, title: "React", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };
    const vue: Node = { id: "vue", type: NodeType.FOLDER, title: "Vue", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };
    const angular: Node = { id: "angular", type: NodeType.FOLDER, title: "Angular", parent: fe, loadState: LoadStateType.LOADING_COMPLETED };

    const node: Node = { id: "node", type: NodeType.FOLDER, title: "Node.js", parent: be, loadState: LoadStateType.LOADING_COMPLETED };
    const spring: Node = { id: "spring", type: NodeType.FOLDER, title: "Spring Boot", parent: be, loadState: LoadStateType.LOADING_COMPLETED };

    const ios: Node = { id: "ios", type: NodeType.FOLDER, title: "iOS", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };
    const android: Node = { id: "android", type: NodeType.FOLDER, title: "Android", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };
    const rn: Node = { id: "rn", type: NodeType.FOLDER, title: "React Native", parent: mobile, loadState: LoadStateType.LOADING_COMPLETED };

    const reactHooks: Node = { id: "hooks", type: NodeType.FILE, title: "Hooks 指南.md", parent: react, loadState: LoadStateType.LOADING_COMPLETED };
    const reactRouter: Node = { id: "router", type: NodeType.FILE, title: "React Router.md", parent: react, loadState: LoadStateType.LOADING_COMPLETED };
    const vueComposable: Node = { id: "composable", type: NodeType.FILE, title: "Composable API.md", parent: vue, loadState: LoadStateType.LOADING_COMPLETED };
    const koa: Node = { id: "koa", type: NodeType.FILE, title: "Koa 中间件.md", parent: node, loadState: LoadStateType.LOADING_COMPLETED };
    const jpa: Node = { id: "jpa", type: NodeType.FILE, title: "Spring Data JPA.md", parent: spring, loadState: LoadStateType.LOADING_COMPLETED };
    const swift: Node = { id: "swift", type: NodeType.FILE, title: "Swift 基础.md", parent: ios, loadState: LoadStateType.LOADING_COMPLETED };
    const kotlin: Node = { id: "kotlin", type: NodeType.FILE, title: "Kotlin 入门.md", parent: android, loadState: LoadStateType.LOADING_COMPLETED };
    const rnNav: Node = { id: "rn-nav", type: NodeType.FILE, title: "Navigation.md", parent: rn, loadState: LoadStateType.LOADING_COMPLETED };

    return [fe, be, mobile, react, vue, angular, node, spring, ios, android, rn,
        reactHooks, reactRouter, vueComposable, koa, jpa, swift, kotlin, rnNav];
};

const ALL_NODES = buildNodes();

const FilterDemo = () => {
    const [keyword, setKeyword] = useState("");
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectKeys, setSelectKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useTreeData(ALL_NODES);

    const filterFn = keyword.trim()
        ? (node: Node) => {
            const title = typeof node.title === "string" ? node.title : "";
            return title.toLowerCase().includes(keyword.trim().toLowerCase());
        }
        : undefined;

    useEffect(() => {
        if (!keyword.trim()) {
            setExpandedKeys([]);
            return;
        }
        const matched = ALL_NODES.filter(n => {
            const title = typeof n.title === "string" ? n.title : "";
            return title.toLowerCase().includes(keyword.trim().toLowerCase());
        });
        const ancestorIds = new Set<Key>();
        matched.forEach(n => {
            let p: Node | null = n.parent;
            while (p) {
                ancestorIds.add(p.id);
                p = p.parent;
            }
        });
        setExpandedKeys([...ancestorIds]);
    }, [keyword]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
                type="search"
                placeholder="搜索节点..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                style={{
                    padding: "0.375rem 0.625rem",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "0.875rem",
                    width: "300px",
                    outline: "none",
                }}
            />
            <RcTree
                height={300}
                width={400}
                treeData={treeData}
                onTreeNodeChange={setTreeData}
                expandedKeys={expandedKeys}
                selectKeys={selectKeys}
                filterTreeNode={filterFn}
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

export default FilterDemo;
