/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/book-sales.demo.tsx",
        "title": "比较各书架的销量占比",
        "description": "文学类售出 120 本，占当天销量的一半。点击图例可比较其余书架。",
        "learning": {
            "components": [
                "PieChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "data",
                "formatValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import PieChart from '@crab-dev/rc-pie-chart';\n\nexport const meta = {\n    title: '比较各书架的销量占比',\n    description: '文学类售出 120 本，占当天销量的一半。点击图例可比较其余书架。',\n};\n\nexport default function BookSalesDemo() {\n    return (\n        \u003cPieChart\n            aria-label=\"书店今日各书架售出册数\"\n            width=\"auto\"\n            height={240}\n            data={[\n                { name: '文学', value: 120 },\n                { name: '社科', value: 80 },\n                { name: '少儿', value: 40 },\n            ]}\n            formatValue={value => `${value} 本`}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pie-chart/workbench/?__wake_demo=docs%2Fdemos%2Fbook-sales.demo.tsx",
        "workbenchPath": "/components/rc-pie-chart/workbench/#/components/docs%2Fdemos%2Fbook-sales.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读取构成"
    },
    {
        "id": "docs/demos/storage.demo.tsx",
        "title": "用圆环查看磁盘空间",
        "description": "内圆半径设为外圆的 60%。隐藏可用空间后，圆环只比较两类已用容量。",
        "learning": {
            "components": [
                "PieChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "innerRadiusRatio",
                "data",
                "formatValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import PieChart from '@crab-dev/rc-pie-chart';\n\nexport const meta = {\n    title: '用圆环查看磁盘空间',\n    description: '内圆半径设为外圆的 60%。隐藏可用空间后，圆环只比较两类已用容量。',\n};\n\nexport default function StorageDemo() {\n    return (\n        \u003cPieChart\n            aria-label=\"128 GB 磁盘空间分配\"\n            width=\"auto\"\n            height={240}\n            innerRadiusRatio={0.6}\n            data={[\n                { name: '应用', value: 64 },\n                { name: '媒体', value: 48 },\n                { name: '可用', value: 16 },\n            ]}\n            formatValue={value => `${value} GB`}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pie-chart/workbench/?__wake_demo=docs%2Fdemos%2Fstorage.demo.tsx",
        "workbenchPath": "/components/rc-pie-chart/workbench/#/components/docs%2Fdemos%2Fstorage.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "读取构成"
    },
    {
        "id": "docs/demos/requests.demo.tsx",
        "title": "查看工单的负责小组",
        "description": "点击扇区或用键盘激活它，根据原始数据下标读取该类工单的负责小组。",
        "learning": {
            "components": [
                "PieChart"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "data",
                "formatValue",
                "onSliceClick"
            ],
            "events": [
                "onSliceClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport PieChart from '@crab-dev/rc-pie-chart';\n\nexport const meta = {\n    title: '查看工单的负责小组',\n    description: '点击扇区或用键盘激活它，根据原始数据下标读取该类工单的负责小组。',\n};\n\nconst requests = [\n    { name: '商品咨询', value: 30, team: '商品支持组' },\n    { name: '物流进度', value: 18, team: '配送组' },\n    { name: '售后服务', value: 12, team: '售后组' },\n];\n\nexport default function RequestsDemo() {\n    const [selectedIndex, setSelectedIndex] = useState\u003cnumber | null>(null);\n    const selected = selectedIndex === null ? undefined : requests[selectedIndex];\n    return (\n        \u003cdiv>\n            \u003cPieChart\n                aria-label=\"今日客服工单按问题类型分布\"\n                width=\"auto\"\n                height={240}\n                data={requests}\n                formatValue={value => `${value} 件`}\n                onSliceClick={({ index }) => setSelectedIndex(index)}\n            />\n            \u003cp role=\"status\">\n                {selected ? `${selected.team}负责 ${selected.value} 件“${selected.name}”工单。` : '选择一个类别查看负责小组。'}\n            \u003c/p>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pie-chart/workbench/?__wake_demo=docs%2Fdemos%2Frequests.demo.tsx",
        "workbenchPath": "/components/rc-pie-chart/workbench/#/components/docs%2Fdemos%2Frequests.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "查看分类明细"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "书店当天售出 240 本书，文学类正好占一半。用当前主题的分类色把三个书架的销量放进同一个圆里。",
        "usage": "给每个扇区起一个能直接读懂的类别名，并把册数的单位加进读数。这样读者既可以看比例，也能用图例名称定位到书架。",
        "exampleDescription": "先查看文学类的 120 本，再点击少儿图例。剩下的两类中，文学类占比变为 60%。",
        "demos": [
            "book-sales.demo.tsx",
            "storage.demo.tsx",
            "requests.demo.tsx"
        ],
        "references": [
            "https://material-web.dev/theming/color/"
        ]
    },
    "macos": {
        "summary": "在存储面板里用圆环呈现一块 128 GB 磁盘的空间分配，空闲容量和已用容量都计入整盘。",
        "usage": "让圆环随面板宽度调整。把容量单位统一为 GB，方便读者对照图例，在窄面板中也能查到每个分区的实际容量。",
        "exampleDescription": "查看“可用”扇区的剩余空间，再隐藏该项，比较已用空间中应用和媒体所占的份额。",
        "demos": [
            "storage.demo.tsx",
            "book-sales.demo.tsx",
            "requests.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/charts"
        ]
    },
    "shadcn": {
        "summary": "工单概览把问题类型映射为扇区。选择一个分类，即可在图下方找到负责该类工单的小组。",
        "usage": "把分类数量保留在提示中，把负责人等业务信息放在图外。这样读者可以从概览进入一类工单的处理详情。",
        "exampleDescription": "选择“物流进度”，核对该类别的 18 件工单及负责小组。也可以用键盘聚焦并激活扇区。",
        "demos": [
            "requests.demo.tsx",
            "book-sales.demo.tsx",
            "storage.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components/chart"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "PieChart 用扇区角度表示各项在总量中的份额。图例可以临时切换统计范围，扇区提示同时给出原始值和当前占比。",
    "useWhen": [
        "希望解释一个总量由哪几类组成，例如本月售出商品的品类分布。",
        "需要在用量面板中用圆环显示容量构成，并允许读者查看某一部分的实际用量。"
    ],
    "avoidWhen": [
        "同一记录可能属于多个类别时，应先将其划分为互斥类别，或者用柱图分别展示各类计数。",
        "类别很多、数值接近且需要看出细小差异时，排序条形图或数据表更便于逐项比较。"
    ],
    "essentials": [
        "统一统计时段与计量单位，在 data 中填写各类的原始值，用 formatValue 显示单位。",
        "使用图例隐藏一项后，其他扇区按剩余总量计算占比，再次点击可以恢复原来的统计范围。",
        "需要从分类打开明细时，可以用 onSliceClick 返回的 index 找到数据源中的业务记录。"
    ],
    "accessibility": [
        "用 aria-label 说明总量所指的对象，给每个类别提供有意义的名称，方便读屏用户浏览数据表。",
        "通过方向键可以在扇区间移动，读取名称、数值与占比。提供明细操作时，Enter 和空格键都能激活当前扇区。"
    ]
} as const;
