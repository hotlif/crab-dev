import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// One observer serves the whole site. Completed targets immediately leave it.
let observer: IntersectionObserver | null = null;
const pending = new Map<Element, () => void>();

function release(element: Element) {
    observer?.unobserve(element);
    pending.delete(element);
    if (!pending.size) {
        observer?.disconnect();
        observer = null;
    }
}

function observeReveal(element: HTMLElement) {
    if (typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") {
        element.dataset.siteReveal = "visible";
        return () => {};
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = (animate: boolean) => {
        element.dataset.siteReveal = animate ? "entered" : "visible";
        release(element);
    };
    const focus = () => reveal(false);
    const reduce = () => { if (media.matches) reveal(false); };
    // Content already on screen stays visible; rendering never depends on JS.
    if (media.matches || element.getBoundingClientRect().top < window.innerHeight) {
        element.dataset.siteReveal = "visible";
        return () => {};
    }
    element.dataset.siteReveal = "pending";
    observer ??= new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) pending.get(entry.target)?.();
    }, { threshold: 0, rootMargin: "0px 0px -12px 0px" });
    pending.set(element, () => reveal(true));
    observer.observe(element);
    element.addEventListener("focusin", focus);
    media.addEventListener("change", reduce);
    return () => {
        release(element);
        element.removeEventListener("focusin", focus);
        media.removeEventListener("change", reduce);
    };
}

export function useSiteReveal<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    useEffect(() => {
        if (ref.current) return observeReveal(ref.current);
        return undefined;
    }, []);
    return ref;
}

/** Only presentation sections opt in; article text and API tables remain immediate. */
export function SiteReveal({ children }: { children: ReactNode }) {
    const ref = useSiteReveal<HTMLDivElement>();
    return <div ref={ref} className="crab-site-reveal">{children}</div>;
}

/** The generated catalog owns these sections; observe without changing its content. */
export function useCatalogReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const sections = ref.current?.closest(".crab-docs-page")?.querySelectorAll<HTMLElement>(".crab-catalog-section");
        const dispose = [...sections ?? []].map(observeReveal);
        return () => { for (const cleanup of dispose) cleanup(); };
    }, []);
    return ref;
}
