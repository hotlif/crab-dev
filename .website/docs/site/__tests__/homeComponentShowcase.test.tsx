import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import type { ComponentType, ReactNode } from "react";

mock.module("@crab-dev/rc-segmented", () => ({
    __esModule: true,
    default: ({ options, value, onChange }: {
        options: Array<string | number | { label: ReactNode; value: string | number }>;
        value?: string | number;
        onChange?: (value: string | number) => void;
    }) => (
        <div role="radiogroup">
            {options.map((option) => {
                const item = typeof option === "object" ? option : { label: option, value: option };
                return <button key={String(item.value)} type="button" role="radio" aria-checked={value === item.value} onClick={() => onChange?.(item.value)}>{item.label}</button>;
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
    default: () => <button type="button">设计系统，数据应用</button>,
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
