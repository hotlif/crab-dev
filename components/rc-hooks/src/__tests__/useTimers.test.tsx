import { act, cleanup, renderHook } from "@testing-library/react";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    jest,
} from "@jest/globals";

import { useTimeout } from "../useTimeout.js";
import { useInterval } from "../useInterval.js";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("useTimeout", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        cleanup();
        jest.useRealTimers();
    });

    it("delay 后触发一次回调", () => {
        const cb = jest.fn();
        renderHook(() => useTimeout(cb, 100));

        expect(cb).not.toHaveBeenCalled();
        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it("delay 为 null 时不计时", () => {
        const cb = jest.fn();
        renderHook(() => useTimeout(cb, null));

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(cb).not.toHaveBeenCalled();
    });

    it("卸载后清理，不再触发", () => {
        const cb = jest.fn();
        const { unmount } = renderHook(() => useTimeout(cb, 100));

        unmount();
        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(cb).not.toHaveBeenCalled();
    });
});

describe("useInterval", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        cleanup();
        jest.useRealTimers();
    });

    it("按 delay 周期性触发", () => {
        const cb = jest.fn();
        renderHook(() => useInterval(cb, 100));

        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(cb).toHaveBeenCalledTimes(3);
    });

    it("delay 为 null 时不计时", () => {
        const cb = jest.fn();
        renderHook(() => useInterval(cb, null));

        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(cb).not.toHaveBeenCalled();
    });
});
