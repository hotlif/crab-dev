/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "语义颜色与边界",
        "description": "表面、文本与边框使用语义令牌，随设计风格和明暗主题同步切换。",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"语义颜色与边界\",\n    description: \"表面、文本与边框使用语义令牌，随设计风格和明暗主题同步切换。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"../../src/index.js\";\n\nconst surfaceStyle = css`\n    display: grid;\n    place-items: center;\n    width: ${token.size[96]};\n    min-height: ${token.size[96]};\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.shape.control};\n    font-size: ${token.font.size.body};\n`;\n\nconst BaseDemo = () => \u003cdiv className={surfaceStyle}>语义表面\u003c/div>;\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-token-semantic/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-token-semantic/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
