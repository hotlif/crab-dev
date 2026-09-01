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
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/appearance.demo.tsx",
        "title": "外观设置",
        "description": "通过 `appearance` 属性设置按钮外观",
        "sourceCode": "\nexport const meta = {\n    title: \"外观设置\",\n    description: \"通过 `appearance` 属性设置按钮外观\",\n};\n\nimport Button from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cButton\n                appearance=\"primary\"\n            >\n                primary\n            \u003c/Button>\n            \u003cButton appearance=\"subtle\">\n                subtle\n            \u003c/Button>\n            \u003cButton appearance=\"dashed\">\n                dashed\n            \u003c/Button>\n            \u003cButton appearance=\"text\">\n                text\n            \u003c/Button>\n            \u003cButton appearance=\"link\">\n                link\n            \u003c/Button>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fappearance.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fappearance.demo.tsx",
        "density": "compact",
        "layout": "grid",
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
        "layout": "grid",
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
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/icon.demo.tsx",
        "title": "图标按钮",
        "description": "通过 `icon` 属性设置按钮图标",
        "sourceCode": "export const meta = {\n    title: \"图标按钮\",\n    description: \"通过 `icon` 属性设置按钮图标\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { Lollipop } from 'lucide-react';\nimport { useId, useState } from \"react\";\nimport Button from \"../../src/index.js\";\n\nconst IconDemo = () => {\n    const loadingCheckboxId = useId();\n    const [isLoading, setIsLoading] = useState(false);\n    return (\n        \u003cdiv>\n            \u003cdiv\n                className={css`\n                    margin-bottom: 1rem;\n                `}\n            >\n                \u003clabel htmlFor={loadingCheckboxId}>显示加载状态\u003c/label>\n                \u003cinput\n                    id={loadingCheckboxId}\n                    type=\"checkbox\"\n                    checked={isLoading}\n                    onChange={() => setIsLoading(!isLoading)}\n                />\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 1rem;\n                    margin-bottom: 2rem;\n                `}\n            >\n                \n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"primary\"\n                >\n                    primary\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"subtle\"\n                >\n                    subtle\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"dashed\"\n                >\n                    dashed\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"text\"\n                >\n                    text\n                \u003c/Button>\n                \u003cButton\n                    loading={isLoading}\n                    icon={\u003cLollipop />}\n                    appearance=\"link\"\n                >\n                    link\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default IconDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Ficon.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Ficon.demo.tsx",
        "density": "compact",
        "layout": "grid",
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
        "layout": "grid",
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
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "按钮尺寸",
        "description": "通过 `size` 属性设置按钮尺寸",
        "sourceCode": "export const meta = {\n    title: \"按钮尺寸\",\n    description: \"通过 `size` 属性设置按钮尺寸\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useId, useState } from \"react\";\nimport Button from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    const sizeSelectId = useId();\n    const [size, setSize] = useState\u003c\"large\" | \"middle\" | \"small\">(\"middle\")\n\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n            `}\n        >\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 0.5rem;\n                    margin-bottom: 2rem;\n                `}\n            >\n                \u003clabel htmlFor={sizeSelectId}>\n                    请选择大小\n                \u003c/label>\n                \u003cselect\n                    id={sizeSelectId}\n                    value={size}\n                    onChange={e => setSize(e.target.value as \"large\" | \"middle\" | \"small\")}\n                >\n                    \u003coption value=\"large\">Large\u003c/option>\n                    \u003coption value=\"middle\">Middle\u003c/option>\n                    \u003coption value=\"small\">Small\u003c/option>\n                \u003c/select>\n            \u003c/div>\n            \u003cdiv\n                className={css`\n                    display: flex;\n                    align-items: center;\n                    gap: 1rem;\n                `}\n            >\n                \u003cButton appearance=\"primary\" size={size}>\n                    primary\n                \u003c/Button>\n                \u003cButton appearance=\"subtle\" size={size}>\n                    subtle\n                \u003c/Button>\n                \u003cButton appearance=\"dashed\" size={size}>\n                    dashed\n                \u003c/Button>\n                \u003cButton appearance=\"text\" size={size}>\n                    text\n                \u003c/Button>\n                \u003cButton appearance=\"link\" size={size}>\n                    link\n                \u003c/Button>\n            \u003c/div>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "添加 `disabled` 属性即可让按钮处于禁用状态",
        "sourceCode": "\nexport const meta = {\n    title: \"禁用状态\",\n    description: \"添加 `disabled` 属性即可让按钮处于禁用状态\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cButton\n                disabled\n                appearance=\"primary\"\n            >\n                primary\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"subtle\"\n            >\n                subtle\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"dashed\"\n            >\n                dashed\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"text\"\n            >\n                text\n            \u003c/Button>\n            \u003cButton\n                disabled\n                appearance=\"link\"\n            >\n                link\n            \u003c/Button>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": "状态与反馈"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载中",
        "description": "添加 `loading` 属性即可让按钮处于加载状态",
        "sourceCode": "\nexport const meta = {\n    title: \"加载中\",\n    description: \"添加 `loading` 属性即可让按钮处于加载状态\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Button from \"../../src/index.js\";\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                align-items: center;\n                gap: 1rem;\n            `}\n        >\n            \u003cButton\n                loading\n                appearance=\"primary\"\n            >\n                primary\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"subtle\"\n            >\n                subtle\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"dashed\"\n            >\n                dashed\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"text\"\n            >\n                text\n            \u003c/Button>\n            \u003cButton\n                loading\n                appearance=\"link\"\n            >\n                link\n            \u003c/Button>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx",
        "workbenchPath": "/components/rc-button/workbench/#/components/docs%2Fdemos%2Floading.demo.tsx",
        "density": "compact",
        "layout": "grid",
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
        "layout": "grid",
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
        "layout": "grid",
        "group": "组合"
    }
] as const satisfies readonly ComponentDemoRecord[];
