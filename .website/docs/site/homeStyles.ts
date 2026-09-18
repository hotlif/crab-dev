import { defineTokens, globalStyle } from "@crab-dev/css";
import globalToken from "@crab-dev/rc-token-global";
import token from "@crab-dev/rc-token-semantic";

const home = defineTokens({
    heroMin: "38px",
    heroFluid: "5vw",
    heroMax: "72px",
    heroLine: "1.08",
    title: "32px",
    titleSmall: "26px",
    touch: "44px",
    demoRadius: "28px",
    orbitSize: "26rem",
});

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-home { min-width: 0; color: ${token.color.text.primary}; }
.crab-home :where(h1,h2,h3,p,fieldset) { margin: 0; }
.crab-home section { scroll-margin-top: ${globalToken.space[24]}; }
.crab-home-eyebrow { font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; letter-spacing: .08em; color: ${token.color.text.secondary}; }
.crab-home-hero { position: relative; isolation: isolate; display: grid; grid-template-columns: minmax(0,1.2fr) minmax(20rem,.8fr); align-items: center; gap: ${globalToken.space[12]}; min-height: min(44rem, calc(100dvh - 4rem)); padding: ${globalToken.space[20]} 0 ${globalToken.space[16]}; overflow: hidden; }
.crab-home-hero-glow { position: absolute; z-index: -1; inset: 8% -12% auto auto; width: 60%; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, color-mix(in oklch, ${token.color.brand.primary} 20%, transparent), transparent 68%); filter: blur(${globalToken.space[8]}); pointer-events: none; }
.crab-home-intro { display: grid; justify-items: start; gap: ${token.space["section-gap"]}; }
.crab-home-intro h1 { font-size: clamp(${home.heroMin}, ${home.heroFluid}, ${home.heroMax}); line-height: ${home.heroLine}; letter-spacing: -.055em; font-weight: ${token.font.weight.heading}; text-wrap: balance; }
.crab-home-intro h1 span { color: ${token.color.brand.primary}; }
.crab-home-lead { max-width: 42rem; color: ${token.color.text.secondary}; font-size: ${token.font.size.subhead}; line-height: 1.8; text-wrap: pretty; }
.crab-home-actions { display: flex; flex-wrap: wrap; gap: ${token.space["stack-gap"]}; }
.crab-home-actions > a { min-height: ${home.touch}; padding-inline: ${token.space["section-gap"]}; }
.crab-home-quick-links { display: flex; align-items: center; gap: ${token.space["inline-gap"]}; color: ${token.color.text.tertiary}; }
.crab-home-quick-links a { min-height: ${home.touch}; color: ${token.color.text.secondary}; }
.crab-home-hero-orbit { position: relative; width: min(100%, ${home.orbitSize}); aspect-ratio: 1; justify-self: end; }
.crab-home-orbit-ring { position: absolute; inset: 10%; border: 1px solid color-mix(in oklch, ${token.color.brand.primary} 42%, ${token.color.border.subtle}); border-radius: 50%; box-shadow: inset 0 0 ${globalToken.space[20]} color-mix(in oklch, ${token.color.brand.primary} 8%, transparent); }
.crab-home-orbit-ring::before, .crab-home-orbit-ring::after { content: ""; position: absolute; border: 1px solid ${token.color.border.subtle}; border-radius: 50%; }
.crab-home-orbit-ring::before { inset: 14%; }
.crab-home-orbit-ring::after { inset: -13%; border-style: dashed; }
.crab-home-orbit-core, .crab-home-orbit-node { position: absolute; display: grid; place-items: center; border: 1px solid ${token.color.border.subtle}; background: ${token.color.background.elevated}; box-shadow: ${token.shadow.float}; font-weight: ${token.font.weight.heading}; }
.crab-home-orbit-core { inset: 50% auto auto 50%; width: ${globalToken.space[24]}; aspect-ratio: 1; translate: -50% -50%; border-radius: ${token.radius.lg}; background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; font-size: calc(${token.font.size.heading} * 2); transform: rotate(12deg); }
.crab-home-orbit-node { width: ${globalToken.space[16]}; aspect-ratio: 1; border-radius: ${token.radius.pill}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-orbit-node-a { inset: 5% 18% auto auto; }
.crab-home-orbit-node-b { inset: auto auto 10% 16%; }
.crab-home-orbit-node-c { inset: 40% -1% auto auto; }

.crab-home-section, .crab-home-demo { padding-block: ${globalToken.space[16]}; }
.crab-home-section-heading { display: flex; align-items: end; justify-content: space-between; gap: ${token.space["group-gap"]}; margin-bottom: ${globalToken.space[8]}; }
.crab-home-section-heading > div:first-child { min-width: 0; }
.crab-home-section-heading h2 { margin-top: ${token.space["component-gap"]}; font-size: ${home.title}; line-height: 1.25; letter-spacing: -.025em; font-weight: ${token.font.weight.heading}; text-wrap: balance; }
.crab-home-section-note, .crab-home-secondary { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-section-note { max-width: 44rem; margin-top: ${token.space["stack-gap"]}; }
.crab-home-secondary { max-width: 26rem; }
.crab-home-catalog-action { flex: none; min-height: ${home.touch}; }

.crab-home-demo { position: relative; }
.crab-home-demo::before { content: ""; position: absolute; z-index: -1; inset: ${globalToken.space[8]} calc(-1 * ${globalToken.space[8]}); border-radius: ${home.demoRadius}; background: linear-gradient(135deg, color-mix(in oklch, ${token.color.brand.primary} 9%, ${token.color.background.surface}), ${token.color.background.surface} 45%, color-mix(in oklch, ${token.color.brand.primary} 5%, ${token.color.background.surface})); }
.crab-home-demo-heading { align-items: start; }
.crab-home-theme-controls { display: flex; flex-wrap: wrap; justify-content: end; gap: ${token.space["stack-gap"]}; }
.crab-home-theme-controls > label { display: grid; gap: ${token.space["inline-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-demo-surface { min-width: 0; padding: ${globalToken.space[6]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${home.demoRadius}; background: ${token.color.background.sunken}; color: ${token.color.text.primary}; box-shadow: ${token.shadow.overlay}; }
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
.crab-home-account-card h3 { font-size: ${token.font.size.heading}; font-weight: ${token.font.weight.heading}; }
.crab-home-account-card p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-account-mark { display: grid; place-items: center; justify-self: center; width: ${globalToken.space[16]}; aspect-ratio: 1; border-radius: ${token.radius.lg}; background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; font-size: ${token.font.size.heading}; font-weight: ${token.font.weight.heading}; transform: rotate(8deg); }
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
.crab-home-category h3 { font-size: ${token.font.size.heading}; font-weight: ${token.font.weight.heading}; }
.crab-home-category p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }
.crab-home-component-links { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${token.space["inline-gap"]}; margin-top: auto; padding-top: ${token.space["stack-gap"]}; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-component-links a { min-width: 0; min-height: ${home.touch}; justify-content: space-between; color: ${token.color.text.secondary}; }

.crab-home-capabilities { position: relative; }
.crab-home-capability-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-capability-card { height: 100%; }
.crab-home-capability-card > div { display: grid; height: 100%; gap: ${token.space["stack-gap"]}; }
.crab-home-capability-mark { display: grid; place-items: center; width: fit-content; min-width: ${globalToken.space[12]}; min-height: ${globalToken.space[10]}; padding-inline: ${token.space["component-gap"]}; border-radius: ${token.radius.pill}; background: ${token.color.background.selected}; color: ${token.color.selection.foreground}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.heading}; }
.crab-home-capability-card h3 { font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
.crab-home-capability-card p { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-capability-card a { justify-self: start; min-height: ${home.touch}; margin-top: auto; margin-left: calc(-1 * ${token.space["component-gap"]}); }

.crab-home-practices { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.crab-home-practices > article { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: start; gap: ${token.space["section-gap"]}; padding: ${token.space["section-gap"]}; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-practice-number { color: ${token.color.brand.primary}; font-size: ${token.font.size.caption}; font-weight: ${token.font.weight.label}; }
.crab-home-practices h3 { margin-bottom: ${token.space["component-gap"]}; font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
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
    .crab-home-hero { grid-template-columns: minmax(0,1fr); min-height: auto; padding-block: ${globalToken.space[16]}; }
    .crab-home-hero-orbit { display: none; }
    .crab-home-section-heading, .crab-home-demo-heading { align-items: start; flex-direction: column; }
    .crab-home-theme-controls { justify-content: start; }
    .crab-home-practices { grid-template-columns: minmax(0,1fr); }
}
@media (max-width: 767px) {
    .crab-home-hero { padding-block: ${globalToken.space[12]}; }
    .crab-home-section, .crab-home-demo { padding-block: ${globalToken.space[10]}; }
    .crab-home-section-heading h2 { font-size: ${home.titleSmall}; }
    .crab-home-component-wall, .crab-home-categories, .crab-home-capability-grid { grid-template-columns: minmax(0,1fr); }
    .crab-home-demo::before { inset-inline: calc(-1 * ${token.space["stack-gap"]}); border-radius: ${token.radius.lg}; }
    .crab-home-demo-surface { padding: ${token.space["stack-gap"]}; border-radius: ${token.radius.lg}; }
    .crab-home-theme-controls { width: 100%; display: grid; justify-content: stretch; }
    .crab-home-theme-controls > label { min-width: 0; }
    .crab-home-category-index { margin-inline: calc(-1 * ${token.space["stack-gap"]}); padding-inline: ${token.space["stack-gap"]}; }
    .crab-home-category-index a { padding-inline: ${token.space["stack-gap"]}; }
}
@media (max-width: 359px) {
    .crab-home-actions { width: 100%; }
    .crab-home-actions > a { width: 100%; }
    .crab-home-quick-links { width: 100%; overflow-x: auto; }
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
    .crab-home-demo::before, .crab-home-hero-glow { display: none; }
    .crab-home-demo-surface, .crab-home-category-panel, .crab-home-capability-card, .crab-home-orbit-core, .crab-home-orbit-node { border: 1px solid CanvasText; }
    .crab-home-orbit-core, .crab-home-capability-mark { forced-color-adjust: none; background: Highlight; color: HighlightText; }
    .crab-home-status-dot { forced-color-adjust: none; background: Highlight; }
}
`;
