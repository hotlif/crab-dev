/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "受控数字输入：编辑保留草稿，失焦或步进时提交；支持键盘 ↑↓ 与长按连续加速。",
        "learning": {
            "components": [
                "NumberEdit"
            ],
            "props": [
                "label",
                "supportingText",
                "appearance",
                "value",
                "onValueChange",
                "min",
                "max"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"受控数字输入：编辑保留草稿，失焦或步进时提交；支持键盘 ↑↓ 与长按连续加速。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['stack-gap']};\n    padding: ${token.space['section-gap']};\n`;\n\nconst BasicDemo = () => {\n    const [value, setValue] = useState\u003cnumber | null>(3);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cNumberEdit\n                label=\"项目数量\"\n                supportingText=\"范围 0–100；也可用方向键调整。\"\n                appearance=\"filled\"\n                value={value}\n                onValueChange={setValue}\n                min={0}\n                max={100}\n            />\n            \u003cspan>已提交值：{value === null ? \"（空）\" : value}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/format.demo.tsx",
        "title": "千分位与自定义格式化",
        "description": "thousandSeparator 开启千分位分组；formatter/parser 自定义货币、百分比等显示（聚焦编辑时回到原始数值）",
        "learning": {
            "components": [
                "NumberEdit"
            ],
            "props": [
                "value",
                "onValueChange",
                "thousandSeparator",
                "formatter",
                "parser"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"千分位与自定义格式化\",\n    description: \"thousandSeparator 开启千分位分组；formatter/parser 自定义货币、百分比等显示（聚焦编辑时回到原始数值）\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.25rem;\n    font-size: 0.85rem;\n`;\n\nconst toCurrency = (value: number | null): string =>\n    value === null ? \"\" : `¥ ${value.toLocaleString(\"zh-CN\")}`;\n\nconst fromCurrency = (text: string): number | null => {\n    const n = Number(text.replace(/[^\\d.-]/g, \"\"));\n    return Number.isFinite(n) ? n : null;\n};\n\nconst FormatDemo = () => {\n    const [amount, setAmount] = useState\u003cnumber | null>(1234567);\n    const [price, setPrice] = useState\u003cnumber | null>(8888);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003clabel className={fieldStyle}>\n                千分位\n                \u003cNumberEdit value={amount} onValueChange={setAmount} thousandSeparator />\n            \u003c/label>\n            \u003clabel className={fieldStyle}>\n                货币 formatter\n                \u003cNumberEdit value={price} onValueChange={setPrice} formatter={toCurrency} parser={fromCurrency} />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default FormatDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fformat.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fformat.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/range.demo.tsx",
        "title": "范围、步长与精度",
        "description": "min/max 失焦钳制、到边界步进按钮禁用；step 步长、precision 小数精度；Shift+↑↓ 或 PageUp/Down 走大步长",
        "learning": {
            "components": [
                "NumberEdit"
            ],
            "props": [
                "value",
                "onValueChange",
                "min",
                "max",
                "step",
                "largeStep",
                "suffix",
                "precision"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"范围、步长与精度\",\n    description: \"min/max 失焦钳制、到边界步进按钮禁用；step 步长、precision 小数精度；Shift+↑↓ 或 PageUp/Down 走大步长\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.25rem;\n    font-size: 0.85rem;\n`;\n\nconst RangeDemo = () => {\n    const [percent, setPercent] = useState\u003cnumber | null>(50);\n    const [amount, setAmount] = useState\u003cnumber | null>(1.5);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003clabel className={fieldStyle}>\n                0–100，step 5，大步长 25\n                \u003cNumberEdit value={percent} onValueChange={setPercent} min={0} max={100} step={5} largeStep={25} suffix=\"%\" />\n            \u003c/label>\n            \u003clabel className={fieldStyle}>\n                step 0.1，precision 2\n                \u003cNumberEdit value={amount} onValueChange={setAmount} step={0.1} precision={2} min={0} />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default RangeDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Frange.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Frange.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/scientific.demo.tsx",
        "title": "科学计数法自适应",
        "description": "默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001",
        "learning": {
            "components": [
                "NumberEdit"
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
        "sourceCode": "export const meta = {\n    title: \"科学计数法自适应\",\n    description: \"默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    min-width: 0;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"inline-gap\"]};\n`;\n\nconst ScientificDemo = () => {\n    const fieldId = useId();\n    const [value, setValue] = useState\u003cnumber | null>(1.23e21);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-0`}>科学计数法数值\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-0`} value={value} onValueChange={setValue} />\n            \u003c/div>\n            \u003cspan>原始值：{value === null ? \"（空）\" : String(value)}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default ScientificDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fscientific.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fscientific.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/states.demo.tsx",
        "title": "尺寸与状态",
        "description": "large / medium / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit",
        "learning": {
            "components": [
                "NumberEdit"
            ],
            "props": [
                "value",
                "onValueChange",
                "size",
                "status",
                "disabled",
                "readOnly"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸与状态\",\n    description: \"large / medium / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    min-width: 0;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"inline-gap\"]};\n`;\n\nconst StatesDemo = () => {\n    const fieldId = useId();\n    const [value, setValue] = useState\u003cnumber | null>(42);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-0`}>大尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-0`} value={value} onValueChange={setValue} size=\"large\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-1`}>中尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-1`} value={value} onValueChange={setValue} size=\"medium\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-2`}>小尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-2`} value={value} onValueChange={setValue} size=\"small\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-3`}>错误状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-3`} value={value} onValueChange={setValue} status=\"error\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-4`}>警告状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-4`} value={value} onValueChange={setValue} status=\"warning\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-5`}>禁用状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-5`} value={value} onValueChange={setValue} disabled />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-6`}>只读状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-6`} value={value} onValueChange={setValue} readOnly />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default StatesDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fstates.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fstates.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系字段状态矩阵",
        "description": "数值草稿、步进、边界、格式化与科学计数法共用公开字段外壳。",
        "learning": {
            "components": [
                "NumberEdit"
            ],
            "props": [
                "appearance",
                "label",
                "aria-label",
                "value",
                "onValueChange",
                "allowClear",
                "min",
                "max",
                "step",
                "precision",
                "thousandSeparator",
                "scientific"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css, cx } from \"@crab-dev/css\";\nimport NumberEdit from \"@crab-dev/rc-number-edit\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport { useId, useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nexport const meta = { title: \"三体系字段状态矩阵\", description: \"数值草稿、步进、边界、格式化与科学计数法共用公开字段外壳。\" };\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 52rem; min-inline-size: 0; color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`\n    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));\n    gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;\n`;\nconst embeddedHost = css`\n    background-color: ${token.color.background.elevated};\n    border-radius: ${token.shape.control};\n`;\nconst states = [\"default\",\"hover\",\"focus-visible\",\"filled\",\"error\",\"filled-error\",\"warning\",\"filled-warning\",\"disabled\",\"read-only\",\"minimum\",\"maximum\",\"scientific\",\"scientific-read-only\",\"scientific-disabled\",\"formatted\",\"clear\",\"keyboard-step\",\"stepper-focus\",\"long-press\",\"borderless-focus\",\"controls-hidden\"] as const;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const english = locale === \"en-US\";\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [value, setValue] = useState\u003cnumber | null>(null);\n    const id = useId();\n    const status = state === \"error\" || state === \"filled-error\" ? \"error\"\n        : state === \"warning\" || state === \"filled-warning\" ? \"warning\" : undefined;\n    const scientific = state === \"scientific\" || state === \"scientific-read-only\" || state === \"scientific-disabled\";\n    const disabled = state === \"disabled\" || state === \"scientific-disabled\";\n    const readOnly = state === \"read-only\" || state === \"scientific-read-only\";\n    const embedded = state === \"borderless-focus\";\n    return \u003csection className={scene} aria-label=\"NumberEdit visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) {\n                setState(next as typeof state);\n                if (next === \"scientific\") setValue(1.2345e21);\n                else if (next === \"formatted\") setValue(12345.5);\n                else if (next === \"long-press\") setValue(10);\n                else if (next === \"disabled\" || next === \"read-only\") setValue(1234.5);\n                else if (value == null && (next === \"filled-error\" || next === \"filled-warning\")) setValue(1234.5);\n                else if (value == null && (next === \"scientific-read-only\" || next === \"scientific-disabled\")) setValue(1.2345e21);\n                else if (value == null && (next === \"borderless-focus\" || next === \"controls-hidden\")) setValue(12.5);\n            }\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={cx(samples, embedded && embeddedHost)} data-visual-frame data-visual-host={embedded || undefined}>\n            {([\"outlined\", \"filled\"] as const).map(appearance => \u003cNumberEdit key={appearance}\n                appearance={appearance} label={`${english ? \"Alert threshold\" : \"预警阈值\"} · ${appearance}`} aria-label={`NumberEdit ${appearance}`}\n                value={value} onValueChange={setValue} allowClear\n                min={scientific ? undefined : 0} max={scientific ? undefined : 100000}\n                step={0.5} precision={scientific ? undefined : 1}\n                thousandSeparator={state === \"formatted\"} scientific={scientific ? \"always\" : \"never\"}\n                suffix={scientific ? undefined : \"%\"}\n                disabled={disabled} readOnly={readOnly}\n                bordered={!embedded} controls={state !== \"controls-hidden\"}\n                status={status}\n                errorText={status === \"error\" ? (english ? \"Review the number and try again.\" : \"请核对内容并修正后重试。\") : undefined}\n                supportingText={english ? \"Use decimals; arrow keys step by 0.5 and blur commits.\" : \"可输入小数；方向键按 0.5 步进，失焦后提交。\"}\n            />)}\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
