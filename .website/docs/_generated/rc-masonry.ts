/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
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
        "group": null
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
                "onChange",
                "columns",
                "gutter"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "import Select from \"@crab-dev/rc-select\";\nexport const meta = {\n    title: \"多列布局\",\n    description: \"通过 `columns` 属性控制列数\",\n};\n\nimport { cx } from \"@crab-dev/css\";\nimport { itemStyle, heightStyles, controlStyle } from \"../demo-style.js\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst items = [\n    { height: 100 },\n    { height: 160 },\n    { height: 120 },\n    { height: 200 },\n    { height: 80 },\n    { height: 140 },\n    { height: 180 },\n    { height: 110 },\n];\n\nconst ColumnsDemo = () => {\n\n    const [columns, setColumns] = useState(3);\n\n    return (\n        \u003cdiv>\n            \u003cdiv className={controlStyle}>\n                \u003cSelect label=\"列数\" value={String(columns)}\n                    options={[2, 3, 4, 5].map((count) => ({ label: `${count} 列`, value: String(count) }))}\n                    onChange={(value) => { if (value) setColumns(Number(value)); }} />\n            \u003c/div>\n            \u003cMasonry columns={columns} gutter={12}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}\n\n                    >\n                        Item {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default ColumnsDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fcolumns.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fcolumns.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/sequential.demo.tsx",
        "title": "顺序排列",
        "description": "设置 `sequential` 为 `true` 时，子项按 DOM 顺序从左到右依次排列，而非优先放入最短列",
        "learning": {
            "components": [
                "Checkbox",
                "Masonry"
            ],
            "props": [
                "checked",
                "onChange",
                "columns",
                "gutter",
                "sequential"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "import Checkbox from \"@crab-dev/rc-checkbox\";\nexport const meta = {\n    title: \"顺序排列\",\n    description: \"设置 `sequential` 为 `true` 时，子项按 DOM 顺序从左到右依次排列，而非优先放入最短列\",\n};\n\nimport { cx } from \"@crab-dev/css\";\nimport { itemStyle, heightStyles, controlStyle } from \"../demo-style.js\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst items = [\n    { height: 100 },\n    { height: 200 },\n    { height: 120 },\n    { height: 180 },\n    { height: 90 },\n    { height: 150 },\n];\n\nconst SequentialDemo = () => {\n\n    const [sequential, setSequential] = useState(false);\n\n    return (\n        \u003cdiv>\n            \u003cdiv className={controlStyle}>\n                \u003cCheckbox checked={sequential} onChange={setSequential}>顺序排列\u003c/Checkbox>\n            \u003c/div>\n            \u003cMasonry columns={3} gutter={12} sequential={sequential}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={cx.call(undefined, itemStyle, heightStyles[item.height])}\n\n                    >\n                        {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default SequentialDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fsequential.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fsequential.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
