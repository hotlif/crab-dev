import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, within } from "@crab-dev/wake/test/react";
import type { ComponentType } from "react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import { resolveSiteHref } from "../siteContext.js";

type HomeSectionProps = { href: (slug: string) => string };
let HomeHero: ComponentType<HomeSectionProps>;
let HomeCategories: ComponentType<HomeSectionProps>;

async function enterText(input: HTMLElement, value: string) {
    await act(() => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

beforeAll(async () => {
    ({ HomeHero, HomeCategories } = await mock.import<typeof import("../learningHome.js")>("../learningHome.js"));
});

describe("LearningHome", () => {
    it("提供核心标题、CTA、任务分类和实战入口", async () => {
        const href = (slug: string) => `/${slug}`;
        await render(<><HomeHero href={href} /><HomeCategories href={href} /></>);
        expect(screen.getByRole("heading", { name: "Crab UI", level: 1 })).toBeTruthy();
        expect(screen.getByRole("link", { name: /开始使用/ }).getAttribute("href")).toBe("/guides/getting-started");
        expect(screen.getByRole("link", { name: /组件目录/ }).getAttribute("href")).toBe("/learn/components");
        expect(screen.queryByRole("navigation", { name: "任务入口跳转" })).toBeNull();
        for (const title of ["输入与操作", "信息展示", "反馈与浮层", "导航", "布局与性能", "数据与可视化"]) {
            const heading = screen.getByRole("heading", { name: title, level: 3 });
            expect(heading.closest("article")?.querySelector("nav")?.getAttribute("aria-label")).toBe(`${title}组件`);
        }
        expect(screen.getByRole("link", { name: "业务实战" }).getAttribute("href")).toBe("/#practice");
    });

    it("首页与组件入口保留部署前缀，六类收藏锚点继续指向对应分组", async () => {
        const href = (slug: string) => resolveSiteHref(slug, path => `/handbook/${path.replace(/^\//, "")}`);
        await render(<><HomeHero href={href} /><HomeCategories href={href} /></>);
        expect(screen.getByRole("link", { name: /开始使用/ }).getAttribute("href")).toBe("/handbook/guides/getting-started");
        expect(screen.getByRole("link", { name: /组件目录/ }).getAttribute("href")).toBe("/handbook/learn/components");
        expect(screen.getByRole("link", { name: "业务实战" }).getAttribute("href")).toBe("#practice");
        expect(screen.getByRole("link", { name: /查看全部组件/ }).getAttribute("href")).toBe("/handbook/learn/components");
        const categories = [
            ["home-inputs-actions", "输入与操作", ["button", "form", "select", "line-edit"]],
            ["home-content-display", "信息展示", ["card", "avatar", "tag", "empty"]],
            ["home-feedback-overlays", "反馈与浮层", ["dialog", "drawer", "alert", "tooltip"]],
            ["home-navigation", "导航", ["tabs", "menu", "pagination", "router"]],
            ["home-layout-performance", "布局与性能", ["split-pane", "virtual", "masonry", "auto-sizer"]],
            ["home-data-visualization", "数据与可视化", ["table", "tree", "bar-chart", "canvas"]],
        ] as const;
        for (const [id, title, slugs] of categories) {
            const heading = screen.getByRole("heading", { name: title, level: 3 });
            const category = document.getElementById(id)!;
            expect(heading.closest("article")).toBe(category);
            expect(category.getAttribute("aria-labelledby")).toBe(heading.id);
            const navigation = category.querySelector("nav")!;
            expect(navigation.getAttribute("aria-label")).toBe(`${title}组件`);
            expect([...navigation.querySelectorAll("a")].map(link => link.getAttribute("href"))).toEqual(
                slugs.map(slug => `/handbook/components/rc-${slug}`),
            );
            expect(category.querySelector(".crab-home-category-panel")?.getAttribute("role")).toBeNull();
            expect(category.hasAttribute("tabindex")).toBe(false);
        }
    });

    it("首屏预览可操作，切换设计、明暗和尺寸时保留输入与实例", async () => {
        const view = await render(<ConfigProvider designSystem="md3" colorMode="light"><HomeHero href={slug => `/${slug}`} /></ConfigProvider>);
        const preview = screen.getByRole("region", { name: "交互组件预览" });
        const input = within(preview).getByRole("textbox", { name: "示例项目名称" });
        await enterText(input, "文档体验");
        await fireEvent.click(within(preview).getByRole("switch", { name: "允许团队协作" }));
        await view.rerender(<ConfigProvider designSystem="macos" colorMode="dark" size="large"><HomeHero href={slug => `/${slug}`} /></ConfigProvider>);
        expect(screen.getByRole("textbox", { name: "示例项目名称" })).toBe(input);
        expect((input as HTMLInputElement).value).toBe("文档体验");
        await fireEvent.click(within(preview).getByRole("button", { name: /^创建项目/ }));
        expect(within(preview).getByRole("status").textContent).toBe("已创建「文档体验」，仅自己可见。");
        await enterText(input, "   ");
        expect(within(preview).getByRole("button", { name: /^创建项目/ }).hasAttribute("disabled")).toBe(true);
    });

});
