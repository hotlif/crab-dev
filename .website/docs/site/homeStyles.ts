import { defineTokens, globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// Homepage typography and layout are private presentation scales.
const home = defineTokens({ titleMin: "32px", titleFluid: "4vw", titleMax: "56px", titleLine: "1.18", titleTracking: "-0.04em", sectionTitle: "28px", narrowTitle: "24px", eyebrowTracking: "0.06em", touch: "44px" });

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-home { color: ${token.color.text.primary}; }
.crab-home :where(.crab-home-intro,.crab-home-section-heading,.crab-home-category,.crab-home-paths,.crab-home-practices,.crab-home-project) :where(h1,h2,h3,p) { margin: 0; }
.crab-home section { scroll-margin-top: ${globalToken.space[24]}; }
.crab-home-eyebrow { font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; letter-spacing: ${home.eyebrowTracking}; color: ${token.color.text.secondary}; }
.crab-home-hero { display: grid; grid-template-columns: minmax(0,1.45fr) minmax(0,1fr); align-items: center; gap: ${globalToken.space[6]} ${globalToken.space[16]}; padding-block: ${globalToken.space[6]} ${globalToken.space[8]}; }
.crab-home-intro { display: grid; justify-items: start; gap: ${token.space["card-padding"]}; }
.crab-home-intro h1 { font-size: clamp(${home.titleMin}, ${home.titleFluid}, ${home.titleMax}); line-height: ${home.titleLine}; letter-spacing: ${home.titleTracking}; font-weight: ${token.font.weight.heading}; text-wrap: balance; }
.crab-home-intro h1 > span { display: block; }
.crab-home-intro .crab-home-lead { max-width: calc(${globalToken.space[24]} * 5); color: ${token.color.text.secondary}; font-size: ${token.font.size.subhead}; line-height: ${token.font["line-height"].body}; text-wrap: pretty; }
.crab-home-actions { display: flex; flex-wrap: wrap; gap: ${token.space["stack-gap"]}; }
.crab-home-actions > a { min-height: ${home.touch}; font-size: ${token.font.size.subhead}; padding-inline: ${token.space["section-gap"]}; gap: ${token.space["stack-gap"]}; border-radius: ${token.radius.md}; }
.crab-home-stack { display: flex; flex-wrap: wrap; gap: ${token.space["section-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-home-stack strong { font-weight: ${token.font.weight.label}; font-variant-numeric: tabular-nums; }
.crab-home-paths { min-width: 0; grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["component-gap"]} ${token.space["section-gap"]}; }
.crab-home-paths h2 { grid-column: 1 / -1; font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; font-weight: ${token.font.weight.label}; padding-inline: ${token.space["section-gap"]}; }
.crab-home-paths .crab-home-path { display: block; width: 100%; height: auto; white-space: normal; text-align: left; padding: ${token.space["section-gap"]}; border-radius: ${token.radius.md}; }
.crab-home-path > span { display: block; width: 100%; }
.crab-home-path-content { display: grid; grid-template-columns: minmax(0,1fr) ${globalToken.space[5]}; align-items: center; gap: ${token.space["stack-gap"]}; }
.crab-home-path strong { font-weight: ${token.font.weight.label}; font-size: ${token.font.size.subhead}; line-height: ${token.font["line-height"].body}; }
.crab-home-path-detail { display: block; margin-top: ${token.space["inline-gap"]}; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; color: ${token.color.text.secondary}; }
.crab-home-path-arrow { color: ${token.color.text.link}; }
.crab-home-project { min-width: 0; }
.crab-home-project .crab-home-project-panel { --card-filled-background: ${token.color.background.elevated}; --card-size-middle-padding: ${globalToken.space[6]}; }
.crab-home-project-heading { display: flex; flex-wrap: wrap; align-items: start; justify-content: space-between; gap: ${token.space["stack-gap"]}; }
.crab-home-project .crab-home-project-heading h2 { margin-top: ${token.space["component-gap"]}; font-size: ${token.font.size.heading}; line-height: ${token.font["line-height"].body}; font-weight: ${token.font.weight.heading}; }
.crab-home-project-caption { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; }
.crab-home-project-facts { display: grid; gap: ${token.space["component-gap"]}; margin: ${token.space["group-gap"]} 0; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; }
.crab-home-project-facts > div { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; min-height: ${globalToken.space[8]}; gap: ${token.space["component-gap"]} ${token.space["section-gap"]}; }
.crab-home-project-facts dt { color: ${token.color.text.secondary}; }
.crab-home-project-facts dd { display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]}; margin: 0; min-width: 0; overflow-wrap: anywhere; }
.crab-home-project-facts strong { font-weight: ${token.font.weight.heading}; font-variant-numeric: tabular-nums; }
.crab-home-project-footer { display: grid; justify-items: start; gap: ${token.space["component-gap"]}; padding-top: ${token.space["section-gap"]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; }
.crab-home-project-footer p { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; line-height: ${token.font["line-height"].body}; }
.crab-home-project-footer a { min-height: ${home.touch}; height: auto; white-space: normal; padding: ${token.space["component-gap"]}; margin-left: calc(-1 * ${token.space["component-gap"]}); color: ${token.color.text.link}; }
.crab-home-section { padding-block: ${globalToken.space[6]} ${globalToken.space[8]}; }
.crab-home-section-heading { display: flex; align-items: end; justify-content: space-between; gap: ${token.space["section-gap"]}; margin-bottom: ${globalToken.space[6]}; }
.crab-home-section-heading h2 { font-size: ${home.sectionTitle}; font-weight: ${token.font.weight.heading}; line-height: ${token.font["line-height"].body}; text-wrap: balance; }
.crab-home-eyebrow + h2 { margin-top: ${token.space["component-gap"]}; }
.crab-home p.crab-home-section-note { max-width: calc(${globalToken.space[24]} * 6); margin-top: ${token.space["component-gap"]}; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; color: ${token.color.text.secondary}; }
.crab-home .crab-home-catalog-action { flex: none; min-height: ${home.touch}; padding-inline: ${token.space["stack-gap"]}; }
.crab-home-category-index, .crab-home .crab-home-index-return { display: none; }
.crab-home-categories { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-category { min-width: 0; }
.crab-home-category .crab-home-category-panel { --card-filled-background: ${token.color.background.surface}; --card-size-middle-padding: ${globalToken.space[6]}; height: 100%; }
.crab-home-category-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0 ${token.space["component-gap"]}; min-height: ${home.touch}; }
.crab-home-category-header h3 { font-size: ${token.font.size.subhead}; line-height: ${token.font["line-height"].body}; font-weight: ${token.font.weight.heading}; }
.crab-home-category .crab-home-category-link { flex: none; margin-right: calc(-1 * ${token.space["component-gap"]}); padding: ${token.space["component-gap"]}; min-height: ${home.touch}; height: auto; font-size: ${token.font.size.body}; font-weight: ${token.font.weight.body}; line-height: ${token.font["line-height"].body}; color: ${token.color.text.secondary}; }
.crab-home-category .crab-home-category-link:is(:hover,:focus-visible) { color: ${token.color.text.link}; text-decoration: underline; }
.crab-home-category-detail { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; }
/* Keep one or two columns: each entry needs at least 144px, including its hit-area padding. */
.crab-home-component-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, max(calc((100% - ${token.space["component-gap"]}) / 2), calc(${globalToken.space[24]} + ${globalToken.space[12]}))), 1fr));
    gap: ${token.space["inline-gap"]} ${token.space["component-gap"]};
    margin-top: ${token.space["section-gap"]};
    margin-inline: calc(-1 * ${token.space["component-gap"]});
}
.crab-home-component-links > a { min-width: 0; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; padding: ${token.space["component-gap"]}; min-height: ${home.touch}; height: auto; color: ${token.color.text.link}; text-align: left; justify-content: start; white-space: normal; }
.crab-home-component-links > a > span { min-width: 0; width: 100%; }
.crab-home-component-label { display: grid; justify-items: start; gap: ${globalToken.space["0-5"]}; }
.crab-home-component-links strong { font-weight: ${token.font.weight.label}; }
.crab-home-component-name { font-size: ${token.font.size.body}; font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-home-component-kind { font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.body}; color: ${token.color.text.secondary}; }
.crab-home-component-links > a:hover strong { text-decoration: underline; text-underline-offset: ${globalToken.space[1]}; }
.crab-home-showcase { min-width: 0; }
/* Keep the preview wrapper quiet; interactive cards provide their own grouping. */
.crab-home-showcase [data-live-example] {
    --component-preview-card-border-color: transparent;
    --component-preview-card-border-color-hover: transparent;
    --component-preview-card-background-color: transparent;
    --component-preview-card-shadow: none;
    --component-preview-card-shadow-hover: none;
    --component-preview-stage-padding: 0;
    --component-preview-stage-background-color: transparent;
    --component-preview-meta-border-color: transparent;
    --component-preview-meta-actions-padding: ${token.space["component-gap"]} 0;
}
.crab-home-showcase [aria-label="预览操作"] { --button-size-small-height: ${home.touch}; --button-size-small-padding: 0 ${token.space["stack-gap"]}; }
.crab-home-showcase [data-live-example] > header button, .crab-home-showcase-caption a { min-height: ${home.touch}; padding-inline: ${token.space["stack-gap"]}; }
.crab-home-showcase-caption { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: ${token.space["component-gap"]}; margin-top: ${token.space["component-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-secondary { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; max-width: calc(${globalToken.space[24]} * 3); }
.crab-home-practices { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${globalToken.space[10]}; }
.crab-home-practices > article { display: grid; gap: ${token.space["stack-gap"]}; padding: ${token.space["section-gap"]}; }
.crab-home-practices h3 a { font-size: ${token.font.size.heading}; font-weight: ${token.font.weight.heading}; padding: ${token.space["component-gap"]}; margin-left: calc(-1 * ${token.space["component-gap"]}); width: calc(100% + ${token.space["component-gap"]} * 2); white-space: normal; height: auto; justify-content: space-between; min-height: ${home.touch}; }
.crab-home-practices p { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; }
.crab-home-practice-components { font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-home-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: ${token.space["section-gap"]}; border-top: ${globalToken.space.px} solid ${token.color.border.subtle}; padding-block: ${token.space["group-gap"]}; font-size: ${token.font.size.body}; color: ${token.color.text.secondary}; }
.crab-home-footer strong { color: ${token.color.text.primary}; margin-right: ${token.space["component-gap"]}; }
.crab-home-footer nav { display: flex; flex-wrap: wrap; }
@media (max-width: 1199px) { .crab-home-categories { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (max-width: 959px) {
    .crab-home-hero { grid-template-columns: minmax(0,1fr); gap: ${globalToken.space[8]}; }
    .crab-home-paths { grid-template-columns: repeat(3,minmax(0,1fr)); }
    .crab-home-paths h2 { grid-column: 1 / -1; padding-inline: ${token.space["stack-gap"]}; }
    .crab-home-paths .crab-home-path { padding: ${token.space["component-gap"]} ${token.space["stack-gap"]}; }
    .crab-home-path-content { grid-template-columns: minmax(0,1fr) ${globalToken.space[4]}; gap: ${token.space["component-gap"]}; }
    .crab-home-category .crab-home-category-panel { --card-size-middle-padding: ${token.space["section-gap"]}; }
    .crab-home-project .crab-home-project-panel { --card-size-middle-padding: ${token.space["section-gap"]}; }
    .crab-home-section-heading { align-items: start; }
}
@media (max-width: 639px) {
    .crab-home-hero { padding-top: ${token.space["component-gap"]}; padding-bottom: ${globalToken.space[8]}; }
    .crab-home-paths, .crab-home-categories, .crab-home-practices { grid-template-columns: minmax(0,1fr); }
    .crab-home-paths .crab-home-path { padding-block: ${token.space["stack-gap"]}; }
    .crab-home-path-detail { display: none; }
    .crab-home-paths .crab-home-path { min-height: ${home.touch}; }
    .crab-home-project-facts { margin-block: ${token.space["stack-gap"]}; }
    .crab-home-project-footer { padding-top: ${token.space["component-gap"]}; gap: 0; }
    .crab-home-section-heading { flex-direction: column; gap: ${token.space["stack-gap"]}; margin-bottom: ${token.space["section-gap"]}; }
    .crab-home-section-heading h2 { font-size: ${home.narrowTitle}; }
    .crab-home-category-index { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${token.space["inline-gap"]} ${token.space["component-gap"]}; margin-bottom: ${token.space["section-gap"]}; }
    .crab-home-category-index a, .crab-home .crab-home-index-return { min-height: ${home.touch}; height: auto; padding: ${token.space["component-gap"]}; white-space: normal; font-size: ${token.font.size.body}; line-height: ${token.font["line-height"].body}; color: ${token.color.text.link}; }
    .crab-home-category-index a { justify-content: space-between; min-width: 0; text-align: left; }
    .crab-home .crab-home-index-return { display: inline-flex; margin-top: ${token.space["section-gap"]}; }
    .crab-home-practices { gap: ${globalToken.space[8]}; }
}
@media (forced-colors: active) { .crab-home-category .crab-home-category-panel, .crab-home-project .crab-home-project-panel { border-color: CanvasText; } .crab-home :is(.crab-home-path,.crab-home-category-link,.crab-home-component-links > a,.crab-home-category-index a,.crab-home-index-return,.crab-home-project-footer a):focus-visible { outline: ${globalToken.space["0-5"]} solid Highlight; } }
`;
