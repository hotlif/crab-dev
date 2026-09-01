/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的数字徽标、圆点徽标与独立标记。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的数字徽标、圆点徽标与独立标记。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1.5rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cBadge count={5} />\n            \u003cBadge count={0} showZero />\n            \u003cBadge count={120} overflowCount={99} />\n            \u003cBadge dot />\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/color.demo.tsx",
        "title": "预设与自定义颜色",
        "description": "通过 `color` 指定预设语义色或任意 CSS 颜色字符串。",
        "sourceCode": "export const meta = {\n    title: \"预设与自定义颜色\",\n    description: \"通过 `color` 指定预设语义色或任意 CSS 颜色字符串。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst ColorDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cBadge count={1} color=\"default\" />\n            \u003cBadge count={2} color=\"success\" />\n            \u003cBadge count={4} color=\"warning\" />\n            \u003cBadge count={5} color=\"error\" />\n            \u003cBadge count={6} color=\"#ff6b00\" />\n            \u003cBadge count={7} color=\"oklch(0.7 0.18 280)\" />\n        \u003c/div>\n    );\n};\n\nexport default ColorDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fcolor.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fcolor.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸与偏移",
        "description": "`size` 提供 default / small 两档尺寸；`offset` 可微调角标的定位。",
        "sourceCode": "export const meta = {\n    title: \"尺寸与偏移\",\n    description: \"`size` 提供 default / small 两档尺寸；`offset` 可微调角标的定位。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst avatarStyle = css`\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    background-color: oklch(0.9 0 0);\n    color: oklch(0.3 0 0);\n    font-size: 14px;\n    font-weight: 500;\n`;\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1.5rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cBadge count={8} size=\"default\">\n                \u003cspan className={avatarStyle}>D\u003c/span>\n            \u003c/Badge>\n            \u003cBadge count={8} size=\"small\">\n                \u003cspan className={avatarStyle}>S\u003c/span>\n            \u003c/Badge>\n            \u003cBadge count={8} offset={[-6, 6]}>\n                \u003cspan className={avatarStyle}>O\u003c/span>\n            \u003c/Badge>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/status.demo.tsx",
        "title": "状态点",
        "description": "以 `status + text` 表达系统或实体的运行状态。`processing` 带脉冲动画。",
        "sourceCode": "export const meta = {\n    title: \"状态点\",\n    description: \"以 `status + text` 表达系统或实体的运行状态。`processing` 带脉冲动画。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst StatusDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 0.5rem;\n            `}\n        >\n            \u003cBadge status=\"default\" text=\"未启动\" />\n            \u003cBadge status=\"processing\" text=\"处理中\" />\n            \u003cBadge status=\"success\" text=\"运行中\" />\n            \u003cBadge status=\"warning\" text=\"告警\" />\n            \u003cBadge status=\"error\" text=\"故障\" />\n        \u003c/div>\n    );\n};\n\nexport default StatusDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fstatus.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fstatus.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/wrapped.demo.tsx",
        "title": "包裹子节点",
        "description": "将 Badge 包裹在按钮、头像等元素外部，角标会自动定位到右上角。",
        "sourceCode": "export const meta = {\n    title: \"包裹子节点\",\n    description: \"将 Badge 包裹在按钮、头像等元素外部，角标会自动定位到右上角。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst avatarStyle = css`\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    background-color: oklch(0.9 0 0);\n    color: oklch(0.3 0 0);\n    font-size: 14px;\n    font-weight: 500;\n`;\n\nconst WrappedDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1.5rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cBadge count={5}>\n                \u003cspan className={avatarStyle}>U\u003c/span>\n            \u003c/Badge>\n            \u003cBadge count={99}>\n                \u003cspan className={avatarStyle}>A\u003c/span>\n            \u003c/Badge>\n            \u003cBadge count={200} overflowCount={99}>\n                \u003cspan className={avatarStyle}>B\u003c/span>\n            \u003c/Badge>\n            \u003cBadge dot>\n                \u003cspan className={avatarStyle}>C\u003c/span>\n            \u003c/Badge>\n        \u003c/div>\n    );\n};\n\nexport default WrappedDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fwrapped.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fwrapped.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
