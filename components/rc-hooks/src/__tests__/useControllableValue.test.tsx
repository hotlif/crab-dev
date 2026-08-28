import { describe, expect, it, mock, act, renderHook } from "@crab-dev/wake/test/react";
import { useControllableValue } from "../useControllableValue.js";
import { useControllableOpen } from "../useControllableOpen.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("useControllableValue", () => {
    it("非受控：以 defaultValue 初始化，setValue 更新内部值并触发 onChange", async () => {
        const onChange = mock.fn();
        const { result } = await renderHook(() => useControllableValue<number>({ defaultValue: 1, onChange }));
        expect(result.current[0]).toBe(1);
        await act(() => result.current[1](2));
        expect(result.current[0]).toBe(2);
        expect(onChange).toHaveBeenCalledWith(2);
    });
    it("受控：值跟随 props.value，setValue 不改内部值但仍触发 onChange", async () => {
        const onChange = mock.fn();
        const { result, rerender } = await renderHook(({ value }: {
            value: number;
        }) => useControllableValue<number>({ value, onChange }), { initialProps: { value: 10 } });
        expect(result.current[0]).toBe(10);
        await act(() => result.current[1](20));
        // 受控模式内部状态不动，仍等于 props.value
        expect(result.current[0]).toBe(10);
        expect(onChange).toHaveBeenCalledWith(20);
        // 外部更新 value 后才反映
        await rerender({ value: 30 });
        expect(result.current[0]).toBe(30);
    });
    it("受控 → 非受控切换后由内部状态接管", async () => {
        const { result, rerender } = await renderHook(({ value }: {
            value: number | undefined;
        }) => useControllableValue<number>({ value, defaultValue: 0 }), { initialProps: { value: 5 as number | undefined } });
        expect(result.current[0]).toBe(5);
        await rerender({ value: undefined });
        await act(() => result.current[1](9));
        expect(result.current[0]).toBe(9);
    });
    it("将额外参数原样透传给 onChange", async () => {
        const onChange = mock.fn();
        const { result } = await renderHook(() => useControllableValue<string, [
            string
        ]>({
            defaultValue: "a",
            onChange,
        }));
        await act(() => result.current[1]("b", "extra"));
        expect(onChange).toHaveBeenCalledWith("b", "extra");
    });
    it("setValue 引用在多次渲染间保持稳定", async () => {
        const { result, rerender } = await renderHook(({ value }: {
            value: number;
        }) => useControllableValue<number>({ value }), { initialProps: { value: 1 } });
        const first = result.current[1];
        await rerender({ value: 2 });
        expect(result.current[1]).toBe(first);
    });
});
describe("useControllableOpen", () => {
    it("默认关闭，可切换并触发 onOpenChange", async () => {
        const onOpenChange = mock.fn();
        const { result } = await renderHook(() => useControllableOpen({ onOpenChange }));
        expect(result.current[0]).toBe(false);
        await act(() => result.current[1](true));
        expect(result.current[0]).toBe(true);
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });
    it("受控 open 跟随外部，切换只触发回调", async () => {
        const onOpenChange = mock.fn();
        const { result, rerender } = await renderHook(({ open }: {
            open: boolean;
        }) => useControllableOpen({ open, onOpenChange }), { initialProps: { open: false } });
        await act(() => result.current[1](true));
        expect(result.current[0]).toBe(false);
        expect(onOpenChange).toHaveBeenCalledWith(true);
        await rerender({ open: true });
        expect(result.current[0]).toBe(true);
    });
    it("setOpen 忽略调用方附带的额外参数（如 Floating UI 的 event / reason）", async () => {
        const onOpenChange = mock.fn();
        const { result } = await renderHook(() => useControllableOpen({ onOpenChange }));
        const setOpen = result.current[1] as (open: boolean, ...extra: unknown[]) => void;
        await act(() => setOpen(true, { isTrusted: false }, "focus"));
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });
});
