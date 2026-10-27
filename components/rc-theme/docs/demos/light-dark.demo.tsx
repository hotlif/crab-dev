export const meta = {
    title: "MD3 Expressive、Apple 与 shadcn/ui",
    description: "三种风格各自提供浅色和深色配对，局部边界的颜色、形状与阴影相互独立。",
};

import { css } from "@crab-dev/css";
import token, { designSystemRegistry } from "@crab-dev/rc-token-semantic";
import type { DesignSystem } from "@crab-dev/rc-token-semantic";
import "../../src/index.js";

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
    return (
        <div className={layoutClass}>
            <ThemePanel designSystem="md3" mode="light" />
            <ThemePanel designSystem="md3" mode="dark" />
            <ThemePanel designSystem="shadcn" mode="light" />
            <ThemePanel designSystem="shadcn" mode="dark" />
            <ThemePanel designSystem="apple" mode="light" />
            <ThemePanel designSystem="apple" mode="dark" />
        </div>
    );
}
