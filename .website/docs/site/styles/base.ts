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
    --component-preview-meta-info-background-color: ${token.color.surface.content};
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
.crab-docs-topbar { position: sticky; top: 0; z-index: 20; background: ${token.color.surface.canvas}; }
.crab-docs-header { max-width: 100rem; margin: auto; min-height: ${globalToken.size[64]}; display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["group-gap"]}; padding: ${token.space["inline-gap"]} ${token.space["group-gap"]}; }
.crab-docs-layout[data-home="true"] .crab-docs-header { max-width: 86rem; padding-inline: ${token.space["group-gap"]}; }
.crab-docs-header .crab-docs-search-trigger { min-width: 16rem; height: ${token.size[40]}; padding-inline: ${token.space["group-gap"]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; background: ${token.color.surface.content}; box-shadow: none; color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.medium["line-height"]}; }
.crab-docs-header .crab-docs-search-trigger:not(:disabled):hover { background: color-mix(in srgb, ${token.color.text.primary} calc(${token.state.opacity.hover} * 100%), ${token.color.surface.content}); color: ${token.color.text.primary}; }
.crab-docs-header .crab-docs-search-trigger:active { background: color-mix(in srgb, ${token.color.text.primary} calc(${token.state.opacity.pressed} * 100%), ${token.color.surface.content}); }
.crab-docs-search-trigger > span { display: flex; align-items: center; gap: ${token.space["stack-gap"]}; }
.crab-docs-search-trigger .crab-docs-search-icon { width: ${globalToken.space[6]}; height: ${globalToken.space[6]}; }
.crab-docs-theme-switch { flex: none; width: ${token.size.control}; }
.crab-docs-theme-control { display: block; }
.crab-docs-header .crab-docs-theme-trigger { width: 100%; height: ${token.size.control}; padding: 0; border: 0; box-shadow: none; color: ${token.color.text.secondary}; border-radius: ${token.shape.control}; }
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
.crab-docs-brand { font-size: ${token.font.size.heading}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; letter-spacing: -.025em; gap: ${token.space["stack-gap"]}; }
.crab-docs-brand > span { display: flex; align-items: center; }
.crab-docs-brand-mark { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; border-radius: ${token.radius.pill}; font-size: ${token.font.size.subhead}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-docs-header-links a { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; }
.crab-docs-header-links a[aria-current="page"] { color: ${token.color.selection.foreground}; background: ${token.color.background.selected}; }
.crab-docs-header-links, .crab-docs-header-tools, .crab-docs-actions { display: flex; align-items: center; flex-wrap: wrap; gap: ${token["space"]["component-gap"]}; }
.crab-docs-header-tools { margin-left: auto; }
.crab-docs-header kbd { font-size: ${token.font.size.caption}; border: 0; color: ${token.color.text.tertiary}; font-family: ${token.typography.body["font-family"]}; line-height: 1.5; }
.crab-docs-search-short { display: none; }
.crab-docs-prose > :is(h2,h3,h4) > a { margin-left: ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; opacity: 0; transition: opacity ${token.motion.interaction}; }
.crab-docs-prose > :is(h2,h3,h4):hover > a, .crab-docs-prose > :is(h2,h3,h4) > a:focus-visible { opacity: 1; }
.crab-docs-grid { display: grid; grid-template-columns: 18rem minmax(0, 1fr) 14rem; max-width: 100rem; margin: auto; gap: ${token.space["component-gap"]}; }
.crab-docs-sidebar, .crab-docs-directory { position: sticky; top: 5rem; max-height: calc(100dvh - 5rem); overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${token.color.border.subtle} transparent; align-self: start; padding: ${token.space["section-gap"]} ${token.space["stack-gap"]}; }
.crab-docs-sidebar { font-size: ${token.font.size.body}; }
.crab-docs-directory { padding-inline: ${token.space["stack-gap"]}; }
.crab-docs-directory-panel { display: grid; gap: 0; min-width: 0; overflow: hidden; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; }
.crab-docs-directory-panel > :not(:empty) { min-width: 0; padding: ${token.space["section-gap"]} ${token.space["stack-gap"]}; }
.crab-docs-directory-panel > :not(:empty) + :not(:empty) { border-top: 1px solid ${token.color.border.subtle}; }
.crab-docs-content, .crab-docs-content main, .crab-docs-page { min-width: 0; max-width: 100%; }
.crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: 18rem minmax(0, 1fr); }
.crab-docs-layout[data-catalog="true"] .crab-docs-directory { display: none; }
@media (min-width: 768px) and (max-width: 1279px) { .crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: 17rem minmax(0, 1fr); } }
@media (max-width: 1023px) { .crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: minmax(0, 1fr); } }
.crab-docs-page { padding: ${token.space["group-gap"]}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; min-height: calc(100dvh - 5rem); }
/* Wake wraps authored Markdown tables; keep their scroll and typography outside live demos. */
.crab-docs-prose > .table-scroll { min-width: 0; max-width: 100%; overflow-x: auto; margin-block: ${token.space["section-gap"]}; }
.crab-docs-prose > .table-scroll > table { width: 100%; border-collapse: collapse; font-size: ${token.font.size.body}; }
.crab-docs-prose > .table-scroll > table :is(th,td) { min-width: ${globalToken.space[24]}; padding: ${token.space["stack-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
.crab-docs-prose > .table-scroll > table th { background: var(--crab-docs-code-background); font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-docs-prose > .table-scroll > table a { color: ${token.color.text.link}; text-decoration: underline; }
.crab-docs-prose > .table-scroll > table code { white-space: normal; overflow-wrap: anywhere; }
`;
