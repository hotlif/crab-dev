import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
@media (max-width: 1279px) {
    .crab-docs-grid { grid-template-columns: 17rem minmax(0, 1fr); }
    .crab-docs-directory { display: none; }
    .crab-docs-inline-toc { display: block; margin-bottom: ${token["space"]["section-gap"]}; }
    .crab-docs-inline-toc { padding-block: ${token.space["component-gap"]}; border-block: 1px solid ${token.color.border.subtle}; font-size: ${token.font.size.body}; }
    .crab-docs-inline-toc summary { display: flex; align-items: center; justify-content: space-between; min-height: 2.5rem; list-style: none; color: ${token.color.text.secondary}; }
    .crab-docs-inline-toc summary::-webkit-details-marker { display: none; }
    .crab-docs-inline-toc nav { display: grid; justify-items: start; }
}
@media (max-width: 1023px) {
    .crab-docs-header { flex-wrap: nowrap; gap: ${token.space["component-gap"]}; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; }
    .crab-docs-layout[data-home="true"] .crab-docs-header { padding-inline: ${token.space["section-gap"]}; }
    .crab-docs-header-links, .crab-docs-sidebar, .crab-docs-header kbd, .crab-docs-search-label, .crab-docs-search-short, .crab-docs-menu-label { display: none; }
    .crab-docs-header .crab-docs-brand { padding: 0; gap: ${token.space["component-gap"]}; font-size: ${token.font.size.subhead}; flex: none; min-height: ${token.size.control}; }
    .crab-docs-header-tools { gap: 0; flex-wrap: nowrap; margin-left: auto; }
    .crab-docs-header :is(.crab-docs-search-trigger, .crab-docs-menu-trigger, .crab-docs-theme-trigger) { min-width: 0; width: ${token.size.control}; height: ${token.size.control}; padding: 0; gap: 0; }
    .crab-docs-theme-switch { width: ${token.size.control}; }
    .crab-docs-menu-trigger { display: inline-flex; }
    .crab-docs-grid { grid-template-columns: minmax(0,1fr); }
    .crab-docs-prose > :is(h2,h3,h4), .crab-docs-page [id] { scroll-margin-top: ${globalToken.space[24]}; }
    .crab-docs-page { padding: ${token.space["group-gap"]} ${token.space["section-gap"]}; }
    .crab-docs-page-heading h1 { font-size: ${token.typography.headline.large["font-size"]}; line-height: ${token.typography.headline.large["line-height"]}; }
    .crab-docs-properties > div { grid-template-columns: minmax(0,1fr); gap: ${token["space"]["component-gap"]}; }
    .crab-docs-mobile-primary { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; padding-bottom: ${token.space["group-gap"]}; }
    .crab-docs-mobile-primary a { min-height: ${token.size.control}; }
    .crab-docs-mobile-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle) { min-height: ${token.size.control}; }
}
@media (pointer: coarse) {
    .crab-docs-header :is(button, a) { min-height: ${token.size['touch-target']}; }
    .crab-docs-theme-switch { width: ${token.size['touch-target']}; }
    .crab-docs-header :is(.crab-docs-rail-search, .crab-docs-menu-trigger, .crab-docs-theme-trigger) { min-width: ${token.size['touch-target']}; }
    .crab-docs-navigation :is(.crab-docs-nav-page, .crab-docs-section-toggle), .crab-docs-theme-options button { min-height: ${token.size['touch-target']}; }
}
@media (prefers-reduced-motion: reduce) {
    .crab-docs *, .crab-docs-dialog * { scroll-behavior: auto; }
    .crab-docs-section-collapse, .crab-docs-section-chevron,
    .crab-docs-outline-toggle svg { transition: none; }
}
@media (forced-colors: active) {
    /* System colors suppress box shadows; retain an explicit keyboard outline in previews too. */
    .crab-docs :focus-visible, .crab-docs-dialog :focus-visible, .crab-docs [aria-current], .crab-docs [aria-pressed="true"] { outline: 2px solid Highlight; }
    .crab-docs-code, .crab-docs-properties > div, .crab-docs-topbar { border-color: CanvasText; }
}
`;
