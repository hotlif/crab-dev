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
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nexport const meta = { title: '语义角色配对', description: '实际消费 L2 的品牌、反馈、前景和边界；不建立第二份颜色表。' };\nconst frame = css`display: grid; gap: ${token.space['component-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.card}; overflow-wrap: anywhere;`;\nconst brand = css`padding: ${token.space['component-gap']}; color: ${token.color.brand['on-container']}; background: ${token.color.brand.container}; border: 1px solid ${token.color.brand.primary}; border-radius: ${token.shape.control};`;\nconst danger = css`padding: ${token.space['component-gap']}; color: ${token.color.feedback.error.text}; background: ${token.color.feedback.error.background}; border: 1px solid ${token.color.feedback.error.border}; border-radius: ${token.shape.control};`;\nconst success = css`padding: ${token.space['component-gap']}; color: ${token.color.feedback.success.text}; background: ${token.color.feedback.success.background}; border: 1px solid ${token.color.feedback.success.border}; border-radius: ${token.shape.control};`;\nconst focus = css`font: inherit; padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; border: 1px solid ${token.color.border.default}; border-radius: ${token.shape.control}; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }`;\nexport default function VisualMatrixDemo() { return \u003csection className={frame} aria-label=\"Semantic token visual matrix\">\u003ch2>语义表面 Semantic roles\u003c/h2>\u003cdiv className={brand} data-role=\"brand\">品牌容器 · Brand container\u003c/div>\u003cdiv className={danger}>错误反馈 · Recoverable error\u003c/div>\u003cdiv className={success}>成功反馈 · Saved successfully\u003c/div>\u003cbutton className={focus} type=\"button\">键盘焦点 Focus target\u003c/button>\u003c/section>; }\n",
        "previewPath": "/components/rc-token-semantic/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-token-semantic/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];
