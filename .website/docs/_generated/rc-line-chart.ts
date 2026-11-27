/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/daily-range.demo.tsx",
        "title": "比较一周的最高与最低气温",
        "description": "悬停同一天读取两条曲线的温度，点击图例可单独观察其中一个系列。",
        "learning": {
            "components": [
                "LineChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "categories",
                "series",
                "formatValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import LineChart from '@crab-dev/rc-line-chart';\n\nexport const meta = {\n    title: '比较一周的最高与最低气温',\n    description: '悬停同一天读取两条曲线的温度，点击图例可单独观察其中一个系列。',\n};\n\nexport default function DailyRangeDemo() {\n    return (\n        \u003cLineChart\n            aria-label=\"一周最高与最低气温\"\n            width=\"auto\"\n            height={260}\n            categories={['周一', '周二', '周三', '周四', '周五', '周六', '周日']}\n            series={[\n                { name: '最高气温', data: [16, 18, 21, 20, 17, 19, 22] },\n                { name: '最低气温', data: [8, 10, 12, 11, 9, 10, 12] },\n            ]}\n            formatValue={value => `${value} °C`}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-line-chart/workbench/?__wake_demo=docs%2Fdemos%2Fdaily-range.demo.tsx",
        "workbenchPath": "/components/rc-line-chart/workbench/#/components/docs%2Fdemos%2Fdaily-range.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读取趋势"
    },
    {
        "id": "docs/demos/missing-data.demo.tsx",
        "title": "区分零值和缺测",
        "description": "凌晨四点测得零度，六点缺测。零度保留数据点，六点处断开连线。",
        "learning": {
            "components": [
                "LineChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "categories",
                "series",
                "formatValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import LineChart from '@crab-dev/rc-line-chart';\n\nexport const meta = {\n    title: '区分零值和缺测',\n    description: '凌晨四点测得零度，六点缺测。零度保留数据点，六点处断开连线。',\n};\n\nexport default function MissingDataDemo() {\n    return (\n        \u003cLineChart\n            aria-label=\"山顶气象站两小时采样气温\"\n            width=\"auto\"\n            height={240}\n            categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00']}\n            series={[{ name: '气温', data: [-3, -2, 0, null, 3, 7] }]}\n            formatValue={value => `${value} °C`}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-line-chart/workbench/?__wake_demo=docs%2Fdemos%2Fmissing-data.demo.tsx",
        "workbenchPath": "/components/rc-line-chart/workbench/#/components/docs%2Fdemos%2Fmissing-data.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读取趋势"
    },
    {
        "id": "docs/demos/reference-line.demo.tsx",
        "title": "检查超过目标的采样点",
        "description": "以 200 ms 为延迟目标，点击数据点或用键盘激活后，在图外读取采样记录。",
        "learning": {
            "components": [
                "LineChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "categories",
                "series",
                "referenceLines",
                "formatValue",
                "onPointClick"
            ],
            "events": [
                "onPointClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport LineChart, { type PointClickInfo } from '@crab-dev/rc-line-chart';\n\nexport const meta = {\n    title: '检查超过目标的采样点',\n    description: '以 200 ms 为延迟目标，点击数据点或用键盘激活后，在图外读取采样记录。',\n};\n\nexport default function ReferenceLineDemo() {\n    const [sample, setSample] = useState\u003cPointClickInfo | null>(null);\n    return (\n        \u003cdiv>\n            \u003cLineChart\n                aria-label=\"上午六次请求延迟采样\"\n                width=\"auto\"\n                height={240}\n                categories={['09:00', '09:10', '09:20', '09:30', '09:40', '09:50']}\n                series={[{ name: '请求延迟', data: [145, 170, 225, 180, 135, 155] }]}\n                referenceLines={[{ value: 200, label: '目标 200 ms' }]}\n                formatValue={value => `${value} ms`}\n                onPointClick={setSample}\n            />\n            \u003cp role=\"status\">\n                {sample ? `${sample.category} 的请求延迟为 ${sample.value} ms。` : '选择一个采样点查看延迟。'}\n            \u003c/p>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-line-chart/workbench/?__wake_demo=docs%2Fdemos%2Freference-line.demo.tsx",
        "workbenchPath": "/components/rc-line-chart/workbench/#/components/docs%2Fdemos%2Freference-line.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "阈值与明细"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "用当前表面的系列色区分最高与最低气温，在同一个坐标系里读取每天的温差。",
        "usage": "为每条线填写读者熟悉的系列名，图例、提示和辅助技术数据表都会使用这一名称。",
        "exampleDescription": "在周三的位置查看两项气温，再点击最低气温的图例，单独观察最高气温的走势。",
        "demos": [
            "daily-range.demo.tsx",
            "missing-data.demo.tsx",
            "reference-line.demo.tsx"
        ],
        "references": [
            "https://material-web.dev/theming/color/"
        ]
    },
    "macos": {
        "summary": "把时间和单位直接放在测量数据旁，折线中断的位置提示读者哪些时段缺少读数。",
        "usage": "在可调整宽度的面板中使用自动宽度，保留原始采样顺序，让读者能从图形回到具体的观测记录。",
        "exampleDescription": "观察凌晨温度降到零度的位置，随后找出仪器停测留下的空档和恢复测量后的第一个点。",
        "demos": [
            "missing-data.demo.tsx",
            "daily-range.demo.tsx",
            "reference-line.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/charts"
        ]
    },
    "shadcn": {
        "summary": "用简洁的坐标和一条带文字的目标线呈现请求延迟，方便读者直接找到超过阈值的时段。",
        "usage": "在图内只标出需要判断的目标值，选择数据点后在图下方显示记录的时间和完整读数。",
        "exampleDescription": "找到超过二百毫秒目标的那次采样，选择该点，在图下方核对时间和实际延迟。",
        "demos": [
            "reference-line.demo.tsx",
            "daily-range.demo.tsx",
            "missing-data.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components/chart"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "LineChart 按类目顺序连接同一系列的观测值，展示上升、回落和转折。多条折线共用坐标轴，方便查看各系列在同一时间或阶段的差距。",
    "useWhen": [
        "需要查看每日、每周等固定间隔内指标的变化趋势。",
        "有多个单位相同的系列，需要逐个时段比较它们之间的差距。"
    ],
    "avoidWhen": [
        "类别之间没有自然顺序时，使用柱状图比较大小更容易理解。"
    ],
    "essentials": [
        "先按时间或阶段排列类目，再把每个系列的数值对齐到相同下标。",
        "漏采时用 null 占位，使折线留出断点。实测值为零时保留数字 0。",
        "使用参考线标出目标及其单位，帮助读者判断哪些时段达到目标。"
    ],
    "accessibility": [
        "为图表提供包含指标和时段的名称，给每个系列使用可独立理解的名称。",
        "用键盘聚焦数据点可取得对应读数，读屏用户也可以按行列浏览数据表。"
    ]
} as const;
