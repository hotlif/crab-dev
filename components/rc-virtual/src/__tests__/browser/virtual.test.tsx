import { createRef, StrictMode } from "react";
import { describe, expect, it } from "@crab-dev/wake/test";
import { act, render } from "@crab-dev/wake/test/react";
import Virtual, { type VirtualHandle } from "../../virtual.js";
import type { VirtualAxis } from "../../types.js";

const COUNT = 1_000_000;
const HEIGHT = 400;

async function mountGrid(rowHeight: number, headerHeight = 0, footerHeight = 0, rows: VirtualAxis = new Array<number>(COUNT).fill(rowHeight)) {
    const gridRef = createRef<VirtualHandle>();
    const { container } = await render(
        <StrictMode>
            <style>{`
                [data-virtual-browser-test] { overflow: hidden; overflow-anchor: none; position: relative; }
                .virtual-test-top { height: var(--crab-rc-virtual-top-padding-height); }
                .virtual-test-bottom { height: var(--crab-rc-virtual-bottom-padding-height); }
                .virtual-test-header { position: sticky; top: 0; }
                .virtual-test-footer { position: sticky; bottom: 0; }
            `}</style>
            <Virtual
                data-virtual-browser-test=""
                gridRef={gridRef}
                gridTemplateRows={rows}
                gridTemplateColumns={[300]}
                viewportWidth={300}
                viewportHeight={HEIGHT}
                reservedTopHeight={headerHeight}
                reservedBottomHeight={footerHeight}
                overscanRowCount={4}
                renderRows={([start, end]) => (
                    <>
                        <div className="virtual-test-header" ref={node => { if (node) node.style.height = `${headerHeight}px`; }} />
                        <div className="virtual-test-top" />
                        {Array.from({ length: end - start + 1 }, (_, offset) => (
                            <div key={start + offset} data-row={start + offset} ref={node => { if (node) node.style.height = `${Array.isArray(rows) ? rows[start + offset] : rowHeight}px`; }}>
                                {start + offset}
                            </div>
                        ))}
                        <div className="virtual-test-bottom" />
                        <div className="virtual-test-footer" ref={node => { if (node) node.style.height = `${footerHeight}px`; }} />
                    </>
                )}
            />
        </StrictMode>
    );
    const grid = container.querySelector<HTMLElement>("[data-virtual-browser-test]");
    if (!grid) throw new Error("Missing grid");
    return { gridRef, grid, container };
}

async function wheel(grid: HTMLElement, deltaY: number, deltaX = 0) {
    await act(async () => {
        grid.dispatchEvent(new WheelEvent("wheel", { deltaY, deltaX, bubbles: true, cancelable: true }));
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    });
}

