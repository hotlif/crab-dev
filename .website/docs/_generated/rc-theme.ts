/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/light-dark.demo.tsx",
        "title": "MD3 Expressive、Apple 与 shadcn/ui",
        "description": "三种风格各自提供浅色和深色配对，局部边界的颜色、形状与阴影相互独立。",
        "learning": {
            "components": [
                "ThemePanel"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"MD3 Expressive、Apple 与 shadcn/ui\",\n    description: \"三种风格各自提供浅色和深色配对，局部边界的颜色、形状与阴影相互独立。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token, { designSystemRegistry } from \"@crab-dev/rc-token-semantic\";\nimport type { DesignSystem } from \"@crab-dev/rc-token-semantic\";\nimport \"../../src/index.js\";\n\nconst layoutClass = css`\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: ${token.space[\"component-gap\"]};\n\n    @media (max-width: 40rem) {\n        grid-template-columns: 1fr;\n    }\n`;\n\nconst panelClass = css`\n    display: grid;\n    gap: ${token.space[\"stack-gap\"]};\n    padding: ${token.space[\"card-padding\"]};\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.radius.lg};\n`;\n\nconst secondaryClass = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n`;\n\nconst accentClass = css`\n    width: fit-content;\n    padding: ${token.space[\"control-padding-y\"]} ${token.space[\"control-padding-x\"]};\n    color: ${token.color.text[\"on-brand\"]};\n    background-color: ${token.color.brand.primary};\n    border: 1px solid ${token.color.brand.primary};\n    border-radius: ${token.radius.md};\n\n    @media (forced-colors: active) {\n        /* This noninteractive label uses the user Canvas pair. A HighlightText\n           foreground on the UA Canvas text backplate can erase the label.\n           Keep the exception inside this example; do not restore brand colors. */\n        color: CanvasText;\n        background-color: Canvas;\n        border-color: CanvasText;\n    }\n`;\n\nfunction ThemePanel({ designSystem, mode }: { designSystem: DesignSystem; mode: \"light\" | \"dark\" }) {\n    return (\n        \u003csection className={panelClass} data-crab-design={designSystem} data-theme={mode} aria-label={`${designSystemRegistry[designSystem].label} ${mode} theme preview`}>\n            \u003cstrong>{designSystemRegistry[designSystem].label} · {mode === \"light\" ? \"Light\" : \"Dark\"}\u003c/strong>\n            \u003cp className={secondaryClass}>背景、文本、边框与操作色均来自 Layer 2。\u003c/p>\n            \u003cspan className={accentClass}>Brand color\u003c/span>\n        \u003c/section>\n    );\n}\n\nexport default function LightDarkDemo() {\n    return (\n        \u003cdiv className={layoutClass}>\n            \u003cThemePanel designSystem=\"md3\" mode=\"light\" />\n            \u003cThemePanel designSystem=\"md3\" mode=\"dark\" />\n            \u003cThemePanel designSystem=\"shadcn\" mode=\"light\" />\n            \u003cThemePanel designSystem=\"shadcn\" mode=\"dark\" />\n            \u003cThemePanel designSystem=\"apple\" mode=\"light\" />\n            \u003cThemePanel designSystem=\"apple\" mode=\"dark\" />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-theme/workbench/?__wake_demo=docs%2Fdemos%2Flight-dark.demo.tsx",
        "workbenchPath": "/components/rc-theme/workbench/#/components/docs%2Fdemos%2Flight-dark.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
