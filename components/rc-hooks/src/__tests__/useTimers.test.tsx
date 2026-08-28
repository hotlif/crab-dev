import { afterEach, beforeEach, describe, expect, it, mock, clock, act, renderHook } from "@crab-dev/wake/test/react";
import { useTimeout } from "../useTimeout.js";
import { useInterval } from "../useInterval.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("useTimeout", () => {
    beforeEach(async () => {
        await clock.fake();
    });
    afterEach(async () => {
        await clock.restore();
    });
    it("delay 后触发一次回调", async () => {
        const cb = mock.fn();
        await renderHook(() => useTimeout(cb, 100));
        expect(cb).not.toHaveBeenCalled();
        await act(async () => {
            await clock.advanceBy(100);
        });
        expect(cb).toHaveBeenCalledTimes(1);
    });
    it("delay 为 null 时不计时", async () => {
        const cb = mock.fn();
        await renderHook(() => useTimeout(cb, null));
        await act(async () => {
            await clock.advanceBy(1000);
        });
        expect(cb).not.toHaveBeenCalled();
    });
    it("卸载后清理，不再触发", async () => {
        const cb = mock.fn();
        const { unmount } = await renderHook(() => useTimeout(cb, 100));
        await unmount();
        await act(async () => {
            await clock.advanceBy(100);
        });
        expect(cb).not.toHaveBeenCalled();
    });
});
describe("useInterval", () => {
    beforeEach(async () => {
        await clock.fake();
    });
    afterEach(async () => {
        await clock.restore();
    });
    it("按 delay 周期性触发", async () => {
        const cb = mock.fn();
        await renderHook(() => useInterval(cb, 100));
        await act(async () => {
            await clock.advanceBy(300);
        });
        expect(cb).toHaveBeenCalledTimes(3);
    });
    it("delay 为 null 时不计时", async () => {
        const cb = mock.fn();
        await renderHook(() => useInterval(cb, null));
        await act(async () => {
            await clock.advanceBy(1000);
        });
        expect(cb).not.toHaveBeenCalled();
    });
});
