export const meta = {
    title: "行事件 · 客户订单跟进",
    description: "3,000 笔订单、25 列，单击查看订单摘要，双击或使用详情按钮打开完整跟进信息。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { makeOrders, money, type OrderRow } from "./_mock.js";
import { DemoFrame, OrderDetails, orderColumns, panelStyle, noteStyle } from "./_shared.js";
const rows = makeOrders();
export default function RowEventDemo() {
    const [selected, setSelected] = useState<Set<Key>>(new Set());
    const [summary, setSummary] = useState("选择订单行查看摘要。");
    const [detail, setDetail] = useState<OrderRow | null>(null);
    const columns: ColumnType<OrderRow>[] = [...orderColumns(), {
        name: "actions", title: "跟进", width: 100, selectable: false,
        render: ({ row }) => <Button size="small" aria-label={"查看订单 " + row.dataRef.orderNo + " 详情"} onClick={() => setDetail(row)}>详情</Button>,
    }];
    return <DemoFrame title="客户订单跟进" rows={rows.length} columns={columns.length}
        hint="单击或点选单元格后按 Enter 查看摘要；双击行查看详情。详情按钮提供独立键盘入口。"
        footer={<><p className={noteStyle} role="status">{summary} 已勾选 {selected.size} 笔。</p>
            {detail && <div className={panelStyle}><Button onClick={() => setDetail(null)}>关闭详情</Button><OrderDetails row={detail} /></div>}</>}>
        {(width, height) => <Table aria-label="客户订单跟进列表" width={width} height={height} rows={rows} columns={columns}
            rowSelection={{ type: "checkbox", selectedRowIds: selected, onChange: setSelected }}
            onRowClick={row => setSummary(row.dataRef.orderNo + " · " + row.dataRef.customer + " · " + money(row.dataRef.amount) + " · " + row.dataRef.status)}
            onRowDoubleClick={row => setDetail(row)} />}
    </DemoFrame>;
}
