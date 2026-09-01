import { act, afterEach, clock, describe, expect, fireEvent, it, mock, render } from "@crab-dev/wake/test/react";
import type { ReactElement } from "react";

import Table from "../table.js";
import type { ColumnType, Row } from "../types.js";
import { makeSelectKey } from "../util.js";
import { getDataValueAccessor } from "../valueAccess.js";
import { buildHeaderCellOrigins } from "../hooks/useColumnLayout.js";

const fireMouseEvent = (
    type: "mousedown" | "mouseup" | "mouseover",
    target: EventTarget,
    init: ConstructorParameters<typeof MouseEvent>[1] = {},
) => fireEvent(target as Element, new MouseEvent(type, { bubbles: true, ...init }));

const fireWheelEvent = (
    target: EventTarget,
    init: ConstructorParameters<typeof WheelEvent>[1] = {},
) => fireEvent(target as Element, new WheelEvent("wheel", { bubbles: true, ...init }));

const fireKeyboardEvent = (
    target: EventTarget,
    init: ConstructorParameters<typeof KeyboardEvent>[1] = {},
) => fireEvent(target as Element, new KeyboardEvent("keydown", { bubbles: true, ...init }));

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
    mock.restoreAll();
});

const getGrid = (container: HTMLElement): HTMLElement => {
    const virtualOuter = container.firstElementChild?.firstElementChild as HTMLElement;
    return virtualOuter.firstElementChild as HTMLElement;
};

