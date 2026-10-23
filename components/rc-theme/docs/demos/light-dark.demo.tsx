export const meta = {
    title: "Material、Shadcn 与 macOS",
    description: "三种风格各自提供浅色和深色配对，局部边界的颜色、形状与阴影相互独立。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import type { ThemeDesign } from "@crab-dev/rc-token-semantic";
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
`;

const designLabels: Record<ThemeDesign, string> = {
    material: "Material",
    shadcn: "Shadcn",
    macos: "macOS",
};

function ThemePanel({ design, mode }: { design: ThemeDesign; mode: "light" | "dark" }) {
    return (
        <section className={panelClass} data-crab-design={design} data-theme={mode} aria-label={`${design} ${mode} theme preview`}>
            <strong>{designLabels[design]} · {mode === "light" ? "Light" : "Dark"}</strong>
            <p className={secondaryClass}>背景、文本、边框与操作色均来自 Layer 2。</p>
            <span className={accentClass}>Brand color</span>
        </section>
    );
}

export default function LightDarkDemo() {
    return (
        <div className={layoutClass}>
            <ThemePanel design="material" mode="light" />
            <ThemePanel design="material" mode="dark" />
            <ThemePanel design="shadcn" mode="light" />
            <ThemePanel design="shadcn" mode="dark" />
            <ThemePanel design="macos" mode="light" />
            <ThemePanel design="macos" mode="dark" />
        </div>
    );
}
