/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/arrow.demo.tsx",
        "title": "箭头",
        "description": "通过 arrow 属性控制是否显示箭头。",
        "sourceCode": "export const meta = {\n    title: \"箭头\",\n    description: \"通过 arrow 属性控制是否显示箭头。\",\n};\n\nimport Tooltip from \"../../src/index.js\";\n\nconst ArrowDemo = () => {\n    return (\n        \u003cdiv style={{ display: 'flex', gap: '16px', padding: '40px' }}>\n            \u003cTooltip title=\"带箭头\">\n                \u003cbutton>默认（带箭头）\u003c/button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"无箭头\" arrow={false}>\n                \u003cbutton>无箭头\u003c/button>\n            \u003c/Tooltip>\n        \u003c/div>\n    );\n};\n\nexport default ArrowDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Farrow.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Farrow.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的用法，鼠标悬浮时展示提示文字。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的用法，鼠标悬浮时展示提示文字。\",\n};\n\nimport Tooltip from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv style={{ display: 'flex', gap: '16px', padding: '40px' }}>\n            \u003cTooltip title=\"提示文字\">\n                \u003cbutton>鼠标悬浮\u003c/button>\n            \u003c/Tooltip>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/placement.demo.tsx",
        "title": "位置",
        "description": "支持 12 个方向的弹出位置。",
        "sourceCode": "export const meta = {\n    title: \"位置\",\n    description: \"支持 12 个方向的弹出位置。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Tooltip from \"../../src/index.js\";\n\nconst gridStyle = css`\n    display: grid;\n    grid-template-columns: repeat(5, 80px);\n    grid-template-rows: repeat(5, 40px);\n    gap: 4px;\n    justify-content: center;\n    padding: 40px;\n`;\n\nconst btnStyle = css`\n    cursor: pointer;\n    font-size: 12px;\n`;\n\nconst PlacementDemo = () => {\n    return (\n        \u003cdiv className={gridStyle}>\n            {/* 第 1 行 */}\n            \u003cspan />\n            \u003cTooltip title=\"top-start\" placement=\"top-start\">\n                \u003cbutton className={btnStyle}>TL\u003c/button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"top\" placement=\"top\">\n                \u003cbutton className={btnStyle}>Top\u003c/button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"top-end\" placement=\"top-end\">\n                \u003cbutton className={btnStyle}>TR\u003c/button>\n            \u003c/Tooltip>\n            \u003cspan />\n\n            {/* 第 2 行 */}\n            \u003cTooltip title=\"left-start\" placement=\"left-start\">\n                \u003cbutton className={btnStyle}>LT\u003c/button>\n            \u003c/Tooltip>\n            \u003cspan />\n            \u003cspan />\n            \u003cspan />\n            \u003cTooltip title=\"right-start\" placement=\"right-start\">\n                \u003cbutton className={btnStyle}>RT\u003c/button>\n            \u003c/Tooltip>\n\n            {/* 第 3 行 */}\n            \u003cTooltip title=\"left\" placement=\"left\">\n                \u003cbutton className={btnStyle}>Left\u003c/button>\n            \u003c/Tooltip>\n            \u003cspan />\n            \u003cspan />\n            \u003cspan />\n            \u003cTooltip title=\"right\" placement=\"right\">\n                \u003cbutton className={btnStyle}>Right\u003c/button>\n            \u003c/Tooltip>\n\n            {/* 第 4 行 */}\n            \u003cTooltip title=\"left-end\" placement=\"left-end\">\n                \u003cbutton className={btnStyle}>LB\u003c/button>\n            \u003c/Tooltip>\n            \u003cspan />\n            \u003cspan />\n            \u003cspan />\n            \u003cTooltip title=\"right-end\" placement=\"right-end\">\n                \u003cbutton className={btnStyle}>RB\u003c/button>\n            \u003c/Tooltip>\n\n            {/* 第 5 行 */}\n            \u003cspan />\n            \u003cTooltip title=\"bottom-start\" placement=\"bottom-start\">\n                \u003cbutton className={btnStyle}>BL\u003c/button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"bottom\" placement=\"bottom\">\n                \u003cbutton className={btnStyle}>Bottom\u003c/button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"bottom-end\" placement=\"bottom-end\">\n                \u003cbutton className={btnStyle}>BR\u003c/button>\n            \u003c/Tooltip>\n            \u003cspan />\n        \u003c/div>\n    );\n};\n\nexport default PlacementDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Fplacement.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Fplacement.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
