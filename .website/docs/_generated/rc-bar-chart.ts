/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/annotations.demo.tsx",
        "title": "数值标签与参考线",
        "description": "showValues 在柱端标注数值（空间不足以容纳的自动省略；堆叠模式标注类目合计）；referenceLines 绘制均值 / 目标虚线，参考值自动纳入值轴刻度域。",
        "sourceCode": "export const meta = {\n    title: \"数值标签与参考线\",\n    description: \"showValues 在柱端标注数值（空间不足以容纳的自动省略；堆叠模式标注类目合计）；referenceLines 绘制均值 / 目标虚线，参考值自动纳入值轴刻度域。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst DATA = [820, 932, 901, 934, 690, 1290];\nconst AVERAGE = Math.round(DATA.reduce((a, b) => a + b, 0) / DATA.length);\n\nconst AnnotationsDemo = () => (\n    \u003cBarChart\n        width=\"auto\"\n        aria-label=\"各月销售额与均值目标\"\n        categories={['一月', '二月', '三月', '四月', '五月', '六月']}\n        series={[{ name: '销售额', data: DATA }]}\n        showValues\n        referenceLines={[\n            { value: AVERAGE, label: `均值 ${AVERAGE.toLocaleString()}` },\n            { value: 1200, label: '目标 1,200', color: 'oklch(0.6226 0.1909 24.91)' },\n        ]}\n    />\n);\n\nexport default AnnotationsDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fannotations.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fannotations.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "单系列柱状图：单系列不出现图例，悬停任意类目列即可读取数值，完整数据同时以隐藏数据表提供给辅助技术。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"单系列柱状图：单系列不出现图例，悬停任意类目列即可读取数值，完整数据同时以隐藏数据表提供给辅助技术。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst CATEGORIES = ['一月', '二月', '三月', '四月', '五月', '六月'];\n\nconst BasicDemo = () => (\n    \u003cBarChart\n        width=\"auto\"\n        aria-label=\"上半年月度销量\"\n        categories={CATEGORIES}\n        series={[{ name: '销量', data: [3200, 4100, 3650, 5200, 4780, 6100] }]}\n    />\n);\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/horizontal.demo.tsx",
        "title": "横向条形与自适应宽度",
        "description": "横向条形让类目沿纵轴排列；设置 width 为 auto，通过 rc-auto-sizer 跟随父容器宽度。调整窗口宽度可查看布局变化。",
        "sourceCode": "export const meta = {\n    title: \"横向条形与自适应宽度\",\n    description: \"横向条形让类目沿纵轴排列；设置 width 为 auto，通过 rc-auto-sizer 跟随父容器宽度。调整窗口宽度可查看布局变化。\",\n};\n\nimport BarChart from '../../src/index.js';\nimport { css } from '@crab-dev/css';\n\nconst HorizontalDemo = () => (\n    \u003cdiv className={css`inline-size: 100%; min-width: 0;`}>\n        \u003cBarChart\n            aria-label=\"各区域年度销售额排名\"\n            categories={['华东大区（含江浙沪）', '华南大区', '华北大区', '西南大区', '东北大区']}\n            series={[{ name: '销售额', data: [1290, 934, 901, 690, 540] }]}\n            orientation=\"horizontal\"\n            width=\"auto\"\n            showValues\n        />\n    \u003c/div>\n);\n\nexport default HorizontalDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fhorizontal.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fhorizontal.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/live-update.demo.tsx",
        "title": "入场与数据更新动画",
        "description": "首次挂载时柱体从零值基线逐类目生长；手动切换数据集时从旧值过渡到新值。系统偏好「减弱动态」时直接呈现结果。",
        "sourceCode": "export const meta = {\n    title: \"入场与数据更新动画\",\n    description: \"首次挂载时柱体从零值基线逐类目生长；手动切换数据集时从旧值过渡到新值。系统偏好「减弱动态」时直接呈现结果。\",\n};\n\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport BarChart from '../../src/index.js';\n\nconst DATASETS = [\n    [820, 932, 901, 934, 690],\n    [620, 480, 720, 540, 880],\n    [1020, 1132, 601, 834, 390],\n];\n\nconst CATEGORIES = ['华东', '华南', '华北', '西南', '东北'];\n\nconst LiveUpdateDemo = () => {\n    const [index, setIndex] = useState(0);\n\n    return (\n        \u003cdiv className={css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']}; min-width: 0; inline-size: 100%;`}>\n            \u003cBarChart\n                width=\"auto\"\n                aria-label=\"各区域季度销售额\"\n                categories={CATEGORIES}\n                series={[{ name: '销售额', data: DATASETS[index] }]}\n            />\n            \u003cButton\n                type=\"button\"\n                className={css`align-self: center;`}\n                onClick={() => setIndex(prev => (prev + 1) % DATASETS.length)}\n            >\n                切换数据集\n            \u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default LiveUpdateDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Flive-update.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Flive-update.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/multi-series.demo.tsx",
        "title": "多系列分组",
        "description": "多系列在类目内并列分组，颜色按分类色板顺序分配并跟随系列；提供 onBarClick 后柱子呈现 pointer 光标。",
        "sourceCode": "export const meta = {\n    title: \"多系列分组\",\n    description: \"多系列在类目内并列分组，颜色按分类色板顺序分配并跟随系列；提供 onBarClick 后柱子呈现 pointer 光标。\",\n};\n\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport BarChart from '../../src/index.js';\nimport type { BarClickInfo } from '../../src/index.js';\n\nconst CATEGORIES = ['华东', '华南', '华北', '西南'];\n\nconst MultiSeriesDemo = () => {\n    const [picked, setPicked] = useState\u003cBarClickInfo | null>(null);\n\n    return (\n        \u003cdiv className={css`display: flex; flex-direction: column; gap: ${token.space['component-gap']}; min-width: 0; inline-size: 100%;`}>\n            \u003cBarChart\n                width=\"auto\"\n                aria-label=\"各区域分渠道销售额\"\n                categories={CATEGORIES}\n                series={[\n                    { name: '线上', data: [820, 932, 901, 934] },\n                    { name: '线下', data: [620, 710, 660, 540] },\n                    { name: '经销商', data: [450, 380, 520, 410] },\n                ]}\n                onBarClick={setPicked}\n            />\n            \u003cdiv role=\"status\" className={css`font-size: ${token.font.size.caption}; color: ${token.color.text.secondary};`}>\n                {picked\n                    ? `已选中：${picked.category} · ${picked.seriesName} = ${picked.value}`\n                    : '点击任意柱子查看回调数据'}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default MultiSeriesDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fmulti-series.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fmulti-series.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/stacked.demo.tsx",
        "title": "堆叠模式",
        "description": "stacked 开启堆叠：正值向上、负值向下分别累计，段与段之间保持 2px 表面留白，仅最外侧段带数据端圆角。",
        "sourceCode": "export const meta = {\n    title: \"堆叠模式\",\n    description: \"stacked 开启堆叠：正值向上、负值向下分别累计，段与段之间保持 2px 表面留白，仅最外侧段带数据端圆角。\",\n};\n\nimport BarChart from '../../src/index.js';\n\nconst CATEGORIES = ['Q1', 'Q2', 'Q3', 'Q4'];\n\nconst StackedDemo = () => (\n    \u003cBarChart\n        width=\"auto\"\n        aria-label=\"季度收支结构\"\n        categories={CATEGORIES}\n        stacked\n        series={[\n            { name: '产品收入', data: [1200, 1420, 1380, 1690] },\n            { name: '服务收入', data: [680, 720, 810, 900] },\n            { name: '成本支出', data: [-750, -820, -790, -880] },\n        ]}\n        formatValue={v => v.toLocaleString()}\n    />\n);\n\nexport default StackedDemo;\n",
        "previewPath": "/components/rc-bar-chart/workbench/?__wake_demo=docs%2Fdemos%2Fstacked.demo.tsx",
        "workbenchPath": "/components/rc-bar-chart/workbench/#/components/docs%2Fdemos%2Fstacked.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
