import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import "../paletteStyles.js";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
/* Site-owned presentation. Wake state and routing are consumed through docs.ui. */
html:has(.crab-docs) { scrollbar-gutter: stable; }
body { margin: 0; }
.crab-docs, .crab-docs-dialog {
    color: ${token["color"]["text"]["primary"]};
    background: ${token.color.surface.canvas};
    font-family: ${token.typography.body["font-family"]};
    font-size: ${token.font.size.body};
    line-height: ${token.typography.body["line-height"]};
}
.crab-docs {
    background: ${token.color.surface.canvas};
    min-height: 100dvh;
    --component-preview-card-border-color: ${token.color.border.subtle};
    --component-preview-card-background-color: ${token.color.surface.content};
    --component-preview-stage-background-color: ${token.color.surface.content};
    --component-preview-meta-actions-background-color: ${token.color.surface.content};
    --component-preview-card-border-color-hover: ${token.color.border.subtle};
    --component-preview-meta-border-color: ${token.color.border.subtle};
    --component-preview-card-box-shadow: none;
    --component-preview-stage-padding: ${token.space["group-gap"]};
    --component-preview-stage-min-height: calc(${token.size[40]} * 4);
    --component-preview-card-box-shadow-hover: none;
    --component-preview-meta-info-divider-border-style: none;
    --component-preview-meta-info-background-color: ${token.color.surface.low};
    --component-preview-meta-title-font-size: ${token.font.size.body};
    --component-preview-meta-title-font-weight: ${token.typography.title.large.emphasized['font-weight']};
    --component-preview-source-border-color: ${token.color.border.subtle};
}
.crab-docs *, .crab-docs-dialog * { box-sizing: border-box; }
/* Only a fallback for site content. Controls and live previews own their focus treatment. */
:where(.crab-docs, .crab-docs-dialog) :where(:focus-visible):not(:where([data-wake-demo], [data-wake-demo] *)) { outline: 2px solid ${token.color.focus.ring}; outline-offset: 3px; }
:where(.crab-docs, .crab-docs-dialog) a { color: inherit; text-underline-offset: .2em; }
.crab-docs-prose > :is(p, ul, ol) a { color: ${token.color.text.link}; }
.crab-docs button, .crab-docs summary { touch-action: manipulation; }
.crab-docs-skip-link { position: fixed; top: ${token.space["section-gap"]}; left: ${token.space["section-gap"]}; z-index: ${token["z-index"].top}; transform: translateY(calc(-100% - ${token.space["group-gap"]})); transition: none; min-height: ${token.size.control}; padding-inline: ${token.space["section-gap"]}; }
.crab-docs-skip-link:focus { transform: none; }
.crab-docs-content main { scroll-margin-top: ${globalToken.space[20]}; }
.crab-docs-theme-control { display: block; }
.crab-docs-header .crab-docs-theme-trigger[aria-expanded="true"] { background: ${token.color.background["hover-subtle"]}; }
.crab-docs-theme-popup { width: calc(${globalToken.space[24]} * 2 + ${globalToken.space[12]}); max-width: calc(100vw - 2rem); }
.crab-docs-theme-options { display: grid; padding: ${token.space["inline-gap"]}; }
.crab-docs-theme-options [role="group"] { display: grid; }
.crab-docs-theme-options [role="group"] + [role="group"] { margin-top: ${token.space["inline-gap"]}; padding-top: ${token.space["inline-gap"]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-theme-group-label { padding: ${token.space["inline-gap"]} ${token.space["component-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; line-height: ${token.typography.caption["line-height"]}; }
.crab-docs-theme-options button { width: 100%; min-height: ${token.size.control}; color: ${token.color.text.primary}; }
.crab-docs-theme-options .crab-docs-theme-option { display: grid; grid-template-columns: minmax(0, 1fr); }
.crab-docs-theme-option-content { display: flex; align-items: center; gap: ${token.space["stack-gap"]}; min-width: 0; text-align: start; }
.crab-docs-theme-option-label { flex: 1; min-width: 0; }
.crab-docs-theme-options button[aria-checked="true"] { background: ${token.color.background.selected}; color: ${token.color.selection.foreground}; }
.crab-docs-theme-options button:focus-visible { outline: ${globalToken.space["0-5"]} solid ${token.color.focus.ring}; outline-offset: calc(-1 * ${globalToken.space["0-5"]}); }
.crab-docs-theme-check { display: inline-block; width: ${globalToken.space[4]}; flex: none; }
.crab-docs-tool-icon { display: block; flex: none; width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.crab-docs-actions { display: flex; align-items: center; flex-wrap: wrap; gap: ${token["space"]["component-gap"]}; }
.crab-docs-header kbd { font-size: ${token.font.size.caption}; border: 0; color: ${token.color.text.tertiary}; font-family: ${token.typography.body["font-family"]}; line-height: 1.5; }
.crab-docs-prose > :is(h2,h3,h4) > a { margin-left: ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; opacity: 0; transition: opacity ${token.motion.interaction}; }
.crab-docs-prose > :is(h2,h3,h4):hover > a, .crab-docs-prose > :is(h2,h3,h4) > a:focus-visible { opacity: 1; }
.crab-docs-content, .crab-docs-content main, .crab-docs-page { min-width: 0; max-width: 100%; }
/* Wake wraps authored Markdown tables; keep their scroll and typography outside live demos. */
.crab-docs-prose > .table-scroll { min-width: 0; max-width: 100%; overflow-x: auto; margin-block: ${token.space["section-gap"]}; }
.crab-docs-prose > .table-scroll > table { width: 100%; border-collapse: collapse; font-size: ${token.font.size.body}; }
.crab-docs-prose > .table-scroll > table :is(th,td) { min-width: ${globalToken.space[24]}; padding: ${token.space["stack-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
.crab-docs-prose > .table-scroll > table th { background: var(--crab-docs-code-background); font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-docs-prose > .table-scroll > table a { color: ${token.color.text.link}; text-decoration: underline; }
.crab-docs-prose > .table-scroll > table code { white-space: normal; overflow-wrap: anywhere; }
`;
