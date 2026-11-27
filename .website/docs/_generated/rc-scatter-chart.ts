/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/routes.demo.tsx",
        "title": "比较两条配送线路",
        "description": "横轴为配送里程，纵轴为配送用时。点击图例切换线路，检查相近里程下的单次配送记录。",
        "learning": {
            "components": [
                "ScatterChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "labels",
                "formatX",
                "formatY",
                "series"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import ScatterChart from '@crab-dev/rc-scatter-chart';\n\nexport const meta = {\n    title: '比较两条配送线路',\n    description: '横轴为配送里程，纵轴为配送用时。点击图例切换线路，检查相近里程下的单次配送记录。',\n};\n\nexport default function RoutesDemo() {\n    return (\n        \u003cScatterChart\n            aria-label=\"城区线和滨河线的配送里程与用时\"\n            width=\"auto\"\n            height={285}\n            labels={{ x: '里程', y: '用时' }}\n            formatX={value => `${value} km`}\n            formatY={value => `${value} 分`}\n            series={[\n                { name: '城区线', data: [\n                    { x: 1.4, y: 12 }, { x: 2.1, y: 19 }, { x: 2.8, y: 16 },\n                    { x: 3.5, y: 25 }, { x: 4.2, y: 22 }, { x: 4.8, y: 30 },\n                    { x: 5.3, y: 36 }, { x: 5.7, y: 28 }, { x: 6.8, y: 39 },\n                    { x: 7.5, y: 35 }, { x: 8.1, y: 46 }, { x: 9.2, y: 44 },\n                ] },\n                { name: '滨河线', data: [\n                    { x: 1.7, y: 9 }, { x: 2.3, y: 12 }, { x: 3.1, y: 13 },\n                    { x: 3.9, y: 18 }, { x: 4.4, y: 15 }, { x: 4.9, y: 22 },\n                    { x: 5.5, y: 20 }, { x: 6.3, y: 27 }, { x: 6.7, y: 23 },\n                    { x: 7.2, y: 30 }, { x: 8.4, y: 29 }, { x: 9.1, y: 34 },\n                ] },\n            ]}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-scatter-chart/workbench/?__wake_demo=docs%2Fdemos%2Froutes.demo.tsx",
        "workbenchPath": "/components/rc-scatter-chart/workbench/#/components/docs%2Fdemos%2Froutes.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读数与分组"
    },
    {
        "id": "docs/demos/sampling.demo.tsx",
        "title": "保留不规则采样间隔",
        "description": "按实际经过的分钟定位水温样本，前两分钟的三次观测与后段的稀疏观测共享同一数值轴。",
        "learning": {
            "components": [
                "ScatterChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "labels",
                "formatX",
                "formatY",
                "series"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import ScatterChart from '@crab-dev/rc-scatter-chart';\n\nexport const meta = {\n    title: '保留不规则采样间隔',\n    description: '按实际经过的分钟定位水温样本，前两分钟的三次观测与后段的稀疏观测共享同一数值轴。',\n};\n\nexport default function SamplingDemo() {\n    return (\n        \u003cScatterChart\n            aria-label=\"关闭加热后经过的时间与水温\"\n            width=\"auto\"\n            height={245}\n            labels={{ x: '经过时间', y: '水温' }}\n            formatX={value => `${value} 分`}\n            formatY={value => `${value} °C`}\n            series={[{ name: '水温', data: [\n                { x: 0, y: 84, label: '停止加热' },\n                { x: 1, y: 80, label: '首次复测' },\n                { x: 2, y: 76, label: '二次复测' },\n                { x: 8, y: 59, label: '八分钟复测' },\n                { x: 17, y: 41, label: '最终复测' },\n            ] }]}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-scatter-chart/workbench/?__wake_demo=docs%2Fdemos%2Fsampling.demo.tsx",
        "workbenchPath": "/components/rc-scatter-chart/workbench/#/components/docs%2Fdemos%2Fsampling.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读数与分组"
    },
    {
        "id": "docs/demos/selection.demo.tsx",
        "title": "选择包裹查看处理记录",
        "description": "读取包裹重量与分拣耗时，点击数据点或用键盘激活样本，在图下显示所选记录。",
        "learning": {
            "components": [
                "ScatterChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "labels",
                "formatX",
                "formatY",
                "series",
                "onPointClick"
            ],
            "events": [
                "onPointClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport ScatterChart, { type ScatterChartPoint } from '@crab-dev/rc-scatter-chart';\n\nexport const meta = {\n    title: '选择包裹查看处理记录',\n    description: '读取包裹重量与分拣耗时，点击数据点或用键盘激活样本，在图下显示所选记录。',\n};\n\nexport default function SelectionDemo() {\n    const [parcel, setParcel] = useState\u003cScatterChartPoint | null>(null);\n    return (\n        \u003cdiv>\n            \u003cScatterChart\n                aria-label=\"包裹重量与分拣耗时\"\n                width=\"auto\"\n                height={245}\n                labels={{ x: '重量', y: '分拣耗时' }}\n                formatX={value => `${value} kg`}\n                formatY={value => `${value} 秒`}\n                series={[{ name: '包裹', data: [\n                    { x: 0.6, y: 11, label: 'A01' }, { x: 1.4, y: 18, label: 'A02' },\n                    { x: 2.2, y: 42, label: 'A03' }, { x: 3.5, y: 26, label: 'A04' },\n                ] }]}\n                onPointClick={({ point }) => setParcel(point)}\n            />\n            \u003cp role=\"status\">\n                {parcel ? `${parcel.label} 重 ${parcel.x} kg，分拣耗时 ${parcel.y} 秒。` : '选择一个包裹查看分拣记录。'}\n            \u003c/p>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-scatter-chart/workbench/?__wake_demo=docs%2Fdemos%2Fselection.demo.tsx",
        "workbenchPath": "/components/rc-scatter-chart/workbench/#/components/docs%2Fdemos%2Fselection.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "查看样本"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "用主题系列色区分两条配送线路，以里程和用时观察同一距离范围内的配送差异。",
        "usage": "用图例写清分组依据，并在两个数值轴分别给出单位，方便读者解释点与点之间的距离。",
        "exampleDescription": "先比较两条线路在五公里左右的用时，再点击滨河线图例，单独查看城区线的分布。",
        "demos": [
            "routes.demo.tsx",
            "sampling.demo.tsx",
            "selection.demo.tsx"
        ],
        "references": [
            "https://material-web.dev/theming/color/"
        ]
    },
    "macos": {
        "summary": "在紧凑的采样记录视图中保留实际时间间隔，使密集采样和较长的观测空档都能被读出。",
        "usage": "给每次测量填写可辨认的样本名称，在点上聚焦查看时间与温度，面板宽度变化时保留读数。",
        "exampleDescription": "比较最初两次测量之间的距离与后两次的距离，查看关闭加热八分钟后的水温。",
        "demos": [
            "sampling.demo.tsx",
            "routes.demo.tsx",
            "selection.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/charts"
        ]
    },
    "shadcn": {
        "summary": "用中性坐标衬托散点的位置，把需要跟进的样本详情放在图下，方便继续读取记录。",
        "usage": "为每个包裹填写编号，在选择回调中使用原始重量和耗时展示完整的处理记录。",
        "exampleDescription": "找到耗时最长的包裹，点击或用键盘激活该样本，核对图下显示的包裹编号和重量。",
        "demos": [
            "selection.demo.tsx",
            "routes.demo.tsx",
            "sampling.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components/chart"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "ScatterChart 用每个观测对象的两个数值决定点在图上的横向和纵向位置。读者可以沿坐标轴读取一条记录，也可以观察整组数据是否集中在某个区域。",
    "useWhen": [
        "需要探索两个数值指标之间的关系，例如距离与送达用时。",
        "需要比较不同组别的分布，或查找明显偏离同类记录的观测点。"
    ],
    "avoidWhen": [
        "如果要追踪同一指标随时间的变化，折线图可以用相邻数据点之间的连线呈现过程。"
    ],
    "essentials": [
        "先为两个轴分别选定指标和单位，所有系列按相同口径提供坐标。",
        "让每个点对应一条观测记录，保留负值和零值各自的含义。",
        "给分组使用容易辨认的系列名，读者就能借助图例单独查看每组分布。"
    ],
    "accessibility": [
        "用 aria-label 说明所比较的两个指标，必要时补上单位和观测范围。",
        "键盘聚焦数据点可以查看观测值，读屏用户也可通过数据表按行核对两个坐标。"
    ]
} as const;
