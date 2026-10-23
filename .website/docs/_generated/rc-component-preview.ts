/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "代码主题",
        "description": "浅色和深色源码同时展开，核对语法颜色、背景与行号；实时按钮跟随页面主题。",
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
                "codeTheme",
                "defaultExpanded",
                "appearance"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"代码主题\",\n    description: \"浅色和深色源码同时展开，核对语法颜色、背景与行号；实时按钮跟随页面主题。\",\n};\n\nimport Button from '@crab-dev/rc-button';\nimport { css } from '@crab-dev/css';\nimport Preview from '../../src/preview.js';\nimport token from '../../src/token.js';\n\nconst layoutStyle = css`display: grid; gap: ${token.stage.padding};`;\n\nconst sourceCode = `import Button from '@crab-dev/rc-button';\n\nexport function OpenMenuButton() {\n    return (\n        \u003cButton appearance=\"outlined\">\n            Open Menu\n        \u003c/Button>\n    );\n}\n`;\n\nconst BaseDemo = () => (\n    \u003cdiv className={layoutStyle}>\n    \u003cPreview\n        title=\"浅色源码\"\n        description=\"独立浅色源码背景与行号。\"\n        path=\"https://example.com\"\n        sourceCode={sourceCode}\n        codeTheme=\"light\"\n        defaultExpanded\n    >\n        \u003cButton appearance=\"outlined\">Open Menu\u003c/Button>\n    \u003c/Preview>\n    \u003cPreview title=\"深色源码\" description=\"独立深色源码背景与行号。\" sourceCode={sourceCode} codeTheme=\"dark\" defaultExpanded>\n        \u003cButton appearance=\"outlined\">Open Menu\u003c/Button>\n    \u003c/Preview>\n    \u003c/div>\n);\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
