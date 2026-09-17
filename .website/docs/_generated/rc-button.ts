/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础配置",
        "description": "在属性控件中组合文字、外观、尺寸与常用状态",
        "sourceCode": "import Button from '../../src/index.js';\n\ninterface BasicDemoProps {\n    /** 按钮内显示的操作名称。 */\n    children: string;\n    /** 按钮的视觉层级与操作语义。 */\n    appearance?: 'primary' | 'subtle' | 'dashed' | 'text' | 'link' | 'danger';\n    /** 按钮尺寸。 */\n    size?: 'large' | 'middle' | 'small';\n    /** 是否显示加载状态。 */\n    loading?: boolean;\n    /** 是否禁用当前操作。 */\n    disabled?: boolean;\n    /** 是否显示为选中状态。 */\n    isSelected?: boolean;\n    /** 是否撑满预览容器。 */\n    shouldFitContainer?: boolean;\n}\n\nexport const meta = {\n    title: '基础配置',\n    description: '在属性控件中组合文字、外观、尺寸与常用状态',\n    group: '基础组件',\n    component: 'Button 按钮',\n    order: 10,\n    args: {\n        children: '保存更改',\n        appearance: 'primary',\n        size: 'middle',\n        loading: false,\n        disabled: false,\n        isSelected: false,\n        shouldFitContainer: false,\n    },\n    background: 'surface',\n    padding: 'lg',\n};\n\nexport default function BasicDemo({ children, ...props }: BasicDemoProps) {\n    return (\n        \u003cdiv style={{ width: 'min(100%, 360px)' }}>\n            \u003cButton {...props}>{children}\u003c/Button>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/appearance.demo.tsx",
        "title": "外观设置",
        "description": "并排展示六种外观、属性值和适用场景；点击按钮查看反馈。",
        "sourceCode": "export const meta = {\n    title: \"外观设置\",\n    description: \"并排展示六种外观、属性值和适用场景；点击按钮查看反馈。\",\n};\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button, { type ButtonProps } from \"../../src/index.js\";\n\n\nconst stackStyle = css`display: grid; gap: ${token.space[\"section-gap\"]}; min-width: 0;`;\nconst gridStyle = css`\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space[\"group-gap\"]} * 9)), 1fr));\n    gap: ${token.space[\"section-gap\"]};\n`;\nconst cardStyle = css`\n    display: grid;\n    grid-template-rows: auto 1fr auto;\n    justify-items: start;\n    gap: ${token.space[\"component-gap\"]};\n    min-width: 0;\n    padding: ${token.space[\"section-gap\"]};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.radius.lg};\n    background: ${token.color.background.surface};\n`;\nconst noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;\nconst feedbackStyle = css`\n    padding: ${token.space[\"component-gap\"]} ${token.space[\"control-padding-x\"]};\n    border-radius: ${token.radius.md};\n    background: ${token.color.background.sunken};\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.body};\n`;\nconst appearances = [\n    { value: \"primary\", label: \"主要按钮\", hint: \"高强调度，用于保存、提交等主操作。\" },\n    { value: \"subtle\", label: \"常规按钮\", hint: \"默认外观，中性表面与浅阴影，悬停时显现品牌色，用于取消、返回和工具栏操作。\" },\n    { value: \"dashed\", label: \"虚线按钮\", hint: \"虚线描边，用于添加条件、新增内容。\" },\n    { value: \"text\", label: \"文字按钮\", hint: \"低强调度，用于工具栏和轻量操作。\" },\n    { value: \"link\", label: \"链接样式\", hint: \"文字强调；需要导航时再传入 href。\" },\n    { value: \"danger\", label: \"危险按钮\", hint: \"使用错误色，提示删除、清空等操作。\" },\n] satisfies Array\u003c{ value: NonNullable\u003cButtonProps[\"appearance\"]>; label: string; hint: string }>;\n\nexport default function Example() {\n    const [message, setMessage] = useState(\"点击任意按钮查看反馈，也可以用 Tab 观察焦点。这里只演示外观。\");\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={gridStyle}>\n                {appearances.map(item => (\n                    \u003csection key={item.value} className={cardStyle} aria-label={`${item.label}外观`}>\n                        \u003cstrong>{item.label} · \u003ccode>{item.value}\u003c/code>\u003c/strong>\n                        \u003cp className={noteStyle}>{item.hint}\u003c/p>\n                        \u003cButton appearance={item.value} onClick={() => setMessage(`已点击「${item.label}」，appearance=\"${item.value}\"。`)}>\n                            {item.label}\n                        \u003c/Button>\n                    \u003c/section>\n                ))}\n            \u003c/div>\n            \u003coutput className={feedbackStyle} aria-live=\"polite\">{message}\u003c/output>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fappearance.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fappearance.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/circle.demo.tsx",
        "title": "圆形按钮",
        "description": "`shape=\\\"circle\\\"` 搭配纯图标（无 children）适用于工具栏操作图标",
        "sourceCode": "\nexport const meta = {\n    title: \"圆形按钮\",\n    description: \"`shape=\\\\\\\"circle\\\\\\\"` 搭配纯图标（无 children）适用于工具栏操作图标\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { Plus, Pencil, Trash2, Search, Settings } from 'lucide-react';\n\nconst CircleDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.75rem;\n                `}\n            >\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} size=\"large\" />\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} />\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} size=\"small\" />\n            \u003c/div>\n\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.75rem;\n                `}\n            >\n                \u003cButton shape=\"circle\" aria-label=\"搜索\" icon={\u003cSearch />} />\n                \u003cButton shape=\"circle\" aria-label=\"编辑\" icon={\u003cPencil />} />\n                \u003cButton shape=\"circle\" aria-label=\"设置\" icon={\u003cSettings />} />\n                \u003cButton appearance=\"danger\" shape=\"circle\" aria-label=\"删除\" icon={\u003cTrash2 />} />\n                \u003cButton shape=\"circle\" aria-label=\"删除\" icon={\u003cTrash2 />} disabled />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CircleDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fcircle.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fcircle.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/danger.demo.tsx",
        "title": "危险操作",
        "description": "使用 `appearance=\\\"danger\\\"` 标识删除、清空等破坏性操作",
        "sourceCode": "\nexport const meta = {\n    title: \"危险操作\",\n    description: \"使用 `appearance=\\\\\\\"danger\\\\\\\"` 标识删除、清空等破坏性操作\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\n\nconst DangerDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cButton appearance=\"danger\">删除\u003c/Button>\n            \u003cButton appearance=\"danger\" disabled>禁用\u003c/Button>\n            \u003cButton appearance=\"danger\" loading>删除中\u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default DangerDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdanger.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdanger.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon.demo.tsx",
        "title": "图标按钮",
        "description": "通过 `icon` 属性设置按钮图标",
        "sourceCode": "export const meta = {\n    title: \"图标按钮\",\n    description: \"通过 `icon` 属性设置按钮图标\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Lollipop } from 'lucide-react';\nimport { useId, useState } from \"react\";\nimport Button from \"../../src/index.js\";\n\nconst IconDemo = () => {\n    const loadingCheckboxId = useId();\n    const [isLoading, setIsLoading] = useState(false);\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel htmlFor={loadingCheckboxId}>显示加载状态\u003c/label>\n                \u003cinput\n                    id={loadingCheckboxId}\n                    type=\"checkbox\"\n                    checked={isLoading}\n                    onChange={() => setIsLoading(!isLoading)}\n                />\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    flex-wrap: wrap;\n                    align-items: center;\n                    gap: 1rem;\n                    margin-bottom: 2rem;\n                `}\n            >\n                \n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"primary\"\n                >\n                    primary\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"subtle\"\n                >\n                    subtle\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"dashed\"\n                >\n                    dashed\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"text\"\n                >\n                    text\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"link\"\n                >\n                    link\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default IconDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Ficon.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Ficon.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon-after.demo.tsx",
        "title": "图标位置",
        "description": "`icon` 在文字左侧，`iconAfter` 在文字右侧，可同时使用",
        "sourceCode": "\nexport const meta = {\n    title: \"图标位置\",\n    description: \"`icon` 在文字左侧，`iconAfter` 在文字右侧，可同时使用\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { ArrowRight, ChevronDown, Download, Search } from 'lucide-react';\n\nconst IconAfterDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cButton icon={\u003cSearch />}>搜索\u003c/Button>\n            \u003cButton iconAfter={\u003cArrowRight />}>下一步\u003c/Button>\n            \u003cButton iconAfter={\u003cChevronDown />}>更多选项\u003c/Button>\n            \u003cButton appearance=\"primary\" iconAfter={\u003cDownload />}>下载\u003c/Button>\n            \u003cButton icon={\u003cSearch />} iconAfter={\u003cChevronDown />}>搜索并展开\u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default IconAfterDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Ficon-after.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Ficon-after.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/link-button.demo.tsx",
        "title": "链接按钮",
        "description": "传入 `href` 时渲染为 `\u003ca>` 元素，保留所有 Button 样式与交互",
        "sourceCode": "\nexport const meta = {\n    title: \"链接按钮\",\n    description: \"传入 `href` 时渲染为 `\u003ca>` 元素，保留所有 Button 样式与交互\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { ExternalLink } from 'lucide-react';\n\nconst LinkButtonDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cButton appearance=\"primary\" href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">\n                主要链接\n            \u003c/Button>\n            \u003cButton appearance=\"subtle\" href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">\n                次级链接\n            \u003c/Button>\n            \u003cButton\n                appearance=\"link\"\n                href=\"https://example.com\"\n                target=\"_blank\"\n                rel=\"noopener noreferrer\"\n                iconAfter={\u003cExternalLink />}\n            >\n                外部链接\n            \u003c/Button>\n            \u003cButton\n                appearance=\"subtle\"\n                href=\"https://example.com\"\n                disabled\n            >\n                禁用链接\n            \u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default LinkButtonDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Flink-button.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Flink-button.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "按钮尺寸",
        "description": "三档尺寸与六种外观共 18 种组合，同时展示默认高度与适用场景。",
        "sourceCode": "export const meta = {\n    title: \"按钮尺寸\",\n    description: \"三档尺寸与六种外观共 18 种组合，同时展示默认高度与适用场景。\",\n};\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button, { type ButtonProps } from \"../../src/index.js\";\n\n\nconst stackStyle = css`display: grid; gap: ${token.space[\"group-gap\"]}; min-width: 0;`;\nconst sectionStyle = css`\n    display: grid;\n    gap: ${token.space[\"component-gap\"]};\n    padding-bottom: ${token.space[\"section-gap\"]};\n    border-bottom: 1px solid ${token.color.border.subtle};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space[\"component-gap\"]};`;\nconst noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;\nconst sizes = [\n    { value: \"small\", label: \"小号\", height: \"24px\", description: \"紧凑工具栏、表格内操作。\" },\n    { value: \"middle\", label: \"中号（默认）\", height: \"32px\", description: \"普通表单和页面操作。\" },\n    { value: \"large\", label: \"大号\", height: \"40px\", description: \"需要更醒目的独立操作。\" },\n] satisfies Array\u003c{ value: NonNullable\u003cButtonProps[\"size\"]>; label: string; height: string; description: string }>;\nconst appearances = [\"primary\", \"subtle\", \"dashed\", \"text\", \"link\", \"danger\"] satisfies Array\u003cNonNullable\u003cButtonProps[\"appearance\"]>>;\n\nexport default function Example() {\n    const [message, setMessage] = useState(\"同一列外观一致，横向对比不同外观，纵向对比尺寸。\");\n    return (\n        \u003cdiv className={stackStyle}>\n            {sizes.map(size => (\n                \u003csection key={size.value} className={sectionStyle} aria-label={`${size.value} 尺寸对照`}>\n                    \u003cstrong>{size.label} · \u003ccode>{size.value}\u003c/code> · {size.height}\u003c/strong>\n                    \u003cp className={noteStyle}>{size.description}\u003c/p>\n                    \u003cdiv className={rowStyle}>\n                        {appearances.map(appearance => (\n                            \u003cButton key={appearance} size={size.value} appearance={appearance}\n                                onClick={() => setMessage(`当前体验：size=\"${size.value}\"，appearance=\"${appearance}\"。`)}>\n                                {appearance}\n                            \u003c/Button>\n                        ))}\n                    \u003c/div>\n                \u003c/section>\n            ))}\n            \u003cp className={noteStyle}>以上为默认鼠标环境下的高度；触控环境会扩展命中区域。\u003c/p>\n            \u003coutput className={noteStyle} aria-live=\"polite\">{message}\u003c/output>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "展示全部六种外观的 disabled 状态；禁用按钮不会触发操作。",
        "sourceCode": "\nexport const meta = {\n    title: \"禁用状态\",\n    description: \"展示全部六种外观的 disabled 状态；禁用按钮不会触发操作。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-wrap: wrap;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cButton\n                disabled\n                appearance=\"primary\"\n            >\n                primary\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"subtle\"\n            >\n                subtle\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"dashed\"\n            >\n                dashed\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"text\"\n            >\n                text\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"link\"\n            >\n                link\n            \u003c/Button>\n            \u003cButton disabled appearance=\"danger\">danger\u003c/Button>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载中",
        "description": "展示全部六种外观的 loading 状态；加载指示持续显示，方便比较。",
        "sourceCode": "\nexport const meta = {\n    title: \"加载中\",\n    description: \"展示全部六种外观的 loading 状态；加载指示持续显示，方便比较。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-wrap: wrap;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cButton\n                loading\n                appearance=\"primary\"\n            >\n                primary\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"subtle\"\n            >\n                subtle\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"dashed\"\n            >\n                dashed\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"text\"\n            >\n                text\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"link\"\n            >\n                link\n            \u003c/Button>\n            \u003cButton loading appearance=\"danger\">danger\u003c/Button>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Floading.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/selected.demo.tsx",
        "title": "选中状态",
        "description": "`isSelected` 用于工具栏过滤器、视图切换等 toggle 场景",
        "sourceCode": "\nexport const meta = {\n    title: \"选中状态\",\n    description: \"`isSelected` 用于工具栏过滤器、视图切换等 toggle 场景\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';\n\ntype Align = 'left' | 'center' | 'right';\n\nconst SelectedDemo = () => {\n    const [align, setAlign] = useState\u003cAlign>('left');\n    const [view, setView] = useState\u003c'table' | 'card'>('table');\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                `}\n            >\n                \u003cButton\n                    appearance=\"subtle\"\n                    icon={\u003cAlignLeft />}\n                    aria-label=\"左对齐\"\n                    isSelected={align === 'left'}\n                    onClick={() => setAlign('left')}\n                />\n                \u003cButton\n                    appearance=\"subtle\"\n                    icon={\u003cAlignCenter />}\n                    aria-label=\"居中对齐\"\n                    isSelected={align === 'center'}\n                    onClick={() => setAlign('center')}\n                />\n                \u003cButton\n                    appearance=\"subtle\"\n                    icon={\u003cAlignRight />}\n                    aria-label=\"右对齐\"\n                    isSelected={align === 'right'}\n                    onClick={() => setAlign('right')}\n                />\n            \u003c/div>\n\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                `}\n            >\n                \u003cButton\n                    appearance=\"text\"\n                    isSelected={view === 'table'}\n                    onClick={() => setView('table')}\n                >\n                    列表视图\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"text\"\n                    isSelected={view === 'card'}\n                    onClick={() => setView('card')}\n                >\n                    卡片视图\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default SelectedDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fselected.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fselected.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/button-group.demo.tsx",
        "title": "按钮组",
        "description": "`ButtonGroup` 统一管理子按钮的 `size` 和 `appearance`，适用于工具栏场景",
        "sourceCode": "\nexport const meta = {\n    title: \"按钮组\",\n    description: \"`ButtonGroup` 统一管理子按钮的 `size` 和 `appearance`，适用于工具栏场景\",\n};\n\nimport Button, { ButtonGroup } from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { Bold, Italic, Underline } from 'lucide-react';\nimport { useState } from 'react';\n\nconst ButtonGroupDemo = () => {\n    const [formats, setFormats] = useState\u003cSet\u003cstring>>(new Set());\n\n    const toggle = (key: string) => {\n        setFormats((prev) => {\n            const next = new Set(prev);\n            if (next.has(key)) { next.delete(key); } else { next.add(key); }\n            return next;\n        });\n    };\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cButtonGroup>\n                \u003cButton appearance=\"primary\">创建\u003c/Button>\n                \u003cButton>编辑\u003c/Button>\n                \u003cButton appearance=\"danger\">删除\u003c/Button>\n            \u003c/ButtonGroup>\n\n            \u003cButtonGroup size=\"small\">\n                \u003cButton>上一页\u003c/Button>\n                \u003cButton>1\u003c/Button>\n                \u003cButton isSelected>2\u003c/Button>\n                \u003cButton>3\u003c/Button>\n                \u003cButton>下一页\u003c/Button>\n            \u003c/ButtonGroup>\n\n            \u003cButtonGroup appearance=\"subtle\">\n                \u003cButton\n                    icon={\u003cBold />}\n                    aria-label=\"粗体\"\n                    isSelected={formats.has('bold')}\n                    onClick={() => toggle('bold')}\n                />\n                \u003cButton\n                    icon={\u003cItalic />}\n                    aria-label=\"斜体\"\n                    isSelected={formats.has('italic')}\n                    onClick={() => toggle('italic')}\n                />\n                \u003cButton\n                    icon={\u003cUnderline />}\n                    aria-label=\"下划线\"\n                    isSelected={formats.has('underline')}\n                    onClick={() => toggle('underline')}\n                />\n            \u003c/ButtonGroup>\n        \u003c/div>\n    );\n};\n\nexport default ButtonGroupDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbutton-group.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbutton-group.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "组合"
    }
] as const satisfies readonly ComponentDemoRecord[];
