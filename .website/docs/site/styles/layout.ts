import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { docs } from "./metrics.js";

globalStyle`
.crab-docs-layout { padding-block-start: ${docs.header}; }
.crab-docs-layout[data-navigation-open="true"] { padding-inline-start: ${docs.drawer}; }
.crab-docs-layout .crab-docs-topbar { position: fixed; inset: 0 0 auto; height: ${docs.header}; z-index: 30; background: ${token.color.surface.canvas}; border-bottom: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-layout .crab-docs-header.crab-docs-rail { max-width: none; width: 100%; height: ${docs.header}; min-height: ${docs.header}; display: flex; flex-wrap: nowrap; gap: ${globalToken.space[6]}; padding: ${globalToken.space[2]} ${globalToken.space[6]}; }
.crab-docs-header .crab-docs-brand { display: flex; flex: none; padding: 0; gap: ${globalToken.space[2]}; color: ${token.color.text.primary}; font-size: ${token.typography.title.large["font-size"]}; font-weight: ${token.font.weight.strong}; }
.crab-docs-brand > span { display: flex; gap: ${globalToken.space[2]}; align-items: center; }
.crab-docs-header .crab-docs-rail-indicator { display: grid; place-items: center; flex: none; }
.crab-docs-brand .crab-docs-rail-indicator { padding: ${globalToken.space[2]}; border-radius: ${token.shape.control}; color: ${token.color.text["on-brand"]}; background: ${token.color.brand.primary}; }
.crab-docs-site-icon { display: block; width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; }
.crab-docs-layout .crab-docs-header-links { display: flex; flex: none; flex-wrap: nowrap; gap: ${globalToken.space[1]}; }
.crab-docs-header .crab-docs-rail-item { gap: ${globalToken.space[2]}; min-height: ${token.size[40]}; padding-inline: ${globalToken.space[3]}; font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; border-radius: ${token.shape.control}; }
.crab-docs-rail-item > span { display: flex; align-items: center; gap: ${globalToken.space[2]}; }
.crab-docs-rail-item[data-active="true"] { color: ${token.color.selection.foreground}; background: ${token.color.background.selected}; }
.crab-docs-header .crab-docs-rail-search { margin-inline-start: auto; min-width: 14rem; height: ${token.size[40]}; justify-content: start; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.control}; background: ${token.color.surface.content}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-docs-rail-search > span:not([aria-hidden="true"]) { display: flex; width: 100%; align-items: center; gap: ${globalToken.space[2]}; }
.crab-docs-search-hint { margin-inline-start: auto; }
.crab-docs-layout .crab-docs-header-tools { display: flex; flex: none; flex-wrap: nowrap; margin: 0; gap: ${globalToken.space[2]}; }
.crab-docs-layout .crab-docs-menu-trigger { display: none; }
.crab-docs-layout .crab-docs-grid, .crab-docs-layout:is([data-home="true"],[data-catalog="true"]) .crab-docs-grid { display: block; max-width: ${docs.max}; margin-inline: auto; }
.crab-docs-layout .crab-docs-sidebar { display: none; position: fixed; inset: ${docs.header} auto 0 0; width: ${docs.drawer}; height: calc(100dvh - ${docs.header}); max-height: none; align-self: stretch; padding: 0; overflow: hidden; z-index: 25; background: ${token.color.surface.canvas}; border-inline-end: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-layout[data-navigation-open="true"] .crab-docs-sidebar { display: flex; flex-direction: column; }
.crab-docs-sidebar-heading { padding: ${globalToken.space[6]} ${globalToken.space[5]} ${globalToken.space[3]}; }
.crab-docs-sidebar-heading h2 { margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.label.medium["font-size"]}; line-height: ${token.typography.label.medium["line-height"]}; font-weight: ${token.font.weight.label}; }
.crab-docs-sidebar-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; padding: 0 ${globalToken.space[3]} ${globalToken.space[6]}; }
.crab-docs-sidebar .crab-docs-nav-section + .crab-docs-nav-section { border: 0; }
.crab-docs-sidebar .crab-docs-nav-page, .crab-docs-sidebar .crab-docs-section-toggle { min-height: ${token.size[40]}; height: auto; padding: ${globalToken.space[2]} ${globalToken.space[3]}; border-radius: ${token.shape.control}; }
.crab-docs-sidebar .crab-docs-section-pages { padding-inline-start: ${globalToken.space[2]}; }
.crab-docs-layout .crab-docs-directory { display: none; }
.crab-docs-content { container-type: inline-size; }
.crab-docs-layout .crab-docs-page { min-height: calc(100dvh - ${docs.header}); padding: ${globalToken.space[6]}; border-radius: 0; background: ${token.color.surface.content}; }
.crab-docs-layout .crab-docs-page[data-reading="true"] { padding: ${globalToken.space[6]}; }
.crab-docs-layout[data-home="true"] .crab-docs-page { padding: ${globalToken.space[6]} ${globalToken.space[8]}; background: transparent; }
@media (max-width: 1279px) {
    .crab-docs-layout[data-navigation-open="true"] { padding-inline-start: 0; }
    .crab-docs-layout .crab-docs-header.crab-docs-rail { gap: ${globalToken.space[2]}; padding-inline: ${globalToken.space[4]}; }
    .crab-docs-layout .crab-docs-header-links, .crab-docs-layout[data-navigation-open="true"] .crab-docs-sidebar { display: none; }
    .crab-docs-header .crab-docs-rail-search { min-width: 0; width: ${token.size[40]}; padding: 0; justify-content: center; }
    .crab-docs-rail-search > span:not([aria-hidden="true"]) { justify-content: center; }
    .crab-docs-rail-search-label, .crab-docs-search-hint { display: none; }
    .crab-docs-layout .crab-docs-menu-trigger { display: inline-flex; }
    .crab-docs-reading-body[data-wide="true"] { display: block; }
    .crab-docs-reading-body[data-wide="true"] .crab-docs-page-outline { position: static; max-height: none; margin-block-end: ${globalToken.space[4]}; }
}
@media (max-width: 599px) {
    .crab-docs-layout .crab-docs-page, .crab-docs-layout .crab-docs-page[data-reading="true"] { padding: ${globalToken.space[3]}; }
    .crab-docs-layout[data-home="true"] .crab-docs-page { padding: ${globalToken.space[4]}; }
}
@media (max-width: 359px) {
    .crab-docs-layout .crab-docs-header.crab-docs-rail { gap: ${globalToken.space[1]}; padding-inline: ${globalToken.space[2]}; }
    .crab-docs-layout .crab-docs-header-tools { gap: 0; }
}
@media (pointer: coarse) {
    .crab-docs-sidebar .crab-docs-nav-page, .crab-docs-sidebar .crab-docs-section-toggle { min-height: ${token.size["touch-target"]}; }
}
`;
