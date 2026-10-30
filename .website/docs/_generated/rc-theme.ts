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
        "group": "边界与视觉矩阵"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "主题表面、字阶与嵌套恢复",
        "description": "检查显式边界的表面、文本、品牌、焦点和形状；主题不改变业务草稿。",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '主题表面、字阶与嵌套恢复', description: '检查显式边界的表面、文本、品牌、焦点和形状；主题不改变业务草稿。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; overflow-wrap: anywhere;`;\nconst strip = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;\nconst brand = css`padding: ${token.space['component-gap']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border-radius: ${token.shape.control};`;\nconst raised = css`padding: ${token.space['component-gap']}; background: ${token.color.surface.raised}; border: 1px solid ${token.color.border.default}; box-shadow: ${token.shadow.card}; border-radius: ${token.shape.card};`;\nconst heading = css`margin: 0; font-family: ${token.typography.headline.small['font-family']}; font-size: ${token.typography.headline.small['font-size']}; line-height: ${token.typography.headline.small['line-height']}; font-weight: ${token.typography.headline.small['font-weight']};`;\nconst focus = css`max-width: 100%; box-sizing: border-box; color: inherit; background: inherit; border: 1px solid ${token.color.border.default}; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nexport default function VisualMatrixDemo() {\n    const [state, setState] = useState('default');\n    const [draft, setDraft] = useState('主题切换保留文字 Theme draft');\n    return \u003csection className={frame} aria-label=\"Theme visual matrix\">\n        \u003clabel>验收状态 \u003cselect value={state} onChange={event => setState(event.currentTarget.value)}>\u003coption>default\u003c/option>\u003coption>nested\u003c/option>\u003c/select>\u003c/label>\n        \u003ch2 className={heading}>内容、层级与清晰焦点\u003c/h2>\n        \u003cdiv className={strip}>\u003cspan className={brand} data-role=\"brand\">Brand container\u003c/span>\u003cspan className={raised} data-role=\"raised\">Raised surface\u003c/span>\u003c/div>\n        \u003clabel>主题草稿 \u003cinput className={focus} value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        {state === 'nested' && Object.entries(designSystemRegistry).map(([id, design]) => \u003csection key={id} className={frame} data-crab-design={id} data-theme=\"light\" aria-label={`${id} nested`}>\u003cstrong>{design.label}\u003c/strong>\u003cspan className={brand}>Explicit light boundary\u003c/span>\u003cspan className={raised}>Independent geometry and color\u003c/span>\u003c/section>)}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-theme/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-theme/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];
