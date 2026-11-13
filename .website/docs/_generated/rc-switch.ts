/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "最简单的 Switch 用法",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "checked",
                "onCheckedChange"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"最简单的 Switch 用法\",\n};\n\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cSwitch\n            checked={checked}\n            onCheckedChange={(val) => setChecked(val)}\n        >\n            开关\n        \u003c/Switch>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
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
                "Switch"
            ],
            "props": [
                "designSystem",
                "defaultChecked",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { useId } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport Switch from '@crab-dev/rc-switch';\n\nexport const meta = { title: '当前主题的交互状态', description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。' };\nconst panel = css`\n    display: grid;\n    gap: ${token.space['component-gap']};\n    padding: ${token.space['section-gap']};\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.md};\n`;\nconst stack = css`display: grid; gap: ${token.space['stack-gap']};`;\nexport default function DesignsDemo() {\n    const { designSystem: design } = useConfig();\n    const errorId = useId();\n    return \u003cdiv className={stack}>\n        \u003cConfigProvider designSystem={design}>\n            \u003csection className={panel} aria-label={`${design} 开关`}>\n                \u003cstrong>{designSystemRegistry[design].label}\u003c/strong>\n                \u003cSwitch>开启通知\u003c/Switch>\n                \u003cSwitch defaultChecked>自动同步\u003c/Switch>\n                \u003cSwitch disabled>暂不可用\u003c/Switch>\n                \u003cSwitch defaultChecked disabled>已开启且不可用\u003c/Switch>\n                \u003cSwitch defaultChecked aria-invalid=\"true\" aria-describedby={`${errorId}-${design}`}>云端备份\u003c/Switch>\n                \u003csmall id={`${errorId}-${design}`}>备份失败，请检查连接后重试。\u003c/small>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让开关处于禁用状态",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "disabled",
                "aria-label",
                "defaultChecked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让开关处于禁用状态\",\n};\n\nimport Switch from \"../../src/index.js\";\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cSwitch disabled aria-label=\"未选中禁用\">未选中禁用\u003c/Switch>\n            \u003cbr />\n            \u003cbr />\n            \u003cSwitch disabled defaultChecked>选中禁用\u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/rtl.demo.tsx",
        "title": "从右向左布局",
        "description": "手柄与状态层跟随文档方向；按下时手柄放大但中心保持不变。",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "defaultChecked"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Switch from '../../src/index.js';\n\nexport const meta = {\n    title: '从右向左布局',\n    description: '手柄与状态层跟随文档方向；按下时手柄放大但中心保持不变。',\n};\n\nexport default function RtlDemo() {\n    return \u003cdiv dir=\"rtl\">\u003cSwitch defaultChecked>RTL 开关\u003c/Switch>\u003c/div>;\n}\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Frtl.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Frtl.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "开关尺寸",
        "description": "通过 `size` 属性设置开关尺寸, 支持 `large`、`medium`、`small` 三种",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "size",
                "checked",
                "onCheckedChange"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"开关尺寸\",\n    description: \"通过 `size` 属性设置开关尺寸, 支持 `large`、`medium`、`small` 三种\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Switch from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [checked, setChecked] = useState(false);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cSwitch\n                size=\"large\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Large\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"medium\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Middle\n            \u003c/Switch>\n            \u003cSwitch\n                size=\"small\"\n                checked={checked}\n                onCheckedChange={(val) => setChecked(val)}\n            >\n                Small\n            \u003c/Switch>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系状态矩阵",
        "description": "真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。",
        "learning": {
            "components": [
                "Switch"
            ],
            "props": [
                "aria-label",
                "checked",
                "onCheckedChange",
                "disabled",
                "aria-invalid",
                "aria-describedby"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Switch from \"@crab-dev/rc-switch\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = {\n    title: \"三体系状态矩阵\",\n    description: \"真实输入对照默认、选择、错误、禁用和键盘焦点；切换外观保留选择。\",\n};\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 36rem; color: ${token.color.text.primary}; background: ${token.color.background.surface};\n`;\nconst samples = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    min-inline-size: 0; overflow-wrap: anywhere;\n`;\nconst states = [\"default\",\"hover\",\"focus-visible\",\"pressed\",\"selected\",\"selected-hover\",\"selected-focus-visible\",\"selected-pressed\",\"error\",\"selected-error\",\"disabled\",\"disabled-selected\"] as const;\n\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const [checked, setChecked] = useState(false);\n    const id = useId();\n    const english = locale === \"en-US\";\n    const effectiveChecked = state === \"disabled-selected\" || checked;\n    return \u003csection className={scene} aria-label=\"Switch visual matrix\" data-visual-scene data-size={size} data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cSwitch aria-label=\"Primary option\" checked={effectiveChecked}\n                onCheckedChange={setChecked} disabled={state.startsWith(\"disabled\")}\n                aria-invalid={state.includes(\"error\") || undefined}\n                aria-describedby={state.includes(\"error\") ? id + \"-error\" : undefined}\n            >{english ? \"Include archived projects and keep this selection when changing themes\" : \"包含归档项目，并在切换主题时保留选择\"}\u003c/Switch>\n            \u003cSwitch checked disabled aria-label=\"Unavailable selected option\">{english ? \"Selected · unavailable\" : \"已选择 · 暂不可用\"}\u003c/Switch>\n            {state.includes(\"error\") && \u003cspan id={id + \"-error\"} role=\"alert\">{english ? \"Review this selection before applying changes.\" : \"应用更改前请核对这一选择。\"}\u003c/span>}\n            \u003coutput aria-live=\"polite\">{english ? \"Selection\" : \"当前选择\"}: {effectiveChecked ? \"on\" : \"off\"}\u003c/output>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-switch/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-switch/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以轨道和随状态变化的手柄表达即时开关，选中和按压反馈各有含义。",
        "usage": "开关用于立即生效的设置，标签说明开启后的作用，不用于提交选择。",
        "exampleDescription": "使用鼠标与空格切换，观察手柄尺寸、轨道和禁用状态。",
        "demos": [
            "designs.demo.tsx",
            "basic.demo.tsx",
            "disabled.demo.tsx",
            "rtl.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/switch/overview",
            "https://material-web.dev/components/switch/",
            "https://github.com/material-components/material-web/tree/main/switch"
        ]
    },
    "macos": {
        "summary": "用紧凑胶囊轨道与稳定大小的手柄呈现桌面设置开关，强调当前启用状态。",
        "usage": "保持设置说明与开关对齐，反馈即时生效的结果，避免隐藏额外确认。",
        "exampleDescription": "切换桌面设置并读取结果，检查手柄位置和开启后的强调轨道。",
        "demos": [
            "basic.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "rtl.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "通过中性轨道和圆形手柄表达布尔设置，开启状态保持清晰对比。",
        "usage": "标签必须能解释设置用途，禁用开关也要保留当前值的可辨认性。",
        "exampleDescription": "比较可用与禁用开关，确认当前值、手柄位置和标签仍清楚。",
        "demos": [
            "disabled.demo.tsx",
            "basic.demo.tsx",
            "designs.demo.tsx",
            "rtl.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Switch 表示一个立即生效的开/关设置。它只适合清楚的二态值，标签描述设置本身，选中状态表示当前是否开启。",
    "useWhen": [
        "切换后可以立即保存或应用，例如通知、同步、显示选项。",
        "当前值比一次性动作更重要，用户需要随时看到开关状态。"
    ],
    "avoidWhen": [
        "提交表单时才生效的多个选择使用 Checkbox；普通动作使用 Button。"
    ],
    "essentials": [
        "checked 与 onValueChange 构成受控状态，label 不要写“开启/关闭”两套文案。",
        "切换失败时恢复真实值并说明原因，不能保持虚假视觉状态。",
        "disabled 只在确实不可操作时使用，并就近解释限制。"
    ],
    "accessibility": [
        "提供与设置含义一致的可访问名称，状态通过 checked 语义表达。",
        "标签与开关都可点击，焦点环清楚，RTL 下视觉方向与逻辑含义保持一致。"
    ]
} as const;
