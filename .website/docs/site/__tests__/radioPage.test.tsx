import { describe, expect, it } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
import NotificationExample from "../../examples/rc-radio/step-1.js";
import StateExample from "../../examples/rc-radio/step-3.js";

describe("Radio 文档交互", () => {
    it("通知选项互斥，选择结果同步到预览", async () => {
        await render(<NotificationExample />);
        const daily = screen.getByRole("radio", { name: /每天摘要/ }) as HTMLInputElement;
        const weekly = screen.getByRole("radio", { name: /每周摘要/ }) as HTMLInputElement;
        expect(weekly.checked).toBe(true);
        await fireEvent.click(daily);
        expect(daily.checked).toBe(true);
        expect(weekly.checked).toBe(false);
        expect(screen.getByText("每天 09:00")).toBeTruthy();
        expect(screen.getByText("已选择 · 每天摘要")).toBeTruthy();
    });

    it("试验区禁用真实控件，校验关联到输入并在选择后恢复", async () => {
        await render(<StateExample />);
        await fireEvent.click(screen.getByRole("button", { name: "禁用" }));
        const inbox = screen.getByRole("radio", { name: "站内通知" }) as HTMLInputElement;
        expect(inbox.disabled).toBe(true);
        expect(screen.getByText("通知服务暂停，设置暂时不可修改。")).toBeTruthy();
        await fireEvent.click(screen.getByRole("button", { name: "校验" }));
        expect(inbox.disabled).toBe(false);
        expect(inbox.getAttribute("aria-invalid")).toBe("true");
        const message = screen.getByText("请选择一种接收方式。");
        expect(inbox.getAttribute("aria-describedby")).toBe(message.id);
        await fireEvent.click(inbox);
        expect(inbox.getAttribute("aria-invalid")).toBeNull();
        expect(screen.getByText("已选择站内通知。")).toBeTruthy();
    });
});
