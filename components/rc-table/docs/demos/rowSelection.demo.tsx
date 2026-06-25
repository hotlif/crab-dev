/**
 * title = "行选中"
 * description = "通过 `rowSelection` prop 启用行选中功能。`type: 'checkbox'` 为多选（表头显示全选），`type: 'radio'` 为单选。支持受控与非受控两种用法，可通过 `getDisabled` 禁用特定行。"
 */

import { useState, type Key } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, RowSelection } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const rows: DemoRow[] = makeEmployees(30, 20260617).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: employee,
}));

const columns: ColumnType<DemoRow>[] = [
    { name: "employeeNo", title: "工号",   width: 120 },
    { name: "name",       title: "姓名",   width: 110 },
    { name: "department", title: "部门",   width: 120 },
    { name: "jobTitle",   title: "职位",   width: 150 },
    { name: "city",       title: "城市",   width: 100 },
    { name: "performance", title: "绩效",  width: 90, align: "center" },
    { name: "salary",     title: "薪资",   width: 120, align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { name: "status",     title: "状态",   width: 90 },
];

const RowSelectionDemo = () => {
    const [mode, setMode] = useState<"checkbox" | "radio">("checkbox");
    const [selectedRowIds, setSelectedRowIds] = useState<Set<Key>>(new Set());

    const rowSelection: RowSelection<DemoRow> = {
        type: mode,
        selectedRowIds,
        onChange: (ids) => setSelectedRowIds(ids),
        getDisabled: (row) => row.dataRef.status === "离职",
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
                width={820}
                height={420}
                rows={rows}
                columns={columns}
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default RowSelectionDemo;
