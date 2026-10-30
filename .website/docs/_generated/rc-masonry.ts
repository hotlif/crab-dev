/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

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
