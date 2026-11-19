import { describe, expect, it } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, within } from "@crab-dev/wake/test/react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import ButtonPrototype from "../design/buttonPrototype.js";

async function selectOption(control: HTMLElement, name: string) {
    await act(async () => { control.click(); });
    await act(async () => {
        screen.getByRole("option", { name }).click();
        await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
    });
}

describe("Button 交互原型", () => {
    it("同文案比较外观时保留规格与状态，选择纯图标后可恢复文字按钮的设置", async () => {
        const prototype = (design: DesignSystem) => <ConfigProvider designSystem={design}><ButtonPrototype /></ConfigProvider>;
        const view = await render(prototype("md3"));
        const section = within(screen.getByRole("heading", { name: "按钮类型与状态" }).closest("section")!);
        const specimen = () => within(section.getByRole("group", { name: "可操作样本" }));
        await selectOption(section.getByRole("combobox", { name: "按钮尺寸" }), "M");
        await selectOption(section.getByRole("combobox", { name: "轮廓" }), "圆角矩形");
        await selectOption(section.getByRole("combobox", { name: "图标位置" }), "前置图标");
        await selectOption(section.getByRole("combobox", { name: "试验状态" }), "加载中");
        await fireEvent.click(section.getByRole("button", { name: "描边按钮" }));
        expect(specimen().getByRole("button", { name: "校验配置" }).getAttribute("aria-busy")).toBe("true");
        await fireEvent.click(section.getByRole("button", { name: "纯图标按钮" }));
        expect(specimen().getByRole("button", { name: "刷新" }).getAttribute("aria-busy")).toBe("true");
        await fireEvent.click(section.getByRole("button", { name: "色调按钮" }));
        const button = specimen().getByRole("button", { name: "校验配置" });
        expect(button.getAttribute("aria-busy")).toBe("true");
        expect(section.getByRole("combobox", { name: "按钮尺寸" }).textContent).toContain("M");
        expect(section.getByRole("combobox", { name: "轮廓" }).textContent).toContain("圆角矩形");
        expect(section.getByRole("combobox", { name: "图标位置" }).textContent).toContain("前置图标");
        await selectOption(section.getByRole("combobox", { name: "试验状态" }), "可用");
        expect(button.querySelector("svg")).toBeTruthy();
        for (const [theme, label] of [["macos", "应用设置"], ["shadcn", "应用筛选"]] as const) {
            await view.rerender(prototype(theme));
            expect(specimen().getByRole("button", { name: label })).toBe(button);
            expect(section.getByRole("combobox", { name: "按钮尺寸" }).textContent).toContain("M");
            expect(section.getByRole("combobox", { name: "轮廓" }).textContent).toContain("圆角矩形");
            expect(button.querySelector("svg")).toBeTruthy();
        }
    });

    it("对照各类型的六种状态，试播的类型与切换选择随主题保留", async () => {
        const prototype = (design: DesignSystem) => <ConfigProvider designSystem={design}><ButtonPrototype /></ConfigProvider>;
        const view = await render(prototype("md3"));
        const matrix = screen.getByRole("table", { name: "按钮类型与状态" });
        const rows = within(matrix).getAllByRole("row").slice(1);
        expect(rows.length).toBe(1);
        for (const row of rows) expect(within(row).getAllByRole("cell").length).toBe(6);
        expect(within(matrix).getByRole("rowheader", { name: "填充按钮" })).toBeTruthy();
        const kinds = within(screen.getByRole("group", { name: "操作示例" }));
        await fireEvent.click(kinds.getByRole("button", { name: "切换按钮" }));
        expect(within(matrix).getAllByRole("rowheader").length).toBe(2);
        expect(matrix.textContent).toContain("即时完成");
        const lab = within(screen.getByRole("heading", { name: "按钮动效" }).closest("section")!);
        await selectOption(lab.getByRole("combobox", { name: "按钮类型" }), "切换按钮");
        const toggle = within(lab.getByRole("group", { name: "候选方案" })).getByRole("button", { name: "仅看收藏" });
        await fireEvent.click(toggle);
        expect(toggle.getAttribute("aria-pressed")).toBe("true");
        await view.rerender(prototype("macos"));
        expect(within(matrix).getAllByRole("rowheader", { name: /工具栏切换/ }).length).toBe(2);
        expect(within(lab.getByRole("group", { name: "候选方案" })).getByRole("button", { name: "仅看收藏" })).toBe(toggle);
        expect(toggle.getAttribute("aria-pressed")).toBe("true");
        await fireEvent.click(toggle);
        expect(toggle.getAttribute("aria-pressed")).toBe("false");
    });

    it("动效试播可以重播，切换片段会取消上次回调，表单草稿独立保留", async () => {
        await render(<ButtonPrototype />);
        const lab = within(screen.getByRole("heading", { name: "按钮动效" }).closest("section")!);
        const form = within(screen.getByRole("form", { name: "编辑工作区配置" }));
        const current = within(lab.getByRole("group", { name: "现有方案" }));
        await fireEvent.click(current.getByRole("button", { name: "保存配置" }));
        expect(lab.getByRole("status").textContent).toContain("已释放");
        await fireEvent.click(lab.getByRole("radio", { name: "保存失败" }));
        await fireEvent.click(current.getByRole("button", { name: "保存配置" }));
        expect(current.getByRole("button", { name: "保存配置" }).getAttribute("aria-busy")).toBe("true");
        expect(lab.getByRole("button", { name: "保存中" }).getAttribute("aria-busy")).toBe("true");
        await fireEvent.click(lab.getByRole("radio", { name: "按压释放" }));
        await act(async () => { await new Promise(resolve => setTimeout(resolve, 850)); });
        expect(lab.getByRole("status").textContent).toContain("点按按钮");
        expect(form.getByRole("status").textContent).toBe("有未保存的修改");
    });

    it("切换体系和对照方案更新按钮与状态样本，并保留表单实例和正在提交的请求", async () => {
        const prototype = (design: DesignSystem) => <ConfigProvider designSystem={design}><ButtonPrototype /></ConfigProvider>;
        const view = await render(prototype("md3"));
        const form = screen.getByRole("form", { name: "编辑工作区配置" });
        const input = screen.getByRole("textbox", { name: "显示名称" });
        const busySample = () => view.container.querySelector('.crab-design-states [data-state="busy"]')?.textContent;
        await fireEvent.submit(form);
        expect(within(form).getByRole("button", { name: "保存中" }).getAttribute("aria-busy")).toBe("true");
        expect(busySample()).toBe("保存中");
        await view.rerender(prototype("macos"));
        expect(within(form).getByRole("button", { name: "存储" }).getAttribute("aria-busy")).toBe("true");
        expect(busySample()).toBe("存储");
        await view.rerender(prototype("shadcn"));
        expect(within(form).getByRole("button", { name: "提交中" }).getAttribute("aria-busy")).toBe("true");
        expect(busySample()).toBe("提交中");
        await fireEvent.click(screen.getByRole("radio", { name: "现有方案" }));
        expect(busySample()).toBe("保存修改");
        expect(screen.getByRole("textbox", { name: "显示名称" })).toBe(input);
        expect(screen.getByRole("form", { name: "编辑个人资料" })).toBe(form);
        await fireEvent.click(screen.getByRole("button", { name: "重置场景" }));
        expect(within(form).getByRole("button", { name: "保存修改" }).getAttribute("aria-busy")).toBe("false");
    });

    it("保留失败的草稿，重试能成功，重置会撤销进行中的模拟保存", async () => {
        await render(<ButtonPrototype />);
        const input = screen.getByRole("textbox", { name: "显示名称" }) as HTMLInputElement;
        const form = screen.getByRole("form", { name: "编辑工作区配置" });
        const status = within(form).getByRole("status");
        const finish = () => act(async () => { await new Promise(resolve => setTimeout(resolve, 420)); });
        const typeName = async (name: string) => {
            // Simulate a native edit before React receives the input event.
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, name);
            await fireEvent.input(input);
        };
        await selectOption(screen.getByRole("combobox", { name: "响应速度" }), "快速 · 0.36 秒");
        await typeName("测试草稿");
        await fireEvent.click(within(form).getByRole("radio", { name: "最近工程" }));
        await fireEvent.click(screen.getByRole("switch", { name: "下次保存失败" }));
        await fireEvent.submit(form);
        await fireEvent.submit(form);
        expect(within(form).getByRole("button", { name: "保存中" }).getAttribute("aria-busy")).toBe("true");
        await finish();
        expect(status.textContent).toContain("保存失败");
        expect(input.value).toBe("测试草稿");
        expect(form.querySelector("dd")?.textContent).toBe("林月 · 项目总览");
        expect(screen.getByRole("switch", { name: "下次保存失败" }).getAttribute("aria-checked")).toBe("false");
        await fireEvent.submit(form);
        await finish();
        expect(status.textContent).toBe("工作区配置已生效。");
        expect(form.querySelector("dd")?.textContent).toBe("测试草稿 · 最近工程");
        await typeName("下一次修改");
        await fireEvent.submit(form);
        await fireEvent.click(screen.getByRole("button", { name: "重置场景" }));
        await finish();
        expect(status.textContent).toBe("有未保存的修改");
        expect(input.value).toBe("林悦");
    });
});
