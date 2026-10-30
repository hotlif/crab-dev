/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Radio 用法",
        "learning": {
            "components": [
                "Radio"
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
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Radio 用法\",\n};\n\nimport { useState } from \"react\";\nimport Radio from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cRadio\n            checked={checked}\n            onCheckedChange={(val) => setChecked(val)}\n        >\n            Radio\n        \u003c/Radio>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "三套设计与状态",
        "description": "Apple 使用填充圆盘和对比圆点，MD3 与 shadcn 分别使用不同尺寸的圆环、圆点与焦点反馈。",
        "learning": {
            "components": [
                "ConfigProvider",
                "RadioGroup",
                "Radio"
            ],
            "props": [
                "designSystem",
                "defaultValue",
                "aria-label",
                "value",
                "disabled",
                "checked",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { useId } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Radio from '../../src/radio.js';\nimport RadioGroup from '../../src/radio-group.js';\n\nexport const meta = { title: '三套设计与状态', description: 'Apple 使用填充圆盘和对比圆点，MD3 与 shadcn 分别使用不同尺寸的圆环、圆点与焦点反馈。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`display: grid; gap: ${token.space['stack-gap']};`;\nconst options = css`flex-direction: column; align-items: flex-start;`;\nexport default function DesignsDemo() {\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        {(['apple', 'md3', 'shadcn'] as const).map(design => \u003cConfigProvider key={design} designSystem={design}>\n            \u003csection className={panel} aria-label={`${design} 单选框`}>\n                \u003cstrong>{design === 'md3' ? 'MD3' : design === 'apple' ? 'Apple' : 'shadcn'}\u003c/strong>\n                \u003cRadioGroup defaultValue=\"daily\" aria-label=\"通知频率\" className={options}>\n                    \u003cRadio value=\"daily\">每天\u003c/Radio>\n                    \u003cRadio value=\"weekly\">每周\u003c/Radio>\n                    \u003cRadio value=\"unavailable\" disabled>暂不可用\u003c/Radio>\n                \u003c/RadioGroup>\n                \u003cRadio checked disabled>已选中且不可用\u003c/Radio>\n                \u003cRadio aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`}>选择同步方式\u003c/Radio>\n                \u003csmall id={`${errorId}-${design}`}>请选择一种同步方式。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>)}\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让单选框处于禁用状态",
        "learning": {
            "components": [
                "Radio"
            ],
            "props": [
                "disabled",
                "checked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让单选框处于禁用状态\",\n};\n\nimport Radio from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cRadio disabled>未选中禁用\u003c/Radio>\n            \u003cbr />\n            \u003cbr />\n            \u003cRadio disabled checked>选中禁用\u003c/Radio>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "单选框组",
        "description": "使用 `RadioGroup` 管理一组单选框的状态, 实现互斥选择",
        "learning": {
            "components": [
                "RadioGroup",
                "Radio"
            ],
            "props": [
                "value",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"单选框组\",\n    description: \"使用 `RadioGroup` 管理一组单选框的状态, 实现互斥选择\",\n};\n\nimport { useState } from \"react\";\nimport Radio, { RadioGroup } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [value, setValue] = useState\u003cstring | number>(\"apple\");\n\n    return (\n        \u003cdiv>\n            \u003cRadioGroup value={value} onValueChange={setValue}>\n                \u003cRadio value=\"apple\">苹果\u003c/Radio>\n                \u003cRadio value=\"banana\">香蕉\u003c/Radio>\n                \u003cRadio value=\"orange\">橘子\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cp>当前选中: {value}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "单选框尺寸",
        "description": "通过 `size` 属性设置单选框尺寸, 支持 `large`、`medium`、`small` 三种",
        "learning": {
            "components": [
                "RadioGroup",
                "Radio"
            ],
            "props": [
                "value",
                "onValueChange",
                "size"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"单选框尺寸\",\n    description: \"通过 `size` 属性设置单选框尺寸, 支持 `large`、`medium`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Radio, { RadioGroup } from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cstring | number>(\"a\");\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cRadioGroup value={value} onValueChange={setValue} size=\"large\">\n                \u003cRadio value=\"a\">Large A\u003c/Radio>\n                \u003cRadio value=\"b\">Large B\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cRadioGroup value={value} onValueChange={setValue} size=\"medium\">\n                \u003cRadio value=\"a\">Middle A\u003c/Radio>\n                \u003cRadio value=\"b\">Middle B\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cRadioGroup value={value} onValueChange={setValue} size=\"small\">\n                \u003cRadio value=\"a\">Small A\u003c/Radio>\n                \u003cRadio value=\"b\">Small B\u003c/Radio>\n            \u003c/RadioGroup>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
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
                "Radio"
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
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Radio from \"@crab-dev/rc-radio\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = {\n    title: \"三体系状态矩阵\",\n    description: \"真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。\",\n};\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 36rem; color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    min-inline-size: 0; overflow-wrap: anywhere;\n`;\nconst states = [\"default\",\"hover\",\"focus-visible\",\"pressed\",\"selected\",\"selected-hover\",\"selected-focus-visible\",\"selected-pressed\",\"error\",\"selected-error\",\"disabled\",\"disabled-selected\"] as const;\n\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [checked, setChecked] = useState(false);\n    const id = useId();\n    const english = locale === \"en-US\";\n    const effectiveChecked = state === \"disabled-selected\" || checked;\n    return \u003csection className={scene} aria-label=\"Radio visual matrix\" data-visual-scene data-size={size} data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cRadio aria-label=\"Primary option\" checked={effectiveChecked}\n                onCheckedChange={setChecked} disabled={state.startsWith(\"disabled\")}\n                aria-invalid={state.includes(\"error\") || undefined}\n                aria-describedby={state.includes(\"error\") ? id + \"-error\" : undefined}\n            >{english ? \"Include archived projects and keep this selection when changing themes\" : \"包含归档项目，并在切换主题时保留选择\"}\u003c/Radio>\n            \u003cRadio checked disabled aria-label=\"Unavailable selected option\">{english ? \"Selected · unavailable\" : \"已选择 · 暂不可用\"}\u003c/Radio>\n            {state.includes(\"error\") && \u003cspan id={id + \"-error\"} role=\"alert\">{english ? \"Review this selection before applying changes.\" : \"应用更改前请核对这一选择。\"}\u003c/span>}\n            \u003coutput aria-live=\"polite\">{english ? \"Selection\" : \"当前选择\"}: {effectiveChecked ? \"on\" : \"off\"}\u003c/output>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
