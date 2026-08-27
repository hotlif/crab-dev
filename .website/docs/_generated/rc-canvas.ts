/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/animation.demo.tsx",
        "title": "属性驱动动画",
        "description": "用 React state 逐帧更新图元 props，Canvas 内部 rAF 渲染循环自动重绘，演示流畅动画。",
        "sourceCode": "export const meta = {\n    title: \"属性驱动动画\",\n    description: \"用 React state 逐帧更新图元 props，Canvas 内部 rAF 渲染循环自动重绘，演示流畅动画。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useEffect, useState } from \"react\";\nimport { Canvas, Group, Rect, Circle } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #0b0b12;\n`;\n\nconst CX = 210;\nconst CY = 110;\nconst COUNT = 6;\n\nconst AnimationDemo = () => {\n    const [t, setT] = useState(0);\n\n    useEffect(() => {\n        let raf = 0;\n        const start = performance.now();\n        const tick = () => {\n            setT((performance.now() - start) / 1000);\n            raf = requestAnimationFrame(tick);\n        };\n        raf = requestAnimationFrame(tick);\n        return () => cancelAnimationFrame(raf);\n    }, []);\n\n    const planets = Array.from({ length: COUNT }, (_, i) => {\n        const speed = 0.6 + i * 0.25;\n        const radius = 28 + i * 13;\n        const angle = t * speed + (i / COUNT) * Math.PI * 2;\n        return {\n            cx: CX + Math.cos(angle) * radius,\n            cy: CY + Math.sin(angle) * radius,\n            hue: Math.round((i / COUNT) * 360),\n        };\n    });\n\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={220}>\n                {/* 整体随时间缓慢自转 */}\n                \u003cGroup x={CX} y={CY} rotation={t * 0.1}>\n                    \u003cRect x={-6} y={-6} width={12} height={12} radius={3} fill=\"oklch(0.85 0.18 90)\" />\n                \u003c/Group>\n                {planets.map((p, i) => (\n                    \u003cCircle\n                        key={i}\n                        cx={p.cx}\n                        cy={p.cy}\n                        r={6 + i}\n                        fill={`oklch(0.7 0.2 ${p.hue})`}\n                    />\n                ))}\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default AnimationDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fanimation.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fanimation.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础图元",
        "description": "在 Canvas 中声明矩形与圆形，颜色支持 OKLCh / 十六进制，opacity 控制透明度。",
        "sourceCode": "export const meta = {\n    title: \"基础图元\",\n    description: \"在 Canvas 中声明矩形与圆形，颜色支持 OKLCh / 十六进制，opacity 控制透明度。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Rect, Circle } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={220}>\n                \u003cRect x={30} y={40} width={140} height={90} fill=\"oklch(0.62 0.21 28)\" />\n                \u003cRect x={90} y={90} width={140} height={90} fill=\"oklch(0.7 0.16 160)\" opacity={0.75} />\n                \u003cCircle cx={320} cy={90} r={55} fill=\"oklch(0.6 0.2 255)\" />\n                \u003cCircle cx={350} cy={150} r={40} fill=\"oklch(0.8 0.16 90)\" opacity={0.8} />\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/draggable.demo.tsx",
        "title": "Draggable",
        "description": "Draggable 示例",
        "sourceCode": "import React, { useRef, useState } from 'react';\nimport Canvas from '../../src/canvas.js';\nimport Rect from '../../src/shapes/rect.js';\nimport Group from '../../src/shapes/group.js';\nimport Text from '../../src/shapes/text.js';\nimport type { DragMoveEvent } from '../../src/drag-types.js';\nexport const meta = {\n    title: \"Draggable\",\n    description: \"Draggable 示例\",\n};\nfunction DraggableCard({\n    label,\n    initX,\n    initY,\n    fill,\n    getNextZ,\n}: {\n    label: string;\n    initX: number;\n    initY: number;\n    fill: string;\n    getNextZ: () => number;\n}) {\n    const [pos, setPos] = useState({ x: initX, y: initY });\n    const [z, setZ] = useState(0);\n\n    return (\n        \u003cGroup\n            x={pos.x}\n            y={pos.y}\n            zIndex={z}\n            draggable\n            hitArea={{ x: 0, y: 0, width: 160, height: 80 }}\n            cursor=\"grab\"\n            onDragStart={() => setZ(getNextZ())}\n            onDrag={({ localDx, localDy }: DragMoveEvent) =>\n                setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))\n            }\n        >\n            \u003cRect x={0} y={0} width={160} height={80} fill={fill} radius={8} />\n            \u003cText x={16} y={24} fontSize={14} fill=\"#ffffff\">{label}\u003c/Text>\n        \u003c/Group>\n    );\n}\n\nfunction RotatedDraggable({ getNextZ }: { getNextZ: () => number }) {\n    const [pos, setPos] = useState({ x: 300, y: 200 });\n    const [z, setZ] = useState(0);\n\n    return (\n        \u003cGroup x={pos.x} y={pos.y} rotation={Math.PI / 6} zIndex={z}>\n            \u003cRect\n                x={0}\n                y={0}\n                width={120}\n                height={60}\n                fill=\"oklch(0.6 0.2 160)\"\n                radius={6}\n                draggable\n                cursor=\"move\"\n                onDragStart={() => setZ(getNextZ())}\n                onDrag={({ canvasFrameDx, canvasFrameDy }: DragMoveEvent) =>\n                    setPos(p => ({ x: p.x + canvasFrameDx, y: p.y + canvasFrameDy }))\n                }\n            />\n            \u003cText x={10} y={18} fontSize={12} fill=\"#ffffff\">旋转 30°\u003c/Text>\n        \u003c/Group>\n    );\n}\n\nexport default function DraggableDemo() {\n    const maxZRef = useRef(0);\n    const getNextZ = () => ++maxZRef.current;\n\n    return (\n        \u003cCanvas width={600} height={400} style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>\n            \u003cDraggableCard label=\"卡片 A\" initX={40} initY={60} fill=\"oklch(0.55 0.2 260)\" getNextZ={getNextZ} />\n            \u003cDraggableCard label=\"卡片 B\" initX={140} initY={120} fill=\"oklch(0.55 0.2 30)\" getNextZ={getNextZ} />\n            \u003cRotatedDraggable getNextZ={getNextZ} />\n        \u003c/Canvas>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fdraggable.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fdraggable.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "分组变换与嵌套",
        "description": "Group 维护 TRS 矩阵栈，子孙坐标随父级平移 / 旋转 / 缩放叠加，支持任意层级嵌套。",
        "sourceCode": "export const meta = {\n    title: \"分组变换与嵌套\",\n    description: \"Group 维护 TRS 矩阵栈，子孙坐标随父级平移 / 旋转 / 缩放叠加，支持任意层级嵌套。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Group, Rect, Circle } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\n// 一个可复用的\"图标\"：内部用本地坐标系绘制，被不同 Group 变换复用\nconst Badge = () => (\n    \u003c>\n        \u003cRect x={-30} y={-30} width={60} height={60} radius={12} fill=\"oklch(0.6 0.2 255)\" />\n        \u003cCircle cx={0} cy={0} r={16} fill=\"oklch(0.95 0.02 255)\" />\n    \u003c/>\n);\n\nconst GroupDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={220}>\n                {/* 原始 */}\n                \u003cGroup x={70} y={110}>\n                    \u003cBadge />\n                \u003c/Group>\n                {/* 旋转 30° */}\n                \u003cGroup x={170} y={110} rotation={Math.PI / 6}>\n                    \u003cBadge />\n                \u003c/Group>\n                {/* 放大 1.4 倍 */}\n                \u003cGroup x={270} y={110} scaleX={1.4} scaleY={1.4}>\n                    \u003cBadge />\n                \u003c/Group>\n                {/* 嵌套：外层旋转 + 内层平移 */}\n                \u003cGroup x={360} y={110} rotation={-Math.PI / 8}>\n                    \u003cGroup scaleX={0.9} scaleY={0.9}>\n                        \u003cBadge />\n                    \u003c/Group>\n                \u003c/Group>\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/hover.demo.tsx",
        "title": "hover 回调",
        "description": "通过 onMouseEnter / onMouseLeave 响应图元悬停事件，驱动颜色高亮与状态提示。三种图元均支持该回调。",
        "sourceCode": "export const meta = {\n    title: \"hover 回调\",\n    description: \"通过 onMouseEnter / onMouseLeave 响应图元悬停事件，驱动颜色高亮与状态提示。三种图元均支持该回调。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport { Canvas, Rect, Circle, Line, Text } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nexport default function HoverDemo() {\n    const [hovered, setHovered] = useState\u003cstring | null>(null);\n\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={240}>\n                \u003cText\n                    x={20} y={14}\n                    fontSize={12}\n                    fill={hovered ? \"oklch(0.4 0.15 250)\" : \"oklch(0.65 0 0)\"}\n                >\n                    {hovered ? `当前悬停：${hovered}` : \"将鼠标移到图形上\"}\n                \u003c/Text>\n\n                \u003cRect\n                    x={40} y={56}\n                    width={120} height={72}\n                    radius={8}\n                    fill={hovered === 'Rect' ? \"oklch(0.55 0.22 28)\" : \"oklch(0.72 0.15 28)\"}\n                    cursor=\"pointer\"\n                    onMouseEnter={() => setHovered('Rect')}\n                    onMouseLeave={() => setHovered(null)}\n                />\n\n                \u003cCircle\n                    cx={280} cy={96}\n                    r={54}\n                    fill={hovered === 'Circle' ? \"oklch(0.5 0.22 255)\" : \"oklch(0.66 0.18 255)\"}\n                    cursor=\"pointer\"\n                    onMouseEnter={() => setHovered('Circle')}\n                    onMouseLeave={() => setHovered(null)}\n                />\n\n                \u003cLine\n                    x1={40} y1={190}\n                    x2={220} y2={190}\n                    lineWidth={hovered === 'Line' ? 8 : 4}\n                    color={hovered === 'Line' ? \"oklch(0.42 0.22 160)\" : \"oklch(0.6 0.18 160)\"}\n                    cursor=\"pointer\"\n                    onMouseEnter={() => setHovered('Line')}\n                    onMouseLeave={() => setHovered(null)}\n                />\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fhover.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fhover.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/infinite-canvas.demo.tsx",
        "title": "Infinite Canvas",
        "description": "Infinite Canvas 示例",
        "sourceCode": "import { useRef, useState } from 'react';\nimport Canvas from '../../src/canvas.js';\nimport Rect from '../../src/shapes/rect.js';\nimport Circle from '../../src/shapes/circle.js';\nimport Group from '../../src/shapes/group.js';\nimport Text from '../../src/shapes/text.js';\nimport Viewport from '../../src/viewport.js';\nimport InfiniteGrid from '../../src/shapes/infinite-grid.js';\nimport type { DragMoveEvent } from '../../src/drag-types.js';\nexport const meta = {\n    title: \"Infinite Canvas\",\n    description: \"Infinite Canvas 示例\",\n};\ninterface CardData {\n    id: number;\n    x: number;\n    y: number;\n    label: string;\n    fill: string;\n}\n\nconst INITIAL_CARDS: CardData[] = [\n    { id: 1, x: -200, y: -100, label: '卡片 A', fill: 'oklch(0.55 0.2 260)' },\n    { id: 2, x: 50,   y: -150, label: '卡片 B', fill: 'oklch(0.55 0.2 30)' },\n    { id: 3, x: 150,  y: 80,   label: '卡片 C', fill: 'oklch(0.55 0.2 140)' },\n    { id: 4, x: -100, y: 120,  label: '卡片 D', fill: 'oklch(0.55 0.2 320)' },\n    { id: 5, x: 300,  y: -50,  label: '卡片 E', fill: 'oklch(0.55 0.2 60)' },\n];\n\nfunction DraggableCard({\n    data,\n    getNextZ,\n}: {\n    data: CardData;\n    getNextZ: () => number;\n}) {\n    const [pos, setPos] = useState({ x: data.x, y: data.y });\n    const [z, setZ] = useState(0);\n\n    return (\n        \u003cGroup x={pos.x} y={pos.y} zIndex={z}>\n            \u003cRect\n                x={0} y={0} width={160} height={80}\n                fill={data.fill}\n                radius={10}\n                draggable\n                cursor=\"grab\"\n                onDragStart={() => setZ(getNextZ())}\n                onDrag={({ localDx, localDy }: DragMoveEvent) =>\n                    setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))\n                }\n            />\n            \u003cText x={16} y={28} fontSize={14} fill=\"#ffffff\">{data.label}\u003c/Text>\n            \u003cText x={16} y={52} fontSize={11} fill=\"rgba(255,255,255,0.7)\">\n                {`(${Math.round(pos.x)}, ${Math.round(pos.y)})`}\n            \u003c/Text>\n        \u003c/Group>\n    );\n}\n\nfunction CircleCluster() {\n    return (\n        \u003cGroup x={-400} y={200}>\n            {Array.from({ length: 8 }, (_, i) => {\n                const angle = (i / 8) * Math.PI * 2;\n                const r = 80;\n                return (\n                    \u003cCircle\n                        key={i}\n                        cx={Math.cos(angle) * r}\n                        cy={Math.sin(angle) * r}\n                        r={20}\n                        fill={`oklch(0.65 0.25 ${i * 45})`}\n                        stroke=\"#ffffff\"\n                        strokeWidth={2}\n                    />\n                );\n            })}\n            \u003cCircle cx={0} cy={0} r={28} fill=\"oklch(0.4 0.1 250)\" />\n            \u003cText x={-16} y={6} fontSize={12} fill=\"#ffffff\">中心\u003c/Text>\n        \u003c/Group>\n    );\n}\n\nexport default function InfiniteCanvasDemo() {\n    const maxZRef = useRef(1);\n    const getNextZ = () => ++maxZRef.current;\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>\n            \u003cdiv style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>\n                滚轮缩放 · 拖拽空白区域平移 · 拖拽卡片移动\n            \u003c/div>\n            \u003cCanvas\n                width={800}\n                height={520}\n                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}\n            >\n                \u003cViewport minZoom={0.1} maxZoom={8}>\n                    \u003cInfiniteGrid baseSpacing={50} subdivisions={5} color=\"#cccccc\" originColor=\"oklch(0.55 0.2 260)\" />\n                    {INITIAL_CARDS.map(card => (\n                        \u003cDraggableCard key={card.id} data={card} getNextZ={getNextZ} />\n                    ))}\n                    \u003cCircleCluster />\n                \u003c/Viewport>\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Finfinite-canvas.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Finfinite-canvas.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/line.demo.tsx",
        "title": "任意角度直线",
        "description": "直线在顶点着色器端挤出为带宽度的四边形，支持任意斜率与线宽。",
        "sourceCode": "export const meta = {\n    title: \"任意角度直线\",\n    description: \"直线在顶点着色器端挤出为带宽度的四边形，支持任意斜率与线宽。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Line } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\n// 以画布中心为原点放射一圈直线，直观展示任意角度支持\nconst CX = 210;\nconst CY = 110;\nconst R = 90;\nconst SPOKES = 12;\n\nconst LineDemo = () => {\n    const lines = Array.from({ length: SPOKES }, (_, i) => {\n        const angle = (i / SPOKES) * Math.PI * 2;\n        return {\n            x2: CX + Math.cos(angle) * R,\n            y2: CY + Math.sin(angle) * R,\n            hue: Math.round((i / SPOKES) * 360),\n        };\n    });\n\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={220}>\n                {lines.map((l, i) => (\n                    \u003cLine\n                        key={i}\n                        x1={CX}\n                        y1={CY}\n                        x2={l.x2}\n                        y2={l.y2}\n                        color={`oklch(0.6 0.2 ${l.hue})`}\n                        lineWidth={i % 2 === 0 ? 4 : 2}\n                    />\n                ))}\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default LineDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fline.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fline.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/minimap.demo.tsx",
        "title": "Minimap",
        "description": "Minimap 示例",
        "sourceCode": "import { useRef, useState } from 'react';\nimport Canvas from '../../src/canvas.js';\nimport Rect from '../../src/shapes/rect.js';\nimport Circle from '../../src/shapes/circle.js';\nimport Group from '../../src/shapes/group.js';\nimport Text from '../../src/shapes/text.js';\nimport Viewport from '../../src/viewport.js';\nimport InfiniteGrid from '../../src/shapes/infinite-grid.js';\nimport Minimap from '../../src/shapes/minimap.js';\nimport type { DragMoveEvent } from '../../src/drag-types.js';\nexport const meta = {\n    title: \"Minimap\",\n    description: \"Minimap 示例\",\n};\ninterface CardData {\n    id: number;\n    x: number;\n    y: number;\n    label: string;\n    fill: string;\n}\n\nconst INITIAL_CARDS: CardData[] = [\n    { id: 1, x: -300, y: -150, label: '节点 A', fill: 'oklch(0.55 0.2 260)' },\n    { id: 2, x: 50,   y: -200, label: '节点 B', fill: 'oklch(0.55 0.2 30)' },\n    { id: 3, x: 250,  y: 50,   label: '节点 C', fill: 'oklch(0.55 0.2 140)' },\n    { id: 4, x: -150, y: 180,  label: '节点 D', fill: 'oklch(0.55 0.2 320)' },\n    { id: 5, x: 400,  y: -100, label: '节点 E', fill: 'oklch(0.55 0.2 60)' },\n    { id: 6, x: -400, y: 100,  label: '节点 F', fill: 'oklch(0.55 0.2 200)' },\n    { id: 7, x: 100,  y: 250,  label: '节点 G', fill: 'oklch(0.55 0.2 350)' },\n];\n\nfunction DraggableCard({\n    data,\n    getNextZ,\n}: {\n    data: CardData;\n    getNextZ: () => number;\n}) {\n    const [pos, setPos] = useState({ x: data.x, y: data.y });\n    const [z, setZ] = useState(0);\n\n    return (\n        \u003cGroup x={pos.x} y={pos.y} zIndex={z}>\n            \u003cRect\n                x={0} y={0} width={160} height={72}\n                fill={data.fill}\n                radius={10}\n                draggable\n                cursor=\"grab\"\n                onDragStart={() => setZ(getNextZ())}\n                onDrag={({ localDx, localDy }: DragMoveEvent) =>\n                    setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))\n                }\n            />\n            \u003cText x={16} y={26} fontSize={14} fill=\"#ffffff\">{data.label}\u003c/Text>\n            \u003cText x={16} y={50} fontSize={11} fill=\"rgba(255,255,255,0.65)\">\n                {`(${Math.round(pos.x)}, ${Math.round(pos.y)})`}\n            \u003c/Text>\n        \u003c/Group>\n    );\n}\n\nconst CLUSTERS: { cx: number; cy: number; color: string }[] = [\n    { cx: -600, cy: -300, color: 'oklch(0.65 0.2 280)' },\n    { cx: 600,  cy: 300,  color: 'oklch(0.65 0.2 120)' },\n];\n\nfunction CircleCluster({ cx, cy, color }: { cx: number; cy: number; color: string }) {\n    return (\n        \u003cGroup x={cx} y={cy}>\n            {Array.from({ length: 6 }, (_, i) => {\n                const angle = (i / 6) * Math.PI * 2;\n                return (\n                    \u003cCircle\n                        key={i}\n                        cx={Math.cos(angle) * 60}\n                        cy={Math.sin(angle) * 60}\n                        r={18}\n                        fill={color}\n                        stroke=\"#ffffff\"\n                        strokeWidth={2}\n                    />\n                );\n            })}\n            \u003cCircle cx={0} cy={0} r={24} fill=\"oklch(0.35 0.08 250)\" />\n        \u003c/Group>\n    );\n}\n\nexport default function MinimapDemo() {\n    const maxZRef = useRef(1);\n    const getNextZ = () => ++maxZRef.current;\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>\n            \u003cdiv style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>\n                滚轮缩放 · 拖拽空白区域平移 · 拖拽节点移动 · 右下角 Minimap 显示全局视图\n            \u003c/div>\n            \u003cCanvas\n                width={800}\n                height={520}\n                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}\n            >\n                \u003cViewport minZoom={0.08} maxZoom={8}>\n                    \u003cInfiniteGrid baseSpacing={50} subdivisions={5} color=\"#d8d8d8\" />\n                    {INITIAL_CARDS.map(card => (\n                        \u003cDraggableCard key={card.id} data={card} getNextZ={getNextZ} />\n                    ))}\n                    {CLUSTERS.map(cl => (\n                        \u003cCircleCluster key={`${cl.cx},${cl.cy}`} {...cl} />\n                    ))}\n                \u003c/Viewport>\n                \u003cMinimap position=\"bottom-right\" padding={12} width={180} height={120} />\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fminimap.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fminimap.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/opacity.demo.tsx",
        "title": "整体透明度（opacity）",
        "description": "opacity 同时作用于 fill 和 stroke，从 1.0 到 0.1 均匀过渡，Line 的 color 同样受影响。",
        "sourceCode": "export const meta = {\n    title: \"整体透明度（opacity）\",\n    description: \"opacity 同时作用于 fill 和 stroke，从 1.0 到 0.1 均匀过渡，Line 的 color 同样受影响。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Rect, Circle, Line } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nconst STEPS = 5;\nconst opacities = Array.from({ length: STEPS }, (_, i) => 1 - i * (0.9 / (STEPS - 1)));\n\nexport default function OpacityDemo() {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={240}>\n                {/* Rect：fill + stroke 同时透明 */}\n                {opacities.map((op, i) => (\n                    \u003cRect\n                        key={i}\n                        x={20 + i * 76} y={20}\n                        width={64} height={64}\n                        radius={8}\n                        fill=\"oklch(0.62 0.21 28)\"\n                        stroke=\"oklch(0.35 0.2 28)\"\n                        strokeWidth={3}\n                        opacity={op}\n                    />\n                ))}\n\n                {/* Circle：同上 */}\n                {opacities.map((op, i) => (\n                    \u003cCircle\n                        key={i}\n                        cx={52 + i * 76} cy={148}\n                        r={28}\n                        fill=\"oklch(0.6 0.2 255)\"\n                        stroke=\"oklch(0.35 0.2 255)\"\n                        strokeWidth={3}\n                        opacity={op}\n                    />\n                ))}\n\n                {/* Line */}\n                {opacities.map((op, i) => (\n                    \u003cLine\n                        key={i}\n                        x1={20 + i * 76} y1={210}\n                        x2={72 + i * 76} y2={210}\n                        color=\"oklch(0.45 0.2 160)\"\n                        lineWidth={4}\n                        opacity={op}\n                    />\n                ))}\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Fopacity.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Fopacity.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/rounded.demo.tsx",
        "title": "圆角矩形（SDF）",
        "description": "radius > 0 时自动切换到 SDF 着色器，边缘与圆角均为亚像素级抗锯齿。",
        "sourceCode": "export const meta = {\n    title: \"圆角矩形（SDF）\",\n    description: \"radius > 0 时自动切换到 SDF 着色器，边缘与圆角均为亚像素级抗锯齿。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Rect } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nconst RoundedDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={180}>\n                \u003cRect x={30} y={50} width={100} height={80} radius={4} fill=\"oklch(0.62 0.21 28)\" />\n                \u003cRect x={160} y={50} width={100} height={80} radius={16} fill=\"oklch(0.6 0.2 255)\" />\n                \u003cRect x={290} y={50} width={100} height={80} radius={40} fill=\"oklch(0.7 0.16 160)\" />\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default RoundedDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Frounded.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Frounded.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/text-advanced.demo.tsx",
        "title": "文字对齐与多行",
        "description": "textAlign（left / center / right）、textBaseline（top / middle / bottom）以及 \\\\n 换行和 maxWidth 自动词换行的综合演示。",
        "sourceCode": "export const meta = {\n    title: \"文字对齐与多行\",\n    description: \"textAlign（left / center / right）、textBaseline（top / middle / bottom）以及 \\\\\\\\n 换行和 maxWidth 自动词换行的综合演示。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Line, Text } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nconst RED   = \"oklch(0.38 0.18 28)\";\nconst GREEN = \"oklch(0.38 0.18 160)\";\nconst BLUE  = \"oklch(0.38 0.18 255)\";\nconst GUIDE = \"oklch(0.80 0.05 250)\";\nconst LABEL = \"oklch(0.55 0 0)\";\n\nexport default function TextAdvancedDemo() {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={480} height={270}>\n\n                {/* ── textAlign ─────────────────────────────────── */}\n                \u003cText x={240} y={10} fontSize={12} fill={LABEL} textAlign=\"center\">textAlign\u003c/Text>\n\n                \u003cLine x1={100} y1={25} x2={100} y2={70} color={GUIDE} lineWidth={1} />\n                \u003cLine x1={240} y1={25} x2={240} y2={70} color={GUIDE} lineWidth={1} />\n                \u003cLine x1={380} y1={25} x2={380} y2={70} color={GUIDE} lineWidth={1} />\n\n                \u003cText x={100} y={48} fontSize={14} fill={RED}   textAlign=\"left\"   textBaseline=\"middle\">left\u003c/Text>\n                \u003cText x={240} y={48} fontSize={14} fill={GREEN} textAlign=\"center\" textBaseline=\"middle\">center\u003c/Text>\n                \u003cText x={380} y={48} fontSize={14} fill={BLUE}  textAlign=\"right\"  textBaseline=\"middle\">right\u003c/Text>\n\n                {/* ── textBaseline（三列，各持一条短参考线）──────── */}\n                \u003cText x={240} y={82} fontSize={12} fill={LABEL} textAlign=\"center\">textBaseline\u003c/Text>\n\n                {/* 子标签 */}\n                \u003cText x={105} y={96} fontSize={12} fill={LABEL} textAlign=\"center\">top\u003c/Text>\n                \u003cText x={240} y={96} fontSize={12} fill={LABEL} textAlign=\"center\">middle\u003c/Text>\n                \u003cText x={375} y={96} fontSize={12} fill={LABEL} textAlign=\"center\">bottom\u003c/Text>\n\n                {/* 三列各自短参考线，y 统一 138：\n                    top 列文字顶部在 138 → 文字在线下方；\n                    middle 文字中心在 138 → 文字跨线；\n                    bottom 文字底部在 138 → 文字在线上方，与子标签留足间距 */}\n                \u003cLine x1={40}  y1={138} x2={170} y2={138} color={GUIDE} lineWidth={1} />\n                \u003cLine x1={185} y1={138} x2={295} y2={138} color={GUIDE} lineWidth={1} />\n                \u003cLine x1={310} y1={138} x2={440} y2={138} color={GUIDE} lineWidth={1} />\n\n                {/* 三段文字 y=138，baseline 不同 → 相对参考线的位置不同 */}\n                \u003cText x={105} y={138} fontSize={14} fill={RED}   textAlign=\"center\" textBaseline=\"top\">AaBb\u003c/Text>\n                \u003cText x={240} y={138} fontSize={14} fill={GREEN} textAlign=\"center\" textBaseline=\"middle\">AaBb\u003c/Text>\n                \u003cText x={375} y={138} fontSize={14} fill={BLUE}  textAlign=\"center\" textBaseline=\"bottom\">AaBb\u003c/Text>\n\n                {/* ── 多行 ──────────────────────────────────────── */}\n                \u003cText x={20}  y={160} fontSize={12} fill={LABEL}>{'\\\\n 换行'}\u003c/Text>\n                \u003cText x={20}  y={178} fontSize={13} fill={BLUE}  lineHeight={20}>{\"第一行\\n第二行\\n第三行\"}\u003c/Text>\n\n                \u003cText x={250} y={160} fontSize={12} fill={LABEL}>maxWidth 自动换行\u003c/Text>\n                \u003cText x={250} y={178} fontSize={13} fill={GREEN} lineHeight={20} maxWidth={130}>\n                    {\"自动按宽度换行的长文本 with mixed English\"}\n                \u003c/Text>\n\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Ftext-advanced.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Ftext-advanced.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/text.demo.tsx",
        "title": "文字渲染",
        "description": "文字经 OffscreenCanvas 生成字形位图并上传为 R8 纹理，在 GPU 端以 alpha mask 着色。",
        "sourceCode": "export const meta = {\n    title: \"文字渲染\",\n    description: \"文字经 OffscreenCanvas 生成字形位图并上传为 R8 纹理，在 GPU 端以 alpha mask 着色。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Canvas, Text, Rect } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: block;\n    width: fit-content;\n    margin: 0 auto;\n    border: 1px solid var(--border-subtle, #e5e5e5);\n    border-radius: 8px;\n    overflow: hidden;\n    background: #fafafa;\n`;\n\nconst TextDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cCanvas width={420} height={200}>\n                \u003cText x={24} y={50} fontSize={28} fill=\"oklch(0.2 0 0)\">Hello WebGL\u003c/Text>\n                \u003cText x={24} y={95} fontSize={18} fill=\"oklch(0.6 0.2 255)\">纯 GPU 文字渲染\u003c/Text>\n                \u003cRect x={24} y={120} width={200} height={40} radius={8} fill=\"oklch(0.62 0.21 28)\" />\n                \u003cText x={40} y={148} fontSize={18} fill=\"oklch(0.98 0 0)\">叠加在图形之上\u003c/Text>\n            \u003c/Canvas>\n        \u003c/div>\n    );\n};\n\nexport default TextDemo;\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Ftext.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Ftext.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/transformer.demo.tsx",
        "title": "Transformer",
        "description": "Transformer 示例",
        "sourceCode": "import { useState } from 'react';\nimport Canvas from '../../src/canvas.js';\nimport Rect from '../../src/shapes/rect.js';\nimport Group from '../../src/shapes/group.js';\nimport Text from '../../src/shapes/text.js';\nimport Viewport from '../../src/viewport.js';\nimport InfiniteGrid from '../../src/shapes/infinite-grid.js';\nimport Transformer from '../../src/shapes/transformer.js';\nimport type { TransformState } from '../../src/transform-types.js';\nexport const meta = {\n    title: \"Transformer\",\n    description: \"Transformer 示例\",\n};\ninterface ShapeData {\n    id: number;\n    label: string;\n    fill: string;\n    state: TransformState;\n}\n\nconst INITIAL_SHAPES: ShapeData[] = [\n    {\n        id: 1,\n        label: '矩形 A',\n        fill: 'oklch(0.55 0.2 260)',\n        state: { x: -220, y: -80, width: 180, height: 100, rotation: 0 },\n    },\n    {\n        id: 2,\n        label: '矩形 B',\n        fill: 'oklch(0.55 0.2 30)',\n        state: { x: 60, y: -120, width: 140, height: 120, rotation: 0.3 },\n    },\n    {\n        id: 3,\n        label: '矩形 C',\n        fill: 'oklch(0.55 0.2 140)',\n        state: { x: -60, y: 80, width: 200, height: 80, rotation: -0.2 },\n    },\n];\n\nexport default function TransformerDemo() {\n    const [shapes, setShapes] = useState\u003cShapeData[]>(INITIAL_SHAPES);\n    const [selectedId, setSelectedId] = useState\u003cnumber | null>(null);\n\n    const updateShape = (id: number, next: TransformState) => {\n        setShapes(prev => prev.map(s => s.id === id ? { ...s, state: next } : s));\n    };\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>\n            \u003cdiv style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>\n                点击形状选中 · 拖拽边框移动 · 拖拽角/边 handle 缩放 · 拖拽顶部圆圈旋转 · 点击空白取消选中\n            \u003c/div>\n            \u003cCanvas\n                width={800}\n                height={520}\n                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}\n                onEmptyClick={() => setSelectedId(null)}\n            >\n                \u003cViewport minZoom={0.1} maxZoom={8}>\n                    \u003cInfiniteGrid baseSpacing={50} subdivisions={5} color=\"#e8e8e8\" originColor=\"oklch(0.55 0.2 260)\" />\n\n                    {shapes.map(shape => {\n                        const { state } = shape;\n                        // Group 以 x/y 为平移原点，rotation 绕 Group 原点旋转\n                        // Transformer 以中心为 Group 锚点，children 需相对于中心偏移\n                        return (\n                            \u003cGroup key={shape.id} x={state.x + state.width / 2} y={state.y + state.height / 2} rotation={state.rotation}>\n                                {/* 主体形状，偏移到以中心为原点的局部坐标系 */}\n                                \u003cRect\n                                    x={-state.width / 2}\n                                    y={-state.height / 2}\n                                    width={state.width}\n                                    height={state.height}\n                                    fill={shape.fill}\n                                    radius={8}\n                                    onClick={() => setSelectedId(shape.id)}\n                                    cursor=\"pointer\"\n                                />\n                                \u003cText\n                                    x={-state.width / 2 + 14}\n                                    y={-state.height / 2 + 22}\n                                    fontSize={13}\n                                    fill=\"#ffffff\"\n                                >\n                                    {shape.label}\n                                \u003c/Text>\n                            \u003c/Group>\n                        );\n                    })}\n\n                    {/* Transformer 覆盖在选中形状上 */}\n                    {shapes.map(shape => selectedId === shape.id && (\n                        \u003cTransformer\n                            key={shape.id}\n                            {...shape.state}\n                            zIndex={100}\n                            onChange={next => updateShape(shape.id, next)}\n                        />\n                    ))}\n                \u003c/Viewport>\n            \u003c/Canvas>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-canvas/workbench/?__wake_demo=docs%2Fdemos%2Ftransformer.demo.tsx",
        "workbenchPath": "/components/rc-canvas/workbench/#/components/docs%2Fdemos%2Ftransformer.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Canvas",
    "symbol": "CanvasProps",
    "props": [
        {
            "name": "children",
            "required": false,
            "description": "",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "className",
            "required": false,
            "description": "",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "dpr",
            "required": false,
            "description": "设备像素比，默认 window.devicePixelRatio（≥1）",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "fillParent",
            "required": false,
            "description": "自动填充父容器尺寸（ResizeObserver 驱动）。 开启时 width/height 被忽略；父容器必须有明确的 CSS 尺寸。",
            "typeText": "boolean",
            "defaultValue": "false",
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
            "name": "onEmptyClick",
            "required": false,
            "description": "点击空白区域（无命中形状）时触发，常用于取消选中",
            "typeText": "() => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onKeyDown",
            "required": false,
            "description": "键盘按下时触发（容器 div 默认 tabIndex=0）",
            "typeText": "(e: KeyboardEvent) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onKeyUp",
            "required": false,
            "description": "键盘释放时触发",
            "typeText": "(e: KeyboardEvent) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "",
            "typeText": "Ref\u003cHTMLCanvasElement>",
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
            "name": "tabIndex",
            "required": false,
            "description": "容器 div 的 tabIndex。消费方在 Canvas 外自建键盘通道 （如 aria-hidden 包裹绘制层）时传 -1 将其移出 Tab 流。",
            "typeText": "number",
            "defaultValue": "0",
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
