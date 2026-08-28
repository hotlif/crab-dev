import { describe, expect, it, mock, act, renderHook } from "@crab-dev/wake/test/react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useDragResize } from "../useDragResize.js";
import type { DragResizeOptions, DragResizeResult } from "../useDragResize.js";
/** 构造并触发一次把手上的 pointerdown（jsdom 无 PointerEvent 构造器，用形状等价的对象） */
async function pointerDown(result: {
    current: DragResizeResult;
}, overrides: Partial<{
    button: number;
    clientX: number;
    clientY: number;
}> = {}) {
    await act(() => {
        result.current.handleProps.onPointerDown({
            button: 0,
            pointerId: 1,
            clientX: 100,
            clientY: 100,
            currentTarget: document.createElement("div"),
            preventDefault: () => { },
            ...overrides,
        } as unknown as ReactPointerEvent<HTMLElement>);
    });
}
/** 在 window 上派发拖拽事件（监听读的是 clientX/clientY，直接挂在事件实例上） */
async function firePointer(type: "pointermove" | "pointerup" | "pointercancel", clientX = 0, clientY = 0) {
    await act(() => {
        window.dispatchEvent(Object.assign(new Event(type), { clientX, clientY }));
    });
}
async function setup(options: DragResizeOptions) {
    return await renderHook(() => useDragResize(options));
}
describe("useDragResize", () => {
    it("edge=end 时向正方向拖增大，松手后结束拖拽", async () => {
        const { result } = await setup({ defaultSize: 280 });
        await pointerDown(result);
        expect(result.current.dragging).toBe(true);
        await firePointer("pointermove", 140, 100);
        expect(result.current.size).toBe(320);
        await firePointer("pointerup");
        expect(result.current.dragging).toBe(false);
        // 松手后再动不再跟随
        await firePointer("pointermove", 400, 100);
        expect(result.current.size).toBe(320);
    });
    it("edge=start 时方向反转：向负方向拖增大", async () => {
        const { result } = await setup({ defaultSize: 280, edge: "start" });
        await pointerDown(result);
        await firePointer("pointermove", 60, 100);
        expect(result.current.size).toBe(320);
        await firePointer("pointerup");
    });
    it("axis=y 时按纵向位移调整", async () => {
        const { result } = await setup({ defaultSize: 200, axis: "y" });
        await pointerDown(result);
        await firePointer("pointermove", 100, 150);
        expect(result.current.size).toBe(250);
        await firePointer("pointerup");
    });
    it("拖拽与 setSize 都被夹在 min/max 内", async () => {
        const { result } = await setup({ defaultSize: 280, min: 200, max: 400 });
        await pointerDown(result);
        await firePointer("pointermove", 1000, 100);
        expect(result.current.size).toBe(400);
        await firePointer("pointermove", -1000, 100);
        expect(result.current.size).toBe(200);
        await firePointer("pointerup");
        await act(() => result.current.setSize(9999));
        expect(result.current.size).toBe(400);
    });
    it("拖拽期间锁定全局 user-select 与 cursor，结束后还原", async () => {
        const { result } = await setup({ defaultSize: 280 });
        await pointerDown(result);
        expect(document.body.style.userSelect).toBe("none");
        expect(document.body.style.cursor).toBe("col-resize");
        await firePointer("pointerup");
        expect(document.body.style.userSelect).toBe("");
        expect(document.body.style.cursor).toBe("");
    });
    it("卸载时兜底清理进行中的拖拽", async () => {
        const { result, unmount } = await setup({ defaultSize: 280 });
        await pointerDown(result);
        expect(document.body.style.userSelect).toBe("none");
        await unmount();
        expect(document.body.style.userSelect).toBe("");
        expect(document.body.style.cursor).toBe("");
    });
    it("reset 复位到 defaultSize", async () => {
        const { result } = await setup({ defaultSize: 280, min: 100 });
        await act(() => result.current.setSize(150));
        expect(result.current.size).toBe(150);
        await act(() => result.current.reset());
        expect(result.current.size).toBe(280);
    });
    it("受控模式下不改内部值，变化经 onChange 通知", async () => {
        const onChange = mock.fn();
        const { result } = await setup({ size: 300, defaultSize: 280, onChange });
        await pointerDown(result);
        await firePointer("pointermove", 140, 100);
        expect(onChange).toHaveBeenLastCalledWith(340);
        // 受控：外部没回写，size 保持 prop 值
        expect(result.current.size).toBe(300);
        await firePointer("pointerup");
    });
    it("忽略鼠标非主键按下", async () => {
        const { result } = await setup({ defaultSize: 280 });
        await pointerDown(result, { button: 2 });
        expect(result.current.dragging).toBe(false);
        await firePointer("pointermove", 200, 100);
        expect(result.current.size).toBe(280);
    });
    it("onDraggingChange 在开始与结束各触发一次", async () => {
        const onDraggingChange = mock.fn();
        const { result } = await setup({ defaultSize: 280, onDraggingChange });
        await pointerDown(result);
        expect(onDraggingChange).toHaveBeenLastCalledWith(true);
        await firePointer("pointerup");
        expect(onDraggingChange).toHaveBeenLastCalledWith(false);
        expect(onDraggingChange).toHaveBeenCalledTimes(2);
    });
});
