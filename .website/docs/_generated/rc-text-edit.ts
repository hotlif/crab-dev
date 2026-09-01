/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/allow-clear.demo.tsx",
        "title": "一键清除",
        "description": "设置 `allowClear` 后，有内容时右上角出现清除按钮；开启后文本区常驻预留按钮空间，按钮出现或消失不会引起文本回流",
        "sourceCode": "export const meta = {\n    title: \"一键清除\",\n    description: \"设置 `allowClear` 后，有内容时右上角出现清除按钮；开启后文本区常驻预留按钮空间，按钮出现或消失不会引起文本回流\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst AllowClearDemo = () => {\n    const [value, setValue] = useState(\"点击右上角按钮可一键清空这段内容。\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit\n                value={value}\n                rows={3}\n                allowClear\n                onClear={() => setValue(\"\")}\n                onChange={(e) => setValue(e.target.value)}\n            />\n        \u003c/div>\n    );\n};\n\nexport default AllowClearDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fallow-clear.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fallow-clear.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/auto-size.demo.tsx",
        "title": "高度自适应",
        "description": "设置 `autoSize` 后高度随内容自动增长（CSS field-sizing，浏览器不支持时按 `rows` 回退）；开启后手动拖拽调整被禁用，两种高度控制方式不会互相冲突",
        "sourceCode": "export const meta = {\n    title: \"高度自适应\",\n    description: \"设置 `autoSize` 后高度随内容自动增长（CSS field-sizing，浏览器不支持时按 `rows` 回退）；开启后手动拖拽调整被禁用，两种高度控制方式不会互相冲突\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst AutoSizeDemo = () => {\n    const [value, setValue] = useState(\"继续输入更多行，输入框会随内容自动长高。\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit\n                value={value}\n                rows={2}\n                autoSize\n                placeholder=\"输入多行内容试试\"\n                onChange={(e) => setValue(e.target.value)}\n            />\n        \u003c/div>\n    );\n};\n\nexport default AutoSizeDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fauto-size.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fauto-size.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/show-count.demo.tsx",
        "title": "字符计数",
        "description": "设置 `showCount` 后在右下角实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，并在输入层直接阻止超出上限（输入约束前置）",
        "sourceCode": "export const meta = {\n    title: \"字符计数\",\n    description: \"设置 `showCount` 后在右下角实时显示已输入字符数；配合 `maxLength` 使用时显示「已输入 / 上限」格式，并在输入层直接阻止超出上限（输入约束前置）\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst ShowCountDemo = () => {\n    const [value, setValue] = useState(\"一段不超过一百字的简介。\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit\n                value={value}\n                rows={3}\n                showCount\n                maxLength={100}\n                placeholder=\"简介（100 字以内）\"\n                onChange={(e) => setValue(e.target.value)}\n            />\n        \u003c/div>\n    );\n};\n\nexport default ShowCountDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fshow-count.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fshow-count.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/simple.demo.tsx",
        "title": "基础用法",
        "description": "最基础的多行文本输入；`rows` 控制初始可视行数，右下角可拖拽调整高度",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最基础的多行文本输入；`rows` 控制初始可视行数，右下角可拖拽调整高度\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst SimpleDemo = () => {\n    const [value, setValue] = useState(\"\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit\n                value={value}\n                rows={3}\n                placeholder=\"请输入备注\"\n                onChange={(e) => setValue(e.target.value)}\n            />\n        \u003c/div>\n    );\n};\n\nexport default SimpleDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fsimple.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fsimple.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "三种尺寸",
        "description": "`size` 控制内边距与字号排版（large / middle / small），可视高度仍由 `rows` 决定",
        "sourceCode": "export const meta = {\n    title: \"三种尺寸\",\n    description: \"`size` 控制内边距与字号排版（large / middle / small），可视高度仍由 `rows` 决定\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst SizeDemo = () => {\n    const [large, setLarge] = useState(\"\");\n    const [middle, setMiddle] = useState(\"\");\n    const [small, setSmall] = useState(\"\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit size=\"large\" rows={2} value={large} placeholder=\"large\" onChange={(e) => setLarge(e.target.value)} />\n            \u003cTextEdit size=\"middle\" rows={2} value={middle} placeholder=\"middle（默认）\" onChange={(e) => setMiddle(e.target.value)} />\n            \u003cTextEdit size=\"small\" rows={2} value={small} placeholder=\"small\" onChange={(e) => setSmall(e.target.value)} />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/status.demo.tsx",
        "title": "验证状态",
        "description": "`status` 设置 error / warning 边框与焦点光环，为表单校验提供即时反馈；请同时配合错误文案与 `aria-invalid` 使用，不要只靠颜色传达状态",
        "sourceCode": "export const meta = {\n    title: \"验证状态\",\n    description: \"`status` 设置 error / warning 边框与焦点光环，为表单校验提供即时反馈；请同时配合错误文案与 `aria-invalid` 使用，不要只靠颜色传达状态\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport TextEdit from \"../../src/index.js\";\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    padding: 1rem;\n    max-width: 480px;\n`;\n\nconst StatusDemo = () => {\n    const [errorValue, setErrorValue] = useState(\"内容包含敏感词\");\n    const [warningValue, setWarningValue] = useState(\"建议补充更多细节\");\n\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cTextEdit\n                status=\"error\"\n                rows={2}\n                value={errorValue}\n                aria-invalid\n                onChange={(e) => setErrorValue(e.target.value)}\n            />\n            \u003cTextEdit\n                status=\"warning\"\n                rows={2}\n                value={warningValue}\n                onChange={(e) => setWarningValue(e.target.value)}\n            />\n        \u003c/div>\n    );\n};\n\nexport default StatusDemo;\n",
        "previewPath": "/components/rc-text-edit/workbench/?__wake_demo=docs%2Fdemos%2Fstatus.demo.tsx",
        "workbenchPath": "/components/rc-text-edit/workbench/#/components/docs%2Fdemos%2Fstatus.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "TextEdit",
    "symbol": "TextEditProps",
    "props": [
        {
            "name": "containerRef",
            "required": false,
            "description": "容器 div 的 ref",
            "typeText": "Ref\u003cHTMLDivElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "textarea 元素的 ref",
            "typeText": "Ref\u003cHTMLTextAreaElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "设置多行文本输入框的大小（内边距与排版），默认为 middle； 可视高度由 rows / autoSize 决定",
            "typeText": "\"large\" | \"middle\" | \"small\" /** * 验证状态，影响边框颜色以提供即时反馈 */ status?: \"error\" | \"warning\" /** * 是否显示外层边框/背景/阴影，默认为 true。 * 设为 false 时容器变为无样式（透明、无边框）， * 用于嵌入到已有边框的宿主容器中（例如作为表单项内部的备注框） */ bordered?: boolean /** * 是否允许一键清除内容（仅受控模式生效） */ allowClear?: boolean /** * 点击清除按钮时的回调 */ onClear?: () => void /** * 是否显示字符计数，配合 maxLength 使用 */ showCount?: boolean /** * 高度随内容自动增长（CSS field-sizing: content，浏览器不支持时按 rows 回退）； * 开启后禁用手动拖拽调整尺寸，避免两种高度控制方式互相冲突 */ autoSize?: boolean /** * 手动拖拽调整尺寸的方向，默认为 vertical；autoSize 开启时忽略 */ resize?: \"none\" | \"vertical\" | \"both\"",
            "defaultValue": "\"middle\"",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
