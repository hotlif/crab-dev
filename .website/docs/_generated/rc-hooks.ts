/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/use-drag-resize.demo.tsx",
        "title": "useDragResize 拖拽调整尺寸",
        "description": "把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画",
        "sourceCode": "export const meta = {\n    title: \"useDragResize 拖拽调整尺寸\",\n    description: \"把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画\",\n};\n\nimport type { CSSProperties } from 'react';\nimport { useDragResize } from '../../src/index.js';\n\nconst paneStyle: CSSProperties = {\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    fontSize: 13,\n    color: '#666',\n};\n\nconst UseDragResizeDemo = () => {\n    const { size, dragging, handleProps } = useDragResize({\n        defaultSize: 180,\n        min: 100,\n        max: 320,\n        edge: 'end',\n    });\n\n    return (\n        \u003cdiv style={{ display: 'flex', height: 140, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>\n            \u003cdiv style={{ ...paneStyle, width: size, flexShrink: 0, background: dragging ? '#eef2ff' : '#fafafa' }}>\n                {Math.round(size)}px\n            \u003c/div>\n            \u003cdiv\n                {...handleProps}\n                style={{ width: 7, cursor: 'col-resize', touchAction: 'none', background: '#e2e8f0', flexShrink: 0 }}\n                title=\"拖拽调整宽度\"\n            />\n            \u003cdiv style={{ ...paneStyle, flex: 1 }}>flex 填充\u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default UseDragResizeDemo;\n",
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
        "sourceCode": "import { useEffect, useMemo, useState } from \"react\";\nimport { useKeyDown } from \"../../src/index.js\";\nexport const meta = {\n    title: \"Use Key Down\",\n    description: \"Use Key Down 示例\",\n};\nconst Demo = () => {\n    const [keyboardRef] = useKeyDown();\n    const [, setVersion] = useState(0);\n\n    useEffect(() => {\n        const onKeyActivity = () => {\n            setVersion((previous) => previous + 1);\n        };\n\n        window.addEventListener(\"keydown\", onKeyActivity);\n        window.addEventListener(\"keyup\", onKeyActivity);\n\n        return () => {\n            window.removeEventListener(\"keydown\", onKeyActivity);\n            window.removeEventListener(\"keyup\", onKeyActivity);\n        };\n    }, []);\n\n    const info = useMemo(() => {\n        const event = keyboardRef.current;\n        if (event == null) {\n            return \"等待按键输入...\";\n        }\n\n        return `${event.type}: ${event.key}`;\n    }, [keyboardRef.current]);\n\n    return (\n        \u003cdiv>\n            \u003cp>请按任意按键，观察当前监听结果：\u003c/p>\n            \u003cstrong>{info}\u003c/strong>\n        \u003c/div>\n    );\n};\n\nexport default Demo;\n",
        "previewPath": "/components/rc-hooks/workbench/?__wake_demo=docs%2Fdemos%2Fuse-key-down.demo.tsx",
        "workbenchPath": "/components/rc-hooks/workbench/#/components/docs%2Fdemos%2Fuse-key-down.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = null satisfies ComponentApiRecord | null;
