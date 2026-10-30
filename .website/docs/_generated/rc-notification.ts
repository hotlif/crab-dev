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
            "components": [
                "Select",
                "Button"
            ],
            "props": [
                "label",
                "value",
                "options",
                "onValueChange",
                "onClick"
            ],
            "events": [
                "onValueChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的消息通知组件\",\n};\n\nimport { useState } from \"react\";\nimport { type Direction, useNotification } from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport Select from \"@crab-dev/rc-select\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nconst directionOptions: Array\u003c{ label: string; value: Direction }> = [\n    { label: \"Top\", value: \"top\" },\n    { label: \"Top Left\", value: \"topLeft\" },\n    { label: \"Top Right\", value: \"topRight\" },\n    { label: \"Bottom\", value: \"bottom\" },\n    { label: \"Bottom Left\", value: \"bottomLeft\" },\n    { label: \"Bottom Right\", value: \"bottomRight\" },\n];\n\nconst layoutStyle = css`\n    display: grid;\n    gap: ${token.space[\"section-gap\"]};\n    width: 100%;\n    max-width: calc(${token.size[64]} * 5);\n    margin-bottom: ${token.space[\"section-gap\"]};\n`;\n\nlet i = 0;\n\nconst SizeDemo = () => {\n    const [direction, setDirection] = useState\u003cDirection>(\"topRight\")\n    const [notification, contextHolder] = useNotification();\n    return (\n        \u003cdiv className={layoutStyle}>\n            \u003cSelect\n                label=\"请选择方向\"\n                value={direction}\n                options={directionOptions}\n                onValueChange={value => {\n                    const option = directionOptions.find(item => item.value === value);\n                    if (option) setDirection(option.value);\n                }}\n            />\n\n            \u003cButton\n                onClick={() => {\n                    i += 1;\n                    notification.open({\n                        title: \"系统消息\",\n                        description: `这是一个发送的系统消息信息 ${i}`,\n                        direction: direction,\n                        duration: 3000\n                    })\n                }}\n            >\n                发送通知\n            \u003c/Button>\n            {contextHolder}\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/customContent.demo.tsx",
        "title": "自定义内容",
        "description": "在通知中编辑备注，每条通知独立维护输入内容；此示例需手动关闭。",
        "learning": {
            "components": [
                "TextEdit",
                "Button"
            ],
            "props": [
                "label",
                "supportingText",
                "rows",
                "value",
                "onValueChange",
                "onClick"
            ],
            "events": [
                "onValueChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"自定义内容\",\n    description: \"在通知中编辑备注，每条通知独立维护输入内容；此示例需手动关闭。\",\n};\n\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport TextEdit from \"@crab-dev/rc-text-edit\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useNotification } from \"../../src/index.js\";\n\nconst layoutStyle = css`\n    margin-bottom: ${token.space[\"section-gap\"]};\n`;\n\nconst contentStyle = css`\n    padding-block-start: ${token.space[\"component-gap\"]};\n`;\n\nconst NotificationContent = () => {\n    const [value, setValue] = useState(\"\");\n\n    return (\n        \u003cdiv className={contentStyle}>\n            \u003cTextEdit\n                label=\"通知备注\"\n                supportingText=\"备注仅保留在当前通知中，关闭后清除。\"\n                rows={3}\n                value={value}\n                onValueChange={setValue}\n            />\n        \u003c/div>\n    );\n};\n\nconst CustomContentDemo = () => {\n    const [notification, contextHolder] = useNotification();\n\n    return (\n        \u003cdiv className={layoutStyle}>\n            \u003cButton\n                onClick={() => {\n                    notification.open({\n                        title: \"自定义内容\",\n                        description: \u003cNotificationContent />,\n                        direction: \"bottomRight\",\n                        duration: 0,\n                    });\n                }}\n            >\n                发送通知\n            \u003c/Button>\n            {contextHolder}\n        \u003c/div>\n    );\n};\n\nexport default CustomContentDemo;\n",
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
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系展示与状态矩阵",
        "description": "公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。",
        "learning": {
            "components": [
                "Button",
                "ConfigProvider",
                "Notification"
            ],
            "props": [
                "onClick",
                "size",
                "density",
                "data-visual-target",
                "open",
                "onOpenChange",
                "title",
                "duration",
                "showProgress",
                "direction"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Notification from '@crab-dev/rc-notification';\nimport { useNotification, type NotificationHandle } from '@crab-dev/rc-notification';\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('medium');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [visible, setVisible] = useState(true);\n    const [draft, setDraft] = useState('保留这份草稿');\n    const [notification, contextHolder] = useNotification();\n    const [handle, setHandle] = useState\u003cNotificationHandle | null>(null);\n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>medium\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>standard\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); setVisible(true); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"hover\">hover\u003c/option>\u003coption value=\"focus-visible\">focus-visible\u003c/option>\u003coption value=\"pressed\">pressed\u003c/option>\u003coption value=\"updated\">updated\u003c/option>\u003coption value=\"closed\">closed\u003c/option>\u003coption value=\"top\">top\u003c/option>\u003coption value=\"topLeft\">topLeft\u003c/option>\u003coption value=\"bottom\">bottom\u003c/option>\u003coption value=\"bottomLeft\">bottomLeft\u003c/option>\u003coption value=\"bottomRight\">bottomRight\u003c/option>\u003c/select>\u003c/label>\n            \u003cButton onClick={() => setVisible(false)}>关闭展示\u003c/Button>\n            \u003cButton onClick={() => setHandle(notification.open({title: copy('浮层通知', 'Portal notification'), description: copy('持久展示，明确关闭。', 'Persistent until explicitly closed.'), duration: 0}))}>打开浮层\u003c/Button>\u003cButton onClick={() => handle?.update({description: copy('浮层已更新', 'Portal updated')})}>更新浮层\u003c/Button>\u003cButton onClick={() => handle?.close()}>关闭浮层\u003c/Button>{contextHolder}\n        \u003c/div>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Notification visual matrix\" data-visual-frame>\n                \u003cdiv className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>\n                    \u003cNotification data-visual-target open={visible} onOpenChange={setVisible} title={copy('工作区同步完成', 'Workspace synchronized')} duration={0} showProgress={false} direction={['top','topLeft','bottom','bottomLeft','bottomRight'].includes(state) ? state as 'top' | 'topLeft' | 'bottom' | 'bottomLeft' | 'bottomRight' : 'topRight'}>{state === 'updated' ? copy('记录已更新，草稿仍然保留。', 'Record updated; the draft is retained.') : copy('所有更改均已保存。可以继续处理下一组记录。', 'All changes are saved. Continue with the next group of records.')}\u003c/Notification>\n                    \n                \u003c/div>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-notification/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-notification/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
