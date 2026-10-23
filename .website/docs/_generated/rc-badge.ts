/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的数字徽标、圆点徽标与独立标记。",
        "learning": {
            "components": [
                "Badge"
            ],
            "props": [
                "count",
                "showZero",
                "overflowCount",
                "dot"
            ],
            "events": [],
            "hasState": false
        },
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
        "learning": {
            "components": [
                "Badge"
            ],
            "props": [
                "count",
                "color"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"预设与自定义颜色\",\n    description: \"通过 `color` 指定预设语义色或任意 CSS 颜色字符串。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Badge from \"../../src/index.js\";\n\nconst ColorDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cBadge count={1} color=\"default\" />\n            \u003cBadge count={2} color=\"success\" />\n            \u003cBadge count={3} color=\"processing\" />\n            \u003cBadge count={4} color=\"warning\" />\n            \u003cBadge count={5} color=\"error\" />\n            \u003cBadge count={6} color=\"#ff6b00\" />\n            \u003cBadge count={7} color=\"oklch(0.7 0.18 280)\" />\n        \u003c/div>\n    );\n};\n\nexport default ColorDemo;\n",
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
        "learning": {
            "components": [
                "Badge",
                "Button"
            ],
            "props": [
                "count",
                "size",
                "aria-label",
                "onClick",
                "offset"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸与偏移\",\n    description: \"`size` 提供 default / small 两档尺寸；`offset` 可微调角标的定位。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport Badge from \"../../src/index.js\";\n\nconst stackStyle = css`display: grid; gap: ${token.space['section-gap']};`;\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    gap: ${token.space['section-gap']};\n    flex-wrap: wrap;\n    padding: ${token.space['component-gap']};\n`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\n\nconst SizeDemo = () => {\n    const [message, setMessage] = useState('点击按钮查看对应提醒。');\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={rowStyle}>\n                \u003cBadge count={8} size=\"default\">\n                    \u003cButton aria-label=\"默认尺寸，8 条提醒\" onClick={() => setMessage('默认尺寸：8 条提醒。')}>默认\u003c/Button>\n                \u003c/Badge>\n                \u003cBadge count={8} size=\"small\">\n                    \u003cButton aria-label=\"小号尺寸，8 条提醒\" onClick={() => setMessage('小号尺寸：8 条提醒。')}>小号\u003c/Button>\n                \u003c/Badge>\n                \u003cBadge count={8} offset={[-6, 6]}>\n                    \u003cButton aria-label=\"自定义偏移，8 条提醒\" onClick={() => setMessage('自定义偏移：8 条提醒。')}>偏移\u003c/Button>\n                \u003c/Badge>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\">{message}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
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
        "learning": {
            "components": [
                "Badge"
            ],
            "props": [
                "status",
                "text"
            ],
            "events": [],
            "hasState": false
        },
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
        "description": "将 Badge 包裹在按钮外部，展示计数、溢出计数与圆点提醒。",
        "learning": {
            "components": [
                "Badge",
                "Button"
            ],
            "props": [
                "count",
                "aria-label",
                "onClick",
                "overflowCount",
                "dot"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"包裹子节点\",\n    description: \"将 Badge 包裹在按钮外部，展示计数、溢出计数与圆点提醒。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport Badge from \"../../src/index.js\";\n\nconst stackStyle = css`display: grid; gap: ${token.space['section-gap']};`;\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    gap: ${token.space['section-gap']};\n    flex-wrap: wrap;\n    padding: ${token.space['component-gap']};\n`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\n\nconst WrappedDemo = () => {\n    const [message, setMessage] = useState('点击按钮查看提醒内容。');\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={rowStyle}>\n                \u003cBadge count={5}>\n                    \u003cButton aria-label=\"收件箱，5 条未读\" onClick={() => setMessage('收件箱有 5 条未读消息。')}>收件箱\u003c/Button>\n                \u003c/Badge>\n                \u003cBadge count={99}>\n                    \u003cButton aria-label=\"待办，99 项\" onClick={() => setMessage('共有 99 项待办。')}>待办\u003c/Button>\n                \u003c/Badge>\n                \u003cBadge count={200} overflowCount={99}>\n                    \u003cButton aria-label=\"归档，200 条记录\" onClick={() => setMessage('归档中有 200 条记录，角标显示 99+。')}>归档\u003c/Button>\n                \u003c/Badge>\n                \u003cBadge dot>\n                    \u003cButton aria-label=\"通知，有新提醒\" onClick={() => setMessage('你有新的系统提醒。')}>通知\u003c/Button>\n                \u003c/Badge>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\">{message}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default WrappedDemo;\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fwrapped.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fwrapped.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
