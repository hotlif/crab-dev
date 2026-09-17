import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Tree, { LoadStateType, NodeType, type Node } from "@crab-dev/rc-tree";
import Button from "@crab-dev/rc-button";
import AutoSizer from "@crab-dev/rc-auto-sizer";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const root: Node = {
    id: "root",
    title: "项目",
    parent: null,
    type: NodeType.FOLDER,
    loadState: LoadStateType.LOADING_COMPLETED,
};
const nodes: Node[] = [
    root,
    {
        id: "readme",
        title: "README.md",
        parent: root,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
    },
    {
        id: "config",
        title: "package.json",
        parent: root,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
    },
];
const frame = css`
    height: calc(${token.space["section-gap"]} * 12);
    min-width: 0;
`;
export default function Example() {
    const treeId = useId();
    const [treeData, setTreeData] = useState(nodes);
    const [expanded, setExpanded] = useState<string[]>(["root"]);
    const [selected, setSelected] = useState<string[]>([]);
    return (
        <div className={layout}>
            <Button
                aria-expanded={expanded.includes("root")}
                aria-controls={treeId}
                onClick={() => setExpanded(expanded.includes("root") ? [] : ["root"])}
            >
                {expanded.includes("root") ? "收起项目" : "展开项目"}
            </Button>
            <Button onClick={() => setSelected(["readme"])}>选择 README.md</Button>
            <div className={frame} id={treeId}>
                <AutoSizer>
                    {({ width, height }) => (
                        <Tree
                            treeData={treeData}
                            onTreeNodeChange={setTreeData}
                            expandedKeys={expanded}
                            onExpanded={({ node }) =>
                                setExpanded((current) =>
                                    current.includes(String(node.id))
                                        ? current.filter((id) => id !== String(node.id))
                                        : [...current, String(node.id)],
                                )
                            }
                            selectKeys={selected}
                            onSelect={({ selectKeys }) => setSelected(selectKeys.map(String))}
                            width={width}
                            height={height}
                        />
                    )}
                </AutoSizer>
            </div>
            <output>选中 ID：{selected.join(", ") || "未选择"}</output>
        </div>
    );
}
