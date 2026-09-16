import { createContext, use } from "react";
import type { CommonProps } from "@crab-dev/wake/docs";

export const SiteContext = createContext<CommonProps | null>(null);
export const TutorialDirectoryContext = createContext<HTMLElement | null>(null);

export function resolveSiteHref(slug: string, resolve: (path: string) => string) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(slug)) return slug;
    const suffixIndex = slug.search(/[?#]/);
    const path = suffixIndex < 0 ? slug : slug.slice(0, suffixIndex);
    const suffix = suffixIndex < 0 ? "" : slug.slice(suffixIndex);
    const href = resolve(path);
    return href + (path.endsWith("/") && !href.endsWith("/") ? "/" : "") + suffix;
}

export function useSiteHref() {
    const site = use(SiteContext);
    return (slug: string) =>
        resolveSiteHref(slug, (path) =>
            site ? site.route.href(path) : `/${path.replace(/^\//, "")}`,
        );
}
