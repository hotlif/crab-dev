/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "Shortcuts",
        "description": "卡片展示真实按钮，源码区默认收起，可通过工具栏展开；按钮随当前设计风格与主题切换。",
        "learning": {
            "components": [
                "Preview",
                "Button"
            ],
            "props": [
                "title",
                "description",
                "path",
                "sourceCode",
                "appearance"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"Shortcuts\",\n    description: \"卡片展示真实按钮，源码区默认收起，可通过工具栏展开；按钮随当前设计风格与主题切换。\",\n};\n\nimport Button from '@crab-dev/rc-button';\nimport Preview from '../../src/preview.js';\n\nconst sourceCode = `import Button from '@crab-dev/rc-button';\n\nexport function OpenMenuButton() {\n    return (\n        \u003cButton appearance=\"outlined\">\n            Open Menu\n        \u003c/Button>\n    );\n}\n`;\n\nconst BaseDemo = () => (\n    \u003cPreview\n        title=\"Shortcuts\"\n        description=\"An outlined button that follows the current design, theme and component size.\"\n        path=\"https://example.com\"\n        sourceCode={sourceCode}\n    >\n        \u003cButton appearance=\"outlined\">Open Menu\u003c/Button>\n    \u003c/Preview>\n);\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
