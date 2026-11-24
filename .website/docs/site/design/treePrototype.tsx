import { useState } from "react";
import type { Key } from "react";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Tree, { LoadStateType, NodeType, type Node, type TreeNodeId } from "@crab-dev/rc-tree";
import { NavigationPrototype } from "./navigationPrototype.js";

function item(id: string, title: string, parent: Node | null, type: NodeType): Node {
    return { id, title, parent, type, loadState: LoadStateType.LOADING_COMPLETED };
}

const project = item("project", "北区工程", null, NodeType.FOLDER);
const pumps = item("pumps", "输水设备", project, NodeType.FOLDER);
const instruments = item("instruments", "监测与仪表", project, NodeType.FOLDER);
const spare = item("spare", "备用设备", project, NodeType.FOLDER);
const pump = item("pump", "P-104 高压循环输送泵与远程巡检终端", pumps, NodeType.FILE);
const initialDirectory = [
    project, pumps, pump, item("valve", "V-019 进水调节阀", pumps, NodeType.FILE),
    instruments, item("meter", "M-032 入口压力监测仪", instruments, NodeType.FILE),
    item("flow", "F-026 流量测量与数据采集模块", instruments, NodeType.FILE), spare,
];
const notes = {
    md3: "MD3 用着色行标出预选节点。展开箭头、行内容和详情动作具有不同角色。",
    macos: "macOS 采用紧凑的目录缩进和披露图标，详情跟随明确的打开动作。",
    shadcn: "shadcn/ui 使用中性层级线与选中背景，窄屏下详情接在目录之后。",
};

function searchDirectory(directory: Node[], query: string) {
    const term = query.trim().toLocaleLowerCase();
    const matches = new Set<TreeNodeId>();
    const ancestors = new Set<TreeNodeId>();
    for (const entry of directory) {
        if (!String(entry.title).toLocaleLowerCase().includes(term)) continue;
        matches.add(entry.id);
        for (let parent = entry.parent; parent; parent = parent.parent) {
            matches.add(parent.id);
            ancestors.add(parent.id);
        }
    }
    return { visible: directory.filter(entry => matches.has(entry.id)), expanded: [...ancestors] };
}

export default function TreePrototype() {
    const { designSystem } = useConfig();
    const size = designSystem === "macos" ? "small" : "medium";
    const [directory, setDirectory] = useState(initialDirectory);
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState<Key[]>([project.id]);
    const [searchExpansion, setSearchExpansion] = useState<Key[]>([]);
    const [cursor, setCursor] = useState<Key[]>([]);
    const [opened, setOpened] = useState<TreeNodeId | null>(null);
    const filtering = Boolean(query.trim());
    const nodes = filtering ? searchDirectory(directory, query).visible : directory;
    const previewNode = nodes.find(entry => entry.id === cursor.at(-1));
    const current = directory.find(entry => entry.id === opened);
    const childCount = current ? directory.filter(entry => entry.parent?.id === current.id).length : 0;

    return <NavigationPrototype route="tree" title="Tree 树" scene="设备工程目录"
        description="展开目录、搜索设备，然后打开所选节点，检查长名称和空目录。"
        note={notes[designSystem]} rules={[
            ["层级", "展开箭头控制分支可见性。目录按层级缩进，备用设备示例为空目录。"],
            ["键盘与预选", "Tab 进入树，方向键移动预选、展开或收起。行预选可以更新，工作区仍保留最后打开的节点。"],
            ["搜索", "结果保留匹配项的上级路径并自动展开。清除时恢复搜索前的展开位置。"],
            ["定位与长名称", "打开所选节点后在详情读到完整名称，空目录显示零设备。"],
        ]}>
        <div className="crab-navigation-tree">
            <div className="crab-navigation-tree-control">
                <LineEdit label="搜索设备目录" value={query} onValueChange={value => {
                    setQuery(value);
                    setSearchExpansion(searchDirectory(directory, value).expanded);
                }} size={size} appearance="outlined" placeholder="例如：压力" allowClear />
                <div className="crab-navigation-tree-view">
                    {nodes.length === 0 ? <p role="status">没有匹配的设备。</p> :
                        <AutoSizer>{({ width, height }) => <Tree aria-label="工程目录树" size={size} treeData={nodes} onTreeNodeChange={setDirectory}
                            width={width} height={height} showLine={designSystem !== "macos"} selectedKeys={cursor}
                            expandedKeys={filtering ? searchExpansion : expanded}
                            onExpandedKeysChange={filtering ? setSearchExpansion : setExpanded}
                            onSelectedKeysChange={setCursor} onNodeDoubleClick={node => setOpened(node.id)} />}</AutoSizer>}
                </div>
            </div>
            <div className="crab-navigation-tab-body" aria-label="设备详情">
                <h3>已打开节点</h3>
                <p role="status" data-tree-opened>{current ? current.title : "尚未打开设备或目录。"}</p>
                {current?.type === NodeType.FOLDER && <p>{childCount === 0 ? "此目录暂无设备。" : `包含 ${childCount} 个直接子项。`}</p>}
                <p className="crab-navigation-status" data-tree-preview>{previewNode ? `预选：${String(previewNode.title)}` : "请选择一个节点。"}</p>
                <Button size="s" appearance="primary" disabled={!previewNode} onClick={() => {
                    if (previewNode) setOpened(previewNode.id);
                }}>打开所选节点</Button>
            </div>
        </div>
    </NavigationPrototype>;
}
