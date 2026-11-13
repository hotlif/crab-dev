/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系文字提示矩阵",
        "description": "鼠标、键盘、箭头扩展与长文本在真实浮层中验收。",
        "learning": {
            "components": [
                "Tooltip",
                "Button"
            ],
            "props": [
                "title",
                "arrow",
                "mouseEnterDelay",
                "mouseLeaveDelay",
                "appearance"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Tooltip from \"@crab-dev/rc-tooltip\";\nimport Button from \"@crab-dev/rc-button\";\n\nexport const meta = { title: \"三体系文字提示矩阵\", description: \"鼠标、键盘、箭头扩展与长文本在真实浮层中验收。\" };\nconst layout = css`padding: calc(${token.space['section-gap']} * 3); min-height: 20rem; display: grid; justify-items: start; gap: ${token.space['section-gap']}; align-content: start; box-sizing: border-box;`;\nexport default function VisualMatrixDemo() {\n    const [state, setState] = useState(\"default\");\n    return \u003csection aria-label=\"Tooltip visual matrix\" className={layout}>\n        \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => setState(event.target.value)}>\u003coption>default\u003c/option>\u003coption>arrow\u003c/option>\u003coption>long-text\u003c/option>\u003c/select>\u003c/label>\n        \u003cTooltip title={state === \"long-text\" ? \"保存当前工作区 Save current workspace — LongWorkspaceIdentifier_0123456789_ABCDEFGHIJKLMN。提示补充说明，不承载必要操作。\" : \"保存当前工作区 Save workspace\"} arrow={state === \"arrow\"} mouseEnterDelay={100} mouseLeaveDelay={150}>\n            \u003cButton appearance=\"outlined\">提示触发器\u003c/Button>\n        \u003c/Tooltip>\n        \u003cButton appearance=\"text\">后续操作\u003c/Button>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-tooltip/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-tooltip/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "规格验收"
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
        "group": "基础与位置"
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
        "group": "基础与位置"
    },
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
        "group": "基础与位置"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以简短浮动说明补充控件含义，帮助理解图标或被省略的文字。",
        "usage": "提示不能承载必须操作的内容，也不能替代控件本身的可访问名称。",
        "exampleDescription": "通过悬停和键盘聚焦打开说明，检查提示与触发控件的关联。",
        "demos": [
            "basic.demo.tsx",
            "arrow.demo.tsx",
            "placement.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/tooltips/overview",
            "https://material-web.dev/components/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "为桌面工具提供轻量悬浮说明，让紧凑图标动作仍容易理解。",
        "usage": "提示应简短并贴近触发对象，关闭后不能改变正在操作的焦点位置。",
        "exampleDescription": "查看不同位置的工具提示，检查桌面工具周围的空间与可读性。",
        "demos": [
            "placement.demo.tsx",
            "arrow.demo.tsx",
            "basic.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用简洁浮层补充控件说明，清晰边界与文字优先于装饰。",
        "usage": "较长帮助内容应放进页面或可操作面板，提示只补充当前控件的含义。",
        "exampleDescription": "对比提示箭头与触发器的关系，再检查键盘聚焦时的说明。",
        "demos": [
            "arrow.demo.tsx",
            "basic.demo.tsx",
            "placement.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Tooltip 在悬停或键盘聚焦时提供一小段补充说明，常用于只有图标的控件或被截断的术语。它不能承载完成任务所必需的信息或交互控件。",
    "useWhen": [
        "图标按钮需要解释动作名称。",
        "简短术语或截断内容需要非阻塞补充。"
    ],
    "avoidWhen": [
        "错误、帮助步骤和长说明应直接显示；包含按钮或表单的内容使用 Popover/Dialog 类组件。"
    ],
    "essentials": [
        "title 简短直接，用户不看 Tooltip 也能完成主要任务。",
        "placement 是偏好，碰撞时允许浮层自动调整。",
        "arrow 只加强锚点关系，不应遮住触发器或内容。"
    ],
    "accessibility": [
        "键盘聚焦与指针悬停都能打开，Escape 可关闭，移出后有合理延迟。",
        "触发器通过 aria-describedby 关联说明；Tooltip 本身不接收焦点。"
    ]
} as const;
