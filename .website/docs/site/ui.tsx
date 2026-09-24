import { Children, use, useEffect, useId, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { defineDocsUI } from "@crab-dev/wake/docs";
import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import Dialog from "@crab-dev/rc-dialog";
import Drawer from "@crab-dev/rc-drawer";
import LineEdit from "@crab-dev/rc-line-edit";
import ThemeSwitch from "./themeSwitch.js";
import Segmented from "@crab-dev/rc-segmented";
import Alert from "@crab-dev/rc-alert";
import Empty from "@crab-dev/rc-empty";
import Spin from "@crab-dev/rc-spin";
import { useMediaQuery } from "@crab-dev/rc-hooks";
import { resolveSiteHref, SiteContext, TutorialDirectoryContext } from "./siteContext.js";
import "./siteStyles.js";
import { categoryForPath, DocumentNavigationContext, groupsForCategory, navigationCategories, PageSections } from "./documentNavigation.js";
import type { NavigationCategory } from "./documentNavigation.js";
import "./documentStyles.js";
import SiteIcon from "./siteIcon.js";
import CatalogPreview, { hasCatalogPreview } from "./catalog/preview.js";
import "./catalogStyles.js";

function follow(event: MouseEvent<HTMLElement>, slug: string, navigate: (slug: string) => void) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
    event.preventDefault();
    navigate(slug);
}

export function Root({ children, ...state }: UI.RootProps) {
    return (
        <SiteContext value={state}>
            <div className="crab-docs" data-theme={state.theme.resolved}>
                {children}
            </div>
        </SiteContext>
    );
}

