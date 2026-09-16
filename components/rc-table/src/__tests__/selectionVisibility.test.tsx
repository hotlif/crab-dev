import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
import TableCell from "../bodyCell.js";
import Table from "../table.js";
import { makeSelectKey } from "../util.js";
import type { CellSelectionState, ColumnType, Row } from "../types.js";

// 必须同时用 yarn test:selection 跑浏览器验证：DOM 仿真可能丢弃含 CSS 变量的背景值，
// 使旧的不透明遮罩看起来像没有背景；浏览器会保留并绘制该值。

interface OrderRow extends Row {
    dataRef: { orderNo: string; customer: string; amount: number };
}

const rows: OrderRow[] = [
    { id: "order-1", dataRef: { orderNo: "SO-2026-000001", customer: "中联仓储物流有限公司", amount: 18526.03 } },
    { id: "order-2", dataRef: { orderNo: "SO-2026-000002", customer: "启明精密制造有限公司", amount: 9820 } },
];

const selection: CellSelectionState = {
    selected: true,
    isAnchor: false,
    edgeTop: true,
    edgeBottom: true,
    edgeLeft: true,
    edgeRight: true,
};

const columns: ColumnType<OrderRow>[] = [
    { name: "$.orderNo", title: "订单号", width: 190, fixed: "left" },
    { name: "$.customer", title: "客户名称", width: 280 },
    { name: "$.amount", title: "订单金额", width: 140, fixed: "right" },
];

function assertTransparentOutlines(container: HTMLElement, expectedCount: number): void {
    const outlines = container.querySelectorAll<HTMLElement>("[data-table-selection-outline]");
    expect(outlines).toHaveLength(expectedCount);
    for (const outline of outlines) {
        expect(outline).toHaveAttribute("aria-hidden", "true");
        expect(outline.childElementCount).toBe(0);
        // 旧实现以内联 backgroundColor 覆盖文字；仅断言 textContent / toBeVisible 抓不到该错误。
        // 不允许前景层通过内联背景覆盖静态的透明样式，包括 var(--table-selection-bg-color)。
        expect(outline.style.background).toBe("");
        expect(outline.style.backgroundColor).toBe("");
        expect(outline.style.backgroundImage).toBe("");
        expect(outline.style.opacity).toBe("");
        const paintedStyle = getComputedStyle(outline);
        expect(["", "transparent", "rgba(0, 0, 0, 0)"]).toContain(paintedStyle.backgroundColor);
        expect(["", "none"]).toContain(paintedStyle.backgroundImage);
        expect(outline.style.boxShadow).toContain("inset");
    }
}

