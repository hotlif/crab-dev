/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "按钮尺寸",
        "description": "通过 `size` 属性设置按钮尺寸",
        "sourceCode": "\nexport const meta = {\n    title: \"按钮尺寸\",\n    description: \"通过 `size` 属性设置按钮尺寸\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"../../src/index.js\";\n\nconst BaseDemo = () => {\n\n    return (\n        \u003cdiv\n            className={css`\n                margin-bottom: 1rem;\n                background-color: ${token.zinc[900]};\n                width: 100px;\n                height: 100px;\n            `}\n        >\n        \u003c/div>\n    )\n}\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-token-global/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-token-global/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
