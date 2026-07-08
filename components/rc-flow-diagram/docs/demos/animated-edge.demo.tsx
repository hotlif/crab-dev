/**
 * title = "FlowEdge 流动动效"
 * description = "flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。"
 */

import { useState } from 'react';
import FlowDiagram, { FlowNode, FlowEdge } from '../../src/index.js';
import type { ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';

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
    e1: { dashLength: 6, gapLength: 4, flowSpeed: 24, color: 'oklch(0.5 0.18 260)' },
    e2: { dashLength: 6, gapLength: 4, flowSpeed: -24, color: 'oklch(0.45 0.15 140)' },
    e3: { dashLength: 10, gapLength: 6, flowSpeed: 60, lineWidth: 2, color: 'oklch(0.45 0.15 30)' },
    e4: { dashLength: 6, gapLength: 4, color: 'oklch(0.45 0.15 320)' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, color: '#64748b', padding: '4px 0' }}>
                e1: 顺流 · e2: 逆流（A→C）· e3: 快速（B→D）· e4: 静态对比（C→D）· 拖拽节点验证流动跨拐角连续
            </div>

            <FlowDiagram
                nodes={NODES}
                edges={EDGES}
                elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}
                nodePositions={nodePositions}
                routingOptions={{ margin: 10, terminalStub: 22 }}
                width={680}
                height={380}
                style={{ border: '1px solid #e0e4ec', borderRadius: 8, background: '#fafbfc' }}
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

            {/* 图例 */}
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' }}>
                {EDGES.map(e => (
                    <span key={e.id}>
                        <span style={{ color: EDGE_STYLES[e.id]?.color ?? '#6b7280', fontWeight: 500 }}>
                            {e.source.toUpperCase()}→{e.target.toUpperCase()}
                        </span>{' '}
                        {EDGE_LABELS[e.id]}
                    </span>
                ))}
            </div>
        </div>
    );
}
