import { beforeAll, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import type { SVGProps } from "react";

mock.module("lucide-react", async () => {
    const mockReact = await mock.actual<typeof import("react")>("react");
    const Icon = (props: SVGProps<SVGSVGElement>) => mockReact.createElement("svg", props);
    return {
        Eye: Icon,
        EyeOff: Icon,
        X: Icon,
    };
});
let LineEdit: (typeof import("../lineEdit.js"))["default"];
beforeAll(async () => {
    const lineEditModule = await mock.import<typeof import("../lineEdit.js")>("../lineEdit.js");
    LineEdit = lineEditModule.default;
});

(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
const queryActionButton = (label: string) => document.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement | null;
const getActionButton = (label: string) => {
    const button = queryActionButton(label);
    if (!button) {
        throw new Error(`Unable to find action button: ${label}`);
    }
    return button;
};
const handleInputChange = () => undefined;
describe("LineEdit", () => {
    describe("基础渲染", () => {
        it("应渲染 input 元素", async () => {
            await render(<LineEdit />);
            expect(document.querySelector("input")).toBeTruthy();
        });
        it("prefix 应渲染到 input 左侧", async () => {
            await render(<LineEdit prefix={<span data-testid="prefix-icon"/>}/>);
            expect(screen.getByTestId("prefix-icon")).toBeTruthy();
        });
        it("suffix 应渲染到 input 右侧", async () => {
            await render(<LineEdit suffix={<span data-testid="suffix-icon"/>}/>);
            expect(screen.getByTestId("suffix-icon")).toBeTruthy();
        });
    });
    describe("bordered", () => {
        it("bordered={false} 时应仍渲染 input 且不报错", async () => {
            await render(<LineEdit bordered={false} value="x" onChange={handleInputChange}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.value).toBe("x");
        });
    });
    describe("disabled 状态", () => {
        it("disabled 时 input 应被禁用", async () => {
            await render(<LineEdit disabled/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.disabled).toBe(true);
        });
        it("disabled 时容器应有 aria-disabled 属性", async () => {
            const { container } = await render(<LineEdit disabled/>);
            expect((container.firstChild as HTMLElement).getAttribute("aria-disabled")).toBe("true");
        });
        it("非 disabled 时容器不应有 aria-disabled 属性", async () => {
            const { container } = await render(<LineEdit />);
            expect((container.firstChild as HTMLElement).hasAttribute("aria-disabled")).toBe(false);
        });
    });
    describe("allowClear", () => {
        it("有值且 allowClear 时应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(getActionButton("清除")).toBeTruthy();
        });
        it("值为空时不应显示清除按钮", async () => {
            await render(<LineEdit value="" allowClear onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("未传 allowClear 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" onChange={handleInputChange}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("disabled 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear disabled onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("readOnly 时不应显示清除按钮", async () => {
            await render(<LineEdit value="hello" allowClear readOnly onChange={handleInputChange} onClear={mock.fn()}/>);
            expect(queryActionButton("清除")).toBeNull();
        });
        it("点击清除按钮应触发 onClear 回调", async () => {
            const handleClear = mock.fn();
            await render(<LineEdit value="hello" allowClear onChange={handleInputChange} onClear={handleClear}/>);
            await fireEvent.click(getActionButton("清除"));
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });
    describe("密码可见性切换", () => {
        it("type=password 时应显示密码切换按钮", async () => {
            await render(<LineEdit type="password"/>);
            expect(getActionButton("显示密码")).toBeTruthy();
        });
        it("非 password 类型时不应显示切换按钮", async () => {
            await render(<LineEdit type="text"/>);
            expect(queryActionButton("显示密码")).toBeNull();
            expect(queryActionButton("隐藏密码")).toBeNull();
        });
        it("点击切换按钮后 input type 应变为 text", async () => {
            await render(<LineEdit type="password"/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.type).toBe("password");
            await fireEvent.click(getActionButton("显示密码"));
            expect(input.type).toBe("text");
        });
        it("再次点击应切换回 password", async () => {
            await render(<LineEdit type="password"/>);
            const input = document.querySelector("input") as HTMLInputElement;
            await fireEvent.click(getActionButton("显示密码"));
            await fireEvent.click(getActionButton("隐藏密码"));
            expect(input.type).toBe("password");
        });
    });
    describe("showCount 字符计数", () => {
        it("showCount 有值时应显示字符数", async () => {
            await render(<LineEdit value="hello" showCount onChange={handleInputChange}/>);
            expect(screen.getByText("5")).toBeTruthy();
        });
        it("showCount + maxLength 应显示 count/max 格式", async () => {
            await render(<LineEdit value="hello" showCount maxLength={10} onChange={handleInputChange}/>);
            expect(screen.getByText("5/10")).toBeTruthy();
        });
        it("showCount 时 maxLength 应传给 input", async () => {
            await render(<LineEdit value="hi" showCount maxLength={20} onChange={handleInputChange}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(20);
        });
        it("value 为 undefined 时不应显示字符计数", async () => {
            await render(<LineEdit showCount/>);
            // 非受控模式下不显示计数
            expect(document.querySelector("span")).toBeNull();
        });
    });
    describe("maxLength 传递", () => {
        it("maxLength 应正确传递给 input 元素", async () => {
            await render(<LineEdit maxLength={50}/>);
            const input = document.querySelector("input") as HTMLInputElement;
            expect(input.maxLength).toBe(50);
        });
    });
});
