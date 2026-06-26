/**
 * title = "节点连线（Edge）"
 * description = "Edge 连接两个节点，支持实心箭头、双向箭头和虚线样式。节点可拖拽，连线实时跟随。"
 */

import { useState } from 'react';
import { Canvas, Rect, Group, Text, Edge, Viewport, InfiniteGrid } from '../../src/index.js';
import type { DragMoveEvent } from '../../src/drag-types.js';

const NODE_W = 110;
const NODE_H = 48;

/** 计算矩形边界上距中心角度为 angle 方向的交点 */
function rectPort(
    cx: number, cy: number,
    w: number, h: number,
    angle: number,
): [number, number] {
    const hw = w / 2;
    const hh = h / 2;
    const abscos = Math.abs(Math.cos(angle));
    const abssin = Math.abs(Math.sin(angle));
    const scale = hw * abssin <= hh * abscos ? hw / abscos : hh / abssin;
    return [cx + scale * Math.cos(angle), cy + scale * Math.sin(angle)];
}

interface NodeState {
    id: string;
    label: string;
    x: number;
    y: number;
    fill: string;
}

interface EdgeConfig {
    from: string;
    to: string;
    color: string;
    arrowStart?: boolean;
    dashLength?: number;
    gapLength?: number;
}

const INITIAL_NODES: NodeState[] = [
    { id: 'a', label: '节点 A', x: -240, y: -24, fill: 'oklch(0.55 0.2 260)' },
    { id: 'b', label: '节点 B', x: -20, y: -130, fill: 'oklch(0.55 0.2 30)' },
    { id: 'c', label: '节点 C', x: -20, y: 82, fill: 'oklch(0.55 0.2 140)' },
    { id: 'd', label: '节点 D', x: 200, y: -24, fill: 'oklch(0.55 0.2 320)' },
];

const EDGE_CONFIGS: EdgeConfig[] = [
    { from: 'a', to: 'b', color: 'oklch(0.45 0.15 260)' },
    { from: 'a', to: 'c', color: 'oklch(0.45 0.15 140)', dashLength: 6, gapLength: 4 },
    { from: 'b', to: 'd', color: 'oklch(0.45 0.15 30)' },
    { from: 'c', to: 'd', color: 'oklch(0.45 0.15 320)', arrowStart: true },
];

export default function EdgeDemo() {
    const [nodes, setNodes] = useState<NodeState[]>(INITIAL_NODES);

    const moveNode = (id: string, dx: number, dy: number) => {
        setNodes(prev =>
            prev.map(n => n.id === id ? { ...n, x: n.x + dx, y: n.y + dy } : n),
        );
    };

    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>
                拖拽节点移动 · A→B / A→C 单向箭头 · A→C 虚线 · C→D 双向箭头
            </div>
            <Canvas
                width={720}
                height={440}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}
            >
                <Viewport minZoom={0.2} maxZoom={4}>
                    <InfiniteGrid baseSpacing={60} subdivisions={4} color="#ebebeb" />

                    {/* Edge 先渲染，zIndex 低于节点，线段被节点边缘自然遮挡 */}
                    {EDGE_CONFIGS.map(cfg => {
                        const from = nodeMap[cfg.from];
                        const to = nodeMap[cfg.to];
                        const fromCx = from.x + NODE_W / 2;
                        const fromCy = from.y + NODE_H / 2;
                        const toCx = to.x + NODE_W / 2;
                        const toCy = to.y + NODE_H / 2;
                        const angle = Math.atan2(toCy - fromCy, toCx - fromCx);
                        const [x1, y1] = rectPort(fromCx, fromCy, NODE_W, NODE_H, angle);
                        const [x2, y2] = rectPort(toCx, toCy, NODE_W, NODE_H, angle + Math.PI);

                        return (
                            <Edge
                                key={`${cfg.from}-${cfg.to}`}
                                x1={x1} y1={y1}
                                x2={x2} y2={y2}
                                color={cfg.color}
                                lineWidth={2}
                                arrowStart={cfg.arrowStart}
                                dashLength={cfg.dashLength}
                                gapLength={cfg.gapLength}
                                zIndex={0}
                            />
                        );
                    })}

                    {/* 节点 */}
                    {nodes.map(node => (
                        <Group
                            key={node.id}
                            x={node.x}
                            y={node.y}
                            zIndex={1}
                            draggable
                            hitArea={{ x: 0, y: 0, width: NODE_W, height: NODE_H }}
                            cursor="grab"
                            onDrag={({ localDx, localDy }: DragMoveEvent) =>
                                moveNode(node.id, localDx, localDy)
                            }
                        >
                            <Rect
                                x={0} y={0}
                                width={NODE_W} height={NODE_H}
                                fill={node.fill}
                                radius={8}
                            />
                            <Text
                                x={NODE_W / 2} y={NODE_H / 2}
                                fontSize={13}
                                fill="#ffffff"
                                textAlign="center"
                                textBaseline="middle"
                            >
                                {node.label}
                            </Text>
                        </Group>
                    ))}
                </Viewport>
            </Canvas>
        </div>
    );
}
