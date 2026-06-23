import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import AutoSizer from "../auto-sizer.js";
import type { Size } from "../types.js";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

type ResizeObserverCb = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

// ResizeObserver 在 jsdom 中未实现，需手动 mock
let resizeCallback: ResizeObserverCb;
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
    mockObserve.mockClear();
    mockDisconnect.mockClear();

    (globalThis as typeof globalThis & { ResizeObserver: unknown }).ResizeObserver =
        class MockResizeObserver {
            constructor(callback: ResizeObserverCb) {
                resizeCallback = callback;
            }
            observe = mockObserve;
            disconnect = mockDisconnect;
            unobserve = jest.fn();
        };
});

/** 触发 ResizeObserver 回调，模拟容器尺寸变化 */
const triggerResize = (width: number, height: number) => {
    act(() => {
        resizeCallback(
            [{ contentRect: { width, height } } as ResizeObserverEntry],
            {} as ResizeObserver,
        );
    });
};

describe("AutoSizer", () => {
    it("以 defaultWidth / defaultHeight 作为初始尺寸渲染", () => {
        render(
            <AutoSizer defaultWidth={100} defaultHeight={200}>
                {({ width, height }) => (
                    <div data-testid="child">{`${width}x${height}`}</div>
                )}
            </AutoSizer>,
        );

        expect(screen.getByTestId("child").textContent).toBe("100x200");
    });

    it("ResizeObserver 触发后更新子渲染函数收到的尺寸", () => {
        const sizes: Size[] = [];

        render(
            <AutoSizer>
                {(size) => {
                    sizes.push(size);
                    return <div />;
                }}
            </AutoSizer>,
        );

        triggerResize(800, 600);

        expect(sizes[sizes.length - 1]).toEqual({ width: 800, height: 600 });
    });

    it("尺寸未变化时不触发额外重渲染", () => {
        const renderCount = { current: 0 };

        render(
            <AutoSizer>
                {() => {
                    renderCount.current += 1;
                    return <div />;
                }}
            </AutoSizer>,
        );

        triggerResize(800, 600);
        const afterFirst = renderCount.current;

        triggerResize(800, 600); // 相同尺寸，不应触发 setSize

        expect(renderCount.current).toBe(afterFirst);
    });

    it("尺寸未变化时不触发 onResize 回调", () => {
        const onResize = jest.fn<(size: Size) => void>();

        render(
            <AutoSizer onResize={onResize}>
                {() => <div />}
            </AutoSizer>,
        );

        triggerResize(800, 600);
        triggerResize(800, 600); // same size again

        expect(onResize).toHaveBeenCalledTimes(1);
    });

    it("onResize 回调在尺寸变化时被调用", () => {
        const onResize = jest.fn<(size: Size) => void>();

        render(
            <AutoSizer onResize={onResize}>
                {() => <div />}
            </AutoSizer>,
        );

        triggerResize(500, 300);

        expect(onResize).toHaveBeenCalledTimes(1);
        expect(onResize).toHaveBeenCalledWith({ width: 500, height: 300 });
    });

    it("disableHeight 时高度固定为 defaultHeight", () => {
        const sizes: Size[] = [];

        render(
            <AutoSizer defaultHeight={400} disableHeight>
                {(size) => {
                    sizes.push(size);
                    return <div />;
                }}
            </AutoSizer>,
        );

        triggerResize(800, 600);

        expect(sizes[sizes.length - 1]).toEqual({ width: 800, height: 400 });
    });

    it("disableWidth 时宽度固定为 defaultWidth", () => {
        const sizes: Size[] = [];

        render(
            <AutoSizer defaultWidth={320} disableWidth>
                {(size) => {
                    sizes.push(size);
                    return <div />;
                }}
            </AutoSizer>,
        );

        triggerResize(800, 600);

        expect(sizes[sizes.length - 1]).toEqual({ width: 320, height: 600 });
    });

    it("卸载时断开 ResizeObserver", () => {
        const { unmount } = render(
            <AutoSizer>
                {() => <div />}
            </AutoSizer>,
        );

        unmount();

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });

    it("挂载时调用 observer.observe", () => {
        render(
            <AutoSizer>
                {() => <div />}
            </AutoSizer>,
        );

        expect(mockObserve).toHaveBeenCalledTimes(1);
    });

    it("传入 className 附加到容器元素", () => {
        const { container } = render(
            <AutoSizer className="my-sizer">
                {() => <div />}
            </AutoSizer>,
        );

        expect(container.firstElementChild?.classList.contains("my-sizer")).toBe(true);
    });

    it("尺寸值四舍五入为整数", () => {
        const sizes: Size[] = [];

        render(
            <AutoSizer>
                {(size) => {
                    sizes.push(size);
                    return <div />;
                }}
            </AutoSizer>,
        );

        triggerResize(799.7, 600.3);

        expect(sizes[sizes.length - 1]).toEqual({ width: 800, height: 600 });
    });
});
