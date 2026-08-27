/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentApiRecord } from "../site/componentApi.js";
import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basic.demo.tsx",
        "title": "基本用法",
        "description": "默认为非受控模式，提供 total 即可正常使用",
        "sourceCode": "export const meta = {\n    title: \"基本用法\",\n    description: \"默认为非受控模式，提供 total 即可正常使用\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function BasicDemo() {\n    return \u003cPagination total={85} />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/controlled.demo.tsx",
        "title": "受控模式",
        "description": "通过 current 与 onChange 完全托管页码状态",
        "sourceCode": "export const meta = {\n    title: \"受控模式\",\n    description: \"通过 current 与 onChange 完全托管页码状态\",\n};\nimport { useState } from \"react\";\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst DATA = Array.from({ length: 87 }, (_, i) => `记录 #${i + 1}`);\nconst PAGE_SIZE = 8;\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 12px;\n`;\n\nconst listStyle = css`\n    margin: 0;\n    padding-left: 20px;\n`;\n\nexport default function ControlledDemo() {\n    const [current, setCurrent] = useState(1);\n    const items = DATA.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);\n\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cul className={listStyle}>\n                {items.map((item) => \u003cli key={item}>{item}\u003c/li>)}\n            \u003c/ul>\n            \u003cPagination\n                current={current}\n                total={DATA.length}\n                pageSize={PAGE_SIZE}\n                onChange={setCurrent}\n                showTotal\n            />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fcontrolled.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fcontrolled.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/disabled.demo.tsx",
        "title": "禁用状态",
        "description": "disabled 会整体锁定分页器，所有按钮与输入框不可交互",
        "sourceCode": "export const meta = {\n    title: \"禁用状态\",\n    description: \"disabled 会整体锁定分页器，所有按钮与输入框不可交互\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function DisabledDemo() {\n    return \u003cPagination defaultCurrent={3} total={100} showQuickJumper showTotal disabled />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fdisabled.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fdisabled.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/many-pages.demo.tsx",
        "title": "大量数据",
        "description": "页数超过 7 时自动折叠为首尾 + 中部区间 + 省略号跳转",
        "sourceCode": "export const meta = {\n    title: \"大量数据\",\n    description: \"页数超过 7 时自动折叠为首尾 + 中部区间 + 省略号跳转\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function ManyPagesDemo() {\n    return \u003cPagination defaultCurrent={23} total={980} pageSize={10} />;\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fmany-pages.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fmany-pages.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/quick-jumper.demo.tsx",
        "title": "快速跳转",
        "description": "开启 showQuickJumper 后，用户可直接输入目标页码并回车跳转",
        "sourceCode": "export const meta = {\n    title: \"快速跳转\",\n    description: \"开启 showQuickJumper 后，用户可直接输入目标页码并回车跳转\",\n};\nimport { useState } from \"react\";\nimport Pagination from \"../../src/index.js\";\n\nexport default function QuickJumperDemo() {\n    const [current, setCurrent] = useState(1);\n    return (\n        \u003cPagination\n            current={current}\n            total={500}\n            pageSize={10}\n            onChange={(page) => setCurrent(page)}\n            showQuickJumper\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fquick-jumper.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fquick-jumper.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/show-total.demo.tsx",
        "title": "显示总量",
        "description": "showTotal 支持布尔值或自定义渲染函数，展示当前区间与总数",
        "sourceCode": "export const meta = {\n    title: \"显示总量\",\n    description: \"showTotal 支持布尔值或自定义渲染函数，展示当前区间与总数\",\n};\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n`;\n\nexport default function ShowTotalDemo() {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cPagination defaultCurrent={2} total={256} pageSize={20} showTotal />\n            \u003cPagination\n                defaultCurrent={2}\n                total={256}\n                pageSize={20}\n                showTotal={(total, [from, to]) => `Showing ${from}-${to} of ${total}`}\n            />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fshow-total.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fshow-total.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/size-changer.demo.tsx",
        "title": "每页条数选择",
        "description": "传入 showSizeChanger 以显示每页条数下拉；切换时会保持当前首条可见。",
        "sourceCode": "export const meta = {\n    title: \"每页条数选择\",\n    description: \"传入 showSizeChanger 以显示每页条数下拉；切换时会保持当前首条可见。\",\n};\nimport Pagination from \"../../src/index.js\";\n\nexport default function SizeChangerDemo() {\n    return (\n        \u003cPagination\n            total={500}\n            defaultPageSize={20}\n            showSizeChanger\n            showTotal\n            pageSizeOptions={[10, 20, 50, 100]}\n        />\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fsize-changer.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fsize-changer.demo.tsx",
        "density": "regular"
    },
    {
        "id": "docs/demos/size.demo.tsx",
        "title": "紧凑尺寸",
        "description": "size=\\\"small\\\" 用于表格内联、抽屉底部等高密度场景",
        "sourceCode": "export const meta = {\n    title: \"紧凑尺寸\",\n    description: \"size=\\\\\\\"small\\\\\\\" 用于表格内联、抽屉底部等高密度场景\",\n};\nimport { css } from \"@crab-dev/css\";\nimport Pagination from \"../../src/index.js\";\n\nconst stackStyle = css`\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n`;\n\nexport default function SizeDemo() {\n    return (\n        \u003cdiv className={stackStyle}>\n            \u003cPagination total={120} size=\"medium\" />\n            \u003cPagination total={120} size=\"small\" />\n        \u003c/div>\n    );\n}\n",
        "previewPath": "/components/rc-pagination/workbench/?__wake_demo=docs%2Fdemos%2Fsize.demo.tsx",
        "workbenchPath": "/components/rc-pagination/workbench/#/components/docs%2Fdemos%2Fsize.demo.tsx",
        "density": "regular"
    }
] as const satisfies readonly ComponentDemoRecord[];

