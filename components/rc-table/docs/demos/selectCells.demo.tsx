
/**
 * title = "单元格选择"
 * description = "类似 Excel 的单元格选区：点击选中、按住拖拽框选、Shift 扩选、Ctrl/⌘ 切换单格"
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

const rows: DemoRow[] = Array.from({ length: 200 }, (_, index) => {
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
    { title: "姓名", name: "$.name", width: 160 },
    { title: "部门", name: "$.department", width: 140 },
    { title: "城市", name: "$.city", width: 140 },
    { title: "月薪", name: "$.salary", width: 140, align: "right" }
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
