import { defineTokens, globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// Documentation-only layout candidates; future L3 catalog presentation tokens.
const catalogToken = defineTokens({
    columnMin: "19rem",
    artworkWidth: "240px",
    artworkHeight: "128px",
});

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-catalog-intro { margin-bottom: ${globalToken.space[8]}; }
.crab-catalog-actions { display: flex; flex-wrap: wrap; gap: ${token.space["stack-gap"]}; margin-bottom: ${token.space["group-gap"]}; }
.crab-catalog-actions a { min-height: ${globalToken.space[10]}; font-size: ${token.font.size.body}; }
.crab-catalog-arrow { width: ${globalToken.space[5]}; height: ${globalToken.space[5]}; flex: none; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.crab-catalog-categories { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,10rem),1fr)); gap: ${token.space["component-gap"]}; padding-block: ${token.space["section-gap"]}; border-block: 1px solid ${token.color.border.subtle}; }
.crab-catalog-categories a { width: 100%; height: auto; min-height: ${token.size[48]}; padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; border-radius: ${token.shape.medium}; background: ${token.color.surface.low}; }
.crab-catalog-categories a > span { display: flex; width: 100%; gap: ${token.space["stack-gap"]}; align-items: center; justify-content: space-between; }
.crab-catalog-category-count { font-size: ${token.font.size.caption}; font-variant-numeric: tabular-nums; color: ${token.color.text.secondary}; }
.crab-catalog-categories a:hover { background: ${token.color.background["hover-subtle"]}; color: ${token.color.text.primary}; }
.crab-catalog-section { margin-bottom: ${globalToken.space[12]}; scroll-margin-top: ${globalToken.space[24]}; }
.crab-catalog-section-heading { display: flex; align-items: baseline; gap: ${token.space["stack-gap"]}; margin-bottom: ${token.space["section-gap"]}; }
.crab-catalog-section-heading h2 { margin: 0; font-size: ${token.typography.headline.small["font-size"]}; font-weight: ${token.typography.headline.small["font-weight"]}; line-height: ${token.typography.headline.small["line-height"]}; letter-spacing: 0; }
.crab-catalog-section-heading h2 > a { display: none; }
.crab-catalog-count { padding: ${globalToken.space[1]} ${globalToken.space[2]}; border-radius: ${token.radius.sm}; background: var(--crab-docs-nav-hover); font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; font-variant-numeric: tabular-nums; }
.crab-catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, ${catalogToken.columnMin}), 1fr)); gap: ${token.space["section-gap"]}; }
.crab-catalog-grid .crab-catalog-item { display: block; height: 100%; min-width: 0; width: 100%; padding: ${token.space["stack-gap"]} ${token.space["stack-gap"]} ${token.space["group-gap"]}; border: ${globalToken.space.px} solid transparent; border-radius: ${token.shape["extra-large"]}; text-align: left; white-space: normal; color: ${token.color.text.primary}; background: ${token.color.surface.low}; box-shadow: none; transition: background ${token.motion.interaction}, border-color ${token.motion.interaction}; }
.crab-catalog-item > span { display: block; min-width: 0; }
.crab-catalog-item-heading { display: flex; align-items: center; justify-content: space-between; gap: ${token.space["component-gap"]}; margin: ${token.space["section-gap"]} ${token.space["stack-gap"]} ${token.space["component-gap"]}; }
.crab-catalog-item-title { display: flex; align-items: baseline; flex-wrap: wrap; gap: ${token.space["inline-gap"]} ${token.space["component-gap"]}; min-width: 0; }
.crab-catalog-item-heading strong { min-width: 0; overflow-wrap: anywhere; font-size: ${token.typography.title.large["font-size"]}; font-weight: ${token.typography.title.large["font-weight"]}; line-height: ${token.typography.title.large["line-height"]}; }
.crab-catalog-item-heading svg { color: ${token.color.text.secondary}; }
.crab-catalog-item-label { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; font-weight: ${token.font.weight.body}; line-height: 1.5; }
.crab-catalog-artwork { display: flex; align-items: center; justify-content: center; padding-block: ${token.space["group-gap"]}; border-radius: ${token.shape.large}; background: ${token.color.secondary.container}; }
.crab-catalog-item:nth-child(3n + 2) .crab-catalog-artwork { background: ${token.color.tertiary.container}; }
.crab-catalog-item:nth-child(3n) .crab-catalog-artwork { background: ${token.color.brand.container}; }
.crab-catalog-preview { display: block; width: 100%; max-width: ${catalogToken.artworkWidth}; height: ${catalogToken.artworkHeight}; overflow: visible; }
.crab-catalog-item-description { display: block; margin-inline: ${token.space["stack-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; font-weight: ${token.font.weight.body}; line-height: 1.65; overflow-wrap: anywhere; }
.crab-catalog-preview .cc-surface { fill: ${token.color.background.surface}; stroke: ${token.color.border.default}; stroke-width: 1; }
.crab-catalog-preview .cc-brand { fill: ${token.color.brand.primary}; stroke: ${token.color.brand.primary}; }
.crab-catalog-preview .cc-on-brand { fill: ${token.color.text["on-brand"]}; stroke: ${token.color.text["on-brand"]}; }
.crab-catalog-preview .cc-soft { fill: ${token.color.background.selected}; stroke: none; }
.crab-catalog-preview .cc-text { fill: ${token.color.text.primary}; stroke: ${token.color.text.primary}; }
.crab-catalog-preview .cc-muted { fill: ${token.color.text.secondary}; stroke: ${token.color.text.secondary}; }
.crab-catalog-preview .cc-border { fill: ${token.color.border.subtle}; stroke: ${token.color.border.subtle}; }
.crab-catalog-preview .cc-line { fill: none; stroke-width: 4; stroke-linecap: round; }
.crab-catalog-preview .cc-stroke { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.crab-catalog-preview .cc-thick { stroke-width: 3; }
.crab-catalog-preview :is(.cc-label, .cc-small, .cc-heading) { stroke: none; font-family: ${token.font.family.body}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; }
.crab-catalog-preview .cc-small { font-size: ${globalToken.font.size.xs}; }
.crab-catalog-preview .cc-heading { font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
.crab-catalog-grid .crab-catalog-item:hover { background: ${token.color.background["hover-subtle"]}; border-color: transparent; box-shadow: none; }
.crab-catalog-item:hover .crab-catalog-item-heading { color: ${token.color.text.link}; }
.crab-catalog-grid .crab-catalog-item:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 3px; }
@media (max-width: 767px) {
    .crab-catalog-intro, .crab-catalog-section { margin-bottom: ${globalToken.space[8]}; }
    .crab-catalog-actions a, .crab-catalog-categories a { min-height: ${token.size[48]}; }
    .crab-catalog-categories { grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${token.space["inline-gap"]}; }
    .crab-catalog-categories a { padding-inline: ${token.space["component-gap"]}; }
    .crab-catalog-preview { height: ${globalToken.space[24]}; }
}
@media (prefers-reduced-motion: reduce) { .crab-catalog-grid .crab-catalog-item { transition: none; } }
@media (forced-colors: active) {
    .crab-catalog-grid .crab-catalog-item, .crab-catalog-categories { border-color: CanvasText; }
    .crab-catalog-item-heading { border-color: CanvasText; }
    .crab-catalog-preview .cc-surface { fill: Canvas; stroke: CanvasText; }
    .crab-catalog-preview :is(.cc-brand, .cc-text, .cc-muted, .cc-border) { fill: CanvasText; stroke: CanvasText; }
    .crab-catalog-preview :is(.cc-soft, .cc-on-brand) { fill: Canvas; stroke: CanvasText; }
    .crab-catalog-preview :is(.cc-line, .cc-stroke) { fill: none; }
    .crab-catalog-preview :is(.cc-label, .cc-small, .cc-heading) { stroke: none; }
}
`;
