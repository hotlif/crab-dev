import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import Tree, { type Node, NodeType, NodeEditStateType, LoadStateType } from '@crab-dev/rc-tree';

export const meta = {
    title: '树的验收矩阵',
    description: '同一组固定层级核对选择、级联勾选、展开、禁用、编辑与虚拟滚动；切换配置保留草稿。',
};
const parent: Node = {
    id: 'projects',
    parent: null,
    title: '项目 Projects',
    type: NodeType.FOLDER,
    loadState: LoadStateType.LOADING_COMPLETED,
};
const initialNodes: Node[] = [
    parent,
    ...Array.from({ length: 40 }, (_, index) => ({
        id: `file-${index}`,
        parent,
        title: `设计文档 ${String(index + 1).padStart(2, '0')} / Document`,
        type: NodeType.FILE,
        loadState: LoadStateType.LOADING_COMPLETED,
        disabled: index === 2,
    })),
];
const frame = css`
    width: 100%;
    max-width: 640px;
    min-width: 0;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
`;
const measured = css`
    width: 100%;
    height: 280px;
    min-width: 0;
`;
export default function VisualMatrixDemo() {
    const [nodes, setNodes] = useState(initialNodes);
    const [scenario, setScenario] = useState('default');
    return (
        <>
            <label>
                验收状态{' '}
                <select
                    aria-label="验收状态"
                    value={scenario}
                    onChange={(event) => {
                        const value = event.target.value;
                        setScenario(value);
                        setNodes(
                            value === 'empty'
                                ? []
                                : value === 'loading'
                                  ? [{ ...parent, id: 'pending', loadState: LoadStateType.UNLOADED }]
                                  : initialNodes,
                        );
                    }}
                >
                    <option value="default">已有节点</option>
                    <option value="empty">空树</option>
                    <option value="loading">按需加载</option>
                </select>
            </label>
            <section aria-label="Tree visual matrix" className={frame}>
                <AutoSizer className={measured}>
                    {({ width, height }) => (
                        <Tree
                            aria-label="项目文档树"
                            width={width}
                            height={height}
                            treeData={nodes}
                            checkable
                            showLine
                            defaultExpandedKeys={['projects']}
                            loadData={() => new Promise<Node[]>(() => {})}
                            onTreeNodeChange={setNodes}
                            onNodeDoubleClick={(node) => {
                                if (node.type === NodeType.FILE && !node.disabled)
                                    setNodes((current) =>
                                        current.map((item) =>
                                            item.id === node.id
                                                ? { ...item, editState: NodeEditStateType.UPDATE }
                                                : item,
                                        ),
                                    );
                            }}
                            onEditEnd={(node, title, cancelled) =>
                                setNodes((current) =>
                                    current.map((item) =>
                                        item.id === node.id
                                            ? { ...item, title: cancelled ? item.title : title, editState: undefined }
                                            : item,
                                    ),
                                )
                            }
                        />
                    )}
                </AutoSizer>
            </section>
        </>
    );
}
