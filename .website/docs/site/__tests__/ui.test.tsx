import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useEffect, useState } from "react";
import type { CommonProps, DemoProps, PageProps, SearchState } from "@crab-dev/wake/docs";

// Keep delayed content mounting after open, plus controlled close semantics.
mock.module("@crab-dev/rc-dialog", () => ({
    __esModule: true,
    default: function DialogFixture({ ref, title, children, open }: import("@crab-dev/rc-dialog").DialogProps) {
        const [mounted, setMounted] = useState(false);
        useEffect(() => { setMounted(open); }, [open]);
        return <dialog ref={ref} open={open} aria-label={typeof title === "string" ? title : "对话框"}>
            {mounted && children}
        </dialog>;
    },
}));

// 仅替换动画与布局；保留 Drawer 的取消回调和退出完成 close 事件。
mock.module("@crab-dev/rc-drawer", () => ({
    __esModule: true,
    default: ({ open, onOpenChange, children }: import("@crab-dev/rc-drawer").DrawerProps) => (
        <dialog open={open} aria-label="文档导航" onCancel={() => onOpenChange(false)}>
            {children}
        </dialog>
    ),
}));

let UI: typeof import("../ui.js");
beforeAll(async () => {
    UI = await mock.import<typeof import("../ui.js")>("../ui.js");
    if (!window.matchMedia)
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
        });
});

function common(): CommonProps {
    return {
        site: {
            title: "Crab UI",
            description: "组件文档",
            locale: "zh-CN",
            basePath: "/handbook/",
            homeHref: "/handbook/",
        },
        route: {
            path: "/components/rc-button",
            page: null,
            href: (slug) => `/handbook/${slug.replace(/^\//, "")}`,
            navigate: mock.fn(),
            focusContent: mock.fn(),
        },
        theme: { theme: "system", resolved: "light", setTheme: mock.fn() },
    };
}

function searchState(overrides: Partial<SearchState> = {}): SearchState {
    return {
        open: true,
        query: "button",
        results: [
            {
                slug: "/components/rc-button",
                title: "Button 按钮",
                detail: "触发操作",
                kind: "component",
                href: "/handbook/components/rc-button",
            },
        ],
        activeIndex: 0,
        loading: false,
        error: null,
        shortcut: "Ctrl K",
        setOpen: mock.fn(),
        setQuery: mock.fn(),
        setActiveIndex: mock.fn(),
        select: mock.fn(),
        ...overrides,
    };
}

async function click(name: string) {
    await fireEvent.click(screen.getByRole("button", { name }));
}

