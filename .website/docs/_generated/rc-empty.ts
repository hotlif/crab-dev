/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最基础的空状态，使用 `preset` 选择预置场景",
        "learning": {
            "components": [
                "Empty"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
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
        "learning": {
            "components": [
                "Empty"
            ],
            "props": [
                "image",
                "title",
                "description",
                "preset"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "\nexport const meta = {\n    title: \"自定义内容\",\n    description: \"通过 `image`、`title`、`description` 完全自定义内容。传入 `null` 可隐藏对应区域。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\nimport token from '@crab-dev/rc-token-semantic';\n\nconst wrapStyle = css`\n    display: flex;\n    gap: ${token.space['section-gap']};\n    flex-wrap: wrap;\n    align-items: flex-start;\n`;\n\nconst cardStyle = css`\n    flex: 1;\n    min-width: 200px;\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    overflow: hidden;\n`;\n\nconst emojiStyle = css`\n    font-size: 56px;\n    line-height: 1;\n    user-select: none;\n`;\n\nconst CustomDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            {/* 自定义图像 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    image={\u003cspan className={emojiStyle}>📭\u003c/span>}\n                    title=\"收件箱是空的\"\n                    description=\"新邮件会在这里显示\"\n                />\n            \u003c/div>\n\n            {/* 隐藏描述 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    preset=\"search\"\n                    title=\"没有找到「React」\"\n                    description={null}\n                />\n            \u003c/div>\n\n            {/* 仅图示，无文字 */}\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty\n                    title={null}\n                    description={null}\n                />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CustomDemo;\n",
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
        "learning": {
            "components": [
                "Empty"
            ],
            "props": [
                "preset"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "\nexport const meta = {\n    title: \"预置场景\",\n    description: \"三种内置场景：`default`（无数据）、`search`（搜索无结果）、`no-permission`（无权限）。每种预置均内置图示与文案，基于设计心理学为不同情绪场景匹配合适的视觉传达。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\nimport token from '@crab-dev/rc-token-semantic';\n\nconst wrapStyle = css`\n    display: flex;\n    gap: ${token.space['section-gap']};\n    flex-wrap: wrap;\n    align-items: flex-start;\n`;\n\nconst cardStyle = css`\n    flex: 1;\n    min-width: 220px;\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    overflow: hidden;\n`;\n\nconst PresetDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"default\" />\n            \u003c/div>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"search\" />\n            \u003c/div>\n            \u003cdiv className={cardStyle}>\n                \u003cEmpty preset=\"no-permission\" />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default PresetDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fpreset.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fpreset.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系展示与状态矩阵",
        "description": "公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Empty",
                "Button"
            ],
            "props": [
                "size",
                "density",
                "imageSize",
                "data-visual-target",
                "preset",
                "title",
                "description",
                "image",
                "action",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Empty from '@crab-dev/rc-empty';\n\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('medium');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [count, setCount] = useState(0);\n    const [draft, setDraft] = useState('保留这份草稿');\n    \n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>medium\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>compact\u003c/option>\u003coption>standard\u003c/option>\u003coption>comfortable\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"search\">search\u003c/option>\u003coption value=\"no-permission\">no-permission\u003c/option>\u003coption value=\"action\">action\u003c/option>\u003coption value=\"hover\">hover\u003c/option>\u003coption value=\"focus-visible\">focus-visible\u003c/option>\u003coption value=\"pressed\">pressed\u003c/option>\u003coption value=\"custom\">custom\u003c/option>\u003c/select>\u003c/label>\n            \n        \u003c/div>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Empty visual matrix\" data-visual-frame>\n                \u003cdiv className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>\n                    \u003cEmpty imageSize={longContent ? 72 : undefined} data-visual-target preset={state === 'search' || state === 'no-permission' ? state : 'default'} title={state === 'custom' ? copy('没有符合筛选条件的记录', 'No records match these filters') : undefined} description={state === 'custom' ? copy('可以更改筛选条件，或稍后重新加载数据。', 'Change the filters or reload the data later.') : undefined} image={state === 'custom' ? \u003cspan aria-hidden=\"true\">◇\u003c/span> : undefined} action={['action','hover','focus-visible','pressed'].includes(state) ? \u003cButton onClick={() => setCount(count + 1)}>{copy('创建记录', 'Create record')}\u003c/Button> : undefined} />\n                    \n                \u003c/div>\n                \u003coutput aria-label=\"操作次数\">{count}\u003c/output>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/with-action.demo.tsx",
        "title": "带操作区域",
        "description": "通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。",
        "learning": {
            "components": [
                "Button",
                "Empty"
            ],
            "props": [
                "appearance",
                "onClick",
                "preset",
                "title",
                "description",
                "action"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"带操作区域\",\n    description: \"通过 `action` 插槽提供行动引导，将空状态从「终点」转变为「起点」，减少用户挫败感。\",\n};\n\nimport Empty from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\n\nconst stackStyle = css`\n    display: grid;\n    justify-items: center;\n    gap: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\n\nconst WithActionDemo = () => {\n    const [created, setCreated] = useState(false);\n    return (\n        \u003cdiv className={stackStyle}>\n            {created ? \u003c>\n                \u003cstrong>示例项目\u003c/strong>\n                \u003cspan>现在可以添加内容。\u003c/span>\n                \u003cButton appearance=\"outlined\" onClick={() => setCreated(false)}>重置演示\u003c/Button>\n            \u003c/> : \u003cEmpty\n                preset=\"default\"\n                title=\"暂无项目\"\n                description=\"创建第一个项目以开始整理内容。\"\n                action={\u003cButton appearance=\"primary\" onClick={() => setCreated(true)}>立即创建\u003c/Button>}\n            />}\n            \u003cp className={statusStyle} role=\"status\">{created ? '已创建 1 个项目。' : '当前没有项目。'}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default WithActionDemo;\n",
        "previewPath": "/components/rc-empty/workbench/?__wake_demo=docs%2Fdemos%2Fwith-action.demo.tsx",
        "workbenchPath": "/components/rc-empty/workbench/#/components/docs%2Fdemos%2Fwith-action.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
