import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { NavigationProps, PageProps } from "@crab-dev/wake/docs";
import Button from "@crab-dev/rc-button";
import SiteIcon from "./siteIcon.js";

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
    useEffect(() => {
        const content = document.querySelector<HTMLElement>(".crab-docs-content");
        if (!content) return;
        const update = () => setWide(content.clientWidth >= 1200);
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
        observer?.observe(content);
        update();
        window.addEventListener("resize", update);
        return () => { observer?.disconnect(); window.removeEventListener("resize", update); };
    }, []);
    // Only major destinations belong in the wide navigation bar. Every chapter
    // remains available below it, in the same order as the continuous document.
    const destinations = headings.flatMap<PageProps["page"]["headings"][number] & {
        label: string;
        icon: "overview" | "learn" | "code" | "components";
    }>((heading, index) => {
        if (index === 0) return [{ ...heading, label: "概览", icon: "overview" as const }];
        if (heading.title === "跟着做") return [{ ...heading, label: "使用指南", icon: "learn" as const }];
        if (heading.title === "API") return [{ ...heading, label: "API", icon: "code" as const }];
        if (heading.title === "更多示例") return [{ ...heading, label: "更多示例", icon: "components" as const }];
        return [];
    });
    const hasDestinations = page.slug.replace(/^\//, "").startsWith("components/") && destinations.length >= 3;
    const activeIndex = headings.findIndex(heading => heading.id === active);
    const activeDestination = destinations.findLast(item => headings.findIndex(heading => heading.id === item.id) <= activeIndex)?.id;
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
    const outline = headings.length > 0 && <aside key="outline" className="crab-docs-page-outline"><p className="crab-docs-outline-label">本页内容</p>
        {wide && <p className="crab-docs-outline-title">{page.title}</p>}
        <nav className="crab-docs-page-sections" role="navigation" aria-label="章节导航">
            {headings.map(item => <Button key={item.id} appearance="text" href={item.href}
                aria-current={active === item.id ? "location" : undefined}
                onClick={event => {
                    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    setActive(item.id);
                }}>
                {item.title}
            </Button>)}
        </nav>
        </aside>;
    return <>
        {hasDestinations && <nav className="crab-docs-page-destinations" role="navigation" aria-label="文档分区">
            {destinations.map(item => <Button key={item.id} appearance="text" href={item.href}
                aria-current={activeDestination === item.id ? "location" : undefined}
                icon={<SiteIcon name={item.icon} />} onClick={event => {
                    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
                    setActive(item.id);
                }}>{item.label}</Button>)}
        </nav>}
        <div className="crab-docs-reading-body" data-wide={wide && headings.length > 0}>
            {!wide && outline}
            {/* The key preserves live example state when the outline changes sides. */}
            <div key="content" className="crab-docs-prose">{children}</div>
            {wide && outline}
        </div>
    </>;
}
