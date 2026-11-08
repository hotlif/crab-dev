import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { createContext, use, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CommonProps, DemoProps, SearchState } from "@crab-dev/wake/docs";
import { useConfig } from "@crab-dev/rc-config-provider";
import { SITE_DESIGN_STORAGE_KEY } from "../siteContext.js";
import { consumeDocumentRecovery, rememberDocumentRecovery } from "../ui/document-recovery.js";
import { SearchReturnFocusContext } from "../ui/search-return-focus.js";

// Keep delayed content mounting after open, plus controlled close semantics.
mock.module("@crab-dev/rc-dialog", () => ({
    __esModule: true,
    default: function DialogFixture({ ref, title, children, open, className, onKeyDown }: import("@crab-dev/rc-dialog").DialogProps) {
        const [mounted, setMounted] = useState(open);
        useEffect(() => { if (open) setMounted(true); }, [open]);
        return <dialog ref={ref} role="dialog" open={open} className={className} onKeyDown={onKeyDown}
            onClose={() => setMounted(false)}
            aria-label={typeof title === "string" ? title : "对话框"}>
            {mounted && children}
        </dialog>;
    },
}));

// 仅替换动画与布局；保留 Drawer 的取消回调和退出完成 close 事件。
mock.module("@crab-dev/rc-drawer", () => ({
    __esModule: true,
    default: ({ open, onOpenChange, onKeyDown, children }: import("@crab-dev/rc-drawer").DrawerProps) => (
        <dialog role="dialog" open={open} aria-label="文档导航" onKeyDown={onKeyDown} onCancel={(event) => onOpenChange?.(false, { reason: "escape", event })}>
            {children}
        </dialog>
    ),
}));

type DropdownFixtureValue = import("@crab-dev/rc-dropdown-container").DropdownContextValue;
const DropdownFixtureContext = createContext<DropdownFixtureValue | null>(null);
let dropdownReference: HTMLElement | null = null;

