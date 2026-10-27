import { css } from '@crab-dev/css';
import FlowDiagram, { FlowEdge, FlowNode, type ElkLayoutEdge, type ElkLayoutNode } from '@crab-dev/rc-flow-diagram';

export const meta = {
    title: '默认语义色板',
    description: '节点、文字、连线和网格均省略颜色参数，直接使用当前设计体系的默认色板。容器支持窄屏横向查看。',
};

const viewportStyle = css`max-width: 100%; overflow: auto;`;
const nodes: ElkLayoutNode[] = [{ id: 'start', width: 140, height: 52 }, { id: 'end', width: 140, height: 52 }];
const edges: ElkLayoutEdge[] = [{ id: 'connection', source: 'start', target: 'end' }];

export default function VisualStatesDemo() {
    return <div className={viewportStyle} role="region" aria-label="默认语义色板流程图" tabIndex={0}>
        <FlowDiagram nodes={nodes} edges={edges} width={460} height={220}>
            {({ nodeRects, routes, crossings }) => <>
                {edges.map(edge => {
                    const points = routes[edge.id]?.points;
                    return points && points.length > 1 ? <FlowEdge key={edge.id} points={points} crossings={crossings[edge.id]} /> : null;
                })}
                {nodes.map(node => {
                    const rect = nodeRects[node.id];
                    return rect ? <FlowNode key={node.id} x={rect.x} y={rect.y} width={140} height={52} label={node.id === 'start' ? '开始 Start' : '完成 Done'} /> : null;
                })}
            </>}
        </FlowDiagram>
    </div>;
}
