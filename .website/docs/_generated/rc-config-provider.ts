/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/nested.demo.tsx",
        "title": "嵌套配置与主题边界",
        "description": "内层仅覆盖指定配置，未指定的语言和尺寸继续继承父级。",
        "learning": {
            "components": [
                "ConfigProvider"
            ],
            "props": [
                "theme",
                "locale",
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport ConfigProvider, { useConfig } from '../../src/index.js';\n\nexport const meta = {\n    title: '嵌套配置与主题边界',\n    description: '内层仅覆盖指定配置，未指定的语言和尺寸继续继承父级。',\n};\n\nconst panelStyle = css`\n    padding: ${token.space['card-padding']};\n    color: ${token.color.text.primary};\n    background: ${token.color.background.surface};\n    border-radius: ${token.radius.md};\n`;\n\nfunction Summary() {\n    const { theme, locale, size } = useConfig();\n    return \u003cp className={panelStyle}>{theme} / {locale} / {size}\u003c/p>;\n}\n\nexport default function NestedDemo() {\n    return (\n        \u003cConfigProvider theme=\"dark\" locale=\"en-US\" size=\"large\">\n            \u003cSummary />\n            \u003cConfigProvider theme=\"light\">\u003cSummary />\u003c/ConfigProvider>\n            \u003cSummary />\n        \u003c/ConfigProvider>\n    );\n}\n",
        "previewPath": "/components/rc-config-provider/workbench/?__wake_demo=docs%2Fdemos%2Fnested.demo.tsx",
        "workbenchPath": "/components/rc-config-provider/workbench/#/components/docs%2Fdemos%2Fnested.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
