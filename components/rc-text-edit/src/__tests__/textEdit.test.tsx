import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";

// lucide-react 图标 stub，避免 SVG 渲染问题
jest.mock("lucide-react", () => ({
    X: () => <span data-testid="icon-x" />,
}));

import TextEdit from "../textEdit.js";

afterEach(() => {
    cleanup();
});

describe("TextEdit", () => {
    describe("基础渲染", () => {
        it("应渲染 textarea 元素", async () => {
            await act(async () => { render(<TextEdit />); });
            expect(document.querySelector("textarea")).toBeTruthy();
        });

        it("rows 应透传给 textarea", async () => {
            await act(async () => { render(<TextEdit rows={5} />); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.rows).toBe(5);
        });

        it("placeholder 应透传给 textarea", async () => {
            await act(async () => { render(<TextEdit placeholder="请输入备注" />); });
            expect(screen.getByPlaceholderText("请输入备注")).toBeTruthy();
        });

        it("受控多行 value 应完整显示在 textarea 中", async () => {
            const multiline = "第一行\n第二行";
            await act(async () => { render(<TextEdit value={multiline} onChange={jest.fn()} />); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe(multiline);
        });

        it("输入应触发 onChange", async () => {
            const handleChange = jest.fn();
            await act(async () => { render(<TextEdit value="" onChange={handleChange} />); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            act(() => { fireEvent.change(textarea, { target: { value: "abc" } }); });
            expect(handleChange).toHaveBeenCalledTimes(1);
        });
    });

    describe("bordered", () => {
        it("bordered={false} 时应仍渲染 textarea 且不报错", async () => {
            await act(async () => { render(<TextEdit bordered={false} value="x" onChange={jest.fn()} />); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.value).toBe("x");
        });
    });

    describe("disabled 状态", () => {
        it("disabled 时 textarea 应被禁用", async () => {
            await act(async () => { render(<TextEdit disabled />); });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.disabled).toBe(true);
        });

        it("disabled 时容器应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = render(<TextEdit disabled />)); });
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });

        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = render(<TextEdit />)); });
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });

    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await act(async () => {
                render(<TextEdit value="hello" allowClear onClear={jest.fn()} onChange={jest.fn()} />);
            });
            expect(screen.getByLabelText("清除")).toBeTruthy();
        });

        it("值为空时不应显示清除按钮", async () => {
            await act(async () => {
                render(<TextEdit value="" allowClear onClear={jest.fn()} onChange={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("未传 allowClear 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<TextEdit value="hello" onChange={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("disabled 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<TextEdit value="hello" allowClear disabled onClear={jest.fn()} onChange={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("readOnly 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<TextEdit value="hello" allowClear readOnly onClear={jest.fn()} onChange={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = jest.fn();
            await act(async () => {
                render(<TextEdit value="hello" allowClear onClear={handleClear} onChange={jest.fn()} />);
            });
            act(() => { fireEvent.click(screen.getByLabelText("清除")); });
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });

    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await act(async () => {
                render(<TextEdit value="hello" showCount onChange={jest.fn()} />);
            });
            expect(screen.getByText("5")).toBeTruthy();
        });

        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await act(async () => {
                render(<TextEdit value="hello" showCount maxLength={100} onChange={jest.fn()} />);
            });
            expect(screen.getByText("5/100")).toBeTruthy();
        });

        it("showCount 时 maxLength 应传给 textarea", async () => {
            await act(async () => {
                render(<TextEdit value="hi" showCount maxLength={200} onChange={jest.fn()} />);
            });
            const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
            expect(textarea.maxLength).toBe(200);
        });

        it("value 为 undefined 时不应显示字符计数", async () => {
            await act(async () => {
                render(<TextEdit showCount />);
            });
            // 非受控模式下不显示计数
            expect(document.querySelector("span")).toBeNull();
        });
    });

    describe("autoSize 与 resize", () => {
        it("autoSize 与默认 resize 应产生不同的 textarea 类名", async () => {
            await act(async () => { render(<TextEdit data-testid="auto" autoSize />); });
            await act(async () => { render(<TextEdit data-testid="manual" />); });
            const autoTextarea = screen.getByTestId("auto") as HTMLTextAreaElement;
            const manualTextarea = screen.getByTestId("manual") as HTMLTextAreaElement;
            expect(autoTextarea.className).not.toBe(manualTextarea.className);
        });
    });

    describe("ref 透传", () => {
        it("ref 应指向 textarea 元素", async () => {
            let node: HTMLTextAreaElement | null = null;
            await act(async () => {
                render(<TextEdit ref={(el) => { node = el; }} />);
            });
            expect(node).not.toBeNull();
            expect((node as unknown as HTMLTextAreaElement).tagName).toBe("TEXTAREA");
        });
    });
});
