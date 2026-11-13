/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

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

export const documents = {
    "md3": {
        "summary": "将相关内容放入可调整分区，分隔与表面角色帮助理解空间关系。",
        "usage": "内容区各自保持最小可读尺寸，分隔条需要键盘操作与可访问名称。",
        "exampleDescription": "调整两个分区的宽度，检查语义表面、内容约束和分隔位置。",
        "demos": [
            "basic.demo.tsx",
            "persist.demo.tsx",
            "primary-second.demo.tsx",
            "vertical.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/divider/overview",
            "https://material-web.dev/components/divider/",
            "https://github.com/material-components/material-web/tree/main/divider"
        ]
    },
    "macos": {
        "summary": "为桌面侧栏、编辑器与检查器提供可调整分栏，贴合窗口式工作方式。",
        "usage": "保留侧栏最小宽度和主内容空间，持久化尺寸时考虑窗口变化。",
        "exampleDescription": "调整并恢复分栏尺寸，观察桌面工作区域在重新打开后的比例。",
        "demos": [
            "persist.demo.tsx",
            "basic.demo.tsx",
            "primary-second.demo.tsx",
            "vertical.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用清晰的细分隔组织可调整内容面板，适合编辑器和数据工具。",
        "usage": "分栏边界应易于操作，竖向分区需要分别约束滚动和最小高度。",
        "exampleDescription": "拖动竖向分隔并检查两个内容区，确认边界、滚动和尺寸约束。",
        "demos": [
            "vertical.demo.tsx",
            "basic.demo.tsx",
            "persist.demo.tsx",
            "primary-second.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "SplitPane 把相邻区域分成可拖动调整大小的面板，常见于编辑器、预览器和数据工作台。分隔条既是视觉边界，也是一个可操作控件。",
    "useWhen": [
        "用户需要在两个相关区域之间分配空间。",
        "两个面板需要同时可见，并可能记住用户上次尺寸。"
    ],
    "avoidWhen": [
        "窄屏无法同时容纳内容时改为分步、Tabs 或 Drawer；纯装饰分栏使用 CSS Grid。"
    ],
    "essentials": [
        "orientation、primary、min/max 共同决定尺寸计算。",
        "拖动过程中限制合法范围，结束后再持久化最终尺寸。",
        "内容溢出由各面板处理，不能让分隔条被滚动内容遮住。"
    ],
    "accessibility": [
        "分隔条使用 separator 语义并提供当前值、方向键调整和可见焦点。",
        "触控命中区可以大于可见线；缩放和窄屏时两个面板仍要可达。"
    ]
} as const;
