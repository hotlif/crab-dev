import { defineTokens, globalStyle } from "@crab-dev/css";
import globalToken from "@crab-dev/rc-token-global";
import token from "@crab-dev/rc-token-semantic";

const home = defineTokens({
    heroMin: token.typography.display.medium["font-size"],
    heroFluid: "8vw",
    heroMax: "88px",
    heroLine: "1.090909",
    title: token.typography.headline.large["font-size"],
    titleSmall: token.typography.headline.small["font-size"],
    touch: token.size[48],
    demoRadius: token.shape["extra-large"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-home { min-width: 0; color: ${token.color.text.primary}; }
.crab-home :where(h1,h2,h3,p,fieldset) { margin: 0; }
.crab-home section { scroll-margin-top: ${globalToken.space[24]}; }
.crab-home-eyebrow { font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; letter-spacing: .08em; color: ${token.color.text.secondary}; }
.crab-home-hero { display: grid; grid-template-columns: minmax(0,1fr); align-items: stretch; gap: ${globalToken.space[2]}; padding-block: 0 ${globalToken.space[8]}; }
.crab-home-intro { display: grid; align-content: center; justify-items: start; gap: ${token.space["group-gap"]}; padding: ${globalToken.space[12]}; background: ${token.color.surface.low}; border-radius: ${token.shape["extra-large"]}; }
.crab-home-intro h1 { font-size: clamp(${home.heroMin}, ${home.heroFluid}, ${home.heroMax}); line-height: ${home.heroLine}; letter-spacing: 0; font-weight: ${token.typography.display.large['font-weight']}; text-wrap: balance; }
.crab-home-intro h1 span { display: block; color: ${token.color.brand.primary}; text-wrap: balance; }
.crab-home-lead { max-width: 64ch; color: ${token.color.text.primary}; font-size: ${token.typography.headline.small["font-size"]}; line-height: ${token.typography.headline.small["line-height"]}; text-wrap: pretty; }
.crab-home-actions { display: flex; flex-wrap: wrap; gap: ${token.space["stack-gap"]}; }
.crab-home-actions > a { min-height: ${globalToken.space[20]}; padding-inline: ${globalToken.space[12]}; font-size: ${token.typography.title.large["font-size"]}; border-radius: ${token.shape.full}; --button-root-border-radius-active: ${token.shape.full}; }
.crab-home-quick-links { display: flex; align-items: center; gap: ${token.space["inline-gap"]}; color: ${token.color.text.tertiary}; }
.crab-home-quick-links a { min-height: ${home.touch}; flex: none; white-space: nowrap; color: ${token.color.text.secondary}; }
.crab-home-feature-grid { display: grid; min-width: 0; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${globalToken.space[2]}; }
.crab-home-feature-grid .crab-home-feature { display: block; width: 100%; height: auto; min-width: 0; padding: ${token.space["group-gap"]}; border-radius: ${token.shape["extra-large"]}; white-space: normal; text-align: left; transition: border-radius ${token.motion.interaction}, background ${token.motion.interaction}; }
.crab-home-feature > span { display: grid; gap: ${token.space["section-gap"]}; }
.crab-home-feature-grid .crab-home-feature-action { background: ${token.color.brand.container}; color: ${token.color.brand["on-container"]}; }
.crab-home-feature-grid .crab-home-feature-choice { background: ${token.color.secondary.container}; color: ${token.color.secondary["on-container"]}; }
.crab-home-feature-grid .crab-home-feature-data { background: ${token.color.tertiary.container}; color: ${token.color.tertiary["on-container"]}; }
.crab-home-feature-grid .crab-home-feature { isolation: isolate; }
.crab-home-feature-grid .crab-home-feature::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: currentColor; opacity: 0; pointer-events: none; transition: opacity ${token.motion.interaction}; }
.crab-home-feature-grid .crab-home-feature:hover::before { opacity: ${token.state.opacity.hover}; }
.crab-home-feature-grid .crab-home-feature:focus-visible::before { opacity: ${token.state.opacity.focus}; }
.crab-home-feature-grid .crab-home-feature:active::before { opacity: ${token.state.opacity.pressed}; }
.crab-home-feature-grid .crab-home-feature:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 3px; }
.crab-home-feature-label { display: flex; justify-content: space-between; gap: ${token.space["component-gap"]}; font-size: ${token.typography.label.medium["font-size"]}; line-height: ${token.typography.label.medium["line-height"]}; font-weight: ${token.font.weight.label}; }
.crab-home-feature .crab-catalog-preview { justify-self: center; width: 100%; height: calc(${globalToken.space[24]} + ${globalToken.space[8]}); }
.crab-home-feature-action .crab-catalog-preview { height: calc(${globalToken.space[24]} + ${globalToken.space[8]}); }
.crab-home-feature strong { font-size: ${token.typography.title.large["font-size"]}; font-weight: ${token.typography.title.large["font-weight"]}; }
.crab-home-feature strong > span { font-size: ${token.typography.label.large["font-size"]}; }

.crab-home-section, .crab-home-demo { padding: ${globalToken.space[16]} ${globalToken.space[12]}; }
.crab-home-section-heading { display: flex; align-items: end; justify-content: space-between; gap: ${token.space["group-gap"]}; margin-bottom: ${globalToken.space[8]}; }
.crab-home-section-heading > div:first-child { min-width: 0; }
.crab-home-section-heading h2 { margin-top: ${token.space["component-gap"]}; font-size: ${home.title}; line-height: ${token.typography.headline.large["line-height"]}; letter-spacing: 0; font-weight: ${token.typography.headline.large["font-weight"]}; text-wrap: balance; }
.crab-home-section-note, .crab-home-secondary { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-section-note { max-width: 44rem; margin-top: ${token.space["stack-gap"]}; }
.crab-home-secondary { max-width: 26rem; }
.crab-home-catalog-action { flex: none; min-height: ${home.touch}; }

.crab-home-demo { position: relative; }
.crab-home-demo::before { content: ""; position: absolute; z-index: -1; inset: ${globalToken.space[8]} 0; border-radius: ${home.demoRadius}; background: ${token.color.surface.low}; }
.crab-home-demo-heading { align-items: start; }
.crab-home-theme-controls { display: flex; flex-wrap: wrap; justify-content: end; gap: ${token.space["stack-gap"]}; }
.crab-home-theme-controls > label { display: grid; gap: ${token.space["inline-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-demo-surface { min-width: 0; padding: ${globalToken.space[6]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${home.demoRadius}; background: ${token.color.surface.container}; color: ${token.color.text.primary}; box-shadow: none; }
.crab-home-component-wall { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); align-items: start; gap: ${token.space["section-gap"]}; }
.crab-home-component-column { display: grid; min-width: 0; gap: ${token.space["section-gap"]}; }
.crab-home-component-column > * { min-width: 0; }
.crab-home-control-stack { display: grid; gap: ${token.space["section-gap"]}; }
.crab-home-field { display: grid; min-width: 0; gap: ${token.space["component-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-field > :last-child { width: 100%; }
.crab-home-inline-fields { display: grid; grid-template-columns: minmax(0,1fr) auto; align-items: end; gap: ${token.space["stack-gap"]}; }
.crab-home-color-field { justify-items: start; }
.crab-home-fieldset { display: grid; gap: ${token.space["component-gap"]}; min-width: 0; padding: 0; border: 0; }
.crab-home-fieldset legend { padding: 0; margin-bottom: ${token.space["component-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-fieldset > div { display: flex; flex-wrap: wrap; gap: ${token.space["stack-gap"]}; }
.crab-home-team-row, .crab-home-status-row, .crab-home-switch-row { display: flex; align-items: center; justify-content: space-between; gap: ${token.space["stack-gap"]}; }
.crab-home-team-row > span, .crab-home-status-row { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-switch-row > span { display: grid; }
.crab-home-switch-row small { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-status-dot { display: inline-block; width: ${globalToken.space[2]}; height: ${globalToken.space[2]}; margin-right: ${token.space["component-gap"]}; border-radius: ${token.radius.pill}; background: ${token.color.feedback.success.text}; }
.crab-home-account-card { text-align: center; }
.crab-home-account-card > div { display: grid; justify-items: stretch; gap: ${token.space["section-gap"]}; }
.crab-home-account-card h3 { font-size: ${token.font.size.heading}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-account-card p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-account-mark { display: grid; place-items: center; justify-self: center; width: ${globalToken.space[16]}; aspect-ratio: 1; border-radius: ${token.radius.lg}; background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; font-size: ${token.font.size.heading}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; transform: rotate(8deg); }
.crab-home-divider { position: relative; display: grid; place-items: center; color: ${token.color.text.tertiary}; font-size: ${token.font.size.caption}; }
.crab-home-divider::before { content: ""; position: absolute; inset-inline: 0; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-divider span { position: relative; padding-inline: ${token.space["stack-gap"]}; background: ${token.color.background.elevated}; }
.crab-home-tag-row, .crab-home-button-row { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; }
.crab-home-demo-feedback { display: block; min-height: ${globalToken.space[8]}; margin-top: ${token.space["section-gap"]}; padding: ${token.space["stack-gap"]} ${token.space["section-gap"]}; border-radius: ${token.radius.md}; background: ${token.color.background.surface}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }

.crab-home-category-index { display: flex; max-width: 100%; margin-bottom: ${token.space["section-gap"]}; padding-bottom: ${token.space["component-gap"]}; gap: ${token.space["component-gap"]}; overflow-x: auto; scrollbar-width: thin; }
.crab-home-category-index a { flex: none; min-height: ${home.touch}; white-space: nowrap; }
.crab-home-categories { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-category { min-width: 0; }
.crab-home-category-panel { height: 100%; }
.crab-home-category-panel > div { display: grid; height: 100%; gap: ${token.space["stack-gap"]}; }
.crab-home-category-mark { color: ${token.color.brand.primary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; font-variant-numeric: tabular-nums; }
.crab-home-category h3 { font-size: ${token.font.size.heading}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-category p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-home-component-links { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${token.space["inline-gap"]}; margin-top: auto; padding-top: ${token.space["stack-gap"]}; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-component-links a { min-width: 0; min-height: ${home.touch}; justify-content: space-between; color: ${token.color.text.secondary}; }

.crab-home-capabilities { position: relative; }
.crab-home-capability-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-capability-card { height: 100%; }
.crab-home-capability-card > div { display: grid; height: 100%; gap: ${token.space["stack-gap"]}; }
.crab-home-capability-mark { display: grid; place-items: center; width: fit-content; min-width: ${globalToken.space[12]}; min-height: ${globalToken.space[10]}; padding-inline: ${token.space["component-gap"]}; border-radius: ${token.radius.pill}; background: ${token.color.background.selected}; color: ${token.color.selection.foreground}; font-size: ${token.font.size.caption}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-capability-card h3 { font-size: ${token.font.size.subhead}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-capability-card p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-capability-card a { justify-self: start; min-height: ${home.touch}; margin-top: auto; margin-left: calc(-1 * ${token.space["component-gap"]}); }

.crab-home-practices { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-practices > article { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: start; gap: ${token.space["section-gap"]}; padding: ${token.space["section-gap"]}; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-practice-number { color: ${token.color.brand.primary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; }
.crab-home-practices h3 { margin-bottom: ${token.space["component-gap"]}; font-size: ${token.font.size.subhead}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-practices p, .crab-home-practice-components { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-home-practice-components { display: block; margin-top: ${token.space["stack-gap"]}; overflow-wrap: anywhere; }
.crab-home-practices article > a { width: ${home.touch}; min-width: ${home.touch}; height: ${home.touch}; padding: 0; }
.crab-home-showcase [data-live-example] { border-radius: ${token.radius.lg}; overflow: visible; }
.crab-home-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: ${token.space["section-gap"]}; padding-block: ${globalToken.space[12]}; border-top: 1px solid ${token.color.border.subtle}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-home-footer strong { color: ${token.color.text.primary}; }
.crab-home-footer nav { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; }
.crab-home-footer a { min-height: ${home.touch}; }

@media (max-width: 1199px) {
    .crab-home-component-wall, .crab-home-categories { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .crab-home-capability-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (max-width: 959px) {
    .crab-home-hero { grid-template-columns: minmax(0,1fr); }
    .crab-home-feature-grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
    .crab-home-feature-grid .crab-home-feature-action { grid-column: auto; }
    .crab-home-feature-action .crab-catalog-preview { height: ${globalToken.space[24]}; }

    .crab-home-section-heading, .crab-home-demo-heading { align-items: start; flex-direction: column; }
    .crab-home-theme-controls { justify-content: start; }
    .crab-home-practices { grid-template-columns: minmax(0,1fr); }
}
@media (max-width: 767px) {
    .crab-home-hero { padding-bottom: ${token.space["section-gap"]}; }
    .crab-home-intro { padding: ${token.space["group-gap"]} ${token.space["section-gap"]}; gap: ${token.space["section-gap"]}; }
    .crab-home-feature-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .crab-home-feature-grid .crab-home-feature-action { grid-column: 1 / -1; }
    .crab-home-feature-grid .crab-home-feature { padding: ${token.space["section-gap"]}; border-radius: ${token.shape.large}; }
    .crab-home-feature-label { font-size: ${token.font.size.caption}; }
    .crab-home-feature strong { font-size: ${token.typography.title.medium["font-size"]}; }
    .crab-home-section, .crab-home-demo { padding: ${globalToken.space[10]} ${globalToken.space[4]}; }
    .crab-home-lead { font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
    .crab-home-actions > a { min-height: ${token.size[56]}; padding-inline: ${token.space["group-gap"]}; font-size: ${token.typography.title.medium["font-size"]}; }
    .crab-home-section-heading h2 { font-size: ${home.titleSmall}; }
    .crab-home-component-wall, .crab-home-categories, .crab-home-capability-grid { grid-template-columns: minmax(0,1fr); }
    .crab-home-demo::before { border-radius: ${token.radius.lg}; }
    .crab-home-demo-surface { padding: ${token.space["stack-gap"]}; border-radius: ${token.radius.lg}; }
    .crab-home-theme-controls { width: 100%; display: grid; justify-content: stretch; }
    .crab-home-theme-controls > label { min-width: 0; }
    .crab-home-category-index { margin-inline: calc(-1 * ${token.space["stack-gap"]}); padding-inline: ${token.space["stack-gap"]}; }
    .crab-home-category-index a { padding-inline: ${token.space["stack-gap"]}; }
}
@media (max-width: 359px) {
    .crab-home-actions { width: 100%; }
    .crab-home-actions > a { width: 100%; }
    .crab-home-quick-links { width: 100%; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 0; }
    .crab-home-quick-links > span { display: none; }
    .crab-home-quick-links a { min-width: 0; padding-inline: ${token.space["inline-gap"]}; font-size: ${token.font.size.caption}; }
    .crab-home-inline-fields { grid-template-columns: minmax(0,1fr); }
    .crab-home-color-field { justify-items: stretch; }
    .crab-home-practices > article { grid-template-columns: auto minmax(0,1fr); }
    .crab-home-practices article > a { grid-column: 2; }
}
@media (prefers-reduced-motion: reduce) {
    .crab-home :where(*, *::before, *::after) { scroll-behavior: auto; animation: none; transition: none; }
    .crab-home-account-mark { transform: none; }
}
@media (forced-colors: active) {
    .crab-home-demo::before, .crab-home-feature::before { display: none; }
    .crab-home-demo-surface, .crab-home-category-panel, .crab-home-capability-card, .crab-home-feature { border: 1px solid CanvasText; }
    .crab-home-capability-mark { forced-color-adjust: none; background: Highlight; color: HighlightText; }
    .crab-home-status-dot { forced-color-adjust: none; background: Highlight; }
}
`;
