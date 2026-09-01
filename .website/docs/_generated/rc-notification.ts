/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "一个基础的消息通知组件",
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的消息通知组件\",\n};\n\nimport { useState } from \"react\";\nimport { type Direction, useNotification } from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\n\nlet i = 0;\n\nconst SizeDemo = () => {\n    const [direction, setDirection] = useState\u003cDirection>(\"topRight\")\n    const [notification, contextHolder] = useNotification();\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n            `}\n        >\n            \u003clabel>\n                请选择方向\n            \u003c/label>\n            \u003cselect\n                value={direction}\n                onChange={e => setDirection(e.target.value as Direction)}\n            >\n                \u003coption value=\"top\">Top\u003c/option>\n                \u003coption value=\"topLeft\">Top Left\u003c/option>\n                \u003coption value=\"topRight\">Top Right\u003c/option>\n                \u003coption value=\"bottom\">Bottom\u003c/option>\n                \u003coption value=\"bottomLeft\">Bottom Left\u003c/option>\n                \u003coption value=\"bottomRight\">Bottom Right\u003c/option>\n            \u003c/select>\n\n            \u003cbutton\n                onClick={() => {\n                    i += 1;\n                    notification.open({\n                        title: \"系统消息\",\n                        description: `这是一个发送的系统消息信息 ${i}`,\n                        direction: direction,\n                        duration: 3000\n                    })\n                }}\n            >\n                发送通知\n            \u003c/button>\n            {contextHolder}\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/customContent.demo.tsx",
        "title": "自定义内容",
        "description": "一个自定义消息通知的示例",
        "sourceCode": "\nexport const meta = {\n    title: \"自定义内容\",\n    description: \"一个自定义消息通知的示例\",\n};\n\nimport { useState } from \"react\";\nimport { useNotification } from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cstring>(\"\")\n    const [notification, contextHolder] = useNotification();\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n            `}\n        >\n            \u003cbutton\n                onClick={() => {\n                    notification.open({\n                        title: \"自定义内容\",\n                        description: (\n                            \u003ctextarea\n                                value={value}\n                                onChange={e => setValue(e.target.value)}\n                            />\n                        ),\n                        direction: \"bottomRight\",\n                        duration: 0\n                    })\n                }}\n            >\n                发送通知\n            \u003c/button>\n            {contextHolder}\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2FcustomContent.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2FcustomContent.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Notification",
    "symbol": "NotificationProps",
    "props": [
        {
            "name": "children",
            "required": false,
            "description": "消息通知的内容",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onOpenChange",
            "required": true,
            "description": "状态发生改变的时候触发的事件",
            "typeText": "(open: boolean) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "showProgress",
            "required": false,
            "description": "是否显示进度条",
            "typeText": "boolean /** * 消息通知的持续时间，单位为毫秒 */ duration?: number /** * 剩余时间，单位为毫秒 */ remaining?: number /** * 是否暂停进度动画 */ paused?: boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "title",
            "required": false,
            "description": "消息的标题信息",
            "typeText": "ReactNode /** * 消息通知显示的位置 */ direction?: Direction /** * 是否开启 */ open: boolean",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
