import { createContext, useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import type { NavigationProps, PageProps } from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";

export const navigationCategories = [
    { id: "start", title: "开始", heading: "开始使用" },
    { id: "components", title: "组件", heading: "组件" },
    { id: "learn", title: "实战", heading: "实战教程" },
    { id: "tools", title: "工具", heading: "开发工具" },
] as const;

export type NavigationCategory = typeof navigationCategories[number]["id"];
export interface DocumentNavigationState {
    category: NavigationCategory | null;
    sidebarId: string;
    presentation?: "desktop" | "mobile";
    select: (category: NavigationCategory | null) => void;
}
export const DocumentNavigationContext = createContext<DocumentNavigationState | null>(null);

export function categoryForPath(path: string): NavigationCategory | null {
    const slug = path.replace(/^\//, "").replace(/\/$/, "");
    if (slug.startsWith("components/") || slug === "learn/components") return "components";
    if (slug === "learn" || slug.startsWith("learn/")) return "learn";
    if (slug === "guides/toolchain") return "tools";
    return slug.startsWith("guides/") ? "start" : null;
}

export function groupsForCategory(groups: NavigationProps["groups"], category: NavigationCategory) {
    const visible = groups.filter(group => group.id !== "design");
    const pages = visible.flatMap(group => [...group.pages, ...group.sections.flatMap(section => section.pages)]);
    const selectedPages = pages.filter(page => categoryForPath(page.slug) === category);
    if (category === "components") {
        return visible.filter(group => group.id === "components").map(group => ({
            ...group,
            pages: [...selectedPages.filter(page => page.slug.replace(/^\//, "") === "learn/components"), ...group.pages],
        }));
    }
    return [{ id: category, title: navigationCategories.find(item => item.id === category)!.heading, pages: selectedPages, sections: [] }];
}

export function PageSections({ page, children }: Pick<PageProps, "page"> & { children?: ReactNode }) {
    const headings = page.headings.filter(item => item.depth === 2);
    const [active, setActive] = useState(headings[0]?.id);
    const [wide, setWide] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const outlineId = useId();
    useEffect(() => {
        const content = document.querySelector<HTMLElement>(".crab-docs-content");
        if (!content) return;
        const update = () => setWide(content.clientWidth >= 1000);
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        observer?.observe(content);
        update();
        window.addEventListener("resize", update);
        return () => { observer?.disconnect(); window.removeEventListener("resize", update); };
    }, []);
    useEffect(() => {
        // Observe rendered headings, including lazy examples, without moving or hiding article content.
        let frame = 0;
        const update = () => {
            frame = 0;
            const elements = headings.map(item => document.getElementById(item.id)).filter(node => node !== null);
            const preceding = elements.filter(node => {
                const offset = Number.parseFloat(getComputedStyle(node).scrollMarginTop) || 96;
                return node.getBoundingClientRect().top <= offset + 2;
            });
            setActive(preceding.at(-1)?.id ?? headings[0]?.id);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            cancelAnimationFrame(frame);
        };
    }, [page.headings]);
    const outline = headings.length > 0 && <aside key="outline" className="crab-docs-page-outline">
        {wide ? <p className="crab-docs-outline-label">本页内容</p> :
            <Button appearance="text" className="crab-docs-outline-toggle" aria-expanded={expanded} aria-controls={outlineId}
                icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>}
                onClick={() => setExpanded(!expanded)}>本页内容</Button>}
        <div className="crab-docs-section-collapse" data-expanded={wide || expanded} inert={!wide && !expanded} aria-hidden={!wide && !expanded}>
            <div className="crab-docs-section-clip">
                <nav id={outlineId} className="crab-docs-page-sections" role="navigation" aria-label="章节导航" aria-hidden={!wide && !expanded}>
                    {headings.map(item => <Button key={item.id} appearance="text" href={item.href}
                        aria-current={active === item.id ? "location" : undefined}
                        onClick={event => {
                            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                            event.preventDefault();
                            window.history.pushState(null, "", item.href);
                            document.getElementById(item.id)?.scrollIntoView?.({ block: "start" });
                            setActive(item.id);
                        }}>
                        {item.title}
                    </Button>)}
                </nav>
            </div>
        </div>
        </aside>;
    return <div className="crab-docs-reading-body" data-wide={wide && headings.length > 0}>
            {!wide && outline}
            {/* The key preserves live example state when the outline changes sides. */}
            <div key="content" className="crab-docs-prose">{children}</div>
            {wide && outline}
        </div>;
}
