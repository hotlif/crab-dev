/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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
        "group": "边界与视觉矩阵"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "预览密度、源码与操作",
        "description": "使用公开回调查看复制成功、失败和外部打开；真实展开动态源码。",
        "learning": {
            "components": [
                "Preview"
            ],
            "props": [
                "title",
                "description",
                "density",
                "sourceCode",
                "language",
                "codeTheme",
                "path",
                "onCopyCode",
                "onOpenExternal"
            ],
            "events": [
                "onCopyCode",
                "onOpenExternal"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Preview from '@crab-dev/rc-component-preview';\nexport const meta = { title: '预览密度、源码与操作', description: '使用公开回调查看复制成功、失败和外部打开；真实展开动态源码。' };\nconst frame = css`display: grid; min-width: 0; gap: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;\nconst source = `// 保留当前草稿 · Keep the current draft\\nexport function Workspace() {\\n    const count = 42;\\n    const ready = true;\\n    const pattern = /draft/i;\\n    return \u003cmain aria-label=\"Workspace\" data-count={count} hidden={!ready} data-valid={pattern.test('draft')}>\\n        保存草稿 · Save the draft\\n    \u003c/main>;\\n}`;\nconst examples = {\n    tsx: source,\n    javascript: 'export const draft = \"Retained draft\";',\n    js: 'export const draft = \"Retained draft\";',\n    typescript: 'export const draft: string = \"Retained draft\";',\n    ts: 'export const draft: string = \"Retained draft\";',\n    css: '.draft { color: red; padding: 16px; }',\n    json: '{ \"draft\": \"Retained draft\", \"count\": 42 }',\n    python: 'def draft():\\n    return \"Retained draft\"',\n    ruby: 'def draft\\n  \"Retained draft\"\\nend',\n    text: 'Retained draft \u003cplain text> & no syntax',\n    'unknown-language': 'Retained draft \u003cunknown language> & no syntax',\n} as const;\nexport default function VisualMatrixDemo() {\n    const { density, locale } = useConfig();\n    const [codeTheme, setCodeTheme] = useState\u003c'light' | 'dark'>('light');\n    const [language, setLanguage] = useState\u003ckeyof typeof examples>('tsx');\n    const [rejectCopy, setRejectCopy] = useState(false);\n    const [feedback, setFeedback] = useState('');\n    const english = locale === 'en-US';\n    const previewDensity = { compact: 'compact', standard: 'regular', comfortable: 'spacious' } as const;\n    return \u003csection className={frame} aria-label=\"ComponentPreview visual matrix\">\n        \u003clabel>源码配色 \u003cselect value={codeTheme} onChange={event => setCodeTheme(event.currentTarget.value === 'dark' ? 'dark' : 'light')}>\u003coption>light\u003c/option>\u003coption>dark\u003c/option>\u003c/select>\u003c/label>\n        \u003clabel>源码语言 \u003cselect value={language} onChange={event => {\n            const selected = event.currentTarget.value;\n            if (Object.hasOwn(examples, selected)) setLanguage(selected as keyof typeof examples);\n        }}>{Object.keys(examples).map(name => \u003coption key={name}>{name}\u003c/option>)}\u003c/select>\u003c/label>\n        \u003clabel>\u003cinput type=\"checkbox\" checked={rejectCopy} onChange={event => setRejectCopy(event.currentTarget.checked)} /> 拒绝复制\u003c/label>\n        \u003cPreview title={english ? 'Workspace preview' : '工作区预览'} description={english ? 'Long descriptions wrap within the preview. **Keep the current draft.**' : '较长的说明应在预览宽度内换行。**保留当前业务草稿。**'} density={previewDensity[density]} sourceCode={examples[language]} language={language} codeTheme={codeTheme} path=\"https://example.com/workspace\" onCopyCode={() => { if (rejectCopy) { setFeedback('复制失败 · Copy failed'); throw Error('Copy denied by the example'); } setFeedback('复制成功 · Copy succeeded'); }} onOpenExternal={path => setFeedback(`Open requested: ${path}`)}>\n            \u003clabel>{english ? 'Draft' : '业务草稿'} \u003cinput defaultValue=\"Retained draft\" />\u003c/label>\n        \u003c/Preview>\n        \u003coutput role={feedback.includes('failed') ? 'alert' : 'status'} aria-label=\"操作结果\">{feedback}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以色调预览容器分隔演示与说明，使真实组件和源代码拥有清楚的阅读层级。",
        "usage": "把预览视为可操作示例，操作按钮服务于源码阅读，不覆盖示例内部样式。",
        "exampleDescription": "操作预览中的组件，再展开源码，检查色调容器与代码区的层级。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/cards/overview",
            "https://material-web.dev/components/button/",
            "https://github.com/material-components/material-web/tree/main/button"
        ]
    },
    "macos": {
        "summary": "以轻量预览面板和紧凑操作区组织组件示例，内容保持独立且清晰。",
        "usage": "示例工具栏与真实交互区域分开，窄屏保持源码与复制动作可达。",
        "exampleDescription": "展开代码并使用预览操作，观察工具区域与示例面板的桌面排列。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用细描边预览区、简洁说明和源码区域展示可运行组件。",
        "usage": "让示例成为主要内容，标题和操作区保持低强调，避免重复卡片边框。",
        "exampleDescription": "对比预览与源码视图，检查中性边界和代码操作是否容易辨认。",
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
    "definition": "ComponentPreview 把运行中的示例、标题说明、源码、复制和工作台入口组合成文档卡片。它服务于学习和验证，不是业务页面中的普通 Card。",
    "useWhen": [
        "组件文档需要同时展示效果、解释和可复制源码。",
        "示例要在隔离工作台中打开，同时保留站内阅读上下文。"
    ],
    "avoidWhen": [
        "业务内容展示请使用 Card；纯代码文档不需要启动交互预览。"
    ],
    "essentials": [
        "title 说明示例主题，description 解释学习目标，不能只重复组件名。",
        "sourceCode 必须与实际运行示例来自同一文件，避免效果与代码漂移。",
        "density 调整舞台留白，不能掩盖示例自身的尺寸问题。"
    ],
    "accessibility": [
        "预览操作要形成命名清楚的操作组，展开源码时同步 aria-expanded。",
        "iframe 或隔离预览需要可访问标题、合理 Tab 顺序和可恢复的失败状态。"
    ]
} as const;