describe("Million-row browser layout", () => {
    it("keeps middle-row geometry stable after browser layout and subsequent wheel frames", async () => {
        const { grid, gridRef } = await mountGrid(56, 0, 0, { count: COUNT, itemSize: 56 });
        await act(async () => gridRef.current?.scrollToCell({ rowIndex: 499_999 }));
        // 浏览器滚动锚定发生在提交后的布局阶段，不能只检查同步 act 的结果。
        await act(async () => {
            await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        });
        const bounds = grid.getBoundingClientRect();
        expect(grid.querySelector('[data-row="499999"]')?.getBoundingClientRect().bottom).toBeCloseTo(bounds.bottom, 1);
        const before = gridRef.current?.getScrollCellPosition().rowIndex ?? 0;
        await wheel(grid, 56);
        await act(async () => {
            await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        });
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(before + 1);
        const first = grid.querySelector(`[data-row="${before + 1}"]`);
        expect(first?.getBoundingClientRect().top).toBeLessThanOrEqual(bounds.top);
        expect(first?.getBoundingClientRect().bottom).toBeGreaterThan(bounds.top);
    });

    it("preserves variable row geometry across the spacer boundary and at the end", async () => {
        const heights = Array.from({ length: COUNT }, (_, index) => index % 2 === 0 ? 32 : 48);
        const { grid, gridRef } = await mountGrid(40, 0, 0, heights);
        await act(async () => gridRef.current?.scrollToCell({ rowIndex: 25_012 }));
        for (const delta of [48, 32, -32, -48, 40_000_000]) {
            await wheel(grid, delta);
            const index = gridRef.current?.getScrollCellPosition().rowIndex ?? 0;
            const row = grid.querySelector(`[data-row="${index}"]`);
            if (!row) throw new Error("Visible row was not rendered");
            const bounds = grid.getBoundingClientRect();
            expect(row.getBoundingClientRect().top).toBeLessThanOrEqual(bounds.top + 1);
            expect(row.getBoundingClientRect().bottom).toBeGreaterThan(bounds.top);
            expect(grid.scrollHeight).toBeLessThan(2_002_000);
        }
        expect(grid.querySelector('[data-row="999999"]')?.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom, 1);
    });

    it("keeps million-column positioning and wheel deltas in the same logical axis", async () => {
        const gridRef = createRef<VirtualHandle>();
        const { container } = await render(
            <>
                <style>{`
                    [data-horizontal-test] { overflow: hidden; position: relative; white-space: nowrap; }
                    .virtual-test-left, .virtual-test-right, [data-column] { display: inline-block; height: 40px; vertical-align: top; }
                    [data-column] { width: 120px; }
                    .virtual-test-left { width: var(--crab-rc-virtual-left-padding-width); }
                    .virtual-test-right { width: var(--crab-rc-virtual-right-padding-width); }
                `}</style>
                <Virtual
                    data-horizontal-test=""
                    gridRef={gridRef}
                    gridTemplateRows={{ count: 1, itemSize: 40 }}
                    gridTemplateColumns={{ count: COUNT, itemSize: 120 }}
                    viewportWidth={300}
                    viewportHeight={40}
                    renderRows={(_, [start, end]) => (
                        <>
                            <div className="virtual-test-left" />
                            {Array.from({ length: end - start + 1 }, (_, offset) => (
                                <div key={start + offset} data-column={start + offset}>{start + offset}</div>
                            ))}
                            <div className="virtual-test-right" />
                        </>
                    )}
                />
            </>,
        );
        const grid = container.querySelector<HTMLElement>("[data-horizontal-test]");
        if (!grid) throw new Error("Missing grid");
        await act(async () => gridRef.current?.scrollToCell({ columnIndex: COUNT - 1 }));
        expect(grid.querySelector('[data-column="999999"]')?.getBoundingClientRect().right).toBeCloseTo(grid.getBoundingClientRect().right, 1);
        expect(grid.scrollWidth).toBeLessThan(2_001_000);
        await wheel(grid, 0, -120);
        expect(gridRef.current?.getScrollCellPosition().columnIndex).toBe(COUNT - 4);
        await act(async () => gridRef.current?.scrollToCell({ columnIndex: 0 }));
        expect(grid.scrollLeft).toBe(0);
    });

    it("supports the constant-space axis through scrolling and scrollbar dragging", async () => {
        const { grid, gridRef } = await mountGrid(40, 0, 0, { count: COUNT, itemSize: 40 });
        await act(async () => gridRef.current?.scrollToCell({ rowIndex: 750_000 }));
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(749_991);
        await wheel(grid, 40);
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(749_992);

        const track = grid.nextElementSibling;
        const thumb = track?.firstElementChild;
        if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) throw new Error("Missing scrollbar");
        // Synthetic pointer events do not create an active browser pointer to capture.
        thumb.setPointerCapture = () => {};
        thumb.releasePointerCapture = () => {};
        const trackTop = track.getBoundingClientRect().top;
        const thumbTop = thumb.getBoundingClientRect().top;
        await act(async () => {
            thumb.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, button: 0, clientY: thumbTop + 2, bubbles: true }));
            thumb.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientY: trackTop + HEIGHT, bubbles: true }));
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
            thumb.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, bubbles: true }));
        });
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(COUNT - 10);
        const last = grid.querySelector('[data-row="999999"]');
        expect(last?.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom, 1);
        await wheel(grid, -40);
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(COUNT - 11);
    });

    for (const rowHeight of [24, 32, 40, 48, 52]) {
        it(`keeps the last ${rowHeight}px row visible and wheel movement continuous`, async () => {
            const { grid, gridRef } = await mountGrid(rowHeight);
            await act(async () => gridRef.current?.scrollToCell({ rowIndex: COUNT - 1 }));
            const last = grid.querySelector<HTMLElement>('[data-row="999999"]');
            if (!last) throw new Error("Last row was not rendered");
            const bounds = grid.getBoundingClientRect();
            expect(last.getBoundingClientRect().bottom - bounds.top).toBeCloseTo(HEIGHT, 1);
            expect(grid.scrollHeight).toBeLessThan(2_001_000);
            expect(grid.querySelectorAll("[data-row]").length).toBeLessThan(30);
            await wheel(grid, -rowHeight);
            expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(Math.floor((COUNT * rowHeight - HEIGHT) / rowHeight) - 1);
            await wheel(grid, rowHeight * 10);
            expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(Math.floor((COUNT * rowHeight - HEIGHT) / rowHeight));
            await act(async () => gridRef.current?.scrollToCell({ rowIndex: 0 }));
            expect(grid.scrollTop).toBe(0);
            expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(0);
        });
    }

    it("preserves sticky header and footer space at the end of a million rows", async () => {
        const { grid, gridRef } = await mountGrid(40, 52, 44);
        await act(async () => gridRef.current?.scrollToCell({ rowIndex: COUNT - 1, topOffset: 52 }));
        expect(grid.querySelector('[data-row="999999"]')?.getBoundingClientRect().bottom).toBeCloseTo(grid.getBoundingClientRect().bottom - 44, 1);
        await wheel(grid, COUNT * 40);
        const last = grid.querySelector<HTMLElement>('[data-row="999999"]');
        if (!last) throw new Error("Last row was not rendered");
        const bounds = grid.getBoundingClientRect();
        expect(last.getBoundingClientRect().bottom - bounds.top).toBeCloseTo(HEIGHT - 44, 1);
        expect(grid.querySelector(".virtual-test-header")?.getBoundingClientRect().top).toBeCloseTo(bounds.top, 1);
        await wheel(grid, -40);
        expect(gridRef.current?.getScrollCellPosition().rowIndex).toBe(Math.floor((COUNT * 40 + 96 - HEIGHT - 40) / 40));
    });
});
