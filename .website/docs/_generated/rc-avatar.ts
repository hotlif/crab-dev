/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "通过文本缩写与语义变体展示头像。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"通过文本缩写与语义变体展示头像。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Avatar from \"../../src/index.js\";\n\nconst listStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n    flex-wrap: wrap;\n`;\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv className={listStyle}>\n            \u003cAvatar>cd\u003c/Avatar>\n            \u003cAvatar variant=\"primary\">op\u003c/Avatar>\n            \u003cAvatar variant=\"success\">ok\u003c/Avatar>\n            \u003cAvatar variant=\"warning\">wr\u003c/Avatar>\n            \u003cAvatar variant=\"error\">er\u003c/Avatar>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-avatar/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-avatar/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/group.demo.tsx",
        "title": "头像组",
        "description": "使用 `AvatarGroup` 将多个头像水平叠放展示。`max` 限制显示数量，超出部分折叠为 `+N`；首个头像叠在最顶层，悬停会轻微抬起以便辨识。支持 `spacing` 调整重叠、`onExtraClick` 让 `+N` 可交互、`renderExtra` 自定义折叠内容。",
        "sourceCode": "export const meta = {\n    title: \"头像组\",\n    description: \"使用 `AvatarGroup` 将多个头像水平叠放展示。`max` 限制显示数量，超出部分折叠为 `+N`；首个头像叠在最顶层，悬停会轻微抬起以便辨识。支持 `spacing` 调整重叠、`onExtraClick` 让 `+N` 可交互、`renderExtra` 自定义折叠内容。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport { useState } from \"react\";\nimport Avatar, { AvatarGroup } from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1.5rem;\n`;\n\nconst sectionStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 0.5rem;\n`;\n\nconst labelStyle = css`\n    font-size: 0.75rem;\n    color: var(--token-semantic-color-text-secondary);\n    letter-spacing: 0.02em;\n`;\n\nconst toolbarStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 1rem;\n    flex-wrap: wrap;\n`;\n\nconst GroupDemo = () => {\n    const [expanded, setExpanded] = useState(false);\n\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003csection className={sectionStyle}>\n                \u003cspan className={labelStyle}>基础：叠放 & 悬停抬起\u003c/span>\n                \u003cAvatarGroup>\n                    \u003cAvatar variant=\"primary\" aria-label=\"Chen Di\">CD\u003c/Avatar>\n                    \u003cAvatar variant=\"success\" aria-label=\"Ouyang Ping\">OP\u003c/Avatar>\n                    \u003cAvatar variant=\"warning\" aria-label=\"Li Ming\">LM\u003c/Avatar>\n                    \u003cAvatar variant=\"error\" aria-label=\"Xia Zhe\">XZ\u003c/Avatar>\n                \u003c/AvatarGroup>\n            \u003c/section>\n\n            \u003csection className={sectionStyle}>\n                \u003cspan className={labelStyle}>折叠：max={3}，第 4 人起折为 +N（悬停查看名单）\u003c/span>\n                \u003cAvatarGroup max={3}>\n                    \u003cAvatar variant=\"primary\" aria-label=\"Alice\">A\u003c/Avatar>\n                    \u003cAvatar variant=\"success\" aria-label=\"Bob\">B\u003c/Avatar>\n                    \u003cAvatar variant=\"warning\" aria-label=\"Carol\">C\u003c/Avatar>\n                    \u003cAvatar variant=\"error\" aria-label=\"Dan\">D\u003c/Avatar>\n                    \u003cAvatar aria-label=\"Eve\">E\u003c/Avatar>\n                    \u003cAvatar variant=\"primary\" aria-label=\"Finn\">F\u003c/Avatar>\n                \u003c/AvatarGroup>\n            \u003c/section>\n\n            \u003csection className={sectionStyle}>\n                \u003cspan className={labelStyle}>可交互折叠：点击 +N 展开 / 收起\u003c/span>\n                \u003cAvatarGroup\n                    max={expanded ? undefined : 3}\n                    onExtraClick={() => setExpanded((prev) => !prev)}\n                >\n                    \u003cAvatar variant=\"primary\" aria-label=\"Alice\">A\u003c/Avatar>\n                    \u003cAvatar variant=\"success\" aria-label=\"Bob\">B\u003c/Avatar>\n                    \u003cAvatar variant=\"warning\" aria-label=\"Carol\">C\u003c/Avatar>\n                    \u003cAvatar variant=\"error\" aria-label=\"Dan\">D\u003c/Avatar>\n                    \u003cAvatar aria-label=\"Eve\">E\u003c/Avatar>\n                    \u003cAvatar variant=\"primary\" aria-label=\"Finn\">F\u003c/Avatar>\n                \u003c/AvatarGroup>\n            \u003c/section>\n\n            \u003csection className={sectionStyle}>\n                \u003cspan className={labelStyle}>自定义重叠与形状\u003c/span>\n                \u003cdiv className={toolbarStyle}>\n                    \u003cAvatarGroup shape=\"square\" size=\"small\" max={3} spacing={-6}>\n                        \u003cAvatar aria-label=\"SQ\">sq\u003c/Avatar>\n                        \u003cAvatar variant=\"primary\" aria-label=\"AR\">ar\u003c/Avatar>\n                        \u003cAvatar variant=\"success\" aria-label=\"E1\">e1\u003c/Avatar>\n                        \u003cAvatar variant=\"warning\" aria-label=\"E2\">e2\u003c/Avatar>\n                    \u003c/AvatarGroup>\n                    \u003cAvatarGroup size=\"large\" spacing={-14}>\n                        \u003cAvatar variant=\"primary\" aria-label=\"K\">K\u003c/Avatar>\n                        \u003cAvatar variant=\"success\" aria-label=\"L\">L\u003c/Avatar>\n                        \u003cAvatar variant=\"warning\" aria-label=\"M\">M\u003c/Avatar>\n                    \u003c/AvatarGroup>\n                \u003c/div>\n            \u003c/section>\n\n            \u003csection className={sectionStyle}>\n                \u003cspan className={labelStyle}>自定义 +N 渲染\u003c/span>\n                \u003cAvatarGroup\n                    max={2}\n                    renderExtra={(hidden) => `还有 ${hidden} 位`}\n                >\n                    \u003cAvatar variant=\"primary\" aria-label=\"A\">A\u003c/Avatar>\n                    \u003cAvatar variant=\"success\" aria-label=\"B\">B\u003c/Avatar>\n                    \u003cAvatar variant=\"warning\" aria-label=\"C\">C\u003c/Avatar>\n                    \u003cAvatar variant=\"error\" aria-label=\"D\">D\u003c/Avatar>\n                \u003c/AvatarGroup>\n            \u003c/section>\n        \u003c/div>\n    );\n};\n\nexport default GroupDemo;\n\n",
        "previewPath": "/components/rc-avatar/workbench/?__wake_demo=docs%2Fdemos%2Fgroup.demo.tsx",
        "workbenchPath": "/components/rc-avatar/workbench/#/components/docs%2Fdemos%2Fgroup.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/icon.demo.tsx",
        "title": "图标占位",
        "description": "可通过 `icon` 自定义头像占位图标。",
        "sourceCode": "export const meta = {\n    title: \"图标占位\",\n    description: \"可通过 `icon` 自定义头像占位图标。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Avatar from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n`;\n\nconst UserIcon = () => {\n    return (\n        \u003csvg viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\">\n            \u003cpath d=\"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0H4Z\" />\n        \u003c/svg>\n    );\n};\n\nconst IconDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cAvatar aria-label=\"icon avatar\" icon={\u003cUserIcon />} />\n            \u003cAvatar aria-label=\"square icon avatar\" shape=\"square\" icon={\u003cUserIcon />} />\n        \u003c/div>\n    );\n};\n\nexport default IconDemo;\n",
        "previewPath": "/components/rc-avatar/workbench/?__wake_demo=docs%2Fdemos%2Ficon.demo.tsx",
        "workbenchPath": "/components/rc-avatar/workbench/#/components/docs%2Fdemos%2Ficon.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/image.demo.tsx",
        "title": "图片与失败回退",
        "description": "当图片加载失败时，自动回退到文本内容。",
        "sourceCode": "export const meta = {\n    title: \"图片与失败回退\",\n    description: \"当图片加载失败时，自动回退到文本内容。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Avatar from \"../../src/index.js\";\n\nconst dataImage = \"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%231f2937'/%3E%3Ccircle cx='80' cy='62' r='28' fill='%23f8fafc'/%3E%3Cpath d='M28 144c9-28 32-44 52-44s43 16 52 44' fill='%23f8fafc'/%3E%3C/svg%3E\";\n\nconst wrapStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n`;\n\nconst ImageDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cAvatar src={dataImage} alt=\"avatar image\" />\n            \u003cAvatar src=\"https://example.com/not-found.png\" alt=\"fallback avatar\">\n                fb\n            \u003c/Avatar>\n        \u003c/div>\n    );\n};\n\nexport default ImageDemo;\n",
        "previewPath": "/components/rc-avatar/workbench/?__wake_demo=docs%2Fdemos%2Fimage.demo.tsx",
        "workbenchPath": "/components/rc-avatar/workbench/#/components/docs%2Fdemos%2Fimage.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/shape-size.demo.tsx",
        "title": "形态与尺寸",
        "description": "支持 `circle` / `square` 形态与三档尺寸。",
        "sourceCode": "export const meta = {\n    title: \"形态与尺寸\",\n    description: \"支持 `circle` / `square` 形态与三档尺寸。\",\n};\n\nimport { css } from \"@crab-dev/css\";\nimport Avatar from \"../../src/index.js\";\n\nconst wrapStyle = css`\n    display: flex;\n    align-items: center;\n    gap: 0.75rem;\n    flex-wrap: wrap;\n`;\n\nconst ShapeSizeDemo = () => {\n    return (\n        \u003cdiv className={wrapStyle}>\n            \u003cAvatar size=\"small\">sm\u003c/Avatar>\n            \u003cAvatar size=\"middle\">md\u003c/Avatar>\n            \u003cAvatar size=\"large\">lg\u003c/Avatar>\n            \u003cAvatar shape=\"square\" size=\"small\">sm\u003c/Avatar>\n            \u003cAvatar shape=\"square\" size=\"middle\">md\u003c/Avatar>\n            \u003cAvatar shape=\"square\" size=\"large\">lg\u003c/Avatar>\n        \u003c/div>\n    );\n};\n\nexport default ShapeSizeDemo;\n",
        "previewPath": "/components/rc-avatar/workbench/?__wake_demo=docs%2Fdemos%2Fshape-size.demo.tsx",
        "workbenchPath": "/components/rc-avatar/workbench/#/components/docs%2Fdemos%2Fshape-size.demo.tsx",
        "density": "compact",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Avatar",
    "symbol": "AvatarProps",
    "props": [
        {
            "name": "alt",
            "required": false,
            "description": "图片替代文本",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "bordered",
            "required": false,
            "description": "是否展示描边",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "crossOrigin",
            "required": false,
            "description": "img crossOrigin 属性",
            "typeText": "'anonymous' | 'use-credentials' | ''",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "disabled",
            "required": false,
            "description": "是否禁用",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "fit",
            "required": false,
            "description": "图片填充方式",
            "typeText": "AvatarFit",
            "defaultValue": "'cover'",
            "deprecated": false
        },
        {
            "name": "icon",
            "required": false,
            "description": "自定义图标",
            "typeText": "ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "loading",
            "required": false,
            "description": "img loading 属性",
            "typeText": "'eager' | 'lazy'",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onError",
            "required": false,
            "description": "图片加载失败回调，返回 false 可阻止回退",
            "typeText": "(event: SyntheticEvent\u003cHTMLImageElement, Event>) => boolean | void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "referrerPolicy",
            "required": false,
            "description": "img referrerPolicy 属性",
            "typeText": "ImgHTMLAttributes\u003cHTMLImageElement>['referrerPolicy']",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "shape",
            "required": false,
            "description": "形状",
            "typeText": "AvatarShape",
            "defaultValue": "'circle'",
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "尺寸；传数字时单位为 px，覆盖三档预设",
            "typeText": "AvatarSize | number",
            "defaultValue": "'middle'",
            "deprecated": false
        },
        {
            "name": "src",
            "required": false,
            "description": "图片地址",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "srcSet",
            "required": false,
            "description": "响应式图片地址",
            "typeText": "string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "style",
            "required": false,
            "description": "自定义样式",
            "typeText": "CSSProperties",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "variant",
            "required": false,
            "description": "颜色语义，仅在非图片态下生效",
            "typeText": "AvatarVariant",
            "defaultValue": "'default'",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
