/**
 * title = "行选中"
 * description = "通过 `rowSelection` prop 启用行选中功能。`type: 'checkbox'` 为多选（表头显示全选），`type: 'radio'` 为单选。支持受控与非受控两种用法，可通过 `getDisabled` 禁用特定行。"
 */

import { useState, type Key } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, RowSelection } from "../../src/index.js";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
    dataRef: {
        name: string
        department: string
        salary: number
        status: "active" | "inactive"
    }
}

faker.seed(20260625);

const rows: DemoRow[] = Array.from({ length: 20 }, (_, index) => ({
    id: `${index + 1}`,
    dataRef: {
        name: faker.person.fullName(),
        department: faker.helpers.arrayElement(["工程", "产品", "设计", "运营", "市场"]),
        salary: faker.number.int({ min: 8000, max: 50000 }),
        status: faker.helpers.arrayElement(["active", "inactive"]) as "active" | "inactive",
    },
}));

const columns: ColumnType<DemoRow>[] = [
    { name: "name",       title: "姓名",   width: 140 },
    { name: "department", title: "部门",   width: 120 },
    { name: "salary",     title: "薪资",   width: 120, align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { name: "status",     title: "状态",   width: 100,
        render: ({ row }) => row.dataRef.status === "active" ? "在职" : "离职" },
];

const RowSelectionDemo = () => {
    const [mode, setMode] = useState<"checkbox" | "radio">("checkbox");
    const [selectedRowIds, setSelectedRowIds] = useState<Set<Key>>(new Set());

    const rowSelection: RowSelection<DemoRow> = {
        type: mode,
        selectedRowIds,
        onChange: (ids) => setSelectedRowIds(ids),
        getDisabled: (row) => row.dataRef.status === "inactive",
    };

    const selectedNames = rows
        .filter(r => selectedRowIds.has(r.id))
        .map(r => r.dataRef.name)
        .join("、");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 13 }}>
                <span>选择模式：</span>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    <input
                        type="radio"
                        checked={mode === "checkbox"}
                        onChange={() => { setMode("checkbox"); setSelectedRowIds(new Set()); }}
                    />
                    多选（checkbox）
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                    <input
                        type="radio"
                        checked={mode === "radio"}
                        onChange={() => { setMode("radio"); setSelectedRowIds(new Set()); }}
                    />
                    单选（radio）
                </label>
            </div>
            <div style={{ fontSize: 13, color: "#666", minHeight: 18 }}>
                {selectedRowIds.size > 0
                    ? `已选 ${selectedRowIds.size} 行：${selectedNames}`
                    : '未选中任何行（状态为「离职」的行已禁用）'}
            </div>
            <Table
                width={560}
                height={420}
                rows={rows}
                columns={columns}
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default RowSelectionDemo;
