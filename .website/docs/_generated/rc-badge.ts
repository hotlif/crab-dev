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
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系展示与状态矩阵",
        "description": "公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Badge",
                "Button"
            ],
            "props": [
                "size",
                "density",
                "data-visual-target",
                "count",
                "showZero",
                "dot",
                "status",
                "text",
                "data-wrapped-badge",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css, cx } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Badge from '@crab-dev/rc-badge';\n\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; grid-template-columns: minmax(0, 1fr); min-width: 0; gap: ${token.space['stack-gap']};`;\nconst flexSceneStyle = css`display: flex; flex-wrap: wrap; align-items: center;`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('default');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [layout, setLayout] = useState('grid');\n    const [actionCount, setActionCount] = useState(0);\n    const [draft, setDraft] = useState('保留这份草稿');\n    \n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>default\u003c/option>\u003coption>small\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>standard\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"zero\">zero\u003c/option>\u003coption value=\"overflow\">overflow\u003c/option>\u003coption value=\"dot\">dot\u003c/option>\u003coption value=\"status\">status\u003c/option>\u003coption value=\"error\">error\u003c/option>\u003coption value=\"processing\">processing\u003c/option>\u003c/select>\u003c/label>\n            \n        \u003c/div>\n        \u003clabel>宿主布局\u003cselect aria-label=\"宿主布局\" value={layout} onChange={event => setLayout(event.currentTarget.value)}>\u003coption>grid\u003c/option>\u003coption>flex\u003c/option>\u003c/select>\u003c/label>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Badge visual matrix\" data-visual-frame>\n                \u003cdiv className={cx(sceneStyle, layout === 'flex' && flexSceneStyle)} data-visual-scene data-size={size} data-density={density} data-state={state} data-layout={layout}>\n                    \u003cBadge data-visual-target size={size as 'default' | 'small'} count={state === 'zero' ? 0 : state === 'overflow' ? 120 : 8} showZero dot={state === 'dot'} status={state === 'processing' ? 'processing' : state === 'error' ? 'error' : state === 'status' ? 'success' : undefined} text={state === 'processing' ? copy('正在同步', 'Syncing') : state === 'status' ? copy('已同步', 'Synced') : state === 'error' ? copy('同步失败', 'Sync failed') : undefined} />\u003cBadge data-wrapped-badge size={size as 'default' | 'small'} count={8}>\u003cButton onClick={() => setActionCount(actionCount + 1)}>{copy('收件箱', 'Inbox')}\u003c/Button>\u003c/Badge>\n                    \n                \u003c/div>\n                \u003coutput aria-label=\"宿主操作次数\">{actionCount}\u003c/output>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-badge/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-badge/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
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
