/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/million.demo.tsx",
        "title": "百万条数据",
        "description": "1,000,000 条等高记录，仅生成可见内容；可快速定位首条、中间与末条，并继续滚动。",
        "learning": {
            "components": [
                "Button",
                "AutoSizer",
                "Virtual"
            ],
            "props": [
                "appearance",
                "aria-controls",
                "onClick",
                "gridRef",
                "role",
                "aria-label",
                "aria-describedby",
                "tabIndex",
                "viewportWidth",
                "viewportHeight",
                "gridTemplateColumns",
                "gridTemplateRows"
            ],
            "events": [
                "onClick",
                "onKeyDown"
            ],
            "hasState": false
        },
        "sourceCode": "import { useId, useRef } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport AutoSizer from \"@crab-dev/rc-auto-sizer\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Virtual, { type VirtualHandle } from \"../../src/virtual.js\";\n\nexport const meta = {\n    title: \"百万条数据\",\n    description: \"1,000,000 条等高记录，仅生成可见内容；可快速定位首条、中间与末条，并继续滚动。\",\n    order: 20,\n};\n\nconst ROW_COUNT = 1_000_000;\n// 与下方 token.size.field 的默认 56px 保持一致，采用 M3 单行列表高度。\nconst ROW_HEIGHT = 56;\nconst numberFormat = new Intl.NumberFormat(\"zh-CN\");\n\nconst demoStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    width: 100%;\n    min-width: 0;\n    color: ${token.color.text.primary};\n    font-family: ${token.typography.body.large[\"font-family\"]};\n    font-size: ${token.typography.body.large[\"font-size\"]};\n    font-weight: ${token.typography.body.large[\"font-weight\"]};\n    line-height: ${token.typography.body.large[\"line-height\"]};\n    @media (forced-colors: active) {\n        color: CanvasText;\n    }\n`;\n\nconst actionsStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space[\"component-gap\"]};\n`;\n\nconst captionStyle = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n    font-size: ${token.typography.body.medium[\"font-size\"]};\n    line-height: ${token.typography.body.medium[\"line-height\"]};\n    @media (forced-colors: active) {\n        color: CanvasText;\n    }\n`;\n\nconst viewportStyle = css`\n    height: calc(${token.size.field} * 6);\n    min-width: 0;\n    background: ${token.color.surface.content};\n    padding-block: ${token.space[\"component-gap\"]};\n    & [role=\"list\"]:focus-visible {\n        outline: calc(${token.space[\"inline-gap\"]} / 2) solid ${token.color.focus.ring};\n        outline-offset: calc(${token.space[\"inline-gap\"]} / -2);\n    }\n    @media (forced-colors: active) {\n        background: Canvas;\n        & [role=\"list\"]:focus-visible { outline-color: Highlight; }\n    }\n    @media (prefers-reduced-motion: reduce) {\n        & [role=\"list\"] { scroll-behavior: auto; }\n    }\n`;\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    box-sizing: border-box;\n    height: ${token.size.field};\n    padding-inline: ${token.space[\"section-gap\"]};\n    white-space: nowrap;\n    font-variant-numeric: tabular-nums;\n`;\n\nconst topSpaceStyle = css`\n    height: var(--crab-rc-virtual-top-padding-height, 0px);\n`;\n\nconst bottomSpaceStyle = css`\n    height: var(--crab-rc-virtual-bottom-padding-height, 0px);\n`;\n\nexport default function MillionDemo() {\n    const gridRef = useRef\u003cVirtualHandle>(null);\n    const listId = useId();\n    const helpId = useId();\n\n    const jumpTo = (rowIndex: number) => {\n        gridRef.current?.scrollToCell({ rowIndex: Math.max(0, Math.min(ROW_COUNT - 1, rowIndex)) });\n    };\n\n    return (\n        \u003cdiv className={demoStyle}>\n            \u003cdiv>1,000,000 条记录\u003c/div>\n            \u003cdiv className={actionsStyle} role=\"group\" aria-label=\"快速定位记录\">\n                \u003cButton appearance=\"outlined\" aria-controls={listId} onClick={() => jumpTo(0)}>第一条\u003c/Button>\n                \u003cButton appearance=\"outlined\" aria-controls={listId} onClick={() => jumpTo(499_999)}>第 500,000 条\u003c/Button>\n                \u003cButton appearance=\"outlined\" aria-controls={listId} onClick={() => jumpTo(ROW_COUNT - 1)}>最后一条\u003c/Button>\n            \u003c/div>\n            \u003cp id={helpId} className={captionStyle}>滚轮或拖动滚动条浏览；聚焦列表后可用方向键、Page Up / Down、Home / End。\u003c/p>\n            \u003cdiv className={viewportStyle}>\n                \u003cAutoSizer>\n                    {({ width, height }) => (\n                        \u003cVirtual\n                            gridRef={gridRef}\n                            id={listId}\n                            role=\"list\"\n                            aria-label=\"百万条示例记录\"\n                            aria-describedby={helpId}\n                            tabIndex={0}\n                            viewportWidth={width}\n                            viewportHeight={height}\n                            gridTemplateColumns={{ count: 1, itemSize: width }}\n                            gridTemplateRows={{ count: ROW_COUNT, itemSize: ROW_HEIGHT }}\n                            overscanRowCount={2}\n                            onKeyDown={event => {\n                                const firstRow = gridRef.current?.getScrollCellPosition().rowIndex ?? 0;\n                                const pageSize = Math.max(1, Math.ceil(height / ROW_HEIGHT));\n                                const targets: Record\u003cstring, number> = {\n                                    Home: 0,\n                                    End: ROW_COUNT - 1,\n                                    ArrowUp: firstRow - 1,\n                                    ArrowDown: firstRow + pageSize,\n                                    PageUp: firstRow - pageSize,\n                                    PageDown: firstRow + pageSize * 2 - 1,\n                                };\n                                const target = targets[event.key];\n                                if (target == null) return;\n                                event.preventDefault();\n                                jumpTo(target);\n                            }}\n                            renderRows={([start, end]) => (\n                                \u003c>\n                                    \u003cdiv className={topSpaceStyle} aria-hidden=\"true\" />\n                                    {Array.from({ length: end - start + 1 }, (_, offset) => {\n                                        const index = start + offset;\n                                        return (\n                                            \u003cdiv\n                                                key={index}\n                                                className={rowStyle}\n                                                role=\"listitem\"\n                                                aria-posinset={index + 1}\n                                                aria-setsize={ROW_COUNT}\n                                            >\n                                                记录 {numberFormat.format(index + 1)}\n                                            \u003c/div>\n                                        );\n                                    })}\n                                    \u003cdiv className={bottomSpaceStyle} aria-hidden=\"true\" />\n                                \u003c/>\n                            )}\n                        />\n                    )}\n                \u003c/AutoSizer>\n            \u003c/div>\n            \u003cp className={captionStyle}>仅挂载当前视口及上下各 2 条预渲染记录，不预先创建百万条对象或行高数组。\u003c/p>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-virtual/workbench/?__wake_demo=docs%2Fdemos%2Fmillion.demo.tsx",
        "workbenchPath": "/components/rc-virtual/workbench/#/components/docs%2Fdemos%2Fmillion.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/simple.demo.tsx",
        "title": "基础示例",
        "description": "虚拟滚动组件的基础使用示例",
        "learning": {
            "components": [
                "RcVirtual"
            ],
            "props": [
                "viewportHeight",
                "viewportWidth",
                "gridTemplateColumns",
                "gridTemplateRows",
                "renderRows"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础示例\",\n    description: \"虚拟滚动组件的基础使用示例\",\n};\nimport { type ReactNode } from \"react\"\nimport RcVirtual from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst mockRowData = () => {\n    const mockData = []\n    for (let i = 0; i \u003c 20000; i += 1) {\n        mockData.push({\n            a: `a-${i}`,\n            b: `b-${i}`,\n            c: `c-${i}`,\n            d: `d-${i}`,\n            e: `e-${i}`,\n            f: `f-${i}`,\n        })\n    }\n    return mockData;\n}\n\nconst cellStyle = css`\n\tdisplay: inline-block;\n\tbox-sizing: border-box;\n\tborder: 1px solid #000;\n`\n\n// 虚拟列表左侧占位：用于在可视区中预留被横向裁剪的区域\nconst paddingLeft = (\n    \u003cdiv\n        key=\"virtual-left-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\twidth: var(--crab-rc-virtual-left-padding-width, 0px);\n\t\t\theight: 100%;\n\t\t`}\n    />\n)\n\n// 虚拟列表右侧占位：用于在可视区中补齐右侧被裁剪宽度\nconst paddingRight = (\n    \u003cdiv\n        key=\"virtual-right-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\twidth: var(--crab-rc-virtual-right-padding-width, 0px);\n\t\t\theight: 100%;\n\t\t`}\n    />\n)\n\n// 虚拟列表底部占位：用于在纵向滚动时补齐不可见区域\nconst paddingBottom = (\n    \u003cdiv\n        key=\"virtual-bottom-padding\"\n        className={css`\n\t\t\tdisplay: inline-block;\n\t\t\tbox-sizing: border-box;\n\t\t\theight: var(--crab-rc-virtual-bottom-padding-height, 0px);\n\t\t\twidth: 100%;\n\t\t`}\n    />\n)\n\nconst mockData = mockRowData();\nconst gridTemplateColumns = [120, 120, 120, 120, 120, 120]\nconst ROW_HEIGHT = 24;\nconst totalWidth = gridTemplateColumns.reduce((a, b) => a + b, 0);\n\nconst SimpleDemo = () => {\n    return (\n        \u003cRcVirtual\n            viewportHeight={400}\n            viewportWidth={300}\n            gridTemplateColumns={gridTemplateColumns}\n            gridTemplateRows={{ count: mockData.length, itemSize: ROW_HEIGHT }}\n            renderRows={(rowRange, columnRange) => {\n                const rows: ReactNode[] = [\n                    \u003cdiv\n                        key=\"virtual-top-padding\"\n                        className={css`\n\t\t\t\t\t\t\tdisplay: inline-block;\n\t\t\t\t\t\t\tbox-sizing: border-box;\n\t\t\t\t\t\t\theight: var(--crab-rc-virtual-top-padding-height, 0px);\n\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t`}\n                    />\n                ];\n\n                for (let rowIndex = rowRange[0]; rowIndex \u003c= rowRange[1]; rowIndex += 1) {\n                    const node = mockData[rowIndex];\n                    const cells: ReactNode[] = [];\n                    for (let colIndex = columnRange[0]; colIndex \u003c= columnRange[1]; colIndex += 1) {\n                        const keys = Object.keys(node) as (keyof typeof node)[];\n                        cells.push(\n                            \u003cdiv\n                                key={`cell-${rowIndex}-${colIndex}`}\n                                className={cellStyle}\n                                style={{ width: gridTemplateColumns[colIndex] }}\n                            >\n                                {node[keys[colIndex]]}\n                            \u003c/div>\n                        );\n                    }\n\n                    rows.push(\n                        \u003cdiv\n                            key={`row-${rowIndex}`}\n                            className={css`\n\t\t\t\t\t\t\t\twhite-space: nowrap;\n\t\t\t\t\t\t\t`}\n                            style={{\n                                height: ROW_HEIGHT,\n                                width: totalWidth,\n                            }}\n                        >\n                            {paddingLeft}\n                            {cells}\n                            {paddingRight}\n                        \u003c/div>\n                    );\n                }\n\n                rows.push(paddingBottom);\n                return rows;\n            }}\n        />\n    )\n}\n\nexport default SimpleDemo;\n",
        "previewPath": "/components/rc-virtual/workbench/?__wake_demo=docs%2Fdemos%2Fsimple.demo.tsx",
        "workbenchPath": "/components/rc-virtual/workbench/#/components/docs%2Fdemos%2Fsimple.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
