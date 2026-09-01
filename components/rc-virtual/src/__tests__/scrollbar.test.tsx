import { describe, it, expect, mock, fireEvent, render, renderHook } from "@crab-dev/wake/test/react";
import { createRef } from "react";
import ScrollBar, { useScrollbar } from "../scrollbar.js";
if (globalThis.PointerEvent == null) {
    type PointerEventPolyfillInit = {
        pointerId?: number;
        bubbles?: boolean;
        cancelable?: boolean;
        composed?: boolean;
        clientX?: number;
        clientY?: number;
        button?: number;
        buttons?: number;
        ctrlKey?: boolean;
        shiftKey?: boolean;
        altKey?: boolean;
        metaKey?: boolean;
    };
    class PointerEventPolyfill extends MouseEvent {
        pointerId: number;
        constructor(type: string, params: PointerEventPolyfillInit = {}) {
            super(type, params);
            this.pointerId = params.pointerId ?? 1;
        }
    }
    (globalThis as {
        PointerEvent?: typeof PointerEvent;
    }).PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}
if (globalThis.HTMLElement.prototype.setPointerCapture == null) {
    globalThis.HTMLElement.prototype.setPointerCapture = () => { };
}
if (globalThis.HTMLElement.prototype.releasePointerCapture == null) {
    globalThis.HTMLElement.prototype.releasePointerCapture = () => { };
}
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("ScrollBar", () => {
    it("should create scrollbar ref via useScrollbar hook", async () => {
        const { result } = await renderHook(() => useScrollbar());
        expect(result.current).toHaveLength(1);
        expect(result.current[0].current).toBeNull();
    });
    it("should ignore pointer move before drag starts", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 30, pointerId: 1 }));
        expect(onScroll).not.toHaveBeenCalled();
    });
    it("should trigger onScroll with x-axis coordinate when dragging in track", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 30, pointerId: 1 }));
        expect(onScroll).toHaveBeenCalled();
        expect(onScroll).toHaveBeenLastCalledWith(expect.closeTo(60, 6));
    });
    it("should clamp x-axis dragging to start and end bounds", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 0, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 100, pointerId: 1 }));
        expect(onScroll).toHaveBeenNthCalledWith(1, 0);
        expect(onScroll).toHaveBeenNthCalledWith(2, expect.closeTo(200, 6));
    });
    it("should stop dragging after pointerup", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 30, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointerup", { bubbles: true, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 50, pointerId: 1 }));
        expect(onScroll).toHaveBeenCalledTimes(1);
    });
    it("should not start dragging when pointerdown is not left button", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 2, clientX: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 60, pointerId: 1 }));
        expect(onScroll).not.toHaveBeenCalled();
    });
    it("should trigger onScroll with y-axis coordinate when dragging in track", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="y" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientY: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientY: 30, pointerId: 1 }));
        expect(onScroll).toHaveBeenCalled();
        expect(onScroll).toHaveBeenLastCalledWith(expect.closeTo(80, 6));
    });
    it("should clamp y-axis dragging to start and end bounds", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="y" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientY: 10, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientY: 0, pointerId: 1 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientY: 100, pointerId: 1 }));
        expect(onScroll).toHaveBeenNthCalledWith(1, 0);
        expect(onScroll).toHaveBeenNthCalledWith(2, expect.closeTo(300, 6));
    });
    it("should expose scrollbar methods via ref", async () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [
                boolean,
                boolean
            ];
            getEndCoordinate: () => number;
        }>();
        await render(<ScrollBar direction="x" scrollbar={scrollbarRef} viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>);
        expect(scrollbarRef.current).not.toBeNull();
        expect(scrollbarRef.current?.isOutOfBounds(-1, 0)).toEqual([true, false]);
        expect(scrollbarRef.current?.isOutOfBounds(1000, 0)).toEqual([false, true]);
        expect(scrollbarRef.current?.getEndCoordinate()).toBeCloseTo(200, 6);
    });
    it("should expose y-axis isOutOfBounds and end coordinate via ref", async () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [
                boolean,
                boolean
            ];
            getEndCoordinate: () => number;
        }>();
        await render(<ScrollBar direction="y" scrollbar={scrollbarRef} viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>);
        expect(scrollbarRef.current).not.toBeNull();
        expect(scrollbarRef.current?.isOutOfBounds(0, -1)).toEqual([true, false]);
        expect(scrollbarRef.current?.isOutOfBounds(0, 1000)).toEqual([false, true]);
        expect(scrollbarRef.current?.getEndCoordinate()).toBeCloseTo(300, 6);
    });
    it("should return zero end coordinate when content is not scrollable", async () => {
        const xScrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [
                boolean,
                boolean
            ];
            getEndCoordinate: () => number;
        }>();
        const yScrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [
                boolean,
                boolean
            ];
            getEndCoordinate: () => number;
        }>();
        await render(<>
            <ScrollBar direction="x" scrollbar={xScrollbarRef} viewportWidth={100} viewportHeight={100} totalWidth={100} totalHeight={200} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>
            <ScrollBar direction="y" scrollbar={yScrollbarRef} viewportWidth={100} viewportHeight={100} totalWidth={200} totalHeight={100} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>
        </>);
        expect(xScrollbarRef.current?.getEndCoordinate()).toBe(0);
        expect(yScrollbarRef.current?.getEndCoordinate()).toBe(0);
    });
    it("should use minimum thumb size when calculated size is too small", async () => {
        const { container } = await render(<>
            <ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={1000} totalHeight={200} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>
            <ScrollBar direction="y" viewportWidth={100} viewportHeight={100} totalWidth={200} totalHeight={1000} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>
        </>);
        const xThumb = container.children[0]?.firstElementChild as HTMLDivElement;
        const yThumb = container.children[1]?.firstElementChild as HTMLDivElement;
        expect(xThumb.style.width).toBe("20px");
        expect(yThumb.style.height).toBe("20px");
    });
    it("should clear scrollbar ref on unmount", async () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [
                boolean,
                boolean
            ];
            getEndCoordinate: () => number;
        }>();
        const { unmount } = await render(<ScrollBar direction="y" scrollbar={scrollbarRef} viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0}/>);
        expect(scrollbarRef.current).not.toBeNull();
        await unmount();
        expect(scrollbarRef.current).toBeNull();
    });
    it("should ignore stopDragging when pointerUp fires from a different pointer ID", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="x" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        // Start drag with pointer 1
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 10, pointerId: 1 }));
        // Release with a *different* pointer ID — stopDragging should bail out
        await fireEvent(thumb, new PointerEvent("pointerup", { bubbles: true, pointerId: 99 }));
        // Pointer 1 is still "active", so a subsequent move still triggers scroll
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientX: 30, pointerId: 1 }));
        expect(onScroll).toHaveBeenCalled();
    });
    it("should ignore pointerCancel from a different pointer ID", async () => {
        const onScroll = mock.fn();
        const { container } = await render(<ScrollBar direction="y" viewportWidth={100} viewportHeight={100} totalWidth={300} totalHeight={400} currentScrollPositionLeft={0} currentScrollPositionTop={0} onScroll={onScroll}/>);
        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;
        await fireEvent(thumb, new PointerEvent("pointerdown", { bubbles: true, button: 0, clientY: 10, pointerId: 1 }));
        // Cancel with wrong pointer ID — drag should continue
        await fireEvent(thumb, new PointerEvent("pointercancel", { bubbles: true, pointerId: 99 }));
        await fireEvent(thumb, new PointerEvent("pointermove", { bubbles: true, clientY: 40, pointerId: 1 }));
        expect(onScroll).toHaveBeenCalled();
    });
});
