export const meta = {
    title: "空状态 · 查询无匹配订单",
    description: "3,000 笔订单、24 列，演示真实查询产生的空结果，清空关键字可恢复全部数据。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Table from "../../src/index.js";
import { makeOrders } from "./_mock.js";
import { DemoFrame, orderColumns } from "./_shared.js";
const allRows = makeOrders();
const columns = orderColumns();
export default function EmptyDemo() {
    const [query, setQuery] = useState("SO-2026-999999");
    const rows = allRows.filter(row => (row.dataRef.orderNo + row.dataRef.customer).toLowerCase().includes(query.trim().toLowerCase()));
    return <DemoFrame title="订单检索" rows={rows.length} columns={columns.length}
        hint="初始关键字没有匹配结果；清空后恢复 3,000 笔订单，列结构保持稳定。"
        toolbar={<><LineEdit aria-label="订单号或客户名称" value={query} onChange={event => setQuery(event.target.value)} />
            <Button disabled={!query} onClick={() => setQuery("")}>清空查询</Button></>}>
        {(width, height) => <Table aria-label="订单查询结果" width={width} height={height} rows={rows} columns={columns}
            empty={<div>未找到订单号或客户名称包含“{query}”的记录。请核对关键字。</div>} />}
    </DemoFrame>;
}
