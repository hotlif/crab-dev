import { describe, expect, it, mock, fireEvent, render, screen, act } from "@crab-dev/wake/test/react";
import TextEdit from "../textEdit.js";
describe("TextEdit", () => {
    describe("基础渲染", () => {
        it("应渲染 textarea 元素", async () => {
            await act(async () => { await render(<TextEdit />); });
            expect(document.querySelector("textarea")).toBeTruthy();
        });
        it("rows 应透传给 textarea", async () => {
            await act(async () => { await render(<TextEdit rows={5}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.getAttribute("rows")).toBe("5");
        });
        it("placeholder 应透传给 textarea", async () => {
            await act(async () => { await render(<TextEdit placeholder="请输入备注"/>); });
            expect(screen.getByPlaceholderText("请输入备注")).toBeTruthy();
        });
        it("受控多行 value 应完整显示在 textarea 中", async () => {
            const multiline = "第一行\n第二行";
            await act(async () => { await render(<TextEdit value={multiline} onChange={mock.fn()}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe(multiline);
        });
        it("输入应触发 onChange", async () => {
            const handleChange = mock.fn();
            await act(async () => { await render(<TextEdit value="" onChange={handleChange}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
            setValue?.call(textarea, "abc");
            await act(async () => { await fireEvent.input(textarea); });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });
    describe("bordered", () => {
        it("bordered={false} 时应仍渲染 textarea 且不报错", async () => {
            await act(async () => { await render(<TextEdit bordered={false} value="x" onChange={mock.fn()}/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe("x");
        });
    });
    describe("disabled 状态", () => {
        it("disabled 时 textarea 应被禁用", async () => {
            await act(async () => { await render(<TextEdit disabled/>); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.disabled).toBe(true);
        });
        it("disabled 时容器应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = await render(<TextEdit disabled/>)); });
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });
        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = await render(<TextEdit />)); });
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });
    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear onClear={mock.fn()} onChange={mock.fn()}/>);
            });
            expect(screen.getByLabelText("清除")).toBeTruthy();
        });
        it("值为空时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="" allowClear onClear={mock.fn()} onChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("未传 allowClear 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" onChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("disabled 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear disabled onClear={mock.fn()} onChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("readOnly 时不应显示清除按钮", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" allowClear readOnly onClear={mock.fn()} onChange={mock.fn()}/>);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });
        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = mock.fn();
            await act(async () => {
                await render(<TextEdit value="hello" allowClear onClear={handleClear} onChange={mock.fn()}/>);
            });
            await act(async () => { await fireEvent.click(screen.getByLabelText("清除")); });
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });
    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" showCount onChange={mock.fn()}/>);
            });
            expect(screen.getByText("5")).toBeTruthy();
        });
        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await act(async () => {
                await render(<TextEdit value="hello" showCount maxLength={100} onChange={mock.fn()}/>);
            });
            expect(screen.getByText("5/100")).toBeTruthy();
        });
        it("showCount 时 maxLength 应传给 textarea", async () => {
            await act(async () => {
                await render(<TextEdit value="hi" showCount maxLength={200} onChange={mock.fn()}/>);
            });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.maxLength).toBe(200);
        });
        it("value 为 undefined 时不应显示字符计数", async () => {
            await act(async () => {
                await render(<TextEdit showCount/>);
            });
            // 非受控模式下不显示计数
            expect(document.querySelector("span")).toBeNull();
        });
    });
    describe("autoSize 与 resize", () => {
        it("autoSize 与默认 resize 应产生不同的 textarea 类名", async () => {
            await act(async () => { await render(<TextEdit data-testid="auto" autoSize/>); });
            await act(async () => { await render(<TextEdit data-testid="manual"/>); });
            const autoTextarea = screen.getByTestId("auto") as HTMLTextAreaElement;
            const manualTextarea = screen.getByTestId("manual") as HTMLTextAreaElement;
            expect(autoTextarea.className).not.toBe(manualTextarea.className);
        });
    });
    describe("ref 透传", () => {
        it("ref 应指向 textarea 元素", async () => {
            let node: HTMLTextAreaElement | null = null;
            await act(async () => {
                await render(<TextEdit ref={(el) => { node = el; }}/>);
            });
            expect(node).not.toBeNull();
            expect((node as unknown as HTMLTextAreaElement).tagName).toBe("TEXTAREA");
        });
    });
});
