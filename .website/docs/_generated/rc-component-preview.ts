/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "Shortcuts",
        "description": "卡片顶部展示组件，下方代码区默认收起，仅露出前几行并通过 View Code 按钮展开。",
        "sourceCode": "export const meta = {\n    title: \"Shortcuts\",\n    description: \"卡片顶部展示组件，下方代码区默认收起，仅露出前几行并通过 View Code 按钮展开。\",\n};\n\nimport Preview from '../../src/preview.js';\n\nconst sourceCode = `\"use client\"\n\nimport * as React from \"react\"\nimport { Button } from \"@/components/ui/button\"\n\nexport function OpenMenuButton() {\n    return (\n        \u003cButton variant=\"outline\" size=\"sm\">\n            Open Menu\n        \u003c/Button>\n    )\n}\n`;\n\nconst BaseDemo = () => (\n    \u003cdiv style={{ display: 'grid', gap: 32, maxWidth: 760 }}>\n        \u003cPreview\n            title=\"Shortcuts\"\n            description=\"A simple button that toggles a menu, used as a quick action shortcut.\"\n            path=\"https://example.com\"\n            sourceCode={sourceCode}\n        >\n            \u003cbutton\n                style={{\n                    height: 36,\n                    padding: '0 18px',\n                    fontSize: 14,\n                    fontWeight: 500,\n                    color: '#111827',\n                    background: '#fff',\n                    border: '1px solid #e5e7eb',\n                    borderRadius: 8,\n                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.04)',\n                    cursor: 'pointer',\n                }}\n            >\n                Open Menu\n            \u003c/button>\n        \u003c/Preview>\n    \u003c/div>\n);\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
