export const meta = {
    title: "单元格选择 · 月度预算核对",
    description: "1,200 条预算、23 列；跨行、跨月框选数据，支持 Shift 扩选与 Ctrl/⌘ 多选。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import { makeBudgets } from "./_mock.js";
import { DemoFrame, budgetColumns, noteStyle } from "./_shared.js";
const rows = makeBudgets();
const columns = budgetColumns();
export default function SelectCellsDemo() {
    const [selectCells, setSelectCells] = useState<Key[]>([]);
    return <DemoFrame title="月度预算交叉核对" rows={rows.length} columns={columns.length}
        hint="拖拽框选相邻月份与项目；Shift 扩选、Ctrl/⌘ 切换单格。横向滚动可查看全部月份。"
        toolbar={<Button disabled={!selectCells.length} onClick={() => setSelectCells([])}>清除选区</Button>}
        footer={<p className={noteStyle} role="status">已选择 {selectCells.length} 个单元格</p>}>
        {(width, height) => <Table aria-label="可框选的月度预算明细" width={width} height={height} rows={rows} columns={columns}
            selectCells={selectCells} onSelectCellsChange={setSelectCells} />}
    </DemoFrame>;
}
