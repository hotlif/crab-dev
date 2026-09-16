export const meta = {
    title: "整行编辑 · 库存复核",
    description: "2,000 条库存、24 列，一次复核库存与备注，保存后更新关联数值，取消保持原始记录。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import NumberEdit from "@crab-dev/rc-number-edit";
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { makeInventory, updateInventory, type InventoryRow } from "./_mock.js";
import { DemoFrame, inventoryColumns, fieldStyle, noteStyle } from "./_shared.js";
const initialRows = makeInventory();
export default function RowEditDemo() {
    const [rows, setRows] = useState(initialRows);
    const [editingRowId, setEditingRowId] = useState<Key | null>(null);
    const [previous, setPrevious] = useState<InventoryRow[] | null>(null);
    const [message, setMessage] = useState("");
    const columns: ColumnType<InventoryRow>[] = inventoryColumns().map(column => {
        if (column.name === "$.onHand") return { ...column, title: "复核库存", width: 170,
            editRender: ({ row, editorValue, onEditorValueChange }) => <NumberEdit className={fieldStyle} size="small"
                aria-label={row.dataRef.recordNo + " 复核库存，最少 " + row.dataRef.reserved}
                min={row.dataRef.reserved} max={99999} precision={0} controls={false}
                value={typeof editorValue === "number" ? editorValue : row.dataRef.onHand} onChange={onEditorValueChange} />,
        };
        if (column.name === "$.note") return { ...column, title: "复核备注",
            editRender: ({ row, editorValue, onEditorValueChange }) => <LineEdit className={fieldStyle} size="small"
                aria-label={row.dataRef.recordNo + " 复核备注，最多120字"} maxLength={120}
                value={typeof editorValue === "string" ? editorValue : row.dataRef.note}
                onChange={event => onEditorValueChange(event.target.value)} />,
        };
        return column;
    });
    columns.splice(1, 0, { name: "actions", title: "复核操作", width: 120, selectable: false,
        render: ({ row }) => <Button size="small" disabled={editingRowId !== null} aria-label={"复核 " + row.dataRef.recordNo}
            onClick={() => setEditingRowId(row.id)}>复核</Button>,
    });
    return <DemoFrame title="仓库库存逐行复核" rows={rows.length} columns={columns.length}
        hint="点击「复核」或双击行，修改库存和备注，再点击「确认」或「取消」。库存空值保留原值，数值限制在已占用量至99,999之间。所有修改仅保存在当前页面。"
        toolbar={<Button disabled={!previous || editingRowId !== null} onClick={() => {
            if (previous) setRows(previous);
            setPrevious(null); setMessage("已撤销最近一次复核。");
        }}>撤销最近复核</Button>}
        footer={<p className={noteStyle} role="status">{message} 已修改 {rows.filter(row => row.state === "modified").length} 条。</p>}>
        {(width, height) => <Table aria-label="支持整行复核的库存清单" width={width} height={height} rows={rows} columns={columns}
            editType="row" editingRowId={editingRowId} onEditingRowIdChange={setEditingRowId}
            onRowCancel={() => setMessage("已取消复核，原记录保持不变。")}
            onRowCommit={(id, changes) => {
                const original = rows.find(row => row.id === id);
                if (!original) return;
                const quantity = changes["$.onHand"];
                const note = changes["$.note"];
                const onHand = typeof quantity === "number" && Number.isFinite(quantity)
                    ? Math.min(99999, Math.max(original.dataRef.reserved, Math.round(quantity))) : original.dataRef.onHand;
                const nextNote = typeof note === "string" ? note.trim().slice(0, 120) : original.dataRef.note;
                if (onHand === original.dataRef.onHand && nextNote === original.dataRef.note) {
                    setMessage("记录没有变化，无需保存。");
                    return;
                }
                setPrevious(rows);
                setRows(current => current.map(row => {
                    if (row.id !== id) return row;
                    return { ...row, state: "modified", dataRef: updateInventory(row.dataRef, onHand, nextNote) };
                }));
                setMessage(String(id) + " 已复核，可用库存和货值同步更新。");
            }} />}
    </DemoFrame>;
}
