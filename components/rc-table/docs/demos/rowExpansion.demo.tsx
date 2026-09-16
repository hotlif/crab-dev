export const meta = {
    title: "行展开 · 订单履约详情",
    description: "3,000 笔订单、24 列，展开核对收货地址、商品计算、付款和物流详情。",
};
import Table from "../../src/index.js";
import { makeOrders } from "./_mock.js";
import { DemoFrame, OrderDetails, orderColumns } from "./_shared.js";
const rows = makeOrders();
const columns = orderColumns();
export default function RowExpansionDemo() {
    return <DemoFrame title="订单履约跟进" rows={rows.length} columns={columns.length}
        hint="点击行首箭头展开详情；每笔订单的详情由同一条业务记录生成，与表格金额和状态一致。">
        {(width, height) => <Table aria-label="可展开履约详情的订单" width={width} height={height} rows={rows} columns={columns}
            defaultExpandedRowKeys={new Set([rows[0].id])} expandedRowHeight={280}
            expandedRowRender={row => <OrderDetails row={row} />} />}
    </DemoFrame>;
}
