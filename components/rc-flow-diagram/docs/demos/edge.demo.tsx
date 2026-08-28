export const meta = {
    title: "FlowEdge 样式",
    description: "FlowEdge 支持实线 / 虚线、单向 / 双向箭头、自定义颜色。节点可拖，边走线自动绕开节点。",
};

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
    a: '节点 A',
    b: '节点 B',
    c: '节点 C',
    d: '节点 D',
};

interface EdgeStyle {
    color?: string;
    dashLength?: number;
    gapLength?: number;
    arrowStart?: boolean;
    arrowEnd?: boolean;
    lineWidth?: number;
}

const EDGE_STYLES: Record<string, EdgeStyle> = {
    e1: {},
    e2: { dashLength: 6, gapLength: 4, color: 'oklch(0.45 0.15 140)' },
    e3: { arrowStart: true, color: 'oklch(0.45 0.15 30)' },
    e4: { arrowEnd: false, color: 'oklch(0.45 0.15 320)', lineWidth: 2.5 },
};

const EDGE_LABELS: Record<string, string> = {
    e1: '默认箭头',
    e2: '虚线',
    e3: '双向箭头',
    e4: '无箭头',
};

export default function EdgeDemo() {
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, color: '#64748b', padding: '4px 0' }}>
                e1: 默认箭头 · e2: 虚线（A→C）· e3: 双向箭头（B→D）· e4: 无箭头（C→D）· 拖拽节点移动
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
                        {/* 边：每条样式不同，演示 FlowEdge props */}
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
