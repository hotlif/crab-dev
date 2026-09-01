/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 options 传入选项, 默认选中第一个可用项。",
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
        "sourceCode": "export const meta = {\n    title: \"撑满容器\",\n    description: \"设置 `block` 让控制器铺满父容器, 各选项等宽分布。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Segmented from '../../src/index.js';\n\nconst containerStyle = css`\n    width: 360px;\n`;\n\nconst BlockDemo = () => {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cSegmented\n                block\n                options={[\n                    { label: '全部', value: 'all' },\n                    { label: '进行中', value: 'active' },\n                    { label: '已完成', value: 'done' },\n                ]}\n            />\n        \u003c/div>\n    );\n};\n\nexport default BlockDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fblock.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fblock.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控模式",
        "description": "传入 value 与 onChange 由外部状态托管选中值。原始值可作为 options 简写。",
        "sourceCode": "export const meta = {\n    title: \"受控模式\",\n    description: \"传入 value 与 onChange 由外部状态托管选中值。原始值可作为 options 简写。\",\n};\n\nimport { useState } from 'react';\nimport Segmented, { type SegmentedValue } from '../../src/index.js';\n\nconst ControlledDemo = () => {\n    const [value, setValue] = useState\u003cSegmentedValue>('列表');\n\n    return (\n        \u003cdiv>\n            \u003cSegmented options={['列表', '看板', '日历']} value={value} onChange={setValue} />\n            \u003cp>当前视图: {value}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default ControlledDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "整体 `disabled` 或对单个选项设 `disabled`, 键盘方向键会自动跳过禁用项。",
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
        "description": "通过 `size` 设置 `large`、`middle`、`small` 三档尺寸。",
        "sourceCode": "export const meta = {\n    title: \"尺寸\",\n    description: \"通过 `size` 设置 `large`、`middle`、`small` 三档尺寸。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Segmented from '../../src/index.js';\n\nconst options = ['日', '周', '月'];\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n                align-items: flex-start;\n            `}\n        >\n            \u003cSegmented size=\"large\" options={options} />\n            \u003cSegmented size=\"middle\" options={options} />\n            \u003cSegmented size=\"small\" options={options} />\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/with-icon.demo.tsx",
        "title": "带图标",
        "description": "选项可搭配 icon; 纯图标选项须提供 aria-label 保证可访问性。",
        "sourceCode": "export const meta = {\n    title: \"带图标\",\n    description: \"选项可搭配 icon; 纯图标选项须提供 aria-label 保证可访问性。\",\n};\n\nimport Segmented from '../../src/index.js';\n\nconst ListIcon = () => (\n    \u003csvg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\">\n        \u003cpath\n            d=\"M2 4h12M2 8h12M2 12h12\"\n            stroke=\"currentColor\"\n            strokeWidth=\"1.5\"\n            strokeLinecap=\"round\"\n        />\n    \u003c/svg>\n);\n\nconst GridIcon = () => (\n    \u003csvg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\">\n        \u003cpath\n            d=\"M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z\"\n            fill=\"currentColor\"\n        />\n    \u003c/svg>\n);\n\nconst WithIconDemo = () => {\n    return (\n        \u003cSegmented\n            options={[\n                { label: '列表', value: 'list', icon: \u003cListIcon /> },\n                { label: '网格', value: 'grid', icon: \u003cGridIcon /> },\n            ]}\n        />\n    );\n};\n\nexport default WithIconDemo;\n",
        "previewPath": "/components/rc-segmented/workbench/?__wake_demo=docs%2Fdemos%2Fwith-icon.demo.tsx",
        "workbenchPath": "/components/rc-segmented/workbench/#/components/docs%2Fdemos%2Fwith-icon.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
