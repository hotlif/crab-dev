/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "title 与 extra 组成标题区, 裸内容自动落入内容区。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"title 与 extra 组成标题区, 裸内容自动落入内容区。\",\n};\n\nimport Button from '@crab-dev/rc-button';\nimport Card from '../../src/index.js';\n\nconst BasicDemo = () => {\n    return (\n        \u003cCard\n            title=\"项目周报\"\n            extra={\u003cButton appearance=\"link\">更多\u003c/Button>}\n            style={{ maxWidth: 360 }}\n        >\n            本周完成卡片组件的令牌设计与交互实现, 覆盖三种视觉变体与整卡点击语义,\n            下周进入文档与回归测试阶段。\n        \u003c/Card>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"自由拼装\",\n    description: \"传入 Card.Cover / Header / Body / Footer 结构子组件时切换为自由模式, 完全掌控区块次序。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport Tag from '@crab-dev/rc-tag';\nimport Card from '../../src/index.js';\n\nconst coverArtStyle = css`\n    height: 120px;\n    background: linear-gradient(135deg, oklch(0.75 0.13 60), oklch(0.68 0.17 20));\n`;\n\nconst CompositionDemo = () => {\n    return (\n        \u003cCard hoverable style={{ maxWidth: 340 }}>\n            \u003cCard.Header title=\"自由拼装模式\" extra={\u003cTag color=\"primary\">Beta\u003c/Tag>} />\n            \u003cCard.Body>结构子组件可任意排布 —— 这里把封面放在了正文与操作区之间。\u003c/Card.Body>\n            \u003cCard.Cover>\n                \u003cdiv className={coverArtStyle} />\n            \u003c/Card.Cover>\n            \u003cCard.Footer>\n                \u003cButton appearance=\"text\">取消\u003c/Button>\n                \u003cButton appearance=\"primary\">确认\u003c/Button>\n            \u003c/Card.Footer>\n        \u003c/Card>\n    );\n};\n\nexport default CompositionDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fcomposition.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fcomposition.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "基础与布局"
    },
    {
        "id": "docs/demos/cover.demo.tsx",
        "title": "封面与悬浮浮起",
        "description": "cover 出血铺满顶部; hoverable 悬浮时卡片浮起、封面同步微缩放。",
        "sourceCode": "export const meta = {\n    title: \"封面与悬浮浮起\",\n    description: \"cover 出血铺满顶部; hoverable 悬浮时卡片浮起、封面同步微缩放。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Avatar from '@crab-dev/rc-avatar';\nimport Card from '../../src/index.js';\n\nconst coverArtStyle = css`\n    height: 160px;\n    background: linear-gradient(135deg, oklch(0.72 0.15 250), oklch(0.62 0.19 300));\n`;\n\nconst CoverDemo = () => {\n    return (\n        \u003cCard hoverable cover={\u003cdiv className={coverArtStyle} />} style={{ maxWidth: 320 }}>\n            \u003cCard.Meta\n                avatar={\u003cAvatar variant=\"primary\">曦\u003c/Avatar>}\n                title=\"晨曦航线\"\n                description=\"穿越晨雾的第一班渡轮, 记录海面苏醒的十五分钟。\"\n            />\n        \u003c/Card>\n    );\n};\n\nexport default CoverDemo;\n",
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
        "description": "elevated 微投影（默认）/ outlined 描边 / filled 弱灰底, 按承载面的层次选用。",
        "sourceCode": "export const meta = {\n    title: \"三种变体\",\n    description: \"elevated 微投影（默认）/ outlined 描边 / filled 弱灰底, 按承载面的层次选用。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Card from '../../src/index.js';\n\nconst rowStyle = css`\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    gap: 16px;\n`;\n\nconst VariantDemo = () => {\n    return (\n        \u003cdiv className={rowStyle}>\n            \u003cCard variant=\"elevated\" title=\"Elevated\">\n                白底 + 静态微投影, 适合置于灰底页面之上。\n            \u003c/Card>\n            \u003cCard variant=\"outlined\" title=\"Outlined\">\n                白底 + 1px 描边, 适合信息密集的平铺列表。\n            \u003c/Card>\n            \u003cCard variant=\"filled\" title=\"Filled\">\n                弱灰底无描边, 适合嵌在白底容器内部做轻分组。\n            \u003c/Card>\n        \u003c/div>\n    );\n};\n\nexport default VariantDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"整卡可点击\",\n    description: \"clickable 赋予按钮语义：浮起反馈、键盘激活与焦点环; extra 与 actions 的点击自动与整卡隔离。\",\n};\n\nimport { useState } from 'react';\nimport Button from '@crab-dev/rc-button';\nimport Card from '../../src/index.js';\n\nconst ClickableDemo = () => {\n    const [message, setMessage] = useState('点击卡片任意位置, 或 Tab 聚焦后按 Enter');\n\n    return (\n        \u003cCard\n            clickable\n            onClick={() => setMessage(`整卡点击 · ${new Date().toLocaleTimeString()}`)}\n            title=\"可点击卡片\"\n            extra={\n                \u003cButton appearance=\"text\" onClick={() => setMessage('点击了 extra, 未触发整卡')}>\n                    更多\n                \u003c/Button>\n            }\n            actions={[\n                \u003cButton key=\"edit\" appearance=\"subtle\" onClick={() => setMessage('点击了操作区, 未触发整卡')}>\n                    编辑\n                \u003c/Button>,\n            ]}\n            style={{ maxWidth: 360 }}\n        >\n            {message}\n        \u003c/Card>\n    );\n};\n\nexport default ClickableDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Fclickable.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Fclickable.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "交互与状态"
    },
    {
        "id": "docs/demos/loading.demo.tsx",
        "title": "加载骨架",
        "description": "loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。",
        "sourceCode": "export const meta = {\n    title: \"加载骨架\",\n    description: \"loading 时以骨架占位并标注 aria-busy, 结构与真实内容对应, 完成后无跳动切换。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport { useState } from 'react';\nimport Avatar from '@crab-dev/rc-avatar';\nimport Button from '@crab-dev/rc-button';\nimport Card from '../../src/index.js';\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    max-width: 320px;\n`;\n\nconst coverArtStyle = css`\n    height: 140px;\n    background: linear-gradient(135deg, oklch(0.8 0.12 150), oklch(0.7 0.14 200));\n`;\n\nconst LoadingDemo = () => {\n    const [loading, setLoading] = useState(true);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cButton appearance=\"subtle\" onClick={() => setLoading((prev) => !prev)}>\n                {loading ? '完成加载' : '重新加载'}\n            \u003c/Button>\n            \u003cCard loading={loading} cover={\u003cdiv className={coverArtStyle} />}>\n                \u003cCard.Meta\n                    avatar={\u003cAvatar variant=\"success\">禾\u003c/Avatar>}\n                    title=\"内容加载完成\"\n                    description=\"骨架的封面 / 标题 / 三行正文与真实内容一一对应。\"\n                />\n            \u003c/Card>\n        \u003c/div>\n    );\n};\n\nexport default LoadingDemo;\n",
        "previewPath": "/components/rc-card/workbench/?__wake_demo=docs%2Fdemos%2Floading.demo.tsx",
        "workbenchPath": "/components/rc-card/workbench/#/components/docs%2Fdemos%2Floading.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": "交互与状态"
    }
] as const satisfies readonly ComponentDemoRecord[];
