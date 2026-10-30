/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认即处于加载中, 渲染一枚匀速旋转的指示环, 并以 role=status 向读屏播报。",
        "learning": {
            "components": [
                "Spin"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认即处于加载中, 渲染一枚匀速旋转的指示环, 并以 role=status 向读屏播报。\",\n};\n\nimport Spin from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return \u003cSpin />;\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/delay.demo.tsx",
        "title": "延迟显示",
        "description": "打开开关模拟请求：150ms 的请求在 delay=300ms 内结束，1500ms 的请求才会显示加载指示器。",
        "learning": {
            "components": [
                "Switch",
                "Spin"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "spinning",
                "delay"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: '延迟显示',\n    description: '打开开关模拟请求：150ms 的请求在 delay=300ms 内结束，1500ms 的请求才会显示加载指示器。',\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Switch from '@crab-dev/rc-switch';\nimport { useTimeout } from '@crab-dev/rc-hooks';\nimport token from '@crab-dev/rc-token-semantic';\nimport Spin from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['section-gap']};\n    max-width: 420px;\n`;\nconst panelStyle = css`\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    min-height: 96px;\n    background-color: ${token.color.background.surface};\n    border-radius: ${token.radius.md};\n    color: ${token.color.text.secondary};\n    font-size: ${token.typography.body['font-size']};\n`;\n\nexport default function DelayDemo() {\n    const [fast, setFast] = useState(false);\n    const [slow, setSlow] = useState(false);\n    useTimeout(() => setFast(false), fast ? 150 : null);\n    useTimeout(() => setSlow(false), slow ? 1500 : null);\n\n    return \u003cdiv className={stackStyle}>\n        \u003cSwitch checked={fast} onCheckedChange={setFast}>秒回请求（150ms）\u003c/Switch>\n        \u003cSpin spinning={fast} delay={300}>\u003cdiv className={panelStyle}>请求在延迟窗口内完成，不显示指示器。\u003c/div>\u003c/Spin>\n        \u003cSwitch checked={slow} onCheckedChange={setSlow}>慢请求（1500ms）\u003c/Switch>\n        \u003cSpin spinning={slow} delay={300}>\u003cdiv className={panelStyle}>等待超过300ms时显示指示器。\u003c/div>\u003c/Spin>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fdelay.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fdelay.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/expressive.demo.tsx",
        "title": "M3 Expressive 加载指示器",
        "description": "需要更醒目的品牌反馈时使用 expressive 形变；紧凑控件内继续使用默认 circular 指示环。",
        "learning": {
            "components": [
                "Spin"
            ],
            "props": [
                "size",
                "variant",
                "label"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: 'M3 Expressive 加载指示器',\n    description: '需要更醒目的品牌反馈时使用 expressive 形变；紧凑控件内继续使用默认 circular 指示环。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Spin from '../../src/index.js';\n\nconst comparisonStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    gap: ${token.space['section-gap']};\n`;\n\nconst itemStyle = css`\n    display: grid;\n    justify-items: center;\n    gap: ${token.space['component-gap']};\n    color: ${token.color.text.secondary};\n    font-family: ${token.typography.label['font-family']};\n    font-size: ${token.typography.label['font-size']};\n    font-weight: ${token.typography.label['font-weight']};\n    line-height: ${token.typography.label['line-height']};\n`;\n\nconst ExpressiveDemo = () => (\n    \u003cdiv className={comparisonStyle}>\n        \u003cdiv className={itemStyle}>\n            \u003cSpin size=\"large\" variant=\"expressive\" label=\"正在生成内容\" />\n            \u003cspan>Expressive\u003c/span>\n        \u003c/div>\n        \u003cdiv className={itemStyle}>\n            \u003cSpin size=\"large\" label=\"正在加载\" />\n            \u003cspan>Circular\u003c/span>\n        \u003c/div>\n    \u003c/div>\n);\n\nexport default ExpressiveDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fexpressive.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fexpressive.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/indicator.demo.tsx",
        "title": "自定义指示器",
        "description": "indicator 替换默认的旋转环; 无障碍语义（role=status / aria-label）仍由 Spin 统一兜底。",
        "learning": {
            "components": [
                "Spin"
            ],
            "props": [
                "indicator",
                "tip"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"自定义指示器\",\n    description: \"indicator 替换默认的旋转环; 无障碍语义（role=status / aria-label）仍由 Spin 统一兜底。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 48px;\n    align-items: center;\n`;\n\nconst dotsStyle = css`\n    display: flex;\n    gap: 6px;\n\n    & > span {\n        width: 8px;\n        height: 8px;\n        background-color: ${token.color.text.primary};\n        border-radius: 50%;\n        animation: rc-spin-demo-bounce 1.2s ease-in-out infinite;\n    }\n\n    & > span:nth-child(2) {\n        animation-delay: 0.15s;\n    }\n\n    & > span:nth-child(3) {\n        animation-delay: 0.3s;\n    }\n\n    @keyframes rc-spin-demo-bounce {\n        0%,\n        80%,\n        100% {\n            opacity: 0.25;\n            transform: translateY(0);\n        }\n        40% {\n            opacity: 1;\n            transform: translateY(-4px);\n        }\n    }\n\n    @media (prefers-reduced-motion: reduce) {\n        & > span {\n            animation-name: rc-spin-demo-fade;\n        }\n\n        @keyframes rc-spin-demo-fade {\n            0%,\n            100% {\n                opacity: 1;\n            }\n            50% {\n                opacity: 0.3;\n            }\n        }\n    }\n`;\n\nconst Dots = () => (\n    \u003cdiv className={dotsStyle} aria-hidden=\"true\">\n        \u003cspan />\n        \u003cspan />\n        \u003cspan />\n    \u003c/div>\n);\n\nconst IndicatorDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin indicator={\u003cDots />} />\n            \u003cSpin indicator={\u003cDots />} tip=\"正在处理\" />\n        \u003c/div>\n    );\n};\n\nexport default IndicatorDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Findicator.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Findicator.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸",
        "description": "通过 size 设置 small / medium / large 三档; 指示器与提示文案会一同缩放。",
        "learning": {
            "components": [
                "Spin"
            ],
            "props": [
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"通过 size 设置 small / medium / large 三档; 指示器与提示文案会一同缩放。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 40px;\n    align-items: center;\n`;\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin size=\"small\" />\n            \u003cSpin size=\"medium\" />\n            \u003cSpin size=\"large\" />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/tip.demo.tsx",
        "title": "提示文案",
        "description": "tip 说明「正在做什么」, 比一枚沉默的转圈更能安抚等待。它同时成为读屏播报的内容。",
        "learning": {
            "components": [
                "Spin"
            ],
            "props": [
                "tip",
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"提示文案\",\n    description: \"tip 说明「正在做什么」, 比一枚沉默的转圈更能安抚等待。它同时成为读屏播报的内容。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Spin from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    gap: 48px;\n    align-items: flex-start;\n`;\n\nconst TipDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cSpin tip=\"加载中\" />\n            \u003cSpin size=\"large\" tip=\"正在同步 3 个文件…\" />\n        \u003c/div>\n    );\n};\n\nexport default TipDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Ftip.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Ftip.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系加载状态矩阵",
        "description": "环形、Expressive、包裹、延迟、自定义与结束状态；动画保留原始时间序列。",
        "learning": {
            "components": [
                "Switch",
                "Spin"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "aria-label",
                "spinning",
                "delay",
                "variant",
                "tip",
                "indicator"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Spin from \"@crab-dev/rc-spin\";\nimport Switch from \"@crab-dev/rc-switch\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = { title: \"三体系加载状态矩阵\", description: \"环形、Expressive、包裹、延迟、自定义与结束状态；动画保留原始时间序列。\" };\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; max-inline-size: 36rem;\n    background: ${token.color.background.surface}; color: ${token.color.text.primary};\n`;\nconst samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-block-size: 8rem; min-inline-size: 0;`;\nconst content = css`padding: ${token.space['group-gap']}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.medium};`;\nconst states = [\"default\", \"expressive\", \"overlay\", \"idle\", \"delayed\", \"custom\"] as const;\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [started, setStarted] = useState(false);\n    const [enabled, setEnabled] = useState(false);\n    const id = useId();\n    const english = locale === \"en-US\";\n    const wrapped = state === \"overlay\" || state === \"idle\";\n    return \u003csection className={scene} aria-label=\"Spin visual matrix\" data-visual-scene data-state={state} data-size={size}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) { setState(next as typeof state); setStarted(false); }\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        {state === \"delayed\" && \u003cSwitch checked={started} onCheckedChange={setStarted} aria-label=\"Start delayed request\">{english ? \"Start delayed request\" : \"开始延迟请求\"}\u003c/Switch>}\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cSpin spinning={state !== \"idle\" && (state !== \"delayed\" || started)} delay={state === \"delayed\" ? 600 : 0}\n                variant={state === \"expressive\" ? \"expressive\" : \"circular\"}\n                tip={english ? \"Refreshing the project list and preserving your current draft\" : \"正在刷新项目列表，保留当前编辑草稿\"}\n                indicator={state === \"custom\" ? \u003cspan aria-hidden=\"true\">⌛\u003c/span> : undefined}>\n                {wrapped ? \u003cdiv className={content}>\u003cp>{english ? \"Project draft\" : \"项目草稿\"}\u003c/p>\u003cSwitch checked={enabled} onCheckedChange={setEnabled}>{english ? \"Allow editing\" : \"允许编辑\"}\u003c/Switch>\u003c/div> : undefined}\n            \u003c/Spin>\n        \u003c/div>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/wrapper.demo.tsx",
        "title": "包裹内容",
        "description": "传入 children 即笼罩该区域: 内容变淡并被 inert 阻断——鼠标点不到, 键盘 Tab 也进不去。",
        "learning": {
            "components": [
                "Switch",
                "Spin"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "spinning",
                "tip",
                "defaultChecked"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"包裹内容\",\n    description: \"传入 children 即笼罩该区域: 内容变淡并被 inert 阻断——鼠标点不到, 键盘 Tab 也进不去。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Switch from '@crab-dev/rc-switch';\nimport token from '@crab-dev/rc-token-semantic';\nimport Spin from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 360px;\n`;\n\nconst panelStyle = css`\n    padding: 16px;\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: 8px;\n`;\n\nconst titleStyle = css`\n    margin: 0 0 8px;\n    font-size: 16px;\n    font-weight: 600;\n`;\n\nconst bodyStyle = css`\n    margin: 0 0 12px;\n    color: ${token.color.text.secondary};\n    font-size: 14px;\n`;\n\nconst WrapperDemo = () => {\n    const [spinning, setSpinning] = useState(true);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cSwitch checked={spinning} onCheckedChange={setSpinning}>加载状态\u003c/Switch>\n\n            \u003cSpin spinning={spinning} tip=\"正在保存\">\n                \u003cdiv className={panelStyle}>\n                    \u003ch4 className={titleStyle}>草稿\u003c/h4>\n                    \u003cp className={bodyStyle}>\n                        加载期间试着用 Tab 键聚焦下面的开关 —— 焦点不会落进来。\n                    \u003c/p>\n                    \u003cSwitch defaultChecked>自动保存草稿\u003c/Switch>\n                \u003c/div>\n            \u003c/Spin>\n        \u003c/div>\n    );\n};\n\nexport default WrapperDemo;\n",
        "previewPath": "/components/rc-spin/workbench/?__wake_demo=docs%2Fdemos%2Fwrapper.demo.tsx",
        "workbenchPath": "/components/rc-spin/workbench/#/components/docs%2Fdemos%2Fwrapper.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
