import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import "./paletteStyles.js";

// Compile-time stylesheet; shared by the document root and top-layer dialogs.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
/* Site-owned presentation. Wake state and routing are consumed through docs.ui. */
html:has(.crab-docs) { scrollbar-gutter: stable; }
.crab-docs[data-theme], .crab-docs-dialog[data-theme] {
    --token-global-font-family-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei UI', 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
}
body { margin: 0; }
.crab-docs, .crab-docs-dialog {
    color: ${token["color"]["text"]["primary"]};
    background: ${token.color.background.elevated};
    font-family: ${globalToken["font"]["family"]["sans"]};
    font-size: ${token["font"]["size"]["subhead"]};
    line-height: 1.75;
}
.crab-docs {
    background: ${token.color.background.sunken};
    min-height: 100dvh;
    --component-preview-card-border-color: ${token.color.border.subtle};
    --component-preview-card-border-color-hover: ${token.color.border.subtle};
    --component-preview-meta-border-color: ${token.color.border.subtle};
    --component-preview-card-shadow: none;
    --component-preview-card-shadow-hover: none;
    --component-preview-meta-info-divider-style: none;
    --component-preview-meta-info-background-color: var(--crab-docs-code-background);
    --component-preview-meta-title-font-size: ${token.font.size.body};
    --component-preview-meta-title-font-weight: ${token.font.weight.heading};
    --component-preview-source-border-color: ${token.color.border.subtle};
}
.crab-docs *, .crab-docs-dialog * { box-sizing: border-box; }
/* Only a fallback for site content. Controls and live previews own their focus treatment. */
:where(.crab-docs, .crab-docs-dialog) :where(:focus-visible):not(:where([data-wake-demo], [data-wake-demo] *)) { outline: 2px solid ${token.color.focus.ring}; outline-offset: 3px; }
:where(.crab-docs, .crab-docs-dialog) a { color: inherit; text-underline-offset: .2em; }
.crab-docs-prose > :is(p, ul, ol) a { color: ${token.color.text.link}; }
.crab-docs button, .crab-docs summary { touch-action: manipulation; }
.crab-docs-skip-link { position: fixed; top: ${token.space["section-gap"]}; left: ${token.space["section-gap"]}; z-index: ${token["z-index"].top}; transform: translateY(calc(-100% - ${token.space["group-gap"]})); transition: none; min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); padding-inline: ${token.space["section-gap"]}; }
.crab-docs-skip-link:focus { transform: none; }
.crab-docs-content main { scroll-margin-top: ${globalToken.space[20]}; }
.crab-docs-topbar { position: sticky; top: 0; z-index: 20; background: ${token.color.background.sunken}; border-bottom: 1px solid ${token["color"]["fill"]["default"]}; }
.crab-docs-header { max-width: 96rem; margin: auto; min-height: 4rem; display: flex; align-items: center; flex-wrap: wrap; gap: ${token["space"]["group-gap"]}; padding: ${token["space"]["stack-gap"]} ${token["space"]["section-gap"]}; }
.crab-docs-layout[data-home="true"] .crab-docs-header { max-width: 86rem; padding-inline: ${token.space["group-gap"]}; }
.crab-docs-header .crab-docs-search-trigger { height: ${globalToken.space[10]}; border: 0; background: transparent; box-shadow: none; color: ${token.color.text.secondary}; }
.crab-docs-header .crab-docs-search-trigger:not(:disabled):hover { background: ${token.color.background["hover-subtle"]}; color: ${token.color.text.primary}; }
.crab-docs-search-trigger > span { display: flex; align-items: center; gap: ${token.space["stack-gap"]}; }
.crab-docs-search-trigger .crab-docs-search-icon { width: ${globalToken.space[4]}; height: ${globalToken.space[4]}; }
.crab-docs-theme-switch { flex: none; width: ${globalToken.space[10]}; }
.crab-docs-theme-control { display: block; }
.crab-docs-theme-anchor { position: absolute; right: 0; top: 0; bottom: 0; width: calc(${globalToken.space[24]} + ${globalToken.space[20]}); pointer-events: none; }
.crab-docs-header .crab-docs-theme-trigger { width: 100%; height: ${globalToken.space[10]}; padding: 0; border: 0; box-shadow: none; color: ${token.color.text.secondary}; border-radius: ${token.radius.md}; }
.crab-docs-header .crab-docs-theme-trigger[aria-expanded="true"] { background: ${token.color.background["hover-subtle"]}; }
.crab-docs-theme-popup { width: calc(${globalToken.space[24]} + ${globalToken.space[20]}); }
.crab-docs-theme-options { display: grid; padding: ${token.space["inline-gap"]}; }
.crab-docs-theme-options button { width: 100%; min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); justify-content: start; gap: ${token.space["component-gap"]}; color: ${token.color.text.primary}; }
.crab-docs-theme-options button > span:not(.crab-docs-theme-check) { flex: 1; text-align: left; }
.crab-docs-theme-options button[aria-checked="true"] { background: ${token.color.background.selected}; color: ${token.color.selection.foreground}; }
.crab-docs-theme-options button:focus-visible { outline: ${globalToken.space["0-5"]} solid ${token.color.focus.ring}; outline-offset: calc(-1 * ${globalToken.space["0-5"]}); }
.crab-docs-theme-check { display: inline-block; width: ${globalToken.space[4]}; flex: none; }
.crab-docs-tool-icon { display: block; flex: none; width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.crab-docs-brand { font-size: ${token.font.size.heading}; font-weight: ${token.font.weight.heading}; letter-spacing: -.025em; gap: ${token.space["stack-gap"]}; }
.crab-docs-brand > span { display: flex; align-items: center; }
.crab-docs-brand-mark { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; border-radius: ${token.radius.pill}; font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
.crab-docs-header-links a { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; }
.crab-docs-header-links a[aria-current="page"] { color: ${token.color.selection.foreground}; background: ${token.color.background.selected}; }
.crab-docs-header-links, .crab-docs-header-tools, .crab-docs-actions { display: flex; align-items: center; flex-wrap: wrap; gap: ${token["space"]["component-gap"]}; }
.crab-docs-header-tools { margin-left: auto; }
.crab-docs-header kbd { font-size: ${token.font.size.caption}; border: 0; color: ${token.color.text.tertiary}; font-family: ${globalToken.font.family.sans}; line-height: 1.5; }
.crab-docs-search-short { display: none; }
.crab-docs-prose > :is(h2,h3,h4) > a { margin-left: ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; opacity: 0; transition: opacity ${token.motion.interaction}; }
.crab-docs-prose > :is(h2,h3,h4):hover > a, .crab-docs-prose > :is(h2,h3,h4) > a:focus-visible { opacity: 1; }
.crab-docs-grid { display: grid; grid-template-columns: 16rem minmax(0, 1fr) 13rem; max-width: 96rem; margin: auto; }
.crab-docs-sidebar, .crab-docs-directory { position: sticky; top: 5rem; max-height: calc(100dvh - 5rem); overflow-y: auto; scrollbar-width: thin; scrollbar-color: ${token.color.border.subtle} transparent; align-self: start; padding: ${token["space"]["page-padding"]} ${token["space"]["section-gap"]}; }
.crab-docs-sidebar { font-size: ${token.font.size.body}; }
.crab-docs-content, .crab-docs-content main, .crab-docs-page { min-width: 0; max-width: 100%; }
.crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: 16rem minmax(0, 1fr); }
.crab-docs-layout[data-catalog="true"] .crab-docs-directory { display: none; }
@media (min-width: 768px) and (max-width: 1279px) { .crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: 14rem minmax(0, 1fr); } }
@media (max-width: 767px) { .crab-docs-layout[data-catalog="true"] .crab-docs-grid { grid-template-columns: minmax(0, 1fr); } }
.crab-docs-page { padding: calc(${token["space"]["page-padding"]} * 1.5); }
.crab-docs-layout[data-design="true"] .crab-docs-grid { grid-template-columns: calc(${globalToken.space[8]} * 7) minmax(0, 1fr) calc(${globalToken.space[24]} * 2); max-width: calc(${globalToken.space[24]} * 16); }
.crab-docs-layout[data-design="true"] .crab-docs-directory { padding-inline: ${token.space["stack-gap"]}; }
.crab-docs-layout[data-design="true"] .crab-docs-prose > blockquote { margin: 0 0 ${token.space["group-gap"]}; padding: ${token.space["section-gap"]}; border-inline-start: ${globalToken.space[1]} solid ${token.color.text.link}; border-radius: ${token.radius.sm}; background: var(--crab-docs-code-background); }
.crab-docs-layout[data-design="true"] .crab-docs-prose > blockquote p { margin: 0; }
.crab-docs-layout[data-design="true"] .crab-docs-prose > :is(ul,ol) { padding-inline-start: ${token.space["group-gap"]}; }
.crab-docs-layout[data-design="true"] .crab-docs-prose > :is(ul,ol) > li { margin-block: ${token.space["stack-gap"]}; }
.crab-docs-layout[data-design="true"] .crab-docs-prose > :is(ul,ol) > li > p { margin: 0; }
/* Wake wraps authored Markdown tables; keep their scroll and typography outside live demos. */
.crab-docs-prose > .table-scroll { min-width: 0; max-width: 100%; overflow-x: auto; margin-block: ${token.space["section-gap"]}; }
.crab-docs-prose > .table-scroll > table { width: 100%; border-collapse: collapse; font-size: ${token.font.size.body}; }
.crab-docs-prose > .table-scroll > table :is(th,td) { min-width: ${globalToken.space[24]}; padding: ${token.space["stack-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
.crab-docs-prose > .table-scroll > table th { background: var(--crab-docs-code-background); font-weight: ${token.font.weight.heading}; }
.crab-docs-prose > .table-scroll > table a { color: ${token.color.text.link}; text-decoration: underline; }
.crab-docs-prose > .table-scroll > table code { white-space: normal; overflow-wrap: anywhere; }
.crab-docs-layout[data-design="true"] .crab-docs-inline-toc :is(summary,a) { min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
.crab-docs-layout[data-design="true"] .crab-docs-inline-toc a { height: auto; white-space: normal; text-align: left; }
.crab-docs-navigation section { margin-bottom: calc(${token.space["section-gap"]} * 2); }
.crab-docs-navigation h2 { margin: 0 0 ${token.space["stack-gap"]}; padding-inline: ${token.space["stack-gap"]}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.strong}; letter-spacing: .04em; color: ${token.color.text.secondary}; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) { display: flex; width: 100%; justify-content: flex-start; text-align: left; white-space: normal; height: auto; min-height: 2.5rem; padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; font-size: ${token.font.size.body}; line-height: 1.5; border-radius: ${token.radius.md}; color: ${token.color.text.secondary}; background: transparent; box-shadow: none; gap: ${token.space["stack-gap"]}; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle):hover { color: ${token.color.text.primary}; background: var(--crab-docs-nav-hover); box-shadow: none; }
.crab-docs-navigation .crab-docs-section-toggle { justify-content: space-between; color: ${token.color.text.primary}; font-weight: ${token.font.weight.label}; }
.crab-docs-nav-section + .crab-docs-nav-section { margin-top: ${token.space["inline-gap"]}; }
.crab-docs-section-chevron { display: block; width: 1rem; height: 1rem; flex: none; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; color: ${token.color.text.secondary}; transition: transform ${token.motion.interaction}; }
.crab-docs-section-toggle[aria-expanded="true"] .crab-docs-section-chevron, .crab-docs-inline-toc[open] .crab-docs-section-chevron { transform: rotate(90deg); }
.crab-docs-section-pages { display: grid; gap: ${token.space["inline-gap"]}; margin: ${token.space["inline-gap"]} 0 ${token.space["stack-gap"]} ${token.space["stack-gap"]}; padding-left: ${token.space["stack-gap"]}; border-left: 1px solid ${token.color.border.subtle}; }
.crab-docs-section-collapse { display: grid; grid-template-rows: 0fr; transition: grid-template-rows ${token.motion.fade}; }
.crab-docs-section-collapse[data-expanded="true"] { grid-template-rows: 1fr; }
.crab-docs-section-clip { min-height: 0; overflow: hidden; }
.crab-docs-section-clip .crab-docs-section-pages { margin-right: ${token.space["inline-gap"]}; }
.crab-docs-navigation .crab-docs-nav-page[aria-current="page"], .crab-docs-navigation .crab-docs-nav-page[aria-current="page"]:hover { font-weight: ${token.font.weight.heading}; color: ${token.color.selection.foreground}; background: var(--crab-docs-nav-selected); box-shadow: none; }
.crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle):focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }
.crab-docs-toc a { display: flex; width: 100%; justify-content: flex-start; text-align: left; white-space: normal; height: auto; min-height: 2.5rem; line-height: 1.5; padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; color: ${token.color.text.secondary}; }
.crab-docs-toc a:hover { background: var(--crab-docs-nav-hover); color: ${token.color.text.primary}; }
.crab-docs-toc a[aria-current="location"], [aria-label="本课步骤目录"] [aria-current="step"] { font-weight: ${token.font.weight.heading}; color: ${token.color.selection.foreground}; background: var(--crab-docs-nav-selected); box-shadow: none; }
.crab-docs-toc { display: grid; gap: ${token.space["component-gap"]}; font-size: ${token.font.size.body}; }
.crab-docs-toc strong { margin-bottom: ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; color: ${token.color.text.secondary}; }
.crab-docs-toc[data-variant="mobile"] { display: none; }
.crab-docs-page-heading { display: grid; gap: ${token["space"]["stack-gap"]}; margin-bottom: calc(${token["space"]["group-gap"]} * 1.5); }
.crab-docs-page-heading h1 { font-size: calc(${token["font"]["size"]["heading"]} * 2); font-weight: ${token.font.weight.heading}; line-height: 1.25; letter-spacing: -.03em; }
.crab-docs-page-heading > * { margin: 0; }
.crab-docs-page-heading > p { color: ${token["color"]["text"]["secondary"]}; }
.crab-docs-muted { color: ${token["color"]["text"]["secondary"]}; font-size: ${token["font"]["size"]["caption"]}; }
.crab-docs-prose > h1:first-child { display: none; }
.crab-docs-prose > h2 { margin: calc(${token["space"]["group-gap"]} * 1.5) 0 ${token["space"]["section-gap"]}; font-size: calc(${token["font"]["size"]["heading"]} * 1.25); }
.crab-docs-prose > h3 { margin-top: ${token["space"]["group-gap"]}; font-size: ${token["font"]["size"]["heading"]}; }
.crab-docs-prose > :is(h2,h3,h4) { font-weight: ${token.font.weight.heading}; line-height: 1.4; }
.crab-docs-prose > :is(p,ul,ol) code { padding: ${globalToken.space["0-5"]} ${token.space["inline-gap"]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.sm}; background: var(--crab-docs-code-background); font-family: ${globalToken.font.family.mono}; font-size: .875em; overflow-wrap: anywhere; }
.crab-docs-prose > p { max-width: 72ch; margin: ${token["space"]["stack-gap"]} 0; }
.crab-docs-prose > :is(p, ul, ol, blockquote), .crab-docs-prose > details > :is(p, ul, ol) { overflow-wrap: anywhere; }
.crab-docs-prose > p a, .crab-docs-prose > ul a { text-decoration: underline; text-underline-offset: .2em; }
.crab-docs-prose > table { width: 100%; display: block; overflow-x: auto; border-collapse: collapse; }
.crab-docs-prose > table :is(th,td) { border-bottom: 1px solid ${token["color"]["fill"]["default"]}; padding: ${token["space"]["stack-gap"]}; text-align: left; }
.crab-docs-prose > details, .crab-docs-api > details { border: 1px solid ${token["color"]["fill"]["default"]}; border-radius: ${token["radius"]["md"]}; padding: ${token["space"]["section-gap"]}; margin-block: ${token["space"]["section-gap"]}; }
.crab-docs summary { cursor: pointer; font-weight: ${token["font"]["weight"]["strong"]}; }
.crab-docs-prose > :is(h2,h3,h4), .crab-docs-page [id] { scroll-margin-top: 9rem; }
.crab-docs-pager { display: flex; justify-content: space-between; flex-wrap: wrap; gap: ${token["space"]["section-gap"]}; margin-top: calc(${token["space"]["group-gap"]} * 2); border-top: 1px solid ${token["color"]["fill"]["default"]}; padding-top: ${token["space"]["section-gap"]}; }
.crab-docs-pager a { white-space: normal; }
.crab-docs-code { min-width: 0; max-width: 100%; margin: ${token.space["section-gap"]} 0; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.lg}; overflow: hidden; background: var(--crab-docs-code-background); }
.crab-docs-code figcaption { display: flex; align-items: center; justify-content: space-between; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
.crab-docs-code pre { margin: 0; padding: ${token.space["section-gap"]}; max-width: 100%; overflow-x: auto; tab-size: 4; white-space: pre; font-size: ${token.font.size.body}; line-height: 1.75; font-weight: ${token.font.weight.body}; }
.crab-docs-code code { display: block; font-family: ${globalToken.font.family.mono}; }
.crab-docs-code-line { display: block; min-height: 1.75em; }
.crab-docs-code p { padding-inline: ${token["space"]["section-gap"]}; }
.crab-docs-api { min-width: 0; }
.crab-docs-api-filter { width: 100%; max-width: calc(${globalToken.space[24]} * 4); }
.crab-docs-api { font-size: ${token.font.size.body}; line-height: 1.65; }
.crab-docs-api-heading > strong { font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
.crab-docs-api-heading > span { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-variant-numeric: tabular-nums; }
.crab-docs-api-heading { display: flex; flex-wrap: wrap; gap: ${token["space"]["section-gap"]}; justify-content: space-between; margin-bottom: ${token["space"]["section-gap"]}; }
.crab-docs-properties { margin: ${token["space"]["section-gap"]} 0; }
.crab-docs-properties > div { display: grid; grid-template-columns: minmax(8rem, 1fr) minmax(0, 3fr); gap: ${token["space"]["section-gap"]}; border-top: 1px solid ${token["color"]["fill"]["default"]}; padding-block: ${token["space"]["section-gap"]}; }
.crab-docs-properties dt { display: flex; align-items: start; flex-wrap: wrap; gap: ${token["space"]["component-gap"]}; font-weight: ${token["font"]["weight"]["strong"]}; overflow-wrap: anywhere; }
.crab-docs-properties dt span { font-size: ${token["font"]["size"]["caption"]}; border: 1px solid ${token["color"]["fill"]["default"]}; border-radius: ${token["radius"]["sm"]}; padding-inline: ${token["space"]["inline-gap"]}; }
.crab-docs-properties dt { font-weight: ${token.font.weight.heading}; }
.crab-docs-properties dt span { font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; }
.crab-docs-properties [data-kind="deprecated"] { color: ${token.color.feedback.warning.text}; background: ${token.color.feedback.warning.background}; }
.crab-docs-properties code { font-family: ${globalToken.font.family.mono}; font-size: ${token.font.size.body}; }
.crab-docs-properties dd > code { color: ${token.color.text.secondary}; }
.crab-docs-properties dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
.crab-docs-properties dd > code { display: block; overflow-x: auto; white-space: pre; padding-bottom: ${token["space"]["inline-gap"]}; }
.crab-docs-properties dd p { margin: ${token["space"]["component-gap"]} 0; }
.crab-docs-dialog { min-width: 0 !important; width: min(40rem, calc(100vw - 2rem)); max-width: calc(100vw - 2rem); }
.crab-docs-dialog > div { min-width: 0; max-width: 100%; }
.crab-docs-search-dialog { --dialog-top: clamp(${globalToken.space[4]}, 8dvh, ${globalToken.space[20]}); --dialog-padding: ${token.space["dialog-padding"]}; --dialog-heading-margin-bottom: ${token.space["section-gap"]}; --dialog-footer-margin-top: ${token.space["section-gap"]}; width: min(42rem, calc(100vw - 2rem)); }
.crab-docs-search-dialog button { min-height: 2.75rem; }
.crab-docs-search { display: flex; flex-direction: column; min-height: 0; height: min(30rem, calc(100dvh - 15rem)); }
.crab-docs-mobile-drawer { width: 100vw; max-width: none; background: transparent; --drawer-background-color: ${token.color.background.elevated}; --drawer-close-size: calc(${globalToken.space[10]} + ${globalToken.space[1]}); --token-semantic-color-border-default: ${token.color.border.subtle}; }
.crab-docs-search-field { flex: none; padding-inline: ${token.space["control-padding-x"]}; border: 1px solid ${token.color.border.default}; border-radius: ${token.radius.md}; background: var(--crab-docs-nav-hover); }
.crab-docs-search-field:focus-within { border-color: transparent; outline: 2px solid ${token.color.focus.ring}; outline-offset: 1px; }
/* The host provides the single focus ring for the borderless public LineEdit. */
.crab-docs-search-field input:focus-visible { outline: none; }
.crab-docs-search-input { width: 100%; min-height: ${globalToken.space[12]}; font-size: ${token.font.size.subhead}; line-height: 1.5; }
.crab-docs-search-icon { display: block; width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; color: ${token.color.text.secondary}; }
.crab-docs-search-field .crab-docs-search-clear { width: 2.75rem; height: 2.75rem; padding: 0; }
.crab-docs-search-meta { display: flex; justify-content: space-between; gap: ${token.space["stack-gap"]}; padding: ${token.space["section-gap"]} ${token.space["inline-gap"]} ${token.space["component-gap"]}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; flex: none; }
.crab-docs-search-scroll { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; padding: ${token.space["inline-gap"]}; }
.crab-docs-search-pending { display: flex; justify-content: center; align-items: center; gap: ${token.space["stack-gap"]}; min-height: ${globalToken.space[24]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-docs-results { display: grid; gap: ${token.space["inline-gap"]}; list-style: none; padding: 0; margin: 0; }
.crab-docs-results button { display: block; position: relative; width: 100%; height: auto; min-height: ${globalToken.space[20]}; border: 1px solid transparent; border-radius: ${token.radius.md}; color: ${token.color.text.primary}; background: transparent; box-shadow: none; white-space: normal; text-align: left; padding: ${token.space["stack-gap"]} ${globalToken.space[10]} ${token.space["stack-gap"]} ${token.space["stack-gap"]}; line-height: 1.5; }
.crab-docs-results button > span { display: block; min-width: 0; }
.crab-docs-results .crab-docs-result-heading { display: flex; align-items: baseline; gap: ${token.space["stack-gap"]}; }
.crab-docs-results strong { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-width: 0; flex: 1; font-size: ${token.font.size.body}; font-weight: ${token.font.weight.strong}; line-height: 1.5; overflow-wrap: anywhere; }
.crab-docs-result-kind { flex: none; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; }
.crab-docs-result-detail { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.5; margin-top: ${token.space["inline-gap"]}; overflow-wrap: anywhere; }
.crab-docs-result-source { display: block; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; line-height: 1.5; margin-top: ${token.space["inline-gap"]}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.crab-docs-result-enter { position: absolute; right: ${token.space["stack-gap"]}; top: 50%; transform: translateY(-50%); color: ${token.color.text.link}; visibility: hidden; font-size: ${token.font.size.subhead}; }
.crab-docs-results button:hover { background: var(--crab-docs-nav-hover); box-shadow: none; }
.crab-docs-results button[aria-selected="true"] { background: var(--crab-docs-nav-selected); box-shadow: none; }
.crab-docs-results button[aria-selected="true"] strong { color: ${token.color.selection.foreground}; }
.crab-docs-results [aria-selected="true"] .crab-docs-result-enter { visibility: visible; }
.crab-docs-search-help { display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["section-gap"]}; padding-top: ${token.space["stack-gap"]}; margin-top: ${token.space["component-gap"]}; border-top: 1px solid ${token.color.border.subtle}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; flex: none; }
.crab-docs-search-help kbd { display: inline-flex; justify-content: center; min-width: ${globalToken.space[5]}; padding-inline: ${token.space["inline-gap"]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.sm}; font: inherit; line-height: 1.5; }
@media (max-width: 767px) {
    .crab-docs-search-dialog { --dialog-padding: ${globalToken.space[4]}; }
    .crab-docs-search-help { gap: ${token.space["component-gap"]}; }
    .crab-docs-result-heading { flex-wrap: wrap; }
}
.crab-docs-state { display: grid; justify-items: start; gap: ${token["space"]["section-gap"]}; padding: ${token["space"]["page-padding"]}; }
.crab-docs-demo { margin-block: ${token["space"]["group-gap"]}; min-width: 0; }
.crab-docs-demo-viewport { min-width: 0; max-width: 100%; overflow-x: auto; margin-inline: auto; }
.crab-docs-demo-viewport[data-viewport="tablet"] { width: 768px; }
.crab-docs-demo-viewport[data-viewport="mobile"] { width: 390px; }
.crab-docs-demo-viewport[data-padding="default"] { padding: ${token.space["section-gap"]}; }
.crab-docs-demo-viewport[data-background="transparent"] { background: transparent; }
.crab-docs-demo-viewport[data-background="light"] { background: ${token.color.background.surface}; }
.crab-docs-demo-viewport[data-background="dark"] { background: ${token.color.background.inverse}; }
.crab-docs-demo > .crab-docs-actions { margin-top: ${token["space"]["section-gap"]}; }
.crab-docs-fullscreen { width: calc(100vw - 2rem); }
.crab-docs-inline-toc, .crab-docs-menu-trigger { display: none; }
.crab-docs-layout[data-home="true"] .crab-docs-grid { grid-template-columns: minmax(0,1fr); max-width: 86rem; }
.crab-docs-layout[data-home="true"] :is(.crab-docs-sidebar,.crab-docs-directory) { display: none; }
[data-tutorial] { container-type: inline-size; }
[data-tutorial] :is(section,article,figure) { min-width: 0; }
[data-tutorial] pre { tab-size: 4; }
[data-crab-preview="true"] { box-sizing: border-box; min-width: 0; width: 100%; padding: ${token["space"]["section-gap"]}; }
@media (max-width: 1279px) {
    .crab-docs-grid { grid-template-columns: 14rem minmax(0, 1fr); }
    .crab-docs-layout[data-design="true"] .crab-docs-grid { grid-template-columns: 14rem minmax(0, 1fr); }
    .crab-docs-directory { display: none; }
    .crab-docs-inline-toc { display: block; margin-bottom: ${token["space"]["section-gap"]}; }
    .crab-docs-inline-toc { padding-block: ${token.space["component-gap"]}; border-block: 1px solid ${token.color.border.subtle}; font-size: ${token.font.size.body}; }
    .crab-docs-inline-toc summary { display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; list-style: none; color: ${token.color.text.secondary}; }
    .crab-docs-inline-toc summary::-webkit-details-marker { display: none; }
    .crab-docs-inline-toc nav { display: grid; justify-items: start; }
}
@media (max-width: 767px) {
    .crab-docs-header { flex-wrap: nowrap; gap: ${token.space["component-gap"]}; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; }
    .crab-docs-layout[data-home="true"] .crab-docs-header { padding-inline: ${token.space["section-gap"]}; }
    .crab-docs-header-links, .crab-docs-sidebar, .crab-docs-header kbd, .crab-docs-search-label, .crab-docs-search-short, .crab-docs-menu-label { display: none; }
    .crab-docs-header .crab-docs-brand { padding: 0; gap: ${token.space["component-gap"]}; font-size: ${token.font.size.subhead}; flex: none; min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
    .crab-docs-header-tools { gap: 0; flex-wrap: nowrap; margin-left: auto; }
    .crab-docs-header :is(.crab-docs-search-trigger, .crab-docs-menu-trigger, .crab-docs-theme-trigger) { width: calc(${globalToken.space[10]} + ${globalToken.space[1]}); height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); padding: 0; gap: 0; }
    .crab-docs-theme-switch { width: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
    .crab-docs-menu-trigger { display: inline-flex; }
    .crab-docs-grid { grid-template-columns: minmax(0,1fr); }
    .crab-docs-layout[data-design="true"] .crab-docs-grid { grid-template-columns: minmax(0,1fr); }
    .crab-docs-prose > :is(h2,h3,h4), .crab-docs-page [id] { scroll-margin-top: ${globalToken.space[24]}; }
    .crab-docs-page { padding: ${token["space"]["page-padding"]} ${token["space"]["section-gap"]}; }
    .crab-docs-page-heading h1 { font-size: calc(${token["font"]["size"]["heading"]} * 1.6); }
    .crab-docs-properties > div { grid-template-columns: minmax(0,1fr); gap: ${token["space"]["component-gap"]}; }
    .crab-docs-mobile-primary { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; padding-bottom: ${token.space["group-gap"]}; }
    .crab-docs-mobile-primary a { min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
    .crab-docs-mobile-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) { min-height: 2.75rem; }
}
@media (pointer: coarse) {
    .crab-docs-header :is(button, a) { min-height: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
    .crab-docs-theme-switch { width: calc(${globalToken.space[10]} + ${globalToken.space[1]}); }
}
@media (prefers-reduced-motion: reduce) {
    .crab-docs *, .crab-docs-dialog *, .crab-docs *::before, .crab-docs *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
@media (forced-colors: active) {
    /* System colors suppress box shadows; retain an explicit keyboard outline in previews too. */
    .crab-docs :focus-visible, .crab-docs-dialog :focus-visible, .crab-docs [aria-current], .crab-docs [aria-pressed="true"] { outline: 2px solid Highlight; }
    .crab-docs-code, .crab-docs-properties > div, .crab-docs-topbar { border-color: CanvasText; }
}
`;
