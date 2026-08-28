import { beforeAll, describe, expect, it, mock, fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
/* eslint-disable @typescript-eslint/no-explicit-any */
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom 无 ResizeObserver：覆盖层测量依赖它，提供空实现
(globalThis as any).ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
// 轻量替身：忠实反映 rc-line-edit 对 numberEdit 的契约（透传 input 事件 / value / ref、
// 渲染 suffix 内的 Stepper、allowClear 清除按钮回调 onClear），隔离外壳打包细节。
mock.module("@crab-dev/rc-line-edit", () => ({
    __esModule: true,
    default: ({ ref, containerRef, prefix, suffix, value, onChange, onFocus, onBlur, onKeyDown, allowClear, onClear, disabled, readOnly, size: _size, status: _status, bordered: _bordered, ...rest }: any) => (<div ref={containerRef} data-testid="line-edit">
        {prefix}
        <input ref={ref} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} disabled={disabled} readOnly={readOnly} {...rest}/>
        {allowClear && typeof value === "string" && value.length > 0 && !disabled && !readOnly && (<button type="button" aria-label="清除" onClick={onClear}>x</button>)}
        {suffix}
    </div>),
}));
let NumberEdit: (typeof import("../numberEdit.js"))["default"];
beforeAll(async () => {
    const numberEditModule = await mock.import<typeof import("../numberEdit.js")>("../numberEdit.js");
    NumberEdit = numberEditModule.default;
});
const getInput = () => screen.getByRole("spinbutton") as HTMLInputElement;
const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
const changeInputValue = async (input: HTMLInputElement, value: string) => {
    if (!inputValueSetter) {
        throw new Error("HTMLInputElement.value setter is unavailable");
    }
    inputValueSetter.call(input, value);
    await fireEvent.input(input);
};
const stepUp = () => document.querySelector('button[aria-label="增加"]') as HTMLButtonElement;
const stepDown = () => document.querySelector('button[aria-label="减少"]') as HTMLButtonElement;
describe("NumberEdit", () => {
    describe("基础渲染与无障碍", () => {
        it("以 spinbutton 语义渲染并带 aria 范围", async () => {
            await act(async () => { await render(<NumberEdit value={5} min={0} max={10}/>); });
            const input = getInput();
            expect(input.getAttribute("role")).toBe("spinbutton");
            expect(input.getAttribute("aria-valuenow")).toBe("5");
            expect(input.getAttribute("aria-valuemin")).toBe("0");
            expect(input.getAttribute("aria-valuemax")).toBe("10");
            expect(input.getAttribute("inputmode")).toBe("decimal");
        });
        it("默认显示步进按钮，controls={false} 时隐藏", async () => {
            const { rerender } = await render(<NumberEdit value={1}/>);
            await act(async () => { });
            expect(stepUp()).toBeTruthy();
            expect(stepDown()).toBeTruthy();
            await act(async () => { await rerender(<NumberEdit value={1} controls={false}/>); });
            expect(stepUp()).toBeNull();
        });
    });
    describe("失焦态显示", () => {
        it("普通十进制原样显示", async () => {
            await act(async () => { await render(<NumberEdit value={1234.5}/>); });
            expect(getInput().value).toBe("1234.5");
        });
        it("开启千分位后分组显示", async () => {
            await act(async () => { await render(<NumberEdit value={1234567} thousandSeparator/>); });
            expect(getInput().value).toBe("1,234,567");
        });
        it("超阈值数值以上标科学计数法覆盖显示", async () => {
            await act(async () => { await render(<NumberEdit value={1.23e21}/>); });
            const sup = document.querySelector("sup");
            expect(sup).toBeTruthy();
            expect(sup?.textContent).toBe("21");
            expect(getInput().getAttribute("aria-valuetext")).toContain("10 的 21 次方");
        });
    });
    describe("聚焦编辑态", () => {
        it("聚焦后去千分位便于编辑", async () => {
            await act(async () => { await render(<NumberEdit value={1234567} thousandSeparator/>); });
            const input = getInput();
            expect(input.value).toBe("1,234,567");
            await act(async () => { await fireEvent(input, new FocusEvent("focusin", { bubbles: true })); });
            expect(input.value).toBe("1234567");
        });
        it("科学计数法态聚焦后展开为可编辑 e 记法并撤下覆盖层", async () => {
            await act(async () => { await render(<NumberEdit value={1.23e21}/>); });
            expect(document.querySelector("sup")).toBeTruthy();
            await act(async () => { await fireEvent(getInput(), new FocusEvent("focusin", { bubbles: true })); });
            expect(document.querySelector("sup")).toBeNull();
            expect(getInput().value).toBe("1.23e+21");
        });
        it("失焦时将超界值钳制到范围（非受控）", async () => {
            const onChange = mock.fn();
            await act(async () => {
                await render(<NumberEdit defaultValue={0} max={100} onChange={onChange}/>);
            });
            const input = getInput();
            await act(async () => { await fireEvent(input, new FocusEvent("focusin", { bubbles: true })); });
            await act(async () => { await changeInputValue(input, "999"); });
            await act(async () => { await fireEvent(input, new FocusEvent("focusout", { bubbles: true })); });
            expect(onChange).toHaveBeenCalledWith(100);
            expect(getInput().value).toBe("100");
        });
    });
    describe("步进", () => {
        it("点击增加按钮触发 onChange(+step)", async () => {
            const onChange = mock.fn();
            await act(async () => { await render(<NumberEdit value={5} onChange={onChange}/>); });
            await act(async () => {
                await fireEvent(stepUp(), new PointerEvent("pointerdown", { bubbles: true }));
                await fireEvent(stepUp(), new PointerEvent("pointerup", { bubbles: true }));
            });
            expect(onChange).toHaveBeenCalledWith(6);
        });
        it("键盘 ArrowUp 步进一个 step", async () => {
            const onChange = mock.fn();
            await act(async () => { await render(<NumberEdit value={5} onChange={onChange}/>); });
            await act(async () => { await fireEvent.keyDown(getInput(), { key: "ArrowUp" }); });
            expect(onChange).toHaveBeenCalledWith(6);
        });
        it("Shift+ArrowUp 走大步长（默认 step*10）", async () => {
            const onChange = mock.fn();
            await act(async () => { await render(<NumberEdit value={5} onChange={onChange}/>); });
            await act(async () => { await fireEvent.keyDown(getInput(), { key: "ArrowUp", shiftKey: true }); });
            expect(onChange).toHaveBeenCalledWith(15);
        });
        it("到达上界时禁用增加按钮", async () => {
            await act(async () => { await render(<NumberEdit value={10} max={10}/>); });
            expect(stepUp().disabled).toBe(true);
            expect(stepDown().disabled).toBe(false);
        });
        it("步进消除浮点噪声", async () => {
            const onChange = mock.fn();
            await act(async () => { await render(<NumberEdit value={0.1} step={0.2} onChange={onChange}/>); });
            await act(async () => { await fireEvent.keyDown(getInput(), { key: "ArrowUp" }); });
            expect(onChange).toHaveBeenCalledWith(0.3);
        });
    });
    describe("清除与禁用", () => {
        it("allowClear 清除后 onChange(null)", async () => {
            const onChange = mock.fn();
            const onClear = mock.fn();
            await act(async () => {
                await render(<NumberEdit value={5} allowClear onChange={onChange} onClear={onClear}/>);
            });
            await act(async () => { await fireEvent.click(screen.getByLabelText("清除")); });
            expect(onChange).toHaveBeenCalledWith(null);
            expect(onClear).toHaveBeenCalledTimes(1);
        });
        it("disabled 时 input 与步进按钮均禁用", async () => {
            await act(async () => { await render(<NumberEdit value={5} disabled/>); });
            expect(getInput().disabled).toBe(true);
            expect(stepUp().disabled).toBe(true);
            expect(stepDown().disabled).toBe(true);
        });
    });
});
