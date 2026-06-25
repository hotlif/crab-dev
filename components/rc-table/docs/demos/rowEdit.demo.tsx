
/**
 * title = "行编辑"
 * description = "双击任意行进入行编辑模式，整行同时展示编辑器；在右侧工具栏确认或取消，按 Esc 快速退出"
 */

import { css, cx } from "@linaria/core";
import { type ChangeEvent, type Key, useMemo, useState } from "react";

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import {
    makeEmployees, type Employee,
    DEPARTMENTS as departments, POSITIONS as positions, CITIES as cities,
    PERFORMANCES as performances, STATUSES as statuses,
} from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const initialRows: DemoRow[] = makeEmployees(50, 20260614).map((employee, index) => ({
    id: String(index + 1),
    dataRef: employee,
    state: undefined,
}));

// ─── 编辑器 ──────────────────────────────────────────────────────────────────

const fieldStyle = css`
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    padding-inline: 8px;
    border: none;
    background-color: transparent;
    color: oklch(0.220 0.005 286);
    font-size: inherit;
    font-family: inherit;
    outline: none;
    transition: box-shadow 100ms cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
        box-shadow: inset 0 0 0 1px oklch(0.840 0.008 286);
    }
    &:focus {
        box-shadow: inset 0 0 0 2px oklch(0.220 0.005 286);
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const numberFieldStyle = css`
    text-align: right;
    appearance: textfield;
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const selectWrapperStyle = css`
    position: relative;
    width: 100%;
    height: 100%;
`;

const selectFieldStyle = css`
    padding-right: 26px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
`;

const selectArrowStyle = css`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
    color: oklch(0.550 0.014 286);
`;

interface SelectFieldProps {
    value: string
    options: readonly string[]
    onChange: (value: string) => void
}

