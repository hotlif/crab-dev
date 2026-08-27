/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/annotations.demo.tsx",
        "title": "数值标签与参考线",
        "description": "showValues 在柱端标注数值（空间不足以容纳的自动省略；堆叠模式标注类目合计）；referenceLines 绘制均值 / 目标虚线，参考值自动纳入值轴刻度域。",
        "sourceCode": "export const meta = {\n    title: \"数值标签与参考线\",\n    description: \"showValues 在柱端标注数值（空间不足以容纳的自动省略；堆叠模式标注类目合计）；referenceLines 绘制均值 / 目标虚线，参考值自动纳入值轴刻度域。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst DATA = [820, 932, 901, 934, 690, 1290];\nconst AVERAGE = Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length);\n\nconst AnnotationsDemo = () => (\n    \u003cBarChart\n        aria-label=\"各月销售额与均值目标\"\n        categories={['一月', '二月', '三月', '四月', '五月', '六月']}\n        series={[{ name: '销售额', data: DATA }]}\n        showValues\n        referenceLines={[\n            { value: AVERAGE, label: `均值 ${AVERAGE.toLocaleString()}` },\n            { value: 1200, label: '目标 1,200', color: 'oklch(0.6226 0.1909 24.91)' },\n        ]}\n    />\n);\n\nexport default AnnotationsDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fannotations.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fannotations.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "单系列柱状图：单系列不出现图例，悬停任意类目列即可读取数值，完整数据同时以隐藏数据表提供给辅助技术。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"单系列柱状图：单系列不出现图例，悬停任意类目列即可读取数值，完整数据同时以隐藏数据表提供给辅助技术。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst CATEGORIES = ['一月', '二月', '三月', '四月', '五月', '六月'];\n\nconst BasicDemo = () => (\n    \u003cBarChart\n        aria-label=\"上半年月度销量\"\n        categories={CATEGORIES}\n        series={[{ name: '销量', data: [3200, 4100, 3650, 5200, 4780, 6100] }]}\n    />\n);\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/horizontal.demo.tsx",
        "title": "横向条形与自适应宽度",
        "description": "orientation=\\\"horizontal\\\" 类目沿纵轴、条横向生长，长类目名更耐读；width=\\\"auto\\\" 经 rc-auto-sizer 跟随父容器宽度，拖动窗口观察布局与动画同步跟随。",
        "sourceCode": "export const meta = {\n    title: \"横向条形与自适应宽度\",\n    description: \"orientation=\\\\\\\"horizontal\\\\\\\" 类目沿纵轴、条横向生长，长类目名更耐读；width=\\\\\\\"auto\\\\\\\" 经 rc-auto-sizer 跟随父容器宽度，拖动窗口观察布局与动画同步跟随。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst HorizontalDemo = () => (\n    \u003cdiv style={{ inlineSize: '100%' }}>\n        \u003cBarChart\n            aria-label=\"各区域年度销售额排名\"\n            categories={['华东大区（含江浙沪）', '华南大区', '华北大区', '西南大区', '东北大区']}\n            series={[{ name: '销售额', data: [1290, 934, 901, 690, 540] }]}\n            orientation=\"horizontal\"\n            width=\"auto\"\n            showValues\n        />\n    \u003c/div>\n);\n\nexport default HorizontalDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fhorizontal.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fhorizontal.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/live-update.demo.tsx",
        "title": "入场与数据更新动画",
        "description": "首次挂载时柱体从零值基线逐类目生长；切换数据集时高度从旧值平滑补间到新值。WebGL 逐帧插值，数百根柱同时过渡仍流畅；系统偏好「减弱动态」时自动降级为直接呈现。",
        "sourceCode": "export const meta = {\n    title: \"入场与数据更新动画\",\n    description: \"首次挂载时柱体从零值基线逐类目生长；切换数据集时高度从旧值平滑补间到新值。WebGL 逐帧插值，数百根柱同时过渡仍流畅；系统偏好「减弱动态」时自动降级为直接呈现。\",\n};\n\nimport { useState } from 'react';\nimport type { CSSProperties } from 'react';\nimport BarChart from '../../src/index.js';\n\nconst DATASETS = [\n    [820, 932, 901, 934, 690],\n    [620, 480, 720, 540, 880],\n    [1020, 1132, 601, 834, 390],\n];\n\nconst CATEGORIES = ['华东', '华南', '华北', '西南', '东北'];\n\nconst buttonStyle: CSSProperties = {\n    padding: '6px 16px',\n    fontSize: 13,\n    borderRadius: 8,\n    border: '1px solid #e2e8f0',\n    background: '#fff',\n    color: '#334155',\n    cursor: 'pointer',\n};\n\nconst LiveUpdateDemo = () => {\n    const [index, setIndex] = useState(0);\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>\n            \u003cBarChart\n                aria-label=\"各区域季度销售额\"\n                categories={CATEGORIES}\n                series={[{ name: '销售额', data: DATASETS[index] }]}\n            />\n            \u003cbutton\n                type=\"button\"\n                style={buttonStyle}\n                onClick={() => setIndex(prev => (prev + 1) % DATASETS.length)}\n            >\n                切换数据集（观察柱体补间）\n            \u003c/button>\n        \u003c/div>\n    );\n};\n\nexport default LiveUpdateDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Flive-update.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Flive-update.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/multi-series.demo.tsx",
        "title": "多系列分组",
        "description": "多系列在类目内并列分组，颜色按分类色板顺序分配并跟随系列；提供 onBarClick 后柱子呈现 pointer 光标。",
        "sourceCode": "export const meta = {\n    title: \"多系列分组\",\n    description: \"多系列在类目内并列分组，颜色按分类色板顺序分配并跟随系列；提供 onBarClick 后柱子呈现 pointer 光标。\",\n};\n\nimport { useState } from 'react';\nimport BarChart from '../../src/index.js';\nimport type { BarClickInfo } from '../../src/index.js';\n\nconst CATEGORIES = ['华东', '华南', '华北', '西南'];\n\nconst MultiSeriesDemo = () => {\n    const [picked, setPicked] = useState\u003cBarClickInfo | null>(null);\n\n    return (\n        \u003cdiv style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>\n            \u003cBarChart\n                aria-label=\"各区域分渠道销售额\"\n                categories={CATEGORIES}\n                series={[\n                    { name: '线上', data: [820, 932, 901, 934] },\n                    { name: '线下', data: [620, 710, 660, 540] },\n                    { name: '经销商', data: [450, 380, 520, 410] },\n                ]}\n                onBarClick={setPicked}\n            />\n            \u003cdiv style={{ fontSize: 12, color: '#64748b' }}>\n                {picked\n                    ? `已选中：${picked.category} · ${picked.seriesName} = ${picked.value}`\n                    : '点击任意柱子查看回调数据'}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default MultiSeriesDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fmulti-series.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fmulti-series.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/stacked.demo.tsx",
        "title": "堆叠模式",
        "description": "stacked 开启堆叠：正值向上、负值向下分别累计，段与段之间保持 2px 表面留白，仅最外侧段带数据端圆角。",
        "sourceCode": "export const meta = {\n    title: \"堆叠模式\",\n    description: \"stacked 开启堆叠：正值向上、负值向下分别累计，段与段之间保持 2px 表面留白，仅最外侧段带数据端圆角。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];\n\nconst StackedDemo = () => (\n    \u003cBarChart\n        aria-label=\"季度收支结构\"\n        categories={CATEGORIES}\n        stacked\n        series={[\n            { name: '产品收入', data: [1200, 1420, 1380, 1690] },\n            { name: '服务收入', data: [680, 720, 810, 900] },\n            { name: '成本支出', data: [-750, -820, -790, -880] },\n        ]}\n        formatValue={v => v.toLocaleString()}\n    />\n);\n\nexport default StackedDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fstacked.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fstacked.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "BarChart",
    "symbol": "BarChartProps",
    "props": [
        {
            "name": "animate",
            "required": false,
            "description": "柱几何过渡动画：入场时从零值基线生长，数据变化时平滑补间到新高度。 系统偏好「减弱动态」(prefers-reduced-motion: reduce) 时自动降级为直接呈现。",
            "typeText": "boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "aria-label",
            "required": false,
            "description": "图表的无障碍名称，作为隐藏数据表的 caption",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "categories",
            "required": true,
            "description": "类目标签（x 轴）",
            "typeText": "string[]",
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
            "name": "formatValue",
            "required": false,
            "description": "数值格式化，作用于 y 轴刻度、悬浮提示与数据表",
            "typeText": "(value: number) => string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "height",
            "required": false,
            "description": "画布高度（px，含坐标轴；图例与空态另计）",
            "typeText": "number",
            "defaultValue": "320",
            "deprecated": false
        },
        {
            "name": "onBarClick",
            "required": false,
            "description": "点击柱子时触发；提供后柱子呈现 pointer 光标",
            "typeText": "(info: BarClickInfo) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "orientation",
            "required": false,
            "description": "轴向：`vertical` 类目沿横轴、柱纵向生长；`horizontal` 类目沿纵轴、 条横向生长（类目名较长时更耐读）。",
            "typeText": "'vertical' | 'horizontal'",
            "defaultValue": "'vertical'",
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "",
            "typeText": "Ref\u003cHTMLDivElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "referenceLines",
            "required": false,
            "description": "横向参考线（均值 / 目标线等），以虚线绘制并纳入值轴刻度域",
            "typeText": "BarChartReferenceLine[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "series",
            "required": true,
            "description": "数据系列，最多 8 个；超出部分不渲染并在开发期告警",
            "typeText": "BarChartSeries[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "showValues",
            "required": false,
            "description": "在柱的数据端显示数值标签（堆叠模式显示各类目的正 / 负向合计）。 空间不足以容纳而会互相叠压的标签自动省略。",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "stacked",
            "required": false,
            "description": "堆叠模式；关闭时多系列在类目内并列分组。 堆叠时正值向上、负值向下分别累计。",
            "typeText": "boolean",
            "defaultValue": "false",
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
            "description": "画布宽度（px，含坐标轴）；传 `'auto'` 时跟随父容器宽度 （内部复用 `@crab-dev/rc-auto-sizer`，父容器需有确定宽度）。",
            "typeText": "number | 'auto'",
            "defaultValue": "600",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
