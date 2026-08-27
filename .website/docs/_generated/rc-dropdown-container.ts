/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "基本",
        "description": "一个基础的消息通知组件",
        "sourceCode": "\nexport const meta = {\n    title: \"基本\",\n    description: \"一个基础的消息通知组件\",\n};\n\nimport RcLineEdit from \"@crab-dev/rc-line-edit\"\nimport DropdownContainer, { useDropdownContext } from \"../../src/index.js\";\n\nconst Input = () => {\n    const {\n        dispatch,\n        refs\n    } = useDropdownContext\u003cHTMLDivElement>();\n\n    return (\n        \u003cRcLineEdit\n            containerRef={refs.setReference}\n            onFocus={() => {\n                dispatch({\n                    type: \"setOpen\",\n                    payload: true\n                })\n            }}\n            onBlur={() => {\n                dispatch({\n                    type: \"setOpen\",\n                    payload: false\n                })\n            }}\n        />\n    )\n}\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cDropdownContainer\n                overlay={\n                    \u003cdiv\n                        style={{\n                            height: 120,\n                            width: 180\n                        }}\n                    >\n                        这是一个测试页面\n                    \u003c/div>\n                }\n            >\n                \u003cInput />\n            \u003c/DropdownContainer>\n        \u003c/div>\n    )\n}\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-dropdown-container/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-dropdown-container/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "DropdownContainer",
    "symbol": "DropdownContainerProps",
    "props": [
        {
            "name": "floatingContainerProps",
            "required": false,
            "description": "浮动面板的属性信息",
            "typeText": "HTMLAttributes\u003cHTMLDivElement>",
            "defaultValue": "{}",
            "deprecated": false
        },
        {
            "name": "overlay",
            "required": true,
            "description": "下拉组件内容",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "overlayClassName",
            "required": false,
            "description": "浮层弹出面板的自定义类名",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
