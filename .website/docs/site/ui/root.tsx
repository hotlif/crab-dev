import { useEffect, useId, useRef, useState } from "react";

import type * as UI from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import ConfigProvider from "@crab-dev/rc-config-provider";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";

import { DEFAULT_SITE_DESIGN, DocumentDesignContext, migrateSiteDesignPreference, SiteContext, SITE_DESIGN_STORAGE_KEY, TutorialDirectoryContext } from "../siteContext.js";
import { categoryForPath, DocumentNavigationContext, navigationCategories } from "../documentNavigation.js";
import type { NavigationCategory } from "../documentNavigation.js";

export function Root({ children, ...state }: UI.RootProps) {
    const [design, setDesign] = useState<DesignSystem>(DEFAULT_SITE_DESIGN);
    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
            const restored = migrateSiteDesignPreference(stored);
            if (restored) {
                setDesign(restored);
                if (restored !== stored) window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, restored);
            }
        } catch { /* The default remains usable when browser storage is unavailable. */ }
        const update = (event: StorageEvent) => {
            if (event.key !== SITE_DESIGN_STORAGE_KEY && event.key !== null) return;
            const restored = event.newValue === null ? DEFAULT_SITE_DESIGN : migrateSiteDesignPreference(event.newValue);
            if (!restored) return;
            setDesign(restored);
            if (event.newValue !== null && restored !== event.newValue) {
                try { window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, restored); }
                catch { /* The selected design remains usable without persistence. */ }
            }
        };
        window.addEventListener("storage", update);
        return () => window.removeEventListener("storage", update);
    }, []);
    useEffect(() => {
        const root = document.documentElement;
        const previous = root.getAttribute("data-crab-design");
        root.setAttribute("data-crab-design", design);
        return () => {
            if (previous === null) root.removeAttribute("data-crab-design");
            else root.setAttribute("data-crab-design", previous);
        };
    }, [design]);
    const chooseDesign = (next: DesignSystem) => {
        setDesign(next);
        try { window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, next); }
        catch { /* A blocked preference store must not prevent switching. */ }
    };
    return (
        <SiteContext value={state}>
            <DocumentDesignContext value={{ design, setDesign: chooseDesign }}>
                <ConfigProvider className="crab-docs" designSystem={design} colorMode={state.theme.resolved}>
                    {children}
                </ConfigProvider>
            </DocumentDesignContext>
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
