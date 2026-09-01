
export const meta = {
    title: "编辑单元格",
    description: "双击单元格进入编辑，支持回车提交与失焦提交",
};

import { css, cx } from "@crab-dev/css";
import { useMemo, useState } from "react";

import Table from "../../src/index.js";
import type { CellEditRecord, ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const columnTitleMap: Record<string, string> = {
    "$.name": "姓名",
    "$.age": "年龄",
    "$.department": "部门",
    "$.jobTitle": "职位",
    "$.city": "城市",
    "$.salary": "月薪",
    "$.status": "状态",
};

const formatTime = (ts: number) => {
    const d = new Date(ts);
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(n => String(n).padStart(2, "0"))
        .join(":");
};

const initialRows: DemoRow[] = makeEmployees(1000, 20260613).map((employee, index) => ({
    id: String(index + 1),
    dataRef: employee,
}));

const inputStyle = css`
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
    padding-inline: 8px;
    font-size: 13px;
    outline: none;
`;

const selectStyle = css`
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
    padding-inline: 8px;
    font-size: 13px;
    outline: none;
    background-color: #fff;
`;

const hintStyle = css`
    margin-top: 10px;
    color: #666;
    font-size: 12px;
`;

const historyWrapStyle = css`
    margin-top: 16px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
    width: 980px;
`;

const historyHeaderStyle = css`
    padding: 8px 12px;
    background-color: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    font-size: 12px;
    font-weight: 500;
    color: #333;
`;

const historyListStyle = css`
    max-height: 160px;
    overflow-y: auto;
`;

const historyItemStyle = css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    font-size: 12px;
    border-bottom: 1px solid #f5f5f5;
    color: #333;

    &:last-child {
        border-bottom: 0;
    }
`;

const historyTimeStyle = css`
    color: #bbb;
    flex-shrink: 0;
    width: 64px;
`;

const historyEmpStyle = css`
    color: #888;
    flex-shrink: 0;
    width: 100px;
`;

const historyFieldStyle = css`
    color: #666;
    flex-shrink: 0;
    width: 32px;
`;

const historyOldStyle = css`
    text-decoration: line-through;
    color: #cf1322;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const historyArrowStyle = css`
    color: #ccc;
    flex-shrink: 0;
`;

const historyNewStyle = css`
    color: #389e0d;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const historyEmptyStyle = css`
    padding: 20px;
    text-align: center;
    color: #bbb;
    font-size: 12px;
`;

const EditDemo = () => {
    const [rows, setRows] = useState<DemoRow[]>(initialRows);
    const [editRecords, setEditRecords] = useState<CellEditRecord[]>([]);

    const findEmployeeNo = (rowId: CellEditRecord["rowId"]) =>
        rows.find(r => r.id === rowId)?.dataRef.employeeNo ?? String(rowId);

    const patchRow = (rowId: DemoRow["id"], key: keyof DemoRow["dataRef"], value: string | number) => {
        setRows((prev) => {
            return prev.map((row) => {
                if (row.id !== rowId) {
                    return row;
                }
                return {
                    ...row,
                    dataRef: {
                        ...row.dataRef,
                        [key]: value
                    }
                };
            });
        });
    };

    const columns = useMemo<ColumnType<DemoRow>[]>(() => {
        return [
            {
                title: "工号",
                name: "$.employeeNo",
                width: 140
            },
            {
                title: "姓名",
                name: "$.name",
                width: 160,
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            value={String(editorValue ?? row.dataRef.name)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const nextValue = event.target.value.trim() || row.dataRef.name;
                                patchRow(row.id, "name", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const target = event.currentTarget;
                                    const nextValue = target.value.trim() || row.dataRef.name;
                                    patchRow(row.id, "name", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "年龄",
                name: "$.age",
                width: 100,
                align: "right",
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            type="number"
                            value={String(editorValue ?? row.dataRef.age)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const parsed = Number.parseInt(event.target.value, 10);
                                const nextValue = Number.isNaN(parsed) ? row.dataRef.age : parsed;
                                patchRow(row.id, "age", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const parsed = Number.parseInt(event.currentTarget.value, 10);
                                    const nextValue = Number.isNaN(parsed) ? row.dataRef.age : parsed;
                                    patchRow(row.id, "age", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "部门",
                name: "$.department",
                width: 140,
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            value={String(editorValue ?? row.dataRef.department)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const nextValue = event.target.value.trim() || row.dataRef.department;
                                patchRow(row.id, "department", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const target = event.currentTarget;
                                    const nextValue = target.value.trim() || row.dataRef.department;
                                    patchRow(row.id, "department", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "职位",
                name: "$.jobTitle",
                width: 160,
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            value={String(editorValue ?? row.dataRef.jobTitle)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const nextValue = event.target.value.trim() || row.dataRef.jobTitle;
                                patchRow(row.id, "jobTitle", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const nextValue = event.currentTarget.value.trim() || row.dataRef.jobTitle;
                                    patchRow(row.id, "jobTitle", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "城市",
                name: "$.city",
                width: 110,
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            value={String(editorValue ?? row.dataRef.city)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const nextValue = event.target.value.trim() || row.dataRef.city;
                                patchRow(row.id, "city", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const nextValue = event.currentTarget.value.trim() || row.dataRef.city;
                                    patchRow(row.id, "city", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "月薪",
                name: "$.salary",
                width: 120,
                align: "right",
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    return (
                        <input
                            autoFocus
                            className={inputStyle}
                            type="number"
                            value={String(editorValue ?? row.dataRef.salary)}
                            onChange={(event) => {
                                onEditorValueChange(event.target.value);
                            }}
                            onBlur={(event) => {
                                const parsed = Number.parseInt(event.target.value, 10);
                                const nextValue = Number.isNaN(parsed) ? row.dataRef.salary : parsed;
                                patchRow(row.id, "salary", nextValue);
                                onCommit?.();
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const parsed = Number.parseInt(event.currentTarget.value, 10);
                                    const nextValue = Number.isNaN(parsed) ? row.dataRef.salary : parsed;
                                    patchRow(row.id, "salary", nextValue);
                                    onCommit?.();
                                }
                            }}
                        />
                    );
                }
            },
            {
                title: "状态",
                name: "$.status",
                width: 120,
                editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => {
                    const currentValue = String(editorValue ?? row.dataRef.status) as DemoRow["dataRef"]["status"];
                    return (
                        <select
                            autoFocus
                            className={selectStyle}
                            value={currentValue}
                            onChange={(event) => {
                                const nextValue = event.target.value as DemoRow["dataRef"]["status"];
                                onEditorValueChange(nextValue);
                                patchRow(row.id, "status", nextValue);
                                onCommit?.(nextValue);
                            }}
                            onBlur={() => {
                                onCommit?.();
                            }}
                        >
                            <option value="在职">在职</option>
                            <option value="试用">试用</option>
                            <option value="离职">离职</option>
                        </select>
                    );
                }
            }
        ];
    }, [rows]);

    return (
        <div>
            <Table
                width={980}
                height={260}
                columns={columns}
                rows={rows}
                editType="cell"
                cellEditRecords={editRecords}
                onCellEditRecordsChange={setEditRecords}
            />
            <div className={cx(hintStyle)}>双击姓名、年龄、部门、职位、城市、月薪或状态单元格可编辑。</div>
            <div className={historyWrapStyle}>
                <div className={historyHeaderStyle}>
                    编辑历史（共 {editRecords.length} 条，Ctrl+Z 撤销）
                </div>
                <div className={historyListStyle}>
                    {editRecords.length === 0 ? (
                        <div className={historyEmptyStyle}>暂无编辑记录</div>
                    ) : (
                        [...editRecords].reverse().map((record, i) => (
                            <div key={`${record.timestamp}-${i}`} className={historyItemStyle}>
                                <span className={historyTimeStyle}>{formatTime(record.timestamp)}</span>
                                <span className={historyEmpStyle}>{findEmployeeNo(record.rowId)}</span>
                                <span className={historyFieldStyle}>{columnTitleMap[record.columnName] ?? record.columnName}</span>
                                <span className={historyOldStyle}>{String(record.oldValue)}</span>
                                <span className={historyArrowStyle}>→</span>
                                <span className={historyNewStyle}>{String(record.newValue)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditDemo;
