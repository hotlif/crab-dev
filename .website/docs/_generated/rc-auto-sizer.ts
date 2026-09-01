/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "AutoSizer 自动感知容器尺寸，将 width 和 height 传入子渲染函数。拖拽窗口边缘或改变面板大小时，子内容会随之更新。",
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
        "sourceCode": "export const meta = {\n    title: \"配合虚拟滚动\",\n    description: \"AutoSizer 将容器尺寸透传给 Virtual 组件的 viewportWidth / viewportHeight，实现响应式虚拟滚动。\",\n};\nimport AutoSizer from \"../../src/index.js\";\nimport { css } from \"@crab-dev/css\";\n\nconst wrapperStyle = css`\n    width: 100%;\n    height: 400px;\n    border: 1px solid oklch(88% 0 0);\n    border-radius: 4px;\n    overflow: hidden;\n`;\n\nconst placeholderStyle = css`\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n    gap: 8px;\n    background-color: oklch(98% 0.005 250);\n    font-size: 13px;\n    color: oklch(50% 0 0);\n`;\n\nconst badgeStyle = css`\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    padding: 2px 8px;\n    border-radius: 12px;\n    background-color: oklch(93% 0.02 250);\n    color: oklch(40% 0.08 250);\n    font-size: 12px;\n    font-variant-numeric: tabular-nums;\n`;\n\nexport default function WithVirtualDemo() {\n    return (\n        \u003cdiv className={wrapperStyle}>\n            \u003cAutoSizer>\n                {({ width, height }) => (\n                    \u003cdiv\n                        className={placeholderStyle}\n                        style={{ width, height }}\n                    >\n                        \u003cspan>此处传入 Virtual 组件\u003c/span>\n                        \u003cdiv>\n                            \u003cspan className={badgeStyle}>viewportWidth: {width}px\u003c/span>\n                            {\" \"}\n                            \u003cspan className={badgeStyle}>viewportHeight: {height}px\u003c/span>\n                        \u003c/div>\n                    \u003c/div>\n                )}\n            \u003c/AutoSizer>\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-auto-sizer/workbench/?__wake_demo=docs%2Fdemos%2Fwith-virtual.demo.tsx",
        "workbenchPath": "/components/rc-auto-sizer/workbench/#/components/docs%2Fdemos%2Fwith-virtual.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
