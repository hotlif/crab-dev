/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基础用法",
        "description": "默认渲染一条语义分隔线（role=separator）, 用于切分上下两段内容。",
        "sourceCode": "export const meta = {\n    title: \"基础用法\",\n    description: \"默认渲染一条语义分隔线（role=separator）, 用于切分上下两段内容。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Divider from '../../src/index.js';\n\nconst textStyle = css`\n    margin: 0;\n    color: oklch(0.44 0.01 286);\n`;\n\nconst BasicDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cp className={textStyle}>\n                分割线把连续的内容切成可辨认的段落, 让「哪些属于一组」无需说明即可看出。\n            \u003c/p>\n            \u003cDivider />\n            \u003cp className={textStyle}>\n                它是一种视觉限制：用一条线收窄用户对内容边界的猜测范围。\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default BasicDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"语义线与装饰线\",\n    description: \"默认线会被读屏播报为「分隔线」; 当线只是重复了已有的视觉分组时, 用 decorative 把它移出无障碍树, 避免噪声反馈。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Divider from '../../src/index.js';\n\nconst cardStyle = css`\n    padding: 16px;\n    border: 1px solid oklch(0.9 0.004 286);\n    border-radius: 8px;\n`;\n\nconst titleStyle = css`\n    margin: 0;\n    font-size: 16px;\n    font-weight: 600;\n`;\n\nconst bodyStyle = css`\n    margin: 0;\n    color: oklch(0.44 0.01 286);\n    font-size: 14px;\n`;\n\nconst DecorativeDemo = () => {\n    return (\n        \u003cdiv className={cardStyle}>\n            \u003ch4 className={titleStyle}>卡片标题\u003c/h4>\n            {/* 标题与正文的从属关系已由排版表达, 这条线纯属修饰 —— 让读屏跳过它 */}\n            \u003cDivider decorative spacing=\"small\" />\n            \u003cp className={bodyStyle}>\n                正文内容。这条线不进入无障碍树, 读屏不会在标题与正文之间插入一句「分隔线」。\n            \u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default DecorativeDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"留白档位\",\n    description: \"线两侧的留白决定分组强度（格式塔接近性）: 留白越大, 两段内容「离得越远」。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Divider from '../../src/index.js';\n\nconst rowStyle = css`\n    margin: 0;\n    padding: 4px 8px;\n    background-color: oklch(0.97 0.002 286);\n    border-radius: 6px;\n`;\n\nconst SpacingDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cp className={rowStyle}>none — 线与内容贴合, 仅作切分\u003c/p>\n            \u003cDivider spacing=\"none\" />\n            \u003cp className={rowStyle}>small\u003c/p>\n            \u003cDivider spacing=\"small\" />\n            \u003cp className={rowStyle}>middle（默认）\u003c/p>\n            \u003cDivider spacing=\"middle\" />\n            \u003cp className={rowStyle}>large — 留白最大, 分组感最强\u003c/p>\n            \u003cDivider spacing=\"large\" />\n            \u003cp className={rowStyle}>末段\u003c/p>\n        \u003c/div>\n    );\n};\n\nexport default SpacingDemo;\n",
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
        "sourceCode": "export const meta = {\n    title: \"竖向分割线\",\n    description: \"direction=vertical 用于行内切分: 按钮组、状态栏、面包屑。高度跟随当前字号。\",\n};\n\nimport { css } from '@crab-dev/css';\nimport Button from '@crab-dev/rc-button';\nimport Divider from '../../src/index.js';\n\nconst rowStyle = css`\n    display: flex;\n    align-items: center;\n`;\n\nconst linkRowStyle = css`\n    display: flex;\n    align-items: center;\n    margin-top: 16px;\n    color: oklch(0.44 0.01 286);\n    font-size: 14px;\n`;\n\nconst VerticalDemo = () => {\n    return (\n        \u003cdiv>\n            \u003cdiv className={rowStyle}>\n                \u003cButton appearance=\"subtle\">编辑\u003c/Button>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cButton appearance=\"subtle\">复制\u003c/Button>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cButton appearance=\"subtle\">删除\u003c/Button>\n            \u003c/div>\n\n            \u003cdiv className={linkRowStyle}>\n                \u003cspan>已完成 12 项\u003c/span>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cspan>进行中 3 项\u003c/span>\n                \u003cDivider direction=\"vertical\" spacing=\"small\" />\n                \u003cspan>失败 1 项\u003c/span>\n            \u003c/div>\n        \u003c/div>\n    );\n};\n\nexport default VerticalDemo;\n",
        "previewPath": "/components/rc-divider/workbench/?__wake_demo=docs%2Fdemos%2Fvertical.demo.tsx",
        "workbenchPath": "/components/rc-divider/workbench/#/components/docs%2Fdemos%2Fvertical.demo.tsx",
        "density": "regular",
        "layout": "grid",
        "group": null
    }
] as const satisfies readonly ComponentDemoRecord[];
