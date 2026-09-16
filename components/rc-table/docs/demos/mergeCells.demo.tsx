export const meta = {
    title: "合并单元格 · 区域销售台账",
    description: "3,000 笔订单、24 列，按大区、城市和客户经理排序后合并连续归属信息。",
};
import Table from "../../src/index.js";
import type { MergeCell } from "../../src/types.js";
import { makeOrders, type OrderRow } from "./_mock.js";
import { DemoFrame, orderColumns } from "./_shared.js";
const compare = (a: string, b: string) => a.localeCompare(b, "zh-CN");
const rows = makeOrders().sort((a, b) => compare(a.dataRef.region, b.dataRef.region)
    || compare(a.dataRef.city, b.dataRef.city) || compare(a.dataRef.owner, b.dataRef.owner));
const fields = orderColumns().map(col => ({ ...col, fixed: undefined }));
const columns = [fields[3], fields[4], fields[5], ...fields.filter(col => !["$.region", "$.city", "$.owner"].includes(col.name))];
// rowSpan / colSpan 在 Table 中表示额外覆盖的行列数。
function merge(columnIndex: number, groupKey: (row: OrderRow) => string): MergeCell[] {
    const result: MergeCell[] = [];
    let start = 0;
    while (start < rows.length) {
        let end = start + 1;
        while (end < rows.length && groupKey(rows[start]) === groupKey(rows[end])) end++;
        if (end - start > 1) result.push({ rowIndex: start, columnIndex, rowSpan: end - start - 1, colSpan: 0 });
        start = end;
    }
    return result;
}
const mergeCells = [
    ...merge(0, row => row.dataRef.region),
    ...merge(1, row => row.dataRef.region + "/" + row.dataRef.city),
    ...merge(2, row => row.dataRef.region + "/" + row.dataRef.city + "/" + row.dataRef.owner),
];
export default function MergeCellsDemo() {
    return <DemoFrame title="区域销售归属台账" rows={rows.length} columns={columns.length}
        hint="相同大区、城市和客户经理连续合并，订单明细逐行保留；归属单元格与横向、纵向滚动共同移动。">
        {(width, height) => <Table aria-label="合并区域归属单元格的销售台账" width={width} height={height} rows={rows} columns={columns} mergeCells={mergeCells} />}
    </DemoFrame>;
}
