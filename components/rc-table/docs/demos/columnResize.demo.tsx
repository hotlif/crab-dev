export const meta = {
    title: "列宽调整 · 仓库库存台账",
    description: "2,000 条库存、23 列，拖宽商品名称、批次和备注列，核对长名称与仓位信息。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import { makeInventory } from "./_mock.js";
import { DemoFrame, inventoryColumns, noteStyle } from "./_shared.js";
const rows = makeInventory();
const initialColumns = inventoryColumns().map(col => ({ ...col, resizable: col.name !== "$.recordNo" }));
export default function ColumnResizeDemo() {
    const [columns, setColumns] = useState(initialColumns);
    const [feedback, setFeedback] = useState("");
    return <DemoFrame title="仓库库存台账" rows={rows.length} columns={columns.length}
        hint="拖拽列头右边缘调整宽度；记录号保持固定宽度。恢复按钮可还原初始布局。"
        toolbar={<Button onClick={() => { setColumns(initialColumns); setFeedback("已恢复默认列宽"); }}>恢复默认列宽</Button>}
        footer={<p className={noteStyle} role="status">{feedback}</p>}>
        {(width, height) => <Table aria-label="可调整列宽的库存台账" width={width} height={height} rows={rows} columns={columns} resizable
            onColumnResize={(name, nextWidth) => {
                setColumns(previous => previous.map(col => col.name === name ? { ...col, width: nextWidth } : col));
                setFeedback((columns.find(col => col.name === name)?.title ?? name) + "：" + Math.round(nextWidth) + " px");
            }} />}
    </DemoFrame>;
}
