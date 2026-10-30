import ConfigProvider from "@crab-dev/rc-config-provider";
import { normalizeBrandColor } from "@crab-dev/rc-token-semantic";
import { createElement, useEffect, useState } from "react";
import { DEFAULT_SITE_DESIGN, isSiteDesign, migrateSiteDesignPreference, SITE_DESIGN_STORAGE_KEY } from "./siteContext.js";

const WAKE_THEME_STORAGE_KEY = "wake-docs-theme";

/** @typedef {import('@crab-dev/rc-config-provider').ConfigDesignSystem} ConfigDesignSystem */
/** @typedef {Omit<import('@crab-dev/rc-config-provider').ConfigValue, 'brandColor'> & {brandColor: string | null | undefined}} PreviewConfiguration */
/** @typedef {import('./workbenchPreview.js').WorkbenchPreviewConfigurationMessage} PreviewConfigurationMessage */

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isBrandColor(value) {
    if (value === null || value === undefined) return true;
    if (typeof value !== "string") return false;
    try {
        normalizeBrandColor(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * @param {unknown} value
 * @returns {value is PreviewConfigurationMessage}
 */
function isPreviewConfiguration(value) {
    if (typeof value !== "object" || value === null) return false;
    return "type" in value && value.type === "crab:preview-config"
        && "designSystem" in value && isSiteDesign(value.designSystem)
        && "colorMode" in value && (value.colorMode === "light" || value.colorMode === "dark")
        && (!("size" in value) || value.size === undefined || value.size === "small" || value.size === "medium" || value.size === "large")
        && (!("density" in value) || value.density === undefined || value.density === "compact" || value.density === "standard" || value.density === "comfortable")
        && (!("locale" in value) || value.locale === undefined || value.locale === "zh-CN" || value.locale === "en-US")
        && (!("direction" in value) || value.direction === undefined || value.direction === "ltr" || value.direction === "rtl")
        && (!("brandColor" in value) || isBrandColor(value.brandColor))
        && (!("nonce" in value) || value.nonce === undefined || typeof value.nonce === "string");
}

/**
 * Shared React configuration; each workbench's theme.css supplies the public L2 styles.
 * @param {import('./workbenchPreview.js').WorkbenchPreviewProps} props
 * @returns {import('react').ReactElement}
 */
export default function WorkbenchPreview({ children, className = "demo-default-preview", boundary: Boundary = ConfigProvider }) {
    const [configuration, setConfiguration] = useState(
        /** @type {PreviewConfiguration} */ ({ designSystem: DEFAULT_SITE_DESIGN, colorMode: "light", size: "medium", density: "standard", locale: "zh-CN", direction: "ltr", brandColor: undefined, nonce: undefined }),
    );

    useEffect(() => {
        const root = document.documentElement;
        const contentRoot = document.querySelector(".demo-frame-root");
        const standalone = window.parent === window;
        // Wake's full workbench also embeds previews in an iframe. Use saved
        // preferences until a documentation parent explicitly takes control.
        let parentControlled = false;
        let themePreference = "system";
        const colorScheme = window.matchMedia?.("(prefers-color-scheme: dark)");
        /** @param {ConfigDesignSystem} design */
        const synchronizeDesign = (design) => {
            root.dataset.crabDesign = design;
            // Wake's own theme boundary must carry the design too; otherwise
            // its padding uses the default Material palette around the preview.
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.crabDesign = design;
        };
        /** @param {string | null} value */
        const synchronizeDesignPreference = (value) => {
            const design = migrateSiteDesignPreference(value) ?? DEFAULT_SITE_DESIGN;
            synchronizeDesign(design);
            setConfiguration(current => current.designSystem === design ? current : { ...current, designSystem: design });
        };
        const synchronizeTheme = () => {
            if (parentControlled) return;
            const theme = root.dataset.theme === "dark" ? "dark" : "light";
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.theme = theme;
            setConfiguration(current => current.colorMode === theme ? current : { ...current, colorMode: theme });
        };
        const synchronizePreferredTheme = () => {
            if (parentControlled) return;
            root.dataset.theme = themePreference === "system"
                ? colorScheme?.matches ? "dark" : "light"
                : themePreference;
            synchronizeTheme();
        };
        /** @param {StorageEvent} event */
        const receivePreference = (event) => {
            if (parentControlled) return;
            if (event.key === SITE_DESIGN_STORAGE_KEY || event.key === null) {
                synchronizeDesignPreference(event.newValue);
            }
            if (event.key === WAKE_THEME_STORAGE_KEY || event.key === null) {
                themePreference = event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system";
                synchronizePreferredTheme();
            }
        };
        /** @param {MessageEvent<unknown>} event */
        const receiveConfiguration = (event) => {
            if (event.source !== window.parent || event.origin !== window.location.origin) return;
            if (!isPreviewConfiguration(event.data)) return;
            parentControlled = true;
            const { designSystem: design, colorMode: theme, size, density, locale, direction, brandColor, nonce } = event.data;
            const hasBrandColor = Object.hasOwn(event.data, "brandColor");
            const hasNonce = Object.hasOwn(event.data, "nonce");
            const normalizedBrand = typeof brandColor === "string" ? normalizeBrandColor(brandColor) : brandColor;
            synchronizeDesign(design);
            root.dataset.theme = theme;
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.theme = theme;
            setConfiguration(current => {
                const next = {
                    designSystem: design,
                    colorMode: theme,
                    size: size ?? current.size,
                    density: density ?? current.density,
                    locale: locale ?? current.locale,
                    direction: direction ?? current.direction,
                    // Omitted fields keep older local messages incremental. An
                    // explicit undefined removes the preview's local override.
                    brandColor: hasBrandColor ? normalizedBrand : current.brandColor,
                    nonce: hasNonce ? nonce : current.nonce,
                };
                return current.designSystem === next.designSystem && current.colorMode === next.colorMode
                    && current.size === next.size && current.density === next.density
                    && current.locale === next.locale && current.direction === next.direction
                    && current.brandColor === next.brandColor && current.nonce === next.nonce ? current : next;
            });
        };
        window.addEventListener("message", receiveConfiguration);
        let savedDesign = null;
        try {
            savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
            const savedTheme = window.localStorage.getItem(WAKE_THEME_STORAGE_KEY);
            themePreference = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system";
        } catch {
            // Workbench previews remain usable when browser storage is unavailable.
        }
        synchronizeDesignPreference(savedDesign);
        const migrated = migrateSiteDesignPreference(savedDesign);
        if (migrated && migrated !== savedDesign) {
            try { window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, migrated); }
            catch { /* A blocked store does not prevent restoring the preference. */ }
        }
        window.addEventListener("storage", receivePreference);
        colorScheme?.addEventListener?.("change", synchronizePreferredTheme);
        const observer = new MutationObserver(synchronizeTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
        synchronizePreferredTheme();
        // The handshake also covers previews that mount after Wake's ready message.
        if (!standalone) {
            window.parent.postMessage({ type: "crab:preview-ready" }, window.location.origin);
        }
        return () => {
            observer.disconnect();
            window.removeEventListener("message", receiveConfiguration);
            window.removeEventListener("storage", receivePreference);
            colorScheme?.removeEventListener?.("change", synchronizePreferredTheme);
        };
    }, []);

    return createElement(Boundary, {
        designSystem: configuration.designSystem,
        colorMode: configuration.colorMode,
        size: configuration.size,
        density: configuration.density,
        locale: configuration.locale,
        direction: configuration.direction,
        brandColor: configuration.brandColor,
        nonce: configuration.nonce,
        className: Array.from(new Set(["demo-default-preview", ...className.split(/\s+/).filter(Boolean)])).join(" "),
        children,
    });
}
