/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "Shortcuts",
        "description": "卡片顶部展示组件，下方代码区默认收起，仅露出前几行并通过 View Code 按钮展开。",
        "sourceCode": "export const meta = {\n    title: \"Shortcuts\",\n    description: \"卡片顶部展示组件，下方代码区默认收起，仅露出前几行并通过 View Code 按钮展开。\",\n};\n\nimport Preview from '../../src/preview.js';\n\nconst sourceCode = `\"use client\"\n\nimport * as React from \"react\"\nimport { Button } from \"@/components/ui/button\"\n\nexport function OpenMenuButton() {\n    return (\n        \u003cButton variant=\"outline\" size=\"sm\">\n            Open Menu\n        \u003c/Button>\n    )\n}\n`;\n\nconst BaseDemo = () => (\n    \u003cdiv style={{ display: 'grid', gap: 32, maxWidth: 760 }}>\n        \u003cPreview\n            title=\"Shortcuts\"\n            description=\"A simple button that toggles a menu, used as a quick action shortcut.\"\n            path=\"https://example.com\"\n            sourceCode={sourceCode}\n        >\n            \u003cbutton\n                style={{\n                    height: 36,\n                    padding: '0 18px',\n                    fontSize: 14,\n                    fontWeight: 500,\n                    color: '#111827',\n                    background: '#fff',\n                    border: '1px solid #e5e7eb',\n                    borderRadius: 8,\n                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',\n                    cursor: 'pointer',\n                }}\n            >\n                Open Menu\n            \u003c/button>\n        \u003c/Preview>\n    \u003c/div>\n);\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Preview",
    "symbol": "PreviewProps",
    "props": [
        {
            "name": "codeTheme",
            "required": false,
            "description": "源码高亮主题，默认 light",
            "typeText": "PreviewCodeTheme",
            "defaultValue": "'light'",
            "deprecated": false
        },
        {
            "name": "defaultExpanded",
            "required": false,
            "description": "默认是否展开代码，默认 false",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "density",
            "required": false,
            "description": "预览区密度，控制舞台留白",
            "typeText": "PreviewDensity",
            "defaultValue": "'regular'",
            "deprecated": false
        },
        {
            "name": "description",
            "required": false,
            "description": "描述内容（标题下方一行）。 - 传入 string 时按 Markdown 内联语法渲染； - 传入 ReactNode 时原样渲染。",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "language",
            "required": false,
            "description": "源码语言，默认 tsx",
            "typeText": "string",
            "defaultValue": "'tsx'",
            "deprecated": false
        },
        {
            "name": "onCopyCode",
            "required": false,
            "description": "自定义复制行为；默认 navigator.clipboard.writeText",
            "typeText": "(code: string) => Promise\u003cvoid> | void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onOpenExternal",
            "required": false,
            "description": "自定义新窗口打开方式，默认 window.open",
            "typeText": "(path: string) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "path",
            "required": false,
            "description": "在新窗口打开的 URL；为空时隐藏外链按钮",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "sourceCode",
            "required": false,
            "description": "展示在源码区的代码字符串；为空时隐藏「源码」按钮",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "title",
            "required": false,
            "description": "中间信息栏的标题；可以是文本或自定义节点",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
