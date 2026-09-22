import { defineTokens, globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// M3 website shell metrics, distinct from the in-product display type scale.
// Reference: https://m3.material.io/components/radio-button/overview
const docs = defineTokens({
    rail: "88px", drawer: "240px", max: "1760px", article: "1200px", artwork: "480px", hero: "544px", outline: "176px",
    display: "88px", displayLine: "1.090909", compactDisplay: "56px",
});

globalStyle`
.crab-docs-layout { padding-inline-start: ${docs.rail}; }
.crab-docs-layout[data-navigation-open="true"] { padding-inline-start: calc(${docs.rail} + ${docs.drawer}); }
.crab-docs-layout .crab-docs-topbar { position: fixed; inset: 0 auto 0 0; width: ${docs.rail}; z-index: 30; background: ${token.color.surface.container}; }
.crab-docs-layout .crab-docs-header.crab-docs-rail { display: flex; flex-direction: column; flex-wrap: nowrap; width: 100%; height: 100dvh; gap: ${token.space["component-gap"]}; padding: ${globalToken.space[5]} ${token.space["component-gap"]}; overflow-y: auto; scrollbar-width: thin; }
.crab-docs-header .crab-docs-rail-search { flex: none; width: ${token.size[56]}; height: ${token.size[56]}; min-height: ${token.size[56]}; padding: 0; margin-bottom: ${token.space["component-gap"]}; border-radius: ${token.shape.large}; background: ${token.color.tertiary.container}; color: ${token.color.tertiary["on-container"]}; }
.crab-docs-layout .crab-docs-header-links { display: flex; flex-direction: column; gap: ${token.space["component-gap"]}; width: 100%; }
.crab-docs-header :is(.crab-docs-brand,.crab-docs-rail-item) { display: flex; flex-direction: column; justify-content: center; flex: none; width: 100%; height: ${globalToken.size[64]}; min-height: ${globalToken.size[64]}; gap: ${token.space["inline-gap"]}; padding: 0; border-radius: ${token.shape.large}; color: ${token.color.text.secondary}; font-size: ${token.typography.label.medium["font-size"]}; line-height: ${token.typography.label.medium["line-height"]}; font-weight: ${token.font.weight.label}; letter-spacing: 0; background: transparent; }
.crab-docs-header :is(.crab-docs-brand,.crab-docs-rail-item) > span { display: contents; }
.crab-docs-header .crab-docs-rail-indicator { display: grid; place-items: center; width: ${token.size[56]}; height: ${globalToken.space[8]}; border-radius: ${token.shape.full}; transition: background ${token.motion.interaction}; }
.crab-docs-site-icon { display: block; flex: none; width: ${globalToken.space[6]}; height: ${globalToken.space[6]}; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.crab-docs-header .crab-docs-brand-mobile { display: none; }
.crab-docs-header :is(.crab-docs-brand,.crab-docs-rail-item):hover { background: transparent; }
.crab-docs-header :is(.crab-docs-brand,.crab-docs-rail-item):hover .crab-docs-rail-indicator { background: ${token.color.background["hover-subtle"]}; }
.crab-docs-layout[data-home="true"] .crab-docs-brand .crab-docs-rail-indicator,
.crab-docs-rail-item[data-active="true"] .crab-docs-rail-indicator { background: ${token.color.secondary.container}; color: ${token.color.secondary["on-container"]}; }
.crab-docs-rail-item[data-active="true"] .crab-docs-site-icon { stroke-width: 2.5; }
.crab-docs-header :is(.crab-docs-brand,.crab-docs-rail-item):active .crab-docs-rail-indicator { background: ${token.color.background["active-subtle"]}; }
.crab-docs-layout .crab-docs-header-tools { display: flex; flex-direction: column; margin: auto 0 0; padding-top: ${token.space["group-gap"]}; flex: none; gap: ${token.space["component-gap"]}; }
.crab-docs-header .crab-docs-theme-trigger { border: ${globalToken.space.px} solid ${token.color.border.default}; }
.crab-docs-header .crab-docs-theme-anchor { left: 0; right: auto; width: ${token.size[48]}; }
.crab-docs-layout .crab-docs-menu-trigger { display: none; }
.crab-docs-layout .crab-docs-grid,
.crab-docs-layout:is([data-home="true"],[data-catalog="true"]) .crab-docs-grid { display: block; max-width: ${docs.max}; margin-inline: auto; }
.crab-docs-layout .crab-docs-sidebar { display: none; position: fixed; inset: 0 auto 0 ${docs.rail}; width: ${docs.drawer}; height: 100dvh; max-height: none; align-self: stretch; padding: 0; overflow: hidden; z-index: 25; background: ${token.color.surface.container}; border-radius: 0 ${globalToken.space[6]} ${globalToken.space[6]} 0; border: 0; box-shadow: none; }
.crab-docs-layout[data-navigation-open="true"] .crab-docs-sidebar { display: flex; flex-direction: column; }
.crab-docs-sidebar-heading { display: flex; flex: none; align-items: center; justify-content: space-between; gap: ${token.space["component-gap"]}; padding: ${globalToken.space[5]} ${token.space["stack-gap"]} ${token.space["stack-gap"]} ${token.space["group-gap"]}; }
.crab-docs-sidebar-heading h2 { margin: 0; font-size: ${token.typography.title.medium["font-size"]}; line-height: ${token.typography.title.medium["line-height"]}; font-weight: ${token.font.weight.label}; }
.crab-docs-sidebar-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; padding: 0 ${token.space["stack-gap"]} ${token.space["section-gap"]}; }
.crab-docs-sidebar .crab-docs-nav-section + .crab-docs-nav-section { border: 0; padding: 0; }
.crab-docs-sidebar .crab-docs-section-pages { padding-inline-start: ${token.space["stack-gap"]}; }
.crab-docs-navigation .crab-docs-nav-page { height: ${token.size[48]}; min-height: ${token.size[48]}; white-space: nowrap; padding-block: 0; }
.crab-docs-navigation .crab-docs-nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.crab-docs-layout .crab-docs-directory { display: none; }
.crab-docs-content { container-type: inline-size; }
.crab-docs-layout .crab-docs-page { min-height: 100dvh; padding: ${globalToken.space[2]}; border-radius: 0; background: transparent; }
.crab-docs-page-hero { display: grid; grid-template-columns: minmax(0,1fr); gap: ${globalToken.space[2]}; margin-bottom: ${globalToken.space[2]}; }
.crab-docs-layout .crab-docs-page-heading { display: grid; grid-template-columns: minmax(0,1fr); padding: calc(${globalToken.space[12]} + ${globalToken.space[2]}); border-radius: ${globalToken.space[6]}; background: ${token.color.surface.low}; gap: ${globalToken.space[4]}; margin: 0; }
.crab-docs-layout .crab-docs-page-heading h1 { margin: 0; font-size: ${docs.display}; line-height: ${docs.displayLine}; font-weight: ${token.typography.display.large["font-weight"]}; letter-spacing: -.025em; text-wrap: balance; overflow-wrap: anywhere; }
.crab-docs-layout .crab-docs-page-heading > p { margin: 0; max-width: 64ch; font-size: ${token.typography.title.large["font-size"]}; line-height: 1.4; color: ${token.color.text.primary}; text-wrap: pretty; }
.crab-docs-page-heading .crab-docs-actions { display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["section-gap"]}; margin: ${globalToken.space[2]} 0 0; }
.crab-docs-package { font-family: ${globalToken.font.family.mono}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
/* M3 website order: title, visual, primary destinations, in-flow outline, article. */
.crab-docs-layout .crab-docs-page[data-reading="true"] { display: block; padding: ${globalToken.space[2]}; }
.crab-docs-page-main { min-width: 0; }
.crab-docs-component-artwork { display: grid; place-items: center; position: relative; isolation: isolate; overflow: hidden; width: 100%; aspect-ratio: 2 / 1; max-height: ${docs.artwork}; border-radius: ${globalToken.space[6]}; background: ${token.color.secondary.container}; }
.crab-docs-component-artwork::before,.crab-docs-component-artwork::after { content: ""; position: absolute; z-index: -1; width: 48%; aspect-ratio: 1; border-radius: ${token.shape.full}; }
.crab-docs-component-artwork::before { inset: -45% auto auto -8%; background: ${token.color.tertiary.container}; }
.crab-docs-component-artwork::after { inset: auto -8% -60% auto; background: ${token.color.brand.container}; }
.crab-docs-component-artwork .crab-catalog-preview { width: 66%; max-width: calc(${docs.artwork} + ${globalToken.space[20]} * 2); height: auto; }
.crab-docs-page-destinations { position: sticky; top: ${globalToken.space[2]}; z-index: 12; display: flex; margin-block: ${globalToken.space[2]}; border-radius: ${token.shape.full}; background: ${token.color.surface.low}; }
.crab-docs-page-destinations a { flex: 1 1 0; min-width: 0; height: ${globalToken.space[20]}; gap: ${token.space["component-gap"]}; padding-inline: ${token.space["section-gap"]}; border-radius: ${token.shape.full}; font-size: ${token.typography.body.large["font-size"]}; font-weight: ${token.font.weight.body}; color: ${token.color.text.primary}; }
.crab-docs-page-destinations a[aria-current="location"] { background: ${token.color.secondary.container}; color: ${token.color.secondary["on-container"]}; font-weight: ${token.font.weight.strong}; }
.crab-docs-reading-body { margin: ${globalToken.space[16]} auto 0; }
.crab-docs-page-outline { min-width: 0; max-width: ${docs.article}; margin: 0 auto ${globalToken.space[20]}; padding-inline: ${globalToken.space[20]}; }
.crab-docs-outline-label { margin: 0 0 ${globalToken.space[2]}; font-size: ${token.typography.label.large["font-size"]}; line-height: ${token.typography.label.large["line-height"]}; font-weight: ${token.font.weight.label}; color: ${token.color.text.secondary}; }
.crab-docs-outline-title { margin: 0 0 ${globalToken.space[4]}; font-size: ${token.typography.title.large["font-size"]}; line-height: ${token.typography.title.large["line-height"]}; overflow-wrap: anywhere; }
.crab-docs-page-sections { display: grid; justify-items: start; border-inline-start: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-page-sections a { display: flex; justify-content: start; width: auto; max-width: 100%; height: auto; min-height: ${token.size[48]}; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; border-radius: ${token.shape.full}; white-space: normal; text-align: left; color: ${token.color.text.link}; font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; font-weight: ${token.font.weight.body}; }
.crab-docs-page-sections a > span { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
.crab-docs-page-sections a[aria-current="location"] { font-weight: ${token.font.weight.strong}; text-decoration: underline; text-underline-offset: .25em; }
.crab-docs-page-sections a:focus-visible { outline-offset: -${globalToken.space[1]}; }
.crab-docs-page[data-reading="true"] .crab-docs-reading-body > .crab-docs-prose { min-width: 0; max-width: ${docs.article}; margin-inline: auto; padding: 0 ${globalToken.space[20]} ${globalToken.space[20]}; font-size: ${token.typography.body.large["font-size"]}; line-height: 1.75; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > p { max-width: none; margin-block: ${globalToken.space[4]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(ul,ol) { padding-inline-start: ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(h2,h3)[id] { scroll-margin-top: calc(${globalToken.space[24]} + ${globalToken.space[4]}); }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h2 { font-size: ${token.typography.display.small["font-size"]}; line-height: ${token.typography.display.small["line-height"]}; margin: ${globalToken.space[20]} 0 ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h2:first-child { margin-top: 0; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h1:first-child + h2,
.crab-docs-page[data-reading="true"] .crab-docs-prose > h1:first-child + [hidden] + h2 { margin-top: 0; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h3 { margin: ${globalToken.space[8]} 0 ${globalToken.space[3]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(.crab-docs-code,.table-scroll) { margin-block: ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll { border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.medium}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll > table { font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
.crab-docs-layout[data-catalog="true"] .crab-docs-prose { width: 100%; padding: ${globalToken.space[8]} ${globalToken.space[12]} ${globalToken.space[16]}; }
.crab-docs-layout .crab-docs-pager { border: 0; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); margin: 0; padding: 0; gap: ${globalToken.space[2]}; }
.crab-docs-layout .crab-docs-pager a { height: auto; min-height: ${globalToken.space[24]}; padding: ${token.space["group-gap"]} ${globalToken.space[8]}; border-radius: ${token.shape["extra-large"]}; background: ${token.color.surface.low}; justify-content: start; text-align: left; }
.crab-docs-pager a > span { display: grid; gap: ${token.space["component-gap"]}; min-width: 0; }
.crab-docs-pager-label { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-docs-pager strong { font-size: ${token.typography.title.large["font-size"]}; font-weight: ${token.typography.title.large["font-weight"]}; overflow-wrap: anywhere; }
.crab-docs-footer { position: relative; display: grid; grid-template-columns: minmax(0,2fr) minmax(0,1fr); gap: ${globalToken.space[12]}; padding: ${globalToken.space[12]} ${globalToken.space[8]}; margin-top: ${globalToken.space[12]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-footer strong { font-size: ${token.typography.headline.large["font-size"]}; font-weight: ${token.font.weight.body}; }
.crab-docs-footer p { max-width: 52ch; font-size: ${token.font.size.body}; line-height: ${token.typography.body.large["line-height"]}; }
.crab-docs-footer nav { display: grid; align-content: start; justify-items: start; }
.crab-docs-footer .crab-docs-back-top { position: absolute; right: ${globalToken.space[6]}; top: ${globalToken.space[4]}; width: ${token.size[48]}; height: ${token.size[48]}; padding: 0; }
.crab-docs-mobile-drawer [data-placement="left"] { width: min(${docs.drawer}, calc(100vw - ${globalToken.space[6]})); border-radius: 0 ${token.shape.large} ${token.shape.large} 0; }
.crab-docs-mobile-drawer [data-placement="left"] > div:last-child { padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; }
.crab-docs-reading-body[data-wide="true"] { display: grid; grid-template-columns: minmax(0,1fr) ${docs.outline}; align-items: start; gap: ${globalToken.space[12]}; max-width: calc(${docs.article} + ${globalToken.space[24]}); padding-inline: ${globalToken.space[6]}; margin-top: calc(${globalToken.space[24]} + ${globalToken.space[4]}); }
.crab-docs-page[data-reading="true"] .crab-docs-reading-body[data-wide="true"] > .crab-docs-prose { width: 100%; padding-inline: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-outline { position: sticky; top: calc(${globalToken.space[24]} + ${globalToken.space[4]}); max-height: calc(100dvh - ${globalToken.space[24]} - ${globalToken.space[8]}); overflow-y: auto; scrollbar-width: thin; margin: 0; padding: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-sections { border: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-sections a { font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.medium["line-height"]}; }
@container (min-width: 1200px) {
    .crab-docs-page-hero:has(.crab-docs-component-artwork) { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .crab-docs-page-hero:has(.crab-docs-component-artwork) .crab-docs-page-heading { min-height: ${docs.hero}; align-content: center; }
    .crab-docs-component-artwork { aspect-ratio: auto; height: 100%; max-height: none; }
    .crab-docs-component-artwork .crab-catalog-preview { width: 80%; }
}
@container (max-width: 999px) {
    .crab-docs-layout .crab-docs-page-heading { padding: ${globalToken.space[10]}; }
    .crab-docs-layout .crab-docs-page-heading h1 { font-size: ${docs.compactDisplay}; }
    .crab-docs-page-outline { padding-inline: ${globalToken.space[10]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-reading-body > .crab-docs-prose { padding-inline: ${globalToken.space[10]}; }
}
@media (max-width: 1023px) {
    .crab-docs-layout,.crab-docs-layout[data-navigation-open="true"] { padding-inline-start: 0; }
    .crab-docs-layout .crab-docs-topbar { position: sticky; inset: 0 0 auto; width: 100%; }
    .crab-docs-layout .crab-docs-header.crab-docs-rail { flex-direction: row; height: ${globalToken.size[64]}; min-height: ${globalToken.size[64]}; padding: ${token.space["component-gap"]}; gap: ${token.space["component-gap"]}; overflow: visible; }
    .crab-docs-layout .crab-docs-header-links,.crab-docs-layout .crab-docs-sidebar,
    .crab-docs-layout[data-navigation-open="true"] .crab-docs-sidebar { display: none; }
    .crab-docs-header .crab-docs-brand { width: auto; height: ${token.size[48]}; min-height: ${token.size[48]}; font-size: ${token.typography.title.large["font-size"]}; }
    .crab-docs-header .crab-docs-brand-desktop,.crab-docs-header .crab-docs-brand .crab-docs-rail-indicator { display: none; }
    .crab-docs-header .crab-docs-brand-mobile { display: inline; }
    .crab-docs-header .crab-docs-rail-search { width: ${token.size[48]}; height: ${token.size[48]}; min-height: ${token.size[48]}; margin: 0; background: transparent; }
    .crab-docs-layout .crab-docs-header-tools { flex-direction: row; padding: 0; margin: 0 0 0 auto; gap: 0; }
    .crab-docs-header .crab-docs-theme-trigger { border-color: transparent; }
    .crab-docs-header .crab-docs-theme-anchor { right: 0; left: auto; width: calc(${globalToken.space[24]} + ${globalToken.space[20]}); }
    .crab-docs-layout .crab-docs-menu-trigger { display: inline-flex; }
    .crab-docs-layout .crab-docs-page-heading { padding: ${globalToken.space[8]}; }
    .crab-docs-layout .crab-docs-page-heading h1 { font-size: ${docs.compactDisplay}; }
    .crab-docs-page-destinations { top: ${globalToken.size[64]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-prose > :is(h2,h3)[id] { scroll-margin-top: calc(${globalToken.size[64]} * 2 + ${globalToken.space[10]}); }
}
@media (max-width: 599px) {
    .crab-docs-layout .crab-docs-page-heading { padding: ${globalToken.space[8]} ${globalToken.space[6]}; gap: ${globalToken.space[4]}; }
    .crab-docs-layout .crab-docs-page-heading h1 { font-size: ${token.typography.display.small["font-size"]}; line-height: ${token.typography.display.small["line-height"]}; }
    .crab-docs-layout .crab-docs-page-heading > p { font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
    .crab-docs-layout .crab-docs-page[data-reading="true"] { padding: ${globalToken.space[2]}; }
    .crab-docs-layout .crab-docs-page[data-reading="true"] .crab-docs-page-heading { padding: ${globalToken.space[6]} ${globalToken.space[4]}; }
    .crab-docs-layout .crab-docs-page[data-reading="true"] .crab-docs-page-heading h1 { font-size: clamp(${token.typography.headline.medium["font-size"]},6vw,${token.typography.display.small["font-size"]}); line-height: 1.25; }
    .crab-docs-layout .crab-docs-page[data-reading="true"] .crab-docs-page-heading > p { font-size: ${token.typography.body.large["font-size"]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-reading-body > .crab-docs-prose,.crab-docs-layout[data-catalog="true"] .crab-docs-prose { padding-inline: ${globalToken.space[4]}; }
    .crab-docs-reading-body { margin-top: ${globalToken.space[10]}; }
    .crab-docs-page-outline { padding-inline: ${globalToken.space[4]}; margin-bottom: ${globalToken.space[10]}; }
    .crab-docs-page-destinations { border-radius: ${token.shape.large}; }
    .crab-docs-page-destinations a { height: ${globalToken.space[16]}; flex-direction: column; padding: ${globalToken.space[2]} ${globalToken.space[1]}; gap: ${globalToken.space[1]}; border-radius: ${token.shape.large}; font-size: ${token.typography.label.large["font-size"]}; }
    .crab-docs-page-destinations .crab-docs-site-icon { width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; }
    .crab-docs-component-artwork { border-radius: ${token.shape.large}; }
    .crab-docs-page[data-reading="true"] .crab-docs-prose > h2 { font-size: ${token.typography.headline.medium["font-size"]}; line-height: ${token.typography.headline.medium["line-height"]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll > table :is(th,td) { min-width: calc(${globalToken.space[20]} * 2); }
    .crab-docs-layout .crab-docs-pager { grid-template-columns: minmax(0,1fr); }
    .crab-docs-layout .crab-docs-pager a { padding: ${globalToken.space[6]}; }
    .crab-docs-footer { grid-template-columns: minmax(0,1fr); padding: ${globalToken.space[16]} ${globalToken.space[6]}; gap: ${globalToken.space[6]}; }
}
@media (forced-colors: active) {
    .crab-docs-layout .crab-docs-topbar,.crab-docs-layout .crab-docs-sidebar { border-inline-end: ${globalToken.space.px} solid CanvasText; }
    .crab-docs-page-heading,.crab-docs-pager a,.crab-docs-component-artwork,.crab-docs-page-destinations { border: ${globalToken.space.px} solid CanvasText; }
    .crab-docs-component-artwork::before,.crab-docs-component-artwork::after { display: none; }
    .crab-docs-page-sections a[aria-current],.crab-docs-page-destinations a[aria-current],.crab-docs-rail-item[data-active="true"] .crab-docs-rail-indicator { outline: ${globalToken.space["0-5"]} solid Highlight; outline-offset: -${globalToken.space[1]}; }
}
`;