describe("Wake 文档展示适配器", () => {
    it("搜索输入延后挂载时，每次打开都能直接输入", async () => {
        const state = common();
        const search = searchState({ open: false });
        const view = await render(<UI.SearchDialog {...state} search={search} />);
        for (let attempt = 0; attempt < 3; attempt++) {
            await view.rerender(<UI.SearchDialog {...state} search={{ ...search, open: true }} />);
            expect(document.activeElement).toBe(screen.getByRole("combobox"));
            await view.rerender(<UI.SearchDialog {...state} search={search} />);
        }
    });

    it("跳过导航入口聚焦当前正文并具有对应锚点", async () => {
        const state = common();
        await render(<UI.Layout {...state} header={null} navigation={null} tableOfContents={null}
            mobileNavigation={null} searchDialog={null}><main tabIndex={-1}>正文</main></UI.Layout>);
        const skip = screen.getByRole("link", { name: "跳到主要内容" });
        expect(document.getElementById(skip.getAttribute("href")!.slice(1))).toBeTruthy();
        await fireEvent.click(skip);
        expect(document.activeElement).toBe(screen.getByRole("main"));
    });
    it("正文旧链接补部署前缀并保留查询和锚点，不改示例内部链接", async () => {
        const state = common();
        await render(
            <UI.Page
                {...state}
                page={{
                    slug: "/guides/start",
                    title: "入门",
                    href: "/handbook/guides/start",
                    description: "",
                    status: "stable",
                    draft: false,
                    headings: [],
                }}
                breadcrumbs={[]}
                previous={null}
                next={null}
            >
                <p>
                    <a href="/components/rc-button/workbench/?demo=basic#source">旧工作台</a>
                </p>
                <div data-wake-demo>
                    <a href="/demo-route">示例导航</a>
                </div>
            </UI.Page>,
        );
        expect(screen.getByRole("link", { name: "旧工作台" }).getAttribute("href")).toBe(
            "/handbook/components/rc-button/workbench/?demo=basic#source",
        );
        expect(screen.getByRole("link", { name: "示例导航" }).getAttribute("href")).toBe(
            "/demo-route",
        );
    });
    it("导航保留部署前缀、修饰键与 Wake 回调", async () => {
        const state = common();
        const onNavigate = mock.fn();
        const toggleSection = mock.fn();
        await render(
            <UI.Navigation
                {...state}
                current="/components/rc-button"
                onNavigate={onNavigate}
                toggleSection={toggleSection}
                groups={[
                    {
                        id: "components",
                        title: "组件",
                        pages: [],
                        sections: [
                            {
                                id: "inputs",
                                title: "输入",
                                expanded: true,
                                active: true,
                                pages: [
                                    {
                                        slug: "/components/rc-button",
                                        title: "Button",
                                        href: "/handbook/components/rc-button",
                                    },
                                ],
                            },
                        ],
                    },
                ]}
            />,
        );
        const link = screen.getByRole("link", { name: "Button" });
        expect(link.getAttribute("href")).toBe("/handbook/components/rc-button");
        expect(link.getAttribute("aria-current")).toBe("page");
        const section = screen.getByRole("button", { name: "输入" });
        expect(section.getAttribute("aria-expanded")).toBe("true");
        expect(section.textContent).toBe("输入");
        expect(
            document.getElementById(section.getAttribute("aria-controls")!)?.contains(link),
        ).toBe(true);
        await fireEvent.click(link, { ctrlKey: true });
        expect(onNavigate).not.toHaveBeenCalled();
        await fireEvent.click(link);
        expect(onNavigate).toHaveBeenCalledWith("/components/rc-button");
        await click("输入");
        expect(toggleSection).toHaveBeenCalledWith("inputs");
    });

    it("导航收起时保留动画容器并立即移除其中的交互", async () => {
        const state = common();
        const groups = (expanded: boolean) => [{
            id: "components", title: "组件", pages: [], sections: [{
                id: "inputs", title: "输入", expanded, active: false,
                pages: [{ slug: "/button", href: "/button", title: "Button" }],
            }],
        }];
        const props = { ...state, current: "/", onNavigate: mock.fn(), toggleSection: mock.fn() };
        const view = await render(<UI.Navigation {...props} groups={groups(true)} />);
        const toggle = screen.getByRole("button", { name: "输入" });
        const region = document.getElementById(toggle.getAttribute("aria-controls")!);
        const link = screen.getByRole("link", { name: "Button" });
        await view.rerender(<UI.Navigation {...props} groups={groups(false)} />);
        expect(region?.contains(link)).toBe(true);
        expect(region?.hasAttribute("inert")).toBe(true);
        expect(region?.getAttribute("aria-hidden")).toBe("true");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        await view.rerender(<UI.Navigation {...props} groups={groups(true)} />);
        expect(region?.hasAttribute("inert")).toBe(false);
        await fireEvent.click(link);
        expect(props.onNavigate).toHaveBeenCalledWith("/button");
    });

    it("顶栏将搜索、移动菜单和主题操作交回 Wake", async () => {
        const state = common();
        const search = searchState();
        const mobileNavigation = { open: false, setOpen: mock.fn() };
        await render(<UI.Header {...state} search={search} mobileNavigation={mobileNavigation} />);
        const designLink = screen.getByRole("link", { name: "设计语言" });
        expect(designLink.getAttribute("href")).toBe("/handbook/design/language");
        expect(designLink.getAttribute("aria-current")).toBeNull();
        expect(screen.queryByRole("link", { name: "开发指南" })).toBeNull();
        await fireEvent.click(designLink, { ctrlKey: true });
        expect(state.route.navigate).not.toHaveBeenCalled();
        await fireEvent.click(designLink);
        expect(state.route.navigate).toHaveBeenCalledWith("design/language");
        await click("搜索文档");
        expect(search.setOpen).toHaveBeenCalledWith(true);
        await click("导航");
        expect(mobileNavigation.setOpen).toHaveBeenCalledWith(true);
        const themeControl = screen.getByRole("button", { name: "文档主题：跟随系统" });
        expect(themeControl.getAttribute("aria-expanded")).toBe("false");
        await fireEvent.click(themeControl);
        await fireEvent.click(screen.getByRole("menuitemradio", { name: "深色" }));
        expect(state.theme.setTheme).toHaveBeenCalledWith("dark");
        expect(themeControl.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(themeControl);
        await fireEvent.click(themeControl);
        const currentTheme = screen.getByRole("menuitemradio", { name: "跟随系统" });
        await fireEvent.keyDown(currentTheme, { key: "ArrowUp" });
        expect(document.activeElement).toBe(screen.getByRole("menuitemradio", { name: "深色" }));
        await fireEvent.keyDown(document.activeElement!, { key: "Escape" });
        expect(document.activeElement).toBe(themeControl);
    });

    it("设计章节保留共用顶部、分组侧栏和页内目录，不混入项目目录", async () => {
        const base = common();
        const state = { ...base, route: { ...base.route, path: "/handbook/design/color/" } };
        const page: PageProps["page"] = {
            slug: "/design/color", title: "色彩", href: "/handbook/design/color",
            description: "海蓝视觉规范", status: "experimental", draft: false, headings: [],
        };
        const search = searchState();
        const mobileNavigation = { open: false, setOpen: mock.fn() };
        const toggleSection = mock.fn();
        const layout = (route: CommonProps["route"]) => (
            <UI.Layout {...state} route={route}
                header={<UI.Header {...state} route={route} search={search} mobileNavigation={mobileNavigation} />}
                navigation={<UI.Navigation {...state} route={route} current="/design/color"
                    onNavigate={state.route.navigate} toggleSection={toggleSection}
                    groups={[
                        { id: "design", title: "设计语言", pages: [], sections: [
                            { id: "design-start", title: "开始使用", expanded: false, active: false, pages: [
                                { slug: "/design/language", title: "概览与原则", href: "/handbook/design/language" },
                            ] },
                            { id: "design-visual", title: "视觉基础", expanded: true, active: true, pages: [
                                { slug: "/design/color", title: "色彩", href: "/handbook/design/color" },
                            ] },
                        ] },
                        { id: "components", title: "组件", sections: [], pages: [
                            { slug: "/components/rc-button", title: "项目组件目录", href: "/handbook/components/rc-button" },
                        ] },
                    ]} />}
                tableOfContents={<span>章节段落目录</span>}
                mobileNavigation={<span>移动导航</span>}
                searchDialog={<span>全站搜索</span>}>
                <UI.Page {...state} route={route} page={page} breadcrumbs={["项目", "设计语言"]}
                    previous={{ slug: "/components/rc-button", title: "Button", href: "/handbook/components/rc-button" }}
                    next={{ slug: "/", title: "Crab UI", href: "/handbook/" }}>
                    <p>设计语言规范与样板</p>
                </UI.Page>
            </UI.Layout>
        );
        const view = await render(layout(state.route));
        const header = screen.getByRole("banner");
        expect(screen.getByRole("link", { name: "Crab UI" })).toBeTruthy();
        expect(screen.getByRole("link", { name: "设计语言" }).getAttribute("aria-current")).toBe("page");
        expect(screen.getByText("设计语言规范与样板")).toBeTruthy();
        expect(screen.getByRole("navigation", { name: "设计语言目录" })).toBeTruthy();
        const chapter = screen.getByRole("link", { name: "色彩" });
        expect(chapter.getAttribute("aria-current")).toBe("page");
        expect(chapter.getAttribute("href")).toBe("/handbook/design/color");
        await fireEvent.click(chapter);
        expect(state.route.navigate).toHaveBeenCalledWith("/design/color");
        expect(screen.queryByText("项目组件目录")).toBeNull();
        expect(screen.getByText("章节段落目录")).toBeTruthy();
        expect(screen.getByRole("button", { name: "视觉基础" }).getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("button", { name: "开始使用" }).getAttribute("aria-expanded")).toBe("false");
        await click("视觉基础");
        expect(toggleSection).toHaveBeenCalledWith("design-visual");
        expect(screen.getByText("移动导航")).toBeTruthy();
        expect(screen.getByText("全站搜索")).toBeTruthy();
        expect(screen.queryByRole("navigation", { name: "文档翻页" })).toBeNull();
        expect(screen.getByRole("navigation", { name: "主导航" })).toBeTruthy();
        expect(screen.queryByRole("link", { name: "返回文档" })).toBeNull();
        await click("搜索文档");
        expect(search.setOpen).toHaveBeenCalledWith(true);
        await click("导航");
        expect(mobileNavigation.setOpen).toHaveBeenCalledWith(true);
        await fireEvent.click(screen.getByRole("button", { name: "文档主题：跟随系统" }));
        await fireEvent.click(screen.getByRole("menuitemradio", { name: "深色" }));
        expect(state.theme.setTheme).toHaveBeenCalledWith("dark");
        await fireEvent.click(screen.getByRole("link", { name: "组件" }));
        expect(state.route.navigate).toHaveBeenCalledWith("learn/components");
        expect(screen.queryByRole("link", { name: "开发指南" })).toBeNull();
        await view.rerender(layout(base.route));
        expect(screen.getByText("项目组件目录")).toBeTruthy();
        expect(screen.queryByRole("link", { name: "色彩" })).toBeNull();
        expect(screen.getByRole("banner")).toBe(header);
        expect(screen.getByRole("navigation", { name: "主导航" })).toBeTruthy();
        await view.rerender(layout(state.route));
        expect(screen.queryByText("项目组件目录")).toBeNull();
        expect(screen.getByRole("banner")).toBe(header);
    });

    it("设计页内目录定位二级段落，普通文档保留三级标题", async () => {
        const base = common();
        const state = { ...base, route: { ...base.route, path: "/handbook/design/interaction" } };
        const navigate = mock.fn();
        const headings = [
            { id: "states", title: "控件状态总表", depth: 2, href: "/handbook/design/interaction#states" },
            { id: "error-focus", title: "错误与聚焦", depth: 3, href: "/handbook/design/interaction#error-focus" },
        ];
        const view = await render(<UI.TableOfContents {...state} headings={headings}
            activeId="states" navigate={navigate} variant="desktop" />);
        const anchor = screen.getByRole("link", { name: "控件状态总表" });
        expect(anchor.getAttribute("href")).toBe("/handbook/design/interaction#states");
        expect(anchor.getAttribute("aria-current")).toBe("location");
        expect(screen.queryByRole("link", { name: "错误与聚焦" })).toBeNull();
        await fireEvent.click(anchor, { ctrlKey: true });
        expect(navigate).not.toHaveBeenCalled();
        await fireEvent.click(anchor);
        expect(navigate).toHaveBeenCalledWith("states");
        await view.rerender(<UI.TableOfContents {...state} headings={headings}
            activeId="error-focus" navigate={navigate} variant="desktop" />);
        expect(screen.getByRole("link", { name: "控件状态总表" }).getAttribute("aria-current")).toBe("location");
        await view.rerender(<UI.TableOfContents {...base} headings={headings}
            activeId="error-focus" navigate={navigate} variant="desktop" />);
        expect(screen.getByRole("link", { name: "错误与聚焦" }).getAttribute("aria-current")).toBe("location");
    });

    it("移动导航选择页面后等待抽屉关闭完成再聚焦正文", async () => {
        const state = common();
        const props = { ...state, navigation: <span>导航内容</span>, setOpen: mock.fn() };
        const view = await render(<UI.MobileNavigation {...props} open />);
        const dialog = screen.getByRole("dialog");
        const design = screen.getByRole("link", { name: "设计语言" });
        expect(design.getAttribute("href")).toBe("/handbook/design/language");
        await fireEvent.click(design, { ctrlKey: true });
        expect(props.setOpen).not.toHaveBeenCalled();
        await fireEvent.click(design);
        expect(state.route.navigate).toHaveBeenCalledWith("design/language");
        expect(props.setOpen).toHaveBeenCalledWith(false);
        await view.rerender(<UI.MobileNavigation {...props} open={false} />);
        expect(state.route.focusContent).not.toHaveBeenCalled();
        await act(async () => {
            dialog.dispatchEvent(new Event("close"));
        });
        expect(state.route.focusContent).toHaveBeenCalledTimes(1);
    });

    it("移动导航取消时关闭抽屉且不抢正文焦点", async () => {
        const state = common();
        const setOpen = mock.fn();
        await render(
            <UI.MobileNavigation
                {...state}
                open
                navigation={<span>导航内容</span>}
                setOpen={setOpen}
            />,
        );
        const dialog = screen.getByRole("dialog");
        await act(async () => {
            dialog.dispatchEvent(new Event("cancel"));
        });
        expect(setOpen).toHaveBeenCalledWith(false);
        await act(async () => {
            dialog.dispatchEvent(new Event("close"));
        });
        expect(state.route.focusContent).not.toHaveBeenCalled();
    });

    it("搜索键盘选择不越界，选择页面后在关闭完成时恢复正文焦点", async () => {
        const state = common();
        const search = searchState();
        await render(<UI.SearchDialog {...state} search={search} />);
        const input = screen.getByRole("combobox", { name: "搜索组件、属性或教程" });
        const option = screen.getByRole("option", { name: "Button 按钮" });
        expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
        expect(option.getAttribute("aria-selected")).toBe("true");
        expect(input.getAttribute("aria-controls")).toBe(screen.getByRole("listbox").id);
        await fireEvent.keyDown(input, { key: "Enter", isComposing: true });
        expect(search.select).not.toHaveBeenCalled();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(search.setActiveIndex).toHaveBeenCalledWith(0);
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(search.select).toHaveBeenCalledWith("/components/rc-button");
        expect(state.route.focusContent).not.toHaveBeenCalled();
        await act(async () => {
            screen.getByRole("dialog").dispatchEvent(new Event("close"));
        });
        expect(state.route.focusContent).toHaveBeenCalledTimes(1);
    });

    it("搜索空结果按 Enter 不选择页面，取消关闭不抢正文焦点", async () => {
        const state = common();
        const search = searchState({ results: [] });
        await render(<UI.SearchDialog {...state} search={search} />);
        expect(screen.getByText("没有匹配的文档")).toBeTruthy();
        await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
        expect(search.select).not.toHaveBeenCalled();
        await act(async () => {
            screen.getByRole("dialog").dispatchEvent(new Event("close"));
        });
        expect(state.route.focusContent).not.toHaveBeenCalled();
    });

    it("清除搜索将关键词交回 Wake，并恢复输入焦点", async () => {
        const search = searchState();
        await render(<UI.SearchDialog {...common()} search={search} />);
        await click("清除搜索");
        expect(search.setQuery).toHaveBeenCalledWith("");
        expect(document.activeElement).toBe(screen.getByRole("combobox"));
    });

    it("示例搜索结果分开名称、说明与来源，保留完整无障碍描述", async () => {
        const search = searchState({
            results: [
                {
                    ...searchState().results[0]!,
                    title: "链接按钮 — 传入 href 时渲染为 a 元素",
                    detail: "Button 按钮 · 组件 / 输入与操作",
                },
            ],
        });
        await render(<UI.SearchDialog {...common()} search={search} />);
        const option = screen.getByRole("option", { name: "链接按钮" });
        const descriptions = option
            .getAttribute("aria-describedby")!
            .split(" ")
            .map((id) => document.getElementById(id)?.textContent);
        expect(descriptions).toEqual([
            "传入 href 时渲染为 a 元素",
            "Button 按钮 · 组件 / 输入与操作",
        ]);
    });

    it("搜索更新与错误状态不会打开过期结果", async () => {
        const search = searchState({ loading: true });
        const state = common();
        const view = await render(<UI.SearchDialog {...state} search={search} />);
        expect(screen.queryByRole("option")).toBe(null);
        await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
        expect(search.select).not.toHaveBeenCalled();
        await view.rerender(
            <UI.SearchDialog
                {...state}
                search={{ ...search, loading: false, error: "索引不可用" }}
            />,
        );
        expect(screen.queryByRole("option")).toBe(null);
        expect(screen.getByText("索引不可用")).toBeTruthy();
        await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
        expect(search.select).not.toHaveBeenCalled();
    });

    it("章节目录保留章节链接并调用 Wake 目录导航", async () => {
        const navigate = mock.fn();
        await render(
            <UI.TableOfContents
                {...common()}
                headings={[
                    {
                        id: "api",
                        title: "API",
                        depth: 2,
                        href: "/handbook/components/rc-button#api",
                    },
                ]}
                activeId="api"
                variant="desktop"
                navigate={navigate}
            />,
        );
        const link = screen.getByRole("link", { name: "API" });
        expect(link.getAttribute("aria-current")).toBe("location");
        await fireEvent.click(link);
        expect(navigate).toHaveBeenCalledWith("api");
    });

    it("复制失败保留可选源码和重试入口", async () => {
        const copy = mock.fn(async () => {});
        await render(
            <UI.CodeBlock
                {...common()}
                code="const value = 1"
                language="ts"
                copyStatus="error"
                copy={copy}
            >
                const value = 1
            </UI.CodeBlock>,
        );
        expect(screen.getByText("const value = 1")).toBeTruthy();
        expect(screen.getByRole("status").textContent).toContain("复制失败");
        await click("重试复制");
        expect(copy).toHaveBeenCalledTimes(1);
    });

    it("代码块为高亮节点建立独立行，并在节点数量不匹配时保留公开源码", async () => {
        const code = "const first = 1;\n\n    const second = 2;";
        const props = {
            ...common(),
            code,
            language: "ts",
            copyStatus: "idle" as const,
            copy: mock.fn(async () => {}),
        };
        const view = await render(
            <UI.CodeBlock {...props}>
                {[
                    <span key="a">const first = 1;</span>,
                    <span key="b" />,
                    <span key="c">{"    const second = 2;"}</span>,
                ]}
            </UI.CodeBlock>,
        );
        const lines = () => Array.from(document.querySelectorAll(".crab-docs-code-line"));
        expect(lines().length).toBe(3);
        expect(lines()[1]!.textContent).toBe("");
        expect(lines()[2]!.textContent).toBe("    const second = 2;");
        await view.rerender(
            <UI.CodeBlock {...props}>
                <span>不完整的高亮节点</span>
            </UI.CodeBlock>,
        );
        expect(lines().length).toBe(3);
        expect(
            lines()
                .map((line) => (line.textContent === "\n" ? "" : line.textContent))
                .join("\n"),
        ).toBe(code);
    });

    it("API 空结果与继承信息、警告同时保留", async () => {
        await render(
            <UI.ApiTable
                {...common()}
                symbol="ButtonProps"
                description=""
                properties={[]}
                total={10}
                inherited={[{ name: "id", source: "HTMLAttributes", type_text: "string" }]}
                warnings={["部分类型需要展开查看"]}
                filter="missing"
                setFilter={mock.fn()}
                error={null}
            />,
        );
        expect(screen.getByText("没有匹配的属性")).toBeTruthy();
        expect(screen.getByText("继承属性（1）")).toBeTruthy();
        expect(screen.getByText("部分类型需要展开查看")).toBeTruthy();
    });

    it("页面错误使用 Wake 提供的重试操作", async () => {
        const retry = mock.fn();
        await render(<UI.PageError {...common()} error="模块加载失败" retry={retry} />);
        await click("重试加载");
        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("全屏退出期间 preview 始终只挂载一次", async () => {
        function Example() {
            const [fullscreen, setFullscreen] = useState(false);
            const props: DemoProps = {
                ...common(),
                id: "example",
                title: "测试预览",
                description: "",
                loading: false,
                background: "transparent",
                padding: "0",
                error: null,
                source: "example",
                highlightedSource: null,
                sourceLanguage: "tsx",
                codeOpen: false,
                fullscreen,
                viewport: "responsive",
                copied: false,
                preview: <span data-testid="unique-preview">真实预览</span>,
                setCodeOpen: mock.fn(),
                setFullscreen,
                setViewport: mock.fn(),
                copy: mock.fn(async () => {}),
            };
            return (
                <>
                    <UI.Demo {...props} />
                    <UI.PageError
                        {...common()}
                        error="关闭控制"
                        retry={() => setFullscreen(false)}
                    />
                </>
            );
        }
        await render(<Example />);
        expect(screen.getAllByTestId("unique-preview").length).toBe(1);
        await click("全屏");
        expect(screen.getAllByTestId("unique-preview").length).toBe(1);
        await click("重试加载");
        expect(screen.getAllByTestId("unique-preview").length).toBe(1);
        await act(async () => {
            document.querySelector("dialog")?.dispatchEvent(new Event("close"));
        });
        expect(screen.getAllByTestId("unique-preview").length).toBe(1);
    });
});
