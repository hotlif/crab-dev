import { use, useEffect, useId, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";

import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";

import Drawer from "@crab-dev/rc-drawer";

import ThemeSwitch from "../themeSwitch.js";

import { categoryForPath, DocumentNavigationContext, groupsForCategory, navigationCategories } from "../documentNavigation.js";

import SiteIcon from "../siteIcon.js";

import { SearchIcon, NavigationChevron } from "./icons.js";

export function follow(event: MouseEvent<HTMLElement>, slug: string, navigate: (slug: string) => void) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
    event.preventDefault();
    navigate(slug);
}

export function moveNavigationFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)")]
        .filter(item => !item.closest('[inert], [aria-hidden="true"]'));
    const index = items.findIndex(item => item === event.target || item.contains(event.target as Node));
    if (index < 0 || !items.length) return;
    const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    event.preventDefault();
    items[next]?.focus();
}

export function NavigationLabel({ page }: { page: UI.PageLink }) {
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
        <nav className="crab-docs-navigation" aria-label={navigation ? "站点导航" : "文档分类"} onKeyDown={moveNavigationFocus}>
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
    const { designSystem: design } = useConfig();
    const title = "文档导航";
    const navigationState = use(DocumentNavigationContext);
    // DOM instance used after Drawer enters the top layer, never during rendering.
    const navigationRoot = useRef<HTMLDivElement>(null);
    // 例外：记录弹层关闭原因，直到原生 close 事件完成焦点恢复。
    const closeReason = useRef<"navigation" | "cancel" | "desktop">("navigation");
    const closed = () => {
        if (closeReason.current === "desktop") {
            const trigger = document.querySelector<HTMLButtonElement>(".crab-docs-rail-item[aria-expanded=true]");
            if (trigger) trigger.focus({ preventScroll: true });
            else route.focusContent();
        } else if (closeReason.current === "cancel") {
            document.querySelector<HTMLButtonElement>(".crab-docs-menu-trigger")?.focus({ preventScroll: true });
        } else route.focusContent();
    };
    useEffect(() => {
        if (!open) return;
        closeReason.current = "navigation";
        const items = navigationRoot.current?.querySelectorAll<HTMLElement>("nav a[href], nav button:not(:disabled)");
        const first = [...items ?? []].find(item => !item.closest('[inert], [hidden], [aria-hidden="true"]')
            && item.getAttribute("aria-disabled") !== "true");
        first?.focus({ preventScroll: true });
    }, [open]);
    useEffect(() => {
        if (!open) return;
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
                navigationRoot.current = node;
                // 原生 close 不冒泡；站点挂载点通过捕获阶段等待 Drawer 退出动画。
                node?.addEventListener("close", closed, true);
                return () => {
                    navigationRoot.current = null;
                    node?.removeEventListener("close", closed, true);
                };
            }}
        >
            <Drawer
                className="crab-docs-dialog crab-docs-mobile-drawer"
                data-theme={theme.resolved}
                data-crab-design={design}
                title={title}
                aria-label={title}
                placement="left"
                size="small"
                closeLabel="关闭导航"
                open={open}
                onKeyDown={event => {
                    // Let the native dialog cancel path own Escape; Wake's
                    // window shortcut would otherwise close it before onCancel.
                    if (event.key === "Escape") event.stopPropagation();
                }}
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