// ThemeSwitch tests its own keyboard and selection behavior; floating geometry is covered by rc-dropdown-container.
mock.module("@crab-dev/rc-dropdown-container", () => ({
    __esModule: true,
    default: ({ children, overlay }: { children: ReactNode; overlay: ReactNode }) => {
        const [open, setOpen] = useState(false);
        const value: DropdownFixtureValue = {
            state: { open },
            dispatch: (action) => setOpen(action.payload),
            refs: { setReference: (element) => { dropdownReference = element; } },
        };
        return <DropdownFixtureContext value={value}>{children}{open && overlay}</DropdownFixtureContext>;
    },
    useDropdownContext: () => {
        const value = use(DropdownFixtureContext);
        if (!value) throw new Error("Dropdown fixture is missing its provider");
        return value;
    },
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

function designPreference(initial: string | null = null, unavailable = false) {
    const previous = Object.getOwnPropertyDescriptor(window, "localStorage");
    const entries = new Map<string, string>();
    if (initial !== null) entries.set(SITE_DESIGN_STORAGE_KEY, initial);
    const storage = {
        getItem: mock.fn((key: string) => {
            if (unavailable) throw new Error("Storage unavailable");
            return entries.get(key) ?? null;
        }),
        setItem: mock.fn((key: string, value: string) => { entries.set(key, value); }),
    };
    Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
    return { storage, restore: () => {
        if (previous) Object.defineProperty(window, "localStorage", previous);
        else Reflect.deleteProperty(window, "localStorage");
    } };
}

function CurrentDocumentConfig() {
    const { designSystem: design, colorMode: theme } = useConfig();
    return <output aria-label="当前组件配置">{design}:{theme}</output>;
}

function DocumentRecoveryFixture({ deferred = false, reloaded = false }: { readonly deferred?: boolean; readonly reloaded?: boolean }) {
    const [stage, setStage] = useState<"error" | "waiting" | "ready">(reloaded ? "ready" : "error");
    const initial = common();
    const page = { slug: "/guides/getting-started", title: "开始使用", href: "/handbook/guides/getting-started",
        description: "安装组件", status: "stable", draft: false, headings: [] };
    const state = { ...initial, route: { ...initial.route, path: page.slug, page } };
    return <UI.Layout {...state} header={<button type="button" onClick={() => setStage("ready")}>继续操作导航</button>}
        navigation={null} mobileNavigation={null} tableOfContents={null} searchDialog={null}>
        <main tabIndex={-1}>{stage === "error"
            ? <UI.PageError {...state} error="加载中断" retry={() => setStage(deferred ? "waiting" : "ready")} />
            : stage === "waiting" ? <UI.PageLoading {...state} />
                : <UI.Page {...state} page={page} breadcrumbs={[]} previous={null} next={null}><p>文档正文</p></UI.Page>}
        </main>
    </UI.Layout>;
}

describe("文档设计偏好", () => {
    for (const [legacy, current] of [["material", "md3"], ["macos", "apple"]] as const) it(`恢复旧偏好 ${legacy} 并写回 ${current}`, async () => {
        const preference = designPreference(legacy);
        try {
            await render(<UI.Root {...common()}><CurrentDocumentConfig /></UI.Root>);
            expect(screen.getByLabelText("当前组件配置").textContent).toBe(`${current}:light`);
            expect(preference.storage.setItem).toHaveBeenCalledWith(SITE_DESIGN_STORAGE_KEY, current);
        } finally { preference.restore(); }
    });
    for (const [design, label] of [["apple", "Apple"], ["shadcn", "shadcn/ui"]] as const) it(`默认 MD3 Expressive，切换 ${label} 同步组件并在重新打开后保留`, async () => {
        const preference = designPreference();
        const state = common();
        const content = () => <UI.Root {...state}>
            <UI.Header {...state} search={searchState({ open: false })} mobileNavigation={{ open: false, setOpen: mock.fn() }} />
            <CurrentDocumentConfig />
        </UI.Root>;
        try {
            const view = await render(content());
            expect(screen.getByLabelText("当前组件配置").textContent).toBe("md3:light");
            await click("文档外观：MD3 Expressive · 跟随系统");
            await fireEvent.click(screen.getByRole("menuitemradio", { name: label }));
            expect(screen.getByLabelText("当前组件配置").textContent).toBe(`${design}:light`);
            expect(document.querySelector(".crab-docs")?.getAttribute("data-crab-design")).toBe(design);
            expect(document.documentElement.getAttribute("data-crab-design")).toBe(design);
            expect(preference.storage.setItem).toHaveBeenCalledWith(SITE_DESIGN_STORAGE_KEY, design);
            expect(state.theme.setTheme).not.toHaveBeenCalled();
            await view.unmount();
            await render(content());
            expect(screen.getByLabelText("当前组件配置").textContent).toBe(`${design}:light`);
        } finally { preference.restore(); }
    });

    it("风格与明暗模式独立，切换风格保留页面输入和组件实例", async () => {
        const preference = designPreference("md3");
        const base = common();
        const state = { ...base, theme: { ...base.theme, theme: "dark" as const, resolved: "dark" as const } };
        try {
            await render(<UI.Root {...state}>
                <UI.Header {...state} search={searchState({ open: false })} mobileNavigation={{ open: false, setOpen: mock.fn() }} />
                <CurrentDocumentConfig /><input aria-label="未提交的风格草稿" defaultValue="保留输入" />
            </UI.Root>);
            const draft = screen.getByRole("textbox", { name: "未提交的风格草稿" });
            await fireEvent.change(draft, { target: { value: "仍在编辑" } });
            await click("文档外观：MD3 Expressive · 深色");
            expect(screen.getByRole("group", { name: "设计体系" })).toBeTruthy();
            expect(screen.getByRole("group", { name: "明暗模式" })).toBeTruthy();
            await fireEvent.click(screen.getByRole("menuitemradio", { name: "Apple" }));
            expect(screen.getByLabelText("当前组件配置").textContent).toBe("apple:dark");
            expect(screen.getByDisplayValue("仍在编辑")).toBe(draft);
            expect(state.theme.setTheme).not.toHaveBeenCalled();
        } finally { preference.restore(); }
    });

    it("其他标签页选择 Apple 时同步配置，忽略无效偏好", async () => {
        const preference = designPreference("md3");
        try {
            await render(<UI.Root {...common()}><CurrentDocumentConfig /></UI.Root>);
            for (const design of ["apple", "unknown"]) {
                await act(async () => {
                    const event = new Event("storage");
                    Object.defineProperties(event, {
                        key: { value: SITE_DESIGN_STORAGE_KEY },
                        newValue: { value: design },
                    });
                    window.dispatchEvent(event);
                });
                expect(screen.getByLabelText("当前组件配置").textContent).toBe("apple:light");
                expect(document.documentElement.dataset.crabDesign).toBe("apple");
            }
        } finally { preference.restore(); }
    });

    it("不可用的持久化偏好不会阻止默认风格和交互", async () => {
        const preference = designPreference(null, true);
        const state = common();
        try {
            await render(<UI.Root {...state}><CurrentDocumentConfig /></UI.Root>);
            expect(screen.getByLabelText("当前组件配置").textContent).toBe("md3:light");
        } finally { preference.restore(); }
    });
});

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
            mobileNavigation={null} searchDialog={null}><main role="main" tabIndex={-1}>正文</main></UI.Layout>);
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
    for (const direction of ["ltr", "rtl"] as const) {
        it(`table ${direction} 焦点完整显露链接且不改纵向位置或示例`, async () => {
            const state = common();
            const link = <a href="#target" style={{ outlineStyle: "solid", outlineWidth: "2px", outlineOffset: "3px" }}>目标链接</a>;
            await render(<UI.Page {...state} page={{ slug: "/guides/focus", title: "焦点", href: "/handbook/guides/focus",
                description: "", status: "stable", draft: false, headings: [] }} breadcrumbs={[]} previous={null} next={null}>
                <div className="table-scroll" dir={direction}><table><tbody><tr><td>{link}</td></tr></tbody></table></div>
                <div data-wake-demo className="crab-docs-prose"><div className="table-scroll"><a href="#demo">独立示例</a></div></div>
            </UI.Page>);
            const anchor = screen.getByRole("link", { name: "目标链接" });
            const port = anchor.closest<HTMLElement>(".table-scroll")!;
            let x = 214;
            let width = 94;
            const scroll = mock.fn((options: ScrollToOptions) => { x -= options.left ?? 0; });
            Object.defineProperties(port, {
                clientLeft: { configurable: true, value: 2 },
                clientWidth: { configurable: true, value: 257 },
                scrollWidth: { configurable: true, value: 600 },
                scrollTop: { configurable: true, value: 37 },
                scrollBy: { configurable: true, value: scroll },
                getBoundingClientRect: { configurable: true, value: () => new globalThis.DOMRect(10, 100, 261, 60) },
            });
            Object.defineProperty(anchor, "getBoundingClientRect", {
                configurable: true, value: () => new globalThis.DOMRect(x, 105, width, 40),
            });
            await act(() => { anchor.focus(); });
            expect(document.activeElement).toBe(anchor);
            expect(anchor.getBoundingClientRect().right + 5).toBeLessThanOrEqual(269);
            expect(port.scrollTop).toBe(37);
            expect(scroll).toHaveBeenCalledWith({ left: 44, behavior: "instant" });
            scroll.clear();
            await act(() => { anchor.blur(); anchor.focus(); });
            expect(scroll).not.toHaveBeenCalled();
            x = -20;
            await act(() => { anchor.blur(); anchor.focus(); });
            expect(anchor.getBoundingClientRect().left - 5).toBeGreaterThanOrEqual(12);
            expect(port.scrollTop).toBe(37);
            width = 400;
            x = direction === "rtl" ? -150 : 150;
            anchor.style.direction = direction;
            await act(() => { anchor.blur(); anchor.focus(); });
            expect(direction === "rtl" ? anchor.getBoundingClientRect().right + 5
                : anchor.getBoundingClientRect().left - 5).toBe(direction === "rtl" ? 269 : 12);
            expect(port.scrollTop).toBe(37);
            scroll.clear();
            const demo = screen.getByRole("link", { name: "独立示例" });
            Object.defineProperties(demo.parentElement!, {
                clientLeft: { configurable: true, value: 0 },
                clientWidth: { configurable: true, value: 257 },
                scrollWidth: { configurable: true, value: 600 },
                scrollBy: { configurable: true, value: scroll },
                getBoundingClientRect: { configurable: true, value: () => new globalThis.DOMRect(12, 100, 257, 60) },
            });
            Object.defineProperty(demo, "getBoundingClientRect", {
                configurable: true, value: () => new globalThis.DOMRect(300, 105, 94, 40),
            });
            await act(() => { demo.focus(); });
            expect(document.activeElement).toBe(demo);
            expect(scroll).not.toHaveBeenCalled();
        });
    }
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

    it("目录方向键跳过收起内容并保持导航选择不变", async () => {
        const state = common();
        const onNavigate = mock.fn();
        await render(<UI.Navigation {...state} current="/first" onNavigate={onNavigate} toggleSection={mock.fn()}
            groups={[{ id: "components", title: "组件", pages: [
                { slug: "/first", href: "/first", title: "起始页" },
            ], sections: [
                { id: "closed", title: "收起分类", expanded: false, active: false, pages: [{ slug: "/hidden", href: "/hidden", title: "隐藏页" }] },
                { id: "open", title: "展开分类", expanded: true, active: false, pages: [{ slug: "/last", href: "/last", title: "末尾页" }] },
            ] }]} />);
        const collapsed = screen.getByRole("button", { name: "收起分类" });
        await act(async () => collapsed.focus());
        await fireEvent.keyDown(collapsed, { key: "ArrowDown" });
        expect(document.activeElement).toBe(screen.getByRole("button", { name: "展开分类" }));
        await fireEvent.keyDown(document.activeElement!, { key: "End" });
        expect(document.activeElement).toBe(screen.getByRole("link", { name: "末尾页" }));
        await fireEvent.keyDown(document.activeElement!, { key: "Home" });
        expect(document.activeElement).toBe(screen.getByRole("link", { name: "起始页" }));
        expect(onNavigate).not.toHaveBeenCalled();
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

    it("主导航使用真实链接，侧栏和选中态跟随路由，展示页释放侧栏空间", async () => {
        const state = common();
        const groups = [
            { id: "project", title: "项目", pages: [
                { slug: "/learn/practice-profile", href: "/handbook/learn/practice-profile", title: "资料表单" },
                { slug: "/learn/components", href: "/handbook/learn/components", title: "组件目录" },
            ], sections: [] },
            { id: "components", title: "组件", pages: [], sections: [{ id: "inputs", title: "输入", expanded: true, active: false,
                pages: [{ slug: "/components/rc-radio", href: "/handbook/components/rc-radio", title: "Radio" }] }] },
        ];
        const layout = (path: string) => <UI.Layout {...state} route={{ ...state.route, path }}
            header={<UI.Header {...state} route={{ ...state.route, path }} search={searchState({ open: false })}
                mobileNavigation={{ open: false, setOpen: mock.fn() }} />} tableOfContents={null}
            mobileNavigation={null} searchDialog={null}
            navigation={<UI.Navigation {...state} groups={groups} current={path} toggleSection={mock.fn()} onNavigate={state.route.navigate} />}>
            <main><input aria-label="未提交的内容" defaultValue="保留草稿" /></main>
        </UI.Layout>;
        const view = await render(layout("/learn/practice-profile"));
        const rail = screen.getByRole("navigation", { name: "主导航" });
        const category = (name: string) => Array.from(rail.querySelectorAll("a")).find(link => link.textContent === name)!;
        const draft = screen.getByRole("textbox", { name: "未提交的内容" });
        expect(category("实战").getAttribute("aria-current")).toBe("true");
        for (const [label, slug] of [["开始", "/guides/getting-started"], ["组件", "/learn/components"], ["设计", "/guides/design-styles"], ["实战", "/learn"], ["维护", "/guides/contributing"]]) {
            expect(category(label).getAttribute("href")).toBe("/handbook" + slug);
            expect(category(label).hasAttribute("aria-expanded")).toBe(false);
        }
        await fireEvent.click(category("组件"), { ctrlKey: true });
        expect(state.route.navigate).not.toHaveBeenCalled();
        await fireEvent.click(category("组件"));
        expect(state.route.navigate).toHaveBeenCalledWith("/learn/components");
        expect(category("实战").getAttribute("data-active")).toBe("true");
        await view.rerender(layout("/learn/components"));
        expect(document.querySelector(".crab-docs-layout")?.getAttribute("data-navigation-open")).toBe("false");
        await view.rerender(layout("/components/rc-radio"));
        expect(category("组件").getAttribute("data-active")).toBe("true");
        expect(category("实战").hasAttribute("aria-current")).toBe(false);
        expect(document.querySelector(".crab-docs-layout")?.getAttribute("data-navigation-open")).toBe("true");
        expect(screen.getByRole("link", { name: "Radio" }).getAttribute("aria-current")).toBe("page");
        expect(screen.getByRole("textbox", { name: "未提交的内容" })).toBe(draft);
        await view.rerender(layout("/"));
        expect(document.querySelector(".crab-docs-layout")?.getAttribute("data-navigation-open")).toBe("false");
    });
    it("顶栏将搜索、移动菜单和主题操作交回 Wake", async () => {
        const state = common();
        const search = searchState();
        const mobileNavigation = { open: false, setOpen: mock.fn() };
        await render(<UI.Header {...state} search={search} mobileNavigation={mobileNavigation} />);
        expect(screen.queryByRole("link", { name: "设计语言" })).toBeNull();
        expect(screen.getByRole("link", { name: "组件" }).getAttribute("href")).toBe("/handbook/learn/components");
        await click("搜索文档");
        expect(search.setOpen).toHaveBeenCalledWith(true);
        await click("导航");
        expect(mobileNavigation.setOpen).toHaveBeenCalledWith(true);
        const themeControl = screen.getByRole("button", { name: "文档外观：MD3 Expressive · 跟随系统" });
        // The dropdown must be able to find its real return-focus target inside
        // its DOM reference, including the document-capture Escape path.
        expect(dropdownReference?.contains(themeControl)).toBe(true);
        expect(dropdownReference?.getAttribute("aria-hidden")).not.toBe("true");
        expect(themeControl.getAttribute("aria-expanded")).toBe("false");
        await fireEvent.click(themeControl);
        const currentTheme = screen.getByRole("menuitemradio", { name: /跟随系统/ });
        await fireEvent.keyDown(currentTheme, { key: "ArrowUp" });
        const darkTheme = screen.getByRole("menuitemradio", { name: "深色" });
        expect(document.activeElement).toBe(darkTheme);
        await fireEvent.click(darkTheme);
        expect(state.theme.setTheme).toHaveBeenCalledWith("dark");
        expect(themeControl.getAttribute("aria-expanded")).toBe("false");
        expect(document.activeElement).toBe(themeControl);
        await fireEvent.keyDown(themeControl, { key: "ArrowDown" });
        await fireEvent.keyDown(screen.getByRole("menuitemradio", { name: /跟随系统/ }), { key: "Escape" });
        expect(screen.queryByRole("menu", { name: "文档外观" })).toBeNull();
        expect(document.activeElement).toBe(themeControl);
    });

    it("页内目录保留三级标题并定位当前段落", async () => {
        const base = common();
        const state = { ...base, route: { ...base.route, path: "/handbook/guides/accessibility" } };
        const navigate = mock.fn();
        const headings = [
            { id: "states", title: "控件状态总表", depth: 2, href: "/handbook/guides/accessibility#states" },
            { id: "error-focus", title: "错误与聚焦", depth: 3, href: "/handbook/guides/accessibility#error-focus" },
        ];
        const view = await render(<UI.TableOfContents {...state} headings={headings}
            activeId="states" navigate={navigate} variant="desktop" />);
        const anchor = screen.getByRole("link", { name: "控件状态总表" });
        expect(anchor.getAttribute("href")).toBe("/handbook/guides/accessibility#states");
        expect(anchor.getAttribute("aria-current")).toBe("location");
        expect(screen.getByRole("link", { name: "错误与聚焦" })).toBeTruthy();
        await fireEvent.click(anchor, { ctrlKey: true });
        expect(navigate).not.toHaveBeenCalled();
        await fireEvent.click(anchor);
        expect(navigate).toHaveBeenCalledWith("states");
        await view.rerender(<UI.TableOfContents {...state} headings={headings}
            activeId="error-focus" navigate={navigate} variant="desktop" />);
        expect(screen.getByRole("link", { name: "错误与聚焦" }).getAttribute("aria-current")).toBe("location");
        await view.rerender(<UI.TableOfContents {...base} headings={headings}
            activeId="error-focus" navigate={navigate} variant="desktop" />);
        expect(screen.queryByRole("link", { name: "错误与聚焦" })).toBeNull();
        expect(screen.getByRole("link", { name: "控件状态总表" }).getAttribute("aria-current")).toBe("location");
    });

    it("移动导航打开聚焦首页，重渲染不抢焦点，取消退出后恢复入口", async () => {
        const state = common();
        const setOpen = mock.fn();
        const nextSetOpen = mock.fn();
        const navigation = (open: boolean, onOpenChange = setOpen) => <>
            <UI.Header {...state} search={searchState({ open: false })}
                mobileNavigation={{ open, setOpen: onOpenChange }} />
            <UI.MobileNavigation {...state} open={open} setOpen={onOpenChange}
                navigation={<nav><a href="/handbook/components">组件目录</a></nav>} />
        </>;
        const view = await render(navigation(false));
        const trigger = screen.getByRole("button", { name: "导航" });
        await act(() => trigger.focus());
        await view.rerender(navigation(true));
        expect(document.activeElement).toBe(screen.getByRole("link", { name: "首页" }));

        const secondLink = screen.getByRole("link", { name: "组件目录" });
        await act(() => secondLink.focus());
        await view.rerender(navigation(true, nextSetOpen));
        expect(document.activeElement).toBe(secondLink);

        const dialog = screen.getByRole("dialog", { name: "文档导航" });
        const hostEscape = mock.fn((event: Event) => {
            if (event instanceof KeyboardEvent && event.key === "Escape") nextSetOpen(false);
        });
        window.addEventListener("keydown", hostEscape);
        try {
            const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
            await act(() => { secondLink.dispatchEvent(escape); });
            expect(hostEscape).not.toHaveBeenCalled();
            expect(escape.defaultPrevented).toBe(false);
            expect(nextSetOpen).not.toHaveBeenCalled();
            // The DOM test host has no native dialog default action.
            await act(() => { dialog.dispatchEvent(new Event("cancel")); });
        } finally {
            window.removeEventListener("keydown", hostEscape);
        }
        expect(nextSetOpen).toHaveBeenCalledWith(false);
        // Wake may supply another setter while the closing state is propagating.
        await view.rerender(navigation(true, setOpen));
        await view.rerender(navigation(false, setOpen));
        await act(() => { dialog.dispatchEvent(new Event("close")); });
        expect(document.activeElement).toBe(trigger);
        expect(state.route.focusContent).not.toHaveBeenCalled();

        await view.rerender(navigation(true));
        expect(document.activeElement).toBe(screen.getByRole("link", { name: "首页" }));
    });

    it("移动导航优先显露当前页面，并跳过收起分组中的链接", async () => {
        const state = common();
        const navigation = <nav>
            <div inert aria-hidden="true"><a href="/old" aria-current="page">隐藏的旧页面</a></div>
            <a href="/handbook/components/rc-button" aria-current="page">Button 按钮</a>
            <a href="/handbook/learn/components">组件目录</a>
        </nav>;
        const view = await render(<UI.MobileNavigation {...state} open={false} setOpen={mock.fn()} navigation={navigation} />);
        const current = screen.getByRole("link", { name: "Button 按钮" });
        const reveal = mock.fn();
        current.scrollIntoView = reveal;
        await view.rerender(<UI.MobileNavigation {...state} open setOpen={mock.fn()} navigation={navigation} />);
        expect(document.activeElement).toBe(current);
        expect(reveal).toHaveBeenCalledTimes(1);
    });

    it("导航搜索快捷键交回 Wake，抽屉关闭后保持搜索输入焦点", async () => {
        const state = common();
        const setOpen = mock.fn();
        const searchReturnFocus = { current: false };
        await render(<SearchReturnFocusContext value={searchReturnFocus}>
            <UI.MobileNavigation {...state} open setOpen={setOpen} navigation={<nav><a href="/current" aria-current="page">当前页面</a></nav>} />
            <UI.SearchDialog {...state} search={searchState()} />
        </SearchReturnFocusContext>);
        const hostShortcut = mock.fn();
        window.addEventListener("keydown", hostShortcut);
        try {
            await fireEvent.keyDown(screen.getByRole("link", { name: "当前页面" }), { key: "k", ctrlKey: true });
            expect(setOpen).toHaveBeenCalledWith(false);
            expect(searchReturnFocus.current).toBe(true);
            expect(hostShortcut).toHaveBeenCalledTimes(1);
            const input = screen.getByRole("combobox");
            await act(() => input.focus());
            await act(() => { screen.getByRole("dialog", { name: "文档导航" }).dispatchEvent(new Event("close")); });
            expect(document.activeElement).toBe(input);
            expect(state.route.focusContent).not.toHaveBeenCalled();
        } finally {
            window.removeEventListener("keydown", hostShortcut);
        }
    });

    it("移动导航选择页面后等待抽屉关闭完成再聚焦正文", async () => {
        const state = common();
        const props = { ...state, navigation: <span>导航内容</span>, setOpen: mock.fn() };
        const view = await render(<UI.MobileNavigation {...props} open />);
        const dialog = screen.getByRole("dialog");
        expect(screen.queryByRole("link", { name: "设计语言" })).toBeNull();
        const component = screen.getByRole("link", { name: "首页" });
        expect(component.getAttribute("href")).toBe("/handbook/");
        await fireEvent.click(component, { ctrlKey: true });
        expect(props.setOpen).not.toHaveBeenCalled();
        await fireEvent.click(component);
        expect(state.route.navigate).toHaveBeenCalledWith("/");
        expect(props.setOpen).toHaveBeenCalledWith(false);
        await view.rerender(<UI.MobileNavigation {...props} open={false} />);
        expect(state.route.focusContent).not.toHaveBeenCalled();
        await act(async () => {
            dialog.dispatchEvent(new Event("close"));
        });
        expect(state.route.focusContent).toHaveBeenCalledTimes(1);
    });

    it("移动抽屉切换到桌面时退出模态并恢复主导航焦点", async () => {
        const state = common();
        const setOpen = mock.fn();
        const original = window.matchMedia;
        const media = Object.assign(new EventTarget(), { matches: false });
        Object.defineProperty(window, "matchMedia", { configurable: true, value: () => media });
        try {
            const view = await render(<>
                <nav className="crab-docs-header-links"><a href="/components" aria-current="true">桌面组件入口</a></nav>
                <UI.MobileNavigation {...state} open navigation={<span>导航内容</span>} setOpen={setOpen} />
            </>);
            const dialog = screen.getByRole("dialog");
            expect(setOpen).not.toHaveBeenCalled();
            await act(() => { media.matches = true; media.dispatchEvent(new Event("change")); });
            expect(setOpen).toHaveBeenCalledWith(false);
            await act(() => { dialog.dispatchEvent(new Event("close")); });
            expect(document.activeElement).toBe(screen.getByRole("link", { name: "桌面组件入口" }));
            expect(state.route.focusContent).not.toHaveBeenCalled();
            await view.unmount();
        } finally {
            Object.defineProperty(window, "matchMedia", { configurable: true, value: original });
        }
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
        await fireEvent.keyDown(input, { key: "Enter", keyCode: 229 });
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
        expect(screen.getAllByRole("status").length).toBe(1);
        const input = screen.getByRole("combobox");
        expect(document.getElementById(input.getAttribute("aria-describedby")!)?.textContent).not.toContain("Enter");
        await click("清空关键词");
        expect(search.setQuery).toHaveBeenCalledWith("");
        expect(document.activeElement).toBe(input);
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

    it("搜索关闭使用原生取消路径，关闭控件保留明确名称", async () => {
        const search = searchState();
        await render(<UI.SearchDialog {...common()} search={search} />);
        expect(screen.getByRole("heading", { name: "搜索文档" })).toBeTruthy();
        const hostEscape = mock.fn();
        window.addEventListener("keydown", hostEscape);
        try {
            const escape = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
            await act(() => { screen.getByRole("combobox").dispatchEvent(escape); });
            expect(hostEscape).not.toHaveBeenCalled();
            expect(escape.defaultPrevented).toBe(false);
        } finally {
            window.removeEventListener("keydown", hostEscape);
        }
        await click("关闭");
        expect(search.setOpen).toHaveBeenCalledWith(false);
    });

    it("搜索取消后为已消失的抽屉入口提供返回位置，保留有效的原焦点", async () => {
        const state = common();
        await render(<>
            <button className="crab-docs-rail-search">搜索入口</button>
            <input aria-label="正在编辑的内容" />
            <UI.SearchDialog {...state} search={searchState()} />
        </>);
        const dialog = screen.getByRole("dialog");
        await act(() => { screen.getByRole("combobox").blur(); dialog.dispatchEvent(new Event("close")); });
        expect(document.activeElement).toBe(screen.getByRole("button", { name: "搜索入口" }));
        const editor = screen.getByRole("textbox", { name: "正在编辑的内容" });
        await act(() => { editor.focus(); dialog.dispatchEvent(new Event("close")); });
        expect(document.activeElement).toBe(editor);
        expect(state.route.focusContent).not.toHaveBeenCalled();
    });

    it("减少动画先恢复导航入口时，搜索仍消费一次正确的返回位置", async () => {
        const searchReturnFocus = { current: true };
        await render(<SearchReturnFocusContext value={searchReturnFocus}>
            <button className="crab-docs-rail-search">搜索入口</button>
            <button>导航入口</button>
            <input aria-label="正在编辑的内容" />
            <UI.SearchDialog {...common()} search={searchState()} />
        </SearchReturnFocusContext>);
        const dialog = screen.getByRole("dialog");
        await act(() => { screen.getByRole("button", { name: "导航入口" }).focus(); dialog.dispatchEvent(new Event("close")); });
        expect(document.activeElement).toBe(screen.getByRole("button", { name: "搜索入口" }));
        expect(searchReturnFocus.current).toBe(false);
        const editor = screen.getByRole("textbox", { name: "正在编辑的内容" });
        await act(() => { editor.focus(); dialog.dispatchEvent(new Event("close")); });
        expect(document.activeElement).toBe(editor);
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
        expect(screen.getAllByRole("status").length).toBe(1);
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
        expect(screen.getByRole("alert").textContent).not.toContain("索引不可用");
        expect(document.querySelector(".crab-docs-error-details")?.hasAttribute("open")).toBe(false);
        await fireEvent.keyDown(screen.getByRole("combobox"), { key: "Enter" });
        expect(search.select).not.toHaveBeenCalled();
        await click("浏览组件目录");
        expect(search.select).toHaveBeenCalledWith("/learn/components");
        await act(async () => { screen.getByRole("dialog").dispatchEvent(new Event("close")); });
        expect(state.route.focusContent).toHaveBeenCalledTimes(1);
    });

    it("章节目录保留完整名称和长标题提示，并调用 Wake 目录导航", async () => {
        const navigate = mock.fn();
        const title = "容器会执行 sourceCode 吗？";
        await render(
            <UI.TableOfContents
                {...common()}
                headings={[
                    {
                        id: "api",
                        title,
                        depth: 2,
                        href: "/handbook/components/rc-button#api",
                    },
                ]}
                activeId="api"
                variant="desktop"
                navigate={navigate}
            />,
        );
        const link = screen.getByRole("link", { name: title });
        expect(link.querySelector("[title]")?.getAttribute("title")).toBe(title);
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
        const setFilter = mock.fn();
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
                setFilter={setFilter}
                error={null}
            />,
        );
        expect(screen.getByText("没有匹配的属性")).toBeTruthy();
        expect(screen.getByText("继承属性（1）")).toBeTruthy();
        expect(screen.getByText("部分类型需要展开查看")).toBeTruthy();
        await click("清除筛选");
        expect(setFilter).toHaveBeenCalledWith("");
        expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "筛选 API 属性" }));
    });

    it("API 没有属性时不误报筛选无结果，也不提供无效的清除操作", async () => {
        await render(<UI.ApiTable {...common()} symbol="NoProps" description="" properties={[]} total={0}
            inherited={[]} warnings={[]} filter="" setFilter={mock.fn()} error={null} />);
        expect(screen.getByText("暂无属性说明")).toBeTruthy();
        expect(screen.queryByRole("button", { name: "清除筛选" })).toBeNull();
    });

    it("API 错误保留原始诊断，但不混入主提示或误报为空结果", async () => {
        await render(<UI.ApiTable {...common()} symbol="ButtonProps" description="" properties={[]} total={0}
            inherited={[]} warnings={[]} filter="value" setFilter={mock.fn()} error="Failed to import api-data.js" />);
        expect(screen.getByRole("alert").textContent).toContain("API 加载失败");
        expect(screen.getByRole("alert").textContent).not.toContain("api-data.js");
        expect(document.querySelector(".crab-docs-error-details pre")?.textContent).toContain("api-data.js");
        expect(screen.queryByText("没有匹配的属性")).toBeNull();
    });

    it("页面错误使用 Wake 提供的重试操作", async () => {
        const retry = mock.fn();
        await render(<UI.PageError {...common()} error="模块加载失败" retry={retry} />);
        expect(screen.getByRole("heading", { name: "文档加载失败", level: 1 })).toBeTruthy();
        expect(screen.getByRole("alert").textContent).not.toContain("模块加载失败");
        expect(document.querySelector(".crab-docs-error-details pre")?.textContent).toBe("模块加载失败");
        expect(document.querySelector(".crab-docs-error-details")?.hasAttribute("open")).toBe(false);
        expect(screen.getByRole("link", { name: "查看组件目录" }).getAttribute("href")).toBe("/handbook/learn/components");
        await click("重试加载");
        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("404 提供真正的正文标题和带部署前缀的目录、首页入口", async () => {
        await render(<UI.NotFound {...common()} />);
        expect(screen.getByRole("heading", { name: "找不到这篇文档", level: 1 })).toBeTruthy();
        expect(screen.getByRole("link", { name: "查看组件目录" }).getAttribute("href")).toBe("/handbook/learn/components");
        expect(screen.getByRole("link", { name: "返回首页" }).getAttribute("href")).toBe("/handbook/");
        expect(screen.queryByRole("alert")).toBeNull();
    });

    it("文档重试成功后将键盘焦点交给真实正文标题", async () => {
        await render(<DocumentRecoveryFixture />);
        await click("重试加载");
        expect(document.activeElement).toBe(document.querySelector(".crab-docs-page-heading h1"));
    });

    it("文档重试期间转向导航后，完成时保留用户的新焦点", async () => {
        await render(<DocumentRecoveryFixture deferred />);
        await click("重试加载");
        expect(document.activeElement?.getAttribute("aria-label")).toBe("文档内容");
        const navigation = screen.getByRole("button", { name: "继续操作导航" });
        await act(async () => { navigation.focus(); });
        await fireEvent.click(navigation);
        expect(screen.getByText("文档正文")).toBeTruthy();
        expect(document.activeElement).toBe(navigation);
    });

    it("整页刷新后只消费一次正文焦点恢复请求", async () => {
        rememberDocumentRecovery("/guides/getting-started");
        await render(<DocumentRecoveryFixture reloaded />);
        expect(document.activeElement).toBe(document.querySelector(".crab-docs-page-heading h1"));
        expect(consumeDocumentRecovery()).toBeNull();
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
