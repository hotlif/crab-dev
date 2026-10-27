/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/arrow.demo.tsx",
        "title": "箭头",
        "description": "默认无箭头；设置 arrow={true} 可启用项目扩展的箭头样式。",
        "learning": {
            "components": [
                "Tooltip",
                "Button"
            ],
            "props": [
                "title",
                "arrow"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"箭头\",\n    description: \"默认无箭头；设置 arrow={true} 可启用项目扩展的箭头样式。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Tooltip from \"../../src/index.js\";\n\nconst layoutStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space[\"component-gap\"]};\n    padding: ${token.space[\"group-gap\"]} ${token.space[\"component-gap\"]};\n`;\n\nconst ArrowDemo = () => {\n    return (\n        \u003cdiv className={layoutStyle}>\n            \u003cTooltip title=\"带箭头\" arrow={true}>\n                \u003cButton>带箭头\u003c/Button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"无箭头\" arrow={false}>\n                \u003cButton>无箭头（默认）\u003c/Button>\n            \u003c/Tooltip>\n        \u003c/div>\n    );\n};\n\nexport default ArrowDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Farrow.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Farrow.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "鼠标悬停或键盘聚焦按钮时展示提示文字，按 Escape 关闭。",
        "learning": {
            "components": [
                "Tooltip",
                "Button"
            ],
            "props": [
                "title"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"鼠标悬停或键盘聚焦按钮时展示提示文字，按 Escape 关闭。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Tooltip from \"../../src/index.js\";\n\nconst layoutStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space[\"component-gap\"]};\n    padding: ${token.space[\"group-gap\"]} ${token.space[\"component-gap\"]};\n`;\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv className={layoutStyle}>\n            \u003cTooltip title=\"提示文字\">\n                \u003cButton>悬停或聚焦\u003c/Button>\n            \u003c/Tooltip>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/placement.demo.tsx",
        "title": "位置",
        "description": "宽屏留出展示空间以观察 12 个首选方位；窄屏中按钮随容器收缩，提示会根据可用空间自动翻转。",
        "learning": {
            "components": [
                "Tooltip",
                "Button"
            ],
            "props": [
                "title",
                "placement",
                "size",
                "shouldFitContainer"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"位置\",\n    description: \"宽屏留出展示空间以观察 12 个首选方位；窄屏中按钮随容器收缩，提示会根据可用空间自动翻转。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Tooltip from \"../../src/index.js\";\n\nconst gridStyle = css`\n    display: grid;\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n    gap: ${token.space[\"component-gap\"]};\n    box-sizing: border-box;\n    width: 100%;\n    max-width: calc(${token.size[64]} * 6);\n    margin-inline: auto;\n    padding: ${token.space[\"section-gap\"]};\n    padding-block: calc(${token.space[\"section-gap\"]} * 3);\n`;\n\nconst PlacementDemo = () => {\n    return (\n        \u003cdiv className={gridStyle}>\n            {/* 第 1 行 */}\n            \u003cTooltip title=\"top-start\" placement=\"top-start\">\n                \u003cButton size=\"s\" shouldFitContainer>上左\u003c/Button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"top\" placement=\"top\">\n                \u003cButton size=\"s\" shouldFitContainer>上方\u003c/Button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"top-end\" placement=\"top-end\">\n                \u003cButton size=\"s\" shouldFitContainer>上右\u003c/Button>\n            \u003c/Tooltip>\n\n            {/* 第 2 行 */}\n            \u003cTooltip title=\"left-start\" placement=\"left-start\">\n                \u003cButton size=\"s\" shouldFitContainer>左上\u003c/Button>\n            \u003c/Tooltip>\n            \u003cspan aria-hidden=\"true\" />\n            \u003cTooltip title=\"right-start\" placement=\"right-start\">\n                \u003cButton size=\"s\" shouldFitContainer>右上\u003c/Button>\n            \u003c/Tooltip>\n\n            {/* 第 3 行 */}\n            \u003cTooltip title=\"left\" placement=\"left\">\n                \u003cButton size=\"s\" shouldFitContainer>左侧\u003c/Button>\n            \u003c/Tooltip>\n            \u003cspan aria-hidden=\"true\" />\n            \u003cTooltip title=\"right\" placement=\"right\">\n                \u003cButton size=\"s\" shouldFitContainer>右侧\u003c/Button>\n            \u003c/Tooltip>\n\n            {/* 第 4 行 */}\n            \u003cTooltip title=\"left-end\" placement=\"left-end\">\n                \u003cButton size=\"s\" shouldFitContainer>左下\u003c/Button>\n            \u003c/Tooltip>\n            \u003cspan aria-hidden=\"true\" />\n            \u003cTooltip title=\"right-end\" placement=\"right-end\">\n                \u003cButton size=\"s\" shouldFitContainer>右下\u003c/Button>\n            \u003c/Tooltip>\n\n            {/* 第 5 行 */}\n            \u003cTooltip title=\"bottom-start\" placement=\"bottom-start\">\n                \u003cButton size=\"s\" shouldFitContainer>下左\u003c/Button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"bottom\" placement=\"bottom\">\n                \u003cButton size=\"s\" shouldFitContainer>下方\u003c/Button>\n            \u003c/Tooltip>\n            \u003cTooltip title=\"bottom-end\" placement=\"bottom-end\">\n                \u003cButton size=\"s\" shouldFitContainer>下右\u003c/Button>\n            \u003c/Tooltip>\n        \u003c/div>\n    );\n};\n\nexport default PlacementDemo;\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Fplacement.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Fplacement.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
