/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Checkbox 用法",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Checkbox 用法\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cCheckbox\n            checked={checked}\n            onChange={(val) => setChecked(val)}\n        >\n            Checkbox\n        \u003c/Checkbox>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让复选框处于禁用状态",
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让复选框处于禁用状态\",\n};\n\nimport Checkbox from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cCheckbox disabled>未选中禁用\u003c/Checkbox>\n            \u003cbr />\n            \u003cbr />\n            \u003cCheckbox disabled checked>选中禁用\u003c/Checkbox>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "复选框组",
        "description": "使用 `CheckboxGroup` 管理一组复选框的状态",
        "sourceCode": "export const meta = {\n    title: \"复选框组\",\n    description: \"使用 `CheckboxGroup` 管理一组复选框的状态\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([\"apple\"]);\n\n    return (\n        \u003cdiv>\n            \u003cCheckboxGroup value={value} onChange={setValue}>\n                \u003cCheckbox value=\"apple\">苹果\u003c/Checkbox>\n                \u003cCheckbox value=\"banana\">香蕉\u003c/Checkbox>\n                \u003cCheckbox value=\"orange\">橘子\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cp>当前选中: {value.join(\", \")}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/indeterminate.demo.tsx",
        "title": "半选状态",
        "description": "使用 `indeterminate` 属性表示半选状态, 常用于全选/全不选场景",
        "sourceCode": "export const meta = {\n    title: \"半选状态\",\n    description: \"使用 `indeterminate` 属性表示半选状态, 常用于全选/全不选场景\",\n};\n\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst options = [\"苹果\", \"香蕉\", \"橘子\"];\n\nconst IndeterminateDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([\"苹果\"]);\n\n    const allChecked = value.length === options.length;\n    const indeterminate = value.length > 0 && !allChecked;\n\n    const handleCheckAll = (checked: boolean) => {\n        setValue(checked ? [...options] : []);\n    };\n\n    return (\n        \u003cdiv>\n            \u003cCheckbox\n                checked={allChecked}\n                indeterminate={indeterminate}\n                onChange={handleCheckAll}\n            >\n                全选\n            \u003c/Checkbox>\n            \u003cbr />\n            \u003cbr />\n            \u003cCheckboxGroup value={value} onChange={setValue}>\n                {options.map((opt) => (\n                    \u003cCheckbox key={opt} value={opt}>\n                        {opt}\n                    \u003c/Checkbox>\n                ))}\n            \u003c/CheckboxGroup>\n        \u003c/div>\n    );\n};\n\nexport default IndeterminateDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Findeterminate.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Findeterminate.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "复选框尺寸",
        "description": "通过 `size` 属性设置复选框尺寸, 支持 `large`、`middle`、`small` 三种",
        "sourceCode": "export const meta = {\n    title: \"复选框尺寸\",\n    description: \"通过 `size` 属性设置复选框尺寸, 支持 `large`、`middle`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Checkbox, { CheckboxGroup } from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cArray\u003cstring | number>>([]);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cCheckboxGroup value={value} onChange={setValue} size=\"large\">\n                \u003cCheckbox value=\"a\">Large A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Large B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cCheckboxGroup value={value} onChange={setValue} size=\"middle\">\n                \u003cCheckbox value=\"a\">Middle A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Middle B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n            \u003cCheckboxGroup value={value} onChange={setValue} size=\"small\">\n                \u003cCheckbox value=\"a\">Small A\u003c/Checkbox>\n                \u003cCheckbox value=\"b\">Small B\u003c/Checkbox>\n            \u003c/CheckboxGroup>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-checkbox/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-checkbox/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Checkbox",
    "symbol": "CheckboxProps",
    "props": [
        {
            "name": "aria-label",
            "required": false,
            "description": "",
            "typeText": "string } | { children?: never; 'aria-label': string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "checked",
            "required": false,
            "description": "是否选中（受控）",
            "typeText": "boolean",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "children",
            "required": true,
            "description": "",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "defaultChecked",
            "required": false,
            "description": "默认是否选中（非受控）",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "indeterminate",
            "required": false,
            "description": "是否半选状态",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "onChange",
            "required": false,
            "description": "值变化时的回调",
            "typeText": "(checked: boolean, event: ChangeEvent\u003cHTMLInputElement>) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "复选框的大小, 默认为 middle",
            "typeText": "'large' | 'middle' | 'small'",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "value",
            "required": false,
            "description": "Checkbox 的值, 在 CheckboxGroup 中使用",
            "typeText": "string | number",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
