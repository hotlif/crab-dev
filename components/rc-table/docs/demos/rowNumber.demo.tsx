export const meta = {
    title: "行序号 · 库存盘点清单",
    description: "2,000 条库存、23 个业务列，排序与仓库分组后保持数据行连续编号。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import { makeInventory } from "./_mock.js";
import { DemoFrame, inventoryColumns } from "./_shared.js";
const rows = makeInventory();
const columns = inventoryColumns().map(col => ({ ...col, sortable: true }));
export default function RowNumberDemo() {
    const [grouped, setGrouped] = useState(false);
    return <DemoFrame title="每日库存盘点清单" rows={rows.length} columns={columns.length}
        hint="序号表示当前清单顺序，库存记录号是稳定业务标识；排序后序号连续，分组标题不占用序号。"
        toolbar={<Button isSelected={grouped} onClick={() => setGrouped(value => !value)}>按仓库分组</Button>}>
        {(width, height) => <Table aria-label="带连续行序号的库存盘点清单" width={width} height={height} rows={rows} columns={columns}
            showRowNumber groupBy={grouped ? ["$.warehouse"] : undefined} defaultExpandAll />}
    </DemoFrame>;
}
