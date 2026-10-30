/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系取色状态矩阵",
        "description": "颜色数据、格式、透明度、预设与确认取消均保持真实交互。",
        "learning": {
            "components": [
                "ColorPicker"
            ],
            "props": [
                "aria-label",
                "value",
                "onValueChange",
                "disabled",
                "presets",
                "allowClear"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport ColorPicker, { type OKLCHValue } from \"@crab-dev/rc-color-picker\";\n\nexport const meta = { title: \"三体系取色状态矩阵\", description: \"颜色数据、格式、透明度、预设与确认取消均保持真实交互。\" };\nconst layout = css`padding: ${token.space['section-gap']}; display: grid; justify-items: start; gap: ${token.space['section-gap']}; min-height: 32rem; align-content: start;`;\nconst presets = [{ label: \"品牌预设\", colors: [{ lightness: 0.62, chroma: 0.19, hue: 255 }, { lightness: 0.7, chroma: 0.16, hue: 145 }] }];\nexport default function VisualMatrixDemo() {\n    const [state, setState] = useState(\"default\");\n    const [value, setValue] = useState\u003cOKLCHValue>({ lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0.75 });\n    return \u003csection aria-label=\"ColorPicker visual matrix\" className={layout}>\n        \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => setState(event.target.value)}>\u003coption>default\u003c/option>\u003coption>disabled\u003c/option>\u003c/select>\u003c/label>\n        \u003cColorPicker aria-label=\"主题颜色\" value={value} onValueChange={setValue} disabled={state === \"disabled\"} presets={presets} allowClear />\n        \u003coutput aria-label=\"已确认颜色\">{JSON.stringify(value)}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-color-picker/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-color-picker/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/colorPicker.demo.tsx",
        "title": "颜色选择器",
        "description": "可视化取色:透明度、文本输入、格式切换、预设色板、吸管取色、受控/非受控、尺寸与禁用。",
        "learning": {
            "components": [
                "ColorPicker"
            ],
            "props": [
                "value",
                "onValueChange",
                "allowClear",
                "presets",
                "defaultValue",
                "size",
                "showAlpha",
                "format",
                "disabled"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"颜色选择器\",\n    description: \"可视化取色:透明度、文本输入、格式切换、预设色板、吸管取色、受控/非受控、尺寸与禁用。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport ColorPicker, { type ColorPreset, type OKLCHValue } from \"../../src/index.js\";\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: ${token.space['component-gap']};\n    > span:first-child {\n        width: 12rem;\n        font-size: ${token.typography.body.medium['font-size']};\n        color: ${token.color.text.secondary};\n    }\n`;\n\nconst presets: ColorPreset[] = [\n    {\n        label: \"品牌色\",\n        colors: [\n            { lightness: 0.62, chroma: 0.19, hue: 255 },\n            { lightness: 0.7, chroma: 0.16, hue: 145 },\n            { lightness: 0.68, chroma: 0.2, hue: 25 },\n        ],\n    },\n    {\n        label: \"中性色\",\n        colors: [\n            { lightness: 0.2, chroma: 0, hue: 0 },\n            { lightness: 0.5, chroma: 0, hue: 0 },\n            { lightness: 0.85, chroma: 0, hue: 0 },\n        ],\n    },\n];\n\nconst ColorPickerDemo = () => {\n    const [value, setValue] = useState\u003cOKLCHValue>({\n        lightness: 0.62,\n        chroma: 0.19,\n        hue: 255,\n        alpha: 1,\n    });\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: ${token.space['group-gap']};\n                margin-bottom: ${token.space['section-gap']};\n            `}\n        >\n            \u003clabel className={rowStyle}>\n                \u003cspan>基础(透明度 / 输入 / 格式 / 吸管 / 预设 / 重置)\u003c/span>\n                \u003cColorPicker value={value} onValueChange={setValue} allowClear presets={presets} />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>非受控 + 尺寸(small / large)\u003c/span>\n                \u003cColorPicker defaultValue={{ lightness: 0.7, chroma: 0.16, hue: 145 }} size=\"small\" />\n                \u003cColorPicker defaultValue={{ lightness: 0.68, chroma: 0.2, hue: 25 }} size=\"large\" />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>无透明度 + RGB 格式\u003c/span>\n                \u003cColorPicker\n                    defaultValue={{ lightness: 0.7, chroma: 0.1, hue: 200 }}\n                    showAlpha={false}\n                    format=\"rgb\"\n                />\n            \u003c/label>\n\n            \u003clabel className={rowStyle}>\n                \u003cspan>禁用\u003c/span>\n                \u003cColorPicker value={value} onValueChange={setValue} disabled />\n            \u003c/label>\n        \u003c/div>\n    );\n};\n\nexport default ColorPickerDemo;\n",
        "previewPath": "/components/rc-color-picker/workbench/?__wake_demo=docs%2Fdemos%2FcolorPicker.demo.tsx",
        "workbenchPath": "/components/rc-color-picker/workbench/#/components/docs%2Fdemos%2FcolorPicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/colorPickerPanel.demo.tsx",
        "title": "颜色面板",
        "description": "内嵌式颜色面板:亮度 / 色度 / 色相 / 透明度 + 文本输入 + 预设色板。",
        "learning": {
            "components": [
                "ColorPickerPanel"
            ],
            "props": [
                "value",
                "onValueChange",
                "presets"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"颜色面板\",\n    description: \"内嵌式颜色面板:亮度 / 色度 / 色相 / 透明度 + 文本输入 + 预设色板。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport { ColorPickerPanel, type OKLCHValue } from \"../../src/index.js\";\n\nconst presets: OKLCHValue[] = [\n    { lightness: 0.5, chroma: 0.2, hue: 0 },\n    { lightness: 0.7, chroma: 0.18, hue: 145 },\n    { lightness: 0.62, chroma: 0.19, hue: 255 },\n    { lightness: 0.8, chroma: 0.15, hue: 90 },\n];\n\nconst ColorPickerPanelDemo = () => {\n    const [value, setValue] = useState\u003cOKLCHValue>({\n        lightness: 0.6,\n        chroma: 0.12,\n        hue: 200,\n        alpha: 0.8,\n    });\n\n    return (\n        \u003cdiv\n            className={css`\n                width: 280px;\n                margin-bottom: 2rem;\n            `}\n        >\n            \u003cColorPickerPanel value={value} onValueChange={setValue} presets={presets} />\n        \u003c/div>\n    );\n};\n\nexport default ColorPickerPanelDemo;\n",
        "previewPath": "/components/rc-color-picker/workbench/?__wake_demo=docs%2Fdemos%2FcolorPickerPanel.demo.tsx",
        "workbenchPath": "/components/rc-color-picker/workbench/#/components/docs%2Fdemos%2FcolorPickerPanel.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    }
] as const satisfies readonly ComponentDemoRecord[];
