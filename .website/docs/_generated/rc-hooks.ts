/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/use-drag-resize.demo.tsx",
        "title": "useDragResize 拖拽调整尺寸",
        "description": "把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"useDragResize 拖拽调整尺寸\",\n    description: \"把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画\",\n};\n\nimport { useDragResize } from '../../src/index.js';\n\nconst UseDragResizeDemo = () => {\n    const { size, dragging, handleProps } = useDragResize({\n        defaultSize: 180,\n        min: 100,\n        max: 320,\n        edge: 'end',\n    });\n\n    return (\n        \u003cdiv className=\"crab-hooks-drag-resize\">\n            \u003cdiv\n                className=\"crab-hooks-drag-resize__pane crab-hooks-drag-resize__resizable\"\n                data-dragging={dragging}\n                style={{ width: size }}\n            >\n                {Math.round(size)}px\n            \u003c/div>\n            \u003cdiv\n                {...handleProps}\n                className=\"crab-hooks-drag-resize__handle\"\n                title=\"拖拽调整宽度\"\n            />\n            \u003cdiv className=\"crab-hooks-drag-resize__pane crab-hooks-drag-resize__remainder\">flex 填充\u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default UseDragResizeDemo;\n",
        "previewPath": "/components/rc-hooks/workbench/?__wake_demo=docs%2Fdemos%2Fuse-drag-resize.demo.tsx",
        "workbenchPath": "/components/rc-hooks/workbench/#/components/docs%2Fdemos%2Fuse-drag-resize.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/use-key-down.demo.tsx",
        "title": "Use Key Down",
        "description": "Use Key Down 示例",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useEffect, useMemo, useState } from \"react\";\nimport { useKeyDown } from \"../../src/index.js\";\nexport const meta = {\n    title: \"Use Key Down\",\n    description: \"Use Key Down 示例\",\n};\nconst Demo = () => {\n    const [keyboardRef] = useKeyDown();\n    const [, setVersion] = useState(0);\n\n    useEffect(() => {\n        const onKeyActivity = () => {\n            setVersion((previous) => previous + 1);\n        };\n\n        window.addEventListener(\"keydown\", onKeyActivity);\n        window.addEventListener(\"keyup\", onKeyActivity);\n\n        return () => {\n            window.removeEventListener(\"keydown\", onKeyActivity);\n            window.removeEventListener(\"keyup\", onKeyActivity);\n        };\n    }, []);\n\n    const info = useMemo(() => {\n        const event = keyboardRef.current;\n        if (event == null) {\n            return \"等待按键输入...\";\n        }\n\n        return `${event.type}: ${event.key}`;\n    }, [keyboardRef.current]);\n\n    return (\n        \u003cdiv>\n            \u003cp>请按任意按键，观察当前监听结果：\u003c/p>\n            \u003cstrong>{info}\u003c/strong>\n        \u003c/div>\n    );\n};\n\nexport default Demo;\n",
        "previewPath": "/components/rc-hooks/workbench/?__wake_demo=docs%2Fdemos%2Fuse-key-down.demo.tsx",
        "workbenchPath": "/components/rc-hooks/workbench/#/components/docs%2Fdemos%2Fuse-key-down.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "为交互组件提供状态与事件基础，Hook 本身不定义外观，消费方沿用当前设计。",
        "usage": "把拖拽、尺寸与键盘逻辑接入语义控件，视觉反馈仍使用当前表面和焦点角色。",
        "exampleDescription": "按下示例声明的快捷键，检查可读结果与键盘焦点是否保持一致。",
        "demos": [
            "use-key-down.demo.tsx",
            "use-drag-resize.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/foundations/interaction/overview",
            "https://material-web.dev/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "为桌面工作区提供尺寸调整和键盘行为基础，保持事件逻辑与控件外观分离。",
        "usage": "窗口式面板的拖拽调整应有约束和可预测结果，不能只依赖鼠标操作说明。",
        "exampleDescription": "调整示例区域尺寸，观察紧凑工作区中的边界与结果变化。",
        "demos": [
            "use-drag-resize.demo.tsx",
            "use-key-down.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "提供可组合的交互 Hook，供中性界面中的控件复用事件与测量逻辑。",
        "usage": "先确定事件职责，再为消费方提供明确标签、状态和必要的键盘操作。",
        "exampleDescription": "触发键盘操作并读取结果，确认逻辑复用不会改变控件的可访问语义。",
        "demos": [
            "use-key-down.demo.tsx",
            "use-drag-resize.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "rc-hooks 收集可复用的 React 状态与浏览器交互逻辑，例如键盘、拖拽、尺寸和受控值。Hook 不渲染界面，使用者必须把返回状态和事件正确连接到有语义的组件。",
    "useWhen": [
        "多个组件需要共享同一套交互状态机。",
        "浏览器事件、订阅或测量逻辑需要安全地处理挂载和卸载。"
    ],
    "avoidWhen": [
        "只在一个组件中使用的简单状态保留在组件内部；不要用 Hook 隐藏不可见的全局副作用。"
    ],
    "essentials": [
        "先读清输入、返回值和生命周期，再把 Hook 接到组件。",
        "受控/非受控逻辑要明确默认值、外部值和变更回调的优先级。",
        "事件监听、计时器和观察器必须在卸载时清理。"
    ],
    "accessibility": [
        "键盘 Hook 只是能力，最终元素仍需正确角色、名称和焦点管理。",
        "拖拽或动画 Hook 必须提供键盘替代操作并尊重减少动态效果。"
    ]
} as const;