const SelectField = ({ value, options, onChange }: SelectFieldProps) => (
    <div className={selectWrapperStyle}>
        <select
            className={cx(fieldStyle, selectFieldStyle)}
            value={value}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg
            className={selectArrowStyle}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

// ─── 状态 Tag ────────────────────────────────────────────────────────────────

const tagBaseStyle = css`
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 7px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
`;

const statusActiveStyle = css`
    background-color: oklch(0.962 0.044 150);
    color: oklch(0.527 0.154 154);
`;

const statusTrialStyle = css`
    background-color: oklch(0.932 0.032 255);
    color: oklch(0.488 0.230 264);
`;

const statusInactiveStyle = css`
    background-color: oklch(0.950 0.003 286);
    color: oklch(0.550 0.014 286);
`;

function getStatusClass(status: string) {
    if (status === "在职") return cx(tagBaseStyle, statusActiveStyle);
    if (status === "试用") return cx(tagBaseStyle, statusTrialStyle);
    return cx(tagBaseStyle, statusInactiveStyle);
}

// ─── 绩效 Tag ────────────────────────────────────────────────────────────────

const perfSStyle = css`
    background-color: oklch(0.924 0.112 81);
    color: oklch(0.473 0.137 69);
`;

const perfAStyle = css`
    background-color: oklch(0.962 0.044 150);
    color: oklch(0.527 0.154 154);
`;

const perfBStyle = css`
    background-color: oklch(0.932 0.032 255);
    color: oklch(0.488 0.230 264);
`;

const perfCStyle = css`
    background-color: oklch(0.950 0.003 286);
    color: oklch(0.550 0.014 286);
`;

function getPerfClass(perf: string) {
    if (perf === "S") return cx(tagBaseStyle, perfSStyle);
    if (perf === "A") return cx(tagBaseStyle, perfAStyle);
    if (perf === "B") return cx(tagBaseStyle, perfBStyle);
    return cx(tagBaseStyle, perfCStyle);
}

// ─── 修改标记 Tag ─────────────────────────────────────────────────────────────

const modifiedTagStyle = css`
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    background-color: oklch(0.220 0.005 286);
    color: oklch(0.980 0.002 286);
`;

// ─── Demo ─────────────────────────────────────────────────────────────────────

const RowEditDemo = () => {
    const [rows, setRows] = useState<DemoRow[]>(initialRows);
    const [editingRowId, setEditingRowId] = useState<Key | null>(null);

    const handleRowCommit = (rowId: Key, changes: Record<string, unknown>) => {
        setRows(prev => prev.map(row => {
            if (row.id !== rowId) return row;
            const updatedDataRef = { ...row.dataRef };
            for (const [colName, value] of Object.entries(changes)) {
                const key = colName.replace(/^\$\./, "") as keyof DemoRow["dataRef"];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (updatedDataRef as any)[key] = value;
            }
            return { ...row, state: "modified" as const, dataRef: updatedDataRef };
        }));
    };

    const columns = useMemo<ColumnType<DemoRow>[]>(() => [
        {
            title: "工号",
            name: "$.employeeNo",
            width: 120,
            fixed: "left",
        },
        {
            title: "姓名",
            name: "$.name",
            width: 110,
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <input
                    autoFocus
                    className={fieldStyle}
                    value={String(editorValue ?? row.dataRef.name)}
                    onChange={e => onEditorValueChange(e.target.value)}
                />
            ),
        },
        {
            title: "年龄",
            name: "$.age",
            width: 70,
            align: "right",
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <input
                    className={cx(fieldStyle, numberFieldStyle)}
                    type="number"
                    value={String(editorValue ?? row.dataRef.age)}
                    onChange={e => onEditorValueChange(e.target.value)}
                />
            ),
        },
        {
            title: "职位",
            name: "$.position",
            width: 130,
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <SelectField
                    value={String(editorValue ?? row.dataRef.position)}
                    options={positions}
                    onChange={onEditorValueChange}
                />
            ),
        },
        {
            title: "部门",
            name: "$.department",
            width: 90,
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <SelectField
                    value={String(editorValue ?? row.dataRef.department)}
                    options={departments}
                    onChange={onEditorValueChange}
                />
            ),
        },
        {
            title: "城市",
            name: "$.city",
            width: 80,
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <SelectField
                    value={String(editorValue ?? row.dataRef.city)}
                    options={cities}
                    onChange={onEditorValueChange}
                />
            ),
        },
        {
            title: "入职年份",
            name: "$.joinYear",
            width: 90,
            align: "right",
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <input
                    className={cx(fieldStyle, numberFieldStyle)}
                    type="number"
                    value={String(editorValue ?? row.dataRef.joinYear)}
                    onChange={e => onEditorValueChange(e.target.value)}
                />
            ),
        },
        {
            title: "月薪",
            name: "$.salary",
            width: 100,
            align: "right",
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <input
                    className={cx(fieldStyle, numberFieldStyle)}
                    type="number"
                    value={String(editorValue ?? row.dataRef.salary)}
                    onChange={e => onEditorValueChange(e.target.value)}
                />
            ),
        },
        {
            title: "绩效",
            name: "$.performance",
            width: 80,
            render: ({ row }) => (
                <div className={css`
                    display: flex;
                    align-items: center;
                    height: 100%;
                    padding-inline: 8px;
                `}>
                    <span className={getPerfClass(row.dataRef.performance)}>
                        {row.dataRef.performance}
                    </span>
                </div>
            ),
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <SelectField
                    value={String(editorValue ?? row.dataRef.performance)}
                    options={performances}
                    onChange={onEditorValueChange}
                />
            ),
        },
        {
            title: "状态",
            name: "$.status",
            width: 90,
            render: ({ row }) => (
                <div className={css`
                    display: flex;
                    align-items: center;
                    height: 100%;
                    padding-inline: 8px;
                `}>
                    <span className={getStatusClass(row.dataRef.status)}>
                        {row.dataRef.status}
                    </span>
                </div>
            ),
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <SelectField
                    value={String(editorValue ?? row.dataRef.status)}
                    options={statuses}
                    onChange={onEditorValueChange}
                />
            ),
        },
        {
            title: "邮箱",
            name: "$.email",
            width: 210,
            editRender: ({ row, editorValue, onEditorValueChange }) => (
                <input
                    className={fieldStyle}
                    type="email"
                    value={String(editorValue ?? row.dataRef.email)}
                    onChange={e => onEditorValueChange(e.target.value)}
                />
            ),
        },
    ], []);

    const modifiedCount = rows.filter(r => r.state === "modified").length;

    return (
        <div>
            <Table
                width={960}
                height={420}
                rows={rows}
                columns={columns}
                editType="row"
                editingRowId={editingRowId}
                onEditingRowIdChange={setEditingRowId}
                onRowCommit={handleRowCommit}
                onRowCancel={() => setEditingRowId(null)}
            />
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 10px;
                    font-size: 12px;
                    color: oklch(0.500 0 0);
                `}
            >
                <span>双击任意行进入编辑，按 Esc 或点击取消放弃修改</span>
                {modifiedCount > 0 && (
                    <span className={modifiedTagStyle}>已修改 {modifiedCount} 行</span>
                )}
            </div>
        </div>
    );
};

export default RowEditDemo;
