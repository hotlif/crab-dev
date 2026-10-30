/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Switch 用法",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "checked",
                "onCheckedChange"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Switch 用法\",\n};\n\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cSwitch\n            checked={checked}\n            onCheckedChange={(val) => setChecked(val)}\n        >\n            开关\n        \u003c/Switch>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "三套设计与状态",
        "description": "MD3 的手柄随选中和按压改变大小；Apple 与 shadcn 使用各自的紧凑轨道与等大的手柄。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Switch"
            ],
            "props": [
                "designSystem",
                "defaultChecked",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { useId } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Switch from '../../src/switch.js';\n\nexport const meta = { title: '三套设计与状态', description: 'MD3 的手柄随选中和按压改变大小；Apple 与 shadcn 使用各自的紧凑轨道与等大的手柄。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`display: grid; gap: ${token.space['stack-gap']};`;\nexport default function DesignsDemo() {\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        {(['apple', 'md3', 'shadcn'] as const).map(design => \u003cConfigProvider key={design} designSystem={design}>\n            \u003csection className={panel} aria-label={`${design} 开关`}>\n                \u003cstrong>{design === 'md3' ? 'MD3' : design === 'apple' ? 'Apple' : 'shadcn'}\u003c/strong>\n                \u003cSwitch>开启通知\u003c/Switch>\n                \u003cSwitch defaultChecked>自动同步\u003c/Switch>\n                \u003cSwitch disabled>暂不可用\u003c/Switch>\n                \u003cSwitch defaultChecked disabled>已开启且不可用\u003c/Switch>\n                \u003cSwitch defaultChecked aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`}>云端备份\u003c/Switch>\n                \u003csmall id={`${errorId}-${design}`}>备份失败，请检查连接后重试。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>)}\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让开关处于禁用状态",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "disabled",
                "aria-label",
                "defaultChecked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让开关处于禁用状态\",\n};\n\nimport Switch from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cSwitch disabled aria-label=\"未选中禁用\">未选中禁用\u003c/Switch>\n            \u003cbr />\n            \u003cbr />\n            \u003cSwitch disabled defaultChecked>选中禁用\u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/rtl.demo.tsx",
        "title": "从右向左布局",
        "description": "手柄与状态层跟随文档方向；按下时手柄放大但中心保持不变。",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "defaultChecked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Switch from '../../src/index.js';\n\nexport const meta = {\n    title: '从右向左布局',\n    description: '手柄与状态层跟随文档方向；按下时手柄放大但中心保持不变。',\n};\n\nexport default function RtlDemo() {\n    return \u003cdiv dir=\"rtl\">\u003cSwitch defaultChecked>RTL 开关\u003c/Switch>\u003c/div>;\n}\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Frtl.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Frtl.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "开关尺寸",
        "description": "通过 `size` 属性设置开关尺寸, 支持 `large`、`medium`、`small` 三种",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "size",
                "checked",
                "onCheckedChange"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"开关尺寸\",\n    description: \"通过 `size` 属性设置开关尺寸, 支持 `large`、`medium`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cSwitch\n                size=\"large\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Large\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"medium\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Middle\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"small\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Small\n            \u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系状态矩阵",
        "description": "真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "aria-label",
                "checked",
                "onCheckedChange",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Switch from \"@crab-dev/rc-switch\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = {\n    title: \"三体系状态矩阵\",\n    description: \"真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。\",\n};\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 36rem; color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    min-inline-size: 0; overflow-wrap: anywhere;\n`;\nconst states = [\"default\",\"hover\",\"focus-visible\",\"pressed\",\"selected\",\"selected-hover\",\"selected-focus-visible\",\"selected-pressed\",\"error\",\"selected-error\",\"disabled\",\"disabled-selected\"] as const;\n\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [checked, setChecked] = useState(false);\n    const id = useId();\n    const english = locale === \"en-US\";\n    const effectiveChecked = state === \"disabled-selected\" || checked;\n    return \u003csection className={scene} aria-label=\"Switch visual matrix\" data-visual-scene data-size={size} data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cSwitch aria-label=\"Primary option\" checked={effectiveChecked}\n                onCheckedChange={setChecked} disabled={state.startsWith(\"disabled\")}\n                aria-invalid={state.includes(\"error\") || undefined}\n                aria-describedby={state.includes(\"error\") ? id + \"-error\" : undefined}\n            >{english ? \"Include archived projects and keep this selection when changing themes\" : \"包含归档项目，并在切换主题时保留选择\"}\u003c/Switch>\n            \u003cSwitch checked disabled aria-label=\"Unavailable selected option\">{english ? \"Selected · unavailable\" : \"已选择 · 暂不可用\"}\u003c/Switch>\n            {state.includes(\"error\") && \u003cspan id={id + \"-error\"} role=\"alert\">{english ? \"Review this selection before applying changes.\" : \"应用更改前请核对这一选择。\"}\u003c/span>}\n            \u003coutput aria-live=\"polite\">{english ? \"Selection\" : \"当前选择\"}: {effectiveChecked ? \"on\" : \"off\"}\u003c/output>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
