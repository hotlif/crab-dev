import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, renderHook } from "@crab-dev/wake/test/react";
import { useControllableValue } from "../useControllableValue.js";
import { useControllableOpen } from "../useControllableOpen.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe("useControllableValue", () => {
    it("非受控：以 defaultValue 初始化，setValue 更新内部值并触发 onValueChange", async () => {
        const onValueChange = mock.fn();
        const { result } = await renderHook(() => useControllableValue<number>({ defaultValue: 1, onValueChange }));
        expect(result.current[0]).toBe(1);
        await act(() => result.current[1](2));
        expect(result.current[0]).toBe(2);
        expect(onValueChange).toHaveBeenCalledWith(2);
    });
    it("受控：值跟随 props.value，setValue 不改内部值但仍触发 onValueChange", async () => {
        const onValueChange = mock.fn();
        const { result, rerender } = await renderHook(({ value }: {
            value: number;
        }) => useControllableValue<number>({ value, onValueChange }), { initialProps: { value: 10 } });
        expect(result.current[0]).toBe(10);
        await act(() => result.current[1](20));
        // 受控模式内部状态不动，仍等于 props.value
        expect(result.current[0]).toBe(10);
        expect(onValueChange).toHaveBeenCalledWith(20);
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
    it("将额外参数原样透传给 onValueChange", async () => {
        const onValueChange = mock.fn();
        const { result } = await renderHook(() => useControllableValue<string, [
            string
        ]>({
            defaultValue: "a",
            onValueChange,
        }));
        await act(() => result.current[1]("b", "extra"));
        expect(onValueChange).toHaveBeenCalledWith("b", "extra");
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
        await act(() => result.current[1](true, { reason: "trigger" }));
        expect(result.current[0]).toBe(true);
        expect(onOpenChange).toHaveBeenCalledWith(true, { reason: "trigger" });
    });
    it("受控 open 跟随外部，切换只触发回调", async () => {
        const onOpenChange = mock.fn();
        const { result, rerender } = await renderHook(({ open }: {
            open: boolean;
        }) => useControllableOpen({ open, onOpenChange }), { initialProps: { open: false } });
        await act(() => result.current[1](true, { reason: "trigger" }));
        expect(result.current[0]).toBe(false);
        expect(onOpenChange).toHaveBeenCalledWith(true, { reason: "trigger" });
        await rerender({ open: true });
        expect(result.current[0]).toBe(true);
    });
    it('passes typed change details without notifying on external updates', async () => {
        const onOpenChange = mock.fn();
        const { result, rerender } = await renderHook(({ open }: { open: boolean }) => useControllableOpen<{ reason: 'escape' }>({ open, onOpenChange }), { initialProps: { open: true } });
        await act(() => result.current[1](false, { reason: 'escape' }));
        expect(onOpenChange).toHaveBeenCalledWith(false, { reason: 'escape' });
        await rerender({ open: false });
        expect(onOpenChange).toHaveBeenCalledTimes(1);
    });
});

describe('semantic state initialization', () => {
    it('reads defaults once and never notifies for initialization or parent updates', async () => {
        const onValueChange = mock.fn();
        const { result, rerender } = await renderHook(({ value, initial }: { value?: string; initial: string }) => useControllableValue<string, [{ reason: 'input' }]>({ value, defaultValue: initial, onValueChange }), { initialProps: { value: undefined as string | undefined, initial: 'first' } });
        expect(result.current[0]).toBe('first');
        await rerender({ value: undefined, initial: 'later' });
        expect(result.current[0]).toBe('first');
        await rerender({ value: 'parent', initial: 'later' });
        expect(result.current[0]).toBe('parent');
        expect(onValueChange).not.toHaveBeenCalled();
        await act(() => result.current[1]('requested', { reason: 'input' }));
        expect(result.current[0]).toBe('parent');
        expect(onValueChange).toHaveBeenCalledWith('requested', { reason: 'input' });
    });
    it('preserves read-only controlled snapshots without requiring a callback', async () => {
        const { result } = await renderHook(() => useControllableOpen<{ reason: 'escape' }>({ open: true }));
        await act(() => result.current[1](false, { reason: 'escape' }));
        expect(result.current[0]).toBe(true);
    });
});
