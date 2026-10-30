/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系浮层边界矩阵",
        "description": "真实触发、Escape、焦点移出与 Portal 配置继承。",
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
        "sourceCode": "import { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport DropdownContainer, { useDropdownContext } from \"@crab-dev/rc-dropdown-container\";\nimport Button from \"@crab-dev/rc-button\";\n\nexport const meta = { title: \"三体系浮层边界矩阵\", description: \"真实触发、Escape、焦点移出与 Portal 配置继承。\" };\nconst layout = css`padding: ${token.space['section-gap']}; min-height: 22rem;`;\nconst panel = css`padding: ${token.space['section-gap']}; display: grid; gap: ${token.space['component-gap']}; max-width: 18rem; overflow-wrap: anywhere;`;\nfunction Trigger() {\n    const { state, refs, dispatch } = useDropdownContext\u003cHTMLButtonElement>();\n    return \u003cButton ref={refs.setReference} aria-haspopup=\"dialog\" aria-expanded={state.open} onClick={event => dispatch({ type: \"setOpen\", payload: !state.open, details: { reason: \"trigger\", event: event.nativeEvent } })}>打开验收浮层\u003c/Button>;\n}\nexport default function VisualMatrixDemo() {\n    const [draft, setDraft] = useState(\"保留的浮层草稿\");\n    return \u003csection aria-label=\"Dropdown visual matrix\" className={layout}>\n        \u003cDropdownContainer closeOnFocusOut overlay={\u003cdiv role=\"dialog\" aria-label=\"浮层内容\" className={panel}>\u003cstrong>上下文面板\u003c/strong>\u003cp>Long identifier: workspace_0123456789_ABCDEFGHIJKLMN\u003c/p>\u003clabel>浮层草稿\u003cinput aria-label=\"浮层草稿\" value={draft} onChange={event => setDraft(event.target.value)} />\u003c/label>\u003cButton>浮层操作\u003c/Button>\u003c/div>}>\n            \u003cTrigger />\n        \u003c/DropdownContainer>\n        \u003cButton>浮层外操作\u003c/Button>\n    \u003c/section>;\n}\n",
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
