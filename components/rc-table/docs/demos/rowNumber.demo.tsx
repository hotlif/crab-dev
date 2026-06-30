/**
 * title = "行序号"
 * description = "通过 `showRowNumber` 开启行序号列，序号从 1 开始、反映当前渲染顺序（排序后随之重排）。分组 banner 行不计入序号，数据行始终连续编号。`rowNumberColumnWidth` 控制列宽（默认 50），`rowNumberColumnFixed` 控制是否固定到左侧（默认 true）。"
 */

import { useState, type Key } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, RowSelection } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const allRows: DemoRow[] = makeEmployees(30, 20260630).map((emp, i) => ({
    id: `${i + 1}`,
    dataRef: emp,
}));

const columns: ColumnType<DemoRow>[] = [
    { name: "name",        title: "姓名",   width: 110, sortable: true },
    { name: "department",  title: "部门",   width: 120, sortable: true },
    { name: "jobTitle",    title: "职位",   width: 150 },
    { name: "city",        title: "城市",   width: 100, sortable: true },
    { name: "performance", title: "绩效",   width: 80,  align: "center", sortable: true },
    { name: "salary",      title: "薪资",   width: 120, align: "right", sortable: true,
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { name: "status",      title: "状态",   width: 90 },
];

const groupedRows: DemoRow[] = makeEmployees(20, 20260631).map((emp, i) => ({
    id: `g-${i + 1}`,
    dataRef: emp,
}));

const RowNumberDemo = () => {
    const [showSelection, setShowSelection] = useState(false);
    const [useGrouping, setUseGrouping] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState<Set<Key>>(new Set());

    const rows = useGrouping ? groupedRows : allRows;

    const rowSelection: RowSelection<DemoRow> | undefined = showSelection
        ? {
            type: "checkbox",
            selectedRowIds,
            onChange: (ids) => setSelectedRowIds(ids),
        }
        : undefined;

    const selectedNames = rows
        .filter(r => selectedRowIds.has(r.id))
        .map(r => r.dataRef.name)
        .join("、");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 13 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={showSelection}
                        onChange={e => { setShowSelection(e.target.checked); setSelectedRowIds(new Set()); }}
                    />
                    显示行选中列
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={useGrouping}
                        onChange={e => { setUseGrouping(e.target.checked); setSelectedRowIds(new Set()); }}
                    />
                    启用分组（按部门）
                </label>
            </div>
            {showSelection && (
                <div style={{ fontSize: 13, color: "#666", minHeight: 18 }}>
                    {selectedRowIds.size > 0
                        ? `已选 ${selectedRowIds.size} 行：${selectedNames}`
                        : "未选中任何行"}
                </div>
            )}
            <Table
                width={820}
                height={420}
                rows={rows}
                columns={columns}
                showRowNumber
                rowSelection={rowSelection}
                groupBy={useGrouping ? ["department"] : undefined}
                defaultSortColumns={[{ columnName: "department", direction: "asc" }]}
            />
            {useGrouping && (
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                    分组 banner 行不占序号，展开 / 收起分组后数据行序号始终连续。
                </p>
            )}
        </div>
    );
};

export default RowNumberDemo;
