/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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

export const documents = {
    "md3": {
        "summary": "以语义字段和浮层承载颜色选择，颜色空间与透明度编辑是本库扩展。",
        "usage": "用文本值辅助颜色感知，颜色预览与焦点、错误等界面语义分开表达。",
        "exampleDescription": "打开颜色字段并调整颜色，核对预览与文本值是否同步。",
        "demos": [
            "colorPicker.demo.tsx",
            "colorPickerPanel.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/styles/color/overview",
            "https://material-web.dev/theming/color/",
            "https://github.com/material-components/material-web/tree/main/color"
        ]
    },
    "macos": {
        "summary": "为桌面编辑器提供紧凑颜色字段和面板，色彩内容与周围工具层保持区别。",
        "usage": "编辑器中可使用独立面板，常规设置中优先从字段展开，保留清晰返回路径。",
        "exampleDescription": "在独立面板中修改颜色与透明度，观察数值输入与色块的关系。",
        "demos": [
            "colorPickerPanel.demo.tsx",
            "colorPicker.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以中性字段和有边界的面板承载颜色编辑，避免界面装饰干扰颜色判断。",
        "usage": "颜色选择器是组合扩展；业务需要明确输出格式和透明度的使用规则。",
        "exampleDescription": "调整颜色后检查输出值，再关闭面板确认字段的当前颜色反馈。",
        "demos": [
            "colorPicker.demo.tsx",
            "colorPickerPanel.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "ColorPicker 让用户从色板、预设或文本值中选择颜色；ColorPickerPanel 提供可嵌入的完整编辑面板。它负责颜色输入，不自动保证选出的颜色满足品牌或对比度要求。",
    "useWhen": [
        "主题、标注、图表或内容编辑允许用户自定义颜色。",
        "既需要快速预设，也需要输入精确颜色值。"
    ],
    "avoidWhen": [
        "业务状态色应由设计令牌决定，不应让用户随意选择；只需少量固定主题时使用 Radio 或 Select 更清楚。"
    ],
    "essentials": [
        "明确 value 的颜色格式、透明度和受控更新方式。",
        "预设色用于快速选择，文本输入用于精确校正，两者必须保持同步。",
        "选择结果要在真实背景上预览，单个色块不能证明可读性。"
    ],
    "accessibility": [
        "色块要有可读名称或数值，并提供键盘选择和可见焦点。",
        "任何颜色含义都必须有文字、图标或图案补充，同时验证前景背景对比度。"
    ]
} as const;
