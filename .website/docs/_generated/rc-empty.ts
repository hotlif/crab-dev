/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最基础的空状态，使用 `preset` 选择预置场景",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最基础的空状态，使用 `preset` 选择预置场景\",\n};\n\nimport Empty from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return \u003cEmpty />;\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/custom.demo.tsx",
        "title": "自定义内容",
        "description": "通过 `image`、`title`、`description` 完全自定义内容。传入 `null` 可隐藏对应区域。",
        "sourceCode": "\nexport const meta = {\n    title: \"自定义内容\",\n    description: \"通过 `image`、`title`、`description` 完全自定义内容。传入 `null` 可隐藏对应区域。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst wrapStyle = css`\n    display: flex;\n    gap: 2rem;\n    flex-wrap: wrap;\n    align-items: flex-start;\n`;\n\nconst cardStyle = css`\n    flex: 1;\n    min-width: 200px;\n    border: 1px solid oklch(0.92 0.003 286);\n    border-radius: 8px;\n    overflow: hidden;\n`;\n\nconst emojiStyle = css`\n    font-size: 56px;\n    line-height: 1;\n    user-select: none;\n`;\n\nconst CustomDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            {/* 自定义图像 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    image={\u003cspan className={emojiStyle}>📭\u003c/span>}\n                    title=\"收件箱是空的\"\n                    description=\"新邮件会在这里显示\"\n                />\n            \u003c/div>\n\n            {/* 隐藏描述 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    preset=\"search\"\n                    title=\"没有找到「React」\"\n                    description={null}\n                />\n            \u003c/div>\n\n            {/* 仅图示，无文字 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    title={null}\n                    description={null}\n                />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CustomDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fcustom.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fcustom.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/preset.demo.tsx",
        "title": "预置场景",
        "description": "三种内置场景：`default`（无数据）、`search`（搜索无结果）、`no-permission`（无权限）。每种预置均内置图示与文案，基于设计心理学为不同情绪场景匹配合适的视觉传达。",
        "sourceCode": "\nexport const meta = {\n    title: \"预置场景\",\n    description: \"三种内置场景：`default`（无数据）、`search`（搜索无结果）、`no-permission`（无权限）。每种预置均内置图示与文案，基于设计心理学为不同情绪场景匹配合适的视觉传达。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst wrapStyle = css`\n    display: flex;\n    gap: 2rem;\n    flex-wrap: wrap;\n    align-items: flex-start;\n`;\n\nconst cardStyle = css`\n    flex: 1;\n    min-width: 220px;\n    border: 1px solid oklch(0.92 0.003 286);\n    border-radius: 8px;\n    overflow: hidden;\n`;\n\nconst PresetDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"default\" />\n            \u003c/div>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"search\" />\n            \u003c/div>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"no-permission\" />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default PresetDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fpreset.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fpreset.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/with-action.demo.tsx",
        "title": "带操作区域",
        "description": "通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。",
        "sourceCode": "\nexport const meta = {\n    title: \"带操作区域\",\n    description: \"通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst buttonStyle = css`\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    padding: 0 16px;\n    height: 32px;\n    border-radius: 6px;\n    border: 1px solid oklch(0.87 0.005 286);\n    background-color: oklch(0.220 0.005 286);\n    color: oklch(0.980 0.002 286);\n    font-size: 14px;\n    cursor: pointer;\n    &:hover {\n        background-color: oklch(0.320 0.008 286);\n    }\n`;\n\nconst WithActionDemo = () => {\n    return (\n        \u003cEmpty\n            preset=\"default\"\n            action={\n                \u003cbutton type=\"button\" className={buttonStyle}>\n                    立即创建\n                \u003c/button>\n            }\n        />\n    );\n};\n\nexport default WithActionDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fwith-action.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fwith-action.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
