import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import type { Profile } from "../data.js";

// Keep controlled visibility and confirmation semantics; layout/animation require a browser.
mock.module("@crab-dev/rc-drawer", () => ({
    __esModule: true,
    default: ({ open, title, children, className }: import("@crab-dev/rc-drawer").DrawerProps) => open
        ? <section className={className} aria-label={String(title)}>{children}</section> : null,
}));
mock.module("@crab-dev/rc-dialog", () => ({
    __esModule: true,
    default: ({ open, title, children, onConfirm, onOpenChange, i18n }: import("@crab-dev/rc-dialog").DialogProps) => open
        ? <section aria-label={String(title)}>{children}<button onClick={() => { void onConfirm?.(); }}>{i18n?.confirmText}</button><button onClick={() => onOpenChange(false)}>{i18n?.cancelText}</button></section> : null,
}));

let ProfileExample: typeof import("../profile.js")["default"];
beforeAll(async () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }) });
    ProfileExample = (await mock.import<typeof import("../profile.js")>("../profile.js")).default;
});
async function click(name: string) {
    await fireEvent.click(screen.getByRole("button", { name }));
}
const inputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
async function change(name: string, value: string) {
    const input = screen.getByRole("textbox", { name }) as HTMLInputElement;
    if (!inputValueSetter) throw new Error("HTMLInputElement.value setter is unavailable");
    inputValueSetter.call(input, value);
    await fireEvent.input(input);
}

describe("设计样板资料编辑", () => {
    it("取消有效草稿不会提交，确认放弃后恢复已保存值", async () => {
        const save = mock.fn(async (profile: Profile) => profile);
        await render(<ProfileExample theme="light" density="standard" save={save} />);
        await click("编辑成员资料");
        await change("姓名（必填）", "临时修改");
        await click("取消编辑");
        expect(save).not.toHaveBeenCalled();
        await click("放弃修改");
        await click("编辑成员资料");
        expect((screen.getByRole("textbox", { name: "姓名（必填）" }) as HTMLInputElement).value).toBe("林晓");
    });
    it("校验定位字段，取消确认保留草稿，放弃修改恢复原值", async () => {
        await render(<ProfileExample theme="dark" density="compact" />);
        await click("编辑成员资料");
        await change("姓名（必填）", "");
        await click("保存修改");
        expect(screen.getByText("请填写成员姓名。")).toBeTruthy();
        expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "姓名（必填）" }));
        await click("取消编辑");
        await click("继续编辑");
        expect((screen.getByRole("textbox", { name: "姓名（必填）" }) as HTMLInputElement).value).toBe("");
        await click("取消编辑");
        await click("放弃修改");
        await click("编辑成员资料");
        expect((screen.getByRole("textbox", { name: "姓名（必填）" }) as HTMLInputElement).value).toBe("林晓");
    });
    it("提交期间阻止重复保存，成功后回写摘要", async () => {
        let complete: ((profile: Profile) => void) | undefined;
        const save = mock.fn(() => new Promise<Profile>(resolve => { complete = resolve; }));
        await render(<ProfileExample theme="light" density="standard" save={save} />);
        await click("编辑成员资料");
        await change("姓名（必填）", "王宁");
        await click("保存修改");
        expect(save).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: "正在保存…" }).getAttribute("aria-disabled")).toBe("true");
        await act(async () => {
            complete?.({ name: "王宁", email: "lin@example.com", team: "产品设计" });
            await Promise.resolve();
        });
        expect(screen.getByText("王宁")).toBeTruthy();
        expect(screen.getByText("资料已保存")).toBeTruthy();
    });
    it("保存失败保留草稿并允许重试", async () => {
        const save = mock.fn(async (): Promise<Profile> => { throw new Error("offline"); });
        await render(<ProfileExample theme="light" density="standard" save={save} />);
        await click("编辑成员资料");
        await change("姓名（必填）", "王宁");
        await click("保存修改");
        expect(screen.getByText("保存失败")).toBeTruthy();
        expect((screen.getByRole("textbox", { name: "姓名（必填）" }) as HTMLInputElement).value).toBe("王宁");
    });
});
