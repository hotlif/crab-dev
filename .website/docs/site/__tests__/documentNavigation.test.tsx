import { describe, expect, it } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen, within } from "@crab-dev/wake/test/react";
import type { PageProps } from "@crab-dev/wake/docs";
import { categoryForPath, groupsForCategory, PageSections } from "../documentNavigation.js";

describe("文档导航", () => {
    it("分类从现有导航数据划分，组件目录不混入实战", () => {
        const page = (slug: string) => ({ slug, href: `/docs${slug}`, title: slug });
        const groups = [
            { id: "project", title: "项目", pages: [page("/")], sections: [{ id: "learning", title: "学习", expanded: true, active: false,
                pages: [page("/learn/components"), page("/learn"), page("/learn/practice-profile"), page("/guides/getting-started"), page("/guides/toolchain")] }] },
            { id: "components", title: "组件", pages: [], sections: [{ id: "inputs", title: "输入", expanded: true, active: true, pages: [page("/components/rc-radio")] }] },
        ];
        expect(groupsForCategory(groups, "learn")[0].pages.map(item => item.slug)).toEqual(["/learn", "/learn/practice-profile"]);
        expect(groupsForCategory(groups, "components")[0].pages[0].slug).toBe("/learn/components");
        expect(groupsForCategory(groups, "components")[0].sections[0].pages[0].slug).toBe("/components/rc-radio");
        expect(groupsForCategory(groups, "tools")[0].pages.map(item => item.slug)).toEqual(["/guides/toolchain"]);
        expect(categoryForPath("/learn/")).toBe("learn");
        expect(categoryForPath("/")).toBeNull();
    });

    it("章节保留原始深链接并排除下级标题，不隐藏正文", async () => {
        const page: PageProps["page"] = {
            slug: "/components/rc-radio", href: "/docs/components/rc-radio", title: "Radio", description: "", status: "stable", draft: false,
            headings: [
                { id: "基础示例", title: "基础示例", depth: 2, href: "/docs/components/rc-radio#%E5%9F%BA%E7%A1%80%E7%A4%BA%E4%BE%8B" },
                { id: "usage", title: "使用提示", depth: 3, href: "/docs/components/rc-radio#usage" },
                { id: "api", title: "API", depth: 2, href: "/docs/components/rc-radio#api" },
            ],
        };
        await render(<><PageSections page={page} /><h2 id="基础示例">基础示例</h2><h2 id="api">API</h2></>);
        await fireEvent.click(screen.getByRole("button", { name: "本页内容" }));
        expect(screen.getByRole("link", { name: "基础示例" }).getAttribute("href")).toContain("#%E5%9F%BA");
        expect(screen.getByRole("link", { name: "API" }).getAttribute("href")).toBe("/docs/components/rc-radio#api");
        expect(screen.queryByRole("link", { name: "使用提示" })).toBeNull();
        expect(screen.getAllByRole("heading").length).toBe(2);
    });

    it("窄屏仅保留一份可折叠目录，跳转保留正文和部署前缀", async () => {
        const titles = ["基础示例", "开始之前", "跟着做", "常见问题", "API", "更多示例"];
        const page: PageProps["page"] = {
            slug: "/components/rc-button", href: "/docs/components/rc-button", title: "Button", description: "", status: "stable", draft: false,
            headings: titles.map((title, index) => ({ title, id: `section-${index}`, depth: 2, href: `/docs/components/rc-button#section-${index}` })),
        };
        await render(<><PageSections page={page} />{page.headings.map(heading => <h2 key={heading.id} id={heading.id}>{heading.title}</h2>)}</>);
        const toggle = screen.getByRole("button", { name: "本页内容" });
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        expect(screen.queryByRole("navigation", { name: "章节导航" })).toBeNull();
        expect(screen.queryByRole("navigation", { name: "文档分区" })).toBeNull();
        await fireEvent.click(toggle);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("navigation", { name: "章节导航" }).id).toBe(toggle.getAttribute("aria-controls"));
        const chapters = within(screen.getByRole("navigation", { name: "章节导航" }));
        const navigation = screen.getByRole("navigation", { name: "章节导航" });
        expect(chapters.getAllByRole("link").length).toBe(6);
        const api = chapters.getByRole("link", { name: "API" });
        expect(api.getAttribute("href")).toBe("/docs/components/rc-button#section-4");
        const initial = chapters.getAllByRole("link").find(link => link.getAttribute("aria-current") === "location");
        await fireEvent.click(api, { ctrlKey: true });
        expect(initial?.getAttribute("aria-current")).toBe("location");
        await fireEvent.click(api);
        expect(api.getAttribute("aria-current")).toBe("location");
        expect(screen.getAllByRole("heading").length).toBe(6);
        expect(chapters.getAllByRole("link").length).toBe(6);
        await fireEvent.click(toggle);
        expect(screen.queryByRole("navigation", { name: "章节导航" })).toBeNull();
        expect(screen.getAllByRole("heading").length).toBe(6);
        expect(navigation.isConnected).toBe(true);
        expect(navigation.closest('[inert]')?.getAttribute('aria-hidden')).toBe('true');
        await fireEvent.click(toggle);
        expect(screen.getByRole("navigation", { name: "章节导航" })).toBe(navigation);
        expect(navigation.closest('[inert]')).toBeNull();
    });

    it("宽窄布局切换移动目录但保留正文中的输入与实例", async () => {
        const page: PageProps["page"] = {
            slug: "/guides/start", href: "/guides/start", title: "开始", description: "", status: "stable", draft: false,
            headings: [{ title: "安装", id: "install", depth: 2, href: "/guides/start#install" }],
        };
        const view = await render(<div className="crab-docs-content"><PageSections page={page}>
            <h2 id="install">安装</h2><input aria-label="未提交的草稿" defaultValue="" />
        </PageSections></div>);
        const draft = screen.getByRole("textbox", { name: "未提交的草稿" });
        if (!(draft instanceof HTMLInputElement)) throw new Error("草稿应当是输入框");
        await fireEvent.change(draft, { target: { value: "保留内容" } });
        const content = view.container.querySelector(".crab-docs-content")!;
        for (const width of [1000, 999, 700, 1200]) {
            Object.defineProperty(content, "clientWidth", { configurable: true, value: width });
            await act(() => { window.dispatchEvent(new Event("resize")); });
            expect(screen.getByRole("textbox", { name: "未提交的草稿" })).toBe(draft);
            expect(draft.value).toBe("保留内容");
            if (width >= 1000) {
                expect(screen.getByRole("navigation", { name: "章节导航" })).toBeTruthy();
                expect(screen.queryByRole("button", { name: "本页内容" })).toBeNull();
            } else {
                expect(screen.getByRole("button", { name: "本页内容" }).getAttribute("aria-expanded")).toBe("false");
                expect(screen.queryByRole("navigation", { name: "章节导航" })).toBeNull();
            }
        }
    });
});
