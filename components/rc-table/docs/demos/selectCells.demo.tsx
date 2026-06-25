
/**
 * title = "单元格选择"
 * description = "类似 Excel 的单元格选区：点击选中、按住拖拽框选、Shift 扩选、Ctrl/⌘ 切换单格"
 */

import { css } from "@linaria/core";
import { type Key, useState } from "react";

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const rows: DemoRow[] = makeEmployees(200, 20260612).map((employee, index) => ({
    id: String(index + 1),
    dataRef: employee,
}));

const columns: ColumnType<DemoRow>[] = [
    { title: "工号", name: "$.employeeNo", width: 130, fixed: "left" },
    { title: "姓名", name: "$.name", width: 120 },
    { title: "部门", name: "$.department", width: 130 },
    { title: "职位", name: "$.jobTitle", width: 150 },
    { title: "城市", name: "$.city", width: 110 },
    { title: "月薪", name: "$.salary", width: 130, align: "right" }
];

const hintStyle = css`
    margin-bottom: 10px;
    color: #555;
    font-size: 12px;
    line-height: 1.6;
`;

const countStyle = css`
    margin-top: 10px;
    color: #1976d2;
    font-size: 12px;
`;

const SelectCellsDemo = () => {
    const [selectCells, setSelectCells] = useState<Key[]>([]);

    return (
        <div>
            <div className={hintStyle}>
                · 单击：选中单个单元格<br />
                · 按住左键拖拽：框选矩形区域<br />
                · Shift + 单击：从锚点扩展到目标单元格<br />
                · Ctrl / ⌘ + 单击：切换该单元格的选中状态
            </div>
            <Table
                width={720}
                height={360}
                columns={columns}
                rows={rows}
                selectCells={selectCells}
                onSelectCellsChange={setSelectCells}
            />
            <div className={countStyle}>当前选中单元格数：{selectCells.length}</div>
        </div>
    );
};

export default SelectCellsDemo;
