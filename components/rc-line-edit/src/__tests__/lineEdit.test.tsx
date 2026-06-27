/* eslint-disable @typescript-eslint/no-explicit-any */
import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("@linaria/core", () => ({
    css: () => "mocked-css",
    cx: (...args: any[]) => args.filter(Boolean).join(" "),
}));

// lucide-react 图标 stub，避免 SVG 渲染问题
jest.mock("lucide-react", () => ({
    Eye: () => <span data-testid="icon-eye" />,
    EyeOff: () => <span data-testid="icon-eye-off" />,
    X: () => <span data-testid="icon-x" />,
}));

import LineEdit from "../lineEdit.js";

afterEach(() => {
    cleanup();
});

describe("LineEdit", () => {
    describe("基础渲染", () => {
        it("应渲染 input 元素", async () => {
            await act(async () => { render(<LineEdit />); });
            expect(document.querySelector("input")).toBeTruthy();
        });

        it("prefix 应渲染到 input 左侧", async () => {
            await act(async () => {
                render(<LineEdit prefix={<span data-testid="prefix-icon" />} />);
            });
            expect(screen.getByTestId("prefix-icon")).toBeTruthy();
        });

        it("suffix 应渲染到 input 右侧", async () => {
            await act(async () => {
                render(<LineEdit suffix={<span data-testid="suffix-icon" />} />);
            });
            expect(screen.getByTestId("suffix-icon")).toBeTruthy();
        });
    });

    describe("disabled 状态", () => {
        it("disabled 时 input 应被禁用", async () => {
            await act(async () => { render(<LineEdit disabled />); });
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.disabled).toBe(true);
        });

        it("disabled 时容器应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = render(<LineEdit disabled />)); });
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });

        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            let container!: HTMLElement;
            await act(async () => { ({ container } = render(<LineEdit />)); });
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });

    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await act(async () => {
                render(<LineEdit value="hello" allowClear onClear={jest.fn()} />);
            });
            expect(screen.getByLabelText("清除")).toBeTruthy();
        });

        it("值为空时不应显示清除按钮", async () => {
            await act(async () => {
                render(<LineEdit value="" allowClear onClear={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("未传 allowClear 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<LineEdit value="hello" />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("disabled 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<LineEdit value="hello" allowClear disabled onClear={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("readOnly 时不应显示清除按钮", async () => {
            await act(async () => {
                render(<LineEdit value="hello" allowClear readOnly onClear={jest.fn()} />);
            });
            expect(screen.queryByLabelText("清除")).toBeNull();
        });

        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = jest.fn();
            await act(async () => {
                render(<LineEdit value="hello" allowClear onClear={handleClear} />);
            });
            act(() => { fireEvent.click(screen.getByLabelText("清除")); });
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });

    describe("密码可见性切换", () => {
        it("type=password 时应显示密码切换按钮", async () => {
            await act(async () => { render(<LineEdit type="password" />); });
            expect(screen.getByLabelText("显示密码")).toBeTruthy();
        });

        it("非 password 类型时不应显示切换按钮", async () => {
            await act(async () => { render(<LineEdit type="text" />); });
            expect(screen.queryByLabelText("显示密码")).toBeNull();
            expect(screen.queryByLabelText("隐藏密码")).toBeNull();
        });

        it("点击切换按钮后 input type 应变为 text", async () => {
            await act(async () => { render(<LineEdit type="password" />); });
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.type).toBe("password");
            act(() => { fireEvent.click(screen.getByLabelText("显示密码")); });
            expect(input.type).toBe("text");
        });

        it("再次点击应切换回 password", async () => {
            await act(async () => { render(<LineEdit type="password" />); });
            const input = document.querySelector("input") as HTMLInputElement;
            act(() => { fireEvent.click(screen.getByLabelText("显示密码")); });
            act(() => { fireEvent.click(screen.getByLabelText("隐藏密码")); });
            expect(input.type).toBe("password");
        });
    });

    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await act(async () => {
                render(<LineEdit value="hello" showCount />);
            });
            expect(screen.getByText("5")).toBeTruthy();
        });

        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await act(async () => {
                render(<LineEdit value="hello" showCount maxLength={10} />);
            });
            expect(screen.getByText("5/10")).toBeTruthy();
        });

        it("showCount 时 maxLength 应传给 input", async () => {
            await act(async () => {
                render(<LineEdit value="hi" showCount maxLength={20} />);
            });
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(20);
        });

        it("value 为 undefined 时不应显示字符计数", async () => {
            await act(async () => {
                render(<LineEdit showCount />);
            });
            // 非受控模式下不显示计数
            expect(document.querySelector("span")).toBeNull();
        });
    });

    describe("maxLength 传递", () => {
        it("maxLength 应正确传递给 input 元素", async () => {
            await act(async () => {
                render(<LineEdit maxLength={50} />);
            });
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(50);
        });
    });
});
