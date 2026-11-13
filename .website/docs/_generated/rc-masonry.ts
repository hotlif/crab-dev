/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "布局验收矩阵",
        "description": "固定内容与不同高度，核对最短列、顺序分列、动态插入、RTL 镜像及密度重新测量。",
        "learning": {
            "components": [
                "Masonry"
            ],
            "props": [
                "columns",
                "sequential"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css, cx } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Masonry from '@crab-dev/rc-masonry';\n\nexport const meta = {\n    title: '布局验收矩阵',\n    description: '固定内容与不同高度，核对最短列、顺序分列、动态插入、RTL 镜像及密度重新测量。',\n};\nconst frame = css`\n    width: 100%;\n    max-width: 800px;\n    min-width: 0;\n    padding: ${token.space['component-gap']};\n    box-sizing: border-box;\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n`;\nconst item = css`\n    box-sizing: border-box;\n    padding: ${token.space['component-gap']};\n    background: ${token.color.surface.container};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.radius.sm};\n    overflow-wrap: anywhere;\n    @media (forced-colors: active) {\n        color: CanvasText;\n        background: Canvas;\n        border-color: CanvasText;\n    }\n`;\nconst heights = [\n    css`\n        min-height: 90px;\n    `,\n    css`\n        min-height: 150px;\n    `,\n    css`\n        min-height: 120px;\n    `,\n    css`\n        min-height: 180px;\n    `,\n];\nexport default function VisualMatrixDemo() {\n    const [mode, setMode] = useState('default');\n    return (\n        \u003c>\n            \u003clabel>\n                验收状态{' '}\n                \u003cselect aria-label=\"验收状态\" value={mode} onChange={(event) => setMode(event.target.value)}>\n                    \u003coption value=\"default\">最短列\u003c/option>\n                    \u003coption value=\"sequential\">按顺序\u003c/option>\n                    \u003coption value=\"inserted\">新增内容\u003c/option>\n                    \u003coption value=\"empty\">空容器\u003c/option>\n                \u003c/select>\n            \u003c/label>\n            \u003csection aria-label=\"Masonry visual matrix\" className={frame}>\n                \u003cMasonry columns={3} sequential={mode === 'sequential'}>\n                    {Array.from({ length: mode === 'empty' ? 0 : mode === 'inserted' ? 10 : 8 }, (_, index) => (\n                        \u003carticle key={index} data-masonry-card className={cx(item, heights[index % heights.length])}>\n                            \u003ch3>项目 Item {index + 1}\u003c/h3>\n                            \u003cp>中文与 English 内容\u003c/p>\n                        \u003c/article>\n                    ))}\n                \u003c/Masonry>\n            \u003c/section>\n        \u003c/>\n    );\n}\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "三体系验收"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认 2 列瀑布流布局，省略 gutter 时使用主题令牌间距。",
        "learning": {
            "components": [
                "Masonry"
            ],
            "props": [
                "columns"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认 2 列瀑布流布局，省略 gutter 时使用主题令牌间距。\",\n};\n\nimport { cx } from \"@crab-dev/css\";\nimport { itemStyle, heightStyles } from \"../demo-style.js\";\nimport Masonry from \"../../src/index.js\";\n\nconst items = [\n    { height: 120 },\n    { height: 180 },\n    { height: 100 },\n    { height: 200 },\n    { height: 140 },\n    { height: 160 },\n];\n\nconst BasicDemo = () => {\n    return (\n        \u003cMasonry columns={2}>\n            {items.map((item, i) => (\n                \u003cdiv\n                    key={i}\n                    className={cx.call(undefined, itemStyle, heightStyles[item.height])}\n\n                >\n                    Item {i + 1} — {item.height}px\n                \u003c/div>\n            ))}\n        \u003c/Masonry>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "布局与阅读顺序"
    },
    {
        "id": "docs/demos/columns.demo.tsx",
        "title": "多列布局",
        "description": "通过 `columns` 属性控制列数",
        "learning": {
            "components": [
                "Select",
                "Masonry"
            ],
            "props": [
                "label",
                "value",
                "options",
                "onValueChange",
                "columns",
                "gutter"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import Select from \"@crab-dev/rc-select\";\nexport const meta = {\n    title: \"多列布局\",\n    description: \"通过 `columns` 属性控制列数\",\n};\n\nimport { cx } from \"@crab-dev/css\";\nimport { itemStyle, heightStyles, controlStyle } from \"../demo-style.js\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst items = [\n    { height: 100 },\n    { height: 160 },\n    { height: 120 },\n    { height: 200 },\n    { height: 80 },\n    { height: 140 },\n    { height: 180 },\n    { height: 110 },\n];\n\nconst ColumnsDemo = () => {\n\n    const [columns, setColumns] = useState(3);\n\n    return (\n        \u003cdiv>\n            \u003cdiv className={controlStyle}>\n                \u003cSelect label=\"列数\" value={String(columns)}\n                    options={[2, 3, 4, 5].map((count) => ({ label: `${count} 列`, value: String(count) }))}\n                    onValueChange={(value) => { if (value) setColumns(Number(value)); }} />\n            \u003c/div>\n            \u003cMasonry columns={columns} gutter={12}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}\n\n                    >\n                        Item {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default ColumnsDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fcolumns.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fcolumns.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "布局与阅读顺序"
    },
    {
        "id": "docs/demos/sequential.demo.tsx",
        "title": "顺序排列",
        "description": "设置 `sequential` 为 `true` 时，子项按 DOM 顺序从行内起始侧依次排列：LTR 从左侧开始，RTL 从右侧开始。默认模式优先放入最短列。",
        "learning": {
            "components": [
                "Checkbox",
                "Masonry"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "columns",
                "gutter",
                "sequential"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import Checkbox from \"@crab-dev/rc-checkbox\";\nexport const meta = {\n    title: \"顺序排列\",\n    description: \"设置 `sequential` 为 `true` 时，子项按 DOM 顺序从行内起始侧依次排列：LTR 从左侧开始，RTL 从右侧开始。默认模式优先放入最短列。\",\n};\n\nimport { cx } from \"@crab-dev/css\";\nimport { itemStyle, heightStyles, controlStyle } from \"../demo-style.js\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst items = [\n    { height: 100 },\n    { height: 200 },\n    { height: 120 },\n    { height: 180 },\n    { height: 90 },\n    { height: 150 },\n];\n\nconst SequentialDemo = () => {\n\n    const [sequential, setSequential] = useState(false);\n\n    return (\n        \u003cdiv>\n            \u003cdiv className={controlStyle}>\n                \u003cCheckbox checked={sequential} onCheckedChange={setSequential}>顺序排列\u003c/Checkbox>\n            \u003c/div>\n            \u003cMasonry columns={3} gutter={12} sequential={sequential}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}\n\n                    >\n                        {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default SequentialDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fsequential.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fsequential.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": "布局与阅读顺序"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "让不同高度的内容卡片按可用宽度排列，表面和留白跟随当前语义角色。",
        "usage": "瀑布流适合可独立阅读的内容，重要的步骤顺序不能只由视觉列决定。",
        "exampleDescription": "查看不同高度卡片的排列，确认色调容器之间的留白与阅读关系。",
        "demos": [
            "basic.demo.tsx",
            "columns.demo.tsx",
            "sequential.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/foundations/layout/understanding-layout/overview",
            "https://material-web.dev/components/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "为桌面内容浏览区域组织不等高面板，列宽与间距随实际空间调整。",
        "usage": "缩小窗口时检查每个面板的最小可读宽度，不把内容压进过窄的列。",
        "exampleDescription": "切换列数，观察桌面内容面板的宽度、间距和整体浏览密度。",
        "demos": [
            "columns.demo.tsx",
            "basic.demo.tsx",
            "sequential.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以简洁网格排列不同高度的内容块，边框卡片之间保持稳定间距。",
        "usage": "需要明确阅读顺序时使用顺序排列，避免视觉位置与键盘顺序产生歧义。",
        "exampleDescription": "查看顺序布局中的卡片排列，检查阅读顺序和紧凑边界的关系。",
        "demos": [
            "sequential.demo.tsx",
            "basic.demo.tsx",
            "columns.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Masonry 把高度不同的内容按列紧密排列，减少瀑布流中的空白。视觉顺序可能与普通行优先阅读不同，因此只适合彼此相对独立的内容卡片。",
    "useWhen": [
        "图片、灵感卡片或作品集高度差异明显。",
        "内容可以独立阅读，不依赖严格的从左到右行顺序。"
    ],
    "avoidWhen": [
        "新闻、表单或步骤有明确阅读顺序时使用普通 Grid/List；需要对齐字段时使用 Table。"
    ],
    "essentials": [
        "选择 columns 或响应式列宽，并预留媒体尺寸减少重排。",
        "sequential 模式优先 DOM 阅读顺序，其他布局策略要评估视觉与语义顺序差异。",
        "增量加载时保持项目 key 稳定，避免整个瀑布流跳动。"
    ],
    "accessibility": [
        "DOM 顺序必须仍然形成可理解的阅读和 Tab 顺序。",
        "图片提供替代文本，加载更多后把状态通告与焦点留在可预测位置。"
    ]
} as const;
