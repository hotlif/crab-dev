import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useDragResize } from "../useDragResize.js";
import type { DragResizeOptions, DragResizeResult } from "../useDragResize.js";

/** 构造并触发一次把手上的 pointerdown（jsdom 无 PointerEvent 构造器，用形状等价的对象） */
function pointerDown(
    result: { current: DragResizeResult },
    overrides: Partial<{ button: number; clientX: number; clientY: number }> = {},
) {
    act(() => {
        result.current.handleProps.onPointerDown({
            button: 0,
            pointerId: 1,
            clientX: 100,
            clientY: 100,
            currentTarget: document.createElement("div"),
            preventDefault: () => {},
            ...overrides,
        } as unknown as ReactPointerEvent<HTMLElement>);
    });
}

/** 在 window 上派发拖拽事件（监听读的是 clientX/clientY，直接挂在事件实例上） */
function firePointer(type: "pointermove" | "pointerup" | "pointercancel", clientX = 0, clientY = 0) {
    act(() => {
        window.dispatchEvent(Object.assign(new Event(type), { clientX, clientY }));
    });
}

function setup(options: DragResizeOptions) {
    return renderHook(() => useDragResize(options));
}

describe("useDragResize", () => {
    it("edge=end 时向正方向拖增大，松手后结束拖拽", () => {
        const { result } = setup({ defaultSize: 280 });
        pointerDown(result);
        expect(result.current.dragging).toBe(true);

        firePointer("pointermove", 140, 100);
        expect(result.current.size).toBe(320);

        firePointer("pointerup");
        expect(result.current.dragging).toBe(false);
        // 松手后再动不再跟随
        firePointer("pointermove", 400, 100);
        expect(result.current.size).toBe(320);
    });

    it("edge=start 时方向反转：向负方向拖增大", () => {
        const { result } = setup({ defaultSize: 280, edge: "start" });
        pointerDown(result);
        firePointer("pointermove", 60, 100);
        expect(result.current.size).toBe(320);
        firePointer("pointerup");
    });

    it("axis=y 时按纵向位移调整", () => {
        const { result } = setup({ defaultSize: 200, axis: "y" });
        pointerDown(result);
        firePointer("pointermove", 100, 150);
        expect(result.current.size).toBe(250);
        firePointer("pointerup");
    });

    it("拖拽与 setSize 都被夹在 min/max 内", () => {
        const { result } = setup({ defaultSize: 280, min: 200, max: 400 });
        pointerDown(result);
        firePointer("pointermove", 1000, 100);
        expect(result.current.size).toBe(400);
        firePointer("pointermove", -1000, 100);
        expect(result.current.size).toBe(200);
        firePointer("pointerup");

        act(() => result.current.setSize(9999));
        expect(result.current.size).toBe(400);
    });

    it("拖拽期间锁定全局 user-select 与 cursor，结束后还原", () => {
        const { result } = setup({ defaultSize: 280 });
        pointerDown(result);
        expect(document.body.style.userSelect).toBe("none");
        expect(document.body.style.cursor).toBe("col-resize");
        firePointer("pointerup");
        expect(document.body.style.userSelect).toBe("");
        expect(document.body.style.cursor).toBe("");
    });

    it("卸载时兜底清理进行中的拖拽", () => {
        const { result, unmount } = setup({ defaultSize: 280 });
        pointerDown(result);
        expect(document.body.style.userSelect).toBe("none");
        unmount();
        expect(document.body.style.userSelect).toBe("");
        expect(document.body.style.cursor).toBe("");
    });

    it("reset 复位到 defaultSize", () => {
        const { result } = setup({ defaultSize: 280, min: 100 });
        act(() => result.current.setSize(150));
        expect(result.current.size).toBe(150);
        act(() => result.current.reset());
        expect(result.current.size).toBe(280);
    });

    it("受控模式下不改内部值，变化经 onChange 通知", () => {
        const onChange = jest.fn();
        const { result } = setup({ size: 300, defaultSize: 280, onChange });
        pointerDown(result);
        firePointer("pointermove", 140, 100);
        expect(onChange).toHaveBeenLastCalledWith(340);
        // 受控：外部没回写，size 保持 prop 值
        expect(result.current.size).toBe(300);
        firePointer("pointerup");
    });

    it("忽略鼠标非主键按下", () => {
        const { result } = setup({ defaultSize: 280 });
        pointerDown(result, { button: 2 });
        expect(result.current.dragging).toBe(false);
        firePointer("pointermove", 200, 100);
        expect(result.current.size).toBe(280);
    });

    it("onDraggingChange 在开始与结束各触发一次", () => {
        const onDraggingChange = jest.fn();
        const { result } = setup({ defaultSize: 280, onDraggingChange });
        pointerDown(result);
        expect(onDraggingChange).toHaveBeenLastCalledWith(true);
        firePointer("pointerup");
        expect(onDraggingChange).toHaveBeenLastCalledWith(false);
        expect(onDraggingChange).toHaveBeenCalledTimes(2);
    });
});
