export const meta = {
    title: "当前主题的浅色与深色",
    description: "同一设计提供浅色与深色配对，局部明暗边界中的表面、文字和强调色保持清晰。",
};

import { css } from "@crab-dev/css";
import token, { defaultDesignSystem, designSystemRegistry } from "@crab-dev/rc-token-semantic";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import { useSyncExternalStore } from "react";

// This package is CSS-only. Wake loads its stylesheet; this example follows
// the document's public CSS boundary without introducing a Provider dependency.
function subscribeDesign(notify: () => void) {
    const observer = new MutationObserver(notify);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-crab-design"] });
    return () => observer.disconnect();
}
function readDesign(): DesignSystem {
    const value = document.documentElement.dataset.crabDesign;
    return Object.keys(designSystemRegistry).find(design => design === value) as DesignSystem | undefined ?? defaultDesignSystem;
}

const layoutClass = css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${token.space["component-gap"]};

    @media (max-width: 40rem) {
        grid-template-columns: 1fr;
    }
`;

const panelClass = css`
    display: grid;
    gap: ${token.space["stack-gap"]};
    padding: ${token.space["card-padding"]};
    color: ${token.color.text.primary};
    background-color: ${token.color.background.surface};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.lg};
`;

const secondaryClass = css`
    margin: 0;
    color: ${token.color.text.secondary};
`;

const accentClass = css`
    width: fit-content;
    padding: ${token.space["control-padding-y"]} ${token.space["control-padding-x"]};
    color: ${token.color.text["on-brand"]};
    background-color: ${token.color.brand.primary};
    border: 1px solid ${token.color.brand.primary};
    border-radius: ${token.radius.md};

    @media (forced-colors: active) {
        /* This noninteractive label uses the user Canvas pair. A HighlightText
           foreground on the UA Canvas text backplate can erase the label.
           Keep the exception inside this example; do not restore brand colors. */
        color: CanvasText;
        background-color: Canvas;
        border-color: CanvasText;
    }
`;

function ThemePanel({ designSystem, mode }: { designSystem: DesignSystem; mode: "light" | "dark" }) {
    return (
        <section className={panelClass} data-crab-design={designSystem} data-theme={mode} aria-label={`${designSystemRegistry[designSystem].label} ${mode} theme preview`}>
            <strong>{designSystemRegistry[designSystem].label} · {mode === "light" ? "Light" : "Dark"}</strong>
            <p className={secondaryClass}>背景、文本、边框与操作色均来自 Layer 2。</p>
            <span className={accentClass}>Brand color</span>
        </section>
    );
}

export default function LightDarkDemo() {
    const designSystem = useSyncExternalStore(subscribeDesign, readDesign, () => defaultDesignSystem);
    return (
        <div className={layoutClass}>
            <ThemePanel designSystem={designSystem} mode="light" />
            <ThemePanel designSystem={designSystem} mode="dark" />
        </div>
    );
}
