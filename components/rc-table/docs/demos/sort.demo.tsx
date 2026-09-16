export const meta = {
    title: "列排序 · 人员薪酬核对",
    description: "2,000 名员工、22 列；按部门、绩效、入职日期和年度总薪酬排序，Shift 追加多列排序。",
};
import { useState } from "react";
import type { SortColumn } from "../../src/types.js";
import Table from "../../src/index.js";
import { employeeRows } from "./_mock.js";
import { DemoFrame, employeeColumns, noteStyle } from "./_shared.js";
const rows = employeeRows();
const performanceOrder = ["S", "A", "B", "C", "待评估"];
const columns = employeeColumns().map(column => ({
    ...column, sortable: true,
    ...(column.name === "$.performance" ? {
        sorter: (a: typeof rows[number], b: typeof rows[number]) =>
            performanceOrder.indexOf(a.dataRef.performance) - performanceOrder.indexOf(b.dataRef.performance),
    } : {}),
}));
export default function SortDemo() {
    const [sortColumns, setSortColumns] = useState<SortColumn[]>([{ columnName: "$.totalComp", direction: "desc" }]);
    return <DemoFrame title="年度人员薪酬核对" rows={rows.length} columns={columns.length}
        hint="默认按年度总薪酬降序；点击列头切换排序，Shift+点击追加条件。年度总薪酬＝月基本工资×12＋年度奖金＋年度股权折算。"
        footer={<p className={noteStyle} role="status">当前排序：{sortColumns.map(sort =>
            columns.find(col => col.name === sort.columnName)?.title + (sort.direction === "asc" ? " 升序" : " 降序")).join(" → ") || "原始顺序"}</p>}>
        {(width, height) => <Table aria-label="年度人员薪酬核对" width={width} height={height} rows={rows} columns={columns}
            sortColumns={sortColumns} onSortColumnsChange={setSortColumns} />}
    </DemoFrame>;
}
