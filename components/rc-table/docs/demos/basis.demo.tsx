export const meta = {
    title: "基础表格 · 企业采购订单",
    description: "3,000 笔采购订单、24 列，覆盖客户、商品、折扣、收款、仓储和交付信息，订单金额与收款状态相互关联。",
};
import Table from "../../src/index.js";
import { makeOrders } from "./_mock.js";
import { DemoFrame, orderColumns } from "./_shared.js";
const rows = makeOrders();
const columns = orderColumns();
export default function BasisDemo() {
    return <DemoFrame title="企业采购订单台账" rows={rows.length} columns={columns.length}
        hint="左右滚动查看收款、物流和配送备注；订单号固定，便于核对同一笔订单。空白物流单号表示尚未发货。">
        {(width, height) => <Table aria-label="企业采购订单台账" width={width} height={height} rows={rows} columns={columns} />}
    </DemoFrame>;
}
