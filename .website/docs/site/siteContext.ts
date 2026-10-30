import { createContext, use } from "react";
import type { CommonProps } from "@crab-dev/wake/docs";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import { defaultDesignSystem, designSystemRegistry } from "@crab-dev/rc-token-semantic";

export const SiteContext = createContext<CommonProps | null>(null);
export const SITE_DESIGN_STORAGE_KEY = "crab-docs-design";
export const DEFAULT_SITE_DESIGN: DesignSystem = defaultDesignSystem;
export const SITE_DESIGNS = Object.keys(designSystemRegistry) as DesignSystem[];
export const SITE_DESIGN_NAMES = designSystemRegistry;
export const DocumentDesignContext = createContext<{
    design: DesignSystem;
    setDesign: (design: DesignSystem) => void;
}>({ design: DEFAULT_SITE_DESIGN, setDesign: () => {} });
export const TutorialDirectoryContext = createContext<HTMLElement | null>(null);

export function isSiteDesign(value: unknown): value is DesignSystem {
    return SITE_DESIGNS.some(design => design === value);
}

/** Legacy identifiers are accepted only when reading a saved browser preference. */
export function migrateSiteDesignPreference(value: unknown): DesignSystem | undefined {
    if (value === "material") return "md3";
    if (value === "macos") return "apple";
    return isSiteDesign(value) ? value : undefined;
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
