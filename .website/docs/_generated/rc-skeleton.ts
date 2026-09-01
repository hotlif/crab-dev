/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/animation.demo.tsx",
        "title": "动画形态",
        "description": "`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。",
        "sourceCode": "export const meta = {\n    title: \"动画形态\",\n    description: \"`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。\",\n};\n\nimport { css } from \"@crab-dev/css\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 20px;\n    width: 100%;\n`;\n\nconst labelStyle = css`\n    font-size: 12px;\n    color: oklch(0.55 0.01 286);\n    margin-bottom: 4px;\n`;\n\nconst AnimationDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>animation = {\"\\u201cpulse\\u201d\"}（默认）\u003c/div>\n                \u003cSkeleton rows={2} animation=\"pulse\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>animation = {\"\\u201cwave\\u201d\"}\u003c/div>\n                \u003cSkeleton rows={2} animation=\"wave\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>active = false（静态）\u003c/div>\n                \u003cSkeleton rows={2} active={false} />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default AnimationDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fanimation.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fanimation.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认渲染一行文本占位；通过 `rows` 控制行数，末行自动收窄。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认渲染一行文本占位；通过 `rows` 控制行数，末行自动收窄。\",\n};\n\nimport Skeleton from \"../../src/index.js\";\n\nconst BasicDemo = () => {\n    return \u003cSkeleton rows={3} />;\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/card.demo.tsx",
        "title": "组合占位",
        "description": "搭配不同 `variant` 可以拼出卡片、列表项等复合占位形态。",
        "sourceCode": "export const meta = {\n    title: \"组合占位\",\n    description: \"搭配不同 `variant` 可以拼出卡片、列表项等复合占位形态。\",\n};\n\nimport { css } from \"@crab-dev/css\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst cardStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    padding: 16px;\n    border: 1px solid oklch(0.9 0.004 286);\n    border-radius: 8px;\n    width: 100%;\n    max-width: 360px;\n`;\n\nconst headerStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 12px;\n`;\n\nconst metaStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 8px;\n    flex: 1;\n    min-width: 0;\n`;\n\nconst CardDemo = () => {\n    return (\n        \u003cdiv className={cardStyle}>\n            \u003cdiv className={headerStyle}>\n                \u003cSkeleton variant=\"avatar\" />\n                \u003cdiv className={metaStyle}>\n                    \u003cSkeleton size=\"medium\" width=\"50%\" />\n                    \u003cSkeleton size=\"small\" width=\"30%\" />\n                \u003c/div>\n            \u003c/div>\n            \u003cSkeleton variant=\"image\" height={140} />\n            \u003cSkeleton rows={3} />\n        \u003c/div>\n    );\n};\n\nexport default CardDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fcard.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fcard.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/loaded.demo.tsx",
        "title": "加载完成",
        "description": "`loading=false` 时直接渲染 `children`，便于包裹真实内容。",
        "sourceCode": "export const meta = {\n    title: \"加载完成\",\n    description: \"`loading=false` 时直接渲染 `children`，便于包裹真实内容。\",\n};\n\nimport { useEffect, useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst contentStyle = css`\n    padding: 12px 16px;\n    border-radius: 8px;\n    background-color: oklch(0.97 0.004 286);\n    color: oklch(0.2 0.01 286);\n    font-size: 14px;\n    line-height: 1.6;\n`;\n\nconst LoadedDemo = () => {\n    const [loading, setLoading] = useState(true);\n    useEffect(() => {\n        const timer = window.setTimeout(() => setLoading(false), 1600);\n        return () => window.clearTimeout(timer);\n    }, []);\n    return (\n        \u003cSkeleton loading={loading} rows={3}>\n            \u003cdiv className={contentStyle}>\n                内容已加载完成。真实节点替换骨架后布局不会跳动，卡片的外框、间距都与占位保持一致。\n            \u003c/div>\n        \u003c/Skeleton>\n    );\n};\n\nexport default LoadedDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Floaded.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Floaded.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/variant.demo.tsx",
        "title": "形状变体",
        "description": "通过 `variant` 选择占位形状：`text` / `rect` / `circle` / `button` / `avatar` / `image`。",
        "sourceCode": "export const meta = {\n    title: \"形状变体\",\n    description: \"通过 `variant` 选择占位形状：`text` / `rect` / `circle` / `button` / `avatar` / `image`。\",\n};\n\nimport { css } from \"@crab-dev/css\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 16px;\n`;\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    width: 100%;\n`;\n\nconst VariantDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={rowStyle}>\n                \u003cSkeleton variant=\"avatar\" />\n                \u003cSkeleton variant=\"circle\" width={56} />\n                \u003cSkeleton variant=\"button\" />\n                \u003cSkeleton variant=\"button\" width={120} round />\n            \u003c/div>\n            \u003cSkeleton variant=\"image\" height={180} />\n            \u003cSkeleton variant=\"rect\" height={64} />\n        \u003c/div>\n    );\n};\n\nexport default VariantDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fvariant.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fvariant.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Skeleton",
    "symbol": "SkeletonProps",
    "props": [
        {
            "name": "active",
            "required": false,
            "description": "是否启用动画。关闭后骨架以静态背景展示。",
            "typeText": "boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "animation",
            "required": false,
            "description": "动画形态",
            "typeText": "SkeletonAnimation",
            "defaultValue": "\"pulse\"",
            "deprecated": false
        },
        {
            "name": "children",
            "required": false,
            "description": "加载完成后要渲染的真实内容",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "height",
            "required": false,
            "description": "显式高度。数字按像素处理；字符串原样下发。",
            "typeText": "number | string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "loading",
            "required": false,
            "description": "是否处于加载态。为 `false` 时渲染 `children`。",
            "typeText": "boolean",
            "defaultValue": "true",
            "deprecated": false
        },
        {
            "name": "round",
            "required": false,
            "description": "是否强制圆角为 pill（常用于按钮 / 胶囊占位）",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "rows",
            "required": false,
            "description": "`text` 变体的行数；最后一行自动变短以模拟段落排版。",
            "typeText": "number",
            "defaultValue": "1",
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "尺寸阶梯（仅作用于 `text` 变体）",
            "typeText": "SkeletonSize",
            "defaultValue": "\"medium\"",
            "deprecated": false
        },
        {
            "name": "style",
            "required": false,
            "description": "透传到容器根节点的内联样式（不推荐在组件层使用；仅在变量桥接时使用）",
            "typeText": "CSSProperties",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "variant",
            "required": false,
            "description": "骨架形状",
            "typeText": "SkeletonVariant",
            "defaultValue": "\"text\"",
            "deprecated": false
        },
        {
            "name": "width",
            "required": false,
            "description": "显式宽度。数字按像素处理；字符串原样下发。",
            "typeText": "number | string",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
