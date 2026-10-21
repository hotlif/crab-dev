import { useEffect, useRef } from "react";
import { componentPreviews } from "../_generated/component-previews.js";
import ComponentDemoFrame from "./componentDemoFrame.js";
import type { ComponentDemoDescriptor } from "./componentDemoFrame.js";

const previewIndex: Readonly<Partial<Record<string, ComponentDemoDescriptor>>> = componentPreviews;

export default function ComponentHeroPreview({ name }: { readonly name: string }) {
    const demo = Object.hasOwn(previewIndex, name) ? previewIndex[name] : undefined;
    // DOM ownership and measurements stay outside rendering. The artwork uses
    // the actual demo's viewport width, so wrapping and responsive layouts agree.
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const root = container.current;
        const article = root?.closest("article");
        if (!root || !article || !demo) return;
        let source: HTMLElement | null = null;
        const measure = () => {
            const width = source?.getBoundingClientRect().width ?? 0;
            if (width > 0) root.style.setProperty("--crab-docs-preview-width", `${width}px`);
        };
        const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
        const connect = () => {
            const card = [...article.querySelectorAll<HTMLElement>("[data-component-demo-id]")]
                .find(element => element.dataset.componentDemoId === demo.id);
            const next = card?.querySelector<HTMLElement>('[data-presentation="interactive"]') ?? null;
            if (next === source) return;
            resize?.disconnect();
            source = next;
            if (source) resize?.observe(source);
            measure();
        };
        const mutations = typeof MutationObserver === "undefined" ? null : new MutationObserver(connect);
        mutations?.observe(article, { childList: true, subtree: true });
        connect();
        window.addEventListener("resize", measure);
        return () => {
            mutations?.disconnect();
            resize?.disconnect();
            window.removeEventListener("resize", measure);
            root.style.removeProperty("--crab-docs-preview-width");
        };
    }, [demo]);
    if (!demo) return null;

    return <div ref={container} className="crab-docs-component-artwork" data-live="true" data-component-hero={name}>
        <div className="crab-docs-live-artwork-stage">
            <ComponentDemoFrame key={demo.previewPath} demo={demo} presentation="artwork" />
        </div>
    </div>;
}
