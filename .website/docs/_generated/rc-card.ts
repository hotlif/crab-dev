/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "title 与 extra 组成标题区, 裸内容自动落入内容区。",
        "learning": {
            "components": [
                "Card",
                "Button"
            ],
            "props": [
                "title",
                "extra",
                "appearance",
                "aria-expanded",
                "aria-controls",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"title 与 extra 组成标题区, 裸内容自动落入内容区。\",\n};\n\nimport Button from '@crab-dev/rc-button';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\nimport Card from '../../src/index.js';\n\nconst cardStyle = css`max-width: calc(${token.size[64]} * 5 + ${token.size[40]});`;\nconst detailsStyle = css`margin-block: ${token.space['component-gap']};`;\nconst statusStyle = css`margin-block-end: 0; color: ${token.color.text.secondary};`;\n\nconst BasicDemo = () => {\n    const [expanded, setExpanded] = useState(false);\n    const detailsId = useId();\n    return (\n        \u003cCard\n            title=\"项目周报\"\n            extra={\u003cButton appearance=\"text\" aria-expanded={expanded} aria-controls={detailsId}\n                onClick={() => setExpanded(value => !value)}>{expanded ? '收起' : '更多'}\u003c/Button>}\n            className={cardStyle}\n        >\n            本周完成卡片组件的令牌设计与交互实现, 覆盖三种视觉变体与整卡点击语义,\n            下周进入文档与回归测试阶段。\n            \u003cp id={detailsId} hidden={!expanded} className={detailsStyle}>已完成浅深色与键盘操作核对，下一步补充业务页面中的使用示例。\u003c/p>\n            \u003cp role=\"status\" className={statusStyle}>{expanded ? '已展开周报详情。' : '当前显示周报摘要。'}\u003c/p>\n        \u003c/Card>\n    );\n};\n\nexport default BasicDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/composition.demo.tsx",
        "title": "自由拼装",
        "description": "传入 Card.Cover / Header / Body / Footer 结构子组件时切换为自由模式, 完全掌控区块次序。",
        "learning": {
            "components": [
                "Card",
                "Tag",
                "Button"
            ],
            "props": [
                "hoverable",
                "title",
                "extra",
                "color",
                "appearance",
                "onClick"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"自由拼装\",\n    description: \"传入 Card.Cover / Header / Body / Footer 结构子组件时切换为自由模式, 完全掌控区块次序。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport Tag from '@crab-dev/rc-tag';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Card from '../../src/index.js';\n\nconst cardStyle = css`max-width: calc(${token.size[64]} * 5 + ${token.size[20]});`;\nconst statusStyle = css`margin-block-end: 0; color: ${token.color.text.secondary};`;\nconst coverArtStyle = css`\n    height: calc(${token.size[64]} * 2 - ${token.space['component-gap']});\n    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});\n`;\n\nconst CompositionDemo = () => {\n    const [message, setMessage] = useState('请选择确认或取消。');\n    return (\n        \u003cCard hoverable className={cardStyle}>\n            \u003cCard.Header title=\"自由拼装模式\" extra={\u003cTag color=\"primary\">Beta\u003c/Tag>} />\n            \u003cCard.Body>\n                结构子组件可任意排布，这里把封面放在了正文与操作区之间。\n                \u003cp className={statusStyle} role=\"status\">{message}\u003c/p>\n            \u003c/Card.Body>\n            \u003cCard.Cover>\n                \u003cdiv className={coverArtStyle} />\n            \u003c/Card.Cover>\n            \u003cCard.Footer>\n                \u003cButton appearance=\"text\" onClick={() => setMessage('已取消本次操作。')}>取消\u003c/Button>\n                \u003cButton appearance=\"primary\" onClick={() => setMessage('已确认当前内容。')}>确认\u003c/Button>\n            \u003c/Card.Footer>\n        \u003c/Card>\n    );\n};\n\nexport default CompositionDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fcomposition.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fcomposition.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/cover.demo.tsx",
        "title": "封面与悬停反馈",
        "description": "cover 出血铺满顶部；hoverable 显示状态层并提升一级阴影，封面保持原尺寸。",
        "learning": {
            "components": [
                "Card",
                "Avatar"
            ],
            "props": [
                "hoverable",
                "cover",
                "avatar",
                "title",
                "description",
                "variant"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"封面与悬停反馈\",\n    description: \"cover 出血铺满顶部；hoverable 显示状态层并提升一级阴影，封面保持原尺寸。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Avatar from '@crab-dev/rc-avatar';\nimport token from '@crab-dev/rc-token-semantic';\nimport Card from '../../src/index.js';\n\nconst cardStyle = css`max-width: calc(${token.size[64]} * 5);`;\nconst coverArtStyle = css`\n    height: calc(${token.size[64]} * 2 + ${token.size[32]});\n    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});\n`;\n\nconst CoverDemo = () => {\n    return (\n        \u003cCard hoverable cover={\u003cdiv className={coverArtStyle} />} className={cardStyle}>\n            \u003cCard.Meta\n                avatar={\u003cAvatar variant=\"primary\">曦\u003c/Avatar>}\n                title=\"晨曦航线\"\n                description=\"穿越晨雾的第一班渡轮, 记录海面苏醒的十五分钟。\"\n            />\n        \u003c/Card>\n    );\n};\n\nexport default CoverDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fcover.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fcover.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "三档尺寸",
        "description": "size 同步缩放内边距 / 圆角 / 标题字号, 与其他组件的尺寸档位对齐。",
        "learning": {
            "components": [
                "Card"
            ],
            "props": [
                "size",
                "variant",
                "title"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"三档尺寸\",\n    description: \"size 同步缩放内边距 / 圆角 / 标题字号, 与其他组件的尺寸档位对齐。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Card from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    gap: 16px;\n\n    & > * {\n        flex: 1 1 200px;\n    }\n`;\n\nconst SizeDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cCard size=\"small\" variant=\"outlined\" title=\"Small\">\n                紧凑列表场景。\n            \u003c/Card>\n            \u003cCard size=\"middle\" variant=\"outlined\" title=\"Middle\">\n                默认档位, 适合常规信息卡。\n            \u003c/Card>\n            \u003cCard size=\"large\" variant=\"outlined\" title=\"Large\">\n                页面级重点区块。\n            \u003c/Card>\n        \u003c/div>\n    );\n};\n\nexport default SizeDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/variant.demo.tsx",
        "title": "三种变体",
        "description": "outlined 描边 / elevated 微投影 / filled 弱灰底；省略 variant 时随统一设计风格切换。",
        "learning": {
            "components": [
                "Card"
            ],
            "props": [
                "variant",
                "title"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"三种变体\",\n    description: \"outlined 描边 / elevated 微投影 / filled 弱灰底；省略 variant 时随统一设计风格切换。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Card from '../../src/index.js';\n\nconst rowStyle = css`\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    gap: 16px;\n`;\n\nconst VariantDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cCard variant=\"elevated\" title=\"Elevated\">\n                低层级表面 + 一级阴影，无描边；暗色模式仍能区分层次。\n            \u003c/Card>\n            \u003cCard variant=\"outlined\" title=\"Outlined\">\n                普通表面 + 1px 弱描边，适合信息密集的平铺列表。\n            \u003c/Card>\n            \u003cCard variant=\"filled\" title=\"Filled\">\n                弱填充、无描边，适合在内容容器内部做轻分组。\n            \u003c/Card>\n        \u003c/div>\n    );\n};\n\nexport default VariantDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fvariant.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fvariant.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/clickable.demo.tsx",
        "title": "整卡可点击",
        "description": "clickable 赋予按钮语义：浮起反馈、键盘激活与焦点环; extra 与 actions 的点击自动与整卡隔离。",
        "learning": {
            "components": [
                "Card",
                "Button"
            ],
            "props": [
                "clickable",
                "onClick",
                "title",
                "extra",
                "actions",
                "appearance"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"整卡可点击\",\n    description: \"clickable 赋予按钮语义：浮起反馈、键盘激活与焦点环; extra 与 actions 的点击自动与整卡隔离。\",\n};\n\nimport { useState } from 'react';\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport Button from '@crab-dev/rc-button';\nimport Card from '../../src/index.js';\n\nconst cardStyle = css`max-width: calc(${token.size[64]} * 5 + ${token.size[40]});`;\n\nconst ClickableDemo = () => {\n    const [message, setMessage] = useState('点击卡片任意位置, 或 Tab 聚焦后按 Enter');\n\n    return (\n        \u003cCard\n            clickable\n            onClick={() => setMessage(`整卡点击 · ${new Date().toLocaleTimeString()}`)}\n            title=\"可点击卡片\"\n            extra={\n                \u003cButton appearance=\"text\" onClick={() => setMessage('点击了 extra, 未触发整卡')}>\n                    更多\n                \u003c/Button>\n            }\n            actions={[\n                \u003cButton key=\"edit\" appearance=\"outlined\" onClick={() => setMessage('点击了操作区, 未触发整卡')}>\n                    编辑\n                \u003c/Button>,\n            ]}\n            className={cardStyle}\n        >\n            \u003cspan role=\"status\">{message}\u003c/span>\n        \u003c/Card>\n    );\n};\n\nexport default ClickableDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fclickable.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fclickable.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "交互与状态"
    },
    {
        "id": "docs/demos/states.demo.tsx",
        "title": "交互状态",
        "description": "三种变体保留各自的表面色和层级，支持鼠标、键盘及禁用状态。",
        "learning": {
            "components": [
                "Card"
            ],
            "props": [
                "variant",
                "clickable",
                "title",
                "onClick",
                "disabled"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: '交互状态',\n    description: '三种变体保留各自的表面色和层级，支持鼠标、键盘及禁用状态。',\n};\n\nimport { css } from '@crab-dev/css';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useState } from 'react';\nimport Card from '../../src/card.js';\nimport type { CardVariant } from '../../src/types.js';\n\nconst gridStyle = css`\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 4)), 1fr));\n    gap: ${token.space['section-gap']};\n`;\nconst variants: CardVariant[] = ['elevated', 'outlined', 'filled'];\n\nexport default function StatesDemo() {\n    const [selected, setSelected] = useState\u003cCardVariant | null>(null);\n    return \u003cdiv>\n        \u003cdiv className={gridStyle}>\n            {variants.map(variant => \u003cCard key={variant} variant={variant} clickable\n                title={variant} onClick={() => setSelected(variant)}>\n                点击或按 Enter / Space 选择此卡片。\n            \u003c/Card>)}\n            {variants.map(variant => \u003cCard key={`${variant}-disabled`} variant={variant} clickable disabled\n                title={`${variant} · 不可用`}>\n                完成设置后可用。\n            \u003c/Card>)}\n        \u003c/div>\n        \u003cp role=\"status\">{selected ? `已选择 ${selected}` : '请选择一种卡片'}\u003c/p>\n    \u003c/div>;\n}\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fstates.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fstates.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "交互与状态"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载骨架",
        "description": "loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。",
        "learning": {
            "components": [
                "Button",
                "Card",
                "Avatar"
            ],
            "props": [
                "appearance",
                "onClick",
                "loading",
                "cover",
                "avatar",
                "title",
                "description",
                "variant"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"加载骨架\",\n    description: \"loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Avatar from '@crab-dev/rc-avatar';\nimport Button from '@crab-dev/rc-button';\nimport token from '@crab-dev/rc-token-semantic';\nimport Card from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: ${token.space['section-gap']};\n    max-width: calc(${token.size[64]} * 5);\n`;\n\nconst coverArtStyle = css`\n    height: calc(${token.size[64]} * 2 + ${token.space['inline-gap']});\n    background: linear-gradient(135deg, ${token.color.brand.container}, ${token.color.secondary.container});\n`;\n\nconst LoadingDemo = () => {\n    const [loading, setLoading] = useState(true);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cButton appearance=\"outlined\" onClick={() => setLoading((prev) => !prev)}>\n                {loading ? '完成加载' : '重新加载'}\n            \u003c/Button>\n            \u003cCard loading={loading} cover={\u003cdiv className={coverArtStyle} />}>\n                \u003cCard.Meta\n                    avatar={\u003cAvatar variant=\"success\">禾\u003c/Avatar>}\n                    title=\"内容加载完成\"\n                    description=\"骨架的封面 / 标题 / 三行正文与真实内容一一对应。\"\n                />\n            \u003c/Card>\n            \u003cspan role=\"status\">{loading ? '正在加载卡片内容。' : '卡片内容已加载。'}\u003c/span>\n        \u003c/div>\n    );\n};\n\nexport default LoadingDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Floading.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "交互与状态"
    }
] as const satisfies readonly ComponentDemoRecord[];
