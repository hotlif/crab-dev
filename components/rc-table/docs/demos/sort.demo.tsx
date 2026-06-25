/**
 * title = "列排序"
 * description = "点击列头切换升序 / 降序 / 无序；按住 Shift 可追加多列排序。`sortable: true` 启用单列，`sorter` 可自定义比较逻辑。"
 */

import { useState } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, SortColumn } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee & { score: number }
}

const rows: DemoRow[] = makeEmployees(60, 20260625).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: {
        ...employee,
        score: 60 + ((index * 7) % 41),
    },
}));

const columns: ColumnType<DemoRow>[] = [
    { name: "name",       title: "姓名",   width: 120 },
    { name: "age",        title: "年龄",   width: 80,  sortable: true, align: "right" },
    { name: "department", title: "部门",   width: 120, sortable: true },
    { name: "jobTitle",   title: "职位",   width: 150, sortable: true },
    { name: "city",       title: "城市",   width: 100, sortable: true },
    { name: "salary",     title: "薪资",   width: 110, sortable: true, align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { name: "joinDate",   title: "入职日期", width: 130, sortable: true },
    { name: "status",     title: "状态",   width: 90,  sortable: true },
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
