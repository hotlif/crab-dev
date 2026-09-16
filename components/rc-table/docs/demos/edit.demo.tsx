export const meta = {
    title: "单元格编辑 · 库存盘点修正",
    description: "2,000 条库存、23 列，编辑账面库存和盘点备注，自动重算可用库存与货值，支持撤销。",
};
import { useState } from "react";
import LineEdit from "@crab-dev/rc-line-edit";
import NumberEdit from "@crab-dev/rc-number-edit";
import Table from "../../src/index.js";
import type { CellEditRecord, ColumnType } from "../../src/types.js";
import { makeInventory, updateInventory, type InventoryRow } from "./_mock.js";
import { DemoFrame, inventoryColumns, fieldStyle, noteStyle } from "./_shared.js";
const initialRows = makeInventory();
export default function EditDemo() {
    const [rows, setRows] = useState(initialRows);
    const [records, setRecords] = useState<CellEditRecord[]>([]);
    const [message, setMessage] = useState("");
    const patch = (id: InventoryRow["id"], key: string, value: unknown) => {
        setRows(previous => previous.map(row => {
            if (row.id !== id) return row;
            const onHand = key === "$.onHand" && typeof value === "number" ? value : row.dataRef.onHand;
            const note = key === "$.note" && typeof value === "string" ? value : row.dataRef.note;
            return { ...row, dataRef: updateInventory(row.dataRef, onHand, note) };
        }));
    };
    const columns: ColumnType<InventoryRow>[] = inventoryColumns().map(column => {
        if (column.name === "$.onHand") return { ...column, title: "账面库存（可编辑）", width: 190,
            editRender: ({ row, editorValue, onEditorValueChange, onCommit, onCancel }) => <NumberEdit
                className={fieldStyle} size="small" autoFocus controls={false}
                aria-label={row.dataRef.recordNo + " 账面库存，最少 " + row.dataRef.reserved}
                min={row.dataRef.reserved} max={99999} precision={0}
                value={typeof editorValue === "number" ? editorValue : row.dataRef.onHand}
                onChange={onEditorValueChange}
                onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onCancel?.(); } }}
                onBlur={event => {
                    const text = event.currentTarget.value.trim();
                    const parsed = Number(text);
                    const value = text && Number.isFinite(parsed) ? Math.min(99999, Math.max(row.dataRef.reserved, Math.round(parsed))) : row.dataRef.onHand;
                    patch(row.id, column.name, value); onCommit?.(value);
                    setMessage(row.dataRef.recordNo + " 库存已保存，可用库存和货值已更新。");
                }} />,
        };
        if (column.name === "$.note") return { ...column, title: "盘点备注（可编辑）",
            editRender: ({ row, editorValue, onEditorValueChange, onCommit, onCancel }) => <LineEdit
                className={fieldStyle} size="small" autoFocus maxLength={120}
                aria-label={row.dataRef.recordNo + " 盘点备注，最多120字"}
                value={typeof editorValue === "string" ? editorValue : row.dataRef.note}
                onChange={event => onEditorValueChange(event.target.value)}
                onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onCancel?.(); } }}
                onBlur={event => {
                    const value = event.currentTarget.value.trim();
                    patch(row.id, column.name, value); onCommit?.(value); setMessage("盘点备注已保存。");
                }} />,
        };
        return column;
    });
    return <DemoFrame title="库存盘点修正" rows={rows.length} columns={columns.length}
        hint="横向滚动到「账面库存」或「盘点备注」，双击或用键盘进入编辑；Enter/Tab/失焦保存，Esc 放弃。库存不得低于已占用量；留空保留原库存，备注最多120字。Ctrl/⌘+Z 撤销。"
        footer={<div className={noteStyle} role="status">{message} 编辑记录 {records.length} 条。
            {records.slice(-3).map((record, index) => <p key={record.rowId + ":" + record.columnName + ":" + index}>
                {String(record.rowId)}：{Array.isArray(record.oldValue) ? record.oldValue.join("") : String(record.oldValue ?? "空")}
                {" → "}{String(record.newValue ?? "空")}
            </p>)}</div>}>
        {(width, height) => <Table aria-label="可编辑的库存盘点清单" width={width} height={height} rows={rows} columns={columns}
            editType="cell" cellEditRecords={records} onCellEditRecordsChange={setRecords}
            onUndo={record => {
                patch(record.rowId, record.columnName, Array.isArray(record.oldValue) ? record.oldValue[0] : record.oldValue);
                setMessage("已撤销最近一次修改，并重算关联库存数据。");
            }} />}
    </DemoFrame>;
}
