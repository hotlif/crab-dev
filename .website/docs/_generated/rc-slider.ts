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
        "id": "docs/demos/expressive.demo.tsx",
        "title": "Expressive 五档尺寸",
        "description": "新版竖向手柄、轨道间隙、终点与五档轨道高度。",
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
        "sourceCode": "export const meta = { title: 'Expressive 五档尺寸', description: '新版竖向手柄、轨道间隙、终点与五档轨道高度。' };\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Slider from '../../src/slider.js';\nconst stack = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));\n    max-width: 100%;\n`;\nexport default function Example() {\n    const [value, setValue] = useState(40);\n    return \u003cdiv className={stack}>{(['xs','s','m','l','xl'] as const).map(size => \u003cdiv key={size}>\n        \u003cspan>{size.toUpperCase()} · {value}\u003c/span>\n        \u003cSlider size={size} value={value} onValueChange={setValue} aria-label={`${size} 滑块`} />\n    \u003c/div>)}\u003c/div>;\n}\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fexpressive.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fexpressive.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