describe("Table selection keeps cell content readable", () => {
    it.each([undefined, "left", "right"] as const)("keeps the foreground transparent for fixed=%s", async (fixed) => {
        const { container } = await render(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35]} gridTemplateColumns={[280]} isSkipCell={false}
                fixed={fixed} selection={selection} />
        );

        expect(screen.getByRole("gridcell")).toHaveTextContent(rows[0].dataRef.customer);
        expect(screen.getByRole("gridcell")).toHaveAttribute("aria-selected", "true");
        assertTransparentOutlines(container, 1);
    });

    it.each([
        ["light", "#ffffff", "#18181b"],
        ["dark", "#111114", "#f4f4f5"],
    ] satisfies [theme: "light" | "dark", surface: string, foreground: string][])("does not cover text with an opaque legacy selection color in %s mode", async (_theme, surface, foreground) => {
        const { container } = await render(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35]} gridTemplateColumns={[280]} isSkipCell={false} selection={selection} />
        );
        // 模拟用户截图中的浅色选区变量，即使变量不透明，也只能用作内容下方的底色。
        const cell = screen.getByRole("gridcell");
        cell.style.setProperty("--table-selection-bg-color", "#eff6ff");
        cell.style.color = foreground;
        cell.style.backgroundColor = surface;

        assertTransparentOutlines(container, 1);
        expect(cell).toHaveTextContent(rows[0].dataRef.customer);
        expect(getComputedStyle(cell).color).toBe(cell.style.color);
    });

    it("preserves the active cell while showing the rest of a selected range", async () => {
        const { container, rerender } = await render(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35]} gridTemplateColumns={[280]} isSkipCell={false}
                selection={{ ...selection, isAnchor: true }} />
        );
        const anchorClass = screen.getByRole("gridcell").className;
        assertTransparentOutlines(container, 1);

        await rerender(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35]} gridTemplateColumns={[280]} isSkipCell={false}
                selection={selection} />
        );

        expect(screen.getByRole("gridcell").className).not.toBe(anchorClass);
        expect(screen.getByRole("gridcell")).toHaveTextContent(rows[0].dataRef.customer);
        assertTransparentOutlines(container, 1);
    });

    it("outlines the full merged area without painting over its content", async () => {
        const { container } = await render(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35, 45]} gridTemplateColumns={[190, 280]} isSkipCell={false}
                mergeCell={{ rowIndex: 0, columnIndex: 0, rowSpan: 1, colSpan: 1 }} selection={selection} />
        );

        expect(screen.getByRole("gridcell")).toHaveTextContent(rows[0].dataRef.customer);
        assertTransparentOutlines(container, 1);
        const outline = container.querySelector<HTMLElement>("[data-table-selection-outline]");
        expect(outline?.style.width).toBe("470px");
        expect(outline?.style.height).toBe("80px");
        expect(outline?.style.right).toBe("");
        expect(outline?.style.bottom).toBe("");
    });

    it("does not create duplicate foreground layers for covered merged cells", async () => {
        const { container } = await render(
            <TableCell row={rows[1]} rowIndex={1} columnIndex={0} column={columns[1]}
                gridTemplateRows={[35, 35]} gridTemplateColumns={[280]} isSkipCell selection={selection} />
        );

        expect(container.querySelector("[data-table-selection-outline]")).toBeNull();
        expect(screen.getByRole("gridcell")).not.toHaveAttribute("aria-selected");
    });

    it("preserves custom text, highlights and controls inside a selected cell", async () => {
        const onDetails = mock.fn();
        const column: ColumnType<OrderRow> = {
            ...columns[1],
            render: ({ originalElement }) => <>{originalElement}<button type="button" onClick={onDetails}>查看订单</button></>,
        };
        const { container } = await render(
            <TableCell row={rows[0]} rowIndex={0} columnIndex={0} column={column}
                gridTemplateRows={[35]} gridTemplateColumns={[280]} isSkipCell={false}
                highlightKeyword="物流" selection={selection} />
        );

        expect(screen.getByRole("gridcell")).toHaveTextContent(rows[0].dataRef.customer);
        expect(container.querySelector("mark")).toHaveTextContent("物流");
        assertTransparentOutlines(container, 1);
        await fireEvent.click(screen.getByRole("button", { name: "查看订单" }));
        expect(onDetails).toHaveBeenCalledTimes(1);
    });

    it("keeps every cell readable across fixed and scrolling columns and removes the outline when cleared", async () => {
        const selected = rows.flatMap(row => columns.map((_, index) => makeSelectKey(row.id, index)));
        const { container, rerender } = await render(
            <Table width={500} height={160} rows={rows} columns={columns} selectCells={selected} />
        );

        expect(container.querySelectorAll('[role="gridcell"][aria-selected="true"]')).toHaveLength(6);
        for (const row of rows) {
            expect(screen.getByText(row.dataRef.customer)).toBeInTheDocument();
            expect(screen.getByText(row.dataRef.orderNo)).toBeInTheDocument();
        }
        assertTransparentOutlines(container, 6);

        await rerender(<Table width={500} height={160} rows={rows} columns={columns} selectCells={[]} />);
        expect(container.querySelector("[data-table-selection-outline]")).toBeNull();
        expect(container.querySelector('[role="gridcell"][aria-selected="true"]')).toBeNull();
        expect(screen.getByText(rows[0].dataRef.customer)).toBeInTheDocument();
    });
});
