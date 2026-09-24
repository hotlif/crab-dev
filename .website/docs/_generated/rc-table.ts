/**
 * THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
 */

import type { ComponentDemoRecord } from "../site/componentDemos.js";

export const demos = [
    {
        "id": "docs/demos/basis.demo.tsx",
        "title": "基础表格 · 企业采购订单",
        "description": "3,000 笔采购订单、24 列，覆盖客户、商品、折扣、收款、仓储和交付信息，订单金额与收款状态相互关联。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"基础表格 · 企业采购订单\",\n    description: \"3,000 笔采购订单、24 列，覆盖客户、商品、折扣、收款、仓储和交付信息，订单金额与收款状态相互关联。\",\n};\nimport Table from \"../../src/index.js\";\nimport { makeOrders } from \"./_mock.js\";\nimport { DemoFrame, orderColumns } from \"./_shared.js\";\nconst rows = makeOrders();\nconst columns = orderColumns();\nexport default function BasisDemo() {\n    return \u003cDemoFrame title=\"企业采购订单台账\" rows={rows.length} columns={columns.length}\n        hint=\"左右滚动查看收款、物流和配送备注；订单号固定，便于核对同一笔订单。空白物流单号表示尚未发货。\">\n        {(width, height) => \u003cTable aria-label=\"企业采购订单台账\" width={width} height={height} rows={rows} columns={columns} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fbasis.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fbasis.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础、汇总与性能"
    },
    {
        "id": "docs/demos/empty.demo.tsx",
        "title": "空状态 · 查询无匹配订单",
        "description": "3,000 笔订单、24 列，演示真实查询产生的空结果，清空关键字可恢复全部数据。",
        "learning": {
            "components": [
                "LineEdit",
                "Button",
                "Table"
            ],
            "props": [
                "aria-label",
                "value",
                "onChange",
                "disabled",
                "onClick",
                "width",
                "height",
                "rows",
                "columns",
                "empty"
            ],
            "events": [
                "onChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"空状态 · 查询无匹配订单\",\n    description: \"3,000 笔订单、24 列，演示真实查询产生的空结果，清空关键字可恢复全部数据。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Table from \"../../src/index.js\";\nimport { makeOrders } from \"./_mock.js\";\nimport { DemoFrame, orderColumns } from \"./_shared.js\";\nconst allRows = makeOrders();\nconst columns = orderColumns();\nexport default function EmptyDemo() {\n    const [query, setQuery] = useState(\"SO-2026-999999\");\n    const rows = allRows.filter(row => (row.dataRef.orderNo + row.dataRef.customer).toLowerCase().includes(query.trim().toLowerCase()));\n    return \u003cDemoFrame title=\"订单检索\" rows={rows.length} columns={columns.length}\n        hint=\"初始关键字没有匹配结果；清空后恢复 3,000 笔订单，列结构保持稳定。\"\n        toolbar={\u003c>\u003cLineEdit aria-label=\"订单号或客户名称\" value={query} onChange={event => setQuery(event.target.value)} />\n            \u003cButton disabled={!query} onClick={() => setQuery(\"\")}>清空查询\u003c/Button>\u003c/>}>\n        {(width, height) => \u003cTable aria-label=\"订单查询结果\" width={width} height={height} rows={rows} columns={columns}\n            empty={\u003cdiv>未找到订单号或客户名称包含“{query}”的记录。请核对关键字。\u003c/div>} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fempty.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fempty.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础、汇总与性能"
    },
    {
        "id": "docs/demos/highlight.demo.tsx",
        "title": "关键字高亮 · 员工资料查找",
        "description": "2,000 名员工、22 列，定位姓名、部门、项目、邮箱及格式化金额，支持上一个/下一个匹配。",
        "learning": {
            "components": [
                "LineEdit",
                "Button",
                "Table"
            ],
            "props": [
                "aria-label",
                "value",
                "placeholder",
                "onChange",
                "onKeyDown",
                "disabled",
                "onClick",
                "width",
                "height",
                "rows",
                "columns",
                "highlightKeyword"
            ],
            "events": [
                "onChange",
                "onKeyDown",
                "onClick",
                "onMatchCountChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"关键字高亮 · 员工资料查找\",\n    description: \"2,000 名员工、22 列，定位姓名、部门、项目、邮箱及格式化金额，支持上一个/下一个匹配。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Table, { highlightText } from \"../../src/index.js\";\nimport { employeeRows, money } from \"./_mock.js\";\nimport { DemoFrame, employeeColumns, noteStyle, numericCellStyle } from \"./_shared.js\";\nconst rows = employeeRows();\nconst columns = employeeColumns().map(col => {\n    if (col.name === \"$.totalComp\") return {\n        ...col, getSearchText: (row: typeof rows[number]) => money(row.dataRef.totalComp),\n        render: ({ row, keyword, activeOccurrenceInCell }: {\n            row: typeof rows[number]; keyword?: string; activeOccurrenceInCell?: number;\n        }) => \u003cspan className={numericCellStyle}>{highlightText(money(row.dataRef.totalComp), keyword ?? \"\", activeOccurrenceInCell)}\u003c/span>,\n    };\n    // 自定义展示也复用原始高亮节点，使匹配数和可见内容一致。\n    return { ...col, render: undefined };\n});\nexport default function HighlightDemo() {\n    const [keyword, setKeyword] = useState(\"研发\");\n    const [active, setActive] = useState(0);\n    const [count, setCount] = useState(0);\n    const canNavigate = Boolean(keyword.trim()) && count > 0;\n    const navigate = (step: number) => {\n        if (canNavigate) setActive(index => (index + step + count) % count);\n    };\n    return \u003cDemoFrame title=\"员工资料全文查找\" rows={rows.length} columns={columns.length}\n        hint=\"查找「研发」「杭州」或邮箱。Enter 下一个，Shift+Enter 上一个；定位时自动滚动到目标行列。\"\n        toolbar={\u003c>\u003cLineEdit aria-label=\"查找员工资料\" value={keyword} placeholder=\"姓名、部门、城市、项目\"\n            onChange={event => { setKeyword(event.target.value); setActive(0); }}\n            onKeyDown={event => { if (event.key === \"Enter\") { event.preventDefault(); navigate(event.shiftKey ? -1 : 1); } }} />\n        \u003cButton disabled={!canNavigate} onClick={() => navigate(-1)}>上一个\u003c/Button>\n        \u003cButton disabled={!canNavigate} onClick={() => navigate(1)}>下一个\u003c/Button>\n        \u003cspan className={noteStyle} role=\"status\">{canNavigate ? Math.min(active + 1, count) + \" / \" + count : \"无匹配\"}\u003c/span>\u003c/>}>\n        {(width, height) => \u003cTable aria-label=\"可查找定位的员工资料\" width={width} height={height} rows={rows} columns={columns}\n            highlightKeyword={keyword.trim()} activeMatchIndex={canNavigate ? Math.min(active, count - 1) : undefined} onMatchCountChange={setCount} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fhighlight.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fhighlight.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础、汇总与性能"
    },
    {
        "id": "docs/demos/summary.demo.tsx",
        "title": "底部汇总 · 项目预算执行",
        "description": "1,200 条预算、23 列，部门筛选后合计 12 个月预算、全年预算、实支与剩余额度，使用率按汇总金额计算。",
        "learning": {
            "components": [
                "Select",
                "Table"
            ],
            "props": [
                "aria-label",
                "placeholder",
                "value",
                "allowClear",
                "options",
                "onChange",
                "width",
                "height",
                "rows",
                "columns",
                "showSummary"
            ],
            "events": [
                "onChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"底部汇总 · 项目预算执行\",\n    description: \"1,200 条预算、23 列，部门筛选后合计 12 个月预算、全年预算、实支与剩余额度，使用率按汇总金额计算。\",\n};\nimport { useState } from \"react\";\nimport Select from \"@crab-dev/rc-select\";\nimport Table from \"../../src/index.js\";\nimport { departments, makeBudgets, money } from \"./_mock.js\";\nimport { DemoFrame, budgetColumns, noteStyle } from \"./_shared.js\";\nconst allRows = makeBudgets();\nexport default function SummaryDemo() {\n    const [department, setDepartment] = useState(\"\");\n    const rows = allRows.filter(row => !department || row.dataRef.department === department);\n    const sum = (pick: (row: typeof rows[number]) => number) => rows.reduce((total, row) => total + pick(row), 0);\n    const planned = sum(row => row.dataRef.planned);\n    const actual = sum(row => row.dataRef.actual);\n    const columns = budgetColumns().map(col => ({\n        ...col,\n        summaryRender: () => {\n            const month = /^\\$\\.monthly\\[(\\d+)\\]$/.exec(col.name);\n            if (month) return money(sum(row => row.dataRef.monthly[Number(month[1])]));\n            if (col.name === \"$.code\") return \"当前筛选合计\";\n            if (col.name === \"$.project\") return rows.length + \" 条预算\";\n            if (col.name === \"$.planned\") return money(planned);\n            if (col.name === \"$.actual\") return money(actual);\n            if (col.name === \"$.remaining\") return money(planned - actual);\n            if (col.name === \"$.execution\") return planned ? (actual / planned * 100).toFixed(1) + \"%\" : \"—\";\n            return null;\n        },\n    }));\n    return \u003cDemoFrame title=\"项目预算执行汇总\" rows={rows.length} columns={columns.length}\n        hint=\"筛选部门后，底部汇总随当前结果更新。整体使用率＝实支合计÷全年预算合计。\"\n        toolbar={\u003cSelect aria-label=\"筛选预算部门\" placeholder=\"全部部门\" value={department || undefined} allowClear\n            options={departments.map(item => ({ label: item.name, value: item.name }))}\n            onChange={value => setDepartment(value ?? \"\")} />}\n        footer={\u003cp className={noteStyle}>全年预算 {money(planned)} · 截至8月实支 {money(actual)}\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"项目预算执行与合计\" width={width} height={height} rows={rows} columns={columns} showSummary />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fsummary.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fsummary.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础、汇总与性能"
    },
    {
        "id": "docs/demos/largeScale.demo.tsx",
        "title": "大规模数据 · 连锁门店日经营报表",
        "description": "1,000 家门店 × 1,000 列：4 个门店字段与 249 天的订单数、件数、销售额、退款单数，共 100 万单元格。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"大规模数据 · 连锁门店日经营报表\",\n    description: \"1,000 家门店 × 1,000 列：4 个门店字段与 249 天的订单数、件数、销售额、退款单数，共 100 万单元格。\",\n};\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { dateAfter, money } from \"./_mock.js\";\nimport { makeStoreReport, STORE_DAYS, STORE_COLUMNS, type StoreRow } from \"./_scenarios.js\";\nimport { DemoFrame, field, numericCellStyle } from \"./_shared.js\";\nconst rows = makeStoreReport();\nconst metrics = [\n    { key: \"orders\", title: \"订单数\" }, { key: \"units\", title: \"销售件数\" },\n    { key: \"revenue\", title: \"销售额\" }, { key: \"returns\", title: \"退款单数\" },\n] as const;\nconst columns: ColumnType\u003cStoreRow>[] = [\n    { ...field\u003cStoreRow>(\"storeCode\", \"门店编码\", 140), fixed: \"left\" },\n    field(\"storeName\", \"门店名称\", 190), field(\"region\", \"大区\", 100), field(\"city\", \"城市\", 100),\n    ...Array.from({ length: STORE_DAYS }, (_, day) => ({\n        name: \"day-\" + day, title: dateAfter(\"2026-01-01\", day),\n        children: metrics.map(metric => ({\n            name: \"$.daily[\" + day + \"].\" + metric.key, title: metric.title, width: metric.key === \"revenue\" ? 150 : 110,\n            align: \"right\" as const,\n            ...(metric.key === \"revenue\" ? { render: ({ row }: { row: StoreRow }) => \u003cspan className={numericCellStyle}>{money(row.dataRef.daily[day].revenue)}\u003c/span> } : {}),\n        })),\n    })),\n];\nexport default function LargeScaleDemo() {\n    return \u003cDemoFrame title=\"连锁门店日经营报表\" rows={rows.length} columns={STORE_COLUMNS}\n        hint=\"2026-01-01 至 2026-09-06，每天 4 项经营指标。周末客流有波动，退款单数不超过订单数；横向滚动跨日期，纵向滚动跨门店。\">\n        {(width, height) => \u003cTable aria-label=\"千店千列日经营报表\" width={width} height={height} rows={rows} columns={columns} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FlargeScale.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FlargeScale.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "基础、汇总与性能"
    },
    {
        "id": "docs/demos/columnDrag.demo.tsx",
        "title": "列顺序调整 · 人员信息工作台",
        "description": "2,000 名员工、22 列；岗位、区域、合同与薪酬分组可整体拖动，组内字段也可重排。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "draggableColumns",
                "onColumnOrderChange",
                "onGroupColumnOrderChange"
            ],
            "events": [
                "onClick",
                "onColumnOrderChange",
                "onGroupColumnOrderChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"列顺序调整 · 人员信息工作台\",\n    description: \"2,000 名员工、22 列；岗位、区域、合同与薪酬分组可整体拖动，组内字段也可重排。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { employeeRows, type EmployeeRow } from \"./_mock.js\";\nimport { DemoFrame, employeeColumns, noteStyle } from \"./_shared.js\";\nconst rows = employeeRows();\nconst leaf = employeeColumns();\nconst initialColumns: ColumnType\u003cEmployeeRow>[] = [\n    leaf[0], leaf[1],\n    { name: \"work\", title: \"岗位与组织\", children: leaf.slice(2, 7) },\n    { name: \"location\", title: \"办公与联系\", children: leaf.slice(7, 12) },\n    { name: \"contract\", title: \"合同与项目\", children: leaf.slice(12, 17) },\n    { name: \"compensation\", title: \"年度薪酬\", children: leaf.slice(17, 21) },\n    leaf[21],\n];\nexport default function ColumnDragDemo() {\n    const [columns, setColumns] = useState(initialColumns);\n    return \u003cDemoFrame title=\"人员信息工作台\" rows={rows.length} columns={leaf.length}\n        hint=\"拖拽分组表头整体移动，组内子列可单独排序；工号固定，恢复按钮可还原布局。\"\n        toolbar={\u003cButton onClick={() => setColumns(initialColumns)}>恢复默认列顺序\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">当前布局：{columns.map(col => col.title).join(\" → \")}\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"可调整列顺序的人员信息\" width={width} height={height} rows={rows} columns={columns} draggableColumns\n            onColumnOrderChange={names => setColumns(previous => {\n                const byName = new Map(previous.map(col => [col.name, col]));\n                const ordered = names.flatMap(name => { const col = byName.get(name); return col ? [col] : []; });\n                let index = 0;\n                return previous.map(col => col.fixed ? col : ordered[index++] ?? col);\n            })}\n            onGroupColumnOrderChange={(name, names) => setColumns(previous => previous.map(col => {\n                if (col.name !== name || !col.children) return col;\n                const children = col.children;\n                return { ...col, children: names.flatMap(childName => children.filter(child => child.name === childName)) };\n            }))} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FcolumnDrag.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FcolumnDrag.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "列与表头"
    },
    {
        "id": "docs/demos/columnResize.demo.tsx",
        "title": "列宽调整 · 仓库库存台账",
        "description": "2,000 条库存、23 列，拖宽商品名称、批次和备注列，核对长名称与仓位信息。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "resizable",
                "onColumnResize"
            ],
            "events": [
                "onClick",
                "onColumnResize"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"列宽调整 · 仓库库存台账\",\n    description: \"2,000 条库存、23 列，拖宽商品名称、批次和备注列，核对长名称与仓位信息。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport { makeInventory } from \"./_mock.js\";\nimport { DemoFrame, inventoryColumns, noteStyle } from \"./_shared.js\";\nconst rows = makeInventory();\nconst initialColumns = inventoryColumns().map(col => ({ ...col, resizable: col.name !== \"$.recordNo\" }));\nexport default function ColumnResizeDemo() {\n    const [columns, setColumns] = useState(initialColumns);\n    const [feedback, setFeedback] = useState(\"\");\n    return \u003cDemoFrame title=\"仓库库存台账\" rows={rows.length} columns={columns.length}\n        hint=\"拖拽列头右边缘调整宽度；记录号保持固定宽度。恢复按钮可还原初始布局。\"\n        toolbar={\u003cButton onClick={() => { setColumns(initialColumns); setFeedback(\"已恢复默认列宽\"); }}>恢复默认列宽\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">{feedback}\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"可调整列宽的库存台账\" width={width} height={height} rows={rows} columns={columns} resizable\n            onColumnResize={(name, nextWidth) => {\n                setColumns(previous => previous.map(col => col.name === name ? { ...col, width: nextWidth } : col));\n                setFeedback((columns.find(col => col.name === name)?.title ?? name) + \"：\" + Math.round(nextWidth) + \" px\");\n            }} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FcolumnResize.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FcolumnResize.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "列与表头"
    },
    {
        "id": "docs/demos/filter.demo.tsx",
        "title": "过滤栏 · 销售订单查询",
        "description": "3,000 笔订单、24 列；文本、枚举与金额条件组合筛选，支持清空条件和无结果反馈。",
        "learning": {
            "components": [
                "Select",
                "Button",
                "Table",
                "LineEdit"
            ],
            "props": [
                "size",
                "aria-label",
                "value",
                "allowClear",
                "placeholder",
                "options",
                "onChange",
                "disabled",
                "onClick",
                "width",
                "height",
                "rows"
            ],
            "events": [
                "onChange",
                "onClick",
                "onFilterChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"过滤栏 · 销售订单查询\",\n    description: \"3,000 笔订单、24 列；文本、枚举与金额条件组合筛选，支持清空条件和无结果反馈。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport Select from \"@crab-dev/rc-select\";\nimport Table from \"../../src/index.js\";\nimport { makeOrders } from \"./_mock.js\";\nimport { filterOrders } from \"./_operations.js\";\nimport { DemoFrame, orderColumns, fieldStyle, noteStyle } from \"./_shared.js\";\nconst allRows = makeOrders();\nconst options: Record\u003cstring, string[]> = {\n    \"$.region\": [\"华北\", \"华东\", \"华南\", \"西南\", \"华中\", \"西北\"],\n    \"$.status\": [\"待审核\", \"待发货\", \"运输中\", \"已完成\", \"已取消\"],\n    \"$.paymentStatus\": [\"未收款\", \"部分收款\", \"已结清\", \"已关闭\"],\n};\nconst columns = orderColumns().map(column => ({\n    ...column, filterable: ![\"$.discount\", \"$.remark\"].includes(column.name),\n    ...(options[column.name] ? {\n        filterEditor: ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) =>\n            \u003cSelect className={fieldStyle} size=\"small\" aria-label={\"筛选\" + column.title} value={value || undefined} allowClear\n                placeholder=\"全部\" options={options[column.name].map(item => ({ label: item, value: item }))}\n                onChange={next => onValueChange(next ?? \"\")} />,\n    } : {}),\n}));\nexport default function FilterDemo() {\n    const [filters, setFilters] = useState\u003cRecord\u003cstring, string>>({});\n    const rows = filterOrders(allRows, filters);\n    return \u003cDemoFrame title=\"销售订单查询\" rows={rows.length} columns={columns.length}\n        hint=\"所有条件同时生效。文本支持部分匹配；金额/数量支持 >=10000、1000-5000 或精确数值，非法表达式无匹配。\"\n        toolbar={\u003cButton disabled={!Object.values(filters).some(Boolean)} onClick={() => setFilters({})}>清空筛选\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">匹配 {rows.length} / {allRows.length} 笔订单\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"可组合筛选的销售订单\" width={width} height={height} rows={rows} columns={columns}\n            filterBar filters={filters} onFilterChange={setFilters}\n            renderDefaultFilterEditor={({ column, value, onValueChange }) =>\n                \u003cLineEdit size=\"small\" className={fieldStyle} aria-label={\"筛选\" + column.title}\n                    placeholder=\"输入条件\" value={value} onChange={event => onValueChange(event.target.value)} />}\n            empty={\u003cdiv>没有符合全部条件的订单，请调整条件或清空筛选。\u003c/div>} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Ffilter.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Ffilter.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "列与表头"
    },
    {
        "id": "docs/demos/mergeTableHeaders.demo.tsx",
        "title": "多级表头 · 年度项目预算",
        "description": "1,200 条预算明细、23 个叶子列；按季度组织 12 个月的预算，并核对全年预算与实际支出。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"多级表头 · 年度项目预算\",\n    description: \"1,200 条预算明细、23 个叶子列；按季度组织 12 个月的预算，并核对全年预算与实际支出。\",\n};\nimport type { ColumnType } from \"../../src/types.js\";\nimport Table from \"../../src/index.js\";\nimport { makeBudgets, type BudgetRow } from \"./_mock.js\";\nimport { DemoFrame, budgetColumns } from \"./_shared.js\";\nconst rows = makeBudgets();\nconst leafColumns = budgetColumns();\nconst columns: ColumnType\u003cBudgetRow>[] = [\n    leafColumns[0],\n    { name: \"project-info\", title: \"项目归属\", children: leafColumns.slice(1, 6) },\n    ...Array.from({ length: 4 }, (_, quarter) => ({\n        name: \"quarter-\" + quarter, title: \"第\" + (quarter + 1) + \"季度预算\",\n        children: leafColumns.slice(6 + quarter * 3, 9 + quarter * 3),\n    })),\n    { name: \"execution\", title: \"执行情况（实支截至8月）\", children: leafColumns.slice(18) },\n];\nexport default function MergeTableHeadersDemo() {\n    return \u003cDemoFrame title=\"2026 年项目预算明细\" rows={rows.length} columns={leafColumns.length}\n        hint=\"全年预算来自 12 个月预算之和；剩余额度可以为负，超预算记录同时提供状态文字。\">\n        {(width, height) => \u003cTable aria-label=\"按季度分组表头的年度预算\" width={width} height={height} rows={rows} columns={columns} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FmergeTableHeaders.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FmergeTableHeaders.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "列与表头"
    },
    {
        "id": "docs/demos/sort.demo.tsx",
        "title": "列排序 · 人员薪酬核对",
        "description": "2,000 名员工、22 列；按部门、绩效、入职日期和年度总薪酬排序，Shift 追加多列排序。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "sortColumns",
                "onSortColumnsChange"
            ],
            "events": [
                "onSortColumnsChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"列排序 · 人员薪酬核对\",\n    description: \"2,000 名员工、22 列；按部门、绩效、入职日期和年度总薪酬排序，Shift 追加多列排序。\",\n};\nimport { useState } from \"react\";\nimport type { SortColumn } from \"../../src/types.js\";\nimport Table from \"../../src/index.js\";\nimport { employeeRows } from \"./_mock.js\";\nimport { DemoFrame, employeeColumns, noteStyle } from \"./_shared.js\";\nconst rows = employeeRows();\nconst performanceOrder = [\"S\", \"A\", \"B\", \"C\", \"待评估\"];\nconst columns = employeeColumns().map(column => ({\n    ...column, sortable: true,\n    ...(column.name === \"$.performance\" ? {\n        sorter: (a: typeof rows[number], b: typeof rows[number]) =>\n            performanceOrder.indexOf(a.dataRef.performance) - performanceOrder.indexOf(b.dataRef.performance),\n    } : {}),\n}));\nexport default function SortDemo() {\n    const [sortColumns, setSortColumns] = useState\u003cSortColumn[]>([{ columnName: \"$.totalComp\", direction: \"desc\" }]);\n    return \u003cDemoFrame title=\"年度人员薪酬核对\" rows={rows.length} columns={columns.length}\n        hint=\"默认按年度总薪酬降序；点击列头切换排序，Shift+点击追加条件。年度总薪酬＝月基本工资×12＋年度奖金＋年度股权折算。\"\n        footer={\u003cp className={noteStyle} role=\"status\">当前排序：{sortColumns.map(sort =>\n            columns.find(col => col.name === sort.columnName)?.title + (sort.direction === \"asc\" ? \" 升序\" : \" 降序\")).join(\" → \") || \"原始顺序\"}\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"年度人员薪酬核对\" width={width} height={height} rows={rows} columns={columns}\n            sortColumns={sortColumns} onSortColumnsChange={setSortColumns} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fsort.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fsort.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "列与表头"
    },
    {
        "id": "docs/demos/dynamicRowHeight.demo.tsx",
        "title": "动态行高 · 售后工单台账",
        "description": "1,500 张工单、18 列，长短不同的处理记录对应不同行高，同时展示客户、SLA 和处理结果。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "getRowHeight"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"动态行高 · 售后工单台账\",\n    description: \"1,500 张工单、18 列，长短不同的处理记录对应不同行高，同时展示客户、SLA 和处理结果。\",\n};\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { makeTickets, type TicketRow } from \"./_scenarios.js\";\nimport { DemoFrame, field, proseCellStyle, Status } from \"./_shared.js\";\nconst rows = makeTickets();\nconst columns: ColumnType\u003cTicketRow>[] = [\n    { ...field\u003cTicketRow>(\"ticketNo\", \"工单号\", 170), fixed: \"left\" },\n    field(\"title\", \"问题标题\", 240),\n    { ...field\u003cTicketRow>(\"description\", \"处理记录\", 460), render: ({ row }) => \u003cdiv className={proseCellStyle}>{row.dataRef.description}\u003c/div> },\n    field(\"customer\", \"客户\", 280), field(\"orderNo\", \"关联订单\", 190), field(\"product\", \"商品\", 310),\n    field(\"category\", \"工单类别\"), field(\"priority\", \"优先级\", 100), field(\"owner\", \"处理人\", 110),\n    field(\"team\", \"处理团队\", 180), field(\"city\", \"城市\", 100), field(\"channel\", \"来源\", 140),\n    { ...field\u003cTicketRow>(\"status\", \"处理状态\"), render: ({ row }) => \u003cStatus value={row.dataRef.status} /> },\n    field(\"created\", \"创建日期\"), field(\"due\", \"约定响应日\"), field(\"resolved\", \"完成日期\"),\n    field(\"elapsed\", \"处理时长（小时）\", 160), field(\"satisfaction\", \"客户评价\", 120),\n];\nexport default function DynamicRowHeightDemo() {\n    return \u003cDemoFrame title=\"售后服务工单台账\" rows={rows.length} columns={columns.length}\n        hint=\"长处理记录保留分行，行高随记录篇幅增加。未完成工单的完成日期为空；未评价与一般评价均保留。\">\n        {(width, height) => \u003cTable aria-label=\"不同行高的售后工单\" width={width} height={height} rows={rows} columns={columns}\n            getRowHeight={row => row.height} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FdynamicRowHeight.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FdynamicRowHeight.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/mergeCells.demo.tsx",
        "title": "合并单元格 · 区域销售台账",
        "description": "3,000 笔订单、24 列，按大区、城市和客户经理排序后合并连续归属信息。",
        "learning": {
            "components": [
                "Table"
            ],
            "props": [
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "mergeCells"
            ],
            "events": [],
            "hasState": false
        },
        "sourceCode": "export const meta = {\n    title: \"合并单元格 · 区域销售台账\",\n    description: \"3,000 笔订单、24 列，按大区、城市和客户经理排序后合并连续归属信息。\",\n};\nimport Table from \"../../src/index.js\";\nimport type { MergeCell } from \"../../src/types.js\";\nimport { makeOrders, type OrderRow } from \"./_mock.js\";\nimport { DemoFrame, orderColumns } from \"./_shared.js\";\nconst compare = (a: string, b: string) => a.localeCompare(b, \"zh-CN\");\nconst rows = makeOrders().sort((a, b) => compare(a.dataRef.region, b.dataRef.region)\n    || compare(a.dataRef.city, b.dataRef.city) || compare(a.dataRef.owner, b.dataRef.owner));\nconst fields = orderColumns().map(col => ({ ...col, fixed: undefined }));\nconst columns = [fields[3], fields[4], fields[5], ...fields.filter(col => ![\"$.region\", \"$.city\", \"$.owner\"].includes(col.name))];\n// rowSpan / colSpan 在 Table 中表示额外覆盖的行列数。\nfunction merge(columnIndex: number, groupKey: (row: OrderRow) => string): MergeCell[] {\n    const result: MergeCell[] = [];\n    let start = 0;\n    while (start \u003c rows.length) {\n        let end = start + 1;\n        while (end \u003c rows.length && groupKey(rows[start]) === groupKey(rows[end])) end++;\n        if (end - start > 1) result.push({ rowIndex: start, columnIndex, rowSpan: end - start - 1, colSpan: 0 });\n        start = end;\n    }\n    return result;\n}\nconst mergeCells = [\n    ...merge(0, row => row.dataRef.region),\n    ...merge(1, row => row.dataRef.region + \"/\" + row.dataRef.city),\n    ...merge(2, row => row.dataRef.region + \"/\" + row.dataRef.city + \"/\" + row.dataRef.owner),\n];\nexport default function MergeCellsDemo() {\n    return \u003cDemoFrame title=\"区域销售归属台账\" rows={rows.length} columns={columns.length}\n        hint=\"相同大区、城市和客户经理连续合并，订单明细逐行保留；归属单元格与横向、纵向滚动共同移动。\">\n        {(width, height) => \u003cTable aria-label=\"合并区域归属单元格的销售台账\" width={width} height={height} rows={rows} columns={columns} mergeCells={mergeCells} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FmergeCells.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FmergeCells.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/rowExpansion.demo.tsx",
        "title": "行展开 · 订单履约详情",
        "description": "3,000 笔订单、24 列。切换到 20 行小批次可观察详情展开过渡；完整台账直接更新布局。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "isSelected",
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "defaultExpandedRowKeys",
                "expandedRowHeight",
                "expandedRowRender"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行展开 · 订单履约详情\",\n    description: \"3,000 笔订单、24 列。切换到 20 行小批次可观察详情展开过渡；完整台账直接更新布局。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport { makeOrders } from \"./_mock.js\";\nimport { DemoFrame, OrderDetails, orderColumns } from \"./_shared.js\";\nconst rows = makeOrders();\nconst batchRows = rows.slice(0, 20);\nconst columns = orderColumns();\nexport default function RowExpansionDemo() {\n    const [smallBatch, setSmallBatch] = useState(false);\n    const visibleRows = smallBatch ? batchRows : rows;\n    return \u003cDemoFrame title=\"订单履约跟进\" rows={visibleRows.length} columns={columns.length}\n        toolbar={\u003cButton isSelected={smallBatch} onClick={() => setSmallBatch(value => !value)}>20 行小批次\u003c/Button>}\n        hint=\"点击行首箭头展开详情；每笔订单的详情由同一条业务记录生成，与表格金额和状态一致。\">\n        {(width, height) => \u003cTable aria-label=\"可展开履约详情的订单\" width={width} height={height} rows={visibleRows} columns={columns}\n            defaultExpandedRowKeys={new Set([rows[0].id])} expandedRowHeight={280}\n            expandedRowRender={row => \u003cOrderDetails row={row} />} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowExpansion.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowExpansion.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/rowGrouping.demo.tsx",
        "title": "行分组 · 区域人员配置",
        "description": "2,000 名员工、22 列，按大区和部门逐级分组，展开查看岗位、项目和薪酬构成。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "groupBy",
                "defaultExpandAll",
                "expandedGroupIds",
                "onExpandedGroupIdsChange"
            ],
            "events": [
                "onClick",
                "onExpandedGroupIdsChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行分组 · 区域人员配置\",\n    description: \"2,000 名员工、22 列，按大区和部门逐级分组，展开查看岗位、项目和薪酬构成。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport { employeeRows } from \"./_mock.js\";\nimport { DemoFrame, employeeColumns } from \"./_shared.js\";\nconst rows = employeeRows();\nconst fields = employeeColumns();\nconst columns = [fields[7], fields[2], ...fields.filter(col => ![\"$.region\", \"$.department\"].includes(col.name)).map(col => ({ ...col, fixed: undefined }))];\nexport default function RowGroupingDemo() {\n    const [expandedGroupIds, setExpandedGroupIds] = useState\u003cSet\u003cKey>>();\n    return \u003cDemoFrame title=\"区域人员配置\" rows={rows.length} columns={columns.length}\n        hint=\"按大区 → 部门分组。分组标题显示人数，展开后核对具体岗位与项目归属。\"\n        toolbar={\u003cButton onClick={() => setExpandedGroupIds(new Set())}>收起所有分组\u003c/Button>}>\n        {(width, height) => \u003cTable aria-label=\"按大区和部门分组的人员配置\" width={width} height={height} rows={rows} columns={columns}\n            groupBy={[\"$.region\", \"$.department\"]} defaultExpandAll\n            expandedGroupIds={expandedGroupIds} onExpandedGroupIdsChange={setExpandedGroupIds} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowGrouping.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowGrouping.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/rowNumber.demo.tsx",
        "title": "行序号 · 库存盘点清单",
        "description": "2,000 条库存、23 个业务列，排序与仓库分组后保持数据行连续编号。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "isSelected",
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "showRowNumber",
                "groupBy",
                "defaultExpandAll"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行序号 · 库存盘点清单\",\n    description: \"2,000 条库存、23 个业务列，排序与仓库分组后保持数据行连续编号。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport { makeInventory } from \"./_mock.js\";\nimport { DemoFrame, inventoryColumns } from \"./_shared.js\";\nconst rows = makeInventory();\nconst columns = inventoryColumns().map(col => ({ ...col, sortable: true }));\nexport default function RowNumberDemo() {\n    const [grouped, setGrouped] = useState(false);\n    return \u003cDemoFrame title=\"每日库存盘点清单\" rows={rows.length} columns={columns.length}\n        hint=\"序号表示当前清单顺序，库存记录号是稳定业务标识；排序后序号连续，分组标题不占用序号。\"\n        toolbar={\u003cButton isSelected={grouped} onClick={() => setGrouped(value => !value)}>按仓库分组\u003c/Button>}>\n        {(width, height) => \u003cTable aria-label=\"带连续行序号的库存盘点清单\" width={width} height={height} rows={rows} columns={columns}\n            showRowNumber groupBy={grouped ? [\"$.warehouse\"] : undefined} defaultExpandAll />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowNumber.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowNumber.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/rowSelection.demo.tsx",
        "title": "行选中 · 采购订单审核",
        "description": "3,000 笔订单、24 列，选择待审核订单后批量通过；其他状态禁止选择，操作结果可撤销。",
        "learning": {
            "components": [
                "Select",
                "Button",
                "Table"
            ],
            "props": [
                "aria-label",
                "value",
                "options",
                "onChange",
                "appearance",
                "disabled",
                "onClick",
                "width",
                "height",
                "rows",
                "columns",
                "rowSelection"
            ],
            "events": [
                "onChange",
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行选中 · 采购订单审核\",\n    description: \"3,000 笔订单、24 列，选择待审核订单后批量通过；其他状态禁止选择，操作结果可撤销。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Select from \"@crab-dev/rc-select\";\nimport Table from \"../../src/index.js\";\nimport { makeOrders, money, type OrderRow } from \"./_mock.js\";\nimport { approveOrders } from \"./_operations.js\";\nimport { DemoFrame, orderColumns, noteStyle } from \"./_shared.js\";\nconst initialRows = makeOrders();\nconst columns = orderColumns();\nexport default function RowSelectionDemo() {\n    const [rows, setRows] = useState(initialRows);\n    const [selected, setSelected] = useState\u003cSet\u003cKey>>(new Set());\n    const [single, setSingle] = useState(false);\n    const [previous, setPrevious] = useState\u003cOrderRow[] | null>(null);\n    const [message, setMessage] = useState(\"\");\n    const selectedRows = rows.filter(row => selected.has(row.id) && row.dataRef.status === \"待审核\");\n    return \u003cDemoFrame title=\"采购订单审核工作台\" rows={rows.length} columns={columns.length}\n        hint=\"仅「待审核」订单可选，审核通过后进入「待发货」。本示例操作仅保存在当前页面，可撤销最近一批。\"\n        toolbar={\u003c>\n            \u003cSelect aria-label=\"选择模式\" value={single ? \"single\" : \"multiple\"}\n                options={[{ label: \"批量审核（多选）\", value: \"multiple\" }, { label: \"逐单审核（单选）\", value: \"single\" }]}\n                onChange={value => { setSingle(value === \"single\"); setSelected(new Set()); }} />\n            \u003cButton appearance=\"primary\" disabled={!selectedRows.length} onClick={() => {\n                setPrevious(rows); setRows(approveOrders(rows, selected)); setSelected(new Set());\n                setMessage(\"已通过 \" + selectedRows.length + \" 笔订单，进入待发货状态。\");\n            }}>审核通过（{selectedRows.length}）\u003c/Button>\n            \u003cButton disabled={!previous} onClick={() => {\n                if (previous) setRows(previous);\n                setPrevious(null); setSelected(new Set()); setMessage(\"已撤销最近一批审核。\");\n            }}>撤销最近审核\u003c/Button>\n        \u003c/>}\n        footer={\u003cdiv className={noteStyle} role=\"status\">已选订单额 {money(selectedRows.reduce((sum, row) => sum + row.dataRef.amount, 0))}。{message}\u003c/div>}>\n        {(width, height) => \u003cTable aria-label=\"待审核采购订单选择\" width={width} height={height} rows={rows} columns={columns}\n            rowSelection={{ type: single ? \"radio\" : \"checkbox\", selectedRowIds: selected,\n                onChange: setSelected, getDisabled: row => row.dataRef.status !== \"待审核\" }} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowSelection.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowSelection.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/rowState.demo.tsx",
        "title": "行变更状态 · 盘点差异暂存",
        "description": "2,000 条库存、25 列，标记新增批次、待复核和移除记录；每条变更均可还原。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "size",
                "disabled",
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns"
            ],
            "events": [
                "onClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行变更状态 · 盘点差异暂存\",\n    description: \"2,000 条库存、25 列，标记新增批次、待复核和移除记录；每条变更均可还原。\",\n};\nimport { useState } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { makeInventory, type InventoryRow } from \"./_mock.js\";\nimport { DemoFrame, inventoryColumns, noteStyle } from \"./_shared.js\";\nconst initialRows = makeInventory();\nexport default function RowStateDemo() {\n    const [rows, setRows] = useState(initialRows);\n    const [nextId, setNextId] = useState(1);\n    const [message, setMessage] = useState(\"\");\n    const restore = (row: InventoryRow) => {\n        const original = initialRows.find(item => item.id === row.id);\n        setRows(previous => original ? previous.map(item => item.id === row.id ? original : item) : previous.filter(item => item.id !== row.id));\n        setMessage(String(row.id) + \" 的暂存变更已撤销。\");\n    };\n    const columns: ColumnType\u003cInventoryRow>[] = [...inventoryColumns()];\n    columns.splice(1, 0,\n        { name: \"change\", title: \"暂存状态\", width: 120, render: ({ row }) => row.state === \"new\" ? \"＋ 新增批次\"\n            : row.state === \"modified\" ? \"✎ 待复核\" : row.state === \"deleted\" ? \"− 待移除\" : \"未变更\" },\n        { name: \"actions\", title: \"差异处理\", width: 260, selectable: false, render: ({ row }) => \u003c>\n            \u003cButton size=\"small\" disabled={Boolean(row.state)} onClick={() => setRows(previous => previous.map(item => item.id === row.id\n                ? { ...item, state: \"modified\", dataRef: { ...item.dataRef, note: \"实物盘点存在差异，已登记并等待仓库负责人复核。\" } } : item))}>标记复核\u003c/Button>\n            \u003cButton size=\"small\" disabled={Boolean(row.state)} onClick={() => setRows(previous => previous.map(item => item.id === row.id\n                ? { ...item, state: \"deleted\" } : item))}>暂存移除\u003c/Button>\n            \u003cButton size=\"small\" disabled={!row.state} onClick={() => restore(row)}>还原\u003c/Button>\n        \u003c/> },\n    );\n    return \u003cDemoFrame title=\"盘点差异暂存清单\" rows={rows.length} columns={columns.length}\n        hint=\"操作只标记待提交变更，移除记录仍保留并可还原；新增一条演示入库批次后，也可用「还原」撤销。\"\n        toolbar={\u003cButton onClick={() => {\n            const id = \"INV-NEW-\" + String(nextId).padStart(4, \"0\");\n            const sample = initialRows[nextId % initialRows.length].dataRef;\n            setRows(previous => [{ id, state: \"new\", dataRef: { ...sample, recordNo: id, batch: \"LOT-20260912-\" + nextId,\n                onHand: 0, reserved: 0, available: 0, value: 0, status: \"待入库\", note: \"到货数量待盘点确认。\" } }, ...previous]);\n            setNextId(value => value + 1); setMessage(\"已新增一个待入库批次。\");\n        }}>新增入库批次\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">{message} 待提交变更 {rows.filter(row => row.state).length} 条。\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"带变更标记的盘点差异清单\" width={width} height={height} rows={rows} columns={columns} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowState.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowState.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/tree.demo.tsx",
        "title": "树形数据 · 组织与人员编制",
        "description": "公司 → 部门 → 员工三级组织，超过 1,900 个节点、18 列；人数和薪酬逐层汇总。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "treeData",
                "getChildRows",
                "treeColumn",
                "expandedRowIds",
                "onExpandedRowIdsChange"
            ],
            "events": [
                "onClick",
                "onExpandedRowIdsChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"树形数据 · 组织与人员编制\",\n    description: \"公司 → 部门 → 员工三级组织，超过 1,900 个节点、18 列；人数和薪酬逐层汇总。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { makeOrganization, countOrganization, type OrganizationRow } from \"./_scenarios.js\";\nimport { DemoFrame, field, amount } from \"./_shared.js\";\nconst rows = makeOrganization();\nconst branches = rows.flatMap(row => [row.id, ...(row.children ?? []).map(child => child.id)]);\nconst columns: ColumnType\u003cOrganizationRow>[] = [\n    field(\"name\", \"组织 / 员工\", 360), field(\"type\", \"节点类型\", 100), field(\"code\", \"组织 / 人员编码\", 170),\n    field(\"department\", \"部门\"), field(\"jobTitle\", \"岗位\", 160), field(\"position\", \"职级\", 110),\n    field(\"manager\", \"主管\", 110), field(\"city\", \"城市\", 100), field(\"region\", \"大区\", 100),\n    field(\"status\", \"状态\", 110), field(\"employeeNo\", \"工号\", 160), field(\"email\", \"工作邮箱\", 300),\n    field(\"project\", \"所属项目\", 220), field(\"joinDate\", \"入职日期\"), field(\"contractEnd\", \"合同到期日\"),\n    { ...field\u003cOrganizationRow>(\"headcount\", \"在册人数\", 110), align: \"right\" },\n    amount(\"payroll\", \"月基本工资合计\", row => row.dataRef.payroll),\n    amount(\"annualCost\", \"年度总薪酬合计\", row => row.dataRef.annualCost),\n];\nexport default function TreeDemo() {\n    const [expanded, setExpanded] = useState\u003cSet\u003cKey>>(new Set(branches));\n    return \u003cDemoFrame title=\"组织架构与人员编制\" rows={countOrganization(rows)} columns={columns.length}\n        hint=\"公司和部门汇总下属在职、试用人员；离职人员不计入当前编制。展开查看岗位、主管和合同。\"\n        toolbar={\u003c>\u003cButton onClick={() => setExpanded(new Set(branches))}>展开全部\u003c/Button>\n            \u003cButton onClick={() => setExpanded(new Set())}>收起全部\u003c/Button>\u003c/>}>\n        {(width, height) => \u003cTable aria-label=\"组织架构与人员编制树形表格\" width={width} height={height} rows={rows} columns={columns}\n            treeData getChildRows={row => row.children} treeColumn=\"$.name\"\n            expandedRowIds={expanded} onExpandedRowIdsChange={setExpanded} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Ftree.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Ftree.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "行与结构"
    },
    {
        "id": "docs/demos/copy.demo.tsx",
        "title": "复制单元格 · 库存对账",
        "description": "2,000 条库存、23 列，框选后复制 TSV 到电子表格，保留稀疏选区空位与多行备注。",
        "learning": {
            "components": [
                "TextEdit",
                "Table"
            ],
            "props": [
                "aria-label",
                "rows",
                "readOnly",
                "value",
                "width",
                "height",
                "columns",
                "selectCells",
                "onSelectCellsChange",
                "onCopy"
            ],
            "events": [
                "onSelectCellsChange",
                "onCopy"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"复制单元格 · 库存对账\",\n    description: \"2,000 条库存、23 列，框选后复制 TSV 到电子表格，保留稀疏选区空位与多行备注。\",\n};\nimport { useState, type Key } from \"react\";\nimport TextEdit from \"@crab-dev/rc-text-edit\";\nimport Table from \"../../src/index.js\";\nimport { makeInventory } from \"./_mock.js\";\nimport { buildTsv, type CopiedCell } from \"./_operations.js\";\nimport { DemoFrame, inventoryColumns, noteStyle } from \"./_shared.js\";\nconst rows = makeInventory();\nconst columns = inventoryColumns();\nexport default function CopyDemo() {\n    const [selectCells, setSelectCells] = useState\u003cKey[]>([]);\n    const [message, setMessage] = useState(\"\");\n    const [preview, setPreview] = useState(\"\");\n    const copy = async (cells: CopiedCell[]) => {\n        const tsv = buildTsv(cells);\n        if (!tsv) { setMessage(\"请先选择需要复制的单元格。\"); return; }\n        setPreview(tsv);\n        try {\n            await navigator.clipboard.writeText(tsv);\n            setMessage(\"已复制 \" + cells.length + \" 个单元格，可粘贴到电子表格。\");\n        } catch {\n            setMessage(\"浏览器未允许剪贴板访问，请在下方文本框中全选并复制。\");\n        }\n    };\n    return \u003cDemoFrame title=\"库存对账数据提取\" rows={rows.length} columns={columns.length}\n        hint=\"框选商品、库位与库存数量，按 Ctrl/⌘+C 复制。数值以原始数字输出，便于继续计算。\"\n        footer={\u003c>\u003cp className={noteStyle} role=\"status\">{message || \"已选择 \" + selectCells.length + \" 个单元格\"}\u003c/p>\n            {preview && \u003cTextEdit aria-label=\"复制内容（只读，可全选复制）\" rows={3} readOnly value={preview} />}\u003c/>}>\n        {(width, height) => \u003cTable aria-label=\"可复制的库存对账数据\" width={width} height={height} rows={rows} columns={columns}\n            selectCells={selectCells} onSelectCellsChange={setSelectCells} onCopy={copy} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fcopy.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fcopy.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/edit.demo.tsx",
        "title": "单元格编辑 · 库存盘点修正",
        "description": "2,000 条库存、23 列，编辑账面库存和盘点备注，自动重算可用库存与货值，支持撤销。",
        "learning": {
            "components": [
                "NumberEdit",
                "LineEdit",
                "Table"
            ],
            "props": [
                "size",
                "autoFocus",
                "controls",
                "aria-label",
                "min",
                "max",
                "precision",
                "value",
                "onChange",
                "onKeyDown",
                "onBlur",
                "maxLength"
            ],
            "events": [
                "onChange",
                "onKeyDown",
                "onBlur",
                "onCellEditRecordsChange",
                "onUndo"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"单元格编辑 · 库存盘点修正\",\n    description: \"2,000 条库存、23 列，编辑账面库存和盘点备注，自动重算可用库存与货值，支持撤销。\",\n};\nimport { useState } from \"react\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport NumberEdit from \"@crab-dev/rc-number-edit\";\nimport Table from \"../../src/index.js\";\nimport type { CellEditRecord, ColumnType } from \"../../src/types.js\";\nimport { makeInventory, updateInventory, type InventoryRow } from \"./_mock.js\";\nimport { DemoFrame, inventoryColumns, fieldStyle, noteStyle } from \"./_shared.js\";\nconst initialRows = makeInventory();\nexport default function EditDemo() {\n    const [rows, setRows] = useState(initialRows);\n    const [records, setRecords] = useState\u003cCellEditRecord[]>([]);\n    const [message, setMessage] = useState(\"\");\n    const patch = (id: InventoryRow[\"id\"], key: string, value: unknown) => {\n        setRows(previous => previous.map(row => {\n            if (row.id !== id) return row;\n            const onHand = key === \"$.onHand\" && typeof value === \"number\" ? value : row.dataRef.onHand;\n            const note = key === \"$.note\" && typeof value === \"string\" ? value : row.dataRef.note;\n            return { ...row, dataRef: updateInventory(row.dataRef, onHand, note) };\n        }));\n    };\n    const columns: ColumnType\u003cInventoryRow>[] = inventoryColumns().map(column => {\n        if (column.name === \"$.onHand\") return { ...column, title: \"账面库存（可编辑）\", width: 190,\n            editRender: ({ row, editorValue, onEditorValueChange, onCommit, onCancel }) => \u003cNumberEdit\n                className={fieldStyle} size=\"small\" autoFocus controls={false}\n                aria-label={row.dataRef.recordNo + \" 账面库存，最少 \" + row.dataRef.reserved}\n                min={row.dataRef.reserved} max={99999} precision={0}\n                value={typeof editorValue === \"number\" ? editorValue : row.dataRef.onHand}\n                onChange={onEditorValueChange}\n                onKeyDown={event => { if (event.key === \"Escape\") { event.preventDefault(); event.stopPropagation(); onCancel?.(); } }}\n                onBlur={event => {\n                    const text = event.currentTarget.value.trim();\n                    const parsed = Number(text);\n                    const value = text && Number.isFinite(parsed) ? Math.min(99999, Math.max(row.dataRef.reserved, Math.round(parsed))) : row.dataRef.onHand;\n                    patch(row.id, column.name, value); onCommit?.(value);\n                    setMessage(row.dataRef.recordNo + \" 库存已保存，可用库存和货值已更新。\");\n                }} />,\n        };\n        if (column.name === \"$.note\") return { ...column, title: \"盘点备注（可编辑）\",\n            editRender: ({ row, editorValue, onEditorValueChange, onCommit, onCancel }) => \u003cLineEdit\n                className={fieldStyle} size=\"small\" autoFocus maxLength={120}\n                aria-label={row.dataRef.recordNo + \" 盘点备注，最多120字\"}\n                value={typeof editorValue === \"string\" ? editorValue : row.dataRef.note}\n                onChange={event => onEditorValueChange(event.target.value)}\n                onKeyDown={event => { if (event.key === \"Escape\") { event.preventDefault(); event.stopPropagation(); onCancel?.(); } }}\n                onBlur={event => {\n                    const value = event.currentTarget.value.trim();\n                    patch(row.id, column.name, value); onCommit?.(value); setMessage(\"盘点备注已保存。\");\n                }} />,\n        };\n        return column;\n    });\n    return \u003cDemoFrame title=\"库存盘点修正\" rows={rows.length} columns={columns.length}\n        hint=\"横向滚动到「账面库存」或「盘点备注」，双击或用键盘进入编辑；Enter/Tab/失焦保存，Esc 放弃。库存不得低于已占用量；留空保留原库存，备注最多120字。Ctrl/⌘+Z 撤销。\"\n        footer={\u003cdiv className={noteStyle} role=\"status\">{message} 编辑记录 {records.length} 条。\n            {records.slice(-3).map((record, index) => \u003cp key={record.rowId + \":\" + record.columnName + \":\" + index}>\n                {String(record.rowId)}：{Array.isArray(record.oldValue) ? record.oldValue.join(\"\") : String(record.oldValue ?? \"空\")}\n                {\" → \"}{String(record.newValue ?? \"空\")}\n            \u003c/p>)}\u003c/div>}>\n        {(width, height) => \u003cTable aria-label=\"可编辑的库存盘点清单\" width={width} height={height} rows={rows} columns={columns}\n            editType=\"cell\" cellEditRecords={records} onCellEditRecordsChange={setRecords}\n            onUndo={record => {\n                patch(record.rowId, record.columnName, Array.isArray(record.oldValue) ? record.oldValue[0] : record.oldValue);\n                setMessage(\"已撤销最近一次修改，并重算关联库存数据。\");\n            }} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2Fedit.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2Fedit.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/rowEdit.demo.tsx",
        "title": "整行编辑 · 库存复核",
        "description": "2,000 条库存、24 列，一次复核库存与备注，保存后更新关联数值，取消保持原始记录。",
        "learning": {
            "components": [
                "NumberEdit",
                "LineEdit",
                "Button",
                "Table"
            ],
            "props": [
                "size",
                "aria-label",
                "min",
                "max",
                "precision",
                "controls",
                "value",
                "onChange",
                "maxLength",
                "disabled",
                "onClick",
                "width"
            ],
            "events": [
                "onChange",
                "onClick",
                "onEditingRowIdChange",
                "onRowCancel",
                "onRowCommit"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"整行编辑 · 库存复核\",\n    description: \"2,000 条库存、24 列，一次复核库存与备注，保存后更新关联数值，取消保持原始记录。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport LineEdit from \"@crab-dev/rc-line-edit\";\nimport NumberEdit from \"@crab-dev/rc-number-edit\";\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { makeInventory, updateInventory, type InventoryRow } from \"./_mock.js\";\nimport { DemoFrame, inventoryColumns, fieldStyle, noteStyle } from \"./_shared.js\";\nconst initialRows = makeInventory();\nexport default function RowEditDemo() {\n    const [rows, setRows] = useState(initialRows);\n    const [editingRowId, setEditingRowId] = useState\u003cKey | null>(null);\n    const [previous, setPrevious] = useState\u003cInventoryRow[] | null>(null);\n    const [message, setMessage] = useState(\"\");\n    const columns: ColumnType\u003cInventoryRow>[] = inventoryColumns().map(column => {\n        if (column.name === \"$.onHand\") return { ...column, title: \"复核库存\", width: 170,\n            editRender: ({ row, editorValue, onEditorValueChange }) => \u003cNumberEdit className={fieldStyle} size=\"small\"\n                aria-label={row.dataRef.recordNo + \" 复核库存，最少 \" + row.dataRef.reserved}\n                min={row.dataRef.reserved} max={99999} precision={0} controls={false}\n                value={typeof editorValue === \"number\" ? editorValue : row.dataRef.onHand} onChange={onEditorValueChange} />,\n        };\n        if (column.name === \"$.note\") return { ...column, title: \"复核备注\",\n            editRender: ({ row, editorValue, onEditorValueChange }) => \u003cLineEdit className={fieldStyle} size=\"small\"\n                aria-label={row.dataRef.recordNo + \" 复核备注，最多120字\"} maxLength={120}\n                value={typeof editorValue === \"string\" ? editorValue : row.dataRef.note}\n                onChange={event => onEditorValueChange(event.target.value)} />,\n        };\n        return column;\n    });\n    columns.splice(1, 0, { name: \"actions\", title: \"复核操作\", width: 120, selectable: false,\n        render: ({ row }) => \u003cButton size=\"small\" disabled={editingRowId !== null} aria-label={\"复核 \" + row.dataRef.recordNo}\n            onClick={() => setEditingRowId(row.id)}>复核\u003c/Button>,\n    });\n    return \u003cDemoFrame title=\"仓库库存逐行复核\" rows={rows.length} columns={columns.length}\n        hint=\"点击「复核」或双击行，修改库存和备注，再点击「确认」或「取消」。库存空值保留原值，数值限制在已占用量至99,999之间。所有修改仅保存在当前页面。\"\n        toolbar={\u003cButton disabled={!previous || editingRowId !== null} onClick={() => {\n            if (previous) setRows(previous);\n            setPrevious(null); setMessage(\"已撤销最近一次复核。\");\n        }}>撤销最近复核\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">{message} 已修改 {rows.filter(row => row.state === \"modified\").length} 条。\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"支持整行复核的库存清单\" width={width} height={height} rows={rows} columns={columns}\n            editType=\"row\" editingRowId={editingRowId} onEditingRowIdChange={setEditingRowId}\n            onRowCancel={() => setMessage(\"已取消复核，原记录保持不变。\")}\n            onRowCommit={(id, changes) => {\n                const original = rows.find(row => row.id === id);\n                if (!original) return;\n                const quantity = changes[\"$.onHand\"];\n                const note = changes[\"$.note\"];\n                const onHand = typeof quantity === \"number\" && Number.isFinite(quantity)\n                    ? Math.min(99999, Math.max(original.dataRef.reserved, Math.round(quantity))) : original.dataRef.onHand;\n                const nextNote = typeof note === \"string\" ? note.trim().slice(0, 120) : original.dataRef.note;\n                if (onHand === original.dataRef.onHand && nextNote === original.dataRef.note) {\n                    setMessage(\"记录没有变化，无需保存。\");\n                    return;\n                }\n                setPrevious(rows);\n                setRows(current => current.map(row => {\n                    if (row.id !== id) return row;\n                    return { ...row, state: \"modified\", dataRef: updateInventory(row.dataRef, onHand, nextNote) };\n                }));\n                setMessage(String(id) + \" 已复核，可用库存和货值同步更新。\");\n            }} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowEdit.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowEdit.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/rowEvent.demo.tsx",
        "title": "行事件 · 客户订单跟进",
        "description": "3,000 笔订单、25 列，单击查看订单摘要，双击或使用详情按钮打开完整跟进信息。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "size",
                "aria-label",
                "onClick",
                "width",
                "height",
                "rows",
                "columns",
                "rowSelection",
                "onRowClick",
                "onRowDoubleClick"
            ],
            "events": [
                "onClick",
                "onRowClick",
                "onRowDoubleClick"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"行事件 · 客户订单跟进\",\n    description: \"3,000 笔订单、25 列，单击查看订单摘要，双击或使用详情按钮打开完整跟进信息。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport type { ColumnType } from \"../../src/types.js\";\nimport { makeOrders, money, type OrderRow } from \"./_mock.js\";\nimport { DemoFrame, OrderDetails, orderColumns, panelStyle, noteStyle } from \"./_shared.js\";\nconst rows = makeOrders();\nexport default function RowEventDemo() {\n    const [selected, setSelected] = useState\u003cSet\u003cKey>>(new Set());\n    const [summary, setSummary] = useState(\"选择订单行查看摘要。\");\n    const [detail, setDetail] = useState\u003cOrderRow | null>(null);\n    const columns: ColumnType\u003cOrderRow>[] = [...orderColumns(), {\n        name: \"actions\", title: \"跟进\", width: 100, selectable: false,\n        render: ({ row }) => \u003cButton size=\"small\" aria-label={\"查看订单 \" + row.dataRef.orderNo + \" 详情\"} onClick={() => setDetail(row)}>详情\u003c/Button>,\n    }];\n    return \u003cDemoFrame title=\"客户订单跟进\" rows={rows.length} columns={columns.length}\n        hint=\"单击或点选单元格后按 Enter 查看摘要；双击行查看详情。详情按钮提供独立键盘入口。\"\n        footer={\u003c>\u003cp className={noteStyle} role=\"status\">{summary} 已勾选 {selected.size} 笔。\u003c/p>\n            {detail && \u003cdiv className={panelStyle}>\u003cButton onClick={() => setDetail(null)}>关闭详情\u003c/Button>\u003cOrderDetails row={detail} />\u003c/div>}\u003c/>}>\n        {(width, height) => \u003cTable aria-label=\"客户订单跟进列表\" width={width} height={height} rows={rows} columns={columns}\n            rowSelection={{ type: \"checkbox\", selectedRowIds: selected, onChange: setSelected }}\n            onRowClick={row => setSummary(row.dataRef.orderNo + \" · \" + row.dataRef.customer + \" · \" + money(row.dataRef.amount) + \" · \" + row.dataRef.status)}\n            onRowDoubleClick={row => setDetail(row)} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FrowEvent.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FrowEvent.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "编辑与交互"
    },
    {
        "id": "docs/demos/selectCells.demo.tsx",
        "title": "单元格选择 · 月度预算核对",
        "description": "1,200 条预算、23 列；跨行、跨月框选数据，支持 Shift 扩选与 Ctrl/⌘ 多选。",
        "learning": {
            "components": [
                "Button",
                "Table"
            ],
            "props": [
                "disabled",
                "onClick",
                "aria-label",
                "width",
                "height",
                "rows",
                "columns",
                "selectCells",
                "onSelectCellsChange"
            ],
            "events": [
                "onClick",
                "onSelectCellsChange"
            ],
            "hasState": true
        },
        "sourceCode": "export const meta = {\n    title: \"单元格选择 · 月度预算核对\",\n    description: \"1,200 条预算、23 列；跨行、跨月框选数据，支持 Shift 扩选与 Ctrl/⌘ 多选。\",\n};\nimport { useState, type Key } from \"react\";\nimport Button from \"@crab-dev/rc-button\";\nimport Table from \"../../src/index.js\";\nimport { makeBudgets } from \"./_mock.js\";\nimport { DemoFrame, budgetColumns, noteStyle } from \"./_shared.js\";\nconst rows = makeBudgets();\nconst columns = budgetColumns();\nexport default function SelectCellsDemo() {\n    const [selectCells, setSelectCells] = useState\u003cKey[]>([]);\n    return \u003cDemoFrame title=\"月度预算交叉核对\" rows={rows.length} columns={columns.length}\n        hint=\"拖拽框选相邻月份与项目；Shift 扩选、Ctrl/⌘ 切换单格。横向滚动可查看全部月份。\"\n        toolbar={\u003cButton disabled={!selectCells.length} onClick={() => setSelectCells([])}>清除选区\u003c/Button>}\n        footer={\u003cp className={noteStyle} role=\"status\">已选择 {selectCells.length} 个单元格\u003c/p>}>\n        {(width, height) => \u003cTable aria-label=\"可框选的月度预算明细\" width={width} height={height} rows={rows} columns={columns}\n            selectCells={selectCells} onSelectCellsChange={setSelectCells} />}\n    \u003c/DemoFrame>;\n}\n",
        "previewPath": "/components/rc-table/workbench/?__wake_demo=docs%2Fdemos%2FselectCells.demo.tsx",
        "workbenchPath": "/components/rc-table/workbench/#/components/docs%2Fdemos%2FselectCells.demo.tsx",
        "density": "regular",
        "layout": "wide",
        "group": "编辑与交互"
    }
] as const satisfies readonly ComponentDemoRecord[];
