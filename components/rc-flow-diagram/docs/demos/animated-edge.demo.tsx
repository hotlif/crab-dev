import { diagramViewportStyle, demoStackStyle, demoHintStyle, demoLegendStyle, demoLegendLabelStyle } from "../demo-layout.js";
export const meta = {
    title: "FlowEdge 流动动效",
    description: "flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。",
};

import { useState } from 'react';
import token from '@crab-dev/rc-token-semantic';
import FlowDiagram, { FlowNode, FlowEdge, DEFAULT_FLOW_DIAGRAM_PALETTE } from '@crab-dev/rc-flow-diagram';
import type { ElkLayoutNode, ElkLayoutEdge } from '@crab-dev/rc-flow-diagram';

const NODE_W = 110;
const NODE_H = 44;

const NODES: ElkLayoutNode[] = [
    { id: 'a', width: NODE_W, height: NODE_H },
    { id: 'b', width: NODE_W, height: NODE_H },
    { id: 'c', width: NODE_W, height: NODE_H },
    { id: 'd', width: NODE_W, height: NODE_H },
];

const EDGES: ElkLayoutEdge[] = [
    { id: 'e1', source: 'a', target: 'b' },
    { id: 'e2', source: 'a', target: 'c' },
    { id: 'e3', source: 'b', target: 'd' },
    { id: 'e4', source: 'c', target: 'd' },
];

const NODE_FILLS: Record<string, string> = {
    a: 'oklch(0.55 0.2 260)',
    b: 'oklch(0.55 0.2 30)',
    c: 'oklch(0.55 0.2 140)',
    d: 'oklch(0.55 0.2 320)',
};

const NODE_LABELS: Record<string, string> = {
    a: '数据源',
    b: '处理器',
    c: '过滤器',
    d: '汇聚点',
};

interface EdgeStyle {
    color?: string;
    dashLength?: number;
    gapLength?: number;
    flowSpeed?: number;
    lineWidth?: number;
}

const EDGE_STYLES: Record<string, EdgeStyle> = {
    e1: { dashLength: 6, gapLength: 4, flowSpeed: 24, color: token.color.brand.primary },
    e2: { dashLength: 6, gapLength: 4, flowSpeed: -24, color: token.color.feedback.success.icon },
    e3: { dashLength: 10, gapLength: 6, flowSpeed: 60, lineWidth: 2, color: token.color.feedback.error.icon },
    e4: { dashLength: 6, gapLength: 4, color: token.color.tertiary.primary },
};

const EDGE_LABELS: Record<string, string> = {
    e1: '顺流 24 px/s',
    e2: '逆流 -24 px/s',
    e3: '快速 60 px/s',
    e4: '静态虚线（对比）',
};

export default function AnimatedEdgeDemo() {
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

    return (
        <div className={demoStackStyle}>
            <div className={demoHintStyle}>
                e1: 顺流 · e2: 逆流（A→C）· e3: 快速（B→D）· e4: 静态对比（C→D）· 拖拽节点验证流动跨拐角连续
            </div>

            <div className={diagramViewportStyle} role="region" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>


                <FlowDiagram
                    nodes={NODES}
                    edges={EDGES}
                    elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}
                    nodePositions={nodePositions}
                    routingOptions={{ margin: 10, terminalStub: 22 }}
                    width={680}
                    height={380}

                >
                    {({ nodeRects, routes, crossings }) => (
                        <>
                            {/* 边：flowSpeed 驱动虚线流动，方向与速度各不相同 */}
                            {EDGES.map(e => {
                                const pts = routes[e.id]?.points;
                                if (!pts || pts.length < 2) return null;
                                return <FlowEdge key={e.id} points={pts} crossings={crossings[e.id]} {...EDGE_STYLES[e.id]} />;
                            })}

                            {/* 节点 */}
                            {NODES.map(n => {
                                const rect = nodeRects[n.id];
                                if (!rect) return null;
                                return (
                                    <FlowNode
                                        key={n.id}
                                        x={rect.x} y={rect.y}
                                        width={NODE_W} height={NODE_H}
                                        label={NODE_LABELS[n.id]}
                                        fill={NODE_FILLS[n.id]}
                                        labelColor={DEFAULT_FLOW_DIAGRAM_PALETTE.nodeLabel}
                                        draggable
                                        onDrag={(dx, dy) => setNodePositions(prev => {
                                            const base = prev[n.id] ?? rect;
                                            return { ...prev, [n.id]: { x: base.x + dx, y: base.y + dy } };
                                        })}
                                    />
                                );
                            })}
                        </>
                    )}
                </FlowDiagram>

            </div>

            {/* 图例 */}
            <div className={demoLegendStyle}>
                {EDGES.map(e => (
                    <span key={e.id}>
                        <span className={demoLegendLabelStyle}>
                            {e.source.toUpperCase()}→{e.target.toUpperCase()}
                        </span>{' '}
                        {EDGE_LABELS[e.id]}
                    </span>
                ))}
            </div>
        </div>
    );
}
