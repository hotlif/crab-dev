import { css, defineTokens, globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";

// Geometry belongs only to this reference page, not to public component defaults.
const stage = defineTokens({ column: "128px", rowLabel: "144px", touch: "44px", swatch: "56px", sample: "64px", line: "8px", detail: "176px", layerWidth: "144px", layerHeight: "72px", scene: "176px", stroke: "1px", focus: "2px" });

// Reference chapters need extra separation between complete token catalogues.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
    .crab-docs-prose:has(.tgr-item) > h2 { margin-top: ${globalToken.space[12]}; }
`;

export const referenceStyle = css`
    min-width: 0;
    margin-block: ${token.space["group-gap"]};
    color: ${token.color.text.primary};
    font-size: ${token.font.size.body};
    line-height: ${token.font["line-height"].body};
    & * { box-sizing: border-box; }
    & .tgr-caption { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: ${token.space["component-gap"]}; color: ${token.color.text.secondary}; }
    & .tgr-family { margin-top: ${globalToken.space[8]}; min-width: 0; }
    & .tgr-family h3 { margin-block: 0 ${token.space["stack-gap"]}; font-size: ${token.font.size.subhead}; }
    & .tgr-item { min-width: 0; }
    & .tgr-stage { display: flex; align-items: center; min-width: 0; }
    & .tgr-sample { display: block; flex-shrink: 0; width: ${stage.sample}; height: ${stage.sample}; background: ${token.color.fill.active}; }
    & .tgr-info { display: grid; gap: ${token.space["inline-gap"]}; min-width: 0; }
    & :is(.tgr-info strong, .tgr-tone) { font-weight: ${token.font.weight.label}; overflow-wrap: anywhere; }
    & .tgr-summary { display: block; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; overflow-wrap: anywhere; }
    & code { white-space: normal; overflow-wrap: anywhere; font-family: ${globalToken.font.family.mono}; font-size: ${token.font.size.caption}; background: none; padding: 0; }
    & .tgr-details { min-width: 0; padding-block: ${token.space["component-gap"]}; }
    & .tgr-details dl { display: grid; gap: ${token.space["component-gap"]}; margin: 0; }
    & .tgr-details dl > div { display: grid; grid-template-columns: ${globalToken.space[20]} minmax(0,1fr); gap: ${token.space["component-gap"]}; }
    & .tgr-details dt { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
    & .tgr-details dd { min-width: 0; margin: 0; }
    & .tgr-detail-actions { display: flex; flex-wrap: wrap; gap: ${token.space["component-gap"]}; margin-top: ${token.space["component-gap"]}; }
    & .tgr-copy { display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["inline-gap"]}; }
    & .tgr-copy [role="status"] { font-size: ${token.font.size.caption}; color: ${token.color.text.secondary}; }
    & .tgr-expression { color: ${token.color.text.link}; }
    & .tgr-list { display: grid; gap: ${token.space["stack-gap"]}; }
    & .tgr-list > .tgr-item { display: grid; grid-template-columns: minmax(0, ${stage.rowLabel}) minmax(0,1fr) auto; gap: ${token.space["component-gap"]} ${token.space["section-gap"]}; align-items: center; min-height: ${stage.touch}; }
    & .tgr-expanded { grid-column: 1 / -1; padding: ${token.space["stack-gap"]} ${token.space["section-gap"]}; background: ${token.color.background.sunken}; border-radius: ${token.radius.md}; }
    & .tgr-expanded[hidden] { display: none; }
    & .tgr-code-toggle { justify-self: end; min-height: ${stage.touch}; }
    & .tgr-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, ${stage.column}), 1fr)); column-gap: ${token.space["section-gap"]}; row-gap: ${token.space["group-gap"]}; background: ${token.color.background.sunken}; padding: ${token.space["section-gap"]}; border-radius: ${token.radius.lg}; }
    & .tgr-gallery .tgr-sample { margin: ${token.space["section-gap"]} auto; }
    & button.tgr-color-choice { display: flex; flex-direction: column; justify-content: start; align-items: stretch; width: 100%; height: auto; min-width: 0; padding: 0; gap: 0; border: 0; background: transparent; box-shadow: none; border-radius: 0; color: ${token.color.text.primary}; }
    & button.tgr-color-choice > span { display: block; width: 100%; min-width: 0; white-space: normal; }
    & button.tgr-color-choice:not(:disabled):is(:hover, :active) { background: transparent; }
    & button.tgr-color-choice:hover .tgr-tone { background: ${token.color.background["hover-subtle"]}; }
    & button.tgr-color-choice[aria-pressed="true"] .tgr-tone { font-weight: ${token.font.weight.heading}; }
    & .tgr-tone { display: flex; justify-content: center; align-items: center; min-height: ${stage.touch}; gap: ${token.space["inline-gap"]}; font-size: ${token.font.size.caption}; }
    & .tgr-check { display: inline-block; width: ${globalToken.space[3]}; color: ${token.color.text.link}; }
    & .tgr-color-strip { display: flex; overflow-x: auto; padding: ${token.space["inline-gap"]}; margin-inline: calc(-1 * ${token.space["inline-gap"]}); }
    & .tgr-color-strip > .tgr-item { flex: 1 0 ${stage.touch}; }
    & .tgr-color-strip .tgr-sample { width: 100%; height: ${stage.swatch}; forced-color-adjust: none; }
    & .tgr-color-strip > .tgr-item:first-child .tgr-sample { border-radius: ${token.radius.md} 0 0 ${token.radius.md}; }
    & .tgr-color-strip > .tgr-item:last-child .tgr-sample { border-radius: 0 ${token.radius.md} ${token.radius.md} 0; }
    & .tgr-color-strip [data-token-key$=".50"] .tgr-sample, & .tgr-color-strip [data-token-key="white"] .tgr-sample { box-shadow: inset 0 0 0 ${stage.stroke} ${token.color.border.subtle}; }
    & .tgr-color-detail { padding-top: ${token.space["component-gap"]}; min-height: ${stage.detail}; }
    & .tgr-selection { margin: 0 0 ${token.space["component-gap"]}; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; }
    & .tgr-selection strong { color: ${token.color.text.primary}; }
    & .tgr-hint { color: ${token.color.text.secondary}; font-size: ${token.font.size.caption}; margin-block: ${token.space["component-gap"]}; }
    &[data-group="space"] .tgr-sample { height: ${stage.line}; border-radius: ${token.radius.sm}; }
    &[data-group="radius"] .tgr-sample { border: ${stage.focus} solid ${token.color.text.link}; background: transparent; }
    &[data-group="typography"] .tgr-sample { width: 100%; height: auto; background: none; overflow-wrap: anywhere; color: ${token.color.text.primary}; }
    &[data-group="typography"] [data-token-key^="font.family."] .tgr-sample { font-size: ${token.font.size.heading}; }
    &[data-group="shadow"] .tgr-sample { background: ${token.color.background.surface}; border-radius: ${token.radius.md}; }
    &[data-group="shadow"] .tgr-color-detail { min-height: calc(${stage.detail} + ${globalToken.space[8]}); }
    &[data-group="opacity"] .tgr-sample { display: grid; place-items: center; background: ${token.color.fill.active}; color: ${token.color.background.surface}; font-size: ${token.font.size.heading}; }
    & .tgr-layer-layout { margin-top: ${token.space["group-gap"]}; }
    & .tgr-layer-scene { position: relative; isolation: isolate; min-height: ${stage.scene}; margin-bottom: ${token.space["group-gap"]}; }
    & .tgr-layer-scene .tgr-sample { position: absolute; display: grid; place-items: center; width: ${stage.layerWidth}; height: ${stage.layerHeight}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; border: ${stage.stroke} solid ${token.color.border.subtle}; border-radius: ${token.radius.md}; font-family: ${globalToken.font.family.mono}; }
    & .tgr-list > .tgr-layer-row { grid-template-columns: minmax(0,1fr) auto; }
    & .tgr-layer-row .tgr-info { display: flex; align-items: baseline; gap: ${token.space["section-gap"]}; }
    &[data-group="motion"] .tgr-sample { width: ${token.space["group-gap"]}; height: ${token.space["group-gap"]}; border-radius: ${token.radius.pill}; transition-property: transform; transition-duration: ${globalToken.duration.slow}; transition-timing-function: ${globalToken.easing.out}; }
    &[data-moving="true"] .tgr-sample { transform: translateX(${globalToken.space[24]}); }
    & .tgr-reduced { display: none; }
    & :focus-visible { outline: ${stage.focus} solid ${token.color.border.focus}; outline-offset: ${stage.focus}; }
    @media (min-width: 1280px) { & .tgr-layer-layout { display: grid; grid-template-columns: calc(${globalToken.space[16]} * 4) minmax(0,1fr); gap: ${token.space["group-gap"]}; } }
    @media (max-width: 767px) {
        & .tgr-gallery { grid-template-columns: repeat(2,minmax(0,1fr)); padding: ${token.space["component-gap"]}; }
        & .tgr-list > .tgr-item:not(.tgr-layer-row) { grid-template-columns: minmax(0,1fr) auto; }
        & .tgr-list .tgr-stage { grid-column: 1 / -1; grid-row: 2; padding-bottom: ${token.space["stack-gap"]}; }
        & .tgr-list .tgr-code-toggle { grid-row: 1; grid-column: 2; }
        & .tgr-color-detail { min-height: calc(${stage.detail} + ${globalToken.space[8]}); }
        &[data-group="shadow"] .tgr-color-detail { min-height: calc(${stage.detail} + ${globalToken.space[20]}); }
    }
    @media (prefers-reduced-motion: reduce) {
        &[data-group="motion"] .tgr-sample { transition: none !important; }
        & .tgr-reduced { display: block; }
    }
    @media (forced-colors: active) { & .tgr-sample { outline: ${stage.stroke} solid CanvasText; } }
    @media (pointer: coarse) { & button { min-height: ${stage.touch}; } }
`;
