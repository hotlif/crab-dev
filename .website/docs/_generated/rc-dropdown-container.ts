/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系浮层边界矩阵",
        "description": "真实触发、快速反转、上下翻转、Escape、焦点移出与 Portal 配置继承。",
        "learning": {
            "components": [
                "Button",
                "DropdownContainer"
            ],
            "props": [
                "ref",
                "aria-haspopup",
                "aria-expanded",
                "onClick",
                "closeOnFocusOut",
                "overlay"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "import { useState } from \"react\";\nimport { css, cx } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport DropdownContainer, { useDropdownContext } from \"@crab-dev/rc-dropdown-container\";\nimport Button from \"@crab-dev/rc-button\";\n\nexport const meta = { title: \"三体系浮层边界矩阵\", description: \"真实触发、快速反转、上下翻转、Escape、焦点移出与 Portal 配置继承。\" };\nconst layout = css`padding: ${token.space['section-gap']}; min-height: 22rem;`;\nconst panel = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['component-gap']}; max-width: 18rem; overflow-wrap: anywhere;`;\nconst bottomAnchor = css`position: fixed; inset-block-end: ${token.space['section-gap']}; inset-inline-start: ${token.space['section-gap']}; z-index: 1;`;\nfunction Trigger() {\n    const { state, refs, dispatch } = useDropdownContext\u003cHTMLButtonElement>();\n    return \u003cButton ref={refs.setReference} aria-haspopup=\"dialog\" aria-expanded={state.open} onClick={event => dispatch({ type: \"setOpen\", payload: !state.open, details: { reason: \"trigger\", event: event.nativeEvent } })}>打开验收浮层\u003c/Button>;\n}\nexport default function VisualMatrixDemo() {\n    const [draft, setDraft] = useState(\"保留的浮层草稿\");\n    const [position, setPosition] = useState('normal');\n    return \u003csection aria-label=\"Dropdown visual matrix\" className={layout}>\n        \u003clabel>触发位置 \u003cselect aria-label=\"触发位置\" value={position} onChange={event => setPosition(event.target.value)}>\u003coption value=\"normal\">常规位置\u003c/option>\u003coption value=\"bottom\">靠近视口底部\u003c/option>\u003c/select>\u003c/label>\n        \u003cp>连续点击触发器可反转进出场；底部位置用于检查翻转后的入场方向。\u003c/p>\n        \u003cdiv className={cx(position === 'bottom' && bottomAnchor)}>\n        \u003cDropdownContainer closeOnFocusOut overlay={\u003cdiv role=\"dialog\" aria-label=\"浮层内容\" className={panel}>\u003cstrong>上下文面板\u003c/strong>\u003cp>Long identifier: workspace_0123456789_ABCDEFGHIJKLMN\u003c/p>\u003clabel>浮层草稿\u003cinput aria-label=\"浮层草稿\" value={draft} onChange={event => setDraft(event.target.value)} />\u003c/label>\u003cButton>浮层操作\u003c/Button>\u003c/div>}>\n            \u003cTrigger />\n        \u003c/DropdownContainer>\n        \u003c/div>\n        \u003cButton>浮层外操作\u003c/Button>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-dropdown-container/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-dropdown-container/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "规格验收"
    },
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "输入框聚焦时展开浮层，失焦或按 Escape 收起；按 ArrowDown 可重新展开，输入焦点保持不变。",
        "learning": {
            "components": [
                "RcLineEdit",
                "DropdownContainer"
            ],
            "props": [
                "containerRef",
                "onFocus",
                "onBlur",
                "onKeyDown",
                "overlay"
            ],
            "events": [
                "onFocus",
                "onBlur",
                "onKeyDown"
            ],
            "hasState": false
        },
        "sourceCode": "import { useId } from \"react\";\n\nexport const meta = {\n    title: \"基本\",\n    description: \"输入框聚焦时展开浮层，失焦或按 Escape 收起；按 ArrowDown 可重新展开，输入焦点保持不变。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport RcLineEdit from \"@crab-dev/rc-line-edit\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport DropdownContainer, { useDropdownContext } from \"../../src/index.js\";\n\nconst overlayStyle = css`\n    height: calc(${token.size[20]} * 6);\n    width: calc(${token.size[20]} * 9);\n`;\n\nconst triggerLayoutStyle = css`\n    display: inline-flex;\n    flex-wrap: wrap;\n    align-items: center;\n    gap: ${token.space['component-gap']};\n    max-width: 100%;\n    min-width: 0;\n    & > label { color: ${token.color.text.primary}; }\n`;\n\nconst Input = () => {\n    const inputId = useId();\n    const {\n        state,\n        dispatch,\n        refs\n    } = useDropdownContext\u003cHTMLDivElement>();\n\n    return (\n        \u003cdiv className={triggerLayoutStyle}>\n            \u003clabel htmlFor={inputId}>浮层触发输入框\u003c/label>\n            \u003cRcLineEdit\n                id={inputId}\n                containerRef={refs.setReference}\n                onFocus={() => {\n                    dispatch({\n                        type: \"setOpen\",\n                        payload: true\n                    })\n                }}\n                onBlur={() => {\n                    dispatch({\n                        type: \"setOpen\",\n                        payload: false\n                    })\n                }}\n                onKeyDown={event => {\n                    if (event.nativeEvent.isComposing) return;\n                    if (event.key === \"Escape\" && state.open) {\n                        event.preventDefault();\n                        event.stopPropagation();\n                        dispatch({ type: \"setOpen\", payload: false });\n                    } else if (event.key === \"ArrowDown\") {\n                        event.preventDefault();\n                        dispatch({ type: \"setOpen\", payload: true });\n                    }\n                }}\n            />\n        \u003c/div>\n    )\n}\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cDropdownContainer\n                overlay={\n                    \u003cdiv className={overlayStyle}>\n                        这是一个测试页面\n                    \u003c/div>\n                }\n            >\n                \u003cInput />\n            \u003c/DropdownContainer>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-dropdown-container/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-dropdown-container/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "功能演示"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "为锚定式浮层提供定位与交互边界，使弹出内容沿用当前语义表面。",
        "usage": "触发器、浮层与关闭行为构成一个任务；业务决定内容语义和键盘模型。",
        "exampleDescription": "打开锚定浮层并改变可用空间，检查表面位置、边缘和返回焦点。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/menus/overview",
            "https://material-web.dev/components/menu/",
            "https://github.com/material-components/material-web/tree/main/menu"
        ]
    },
    "macos": {
        "summary": "为桌面弹出面板提供锚点定位，使局部工具与触发控件保持清晰关联。",
        "usage": "使用最近配置边界，浮层靠近窗口边缘时需要保持可读且不遮住关键动作。",
        "exampleDescription": "在触发控件附近打开面板，检查定位、关闭和桌面表面层级。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "以可复用定位容器承载弹出内容，边界和阴影跟随中性设计角色。",
        "usage": "容器不替业务定义菜单或列表语义；内容应提供自己的标题和操作说明。",
        "exampleDescription": "操作基础弹出容器，观察描边内容面板与触发器的相对位置。",
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
    "definition": "DropdownContainer 连接一个触发器和一个定位浮层，并通过上下文管理引用元素、开合状态与定位。它是组合基础设施，不自动决定浮层是菜单、列表还是自定义面板。",
    "useWhen": [
        "现有输入或按钮需要挂载自定义下拉内容。",
        "需要统一处理锚点定位、容器尺寸和开合事件。"
    ],
    "avoidWhen": [
        "标准选项选择直接使用 Select，命令列表使用 Menu，说明文字使用 Tooltip。"
    ],
    "essentials": [
        "触发器必须把 reference ref 交给容器，否则浮层无法可靠定位。",
        "打开原因、关闭原因和焦点行为取决于承载内容的真实语义。",
        "不要只依赖 blur 关闭复杂浮层，否则点击浮层内部也可能意外消失。"
    ],
    "accessibility": [
        "触发器使用 aria-expanded，并按浮层类型补充 aria-controls 或 aria-haspopup。",
        "菜单、列表框和对话框拥有不同键盘模型，容器不能把它们统一成同一种行为。"
    ]
} as const;
