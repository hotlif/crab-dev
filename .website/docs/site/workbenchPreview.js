import ConfigProvider from "@crab-dev/rc-config-provider";
import { createElement, useEffect, useState } from "react";
import { DEFAULT_SITE_DESIGN, isSiteDesign, SITE_DESIGN_STORAGE_KEY } from "./siteContext.js";

const WAKE_THEME_STORAGE_KEY = "wake-docs-theme";

/** @typedef {import('@crab-dev/rc-config-provider').ConfigDesign} ConfigDesign */
/** @typedef {import('@crab-dev/rc-config-provider').ConfigTheme} ConfigTheme */
/** @typedef {{ readonly design: ConfigDesign, readonly theme: ConfigTheme }} PreviewConfiguration */

/**
 * @param {unknown} value
 * @returns {value is PreviewConfiguration & { readonly type: 'crab:preview-config' }}
 */
function isPreviewConfiguration(value) {
    if (typeof value !== "object" || value === null) return false;
    return "type" in value && value.type === "crab:preview-config"
        && "design" in value && isSiteDesign(value.design)
        && "theme" in value && (value.theme === "light" || value.theme === "dark");
}

/**
 * Shared React configuration; each workbench's theme.css supplies the public L2 styles.
 * @param {import('./workbenchPreview.js').WorkbenchPreviewProps} props
 * @returns {import('react').ReactElement}
 */
export default function WorkbenchPreview({ children, className = "demo-default-preview" }) {
    const [configuration, setConfiguration] = useState(
        /** @type {PreviewConfiguration} */ ({ design: DEFAULT_SITE_DESIGN, theme: "light" }),
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
        /** @param {ConfigDesign} design */
        const synchronizeDesign = (design) => {
            root.dataset.crabDesign = design;
            // Wake's own theme boundary must carry the design too; otherwise
            // its padding uses the default Material palette around the preview.
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.crabDesign = design;
        };
        /** @param {string | null} value */
        const synchronizeDesignPreference = (value) => {
            const design = isSiteDesign(value) ? value : DEFAULT_SITE_DESIGN;
            synchronizeDesign(design);
            setConfiguration(current => current.design === design ? current : { ...current, design });
        };
        const synchronizeTheme = () => {
            const theme = root.dataset.theme === "dark" ? "dark" : "light";
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.theme = theme;
            setConfiguration(current => current.theme === theme ? current : { ...current, theme });
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
            const { design, theme } = event.data;
            synchronizeDesign(design);
            root.dataset.theme = theme;
            if (contentRoot instanceof HTMLElement) contentRoot.dataset.theme = theme;
            setConfiguration(current => current.design === design && current.theme === theme
                ? current : { design, theme });
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

    return createElement(ConfigProvider, {
        design: configuration.design,
        theme: configuration.theme,
        className,
        children,
    });
}
