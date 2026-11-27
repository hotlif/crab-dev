/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/wrap.demo.tsx",
        "title": "让地图图层标签自然换行",
        "description": "标签按图层的阅读顺序排列，宽度不足时折到下一行。",
        "learning": {
            "components": [
                "Flex",
                "Tag"
            ],
            "props": [
                "role",
                "aria-label",
                "wrap",
                "align",
                "gap"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Flex from '@crab-dev/rc-flex';\nimport Tag from '@crab-dev/rc-tag';\n\nexport const meta = {\n    title: '让地图图层标签自然换行',\n    description: '标签按图层的阅读顺序排列，宽度不足时折到下一行。',\n};\n\nconst layers = ['地形等高线', '水系', '行政边界', '历史道路', '土地利用', '观测站点'];\n\nexport default function WrapDemo() {\n    return (\n        \u003cFlex role=\"group\" aria-label=\"地图图层\" wrap=\"wrap\" align=\"center\" gap={8}>\n            {layers.map(layer => \u003cTag key={layer}>{layer}\u003c/Tag>)}\n        \u003c/Flex>\n    );\n}\n",
        "previewPath": "/components/rc-flex/workbench/?__wake_demo=docs%2Fdemos%2Fwrap.demo.tsx",
        "workbenchPath": "/components/rc-flex/workbench/#/components/docs%2Fdemos%2Fwrap.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "普通布局"
    },
    {
        "id": "docs/demos/virtual-list.demo.tsx",
        "title": "按行浏览一万条档案",
        "description": "聚焦列表并按 End 查看最后一条档案，按 Home 回到起点。",
        "learning": {
            "components": [
                "Flex"
            ],
            "props": [
                "aria-label",
                "gap",
                "virtual"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Flex from '@crab-dev/rc-flex';\n\nexport const meta = {\n    title: '按行浏览一万条档案',\n    description: '聚焦列表并按 End 查看最后一条档案，按 Home 回到起点。',\n};\n\nexport default function VirtualListDemo() {\n    return (\n        \u003cFlex\n            aria-label=\"测绘档案\"\n            style={{ height: 216 }}\n            gap={4}\n            virtual={{\n                itemCount: 10_000,\n                itemHeight: 32,\n                getItemKey: index => index + 10001,\n                renderItem: index => \u003cspan>测绘档案 {index + 10001}\u003c/span>,\n            }}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-flex/workbench/?__wake_demo=docs%2Fdemos%2Fvirtual-list.demo.tsx",
        "workbenchPath": "/components/rc-flex/workbench/#/components/docs%2Fdemos%2Fvirtual-list.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "虚拟滚动"
    },
    {
        "id": "docs/demos/virtual-cards.demo.tsx",
        "title": "按容器宽度排列图幅卡片",
        "description": "每张图幅宽 152 像素。缩窄窗口时每行容纳的图幅变少，纵向滚动可继续浏览。",
        "learning": {
            "components": [
                "Flex",
                "Card"
            ],
            "props": [
                "aria-label",
                "gap",
                "virtual",
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "import Card from '@crab-dev/rc-card';\nimport Flex from '@crab-dev/rc-flex';\n\nexport const meta = {\n    title: '按容器宽度排列图幅卡片',\n    description: '每张图幅宽 152 像素。缩窄窗口时每行容纳的图幅变少，纵向滚动可继续浏览。',\n};\n\nexport default function VirtualCardsDemo() {\n    return (\n        \u003cFlex\n            aria-label=\"地形图图幅\"\n            style={{ height: 248 }}\n            gap={8}\n            virtual={{\n                itemCount: 1_001,\n                itemWidth: 152,\n                itemHeight: 64,\n                getItemKey: index => index + 41001,\n                renderItem: index => (\n                    \u003cCard size=\"small\" style={{ height: '100%', boxSizing: 'border-box' }}>\n                        图幅 {index + 41001}\n                    \u003c/Card>\n                ),\n            }}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-flex/workbench/?__wake_demo=docs%2Fdemos%2Fvirtual-cards.demo.tsx",
        "workbenchPath": "/components/rc-flex/workbench/#/components/docs%2Fdemos%2Fvirtual-cards.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "虚拟滚动"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "将一组主题标签放在同一行，或让等高卡片按当前内容区的宽度重新分行。",
        "usage": "为有共同用途的标签设置一致间距，卡片较多时给集合分配明确高度并启用虚拟滚动。",
        "exampleDescription": "缩窄窗口观察卡片列数，再沿纵向滚动读取后续图幅。",
        "demos": [
            "virtual-cards.demo.tsx",
            "wrap.demo.tsx",
            "virtual-list.demo.tsx"
        ],
        "references": [
            "https://developer.android.com/codelabs/adaptive-material-guidance"
        ]
    },
    "macos": {
        "summary": "在桌面窗口或侧栏组织一列档案记录，窗口变化时按可用宽度排列内容。",
        "usage": "在固定高度的浏览区中保持每行记录等高，记录编号和描述应能在紧凑窗口内读全。",
        "exampleDescription": "聚焦档案列表并用 Page Down 翻页，按 End 查看末条编号。",
        "demos": [
            "virtual-list.demo.tsx",
            "virtual-cards.demo.tsx",
            "wrap.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/layout"
        ]
    },
    "shadcn": {
        "summary": "用弹性行组织内容标签，用固定的行列间距区分一组相邻卡片。",
        "usage": "允许宽度不足的标签自然换行。展示大量条目时，用等高单元保持滚动中的排列紧凑。",
        "exampleDescription": "先缩窄标签组查看换行，再在图幅集合中观察最后一行的水平对齐。",
        "demos": [
            "wrap.demo.tsx",
            "virtual-cards.demo.tsx",
            "virtual-list.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components/base/card"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Flex 可以排列和对齐一组子元素。开启虚拟模式后，它会按容器尺寸确定行列数，只为可见行及其附近的条目调用渲染函数。",
    "useWhen": [
        "标签、工具项需要沿同一方向排列，并在宽度不足时自然换行。",
        "滚动区域中有大量等高记录，或有固定宽高、需要随容器重新分行的卡片。"
    ],
    "avoidWhen": [
        "文本行数或媒体加载会改变每项高度时，使用普通布局让浏览器根据内容排版。"
    ],
    "essentials": [
        "普通布局由 children 提供内容，用 wrap、align 和 justify 控制排布。",
        "为虚拟容器提供可测量的宽高，使用非负像素数声明 gap，并将条目内容安排在指定的 itemHeight 内。",
        "getItemKey 返回记录自身的稳定标识。条目移出渲染范围后会卸载，需持续保存的状态由外层管理。"
    ],
    "accessibility": [
        "源码中的阅读顺序应符合用户完成任务的顺序，尤其要核对反向排列时的 Tab 顺序。",
        "为虚拟滚动区域提供可辨识的名称，聚焦后可用方向键逐行滚动或用 Home 和 End 访问首尾。"
    ]
} as const;
