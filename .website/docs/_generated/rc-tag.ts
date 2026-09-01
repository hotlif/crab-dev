/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "基础的标签展示，通过 `color` 属性设置不同颜色预设",
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
        "sourceCode": "export const meta = {\n    title: \"标签尺寸\",\n    description: \"通过 `size` 属性设置标签尺寸\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\");\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 1.5rem;\n                `}\n            >\n                \u003clabel>请选择大小\u003c/label>\n                \u003cselect\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                `}\n            >\n                \u003cTag size={size}>Default\u003c/Tag>\n                \u003cTag size={size} color=\"primary\">Primary\u003c/Tag>\n                \u003cTag size={size} color=\"success\">Success\u003c/Tag>\n                \u003cTag size={size} color=\"warning\">Warning\u003c/Tag>\n                \u003cTag size={size} color=\"error\">Error\u003c/Tag>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"可选中标签\",\n    description: \"通过 `CheckableTag` 实现可选中/取消选中的标签\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Tag, { CheckableTag } from \"../../src/index.js\";\n\nconst options = [\"Movies\", \"Books\", \"Music\", \"Sports\"];\n\nconst CheckableDemo = () => {\n    const [selected, setSelected] = useState\u003cstring[]>([\"Movies\"]);\n\n    const toggle = (item: string, checked: boolean) => {\n        setSelected(prev =>\n            checked ? [...prev, item] : prev.filter(value => value !== item)\n        );\n    };\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                    margin-bottom: 1rem;\n                `}\n            >\n                {options.map(item => (\n                    \u003cCheckableTag\n                        key={item}\n                        checked={selected.includes(item)}\n                        onChange={checked => toggle(item, checked)}\n                    >\n                        {item}\n                    \u003c/CheckableTag>\n                ))}\n            \u003c/div>\n            \u003cTag color=\"primary\">已选择：{selected.join(\" / \") || \"无\"}\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default CheckableDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"可关闭标签\",\n    description: \"添加 `closable` 属性使标签可关闭，配合 `onClose` 回调处理关闭逻辑\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst colors = [\"default\", \"primary\", \"success\", \"warning\", \"error\"] as const;\n\nconst ClosableDemo = () => {\n    const [visible, setVisible] = useState\u003cRecord\u003cstring, boolean>>(\n        Object.fromEntries(colors.map(c => [c, true]))\n    );\n\n    const handleClose = (color: string) => {\n        setVisible(prev => ({ ...prev, [color]: false }));\n    };\n\n    const allHidden = colors.every(c => !visible[c]);\n\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    flex-wrap: wrap;\n                    min-height: 32px;\n                `}\n            >\n                {colors.map(color =>\n                    visible[color] ? (\n                        \u003cTag\n                            key={color}\n                            color={color}\n                            closable\n                            onClose={() => handleClose(color)}\n                        >\n                            {color.charAt(0).toUpperCase() + color.slice(1)}\n                        \u003c/Tag>\n                    ) : null\n                )}\n                {allHidden && (\n                    \u003cbutton\n                        onClick={() => setVisible(Object.fromEntries(colors.map(c => [c, true])))}\n                    >\n                        重置\n                    \u003c/button>\n                )}\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default ClosableDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"自定义颜色与关闭图标\",\n    description: \"支持自定义颜色字符串与 `closeIcon`\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Tag from \"../../src/index.js\";\n\nconst DotIcon = () => (\n    \u003cspan\n        className={css`\n            width: 6px;\n            height: 6px;\n            border-radius: 9999px;\n            background: currentColor;\n            display: inline-block;\n        `}\n    />\n);\n\nconst CustomColorAndCloseIconDemo = () => {\n    const [visible, setVisible] = useState(true);\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                gap: 0.5rem;\n                flex-wrap: wrap;\n                align-items: center;\n            `}\n        >\n            \u003cTag color=\"#1677ff\">#1677ff\u003c/Tag>\n            \u003cTag color=\"#722ed1\">#722ed1\u003c/Tag>\n            \u003cTag color=\"#eb2f96\">#eb2f96\u003c/Tag>\n            {visible ? (\n                \u003cTag\n                    color=\"#13c2c2\"\n                    closable\n                    closeIcon={\u003cDotIcon />}\n                    onClose={() => setVisible(false)}\n                >\n                    Custom Close Icon\n                \u003c/Tag>\n            ) : (\n                \u003cTag color=\"success\">已关闭\u003c/Tag>\n            )}\n            \u003cTag closable closeIcon={false}>closeIcon=false\u003c/Tag>\n        \u003c/div>\n    );\n};\n\nexport default CustomColorAndCloseIconDemo;\n",
        "previewPath": "/components/rc-tag/workbench/?__wake_demo=docs%2Fdemos%2Fcustom-color-close-icon.demo.tsx",
        "workbenchPath": "/components/rc-tag/workbench/#/components/docs%2Fdemos%2Fcustom-color-close-icon.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "交互与自定义"
    }
] as const satisfies readonly ComponentDemoRecord[];
