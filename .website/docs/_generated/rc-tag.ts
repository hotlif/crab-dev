/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "基础的标签展示，通过 `color` 属性设置不同颜色预设",
        "learning": {
            "components": [
                "Tag"
            ],
            "props": [
                "color"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"基础的标签展示，通过 `color` 属性设置不同颜色预设\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Tag from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 0.5rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cTag>Default\u003c/Tag>\n            \u003cTag color=\"primary\">Primary\u003c/Tag>\n            \u003cTag color=\"success\">Success\u003c/Tag>\n            \u003cTag color=\"warning\">Warning\u003c/Tag>\n            \u003cTag color=\"error\">Error\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/bordered.demo.tsx",
        "title": "无边框",
        "description": "设置 `bordered={false}` 可移除标签边框",
        "learning": {
            "components": [
                "Tag"
            ],
            "props": [
                "color",
                "bordered"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"无边框\",\n    description: \"设置 `bordered={false}` 可移除标签边框\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Tag from \"../../src/index.js\";\n\nconst BorderedDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003cTag>Default\u003c/Tag>\n                \u003cTag color=\"primary\">Primary\u003c/Tag>\n                \u003cTag color=\"success\">Success\u003c/Tag>\n                \u003cTag color=\"warning\">Warning\u003c/Tag>\n                \u003cTag color=\"error\">Error\u003c/Tag>\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cTag bordered={false}>Default\u003c/Tag>\n                \u003cTag bordered={false} color=\"primary\">Primary\u003c/Tag>\n                \u003cTag bordered={false} color=\"success\">Success\u003c/Tag>\n                \u003cTag bordered={false} color=\"warning\">Warning\u003c/Tag>\n                \u003cTag bordered={false} color=\"error\">Error\u003c/Tag>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default BorderedDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fbordered.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fbordered.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon.demo.tsx",
        "title": "图标标签",
        "description": "通过 `icon` 属性在标签前添加图标",
        "learning": {
            "components": [
                "Tag"
            ],
            "props": [
                "color",
                "icon"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"图标标签\",\n    description: \"通过 `icon` 属性在标签前添加图标\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Tag from \"../../src/index.js\";\n\nconst CheckIcon = () => (\n    \u003csvg viewBox=\"0 0 1024 1024\" fill=\"currentColor\" width=\"1em\" height=\"1em\">\n        \u003cpath d=\"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1 0.4-12.8-6.3-12.8z\" />\n    \u003c/svg>\n);\n\nconst ClockIcon = () => (\n    \u003csvg viewBox=\"0 0 1024 1024\" fill=\"currentColor\" width=\"1em\" height=\"1em\">\n        \u003cpath d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\" />\n        \u003cpath d=\"M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z\" />\n    \u003c/svg>\n);\n\nconst WarningIcon = () => (\n    \u003csvg viewBox=\"0 0 1024 1024\" fill=\"currentColor\" width=\"1em\" height=\"1em\">\n        \u003cpath d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z\" />\n    \u003c/svg>\n);\n\nconst IconDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 0.5rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cTag color=\"success\" icon={\u003cCheckIcon />}>已完成\u003c/Tag>\n            \u003cTag icon={\u003cClockIcon />}>处理中\u003c/Tag>\n            \u003cTag color=\"warning\" icon={\u003cWarningIcon />}>待审核\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default IconDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Ficon.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Ficon.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "标签尺寸",
        "description": "通过 `size` 属性设置标签尺寸",
        "learning": {
            "components": [
                "Tag"
            ],
            "props": [
                "size",
                "color"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"标签尺寸\",\n    description: \"通过 `size` 属性设置标签尺寸\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const controlId = useId();\n    const [size, setSize] = useState\u003c\"large\" | \"medium\" | \"small\">(\"medium\");\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1.5rem;\n                `}\n            >\n                \u003clabel htmlFor={controlId}>请选择大小\u003c/label>\n                \u003cselect\n                    id={controlId}\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"medium\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"medium\">Medium\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cTag size={size}>Default\u003c/Tag>\n                \u003cTag size={size} color=\"primary\">Primary\u003c/Tag>\n                \u003cTag size={size} color=\"success\">Success\u003c/Tag>\n                \u003cTag size={size} color=\"warning\">Warning\u003c/Tag>\n                \u003cTag size={size} color=\"error\">Error\u003c/Tag>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/checkable.demo.tsx",
        "title": "可选中标签",
        "description": "通过 `CheckableTag` 实现可选中/取消选中的标签",
        "learning": {
            "components": [
                "CheckableTag",
                "Tag"
            ],
            "props": [
                "checked",
                "onCheckedChange",
                "color"
            ],
            "events": [
                "onCheckedChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可选中标签\",\n    description: \"通过 `CheckableTag` 实现可选中/取消选中的标签\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useState } from \"react\";\nimport Tag, { CheckableTag } from \"../../src/index.js\";\n\nconst options = [\"Movies\", \"Books\", \"Music\", \"Sports\"];\n\nconst CheckableDemo = () => {\n    const [selected, setSelected] = useState\u003cstring[]>([\"Movies\"]);\n\n    const toggle = (item: string, checked: boolean) => {\n        setSelected(prev =>\n            checked ? [...prev, item] : prev.filter(value => value !== item)\n        );\n    };\n\n    return (\n        \u003cdiv>\n            \u003cp className={css`color: ${token.color.text.secondary}; font-size: ${token.typography.body['font-size']}; margin-block: 0 ${token.space['component-gap']};`}>选择内容类型，可同时选择多个选项：\u003c/p>\n            \u003cdiv\n                role=\"toolbar\"\n                aria-label=\"内容类型筛选\"\n                className={css`\n                    display: flex;\n                    gap: ${token.space['component-gap']};\n                    flex-wrap: wrap;\n                    margin-bottom: ${token.space['section-gap']};\n                `}\n            >\n                {options.map(item => (\n                    \u003cCheckableTag\n                        key={item}\n                        checked={selected.includes(item)}\n                        onCheckedChange={checked => toggle(item, checked)}\n                    >\n                        {item}\n                    \u003c/CheckableTag>\n                ))}\n            \u003c/div>\n            \u003cTag color=\"primary\">已选择：{selected.join(\" / \") || \"无\"}\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default CheckableDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fcheckable.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fcheckable.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "交互与自定义"
    },
    {
        "id": "docs/demos/closable.demo.tsx",
        "title": "可关闭标签",
        "description": "添加 `closable` 属性使标签可关闭，配合 `onClose` 回调处理关闭逻辑",
        "learning": {
            "components": [
                "Tag",
                "Button"
            ],
            "props": [
                "color",
                "closable",
                "onClose",
                "onClick"
            ],
            "events": [
                "onClose",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可关闭标签\",\n    description: \"添加 `closable` 属性使标签可关闭，配合 `onClose` 回调处理关闭逻辑\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst colors = [\"default\", \"primary\", \"success\", \"warning\", \"error\"] as const;\n\nconst ClosableDemo = () => {\n    const [visible, setVisible] = useState\u003cRecord\u003cstring, boolean>>(\n        Object.fromEntries(colors.map(c => [c, true]))\n    );\n\n    const handleClose = (color: string) => {\n        setVisible(prev => ({ ...prev, [color]: false }));\n    };\n\n    const allHidden = colors.every(c => !visible[c]);\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: ${token.space[\"component-gap\"]};\n                    flex-wrap: wrap;\n                    min-height: 32px;\n                `}\n            >\n                {colors.map(color =>\n                    visible[color] ? (\n                        \u003cTag\n                            key={color}\n                            color={color}\n                            closable\n                            onClose={() => handleClose(color)}\n                        >\n                            {color.charAt(0).toUpperCase() + color.slice(1)}\n                        \u003c/Tag>\n                    ) : null\n                )}\n                {allHidden && (\n                    \u003cButton\n                        onClick={() => setVisible(Object.fromEntries(colors.map(c => [c, true])))}\n                    >\n                        重置\n                    \u003c/Button>\n                )}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default ClosableDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fclosable.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fclosable.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "交互与自定义"
    },
    {
        "id": "docs/demos/custom-color-close-icon.demo.tsx",
        "title": "自定义颜色与关闭图标",
        "description": "支持自定义颜色字符串与 `closeIcon`",
        "learning": {
            "components": [
                "Tag"
            ],
            "props": [
                "color",
                "closable",
                "closeIcon",
                "onClose"
            ],
            "events": [
                "onClose"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"自定义颜色与关闭图标\",\n    description: \"支持自定义颜色字符串与 `closeIcon`\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst DotIcon = () => (\n    \u003cspan\n        className={css`\n            width: 6px;\n            height: 6px;\n            border-radius: 9999px;\n            background: currentColor;\n            display: inline-block;\n        `}\n    />\n);\n\nconst CustomColorAndCloseIconDemo = () => {\n    const [visible, setVisible] = useState(true);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                gap: 0.5rem;\n                flex-wrap: wrap;\n                align-items: center;\n            `}\n        >\n            \u003cTag color=\"#1677ff\">#1677ff\u003c/Tag>\n            \u003cTag color=\"#722ed1\">#722ed1\u003c/Tag>\n            \u003cTag color=\"#eb2f96\">#eb2f96\u003c/Tag>\n            {visible ? (\n                \u003cTag\n                    color=\"#13c2c2\"\n                    closable\n                    closeIcon={\u003cDotIcon />}\n                    onClose={() => setVisible(false)}\n                >\n                    Custom Close Icon\n                \u003c/Tag>\n            ) : (\n                \u003cTag color=\"success\">已关闭\u003c/Tag>\n            )}\n            \u003cTag closable closeIcon={false}>closeIcon=false\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default CustomColorAndCloseIconDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fcustom-color-close-icon.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fcustom-color-close-icon.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "交互与自定义"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "标签与筛选状态矩阵",
        "description": "状态标签、可关闭标签和可选择筛选共用语义角色，保留各自的真实交互。",
        "learning": {
            "components": [
                "Tag",
                "CheckableTag"
            ],
            "props": [
                "color",
                "bordered",
                "checked",
                "disabled",
                "onCheckedChange",
                "defaultChecked",
                "closable",
                "closeAriaLabel",
                "onClose"
            ],
            "events": [
                "onCheckedChange",
                "onClose"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Tag, { CheckableTag } from '@crab-dev/rc-tag';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '标签与筛选状态矩阵', description: '状态标签、可关闭标签和可选择筛选共用语义角色，保留各自的真实交互。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;\nconst row = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['group-gap']}; padding: ${token.space['inline-gap']};`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [state, setState] = useState('default');\n    const [checked, setChecked] = useState(false);\n    const [closed, setClosed] = useState(false);\n    const id = useId();\n    const english = locale === 'en-US';\n    return \u003csection className={frame} aria-label=\"Tag visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{' '}\u003cselect id={id} value={state} onChange={event => setState(event.currentTarget.value)}>\u003coption>default\u003c/option>\u003coption>disabled\u003c/option>\u003c/select>\u003c/div>\n        \u003cdiv className={row} aria-label=\"状态标签\">{(['default', 'primary', 'success', 'warning', 'error'] as const).map(color => \u003cTag key={color} color={color}>{color}\u003c/Tag>)}\u003cTag bordered={false}>{english ? 'Without border' : '无描边'}\u003c/Tag>\u003c/div>\n        \u003cdiv className={row} aria-label=\"筛选标签\">\n            \u003cCheckableTag checked={checked} disabled={state === 'disabled'} onCheckedChange={setChecked}>{english ? 'Assigned to me' : '分配给我'}\u003c/CheckableTag>\n            \u003cCheckableTag defaultChecked disabled={state === 'disabled'}>{english ? 'In progress' : '进行中'}\u003c/CheckableTag>\n            {!closed && \u003cTag closable closeAriaLabel=\"移除筛选\" onClose={() => setClosed(true)}>{english ? 'Long project classification label' : '项目分类长文本标签'}\u003c/Tag>}\n        \u003c/div>\n        \u003coutput aria-live=\"polite\">{closed ? '筛选已移除' : checked ? '筛选已选中' : '尚未选择筛选'}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以语义容器表达分类、状态或可切换筛选，文字与状态共同说明含义。",
        "usage": "静态标签、可关闭标签和可选择标签分别表达不同任务，不混用交互语义。",
        "exampleDescription": "切换筛选标签，观察选中容器与普通标签之间的区别。",
        "demos": [
            "checkable.demo.tsx",
            "basic.demo.tsx",
            "bordered.demo.tsx",
            "closable.demo.tsx",
            "custom-color-close-icon.demo.tsx",
            "icon.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/chips/overview",
            "https://material-web.dev/components/chip/",
            "https://github.com/material-components/material-web/tree/main/chips"
        ]
    },
    "macos": {
        "summary": "用紧凑标签和轻量状态底色补充桌面列表与设置内容。",
        "usage": "可关闭标签应保持文字和关闭入口清楚分开，避免过小的操作目标。",
        "exampleDescription": "移除一个标签，检查关闭按钮的焦点和剩余标签的排列。",
        "demos": [
            "closable.demo.tsx",
            "basic.demo.tsx",
            "bordered.demo.tsx",
            "checkable.demo.tsx",
            "custom-color-close-icon.demo.tsx",
            "icon.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以简洁描边或中性填充展示标签，分类名称保持短小且易扫描。",
        "usage": "状态色只作辅助，业务含义要能通过文字理解，自定义色仍需配对可读。",
        "exampleDescription": "比较描边标签与填充标签，检查文字、边界和状态区分。",
        "demos": [
            "bordered.demo.tsx",
            "basic.demo.tsx",
            "checkable.demo.tsx",
            "closable.demo.tsx",
            "custom-color-close-icon.demo.tsx",
            "icon.demo.tsx",
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
    "definition": "Tag 用简短文字标记分类、属性或状态，也可以作为可关闭输入片段或可切换筛选。静态标签、可关闭标签和可选择标签是不同交互语义。",
    "useWhen": [
        "记录需要显示类别、属性或简短状态。",
        "用户要移除一个已输入条件，或在一组标签中切换筛选。"
    ],
    "avoidWhen": [
        "主要动作使用 Button；长说明使用正文；大量筛选需要更完整的筛选器。"
    ],
    "essentials": [
        "先决定标签是只读、closable 还是 checkable。",
        "自定义颜色要保持文字对比，并避免与反馈色混淆。",
        "关闭只移除这一项，业务数据更新和撤销由外层处理。"
    ],
    "accessibility": [
        "关闭按钮有“移除 + 标签名”的可访问名称，不能只朗读“关闭”。",
        "可选择标签表达 pressed/selected 状态，静态 Tag 不应进入 Tab 顺序。"
    ]
} as const;
