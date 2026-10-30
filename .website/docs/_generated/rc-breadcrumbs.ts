/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/action.demo.tsx",
        "title": "按钮式路径操作",
        "description": "不提供 href 时，上级路径使用原生按钮语义，支持键盘激活。",
        "learning": {
            "components": [
                "Breadcrumbs"
            ],
            "props": [
                "items"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport Breadcrumbs from '../../src/index.js';\n\nexport const meta = {\n    title: '按钮式路径操作',\n    description: '不提供 href 时，上级路径使用原生按钮语义，支持键盘激活。',\n};\n\nexport default function ActionDemo() {\n    const [count, setCount] = useState(0);\n    return (\n        \u003cdiv>\n            \u003cBreadcrumbs items={[\n                { title: '返回项目', onClick: () => setCount(count + 1) },\n                { title: '不可用路径', disabled: true, onClick: () => setCount(count + 1) },\n                { title: '当前页面' },\n            ]} />\n            \u003cp role=\"status\">返回次数：{count}\u003c/p>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Faction.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Faction.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过 items 快速配置基础面包屑",
        "learning": {
            "components": [
                "Breadcrumbs"
            ],
            "props": [
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过 items 快速配置基础面包屑\",\n};\n\nimport Breadcrumbs from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cBreadcrumbs\n            items={[\n                { title: '首页', href: '/' },\n                { title: '组件', href: '/components' },\n                { title: '面包屑' },\n            ]}\n        />\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/custom-separator.demo.tsx",
        "title": "自定义分隔符",
        "description": "通过 separator 属性替换默认斜杠分隔",
        "learning": {
            "components": [
                "Breadcrumbs"
            ],
            "props": [
                "separator",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"自定义分隔符\",\n    description: \"通过 separator 属性替换默认斜杠分隔\",\n};\n\nimport Breadcrumbs from '../../src/index.js';\n\nconst CustomSeparatorDemo = () => {\n    return (\n        \u003cBreadcrumbs\n            separator=\"→\"\n            items={[\n                { title: '组件', href: '/learn/components' },\n                { title: '导航', href: '/components/rc-menu' },\n                { title: 'Breadcrumbs' },\n            ]}\n        />\n    );\n};\n\nexport default CustomSeparatorDemo;\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Fcustom-separator.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Fcustom-separator.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/max-count.demo.tsx",
        "title": "路径折叠",
        "description": "使用 maxCount 折叠中间层级，保持界面简洁",
        "learning": {
            "components": [
                "Breadcrumbs"
            ],
            "props": [
                "maxCount",
                "items"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"路径折叠\",\n    description: \"使用 maxCount 折叠中间层级，保持界面简洁\",\n};\n\nimport Breadcrumbs from '../../src/index.js';\n\nconst MaxCountDemo = () => {\n    return (\n        \u003cBreadcrumbs\n            maxCount={4}\n            items={[\n                { title: 'Home', href: '/' },\n                { title: 'Design', href: '/design' },\n                { title: 'Navigation', href: '/navigation' },\n                { title: 'Breadcrumbs', href: '/breadcrumbs' },\n                { title: 'Examples', href: '/examples' },\n                { title: 'Current Page' },\n            ]}\n        />\n    );\n};\n\nexport default MaxCountDemo;\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Fmax-count.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Fmax-count.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "使用示例"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "路径导航状态矩阵",
        "description": "链接、动作、当前位置、禁用、折叠与长路径保持独立语义。",
        "learning": {
            "components": [
                "Breadcrumbs"
            ],
            "props": [
                "aria-label",
                "maxCount",
                "items"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Breadcrumbs from '@crab-dev/rc-breadcrumbs';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '路径导航状态矩阵', description: '链接、动作、当前位置、禁用、折叠与长路径保持独立语义。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [collapsed, setCollapsed] = useState(false);\n    const [visited, setVisited] = useState('');\n    const id = useId();\n    const english = locale === 'en-US';\n    return \u003csection className={frame} aria-label=\"Breadcrumbs visual matrix\" data-visual-scene>\n        \u003cdiv>\u003clabel htmlFor={id}>路径显示\u003c/label>{' '}\u003cselect id={id} value={collapsed ? 'collapsed' : 'full'} onChange={event => setCollapsed(event.currentTarget.value === 'collapsed')}>\u003coption>full\u003c/option>\u003coption>collapsed\u003c/option>\u003c/select>\u003c/div>\n        \u003cBreadcrumbs aria-label=\"路径验收\" maxCount={collapsed ? 3 : undefined} items={[\n            { key: 'home', title: english ? 'Workspace' : '工作区', href: '#workspace', onClick: event => { event.preventDefault(); setVisited('workspace'); } },\n            { key: 'projects', title: english ? 'Projects' : '项目', onClick: () => setVisited('projects') },\n            { key: 'disabled', title: english ? 'Restricted' : '受限目录', disabled: true, onClick: () => setVisited('restricted') },\n            { key: 'team', title: english ? 'Design systems and shared resources' : '设计系统与团队共享资源目录', href: '#team', onClick: event => { event.preventDefault(); setVisited('team'); } },\n            { key: 'current', title: english ? 'Current component specifications' : '当前组件规范' },\n        ]} />\n        \u003coutput aria-live=\"polite\">{visited || (english ? 'Choose an ancestor' : '请选择上级路径')}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];
