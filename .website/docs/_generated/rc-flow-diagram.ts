/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/animated-edge.demo.tsx",
        "title": "FlowEdge 流动动效",
        "description": "flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。",
        "sourceCode": "export const meta = {\n    title: \"FlowEdge 流动动效\",\n    description: \"flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。\",\n};\n\nimport { useState } from 'react';\nimport FlowDiagram, { FlowNode, FlowEdge } from '../../src/index.js';\nimport type { ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';\n\nconst NODE_W = 110;\nconst NODE_H = 44;\n\nconst NODES: ElkLayoutNode[] = [\n    { id: 'a', width: NODE_W, height: NODE_H },\n    { id: 'b', width: NODE_W, height: NODE_H },\n    { id: 'c', width: NODE_W, height: NODE_H },\n    { id: 'd', width: NODE_W, height: NODE_H },\n];\n\nconst EDGES: ElkLayoutEdge[] = [\n    { id: 'e1', source: 'a', target: 'b' },\n    { id: 'e2', source: 'a', target: 'c' },\n    { id: 'e3', source: 'b', target: 'd' },\n    { id: 'e4', source: 'c', target: 'd' },\n];\n\nconst NODE_FILLS: Record\u003cstring, string> = {\n    a: 'oklch(0.55 0.2 260)',\n    b: 'oklch(0.55 0.2 30)',\n    c: 'oklch(0.55 0.2 140)',\n    d: 'oklch(0.55 0.2 320)',\n};\n\nconst NODE_LABELS: Record\u003cstring, string> = {\n    a: '数据源',\n    b: '处理器',\n    c: '过滤器',\n    d: '汇聚点',\n};\n\ninterface EdgeStyle {\n    color?: string;\n    dashLength?: number;\n    gapLength?: number;\n    flowSpeed?: number;\n    lineWidth?: number;\n}\n\nconst EDGE_STYLES: Record\u003cstring, EdgeStyle> = {\n    e1: { dashLength: 6, gapLength: 4, flowSpeed: 24, color: 'oklch(0.5 0.18 260)' },\n    e2: { dashLength: 6, gapLength: 4, flowSpeed: -24, color: 'oklch(0.45 0.15 140)' },\n    e3: { dashLength: 10, gapLength: 6, flowSpeed: 60, lineWidth: 2, color: 'oklch(0.45 0.15 30)' },\n    e4: { dashLength: 6, gapLength: 4, color: 'oklch(0.45 0.15 320)' },\n};\n\nconst EDGE_LABELS: Record\u003cstring, string> = {\n    e1: '顺流 24 px/s',\n    e2: '逆流 -24 px/s',\n    e3: '快速 60 px/s',\n    e4: '静态虚线（对比）',\n};\n\nexport default function AnimatedEdgeDemo() {\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>\n            \u003cdiv style={{ fontSize: 13, color: '#64748b', padding: '4px 0' }}>\n                e1: 顺流 · e2: 逆流（A→C）· e3: 快速（B→D）· e4: 静态对比（C→D）· 拖拽节点验证流动跨拐角连续\n            \u003c/div>\n\n            \u003cFlowDiagram\n                nodes={NODES}\n                edges={EDGES}\n                elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}\n                nodePositions={nodePositions}\n                routingOptions={{ margin: 10, terminalStub: 22 }}\n                width={680}\n                height={380}\n                style={{ border: '1px solid #e0e4ec', borderRadius: 8, background: '#fafbfc' }}\n            >\n                {({ nodeRects, routes, crossings }) => (\n                    \u003c>\n                        {/* 边：flowSpeed 驱动虚线流动，方向与速度各不相同 */}\n                        {EDGES.map(e => {\n                            const pts = routes[e.id]?.points;\n                            if (!pts || pts.length \u003c 2) return null;\n                            return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} {...EDGE_STYLES[e.id]} />;\n                        })}\n\n                        {/* 节点 */}\n                        {NODES.map(n => {\n                            const rect = nodeRects[n.id];\n                            if (!rect) return null;\n                            return (\n                                \u003cFlowNode\n                                    key={n.id}\n                                    x={rect.x} y={rect.y}\n                                    width={NODE_W} height={NODE_H}\n                                    label={NODE_LABELS[n.id]}\n                                    fill={NODE_FILLS[n.id]}\n                                    draggable\n                                    onDrag={(dx, dy) => setNodePositions(prev => {\n                                        const base = prev[n.id] ?? rect;\n                                        return { ...prev, [n.id]: { x: base.x + dx, y: base.y + dy } };\n                                    })}\n                                />\n                            );\n                        })}\n                    \u003c/>\n                )}\n            \u003c/FlowDiagram>\n\n            {/* 图例 */}\n            \u003cdiv style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' }}>\n                {EDGES.map(e => (\n                    \u003cspan key={e.id}>\n                        \u003cspan style={{ color: EDGE_STYLES[e.id]?.color ?? '#6b7280', fontWeight: 500 }}>\n                            {e.source.toUpperCase()}→{e.target.toUpperCase()}\n                        \u003c/span>{' '}\n                        {EDGE_LABELS[e.id]}\n                    \u003c/span>\n                ))}\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fanimated-edge.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fanimated-edge.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/edge.demo.tsx",
        "title": "FlowEdge 样式",
        "description": "FlowEdge 支持实线 / 虚线、单向 / 双向箭头、自定义颜色。节点可拖，边走线自动绕开节点。",
        "sourceCode": "export const meta = {\n    title: \"FlowEdge 样式\",\n    description: \"FlowEdge 支持实线 / 虚线、单向 / 双向箭头、自定义颜色。节点可拖，边走线自动绕开节点。\",\n};\n\nimport { useState } from 'react';\nimport FlowDiagram, { FlowNode, FlowEdge } from '../../src/index.js';\nimport type { ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';\n\nconst NODE_W = 110;\nconst NODE_H = 44;\n\nconst NODES: ElkLayoutNode[] = [\n    { id: 'a', width: NODE_W, height: NODE_H },\n    { id: 'b', width: NODE_W, height: NODE_H },\n    { id: 'c', width: NODE_W, height: NODE_H },\n    { id: 'd', width: NODE_W, height: NODE_H },\n];\n\nconst EDGES: ElkLayoutEdge[] = [\n    { id: 'e1', source: 'a', target: 'b' },\n    { id: 'e2', source: 'a', target: 'c' },\n    { id: 'e3', source: 'b', target: 'd' },\n    { id: 'e4', source: 'c', target: 'd' },\n];\n\nconst NODE_FILLS: Record\u003cstring, string> = {\n    a: 'oklch(0.55 0.2 260)',\n    b: 'oklch(0.55 0.2 30)',\n    c: 'oklch(0.55 0.2 140)',\n    d: 'oklch(0.55 0.2 320)',\n};\n\nconst NODE_LABELS: Record\u003cstring, string> = {\n    a: '节点 A',\n    b: '节点 B',\n    c: '节点 C',\n    d: '节点 D',\n};\n\ninterface EdgeStyle {\n    color?: string;\n    dashLength?: number;\n    gapLength?: number;\n    arrowStart?: boolean;\n    arrowEnd?: boolean;\n    lineWidth?: number;\n}\n\nconst EDGE_STYLES: Record\u003cstring, EdgeStyle> = {\n    e1: {},\n    e2: { dashLength: 6, gapLength: 4, color: 'oklch(0.45 0.15 140)' },\n    e3: { arrowStart: true, color: 'oklch(0.45 0.15 30)' },\n    e4: { arrowEnd: false, color: 'oklch(0.45 0.15 320)', lineWidth: 2.5 },\n};\n\nconst EDGE_LABELS: Record\u003cstring, string> = {\n    e1: '默认箭头',\n    e2: '虚线',\n    e3: '双向箭头',\n    e4: '无箭头',\n};\n\nexport default function EdgeDemo() {\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>\n            \u003cdiv style={{ fontSize: 13, color: '#64748b', padding: '4px 0' }}>\n                e1: 默认箭头 · e2: 虚线（A→C）· e3: 双向箭头（B→D）· e4: 无箭头（C→D）· 拖拽节点移动\n            \u003c/div>\n\n            \u003cFlowDiagram\n                nodes={NODES}\n                edges={EDGES}\n                elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}\n                nodePositions={nodePositions}\n                routingOptions={{ margin: 10, terminalStub: 22 }}\n                width={680}\n                height={380}\n                style={{ border: '1px solid #e0e4ec', borderRadius: 8, background: '#fafbfc' }}\n            >\n                {({ nodeRects, routes, crossings }) => (\n                    \u003c>\n                        {/* 边：每条样式不同，演示 FlowEdge props */}\n                        {EDGES.map(e => {\n                            const pts = routes[e.id]?.points;\n                            if (!pts || pts.length \u003c 2) return null;\n                            return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} {...EDGE_STYLES[e.id]} />;\n                        })}\n\n                        {/* 节点 */}\n                        {NODES.map(n => {\n                            const rect = nodeRects[n.id];\n                            if (!rect) return null;\n                            return (\n                                \u003cFlowNode\n                                    key={n.id}\n                                    x={rect.x} y={rect.y}\n                                    width={NODE_W} height={NODE_H}\n                                    label={NODE_LABELS[n.id]}\n                                    fill={NODE_FILLS[n.id]}\n                                    draggable\n                                    onDrag={(dx, dy) => setNodePositions(prev => {\n                                        const base = prev[n.id] ?? rect;\n                                        return { ...prev, [n.id]: { x: base.x + dx, y: base.y + dy } };\n                                    })}\n                                />\n                            );\n                        })}\n                    \u003c/>\n                )}\n            \u003c/FlowDiagram>\n\n            {/* 图例 */}\n            \u003cdiv style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' }}>\n                {EDGES.map(e => (\n                    \u003cspan key={e.id}>\n                        \u003cspan style={{ color: EDGE_STYLES[e.id]?.color ?? '#6b7280', fontWeight: 500 }}>\n                            {e.source.toUpperCase()}→{e.target.toUpperCase()}\n                        \u003c/span>{' '}\n                        {EDGE_LABELS[e.id]}\n                    \u003c/span>\n                ))}\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fedge.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fedge.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/elk-layout.demo.tsx",
        "title": "ELK 自动图布局",
        "description": "FlowDiagram 内置 ELK 布局 + 正交走线。节点可拖拽，边自动绕开节点。切换算法 / 方向后自动重新布局并适应视图。",
        "sourceCode": "export const meta = {\n    title: \"ELK 自动图布局\",\n    description: \"FlowDiagram 内置 ELK 布局 + 正交走线。节点可拖拽，边自动绕开节点。切换算法 / 方向后自动重新布局并适应视图。\",\n};\n\nimport { useEffect, useRef, useState, type CSSProperties } from 'react';\nimport FlowDiagram, { FlowNode, FlowEdge } from '../../src/index.js';\nimport type { FlowDiagramControls, ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';\n\n// ─── 图数据（软件架构示例） ────────────────────────────────────────────────────\n\nconst NODE_W = 140;\nconst NODE_H = 48;\n\ntype Category = 'client' | 'infra' | 'service' | 'storage';\n\nconst CATEGORY_FILL: Record\u003cCategory, string> = {\n    client:  'oklch(0.60 0.14 256)',\n    infra:   'oklch(0.64 0.14 55)',\n    service: 'oklch(0.62 0.13 162)',\n    storage: 'oklch(0.58 0.14 300)',\n};\n\nconst CATEGORY_STROKE: Record\u003cCategory, string> = {\n    client:  'oklch(0.48 0.15 256)',\n    infra:   'oklch(0.52 0.15 55)',\n    service: 'oklch(0.50 0.14 162)',\n    storage: 'oklch(0.46 0.15 300)',\n};\n\nconst CATEGORY_LABEL: Record\u003cCategory, string> = {\n    client:  '客户端',\n    infra:   '基础设施',\n    service: '业务服务',\n    storage: '存储层',\n};\n\ninterface NodeMeta { id: string; label: string; category: Category }\n\nconst NODE_META: NodeMeta[] = [\n    { id: 'browser',  label: 'Browser',         category: 'client' },\n    { id: 'cdn',      label: 'CDN',              category: 'infra' },\n    { id: 'gateway',  label: 'API Gateway',      category: 'infra' },\n    { id: 'auth',     label: 'Auth Service',     category: 'service' },\n    { id: 'user',     label: 'User Service',     category: 'service' },\n    { id: 'order',    label: 'Order Service',    category: 'service' },\n    { id: 'product',  label: 'Product Service',  category: 'service' },\n    { id: 'db',       label: 'Database',         category: 'storage' },\n    { id: 'cache',    label: 'Cache',            category: 'storage' },\n    { id: 'mq',       label: 'Message Queue',    category: 'infra' },\n    { id: 'notify',   label: 'Notify Service',   category: 'service' },\n];\n\nconst ELK_NODES: ElkLayoutNode[] = NODE_META.map(n => ({ id: n.id, width: NODE_W, height: NODE_H }));\n\nconst ELK_EDGES: ElkLayoutEdge[] = [\n    { id: 'e1',  source: 'browser',  target: 'cdn' },\n    { id: 'e2',  source: 'browser',  target: 'gateway' },\n    { id: 'e3',  source: 'cdn',      target: 'gateway' },\n    { id: 'e4',  source: 'gateway',  target: 'auth' },\n    { id: 'e5',  source: 'gateway',  target: 'user' },\n    { id: 'e6',  source: 'gateway',  target: 'order' },\n    { id: 'e7',  source: 'gateway',  target: 'product' },\n    { id: 'e8',  source: 'user',     target: 'db' },\n    { id: 'e9',  source: 'order',    target: 'db' },\n    { id: 'e10', source: 'product',  target: 'db' },\n    { id: 'e11', source: 'user',     target: 'cache' },\n    { id: 'e12', source: 'order',    target: 'mq' },\n    { id: 'e13', source: 'mq',       target: 'notify' },\n    { id: 'e14', source: 'auth',     target: 'cache' },\n];\n\n// ─── 样式常量 ──────────────────────────────────────────────────────────────────\n\nconst labelStyle: CSSProperties = {\n    fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 6,\n};\nconst controlStyle: CSSProperties = {\n    fontSize: 13, padding: '4px 8px', borderRadius: 6,\n    border: '1px solid #d4d9e0', background: '#fff', color: '#1e293b',\n    cursor: 'pointer', outline: 'none',\n};\n\n// ─── 布局完成后自动 fitView ───────────────────────────────────────────────────\n\nfunction AutoFitOnLayout({ loading, controls }: { loading: boolean; controls: FlowDiagramControls }) {\n    // 可变实例状态 ref（例外白名单：跨渲染持有布尔标志，不应触发渲染）\n    const wasLoadingRef = useRef(true);\n    useEffect(() => {\n        const wasLoading = wasLoadingRef.current;\n        wasLoadingRef.current = loading;\n        if (wasLoading && !loading) {\n            const h = requestAnimationFrame(() => controls.fitView(50));\n            return () => cancelAnimationFrame(h);\n        }\n    }, [loading]);\n    return null;\n}\n\n// ─── Demo 主体 ────────────────────────────────────────────────────────────────\n\nexport default function ElkLayoutDemo() {\n    const [algo, setAlgo] = useState('layered');\n    const [dir,  setDir]  = useState('RIGHT');\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    const elkOptions: Record\u003cstring, string> = {\n        'elk.algorithm': algo,\n        'elk.spacing.nodeNode': '48',\n        'elk.layered.spacing.nodeNodeBetweenLayers': '80',\n        ...(algo !== 'stress' ? { 'elk.direction': dir } : {}),\n    };\n\n    // 切换算法 / 方向时清空拖拽覆盖，让新布局结果完整生效\n    const handleAlgoChange = (newAlgo: string) => {\n        setAlgo(newAlgo);\n        setNodePositions({});\n    };\n    const handleDirChange = (newDir: string) => {\n        setDir(newDir);\n        setNodePositions({});\n    };\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>\n            {/* 工具栏 */}\n            \u003cdiv style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>\n                \u003clabel style={labelStyle}>\n                    算法\n                    \u003cselect value={algo} onChange={e => handleAlgoChange(e.target.value)} style={controlStyle}>\n                        \u003coption value=\"layered\">Layered（层次化）\u003c/option>\n                        \u003coption value=\"mrtree\">Mr. Tree（树形）\u003c/option>\n                        \u003coption value=\"stress\">Stress（力导向）\u003c/option>\n                    \u003c/select>\n                \u003c/label>\n                {algo !== 'stress' && (\n                    \u003clabel style={labelStyle}>\n                        方向\n                        \u003cselect value={dir} onChange={e => handleDirChange(e.target.value)} style={controlStyle}>\n                            \u003coption value=\"RIGHT\">→ 从左到右\u003c/option>\n                            \u003coption value=\"DOWN\">↓ 从上到下\u003c/option>\n                        \u003c/select>\n                    \u003c/label>\n                )}\n            \u003c/div>\n\n            {/* 画布：FlowDiagram 封装了 Canvas + Viewport + 网格 + ELK + 路由，消费方只需声明数据和渲染内容 */}\n            \u003cFlowDiagram\n                nodes={ELK_NODES}\n                edges={ELK_EDGES}\n                elkOptions={elkOptions}\n                nodePositions={nodePositions}\n                routingOptions={{ margin: 12, terminalStub: 26 }}\n                width={820}\n                height={520}\n                style={{ border: '1px solid #e2e6ec', borderRadius: 10, background: '#f7f8fa' }}\n            >\n                {({ nodeRects, routes, crossings, loading, controls }) => (\n                    \u003c>\n                        {/* 布局完成后自动 fitView（必须在 Canvas 上下文内，由此访问 controls） */}\n                        \u003cAutoFitOnLayout loading={loading} controls={controls} />\n\n                        {/* 边（zIndex=1，在节点之下） */}\n                        {ELK_EDGES.map(e => {\n                            const pts = routes[e.id]?.points;\n                            if (!pts || pts.length \u003c 2) return null;\n                            return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} />;\n                        })}\n\n                        {/* 节点（zIndex=2，始终在边之上） */}\n                        {NODE_META.map(meta => {\n                            const rect = nodeRects[meta.id];\n                            if (!rect) return null;\n                            return (\n                                \u003cFlowNode\n                                    key={meta.id}\n                                    x={rect.x} y={rect.y}\n                                    width={NODE_W} height={NODE_H}\n                                    label={meta.label}\n                                    fill={CATEGORY_FILL[meta.category]}\n                                    stroke={CATEGORY_STROKE[meta.category]}\n                                    radius={10}\n                                    draggable\n                                    onDrag={(dx, dy) => setNodePositions(prev => {\n                                        const base = prev[meta.id] ?? rect;\n                                        return { ...prev, [meta.id]: { x: base.x + dx, y: base.y + dy } };\n                                    })}\n                                />\n                            );\n                        })}\n                    \u003c/>\n                )}\n            \u003c/FlowDiagram>\n\n            {/* 图例 */}\n            \u003cdiv style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>\n                {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([cat, label]) => (\n                    \u003cspan key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>\n                        \u003cspan style={{\n                            width: 12, height: 12, borderRadius: 4,\n                            background: CATEGORY_FILL[cat], display: 'inline-block', flexShrink: 0,\n                        }} />\n                        {label}\n                    \u003c/span>\n                ))}\n                \u003cspan style={{ fontSize: 12, color: '#94a3b8', marginLeft: 'auto' }}>\n                    拖拽节点移动 · 边自动绕开节点 · 滚轮缩放\n                \u003c/span>\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Felk-layout.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Felk-layout.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "FlowDiagram",
    "symbol": "FlowDiagramProps",
    "props": [
        {
            "name": "children",
            "required": true,
            "description": "render prop：在画布上下文中渲染流程图内容",
            "typeText": "(ctx: FlowDiagramRenderContext) => ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "edges",
            "required": true,
            "description": "ELK 布局输入边",
            "typeText": "ElkLayoutEdge[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "elkOptions",
            "required": false,
            "description": "ELK 布局算法选项，默认 layered + RIGHT",
            "typeText": "Record\u003cstring, string>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "gridBaseSpacing",
            "required": false,
            "description": "",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "gridColor",
            "required": false,
            "description": "无限网格颜色，默认 #eceef3",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "gridSubdivisions",
            "required": false,
            "description": "",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "height",
            "required": false,
            "description": "",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "manualRoutes",
            "required": false,
            "description": "手动走线覆盖（draw.io 风格）：`edgeId → ManualRoute`。 提供后对应边按此固定走线，不再自动避让。",
            "typeText": "Record\u003cstring, ManualRoute>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "nodePositions",
            "required": false,
            "description": "节点位置覆盖：`nodeId → { x, y }`。 用于拖拽后实时更新节点位置并触发路由重算， 未覆盖的节点取 ELK 布局结果。",
            "typeText": "Record\u003cstring, { x: number; y: number }>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "nodes",
            "required": true,
            "description": "ELK 布局输入节点（需提供稳定 id 与宽高）",
            "typeText": "ElkLayoutNode[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onEmptyClick",
            "required": false,
            "description": "点击空白区域时触发",
            "typeText": "() => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "routingOptions",
            "required": false,
            "description": "路由选项（不含 manualRoutes，单独由 manualRoutes prop 控制）",
            "typeText": "Omit\u003cUseEdgeRoutingOptions, 'manualRoutes'>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "style",
            "required": false,
            "description": "",
            "typeText": "CSSProperties",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "width",
            "required": false,
            "description": "",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
