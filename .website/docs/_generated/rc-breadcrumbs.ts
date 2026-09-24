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
        "group": null
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
        "group": null
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
        "group": null
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
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
