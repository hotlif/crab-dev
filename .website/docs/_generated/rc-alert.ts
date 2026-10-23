/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "四种类型的警告提示，通过 `type` 属性设置",
        "learning": {
            "components": [
                "Alert"
            ],
            "props": [
                "type"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"四种类型的警告提示，通过 `type` 属性设置\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Alert from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cAlert type=\"success\">Success — 操作成功完成\u003c/Alert>\n            \u003cAlert type=\"info\">Info — 这是一条信息提示\u003c/Alert>\n            \u003cAlert type=\"warning\">Warning — 请注意潜在的问题\u003c/Alert>\n            \u003cAlert type=\"error\">Error — 发生了错误，请检查\u003c/Alert>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/closable.demo.tsx",
        "title": "可关闭",
        "description": "设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除",
        "learning": {
            "components": [
                "Alert",
                "Button"
            ],
            "props": [
                "type",
                "closable",
                "onClose",
                "title",
                "closeIcon",
                "appearance",
                "onClick"
            ],
            "events": [
                "onClose",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可关闭\",\n    description: \"设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport Alert from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['section-gap']};\n`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\nconst resetStyle = css`align-self: flex-start;`;\n\nconst ClosableDemo = () => {\n    const [resetKey, setResetKey] = useState(0);\n    const [closedCount, setClosedCount] = useState(0);\n    const total = 4;\n\n    const handleClose = () => {\n        setClosedCount(count => count + 1);\n    };\n\n    const handleReset = () => {\n        setResetKey((k) => k + 1);\n        setClosedCount(0);\n    };\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv key={resetKey} className={stackStyle}>\n                \u003cAlert type=\"info\" closable onClose={handleClose}>\n                    这条提示可以被关闭\n                \u003c/Alert>\n                \u003cAlert type=\"warning\" title=\"警告\" closable onClose={handleClose}>\n                    这条带标题的警告可以被关闭\n                \u003c/Alert>\n                \u003cAlert\n                    type=\"error\"\n                    closable\n                    closeIcon={\u003cspan>×\u003c/span>}\n                    onClose={handleClose}\n                >\n                    自定义关闭图标\n                \u003c/Alert>\n                \u003cAlert type=\"success\" closable onClose={handleClose}>\n                    关闭后触发 onClose 回调\n                \u003c/Alert>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\">已关闭 {closedCount} / {total} 条提示。\u003c/p>\n            {closedCount > 0 && (\n                \u003cButton\n                    appearance=\"outlined\"\n                    onClick={handleReset}\n                    className={resetStyle}\n                >\n                    重新显示全部\n                \u003c/Button>\n            )}\n        \u003c/div>\n    );\n};\n\nexport default ClosableDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Fclosable.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Fclosable.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/title.demo.tsx",
        "title": "带标题",
        "description": "通过 `title` 属性设置标题，适合展示更多详情",
        "learning": {
            "components": [
                "Alert"
            ],
            "props": [
                "type",
                "title"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"带标题\",\n    description: \"通过 `title` 属性设置标题，适合展示更多详情\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Alert from \"../../src/index.js\";\n\nconst TitleDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cAlert type=\"success\" title=\"操作成功\">\n                你的修改已经保存，可以继续编辑其他内容。\n            \u003c/Alert>\n            \u003cAlert type=\"info\" title=\"提示信息\">\n                本功能目前处于测试阶段，可能会有变更。\n            \u003c/Alert>\n            \u003cAlert type=\"warning\" title=\"注意\">\n                你的存储空间即将用尽，请及时清理。\n            \u003c/Alert>\n            \u003cAlert type=\"error\" title=\"提交失败\">\n                网络连接异常，请检查你的网络设置后重试。\n            \u003c/Alert>\n        \u003c/div>\n    );\n};\n\nexport default TitleDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Ftitle.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Ftitle.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