export function Layout(props: UI.LayoutProps) {
    const contentId = useId();
    const sidebarId = useId();
    const path = props.route.page?.slug ?? props.route.path;
    const home = props.route.page?.href === props.site.homeHref;
    const catalog = props.route.page?.slug.replace(/^\//, "") === "learn/components";
    const [selection, setSelection] = useState<{ path: string; category: NavigationCategory | null } | null>(null);
    const routeCategory = categoryForPath(path) ?? "start";
    const category = selection?.path === path ? selection.category : routeCategory;
    // Desktop navigation stays visible; only the mobile accordion can have no expanded category.
    const navigation = { category: category ?? routeCategory, sidebarId,
        select: (value: NavigationCategory | null) => setSelection({ path, category: value }) };
    // DOM reference for the in-page keyboard shortcut; it does not trigger routing.
    const content = useRef<HTMLDivElement>(null);
    const [directory, setDirectory] = useState<HTMLDivElement | null>(null);
    const component = /(^|\/)components\//.test(path);
    return (
        <TutorialDirectoryContext value={component ? null : directory}>
            <DocumentNavigationContext value={navigation}>
                <div className="crab-docs-layout" data-home={home} data-catalog={catalog} data-reading={!!props.route.page && !home && !catalog} data-navigation-open="true">
                    <Button className="crab-docs-skip-link" appearance="primary" href={`#${contentId}`}
                        onClick={event => {
                            event.preventDefault();
                            const main = content.current?.querySelector("main");
                            if (main) {
                                main.focus({ preventScroll: true });
                                main.scrollIntoView?.({ block: "start" });
                            } else props.route.focusContent();
                        }}>
                        跳到主要内容
                    </Button>
                    <div className="crab-docs-topbar">{props.header}</div>
                    <div className="crab-docs-grid">
                        <aside className="crab-docs-sidebar" id={sidebarId} aria-labelledby={`${sidebarId}-title`}>
                            <div className="crab-docs-sidebar-heading">
                                <h2 id={`${sidebarId}-title`}>{navigationCategories.find(item => item.id === navigation.category)?.heading}</h2>
                            </div>
                            <div className="crab-docs-sidebar-scroll" key={navigation.category}>{props.navigation}</div>
                        </aside>
                        <div className="crab-docs-content" id={contentId} ref={content}>{props.children}</div>
                        <aside className="crab-docs-directory">
                            <div className="crab-docs-directory-panel">
                                <div ref={setDirectory} />
                                {props.tableOfContents}
                            </div>
                        </aside>
                    </div>
                    <DocumentNavigationContext value={{ ...navigation, category }}>
                        {props.mobileNavigation}
                    </DocumentNavigationContext>
                    {props.searchDialog}
                </div>
            </DocumentNavigationContext>
        </TutorialDirectoryContext>
    );
}

export function Header({ site, route, search, mobileNavigation, theme }: UI.HeaderProps) {
    const navigation = use(DocumentNavigationContext);
    const activeCategory = categoryForPath(route.page?.slug ?? route.path);
    return (
        <header className="crab-docs-header crab-docs-rail" role="banner">
            <Button appearance="text" className="crab-docs-rail-search" icon={<SearchIcon />}
                aria-label="搜索文档" aria-haspopup="dialog" title={`搜索文档 (${search.shortcut})`}
                onClick={() => search.setOpen(true)} />
            <Button
                appearance="text"
                className="crab-docs-brand"
                aria-label="Crab UI"
                icon={
                    <span className="crab-docs-rail-indicator"><SiteIcon name="home" /></span>
                }
                href={site.homeHref}
                onClick={(event) => follow(event, "/", route.navigate)}
            >
                <span className="crab-docs-brand-desktop">首页</span><span className="crab-docs-brand-mobile">Crab UI</span>
            </Button>
            <nav className="crab-docs-header-links" role="navigation" aria-label="主导航">
                {navigationCategories.map(item => <Button key={item.id} appearance="text" className="crab-docs-rail-item"
                    data-active={activeCategory === item.id} aria-expanded={navigation?.category === item.id}
                    aria-current={activeCategory === item.id ? "true" : undefined}
                    aria-controls={navigation?.sidebarId}
                    onClick={() => navigation?.select(item.id)}
                    icon={<span className="crab-docs-rail-indicator"><SiteIcon name={item.id} /></span>}>{item.title}</Button>)}
                {site.repositoryUrl && (
                    <Button appearance="text" className="crab-docs-rail-item crab-docs-repository-link" href={site.repositoryUrl}
                        icon={<span className="crab-docs-rail-indicator"><SiteIcon name="code" /></span>}>
                        GitHub
                    </Button>
                )}
            </nav>
            <div className="crab-docs-header-tools">
                <ThemeSwitch theme={theme} />
                <Button
                    className="crab-docs-menu-trigger"
                    appearance="text"
                    aria-label="导航"
                    aria-haspopup="dialog"
                    aria-expanded={mobileNavigation.open}
                    onClick={() => { navigation?.select(activeCategory); mobileNavigation.setOpen(true); }}
                    icon={<svg className="crab-docs-tool-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" /></svg>}
                >
                    <span className="crab-docs-menu-label">导航</span>
                </Button>
            </div>
        </header>
    );
}

function SearchIcon() {
    return (
        <svg className="crab-docs-search-icon" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="m13 13 4 4" />
        </svg>
    );
}

function NavigationChevron() {
    return (
        <svg className="crab-docs-section-chevron" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m6 4 4 4-4 4" />
        </svg>
    );
}

function NavigationLabel({ page }: { page: UI.PageLink }) {
    // Token packages use two-word names; qualifiers such as PDF and WebGL
    // belong with the translation, leaving the component's API name intact.
    const bilingual = page.slug.startsWith("/components/")
        ? /^([A-Za-z][A-Za-z0-9]*(?: Tokens)?)\s+(?=.*[\u3400-\u9fff])(.+)$/u.exec(page.title)
        : null;
    return <span className="crab-docs-nav-label">
        <span className="crab-docs-nav-name">{bilingual?.[1] ?? page.title}</span>
        {bilingual && <span className="crab-docs-nav-translation">{bilingual[2]}</span>}
    </span>;
}

export function Navigation({ groups, current, toggleSection, onNavigate, site }: UI.NavigationProps) {
    const id = useId();
    const navigation = use(DocumentNavigationContext);
    const link = (page: UI.PageLink) => (
        <Button
            key={page.slug}
            appearance="text"
            className="crab-docs-nav-page"
            href={page.href}
            title={page.title}
            aria-label={page.title}
            aria-current={current === page.slug ? "page" : undefined}
            onClick={event => follow(event, page.slug, onNavigate)}
        >
            <NavigationLabel page={page} />
        </Button>
    );
    const renderGroups = (visibleGroups: UI.NavigationProps["groups"]) => visibleGroups.map((group) => (
        <section key={group.id}>
            {!navigation && <h2>{group.title}</h2>}
            {group.pages.map(link)}
            {group.sections.map((section) => (
                <div className="crab-docs-nav-section" key={section.id}>
                    <h3 className="crab-docs-section-heading">
                    <Button
                        appearance="text"
                        className="crab-docs-section-toggle"
                        aria-expanded={section.expanded}
                        aria-controls={`${id}-${section.id}`}
                        onClick={() => toggleSection(section.id)}
                        iconAfter={<NavigationChevron />}
                    >
                        {section.title}
                    </Button>
                    </h3>
                    <div
                        id={`${id}-${section.id}`}
                        inert={!section.expanded}
                        aria-hidden={!section.expanded}
                        data-expanded={section.expanded}
                        className="crab-docs-section-collapse"
                    >
                        <div className="crab-docs-section-clip">
                            <div className="crab-docs-section-pages">
                                {section.pages.map(link)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    ));
    return (
        <nav className="crab-docs-navigation" aria-label={navigation ? "站点导航" : "文档分类"}>
            {navigation && navigation.presentation !== "mobile" ? (
                navigation.category && renderGroups(groupsForCategory(groups, navigation.category))
            ) : navigation ? <>
                <Button appearance="text" className="crab-docs-nav-page" href={site.homeHref}
                    aria-current={current === "/" ? "page" : undefined}
                    onClick={event => follow(event, "/", onNavigate)}>首页</Button>
                {navigationCategories.map(item => <section className="crab-docs-category" key={item.id} data-expanded={navigation.category === item.id}>
                    <h2 className="crab-docs-category-heading">
                        <Button appearance="text" className="crab-docs-section-toggle"
                            aria-expanded={navigation.category === item.id} aria-controls={`${id}-${item.id}`}
                            onClick={() => navigation.select(navigation.category === item.id ? null : item.id)}
                            iconAfter={<NavigationChevron />}>{item.title}</Button>
                    </h2>
                    <div id={`${id}-${item.id}`} className="crab-docs-section-collapse"
                        data-expanded={navigation.category === item.id}
                        inert={navigation.category !== item.id} aria-hidden={navigation.category !== item.id}>
                        <div className="crab-docs-section-clip">
                            <div className="crab-docs-category-content">{renderGroups(groupsForCategory(groups, item.id))}</div>
                        </div>
                    </div>
                </section>)}
            </> : renderGroups(groups.filter(group => group.id !== "design"))}
        </nav>
    );
}

export function MobileNavigation({
    open,
    setOpen,
    navigation,
    route,
    theme,
}: UI.MobileNavigationProps) {
    const title = "文档导航";
    const navigationState = use(DocumentNavigationContext);
    // 例外：记录弹层关闭原因，直到原生 close 事件完成焦点恢复。
    const closeReason = useRef<"navigation" | "cancel" | "desktop">("navigation");
    const closed = () => {
        if (closeReason.current === "desktop") {
            const trigger = document.querySelector<HTMLButtonElement>(".crab-docs-rail-item[aria-expanded=true]");
            if (trigger) trigger.focus({ preventScroll: true });
            else route.focusContent();
        } else if (closeReason.current === "navigation") route.focusContent();
    };
    useEffect(() => {
        if (!open) return;
        closeReason.current = "navigation";
        const desktop = window.matchMedia("(min-width: 1280px)");
        const update = () => {
            if (!desktop.matches) return;
            closeReason.current = "desktop";
            setOpen(false);
        };
        desktop.addEventListener("change", update);
        return () => desktop.removeEventListener("change", update);
    }, [open, setOpen]);
    return (
        <div
            ref={(node) => {
                // 原生 close 不冒泡；站点挂载点通过捕获阶段等待 Drawer 退出动画。
                node?.addEventListener("close", closed, true);
                return () => node?.removeEventListener("close", closed, true);
            }}
        >
            <Drawer
                className="crab-docs-dialog crab-docs-mobile-drawer"
                data-theme={theme.resolved}
                title={title}
                aria-label={title}
                placement="left"
                size="small"
                closeLabel="关闭导航"
                open={open}
                onOpenChange={(value) => {
                    closeReason.current = value ? "navigation" : "cancel";
                    navigationState?.select(value ? categoryForPath(route.page?.slug ?? route.path) : null);
                    setOpen(value);
                }}
            >
                {!navigationState && <nav className="crab-docs-mobile-primary" role="navigation" aria-label="主导航">
                    {[["首页", "/"]].map(([label, slug]) => (
                        <Button key={slug} appearance="text" href={route.href(slug)} onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                            follow(event, slug, route.navigate);
                            if (event.defaultPrevented) setOpen(false);
                        }}>{label}</Button>
                    ))}
                </nav>}
                <DocumentNavigationContext value={navigationState ? { ...navigationState, presentation: "mobile" } : null}>
                    <div className="crab-docs-mobile-navigation">{navigation}</div>
                </DocumentNavigationContext>
            </Drawer>
        </div>
    );
}

export function SearchDialog({ search, route, theme }: UI.SearchDialogProps) {
    const id = useId();
    // 例外：搜索输入 DOM 和关闭原因只供事件、effect 使用，不触发渲染。
    const input = useRef<HTMLInputElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const navigating = useRef(false);
    const results = search.loading || search.error ? [] : search.results;
    const activeResult = results[search.activeIndex];
    const closed = () => {
        if (navigating.current) {
            navigating.current = false;
            route.focusContent();
        }
    };
    const choose = (slug: string) => {
        navigating.current = true;
        search.select(slug);
    };
    const clear = () => {
        search.setQuery("");
        input.current?.focus();
    };
    useEffect(() => {
        if (search.open) {
            navigating.current = false;
            input.current?.focus();
        }
    }, [search.open]);
    useEffect(() => {
        if (!search.open) return;
        const active = list.current?.querySelector<HTMLElement>('[aria-selected="true"]');
        active?.scrollIntoView?.({ block: "nearest" });
    }, [search.open, search.activeIndex, search.query, search.loading]);
    return (
        <Dialog
            className="crab-docs-dialog crab-docs-search-dialog"
            data-theme={theme.resolved}
            title="搜索文档"
            open={search.open}
            maskClosable
            onOpenChange={search.setOpen}
            ref={(node) => {
                node?.addEventListener("close", closed);
                return () => node?.removeEventListener("close", closed);
            }}
            onConfirm={() => {
                if (activeResult) choose(activeResult.slug);
                else input.current?.focus();
                return false;
            }}
            i18n={{ confirmText: activeResult ? "打开文档" : "编辑关键词", cancelText: "关闭" }}
        >
            <div className="crab-docs-search" aria-busy={search.loading}>
                <div className="crab-docs-search-field">
                    <LineEdit
                        id={`${id}-query`}
                        className="crab-docs-search-input"
                        size="large"
                        bordered={false}
                        ref={input}
                        autoFocus
                        role="combobox"
                        aria-label="搜索组件、属性或教程"
                        aria-autocomplete="list"
                        aria-expanded={results.length > 0}
                        aria-controls={`${id}-results`}
                        aria-activedescendant={
                            activeResult ? `${id}-result-${search.activeIndex}` : undefined
                        }
                        aria-describedby={`${id}-help`}
                        autoComplete="off"
                        placeholder="搜索组件、API 或教程…"
                        prefix={<SearchIcon />}
                        suffix={
                            search.query ? (
                                <Button
                                    className="crab-docs-search-clear"
                                    appearance="text"
                                    aria-label="清除搜索"
                                    onClick={clear}
                                >
                                    <svg
                                        className="crab-docs-search-icon"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path d="m5 5 10 10M15 5 5 15" />
                                    </svg>
                                </Button>
                            ) : undefined
                        }
                        value={search.query}
                        onChange={(event) => search.setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.nativeEvent.isComposing) return;
                            if (event.key === "ArrowDown" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(
                                    Math.min(search.activeIndex + 1, results.length - 1),
                                );
                            }
                            if (event.key === "ArrowUp" && results.length) {
                                event.preventDefault();
                                search.setActiveIndex(Math.max(search.activeIndex - 1, 0));
                            }
                            if (event.key === "Enter" && activeResult) {
                                event.preventDefault();
                                choose(activeResult.slug);
                            }
                        }}
                    />
                </div>
                <div className="crab-docs-search-meta" role="status">
                    <span>{search.query.trim() ? "搜索结果" : "文档索引"}</span>
                    <span>
                        {search.loading
                            ? "正在搜索"
                            : search.error
                                ? "搜索失败"
                                : `${results.length} 个结果`}
                    </span>
                </div>
                <div className="crab-docs-search-scroll">
                    {search.loading && (
                        <div className="crab-docs-search-pending" role="status">
                            <Spin /> 正在搜索…
                        </div>
                    )}
                    {search.error && (
                        <Alert type="error" title="搜索失败">
                            {search.error}
                        </Alert>
                    )}
                    {!search.loading && !search.error && results.length === 0 && (
                        <Empty
                            preset="search"
                            title={search.query ? "没有匹配的文档" : "输入关键词开始搜索"}
                            description="可以搜索组件名、API 属性或教程步骤。"
                        />
                    )}
                    <ul
                        className="crab-docs-results"
                        ref={list}
                        id={`${id}-results`}
                        role="listbox"
                        aria-label="搜索结果"
                    >
                        {results.map((result, index) => {
                            // 生成的示例标题使用“名称 — 说明”；展示分层，完整文字仍参与无障碍描述。
                            const separator = result.title.indexOf(" — ");
                            const title =
                                separator > 0 ? result.title.slice(0, separator) : result.title;
                            const detail =
                                separator > 0 ? result.title.slice(separator + 3) : result.detail;
                            const kind = searchResultKind(result.kind);
                            return (
                                <li key={`${result.slug}-${index}`} role="presentation">
                                    <Button
                                        appearance="text"
                                        id={`${id}-result-${index}`}
                                        role="option"
                                        tabIndex={-1}
                                        aria-selected={index === search.activeIndex}
                                        aria-label={title}
                                        aria-describedby={`${id}-detail-${index}${separator > 0 ? ` ${id}-source-${index}` : ""}`}
                                        onClick={() => choose(result.slug)}
                                    >
                                        <span className="crab-docs-result-heading">
                                            <strong>{title}</strong>
                                            {kind && (
                                                <span className="crab-docs-result-kind">
                                                    {kind}
                                                </span>
                                            )}
                                        </span>
                                        <span
                                            className="crab-docs-result-detail"
                                            id={`${id}-detail-${index}`}
                                        >
                                            {detail}
                                        </span>
                                        {separator > 0 && (
                                            <span
                                                className="crab-docs-result-source"
                                                id={`${id}-source-${index}`}
                                            >
                                                {result.detail}
                                            </span>
                                        )}
                                        <span className="crab-docs-result-enter" aria-hidden="true">
                                            ↵
                                        </span>
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="crab-docs-search-help" id={`${id}-help`}>
                    <span>
                        <kbd>↑</kbd> <kbd>↓</kbd> 选择
                    </span>
                    <span>
                        <kbd>Enter</kbd> 打开
                    </span>
                    <span>
                        <kbd>Esc</kbd> 关闭
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

function searchResultKind(kind: string) {
    const labels: Record<string, string> = {
        component: "组件",
        api: "API",
        demo: "示例",
        guide: "指南",
        tutorial: "教程",
    };
    return labels[kind];
}

export function TableOfContents({
    headings,
    activeId,
    navigate,
    variant,
    route,
}: UI.TableOfContentsProps) {
    const component = /(^|\/)components\//.test(route.page?.slug ?? route.path);
    const visible = headings.filter((heading) => component ? heading.depth === 2 : heading.depth <= 3);
    // Component pages show chapters only; a nested heading keeps its parent chapter active.
    const currentId = component
        ? headings.slice(0, headings.findIndex(heading => heading.id === activeId) + 1)
            .findLast(heading => heading.depth === 2)?.id
        : activeId;
    if (!visible.length) return null;
    return (
        <nav className="crab-docs-toc" role="navigation" data-variant={variant} aria-label="本页目录">
            <strong>本页内容</strong>
            {visible.map((heading) => (
                <Button
                    key={heading.id}
                    appearance="text"
                    href={heading.href}
                    aria-current={currentId === heading.id ? "location" : undefined}
                    onClick={(event) => follow(event, heading.id, navigate)}
                >
                    <span title={heading.title}>{heading.title}</span>
                </Button>
            ))}
        </nav>
    );
}

export function Page({ page, previous, next, route, site, children }: UI.PageProps) {
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    // 例外：持有本站正文 DOM，将历史 Markdown 根路径链接适配到公开部署前缀。
    const article = useRef<HTMLElement>(null);
    useEffect(() => {
        const base = site.basePath.replace(/\/$/, "");
        if (!base) return;
        for (const anchor of article.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
            []) {
            if (anchor.closest("[data-wake-demo]")) continue;
            const href = anchor.getAttribute("href");
            if (
                !href ||
                !href.startsWith("/") ||
                href.startsWith("//") ||
                href === base ||
                href.startsWith(`${base}/`)
            )
                continue;
            anchor.setAttribute("href", resolveSiteHref(href, route.href));
        }
    }, [children, page.slug, route.href, site.basePath]);
    const home = page.href === site.homeHref;
    const catalog = page.slug.replace(/^\//, "") === "learn/components";
    const component = page.slug.replace(/^\//, "").startsWith("components/");
    const packageName = page.slug.split("/").at(-1) ?? "";
    // The hero changes height with content and viewport width; share its measured height with sticky offsets.
    useEffect(() => {
        if (home || catalog) return;
        const pageRoot = article.current;
        const hero = pageRoot?.querySelector<HTMLElement>(".crab-docs-page-hero");
        if (!pageRoot || !hero) return;
        const update = () => pageRoot.style.setProperty("--crab-docs-hero-height", `${hero.offsetHeight}px`);
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        observer?.observe(hero);
        update();
        window.addEventListener("resize", update);
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", update);
            pageRoot.style.removeProperty("--crab-docs-hero-height");
        };
    }, [catalog, home, page.slug]);
    const pageTail = !home && <>
        <nav className="crab-docs-pager" role="navigation" aria-label="文档翻页">
            {previous && <Button appearance="text" href={previous.href}
                onClick={(event) => follow(event, previous.slug, route.navigate)}>
                <span className="crab-docs-pager-label">← 上一篇</span><strong>{previous.title}</strong>
            </Button>}
            {next && <Button appearance="text" href={next.href}
                onClick={(event) => follow(event, next.slug, route.navigate)}>
                <span className="crab-docs-pager-label">下一篇 →</span><strong>{next.title}</strong>
            </Button>}
        </nav>
        <footer className="crab-docs-footer">
            <div><strong>Crab UI</strong><p>遵循 Material Design 3 的 React 组件库。通过组件、设计令牌与可运行示例，构建清晰、一致的界面。</p></div>
            <nav aria-label="页脚导航">
                <Button appearance="text" href={route.href("guides/getting-started")}>开始使用</Button>
                <Button appearance="text" href={route.href("guides/accessibility")}>无障碍</Button>
                {site.repositoryUrl && <Button appearance="text" href={site.repositoryUrl}>GitHub ↗</Button>}
            </nav>
            <Button appearance="outlined" className="crab-docs-back-top" aria-label="返回顶部" icon={<SiteIcon name="up" />}
                onClick={() => {
                    article.current?.querySelector("h1")?.focus({ preventScroll: true });
                    window.scrollTo({ top: 0 });
                }} />
        </footer>
    </>;
    return (
        <article ref={article} className="crab-docs-page" data-home={home} data-component={component} data-reading={!home && !catalog}>
            <div className="crab-docs-page-main">
                {!home && (
                    <div className="crab-docs-page-hero">
                        <header className="crab-docs-page-heading">
                            <h1 tabIndex={-1}>{page.title}</h1>
                            <p>{page.description}</p>
                            {component && (
                                <>
                                    <nav className="crab-docs-actions" role="navigation" aria-label="组件快捷入口">
                                        <Button
                                            appearance="tonal"
                                            href={`${route.href(`${page.slug}/workbench`)}/`}
                                        >
                                            组件工作台 ↗
                                        </Button>
                                        <code className="crab-docs-package">@crab-dev/{packageName}</code>
                                    </nav>
                                    {reducedMotion && <p className="crab-docs-motion-note" role="status">
                            已启用减少动态效果，示例中的位移与展开动画已减弱。
                                    </p>}
                                </>
                            )}
                        </header>
                        {component && hasCatalogPreview(packageName) && <div className="crab-docs-component-artwork" aria-hidden="true">
                            <CatalogPreview name={packageName} />
                        </div>}
                    </div>
                )}
                {!home && !catalog ? <PageSections key={page.slug} page={page}>{children}</PageSections>
                    : <div className="crab-docs-prose">{children}</div>}
                {pageTail}
            </div>
        </article>
    );
}

export function CodeBlock({
    title,
    language,
    code,
    children,
    copy,
    copyStatus,
}: UI.CodeBlockProps) {
    const lines = code.replace(/\r\n?/g, "\n").split("\n");
    const highlighted = Children.toArray(children);
    // Use the public source as the line boundary; custom UI does not inherit Wake's line CSS.
    const content = highlighted.length === lines.length ? highlighted : lines;
    return (
        <figure className="crab-docs-code">
            <figcaption>
                <span>{title || language || "代码"}</span>
                <Button size="small" appearance="text" onClick={copy}>
                    {copyStatus === "copied"
                        ? "已复制"
                        : copyStatus === "error"
                            ? "重试复制"
                            : "复制"}
                </Button>
            </figcaption>
            <pre tabIndex={0}>
                <code>
                    {content.map((line, index) => (
                        <span className="crab-docs-code-line" key={index}>
                            {line || "\n"}
                        </span>
                    ))}
                </code>
            </pre>
            {copyStatus === "error" && <p role="status">复制失败，请重试或手动选择代码。</p>}
        </figure>
    );
}

export function ApiTable(props: UI.ApiTableProps) {
    return (
        <section className="crab-docs-api" aria-label={`${props.symbol} 属性参考`}>
            <div className="crab-docs-api-heading">
                <strong>{props.symbol}</strong>
                <span>
                    {props.properties.length} / {props.total} 项属性
                </span>
            </div>
            {props.description && <p>{props.description}</p>}
            <LineEdit
                className="crab-docs-api-filter"
                aria-label="筛选 API 属性"
                placeholder="筛选属性…"
                prefix={<SearchIcon />}
                value={props.filter}
                onChange={(event) => props.setFilter(event.target.value)}
            />
            {props.error && (
                <Alert type="error" title="API 加载失败">
                    {props.error}
                </Alert>
            )}
            <dl className="crab-docs-properties">
                {props.properties.map((property) => (
                    <div key={property.name}>
                        <dt>
                            <code>{property.name}</code>
                            {property.required && <span data-kind="required">必填</span>}
                            {property.deprecated && <span data-kind="deprecated">已弃用</span>}
                        </dt>
                        <dd>
                            <code>{property.type_text}</code>
                            <p>{property.description || "暂无说明"}</p>
                            <span className="crab-docs-muted">
                                默认值：{property.default_value ?? "未声明"}
                                {property.since ? ` · 自 ${property.since}` : ""}
                            </span>
                        </dd>
                    </div>
                ))}
            </dl>
            {!props.error && props.properties.length === 0 && (
                <Empty preset="search" title="没有匹配的属性" />
            )}
            {props.inherited.length > 0 && (
                <details>
                    <summary>继承属性（{props.inherited.length}）</summary>
                    <ul>
                        {props.inherited.map((item, index) => (
                            <li key={`${item.name}-${index}`}>
                                <code>
                                    {item.name}: {item.type_text}
                                </code>{" "}
                                — {item.source}
                            </li>
                        ))}
                    </ul>
                </details>
            )}
            {props.warnings.length > 0 && (
                <details>
                    <summary>类型提取提示</summary>
                    <ul>
                        {props.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                        ))}
                    </ul>
                </details>
            )}
        </section>
    );
}

export function Demo(props: UI.DemoProps) {
    const [dialogSurface, setDialogSurface] = useState(false);
    const codeId = useId();
    // Dialog 退出动画结束前继续承载唯一 preview，包含外部状态驱动的关闭。
    useEffect(() => {
        if (props.fullscreen) setDialogSurface(true);
    }, [props.fullscreen]);
    const inDialog = props.fullscreen || dialogSurface;
    const preview = (
        <div
            className="crab-docs-demo-viewport"
            data-viewport={props.viewport}
            data-background={props.background}
            data-padding={props.padding === "0" || props.padding === "0px" ? "none" : "default"}
            data-wake-demo
        >
            {props.preview}
        </div>
    );
    return (
        <section className="crab-docs-demo" aria-busy={props.loading}>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            {props.loading && (
                <div role="status">
                    <Spin /> 正在加载示例…
                </div>
            )}
            {props.error && (
                <Alert type="error" title="示例加载失败">
                    {props.error}
                </Alert>
            )}
            {!inDialog && preview}
            <div className="crab-docs-actions">
                <Button
                    aria-expanded={props.codeOpen}
                    aria-controls={codeId}
                    onClick={() => props.setCodeOpen(!props.codeOpen)}
                >
                    源码
                </Button>
                <Segmented
                    aria-label="示例视口"
                    size="small"
                    value={props.viewport}
                    options={[
                        { label: "自适应", value: "responsive" },
                        { label: "平板", value: "tablet" },
                        { label: "手机", value: "mobile" },
                    ]}
                    onChange={(value) => {
                        if (value === "responsive" || value === "tablet" || value === "mobile")
                            props.setViewport(value);
                    }}
                />
                <Button onClick={() => props.setFullscreen(true)}>全屏</Button>
                <Button onClick={props.copy}>{props.copied ? "已复制" : "复制源码"}</Button>
            </div>
            <div id={codeId} hidden={!props.codeOpen} className="crab-docs-code">
                <pre tabIndex={0}>
                    <code>{props.highlightedSource || props.source}</code>
                </pre>
            </div>
            <Dialog
                className="crab-docs-dialog crab-docs-fullscreen"
                data-theme={props.theme.resolved}
                title={props.title}
                open={props.fullscreen}
                onOpenChange={props.setFullscreen}
                ref={(node) => {
                    const closed = () => setDialogSurface(false);
                    node?.addEventListener("close", closed);
                    return () => node?.removeEventListener("close", closed);
                }}
            >
                {inDialog && preview}
            </Dialog>
        </section>
    );
}

export function PageLoading() {
    return (
        <div className="crab-docs-state" role="status" aria-busy="true">
            <Spin /> 正在加载文档…
        </div>
    );
}
export function PageError({ error, retry }: UI.PageErrorProps) {
    return (
        <div className="crab-docs-state">
            <Alert type="error" title="文档加载失败">
                {error}
            </Alert>
            <Button onClick={retry}>重试加载</Button>
        </div>
    );
}
export function NotFound({ site }: UI.NotFoundProps) {
    return (
        <div className="crab-docs-state">
            <Empty title="找不到这篇文档" description="请检查地址，或通过搜索查找组件。" />
            <Button href={site.homeHref}>返回首页</Button>
        </div>
    );
}

export default defineDocsUI({
    Root,
    Layout,
    Header,
    Navigation,
    MobileNavigation,
    SearchDialog,
    TableOfContents,
    Page,
    CodeBlock,
    ApiTable,
    Demo,
    PageLoading,
    PageError,
    NotFound,
});
