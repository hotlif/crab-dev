/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Switch 用法",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Switch 用法\",\n};\n\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cSwitch\n            checked={checked}\n            onChange={(val) => setChecked(val)}\n        >\n            开关\n        \u003c/Switch>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让开关处于禁用状态",
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让开关处于禁用状态\",\n};\n\nimport Switch from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cSwitch disabled aria-label=\"未选中禁用\">未选中禁用\u003c/Switch>\n            \u003cbr />\n            \u003cbr />\n            \u003cSwitch disabled defaultChecked>选中禁用\u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "开关尺寸",
        "description": "通过 `size` 属性设置开关尺寸, 支持 `large`、`middle`、`small` 三种",
        "sourceCode": "export const meta = {\n    title: \"开关尺寸\",\n    description: \"通过 `size` 属性设置开关尺寸, 支持 `large`、`middle`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cSwitch\n                size=\"large\"\n                checked={checked}\n                onChange={(val) => setChecked(val)}\n            >\n                Large\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"middle\"\n                checked={checked}\n                onChange={(val) => setChecked(val)}\n            >\n                Middle\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"small\"\n                checked={checked}\n                onChange={(val) => setChecked(val)}\n            >\n                Small\n            \u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
