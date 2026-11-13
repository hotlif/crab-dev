/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "当前主题的交互状态",
        "description": "观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Button"
            ],
            "props": [
                "designSystem",
                "colorMode",
                "role",
                "aria-label",
                "appearance",
                "disabled"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '当前主题的交互状态',\n    description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。',\n};\n\nimport { css } from '@crab-dev/css';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\nimport Button from '@crab-dev/rc-button';\n\nconst grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;\nconst panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;\nconst actions = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;\n\nexport default function DesignsDemo() {\n    const { designSystem: design } = useConfig();\n    return (\n        \u003cdiv className={grid}>\n            {(['light', 'dark'] as const).map(mode => (\n                \u003cConfigProvider key={mode} designSystem={design} colorMode={mode} className={panel} role=\"region\" aria-label={`${designSystemRegistry[design].fullName} ${mode === 'light' ? '浅色' : '深色'}`}>\n                    \u003cstrong>{designSystemRegistry[design].fullName} · {mode === 'light' ? '浅色' : '深色'}\u003c/strong>\n                    \u003cdiv className={actions}>\n                        \u003cButton appearance=\"primary\">保存\u003c/Button>\n                        \u003cButton>取消\u003c/Button>\n                        \u003cButton appearance=\"text\">帮助\u003c/Button>\n                        \u003cButton disabled>不可用\u003c/Button>\n                    \u003c/div>\n                \u003c/ConfigProvider>\n            ))}\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "当前主题的状态"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础配置",
        "description": "在属性控件中组合文字、外观、尺寸与常用状态",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "isSelected"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\n\nconst containerStyle = css`width: 100%; max-width: calc(${token.size[40]} * 9);`;\n\ninterface BasicDemoProps {\n    /** 按钮内显示的操作名称。 */\n    children: string;\n    /** 按钮的视觉层级与操作语义。 */\n    appearance?: 'elevated' | 'primary' | 'tonal' | 'outlined' | 'text';\n    /** 危险操作语义。 */\n    danger?: boolean;\n    /** 按钮尺寸。 */\n    size?: 'xs' | 's' | 'm' | 'l' | 'xl';\n    /** 按钮形状，省略时跟随统一设计风格。 */\n    shape?: 'round' | 'square';\n    /** 是否显示加载状态。 */\n    loading?: boolean;\n    /** 是否禁用当前操作。 */\n    disabled?: boolean;\n    /** 是否显示为选中状态。 */\n    isSelected?: boolean;\n    /** 启用可切换按钮，Text 外观不支持。 */\n    toggle?: boolean;\n    /** 是否撑满预览容器。 */\n    shouldFitContainer?: boolean;\n}\n\nexport const meta = {\n    title: '基础配置',\n    description: '在属性控件中组合文字、外观、尺寸与常用状态',\n    group: '基础组件',\n    component: 'Button 按钮',\n    order: 10,\n    args: {\n        children: '保存更改',\n        appearance: 'primary',\n        size: 's',\n        danger: false,\n        loading: false,\n        disabled: false,\n        isSelected: false,\n        toggle: false,\n        shouldFitContainer: false,\n    },\n    background: 'surface',\n    padding: 'lg',\n};\n\nexport default function BasicDemo({ children, toggle, isSelected, ...props }: BasicDemoProps) {\n    return (\n        \u003cdiv className={containerStyle}>\n            \u003cButton {...props} isSelected={toggle && props.appearance !== 'text' ? isSelected : undefined}>{children}\u003c/Button>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/appearance.demo.tsx",
        "title": "五种按钮外观",
        "description": "Elevated、Filled、Tonal、Outlined 与 Text。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = { title: '五种按钮外观', description: 'Elevated、Filled、Tonal、Outlined 与 Text。' };\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '@crab-dev/rc-button';\n\nconst containerStyle = css`display: grid; gap: ${token.space['section-gap']}; min-width: 0;`;\nconst noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium['font-size']}; line-height: ${token.typography.body.medium['line-height']};`;\nconst actionsStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;\n\nexport default function Example() {\n    const [message, setMessage] = useState('选择一种外观，查看它的使用场景。');\n    return (\n        \u003csection className={containerStyle} aria-label=\"按钮操作层级\">\n            \u003cdiv className={actionsStyle}>\n                \u003cButton appearance=\"elevated\" onClick={() => setMessage('Elevated：用浅色表面与阴影，让操作从背景中浮起。')}>Elevated\u003c/Button>\n                \u003cButton appearance=\"primary\" onClick={() => setMessage('Filled：用于保存、提交等主要操作；API 保留 primary 名称。')}>Filled\u003c/Button>\n                \u003cButton appearance=\"tonal\" onClick={() => setMessage('Tonal：浅色填充，用于需要适度强调的次级操作。')}>Tonal\u003c/Button>\n                \u003cButton appearance=\"outlined\" onClick={() => setMessage('Outlined：默认普通按钮，适合取消、返回等操作。')}>Outlined\u003c/Button>\n                \u003cButton appearance=\"text\" onClick={() => setMessage('Text：用于说明、展开等低强调操作。')}>Text\u003c/Button>\n            \u003c/div>\n            \u003coutput className={noteStyle} aria-live=\"polite\">{message}\u003c/output>\n        \u003c/section>\n    );\n}\n",
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
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "shape",
                "aria-label",
                "icon",
                "size",
                "isSelected",
                "danger",
                "disabled"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "\nexport const meta = {\n    title: \"圆形按钮\",\n    description: \"`shape=\\\\\\\"circle\\\\\\\"` 搭配纯图标（无 children）适用于工具栏操作图标\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { Plus, Pencil, Trash2, Search, Settings } from 'lucide-react';\n\nconst CircleDemo = ({ isSelected }: { isSelected?: boolean }) => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.75rem;\n                `}\n            >\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} size=\"m\" isSelected={isSelected} />\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} isSelected={isSelected} />\n                \u003cButton appearance=\"primary\" shape=\"circle\" aria-label=\"新增\" icon={\u003cPlus />} size=\"xs\" isSelected={isSelected} />\n            \u003c/div>\n\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.75rem;\n                `}\n            >\n                \u003cButton shape=\"circle\" aria-label=\"搜索\" icon={\u003cSearch />} />\n                \u003cButton shape=\"circle\" aria-label=\"编辑\" icon={\u003cPencil />} />\n                \u003cButton shape=\"circle\" aria-label=\"设置\" icon={\u003cSettings />} />\n                \u003cButton appearance=\"primary\" danger shape=\"circle\" aria-label=\"删除\" icon={\u003cTrash2 />} />\n                \u003cButton shape=\"circle\" aria-label=\"删除\" icon={\u003cTrash2 />} disabled />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default CircleDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fcircle.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fcircle.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/danger.demo.tsx",
        "title": "危险操作",
        "description": "用 danger 定制错误色角色，保留五种按钮各自的视觉层级。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "danger",
                "disabled",
                "loading"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"危险操作\",\n    description: \"用 danger 定制错误色角色，保留五种按钮各自的视觉层级。\",\n};\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nconst rowStyle = css`display: flex; align-items: center; gap: ${token.space['component-gap']}; flex-wrap: wrap;`;\nexport default function DangerDemo() {\n    return \u003cdiv className={rowStyle}>\n        \u003cButton appearance=\"primary\" danger>删除项目\u003c/Button>\n        \u003cButton appearance=\"tonal\" danger>移至回收站\u003c/Button>\n        \u003cButton appearance=\"elevated\" danger>移除附件\u003c/Button>\n        \u003cButton danger>移除成员\u003c/Button>\n        \u003cButton appearance=\"text\" danger>清空筛选\u003c/Button>\n        \u003cButton appearance=\"primary\" danger disabled>不可删除\u003c/Button>\n        \u003cButton appearance=\"primary\" danger loading>正在删除\u003c/Button>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdanger.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdanger.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon.demo.tsx",
        "title": "图标按钮",
        "description": "通过 icon 设置按钮图标，使用切换按钮对照正常与加载状态。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "isSelected",
                "onClick",
                "loading",
                "icon",
                "appearance"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"图标按钮\",\n    description: \"通过 icon 设置按钮图标，使用切换按钮对照正常与加载状态。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Lollipop } from 'lucide-react';\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useState } from \"react\";\nimport Button from \"../../src/index.js\";\n\nconst IconDemo = () => {\n    const [isLoading, setIsLoading] = useState(false);\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    margin-bottom: ${token.space[\"section-gap\"]};\n                `}\n            >\n                \u003cButton isSelected={isLoading} onClick={() => setIsLoading(loading => !loading)}>显示加载状态\u003c/Button>\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    flex-wrap: wrap;\n                    align-items: center;\n                    gap: ${token.space[\"section-gap\"]};\n                    margin-bottom: calc(${token.space[\"section-gap\"]} * 2);\n                `}\n            >\n                \n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"primary\"\n                >\n                    primary\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"outlined\"\n                >\n                    Outlined\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"text\"\n                >\n                    text\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default IconDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Ficon.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Ficon.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon-after.demo.tsx",
        "title": "图标位置",
        "description": "M3 推荐单个前置图标；iconAfter 保留为 Material Web 支持的后置图标扩展。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "icon",
                "iconAfter",
                "appearance"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "\nexport const meta = {\n    title: \"图标位置\",\n    description: \"M3 推荐单个前置图标；iconAfter 保留为 Material Web 支持的后置图标扩展。\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { ArrowRight, ChevronDown, Download, Search } from 'lucide-react';\n\nconst IconAfterDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cButton icon={\u003cSearch />}>搜索\u003c/Button>\n            \u003cButton iconAfter={\u003cArrowRight />}>下一步\u003c/Button>\n            \u003cButton iconAfter={\u003cChevronDown />}>更多选项\u003c/Button>\n            \u003cButton appearance=\"primary\" iconAfter={\u003cDownload />}>下载\u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default IconAfterDemo;\n",
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
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "href",
                "target",
                "rel",
                "iconAfter",
                "disabled"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "\nexport const meta = {\n    title: \"链接按钮\",\n    description: \"传入 `href` 时渲染为 `\u003ca>` 元素，保留所有 Button 样式与交互\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { ExternalLink } from 'lucide-react';\n\nconst LinkButtonDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n                flex-wrap: wrap;\n            `}\n        >\n            \u003cButton appearance=\"primary\" href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">\n                主要链接\n            \u003c/Button>\n            \u003cButton appearance=\"outlined\" href=\"https://example.com\" target=\"_blank\" rel=\"noopener noreferrer\">\n                次级链接\n            \u003c/Button>\n            \u003cButton\n                appearance=\"text\"\n                href=\"https://example.com\"\n                target=\"_blank\"\n                rel=\"noopener noreferrer\"\n                iconAfter={\u003cExternalLink />}\n            >\n                外部链接\n            \u003c/Button>\n            \u003cButton\n                appearance=\"outlined\"\n                href=\"https://example.com\"\n                disabled\n            >\n                禁用链接\n            \u003c/Button>\n        \u003c/div>\n    );\n};\n\nexport default LinkButtonDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Flink-button.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Flink-button.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "按钮尺寸",
        "description": "五档尺寸与五种外观共 25 种组合，同时展示默认高度与适用场景。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "size",
                "appearance",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"按钮尺寸\",\n    description: \"五档尺寸与五种外观共 25 种组合，同时展示默认高度与适用场景。\",\n};\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Button, { type ButtonProps } from \"../../src/index.js\";\n\n\nconst stackStyle = css`display: grid; gap: ${token.space[\"group-gap\"]}; min-width: 0;`;\nconst sectionStyle = css`\n    display: grid;\n    gap: ${token.space[\"component-gap\"]};\n    padding-bottom: ${token.space[\"section-gap\"]};\n    border-bottom: 1px solid ${token.color.border.subtle};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space[\"component-gap\"]};`;\nconst noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;\nconst sizes = [\n    { value: \"xs\", label: \"XS\", height: \"32px\", description: \"紧凑工具栏、表格内操作。\" },\n    { value: \"s\", label: \"S（默认）\", height: \"36px\", description: \"普通表单和页面操作。\" },\n    { value: \"m\", label: \"M\", height: \"40px\", description: \"需要更醒目的独立操作。\" },\n    { value: \"l\", label: \"L\", height: \"48px\", description: \"页面主要操作与强调区域。\" },\n    { value: \"xl\", label: \"XL\", height: \"56px\", description: \"少量关键操作与大屏突出内容。\" },\n] satisfies Array\u003c{ value: NonNullable\u003cButtonProps[\"size\"]>; label: string; height: string; description: string }>;\nconst appearances = [\"elevated\", \"primary\", \"tonal\", \"outlined\", \"text\"] satisfies Array\u003cNonNullable\u003cButtonProps[\"appearance\"]>>;\n\nexport default function Example() {\n    const [message, setMessage] = useState(\"同一列外观一致，横向对比不同外观，纵向对比尺寸。\");\n    return (\n        \u003cdiv className={stackStyle}>\n            {sizes.map(size => (\n                \u003csection key={size.value} className={sectionStyle} aria-label={`${size.value} 尺寸对照`}>\n                    \u003cstrong>{size.label} · \u003ccode>{size.value}\u003c/code> · {size.height}\u003c/strong>\n                    \u003cp className={noteStyle}>{size.description}\u003c/p>\n                    \u003cdiv className={rowStyle}>\n                        {appearances.map(appearance => (\n                            \u003cButton key={appearance} size={size.value} appearance={appearance}\n                                onClick={() => setMessage(`当前体验：size=\"${size.value}\"，appearance=\"${appearance}\"。`)}>\n                                {appearance}\n                            \u003c/Button>\n                        ))}\n                    \u003c/div>\n                \u003c/section>\n            ))}\n            \u003cp className={noteStyle}>以上为默认鼠标环境下的高度；触控环境会扩展命中区域。\u003c/p>\n            \u003coutput className={noteStyle} aria-live=\"polite\">{message}\u003c/output>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "对照五种按钮外观的禁用状态。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "disabled",
                "appearance"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '禁用状态',\n    description: '对照五种按钮外观的禁用状态。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '../../src/index.js';\n\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;\n\nexport default function Example() {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cButton disabled appearance=\"elevated\">Elevated\u003c/Button>\n            \u003cButton disabled appearance=\"primary\">Filled\u003c/Button>\n            \u003cButton disabled appearance=\"tonal\">Tonal\u003c/Button>\n            \u003cButton disabled appearance=\"outlined\">Outlined\u003c/Button>\n            \u003cButton disabled appearance=\"text\">Text\u003c/Button>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载中",
        "description": "对照五种按钮外观的加载状态。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "loading",
                "appearance"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '加载中',\n    description: '对照五种按钮外观的加载状态。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '../../src/index.js';\n\nconst rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['section-gap']};`;\n\nexport default function Example() {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cButton loading appearance=\"elevated\">Elevated\u003c/Button>\n            \u003cButton loading appearance=\"primary\">Filled\u003c/Button>\n            \u003cButton loading appearance=\"tonal\">Tonal\u003c/Button>\n            \u003cButton loading appearance=\"outlined\">Outlined\u003c/Button>\n            \u003cButton loading appearance=\"text\">Text\u003c/Button>\n        \u003c/div>\n    );\n}\n",
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
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "appearance",
                "icon",
                "aria-label",
                "isSelected",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"选中状态\",\n    description: \"`isSelected` 用于工具栏过滤器、视图切换等 toggle 场景\",\n};\n\nimport Button from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';\n\ntype Align = 'left' | 'center' | 'right';\n\nconst SelectedDemo = () => {\n    const [align, setAlign] = useState\u003cAlign>('left');\n    const [view, setView] = useState\u003c'table' | 'card'>('table');\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                `}\n            >\n                \u003cButton\n                    appearance=\"outlined\"\n                    icon={\u003cAlignLeft />}\n                    aria-label=\"左对齐\"\n                    isSelected={align === 'left'}\n                    onClick={() => setAlign('left')}\n                />\n                \u003cButton\n                    appearance=\"outlined\"\n                    icon={\u003cAlignCenter />}\n                    aria-label=\"居中对齐\"\n                    isSelected={align === 'center'}\n                    onClick={() => setAlign('center')}\n                />\n                \u003cButton\n                    appearance=\"outlined\"\n                    icon={\u003cAlignRight />}\n                    aria-label=\"右对齐\"\n                    isSelected={align === 'right'}\n                    onClick={() => setAlign('right')}\n                />\n            \u003c/div>\n\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                `}\n            >\n                \u003cButton\n                    appearance=\"outlined\"\n                    isSelected={view === 'table'}\n                    onClick={() => setView('table')}\n                >\n                    列表视图\n                \u003c/Button>\n                \u003cButton\n                    appearance=\"outlined\"\n                    isSelected={view === 'card'}\n                    onClick={() => setView('card')}\n                >\n                    卡片视图\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default SelectedDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fselected.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fselected.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "完整操作状态矩阵",
        "description": "逐档核对五种外观的真实交互、选中、禁用和加载状态；尺寸与页面密度独立。",
        "learning": {
            "components": [
                "Button"
            ],
            "props": [
                "data-appearance",
                "appearance",
                "size",
                "disabled",
                "loading",
                "isSelected",
                "shape",
                "icon",
                "iconAfter",
                "aria-label",
                "danger",
                "shouldFitContainer"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport Button, { type ButtonProps } from \"@crab-dev/rc-button\";\nimport { useConfig } from \"@crab-dev/rc-config-provider\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport { useId, useState } from \"react\";\n\nexport const meta = {\n    title: \"完整操作状态矩阵\",\n    description: \"逐档核对五种外观的真实交互、选中、禁用和加载状态；尺寸与页面密度独立。\",\n};\n\nconst scene = css`\n    display: grid;\n    grid-template-columns: minmax(0, 1fr);\n    gap: ${token.space['group-gap']};\n    padding: ${token.space['group-gap']};\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst actions = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;\nconst sizes = [\"xs\", \"s\", \"m\", \"l\", \"xl\"] as const;\nconst states = [\"default\", \"disabled\", \"selected\", \"unselected\", \"loading\", \"variants\"] as const;\nconst icon = \u003csvg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\u003cpath fill=\"currentColor\" d=\"M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z\" />\u003c/svg>;\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const id = useId();\n    const [size, setSize] = useState\u003cNonNullable\u003cButtonProps['size']>>(\"s\");\n    const [state, setState] = useState\u003ctypeof states[number]>(\"default\");\n    const english = locale === \"en-US\";\n    return \u003csection className={scene} aria-label=\"Button visual matrix\">\n        \u003cdiv className={actions}>\n            \u003clabel htmlFor={`${id}-size`}>验收尺寸\u003c/label>\n            \u003cselect id={`${id}-size`} value={size} onChange={event => {\n                const value = event.currentTarget.value;\n                if (sizes.some(item => item === value)) setSize(value as typeof size);\n            }}>{sizes.map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\n            \u003clabel htmlFor={`${id}-state`}>验收状态\u003c/label>\n            \u003cselect id={`${id}-state`} value={state} onChange={event => {\n                const value = event.currentTarget.value;\n                if (states.some(item => item === value)) setState(value as typeof state);\n            }}>{states.map(value => \u003coption key={value}>{value}\u003c/option>)}\u003c/select>\n        \u003c/div>\n        \u003cdiv className={actions} data-visual-scene data-size={size} data-state={state}>\n            {([\"primary\", \"tonal\", \"outlined\", \"text\", \"elevated\"] as const).map(appearance => \u003cButton key={appearance}\n                data-appearance={appearance} appearance={appearance} size={size}\n                disabled={state === \"disabled\"} loading={state === \"loading\"}\n                isSelected={appearance !== \"text\" && (state === \"selected\" || state === \"unselected\") ? state === \"selected\" : undefined}\n            >{english ? `Save ${appearance}` : `保存 · ${appearance}`}\u003c/Button>)}\n        \u003c/div>\n        {state === \"variants\" && \u003c>\n            \u003cdiv className={actions} aria-label=\"Shapes and icons\">\n                \u003cButton size={size} shape=\"square\" icon={icon}>Square\u003c/Button>\n                \u003cButton size={size} shape=\"round\" iconAfter={icon}>Round\u003c/Button>\n                \u003cButton size={size} shape=\"circle\" icon={icon} aria-label=\"Add item\" />\n            \u003c/div>\n            \u003cdiv className={actions} aria-label=\"Danger actions\">\n                {([\"primary\", \"tonal\", \"outlined\", \"text\", \"elevated\"] as const).map(appearance => \u003cButton key={appearance} size={size} appearance={appearance} danger icon={icon}>{english ? \"Delete\" : \"删除\"}\u003c/Button>)}\n            \u003c/div>\n            \u003cdiv className={actions} aria-label=\"Compatibility appearances\">\n                {([\"danger\", \"link\", \"dashed\", \"subtle\"] as const).map(appearance => \u003cButton key={appearance} size={size} appearance={appearance}>{appearance}\u003c/Button>)}\n            \u003c/div>\n            \u003cButton size={size} shouldFitContainer>保存完整工作区 · Save the complete workspace\u003c/Button>\n        \u003c/>}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/button-group.demo.tsx",
        "title": "按钮组",
        "description": "`ButtonGroup` 统一管理子按钮的 `size` 和 `appearance`，适用于工具栏场景",
        "learning": {
            "components": [
                "ButtonGroup",
                "Button"
            ],
            "props": [
                "appearance",
                "danger",
                "size",
                "isSelected",
                "icon",
                "aria-label",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"按钮组\",\n    description: \"`ButtonGroup` 统一管理子按钮的 `size` 和 `appearance`，适用于工具栏场景\",\n};\n\nimport Button, { ButtonGroup } from '../../src/index.js';\nimport { css } from '@crab-dev/css';\nimport { Bold, Italic, Underline } from 'lucide-react';\nimport { useState } from 'react';\n\nconst ButtonGroupDemo = () => {\n    const [formats, setFormats] = useState\u003cSet\u003cstring>>(new Set());\n\n    const toggle = (key: string) => {\n        setFormats((prev) => {\n            const next = new Set(prev);\n            if (next.has(key)) { next.delete(key); } else { next.add(key); }\n            return next;\n        });\n    };\n\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1.5rem;\n            `}\n        >\n            \u003cButtonGroup>\n                \u003cButton appearance=\"primary\">创建\u003c/Button>\n                \u003cButton>编辑\u003c/Button>\n                \u003cButton appearance=\"primary\" danger>删除\u003c/Button>\n            \u003c/ButtonGroup>\n\n            \u003cButtonGroup size=\"xs\">\n                \u003cButton>上一页\u003c/Button>\n                \u003cButton>1\u003c/Button>\n                \u003cButton isSelected>2\u003c/Button>\n                \u003cButton>3\u003c/Button>\n                \u003cButton>下一页\u003c/Button>\n            \u003c/ButtonGroup>\n\n            \u003cButtonGroup appearance=\"outlined\">\n                \u003cButton\n                    icon={\u003cBold />}\n                    aria-label=\"粗体\"\n                    isSelected={formats.has('bold')}\n                    onClick={() => toggle('bold')}\n                />\n                \u003cButton\n                    icon={\u003cItalic />}\n                    aria-label=\"斜体\"\n                    isSelected={formats.has('italic')}\n                    onClick={() => toggle('italic')}\n                />\n                \u003cButton\n                    icon={\u003cUnderline />}\n                    aria-label=\"下划线\"\n                    isSelected={formats.has('underline')}\n                    onClick={() => toggle('underline')}\n                />\n            \u003c/ButtonGroup>\n        \u003c/div>\n    );\n};\n\nexport default ButtonGroupDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbutton-group.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbutton-group.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "组合"
    },
    {
        "id": "docs/demos/expressive.demo.tsx",
        "title": "形状与连接式按钮组",
        "description": "Square 保持统一圆角；显式 Round 保留按压与选中时的形状反馈。",
        "learning": {
            "components": [
                "Button",
                "ButtonGroup"
            ],
            "props": [
                "appearance",
                "shape",
                "isSelected",
                "onClick",
                "variant"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = { title: '形状与连接式按钮组', description: 'Square 保持统一圆角；显式 Round 保留按压与选中时的形状反馈。' };\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button, { ButtonGroup } from '../../src/index.js';\nconst stack = css`display: grid; gap: ${token.space['section-gap']};`;\nconst row = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;\nexport default function Example() {\n    const [round, setRound] = useState(false);\n    const [square, setSquare] = useState(false);\n    const [view, setView] = useState('列表');\n    return \u003cdiv className={stack}>\n        \u003cdiv className={row}>\n            \u003cButton appearance=\"tonal\" shape=\"round\" isSelected={round} onClick={() => setRound(!round)}>Round\u003c/Button>\n            \u003cButton appearance=\"tonal\" shape=\"square\" isSelected={square} onClick={() => setSquare(!square)}>Square\u003c/Button>\n        \u003c/div>\n        \u003cButtonGroup appearance=\"tonal\" variant=\"connected\">\n            {['列表', '卡片', '看板'].map(label => \u003cButton key={label} isSelected={view === label} onClick={() => setView(label)}>{label}\u003c/Button>)}\n        \u003c/ButtonGroup>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fexpressive.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fexpressive.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "组合"
    },
    {
        "id": "docs/demos/macos.demo.tsx",
        "title": "macOS Tahoe：桌面控件与浮动玻璃操作",
        "description": "普通操作使用圆角矩形；浮动工具栏共享玻璃背板，突出内容。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Button",
                "ButtonGroup"
            ],
            "props": [
                "designSystem",
                "size",
                "appearance",
                "danger",
                "variant",
                "isSelected",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport ConfigProvider from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '../../src/button.js';\nimport ButtonGroup from '../../src/buttonGroup.js';\n\nexport const meta = { title: 'macOS Tahoe：桌面控件与浮动玻璃操作', description: '普通操作使用圆角矩形；浮动工具栏共享玻璃背板，突出内容。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; border-radius: ${token.shape.card};`;\nconst row = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space['component-gap']};`;\nconst content = css`\n    display: grid;\n    gap: ${token.space['group-gap']};\n    min-height: 180px;\n    padding: ${token.space['card-padding']};\n    border-radius: ${token.shape.card};\n    background: linear-gradient(120deg, ${token.color.brand.container}, ${token.color.surface.content} 45%, ${token.color.secondary.container});\n`;\nconst title = css`margin: 0; font-size: ${token.typography.title.medium['font-size']}; font-weight: ${token.typography.title.medium['font-weight']};`;\n\nexport default function MacosDemo() {\n    const [selected, setSelected] = useState('列表');\n    return \u003cConfigProvider designSystem=\"macos\">\n        \u003csection className={frame} aria-label=\"macOS Tahoe controls\">\n            \u003ch3 className={title}>桌面操作\u003c/h3>\n            \u003cdiv className={row}>\n                \u003cButton size=\"m\" appearance=\"primary\">保存\u003c/Button>\n                \u003cButton size=\"m\">取消\u003c/Button>\n                \u003cButton size=\"m\" appearance=\"tonal\">共享\u003c/Button>\n                \u003cButton size=\"m\" danger>删除\u003c/Button>\n                \u003cButton size=\"m\" appearance=\"text\">更多选项\u003c/Button>\n            \u003c/div>\n            \u003cdiv className={content}>\n                \u003ch3 className={title}>项目资料\u003c/h3>\n                \u003cp>内容保持清晰，浮动操作在独立的玻璃层上。\u003c/p>\n                \u003cdiv className={row}>\n                    \u003cButtonGroup variant=\"connected\" size=\"m\">\n                        {['列表', '网格', '分栏'].map(label => \u003cButton key={label} appearance=\"elevated\" isSelected={selected === label} onClick={() => setSelected(label)}>{label}\u003c/Button>)}\n                    \u003c/ButtonGroup>\n                    \u003cButton appearance=\"elevated\" size=\"l\">添加到收藏\u003c/Button>\n                \u003c/div>\n            \u003c/div>\n        \u003c/section>\n    \u003c/ConfigProvider>;\n}\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fmacos.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fmacos.demo.tsx",
        "density": "compact",
        "layout": "wide",
        "group": "macOS Tahoe 26"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以 Filled、Tonal、Outlined、Elevated 与 Text 表达操作层级，强调动作可使用 Expressive 形状反馈。",
        "usage": "primary 用于主要动作，outlined 用于普通动作。省略 size 时默认继承 medium；显式 xs/s/m/l/xl 是独立五档。",
        "exampleDescription": "先比较五种外观，再操作选中和加载示例；观察状态层、按压形状与稳定的文字位置。",
        "demos": [
            "appearance.demo.tsx",
            "basic.demo.tsx",
            "button-group.demo.tsx",
            "circle.demo.tsx",
            "danger.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "expressive.demo.tsx",
            "icon-after.demo.tsx",
            "icon.demo.tsx",
            "link-button.demo.tsx",
            "loading.demo.tsx",
            "selected.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/buttons/overview",
            "https://material-web.dev/components/button/",
            "https://github.com/material-components/material-web/tree/main/button"
        ]
    },
    "macos": {
        "summary": "以普通 push button、着色主操作和浮动 glass bezel 组织桌面动作，按压时保持稳定轮廓。",
        "usage": "outlined 是普通操作，primary 是默认动作，tonal 是次要着色，text 用于无背板操作；玻璃材质集中在操作层。",
        "exampleDescription": "操作桌面按钮和连体组，观察边缘光、着色层级与共享背板；键盘焦点应持续可见。",
        "demos": [
            "macos.demo.tsx",
            "appearance.demo.tsx",
            "basic.demo.tsx",
            "button-group.demo.tsx",
            "circle.demo.tsx",
            "danger.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "icon.demo.tsx",
            "link-button.demo.tsx",
            "loading.demo.tsx",
            "selected.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以实心主操作、细描边普通操作与透明低强调操作建立简洁的按钮层级。",
        "usage": "优先用 primary、outlined 和 text 组织动作，danger 独立表达删除等风险；更大的尺寸为本库扩展。",
        "exampleDescription": "从基础保存与取消开始，再检查禁用、加载和选中反馈，以及描边按钮的实体表面。",
        "demos": [
            "basic.demo.tsx",
            "appearance.demo.tsx",
            "button-group.demo.tsx",
            "circle.demo.tsx",
            "danger.demo.tsx",
            "designs.demo.tsx",
            "disabled.demo.tsx",
            "icon.demo.tsx",
            "link-button.demo.tsx",
            "loading.demo.tsx",
            "selected.demo.tsx",
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
    "definition": "Button 触发一个清楚、立即的动作。不同 appearance 表达操作优先级，尺寸和形状只改变视觉呈现，不能替代正确的动作名称与业务语义。",
    "useWhen": [
        "提交、保存、创建、取消或打开下一步等明确动作。",
        "需要用 Filled、Tonal、Outlined、Elevated 或 Text 区分一组操作的主次。"
    ],
    "avoidWhen": [
        "页面跳转优先使用链接语义；二态设置使用 Switch，可多选条件使用 Checkbox。"
    ],
    "essentials": [
        "一个区域通常只有一个最高强调操作，避免所有按钮都用 primary。",
        "loading 防止重复提交但仍要说明处理结果；disabled 应有可理解的原因。",
        "isSelected 只用于真正的可切换动作，普通提交按钮不应伪装成选中状态。"
    ],
    "accessibility": [
        "纯图标按钮必须有 aria-label；可见文字应直接描述动作而不是写“确定”。",
        "危险操作同时使用明确文案、错误色和必要的确认或撤销机制。"
    ]
} as const;
