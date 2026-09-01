/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "受控数字输入：右侧步进按钮、键盘 ↑↓ 步进、长按连续加速",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"受控数字输入：右侧步进按钮、键盘 ↑↓ 步进、长按连续加速\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.75rem;\n    padding: 1rem;\n`;\n\nconst BasicDemo = () => {\n    const [value, setValue] = useState\u003cnumber | null>(3);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cNumberEdit value={value} onChange={setValue} min={0} max={100} />\n            \u003cspan>当前值：{value === null ? \"（空）\" : value}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"科学计数法自适应\",\n    description: \"默认十进制；数值大到不好显示时失焦自动切上标科学计数法，聚焦又展开为可编辑 e 记法。试试输入 1e21 或 0.0000000000000001\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.75rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst ScientificDemo = () => {\n    const [value, setValue] = useState\u003cnumber | null>(1.23e21);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cNumberEdit value={value} onChange={setValue} />\n            \u003cspan>原始值：{value === null ? \"（空）\" : String(value)}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default ScientificDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"尺寸与状态\",\n    description: \"large / middle / small 三档尺寸；error / warning 校验状态；disabled 禁用、readOnly 只读，均透传自 rc-line-edit\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport NumberEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.75rem;\n    padding: 1rem;\n    max-width: 320px;\n`;\n\nconst StatesDemo = () => {\n    const [value, setValue] = useState\u003cnumber | null>(42);\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cNumberEdit value={value} onChange={setValue} size=\"large\" />\n            \u003cNumberEdit value={value} onChange={setValue} size=\"middle\" />\n            \u003cNumberEdit value={value} onChange={setValue} size=\"small\" />\n            \u003cNumberEdit value={value} onChange={setValue} status=\"error\" />\n            \u003cNumberEdit value={value} onChange={setValue} status=\"warning\" />\n            \u003cNumberEdit value={value} onChange={setValue} disabled />\n            \u003cNumberEdit value={value} onChange={setValue} readOnly />\n        \u003c/div>\n    );\n};\n\nexport default StatesDemo;\n",
        "previewPath": "/components/rc-number-edit/workbench/?__wake_demo=docs%2Fdemos%2Fstates.demo.tsx",
        "workbenchPath": "/components/rc-number-edit/workbench/#/components/docs%2Fdemos%2Fstates.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "NumberEdit",
    "symbol": "NumberEditProps",
    "props": [
        {
            "name": "controls",
            "required": false,
            "description": "是否显示步进按钮，默认 `true`",
            "typeText": "boolean",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "decimalSeparator",
            "required": false,
            "description": "小数点符号，默认 `.`",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "defaultValue",
            "required": false,
            "description": "非受控默认值",
            "typeText": "number | null",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "formatter",
            "required": false,
            "description": "自定义显示格式化（失焦态）；返回展示字符串，优先级高于内置千分位",
            "typeText": "(value: number | null) => string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "largeStep",
            "required": false,
            "description": "大步长（Shift+↑↓ 或 PageUp/PageDown），默认 `step * 10`",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "max",
            "required": false,
            "description": "最大值，默认 `Infinity`",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "min",
            "required": false,
            "description": "最小值，默认 `-Infinity`",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onChange",
            "required": false,
            "description": "值变化回调（编辑失焦钳制、步进、清除后触发）；空值回传 `null`",
            "typeText": "(value: number | null) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "parser",
            "required": false,
            "description": "自定义解析（编辑文本 → 数值），与 {@link NumberEditProps.formatter} 配对",
            "typeText": "(text: string) => number | null",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "precision",
            "required": false,
            "description": "小数精度（四舍五入保留位数）；不传则不强制精度",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "scientific",
            "required": false,
            "description": "科学计数法策略，默认 `auto`",
            "typeText": "ScientificMode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "scientificThreshold",
            "required": false,
            "description": "`auto` 模式触发阈值：十进制有效数字位数超过它即转科学计数法，默认 `15` （贴近 JS number 的精度极限）。",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "step",
            "required": false,
            "description": "步进步长，默认 `1`",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "stringMode",
            "required": false,
            "description": "【预留 API — 第一版仅类型签名，尚未实现运算】高精度字符串模式。 未来开启后 value / onChange 将以 string 承载任意精度（BigInt / decimal）。 当前版本传入 `true` 不生效，仍按 number 处理。",
            "typeText": "boolean",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "thousandSeparator",
            "required": false,
            "description": "千分位分隔：`true` 用 `,`，或传自定义分隔符字符串；默认关闭",
            "typeText": "boolean | string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "value",
            "required": false,
            "description": "受控值；空值以 `null` 表示",
            "typeText": "number | null",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
