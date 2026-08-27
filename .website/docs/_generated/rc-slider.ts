/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "滑块基础用法",
        "description": "这是一个滑块的基础示例",
        "sourceCode": "\nexport const meta = {\n    title: \"滑块基础用法\",\n    description: \"这是一个滑块的基础示例\",\n};\n\nimport { useState } from \"react\";\nimport Slider from \"../../src/slider.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst BaseDemo = () => {\n    const [value, setValue] = useState(20);\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                gap: 8px;\n            `}\n            style={{ width: 150 }}\n        >\n            \u003cSlider\n                min={0}\n                max={360}\n                step={1}\n                value={value}\n                onValueChange={setValue}\n            />\n\n            \u003cdiv\n                className={css`\n                    margin-top: 1rem;\n                `}\n            >\n                \u003clabel>Value:\u003c/label>\n                \u003cinput\n                    type=\"number\"\n                    value={value}\n                    onChange={(e) => {\n                        setValue(e.currentTarget.valueAsNumber)\n                    }}\n                />\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "compact"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Slider",
    "symbol": "SliderProps",
    "props": [
        {
            "name": "min",
            "required": false,
            "description": "",
            "typeText": "number max?: number step?: number onValueChange?: (value: number) => void",
            "defaultValue": "0",
            "deprecated": false
        },
        {
            "name": "value",
            "required": true,
            "description": "",
            "typeText": "number",
            "defaultValue": "0",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
