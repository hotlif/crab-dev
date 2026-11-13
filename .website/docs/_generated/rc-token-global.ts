/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/base.demo.tsx",
        "title": "全局颜色与尺度",
        "description": "直接引用全局基元构建色块，展示颜色、间距与圆角；说明文字继承工作台。",
        "learning": {
            "components": [],
            "props": [],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import { css } from \"@crab-dev/css\";\nimport globalToken from \"@crab-dev/rc-token-global\";\n\nexport const meta = {\n    title: \"全局颜色与尺度\",\n    description: \"直接引用全局基元构建色块，展示颜色、间距与圆角；说明文字继承工作台。\",\n};\n\nconst frame = css`\n    display: grid;\n    gap: ${globalToken.space[2]};\n    padding: ${globalToken.space[5]};\n    border-radius: ${globalToken.radius[4]};\n`;\nconst swatch = css`\n    /* This swatch presents a color value, rather than a user-interface surface. */\n    forced-color-adjust: none;\n    width: ${globalToken.space[16]};\n    height: ${globalToken.space[16]};\n    background: ${globalToken.blue[600]};\n    border-radius: ${globalToken.radius[3]};\n`;\n\nexport default function BaseDemo() {\n    return \u003cdiv className={frame}>\u003cdiv className={swatch} aria-hidden=\"true\" />\u003cstrong>Blue 600 · 原始色块\u003c/strong>\u003cp>颜色、尺寸与圆角来自全局基元；文字继承工作台的阅读样式。\u003c/p>\u003c/div>;\n}\n",
        "previewPath": "/components/rc-token-global/workbench/?__wake_demo=docs%2Fdemos%2Fbase.demo.tsx",
        "workbenchPath": "/components/rc-token-global/workbench/#/components/docs%2Fdemos%2Fbase.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "边界与视觉矩阵"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "为 MD3 的语义角色提供颜色、间距、字体与时间等原始材料，基元本身没有业务语义。",
        "usage": "先选择表面、文字或动作角色，再从基元映射数值；原始色阶不能代替语义令牌。",
        "exampleDescription": "读取全局令牌引用，再查看语义层如何将基元用于色调表面与排版。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/styles/color/system/overview",
            "https://material-web.dev/theming/",
            "https://github.com/material-components/material-web/tree/main/tokens"
        ]
    },
    "macos": {
        "summary": "为 macOS 桌面设计提供基础尺度与颜色原料，几何和材质通过语义层组合。",
        "usage": "原始间距或圆角不是某个系统控件的完整规格，使用前需明确内容层或工具层职责。",
        "exampleDescription": "查看基础尺度的引用方式，区分原始数值与桌面界面中的语义角色。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "为 shadcn 的中性表面、边界和排版提供原始尺度，保持材料与用途分离。",
        "usage": "业务样式优先消费语义角色，只有展示基元或维护基础尺度时直接引用原始值。",
        "exampleDescription": "读取色阶与间距引用，理解它们如何映射到中性界面的内容边界。",
        "demos": [
            "base.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Global Tokens 是三层令牌体系的 L1 原始基元，包含颜色、间距、圆角、字体、阴影、动效、透明度和层级。它们描述可复用数值，不直接表达业务用途。",
    "useWhen": [
        "建设或维护设计系统的基础尺度和色板。",
        "L2 语义令牌需要引用统一的原始值。"
    ],
    "avoidWhen": [
        "业务组件不要直接挑选原始颜色或间距；应先使用 L2/L3 的语义角色。"
    ],
    "essentials": [
        "键名是刻度标识，不一定等于像素或明度数值。",
        "修改一个 L1 值会影响所有上层引用，必须先追踪消费者。",
        "token.toml 是源文件，src/token.ts 只能通过生成命令刷新。"
    ],
    "accessibility": [
        "原始色存在不代表任意前景背景组合都达标，必须在最终语义配对上验证。",
        "字体、间距和动效基元要在缩放、中文、减少动态效果等真实环境中检查。"
    ]
} as const;
