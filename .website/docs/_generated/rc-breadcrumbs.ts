/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Breadcrumbs from '@crab-dev/rc-breadcrumbs';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '路径导航状态矩阵', description: '链接、动作、当前位置、禁用、折叠与长路径保持独立语义。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [pathDisplay, setPathDisplay] = useState\u003c'full' | 'collapsed' | 'minimum'>('full');\n    const [visited, setVisited] = useState('');\n    const id = useId();\n    const english = locale === 'en-US';\n    return \u003csection className={frame} aria-label=\"Breadcrumbs visual matrix\" data-visual-scene>\n        \u003cdiv>\u003clabel htmlFor={id}>路径显示\u003c/label>{' '}\u003cselect id={id} value={pathDisplay} onChange={event => setPathDisplay(event.currentTarget.value as typeof pathDisplay)}>\u003coption>full\u003c/option>\u003coption>collapsed\u003c/option>\u003coption>minimum\u003c/option>\u003c/select>\u003c/div>\n        \u003cBreadcrumbs aria-label=\"路径验收\" maxCount={pathDisplay === 'minimum' ? 2 : pathDisplay === 'collapsed' ? 3 : undefined} items={[\n            { key: 'home', title: english ? 'Workspace' : '工作区', href: '#workspace', onClick: event => { event.preventDefault(); setVisited('workspace'); } },\n            { key: 'projects', title: english ? 'Projects' : '项目', onClick: () => setVisited('projects') },\n            { key: 'disabled', title: english ? 'Restricted' : '受限目录', disabled: true, onClick: () => setVisited('restricted') },\n            { key: 'team', title: english ? 'Design systems and shared resources' : '设计系统与团队共享资源目录', href: '#team', onClick: event => { event.preventDefault(); setVisited('team'); } },\n            { key: 'current', title: english ? 'Current component specifications' : '当前组件规范' },\n        ]} />\n        \u003coutput aria-live=\"polite\">{visited || (english ? 'Choose an ancestor' : '请选择上级路径')}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-breadcrumbs/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-breadcrumbs/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以次级路径文字与明确的当前位置表达层级，是基于导航原则的项目扩展。",
        "usage": "把路径作为返回上级的入口，不让每个层级都获得主要操作的色调强调。",
        "exampleDescription": "沿基础路径返回上级，检查当前项与可访问链接之间的区分。",
        "demos": [
            "basic.demo.tsx",
            "action.demo.tsx",
            "custom-separator.demo.tsx",
            "max-count.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/foundations/accessible-design/overview",
            "https://material-web.dev/components/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "以紧凑路径和较明确的当前项字重帮助用户定位桌面内容层级。",
        "usage": "长路径需要保留当前位置与可返回的上级，不将它模拟为系统原生路径栏。",
        "exampleDescription": "展开被收起的路径项目，确认当前位置及返回目标仍清楚可见。",
        "demos": [
            "max-count.demo.tsx",
            "action.demo.tsx",
            "basic.demo.tsx",
            "custom-separator.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用克制的分隔符和中性文字构成层级路径，当前项通过文字层级表达。",
        "usage": "路径链接、当前位置和动作入口分别保留语义，不用装饰替代可访问名称。",
        "exampleDescription": "比较分隔符与路径文字的关系，再用键盘检查可返回的层级。",
        "demos": [
            "custom-separator.demo.tsx",
            "action.demo.tsx",
            "basic.demo.tsx",
            "max-count.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Breadcrumbs 用一串上级入口说明当前页面位于哪一层。它回答“我在哪里、怎样回到上一级”，不是浏览器历史记录，也不替代应用的主导航。",
    "useWhen": [
        "信息结构有两级以上，用户可能从搜索或深链接直接进入内页。",
        "同一内容有稳定的父子层级，并且返回任一上级都合理。"
    ],
    "avoidWhen": [
        "层级很浅或路径只是用户刚才点击过的历史时不必使用；页内步骤流程应使用 Stepper 类模式。"
    ],
    "essentials": [
        "每一项代表信息架构中的真实层级，不要把按钮操作塞进路径。",
        "当前页通常不可点击，并通过语义声明为当前位置。",
        "空间不足时折叠中间层级，但保留根节点、最近上级和当前页。"
    ],
    "accessibility": [
        "整个路径使用有名称的导航区域，当前项标记 aria-current。",
        "分隔符应作为装饰隐藏，链接文字要能脱离视觉位置单独理解。"
    ]
} as const;
