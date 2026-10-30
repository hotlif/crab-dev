/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "流程工作区状态矩阵",
        "description": "真实 ELK 布局、选中、拖动、手动路由和失败；下方等价节点入口可用键盘选择和移动。",
        "learning": {
            "components": [
                "FlowDiagram",
                "FlowEdge",
                "FlowNode"
            ],
            "props": [
                "nodes",
                "edges",
                "width",
                "height",
                "nodePositions",
                "elkOptions",
                "manualRoutes",
                "onEmptyClick",
                "points",
                "crossings",
                "dashLength",
                "gapLength"
            ],
            "events": [
                "onEmptyClick",
                "onClick",
                "onDrag"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport FlowDiagram, { FlowNode, FlowEdge, type ElkLayoutNode, type ElkLayoutEdge, type FlowDiagramRenderContext } from '@crab-dev/rc-flow-diagram';\nimport token from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '流程工作区状态矩阵', description: '真实 ELK 布局、选中、拖动、手动路由和失败；下方等价节点入口可用键盘选择和移动。' };\nconst nodes: ElkLayoutNode[] = [{ id: 'request', width: 148, height: 56 }, { id: 'review', width: 148, height: 56 }, { id: 'complete', width: 148, height: 56 }];\nconst edges: ElkLayoutEdge[] = [{ id: 'to-review', source: 'request', target: 'review' }, { id: 'to-complete', source: 'review', target: 'complete' }];\nconst sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; max-inline-size: 100%;`;\nconst scrollStyle = css`overflow: auto; max-inline-size: 100%; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: -2px; }`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block: ${token.space['component-gap']};`;\nconst nodeControlStyle = css`border: 1px solid ${token.color.border.default}; background: ${token.color.surface.content}; color: ${token.color.text.primary}; padding: ${token.space['component-gap']}; border-radius: ${token.shape.control}; font: inherit; &[aria-pressed='true'] { background: ${token.color.selection.background}; color: ${token.color.selection.foreground}; } &:focus-visible { outline: 2px solid ${token.color.focus.ring}; } @media (pointer: coarse) { min-inline-size: ${token.size['touch-target']}; min-block-size: ${token.size['touch-target']}; }`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\n\nfunction LayoutStatus({ context }: { context: FlowDiagramRenderContext }) {\n    return \u003coutput className={statusStyle} aria-label=\"布局状态\" data-layout={context.loading ? 'loading' : context.error ? 'error' : 'ready'} data-node-count={Object.keys(context.nodeRects).length} data-node-rects={JSON.stringify(context.nodeRects)} data-routes={JSON.stringify(context.routes)} data-label-color={context.palette.nodeLabel} data-zoom={context.zoom}>\n        {context.error ? `ELK: ${context.error.message}` : context.loading ? 'ELK loading' : `ELK ready · ${Object.keys(context.nodeRects).length} nodes`}\n    \u003c/output>;\n}\n\nexport default function VisualMatrixDemo() {\n    const [mode, setMode] = useState('default');\n    const [selected, setSelected] = useState('');\n    const [positions, setPositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n    const [exported, setExported] = useState('');\n    const visibleNodes = mode === 'empty' ? [] : mode === 'refresh' ? [...nodes, { id: 'archive', width: 148, height: 56 }] : nodes;\n    const visibleEdges = mode === 'empty' ? [] : mode === 'refresh' ? [...edges, { id: 'to-archive', source: 'complete', target: 'archive' }] : edges;\n    const move = (id: string, x: number, y: number, dx: number, dy: number) => setPositions(previous => ({ ...previous, [id]: { x: (previous[id]?.x ?? x) + dx, y: (previous[id]?.y ?? y) + dy } }));\n    return \u003cdiv>\n        \u003clabel>验收状态 \u003cselect aria-label=\"验收状态\" value={mode} onChange={event => { setMode(event.target.value); setPositions({}); }}>\n            {['default', 'empty', 'error', 'manual-route', 'long-text', 'refresh', 'motion'].map(value => \u003coption key={value} value={value}>{value}\u003c/option>)}\n        \u003c/select>\u003c/label>\n        \u003csection aria-label=\"FlowDiagram visual matrix\" className={sceneStyle} data-selection={selected} data-positions={JSON.stringify(positions)}>\n            \u003cdiv role=\"region\" aria-label=\"流程图滚动区域\" tabIndex={0} className={scrollStyle}>\n                \u003cFlowDiagram nodes={visibleNodes} edges={visibleEdges} width={640} height={250} nodePositions={positions}\n                    elkOptions={mode === 'error' ? { 'elk.algorithm': 'crab.invalid-algorithm' } : undefined}\n                    manualRoutes={mode === 'manual-route' ? { 'to-review': { source: 'request', target: 'review', sourcePort: { side: 'bottom', t: 0.5 }, targetPort: { side: 'bottom', t: 0.5 }, waypoints: [{ x: 180, y: 150 }] } } : undefined}\n                    onEmptyClick={() => setSelected('')}>\n                    {context => \u003c>\n                        \u003cLayoutStatus context={context} />\n                        \u003cdiv className={rowStyle} role=\"toolbar\" aria-label=\"流程图视图工具栏\">\n                            \u003cbutton className={nodeControlStyle} type=\"button\" onClick={() => context.controls.fitView(24)}>适应流程图\u003c/button>\n                            \u003cbutton className={nodeControlStyle} type=\"button\" onClick={context.controls.zoomIn}>放大流程图\u003c/button>\n                            \u003cbutton className={nodeControlStyle} type=\"button\" onClick={context.controls.zoomOut}>缩小流程图\u003c/button>\n                            \u003cbutton className={nodeControlStyle} type=\"button\" onClick={() => setExported(context.controls.exportPNG())}>导出流程图 PNG\u003c/button>\n                        \u003c/div>\n                        {visibleEdges.map(edge => {\n                            const points = context.routes[edge.id]?.points;\n                            return points && points.length > 1 ? \u003cFlowEdge key={edge.id} points={points} crossings={context.crossings[edge.id]} dashLength={mode === 'motion' ? 6 : 0} gapLength={4} flowSpeed={mode === 'motion' ? 30 : 0} /> : null;\n                        })}\n                        {visibleNodes.map(node => {\n                            const rect = context.nodeRects[node.id];\n                            return rect ? \u003cFlowNode key={node.id} {...rect} label={mode === 'long-text' ? `${node.id} · 长文本 Enterprise` : node.id}\n                                fill={selected === node.id ? token.color.selection.background : undefined} labelColor={selected === node.id ? token.color.selection.foreground : undefined}\n                                stroke={selected === node.id ? token.color.selection.border : undefined} strokeWidth={selected === node.id ? 2 : 1}\n                                draggable onClick={() => setSelected(node.id)} onDrag={(dx, dy) => move(node.id, rect.x, rect.y, dx, dy)} /> : null;\n                        })}\n                        \u003cdiv className={rowStyle} role=\"group\" aria-label=\"节点键盘入口\">\n                            {visibleNodes.map(node => \u003cbutton className={nodeControlStyle} key={node.id} type=\"button\" aria-pressed={selected === node.id}\n                                onClick={() => setSelected(node.id)} onKeyDown={event => {\n                                    const deltas: Record\u003cstring, [number, number]> = { ArrowRight: [10, 0], ArrowLeft: [-10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };\n                                    const delta = deltas[event.key], rect = context.nodeRects[node.id];\n                                    if (delta && rect) { event.preventDefault(); move(node.id, rect.x, rect.y, ...delta); }\n                                }}>{node.id}\u003c/button>)}\n                        \u003c/div>\n                    \u003c/>}\n                \u003c/FlowDiagram>\n            \u003c/div>\n            {exported && \u003cimg src={exported} alt=\"导出的流程图 PNG\" />}\n        \u003c/section>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "三体系视觉与交互矩阵"
    },
    {
        "id": "docs/demos/animated-edge.demo.tsx",
        "title": "FlowEdge 流动动效",
        "description": "flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。",
        "learning": {
            "components": [
                "FlowDiagram",
                "FlowEdge",
                "FlowNode"
            ],
            "props": [
                "nodes",
                "edges",
                "elkOptions",
                "nodePositions",
                "routingOptions",
                "width",
                "height",
                "points",
                "crossings",
                "x",
                "y",
                "label"
            ],
            "events": [
                "onDrag"
            ],
            "hasState": true
        },
        "sourceCode": "import { diagramViewportStyle, demoStackStyle, demoHintStyle, demoLegendStyle, demoLegendLabelStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"FlowEdge 流动动效\",\n    description: \"flowSpeed 让虚线沿边流动，表达数据流向：正值顺流、负值逆流、数值越大越快。流动相位按累计弧长逐段衔接，拖拽节点改变走线后，图案跨拐角与交叉缺口依旧连续；系统开启「减弱动态效果」时自动降级为静态虚线。\",\n};\n\nimport { useState } from 'react';\nimport token from '@crab-dev/rc-token-semantic';\nimport FlowDiagram, { FlowNode, FlowEdge, DEFAULT_FLOW_DIAGRAM_PALETTE } from '@crab-dev/rc-flow-diagram';\nimport type { ElkLayoutNode, ElkLayoutEdge } from '@crab-dev/rc-flow-diagram';\n\nconst NODE_W = 110;\nconst NODE_H = 44;\n\nconst NODES: ElkLayoutNode[] = [\n    { id: 'a', width: NODE_W, height: NODE_H },\n    { id: 'b', width: NODE_W, height: NODE_H },\n    { id: 'c', width: NODE_W, height: NODE_H },\n    { id: 'd', width: NODE_W, height: NODE_H },\n];\n\nconst EDGES: ElkLayoutEdge[] = [\n    { id: 'e1', source: 'a', target: 'b' },\n    { id: 'e2', source: 'a', target: 'c' },\n    { id: 'e3', source: 'b', target: 'd' },\n    { id: 'e4', source: 'c', target: 'd' },\n];\n\nconst NODE_FILLS: Record\u003cstring, string> = {\n    a: 'oklch(0.55 0.2 260)',\n    b: 'oklch(0.55 0.2 30)',\n    c: 'oklch(0.55 0.2 140)',\n    d: 'oklch(0.55 0.2 320)',\n};\n\nconst NODE_LABELS: Record\u003cstring, string> = {\n    a: '数据源',\n    b: '处理器',\n    c: '过滤器',\n    d: '汇聚点',\n};\n\ninterface EdgeStyle {\n    color?: string;\n    dashLength?: number;\n    gapLength?: number;\n    flowSpeed?: number;\n    lineWidth?: number;\n}\n\nconst EDGE_STYLES: Record\u003cstring, EdgeStyle> = {\n    e1: { dashLength: 6, gapLength: 4, flowSpeed: 24, color: token.color.brand.primary },\n    e2: { dashLength: 6, gapLength: 4, flowSpeed: -24, color: token.color.feedback.success.icon },\n    e3: { dashLength: 10, gapLength: 6, flowSpeed: 60, lineWidth: 2, color: token.color.feedback.error.icon },\n    e4: { dashLength: 6, gapLength: 4, color: token.color.tertiary.primary },\n};\n\nconst EDGE_LABELS: Record\u003cstring, string> = {\n    e1: '顺流 24 px/s',\n    e2: '逆流 -24 px/s',\n    e3: '快速 60 px/s',\n    e4: '静态虚线（对比）',\n};\n\nexport default function AnimatedEdgeDemo() {\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cdiv className={demoHintStyle}>\n                e1: 顺流 · e2: 逆流（A→C）· e3: 快速（B→D）· e4: 静态对比（C→D）· 拖拽节点验证流动跨拐角连续\n            \u003c/div>\n\n            \u003cdiv className={diagramViewportStyle} role=\"region\" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>\n\n\n                \u003cFlowDiagram\n                    nodes={NODES}\n                    edges={EDGES}\n                    elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}\n                    nodePositions={nodePositions}\n                    routingOptions={{ margin: 10, terminalStub: 22 }}\n                    width={680}\n                    height={380}\n\n                >\n                    {({ nodeRects, routes, crossings }) => (\n                        \u003c>\n                            {/* 边：flowSpeed 驱动虚线流动，方向与速度各不相同 */}\n                            {EDGES.map(e => {\n                                const pts = routes[e.id]?.points;\n                                if (!pts || pts.length \u003c 2) return null;\n                                return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} {...EDGE_STYLES[e.id]} />;\n                            })}\n\n                            {/* 节点 */}\n                            {NODES.map(n => {\n                                const rect = nodeRects[n.id];\n                                if (!rect) return null;\n                                return (\n                                    \u003cFlowNode\n                                        key={n.id}\n                                        x={rect.x} y={rect.y}\n                                        width={NODE_W} height={NODE_H}\n                                        label={NODE_LABELS[n.id]}\n                                        fill={NODE_FILLS[n.id]}\n                                        labelColor={DEFAULT_FLOW_DIAGRAM_PALETTE.nodeLabel}\n                                        draggable\n                                        onDrag={(dx, dy) => setNodePositions(prev => {\n                                            const base = prev[n.id] ?? rect;\n                                            return { ...prev, [n.id]: { x: base.x + dx, y: base.y + dy } };\n                                        })}\n                                    />\n                                );\n                            })}\n                        \u003c/>\n                    )}\n                \u003c/FlowDiagram>\n\n            \u003c/div>\n\n            {/* 图例 */}\n            \u003cdiv className={demoLegendStyle}>\n                {EDGES.map(e => (\n                    \u003cspan key={e.id}>\n                        \u003cspan className={demoLegendLabelStyle}>\n                            {e.source.toUpperCase()}→{e.target.toUpperCase()}\n                        \u003c/span>{' '}\n                        {EDGE_LABELS[e.id]}\n                    \u003c/span>\n                ))}\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fanimated-edge.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fanimated-edge.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/edge.demo.tsx",
        "title": "FlowEdge 样式",
        "description": "FlowEdge 支持实线 / 虚线、单向 / 双向箭头、自定义颜色。节点可拖，边走线自动绕开节点。",
        "learning": {
            "components": [
                "FlowDiagram",
                "FlowEdge",
                "FlowNode"
            ],
            "props": [
                "nodes",
                "edges",
                "elkOptions",
                "nodePositions",
                "routingOptions",
                "width",
                "height",
                "points",
                "crossings",
                "x",
                "y",
                "label"
            ],
            "events": [
                "onDrag"
            ],
            "hasState": true
        },
        "sourceCode": "import { diagramViewportStyle, demoStackStyle, demoHintStyle, demoLegendStyle, demoLegendLabelStyle } from \"../demo-layout.js\";\nexport const meta = {\n    title: \"FlowEdge 样式\",\n    description: \"FlowEdge 支持实线 / 虚线、单向 / 双向箭头、自定义颜色。节点可拖，边走线自动绕开节点。\",\n};\n\nimport { useState } from 'react';\nimport token from '@crab-dev/rc-token-semantic';\nimport FlowDiagram, { FlowNode, FlowEdge, DEFAULT_FLOW_DIAGRAM_PALETTE } from '@crab-dev/rc-flow-diagram';\nimport type { ElkLayoutNode, ElkLayoutEdge } from '@crab-dev/rc-flow-diagram';\n\nconst NODE_W = 110;\nconst NODE_H = 44;\n\nconst NODES: ElkLayoutNode[] = [\n    { id: 'a', width: NODE_W, height: NODE_H },\n    { id: 'b', width: NODE_W, height: NODE_H },\n    { id: 'c', width: NODE_W, height: NODE_H },\n    { id: 'd', width: NODE_W, height: NODE_H },\n];\n\nconst EDGES: ElkLayoutEdge[] = [\n    { id: 'e1', source: 'a', target: 'b' },\n    { id: 'e2', source: 'a', target: 'c' },\n    { id: 'e3', source: 'b', target: 'd' },\n    { id: 'e4', source: 'c', target: 'd' },\n];\n\nconst NODE_FILLS: Record\u003cstring, string> = {\n    a: 'oklch(0.55 0.2 260)',\n    b: 'oklch(0.55 0.2 30)',\n    c: 'oklch(0.55 0.2 140)',\n    d: 'oklch(0.55 0.2 320)',\n};\n\nconst NODE_LABELS: Record\u003cstring, string> = {\n    a: '节点 A',\n    b: '节点 B',\n    c: '节点 C',\n    d: '节点 D',\n};\n\ninterface EdgeStyle {\n    color?: string;\n    dashLength?: number;\n    gapLength?: number;\n    arrowStart?: boolean;\n    arrowEnd?: boolean;\n    lineWidth?: number;\n}\n\nconst EDGE_STYLES: Record\u003cstring, EdgeStyle> = {\n    e1: {},\n    e2: { dashLength: 6, gapLength: 4, color: token.color.feedback.success.icon },\n    e3: { arrowStart: true, color: token.color.feedback.error.icon },\n    e4: { arrowEnd: false, color: token.color.tertiary.primary, lineWidth: 2.5 },\n};\n\nconst EDGE_LABELS: Record\u003cstring, string> = {\n    e1: '默认箭头',\n    e2: '虚线',\n    e3: '双向箭头',\n    e4: '无箭头',\n};\n\nexport default function EdgeDemo() {\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            \u003cdiv className={demoHintStyle}>\n                e1: 默认箭头 · e2: 虚线（A→C）· e3: 双向箭头（B→D）· e4: 无箭头（C→D）· 拖拽节点移动\n            \u003c/div>\n\n            \u003cdiv className={diagramViewportStyle} role=\"region\" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>\n\n\n                \u003cFlowDiagram\n                    nodes={NODES}\n                    edges={EDGES}\n                    elkOptions={{ 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' }}\n                    nodePositions={nodePositions}\n                    routingOptions={{ margin: 10, terminalStub: 22 }}\n                    width={680}\n                    height={380}\n\n                >\n                    {({ nodeRects, routes, crossings }) => (\n                        \u003c>\n                            {/* 边：每条样式不同，演示 FlowEdge props */}\n                            {EDGES.map(e => {\n                                const pts = routes[e.id]?.points;\n                                if (!pts || pts.length \u003c 2) return null;\n                                return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} {...EDGE_STYLES[e.id]} />;\n                            })}\n\n                            {/* 节点 */}\n                            {NODES.map(n => {\n                                const rect = nodeRects[n.id];\n                                if (!rect) return null;\n                                return (\n                                    \u003cFlowNode\n                                        key={n.id}\n                                        x={rect.x} y={rect.y}\n                                        width={NODE_W} height={NODE_H}\n                                        label={NODE_LABELS[n.id]}\n                                        fill={NODE_FILLS[n.id]}\n                                        labelColor={DEFAULT_FLOW_DIAGRAM_PALETTE.nodeLabel}\n                                        draggable\n                                        onDrag={(dx, dy) => setNodePositions(prev => {\n                                            const base = prev[n.id] ?? rect;\n                                            return { ...prev, [n.id]: { x: base.x + dx, y: base.y + dy } };\n                                        })}\n                                    />\n                                );\n                            })}\n                        \u003c/>\n                    )}\n                \u003c/FlowDiagram>\n\n            \u003c/div>\n\n            {/* 图例 */}\n            \u003cdiv className={demoLegendStyle}>\n                {EDGES.map(e => (\n                    \u003cspan key={e.id}>\n                        \u003cspan className={demoLegendLabelStyle}>\n                            {e.source.toUpperCase()}→{e.target.toUpperCase()}\n                        \u003c/span>{' '}\n                        {EDGE_LABELS[e.id]}\n                    \u003c/span>\n                ))}\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fedge.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fedge.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/elk-layout.demo.tsx",
        "title": "ELK 自动图布局",
        "description": "FlowDiagram 内置 ELK 布局 + 正交走线。节点可拖拽，边自动绕开节点。切换算法 / 方向后自动重新布局并适应视图。",
        "learning": {
            "components": [
                "Select",
                "FlowDiagram",
                "FlowEdge",
                "FlowNode"
            ],
            "props": [
                "label",
                "value",
                "onValueChange",
                "options",
                "nodes",
                "edges",
                "elkOptions",
                "nodePositions",
                "routingOptions",
                "width",
                "height",
                "points"
            ],
            "events": [
                "onValueChange",
                "onDrag"
            ],
            "hasState": true
        },
        "sourceCode": "import { diagramViewportStyle, demoStackStyle, demoToolbarStyle, demoHintStyle, demoLegendStyle, demoLegendItemStyle, demoSwatchStyle } from \"../demo-layout.js\";\nimport Select from '@crab-dev/rc-select';\nexport const meta = {\n    title: \"ELK 自动图布局\",\n    description: \"FlowDiagram 内置 ELK 布局 + 正交走线。节点可拖拽，边自动绕开节点。切换算法 / 方向后自动重新布局并适应视图。\",\n};\n\nimport { useEffect, useRef, useState } from 'react';\nimport FlowDiagram, { FlowNode, FlowEdge, DEFAULT_FLOW_DIAGRAM_PALETTE } from '../../src/index.js';\nimport type { FlowDiagramControls, ElkLayoutNode, ElkLayoutEdge } from '../../src/index.js';\n\n// ─── 图数据（软件架构示例） ────────────────────────────────────────────────────\n\nconst NODE_W = 140;\nconst NODE_H = 48;\n\ntype Category = 'client' | 'infra' | 'service' | 'storage';\n\nconst CATEGORY_FILL: Record\u003cCategory, string> = {\n    client:  'oklch(0.60 0.14 256)',\n    infra:   'oklch(0.64 0.14 55)',\n    service: 'oklch(0.62 0.13 162)',\n    storage: 'oklch(0.58 0.14 300)',\n};\n\nconst CATEGORY_STROKE: Record\u003cCategory, string> = {\n    client:  'oklch(0.48 0.15 256)',\n    infra:   'oklch(0.52 0.15 55)',\n    service: 'oklch(0.50 0.14 162)',\n    storage: 'oklch(0.46 0.15 300)',\n};\n\nconst CATEGORY_LABEL: Record\u003cCategory, string> = {\n    client:  '客户端',\n    infra:   '基础设施',\n    service: '业务服务',\n    storage: '存储层',\n};\n\ninterface NodeMeta { id: string; label: string; category: Category }\n\nconst NODE_META: NodeMeta[] = [\n    { id: 'browser',  label: 'Browser',         category: 'client' },\n    { id: 'cdn',      label: 'CDN',              category: 'infra' },\n    { id: 'gateway',  label: 'API Gateway',      category: 'infra' },\n    { id: 'auth',     label: 'Auth Service',     category: 'service' },\n    { id: 'user',     label: 'User Service',     category: 'service' },\n    { id: 'order',    label: 'Order Service',    category: 'service' },\n    { id: 'product',  label: 'Product Service',  category: 'service' },\n    { id: 'db',       label: 'Database',         category: 'storage' },\n    { id: 'cache',    label: 'Cache',            category: 'storage' },\n    { id: 'mq',       label: 'Message Queue',    category: 'infra' },\n    { id: 'notify',   label: 'Notify Service',   category: 'service' },\n];\n\nconst ELK_NODES: ElkLayoutNode[] = NODE_META.map(n => ({ id: n.id, width: NODE_W, height: NODE_H }));\n\nconst ELK_EDGES: ElkLayoutEdge[] = [\n    { id: 'e1',  source: 'browser',  target: 'cdn' },\n    { id: 'e2',  source: 'browser',  target: 'gateway' },\n    { id: 'e3',  source: 'cdn',      target: 'gateway' },\n    { id: 'e4',  source: 'gateway',  target: 'auth' },\n    { id: 'e5',  source: 'gateway',  target: 'user' },\n    { id: 'e6',  source: 'gateway',  target: 'order' },\n    { id: 'e7',  source: 'gateway',  target: 'product' },\n    { id: 'e8',  source: 'user',     target: 'db' },\n    { id: 'e9',  source: 'order',    target: 'db' },\n    { id: 'e10', source: 'product',  target: 'db' },\n    { id: 'e11', source: 'user',     target: 'cache' },\n    { id: 'e12', source: 'order',    target: 'mq' },\n    { id: 'e13', source: 'mq',       target: 'notify' },\n    { id: 'e14', source: 'auth',     target: 'cache' },\n];\n\n// ─── 布局完成后自动 fitView ───────────────────────────────────────────────────\n\nfunction AutoFitOnLayout({ loading, controls }: { loading: boolean; controls: FlowDiagramControls }) {\n    // 可变实例状态 ref（例外白名单：跨渲染持有布尔标志，不应触发渲染）\n    const wasLoadingRef = useRef(true);\n    useEffect(() => {\n        const wasLoading = wasLoadingRef.current;\n        wasLoadingRef.current = loading;\n        if (wasLoading && !loading) {\n            const h = requestAnimationFrame(() => controls.fitView(50));\n            return () => cancelAnimationFrame(h);\n        }\n    }, [loading]);\n    return null;\n}\n\n// ─── Demo 主体 ────────────────────────────────────────────────────────────────\n\nexport default function ElkLayoutDemo() {\n    const [algo, setAlgo] = useState('layered');\n    const [dir,  setDir]  = useState('RIGHT');\n    const [nodePositions, setNodePositions] = useState\u003cRecord\u003cstring, { x: number; y: number }>>({});\n\n    const elkOptions: Record\u003cstring, string> = {\n        'elk.algorithm': algo,\n        'elk.spacing.nodeNode': '48',\n        'elk.layered.spacing.nodeNodeBetweenLayers': '80',\n        ...(algo !== 'stress' ? { 'elk.direction': dir } : {}),\n    };\n\n    // 切换算法 / 方向时清空拖拽覆盖，让新布局结果完整生效\n    const handleAlgoChange = (newAlgo: string) => {\n        setAlgo(newAlgo);\n        setNodePositions({});\n    };\n    const handleDirChange = (newDir: string) => {\n        setDir(newDir);\n        setNodePositions({});\n    };\n\n    return (\n        \u003cdiv className={demoStackStyle}>\n            {/* 工具栏 */}\n            \u003cdiv className={demoToolbarStyle}>\n                \u003cSelect label=\"算法\" value={algo} onValueChange={value => { if (value) handleAlgoChange(value); }}\n                    options={[\n                        { value: 'layered', label: 'Layered（层次化）' },\n                        { value: 'mrtree', label: 'Mr. Tree（树形）' },\n                        { value: 'stress', label: 'Stress（力导向）' },\n                    ]} />\n                {algo !== 'stress' && (\n                    \u003cSelect label=\"方向\" value={dir} onValueChange={value => { if (value) handleDirChange(value); }}\n                        options={[{ value: 'RIGHT', label: '→ 从左到右' }, { value: 'DOWN', label: '↓ 从上到下' }]} />\n                )}\n            \u003c/div>\n\n            {/* 画布：FlowDiagram 封装了 Canvas + Viewport + 网格 + ELK + 路由，消费方只需声明数据和渲染内容 */}\n            \u003cdiv className={diagramViewportStyle} role=\"region\" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>\n\n                \u003cFlowDiagram\n                    nodes={ELK_NODES}\n                    edges={ELK_EDGES}\n                    elkOptions={elkOptions}\n                    nodePositions={nodePositions}\n                    routingOptions={{ margin: 12, terminalStub: 26 }}\n                    width={820}\n                    height={520}\n\n                >\n                    {({ nodeRects, routes, crossings, loading, controls }) => (\n                        \u003c>\n                            {/* 布局完成后自动 fitView（必须在 Canvas 上下文内，由此访问 controls） */}\n                            \u003cAutoFitOnLayout loading={loading} controls={controls} />\n\n                            {/* 边（zIndex=1，在节点之下） */}\n                            {ELK_EDGES.map(e => {\n                                const pts = routes[e.id]?.points;\n                                if (!pts || pts.length \u003c 2) return null;\n                                return \u003cFlowEdge key={e.id} points={pts} crossings={crossings[e.id]} />;\n                            })}\n\n                            {/* 节点（zIndex=2，始终在边之上） */}\n                            {NODE_META.map(meta => {\n                                const rect = nodeRects[meta.id];\n                                if (!rect) return null;\n                                return (\n                                    \u003cFlowNode\n                                        key={meta.id}\n                                        x={rect.x} y={rect.y}\n                                        width={NODE_W} height={NODE_H}\n                                        label={meta.label}\n                                        fill={CATEGORY_FILL[meta.category]}\n                                        labelColor={DEFAULT_FLOW_DIAGRAM_PALETTE.nodeLabel}\n                                        stroke={CATEGORY_STROKE[meta.category]}\n                                        radius={10}\n                                        draggable\n                                        onDrag={(dx, dy) => setNodePositions(prev => {\n                                            const base = prev[meta.id] ?? rect;\n                                            return { ...prev, [meta.id]: { x: base.x + dx, y: base.y + dy } };\n                                        })}\n                                    />\n                                );\n                            })}\n                        \u003c/>\n                    )}\n                \u003c/FlowDiagram>\n\n            \u003c/div>\n\n            {/* 图例 */}\n            \u003cdiv className={demoLegendStyle}>\n                {(Object.entries(CATEGORY_LABEL) as [Category, string][]).map(([cat, label]) => (\n                    \u003cspan key={cat} className={demoLegendItemStyle}>\n                        \u003csvg viewBox=\"0 0 12 12\" className={demoSwatchStyle} aria-hidden=\"true\">\u003crect width=\"12\" height=\"12\" fill={CATEGORY_FILL[cat]} />\u003c/svg>\n                        {label}\n                    \u003c/span>\n                ))}\n                \u003cspan className={demoHintStyle}>\n                    拖拽节点移动 · 边自动绕开节点 · 滚轮缩放\n                \u003c/span>\n            \u003c/div>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Felk-layout.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Felk-layout.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "默认语义色板",
        "description": "节点、文字、连线和网格均省略颜色参数，直接使用当前设计体系的默认色板。容器支持窄屏横向查看。",
        "learning": {
            "components": [
                "FlowDiagram",
                "FlowEdge",
                "FlowNode"
            ],
            "props": [
                "nodes",
                "edges",
                "width",
                "height",
                "points",
                "crossings",
                "x",
                "y",
                "label"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport FlowDiagram, { FlowEdge, FlowNode, type ElkLayoutEdge, type ElkLayoutNode } from '@crab-dev/rc-flow-diagram';\n\nexport const meta = {\n    title: '默认语义色板',\n    description: '节点、文字、连线和网格均省略颜色参数，直接使用当前设计体系的默认色板。容器支持窄屏横向查看。',\n};\n\nconst viewportStyle = css`max-width: 100%; overflow: auto;`;\nconst nodes: ElkLayoutNode[] = [{ id: 'start', width: 140, height: 52 }, { id: 'end', width: 140, height: 52 }];\nconst edges: ElkLayoutEdge[] = [{ id: 'connection', source: 'start', target: 'end' }];\n\nexport default function VisualStatesDemo() {\n    return \u003cdiv className={viewportStyle} role=\"region\" aria-label=\"默认语义色板流程图\" tabIndex={0}>\n        \u003cFlowDiagram nodes={nodes} edges={edges} width={460} height={220}>\n            {({ nodeRects, routes, crossings }) => \u003c>\n                {edges.map(edge => {\n                    const points = routes[edge.id]?.points;\n                    return points && points.length > 1 ? \u003cFlowEdge key={edge.id} points={points} crossings={crossings[edge.id]} /> : null;\n                })}\n                {nodes.map(node => {\n                    const rect = nodeRects[node.id];\n                    return rect ? \u003cFlowNode key={node.id} x={rect.x} y={rect.y} width={140} height={52} label={node.id === 'start' ? '开始 Start' : '完成 Done'} /> : null;\n                })}\n            \u003c/>}\n        \u003c/FlowDiagram>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-flow-diagram/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-flow-diagram/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "能力与集成示例"
    }
] as const satisfies readonly ComponentDemoRecord[];
