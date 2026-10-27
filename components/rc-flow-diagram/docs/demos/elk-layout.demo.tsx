import { diagramViewportStyle, demoStackStyle, demoToolbarStyle, demoHintStyle, demoLegendStyle, demoLegendItemStyle, demoSwatchStyle } from "../demo-layout.js";
import Select from '@crab-dev/rc-select';
export const meta = {
    title: "ELK 自动图布局",
    description: "FlowDiagram 内置 ELK 布局 + 正交走线。节点可拖拽，边自动绕开节点。切换算法 / 方向后自动重新布局并适应视图。",
};

import { useEffect, useRef, useState } from 'react';
import FlowDiagram, { FlowNode, FlowEdge, DEFAULT_FLOW_DIAGRAM_PALETTE } from '../../src/index.js';
import type { FlowDiagramControls, ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';

// ─── 图数据（软件架构示例） ────────────────────────────────────────────────────

const NODE_W = 140;
const NODE_H = 48;

type Category = 'client' | 'infra' | 'service' | 'storage';

const CATEGORY_FILL: Record<Category, string> = {
    client:  'oklch(0.60 0.14 256)',
    infra:   'oklch(0.64 0.14 55)',
    service: 'oklch(0.62 0.13 162)',
    storage: 'oklch(0.58 0.14 300)',
};

const CATEGORY_STROKE: Record<Category, string> = {
    client:  'oklch(0.48 0.15 256)',
    infra:   'oklch(0.52 0.15 55)',
    service: 'oklch(0.50 0.14 162)',
    storage: 'oklch(0.46 0.15 300)',
};

const CATEGORY_LABEL: Record<Category, string> = {
    client:  '客户端',
    infra:   '基础设施',
    service: '业务服务',
    storage: '存储层',
};

interface NodeMeta { id: string; label: string; category: Category }

const NODE_META: NodeMeta[] = [
    { id: 'browser',  label: 'Browser',         category: 'client' },
    { id: 'cdn',      label: 'CDN',              category: 'infra' },
    { id: 'gateway',  label: 'API Gateway',      category: 'infra' },
    { id: 'auth',     label: 'Auth Service',     category: 'service' },
    { id: 'user',     label: 'User Service',     category: 'service' },
    { id: 'order',    label: 'Order Service',    category: 'service' },
    { id: 'product',  label: 'Product Service',  category: 'service' },
    { id: 'db',       label: 'Database',         category: 'storage' },
    { id: 'cache',    label: 'Cache',            category: 'storage' },
    { id: 'mq',       label: 'Message Queue',    category: 'infra' },
    { id: 'notify',   label: 'Notify Service',   category: 'service' },
];

const ELK_NODES: ElkLayoutNode[] = NODE_META.map(n => ({ id: n.id, width: NODE_W, height: NODE_H }));

const ELK_EDGES: ElkLayoutEdge[] = [
    { id: 'e1',  source: 'browser',  target: 'cdn' },
    { id: 'e2',  source: 'browser',  target: 'gateway' },
    { id: 'e3',  source: 'cdn',      target: 'gateway' },
    { id: 'e4',  source: 'gateway',  target: 'auth' },
    { id: 'e5',  source: 'gateway',  target: 'user' },
    { id: 'e6',  source: 'gateway',  target: 'order' },
    { id: 'e7',  source: 'gateway',  target: 'product' },
    { id: 'e8',  source: 'user',     target: 'db' },
    { id: 'e9',  source: 'order',    target: 'db' },
    { id: 'e10', source: 'product',  target: 'db' },
    { id: 'e11', source: 'user',     target: 'cache' },
    { id: 'e12', source: 'order',    target: 'mq' },
    { id: 'e13', source: 'mq',       target: 'notify' },
    { id: 'e14', source: 'auth',     target: 'cache' },
];

// ─── 布局完成后自动 fitView ───────────────────────────────────────────────────

function AutoFitOnLayout({ loading, controls }: { loading: boolean; controls: FlowDiagramControls }) {
    // 可变实例状态 ref（例外白名单：跨渲染持有布尔标志，不应触发渲染）
    const wasLoadingRef = useRef(true);
    useEffect(() => {
        const wasLoading = wasLoadingRef.current;
        wasLoadingRef.current = loading;
        if (wasLoading && !loading) {
            const h = requestAnimationFrame(() => controls.fitView(50));
            return () => cancelAnimationFrame(h);
        }
    }, [loading]);
    return null;
}

// ─── Demo 主体 ────────────────────────────────────────────────────────────────

export default function ElkLayoutDemo() {
    const [algo, setAlgo] = useState('layered');
    const [dir,  setDir]  = useState('RIGHT');
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

    const elkOptions: Record<string, string> = {
        'elk.algorithm': algo,
        'elk.spacing.nodeNode': '48',
        'elk.layered.spacing.nodeNodeBetweenLayers': '80',
        ...(algo !== 'stress' ? { 'elk.direction': dir } : {}),
    };

    // 切换算法 / 方向时清空拖拽覆盖，让新布局结果完整生效
    const handleAlgoChange = (newAlgo: string) => {
        setAlgo(newAlgo);
        setNodePositions({});
    };
    const handleDirChange = (newDir: string) => {
        setDir(newDir);
        setNodePositions({});
    };

    return (
        <div className={demoStackStyle}>
            {/* 工具栏 */}
            <div className={demoToolbarStyle}>
                <Select label="算法" value={algo} onValueChange={value => { if (value) handleAlgoChange(value); }}
                    options={[
                        { value: 'layered', label: 'Layered（层次化）' },
                        { value: 'mrtree', label: 'Mr. Tree（树形）' },
                        { value: 'stress', label: 'Stress（力导向）' },
                    ]} />
                {algo !== 'stress' && (
                    <Select label="方向" value={dir} onValueChange={value => { if (value) handleDirChange(value); }}
                        options={[{ value: 'RIGHT', label: '→ 从左到右' }, { value: 'DOWN', label: '↓ 从上到下' }]} />
                )}
            </div>

            {/* 画布：FlowDiagram 封装了 Canvas + Viewport + 网格 + ELK + 路由，消费方只需声明数据和渲染内容 */}
            <div className={diagramViewportStyle} role="region" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>

                <FlowDiagram
                    nodes={ELK_NODES}
                    edges={ELK_EDGES}
                    elkOptions={elkOptions}
                    nodePositions={nodePositions}
                    routingOptions={{ margin: 12, terminalStub: 26 }}
                    width={820}
                    height={520}

                >
                    {({ nodeRects, routes, crossings, loading, controls }) => (
                        <>
                            {/* 布局完成后自动 fitView（必须在 Canvas 上下文内，由此访问 controls） */}
                            <AutoFitOnLayout loading={loading} controls={controls} />

                            {/* 边（zIndex=1，在节点之下） */}
                            {ELK_EDGES.map(e => {
                                const pts = routes[e.id]?.points;
                                if (!pts || pts.length < 2) return null;
                                return <FlowEdge key={e.id} points={pts} crossings={crossings[e.id]} />;
                            })}

                            {/* 节点（zIndex=2，始终在边之上） */}
                            {NODE_META.map(meta => {
                                const rect = nodeRects[meta.id];
                                if (!rect) return null;
                                return (
                                    <FlowNode
                                        key={meta.id}
                                        x={rect.x} y={rect.y}
                                        width={NODE_W} height={NODE_H}
                                        label={meta.label}
                                        fill={CATEGORY_FILL[meta.category]}
                                        labelColor={DEFAULT_FLOW_DIAGRAM_PALETTE.nodeLabel}
                                        stroke={CATEGORY_STROKE[meta.category]}
                                        radius={10}
                                        draggable
                                        onDrag={(dx, dy) => setNodePositions(prev => {
                                            const base = prev[meta.id] ?? rect;
                                            return { ...prev, [meta.id]: { x: base.x + dx, y: base.y + dy } };
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
                {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([cat, label]) => (
                    <span key={cat} className={demoLegendItemStyle}>
                        <svg viewBox="0 0 12 12" className={demoSwatchStyle} aria-hidden="true"><rect width="12" height="12" fill={CATEGORY_FILL[cat]} /></svg>
                        {label}
                    </span>
                ))}
                <span className={demoHintStyle}>
                    拖拽节点移动 · 边自动绕开节点 · 滚轮缩放
                </span>
            </div>
        </div>
    );
}
