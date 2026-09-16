export const meta = {
    title: "底部汇总 · 项目预算执行",
    description: "1,200 条预算、23 列，部门筛选后合计 12 个月预算、全年预算、实支与剩余额度，使用率按汇总金额计算。",
};
import { useState } from "react";
import Select from "@crab-dev/rc-select";
import Table from "../../src/index.js";
import { departments, makeBudgets, money } from "./_mock.js";
import { DemoFrame, budgetColumns, noteStyle } from "./_shared.js";
const allRows = makeBudgets();
export default function SummaryDemo() {
    const [department, setDepartment] = useState("");
    const rows = allRows.filter(row => !department || row.dataRef.department === department);
    const sum = (pick: (row: typeof rows[number]) => number) => rows.reduce((total, row) => total + pick(row), 0);
    const planned = sum(row => row.dataRef.planned);
    const actual = sum(row => row.dataRef.actual);
    const columns = budgetColumns().map(col => ({
        ...col,
        summaryRender: () => {
            const month = /^\$\.monthly\[(\d+)\]$/.exec(col.name);
            if (month) return money(sum(row => row.dataRef.monthly[Number(month[1])]));
            if (col.name === "$.code") return "当前筛选合计";
            if (col.name === "$.project") return rows.length + " 条预算";
            if (col.name === "$.planned") return money(planned);
            if (col.name === "$.actual") return money(actual);
            if (col.name === "$.remaining") return money(planned - actual);
            if (col.name === "$.execution") return planned ? (actual / planned * 100).toFixed(1) + "%" : "—";
            return null;
        },
    }));
    return <DemoFrame title="项目预算执行汇总" rows={rows.length} columns={columns.length}
        hint="筛选部门后，底部汇总随当前结果更新。整体使用率＝实支合计÷全年预算合计。"
        toolbar={<Select aria-label="筛选预算部门" placeholder="全部部门" value={department || undefined} allowClear
            options={departments.map(item => ({ label: item.name, value: item.name }))}
            onChange={value => setDepartment(value ?? "")} />}
        footer={<p className={noteStyle}>全年预算 {money(planned)} · 截至8月实支 {money(actual)}</p>}>
        {(width, height) => <Table aria-label="项目预算执行与合计" width={width} height={height} rows={rows} columns={columns} showSummary />}
    </DemoFrame>;
}
