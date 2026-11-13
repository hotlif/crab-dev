/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/light-dark.demo.tsx",
        "title": "当前主题的浅色与深色",
        "description": "同一设计提供浅色与深色配对，局部明暗边界中的表面、文字和强调色保持清晰。",
        "learning": {
            "components": [
                "ThemePanel"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"当前主题的浅色与深色\",\n    description: \"同一设计提供浅色与深色配对，局部明暗边界中的表面、文字和强调色保持清晰。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token, { defaultDesignSystem, designSystemRegistry } from \"@crab-dev/rc-token-semantic\";\nimport type { DesignSystem } from \"@crab-dev/rc-token-semantic\";\nimport { useSyncExternalStore } from \"react\";\n\n// This package is CSS-only. Wake loads its stylesheet; this example follows\n// the document's public CSS boundary without introducing a Provider dependency.\nfunction subscribeDesign(notify: () => void) {\n    const observer = new MutationObserver(notify);\n    observer.observe(document.documentElement, { attributes: true, attributeFilter: [\"data-crab-design\"] });\n    return () => observer.disconnect();\n}\nfunction readDesign(): DesignSystem {\n    const value = document.documentElement.dataset.crabDesign;\n    return Object.keys(designSystemRegistry).find(design => design === value) as DesignSystem | undefined ?? defaultDesignSystem;\n}\n\nconst layoutClass = css`\n    display: grid;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: ${token.space[\"component-gap\"]};\n\n    @media (max-width: 40rem) {\n        grid-template-columns: 1fr;\n    }\n`;\n\nconst panelClass = css`\n    display: grid;\n    gap: ${token.space[\"stack-gap\"]};\n    padding: ${token.space[\"card-padding\"]};\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.radius.lg};\n`;\n\nconst secondaryClass = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n`;\n\nconst accentClass = css`\n    width: fit-content;\n    padding: ${token.space[\"control-padding-y\"]} ${token.space[\"control-padding-x\"]};\n    color: ${token.color.text[\"on-brand\"]};\n    background-color: ${token.color.brand.primary};\n    border: 1px solid ${token.color.brand.primary};\n    border-radius: ${token.radius.md};\n\n    @media (forced-colors: active) {\n        /* This noninteractive label uses the user Canvas pair. A HighlightText\n           foreground on the UA Canvas text backplate can erase the label.\n           Keep the exception inside this example; do not restore brand colors. */\n        color: CanvasText;\n        background-color: Canvas;\n        border-color: CanvasText;\n    }\n`;\n\nfunction ThemePanel({ designSystem, mode }: { designSystem: DesignSystem; mode: \"light\" | \"dark\" }) {\n    return (\n        \u003csection className={panelClass} data-crab-design={designSystem} data-theme={mode} aria-label={`${designSystemRegistry[designSystem].label} ${mode} theme preview`}>\n            \u003cstrong>{designSystemRegistry[designSystem].label} · {mode === \"light\" ? \"Light\" : \"Dark\"}\u003c/strong>\n            \u003cp className={secondaryClass}>背景、文本、边框与操作色均来自 Layer 2。\u003c/p>\n            \u003cspan className={accentClass}>Brand color\u003c/span>\n        \u003c/section>\n    );\n}\n\nexport default function LightDarkDemo() {\n    const designSystem = useSyncExternalStore(subscribeDesign, readDesign, () => defaultDesignSystem);\n    return (\n        \u003cdiv className={layoutClass}>\n            \u003cThemePanel designSystem={designSystem} mode=\"light\" />\n            \u003cThemePanel designSystem={designSystem} mode=\"dark\" />\n        \u003c/div>\n    );\n}\n",
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
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';\n\nexport const meta = { title: '主题表面、字阶与嵌套恢复', description: '检查显式边界的表面、文本、品牌、焦点和形状；主题不改变业务草稿。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; overflow-wrap: anywhere;`;\nconst strip = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;\nconst brand = css`\n    padding: ${token.space['component-gap']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border-radius: ${token.shape.control};\n    /* The public roles resolve to the user's Highlight/HighlightText pair.\n       Keep that pair together instead of adding a Canvas text backplate. */\n    @media (forced-colors: active) { forced-color-adjust: none; }\n`;\nconst raised = css`padding: ${token.space['component-gap']}; background: ${token.color.surface.raised}; border: 1px solid ${token.color.border.default}; box-shadow: ${token.shadow.card}; border-radius: ${token.shape.card};`;\nconst glass = css`\n    padding: ${token.space['card-padding']};\n    color: ${token.color.text.primary};\n    background-color: ${token.material.background};\n    background-image: ${token.material.sheen};\n    backdrop-filter: ${token.material.filter};\n    border: 1px solid ${token.material.border};\n    border-radius: ${token.shape.overlay};\n    box-shadow: ${token.material.shadow};\n`;\nconst heading = css`margin: 0; font-family: ${token.typography.headline.small['font-family']}; font-size: ${token.typography.headline.small['font-size']}; line-height: ${token.typography.headline.small['line-height']}; font-weight: ${token.typography.headline.small['font-weight']};`;\nconst focus = css`max-width: 100%; box-sizing: border-box; color: inherit; background: inherit; border: 1px solid ${token.color.border.default}; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; font: inherit; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nexport default function VisualMatrixDemo() {\n    const [state, setState] = useState('default');\n    const [draft, setDraft] = useState('主题切换保留文字 Theme draft');\n    return \u003csection className={frame} aria-label=\"Theme visual matrix\">\n        \u003clabel>验收状态 \u003cselect value={state} onChange={event => setState(event.currentTarget.value)}>\u003coption>default\u003c/option>\u003coption>nested\u003c/option>\u003c/select>\u003c/label>\n        \u003ch2 className={heading}>内容、层级与清晰焦点\u003c/h2>\n        \u003cdiv className={glass} data-role=\"material\">操作层 · Liquid Glass material\u003c/div>\n        \u003cdiv className={strip}>\u003cspan className={brand} data-role=\"brand\">Brand container\u003c/span>\u003cspan className={raised} data-role=\"raised\">Raised surface\u003c/span>\u003c/div>\n        \u003clabel>主题草稿 \u003cinput className={focus} value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        {state === 'nested' && Object.entries(designSystemRegistry).map(([id, design]) => \u003csection key={id} className={frame} data-crab-design={id} data-theme=\"light\" aria-label={`${id} nested`}>\u003cstrong>{design.label}\u003c/strong>\u003cspan className={brand} data-role=\"brand\">Explicit light boundary\u003c/span>\u003cspan className={raised} data-role=\"raised\">Independent geometry and color\u003c/span>\u003c/section>)}\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-theme/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-theme/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "加载 MD3 的语义颜色、字阶、形状和动效映射，为组件提供一致的主题基础。",
        "usage": "浅深色使用配对表面与前景角色，应用应通过配置边界切换已解析的模式。",
        "exampleDescription": "并排查看当前设计的浅深色表面、文字和强调色，核对配对关系。",
        "demos": [
            "light-dark.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/styles/color/system/overview",
            "https://material-web.dev/theming/color/",
            "https://github.com/material-components/material-web/tree/main/tokens"
        ]
    },
    "macos": {
        "summary": "加载 macOS 桌面主题的表面、字体、几何与材质映射，内容层保持清晰可读。",
        "usage": "导航和工具层可使用材质角色，阅读区保留稳定底色，减少透明度时提供实体表面。",
        "exampleDescription": "比较桌面主题的浅深色内容区域，检查文字、边界和强调色的层次。",
        "demos": [
            "light-dark.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "加载 shadcn 的中性表面、边界、字阶与焦点角色，为简洁界面提供主题基础。",
        "usage": "浅深色分别配置语义前景和背景，不依靠整体反相处理控件或正文。",
        "exampleDescription": "查看中性主题的浅深色配对，检查边框、正文和品牌标记的对比。",
        "demos": [
            "light-dark.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Theme 提供组件所需的全局样式入口和主题边界，让同一组语义令牌在浅色、深色或品牌覆盖下产生一致外观。它不应该让业务组件直接判断当前主题。",
    "useWhen": [
        "应用根节点需要加载 Crab UI 的基础主题。",
        "某个局部区域需要在明确边界内覆盖浅色、深色或品牌语义变量。"
    ],
    "avoidWhen": [
        "单个组件微调优先修改其 props 或 L3 token；不要在业务节点随意重写原始色阶。"
    ],
    "essentials": [
        "主题覆盖发生在 L2 语义角色，组件继续消费相同 token 名称。",
        "Theme 边界决定 CSS 变量继承，Portal 到边界外的浮层要单独检查。",
        "浅色和深色是两套角色映射，不是把颜色机械反相。"
    ],
    "accessibility": [
        "每个主题分别验证文字、图标、边框、焦点与状态层对比度。",
        "遵循系统偏好时仍提供可理解的用户选择，并避免切换造成闪烁或焦点丢失。"
    ]
} as const;
