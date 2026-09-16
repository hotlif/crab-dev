export const meta = {
    title: "行变更状态 · 盘点差异暂存",
    description: "2,000 条库存、25 列，标记新增批次、待复核和移除记录；每条变更均可还原。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { makeInventory, type InventoryRow } from "./_mock.js";
import { DemoFrame, inventoryColumns, noteStyle } from "./_shared.js";
const initialRows = makeInventory();
export default function RowStateDemo() {
    const [rows, setRows] = useState(initialRows);
    const [nextId, setNextId] = useState(1);
    const [message, setMessage] = useState("");
    const restore = (row: InventoryRow) => {
        const original = initialRows.find(item => item.id === row.id);
        setRows(previous => original ? previous.map(item => item.id === row.id ? original : item) : previous.filter(item => item.id !== row.id));
        setMessage(String(row.id) + " 的暂存变更已撤销。");
    };
    const columns: ColumnType<InventoryRow>[] = [...inventoryColumns()];
    columns.splice(1, 0,
        { name: "change", title: "暂存状态", width: 120, render: ({ row }) => row.state === "new" ? "＋ 新增批次"
            : row.state === "modified" ? "✎ 待复核" : row.state === "deleted" ? "− 待移除" : "未变更" },
        { name: "actions", title: "差异处理", width: 260, selectable: false, render: ({ row }) => <>
            <Button size="small" disabled={Boolean(row.state)} onClick={() => setRows(previous => previous.map(item => item.id === row.id
                ? { ...item, state: "modified", dataRef: { ...item.dataRef, note: "实物盘点存在差异，已登记并等待仓库负责人复核。" } } : item))}>标记复核</Button>
            <Button size="small" disabled={Boolean(row.state)} onClick={() => setRows(previous => previous.map(item => item.id === row.id
                ? { ...item, state: "deleted" } : item))}>暂存移除</Button>
            <Button size="small" disabled={!row.state} onClick={() => restore(row)}>还原</Button>
        </> },
    );
    return <DemoFrame title="盘点差异暂存清单" rows={rows.length} columns={columns.length}
        hint="操作只标记待提交变更，移除记录仍保留并可还原；新增一条演示入库批次后，也可用「还原」撤销。"
        toolbar={<Button onClick={() => {
            const id = "INV-NEW-" + String(nextId).padStart(4, "0");
            const sample = initialRows[nextId % initialRows.length].dataRef;
            setRows(previous => [{ id, state: "new", dataRef: { ...sample, recordNo: id, batch: "LOT-20260912-" + nextId,
                onHand: 0, reserved: 0, available: 0, value: 0, status: "待入库", note: "到货数量待盘点确认。" } }, ...previous]);
            setNextId(value => value + 1); setMessage("已新增一个待入库批次。");
        }}>新增入库批次</Button>}
        footer={<p className={noteStyle} role="status">{message} 待提交变更 {rows.filter(row => row.state).length} 条。</p>}>
        {(width, height) => <Table aria-label="带变更标记的盘点差异清单" width={width} height={height} rows={rows} columns={columns} />}
    </DemoFrame>;
}
