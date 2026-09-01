/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useMessage } from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: 8px;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cbutton onClick={() => message.success(\"操作成功\")}>\n                    Success\n                \u003c/button>\n                \u003cbutton onClick={() => message.error(\"操作失败\")}>\n                    Error\n                \u003c/button>\n                \u003cbutton onClick={() => message.warning(\"警告信息\")}>\n                    Warning\n                \u003c/button>\n                \u003cbutton onClick={() => message.info(\"提示信息\")}>\n                    Info\n                \u003c/button>\n                \u003cbutton onClick={() => message.loading(\"加载中...\")}>\n                    Loading\n                \u003c/button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/custom.demo.tsx",
        "title": "自定义图标与持续时间",
        "description": "通过 `icon` 自定义图标，通过 `duration` 设置持续时间，设为 0 则不自动关闭",
        "sourceCode": "export const meta = {\n    title: \"自定义图标与持续时间\",\n    description: \"通过 `icon` 自定义图标，通过 `duration` 设置持续时间，设为 0 则不自动关闭\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useMessage } from \"../../src/index.js\";\n\nconst CustomDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: 8px;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cbutton\n                    onClick={() =>\n                        message.open({\n                            type: \"success\",\n                            content: \"自定义图标消息\",\n                            icon: \u003cspan>🎉\u003c/span>,\n                        })\n                    }\n                >\n                    自定义图标\n                \u003c/button>\n                \u003cbutton\n                    onClick={() =>\n                        message.open({\n                            type: \"info\",\n                            content: \"10 秒后关闭\",\n                            duration: 10000,\n                        })\n                    }\n                >\n                    10 秒持续时间\n                \u003c/button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CustomDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fcustom.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fcustom.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/stack.demo.tsx",
        "title": "消息堆叠",
        "description": "当消息数量超过 3 条时，旧消息会自动折叠。最新的一条在最前面，后面的消息缩小并淡出",
        "sourceCode": "export const meta = {\n    title: \"消息堆叠\",\n    description: \"当消息数量超过 3 条时，旧消息会自动折叠。最新的一条在最前面，后面的消息缩小并淡出\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useMessage } from \"../../src/index.js\";\n\nlet count = 0;\n\nconst StackDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    const handleBatch = () => {\n        const types = ['success', 'info', 'warning', 'error', 'loading'] as const;\n        for (let i = 0; i \u003c 5; i++) {\n            count += 1;\n            const type = types[i % types.length];\n            message.open({\n                type,\n                content: `第 ${count} 条消息 — ${type}`,\n                duration: 5000,\n            });\n        }\n    };\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: 8px;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cbutton onClick={handleBatch}>\n                    一次发送 5 条消息\n                \u003c/button>\n                \u003cbutton onClick={() => { count += 1; message.info(`单条消息 #${count}`, 8000); }}>\n                    发送单条（8s）\n                \u003c/button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default StackDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fstack.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fstack.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
