import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, within } from "@crab-dev/wake/test/react";
import type { ComponentType, ReactNode } from "react";
import ConfigProvider from "@crab-dev/rc-config-provider";

mock.module("@crab-dev/rc-segmented", () => ({
    __esModule: true,
    default: ({ options, value, onValueChange, "aria-labelledby": labelledBy }: {
        options: Array<string | number | { label: ReactNode; value: string | number }>;
        value?: string | number;
        onValueChange?: (value: string | number) => void;
        "aria-labelledby"?: string;
    }) => (
        <div role="radiogroup" aria-labelledby={labelledBy}>
            {options.map((option) => {
                const item = typeof option === "object" ? option : { label: option, value: option };
                return <button key={String(item.value)} type="button" role="radio" aria-checked={value === item.value} onClick={() => onValueChange?.(item.value)}>{item.label}</button>;
            })}
        </div>
    ),
}));

mock.module("@crab-dev/rc-date-picker", () => ({
    __esModule: true,
    DatePicker: () => <input aria-label="计划日期" type="date" />,
}));

mock.module("@crab-dev/rc-select", () => ({
    __esModule: true,
    default: ({ "aria-labelledby": labelledBy }: { "aria-labelledby"?: string }) => <div role="combobox" aria-labelledby={labelledBy} tabIndex={0} aria-expanded="false">设计系统，数据应用</div>,
}));

mock.module("@crab-dev/rc-color-picker", () => ({
    __esModule: true,
    default: () => <button type="button" aria-label="选择强调色">紫色</button>,
}));

mock.module("@crab-dev/rc-slider", () => ({
    __esModule: true,
    default: ({ value }: { value: number }) => <input aria-label="发布进度" type="range" value={value} readOnly />,
}));

let HomeComponentShowcase: ComponentType;

beforeAll(async () => {
    ({ default: HomeComponentShowcase } = await mock.import<typeof import("../homeComponentShowcase.js")>("../homeComponentShowcase.js"));
});

describe("HomeComponentShowcase", () => {
    it("可见标签命名复合控件，组名不混入选项名称", async () => {
        const { container } = await render(<HomeComponentShowcase />);
        for (const [name, option] of [["主题", "跟随全站"], ["尺寸", "小"], ["品牌色", "默认"], ["视图设置", "概览"]]) {
            const group = screen.getByRole("radiogroup", { name });
            expect(within(group).getByRole("radio", { name: option })).toBeTruthy();
            expect(group.closest("label")).toBeNull();
        }
        expect(screen.getByRole("combobox", { name: "应用类型" })).toBeTruthy();
        expect(screen.getByRole("textbox", { name: "工作区名称" })).toBeTruthy();
        expect(container.querySelector("label label")).toBeNull();
        expect(screen.getByRole("radio", { name: "默认" }).getAttribute("aria-checked")).toBe("true");
        expect(container.querySelector(".crab-home-demo-surface")?.hasAttribute("data-crab-brand")).toBe(false);
    });

    it("默认继承全站风格和明暗，局部覆盖后可以恢复跟随", async () => {
        const view = await render(<ConfigProvider designSystem="md3" colorMode="dark"><HomeComponentShowcase /></ConfigProvider>);
        const preview = () => document.querySelector(".crab-home-demo-surface");
        expect(preview()?.getAttribute("data-crab-design")).toBe("md3");
        expect(preview()?.getAttribute("data-theme")).toBe("dark");
        await view.rerender(<ConfigProvider designSystem="shadcn" colorMode="light"><HomeComponentShowcase /></ConfigProvider>);
        expect(preview()?.getAttribute("data-crab-design")).toBe("shadcn");
        expect(preview()?.getAttribute("data-theme")).toBe("light");
        await fireEvent.click(screen.getByRole("radio", { name: "暗色" }));
        expect(preview()?.getAttribute("data-theme")).toBe("dark");
        await fireEvent.click(screen.getByRole("radio", { name: "跟随全站" }));
        expect(preview()?.getAttribute("data-theme")).toBe("light");
    });

    it("支持输入、开关、局部主题和品牌色反馈", async () => {
        await render(<HomeComponentShowcase />);
        const name = screen.getByDisplayValue("Crab Design");
        await fireEvent.change(name, { target: { value: "Analytics" } });
        expect(screen.getByDisplayValue("Analytics")).toBeTruthy();

        const notifications = screen.getByRole("switch", { name: "消息提醒" });
        expect(notifications.getAttribute("aria-checked")).toBe("true");
        await fireEvent.click(notifications);
        expect(notifications.getAttribute("aria-checked")).toBe("false");

        await act(async () => {
            await fireEvent.click(screen.getByText("暗色"));
        });
        expect(document.querySelector(".crab-home-demo-surface")?.getAttribute("data-theme")).toBe("dark");

        await act(async () => {
            await fireEvent.click(screen.getByText("葡萄紫"));
        });
        expect(document.querySelector(".crab-home-demo-surface")?.getAttribute("data-crab-brand")).toBeTruthy();

        await fireEvent.click(screen.getByRole("button", { name: "保存" }));
        expect(document.querySelector(".crab-home-demo-feedback")?.textContent).toContain("修改已保存");
    });
});
