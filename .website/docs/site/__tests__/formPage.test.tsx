import { describe, expect, it } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import BasicExample from "../../examples/rc-form/step-1.js";
import ValidationExample from "../../examples/rc-form/step-2.js";

async function enterText(input: HTMLElement, value: string) {
    await act(async () => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

async function submitForm(button: HTMLElement) {
    await act(async () => {
        await fireEvent.click(button);
        await new Promise<void>(resolve => { setTimeout(resolve, 0); });
    });
}

describe("Form 文档交互", () => {
    it("字段标签与说明关联到输入，切换风格后保留编辑内容并可提交", async () => {
        const view = await render(<ConfigProvider designSystem="md3"><BasicExample /></ConfigProvider>);
        const input = screen.getByRole("textbox", { name: "姓名" });
        const id = input.id;
        expect(document.querySelectorAll(`label[for="${id}"]`)).toHaveLength(1);
        expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe("最多 30 字。");
        await enterText(input, "周宁");
        await view.rerender(<ConfigProvider designSystem="shadcn"><BasicExample /></ConfigProvider>);
        expect(screen.getByDisplayValue("周宁").id).toBe(id);
        await submitForm(screen.getByRole("button", { name: "读取表单" }));
        expect(screen.getByText("提交姓名：周宁")).toBeTruthy();
    });

    it("空值提交由字段显示错误，修正后恢复帮助文字并成功提交", async () => {
        await render(<ValidationExample />);
        const input = screen.getByRole("textbox", { name: /姓名/ });
        expect(input.hasAttribute("required")).toBe(true);
        await submitForm(screen.getByRole("button", { name: "校验并提交" }));
        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toContain("姓名");
        expect(screen.queryByRole("button", { name: "查看校验提示" })).toBeNull();
        await enterText(input, "林晓");
        expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).toBe("请填写真实姓名，最多 30 字。");
        await submitForm(screen.getByRole("button", { name: "校验并提交" }));
        expect(screen.getByText("提交姓名：林晓")).toBeTruthy();
        expect(input.getAttribute("aria-invalid")).not.toBe("true");
    });
});
