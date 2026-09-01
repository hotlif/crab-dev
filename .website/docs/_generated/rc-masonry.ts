/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认 2 列瀑布流布局",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认 2 列瀑布流布局\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Masonry from \"../../src/index.js\";\n\nconst itemStyle = css`\n    border-radius: 8px;\n    padding: 16px;\n    color: #fff;\n    font-size: 14px;\n    font-weight: 500;\n`;\n\nconst items = [\n    { height: 120, color: \"oklch(0.65 0.15 250)\" },\n    { height: 180, color: \"oklch(0.55 0.2 300)\" },\n    { height: 100, color: \"oklch(0.7 0.12 150)\" },\n    { height: 200, color: \"oklch(0.6 0.18 30)\" },\n    { height: 140, color: \"oklch(0.58 0.16 200)\" },\n    { height: 160, color: \"oklch(0.68 0.14 100)\" },\n];\n\nconst BasicDemo = () => {\n    return (\n        \u003cMasonry columns={2} gutter={16}>\n            {items.map((item, i) => (\n                \u003cdiv\n                    key={i}\n                    className={itemStyle}\n                    style={{ height: item.height, backgroundColor: item.color }}\n                >\n                    Item {i + 1} — {item.height}px\n                \u003c/div>\n            ))}\n        \u003c/Masonry>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"多列布局\",\n    description: \"通过 `columns` 属性控制列数\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst itemStyle = css`\n    border-radius: 8px;\n    padding: 16px;\n    color: #fff;\n    font-size: 14px;\n    font-weight: 500;\n`;\n\nconst items = [\n    { height: 100, color: \"oklch(0.65 0.15 250)\" },\n    { height: 160, color: \"oklch(0.55 0.2 300)\" },\n    { height: 120, color: \"oklch(0.7 0.12 150)\" },\n    { height: 200, color: \"oklch(0.6 0.18 30)\" },\n    { height: 80, color: \"oklch(0.58 0.16 200)\" },\n    { height: 140, color: \"oklch(0.68 0.14 100)\" },\n    { height: 180, color: \"oklch(0.62 0.17 60)\" },\n    { height: 110, color: \"oklch(0.72 0.11 330)\" },\n];\n\nconst ColumnsDemo = () => {\n    const [columns, setColumns] = useState(3);\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1.5rem;\n                `}\n            >\n                \u003clabel>列数\u003c/label>\n                \u003cselect\n                    value={columns}\n                    onChange={(e) => setColumns(Number(e.target.value))}\n                >\n                    \u003coption value={2}>2 列\u003c/option>\n                    \u003coption value={3}>3 列\u003c/option>\n                    \u003coption value={4}>4 列\u003c/option>\n                    \u003coption value={5}>5 列\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cMasonry columns={columns} gutter={12}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={itemStyle}\n                        style={{ height: item.height, backgroundColor: item.color }}\n                    >\n                        Item {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default ColumnsDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"顺序排列\",\n    description: \"设置 `sequential` 为 `true` 时，子项按 DOM 顺序从左到右依次排列，而非优先放入最短列\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Masonry from \"../../src/index.js\";\n\nconst itemStyle = css`\n    border-radius: 8px;\n    padding: 16px;\n    color: #fff;\n    font-size: 14px;\n    font-weight: 500;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n`;\n\nconst items = [\n    { height: 100, color: \"oklch(0.65 0.15 250)\" },\n    { height: 200, color: \"oklch(0.55 0.2 300)\" },\n    { height: 120, color: \"oklch(0.7 0.12 150)\" },\n    { height: 180, color: \"oklch(0.6 0.18 30)\" },\n    { height: 90, color: \"oklch(0.58 0.16 200)\" },\n    { height: 150, color: \"oklch(0.68 0.14 100)\" },\n];\n\nconst SequentialDemo = () => {\n    const [sequential, setSequential] = useState(false);\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1.5rem;\n                `}\n            >\n                \u003clabel>顺序排列\u003c/label>\n                \u003cinput\n                    type=\"checkbox\"\n                    checked={sequential}\n                    onChange={() => setSequential(!sequential)}\n                />\n            \u003c/div>\n            \u003cMasonry columns={3} gutter={12} sequential={sequential}>\n                {items.map((item, i) => (\n                    \u003cdiv\n                        key={i}\n                        className={itemStyle}\n                        style={{ height: item.height, backgroundColor: item.color }}\n                    >\n                        {i + 1}\n                    \u003c/div>\n                ))}\n            \u003c/Masonry>\n        \u003c/div>\n    );\n};\n\nexport default SequentialDemo;\n",
        "previewPath": "/components/rc-masonry/workbench/?__wake_demo=docs%2Fdemos%2Fsequential.demo.tsx",
        "workbenchPath": "/components/rc-masonry/workbench/#/components/docs%2Fdemos%2Fsequential.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Masonry",
    "symbol": "MasonryProps",
    "props": [
        {
            "name": "children",
            "required": false,
            "description": "瀑布流子项",
            "typeText": "ReactElement | ReactElement[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "columns",
            "required": false,
            "description": "列数，默认为 2",
            "typeText": "number",
            "defaultValue": "2",
            "deprecated": false
        },
        {
            "name": "gutter",
            "required": false,
            "description": "子元素间距（像素），默认使用 token 中的 gutter 值。 传入数值时覆盖 token 默认值。",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "sequential",
            "required": false,
            "description": "是否按 DOM 顺序排列（从左到右依次放置）， 默认 false，优先放入最短列。",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
