import { clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render, screen } from "@crab-dev/wake/test/react";
import type { PageLoadingProps } from "@crab-dev/wake/docs";
import PageLoading from "../ui/page-loading.js";

function props(title = "开始使用", slug = "/guides/getting-started"): PageLoadingProps {
    return {
        site: { title: "Crab UI", description: "组件文档", locale: "zh-CN", basePath: "/handbook/", homeHref: "/handbook/" },
        theme: { theme: "system", resolved: "light", setTheme: mock.fn() },
        route: {
            path: slug,
            page: { slug, title, href: `/handbook${slug}`, description: "安装组件并设置统一外观", status: "stable", draft: false,
                headings: [{ id: "install", title: "安装", depth: 2, href: `/handbook${slug}#install` }] },
            navigate: mock.fn(), href: value => `/handbook/${value.replace(/^\//, "")}`, focusContent: mock.fn(),
        },
    };
}

// Wake's DOM query helper does not infer the implicit article role.
const loadingArticle = () => screen.getByRole("heading", { level: 1 }).closest("article")!;

describe("文档加载过渡", () => {
    it("先显示真实标题，短暂等待不播报；持续等待只提供一处状态说明", async () => {
        await clock.fake();
        let unmount: (() => Promise<void>) | undefined;
        try {
            const view = await render(<PageLoading {...props()} />);
            unmount = view.unmount;
            const article = loadingArticle();
            const status = screen.getByRole("status");
            expect(screen.getByRole("heading", { name: "开始使用", level: 1 })).toBeTruthy();
            expect(screen.getByText("安装组件并设置统一外观")).toBeTruthy();
            expect(article.getAttribute("aria-busy")).toBe("true");
            expect(status.closest('[aria-busy="true"]')).toBeNull();
            expect(status.textContent?.trim()).toBe("");
            expect(article.getAttribute("data-stage")).toBe("waiting");
            await act(async () => { await clock.advanceBy(179); });
            expect(article.getAttribute("data-stage")).toBe("waiting");
            await act(async () => { await clock.advanceBy(1); });
            expect(article.getAttribute("data-stage")).toBe("loading");
            expect(screen.getAllByRole("status").length).toBe(1);
            expect(status.textContent).toContain("正在准备“开始使用”的内容");
            expect(article.querySelector('.crab-docs-page-load-body')?.getAttribute("aria-hidden")).toBe("true");
            expect(article.querySelectorAll("a, button, [tabindex]").length).toBe(0);
            await act(async () => { await clock.advanceBy(5820); });
            expect(article.getAttribute("data-stage")).toBe("slow");
            expect(status.textContent).toContain("准备好后会自动显示");
            expect(status.textContent).toContain("导航或搜索");
            expect(screen.queryByRole("alert")).toBeNull();
        } finally {
            await unmount?.();
            await clock.restore();
        }
    });

    it("等待期间切换目标会重新计时，离开加载态后清理所有延迟任务", async () => {
        await clock.fake();
        let unmount: (() => Promise<void>) | undefined;
        try {
            const view = await render(<PageLoading {...props()} />);
            unmount = view.unmount;
            await act(async () => { await clock.advanceBy(5900); });
            await view.rerender(<PageLoading {...props("LineEdit 单行输入框", "/components/rc-line-edit")} />);
            expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("LineEdit 单行输入框");
            expect(loadingArticle().getAttribute("data-stage")).toBe("waiting");
            expect(document.querySelector(".crab-docs-page-load-artwork")).toBeTruthy();
            await act(async () => { await clock.advanceBy(100); });
            expect(loadingArticle().getAttribute("data-stage")).toBe("waiting");
            expect(screen.getByRole("status").textContent?.trim()).toBe("");
            await view.unmount();
            unmount = undefined;
            await act(async () => { await clock.advanceBy(6000); });
            expect(document.querySelector(".crab-docs-page-placeholder")).toBeNull();
        } finally {
            await unmount?.();
            await clock.restore();
        }
    });

    it("无页面元数据时使用站点名称，不伪造正文入口或目录链接", async () => {
        const state = props();
        const view = await render(<PageLoading {...state} route={{ ...state.route, page: null }} />);
        try {
            expect(screen.getByRole("heading", { name: "Crab UI", level: 1 })).toBeTruthy();
            expect(document.querySelector(".crab-docs-page-load-outline")).toBeNull();
            expect(screen.queryByRole("link")).toBeNull();
        } finally { await view.unmount(); }
    });
});
