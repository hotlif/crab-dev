export const meta = {
    title: "Light 与 Dark",
    description: "同一套组件语义变量可在嵌套主题边界中并排使用。",
};

import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
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

function ThemePanel({ mode }: { mode: "light" | "dark" }) {
    return (
        <section className={panelClass} data-theme={mode} aria-label={`${mode} theme preview`}>
            <strong>{mode === "light" ? "Light" : "Dark"}</strong>
            <p className={secondaryClass}>背景、文本、边框与操作色均来自 Layer 2。</p>
            <span className={accentClass}>Brand color</span>
        </section>
    );
}

export default function LightDarkDemo() {
    return (
        <div className={layoutClass}>
            <ThemePanel mode="light" />
            <ThemePanel mode="dark" />
        </div>
    );
}
