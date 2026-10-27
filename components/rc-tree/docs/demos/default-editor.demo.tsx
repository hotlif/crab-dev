import { type Key, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import Tree, { LoadStateType, NodeEditStateType, NodeType, type Node } from "@crab-dev/rc-tree";

export const meta = {
    title: "默认节点编辑器",
    description: "使用 Tree 自带编辑器重命名节点，展示提交与取消回调次数。Enter 保存、Escape 取消；输入法组合期间继续输入，键盘结束后由 Tree 恢复焦点。",
};

const documentId = "default-editor-document";
const richDocumentId = "default-editor-rich-title";
const createNodes = (): Node[] => {
    const folder: Node = {
        id: "default-editor-folder",
        title: "示例文件",
        parent: null,
        type: NodeType.FOLDER,
        loadState: LoadStateType.LOADING_COMPLETED,
    };
    return [folder, {
        id: documentId,
        title: "默认编辑文档.md",
        parent: folder,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
    }, {
        id: richDocumentId,
        title: <span><span aria-hidden="true">装饰图标</span><strong>使用指南</strong></span>,
        parent: folder,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
    }];
};

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["stack-gap"]};
    min-width: 0;
`;
const measureStyle = css`width: 100%; min-width: 0; max-width: 100%; height: auto;`;
const noteStyle = css`
    margin: 0;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.body};
    line-height: ${token.font["line-height"].body};
    overflow-wrap: anywhere;
`;
const actionStyle = css`align-self: flex-start;`;

const DefaultEditorDemo = () => {
    const [nodes, setNodes] = useState(createNodes);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [counts, setCounts] = useState({ commits: 0, cancels: 0 });
    const [lastAction, setLastAction] = useState("尚未编辑。");

    const finishEdit = (node: Node, value: string, cancelled: boolean) => {
        setNodes(current => current.map(item => item.id === node.id
            ? { ...item, title: cancelled ? item.title : value, editState: undefined }
            : item));
        setCounts(current => ({
            commits: current.commits + (cancelled ? 0 : 1),
            cancels: current.cancels + (cancelled ? 1 : 0),
        }));
        setLastAction(cancelled ? "最近操作：取消。" : `最近提交：${value}。`);
    };

    return (
        <div className={stackStyle}>
            <p className={noteStyle}>
                双击“默认编辑文档.md”重命名。Enter 保存，Escape 取消；输入法组合期间不会结束编辑。
                点击树外控件会提交当前文字并保留新焦点；键盘保存或取消后由默认编辑器返回树。
                另一个“使用指南”节点展示富文本名称：装饰文字标记为 aria-hidden；编辑器名称应仅为“使用指南”，初始输入为空，Escape 保留原富文本标题。
            </p>
            <AutoSizer disableHeight className={measureStyle}>
                {({ width }) => (
                    <Tree
                        aria-label="默认编辑器文件树"
                        width={Math.min(width, 460)}
                        height={160}
                        treeData={nodes}
                        onTreeNodeChange={setNodes}
                        defaultExpandedKeys={["default-editor-folder"]}
                        selectedKeys={selectedKeys}
                        onSelectedKeysChange={setSelectedKeys}
                        draggable={false}
                        onNodeDoubleClick={node => {
                            if (node.id !== documentId && node.id !== richDocumentId) return;
                            setSelectedKeys([node.id]);
                            setNodes(current => current.map(item => item.id === node.id
                                ? { ...item, editState: NodeEditStateType.UPDATE }
                                : item));
                        }}
                        onEditEnd={finishEdit}
                    />
                )}
            </AutoSizer>
            <Button
                className={actionStyle}
                aria-label="查看默认节点名称"
                onClick={() => setLastAction(`当前名称：${nodes.find(node => node.id === documentId)?.title ?? ""}。`)}
            >
                查看当前名称
            </Button>
            <p
                className={noteStyle}
                role="status"
                aria-label="默认编辑器回调"
                data-commit-count={counts.commits}
                data-cancel-count={counts.cancels}
            >
                提交 {counts.commits} 次，取消 {counts.cancels} 次。{lastAction}
            </p>
        </div>
    );
};

export default DefaultEditorDemo;
