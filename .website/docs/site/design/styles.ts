import { globalStyle } from "@crab-dev/css";
import token, { TokenVars as semantic } from "@crab-dev/rc-token-semantic";
import global from "@crab-dev/rc-token-global";
import { TokenVars as button } from "@crab-dev/rc-button";
import { TokenVars as input } from "@crab-dev/rc-line-edit";
import { TokenVars as select } from "@crab-dev/rc-select";
import { TokenVars as segmented } from "@crab-dev/rc-segmented";
import { TokenVars as pagination } from "@crab-dev/rc-pagination";
import { TokenVars as card } from "@crab-dev/rc-card";
import { TokenVars as dialog } from "@crab-dev/rc-dialog";
import { TokenVars as dropdown } from "@crab-dev/rc-dropdown-container";
import { design } from "./tokens.js";
import "../paletteStyles.js";

// Only this page and its explicitly marked top-layer surfaces receive the proposal.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
.crab-language[data-theme], .crab-language-overlay[data-theme] {
    --crab-language-control: ${design.standard.control}px;
    ${semantic["font.size.body"]}: ${design.body.size};
    ${button["size.middle.height"]}: var(--crab-language-control);
    ${input["size.middle.height"]}: var(--crab-language-control);
    ${select["size.middle.height"]}: var(--crab-language-control);
    ${segmented["size.middle.height"]}: var(--crab-language-control);
    ${pagination["size.medium.height"]}: var(--crab-language-control);
    ${pagination["size.medium.min-width"]}: var(--crab-language-control);
    ${card["root.border-color"]}: ${token.color.border.subtle};
    ${card["root.box-shadow"]}: ${global.shadow.none};
    ${card["size.middle.border-radius"]}: ${token.radius.lg};
    ${dialog["root.border-radius"]}: ${token.radius.xl};
    ${dropdown["root.border-radius"]}: ${token.radius.xl};
    ${segmented["thumb.box-shadow"]}: ${global.shadow.none};
    ${segmented["item.color-selected"]}: ${token.color.selection.foreground};
    ${segmented["thumb.background-color"]}: ${token.color.selection.background};
    font-family: ${design.font};
    color: ${token.color.text.primary};
    font-size: ${design.body.size};
    line-height: ${design.body.line};
    font-variant-numeric: tabular-nums;
}
.crab-language[data-density="compact"], .crab-language-overlay[data-density="compact"] {
    --crab-language-control: ${design.compact.control}px;
}
.crab-language { min-width: 0; padding: ${token.space["group-gap"]}; background: ${token.color.background.sunken}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.xl}; }
.crab-language *, .crab-language-overlay * { box-sizing: border-box; }
.crab-language :is(h2,h3,h4,p,figure), .crab-language-overlay p { margin: 0; }
.crab-language h2 { font-size: ${design.title.size}; line-height: ${design.title.line}; font-weight: ${global.font.weight.semibold}; letter-spacing: -.025em; }
.crab-language h3 { font-size: ${design.heading.size}; line-height: ${design.heading.line}; font-weight: ${global.font.weight.semibold}; }
.crab-language h4 { font-size: ${design.body.size}; line-height: ${design.body.line}; }
.crab-language code { font-family: ${global.font.family.mono}; font-size: ${design.caption.size}; overflow-wrap: anywhere; }
.cl-stack { display: grid; grid-template-columns: minmax(0,1fr); gap: ${token.space["section-gap"]}; min-width: 0; }
.cl-stack > * { min-width: 0; }
.cl-section { display: grid; grid-template-columns: minmax(0,1fr); gap: ${token.space["section-gap"]}; margin-top: ${global.space[12]}; min-width: 0; }
.cl-row { display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["component-gap"]}; min-width: 0; }
.cl-between { justify-content: space-between; }
.cl-kicker { color: ${token.color.text.link}; font-size: ${design.caption.size}; font-weight: ${global.font.weight.semibold}; letter-spacing: .08em; }
.cl-muted { color: ${token.color.text.secondary}; }
.cl-caption { font-size: ${design.caption.size}; line-height: ${design.caption.line}; color: ${token.color.text.tertiary}; }
.cl-hero { display: grid; gap: ${token.space["section-gap"]}; padding-bottom: ${token.space["group-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; }
.cl-hero p { max-width: 60ch; }
.cl-controls + .cl-hero { padding-top: ${token.space["group-gap"]}; }
.cl-controls { display: flex; gap: ${token.space["group-gap"]}; flex-wrap: wrap; padding-block: ${token.space["section-gap"]}; border-bottom: 1px solid ${token.color.border.subtle}; }
.cl-control { display: grid; gap: ${token.space["component-gap"]}; min-width: 0; }
.cl-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: ${token.space["section-gap"]}; }
.cl-metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: ${token.space["stack-gap"]}; }
.cl-number { font-size: ${design.title.size}; line-height: ${design.title.line}; font-weight: ${global.font.weight.semibold}; }
.cl-panel { background: ${token.color.background.surface}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.radius.lg}; padding: ${token.space["section-gap"]}; min-width: 0; }
.cl-swatch { min-height: ${global.space[24]}; border-radius: ${token.radius.md}; padding: ${token.space["section-gap"]}; display: grid; align-content: space-between; gap: ${token.space["stack-gap"]}; border: 1px solid ${token.color.border.subtle}; }
.cl-brand { background: ${token.color.brand.primary}; color: ${token.color.text["on-brand"]}; }
.cl-selected { background: ${token.color.selection.background}; color: ${token.color.selection.foreground}; }
.cl-surface { background: ${token.color.background.surface}; color: ${token.color.text.primary}; }
.cl-elevated { background: ${token.color.background.elevated}; color: ${token.color.text.primary}; box-shadow: ${token.shadow.float}; }
.cl-scale { display: flex; gap: ${token.space["section-gap"]}; flex-wrap: wrap; align-items: baseline; }
.cl-scale strong { color: ${token.color.text.primary}; }
.cl-state { display: grid; gap: ${token.space["stack-gap"]}; align-content: start; }
.cl-state > :not(p) { justify-self: start; max-width: 100%; }
.cl-state-error { color: ${token.color.feedback.error.text}; }
.cl-toolbar-search { flex: 1 1 220px; min-width: 0; }
.cl-toolbar-filter { flex: 1 1 130px; min-width: 0; }
.cl-table-frame { height: 290px; min-width: 0; width: 100%; }
.cl-placeholder { display: grid; place-content: center; gap: ${token.space["section-gap"]}; min-height: 290px; }
.cl-field { display: grid; gap: ${token.space["component-gap"]}; min-width: 0; }
.cl-field input { width: 100%; }
.cl-fieldset { display: grid; grid-template-columns: minmax(0,1fr); gap: ${token.space["section-gap"]}; border: 0; padding: 0; margin: 0; min-width: 0; }
.cl-fieldset legend { padding: 0 0 ${token.space["section-gap"]}; font-weight: ${global.font.weight.semibold}; }
.cl-fieldset:disabled { opacity: ${token.opacity.disabled}; }
.cl-form-actions { border-top: 1px solid ${token.color.border.subtle}; padding-top: ${token.space["section-gap"]}; }
.cl-scroll { overflow-x: auto; min-width: 0; }
.cl-reference { border-collapse: collapse; width: 100%; font-size: ${design.caption.size}; }
.cl-reference :is(th,td) { padding: ${token.space["stack-gap"]}; text-align: left; vertical-align: top; border-bottom: 1px solid ${token.color.border.subtle}; min-width: 120px; }
.cl-reference th { color: ${token.color.text.secondary}; font-weight: ${global.font.weight.medium}; }
.cl-rules { padding-left: ${token.space["section-gap"]}; margin: 0; display: grid; gap: ${token.space["component-gap"]}; }
.crab-language-overlay { max-width: 100vw; }
@media (max-width: 600px) {
    .crab-language { padding: ${token.space["stack-gap"]}; }
    .cl-grid, .cl-metrics { grid-template-columns: minmax(0,1fr); }
    .cl-section { margin-top: ${token.space["group-gap"]}; }
    .cl-controls { gap: ${token.space["section-gap"]}; }
}
@media (pointer: coarse) {
    .crab-language[data-density], .crab-language-overlay[data-density] { --crab-language-control: ${design.touch}px; }
    .crab-language :is(button,[role="checkbox"],[role="radio"]), .crab-language-overlay :is(button,[role="checkbox"],[role="radio"]) { min-height: ${design.touch}px; min-width: ${design.touch}px; }
}
@media (prefers-reduced-motion: reduce) {
    .crab-language *, .crab-language-overlay * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
@media (forced-colors: active) {
    .crab-language[data-theme], .crab-language-overlay[data-theme] {
        ${semantic["color.brand.primary"]}: Highlight;
        ${semantic["color.brand.primary-hover"]}: Highlight;
        ${semantic["color.brand.primary-active"]}: Highlight;
        ${semantic["color.text.on-brand"]}: HighlightText;
        ${semantic["color.text.primary"]}: CanvasText;
        ${semantic["color.text.secondary"]}: CanvasText;
        ${semantic["color.text.tertiary"]}: CanvasText;
        ${semantic["color.text.link"]}: LinkText;
        ${semantic["color.background.sunken"]}: Canvas;
        ${semantic["color.background.surface"]}: Canvas;
        ${semantic["color.background.elevated"]}: Canvas;
        ${semantic["color.border.subtle"]}: CanvasText;
        ${semantic["color.border.default"]}: ButtonText;
        ${semantic["color.border.focus"]}: Highlight;
        ${semantic["color.focus.ring"]}: Highlight;
        ${semantic["color.selection.background"]}: Highlight;
        ${semantic["color.selection.foreground"]}: HighlightText;
        ${semantic["color.selection.border"]}: Highlight;
    }
    .crab-language :focus-visible, .crab-language-overlay :focus-visible { outline: 2px solid Highlight; outline-offset: 2px; }
    .cl-swatch { border: 1px solid CanvasText; box-shadow: none; }
}
`;
