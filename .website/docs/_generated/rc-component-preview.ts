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
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport Preview from '@crab-dev/rc-component-preview';\nexport const meta = { title: '预览密度、源码与操作', description: '使用公开回调查看复制成功、失败和外部打开；真实展开动态源码。' };\nconst frame = css`display: grid; min-width: 0; gap: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;\nconst source = `export function Workspace() {\\n    return \u003cmain aria-label=\"Workspace\">\\n        保存草稿 · Save the draft\\n    \u003c/main>;\\n}`;\nexport default function VisualMatrixDemo() {\n    const { density, locale } = useConfig();\n    const [codeTheme, setCodeTheme] = useState\u003c'light' | 'dark'>('light');\n    const [rejectCopy, setRejectCopy] = useState(false);\n    const [feedback, setFeedback] = useState('');\n    const english = locale === 'en-US';\n    const previewDensity = { compact: 'compact', standard: 'regular', comfortable: 'spacious' } as const;\n    return \u003csection className={frame} aria-label=\"ComponentPreview visual matrix\">\n        \u003clabel>源码配色 \u003cselect value={codeTheme} onChange={event => setCodeTheme(event.currentTarget.value === 'dark' ? 'dark' : 'light')}>\u003coption>light\u003c/option>\u003coption>dark\u003c/option>\u003c/select>\u003c/label>\n        \u003clabel>\u003cinput type=\"checkbox\" checked={rejectCopy} onChange={event => setRejectCopy(event.currentTarget.checked)} /> 拒绝复制\u003c/label>\n        \u003cPreview title={english ? 'Workspace preview' : '工作区预览'} description={english ? 'Long descriptions wrap within the preview. **Keep the current draft.**' : '较长的说明应在预览宽度内换行。**保留当前业务草稿。**'} density={previewDensity[density]} sourceCode={source} codeTheme={codeTheme} path=\"https://example.com/workspace\" onCopyCode={() => { if (rejectCopy) { setFeedback('复制失败 · Copy failed'); throw Error('Copy denied by the example'); } setFeedback('复制成功 · Copy succeeded'); }} onOpenExternal={path => setFeedback(`Open requested: ${path}`)}>\n            \u003clabel>{english ? 'Draft' : '业务草稿'} \u003cinput defaultValue=\"Retained draft\" />\u003c/label>\n        \u003c/Preview>\n        \u003coutput role={feedback.includes('failed') ? 'alert' : 'status'} aria-label=\"操作结果\">{feedback}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-component-preview/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-component-preview/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];
