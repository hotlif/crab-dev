import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { docs } from "./metrics.js";

globalStyle`
.crab-docs-page-hero { display: grid; grid-template-columns: minmax(0,1fr); gap: ${token.space["stack-gap"]}; margin-bottom: ${token.space["stack-gap"]}; }
.crab-docs-layout .crab-docs-page-heading { display: grid; grid-template-columns: minmax(0,1fr); padding: ${globalToken.space[8]} ${globalToken.space[6]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.low}; gap: ${globalToken.space[3]}; margin: 0 0 ${globalToken.space[4]}; }
.crab-docs-layout .crab-docs-page-heading h1 { margin: 0; font-size: ${token.typography.headline.large["font-size"]}; line-height: ${token.typography.headline.large["line-height"]}; font-weight: ${token.typography.headline.large["font-weight"]}; letter-spacing: normal; text-wrap: balance; overflow-wrap: anywhere; }
.crab-docs-layout .crab-docs-page-heading > p { margin: 0; max-width: 64ch; font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; color: ${token.color.text.secondary}; text-wrap: pretty; }
.crab-docs-page-heading .crab-docs-actions { display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["section-gap"]}; margin: ${globalToken.space[2]} 0 0; }
.crab-docs-package { font-family: ${globalToken.font.family.mono}; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
/* A single chapter outline sits beside the article or collapses above it. */
.crab-docs-layout .crab-docs-page[data-reading="true"] { display: block; padding: ${globalToken.space[2]}; }
.crab-docs-page-main { min-width: 0; }
.crab-docs-component-artwork { display: grid; place-items: center; overflow: hidden; width: 100%; height: calc(${globalToken.space[24]} + ${globalToken.space[6]}); border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.low}; }
.crab-docs-component-artwork .crab-catalog-preview { width: auto; max-width: 100%; min-width: 0; min-height: 0; height: calc(${globalToken.space[24]} + ${globalToken.space[6]}); }
.crab-docs-component-artwork[data-live="true"] { display: block; height: auto; background: ${token.color.background.elevated}; }
.crab-docs-live-artwork-stage { width: var(--crab-docs-preview-width, 100%); max-width: 100%; margin-inline: auto; }
.crab-docs-reading-body { margin: ${globalToken.space[6]} auto 0; }
.crab-docs-page-outline { min-width: 0; max-width: ${docs.article}; margin: 0 auto ${globalToken.space[4]}; padding-inline: ${globalToken.space[6]}; }
.crab-docs-page-outline .crab-docs-outline-toggle { min-height: ${token.size.control}; }
.crab-docs-outline-toggle svg { width: ${globalToken.space[6]}; height: ${globalToken.space[6]}; fill: none; stroke: currentColor; stroke-width: 2; transition: transform ${token.motion.spatial.fast}; }
.crab-docs-outline-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
.crab-docs-outline-label { margin: 0 0 ${globalToken.space[3]}; padding-inline: ${globalToken.space[3]}; font-size: ${token.typography.label.large["font-size"]}; line-height: ${token.typography.label.large["line-height"]}; font-weight: ${token.font.weight.label}; color: ${token.color.text.secondary}; }
.crab-docs-page-sections { display: grid; justify-items: start; border-inline-start: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-page-sections a { display: flex; justify-content: start; width: auto; max-width: 100%; height: auto; min-height: ${token.size.control}; padding: ${token.space["component-gap"]} ${token.space["section-gap"]}; border-radius: ${token.shape.control}; white-space: normal; text-align: left; color: ${token.color.text.link}; font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; font-weight: ${token.font.weight.body}; }
.crab-docs-page-sections a > span { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
.crab-docs-page-sections a[aria-current="location"] { font-weight: ${token.font.weight.strong}; text-decoration: underline; text-underline-offset: .25em; }
.crab-docs-page-sections a:focus-visible { outline-offset: -${globalToken.space[1]}; }
.crab-docs-page[data-reading="true"] .crab-docs-reading-body > .crab-docs-prose { container: docs-article / inline-size; min-width: 0; max-width: ${docs.article}; margin-inline: auto; padding: 0 ${globalToken.space[6]} ${globalToken.space[8]}; font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(p,ul,ol,blockquote) { max-width: ${docs.measure}; margin-block: ${globalToken.space[4]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(ul,ol) { padding-inline-start: ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose :is(h2,h3,[data-docs-example-anchor])[id] { scroll-margin-top: calc(${docs.header} + ${globalToken.space[6]}); }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h2 { font-size: ${token.typography.headline.small["font-size"]}; line-height: ${token.typography.headline.small["line-height"]}; margin: ${globalToken.space[8]} 0 ${globalToken.space[4]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h2:first-child { margin-top: 0; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h1:first-child + h2,
.crab-docs-page[data-reading="true"] .crab-docs-prose > [data-docs-example-anchor] + h2,
.crab-docs-page[data-reading="true"] .crab-docs-prose > h1:first-child + [hidden] + h2 { margin-top: 0; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > h3 { margin: ${globalToken.space[8]} 0 ${globalToken.space[3]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > :is(.crab-docs-code,.table-scroll) { margin-block: ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll { border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; }
.crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll > table { font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
.crab-docs-layout[data-catalog="true"] .crab-docs-prose { width: 100%; padding: ${globalToken.space[6]} 0 ${globalToken.space[10]}; }
.crab-docs-layout .crab-docs-pager { border: 0; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); margin: 0; padding: 0; gap: ${globalToken.space[2]}; }
.crab-docs-layout .crab-docs-pager a { height: auto; min-height: ${globalToken.space[20]}; padding: ${token.space["section-gap"]} ${globalToken.space[6]}; border: ${globalToken.space.px} solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; justify-content: start; text-align: left; }
.crab-docs-pager a > span { display: grid; gap: ${token.space["component-gap"]}; min-width: 0; }
.crab-docs-pager-label { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-docs-pager strong { font-size: ${token.typography.title.large["font-size"]}; font-weight: ${token.typography.title.large["font-weight"]}; overflow-wrap: anywhere; }
.crab-docs-footer { position: relative; display: grid; grid-template-columns: minmax(0,2fr) minmax(0,1fr); gap: ${globalToken.space[8]}; padding: ${globalToken.space[8]} ${globalToken.space[6]}; margin-top: ${globalToken.space[8]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-docs-footer strong { font-size: ${token.typography.headline.small["font-size"]}; font-weight: ${token.font.weight.body}; }
.crab-docs-footer p { max-width: 52ch; font-size: ${token.font.size.body}; line-height: ${token.typography.body.large["line-height"]}; }
.crab-docs-page-heading .crab-docs-motion-note { margin-block: ${token.space["component-gap"]} 0; font-size: ${token.typography.body.small["font-size"]}; line-height: ${token.typography.body.small["line-height"]}; color: ${token.color.text.secondary}; }
.crab-docs-footer nav { display: grid; align-content: start; justify-items: start; }
.crab-docs-footer .crab-docs-back-top { position: absolute; right: ${globalToken.space[6]}; top: ${globalToken.space[4]}; width: ${token.size.control}; height: ${token.size.control}; padding: 0; }
.crab-docs-mobile-drawer [data-placement="left"] { width: min(${docs.drawer}, calc(100vw - ${globalToken.space[6]})); }
.crab-docs-mobile-drawer [data-placement="left"] > div:last-child { padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; }
.crab-docs-reading-body[data-wide="true"] { display: grid; grid-template-columns: minmax(0,1fr) ${docs.outline}; align-items: start; gap: ${globalToken.space[6]}; max-width: calc(${docs.article} + ${globalToken.space[24]}); padding-inline: ${globalToken.space[6]}; margin-top: ${globalToken.space[6]}; }
.crab-docs-page[data-reading="true"] .crab-docs-reading-body[data-wide="true"] > .crab-docs-prose { width: 100%; padding-inline: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-outline { position: sticky; top: calc(${docs.header} + ${globalToken.space[6]}); max-height: calc(100dvh - ${docs.header} - ${globalToken.space[12]}); overflow-y: auto; scrollbar-width: thin; margin: 0; padding: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-sections { border: 0; }
.crab-docs-reading-body[data-wide="true"] .crab-docs-page-sections a { padding-inline: ${globalToken.space[3]}; font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.medium["line-height"]}; }
@container (min-width: 800px) {
    .crab-docs-page-hero:has(.crab-docs-component-artwork:not([data-live="true"])) { grid-template-columns: minmax(0,1fr) minmax(0,calc(${globalToken.space[24]} * 3)); }
    .crab-docs-page-hero:has(.crab-docs-component-artwork:not([data-live="true"])) .crab-docs-page-heading { align-content: center; }
    .crab-docs-component-artwork { height: 100%; }
    .crab-docs-component-artwork .crab-catalog-preview { height: calc(${globalToken.space[24]} * 2); }
}
@media (max-width: 599px) {
    .crab-docs-layout .crab-docs-page-heading { padding: ${globalToken.space[6]} ${globalToken.space[4]}; }
    .crab-docs-layout .crab-docs-page-heading h1 { font-size: ${token.typography.headline.medium["font-size"]}; line-height: ${token.typography.headline.medium["line-height"]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-reading-body > .crab-docs-prose,.crab-docs-layout[data-catalog="true"] .crab-docs-prose { padding-inline: ${globalToken.space[4]}; }
    .crab-docs-page-outline { padding-inline: ${globalToken.space[4]}; }
    .crab-docs-page[data-reading="true"] .crab-docs-prose > .table-scroll > table :is(th,td) { min-width: calc(${globalToken.space[20]} * 2); }
    .crab-docs-layout .crab-docs-pager { grid-template-columns: minmax(0,1fr); }
    .crab-docs-layout .crab-docs-pager a { padding: ${globalToken.space[6]}; }
    .crab-docs-footer { grid-template-columns: minmax(0,1fr); padding: ${globalToken.space[10]} ${globalToken.space[4]}; gap: ${globalToken.space[6]}; }
}
@media (pointer: coarse) {
    .crab-docs-page-sections a { min-height: ${token.size["touch-target"]}; }
}
@media (forced-colors: active) {
    .crab-docs-layout .crab-docs-topbar,.crab-docs-layout .crab-docs-sidebar { border-inline-end: ${globalToken.space.px} solid CanvasText; }
    .crab-docs-page-heading,.crab-docs-pager a,.crab-docs-component-artwork { border: ${globalToken.space.px} solid CanvasText; }
    .crab-docs-page-sections a[aria-current],.crab-docs-rail-item[data-active="true"] .crab-docs-rail-indicator { outline: ${globalToken.space["0-5"]} solid Highlight; outline-offset: -${globalToken.space[1]}; }
}
`;
