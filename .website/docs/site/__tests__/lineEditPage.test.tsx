import { describe, expect, it } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
import InteractiveExample from "../../examples/rc-line-edit/step-1.js";
import StateExample from "../../examples/rc-line-edit/step-3.js";

function inputByLabel(text: string): HTMLInputElement {
    const label = [...document.querySelectorAll('label')].find(node => node.textContent === text);
    const input = label ? document.getElementById(label.htmlFor) : null;
    if (!(input instanceof HTMLInputElement)) throw new Error(`Missing input label: ${text}`);
    return input;
}
describe("LineEdit 文档交互", () => {
    it("外观切换保留内容，清除同步预览并返回输入焦点", async () => {
        await render(<InteractiveExample />);
        const input = inputByLabel("项目名称") as HTMLInputElement;
        await fireEvent.click(screen.getByRole("button", { name: "描边 Outlined" }));
        expect(input.value).toBe("下一件好作品");
        expect(screen.getByText("下一件好作品")).toBeTruthy();
        await fireEvent.click(document.querySelector('button[aria-label="清除"]')!);
        expect(input.value).toBe("");
        expect(document.activeElement).toBe(input);
        expect(screen.getByText("等待新的灵感")).toBeTruthy();
    });
    it("错误文字关联到邮箱，密码切换不改变内容，禁用状态保留说明", async () => {
        await render(<StateExample />);
        const email = inputByLabel("联系邮箱");
        expect(email.getAttribute("aria-invalid")).toBe("true");
        expect(document.getElementById(email.getAttribute("aria-describedby")!)?.textContent).toBe("邮箱不完整，请补全域名，例如 hello@crab.dev。");
        await fireEvent.click(document.querySelector('button[aria-label="显示密码"]')!);
        const password = inputByLabel("访问密码") as HTMLInputElement;
        expect(password.type).toBe("text");
        expect(password.value).toBe("Crab-design-3");
        expect((inputByLabel("团队空间") as HTMLInputElement).disabled).toBe(true);
    });
});
