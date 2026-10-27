/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认 `size=base`，包含标题、段落、链接、粗体等基础排版元素",
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [
                "as"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认 `size=base`，包含标题、段落、链接、粗体等基础排版元素\",\n};\n\nimport Prose from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cProse as=\"article\">\n            \u003ch1>Prose 排版组件\u003c/h1>\n            \u003cp className=\"lead\">\n                零运行时 Markdown 排版容器，基于 Crab CSS 编译为静态 CSS，不引入额外 JS 开销。\n            \u003c/p>\n\n            \u003ch2>基本元素\u003c/h2>\n            \u003cp>\n                正文段落。支持 \u003cstrong>粗体\u003c/strong>、\u003cem>斜体\u003c/em>，以及\n                \u003ca href=\"#\">链接\u003c/a>，悬停时颜色自动切换。\n            \u003c/p>\n\n            \u003ch3>引用\u003c/h3>\n            \u003cblockquote>\n                \u003cp>好的排版应当是隐形的。 —— Beatrice Warde\u003c/p>\n            \u003c/blockquote>\n\n            \u003ch3>列表\u003c/h3>\n            \u003cul>\n                \u003cli>无序列表项 1\u003c/li>\n                \u003cli>无序列表项 2\u003c/li>\n                \u003cli>无序列表项 3\u003c/li>\n            \u003c/ul>\n            \u003col>\n                \u003cli>有序列表项 1\u003c/li>\n                \u003cli>有序列表项 2\u003c/li>\n                \u003cli>有序列表项 3\u003c/li>\n            \u003c/ol>\n\n            \u003chr />\n\n            \u003ch3>代码\u003c/h3>\n            \u003cp>\n                行内代码：\u003ccode>const x = 1\u003c/code>，代码块如下：\n            \u003c/p>\n            \u003cpre>\n                \u003ccode>{`import Prose from '@crab-dev/rc-prose';\n\nfunction App() {\n    return (\n        \u003cProse as=\"article\">\n            {content}\n        \u003c/Prose>\n    );\n}`}\u003c/code>\n            \u003c/pre>\n        \u003c/Prose>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/scoped-content.demo.tsx",
        "title": "嵌入独立内容",
        "description": "not-prose 排除区域自身及后代的直接排版规则；字体和颜色仍会正常继承，独立区域可定义自己的外观。",
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [
                "as"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css, cx } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Prose from '@crab-dev/rc-prose';\n\nexport const meta = {\n    title: '嵌入独立内容',\n    description: 'not-prose 排除区域自身及后代的直接排版规则；字体和颜色仍会正常继承，独立区域可定义自己的外观。',\n};\n\nconst noteStyle = css`\n    padding: ${token.space['card-padding']};\n    border: 1px solid ${token.color.border.default};\n    border-radius: ${token.shape.card};\n    background: ${token.color.workspace.sidebar};\n    color: ${token.color.text.secondary};\n    font-size: ${token.typography.body.small['font-size']};\n    line-height: ${token.typography.body.small['line-height']};\n\n    & h3 { margin: 0 0 ${token.space['component-gap']}; font: inherit; font-weight: ${token.font.weight.strong}; }\n    & p { margin: 0; }\n`;\n\nexport default function ScopedContentDemo() {\n    return \u003cProse as=\"article\">\n        \u003ch2>项目说明\u003c/h2>\n        \u003cp>正文、\u003ca href=\"#scoped-content-end\">相关链接\u003c/a>和 \u003ckbd>Enter\u003c/kbd> 提示使用文章排版。\u003c/p>\n        \u003caside className={cx('not-prose', noteStyle)} aria-label=\"独立提示\">\n            \u003ch3>提示内容\u003c/h3>\n            \u003cp>这个区域保留自身的字号、间距和表面，后面的文章继续使用 Prose。\u003c/p>\n        \u003c/aside>\n        \u003cp id=\"scoped-content-end\">文章内容继续。代码块中的字体不会被行内代码尺寸再次缩小。\u003c/p>\n        \u003cpre>\u003ccode>{'const ready = true;'}\u003c/code>\u003c/pre>\n    \u003c/Prose>;\n}\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fscoped-content.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fscoped-content.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/semantic-tag.demo.tsx",
        "title": "语义标签",
        "description": "通过 `as` 属性指定根元素标签：`div`（默认）、`article`、`section`、`main`",
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [
                "as"
            ],
            "events": [],
            "hasState": false
        },
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
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [
                "size"
            ],
            "events": [],
            "hasState": false
        },
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
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"表格与定义列表\",\n    description: \"展示表格与定义列表的排版效果\",\n};\n\nimport Prose from '@crab-dev/rc-prose';\n\nconst TableDemo = () => {\n    return (\n        \u003cProse>\n            \u003ch3>表格\u003c/h3>\n            \u003ctable>\n                \u003cthead>\n                    \u003ctr>\n                        \u003cth>项目\u003c/th>\n                        \u003cth>负责人\u003c/th>\n                        \u003cth>进度\u003c/th>\n                    \u003c/tr>\n                \u003c/thead>\n                \u003ctbody>\n                    \u003ctr>\n                        \u003ctd>产品说明\u003c/td>\n                        \u003ctd>陈晓\u003c/td>\n                        \u003ctd>已完成\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>交互评审\u003c/td>\n                        \u003ctd>林宁\u003c/td>\n                        \u003ctd>进行中\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>数据整理\u003c/td>\n                        \u003ctd>李明\u003c/td>\n                        \u003ctd>待开始\u003c/td>\n                    \u003c/tr>\n                    \u003ctr>\n                        \u003ctd>发布记录\u003c/td>\n                        \u003ctd>周晨\u003c/td>\n                        \u003ctd>待评审\u003c/td>\n                    \u003c/tr>\n                \u003c/tbody>\n            \u003c/table>\n\n            \u003ch3>定义列表\u003c/h3>\n            \u003cdl>\n                \u003cdt>Prose\u003c/dt>\n                \u003cdd>Markdown 排版容器组件，提供完整的富文本排版样式。\u003c/dd>\n\n                \u003cdt>Crab CSS\u003c/dt>\n                \u003cdd>零运行时 CSS-in-JS 方案，编译时提取静态 CSS。\u003c/dd>\n\n                \u003cdt>Design Token\u003c/dt>\n                \u003cdd>三层架构（全局 → 语义 → 组件），支持主题覆写。\u003c/dd>\n            \u003c/dl>\n        \u003c/Prose>\n    );\n};\n\nexport default TableDemo;\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Ftable.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Ftable.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    },
    {
        "id": "docs/demos/visual-states.demo.tsx",
        "title": "正色与逆色内容",
        "description": "四档文章字阶分别展示普通与 invert 排版。逆色容器使用当前主题的 inverse 背景，随明暗模式改变；内容覆盖中文、长链接、代码、表格和键盘提示。",
        "learning": {
            "components": [
                "Prose"
            ],
            "props": [
                "size",
                "invert",
                "as"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Prose, { type ProseSize } from '@crab-dev/rc-prose';\n\nexport const meta = {\n    title: '正色与逆色内容',\n    description: '四档文章字阶分别展示普通与 invert 排版。逆色容器使用当前主题的 inverse 背景，随明暗模式改变；内容覆盖中文、长链接、代码、表格和键盘提示。',\n};\n\nconst stackStyle = css`display: grid; gap: ${token.space['group-gap']}; min-width: 0;`;\nconst surfaceStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; min-width: 0;`;\nconst inverseStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.background.inverse}; min-width: 0;`;\nconst sizes: ProseSize[] = ['sm', 'base', 'lg', 'xl'];\n\nexport default function VisualStatesDemo() {\n    return \u003cdiv className={stackStyle}>\n        {sizes.map(size => [false, true].map(invert => \u003csection\n            key={`${size}-${invert}`}\n            className={invert ? inverseStyle : surfaceStyle}\n            aria-label={`${size} ${invert ? 'inverse' : 'default'}`}\n        >\n            \u003cProse size={size} invert={invert} as=\"article\">\n                \u003ch2>{size} · {invert ? '逆色排版' : '普通排版'}\u003c/h2>\n                \u003cp className=\"lead\">中文与 English 内容保持清晰的阅读层级。\u003c/p>\n                \u003cp>正文包含 \u003cstrong>重要信息\u003c/strong>、\u003cem>补充说明\u003c/em>、\u003ccode>inlineCode\u003c/code> 和 \u003ckbd>Enter\u003c/kbd>。使用键盘访问下方长链接，核对换行与焦点。\u003c/p>\n                \u003cp>\u003ca href=\"#prose-visual-end\">https://example.com/documentation/long-continuous-reference-for-typography-and-overflow\u003c/a>\u003c/p>\n                \u003cblockquote>\u003cp>引用需要保留边界、层级和足够的文字对比度。\u003c/p>\u003c/blockquote>\n                \u003cpre>\u003ccode>{'const description = \"一行较长的代码用于检查独立横向滚动，避免挤出文章容器的边界。\";'}\u003c/code>\u003c/pre>\n                \u003ctable>\u003cthead>\u003ctr>\u003cth>内容\u003c/th>\u003cth>说明\u003c/th>\u003c/tr>\u003c/thead>\u003ctbody>\u003ctr>\u003ctd>长文本\u003c/td>\u003ctd>当前主题的正文、表头、描边与背景应保持协调。\u003c/td>\u003c/tr>\u003c/tbody>\u003c/table>\n            \u003c/Prose>\n        \u003c/section>))}\n        \u003cp id=\"prose-visual-end\">内容结束\u003c/p>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-prose/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-states.demo.tsx",
        "workbenchPath": "/components/rc-prose/workbench/#/components/docs%2Fdemos%2Fvisual-states.demo.tsx",
        "density": "spacious",
        "layout": "wide",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
