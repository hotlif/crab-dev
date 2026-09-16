import { afterAll, describe, expect, it } from "@crab-dev/wake/test";
import { fireEvent, render, screen } from "@crab-dev/wake/test/react";
import TokenReference from "../tokenReference.js";

const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, "clipboard");
afterAll(() => {
    if (clipboardDescriptor) Object.defineProperty(navigator, "clipboard", clipboardDescriptor);
    else Reflect.deleteProperty(navigator, "clipboard");
});

describe("令牌参考操作", () => {
    it("色阶通过方向键切换，保持单个 Tab 入口并更新详情", async () => {
        await render(<TokenReference group="colors" />);
        const first = screen.getByRole("button", { name: "查看 blue.50" });
        await fireEvent.keyDown(first, { key: "ArrowRight" });
        const next = screen.getByRole("button", { name: "查看 blue.100" });
        expect(next.getAttribute("aria-pressed")).toBe("true");
        expect(next.getAttribute("tabindex")).toBe("0");
        expect(first.getAttribute("tabindex")).toBe("-1");
        expect(screen.getByRole("button", { name: '复制引用 globalToken.blue["100"]' })).toBeTruthy();
        await fireEvent.keyDown(next, { key: "End" });
        expect(screen.getByRole("button", { name: "查看 blue.950" }).getAttribute("aria-pressed")).toBe("true");
    });

    it("引用与变量名分别复制，切换样本后清除旧反馈", async () => {
        let copied = "";
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { copied = text; } } });
        await render(<TokenReference group="radius" />);
        await fireEvent.click(screen.getByRole("button", { name: "查看 radius.3" }));
        await fireEvent.click(screen.getByRole("button", { name: "复制变量名 --token-global-radius-3" }));
        expect(copied).toBe("--token-global-radius-3");
        expect(screen.getByText("已复制")).toBeTruthy();
        await fireEvent.click(screen.getByRole("button", { name: "查看 radius.4" }));
        expect(screen.queryByText("已复制")).toBeNull();
    });

    it("复制实际公共表达式并就近报告成功", async () => {
        let copied = "";
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (text: string) => { copied = text; } } });
        await render(<TokenReference group="space" />);
        await fireEvent.click(screen.getByRole("button", { name: "查看 space.0-5 代码" }));
        await fireEvent.click(screen.getByRole("button", { name: '复制引用 globalToken.space["0-5"]' }));
        expect(copied).toBe('globalToken.space["0-5"]');
        expect(screen.getByText("已复制")).toBeTruthy();
    });

    it("拒绝复制后保留表达式并允许重试", async () => {
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("denied"); } } });
        await render(<TokenReference group="opacity" />);
        const button = screen.getByRole("button", { name: '复制引用 globalToken.opacity["0"]' });
        await fireEvent.click(button);
        expect(screen.getByText("复制失败，请选择上方代码复制")).toBeTruthy();
        expect(screen.getByText('globalToken.opacity["0"]')).toBeTruthy();
        Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => {} } });
        await fireEvent.click(button);
        expect(screen.getByText("已复制")).toBeTruthy();
    });

    it("主动播放与反向操作保持单一目标状态", async () => {
        await render(<TokenReference group="motion" />);
        const region = screen.getByRole("region", { name: "动效令牌参考" });
        const play = screen.getByRole("button", { name: "播放 / 反向对照" });
        expect(region.getAttribute("data-moving")).toBe("false");
        await fireEvent.click(play);
        expect(region.getAttribute("data-moving")).toBe("true");
        await fireEvent.click(play);
        expect(region.getAttribute("data-moving")).toBe("false");
    });
});
