/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "AutoSizer 自动感知容器尺寸，将 width 和 height 传入子渲染函数。拖拽窗口边缘或改变面板大小时，子内容会随之更新。",
        "learning": {
            "components": [
                "AutoSizer"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"AutoSizer 自动感知容器尺寸，将 width 和 height 传入子渲染函数。拖拽窗口边缘或改变面板大小时，子内容会随之更新。\",\n};\nimport AutoSizer from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst wrapperStyle = css`\n    width: 100%;\n    height: 300px;\n    border: 1px dashed oklch(70% 0 0);\n    border-radius: 4px;\n    overflow: hidden;\n`;\n\nconst contentStyle = css`\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    background-color: oklch(97% 0 0);\n    font-size: 14px;\n    color: oklch(45% 0 0);\n    font-variant-numeric: tabular-nums;\n`;\n\nexport default function BasicDemo() {\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cAutoSizer>\n                {({ width, height }) => (\n                    \u003cdiv\n                        className={contentStyle}\n                        style={{ width, height }}\n                    >\n                        {`容器尺寸：${width} × ${height} px`}\n                    \u003c/div>\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-auto-sizer/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-auto-sizer/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/with-virtual.demo.tsx",
        "title": "配合虚拟滚动",
        "description": "AutoSizer 将容器尺寸透传给 Virtual 组件的 viewportWidth / viewportHeight，实现响应式虚拟滚动。",
        "learning": {
            "components": [
                "AutoSizer"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"配合虚拟滚动\",\n    description: \"AutoSizer 将容器尺寸透传给 Virtual 组件的 viewportWidth / viewportHeight，实现响应式虚拟滚动。\",\n};\nimport AutoSizer from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst wrapperStyle = css`\n    width: 100%;\n    height: 400px;\n    border: 1px solid oklch(88% 0 0);\n    border-radius: 4px;\n    overflow: hidden;\n`;\n\nconst placeholderStyle = css`\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    background-color: oklch(98% 0.005 250);\n    font-size: 13px;\n    color: oklch(50% 0 0);\n`;\n\nconst badgeStyle = css`\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 2px 8px;\n    border-radius: 12px;\n    background-color: oklch(93% 0.02 250);\n    color: oklch(40% 0.08 250);\n    font-size: 12px;\n    font-variant-numeric: tabular-nums;\n`;\n\nexport default function WithVirtualDemo() {\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cAutoSizer>\n                {({ width, height }) => (\n                    \u003cdiv\n                        className={placeholderStyle}\n                        style={{ width, height }}\n                    >\n                        \u003cspan>此处传入 Virtual 组件\u003c/span>\n                        \u003cdiv>\n                            \u003cspan className={badgeStyle}>viewportWidth: {width}px\u003c/span>\n                            {\" \"}\n                            \u003cspan className={badgeStyle}>viewportHeight: {height}px\u003c/span>\n                        \u003c/div>\n                    \u003c/div>\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-auto-sizer/workbench/?__wake_demo=docs%2Fdemos%2Fwith-virtual.demo.tsx",
        "workbenchPath": "/components/rc-auto-sizer/workbench/#/components/docs%2Fdemos%2Fwith-virtual.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "为色调内容容器测量实际可用空间，给图表或列表提供宽高；测量本身没有视觉变体。",
        "usage": "让布局容器决定空间，再将测量结果传给内容；保留表面留白与真实内容区域的区别。",
        "exampleDescription": "改变测量容器大小，读取宽高结果，确认内容不会侵占容器的留白。",
        "demos": [
            "basic.demo.tsx",
            "with-virtual.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/foundations/layout/understanding-layout/overview",
            "https://material-web.dev/",
            "https://github.com/material-components/material-web"
        ]
    },
    "macos": {
        "summary": "用于桌面分栏与可调整面板的空间测量，使内容跟随窗口区域变化。",
        "usage": "紧凑工具栏与侧栏占用空间后，使用剩余内容区域的实际尺寸驱动子内容。",
        "exampleDescription": "调整列表区域尺寸，观察可见行随内容面板高度变化而更新。",
        "demos": [
            "with-virtual.demo.tsx",
            "basic.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "为有边界的内容区域提供宽高测量，适合自适应数据表、图表和滚动区域。",
        "usage": "由父容器提供明确尺寸约束，避免子内容与测量容器相互撑高。",
        "exampleDescription": "比较容器边界与测量值，确认尺寸变化后内容仍在自己的区域内。",
        "demos": [
            "basic.demo.tsx",
            "with-virtual.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "AutoSizer 读取父容器实际可用的宽度和高度，再把尺寸交给表格、图表或虚拟列表。它解决的是测量和同步问题，本身不会为父容器创造高度。",
    "useWhen": [
        "子组件必须拿到数字宽高才能布局或虚拟化。",
        "容器会随窗口、侧栏或分栏变化而改变尺寸。"
    ],
    "avoidWhen": [
        "普通 CSS 自适应已经足够时直接使用布局规则，不要为了读取尺寸增加测量链路。"
    ],
    "essentials": [
        "父容器必须先有可计算的尺寸，尤其要明确高度来自哪里。",
        "render 函数收到的是测量结果，业务组件应直接消费而不是再次测量。",
        "尺寸变化可能很频繁，避免在回调中执行与布局无关的昂贵工作。"
    ],
    "accessibility": [
        "测量容器不应改变内容的语义顺序或制造额外可聚焦元素。",
        "缩放到 200% 和窄屏时仍要确保内容可达，不能因为宽高为零而永久隐藏状态说明。"
    ]
} as const;
