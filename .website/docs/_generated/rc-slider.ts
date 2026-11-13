/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "滑块基础用法",
        "description": "将受控滑块与原生数字输入同步，演示 onValueChange 与原生 onChange 事件的适配。",
        "learning": {
            "components": [
                "Slider"
            ],
            "props": [
                "aria-labelledby",
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
        "sourceCode": "\nexport const meta = {\n    title: \"滑块基础用法\",\n    description: \"将受控滑块与原生数字输入同步，演示 onValueChange 与原生 onChange 事件的适配。\",\n};\n\nimport { useId, useState } from \"react\";\nimport Slider from \"@crab-dev/rc-slider\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nconst rootStyle = css`\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n    inline-size: calc(${token.size['136']} + ${token.size['136']});\n    max-inline-size: 100%;\n    gap: ${token.space['stack-gap']};\n`;\n\nconst nativeFieldStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['inline-gap']};\n    margin-block-start: ${token.space['component-gap']};\n`;\n\nconst nativeEditorStyle = css`\n    box-sizing: border-box;\n    inline-size: 100%;\n    min-inline-size: 0;\n    min-block-size: ${token.size['32']};\n    padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.shape.control};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    font: inherit;\n    &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }\n    @media (pointer: coarse) { min-block-size: ${token.size['touch-target']}; }\n`;\n\nconst BaseDemo = () => {\n    const [value, setValue] = useState(20);\n    const sliderLabelId = useId();\n    const numberId = useId();\n    return (\n        \u003cdiv className={rootStyle}>\n            \u003cspan id={sliderLabelId}>滑块角度\u003c/span>\n            \u003cSlider\n                aria-labelledby={sliderLabelId}\n                min={0}\n                max={360}\n                step={1}\n                value={value}\n                onValueChange={setValue}\n            />\n\n            \u003cdiv className={nativeFieldStyle}>\n                \u003clabel htmlFor={numberId}>角度数值\u003c/label>\n                \u003cinput\n                    className={nativeEditorStyle}\n                    id={numberId}\n                    type=\"number\"\n                    min={0}\n                    max={360}\n                    step={1}\n                    value={value}\n                    onChange={event => {\n                        const next = event.currentTarget.valueAsNumber;\n                        if (Number.isFinite(next)) setValue(Math.min(360, Math.max(0, next)));\n                    }}\n                />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "当前主题的交互状态",
        "description": "观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Slider"
            ],
            "props": [
                "designSystem",
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
        "sourceCode": "import { useId, useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport Slider from '@crab-dev/rc-slider';\n\nexport const meta = { title: '当前主题的交互状态', description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`\n    display: grid;\n    gap: ${token.space['stack-gap']};\n    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));\n    max-width: 100%;\n    min-width: 0;\n`;\nconst row = css`display: grid; gap: ${token.space['stack-gap']}; min-width: 0;`;\nexport default function DesignsDemo() {\n    const { designSystem: design } = useConfig();\n    const [value, setValue] = useState(40);\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        \u003cConfigProvider designSystem={design}>\n            \u003csection className={panel} aria-label={`${design} 滑块`}>\n                \u003cstrong>{designSystemRegistry[design].label} · {value}%\u003c/strong>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-brightness`}>亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-brightness`} aria-valuetext={`${value}%`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-disabled`}>不可用亮度\u003c/span>\n                    \u003cSlider value={65} disabled aria-labelledby={`${errorId}-${design}-disabled`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-rtl`}>从右到左的亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} dir=\"rtl\" aria-labelledby={`${errorId}-${design}-rtl`} />\n                \u003c/div>\n                \u003cdiv className={row}>\n                    \u003cspan id={`${errorId}-${design}-sync`}>同步亮度\u003c/span>\n                    \u003cSlider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-sync`} aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`} />\n                \u003c/div>\n                \u003csmall id={`${errorId}-${design}`}>设备未连接，当前值尚未同步。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/expressive.demo.tsx",
        "title": "五档尺寸",
        "description": "比较当前主题的五档滑块尺寸，操作手柄并使用键盘微调当前值。",
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
        "sourceCode": "export const meta = { title: '五档尺寸', description: \"比较当前主题的五档滑块尺寸，操作手柄并使用键盘微调当前值。\" };\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Slider from '@crab-dev/rc-slider';\nconst stack = css`\n    display: grid;\n    gap: ${token.space['section-gap']};\n    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));\n    max-width: 100%;\n`;\nexport default function Example() {\n    const [value, setValue] = useState(40);\n    return \u003cdiv className={stack}>{(['xs','s','m','l','xl'] as const).map(size => \u003cdiv key={size}>\n        \u003cspan>{size.toUpperCase()} · {value}\u003c/span>\n        \u003cSlider size={size} value={value} onValueChange={setValue} aria-label={`${size} 滑块`} />\n    \u003c/div>)}\u003c/div>;\n}\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fexpressive.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fexpressive.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系轨道状态矩阵",
        "description": "五档视觉尺寸，真实拖动与键盘调整，范围、错误与禁用状态。",
        "learning": {
            "components": [
                "Slider"
            ],
            "props": [
                "aria-labelledby",
                "size",
                "value",
                "onValueChange",
                "min",
                "max",
                "step",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Slider from \"@crab-dev/rc-slider\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = { title: \"三体系轨道状态矩阵\", description: \"五档视觉尺寸，真实拖动与键盘调整，范围、错误与禁用状态。\" };\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; max-inline-size: 36rem;\n    color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;`;\nconst limits = css`display: flex; justify-content: space-between; gap: ${token.space['inline-gap']};`;\nconst sizes = [\"xs\", \"s\", \"m\", \"l\", \"xl\"] as const;\nconst states = [\"default\", \"hover\", \"focus-visible\", \"dragging\", \"minimum\", \"maximum\", \"disabled\", \"error\", \"scientific\"] as const;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [size, setSize] = useState\u003ctypeof sizes[number]>(\"xs\");\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [value, setValue] = useState(40);\n    const [preciseValue, setPreciseValue] = useState(5e-7);\n    const scientific = state === 'scientific';\n    const id = useId();\n    const english = locale === \"en-US\";\n    return \u003csection className={scene} aria-label=\"Slider visual matrix\" data-visual-scene data-size={size} data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id + \"-size\"}>验收尺寸\u003c/label>{\" \"}\u003cselect id={id + \"-size\"} value={size} onChange={event => {\n            const next = event.currentTarget.value;\n            if (sizes.some(item => item === next)) setSize(next as typeof size);\n        }}>{sizes.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv>\u003clabel htmlFor={id + \"-state\"}>验收状态\u003c/label>{\" \"}\u003cselect id={id + \"-state\"} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cspan id={id + \"-label\"}>{english ? \"Preview opacity\" : \"预览不透明度\"}\u003c/span>\n            \u003cSlider aria-labelledby={id + \"-label\"} size={size} value={scientific ? preciseValue : value} onValueChange={scientific ? setPreciseValue : setValue}\n                min={scientific ? 1e-7 : 0} max={scientific ? 9e-7 : 100} step={scientific ? 1e-7 : 5} disabled={state === \"disabled\"}\n                aria-invalid={state === \"error\" || undefined} aria-describedby={id + \"-help\"} />\n            \u003cdiv className={limits}>\u003cspan>{scientific ? '1e-7' : '0%'}\u003c/span>\u003coutput>{scientific ? preciseValue : `${value}%`}\u003c/output>\u003cspan>{scientific ? '9e-7' : '100%'}\u003c/span>\u003c/div>\n            \u003cspan id={id + \"-help\"}>{scientific ? (english ? 'Use arrow keys for 1e-7 steps.' : '方向键按 1e-7 调整。') : state === \"error\" ? (english ? \"Review the opacity before publishing.\" : \"发布前请核对不透明度。\") : (english ? \"Use arrow keys for 5% steps.\" : \"方向键按 5% 调整。\")}\u003c/span>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-slider/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-slider/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以轨道间隙、竖向手柄和终点反馈表达连续值，尺寸影响真实操作几何。",
        "usage": "为滑块提供用途名称和可读数值，键盘步进应符合实际业务精度。",
        "exampleDescription": "调整五档尺寸的滑块，观察竖向手柄、轨道间隙和数值变化。",
        "demos": [
            "expressive.demo.tsx",
            "base.demo.tsx",
            "designs.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/sliders/overview",
            "https://material-web.dev/components/slider/",
            "https://github.com/material-components/material-web/tree/main/slider"
        ]
    },
    "macos": {
        "summary": "以细轨道和窄胶囊手柄提供桌面连续值调整，适合音量或设置检查器。",
        "usage": "当前值需要文字或数值补充，紧凑布局也要保持手柄可辨认和焦点可见。",
        "exampleDescription": "操作滑块并读取百分比，检查桌面手柄、禁用状态和键盘步进。",
        "demos": [
            "designs.demo.tsx",
            "base.demo.tsx",
            "expressive.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用简洁轨道和圆形手柄表达连续选择，选中部分与未选轨道清楚区分。",
        "usage": "给滑块标注单位和范围，避免仅凭位置让用户推断当前数值。",
        "exampleDescription": "拖动手柄后使用方向键微调，检查圆形手柄与中性轨道的反馈。",
        "demos": [
            "base.demo.tsx",
            "designs.demo.tsx",
            "expressive.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Slider 通过拖动轨道上的手柄选择连续或分段数值，适合快速调整并即时看到效果。它强调相对位置，不如数字输入适合精确键入。",
    "useWhen": [
        "音量、亮度、比例等范围值需要快速调整。",
        "min、max 和 step 明确，用户可以根据相对位置做决定。"
    ],
    "avoidWhen": [
        "精确数值输入使用 NumberEdit；少量离散选择使用 Segmented 或 Radio。"
    ],
    "essentials": [
        "min、max、step 和 value 必须使用同一单位。",
        "受控 value 与 onValueChange 配对，拖动和键盘调整都会通知最新值。",
        "标签或值显示帮助用户理解手柄位置代表什么。"
    ],
    "accessibility": [
        "提供可访问名称、当前值文字、上下限和键盘增减操作。",
        "轨道颜色之外要有可定位手柄与焦点，触控目标大于可见手柄。"
    ]
} as const;
