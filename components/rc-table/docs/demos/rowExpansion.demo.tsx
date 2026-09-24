export const meta = {
    title: "行展开 · 订单履约详情",
    description: "3,000 笔订单、24 列。切换到 20 行小批次可观察详情展开过渡；完整台账直接更新布局。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import { makeOrders } from "./_mock.js";
import { DemoFrame, OrderDetails, orderColumns } from "./_shared.js";
const rows = makeOrders();
const batchRows = rows.slice(0, 20);
const columns = orderColumns();
export default function RowExpansionDemo() {
    const [smallBatch, setSmallBatch] = useState(false);
    const visibleRows = smallBatch ? batchRows : rows;
    return <DemoFrame title="订单履约跟进" rows={visibleRows.length} columns={columns.length}
        toolbar={<Button isSelected={smallBatch} onClick={() => setSmallBatch(value => !value)}>20 行小批次</Button>}
        hint="点击行首箭头展开详情；每笔订单的详情由同一条业务记录生成，与表格金额和状态一致。">
        {(width, height) => <Table aria-label="可展开履约详情的订单" width={width} height={height} rows={visibleRows} columns={columns}
            defaultExpandedRowKeys={new Set([rows[0].id])} expandedRowHeight={280}
            expandedRowRender={row => <OrderDetails row={row} />} />}
    </DemoFrame>;
}