export const api = {
    "component": "Pagination",
    "symbol": "PaginationProps",
    "props": [
        {
            "name": "current",
            "required": false,
            "description": "当前页（受控）",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "defaultCurrent",
            "required": false,
            "description": "默认当前页（非受控）",
            "typeText": "number",
            "defaultValue": "1",
            "deprecated": false
        },
        {
            "name": "defaultPageSize",
            "required": false,
            "description": "默认每页条数（非受控）",
            "typeText": "number",
            "defaultValue": "10",
            "deprecated": false
        },
        {
            "name": "disabled",
            "required": false,
            "description": "是否禁用整个分页器",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "nextLabel",
            "required": false,
            "description": "下一页 aria-label",
            "typeText": "string",
            "defaultValue": "\"Next page\"",
            "deprecated": false
        },
        {
            "name": "onChange",
            "required": false,
            "description": "页码变更回调",
            "typeText": "PaginationChangeHandler",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "onShowSizeChange",
            "required": false,
            "description": "每页条数变更回调（下拉切换时触发；同时会触发 `onChange`）",
            "typeText": "(current: number, pageSize: number) => void",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "pageLabel",
            "required": false,
            "description": "页码按钮 aria-label 生成器",
            "typeText": "(page: number) => string",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "pageSize",
            "required": false,
            "description": "每页条数（受控）",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "pageSizeLabel",
            "required": false,
            "description": "每页条数下拉项的文本格式化（默认 `${n} / 页`）",
            "typeText": "(pageSize: number) => ReactNode",
            "defaultValue": null,
            "deprecated": false
        },
        {
            "name": "pageSizeOptions",
            "required": false,
            "description": "每页条数下拉选项",
            "typeText": "number[]",
            "defaultValue": "[10, 20, 50, 100]",
            "deprecated": false
        },
        {
            "name": "prevLabel",
            "required": false,
            "description": "上一页 aria-label",
            "typeText": "string",
            "defaultValue": "\"Previous page\"",
            "deprecated": false
        },
        {
            "name": "showQuickJumper",
            "required": false,
            "description": "是否显示快速跳转到指定页",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "showSizeChanger",
            "required": false,
            "description": "是否显示每页条数下拉选择器",
            "typeText": "boolean",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "showTotal",
            "required": false,
            "description": "是否显示数据总量。传入函数则可自定义渲染。",
            "typeText": "boolean | PaginationShowTotal",
            "defaultValue": "false",
            "deprecated": false
        },
        {
            "name": "size",
            "required": false,
            "description": "尺寸阶梯",
            "typeText": "PaginationSize",
            "defaultValue": "\"medium\"",
            "deprecated": false
        },
        {
            "name": "total",
            "required": true,
            "description": "数据总条数",
            "typeText": "number",
            "defaultValue": null,
            "deprecated": false
        }
    ]
} as const satisfies ComponentApiRecord | null;
