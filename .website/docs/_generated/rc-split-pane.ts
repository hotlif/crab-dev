/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize\",\n};\n\nimport type { CSSProperties } from 'react';\nimport SplitPane from '../../src/index.js';\n\nconst paneStyle: CSSProperties = {\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    height: '100%',\n    fontSize: 13,\n    color: '#666',\n};\n\nconst BasicDemo = () => (\n    \u003cdiv style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>\n        \u003cSplitPane defaultSize={200} min={120} max={360}>\n            \u003cdiv style={{ ...paneStyle, background: '#fafafa' }}>左侧（200px 起，120~360）\u003c/div>\n            \u003cdiv style={paneStyle}>右侧 flex 填充\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/persist.demo.tsx",
        "title": "记住尺寸与键盘调整",
        "description": "persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位",
        "sourceCode": "export const meta = {\n    title: \"记住尺寸与键盘调整\",\n    description: \"persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位\",\n};\n\nimport { useState } from 'react';\nimport type { CSSProperties } from 'react';\nimport SplitPane from '../../src/index.js';\n\nconst paneStyle: CSSProperties = {\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    height: '100%',\n    fontSize: 13,\n    color: '#666',\n};\n\nconst PersistDemo = () => {\n    const [size, setSize] = useState\u003cnumber | null>(null);\n\n    return (\n        \u003cdiv style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>\n            \u003cSplitPane\n                defaultSize={200}\n                min={120}\n                max={400}\n                step={24}\n                persistKey=\"rc-split-pane-demo\"\n                onSizeChange={setSize}\n            >\n                \u003cdiv style={{ ...paneStyle, background: '#fafafa' }}>\n                    {size === null ? '拖我，然后刷新页面' : `${Math.round(size)}px`}\n                \u003c/div>\n                \u003cdiv style={paneStyle}>右侧 flex 填充\u003c/div>\n            \u003c/SplitPane>\n        \u003c/div>\n    );\n};\n\nexport default PersistDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fpersist.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fpersist.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/primary-second.demo.tsx",
        "title": "定宽侧在后",
        "description": "primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转",
        "sourceCode": "export const meta = {\n    title: \"定宽侧在后\",\n    description: \"primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转\",\n};\n\nimport type { CSSProperties } from 'react';\nimport SplitPane from '../../src/index.js';\n\nconst paneStyle: CSSProperties = {\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    height: '100%',\n    fontSize: 13,\n    color: '#666',\n};\n\nconst PrimarySecondDemo = () => (\n    \u003cdiv style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>\n        \u003cSplitPane primary=\"second\" defaultSize={220} min={160} max={400}>\n            \u003cdiv style={paneStyle}>内容区 flex 填充\u003c/div>\n            \u003cdiv style={{ ...paneStyle, background: '#f8faff' }}>右侧栏（220px 起）\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default PrimarySecondDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fprimary-second.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fprimary-second.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/vertical.demo.tsx",
        "title": "上下分栏",
        "description": "direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局",
        "sourceCode": "export const meta = {\n    title: \"上下分栏\",\n    description: \"direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局\",\n};\n\nimport type { CSSProperties } from 'react';\nimport SplitPane from '../../src/index.js';\n\nconst paneStyle: CSSProperties = {\n    display: 'flex',\n    alignItems: 'center',\n    justifyContent: 'center',\n    height: '100%',\n    fontSize: 13,\n    color: '#666',\n};\n\nconst VerticalDemo = () => (\n    \u003cdiv style={{ height: 220, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>\n        \u003cSplitPane direction=\"vertical\" defaultSize={120} min={60} max={180}>\n            \u003cdiv style={paneStyle}>主区\u003c/div>\n            \u003cdiv style={{ ...paneStyle, background: '#1e293b', color: '#94a3b8' }}>控制台\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default VerticalDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fvertical.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fvertical.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
