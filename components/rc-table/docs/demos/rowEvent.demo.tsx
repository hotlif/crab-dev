export const meta = {
    title: "行点击与行双击",
    description: "通过 `onRowClick` / `onRowDoubleClick` 监听行事件。传入后行即成为可点击目标（pointer 光标 + hover 反馈），也可用键盘触发：点选行内任一单元格后按 Enter。点在复选框、展开图标、操作按钮等控件上时不会触发行事件；单元格拖选之后的那次抬起也不算点击。",
};

import { useState, type Key } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row, RowSelection } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const rows: DemoRow[] = makeEmployees(30, 20260617).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: employee,
}));

const MAX_LOG = 6;

const RowEventDemo = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<Set<Key>>(new Set());
    const [logs, setLogs] = useState<string[]>([]);
    const [detailRow, setDetailRow] = useState<DemoRow | null>(null);

    // 序号随日志条数递增，避免在渲染期读取时间造成的不确定性
    const appendLog = (message: string) => {
        setLogs(prev => [`${prev.length + 1}. ${message}`, ...prev].slice(0, MAX_LOG));
    };

    const columns: ColumnType<DemoRow>[] = [
        { name: "employeeNo", title: "工号", width: 110 },
        { name: "name", title: "姓名", width: 100 },
        { name: "department", title: "部门", width: 110 },
        { name: "city", title: "城市", width: 90 },
        {
            name: "salary", title: "薪资", width: 110, align: "right",
            render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}`,
        },
        {
            name: "action", title: "操作", width: 90, align: "center",
            // 单元格内的按钮自己消费点击，不会连带触发 onRowClick
            render: ({ row }) => (
                <button
                    type="button"
                    style={{ cursor: "pointer", fontSize: 12, padding: "2px 8px" }}
                    onClick={() => appendLog(`点了「${row.dataRef.name}」行内的操作按钮（未触发行点击）`)}
                >
                    操作
                </button>
            ),
        },
    ];

    const rowSelection: RowSelection<DemoRow> = {
        type: "checkbox",
        selectedRowIds,
        onChange: (ids) => {
            setSelectedRowIds(ids);
            appendLog(`勾选复选框，已选 ${ids.size} 行（未触发行点击）`);
        },
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#666" }}>
                单击行查看反馈，双击行打开详情；也可点选某个单元格后按 <kbd>Enter</kbd> 触发行点击。
                试着点复选框、展开图标或「操作」按钮——它们不会触发行事件。
            </div>

            <div
                style={{
                    minHeight: 96,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "#fafafa",
                    border: "1px solid #eee",
                    fontSize: 12.5,
                    lineHeight: 1.9,
                    color: "#444",
                }}
            >
                {detailRow && (
                    <div style={{ marginBottom: 6, fontWeight: 600, color: "#1a1a1a" }}>
                        详情：{detailRow.dataRef.name} · {detailRow.dataRef.department} · {detailRow.dataRef.jobTitle}
                    </div>
                )}
                {logs.length === 0
                    ? <span style={{ color: "#999" }}>尚无事件</span>
                    : logs.map(log => <div key={log}>{log}</div>)}
            </div>

            <Table
                width={820}
                height={420}
                rows={rows}
                columns={columns}
                rowSelection={rowSelection}
                expandedRowRender={(row) => (
                    <div style={{ padding: 12, fontSize: 13 }}>
                        {row.dataRef.name}（{row.dataRef.jobTitle}）· 绩效 {row.dataRef.performance} · 状态 {row.dataRef.status}
                    </div>
                )}
                onRowClick={(row, rowIndex) => {
                    appendLog(`单击第 ${rowIndex + 1} 行：${row.dataRef.name}`);
                }}
                onRowDoubleClick={(row, rowIndex) => {
                    setDetailRow(row);
                    appendLog(`双击第 ${rowIndex + 1} 行：${row.dataRef.name}，打开详情`);
                }}
            />
        </div>
    );
};

export default RowEventDemo;
