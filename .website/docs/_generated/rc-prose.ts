/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认 `size=base`，包含标题、段落、链接、粗体等基础排版元素",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认 `size=base`，包含标题、段落、链接、粗体等基础排版元素\",\n};\n\nimport Prose from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cProse as=\"article\">\n            \u003ch1>Prose 排版组件\u003c/h1>\n            \u003cp className=\"lead\">\n                零运行时 Markdown 排版容器，基于 Crab CSS 编译为静态 CSS，不引入额外 JS 开销。\n            \u003c/p>\n\n            \u003ch2>基本元素\u003c/h2>\n            \u003cp>\n                正文段落。支持 \u003cstrong>粗体\u003c/strong>、\u003cem>斜体\u003c/em>，以及\n                \u003ca href=\"#\">链接\u003c/a>，悬停时颜色自动切换。\n            \u003c/p>\n\n            \u003ch3>引用\u003c/h3>\n            \u003cblockquote>\n                \u003cp>好的排版应当是隐形的。 —— Beatrice Warde\u003c/p>\n            \u003c/blockquote>\n\n            \u003ch3>列表\u003c/h3>\n            \u003cul>\n                \u003cli>无序列表项 1\u003c/li>\n                \u003cli>无序列表项 2\u003c/li>\n                \u003cli>无序列表项 3\u003c/li>\n            \u003c/ul>\n            \u003col>\n                \u003cli>有序列表项 1\u003c/li>\n                \u003cli>有序列表项 2\u003c/li>\n                \u003cli>有序列表项 3\u003c/li>\n            \u003c/ol>\n\n            \u003chr />\n\n            \u003ch3>代码\u003c/h3>\n            \u003cp>\n                行内代码：\u003ccode>const x = 1\u003c/code>，代码块如下：\n            \u003c/p>\n            \u003cpre>\n                \u003ccode>{`import Prose from '@crab-dev/rc-prose';\n\nfunction App() {\n    return (\n        \u003cProse as=\"article\">\n            {content}\n        \u003c/Prose>\n    );\n}`}\u003c/code>\n            \u003c/pre>\n        \u003c/Prose>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/semantic-tag.demo.tsx",
        "title": "语义标签",
        "description": "通过 `as` 属性指定根元素标签：`div`（默认）、`article`、`section`、`main`",
        "sourceCode": "export const meta = {\n    title: \"语义标签\",\n    description: \"通过 `as` 属性指定根元素标签：`div`（默认）、`article`、`section`、`main`\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Prose from '../../src/index.js';\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 1.5rem;\n`;\n\nconst labelStyle = css`\n    margin-bottom: 0.25rem;\n    font-size: 0.75rem;\n    font-family: monospace;\n    opacity: 0.5;\n`;\n\nconst tags = ['div', 'article', 'section', 'main'] as const;\n\nconst SemanticTagDemo = () => {\n    return (\n        \u003cdiv className={wrapperStyle}>\n            {tags.map((tag) => (\n                \u003cdiv key={tag}>\n                    \u003cdiv className={labelStyle}>&lt;{tag}&gt;\u003c/div>\n                    \u003cProse as={tag}>\n                        \u003cp>\n                            使用 \u003ccode>as=&quot;{tag}&quot;\u003c/code> 渲染为语义化的{' '}\n                            \u003ccode>&lt;{tag}&gt;\u003c/code> 元素。\n                        \u003c/p>\n                    \u003c/Prose>\n                \u003c/div>\n            ))}\n        \u003c/div>\n    );\n};\n\nexport default SemanticTagDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fsemantic-tag.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fsemantic-tag.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "尺寸变体",
        "description": "通过 `size` 属性设置排版尺寸：`sm`、`base`（默认）、`lg`、`xl`",
        "sourceCode": "export const meta = {\n    title: \"尺寸变体\",\n    description: \"通过 `size` 属性设置排版尺寸：`sm`、`base`（默认）、`lg`、`xl`\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Prose from '../../src/index.js';\n\nconst wrapperStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 2rem;\n`;\n\nconst labelStyle = css`\n    margin-bottom: 0.5rem;\n    font-size: 0.75rem;\n    text-transform: uppercase;\n    letter-spacing: 0.1em;\n    opacity: 0.5;\n`;\n\nconst content = (\n    \u003c>\n        \u003ch2>标题\u003c/h2>\n        \u003cp>\n            正文段落。支持 \u003cstrong>粗体\u003c/strong>、\u003ca href=\"#\">链接\u003c/a>，以及 \u003ccode>行内代码\u003c/code>。\n        \u003c/p>\n        \u003cul>\n            \u003cli>列表项 1\u003c/li>\n            \u003cli>列表项 2\u003c/li>\n        \u003c/ul>\n    \u003c/>\n);\n\nconst sizes = ['sm', 'base', 'lg', 'xl'] as const;\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv className={wrapperStyle}>\n            {sizes.map((size) => (\n                \u003csection key={size}>\n                    \u003cdiv className={labelStyle}>size={size}\u003c/div>\n                    \u003cProse size={size}>{content}\u003c/Prose>\n                \u003c/section>\n            ))}\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/table.demo.tsx",
        "title": "表格与定义列表",
        "description": "展示表格与定义列表的排版效果",
        "sourceCode": "export const meta = {\n    title: \"表格与定义列表\",\n    description: \"展示表格与定义列表的排版效果\",\n};\n\nimport Prose from '../../src/index.js';\n\nconst TableDemo = () => {\n    return (\n        \u003cProse>\n            \u003ch3>表格\u003c/h3>\n            \u003ctable>\n                \u003cthead>\n                    \u003ctr>\n                        \u003cth>变体\u003c/th>\n                        \u003cth>字号\u003c/th>\n                        \u003cth>行高\u003c/th>\n                    \u003c/tr>\n                \u003c/thead>\n                \u003ctbody>\n                    \u003ctr>\n                        \u003ctd>sm\u003c/td>\n                        \u003ctd>0.875rem\u003c/td>\n                        \u003ctd>1.714\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>base\u003c/td>\n                        \u003ctd>1rem\u003c/td>\n                        \u003ctd>1.75\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>lg\u003c/td>\n                        \u003ctd>1.125rem\u003c/td>\n                        \u003ctd>1.778\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>xl\u003c/td>\n                        \u003ctd>1.25rem\u003c/td>\n                        \u003ctd>1.8\u003c/td>\n                    \u003c/tr>\n                \u003c/tbody>\n            \u003c/table>\n\n            \u003ch3>定义列表\u003c/h3>\n            \u003cdl>\n                \u003cdt>Prose\u003c/dt>\n                \u003cdd>Markdown 排版容器组件，提供完整的富文本排版样式。\u003c/dd>\n\n                \u003cdt>Crab CSS\u003c/dt>\n                \u003cdd>零运行时 CSS-in-JS 方案，编译时提取静态 CSS。\u003c/dd>\n\n                \u003cdt>Design Token\u003c/dt>\n                \u003cdd>三层架构（全局 → 语义 → 组件），支持主题覆写。\u003c/dd>\n            \u003c/dl>\n        \u003c/Prose>\n    );\n};\n\nexport default TableDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Ftable.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Ftable.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Prose",
    "symbol": "ProseProps",
    "props": [
        {
            "name": "as",
            "required": false,
            "description": "根元素的 HTML 标签名",
            "typeText": "ProseTag",
            "defaultValue": "'div'",
            "deprecated": false
        },
        {
            "name": "invert",
            "required": false,
            "description": "是否启用暗色排版（独立于全局 data-theme）",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "ref",
            "required": false,
            "description": "",
            "typeText": "Ref\u003cHTMLDivElement>",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "排版尺寸变体",
            "typeText": "ProseSize",
            "defaultValue": "'base'",
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
