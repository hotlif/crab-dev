/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";
import type { ComponentDesignDocuments } from "../site/componentDesignGuide.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基本用法",
        "description": "默认为非受控模式，提供 total 即可正常使用",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "total"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基本用法\",\n    description: \"默认为非受控模式，提供 total 即可正常使用\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function BasicDemo() {\n    return \u003cPagination total={85} />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "紧凑尺寸",
        "description": "size=\\\"small\\\" 用于表格内联、抽屉底部等高密度场景",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "total",
                "size"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"紧凑尺寸\",\n    description: \"size=\\\\\\\"small\\\\\\\" 用于表格内联、抽屉底部等高密度场景\",\n};\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n`;\n\nexport default function SizeDemo() {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cPagination total={120} size=\"medium\" />\n            \u003cPagination total={120} size=\"small\" />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "disabled 会整体锁定分页器，所有按钮与输入框不可交互",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "defaultValue",
                "total",
                "showQuickJumper",
                "showTotal",
                "disabled"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"disabled 会整体锁定分页器，所有按钮与输入框不可交互\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function DisabledDemo() {\n    return \u003cPagination defaultValue={3} total={100} showQuickJumper showTotal disabled />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础与外观"
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控模式",
        "description": "通过 value 与 onValueChange 完全托管页码状态",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "value",
                "total",
                "pageSize",
                "onValueChange",
                "showTotal"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"受控模式\",\n    description: \"通过 value 与 onValueChange 完全托管页码状态\",\n};\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst DATA = Array.from({ length: 87 }, (_, i) => `记录 #${i + 1}`);\nconst PAGE_SIZE = 8;\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 12px;\n`;\n\nconst listStyle = css`\n    margin: 0;\n    padding-left: 20px;\n`;\n\nexport default function ControlledDemo() {\n    const [current, setCurrent] = useState(1);\n    const items = DATA.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cul className={listStyle}>\n                {items.map((item) => \u003cli key={item}>{item}\u003c/li>)}\n            \u003c/ul>\n            \u003cPagination\n                value={current}\n                total={DATA.length}\n                pageSize={PAGE_SIZE}\n                onValueChange={setCurrent}\n                showTotal\n            />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "页码控制"
    },
    {
        "id": "docs/demos/many-pages.demo.tsx",
        "title": "大量数据",
        "description": "页数超过 7 时自动折叠为首尾 + 中部区间 + 省略号跳转",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "defaultValue",
                "total",
                "pageSize"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"大量数据\",\n    description: \"页数超过 7 时自动折叠为首尾 + 中部区间 + 省略号跳转\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function ManyPagesDemo() {\n    return \u003cPagination defaultValue={23} total={980} pageSize={10} />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fmany-pages.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fmany-pages.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "页码控制"
    },
    {
        "id": "docs/demos/quick-jumper.demo.tsx",
        "title": "快速跳转",
        "description": "开启 showQuickJumper 后，用户可直接输入目标页码并回车跳转",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "value",
                "total",
                "pageSize",
                "onValueChange",
                "showQuickJumper"
            ],
            "events": [
                "onValueChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"快速跳转\",\n    description: \"开启 showQuickJumper 后，用户可直接输入目标页码并回车跳转\",\n};\nimport { useState } from \"react\";\nimport Pagination from \"../../src/index.js\";\n\nexport default function QuickJumperDemo() {\n    const [current, setCurrent] = useState(1);\n    return (\n        \u003cPagination\n            value={current}\n            total={500}\n            pageSize={10}\n            onValueChange={(page) => setCurrent(page)}\n            showQuickJumper\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fquick-jumper.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fquick-jumper.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "页码控制"
    },
    {
        "id": "docs/demos/show-total.demo.tsx",
        "title": "显示总量",
        "description": "showTotal 支持布尔值或自定义渲染函数，展示当前区间与总数",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "defaultValue",
                "total",
                "pageSize",
                "showTotal"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"显示总量\",\n    description: \"showTotal 支持布尔值或自定义渲染函数，展示当前区间与总数\",\n};\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n`;\n\nexport default function ShowTotalDemo() {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cPagination defaultValue={2} total={256} pageSize={20} showTotal />\n            \u003cPagination\n                defaultValue={2}\n                total={256}\n                pageSize={20}\n                showTotal={(total, [from, to]) => `Showing ${from}-${to} of ${total}`}\n            />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fshow-total.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fshow-total.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "页码控制"
    },
    {
        "id": "docs/demos/size-changer.demo.tsx",
        "title": "每页条数选择",
        "description": "传入 showSizeChanger 以显示每页条数下拉；切换时会保持当前首条可见。",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "total",
                "defaultPageSize",
                "showSizeChanger",
                "showTotal",
                "pageSizeOptions"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"每页条数选择\",\n    description: \"传入 showSizeChanger 以显示每页条数下拉；切换时会保持当前首条可见。\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function SizeChangerDemo() {\n    return (\n        \u003cPagination\n            total={500}\n            defaultPageSize={20}\n            showSizeChanger\n            showTotal\n            pageSizeOptions={[10, 20, 50, 100]}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fsize-changer.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fsize-changer.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "页码控制"
    },
    {
        "id": "docs/demos/visual-matrix.demo.tsx",
        "title": "分页导航状态矩阵",
        "description": "真实页码、页大小、快速跳转和空数据，三档尺寸与密度独立。",
        "learning": {
            "components": [
                "Pagination"
            ],
            "props": [
                "aria-label",
                "total",
                "value",
                "onValueChange",
                "pageSize",
                "onPageSizeChange",
                "disabled",
                "showQuickJumper",
                "showSizeChanger",
                "showTotal",
                "pageLabel",
                "prevLabel"
            ],
            "events": [
                "onValueChange",
                "onPageSizeChange"
            ],
            "hasState": true
        },
        "sourceCode": "import { css } from '@crab-dev/css';\nimport Pagination from '@crab-dev/rc-pagination';\nimport { useConfig } from '@crab-dev/rc-config-provider';\nimport token from '@crab-dev/rc-token-semantic';\nimport { useId, useState } from 'react';\n\nexport const meta = { title: '分页导航状态矩阵', description: '真实页码、页大小、快速跳转和空数据，三档尺寸与密度独立。' };\nconst frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;\nexport default function VisualMatrixDemo() {\n    const { locale } = useConfig();\n    const [state, setState] = useState('default');\n    const [value, setValue] = useState(6);\n    const [pageSize, setPageSize] = useState(10);\n    const id = useId();\n    const english = locale === 'en-US';\n    return \u003csection className={frame} aria-label=\"Pagination visual matrix\" data-visual-scene data-state={state}>\n        \u003cdiv>\u003clabel htmlFor={id}>验收状态\u003c/label>{' '}\u003cselect id={id} value={state} onChange={event => setState(event.currentTarget.value)}>\u003coption>default\u003c/option>\u003coption>disabled\u003c/option>\u003coption>empty\u003c/option>\u003c/select>\u003c/div>\n        \u003cPagination aria-label=\"分页验收\" total={state === 'empty' ? 0 : 240} value={value} onValueChange={setValue} pageSize={pageSize} onPageSizeChange={setPageSize} disabled={state === 'disabled'} showQuickJumper showSizeChanger showTotal pageLabel={page => `Page ${page}`} prevLabel=\"Previous page\" nextLabel=\"Next page\" />\n        \u003coutput aria-live=\"polite\">{english ? 'Current page' : '当前页'}: {value}; {english ? 'Rows per page' : '每页条数'}: {pageSize}\u003c/output>\n    \u003c/section>;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fvisual-matrix.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "视觉验收"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const documents = {
    "md3": {
        "summary": "以清晰的当前页和低强调翻页动作组织数据浏览，是项目导航扩展。",
        "usage": "当前页应与可跳转页区分，分页动作不能与表格选择状态混为一谈。",
        "exampleDescription": "切换页面并查看当前页反馈，检查导航动作在色调界面中的层级。",
        "demos": [
            "basic.demo.tsx",
            "controlled.demo.tsx",
            "disabled.demo.tsx",
            "many-pages.demo.tsx",
            "quick-jumper.demo.tsx",
            "show-total.demo.tsx",
            "size-changer.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://m3.material.io/components/buttons/overview",
            "https://material-web.dev/components/button/",
            "https://github.com/material-components/material-web/tree/main/button"
        ]
    },
    "macos": {
        "summary": "以桌面列表底部的紧凑导航组织分页，页码、总量与每页数量保持对齐。",
        "usage": "让页数变化和数据刷新保持一致，翻页后仍保留可预测的操作位置。",
        "exampleDescription": "修改每页数量再翻页，检查紧凑导航中总量和当前页的更新。",
        "demos": [
            "size-changer.demo.tsx",
            "basic.demo.tsx",
            "controlled.demo.tsx",
            "disabled.demo.tsx",
            "many-pages.demo.tsx",
            "quick-jumper.demo.tsx",
            "show-total.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://developer.apple.com/design/human-interface-guidelines/components",
            "https://developer.apple.com/design/human-interface-guidelines/accessibility"
        ]
    },
    "shadcn": {
        "summary": "用中性页码、细边界与简洁前后导航提供分页，适合数据管理界面。",
        "usage": "页数很多时使用省略与快捷跳转，同时保留当前位置和总量信息。",
        "exampleDescription": "浏览较多页码，检查省略项、当前页与可用翻页动作的区别。",
        "demos": [
            "many-pages.demo.tsx",
            "basic.demo.tsx",
            "controlled.demo.tsx",
            "disabled.demo.tsx",
            "quick-jumper.demo.tsx",
            "show-total.demo.tsx",
            "size-changer.demo.tsx",
            "size.demo.tsx"
        ],
        "references": [
            "https://ui.shadcn.com/docs/components",
            "https://ui.shadcn.com/docs/theming",
            "https://github.com/shadcn-ui/ui/tree/3d98900e9b73c45f035f8109e9d41ba6a51685e7/apps/v4/registry/new-york-v4"
        ]
    }
} as const satisfies ComponentDesignDocuments;

export const guide = {
    "definition": "Pagination 把大量结果分成可导航的页面，并可显示总数、快速跳转和每页数量。它控制当前页信息，不负责请求数据本身。",
    "useWhen": [
        "用户需要在较大的结果集中稳定定位页码。",
        "服务器分页或业务要求明确的页数和每页条数。"
    ],
    "avoidWhen": [
        "连续浏览内容可使用加载更多或虚拟滚动；结果很少时不要增加分页控制。"
    ],
    "essentials": [
        "current、pageSize 与 total 共同决定合法页码。",
        "改变 pageSize 后要重新计算 current，避免落到不存在的页。",
        "请求中的页码状态、加载和错误由业务层管理。"
    ],
    "accessibility": [
        "分页区域使用有名称的导航语义，当前页标记 aria-current。",
        "上一页、下一页、页码和跳转输入都有明确名称，禁用状态不能只变淡。"
    ]
} as const;
