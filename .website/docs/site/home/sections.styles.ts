import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { home } from "./metrics.js";

globalStyle`
.crab-home-section, .crab-home-demo { padding: ${globalToken.space[10]} ${globalToken.space[6]}; }
.crab-home-section-heading { display: flex; align-items: end; justify-content: space-between; gap: ${token.space["group-gap"]}; margin-bottom: ${globalToken.space[6]}; }
.crab-home-section-heading > div:first-child { min-width: 0; }
.crab-home-section-heading h2 { margin-top: ${token.space["component-gap"]}; font-size: ${home.title}; line-height: ${token.typography.headline.large["line-height"]}; letter-spacing: 0; font-weight: ${token.typography.headline.large["font-weight"]}; text-wrap: balance; }
.crab-home-section-note, .crab-home-secondary { color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; line-height: 1.7; }
.crab-home-section-note { max-width: 44rem; margin-top: ${token.space["stack-gap"]}; }
.crab-home-secondary { max-width: 26rem; }
.crab-home-catalog-action { flex: none; min-height: ${home.touch}; }

.crab-home-demo-heading { align-items: start; }
.crab-home-theme-controls { display: flex; flex-wrap: wrap; justify-content: end; gap: ${token.space["stack-gap"]}; }
.crab-home-theme-controls > div { display: grid; gap: ${token.space["inline-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
.crab-home-demo-surface { min-width: 0; padding: ${token.space["section-gap"]}; border: 1px solid ${token.color.border.subtle}; border-radius: ${home.demoRadius}; background: ${token.color.surface.content}; color: ${token.color.text.primary}; box-shadow: none; }
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
.crab-home-account-mark { display: grid; place-items: center; justify-self: center; width: ${globalToken.space[12]}; aspect-ratio: 1; border-radius: ${token.shape.card}; background: ${token.color.surface.low}; color: ${token.color.text.primary}; font-size: ${token.font.size.heading}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
.crab-home-divider { position: relative; display: grid; place-items: center; color: ${token.color.text.tertiary}; font-size: ${token.font.size.caption}; }
.crab-home-divider::before { content: ""; position: absolute; inset-inline: 0; border-top: 1px solid ${token.color.border.subtle}; }
.crab-home-divider span { position: relative; padding-inline: ${token.space["stack-gap"]}; background: ${token.color.background.elevated}; }
.crab-home-tag-row, .crab-home-button-row { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; }
.crab-home-demo-feedback { display: block; min-height: ${globalToken.space[8]}; margin-top: ${token.space["section-gap"]}; padding: ${token.space["stack-gap"]} ${token.space["section-gap"]}; border-radius: ${token.radius.md}; background: ${token.color.background.surface}; color: ${token.color.text.secondary}; font-size: ${token.font.size.body}; }

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
    .crab-home-component-wall { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (max-width: 959px) {

    .crab-home-section-heading, .crab-home-demo-heading { align-items: start; flex-direction: column; }
    .crab-home-theme-controls { justify-content: start; }
    .crab-home-practices { grid-template-columns: minmax(0,1fr); }
}
@media (max-width: 767px) {
    .crab-home-component-wall { grid-template-columns: minmax(0,1fr); }
    .crab-home-section, .crab-home-demo { padding: ${globalToken.space[10]} ${globalToken.space[4]}; }
    .crab-home-lead { font-size: ${token.typography.body.large["font-size"]}; line-height: ${token.typography.body.large["line-height"]}; }
    .crab-home-section-heading h2 { font-size: ${home.titleSmall}; }
    .crab-home-demo-surface { padding: ${token.space["stack-gap"]}; }
    .crab-home-theme-controls { width: 100%; display: grid; justify-content: stretch; }
    .crab-home-theme-controls > label { min-width: 0; }
}
@media (max-width: 359px) {
    .crab-home-actions { width: 100%; }
    .crab-home-actions > a { width: 100%; }
    .crab-home-inline-fields { grid-template-columns: minmax(0,1fr); }
    .crab-home-color-field { justify-items: stretch; }
    .crab-home-practices > article { grid-template-columns: auto minmax(0,1fr); }
    .crab-home-practices article > a { grid-column: 2; }
}
@media (forced-colors: active) {
    .crab-home-demo-surface { border: 1px solid CanvasText; }
    .crab-home-status-dot { forced-color-adjust: none; background: Highlight; }
}
`;
