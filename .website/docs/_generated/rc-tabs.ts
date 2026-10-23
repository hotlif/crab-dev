/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 items 配置基础标签页，默认使用 line 形态。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 items 配置基础标签页，默认使用 line 形态。\",\n};\n\nimport Tabs from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cTabs\n            items={[\n                { key: 'overview', label: '概览', children: \u003cp>概览内容：展示关键指标与最新动态。\u003c/p> },\n                { key: 'logs', label: '日志', children: \u003cp>日志内容：按时间倒序的操作记录。\u003c/p> },\n                { key: 'settings', label: '设置', children: \u003cp>设置内容：调整偏好与权限。\u003c/p> },\n            ]}\n        />\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/card.demo.tsx",
        "title": "卡片形态",
        "description": "type='card' 提供更清晰的容器边界，适用于表单或配置区。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "type",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"卡片形态\",\n    description: \"type='card' 提供更清晰的容器边界，适用于表单或配置区。\",\n};\n\nimport Tabs from '../../src/index.js';\n\nconst CardDemo = () => {\n    return (\n        \u003cTabs\n            type=\"card\"\n            items={[\n                { key: 'profile', label: '个人信息', children: \u003cp>在此填写个人资料。\u003c/p> },\n                { key: 'security', label: '安全设置', children: \u003cp>在此管理密码与多因素认证。\u003c/p> },\n                { key: 'billing', label: '账单', children: \u003cp>在此查看账单与发票。\u003c/p> },\n            ]}\n        />\n    );\n};\n\nexport default CardDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fcard.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fcard.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/centered.demo.tsx",
        "title": "居中标签",
        "description": "标签未溢出时在可用区域居中；溢出时仍可访问起始标签。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "centered",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '居中标签',\n    description: '标签未溢出时在可用区域居中；溢出时仍可访问起始标签。',\n};\n\nimport Tabs from '../../src/tabs.js';\n\nconst CenteredDemo = () => \u003cTabs centered items={[\n    { key: 'overview', label: '概览', children: '概览内容' },\n    { key: 'settings', label: '设置', children: '设置内容' },\n]} />;\n\nexport default CenteredDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fcentered.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fcentered.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/closable.demo.tsx",
        "title": "可关闭标签",
        "description": "开启 closable 并监听 onTabClose 管理标签页的增删。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "items",
                "activeKey",
                "onChange",
                "onTabClose"
            ],
            "events": [
                "onChange",
                "onTabClose"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可关闭标签\",\n    description: \"开启 closable 并监听 onTabClose 管理标签页的增删。\",\n};\n\nimport { useState } from 'react';\n\nimport Tabs from '../../src/index.js';\nimport type { TabsItem } from '../../src/index.js';\n\nconst initialItems: TabsItem[] = [\n    { key: 'tab-1', label: '编辑器 1', children: \u003cp>编辑器 1 的内容\u003c/p>, closable: true },\n    { key: 'tab-2', label: '编辑器 2', children: \u003cp>编辑器 2 的内容\u003c/p>, closable: true },\n    { key: 'tab-3', label: '编辑器 3', children: \u003cp>编辑器 3 的内容\u003c/p>, closable: true },\n];\n\nconst ClosableDemo = () => {\n    const [items, setItems] = useState\u003cTabsItem[]>(initialItems);\n    const [activeKey, setActiveKey] = useState\u003cstring>('tab-1');\n\n    const handleClose = (key: string) => {\n        const index = items.findIndex(item => item.key === key);\n        const nextItems = items.filter(item => item.key !== key);\n        setItems(nextItems);\n        if (key === activeKey && nextItems.length > 0) {\n            const fallback = nextItems[Math.max(0, index - 1)] ?? nextItems[0]!;\n            setActiveKey(fallback.key);\n        }\n    };\n\n    return (\n        \u003cTabs\n            items={items}\n            activeKey={activeKey}\n            onChange={setActiveKey}\n            onTabClose={handleClose}\n        />\n    );\n};\n\nexport default ClosableDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fclosable.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fclosable.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/designs.demo.tsx",
        "title": "三套风格与面板切换",
        "description": "Material 使用主标签页指示条，macOS 和 shadcn 使用容器内的选中块；键盘操作一致。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '三套风格与面板切换',\n    description: 'Material 使用主标签页指示条，macOS 和 shadcn 使用容器内的选中块；键盘操作一致。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Tabs from '../../src/index.js';\n\nconst grid = css`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: ${token.space['stack-gap']};`;\nconst panel = css`display: grid; gap: ${token.space['stack-gap']}; padding: ${token.space['card-padding']}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; min-width: 0;`;\n\nexport default function DesignsDemo() {\n    return (\n        \u003cdiv className={grid}>\n            {(['macos', 'material', 'shadcn'] as const).flatMap(design => (['light', 'dark'] as const).map(mode => (\n                \u003csection key={`${design}-${mode}`} className={panel} data-crab-design={design} data-theme={mode} aria-label={`${design} ${mode}`}>\n                    \u003cstrong>{design} · {mode}\u003c/strong>\n                    \u003cTabs items={[\n                        { key: 'overview', label: '概览', children: \u003cp>当前项目的概览与最近活动。\u003c/p> },\n                        { key: 'activity', label: '活动', children: \u003cp>使用左右方向键可切换内容面板。\u003c/p> },\n                        { key: 'archive', label: '归档', disabled: true },\n                    ]} />\n                \u003c/section>\n            )))}\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fdesigns.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fdesigns.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/overflow.demo.tsx",
        "title": "溢出标签",
        "description": "初始激活最后一项，自动滚动标签条以显示当前位置。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "defaultActiveKey",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: '溢出标签',\n    description: '初始激活最后一项，自动滚动标签条以显示当前位置。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Tabs from '../../src/tabs.js';\n\nconst widthStyle = css`max-width: calc(${token.size['touch-target']} * 6);`;\nconst labels = ['产品概览', '分析报告', '成员管理', '操作记录', '通知设置', '权限设置'];\n\nconst OverflowDemo = () => \u003cTabs className={widthStyle} defaultActiveKey=\"权限设置\" items={labels.map(label => ({\n    key: label,\n    label,\n    children: `${label}的内容`,\n}))} />;\n\nexport default OverflowDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Foverflow.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Foverflow.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/pill.demo.tsx",
        "title": "药丸形态",
        "description": "type='pill' 提供紧凑的切换样式，常用于工具栏或筛选面板。",
        "learning": {
            "components": [
                "Tabs"
            ],
            "props": [
                "type",
                "size",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"药丸形态\",\n    description: \"type='pill' 提供紧凑的切换样式，常用于工具栏或筛选面板。\",\n};\n\nimport Tabs from '../../src/index.js';\n\nconst PillDemo = () => {\n    return (\n        \u003cTabs\n            type=\"pill\"\n            size=\"small\"\n            items={[\n                { key: 'all', label: '全部', children: \u003cp>全部任务\u003c/p> },\n                { key: 'active', label: '进行中', children: \u003cp>正在进行的任务\u003c/p> },\n                { key: 'done', label: '已完成', children: \u003cp>已完成的任务\u003c/p> },\n            ]}\n        />\n    );\n};\n\nexport default PillDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fpill.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fpill.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/with-icon.demo.tsx",
        "title": "带图标与额外内容",
        "description": "通过 icon 为标签添加视觉标识，tabBarExtraContent 注入刷新操作，当前面板显示刷新次数。",
        "learning": {
            "components": [
                "Tabs",
                "Button"
            ],
            "props": [
                "tabBarExtraContent",
                "items",
                "size",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"带图标与额外内容\",\n    description: \"通过 icon 为标签添加视觉标识，tabBarExtraContent 注入刷新操作，当前面板显示刷新次数。\",\n};\n\nimport Tabs from '../../src/index.js';\nimport Button from '@crab-dev/rc-button';\nimport { useState } from 'react';\n\nconst Icon = ({ path }: { path: string }) => (\n    \u003csvg viewBox=\"0 0 16 16\" width=\"14\" height=\"14\" aria-hidden=\"true\" focusable=\"false\">\n        \u003cpath d={path} fill=\"currentColor\" />\n    \u003c/svg>\n);\n\nconst WithIconDemo = () => {\n    const [refreshCount, setRefreshCount] = useState(0);\n    return (\n        \u003cTabs\n            tabBarExtraContent={\u003cButton size=\"small\" onClick={() => setRefreshCount(count => count + 1)}>刷新\u003c/Button>}\n            items={[\n                {\n                    key: 'home',\n                    label: '首页',\n                    icon: \u003cIcon path=\"M8 1.5 1.5 7H3v6.5h3.5V10h3v3.5H13V7h1.5L8 1.5Z\" />,\n                    children: \u003cp role=\"status\">首页内容 · 已刷新 {refreshCount} 次\u003c/p>,\n                },\n                {\n                    key: 'library',\n                    label: '资源库',\n                    icon: \u003cIcon path=\"M3 2h10v2H3V2Zm0 4h10v2H3V6Zm0 4h10v4H3v-4Z\" />,\n                    children: \u003cp role=\"status\">资源库内容 · 已刷新 {refreshCount} 次\u003c/p>,\n                },\n                {\n                    key: 'trash',\n                    label: '回收站',\n                    icon: \u003cIcon path=\"M6 2h4v1h3.5v1.5H2.5V3H6V2Zm-2 3h8l-.6 8.1A1 1 0 0 1 10.4 14H5.6a1 1 0 0 1-1-.9L4 5Z\" />,\n                    children: \u003cp role=\"status\">回收站内容 · 已刷新 {refreshCount} 次\u003c/p>,\n                },\n            ]}\n        />\n    );\n};\n\nexport default WithIconDemo;\n",
        "previewPath": "/components/rc-tabs/workbench/?__wake_demo=docs%2Fdemos%2Fwith-icon.demo.tsx",
        "workbenchPath": "/components/rc-tabs/workbench/#/components/docs%2Fdemos%2Fwith-icon.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
