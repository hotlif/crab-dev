/**
 * title = "列排序"
 * description = "点击列头切换升序 / 降序 / 无序；按住 Shift 可追加多列排序。`sortable: true` 启用单列，`sorter` 可自定义比较逻辑。"
 */

import { useState } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, SortColumn } from "../../src/index.js";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
    dataRef: {
        name: string
        age: number
        department: string
        salary: number
        startDate: string
        score: number
    }
}

faker.seed(20260625);

const rows: DemoRow[] = Array.from({ length: 60 }, (_, index) => ({
    id: `${index + 1}`,
    dataRef: {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 22, max: 55 }),
        department: faker.helpers.arrayElement(["工程", "产品", "设计", "运营", "市场"]),
        salary: faker.number.int({ min: 8000, max: 50000 }),
        startDate: faker.date.between({ from: "2015-01-01", to: "2024-12-31" }).toISOString().slice(0, 10),
        score: faker.number.int({ min: 60, max: 100 }),
    },
}));

const columns: ColumnType<DemoRow>[] = [
    { name: "name",       title: "姓名",   width: 140 },
    { name: "age",        title: "年龄",   width: 80,  sortable: true, align: "right" },
    { name: "department", title: "部门",   width: 120, sortable: true },
    { name: "salary",     title: "薪资",   width: 100, sortable: true, align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { name: "startDate",  title: "入职日期", width: 130, sortable: true },
    { name: "score",      title: "绩效分",  width: 100, sortable: true, align: "right",
        sorter: (a, b) => a.dataRef.score - b.dataRef.score },
];

const SortDemo = () => {
    const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);

    const sortLabel = sortColumns.length === 0
        ? "无排序"
        : sortColumns.map(sc => `${sc.columnName} ${sc.direction === "asc" ? "↑" : "↓"}`).join("，");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#666" }}>当前排序：{sortLabel}</div>
            <Table
                width={700}
                height={400}
                rows={rows}
                columns={columns}
                sortColumns={sortColumns}
                onSortColumnsChange={setSortColumns}
            />
        </div>
    );
};

export default SortDemo;
