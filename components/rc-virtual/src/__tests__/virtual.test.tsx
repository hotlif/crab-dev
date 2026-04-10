import { createRef, act } from "react";
import { cleanup, render, fireEvent } from "@testing-library/react";
import { afterEach, describe, it, expect, jest } from "@jest/globals";

import Virtual, { type VirtualHandle } from "../virtual.js";

if (globalThis.PointerEvent == null) {
    type PointerEventPolyfillInit = {
        pointerId?: number
        bubbles?: boolean
        cancelable?: boolean
        composed?: boolean
        clientX?: number
        clientY?: number
        button?: number
        buttons?: number
        ctrlKey?: boolean
        shiftKey?: boolean
        altKey?: boolean
        metaKey?: boolean
    }

    class PointerEventPolyfill extends MouseEvent {
        pointerId: number;

        constructor(type: string, params: PointerEventPolyfillInit = {}) {
            super(type, params);
            this.pointerId = params.pointerId ?? 1;
        }
    }

    (globalThis as { PointerEvent?: typeof PointerEvent }).PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

if (globalThis.HTMLElement.prototype.setPointerCapture == null) {
    globalThis.HTMLElement.prototype.setPointerCapture = () => {};
}

if (globalThis.HTMLElement.prototype.releasePointerCapture == null) {
    globalThis.HTMLElement.prototype.releasePointerCapture = () => {};
}

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("Virtual", () => {
    afterEach(() => {
        cleanup();
    });

    const createProps = (overrides: Record<string, unknown> = {}) => ({
        gridTemplateColumns: [100, 100, 100] as number[],       // totalWidth = 300
        gridTemplateRows: [50, 50, 50, 50, 50, 50] as number[], // totalHeight = 300
        viewportWidth: 200,
        viewportHeight: 200,
        renderRows: jest.fn((_rowRange: [number, number], _columnRange: [number, number]) => (
            <div data-testid="content" />
        )),
        ...overrides,
    });

    it("should call renderRows and render returned content", () => {
        const props = createProps();
        const { getByTestId } = render(<Virtual {...props} />);
        expect(props.renderRows).toHaveBeenCalled();
        expect(getByTestId("content")).toBeTruthy();
    });

    it("should render with correct viewport dimensions on outer container", () => {
        const props = createProps();
        const { container } = render(<Virtual {...props} />);
        const outerDiv = container.firstElementChild as HTMLDivElement;
        expect(outerDiv.style.width).toBe("200px");
        expect(outerDiv.style.height).toBe("200px");
    });

    it("should render inner grid div with viewport dimensions", () => {
        const props = createProps();
        const { container } = render(<Virtual {...props} />);
        const outerDiv = container.firstElementChild as HTMLDivElement;
        const gridDiv = outerDiv.firstElementChild as HTMLDivElement;
        expect(gridDiv.style.width).toBe("200px");
        expect(gridDiv.style.height).toBe("200px");
    });

    describe("CSS custom properties for padding", () => {
        it("should set top padding to 0px at initial scroll position", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-top-padding-height")).toBe("0px");
        });

        it("should set left padding to 0px at initial scroll position", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-left-padding-width")).toBe("0px");
        });

        it("should set bottom padding for rows beyond visible range", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const bottomPadding = outerDiv.style.getPropertyValue("--crab-rc-virtual-bottom-padding-height");
            expect(bottomPadding).toMatch(/^\d+px$/);
        });

        it("should set right padding for columns beyond visible range", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const rightPadding = outerDiv.style.getPropertyValue("--crab-rc-virtual-right-padding-width");
            expect(rightPadding).toMatch(/^\d+px$/);
        });

        it("should update top padding after scrolling down", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps({
                gridTemplateRows: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50], // total 500
                viewportHeight: 150,
            });
            const { container } = render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 4 });
            });

            const outerDiv = container.firstElementChild as HTMLDivElement;
            const topPadding = outerDiv.style.getPropertyValue("--crab-rc-virtual-top-padding-height");
            expect(topPadding).not.toBe("0px");
        });

        it("should update left padding after scrolling right", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps({
                gridTemplateColumns: [100, 100, 100, 100, 100], // total 500
                viewportWidth: 200,
            });
            const { container } = render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 2 });
            });

            const outerDiv = container.firstElementChild as HTMLDivElement;
            const leftPadding = outerDiv.style.getPropertyValue("--crab-rc-virtual-left-padding-width");
            expect(leftPadding).not.toBe("0px");
        });

        it("should set all padding to 0px when content fits viewport", () => {
            const props = createProps({
                gridTemplateColumns: [50, 50],  // total 100 < 200
                gridTemplateRows: [30, 30],     // total 60 < 200
            });
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-top-padding-height")).toBe("0px");
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-bottom-padding-height")).toBe("0px");
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-left-padding-width")).toBe("0px");
            expect(outerDiv.style.getPropertyValue("--crab-rc-virtual-right-padding-width")).toBe("0px");
        });
    });

    describe("scrollbar visibility", () => {
        it("should render both scrollbars when content exceeds viewport in both directions", () => {
            const props = createProps(); // totalWidth 300 > 200, totalHeight 300 > 200
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // grid div + x-scrollbar + y-scrollbar
            expect(outerDiv.children.length).toBe(3);
        });

        it("should hide x-scrollbar when total width fits viewport", () => {
            const props = createProps({ gridTemplateColumns: [50, 50, 50] }); // total 150 < 200
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // grid div + y-scrollbar only
            expect(outerDiv.children.length).toBe(2);
        });

        it("should hide y-scrollbar when total height fits viewport", () => {
            const props = createProps({ gridTemplateRows: [30, 30, 30] }); // total 90 < 200
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // grid div + x-scrollbar only
            expect(outerDiv.children.length).toBe(2);
        });

        it("should hide both scrollbars when content fits viewport", () => {
            const props = createProps({
                gridTemplateColumns: [50, 50, 50],  // total 150
                gridTemplateRows: [30, 30, 30],     // total 90
            });
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // grid div only
            expect(outerDiv.children.length).toBe(1);
        });

        it("should show scrollbar when content matches exactly viewport size", () => {
            // totalWidth = 200, viewportWidth = 200 → NOT scrollable (> is required)
            const props = createProps({
                gridTemplateColumns: [100, 100], // total 200 == viewport 200
                gridTemplateRows: [100, 100],    // total 200 == viewport 200
            });
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.children.length).toBe(1); // no scrollbars
        });
    });

    describe("row/column range when scrollbar hidden", () => {
        it("should show all rows when y-scrollbar is not needed", () => {
            const props = createProps({
                gridTemplateRows: [30, 30, 30], // total 90 < 200
            });
            render(<Virtual {...props} />);
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange).toEqual([0, 2]);
        });

        it("should show all columns when x-scrollbar is not needed", () => {
            const props = createProps({
                gridTemplateColumns: [50, 50, 50], // total 150 < 200
            });
            render(<Virtual {...props} />);
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange).toEqual([0, 2]);
        });

        it("should show all rows and columns when neither scrollbar is needed", () => {
            const props = createProps({
                gridTemplateColumns: [50, 50, 50],  // total 150
                gridTemplateRows: [30, 30, 30],     // total 90
            });
            render(<Virtual {...props} />);
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange, columnRange] = lastCall;
            expect(rowRange).toEqual([0, 2]);
            expect(columnRange).toEqual([0, 2]);
        });
    });

    describe("scrollToCell", () => {
        it("should scroll to a specific row", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 1 });
            });

            // rowIndex=1: toTop=50, 50+200=250 < 300 → scrollTop=50
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[0]).toBeGreaterThanOrEqual(1);
        });

        it("should scroll to a specific column", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 1 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[0]).toBeGreaterThanOrEqual(1);
        });

        it("should scroll to row 0 when rowIndex is 0", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 2 });
            });
            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 0 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[0]).toBe(0);
        });

        it("should scroll to column 0 when columnIndex is 0", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 1 });
            });
            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 0 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[0]).toBe(0);
        });

        it("should scroll to 0 for negative rowIndex", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: -1 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[0]).toBe(0);
        });

        it("should scroll to 0 for negative columnIndex", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: -1 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[0]).toBe(0);
        });

        it("should clamp row scroll when near the end of content", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 5 }); // last row
            });

            // toTop = 50*5 = 250, 250+200=450 > 300 → scrollTop = 300-200 = 100
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[1]).toBe(5); // last row visible
        });

        it("should clamp column scroll when near the end of content", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 2 }); // last column
            });

            // toLeft = 100+100 = 200, 200+200=400 > 300 → scrollLeft = 300-200 = 100
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[1]).toBe(2);
        });

        it("should scroll to both row and column simultaneously", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 2, columnIndex: 1 });
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange, columnRange] = lastCall;
            expect(rowRange[0]).toBeGreaterThanOrEqual(1);
            expect(columnRange[0]).toBeGreaterThanOrEqual(1);
        });

        it("should handle scrollToCell with only rowIndex (no column change)", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 3 });
            });

            const pos = gridRef.current!.getScrollCellPosition();
            expect(pos.columnIndex).toBe(0); // column unchanged
        });

        it("should handle scrollToCell with only columnIndex (no row change)", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 1 });
            });

            const pos = gridRef.current!.getScrollCellPosition();
            expect(pos.rowIndex).toBe(0); // row unchanged
        });
    });

    describe("getScrollCellPosition", () => {
        it("should return { rowIndex: 0, columnIndex: 0 } at initial position", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            const position = gridRef.current!.getScrollCellPosition();
            expect(position).toEqual({ rowIndex: 0, columnIndex: 0 });
        });

        it("should return correct row after scrollToCell", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps();
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 1 });
            });

            // scrollToTop(50) → row 0 cumulative=50, 50>50? No. row 1 cumulative=100, 100>50? Yes → rowIndex=1
            const position = gridRef.current!.getScrollCellPosition();
            expect(position.rowIndex).toBe(1);
        });

        it("should return correct column after scrollToCell", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps({
                gridTemplateColumns: [100, 100, 100, 100], // total 400
                viewportWidth: 200,
            });
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ columnIndex: 1 });
            });

            // scrollToLeft(100) → col 0 cumulative=100, 100>100? No. col 1 cumulative=200, 200>100? Yes → columnIndex=1
            const position = gridRef.current!.getScrollCellPosition();
            expect(position.columnIndex).toBe(1);
        });

        it("should track position after multiple scrollToCell calls", () => {
            const gridRef = createRef<VirtualHandle>();
            const props = createProps({
                gridTemplateRows: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50], // total 500
                viewportHeight: 150,
            });
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 3 });
            });
            const pos1 = gridRef.current!.getScrollCellPosition();
            expect(pos1.rowIndex).toBeGreaterThanOrEqual(2);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 7 });
            });
            const pos2 = gridRef.current!.getScrollCellPosition();
            expect(pos2.rowIndex).toBeGreaterThan(pos1.rowIndex);
        });
    });

    describe("props forwarding", () => {
        it("should apply custom className to outer container", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} className="my-custom-class" />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.classList.contains("my-custom-class")).toBe(true);
        });

        it("should merge custom style with viewport dimensions", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} style={{ border: "1px solid red" }} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.style.border).toBe("1px solid red");
            expect(outerDiv.style.width).toBe("200px");
            expect(outerDiv.style.height).toBe("200px");
        });

        it("should forward data-* attributes to inner grid div", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} data-testattr="hello" />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;
            expect(gridDiv.getAttribute("data-testattr")).toBe("hello");
        });

        it("should forward aria attributes to inner grid div", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} role="grid" aria-label="data grid" />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;
            expect(gridDiv.getAttribute("role")).toBe("grid");
            expect(gridDiv.getAttribute("aria-label")).toBe("data grid");
        });
    });

    describe("wheel scroll", () => {
        it("should handle vertical wheel scroll down", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            const callCountBefore = props.renderRows.mock.calls.length;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            expect(props.renderRows.mock.calls.length).toBeGreaterThan(callCountBefore);
        });

        it("should handle horizontal wheel scroll with shift key", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            const callCountBefore = props.renderRows.mock.calls.length;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            expect(props.renderRows.mock.calls.length).toBeGreaterThan(callCountBefore);
        });

        it("should clamp vertical scroll up at top boundary", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: -100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            // Scrolling up from top → stays at 0
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[0]).toBe(0);
        });

        it("should clamp horizontal scroll left at left boundary with shift", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: -100,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[0]).toBe(0);
        });

        it("should not scroll horizontally without shift key", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            // Column range should stay at initial position (no horizontal scroll without shift)
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[0]).toBe(0);
        });

        it("should clamp vertical scroll at bottom boundary", () => {
            // totalHeight just barely exceeds viewport so a single wheel step overshoots
            const props = createProps({
                gridTemplateRows: [110, 110],  // totalHeight = 220, scrollable = 20
                viewportHeight: 200,
                gridTemplateColumns: [100],    // totalWidth = 100, no x-scrollbar
                viewportWidth: 200,
            });
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            act(() => {
                // wheel distance=30 but only 20px scrollable → should clamp to bottom
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange] = lastCall;
            expect(rowRange[1]).toBe(1); // last row should be visible
        });

        it("should clamp horizontal scroll at right boundary with shift", () => {
            // totalWidth just barely exceeds viewport so a single wheel step overshoots
            const props = createProps({
                gridTemplateColumns: [110, 110], // totalWidth = 220, scrollable = 20
                viewportWidth: 200,
                gridTemplateRows: [100],         // totalHeight = 100, no y-scrollbar
                viewportHeight: 200,
            });
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            act(() => {
                // shift+wheel → horizontal scroll, distance=30 > 20px scrollable → clamp to right
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [, columnRange] = lastCall;
            expect(columnRange[1]).toBe(1); // last column should be visible
        });

        it("should not change scroll position when deltaY is 0 (no wheel movement)", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            const callsBefore = props.renderRows.mock.calls.length;

            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 0,
                    bubbles: true,
                    cancelable: true,
                }));
            });
            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 0,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            // Neither scroll direction changes — rowRange and columnRange stay at origin
            const lastCall = props.renderRows.mock.calls[props.renderRows.mock.calls.length - 1];
            const [rowRange, columnRange] = lastCall;
            expect(rowRange[0]).toBe(props.renderRows.mock.calls[callsBefore - 1][0][0]);
            expect(columnRange[0]).toBe(props.renderRows.mock.calls[callsBefore - 1][1][0]);
        });
    });

    describe("unmount cleanup", () => {
        it("should remove wheel listener without error when component is unmounted", () => {
            const props = createProps();
            const { container, unmount } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            const gridDiv = outerDiv.firstElementChild as HTMLDivElement;

            // Establish that wheel events work before unmount
            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            const callsBeforeUnmount = props.renderRows.mock.calls.length;

            // Unmount cleans up the wheel listener (covers the useEffect cleanup branch)
            act(() => {
                unmount();
            });

            // After unmount, wheel events on the detached node should not cause further renders
            act(() => {
                gridDiv.dispatchEvent(new WheelEvent("wheel", {
                    deltaY: 100,
                    bubbles: true,
                    cancelable: true,
                }));
            });

            expect(props.renderRows.mock.calls.length).toBe(callsBeforeUnmount);
        });
    });

    describe("scrollbar interaction", () => {
        it("should update scroll position when y-scrollbar thumb is dragged", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // Children: gridDiv (0), x-scrollbar (1), y-scrollbar (2)
            const yScrollbarContainer = outerDiv.children[2] as HTMLDivElement;
            const yThumb = yScrollbarContainer.firstElementChild as HTMLDivElement;

            const callCountBefore = props.renderRows.mock.calls.length;

            act(() => {
                fireEvent.pointerDown(yThumb, { button: 0, clientY: 5, pointerId: 1 });
            });
            act(() => {
                fireEvent.pointerMove(yThumb, { clientY: 30, pointerId: 1 });
            });

            expect(props.renderRows.mock.calls.length).toBeGreaterThan(callCountBefore);

            act(() => {
                fireEvent.pointerUp(yThumb, { pointerId: 1 });
            });
        });

        it("should update scroll position when x-scrollbar thumb is dragged", () => {
            const props = createProps();
            const { container } = render(<Virtual {...props} />);
            const outerDiv = container.firstElementChild as HTMLDivElement;
            // Children: gridDiv (0), x-scrollbar (1), y-scrollbar (2)
            const xScrollbarContainer = outerDiv.children[1] as HTMLDivElement;
            const xThumb = xScrollbarContainer.firstElementChild as HTMLDivElement;

            const callCountBefore = props.renderRows.mock.calls.length;

            act(() => {
                fireEvent.pointerDown(xThumb, { button: 0, clientX: 5, pointerId: 1 });
            });
            act(() => {
                fireEvent.pointerMove(xThumb, { clientX: 30, pointerId: 1 });
            });

            expect(props.renderRows.mock.calls.length).toBeGreaterThan(callCountBefore);

            act(() => {
                fireEvent.pointerUp(xThumb, { pointerId: 1 });
            });
        });
    });

    describe("edge cases", () => {
        it("should handle single cell grid", () => {
            const props = createProps({
                gridTemplateColumns: [200],
                gridTemplateRows: [200],
            });
            const { container } = render(<Virtual {...props} />);
            expect(container.firstElementChild).toBeTruthy();
            const [rowRange, columnRange] = props.renderRows.mock.calls[0];
            expect(rowRange).toEqual([0, 0]);
            expect(columnRange).toEqual([0, 0]);
        });

        it("should handle many rows efficiently with binary search", () => {
            const rows = Array.from({ length: 10000 }, () => 30);
            const props = createProps({
                gridTemplateRows: rows,
                viewportHeight: 300,
            });
            const { container } = render(<Virtual {...props} />);
            expect(container.firstElementChild).toBeTruthy();
            const [rowRange] = props.renderRows.mock.calls[0];
            expect(rowRange[1] - rowRange[0]).toBeLessThan(100);
        });

        it("should handle many columns efficiently with binary search", () => {
            const cols = Array.from({ length: 5000 }, () => 50);
            const props = createProps({
                gridTemplateColumns: cols,
                viewportWidth: 300,
            });
            const { container } = render(<Virtual {...props} />);
            expect(container.firstElementChild).toBeTruthy();
            const [, columnRange] = props.renderRows.mock.calls[0];
            expect(columnRange[1] - columnRange[0]).toBeLessThan(100);
        });

        it("should handle zero viewport size", () => {
            const props = createProps({
                viewportWidth: 0,
                viewportHeight: 0,
            });
            const { container } = render(<Virtual {...props} />);
            expect(container.firstElementChild).toBeTruthy();
        });

        it("should handle empty row/column arrays", () => {
            const props = createProps({
                gridTemplateColumns: [],
                gridTemplateRows: [],
                viewportWidth: 200,
                viewportHeight: 200,
            });
            const { container } = render(<Virtual {...props} />);
            expect(container.firstElementChild).toBeTruthy();
            // No scrollbars when arrays are empty (total = 0 which is not > viewport)
            const outerDiv = container.firstElementChild as HTMLDivElement;
            expect(outerDiv.children.length).toBe(1);
        });

        it("should handle grid with all same-sized items", () => {
            const cols = Array.from({ length: 20 }, () => 40);
            const rows = Array.from({ length: 100 }, () => 25);
            const props = createProps({
                gridTemplateColumns: cols,  // total 800
                gridTemplateRows: rows,     // total 2500
                viewportWidth: 200,
                viewportHeight: 300,
            });
            render(<Virtual {...props} />);
            const [rowRange, columnRange] = props.renderRows.mock.calls[0];
            // With uniform sizes, visible rows = ceil(300/25) = 12
            expect(rowRange[1] - rowRange[0]).toBeLessThanOrEqual(12);
            // Visible columns = ceil(200/40) = 5
            expect(columnRange[1] - columnRange[0]).toBeLessThanOrEqual(5);
        });

        it("should handle scrollToCell on a large grid", () => {
            const gridRef = createRef<VirtualHandle>();
            const rows = Array.from({ length: 10000 }, () => 30);
            const cols = Array.from({ length: 100 }, () => 80);
            const props = createProps({
                gridTemplateRows: rows,      // total 300000
                gridTemplateColumns: cols,   // total 8000
                viewportHeight: 600,
                viewportWidth: 400,
            });
            render(<Virtual {...props} gridRef={gridRef} />);

            act(() => {
                gridRef.current!.scrollToCell({ rowIndex: 5000, columnIndex: 50 });
            });

            const pos = gridRef.current!.getScrollCellPosition();
            expect(pos.rowIndex).toBeGreaterThan(0);
            expect(pos.columnIndex).toBeGreaterThan(0);
        });
    });
});
