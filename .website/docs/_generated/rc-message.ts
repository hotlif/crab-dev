/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 `useMessage` Hook 创建消息实例，支持五种类型的消息提示\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useMessage } from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: ${token.space[\"component-gap\"]};\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cButton onClick={() => { message.success(\"操作成功\"); }}>\n                    Success\n                \u003c/Button>\n                \u003cButton onClick={() => { message.error(\"操作失败\"); }}>\n                    Error\n                \u003c/Button>\n                \u003cButton onClick={() => { message.warning(\"警告信息\"); }}>\n                    Warning\n                \u003c/Button>\n                \u003cButton onClick={() => { message.info(\"提示信息\"); }}>\n                    Info\n                \u003c/Button>\n                \u003cButton onClick={() => { message.loading(\"加载中...\"); }}>\n                    Loading\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"自定义图标与持续时间\",\n    description: \"通过 `icon` 自定义图标，通过 `duration` 设置持续时间，设为 0 则不自动关闭\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useMessage } from \"../../src/index.js\";\n\nconst CustomDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: ${token.space[\"component-gap\"]};\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cButton\n                    onClick={() => {\n                        message.open({\n                            type: \"success\",\n                            content: \"自定义图标消息\",\n                            icon: \u003cspan>🎉\u003c/span>,\n                        });\n                    }}\n                >\n                    自定义图标\n                \u003c/Button>\n                \u003cButton\n                    onClick={() => {\n                        message.open({\n                            type: \"info\",\n                            content: \"10 秒后关闭\",\n                            duration: 10000,\n                        });\n                    }}\n                >\n                    10 秒持续时间\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CustomDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fcustom.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fcustom.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/long-content.demo.tsx",
        "title": "长连续文本",
        "description": "长链接与标识符在窄屏中换行，保留完整信息。",
        "learning": {
            "components": [
                "Message"
            ],
            "props": [
                "content",
                "duration",
                "showProgress"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"长连续文本\",\n    description: \"长链接与标识符在窄屏中换行，保留完整信息。\",\n};\n\nimport Message from \"../../src/message.js\";\n\nconst LongContentDemo = () => (\n    \u003cMessage\n        content=\"文件已保存：https://example.com/projects/material-design-component-library/documents/2026-10-22/release-notes-with-a-long-continuous-identifier-0123456789abcdef\"\n        duration={0}\n        showProgress={false}\n    />\n);\n\nexport default LongContentDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Flong-content.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Flong-content.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/stack.demo.tsx",
        "title": "消息堆叠",
        "description": "当消息数量超过 3 条时，旧消息会自动折叠。最新的一条在最前面，后面的消息缩小并淡出",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"消息堆叠\",\n    description: \"当消息数量超过 3 条时，旧消息会自动折叠。最新的一条在最前面，后面的消息缩小并淡出\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useMessage } from \"../../src/index.js\";\n\nlet count = 0;\n\nconst StackDemo = () => {\n    const [message, contextHolder] = useMessage();\n\n    const handleBatch = () => {\n        const types = ['success', 'info', 'warning', 'error', 'loading'] as const;\n        for (let i = 0; i \u003c 5; i++) {\n            count += 1;\n            const type = types[i % types.length];\n            message.open({\n                type,\n                content: `第 ${count} 条消息 — ${type}`,\n                duration: 5000,\n            });\n        }\n    };\n\n    return (\n        \u003cdiv>\n            {contextHolder}\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: ${token.space[\"component-gap\"]};\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cButton onClick={handleBatch}>\n                    一次发送 5 条消息\n                \u003c/Button>\n                \u003cButton onClick={() => { count += 1; message.info(`单条消息 #${count}`, 8000); }}>\n                    发送单条（8s）\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default StackDemo;\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fstack.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fstack.demo.tsx",
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
                "Message"
            ],
            "props": [
                "onClick",
                "size",
                "density",
                "data-visual-target",
                "open",
                "type",
                "duration",
                "content"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Message from '@crab-dev/rc-message';\nimport { useMessage, type MessageHandle } from '@crab-dev/rc-message';\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('medium');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [visible, setVisible] = useState(true);\n    const [draft, setDraft] = useState('保留这份草稿');\n    const longText = copy('这是一段需要在窄屏中自然换行的工作区说明，包含很长的标识符 abcdefghijklmnopqrstuvwxyz0123456789，不能导致页面横向滚动。', 'A long workspace explanation with an unbroken identifier abcdefghijklmnopqrstuvwxyz0123456789 must wrap within the available width.');\n    const [message, contextHolder] = useMessage();\n    const [handle, setHandle] = useState\u003cMessageHandle | null>(null);\n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>medium\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>standard\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); setVisible(true); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"success\">success\u003c/option>\u003coption value=\"warning\">warning\u003c/option>\u003coption value=\"error\">error\u003c/option>\u003coption value=\"long-content\">long-content\u003c/option>\u003coption value=\"updated\">updated\u003c/option>\u003coption value=\"closed\">closed\u003c/option>\u003coption value=\"loading\">loading\u003c/option>\u003c/select>\u003c/label>\n            \u003cButton onClick={() => setVisible(false)}>关闭展示\u003c/Button>\n            \u003cButton onClick={() => setHandle(message.info(copy('浮层消息', 'Portal message'), 0))}>打开浮层\u003c/Button>\u003cButton onClick={() => handle?.update({content: copy('浮层已更新', 'Portal updated')})}>更新浮层\u003c/Button>\u003cButton onClick={() => handle?.close()}>关闭浮层\u003c/Button>{contextHolder}\n        \u003c/div>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Message visual matrix\" data-visual-frame>\n                \u003cdiv className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>\n                    \u003cMessage data-visual-target open={visible} type={['success','warning','error','loading'].includes(state) ? state as 'success' | 'warning' | 'error' | 'loading' : 'info'} duration={0} content={state === 'long-content' ? longText : state === 'updated' ? copy('记录已更新，草稿仍然保留。', 'Record updated; the draft is retained.') : copy('操作结果：工作区已保存', 'Result: workspace saved')} />\n                    \n                \u003c/div>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-message/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-message/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
