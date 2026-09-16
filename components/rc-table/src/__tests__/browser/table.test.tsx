import { describe, expect, it } from "@crab-dev/wake/test";
import { act, fireEvent, render } from "@crab-dev/wake/test/react";
import Table from "../../table.js";
import type { ColumnType, Row } from "../../types.js";

const rows: Row[] = Array.from({ length: 30 }, (_, id) => ({ id, dataRef: {} }));
const columns: ColumnType<Row>[] = [
    { name: "left-1", title: "Left 1", width: 80, fixed: "left" },
    { name: "left-2", title: "Left 2", width: 100, fixed: "left" },
    ...Array.from({ length: 8 }, (_, index): ColumnType<Row> => ({
        name: `middle-${index}`, title: `Middle ${index}`, width: 160,
    })),
    { name: "right-1", title: "Right 1", width: 90, fixed: "right" },
    { name: "right-2", title: "Right 2", width: 110, fixed: "right" },
];

function getFixedCells(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(
        '[role="columnheader"], [data-row-index="0"] > [role="gridcell"]',
    )).filter(cell => cell.style.left !== "" || cell.style.right !== "");
}

describe("Table fixed columns with real CSS and browser layout", () => {
    it("pins both header and body columns throughout horizontal virtualization", async () => {
        const { container } = await render(<Table width={600} height={200} rows={rows} columns={columns} />);
        const fixedCells = getFixedCells(container);
        expect(fixedCells).toHaveLength(8);
        const initialLefts = fixedCells.map(cell => cell.getBoundingClientRect().left);
        for (const cell of fixedCells) expect(getComputedStyle(cell).position).toBe("sticky");

        const scrollContainer = Array.from(container.querySelectorAll<HTMLElement>("div"))
            .find(element => getComputedStyle(element).overflowX === "hidden"
                && element.scrollWidth > element.clientWidth && element.clientWidth === 600);
        expect(scrollContainer).toBeDefined();
        if (!scrollContainer) throw new Error("Missing horizontal scroll viewport");

        for (const left of [200, 800, scrollContainer.scrollWidth - scrollContainer.clientWidth, 0]) {
            await act(async () => { scrollContainer.scrollLeft = left; });
            await fireEvent(scrollContainer, new Event("scroll", { bubbles: true }));
            expect(scrollContainer.scrollLeft).toBe(left);
            const currentCells = getFixedCells(container);
            expect(currentCells).toHaveLength(8);
            currentCells.forEach((cell, index) => {
                expect(getComputedStyle(cell).position).toBe("sticky");
                expect(cell.getBoundingClientRect().left).toBeCloseTo(initialLefts[index], 1);
            });
        }
    });

    it("updates offsets after a width change and restores relative positioning when unfixed", async () => {
        const { container, rerender } = await render(<Table width={600} height={200} rows={rows} columns={columns} />);
        const resized = columns.map((column, index) => index === 0 ? { ...column, width: 120 } : column);
        await rerender(<Table width={600} height={200} rows={rows} columns={resized} />);
        const fixedCells = getFixedCells(container);
        expect(fixedCells).toHaveLength(8);
        expect(fixedCells[1].style.left).toBe("120px");
        expect(fixedCells[5].style.left).toBe("120px");

        const unfixed = resized.map(column => ({ ...column, fixed: undefined }));
        await rerender(<Table width={600} height={200} rows={rows} columns={unfixed} />);
        expect(getFixedCells(container)).toHaveLength(0);
        for (const cell of container.querySelectorAll('[role="columnheader"], [role="gridcell"]')) {
            expect(getComputedStyle(cell).position).toBe("relative");
        }
    });
});
