import { describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import Table from "../table.js";
import type { ColumnType, MergeCell, Row } from "../types.js";
const renderDefaultFilterEditor = ({ columnIndex, value, onValueChange }: {
    columnIndex: number;
    value: string;
    onValueChange: (nextValue: string) => void;
}) => {
    return (<input value={value} aria-label={`table-filter-input-${columnIndex}`} onChange={(event) => {
        onValueChange(event.target.value);
    }}/>);
};
const changeInputValue = async (input: HTMLInputElement, value: string) => {
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    if (!setValue) throw new Error("HTMLInputElement.value setter is unavailable");
    setValue.call(input, value);
    await fireEvent.input(input);
};
interface DemoRow extends Row {
    dataRef: {
        recordNo: string;
        businessUnit: string;
        city: string;
        accountManager: string;
        amount: number;
    };
}
const groupedColumns: ColumnType<DemoRow>[] = [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 120
    },
    {
        title: "客户信息",
        name: "$.customer",
        children: [
            {
                title: "大区",
                name: "$.businessUnit",
                width: 120
            },
            {
                title: "城市",
                name: "$.city",
                width: 120
            },
            {
                title: "客户经理",
                name: "$.accountManager",
                width: 140
            }
        ]
    },
    {
        title: "金额",
        name: "$.amount",
        width: 120,
        align: "right"
    }
];
const fixedColumns: ColumnType<DemoRow>[] = [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 120
    },
    {
        title: "大区",
        name: "$.businessUnit",
        width: 120,
        fixed: "left"
    },
    {
        title: "城市",
        name: "$.city",
        width: 120,
        fixed: "left"
    },
    {
        title: "客户经理",
        name: "$.accountManager",
        width: 140
    },
    {
        title: "金额",
        name: "$.amount",
        width: 120,
        align: "right"
    }
];
import { type ReactElement } from 'react';
const renderTable = async (element: ReactElement) => await render(element);
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const buildRows = (): DemoRow[] => {
    return [
        {
            id: "1",
            dataRef: {
                recordNo: "R-0001",
                businessUnit: "华北大区",
                city: "北京",
                accountManager: "李文博",
                amount: 120000
            }
        },
        {
            id: "2",
            dataRef: {
                recordNo: "R-0002",
                businessUnit: "华北大区",
                city: "北京",
                accountManager: "王若琳",
                amount: 98000
            }
        },
        {
            id: "3",
            dataRef: {
                recordNo: "R-0003",
                businessUnit: "华东大区",
                city: "上海",
                accountManager: "周子墨",
                amount: 188000
            }
        }
    ];
};
describe("Table", () => {
    it("renders grouped headers and basic cell content", async () => {
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()}/>);
        const text = container.textContent ?? "";
        expect(text).toContain("记录号");
        expect(text).toContain("客户信息");
        expect(text).toContain("客户经理");
        expect(text).toContain("R-0001");
        expect(text).toContain("李文博");
        await unmount();
    });
    it("renders summary row with fixed columns when showSummary enabled", async () => {
        const summaryColumns: ColumnType<DemoRow>[] = [
            { title: "记录号", name: "$.recordNo", width: 120, fixed: "left", summaryRender: () => "合计" },
            { title: "客户经理", name: "$.accountManager", width: 140 },
            {
                title: "金额",
                name: "$.amount",
                width: 120,
                align: "right",
                summaryRender: ({ rows }) => `¥${rows.reduce((acc, row) => acc + Number(row.dataRef.amount), 0)}`
            }
        ];
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={summaryColumns} rows={buildRows()} showSummary/>);
        const text = container.textContent ?? "";
        expect(text).toContain("合计");
        expect(text).toContain("¥406000");
        await unmount();
    });
    it("renders merged text when mergeCells and fixed columns are used together", async () => {
        const mergeCells: MergeCell[] = [
            { rowIndex: 0, columnIndex: 1, rowSpan: 1, colSpan: 0 },
            { rowIndex: 0, columnIndex: 2, rowSpan: 1, colSpan: 0 }
        ];
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={fixedColumns} rows={buildRows()} mergeCells={mergeCells}/>);
        const text = container.textContent ?? "";
        expect(text).toContain("华北大区");
        expect(text).toContain("北京");
        await unmount();
    });
    it("supports getRowHeight and headerRowHeight props", async () => {
        const getRowHeight = mock.fn((row: DemoRow, rowIndex: number) => {
            if (rowIndex === 1) {
                return 52;
            }
            return undefined;
        });
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} getRowHeight={getRowHeight} headerRowHeight={40}/>);
        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }), 0);
        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "2" }), 1);
        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "3" }), 2);
        expect(getRowHeight.calls.calls.length).toBeGreaterThanOrEqual(3);
        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("style")).toContain("--crab-rc-virtual-top-padding-height-offset: 80px");
        await unmount();
    });
    it("does not filter rows by itself and only emits filter conditions", async () => {
        const onFilterChange = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar onFilterChange={onFilterChange} renderDefaultFilterEditor={renderDefaultFilterEditor}/>);
        const textBefore = container.textContent ?? "";
        expect(textBefore).toContain("R-0001");
        expect(textBefore).toContain("R-0002");
        expect(textBefore).toContain("R-0003");
        const input = screen.getByLabelText("table-filter-input-0") as HTMLInputElement;
        await changeInputValue(input, "R-0002");
        const textAfter = container.textContent ?? "";
        expect(textAfter).toContain("R-0001");
        expect(textAfter).toContain("R-0002");
        expect(textAfter).toContain("R-0003");
        expect(onFilterChange).toHaveBeenCalledWith({
            "$.recordNo": "R-0002"
        });
        await unmount();
    });
    it("supports controlled filters from outside", async () => {
        const onFilterChange = mock.fn();
        const { rerender, unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar filters={{ "$.recordNo": "R-0001" }} onFilterChange={onFilterChange} renderDefaultFilterEditor={renderDefaultFilterEditor}/>);
        const inputBefore = screen.getByLabelText("table-filter-input-0") as HTMLInputElement;
        expect(inputBefore.value).toBe("R-0001");
        await rerender(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar filters={{ "$.recordNo": "R-0003" }} onFilterChange={onFilterChange} renderDefaultFilterEditor={renderDefaultFilterEditor}/>);
        const inputAfter = screen.getByLabelText("table-filter-input-0") as HTMLInputElement;
        expect(inputAfter.value).toBe("R-0003");
        await changeInputValue(inputAfter, "R-0002");
        expect(onFilterChange).toHaveBeenCalledWith({
            "$.recordNo": "R-0002"
        });
        await unmount();
    });
    it("supports custom filter editor", async () => {
        const columnsWithCustomFilterEditor: ColumnType<DemoRow>[] = [
            {
                ...groupedColumns[0],
                filterEditor: ({ onValueChange }) => {
                    return (<button type="button" onClick={() => {
                        onValueChange("R-0003");
                    }}>
                            只看R-0003
                    </button>);
                }
            },
            ...groupedColumns.slice(1)
        ];
        const onFilterChange = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={columnsWithCustomFilterEditor} rows={buildRows()} filterBar onFilterChange={onFilterChange}/>);
        await fireEvent.click(screen.getByText("只看R-0003"));
        const textAfter = container.textContent ?? "";
        expect(textAfter).toContain("R-0001");
        expect(textAfter).toContain("R-0003");
        expect(textAfter).toContain("R-0002");
        expect(onFilterChange).toHaveBeenCalledWith({
            "$.recordNo": "R-0003"
        });
        await unmount();
    });
    it("supports external renderDefaultFilterEditor", async () => {
        const onFilterChange = mock.fn();
        const { unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar onFilterChange={onFilterChange} renderDefaultFilterEditor={({ columnIndex, value, onValueChange }) => {
            return (<button type="button" aria-label={`default-filter-editor-${columnIndex}`} onClick={() => {
                onValueChange("R-0002");
            }}>
                {value === "" ? "设置默认过滤" : `默认过滤:${value}`}
            </button>);
        }}/>);
        await fireEvent.click(screen.getByLabelText("default-filter-editor-0"));
        expect(onFilterChange).toHaveBeenCalledWith({
            "$.recordNo": "R-0002"
        });
        await unmount();
    });
    it("renders empty filter cell when no filter editor is provided", async () => {
        const { unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar/>);
        expect(screen.queryByLabelText("table-filter-input-0")).toBeNull();
        await unmount();
    });
    it("supports custom filter cell className", async () => {
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={groupedColumns} rows={buildRows()} filterBar filterCellClassName="custom-filter-cell"/>);
        expect(container.querySelector(".custom-filter-cell")).not.toBeNull();
        await unmount();
    });
    it("supports column-level filter cell className", async () => {
        const columnsWithFilterCellClassName: ColumnType<DemoRow>[] = [
            {
                ...groupedColumns[0],
                filterCellClassName: "column-filter-cell"
            },
            ...groupedColumns.slice(1)
        ];
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={columnsWithFilterCellClassName} rows={buildRows()} filterBar filterCellClassName="global-filter-cell"/>);
        const cell = container.querySelector(".column-filter-cell");
        expect(cell).not.toBeNull();
        expect(cell?.classList.contains("global-filter-cell")).toBe(true);
        await unmount();
    });
    const expansionColumns: ColumnType<DemoRow>[] = [
        { title: "记录号", name: "$.recordNo", width: 120 },
        { title: "城市", name: "$.city", width: 120 }
    ];
    it("renders expanded content only for rows in expandedRowKeys", async () => {
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={expansionColumns} rows={buildRows()} expandedRowRender={(row) => <div>{`详情-${row.dataRef.recordNo}`}</div>} expandedRowKeys={new Set(["1"])}/>);
        const text = container.textContent ?? "";
        expect(text).toContain("详情-R-0001");
        expect(text).not.toContain("详情-R-0002");
        await unmount();
    });
    it("toggles expansion via icon click and emits onExpandedRowKeysChange", async () => {
        const onExpandedRowKeysChange = mock.fn();
        const { unmount } = await renderTable(<Table width={700} height={260} columns={expansionColumns} rows={buildRows()} expandedRowRender={(row) => <div>{`详情-${row.dataRef.recordNo}`}</div>} onExpandedRowKeysChange={onExpandedRowKeysChange}/>);
        const expandButtons = screen.getAllByLabelText("展开此行");
        expect(expandButtons.length).toBe(3);
        await fireEvent.click(expandButtons[0]);
        expect(onExpandedRowKeysChange).toHaveBeenCalledTimes(1);
        const nextKeys = onExpandedRowKeysChange.calls.calls[0][0] as Set<string>;
        expect(nextKeys.has("1")).toBe(true);
        await unmount();
    });
    it("uncontrolled expansion shows content after clicking the expand icon", async () => {
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={expansionColumns} rows={buildRows()} expandedRowRender={(row) => <div>{`详情-${row.dataRef.recordNo}`}</div>}/>);
        expect(container.textContent ?? "").not.toContain("详情-R-0001");
        await fireEvent.click(screen.getAllByLabelText("展开此行")[0]);
        expect(container.textContent ?? "").toContain("详情-R-0001");
        await unmount();
    });
    it("hides the expand icon for rows disabled by isRowExpandable", async () => {
        const { unmount } = await renderTable(<Table width={700} height={260} columns={expansionColumns} rows={buildRows()} expandedRowRender={(row) => <div>{`详情-${row.dataRef.recordNo}`}</div>} isRowExpandable={(row) => row.id !== "2"}/>);
        // 三行中第 2 行禁用展开，故仅 2 个展开按钮
        expect(screen.getAllByLabelText("展开此行").length).toBe(2);
        await unmount();
    });
    // ====== 行事件（onRowClick / onRowDoubleClick） ======
    const rowEventColumns: ColumnType<DemoRow>[] = [
        { title: "记录号", name: "$.recordNo", width: 120 },
        { title: "城市", name: "$.city", width: 120 }
    ];
    const getRow = (container: HTMLElement, rowIndex: number): HTMLElement => {
        const row = container.querySelector<HTMLElement>(`[data-row-index="${rowIndex}"]`);
        if (!row)
            throw new Error(`row ${rowIndex} not found`);
        return row;
    };
    const getCell = (container: HTMLElement, rowIndex: number, columnIndex: number): HTMLElement => {
        const cell = getRow(container, rowIndex).querySelector<HTMLElement>(`[data-col-index="${columnIndex}"]`);
        if (!cell)
            throw new Error(`cell ${rowIndex},${columnIndex} not found`);
        return cell;
    };
    it("emits onRowClick with the row and its index", async () => {
        const onRowClick = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} onRowClick={onRowClick}/>);
        await fireEvent.click(getRow(container, 1));
        expect(onRowClick).toHaveBeenCalledTimes(1);
        const [row, rowIndex] = onRowClick.calls.calls[0] as [
            DemoRow,
            number
        ];
        expect(row.id).toBe("2");
        expect(rowIndex).toBe(1);
        await unmount();
    });
    it("emits onRowDoubleClick with the row and its index", async () => {
        const onRowDoubleClick = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} onRowDoubleClick={onRowDoubleClick}/>);
        await fireEvent(getRow(container, 2), new MouseEvent("dblclick", { bubbles: true }));
        expect(onRowDoubleClick).toHaveBeenCalledTimes(1);
        const [row, rowIndex] = onRowDoubleClick.calls.calls[0] as [
            DemoRow,
            number
        ];
        expect(row.id).toBe("3");
        expect(rowIndex).toBe(2);
        await unmount();
    });
    it("does not emit onRowClick when clicking the row-selection checkbox", async () => {
        const onRowClick = mock.fn();
        const onChange = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} rowSelection={{ type: "checkbox", onChange }} onRowClick={onRowClick}/>);
        const checkbox = getRow(container, 0).querySelector("input");
        expect(checkbox).not.toBeNull();
        await fireEvent.click(checkbox as HTMLInputElement);
        // 复选框消费了这次点击：行选中生效，行点击不触发
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onRowClick).not.toHaveBeenCalled();
        await unmount();
    });
    it("does not emit onRowClick when clicking the expand icon", async () => {
        const onRowClick = mock.fn();
        const onExpandedRowKeysChange = mock.fn();
        const { unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} expandedRowRender={(row) => <div>{`详情-${row.dataRef.recordNo}`}</div>} onExpandedRowKeysChange={onExpandedRowKeysChange} onRowClick={onRowClick}/>);
        await fireEvent.click(screen.getAllByLabelText("展开此行")[0]);
        expect(onExpandedRowKeysChange).toHaveBeenCalledTimes(1);
        expect(onRowClick).not.toHaveBeenCalled();
        await unmount();
    });
    it("does not emit onRowClick when clicking a button rendered inside a cell", async () => {
        const onRowClick = mock.fn();
        const onAction = mock.fn();
        const columnsWithButton: ColumnType<DemoRow>[] = [
            ...rowEventColumns,
            {
                title: "操作",
                name: "$.action",
                width: 100,
                render: () => (<button type="button" onClick={() => onAction()}>删除</button>)
            }
        ];
        const { unmount } = await renderTable(<Table width={700} height={260} columns={columnsWithButton} rows={buildRows()} onRowClick={onRowClick}/>);
        await fireEvent.click(screen.getAllByText("删除")[0]);
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onRowClick).not.toHaveBeenCalled();
        await unmount();
    });
    it("does not emit onRowClick after a cell drag-selection", async () => {
        const onRowClick = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} onRowClick={onRowClick}/>);
        const row = getRow(container, 0);
        // 按下后拖出 40px 再抬起：这是一次拖选，不是点击
        await fireEvent(row, new MouseEvent("mousedown", { bubbles: true, clientX: 10, clientY: 10 }));
        await fireEvent.click(row, { clientX: 50, clientY: 10 });
        expect(onRowClick).not.toHaveBeenCalled();
        // 原地按下抬起仍是正常点击
        await fireEvent(row, new MouseEvent("mousedown", { bubbles: true, clientX: 10, clientY: 10 }));
        await fireEvent.click(row, { clientX: 11, clientY: 10 });
        expect(onRowClick).toHaveBeenCalledTimes(1);
        await unmount();
    });
    it("does not emit onRowDoubleClick when a cell enters edit mode (editType=cell)", async () => {
        const onRowDoubleClick = mock.fn();
        const editableColumns: ColumnType<DemoRow>[] = [
            {
                title: "记录号",
                name: "$.recordNo",
                width: 120,
                editRender: ({ editorValue, onEditorValueChange }) => (<input value={String(editorValue ?? "")} onChange={(e) => onEditorValueChange(e.target.value)}/>)
            },
            { title: "城市", name: "$.city", width: 120 }
        ];
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={editableColumns} rows={buildRows()} editType="cell" onRowDoubleClick={onRowDoubleClick}/>);
        // 双击可编辑单元格：该次双击被单元格编辑消费，不冒泡为行双击
        await fireEvent(getCell(container, 0, 0), new MouseEvent("dblclick", { bubbles: true }));
        expect(onRowDoubleClick).not.toHaveBeenCalled();
        // 双击不可编辑的单元格：无人消费，正常上报行双击
        await fireEvent(getCell(container, 1, 1), new MouseEvent("dblclick", { bubbles: true }));
        expect(onRowDoubleClick).toHaveBeenCalledTimes(1);
        await unmount();
    });
    it("lets row-edit consume the double click instead of emitting onRowDoubleClick (editType=row)", async () => {
        const onRowDoubleClick = mock.fn();
        const onEditingRowIdChange = mock.fn();
        const editableColumns: ColumnType<DemoRow>[] = [
            {
                title: "记录号",
                name: "$.recordNo",
                width: 120,
                editRender: ({ editorValue, onEditorValueChange }) => (<input value={String(editorValue ?? "")} onChange={(e) => onEditorValueChange(e.target.value)}/>)
            },
            { title: "城市", name: "$.city", width: 120 }
        ];
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={editableColumns} rows={buildRows()} editType="row" onEditingRowIdChange={onEditingRowIdChange} onRowDoubleClick={onRowDoubleClick}/>);
        await fireEvent(getRow(container, 0), new MouseEvent("dblclick", { bubbles: true }));
        // 行编辑优先：进入编辑态，且不再上报行双击
        expect(onEditingRowIdChange).toHaveBeenCalledWith("1");
        expect(onRowDoubleClick).not.toHaveBeenCalled();
        await unmount();
    });
    it("emits onRowClick via keyboard Enter on the anchored row", async () => {
        const onRowClick = mock.fn();
        const { container, unmount } = await renderTable(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} onRowClick={onRowClick}/>);
        // 没有锚点单元格时，Enter 不应触发
        await fireEvent.keyDown(window as unknown as Element, { key: "Enter" });
        expect(onRowClick).not.toHaveBeenCalled();
        // 点选第 2 行的单元格建立锚点后，Enter 触发该行的行点击
        await fireEvent(getCell(container, 1, 1), new MouseEvent("mousedown", { bubbles: true }));
        await fireEvent.keyDown(window as unknown as Element, { key: "Enter" });
        expect(onRowClick).toHaveBeenCalledTimes(1);
        const [row, rowIndex] = onRowClick.calls.calls[0] as [
            DemoRow,
            number
        ];
        expect(row.id).toBe("2");
        expect(rowIndex).toBe(1);
        await unmount();
    });
    it("adds the clickable affordance class only when a row event is provided", async () => {
        const countRowClasses = async (element: ReactElement): Promise<number> => {
            const { container, unmount } = await renderTable(element);
            const classes = getRow(container, 0).className.split(/\s+/).filter(Boolean).length;
            await unmount();
            return classes;
        };
        // 纯展示的表格不得伪造交互暗示（无 pointer / hover）；传入 onRowClick 后才多出可点击样式类
        const plain = await countRowClasses(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()}/>);
        const clickable = await countRowClasses(<Table width={700} height={260} columns={rowEventColumns} rows={buildRows()} onRowClick={mock.fn()}/>);
        expect(clickable).toBe(plain + 1);
    });
});
