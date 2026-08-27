/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/simple.demo.tsx",
        "title": "基础示例",
        "description": "虚拟滚动组件的基础使用示例",
        "sourceCode": "export const meta = {\n    title: \"基础示例\",\n    description: \"虚拟滚动组件的基础使用示例\",\n};\nimport { type ReactNode } from \"react\"\nimport RcVirtual from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst mockRowData = () => {\n    const mockData = []\n    for (let i = 0; i \u003c 20000; i += 1) {\n        mockData.push({\n            a: `a-${i}`,\n            b: `b-${i}`,\n            c: `c-${i}`,\n            d: `d-${i}`,\n            e: `e-${i}`,\n            f: `f-${i}`,\n        })\n    }\n    return mockData;\n}\n\nconst cellStyle = css`\n\tdisplay: inline-block;\n\tbox-sizing: border-box;\n\tborder: 1px solid #000;\n`\n\n// 虚拟列表左侧占位：用于在可视区中预留被横向裁剪的区域\nconst paddingLeft = (\n    \u003cdiv\n        key=\"virtual-left-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\twidth: var(--crab-rc-virtual-left-padding-width, 0px);\n\t\t\theight: 100%;\n\t\t`}\n    />\n)\n\n// 虚拟列表右侧占位：用于在可视区中补齐右侧被裁剪宽度\nconst paddingRight = (\n    \u003cdiv\n        key=\"virtual-right-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\twidth: var(--crab-rc-virtual-right-padding-width, 0px);\n\t\t\theight: 100%;\n\t\t`}\n    />\n)\n\n// 虚拟列表底部占位：用于在纵向滚动时补齐不可见区域\nconst paddingBottom = (\n    \u003cdiv\n        key=\"virtual-bottom-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\theight: var(--crab-rc-virtual-bottom-padding-height, 0px);\n\t\t\twidth: 100%;\n\t\t`}\n    />\n)\n\nconst mockData = mockRowData();\nconst gridTemplateColumns = [120, 120, 120, 120, 120, 120]\nconst ROW_HEIGHT = 24;\nconst totalWidth = gridTemplateColumns.reduce((a, b) => a + b, 0);\n\nconst SimpleDemo = () => {\n    return (\n        \u003cRcVirtual\n            viewportHeight={400}\n            viewportWidth={300}\n            gridTemplateColumns={gridTemplateColumns}\n            gridTemplateRows={mockData.map(() => ROW_HEIGHT)}\n            renderRows={(rowRange, columnRange) => {\n                const rows: ReactNode[] = [\n                    \u003cdiv\n                        key=\"virtual-top-padding\"\n                        className={css`\n\t\t\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\tbox-sizing: border-box;\n\t\t\t\t\t\t\theight: var(--crab-rc-virtual-top-padding-height, 0px);\n\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t`}\n                    />\n                ];\n\n                for (let rowIndex = rowRange[0]; rowIndex \u003c= rowRange[1]; rowIndex += 1) {\n                    const node = mockData[rowIndex];\n                    const cells: ReactNode[] = [];\n                    for (let colIndex = columnRange[0]; colIndex \u003c= columnRange[1]; colIndex += 1) {\n                        const keys = Object.keys(node) as (keyof typeof node)[];\n                        cells.push(\n                            \u003cdiv\n                                key={`cell-${rowIndex}-${colIndex}`}\n                                className={cellStyle}\n                                style={{ width: gridTemplateColumns[colIndex] }}\n                            >\n                                {node[keys[colIndex]]}\n                            \u003c/div>\n                        );\n                    }\n\n                    rows.push(\n                        \u003cdiv\n                            key={`row-${rowIndex}`}\n                            className={css`\n\t\t\t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\t\t`}\n                            style={{\n                                height: ROW_HEIGHT,\n                                width: totalWidth,\n                            }}\n                        >\n                            {paddingLeft}\n                            {cells}\n                            {paddingRight}\n                        \u003c/div>\n                    );\n                }\n\n                rows.push(paddingBottom);\n                return rows;\n            }}\n        />\n    )\n}\n\nexport default SimpleDemo;\n",
        "previewPath": "/components/rc-virtual/workbench/?__wake_demo=docs%2Fdemos%2Fsimple.demo.tsx",
        "workbenchPath": "/components/rc-virtual/workbench/#/components/docs%2Fdemos%2Fsimple.demo.tsx",
        "density": "spacious"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Virtual",
    "symbol": "VirtualProps",
    "props": [
        {
            "name": "gridTemplateColumns",
            "required": true,
            "description": "每列的宽度数组，单位为 px",
            "typeText": "number[] /** 每行的高度数组，单位为 px */ gridTemplateRows: number[] /** 可视区域宽度，单位为 px */ viewportWidth: number, /** 可视区域高度，单位为 px */ viewportHeight: number, /** * 可视区顶部被常驻（sticky）内容占据的高度，单位为 px。 * 例如表格在滚动容器内渲染的固定表头 / 过滤栏：它们占用可视区却不在 gridTemplateRows 中， * 因此需要计入纵向滚动总高度，否则末尾内容会被裁切且无法滚动到底。 */ reservedTopHeight?: number, /** * 可视区底部被常驻（sticky）内容占据的高度，单位为 px。 * 例如表格底部固定的汇总 / 合计行：它贴在可视区底部却不在 gridTemplateRows 中， * 因此需要计入纵向滚动总高度，否则末尾数据行会被汇总行遮挡且无法滚动出来。 */ reservedBottomHeight?: number, /** 渲染回调，根据当前可见的行列范围返回对应的 ReactNode */ renderRows: (rowRange: [number, number], columnRange: [number, number]) => ReactNode, /** 组件实例引用，可通过 scrollToCell 和 getScrollCellPosition 编程式控制滚动 */ gridRef?: RefObject\u003cVirtualHandle | null>",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
