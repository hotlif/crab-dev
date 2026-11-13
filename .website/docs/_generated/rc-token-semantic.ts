/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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
        "group": "边界与视觉矩阵"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "语义角色配对",
        "description": "实际消费 L2 的品牌、反馈、前景和边界；不建立第二份颜色表。",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nexport const meta = { title: '语义角色配对', description: '实际消费 L2 的品牌、反馈、前景和边界；不建立第二份颜色表。' };\nconst frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; overflow-wrap: anywhere;`;\nconst brand = css`\n    padding: ${token.space['component-gap']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border: 1px solid ${token.color.brand.primary}; border-radius: ${token.shape.control};\n    /* L2 already supplies Highlight/HighlightText. Suppress only this sample's\n       Canvas text backplate, which otherwise hides HighlightText on Canvas. */\n    @media (forced-colors: active) { forced-color-adjust: none; }\n`;\nconst danger = css`padding: ${token.space['component-gap']}; color: ${token.color.feedback.error.text}; background: ${token.color.feedback.error.background}; border: 1px solid ${token.color.feedback.error.border}; border-radius: ${token.shape.control};`;\nconst success = css`padding: ${token.space['component-gap']}; color: ${token.color.feedback.success.text}; background: ${token.color.feedback.success.background}; border: 1px solid ${token.color.feedback.success.border}; border-radius: ${token.shape.control};`;\nconst focus = css`font: inherit; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nexport default function VisualMatrixDemo() { return \u003csection className={frame} aria-label=\"Semantic token visual matrix\">\u003ch2>语义表面 Semantic roles\u003c/h2>\u003cdiv className={brand} data-role=\"brand\">品牌容器 · Brand container\u003c/div>\u003cdiv className={danger}>错误反馈 · Recoverable error\u003c/div>\u003cdiv className={success}>成功反馈 · Saved successfully\u003c/div>\u003cbutton className={focus} type=\"button\">键盘焦点 Focus target\u003c/button>\u003c/section>; }\n",
        "previewPath": "/components/rc-token-semantic/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-token-semantic/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "将原始材料映射为 MD3 的表面、文字、操作、选中与焦点角色。",
        "usage": "使用成对前景和背景角色，重要动作与普通内容通过语义层级区分。",
        "exampleDescription": "查看表面、文字与操作角色的实际效果，确认强调信息和内容层级。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/styles/color/system/overview",
            "https://material-web.dev/theming/",
            "https://github.com/material-components/material-web/tree/main/tokens"
        ]
    },
    "macos": {
        "summary": "将原始材料映射为 macOS 的桌面几何、字体、表面与操作材质。",
        "usage": "内容与工具层分别消费语义角色，嵌套配置边界应保持自己的已解析设计。",
        "exampleDescription": "查看桌面语义角色的表面、边界与文字，检查工具层和内容层的区别。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "将原始材料映射为 shadcn 的中性背景、边框、文字与焦点角色。",
        "usage": "通过语义变量统一字段、卡片和浮层，不在业务代码逐个复制颜色字面量。",
        "exampleDescription": "观察中性表面与边界的配对，再检查强调色和焦点角色的可辨认性。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Semantic Tokens 是 L2 语义角色，把 L1 原始值命名为背景、文字、边框、品牌、反馈、尺寸和动效用途。组件只认用途，因此主题可以替换值而不改组件代码。",
    "useWhen": [
        "应用需要统一浅色、深色和品牌主题。",
        "多个组件共享同一种内容、表面、焦点或反馈含义。"
    ],
    "avoidWhen": [
        "组件独有视觉进入 L3；不要在 L2 中加入某一个页面或业务对象的名字。"
    ],
    "essentials": [
        "颜色角色按 container/on-container 等前景背景成对使用。",
        "主题只覆盖角色值，不在组件里根据主题名称写分支。",
        "新增角色前先确认现有语义是否已经覆盖，避免同义 token 分裂。"
    ],
    "accessibility": [
        "所有主题分别验证角色配对、状态叠加和焦点环，不只检查静态色值。",
        "错误、禁用和选中含义不能只由透明度或颜色承担。"
    ]
} as const;
