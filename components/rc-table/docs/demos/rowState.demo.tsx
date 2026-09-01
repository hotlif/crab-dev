
export const meta = {
    title: "行状态（新增 / 修改 / 删除）",
    description: "通过 row.state 标记行的变更状态，结合自定义渲染为不同状态的行呈现不同视觉样式。",
};

import { css } from "@crab-dev/css";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import Table from "../../src/index.js";
import type { ColumnType, Row, RowState } from "../../src/index.js";
import { makeEmployees } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: {
        name: string
        department: string
        salary: number
        joinDate: string
    }
}

const STATE_CONFIG: Record<NonNullable<RowState>, { label: string; color: string; bg: string }> = {
    new:      { label: "新增",   color: "#16a34a", bg: "#dcfce7" },
    modified: { label: "已修改", color: "#b45309", bg: "#fef3c7" },
    deleted:  { label: "已删除", color: "#dc2626", bg: "#fee2e2" },
};

const wrapCell = (child: ReactNode, state?: RowState): ReactNode => (
    <div
        style={{
            width: "100%",
            height: "100%",
            opacity: state === "deleted" ? 0.45 : 1,
            textDecoration: state === "deleted" ? "line-through" : "none",
        }}
    >
        {child}
    </div>
);

const btnStyle = css`
    padding: 2px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: #f3f4f6; }
`;

const actionBarStyle = css`
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
`;

let nextId = 100;

const INITIAL_STATES: (RowState | undefined)[] = [
    undefined, "modified", "deleted", "new", undefined, undefined,
    "modified", undefined, "new", undefined, "deleted", undefined,
];

const initialRows: DemoRow[] = makeEmployees(12, 20260618).map((employee, index) => ({
    id: String(index + 1),
    state: INITIAL_STATES[index],
    dataRef: {
        name: employee.name,
        department: employee.department,
        salary: employee.salary,
        joinDate: employee.joinDate,
    },
}));

const RowStateDemo = () => {
    const [rows, setRows] = useState<DemoRow[]>(initialRows);

    const updateState = (id: DemoRow["id"], state: RowState | undefined) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, state } : r));
    };

    const addRow = () => {
        const id = String(nextId++);
        setRows(prev => [...prev, {
            id,
            state: "new",
            dataRef: { name: "新员工", department: "待分配", salary: 12000, joinDate: new Date().toISOString().slice(0, 10) },
        }]);
    };

    const columns = useMemo<ColumnType<DemoRow>[]>(() => [
        {
            title: "状态",
            name: "_state",
            width: 90,
            render: ({ row }) => {
                if (!row.state) {
                    return <div style={{ paddingInline: 8, color: "#9ca3af", fontSize: 12 }}>—</div>;
                }
                const { label, color, bg } = STATE_CONFIG[row.state];
                return (
                    <div style={{ paddingInline: 8 }}>
                        <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 11, color, backgroundColor: bg }}>
                            {label}
                        </span>
                    </div>
                );
            },
        },
        {
            title: "姓名",
            name: "name",
            width: 110,
            render: ({ row, originalElement }) => wrapCell(originalElement, row.state),
        },
        {
            title: "部门",
            name: "department",
            width: 110,
            render: ({ row, originalElement }) => wrapCell(originalElement, row.state),
        },
        {
            title: "月薪",
            name: "salary",
            width: 110,
            align: "right",
            render: ({ row, originalElement }) => wrapCell(originalElement, row.state),
        },
        {
            title: "入职日期",
            name: "joinDate",
            width: 120,
            render: ({ row, originalElement }) => wrapCell(originalElement, row.state),
        },
        {
            title: "操作",
            name: "_actions",
            selectable: false,
            render: ({ row }) => (
                <div style={{ display: "flex", gap: 4, paddingInline: 6 }}>
                    <button className={btnStyle} onClick={() => updateState(row.id, "new")}>新增</button>
                    <button className={btnStyle} onClick={() => updateState(row.id, "modified")}>修改</button>
                    <button className={btnStyle} onClick={() => updateState(row.id, "deleted")}>删除</button>
                    <button className={btnStyle} onClick={() => updateState(row.id, undefined)}>重置</button>
                </div>
            ),
        },
    ], []);

    return (
        <div>
            <div className={actionBarStyle}>
                <button className={btnStyle} onClick={addRow}>+ 新增行</button>
                <button className={btnStyle} onClick={() => setRows(initialRows)}>重置全部</button>
            </div>
            <Table
                width={780}
                height={260}
                columns={columns}
                rows={rows}
            />
        </div>
    );
};

export default RowStateDemo;
