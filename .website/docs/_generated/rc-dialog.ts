/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系模态状态矩阵",
        "description": "真实打开、键盘焦点、按下、长内容和草稿保留。",
        "learning": {
            "components": [
                "Button",
                "Dialog"
            ],
            "props": [
                "onClick",
                "title",
                "open",
                "onOpenChange",
                "shouldResetContent",
                "onConfirm",
                "onCancel",
                "disabled"
            ],
            "events": [
                "onClick",
                "onOpenChange",
                "onConfirm",
                "onCancel"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useRef, useState } from \"react\";\nimport { flushSync } from \"react-dom\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport Dialog from \"@crab-dev/rc-dialog\";\nimport Button from \"@crab-dev/rc-button\";\n\nexport const meta = { title: \"三体系模态状态矩阵\", description: \"真实打开、键盘焦点、按下、长内容和草稿保留。\" };\nconst layout = css`padding: ${token.space['section-gap']}; min-height: 20rem;`;\nconst content = css`display: grid; gap: ${token.space['component-gap']}; overflow-wrap: anywhere;`;\nexport default function VisualMatrixDemo() {\n    const [open, setOpen] = useState(false);\n    const [state, setState] = useState(\"default\");\n    const [requests, setRequests] = useState(0);\n    const [pending, setPending] = useState(false);\n    // The demo owns a real pending request; resolve it on completion or unmount.\n    const complete = useRef\u003c((result: boolean) => void) | null>(null);\n    useEffect(() => () => { complete.current?.(false); }, []);\n    const request = (action: \"confirm\" | \"cancel\") => {\n        if (state !== `pending-${action}`) return action === \"confirm\" ? false : undefined;\n        // Dialog calls this inside its transition. Keep the real request counter\n        // and completion control observable while the returned promise is pending.\n        flushSync(() => { setRequests(count => count + 1); setPending(true); });\n        return new Promise\u003cboolean>(resolve => { complete.current = resolve; });\n    };\n    return \u003csection aria-label=\"Dialog visual matrix\" className={layout}>\n        \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => setState(event.target.value)}>\u003coption>default\u003c/option>\u003coption>long-content\u003c/option>\u003coption>error\u003c/option>\u003coption>pending-confirm\u003c/option>\u003coption>pending-cancel\u003c/option>\u003c/select>\u003c/label>\n        \u003cButton onClick={() => setOpen(true)}>打开验收对话框\u003c/Button>\n        \u003cDialog title=\"保存工作区 Save workspace\" open={open} onOpenChange={setOpen} shouldResetContent={false} onConfirm={() => request(\"confirm\")} onCancel={() => request(\"cancel\")}>\n            \u003cdiv className={content}>\n                \u003cp>检查布局和操作层级，取消后返回原任务。\u003c/p>\n                \u003clabel>工作区名称\u003cinput aria-label=\"工作区名称\" defaultValue=\"Crab workspace\" />\u003c/label>\n                {state.startsWith(\"pending-\") && \u003c>\u003coutput aria-label=\"异步请求次数\">{requests}\u003c/output>\u003cButton disabled={!pending} onClick={() => { complete.current?.(false); complete.current = null; setPending(false); setState(\"default\"); }}>完成异步请求\u003c/Button>\u003c/>}\n                {state === \"error\" && \u003cp role=\"alert\">工作区名称已存在，请修改后重试。\u003c/p>}\n                {state === \"long-content\" && Array.from({ length: 24 }, (_, index) => \u003cp key={index}>第 {index + 1} 段：LongWorkspaceIdentifier_ABCDEFGHIJKLMN_0123456789_继续保持操作可达。\u003c/p>)}\n            \u003c/div>\n        \u003c/Dialog>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "一个基础的对话框",
        "learning": {
            "components": [
                "Dialog",
                "Button"
            ],
            "props": [
                "title",
                "open",
                "onOpenChange",
                "onConfirm",
                "onClick"
            ],
            "events": [
                "onOpenChange",
                "onConfirm",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的对话框\",\n};\n\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\n\nimport Dialog from \"../../src/index.js\";\n\n\nconst BaseDemo = () => {\n    const [open, setOpen] = useState(false)\n    return (\n        \u003c>\n            \u003cDialog\n                title=\"基本对话框\"\n                open={open}\n                onOpenChange={setOpen}\n                onConfirm={() => true}\n            >\n                这是一个基础的对话框信息\n            \u003c/Dialog>\n            \u003cButton\n                onClick={() => {\n                    setOpen(true)\n                }}\n            >\n                打开对话框\n            \u003c/Button>\n        \u003c/>\n    )\n}\n\nexport default BaseDemo;\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/motion.demo.tsx",
        "title": "连续开关与草稿保留",
        "description": "在退出过程中重新打开，检查画面、草稿和焦点是否连续。系统减少动画时直接呈现状态。",
        "learning": {
            "components": [
                "Button",
                "Dialog"
            ],
            "props": [
                "onClick",
                "title",
                "open",
                "onOpenChange",
                "shouldResetContent"
            ],
            "events": [
                "onClick",
                "onOpenChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useRef, useState } from 'react';\nimport Dialog from '@crab-dev/rc-dialog';\nimport Button from '@crab-dev/rc-button';\n\nexport const meta = { title: '连续开关与草稿保留', description: '在退出过程中重新打开，检查画面、草稿和焦点是否连续。系统减少动画时直接呈现状态。' };\n\nexport default function MotionDemo() {\n    const [open, setOpen] = useState(false);\n    const [draft, setDraft] = useState('保留这份草稿');\n    // Mutable instance: cancel the demonstration's pending reopen on unmount.\n    const timer = useRef\u003cReturnType\u003ctypeof setTimeout> | undefined>(undefined);\n    useEffect(() => () => clearTimeout(timer.current), []);\n    return \u003c>\n        \u003cButton onClick={() => setOpen(true)}>打开连续性演示\u003c/Button>\n        \u003cDialog title=\"动效连续性\" open={open} onOpenChange={setOpen} shouldResetContent={false}>\n            \u003clabel>草稿 \u003cinput aria-label=\"连续性草稿\" value={draft} onChange={event => setDraft(event.target.value)} />\u003c/label>\n            \u003cp>点击下方按钮，面板会在关闭后 80ms 重新打开。\u003c/p>\n            \u003cButton onClick={() => {\n                clearTimeout(timer.current);\n                setOpen(false);\n                timer.current = setTimeout(() => setOpen(true), 80);\n            }}>关闭后立即重开\u003c/Button>\n        \u003c/Dialog>\n    \u003c/>;\n}\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2Fmotion.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2Fmotion.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    },
    {
        "id": "docs/demos/formWithDatePicker.demo.tsx",
        "title": "表单 + 日期选择器",
        "description": "在对话框中嵌入 rc-form 表单与 rc-date-picker 日期选择器，用对话框的「确定」按钮触发表单校验：校验通过才关闭，失败则保持打开。",
        "learning": {
            "components": [
                "Dialog",
                "Form",
                "Item",
                "LineEdit",
                "DatePicker",
                "Button"
            ],
            "props": [
                "title",
                "open",
                "onOpenChange",
                "onConfirm",
                "form",
                "defaultValue",
                "labelPlacement",
                "label",
                "name",
                "required",
                "placeholder",
                "onClick"
            ],
            "events": [
                "onOpenChange",
                "onConfirm",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "\nexport const meta = {\n    title: \"表单 + 日期选择器\",\n    description: \"在对话框中嵌入 rc-form 表单与 rc-date-picker 日期选择器，用对话框的「确定」按钮触发表单校验：校验通过才关闭，失败则保持打开。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\n\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport { DatePicker } from \"@crab-dev/rc-date-picker\";\nimport Form, { Item, useForm } from \"@crab-dev/rc-form\";\n\nimport Dialog, { TokenVars as dialogVars } from \"../../src/index.js\";\n\n// rc-date-picker 基于 Temporal，直接复用其全局 Temporal 类型。\ninterface AppointmentForm extends Record\u003cstring, unknown> {\n    name: string;\n    date: Temporal.ZonedDateTime | null;\n}\n\n// ---------- 样式 ----------\n\nconst formStyle = css`\n    width: 100%;\n    min-width: 0;\n`;\n\nconst dialogStyle = css`\n    ${dialogVars['root.min-width']}: 24rem;\n`;\n\nconst FormWithDatePickerDemo = () => {\n    const [open, setOpen] = useState(false);\n    const [form] = useForm\u003cAppointmentForm>();\n\n    return (\n        \u003c>\n            \u003cDialog\n                className={dialogStyle}\n                title=\"预约信息\"\n                open={open}\n                onOpenChange={setOpen}\n                onConfirm={async () => {\n                    try {\n                        const values = await form.validateFields();\n                        console.log(\"[submit:success]\", values);\n                        return true; // 校验通过 → 关闭对话框\n                    } catch (error) {\n                        console.warn(\"[submit:failed]\", error);\n                        return false; // 校验失败 → 保持打开\n                    }\n                }}\n            >\n                \u003cForm\n                    className={formStyle}\n                    form={form}\n                    defaultValue={{ name: \"\", date: null }}\n                >\n                    \u003cItem labelPlacement=\"control\" label=\"姓名\" name=\"name\" required>\n                        \u003cLineEdit placeholder=\"请输入姓名\" />\n                    \u003c/Item>\n                    \u003cItem labelPlacement=\"control\" label=\"预约日期\" name=\"date\" required>\n                        \u003cDatePicker placeholder=\"请选择日期\" />\n                    \u003c/Item>\n                \u003c/Form>\n            \u003c/Dialog>\n            \u003cButton onClick={() => setOpen(true)}>打开预约对话框\u003c/Button>\n        \u003c/>\n    );\n};\n\nexport default FormWithDatePickerDemo;\n",
        "previewPath": "/components/rc-dialog/workbench/?__wake_demo=docs%2Fdemos%2FformWithDatePicker.demo.tsx",
        "workbenchPath": "/components/rc-dialog/workbench/#/components/docs%2Fdemos%2FformWithDatePicker.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "用独立的对话表面集中呈现需要决策的内容，标题、说明和动作形成明确层级。",
        "usage": "只在任务必须中断时打开对话框；用明确的确认与取消文案说明后果。",
        "exampleDescription": "打开基础对话框，检查初始焦点、确认操作和关闭后的焦点恢复。",
        "demos": [
            "base.demo.tsx",
            "formWithDatePicker.demo.tsx",
            "motion.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/dialogs/overview",
            "https://material-web.dev/components/dialog/",
            "https://github.com/material-components/material-web/tree/main/dialog"
        ]
    },
    "macos": {
        "summary": "以桌面任务对话区域承载确认与短表单，操作层与内容层保持清晰分隔。",
        "usage": "主要动作应明确而克制，长内容可以滚动；背景窗口不能继续接收模态交互。",
        "exampleDescription": "在对话框内填写日期表单，检查内层弹出面板和关闭后的焦点路径。",
        "demos": [
            "formWithDatePicker.demo.tsx",
            "base.demo.tsx",
            "motion.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以中性对话表面、细边界和简洁动作区承载集中任务。",
        "usage": "标题解释任务目的，正文给出必要信息，按钮说明动作而不是泛化的确定。",
        "exampleDescription": "通过触发按钮打开并关闭对话框，检查边界、遮罩及键盘退出路径。",
        "demos": [
            "base.demo.tsx",
            "formWithDatePicker.demo.tsx",
            "motion.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Dialog 在顶层表面中聚焦一项需要确认、输入或决定的任务，并暂时限制用户与背景内容交互。它不是普通信息卡片，打开和关闭都必须管理焦点。",
    "useWhen": [
        "删除、授权、离开未保存内容等关键决定需要明确确认。",
        "一项短小任务必须先完成或取消，才能回到原页面。"
    ],
    "avoidWhen": [
        "长表单和复杂工作流使用独立页面或 Drawer；非阻塞说明使用 Alert、Notification 或 Tooltip。"
    ],
    "essentials": [
        "标题说明决定对象，正文解释影响，按钮使用具体动作名称。",
        "受控 open 决定是否显示，onClose 统一处理取消、Escape 和遮罩等关闭来源。",
        "内容过长时保持标题与操作可理解，不要把完整页面塞进小对话框。"
    ],
    "accessibility": [
        "打开时把焦点放到合理元素，Tab 留在对话框内，关闭后恢复到触发器。",
        "对话框必须有可访问名称；危险确认的默认焦点要经过审慎选择。"
    ]
} as const;
