import { createRef } from "react";
import { cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import { afterEach, describe, it, expect, jest } from "@jest/globals";

import ScrollBar, { useScrollbar } from "../scrollbar.js";

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

describe("ScrollBar", () => {
    afterEach(() => {
        cleanup();
    });
    it("should create scrollbar ref via useScrollbar hook", () => {
        const { result } = renderHook(() => useScrollbar());

        expect(result.current).toHaveLength(1);
        expect(result.current[0].current).toBeNull();
    });

    it("should ignore pointer move before drag starts", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="x"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerMove(thumb, { clientX: 30, pointerId: 1 });

        expect(onScroll).not.toHaveBeenCalled();
    });

    it("should trigger onScroll with x-axis coordinate when dragging in track", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="x"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 0, clientX: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 30, pointerId: 1 });

        expect(onScroll).toHaveBeenCalled();
        expect(onScroll).toHaveBeenLastCalledWith(expect.closeTo(60, 6));
    });

    it("should clamp x-axis dragging to start and end bounds", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="x"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 0, clientX: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 0, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 100, pointerId: 1 });

        expect(onScroll).toHaveBeenNthCalledWith(1, 0);
        expect(onScroll).toHaveBeenNthCalledWith(2, expect.closeTo(200, 6));
    });

    it("should stop dragging after pointerup", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="x"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 0, clientX: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 30, pointerId: 1 });
        fireEvent.pointerUp(thumb, { pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 50, pointerId: 1 });

        expect(onScroll).toHaveBeenCalledTimes(1);
    });

    it("should not start dragging when pointerdown is not left button", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="x"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 2, clientX: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientX: 60, pointerId: 1 });

        expect(onScroll).not.toHaveBeenCalled();
    });

    it("should trigger onScroll with y-axis coordinate when dragging in track", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="y"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 0, clientY: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientY: 30, pointerId: 1 });

        expect(onScroll).toHaveBeenCalled();
        expect(onScroll).toHaveBeenLastCalledWith(expect.closeTo(80, 6));
    });

    it("should clamp y-axis dragging to start and end bounds", () => {
        const onScroll = jest.fn();

        const { container } = render(
            <ScrollBar
                direction="y"
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
                onScroll={onScroll}
            />
        );

        const thumb = container.firstElementChild?.firstElementChild as HTMLDivElement;

        fireEvent.pointerDown(thumb, { button: 0, clientY: 10, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientY: 0, pointerId: 1 });
        fireEvent.pointerMove(thumb, { clientY: 100, pointerId: 1 });

        expect(onScroll).toHaveBeenNthCalledWith(1, 0);
        expect(onScroll).toHaveBeenNthCalledWith(2, expect.closeTo(300, 6));
    });

    it("should expose scrollbar methods via ref", () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [boolean, boolean],
            getEndCoordinate: () => number
        }>();

        render(
            <ScrollBar
                direction="x"
                scrollbar={scrollbarRef}
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
            />
        );

        expect(scrollbarRef.current).not.toBeNull();
        expect(scrollbarRef.current?.isOutOfBounds(-1, 0)).toEqual([true, false]);
        expect(scrollbarRef.current?.isOutOfBounds(1000, 0)).toEqual([false, true]);
        expect(scrollbarRef.current?.getEndCoordinate()).toBeCloseTo(200, 6);
    });

    it("should expose y-axis isOutOfBounds and end coordinate via ref", () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [boolean, boolean],
            getEndCoordinate: () => number
        }>();

        render(
            <ScrollBar
                direction="y"
                scrollbar={scrollbarRef}
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
            />
        );

        expect(scrollbarRef.current).not.toBeNull();
        expect(scrollbarRef.current?.isOutOfBounds(0, -1)).toEqual([true, false]);
        expect(scrollbarRef.current?.isOutOfBounds(0, 1000)).toEqual([false, true]);
        expect(scrollbarRef.current?.getEndCoordinate()).toBeCloseTo(300, 6);
    });

    it("should return zero end coordinate when content is not scrollable", () => {
        const xScrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [boolean, boolean],
            getEndCoordinate: () => number
        }>();
        const yScrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [boolean, boolean],
            getEndCoordinate: () => number
        }>();

        render(
            <>
                <ScrollBar
                    direction="x"
                    scrollbar={xScrollbarRef}
                    viewportWidth={100}
                    viewportHeight={100}
                    totalWidth={100}
                    totalHeight={200}
                    currentScrollPositionLeft={0}
                    currentScrollPositionTop={0}
                />
                <ScrollBar
                    direction="y"
                    scrollbar={yScrollbarRef}
                    viewportWidth={100}
                    viewportHeight={100}
                    totalWidth={200}
                    totalHeight={100}
                    currentScrollPositionLeft={0}
                    currentScrollPositionTop={0}
                />
            </>
        );

        expect(xScrollbarRef.current?.getEndCoordinate()).toBe(0);
        expect(yScrollbarRef.current?.getEndCoordinate()).toBe(0);
    });

    it("should use minimum thumb size when calculated size is too small", () => {
        const { container } = render(
            <>
                <ScrollBar
                    direction="x"
                    viewportWidth={100}
                    viewportHeight={100}
                    totalWidth={1000}
                    totalHeight={200}
                    currentScrollPositionLeft={0}
                    currentScrollPositionTop={0}
                />
                <ScrollBar
                    direction="y"
                    viewportWidth={100}
                    viewportHeight={100}
                    totalWidth={200}
                    totalHeight={1000}
                    currentScrollPositionLeft={0}
                    currentScrollPositionTop={0}
                />
            </>
        );

        const xThumb = container.children[0]?.firstElementChild as HTMLDivElement;
        const yThumb = container.children[1]?.firstElementChild as HTMLDivElement;

        expect(xThumb.style.width).toBe("20px");
        expect(yThumb.style.height).toBe("20px");
    });

    it("should clear scrollbar ref on unmount", () => {
        const scrollbarRef = createRef<{
            isOutOfBounds: (left: number, top: number) => [boolean, boolean],
            getEndCoordinate: () => number
        }>();

        const { unmount } = render(
            <ScrollBar
                direction="y"
                scrollbar={scrollbarRef}
                viewportWidth={100}
                viewportHeight={100}
                totalWidth={300}
                totalHeight={400}
                currentScrollPositionLeft={0}
                currentScrollPositionTop={0}
            />
        );

        expect(scrollbarRef.current).not.toBeNull();

        unmount();

        expect(scrollbarRef.current).toBeNull();
    });
});
