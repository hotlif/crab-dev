import { createContext, use } from "react";
import type { CommonProps } from "@crab-dev/wake/docs";
import type { ThemeDesign } from "@crab-dev/rc-token-semantic";

export const SiteContext = createContext<CommonProps | null>(null);
export const SITE_DESIGN_STORAGE_KEY = "crab-docs-design";
export const DEFAULT_SITE_DESIGN: ThemeDesign = "macos";
export const SITE_DESIGNS = ["macos", "material", "shadcn"] as const satisfies readonly ThemeDesign[];
export const DocumentDesignContext = createContext<{
    design: ThemeDesign;
    setDesign: (design: ThemeDesign) => void;
}>({ design: DEFAULT_SITE_DESIGN, setDesign: () => {} });
export const TutorialDirectoryContext = createContext<HTMLElement | null>(null);

export function isSiteDesign(value: unknown): value is ThemeDesign {
    return SITE_DESIGNS.some(design => design === value);
}

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
