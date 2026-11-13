/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认渲染一条语义分隔线（role=separator）, 用于切分上下两段内容。",
        "learning": {
            "components": [
                "Divider"
            ],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认渲染一条语义分隔线（role=separator）, 用于切分上下两段内容。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Divider from '../../src/index.js';\n\nconst textStyle = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n`;\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cp className={textStyle}>\n                分割线把连续的内容切成可辨认的段落, 让「哪些属于一组」无需说明即可看出。\n            \u003c/p>\n            \u003cDivider />\n            \u003cp className={textStyle}>\n                它是一种视觉限制：用一条线收窄用户对内容边界的猜测范围。\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/decorative.demo.tsx",
        "title": "语义线与装饰线",
        "description": "默认线会被读屏播报为「分隔线」; 当线只是重复了已有的视觉分组时, 用 decorative 把它移出无障碍树, 避免噪声反馈。",
        "learning": {
            "components": [
                "Divider"
            ],
            "props": [
                "decorative",
                "spacing"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"语义线与装饰线\",\n    description: \"默认线会被读屏播报为「分隔线」; 当线只是重复了已有的视觉分组时, 用 decorative 把它移出无障碍树, 避免噪声反馈。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Divider from '../../src/index.js';\n\nconst cardStyle = css`\n    padding: ${token.space['card-padding']};\n    border: 1px solid ${token.color.border.subtle};\n    border-radius: ${token.shape.card};\n    background-color: ${token.color.background.surface};\n    color: ${token.color.text.primary};\n`;\n\nconst titleStyle = css`\n    margin: 0;\n    font-size: ${token.font.size.subhead};\n    font-weight: ${token.font.weight.heading};\n`;\n\nconst bodyStyle = css`\n    margin: 0;\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.body};\n`;\n\nconst DecorativeDemo = () => {\n    return (\n        \u003cdiv className={cardStyle}>\n            \u003ch4 className={titleStyle}>卡片标题\u003c/h4>\n            {/* 标题与正文的从属关系已由排版表达, 这条线纯属修饰 —— 让读屏跳过它 */}\n            \u003cDivider decorative spacing=\"small\" />\n            \u003cp className={bodyStyle}>\n                正文内容。这条线不进入无障碍树, 读屏不会在标题与正文之间插入一句「分隔线」。\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default DecorativeDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fdecorative.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fdecorative.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/spacing.demo.tsx",
        "title": "留白档位",
        "description": "线两侧的留白决定分组强度（格式塔接近性）: 留白越大, 两段内容「离得越远」。",
        "learning": {
            "components": [
                "Divider"
            ],
            "props": [
                "spacing"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"留白档位\",\n    description: \"线两侧的留白决定分组强度（格式塔接近性）: 留白越大, 两段内容「离得越远」。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Divider from '../../src/index.js';\n\nconst rowStyle = css`\n    margin: 0;\n    padding: ${token.space['control-padding-y']} ${token.space['control-padding-x-small']};\n    background-color: ${token.color.surface.container};\n    color: ${token.color.text.primary};\n    border-radius: ${token.shape.control};\n`;\n\nconst SpacingDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cp className={rowStyle}>none — 线与内容贴合, 仅作切分\u003c/p>\n            \u003cDivider spacing=\"none\" />\n            \u003cp className={rowStyle}>small\u003c/p>\n            \u003cDivider spacing=\"small\" />\n            \u003cp className={rowStyle}>medium（默认）\u003c/p>\n            \u003cDivider spacing=\"medium\" />\n            \u003cp className={rowStyle}>large — 留白最大, 分组感最强\u003c/p>\n            \u003cDivider spacing=\"large\" />\n            \u003cp className={rowStyle}>末段\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default SpacingDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fspacing.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fspacing.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/text.demo.tsx",
        "title": "带文字",
        "description": "传入 children 即成为分节标题。textAlign 控制文字落点, plain 让文字退回正文字重。",
        "learning": {
            "components": [
                "Divider"
            ],
            "props": [
                "textAlign",
                "plain"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"带文字\",\n    description: \"传入 children 即成为分节标题。textAlign 控制文字落点, plain 让文字退回正文字重。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Divider from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n`;\n\nconst TextDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cDivider>居中标题\u003c/Divider>\n            \u003cDivider textAlign=\"start\">左侧标题\u003c/Divider>\n            \u003cDivider textAlign=\"end\">右侧标题\u003c/Divider>\n            \u003cDivider plain>plain 说明文字\u003c/Divider>\n        \u003c/div>\n    );\n};\n\nexport default TextDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Ftext.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Ftext.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/variant.demo.tsx",
        "title": "线型",
        "description": "solid 用于正式分区; dashed / dotted 语义更轻, 常用于表达「可选」或「临时」的边界。",
        "learning": {
            "components": [
                "Divider"
            ],
            "props": [
                "variant"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"线型\",\n    description: \"solid 用于正式分区; dashed / dotted 语义更轻, 常用于表达「可选」或「临时」的边界。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Divider from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n`;\n\nconst VariantDemo = () => {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cDivider>solid\u003c/Divider>\n            \u003cDivider variant=\"dashed\">dashed\u003c/Divider>\n            \u003cDivider variant=\"dotted\">dotted\u003c/Divider>\n        \u003c/div>\n    );\n};\n\nexport default VariantDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fvariant.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fvariant.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/vertical.demo.tsx",
        "title": "竖向分割线",
        "description": "direction=vertical 用于行内切分: 按钮组、状态栏、面包屑。高度跟随当前字号。",
        "learning": {
            "components": [
                "Button",
                "Divider"
            ],
            "props": [
                "appearance",
                "onClick",
                "direction",
                "spacing",
                "danger"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"竖向分割线\",\n    description: \"direction=vertical 用于行内切分: 按钮组、状态栏、面包屑。高度跟随当前字号。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Divider from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n`;\n\nconst linkRowStyle = css`\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    margin-top: ${token.space['stack-gap']};\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.body};\n`;\n\nconst statusStyle = css`\n    margin: ${token.space['stack-gap']} 0 0;\n    color: ${token.color.text.secondary};\n    font-size: ${token.font.size.caption};\n`;\n\nconst VerticalDemo = () => {\n    const [status, setStatus] = useState('选择操作以查看反馈。');\n\n    return (\n        \u003cdiv>\n            \u003cdiv className={rowStyle}>\n                \u003cButton appearance=\"text\" onClick={() => setStatus('已选择「编辑」操作。')}>编辑\u003c/Button>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cButton appearance=\"text\" onClick={() => setStatus('已选择「复制」操作。')}>复制\u003c/Button>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cButton appearance=\"text\" danger onClick={() => setStatus('已选择「删除」操作。')}>删除\u003c/Button>\n            \u003c/div>\n\n            \u003cdiv className={linkRowStyle}>\n                \u003cspan>已完成 12 项\u003c/span>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cspan>进行中 3 项\u003c/span>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cspan>失败 1 项\u003c/span>\n            \u003c/div>\n            \u003cp className={statusStyle} role=\"status\" aria-live=\"polite\">{status}\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default VerticalDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fvertical.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fvertical.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "三体系展示与状态矩阵",
        "description": "公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。",
        "learning": {
            "components": [
                "ConfigProvider",
                "Divider"
            ],
            "props": [
                "size",
                "density",
                "data-visual-target",
                "direction",
                "textAlign",
                "decorative",
                "variant",
                "spacing"
            ],
            "events": [],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Divider from '@crab-dev/rc-divider';\n\n\nexport const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };\nconst frameStyle = css`\n    box-sizing: border-box;\n    display: grid;\n    gap: ${token.space['group-gap']};\n    padding: calc(${token.space['group-gap']} * 2);\n    min-width: 0;\n    color: ${token.color.text.primary};\n    background-color: ${token.color.background.surface};\n`;\nconst rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;\nconst sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;\n\n\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [longContent, setLongContent] = useState(false);\n    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');\n    const [size, setSize] = useState('medium');\n    const [density, setDensity] = useState\u003c'compact' | 'standard' | 'comfortable'>('standard');\n    const [state, setState] = useState('default');\n    const [draft, setDraft] = useState('保留这份草稿');\n    \n    return \u003cdiv>\n        \u003cdiv className={rowStyle}>\n            \u003clabel>验收尺寸\u003cselect aria-label=\"验收尺寸\" value={size} onChange={event => setSize(event.currentTarget.value)}>\u003coption>medium\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收密度\u003cselect aria-label=\"验收密度\" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}>\u003coption>compact\u003c/option>\u003coption>standard\u003c/option>\u003coption>comfortable\u003c/option>\u003c/select>\u003c/label>\n            \u003clabel>验收状态\u003cselect aria-label=\"验收状态\" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); }}>\u003coption value=\"default\">default\u003c/option>\u003coption value=\"dashed\">dashed\u003c/option>\u003coption value=\"dotted\">dotted\u003c/option>\u003coption value=\"with-text\">with-text\u003c/option>\u003coption value=\"start\">start\u003c/option>\u003coption value=\"end\">end\u003c/option>\u003coption value=\"vertical\">vertical\u003c/option>\u003coption value=\"decorative\">decorative\u003c/option>\u003c/select>\u003c/label>\n            \n        \u003c/div>\n        \u003clabel>\u003cinput type=\"checkbox\" aria-label=\"长文本\" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本\u003c/label>\n        \u003clabel>配置切换草稿\u003cinput aria-label=\"配置切换草稿\" value={draft} onChange={event => setDraft(event.currentTarget.value)} />\u003c/label>\n        \u003cConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>\n            \u003csection className={frameStyle} aria-label=\"Divider visual matrix\" data-visual-frame>\n                \u003cdiv className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>\n                    {state === 'vertical' ? \u003cdiv className={rowStyle}>\u003cspan>{copy('文件', 'File')}\u003c/span>\u003cDivider data-visual-target direction=\"vertical\" />\u003cspan>{copy('编辑', 'Edit')}\u003c/span>\u003c/div> : ['with-text','start','end'].includes(state) ? \u003cDivider data-visual-target textAlign={state === 'start' || state === 'end' ? state : 'center'}>{copy('团队工作区分组标题', 'Team workspace section')}\u003c/Divider> : \u003cDivider data-visual-target decorative={state === 'decorative'} variant={state === 'dashed' || state === 'dotted' ? state : 'solid'} />}\u003cDivider spacing=\"none\" />\u003cDivider spacing=\"small\" />\u003cDivider spacing=\"large\" />\n                    \n                \u003c/div>\n            \u003c/section>\n        \u003c/ConfigProvider>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以低强调分隔线区分相关内容组，优先通过留白表达大范围分组。",
        "usage": "分隔线不要抢过标题和操作；装饰性线条与有语义的分隔需要区分。",
        "exampleDescription": "比较留白和线条组合，查看不同内容组之间的阅读节奏。",
        "demos": [
            "spacing.demo.tsx",
            "basic.demo.tsx",
            "decorative.demo.tsx",
            "text.demo.tsx",
            "variant.demo.tsx",
            "vertical.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/divider/overview",
            "https://material-web.dev/components/divider/",
            "https://github.com/material-components/material-web/tree/main/divider"
        ]
    },
    "macos": {
        "summary": "以轻量细线分隔桌面工具和设置内容，在紧凑排列中保留秩序。",
        "usage": "工具栏内使用垂直分隔时保持与控件高度协调，不把每个按钮单独隔开。",
        "exampleDescription": "查看横向工具内容中的垂直分隔，确认分组关系与间距。",
        "demos": [
            "vertical.demo.tsx",
            "basic.demo.tsx",
            "decorative.demo.tsx",
            "spacing.demo.tsx",
            "text.demo.tsx",
            "variant.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "通过中性细边界建立内容组之间的分隔，适合简洁列表和设置页面。",
        "usage": "只在相邻内容关系需要说明时添加分隔；文字分隔应有明确标题含义。",
        "exampleDescription": "比较带文字的分隔与基础分隔，检查标题和线条的视觉权重。",
        "demos": [
            "text.demo.tsx",
            "basic.demo.tsx",
            "decorative.demo.tsx",
            "spacing.demo.tsx",
            "variant.demo.tsx",
            "vertical.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Divider 是低强调度的分隔线，用来说明相邻内容属于不同组。它只帮助识别结构，不应该代替足够的留白、标题或容器层级。",
    "useWhen": [
        "列表、菜单或内容区中相邻组需要轻量边界。",
        "水平或垂直布局需要清楚但不过度强调的结构分隔。"
    ],
    "avoidWhen": [
        "仅靠间距已经能表达分组时无需增加线条；不要让每个元素四周都出现 Divider。"
    ],
    "essentials": [
        "orientation 要与布局方向匹配，垂直分隔必须有可计算高度。",
        "variant 与 inset 用来对齐内容边缘，而不是随意装饰。",
        "带文字的分隔要确保文字确实是分组标题而非普通句子。"
    ],
    "accessibility": [
        "纯装饰分隔隐藏语义；确实表示主题断点时保留 separator 角色和正确方向。",
        "不要只用 Divider 表达不可见的关系，标题与 DOM 结构仍要正确。"
    ]
} as const;
