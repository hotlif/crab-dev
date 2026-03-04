import { createRef } from "react";
import { fireEvent, render, renderHook } from "@testing-library/react";

import ScrollBar, { useScrollbar } from "../scrollbar";

describe("ScrollBar", () => {
    it("should create scrollbar ref via useScrollbar hook", () => {
        const { result } = renderHook(() => useScrollbar());

        expect(result.current).toHaveLength(1);
        expect(result.current[0].current).toBeNull();
    });

    it("should ignore mouse move before drag starts", () => {
        const onScroll = jest.fn();

        render(
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

        fireEvent.mouseMove(document, { clientX: 30 });

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

        fireEvent.mouseDown(thumb, { button: 0, clientX: 10 });
        fireEvent.mouseMove(document, { clientX: 30 });

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

        fireEvent.mouseDown(thumb, { button: 0, clientX: 10 });
        fireEvent.mouseMove(document, { clientX: 0 });
        fireEvent.mouseMove(document, { clientX: 100 });

        expect(onScroll).toHaveBeenNthCalledWith(1, 0);
        expect(onScroll).toHaveBeenNthCalledWith(2, expect.closeTo(200, 6));
    });

    it("should stop dragging after mouseup", () => {
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

        fireEvent.mouseDown(thumb, { button: 0, clientX: 10 });
        fireEvent.mouseMove(document, { clientX: 30 });
        fireEvent.mouseUp(document);
        fireEvent.mouseMove(document, { clientX: 50 });

        expect(onScroll).toHaveBeenCalledTimes(1);
    });

    it("should not start dragging when mousedown is not left button", () => {
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

        fireEvent.mouseDown(thumb, { button: 2, clientX: 10 });
        fireEvent.mouseMove(document, { clientX: 60 });

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

        fireEvent.mouseDown(thumb, { button: 0, clientY: 10 });
        fireEvent.mouseMove(document, { clientY: 30 });

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

        fireEvent.mouseDown(thumb, { button: 0, clientY: 10 });
        fireEvent.mouseMove(document, { clientY: 0 });
        fireEvent.mouseMove(document, { clientY: 100 });

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