describe("Table performance regressions", () => {
    it("does not rerender retained cells, headers, or summary values during vertical scroll", async () => {
        mock.spyOn(globalThis, "requestAnimationFrame").implement((callback) => {
            callback(performance.now());
            return 1;
        });

        let headerRenderCount = 0;
        const HeaderProbe = () => {
            headerRenderCount += 1;
            return <>编号</>;
        };
        const renderCell = mock.fn(({ row }: { row: Row }) => String(row.dataRef.value));
        const renderSummary = mock.fn(({ rows }: { rows: Row[] }) => rows.length);
        const rows: Row[] = Array.from({ length: 100 }, (_, index) => ({
            id: index,
            dataRef: { value: index },
        }));
        const columns: ColumnType<Row>[] = [{
            name: "value",
            title: <HeaderProbe /> as unknown as string,
            width: 120,
            render: renderCell,
            summaryRender: renderSummary,
        }];

        const { container, unmount } = await render(
            <Table width={160} height={180} rows={rows} columns={columns} showSummary />
        );
        const initialCellRenders = renderCell.calls.calls.length;
        const initialHeaderRenders = headerRenderCount;
        expect(renderSummary).toHaveBeenCalledTimes(1);

        // 小幅滚动不跨越虚拟行边界，但仍会更新 RcVirtual 的 scroll state。
        await fireWheelEvent(getGrid(container), { deltaY: 5 });

        expect(renderCell).toHaveBeenCalledTimes(initialCellRenders);
        expect(headerRenderCount).toBe(initialHeaderRenders);
        expect(renderSummary).toHaveBeenCalledTimes(1);

        // 跨过一行边界时只允许新进入 overscan 窗口的行执行 render，保留行不能集体重渲染。
        await fireWheelEvent(getGrid(container), { deltaY: 35 });
        expect(renderCell.calls.calls.length - initialCellRenders).toBeLessThanOrEqual(2);
        expect(headerRenderCount).toBe(initialHeaderRenders);
        expect(renderSummary).toHaveBeenCalledTimes(1);
        await unmount();
    });

    it("keeps column layout and ordinary cells stable across controlled row-selection changes", async () => {
        const renderCell = mock.fn(({ row }: { row: Row }) => String(row.dataRef.value));
        const renderSummary = mock.fn(() => "total");
        const rows: Row[] = Array.from({ length: 20 }, (_, index) => ({ id: index, dataRef: { value: index } }));
        const columns: ColumnType<Row>[] = [{
            name: "value",
            title: "值",
            width: 100,
            render: renderCell,
            summaryRender: renderSummary,
        }];

        const { rerender, unmount } = await render(
            <Table
                width={180}
                height={180}
                rows={rows}
                columns={columns}
                showSummary
                rowSelection={{ type: "checkbox", selectedRowIds: new Set(), getDisabled: () => false }}
            />
        );
        const initialCellRenders = renderCell.calls.calls.length;
        expect(renderSummary).toHaveBeenCalledTimes(1);

        await rerender(
            <Table
                width={180}
                height={180}
                rows={rows}
                columns={columns}
                showSummary
                rowSelection={{ type: "checkbox", selectedRowIds: new Set([0]), getDisabled: () => false }}
            />
        );

        expect(renderCell).toHaveBeenCalledTimes(initialCellRenders);
        expect(renderSummary).toHaveBeenCalledTimes(1);
        await unmount();
    });

    it("materializes a drag rectangle only when the pointer is released", async () => {
        mock.spyOn(globalThis, "requestAnimationFrame").implement((callback) => {
            callback(performance.now());
            return 1;
        });
        const onSelectCellsChange = mock.fn();
        const rows: Row[] = Array.from({ length: 20 }, (_, index) => ({ id: index, dataRef: { value: index } }));
        const columns: ColumnType<Row>[] = Array.from({ length: 20 }, (_, index) => ({
            name: `c${index}`,
            title: `C${index}`,
            width: 40,
        }));
        const { container, unmount } = await render(
            <Table
                width={900}
                height={760}
                rows={rows}
                columns={columns}
                onSelectCellsChange={onSelectCellsChange}
            />
        );
        const firstCell = container.querySelector<HTMLElement>('[data-row-index="0"] [data-col-index="0"]')!;
        const lastCell = container.querySelector<HTMLElement>('[data-row-index="19"] [data-col-index="19"]')!;

        await fireMouseEvent("mousedown", firstCell, { button: 0, buttons: 1 });
        await fireMouseEvent("mouseover", lastCell, { buttons: 1 });
        expect(onSelectCellsChange).not.toHaveBeenCalled();

        await fireMouseEvent("mouseup", window);
        expect(onSelectCellsChange).toHaveBeenCalledTimes(1);
        expect(onSelectCellsChange.calls.calls[0]?.[0]).toHaveLength(400);
        await unmount();
    });

    it("copies selected cells with indexed row lookup", async () => {
        let idReadCount = 0;
        const rows: Row[] = Array.from({ length: 100 }, (_, index) => {
            const row = { dataRef: { value: index } } as Row;
            Object.defineProperty(row, "id", {
                enumerable: true,
                get: () => {
                    idReadCount += 1;
                    return index;
                },
            });
            return row;
        });
        const selectedCells = Array.from({ length: 20 }, () => makeSelectKey(99, 0));
        const onCopy = mock.fn();
        const { container, unmount } = await render(
            <Table
                width={140}
                height={140}
                rows={rows}
                columns={[{ name: "value", title: "值", width: 100 }]}
                selectCells={selectedCells}
                onCopy={onCopy}
            />
        );
        idReadCount = 0;
        await fireMouseEvent("mousedown", container.firstElementChild as HTMLElement);
        await fireKeyboardEvent(window, { key: "c", ctrlKey: true });

        expect(onCopy).toHaveBeenCalledTimes(1);
        expect(onCopy.calls.calls[0]?.[0]).toHaveLength(selectedCells.length);
        expect(idReadCount).toBeLessThanOrEqual(selectedCells.length + 2);
        await unmount();
    });

    it("cancels an obsolete chunked keyword scan", async () => {
        await clock.fake();
        try {
            const columns: ColumnType<Row>[] = Array.from({ length: 60 }, (_, index) => ({
                name: `c${index}`,
                title: `C${index}`,
                width: 50,
            }));
            const rows: Row[] = Array.from({ length: 100 }, (_, rowIndex) => ({
                id: rowIndex,
                dataRef: Object.fromEntries(columns.map((_, columnIndex) => [
                    `c${columnIndex}`,
                    columnIndex === 59 ? "latest" : "stale",
                ])),
            }));
            const onMatchCountChange = mock.fn();
            const renderTable = (keyword: string): ReactElement => (
                <Table
                    width={180}
                    height={160}
                    rows={rows}
                    columns={columns}
                    highlightKeyword={keyword}
                    onMatchCountChange={onMatchCountChange}
                />
            );
            const { rerender, unmount } = await render(renderTable("stale"));
            await rerender(renderTable("latest"));

            await act(async () => {
                await clock.advanceBy(10_000);
            });

            expect(onMatchCountChange).not.toHaveBeenCalledWith(5_900);
            expect(onMatchCountChange).toHaveBeenLastCalledWith(100);
            await unmount();
        } finally {
            await clock.restore();
        }
    });

    it("reuses compiled accessors and precomputes header span origins", async () => {
        const accessor = getDataValueAccessor("$.nested.value");
        expect(getDataValueAccessor("$.nested.value")).toBe(accessor);
        expect(accessor.get({ nested: { value: 42 } })).toBe(42);
        expect(getDataValueAccessor("$.items[1].name").get({ items: [{ name: "a" }, { name: "b" }] })).toBe("b");

        const first = { columnIndex: 0, rowIndex: 0, rowSpan: 0, colSpan: 3 };
        const last = { columnIndex: 4, rowIndex: 0, rowSpan: 0, colSpan: 0 };
        expect(buildHeaderCellOrigins([[first, null, null, null, last]], 5)).toEqual([[0, 0, 0, 0, 4]]);
    });
});
