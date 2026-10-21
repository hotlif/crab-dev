import ConfigProvider from "@crab-dev/rc-config-provider";
import { createElement, useEffect, useState } from "react";
import { DEFAULT_SITE_DESIGN, SITE_DESIGN_STORAGE_KEY } from "./siteContext.js";

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
        && "design" in value && (value.design === "material" || value.design === "shadcn")
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
        const standalone = window.parent === window;
        /** @param {string | null} value */
        const synchronizeDesignPreference = (value) => {
            const design = value === "material" || value === "shadcn" ? value : DEFAULT_SITE_DESIGN;
            root.dataset.crabDesign = design;
            setConfiguration(current => current.design === design ? current : { ...current, design });
        };
        /** @param {StorageEvent} event */
        const receiveDesignPreference = (event) => {
            if (event.key === SITE_DESIGN_STORAGE_KEY || event.key === null) {
                synchronizeDesignPreference(event.newValue);
            }
        };
        const synchronizeTheme = () => {
            const theme = root.dataset.theme === "dark" ? "dark" : "light";
            setConfiguration(current => current.theme === theme ? current : { ...current, theme });
        };
        /** @param {MessageEvent<unknown>} event */
        const receiveConfiguration = (event) => {
            if (event.source !== window.parent || event.origin !== window.location.origin) return;
            if (!isPreviewConfiguration(event.data)) return;
            const { design, theme } = event.data;
            root.dataset.crabDesign = design;
            root.dataset.theme = theme;
            setConfiguration(current => current.design === design && current.theme === theme
                ? current : { design, theme });
        };
        window.addEventListener("message", receiveConfiguration);
        if (standalone) {
            let savedDesign = null;
            try {
                savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
            } catch {
                // Workbench previews remain usable when browser storage is unavailable.
            }
            synchronizeDesignPreference(savedDesign);
            window.addEventListener("storage", receiveDesignPreference);
        }
        const observer = new MutationObserver(synchronizeTheme);
        observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
        synchronizeTheme();
        // The handshake also covers previews that mount after Wake's ready message.
        if (!standalone) {
            window.parent.postMessage({ type: "crab:preview-ready" }, window.location.origin);
        }
        return () => {
            observer.disconnect();
            window.removeEventListener("message", receiveConfiguration);
            if (standalone) window.removeEventListener("storage", receiveDesignPreference);
        };
    }, []);

    return createElement(ConfigProvider, {
        design: configuration.design,
        theme: configuration.theme,
        className,
        children,
    });
}
