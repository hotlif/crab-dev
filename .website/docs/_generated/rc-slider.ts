/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "滑块基础用法",
        "description": "这是一个滑块的基础示例",
        "learning": {
            "components": [
                "Slider"
            ],
            "props": [
                "min",
                "max",
                "step",
                "value",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"滑块基础用法\",\n    description: \"这是一个滑块的基础示例\",\n};\n\nimport { useState } from \"react\";\nimport Slider from \"../../src/slider.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst BaseDemo = () => {\n    const [value, setValue] = useState(20);\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 8px;\n            `}\n            style={{ width: 150 }}\n        >\n            \u003cSlider\n                min={0}\n                max={360}\n                step={1}\n                value={value}\n                onValueChange={setValue}\n            />\n\n            \u003cdiv\n                className={css`\n                    margin-top: 1rem;\n                `}\n            >\n                \u003clabel>Value:\u003c/label>\n                \u003cinput\n                    type=\"number\"\n                    value={value}\n                    onChange={(e) => {\n                        setValue(e.currentTarget.valueAsNumber)\n                    }}\n                />\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "三套设计与状态",
        "description": "macOS 的窄胶囊手柄、MD3 的细竖柄和 shadcn 的圆形手柄；支持键盘步进与从右到左布局。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Slider"
            ],
            "props": [
                "design",
                "value",
                "onValueChange",
                "aria-labelledby",
                "aria-valuetext",
                "disabled",
                "dir",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useId, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Slider from '../../src/slider.js';\n\nexport const meta = { title: '三套设计与状态', description: 'macOS 的窄胶囊手柄、MD3 的细竖柄和 shadcn 的圆形手柄；支持键盘步进与从右到左布局。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`\n    display: grid;\n    gap: ${token.space['stack-gap']};\n    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));\n    max-width: 100%;\n    min-width: 0;\n`;\nconst row = css`display: grid; gap: ${token.space['stack-gap']}; min-width: 0;`;\nexport default function DesignsDemo() {\n    const [value, setValue] = useState(40);\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        {(['macos', 'material', 'shadcn'] as const).map(design => \u003cConfigProvider key={design} design={design}>\n            \u003csection className={panel} aria-label={`${design} 滑块`}>\n                \u003cstrong>{design === 'material' ? 'MD3' : design === 'macos' ? 'macOS' : 'shadcn'} · {value}%\u003c/strong>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-brightness`}>亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-brightness`} aria-valuetext={`${value}%`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-disabled`}>不可用亮度\u003c/span>\n                    \u003cSlider value={65} disabled aria-labelledby={`${errorId}-${design}-disabled`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-rtl`}>从右到左的亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} dir=\"rtl\" aria-labelledby={`${errorId}-${design}-rtl`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-sync`}>同步亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-sync`} aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`} />\n                \u003c/div>\n                \u003csmall id={`${errorId}-${design}`}>设备未连接，当前值尚未同步。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>)}\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/expressive.demo.tsx",
        "title": "五档尺寸",
        "description": "尺寸会随设计风格调整；MD3 保留竖向手柄、轨道间隙与终点。",
        "learning": {
            "components": [
                "Slider"
            ],
            "props": [
                "size",
                "value",
                "onValueChange",
                "aria-label"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = { title: '五档尺寸', description: '尺寸会随设计风格调整；MD3 保留竖向手柄、轨道间隙与终点。' };\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Slider from '../../src/slider.js';\nconst stack = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));\n    max-width: 100%;\n`;\nexport default function Example() {\n    const [value, setValue] = useState(40);\n    return \u003cdiv className={stack}>{(['xs','s','m','l','xl'] as const).map(size => \u003cdiv key={size}>\n        \u003cspan>{size.toUpperCase()} · {value}\u003c/span>\n        \u003cSlider size={size} value={value} onValueChange={setValue} aria-label={`${size} 滑块`} />\n    \u003c/div>)}\u003c/div>;\n}\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fexpressive.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fexpressive.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
