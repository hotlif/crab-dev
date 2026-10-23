/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
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
        "sourceCode": "import { useId } from \"react\";\n\nexport const meta = {\n    title: \"基本\",\n    description: \"输入框聚焦时展开浮层，失焦或按 Escape 收起；按 ArrowDown 可重新展开，输入焦点保持不变。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport RcLineEdit from \"@crab-dev/rc-line-edit\";\nimport token from \"@crab-dev/rc-token-semantic\";\nimport DropdownContainer, { useDropdownContext } from \"../../src/index.js\";\n\nconst overlayStyle = css`\n    height: calc(${token.size[20]} * 6);\n    width: calc(${token.size[20]} * 9);\n`;\n\nconst Input = () => {\n    const inputId = useId();\n    const {\n        state,\n        dispatch,\n        refs\n    } = useDropdownContext\u003cHTMLDivElement>();\n\n    return (\n        \u003c>\n            \u003clabel htmlFor={inputId}>浮层触发输入框\u003c/label>\n            \u003cRcLineEdit\n                id={inputId}\n                containerRef={refs.setReference}\n                onFocus={() => {\n                    dispatch({\n                        type: \"setOpen\",\n                        payload: true\n                    })\n                }}\n                onBlur={() => {\n                    dispatch({\n                        type: \"setOpen\",\n                        payload: false\n                    })\n                }}\n                onKeyDown={event => {\n                    if (event.nativeEvent.isComposing) return;\n                    if (event.key === \"Escape\" && state.open) {\n                        event.preventDefault();\n                        event.stopPropagation();\n                        dispatch({ type: \"setOpen\", payload: false });\n                    } else if (event.key === \"ArrowDown\") {\n                        event.preventDefault();\n                        dispatch({ type: \"setOpen\", payload: true });\n                    }\n                }}\n            />\n        \u003c/>\n    )\n}\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cDropdownContainer\n                overlay={\n                    \u003cdiv className={overlayStyle}>\n                        这是一个测试页面\n                    \u003c/div>\n                }\n            >\n                \u003cInput />\n            \u003c/DropdownContainer>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-dropdown-container/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-dropdown-container/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
