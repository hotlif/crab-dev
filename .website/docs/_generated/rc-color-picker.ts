/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/colorPicker.demo.tsx",
        "title": "颜色选择器",
        "description": "可视化取色:透明度、文本输入、格式切换、预设色板、吸管取色、受控/非受控、尺寸与禁用。",
        "sourceCode": "export const meta = {\n    title: \"颜色选择器\",\n    description: \"可视化取色:透明度、文本输入、格式切换、预设色板、吸管取色、受控/非受控、尺寸与禁用。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport ColorPicker, { type ColorPreset, type OKLCHValue } from \"../../src/index.js\";\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n    > span:first-child {\n        width: 12rem;\n        font-size: 13px;\n        color: #666;\n    }\n`;\n\nconst presets: ColorPreset[] = [\n    {\n        label: \"品牌色\",\n        colors: [\n            { lightness: 0.62, chroma: 0.19, hue: 255 },\n            { lightness: 0.7, chroma: 0.16, hue: 145 },\n            { lightness: 0.68, chroma: 0.2, hue: 25 },\n        ],\n    },\n    {\n        label: \"中性色\",\n        colors: [\n            { lightness: 0.2, chroma: 0, hue: 0 },\n            { lightness: 0.5, chroma: 0, hue: 0 },\n            { lightness: 0.85, chroma: 0, hue: 0 },\n        ],\n    },\n];\n\nconst ColorPickerDemo = () => {\n    const [value, setValue] = useState\u003cOKLCHValue>({\n        lightness: 0.62,\n        chroma: 0.19,\n        hue: 255,\n        alpha: 1,\n    });\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003clabel className={rowStyle}>\n                \u003cspan>基础(透明度 / 输入 / 格式 / 吸管 / 预设 / 重置)\u003c/span>\n                \u003cColorPicker value={value} onValueChange={setValue} allowClear presets={presets} />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>非受控 + 尺寸(small / large)\u003c/span>\n                \u003cColorPicker defaultValue={{ lightness: 0.7, chroma: 0.16, hue: 145 }} size=\"small\" />\n                \u003cColorPicker defaultValue={{ lightness: 0.68, chroma: 0.2, hue: 25 }} size=\"large\" />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>无透明度 + RGB 格式\u003c/span>\n                \u003cColorPicker\n                    defaultValue={{ lightness: 0.7, chroma: 0.1, hue: 200 }}\n                    showAlpha={false}\n                    format=\"rgb\"\n                />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>禁用\u003c/span>\n                \u003cColorPicker value={value} onValueChange={setValue} disabled />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default ColorPickerDemo;\n",
        "previewPath": "/components/rc-color-picker/workbench/?__wake_demo=docs%2Fdemos%2FcolorPicker.demo.tsx",
        "workbenchPath": "/components/rc-color-picker/workbench/#/components/docs%2Fdemos%2FcolorPicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/colorPickerPanel.demo.tsx",
        "title": "颜色面板",
        "description": "内嵌式颜色面板:亮度 / 色度 / 色相 / 透明度 + 文本输入 + 预设色板。",
        "sourceCode": "export const meta = {\n    title: \"颜色面板\",\n    description: \"内嵌式颜色面板:亮度 / 色度 / 色相 / 透明度 + 文本输入 + 预设色板。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport { ColorPickerPanel, type OKLCHValue } from \"../../src/index.js\";\n\nconst presets: OKLCHValue[] = [\n    { lightness: 0.5, chroma: 0.2, hue: 0 },\n    { lightness: 0.7, chroma: 0.18, hue: 145 },\n    { lightness: 0.62, chroma: 0.19, hue: 255 },\n    { lightness: 0.8, chroma: 0.15, hue: 90 },\n];\n\nconst ColorPickerPanelDemo = () => {\n    const [value, setValue] = useState\u003cOKLCHValue>({\n        lightness: 0.6,\n        chroma: 0.12,\n        hue: 200,\n        alpha: 0.8,\n    });\n\n    return (\n        \u003cdiv\n            className={css`\n                width: 280px;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cColorPickerPanel value={value} onValueChange={setValue} presets={presets} />\n        \u003c/div>\n    );\n};\n\nexport default ColorPickerPanelDemo;\n",
        "previewPath": "/components/rc-color-picker/workbench/?__wake_demo=docs%2Fdemos%2FcolorPickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-color-picker/workbench/#/components/docs%2Fdemos%2FcolorPickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "ColorPicker",
    "symbol": "ColorPickerProps",
    "props": [
        {
            "name": "allowClear",
            "required": false,
            "description": "是否显示「重置」按钮,默认 false。",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "defaultValue",
            "required": false,
            "description": "非受控初始值。",
            "typeText": "OKLCHValue",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "disabled",
            "required": false,
            "description": "",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "format",
            "required": false,
            "description": "文本输入框初始展示格式,默认 \"hex\"。仅影响显示,输出恒为 OKLCHValue。",
            "typeText": "ColorFormat",
            "defaultValue": "\"hex\"",
            "deprecated": false
        },
        {
            "name": "locale",
            "required": false,
            "description": "",
            "typeText": "Locale",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onValueChange",
            "required": false,
            "description": "",
            "typeText": "(value: OKLCHValue) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "presets",
            "required": false,
            "description": "预设色板:扁平色或带标题的分组色。",
            "typeText": "ColorPreset[]",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "",
            "typeText": "Ref\u003cHTMLDivElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "showAlpha",
            "required": false,
            "description": "是否显示透明度滑块,默认 true。",
            "typeText": "boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "showEyeDropper",
            "required": false,
            "description": "是否显示吸管取色按钮(仍需浏览器支持 EyeDropper),默认 true。",
            "typeText": "boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "",
            "typeText": "\"small\" | \"medium\" | \"large\"",
            "defaultValue": "\"medium\"",
            "deprecated": false
        },
        {
            "name": "value",
            "required": false,
            "description": "受控值。与 defaultValue 二选一。",
            "typeText": "OKLCHValue",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
