
/**
 * title = "编辑单元格"
 * description = "双击单元格进入编辑，支持回车提交与失焦提交"
 */

import { css, cx } from "@linaria/core";
import { useMemo, useState } from "react";

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: {
        employeeNo: string
        name: string
        age: number
        department: string
        salary: number
        status: "在职" | "试用" | "离职"
    }
}

const departments: Array<DemoRow["dataRef"]["department"]> = ["前端", "后端", "产品", "设计", "测试", "运维"];
const statuses: DemoRow["dataRef"]["status"][] = ["在职", "试用", "离职"];
const names = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁", "冯雪", "蒋凡"];

const initialRows: DemoRow[] = Array.from({ length: 1000 }, (_, index) => {
    const rowId = index + 1;
    return {
        id: String(rowId),
        dataRef: {
            employeeNo: `EMP-${String(rowId).padStart(4, "0")}`,
            name: `${names[index % names.length]}${String(rowId).padStart(2, "0")}`,
            age: 22 + (index % 19),
            department: departments[index % departments.length],
            salary: 12000 + (index % 30) * 1000,
            status: statuses[index % statuses.length]
        }
    };
});

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

const EditDemo = () => {
    const [rows, setRows] = useState<DemoRow[]>(initialRows);

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
                                onCommit?.();
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
                width={780}
                height={260}
                columns={columns}
                rows={rows}
                editType="cell"
            />
            <div className={cx(hintStyle)}>双击姓名、年龄、部门、月薪或状态单元格可编辑。</div>
        </div>
    );
};

export default EditDemo;
