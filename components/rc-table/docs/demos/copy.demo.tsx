export const meta = {
    title: "复制单元格 · 库存对账",
    description: "2,000 条库存、23 列，框选后复制 TSV 到电子表格，保留稀疏选区空位与多行备注。",
};
import { useState, type Key } from "react";
import TextEdit from "@crab-dev/rc-text-edit";
import Table from "../../src/index.js";
import { makeInventory } from "./_mock.js";
import { buildTsv, type CopiedCell } from "./_operations.js";
import { DemoFrame, inventoryColumns, noteStyle } from "./_shared.js";
const rows = makeInventory();
const columns = inventoryColumns();
export default function CopyDemo() {
    const [selectCells, setSelectCells] = useState<Key[]>([]);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState("");
    const copy = async (cells: CopiedCell[]) => {
        const tsv = buildTsv(cells);
        if (!tsv) { setMessage("请先选择需要复制的单元格。"); return; }
        setPreview(tsv);
        try {
            await navigator.clipboard.writeText(tsv);
            setMessage("已复制 " + cells.length + " 个单元格，可粘贴到电子表格。");
        } catch {
            setMessage("浏览器未允许剪贴板访问，请在下方文本框中全选并复制。");
        }
    };
    return <DemoFrame title="库存对账数据提取" rows={rows.length} columns={columns.length}
        hint="框选商品、库位与库存数量，按 Ctrl/⌘+C 复制。数值以原始数字输出，便于继续计算。"
        footer={<><p className={noteStyle} role="status">{message || "已选择 " + selectCells.length + " 个单元格"}</p>
            {preview && <TextEdit aria-label="复制内容（只读，可全选复制）" rows={3} readOnly value={preview} />}</>}>
        {(width, height) => <Table aria-label="可复制的库存对账数据" width={width} height={height} rows={rows} columns={columns}
            selectCells={selectCells} onSelectCellsChange={setSelectCells} onCopy={copy} />}
    </DemoFrame>;
}
