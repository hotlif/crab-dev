export const meta = {
    title: "多级表头 · 年度项目预算",
    description: "1,200 条预算明细、23 个叶子列；按季度组织 12 个月的预算，并核对全年预算与实际支出。",
};
import type { ColumnType } from "../../src/types.js";
import Table from "../../src/index.js";
import { makeBudgets, type BudgetRow } from "./_mock.js";
import { DemoFrame, budgetColumns } from "./_shared.js";
const rows = makeBudgets();
const leafColumns = budgetColumns();
const columns: ColumnType<BudgetRow>[] = [
    leafColumns[0],
    { name: "project-info", title: "项目归属", children: leafColumns.slice(1, 6) },
    ...Array.from({ length: 4 }, (_, quarter) => ({
        name: "quarter-" + quarter, title: "第" + (quarter + 1) + "季度预算",
        children: leafColumns.slice(6 + quarter * 3, 9 + quarter * 3),
    })),
    { name: "execution", title: "执行情况（实支截至8月）", children: leafColumns.slice(18) },
];
export default function MergeTableHeadersDemo() {
    return <DemoFrame title="2026 年项目预算明细" rows={rows.length} columns={leafColumns.length}
        hint="全年预算来自 12 个月预算之和；剩余额度可以为负，超预算记录同时提供状态文字。">
        {(width, height) => <Table aria-label="按季度分组表头的年度预算" width={width} height={height} rows={rows} columns={columns} />}
    </DemoFrame>;
}
