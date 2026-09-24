/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "一个基础的消息通知组件",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的消息通知组件\",\n};\n\nimport { useId, useState } from \"react\";\nimport { type Direction, useNotification } from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\n\nlet i = 0;\n\nconst SizeDemo = () => {\n    const controlId = useId();\n    const [direction, setDirection] = useState\u003cDirection>(\"topRight\")\n    const [notification, contextHolder] = useNotification();\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n            `}\n        >\n            \u003clabel htmlFor={controlId}>\n                请选择方向\n            \u003c/label>\n            \u003cselect\n                id={controlId}\n                value={direction}\n                onChange={e => setDirection(e.target.value as Direction)}\n            >\n                \u003coption value=\"top\">Top\u003c/option>\n                \u003coption value=\"topLeft\">Top Left\u003c/option>\n                \u003coption value=\"topRight\">Top Right\u003c/option>\n                \u003coption value=\"bottom\">Bottom\u003c/option>\n                \u003coption value=\"bottomLeft\">Bottom Left\u003c/option>\n                \u003coption value=\"bottomRight\">Bottom Right\u003c/option>\n            \u003c/select>\n\n            \u003cbutton\n                onClick={() => {\n                    i += 1;\n                    notification.open({\n                        title: \"系统消息\",\n                        description: `这是一个发送的系统消息信息 ${i}`,\n                        direction: direction,\n                        duration: 3000\n                    })\n                }}\n            >\n                发送通知\n            \u003c/button>\n            {contextHolder}\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
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
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"自定义内容\",\n    description: \"一个自定义消息通知的示例\",\n};\n\nimport { useState } from \"react\";\nimport { useNotification } from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cstring>(\"\")\n    const [notification, contextHolder] = useNotification();\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n            `}\n        >\n            \u003cbutton\n                onClick={() => {\n                    notification.open({\n                        title: \"自定义内容\",\n                        description: (\n                            \u003ctextarea\n                                value={value}\n                                onChange={e => setValue(e.target.value)}\n                            />\n                        ),\n                        direction: \"bottomRight\",\n                        duration: 0\n                    })\n                }}\n            >\n                发送通知\n            \u003c/button>\n            {contextHolder}\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2FcustomContent.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2FcustomContent.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/stack.demo.tsx",
        "title": "多条通知层叠",
        "description": "连续发送通知，观察缩放、表面色和阴影的层级。点击前层的关闭按钮，后层会平滑接替；此示例需手动关闭。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "aria-pressed",
                "onClick",
                "appearance"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"多条通知层叠\",\n    description: \"连续发送通知，观察缩放、表面色和阴影的层级。点击前层的关闭按钮，后层会平滑接替；此示例需手动关闭。\",\n};\n\nimport { useRef, useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button from \"@crab-dev/rc-button\";\nimport { useNotification, type Direction } from \"../../src/index.js\";\n\nconst layout = css`\n    display: grid;\n    gap: ${token.space[\"section-gap\"]};\n`;\nconst row = css`\n    display: flex;\n    flex-wrap: wrap;\n    gap: ${token.space[\"component-gap\"]};\n`;\nconst directions: { value: Direction; label: string }[] = [\n    { value: \"topLeft\", label: \"左上方\" },\n    { value: \"top\", label: \"顶部居中\" },\n    { value: \"topRight\", label: \"右上方\" },\n    { value: \"bottomLeft\", label: \"左下方\" },\n    { value: \"bottom\", label: \"底部居中\" },\n    { value: \"bottomRight\", label: \"右下方\" },\n];\n\nexport default function StackDemo() {\n    const [direction, setDirection] = useState\u003cDirection>(\"topRight\");\n    const [notification, holder] = useNotification();\n    // Instance state: number notifications from event handlers without rendering.\n    const sequence = useRef(0);\n    const send = (count: number) => {\n        for (let index = 0; index \u003c count; index += 1) {\n            sequence.current += 1;\n            notification.open({\n                title: `任务完成 · ${sequence.current}`,\n                description: sequence.current % 2 === 0\n                    ? \"报表已生成，相关文件已经保存。关闭这条通知后，可以继续查看之前完成的任务。\"\n                    : \"项目数据已同步，可以继续处理下一项任务。\",\n                direction,\n                duration: 0,\n            });\n        }\n    };\n    return (\n        \u003cdiv className={layout}>\n            \u003cdiv className={row} role=\"group\" aria-label=\"通知显示位置\">\n                {directions.map(item => (\n                    \u003cButton key={item.value} aria-pressed={direction === item.value}\n                        onClick={() => setDirection(item.value)}>{item.label}\u003c/Button>\n                ))}\n            \u003c/div>\n            \u003cdiv className={row}>\n                \u003cButton appearance=\"primary\" onClick={() => send(3)}>连续发送 3 条\u003c/Button>\n                \u003cButton onClick={() => send(1)}>再添加 1 条\u003c/Button>\n            \u003c/div>\n            {holder}\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2Fstack.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2Fstack.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
