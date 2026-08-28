import { describe, expect, it, renderHook } from "@crab-dev/wake/test/react";
import { useEventCallback } from "../useEventCallback.js";
import { usePrevious } from "../usePrevious.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("useEventCallback", () => {
    it("返回的函数引用在多次渲染间保持稳定", async () => {
        const { result, rerender } = await renderHook(({ fn }: {
            fn: () => number;
        }) => useEventCallback(fn), { initialProps: { fn: () => 1 } });
        const stable = result.current;
        await rerender({ fn: () => 2 });
        expect(result.current).toBe(stable);
    });
    it("调用稳定引用时读取最新实现", async () => {
        const { result, rerender } = await renderHook(({ fn }: {
            fn: () => number;
        }) => useEventCallback(fn), { initialProps: { fn: () => 1 } });
        const stable = result.current;
        await rerender({ fn: () => 2 });
        expect(stable()).toBe(2);
    });
    it("透传参数给最新实现", async () => {
        const { result } = await renderHook(() => useEventCallback((a: number, b: number) => a + b));
        expect(result.current(2, 3)).toBe(5);
    });
});
describe("usePrevious", () => {
    it("首次渲染返回 undefined，之后返回上一次提交的值", async () => {
        const { result, rerender } = await renderHook(({ v }: {
            v: number;
        }) => usePrevious(v), { initialProps: { v: 1 } });
        expect(result.current).toBeUndefined();
        await rerender({ v: 2 });
        expect(result.current).toBe(1);
        await rerender({ v: 3 });
        expect(result.current).toBe(2);
    });
});
