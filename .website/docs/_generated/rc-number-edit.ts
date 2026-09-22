/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "受控数字输入：编辑保留草稿，失焦或步进时提交；支持键盘 ↑↓ 与长按连续加速。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"受控数字输入：编辑保留草稿，失焦或步进时提交；支持键盘 ↑↓ 与长按连续加速。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['stack-gap']};\n    padding: ${token.space['section-gap']};\n`;\n\nconst BasicDemo = () => {\n    const [value, setValue] = useState\u003cnumber | null>(3);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cNumberEdit\n                label=\"项目数量\"\n                supportingText=\"范围 0–100；也可用方向键调整。\"\n                appearance=\"filled\"\n                value={value}\n                onChange={setValue}\n                min={0}\n                max={100}\n            />\n            \u003cspan>已提交值：{value === null ? \"（空）\" : value}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"千分位与自定义格式化\",\n    description: \"thousandSeparator 开启千分位分组；formatter/parser 自定义货币、百分比等显示（聚焦编辑时回到原始数值）\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.25rem;\n    font-size: 0.85rem;\n`;\n\nconst toCurrency = (value: number | null): string =>\n    value === null ? \"\" : `¥ ${value.toLocaleString(\"zh-CN\")}`;\n\nconst fromCurrency = (text: string): number | null => {\n    const n = Number(text.replace(/[^\\d.-]/g, \"\"));\n    return Number.isFinite(n) ? n : null;\n};\n\nconst FormatDemo = () => {\n    const [amount, setAmount] = useState\u003cnumber | null>(1234567);\n    const [price, setPrice] = useState\u003cnumber | null>(8888);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003clabel className={fieldStyle}>\n                千分位\n                \u003cNumberEdit value={amount} onChange={setAmount} thousandSeparator />\n            \u003c/label>\n            \u003clabel className={fieldStyle}>\n                货币 formatter\n                \u003cNumberEdit value={price} onChange={setPrice} formatter={toCurrency} parser={fromCurrency} />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default FormatDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"范围、步长与精度\",\n    description: \"min/max 失焦钳制、到边界步进按钮禁用；step 步长、precision 小数精度；Shift+↑↓ 或 PageUp/Down 走大步长\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.25rem;\n    font-size: 0.85rem;\n`;\n\nconst RangeDemo = () => {\n    const [percent, setPercent] = useState\u003cnumber | null>(50);\n    const [amount, setAmount] = useState\u003cnumber | null>(1.5);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003clabel className={fieldStyle}>\n                0–100，step 5，大步长 25\n                \u003cNumberEdit value={percent} onChange={setPercent} min={0} max={100} step={5} largeStep={25} suffix=\"%\" />\n            \u003c/label>\n            \u003clabel className={fieldStyle}>\n                step 0.1，precision 2\n                \u003cNumberEdit value={amount} onChange={setAmount} step={0.1} precision={2} min={0} />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default RangeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"科学计数法自适应\",\n    description: \"默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    min-width: 0;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"inline-gap\"]};\n`;\n\nconst ScientificDemo = () => {\n    const fieldId = useId();\n    const [value, setValue] = useState\u003cnumber | null>(1.23e21);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-0`}>科学计数法数值\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-0`} value={value} onChange={setValue} />\n            \u003c/div>\n            \u003cspan>原始值：{value === null ? \"（空）\" : String(value)}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default ScientificDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fscientific.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fscientific.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/states.demo.tsx",
        "title": "尺寸与状态",
        "description": "large / middle / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit",
        "sourceCode": "export const meta = {\n    title: \"尺寸与状态\",\n    description: \"large / middle / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    min-width: 0;\n    max-width: 320px;\n`;\n\nconst fieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"inline-gap\"]};\n`;\n\nconst StatesDemo = () => {\n    const fieldId = useId();\n    const [value, setValue] = useState\u003cnumber | null>(42);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-0`}>大尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-0`} value={value} onChange={setValue} size=\"large\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-1`}>中尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-1`} value={value} onChange={setValue} size=\"middle\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-2`}>小尺寸\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-2`} value={value} onChange={setValue} size=\"small\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-3`}>错误状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-3`} value={value} onChange={setValue} status=\"error\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-4`}>警告状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-4`} value={value} onChange={setValue} status=\"warning\" />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-5`}>禁用状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-5`} value={value} onChange={setValue} disabled />\n            \u003c/div>\n            \u003cdiv className={fieldStyle}>\n                \u003clabel htmlFor={`${fieldId}-6`}>只读状态\u003c/label>\n                \u003cNumberEdit id={`${fieldId}-6`} value={value} onChange={setValue} readOnly />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default StatesDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fstates.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fstates.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
