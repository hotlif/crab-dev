/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "四种类型的警告提示，通过 `type` 属性设置",
        "learning": {
            "components": [
                "Alert"
            ],
            "props": [
                "type"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"四种类型的警告提示，通过 `type` 属性设置\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Alert from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cAlert type=\"success\">Success — 操作成功完成\u003c/Alert>\n            \u003cAlert type=\"info\">Info — 这是一条信息提示\u003c/Alert>\n            \u003cAlert type=\"warning\">Warning — 请注意潜在的问题\u003c/Alert>\n            \u003cAlert type=\"error\">Error — 发生了错误，请检查\u003c/Alert>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/closable.demo.tsx",
        "title": "可关闭",
        "description": "设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除",
        "learning": {
            "components": [
                "Alert",
                "Button"
            ],
            "props": [
                "type",
                "closable",
                "onClose",
                "title",
                "closeIcon",
                "appearance",
                "onClick"
            ],
            "events": [
                "onClose",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"可关闭\",\n    description: \"设置 `closable` 属性可显示关闭按钮，点击关闭后组件从 DOM 中移除\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport Alert from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['section-gap']};\n`;\nconst statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;\nconst resetStyle = css`align-self: flex-start;`;\n\nconst ClosableDemo = () => {\n    const [resetKey, setResetKey] = useState(0);\n    const [closedCount, setClosedCount] = useState(0);\n    const total = 4;\n\n    const handleClose = () => {\n        setClosedCount(count => count + 1);\n    };\n\n    const handleReset = () => {\n        setResetKey((k) => k + 1);\n        setClosedCount(0);\n    };\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv key={resetKey} className={stackStyle}>\n                \u003cAlert type=\"info\" closable onClose={handleClose}>\n                    这条提示可以被关闭\n                \u003c/Alert>\n                \u003cAlert type=\"warning\" title=\"警告\" closable onClose={handleClose}>\n                    这条带标题的警告可以被关闭\n                \u003c/Alert>\n                \u003cAlert\n                    type=\"error\"\n                    closable\n                    closeIcon={\u003cspan>×\u003c/span>}\n                    onClose={handleClose}\n                >\n                    自定义关闭图标\n                \u003c/Alert>\n                \u003cAlert type=\"success\" closable onClose={handleClose}>\n                    关闭后触发 onClose 回调\n                \u003c/Alert>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\">已关闭 {closedCount} / {total} 条提示。\u003c/p>\n            {closedCount > 0 && (\n                \u003cButton\n                    appearance=\"outlined\"\n                    onClick={handleReset}\n                    className={resetStyle}\n                >\n                    重新显示全部\n                \u003c/Button>\n            )}\n        \u003c/div>\n    );\n};\n\nexport default ClosableDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Fclosable.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Fclosable.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/title.demo.tsx",
        "title": "带标题",
        "description": "通过 `title` 属性设置标题，适合展示更多详情",
        "learning": {
            "components": [
                "Alert"
            ],
            "props": [
                "type",
                "title"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"带标题\",\n    description: \"通过 `title` 属性设置标题，适合展示更多详情\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Alert from \"../../src/index.js\";\n\nconst TitleDemo = () => {\n    return (\n        \u003cdiv\n            className={css`\n                display: flex;\n                flex-direction: column;\n                gap: 1rem;\n            `}\n        >\n            \u003cAlert type=\"success\" title=\"操作成功\">\n                你的修改已经保存，可以继续编辑其他内容。\n            \u003c/Alert>\n            \u003cAlert type=\"info\" title=\"提示信息\">\n                本功能目前处于测试阶段，可能会有变更。\n            \u003c/Alert>\n            \u003cAlert type=\"warning\" title=\"注意\">\n                你的存储空间即将用尽，请及时清理。\n            \u003c/Alert>\n            \u003cAlert type=\"error\" title=\"提交失败\">\n                网络连接异常，请检查你的网络设置后重试。\n            \u003c/Alert>\n        \u003c/div>\n    );\n};\n\nexport default TitleDemo;\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Ftitle.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Ftitle.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系展示与状态矩阵",
        "description": "公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Alert",
                "Button"
            ],
            "props": [
                "size",
                "density",
                "data-visual-target",
                "type",
                "title",
                "closable",
                "onClose",
                "action",
                "appearance",
                "onClick"
            ],
            "events": [
                "onClose",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Alert from '@crab-dev/rc-alert';\n\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('medium');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [count, setCount] = useState(0);\n    const [draft, setDraft] = useState('保留这份草稿');\n    \n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>medium\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>standard\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"title\">title\u003c/option>\u003coption value=\"action\">action\u003c/option>\u003coption value=\"hover\">hover\u003c/option>\u003coption value=\"focus-visible\">focus-visible\u003c/option>\u003coption value=\"pressed\">pressed\u003c/option>\u003coption value=\"error\">error\u003c/option>\u003coption value=\"closed\">closed\u003c/option>\u003c/select>\u003c/label>\n            \n        \u003c/div>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Alert visual matrix\" data-visual-frame>\n                \u003cdiv className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>\n                    \u003cAlert key={state} data-visual-target type={state === 'error' ? 'error' : 'info'} title={state === 'title' ? copy('同步结果', 'Sync result') : undefined} closable onClose={() => setCount(count + 1)} action={state === 'action' ? \u003cButton appearance=\"text\" onClick={() => setCount(count + 1)}>{copy('重试', 'Retry')}\u003c/Button> : undefined}>{state === 'error' ? copy('保存失败。请检查连接后重试。', 'Save failed. Check the connection and try again.') : copy('工作区更改已保存。可以继续编辑下一条记录。', 'Workspace changes are saved. Continue editing the next record.')}\u003c/Alert>\n                    \u003cAlert type=\"success\">{copy('保存成功', 'Saved successfully')}\u003c/Alert>\u003cAlert type=\"warning\">{copy('连接不稳定', 'Connection is unstable')}\u003c/Alert>\n                \u003c/div>\n                \u003coutput aria-label=\"操作次数\">{count}\u003c/output>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-alert/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-alert/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以色调容器承载持续反馈，标题与图标共同说明信息、成功、警告或错误。内联提示是项目扩展。",
        "usage": "把提示放在受影响内容附近，主要操作保留明确强调，关闭操作保持低强调。",
        "exampleDescription": "从四种反馈开始，检查色调表面上的标题和说明，再尝试关闭提示。",
        "demos": [
            "basic.demo.tsx",
            "closable.demo.tsx",
            "title.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/snackbar/overview",
            "https://material-web.dev/components/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "以轻量反馈底色和紧凑标题提示当前工作区的状态，内容与关闭操作清晰分开。",
        "usage": "在设置或文档区域保留持续提示，避免用浮动材质遮住需要阅读的错误详情。",
        "exampleDescription": "关闭一条工作区提示，观察剩余内容的位置，并检查关闭按钮的键盘焦点。",
        "demos": [
            "closable.demo.tsx",
            "basic.demo.tsx",
            "title.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用中性表面、细描边与文字层级组织内联反馈，危险状态通过图标和文案共同表达。",
        "usage": "适合表单和管理页面中的局部提示；语义状态色是本库在基础提示模式上的扩展。",
        "exampleDescription": "先查看带标题的提示，再对比基础反馈，确认长说明仍保持清晰阅读层级。",
        "demos": [
            "title.demo.tsx",
            "basic.demo.tsx",
            "closable.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Alert 是放在页面内容中的持续提示，用标题说明发生了什么，用正文解释原因、影响和下一步。它不会像短暂消息那样自动消失，因此适合需要用户读完再继续的状态信息。",
    "useWhen": [
        "保存结果、权限限制或风险说明需要一直留在当前上下文中。",
        "一段内容需要 success、info、warning 或 error 语义，并可能允许用户关闭。"
    ],
    "avoidWhen": [
        "只需短暂确认一次操作结果时使用 Message；必须打断流程并要求决策时使用 Dialog。"
    ],
    "essentials": [
        "先选 type，再写能独立成立的 title，children 只补充原因和行动。",
        "closable 只表示可以移除提示，业务状态仍应由外部状态管理。",
        "提示离相关内容越近，用户越容易理解它影响的是哪一部分。"
    ],
    "accessibility": [
        "不要只靠颜色区分状态，标题或正文应直接写出成功、警告或错误含义。",
        "动态出现的重要错误需要合适的状态通告；可关闭提示必须提供可访问名称清楚的关闭按钮。"
    ]
} as const;
