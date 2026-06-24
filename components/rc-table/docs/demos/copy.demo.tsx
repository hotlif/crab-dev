
/**
 * title = "复制单元格"
 * description = "选中单元格后按 Ctrl/⌘+C，触发 onCopy 回调并将选区数据写入剪贴板（TSV 格式，可直接粘贴到 Excel）。"
 */

import { css } from "@linaria/core";
import { type Key, useState } from "react";

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: {
        employeeNo: string
        name: string
        department: string
        city: string
        salary: number
    }
}

const departments = ["前端", "后端", "产品", "设计", "测试", "运维"];
const cities = ["北京", "上海", "广州", "深圳", "杭州", "成都"];
const names = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁"];

const rows: DemoRow[] = Array.from({ length: 100 }, (_, index) => {
    const rowId = index + 1;
    return {
        id: String(rowId),
        dataRef: {
            employeeNo: `EMP-${String(rowId).padStart(4, "0")}`,
            name: `${names[index % names.length]}${String(rowId).padStart(2, "0")}`,
            department: departments[index % departments.length],
            city: cities[index % cities.length],
            salary: 12000 + (index % 30) * 1000
        }
    };
});

const columns: ColumnType<DemoRow>[] = [
    { title: "工号", name: "$.employeeNo", width: 140, fixed: "left" },
    { title: "姓名", name: "$.name", width: 120 },
    { title: "部门", name: "$.department", width: 120 },
    { title: "城市", name: "$.city", width: 120 },
    { title: "月薪", name: "$.salary", width: 120, align: "right" }
];

const hintStyle = css`
    margin-bottom: 10px;
    color: #555;
    font-size: 12px;
    line-height: 1.6;
`;

const toastStyle = css`
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    background: #f0f7ff;
    border: 1px solid #bcd8f7;
    color: #1565c0;
`;

const previewLabelStyle = css`
    font-weight: 600;
    margin-bottom: 4px;
`;

const previewStyle = css`
    margin: 0;
    padding: 6px 8px;
    border-radius: 3px;
    background: #fff;
    border: 1px solid #dde8f5;
    font-family: monospace;
    font-size: 11px;
    color: #333;
    white-space: pre;
    overflow: auto;
    max-height: 80px;
`;

type CopiedCell = { rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown };

function buildTsv(cells: CopiedCell[]): string {
    if (cells.length === 0) return "";

    const minRow = Math.min(...cells.map(c => c.rowIndex));
    const maxRow = Math.max(...cells.map(c => c.rowIndex));
    const minCol = Math.min(...cells.map(c => c.columnIndex));
    const maxCol = Math.max(...cells.map(c => c.columnIndex));

    const grid: string[][] = Array.from({ length: maxRow - minRow + 1 }, () =>
        Array.from({ length: maxCol - minCol + 1 }, () => "")
    );

    for (const cell of cells) {
        grid[cell.rowIndex - minRow][cell.columnIndex - minCol] = String(cell.value ?? "");
    }

    return grid.map(r => r.join("\t")).join("\n");
}

const CopyDemo = () => {
    const [selectCells, setSelectCells] = useState<Key[]>([]);
    const [lastCopy, setLastCopy] = useState<{ count: number; tsv: string } | null>(null);

    const handleCopy = (cells: CopiedCell[]) => {
        const tsv = buildTsv(cells);
        navigator.clipboard.writeText(tsv).catch(() => undefined);
        setLastCopy({ count: cells.length, tsv });
    };

    return (
        <div>
            <div className={hintStyle}>
                · 单击 / 拖拽 / Shift+单击 选中单元格<br />
                · 按 Ctrl / ⌘ + C 复制选区（TSV 格式，可直接粘贴到 Excel）
            </div>
            <Table
                width={640}
                height={360}
                columns={columns}
                rows={rows}
                selectCells={selectCells}
                onSelectCellsChange={setSelectCells}
                onCopy={handleCopy}
            />
            {lastCopy !== null && (
                <div className={toastStyle}>
                    <div className={previewLabelStyle}>已复制 {lastCopy.count} 个单元格</div>
                    <pre className={previewStyle}>{lastCopy.tsv}</pre>
                </div>
            )}
        </div>
    );
};

export default CopyDemo;
