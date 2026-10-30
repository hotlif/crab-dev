/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 options 传入选项, 默认选中第一个可用项。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "options"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 options 传入选项, 默认选中第一个可用项。\",\n};\n\nimport Segmented from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cSegmented\n            options={[\n                { label: '日', value: 'day' },\n                { label: '周', value: 'week' },\n                { label: '月', value: 'month' },\n            ]}\n        />\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/block.demo.tsx",
        "title": "撑满容器",
        "description": "设置 `block` 让控制器铺满父容器, 各选项等宽分布。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "block",
                "options"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"撑满容器\",\n    description: \"设置 `block` 让控制器铺满父容器, 各选项等宽分布。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Segmented from '../../src/index.js';\n\nconst containerStyle = css`\n    width: 100%;\n    max-width: 360px;\n    min-width: 0;\n`;\n\nconst BlockDemo = () => {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cSegmented\n                block\n                options={[\n                    { label: '全部', value: 'all' },\n                    { label: '进行中', value: 'active' },\n                    { label: '已完成', value: 'done' },\n                ]}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BlockDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fblock.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fblock.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控模式",
        "description": "传入 value 与 onValueChange 由外部状态托管选中值。原始值可作为 options 简写。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "options",
                "value",
                "onValueChange"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"受控模式\",\n    description: \"传入 value 与 onValueChange 由外部状态托管选中值。原始值可作为 options 简写。\",\n};\n\nimport { useState } from 'react';\nimport Segmented, { type SegmentedValue } from '../../src/index.js';\n\nconst ControlledDemo = () => {\n    const [value, setValue] = useState\u003cSegmentedValue>('列表');\n\n    return (\n        \u003cdiv>\n            \u003cSegmented options={['列表', '看板', '日历']} value={value} onValueChange={setValue} />\n            \u003cp>当前视图: {value}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default ControlledDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "三套风格与完整状态",
        "description": "比较浅色和深色下的分段轮廓、选中反馈、禁用项与键盘焦点。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Segmented"
            ],
            "props": [
                "designSystem",
                "colorMode",
                "role",
                "aria-label",
                "block",
                "options",
                "disabled"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '三套风格与完整状态',\n    description: '比较浅色和深色下的分段轮廓、选中反馈、禁用项与键盘焦点。',\n};\n\nimport { css } from '@crab-dev/css';\nimport ConfigProvider from '@crab-dev/rc-config-provider';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport Segmented from '../../src/index.js';\n\nconst grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;\nconst panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;\n\nexport default function DesignsDemo() {\n    return (\n        \u003cdiv className={grid}>\n            {(['md3', 'apple', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (\n                \u003cConfigProvider key={`${design}-${mode}`} designSystem={design} colorMode={mode} className={panel} role=\"region\" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>\n                    \u003cstrong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}\u003c/strong>\n                    \u003cSegmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 时间范围`} block options={[\n                        { value: 'day', label: '日' },\n                        { value: 'week', label: '周' },\n                        { value: 'month', label: '月' },\n                        { value: 'year', label: '年', disabled: true },\n                    ]} />\n                    \u003cSegmented aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'} 禁用时间范围`} block disabled options={['日', '周', '月']} />\n                \u003c/ConfigProvider>\n            )))}\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "整体 `disabled` 或对单个选项设 `disabled`, 键盘方向键会自动跳过禁用项。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "options",
                "disabled",
                "defaultValue"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"整体 `disabled` 或对单个选项设 `disabled`, 键盘方向键会自动跳过禁用项。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Segmented from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1rem;\n    align-items: flex-start;\n`;\n\nconst DisabledDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cSegmented\n                options={[\n                    { label: '日', value: 'day' },\n                    { label: '周', value: 'week', disabled: true },\n                    { label: '月', value: 'month' },\n                ]}\n            />\n            \u003cSegmented disabled options={['日', '周', '月']} defaultValue=\"周\" />\n        \u003c/div>\n    );\n};\n\nexport default DisabledDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸",
        "description": "通过 `size` 设置 `large`、`medium`、`small` 三档尺寸。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "size",
                "options"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"通过 `size` 设置 `large`、`medium`、`small` 三档尺寸。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Segmented from '../../src/index.js';\n\nconst options = ['日', '周', '月'];\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n                align-items: flex-start;\n            `}\n        >\n            \u003cSegmented size=\"large\" options={options} />\n            \u003cSegmented size=\"medium\" options={options} />\n            \u003cSegmented size=\"small\" options={options} />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系分段状态矩阵",
        "description": "并列文字、图标与禁用选项，实际选择保留在同一组件实例。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "aria-label",
                "block",
                "disabled",
                "value",
                "onValueChange",
                "options",
                "defaultValue"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Segmented from \"@crab-dev/rc-segmented\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = { title: \"三体系分段状态矩阵\", description: \"并列文字、图标与禁用选项，实际选择保留在同一组件实例。\" };\nconst scene = css`\n    display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']};\n    max-inline-size: 42rem; min-inline-size: 0;\n    background: ${token.color.background.surface}; color: ${token.color.text.primary};\n`;\nconst samples = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; min-inline-size: 0;`;\nconst icon = \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" aria-hidden=\"true\">\u003cpath d=\"M4 7h16M4 12h16M4 17h16\" />\u003c/svg>;\nconst states = [\"default\", \"hover\", \"focus-visible\", \"pressed\", \"selected\", \"selected-hover\", \"selected-pressed\", \"disabled\", \"item-disabled\"] as const;\nexport default function VisualMatrixDemo() {\n    const { size, locale } = useConfig();\n    const [value, setValue] = useState\u003cstring | number>(\"day\");\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const id = useId();\n    const english = locale === \"en-US\";\n    return \u003csection className={scene} aria-label=\"Segmented visual matrix\" data-visual-scene data-state={state} data-size={size}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{\" \"}\u003cselect id={id} value={state} onChange={event => {\n            const next = event.currentTarget.value;\n            if (states.some(item => item === next)) setState(next as typeof state);\n        }}>{states.map(item => \u003coption key={item}>{item}\u003c/option>)}\u003c/select>\u003c/div>\n        \u003cdiv className={samples} data-visual-frame>\n            \u003cSegmented aria-label=\"Time range\" block disabled={state === \"disabled\"} value={value} onValueChange={setValue}\n                options={[\n                    { value: \"day\", label: english ? \"Day\" : \"日视图\", \"aria-label\": \"Day\" },\n                    { value: \"week\", label: english ? \"Week · shared project activity\" : \"周视图 · 团队共享项目动态\", \"aria-label\": \"Week\", icon },\n                    { value: \"month\", label: english ? \"Month\" : \"月视图\", \"aria-label\": \"Month\", disabled: true },\n                ]} />\n            \u003cSegmented aria-label=\"Icon views\" defaultValue=\"list\" options={[\n                { value: \"list\", label: \"\", icon, \"aria-label\": \"List\" },\n                { value: \"detail\", label: \"\", icon: \u003csvg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\">\u003cpath d=\"M4 4h16v16H4zM10 4v16\" />\u003c/svg>, \"aria-label\": \"Detail\" },\n            ]} />\n            \u003coutput aria-live=\"polite\">{english ? \"Range\" : \"当前范围\"}: {value}\u003c/output>\n        \u003c/div>\n    \u003c/section>;\n}\n\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/with-icon.demo.tsx",
        "title": "带图标",
        "description": "选项可搭配 icon; 纯图标选项须提供 aria-label 保证可访问性。",
        "learning": {
            "components": [
                "Segmented"
            ],
            "props": [
                "options"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"带图标\",\n    description: \"选项可搭配 icon; 纯图标选项须提供 aria-label 保证可访问性。\",\n};\n\nimport Segmented from '../../src/index.js';\n\nconst ListIcon = () => (\n    \u003csvg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\">\n        \u003cpath\n            d=\"M2 4h12M2 8h12M2 12h12\"\n            stroke=\"currentColor\"\n            strokeWidth=\"1.5\"\n            strokeLinecap=\"round\"\n        />\n    \u003c/svg>\n);\n\nconst GridIcon = () => (\n    \u003csvg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\">\n        \u003cpath\n            d=\"M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z\"\n            fill=\"currentColor\"\n        />\n    \u003c/svg>\n);\n\nconst WithIconDemo = () => {\n    return (\n        \u003cSegmented\n            options={[\n                { label: '列表', value: 'list', icon: \u003cListIcon /> },\n                { label: '网格', value: 'grid', icon: \u003cGridIcon /> },\n            ]}\n        />\n    );\n};\n\nexport default WithIconDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fwith-icon.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fwith-icon.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
