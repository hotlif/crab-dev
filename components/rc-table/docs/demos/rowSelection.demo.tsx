export const meta = {
    title: "行选中 · 采购订单审核",
    description: "3,000 笔订单、24 列，选择待审核订单后批量通过；其他状态禁止选择，操作结果可撤销。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import Select from "@crab-dev/rc-select";
import Table from "../../src/index.js";
import { makeOrders, money, type OrderRow } from "./_mock.js";
import { approveOrders } from "./_operations.js";
import { DemoFrame, orderColumns, noteStyle } from "./_shared.js";
const initialRows = makeOrders();
const columns = orderColumns();
export default function RowSelectionDemo() {
    const [rows, setRows] = useState(initialRows);
    const [selected, setSelected] = useState<Set<Key>>(new Set());
    const [single, setSingle] = useState(false);
    const [previous, setPrevious] = useState<OrderRow[] | null>(null);
    const [message, setMessage] = useState("");
    const selectedRows = rows.filter(row => selected.has(row.id) && row.dataRef.status === "待审核");
    return <DemoFrame title="采购订单审核工作台" rows={rows.length} columns={columns.length}
        hint="仅「待审核」订单可选，审核通过后进入「待发货」。本示例操作仅保存在当前页面，可撤销最近一批。"
        toolbar={<>
            <Select aria-label="选择模式" value={single ? "single" : "multiple"}
                options={[{ label: "批量审核（多选）", value: "multiple" }, { label: "逐单审核（单选）", value: "single" }]}
                onChange={value => { setSingle(value === "single"); setSelected(new Set()); }} />
            <Button appearance="primary" disabled={!selectedRows.length} onClick={() => {
                setPrevious(rows); setRows(approveOrders(rows, selected)); setSelected(new Set());
                setMessage("已通过 " + selectedRows.length + " 笔订单，进入待发货状态。");
            }}>审核通过（{selectedRows.length}）</Button>
            <Button disabled={!previous} onClick={() => {
                if (previous) setRows(previous);
                setPrevious(null); setSelected(new Set()); setMessage("已撤销最近一批审核。");
            }}>撤销最近审核</Button>
        </>}
        footer={<div className={noteStyle} role="status">已选订单额 {money(selectedRows.reduce((sum, row) => sum + row.dataRef.amount, 0))}。{message}</div>}>
        {(width, height) => <Table aria-label="待审核采购订单选择" width={width} height={height} rows={rows} columns={columns}
            rowSelection={{ type: single ? "radio" : "checkbox", selectedRowIds: selected,
                onChange: setSelected, getDisabled: row => row.dataRef.status !== "待审核" }} />}
    </DemoFrame>;
}
