/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Radio 用法",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Radio 用法\",\n};\n\nimport { useState } from \"react\";\nimport Radio from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cRadio\n            checked={checked}\n            onChange={(val) => setChecked(val)}\n        >\n            Radio\n        \u003c/Radio>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让单选框处于禁用状态",
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让单选框处于禁用状态\",\n};\n\nimport Radio from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cRadio disabled>未选中禁用\u003c/Radio>\n            \u003cbr />\n            \u003cbr />\n            \u003cRadio disabled checked>选中禁用\u003c/Radio>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "单选框组",
        "description": "使用 `RadioGroup` 管理一组单选框的状态, 实现互斥选择",
        "sourceCode": "export const meta = {\n    title: \"单选框组\",\n    description: \"使用 `RadioGroup` 管理一组单选框的状态, 实现互斥选择\",\n};\n\nimport { useState } from \"react\";\nimport Radio, { RadioGroup } from \"../../src/index.js\";\n\nconst GroupDemo = () => {\n    const [value, setValue] = useState\u003cstring | number>(\"apple\");\n\n    return (\n        \u003cdiv>\n            \u003cRadioGroup value={value} onChange={setValue}>\n                \u003cRadio value=\"apple\">苹果\u003c/Radio>\n                \u003cRadio value=\"banana\">香蕉\u003c/Radio>\n                \u003cRadio value=\"orange\">橘子\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cp>当前选中: {value}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "compact"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "单选框尺寸",
        "description": "通过 `size` 属性设置单选框尺寸, 支持 `large`、`middle`、`small` 三种",
        "sourceCode": "export const meta = {\n    title: \"单选框尺寸\",\n    description: \"通过 `size` 属性设置单选框尺寸, 支持 `large`、`middle`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Radio, { RadioGroup } from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [value, setValue] = useState\u003cstring | number>(\"a\");\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cRadioGroup value={value} onChange={setValue} size=\"large\">\n                \u003cRadio value=\"a\">Large A\u003c/Radio>\n                \u003cRadio value=\"b\">Large B\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cRadioGroup value={value} onChange={setValue} size=\"middle\">\n                \u003cRadio value=\"a\">Middle A\u003c/Radio>\n                \u003cRadio value=\"b\">Middle B\u003c/Radio>\n            \u003c/RadioGroup>\n            \u003cRadioGroup value={value} onChange={setValue} size=\"small\">\n                \u003cRadio value=\"a\">Small A\u003c/Radio>\n                \u003cRadio value=\"b\">Small B\u003c/Radio>\n            \u003c/RadioGroup>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-radio/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-radio/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Radio",
    "symbol": "RadioProps",
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
            "description": "单选框的大小, 默认为 middle",
            "typeText": "'large' | 'middle' | 'small'",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "value",
            "required": false,
            "description": "Radio 的值, 在 RadioGroup 中使用",
            "typeText": "string | number",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
