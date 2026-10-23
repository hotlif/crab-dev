/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/animation.demo.tsx",
        "title": "动画形态",
        "description": "`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。",
        "learning": {
            "components": [
                "Skeleton"
            ],
            "props": [
                "rows",
                "animation",
                "active"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"动画形态\",\n    description: \"`pulse` 透明度脉动，性能开销最小；`wave` 高亮带从左向右扫过。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"section-gap\"]};\n    width: 100%;\n`;\n\nconst labelStyle = css`\n    font-size: ${token.font.size.caption};\n    color: ${token.color.text.secondary};\n    margin-bottom: ${token.space[\"inline-gap\"]};\n`;\n\nconst AnimationDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>animation = {\"\\u201cpulse\\u201d\"}（默认）\u003c/div>\n                \u003cSkeleton rows={2} animation=\"pulse\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>animation = {\"\\u201cwave\\u201d\"}\u003c/div>\n                \u003cSkeleton rows={2} animation=\"wave\" />\n            \u003c/div>\n            \u003cdiv>\n                \u003cdiv className={labelStyle}>active = false（静态）\u003c/div>\n                \u003cSkeleton rows={2} active={false} />\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default AnimationDemo;\n",
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
        "learning": {
            "components": [
                "Skeleton"
            ],
            "props": [
                "rows"
            ],
            "events": [],
            "hasState": false
        },
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
        "learning": {
            "components": [
                "Skeleton"
            ],
            "props": [
                "variant",
                "size",
                "width",
                "height",
                "rows"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"组合占位\",\n    description: \"搭配不同 `variant` 可以拼出卡片、列表项等复合占位形态。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst cardStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"stack-gap\"]};\n    padding: ${token.space[\"card-padding\"]};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    background-color: ${token.color.background.surface};\n    color: ${token.color.text.primary};\n    width: 100%;\n    max-width: 360px;\n`;\n\nconst headerStyle = css`\n    display: flex;\n    align-items: center;\n    gap: ${token.space[\"component-gap\"]};\n`;\n\nconst metaStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space[\"inline-gap\"]};\n    flex: 1;\n    min-width: 0;\n`;\n\nconst CardDemo = () => {\n    return (\n        \u003cdiv className={cardStyle}>\n            \u003cdiv className={headerStyle}>\n                \u003cSkeleton variant=\"avatar\" />\n                \u003cdiv className={metaStyle}>\n                    \u003cSkeleton size=\"medium\" width=\"50%\" />\n                    \u003cSkeleton size=\"small\" width=\"30%\" />\n                \u003c/div>\n            \u003c/div>\n            \u003cSkeleton variant=\"image\" height={140} />\n            \u003cSkeleton rows={3} />\n        \u003c/div>\n    );\n};\n\nexport default CardDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fcard.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fcard.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/loaded.demo.tsx",
        "title": "加载完成",
        "description": "`loading=false` 时直接渲染 `children`。点击重新加载，观察占位与真实内容的切换。",
        "learning": {
            "components": [
                "Button",
                "Skeleton"
            ],
            "props": [
                "appearance",
                "disabled",
                "onClick",
                "loading",
                "rows"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"加载完成\",\n    description: \"`loading=false` 时直接渲染 `children`。点击重新加载，观察占位与真实内容的切换。\",\n};\n\nimport { useTransition } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport Button from \"@crab-dev/rc-button\";\nimport token from \"@crab-dev/rc-token-semantic\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: grid;\n    justify-items: start;\n    gap: ${token.space[\"stack-gap\"]};\n`;\n\nconst contentStyle = css`\n    box-sizing: border-box;\n    width: 100%;\n    min-height: ${token.size[96]};\n    padding: ${token.space[\"card-padding\"]};\n    border-radius: ${token.shape.card};\n    background-color: ${token.color.surface.container};\n    color: ${token.color.text.primary};\n    font-size: ${token.font.size.body};\n    line-height: ${token.font[\"line-height\"].body};\n`;\n\nconst statusStyle = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.caption};\n`;\n\nconst LoadedDemo = () => {\n    const [loading, startTransition] = useTransition();\n\n    const reload = () => {\n        startTransition(async () => {\n            await new Promise\u003cvoid>((resolve) => window.setTimeout(resolve, 1600));\n        });\n    };\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cButton appearance=\"outlined\" disabled={loading} onClick={reload}>\n                {loading ? \"正在加载\" : \"重新加载\"}\n            \u003c/Button>\n            \u003cdiv className={contentStyle}>\n                \u003cSkeleton loading={loading} rows={3}>\n                    内容已加载完成。骨架占位与真实内容共用同一容器，背景与文字随当前主题切换。\n                \u003c/Skeleton>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\" aria-live=\"polite\">\n                {loading ? \"正在加载示例内容…\" : \"示例内容已就绪。\"}\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default LoadedDemo;\n",
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
        "learning": {
            "components": [
                "Skeleton"
            ],
            "props": [
                "variant",
                "width",
                "round",
                "height"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"形状变体\",\n    description: \"通过 `variant` 选择占位形状：`text` / `rect` / `circle` / `button` / `avatar` / `image`。\",\n};\n\nimport { css } from \"@crab-dev/css\";\n\nimport Skeleton from \"../../src/index.js\";\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 16px;\n`;\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    width: 100%;\n`;\n\nconst VariantDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cdiv className={rowStyle}>\n                \u003cSkeleton variant=\"avatar\" />\n                \u003cSkeleton variant=\"circle\" width={56} />\n                \u003cSkeleton variant=\"button\" />\n                \u003cSkeleton variant=\"button\" width={120} round />\n            \u003c/div>\n            \u003cSkeleton variant=\"image\" height={180} />\n            \u003cSkeleton variant=\"rect\" height={64} />\n        \u003c/div>\n    );\n};\n\nexport default VariantDemo;\n",
        "previewPath": "/components/rc-skeleton/workbench/?__wake_demo=docs%2Fdemos%2Fvariant.demo.tsx",
        "workbenchPath": "/components/rc-skeleton/workbench/#/components/docs%2Fdemos%2Fvariant.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
