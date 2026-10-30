/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "分栏验收矩阵",
        "description": "实际拖动、键盘步进、上下限及复位；水平和垂直分栏共用公开尺寸协议。",
        "learning": {
            "components": [
                "SplitPane"
            ],
            "props": [
                "aria-label",
                "direction",
                "defaultSize",
                "min",
                "max",
                "disabled"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport SplitPane from '@crab-dev/rc-split-pane';\n\nexport const meta = {\n    title: '分栏验收矩阵',\n    description: '实际拖动、键盘步进、上下限及复位；水平和垂直分栏共用公开尺寸协议。',\n};\nconst frame = css`\n    width: 100%;\n    min-width: 0;\n    max-width: 800px;\n    height: 300px;\n    padding: ${token.space['component-gap']};\n    box-sizing: border-box;\n    color: ${token.color.text.primary};\n    background: ${token.color.surface.content};\n`;\nconst pane = css`\n    height: 100%;\n    box-sizing: border-box;\n    overflow: auto;\n    padding: ${token.space['component-gap']};\n    border: 1px solid ${token.color.border.default};\n    background: ${token.color.surface.content};\n    overflow-wrap: anywhere;\n`;\nexport default function VisualMatrixDemo() {\n    const [mode, setMode] = useState('horizontal');\n    return (\n        \u003c>\n            \u003clabel>\n                验收状态{' '}\n                \u003cselect aria-label=\"验收状态\" value={mode} onChange={(event) => setMode(event.target.value)}>\n                    \u003coption value=\"horizontal\">水平\u003c/option>\n                    \u003coption value=\"vertical\">垂直\u003c/option>\n                    \u003coption value=\"disabled\">禁用\u003c/option>\n                \u003c/select>\n            \u003c/label>\n            \u003csection aria-label=\"SplitPane visual matrix\" className={frame}>\n                \u003cSplitPane\n                    aria-label=\"工作区分栏\"\n                    direction={mode === 'vertical' ? 'vertical' : 'horizontal'}\n                    defaultSize={120}\n                    min={64}\n                    max={220}\n                    disabled={mode === 'disabled'}\n                >\n                    \u003cdiv className={pane}>\n                        资源 Resource\n                        \u003cbr />\n                        长内容保持在面板内 / Content remains inside the pane.\n                    \u003c/div>\n                    \u003cdiv className={pane}>\n                        编辑区域 Editor\n                        \u003cbr />\n                        方向键调整 / Arrow keys resize\n                    \u003c/div>\n                \u003c/SplitPane>\n            \u003c/section>\n        \u003c/>\n    );\n}\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "三体系验收"
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize",
        "learning": {
            "components": [
                "SplitPane"
            ],
            "props": [
                "defaultSize",
                "min",
                "max"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize\",\n};\n\nimport { cx } from '@crab-dev/css';\nimport { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';\nimport SplitPane from '../../src/index.js';\n\n\nconst BasicDemo = () => (\n    \u003cdiv className={frameStyle}>\n        \u003cSplitPane defaultSize={200} min={120} max={360}>\n            \u003cdiv className={cx(paneStyle, sidebarStyle)}>左侧（200px 起，120~360）\u003c/div>\n            \u003cdiv className={paneStyle}>右侧 flex 填充\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "分栏与尺寸控制"
    },
    {
        "id": "docs/demos/vertical.demo.tsx",
        "title": "上下分栏",
        "description": "direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局",
        "learning": {
            "components": [
                "SplitPane"
            ],
            "props": [
                "direction",
                "defaultSize",
                "min",
                "max"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"上下分栏\",\n    description: \"direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局\",\n};\n\nimport { cx } from '@crab-dev/css';\nimport { frameStyle, paneStyle, consoleStyle, tallFrameStyle } from '../demo-style.js';\nimport SplitPane from '../../src/index.js';\n\n\nconst VerticalDemo = () => (\n    \u003cdiv className={cx(frameStyle, tallFrameStyle)}>\n        \u003cSplitPane direction=\"vertical\" defaultSize={120} min={60} max={180}>\n            \u003cdiv className={paneStyle}>主区\u003c/div>\n            \u003cdiv className={cx(paneStyle, consoleStyle)}>控制台\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default VerticalDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fvertical.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fvertical.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "分栏与尺寸控制"
    },
    {
        "id": "docs/demos/primary-second.demo.tsx",
        "title": "定宽侧在后",
        "description": "primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转",
        "learning": {
            "components": [
                "SplitPane"
            ],
            "props": [
                "primary",
                "defaultSize",
                "min",
                "max"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"定宽侧在后\",\n    description: \"primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转\",\n};\n\nimport { cx } from '@crab-dev/css';\nimport { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';\nimport SplitPane from '../../src/index.js';\n\n\nconst PrimarySecondDemo = () => (\n    \u003cdiv className={frameStyle}>\n        \u003cSplitPane primary=\"second\" defaultSize={220} min={160} max={400}>\n            \u003cdiv className={paneStyle}>内容区 flex 填充\u003c/div>\n            \u003cdiv className={cx(paneStyle, sidebarStyle)}>右侧栏（220px 起）\u003c/div>\n        \u003c/SplitPane>\n    \u003c/div>\n);\n\nexport default PrimarySecondDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fprimary-second.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fprimary-second.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "分栏与尺寸控制"
    },
    {
        "id": "docs/demos/persist.demo.tsx",
        "title": "记住尺寸与键盘调整",
        "description": "persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位",
        "learning": {
            "components": [
                "SplitPane"
            ],
            "props": [
                "defaultSize",
                "min",
                "max",
                "step",
                "persistKey",
                "onSizeChange"
            ],
            "events": [
                "onSizeChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"记住尺寸与键盘调整\",\n    description: \"persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位\",\n};\n\nimport { useState } from 'react';\nimport { cx } from '@crab-dev/css';\nimport { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';\nimport SplitPane from '../../src/index.js';\n\n\nconst PersistDemo = () => {\n    const [size, setSize] = useState\u003cnumber | null>(null);\n\n    return (\n        \u003cdiv className={frameStyle}>\n            \u003cSplitPane\n                defaultSize={200}\n                min={120}\n                max={400}\n                step={24}\n                persistKey=\"rc-split-pane-demo\"\n                onSizeChange={setSize}\n            >\n                \u003cdiv className={cx(paneStyle, sidebarStyle)}>\n                    {size === null ? '拖我，然后刷新页面' : `${Math.round(size)}px`}\n                \u003c/div>\n                \u003cdiv className={paneStyle}>右侧 flex 填充\u003c/div>\n            \u003c/SplitPane>\n        \u003c/div>\n    );\n};\n\nexport default PersistDemo;\n",
        "previewPath": "/components/rc-split-pane/workbench/?__wake_demo=docs%2Fdemos%2Fpersist.demo.tsx",
        "workbenchPath": "/components/rc-split-pane/workbench/#/components/docs%2Fdemos%2Fpersist.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "分栏与尺寸控制"
    }
] as const satisfies readonly ComponentDemoRecord[];
