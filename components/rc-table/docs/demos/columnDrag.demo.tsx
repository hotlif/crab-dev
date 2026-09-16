export const meta = {
    title: "列顺序调整 · 人员信息工作台",
    description: "2,000 名员工、22 列；岗位、区域、合同与薪酬分组可整体拖动，组内字段也可重排。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { employeeRows, type EmployeeRow } from "./_mock.js";
import { DemoFrame, employeeColumns, noteStyle } from "./_shared.js";
const rows = employeeRows();
const leaf = employeeColumns();
const initialColumns: ColumnType<EmployeeRow>[] = [
    leaf[0], leaf[1],
    { name: "work", title: "岗位与组织", children: leaf.slice(2, 7) },
    { name: "location", title: "办公与联系", children: leaf.slice(7, 12) },
    { name: "contract", title: "合同与项目", children: leaf.slice(12, 17) },
    { name: "compensation", title: "年度薪酬", children: leaf.slice(17, 21) },
    leaf[21],
];
export default function ColumnDragDemo() {
    const [columns, setColumns] = useState(initialColumns);
    return <DemoFrame title="人员信息工作台" rows={rows.length} columns={leaf.length}
        hint="拖拽分组表头整体移动，组内子列可单独排序；工号固定，恢复按钮可还原布局。"
        toolbar={<Button onClick={() => setColumns(initialColumns)}>恢复默认列顺序</Button>}
        footer={<p className={noteStyle} role="status">当前布局：{columns.map(col => col.title).join(" → ")}</p>}>
        {(width, height) => <Table aria-label="可调整列顺序的人员信息" width={width} height={height} rows={rows} columns={columns} draggableColumns
            onColumnOrderChange={names => setColumns(previous => {
                const byName = new Map(previous.map(col => [col.name, col]));
                const ordered = names.flatMap(name => { const col = byName.get(name); return col ? [col] : []; });
                let index = 0;
                return previous.map(col => col.fixed ? col : ordered[index++] ?? col);
            })}
            onGroupColumnOrderChange={(name, names) => setColumns(previous => previous.map(col => {
                if (col.name !== name || !col.children) return col;
                const children = col.children;
                return { ...col, children: names.flatMap(childName => children.filter(child => child.name === childName)) };
            }))} />}
    </DemoFrame>;
}
