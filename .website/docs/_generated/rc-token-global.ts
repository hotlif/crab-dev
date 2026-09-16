/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "全局颜色与尺度",
        "description": "直接引用全局基元构建色块，展示颜色、间距与圆角；说明文字继承工作台。",
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport globalToken from \"@crab-dev/rc-token-global\";\n\nexport const meta = {\n    title: \"全局颜色与尺度\",\n    description: \"直接引用全局基元构建色块，展示颜色、间距与圆角；说明文字继承工作台。\",\n};\n\nconst frame = css`\n    display: grid;\n    gap: ${globalToken.space[2]};\n    padding: ${globalToken.space[5]};\n    border-radius: ${globalToken.radius[4]};\n`;\nconst swatch = css`\n    width: ${globalToken.space[16]};\n    height: ${globalToken.space[16]};\n    background: ${globalToken.blue[600]};\n    border-radius: ${globalToken.radius[3]};\n`;\n\nexport default function BaseDemo() {\n    return \u003cdiv className={frame}>\u003cdiv className={swatch} aria-hidden=\"true\" />\u003cstrong>Blue 600 · 原始色块\u003c/strong>\u003cp>颜色、尺寸与圆角来自全局基元；文字继承工作台的阅读样式。\u003c/p>\u003c/div>;\n}\n",
        "previewPath": "/components/rc-token-global/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-token-global/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
