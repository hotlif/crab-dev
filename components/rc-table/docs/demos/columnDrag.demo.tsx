/**
 * title = "拖拽调整列顺序（固定列 + 分组表头）"
 * description = "左侧「序号」「姓名」、右侧「邮箱」固定；拖拽分组表头可整体调整分组顺序，拖拽分组内的子列可在分组内部重排。"
 */

import { useState } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
    dataRef: {
        name: string
        age: number
        gender: string
        city: string
        department: string
        jobTitle: string
        startDate: string
        salary: number
        bonus: number
        email: string
    }
}

faker.seed(20260602)

const rows: DemoRow[] = Array.from({ length: 200 }, (_, index) => ({
    id: `${index + 1}`,
    dataRef: {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 22, max: 55 }),
        gender: faker.helpers.arrayElement(["男", "女"]),
        city: faker.location.city(),
        department: faker.commerce.department(),
        jobTitle: faker.person.jobTitle(),
        startDate: faker.date.between({ from: "2015-01-01", to: "2024-12-31" }).toISOString().slice(0, 10),
        salary: faker.number.int({ min: 8000, max: 50000 }),
        bonus: faker.number.int({ min: 0, max: 80000 }),
        email: faker.internet.email(),
    },
}))

const initialColumns: ColumnType<DemoRow>[] = [
    {
        title: "序号",
        name: "index",
        width: 60,
        fixed: "left",
        align: "right",
        render: ({ rowIndex }) => rowIndex + 1,
    },
    { title: "姓名", name: "$.name", width: 140, fixed: "left" },
    {
        title: "基本信息",
        name: "group-basic",
        children: [
            { title: "年龄", name: "$.age", width: 80, align: "right" },
            { title: "性别", name: "$.gender", width: 80, align: "center" },
            { title: "城市", name: "$.city", width: 120 },
        ],
    },
    {
        title: "工作信息",
        name: "group-work",
        children: [
            { title: "部门", name: "$.department", width: 160 },
            { title: "职位", name: "$.jobTitle", width: 200 },
            { title: "入职日期", name: "$.startDate", width: 120, align: "center" },
        ],
    },
    {
        title: "薪资信息",
        name: "group-salary",
        children: [
            {
                title: "月薪",
                name: "$.salary",
                width: 120,
                align: "right",
                render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}`,
            },
            {
                title: "年终奖",
                name: "$.bonus",
                width: 120,
                align: "right",
                render: ({ row }) => `¥${row.dataRef.bonus.toLocaleString()}`,
            },
        ],
    },
    { title: "邮箱", name: "$.email", width: 240, fixed: "right" },
]

const ColumnDragComplexDemo = () => {
    const [columns, setColumns] = useState<ColumnType<DemoRow>[]>(initialColumns)

    return (
        <div>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 13 }}>
                拖拽分组列头可整体调整顺序，固定列不参与拖拽。
                当前顺序：{columns.filter(c => !c.fixed).map(c => c.title).join(" → ")}
            </p>
            <Table
                width={960}
                height={400}
                columns={columns}
                rows={rows}
                draggableColumns
                onColumnOrderChange={(orderedNames) => {
                    const nameIndex = new Map(orderedNames.map((n, i) => [n, i]))
                    setColumns(prev => [...prev].sort((a, b) => {
                        if (a.fixed || b.fixed) return 0
                        return (nameIndex.get(a.name) ?? 0) - (nameIndex.get(b.name) ?? 0)
                    }))
                }}
                onGroupColumnOrderChange={(groupName, orderedChildNames) => {
                    const nameIndex = new Map(orderedChildNames.map((n, i) => [n, i]))
                    setColumns(prev => prev.map(col => {
                        if (col.name !== groupName || !col.children) return col
                        return {
                            ...col,
                            children: [...col.children].sort(
                                (a, b) => (nameIndex.get(a.name) ?? 0) - (nameIndex.get(b.name) ?? 0)
                            ),
                        }
                    }))
                }}
            />
        </div>
    )
}

export default ColumnDragComplexDemo;
