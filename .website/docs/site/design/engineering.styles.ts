import { globalStyle } from "@crab-dev/css";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-workspace[data-prototype-design="md3"] {
    --crab-prototype-paper: oklch(from ${token.color.surface.content} l min(c, .005) h);
    --crab-prototype-panel: oklch(from ${token.color.surface.low} l min(c, .007) h);
    --crab-prototype-rule: ${token.color.border.subtle};
}
[data-button-prototype][data-prototype-design="md3"] :is(button, a) {
    ${buttonVars['shape.default.border-radius-active']}: var(${buttonVars['shape.default.border-radius']}, ${token.shape.button});
    ${buttonVars['shape.default.border-radius-selected']}: var(${buttonVars['shape.default.border-radius']}, ${token.shape.button});
}
[data-button-prototype][data-prototype-design="md3"] button[data-prototype-round] {
    ${buttonVars['root.border-radius-active']}: calc(var(${buttonVars['root.height']}) / 2);
    ${buttonVars['root.border-radius']}: calc(var(${buttonVars['root.height']}) / 2);
}
[data-prototype-design="md3"] .crab-design-hero { min-height: auto; padding: 1.25rem clamp(.75rem, 2.4vw, 2rem) 1.1rem; border-radius: 0; border-block-end: 1px solid var(--crab-prototype-rule); background: transparent; }
[data-prototype-design="md3"] .crab-design-hero > div:first-child { max-width: 56rem; }
[data-prototype-design="md3"] .crab-design-hero h1 { font-size: clamp(1.75rem,3vw,2.45rem); letter-spacing: -.035em; }
[data-prototype-design="md3"] .crab-design-jump-links { gap: .4rem 1.25rem; margin-block-start: .9rem; }
[data-prototype-design="md3"] .crab-design-jump-links a { text-underline-offset: .2em; }
[data-prototype-design="md3"] .crab-design-body { gap: clamp(1.6rem, 3vw, 2.4rem); }
[data-prototype-design="md3"] .crab-design-section-head h2 { font-size: 1.25rem; }
[data-prototype-design="md3"] :is(.crab-design-experiment, .crab-design-motion-board) { display: grid; grid-template-columns: minmax(0,1.7fr) minmax(18rem,1fr); border: 1px solid var(--crab-prototype-rule); border-radius: .8rem; background: var(--crab-prototype-paper); }
[data-prototype-design="md3"] .crab-design-stage { display: block; padding: 0; background: var(--crab-prototype-paper); }
[data-prototype-design="md3"] .crab-design-stage form { box-sizing: border-box; width: 100%; height: 100%; padding: 0; gap: 0; align-content: start; border: 0; border-radius: 0; box-shadow: none; background: transparent; }
[data-prototype-design="md3"] .crab-design-stage form h3 { display: flex; align-items: center; gap: .5rem; margin: 0; padding: .9rem 1.2rem; font-size: .93rem; border-block-end: 1px solid var(--crab-prototype-rule); }
[data-prototype-design="md3"] .crab-design-stage form h3 svg { width: 1.1rem; height: 1.1rem; color: ${token.color.text.secondary}; }
[data-prototype-design="md3"] .crab-design-form-field { display: grid; grid-template-columns: minmax(8rem,1fr) auto; gap: .85rem 1.1rem; align-items: end; padding: 1.2rem; }
.crab-design-start-view { display: grid; gap: .4rem; justify-items: start; }
.crab-design-start-view > span { font-size: .82rem; font-weight: 550; }
.crab-design-applied { display: flex; flex-wrap: wrap; gap: .4rem 1rem; margin: 0 1.2rem 1.2rem; padding: .6rem .8rem; border-inline-start: 2px solid ${token.color.border.default}; background: var(--crab-prototype-panel); font-size: .84rem; }
.crab-design-applied dt { color: ${token.color.text.secondary}; }
.crab-design-applied dd { margin: 0; overflow-wrap: anywhere; }
[data-prototype-design="md3"] .crab-design-form-footer { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: .75rem; align-items: center; padding: .85rem 1.2rem; border-block-start: 1px solid var(--crab-prototype-rule); }
[data-prototype-design="md3"] .crab-design-form-footer .crab-design-actions { margin-inline-start: auto; }
[data-prototype-design="md3"] .crab-design-form-footer .crab-design-feedback { grid-row: 1; grid-column: 1; }
[data-prototype-design="md3"] :is(.crab-design-settings, .crab-design-motion-controls) { align-content: start; gap: .7rem; padding: 1rem 1.2rem; background: var(--crab-prototype-panel); border-inline-start: 1px solid var(--crab-prototype-rule); }
[data-prototype-design="md3"] .crab-design-settings h3 { font-size: .93rem; }
[data-prototype-design="md3"] .crab-design-motion-stage { min-height: 10rem; }
[data-prototype-design="md3"] .crab-design-swatch[data-kind="primary"][data-candidate="true"] button { inline-size: 7rem; max-inline-size: 100%; }
.crab-design-presets { display: flex; flex-wrap: wrap; gap: .6rem; padding: 0; margin: 0; list-style: none; font-size: .8rem; }
.crab-design-presets li { padding: .25rem .5rem; background: var(--crab-prototype-panel); }
.crab-design-kind-picker { display: flex; gap: 1rem 2rem; flex-wrap: wrap; padding: 1rem; border: 1px solid var(--crab-prototype-rule); border-radius: .8rem .8rem 0 0; background: var(--crab-prototype-paper); }
.crab-design-kind-group { display: grid; align-content: start; gap: .65rem; }
.crab-design-kind-group h3 { font-size: .82rem; color: ${token.color.text.secondary}; }
.crab-design-kind-group > div { display: flex; flex-wrap: wrap; gap: .55rem; }
.crab-design-kind-group button[aria-pressed="true"] { text-decoration: underline; text-underline-offset: .22em; }
.crab-design-matrix .crab-design-states { border-radius: 0 0 .8rem .8rem; border-block-start: 0; background: var(--crab-prototype-paper); }
.crab-design-immediate { color: ${token.color.text.secondary}; font-size: .77rem; }
.crab-design-overview-sample, [data-prototype-design="md3"] .crab-design-flow { min-height: 8.3rem; display: grid; place-content: center; gap: .65rem; padding: 1rem; box-sizing: border-box; background: var(--crab-prototype-panel); }
.crab-design-overview-sample strong { font-size: .88rem; }
.crab-design-overview-sample div { display: flex; gap: .6rem; }
[data-prototype-design="md3"] .crab-design-flow::before { display: none; }
.crab-design-overview-readout { display: grid; grid-template-columns: auto 1fr; margin: 0; padding: .7rem 1.1rem; gap: .45rem 1.5rem; border: 1px solid var(--crab-prototype-rule); background: var(--crab-prototype-paper); border-radius: .5rem; font-size: .84rem; }
.crab-design-overview-readout dt { color: ${token.color.text.secondary}; }
.crab-design-overview-readout dd { margin: 0; }
@media(max-width: 980px) {
    [data-prototype-design="md3"] .crab-design-form-field { grid-template-columns: minmax(0,1fr); }
}
@media(max-width: 800px) {
    [data-prototype-design="md3"] :is(.crab-design-experiment, .crab-design-motion-board) { grid-template-columns: minmax(0,1fr); }
    [data-prototype-design="md3"] :is(.crab-design-settings, .crab-design-motion-controls) { border-inline-start: 0; border-block-start: 1px solid var(--crab-prototype-rule); }
}
@media(max-width: 480px) {
    [data-prototype-design="md3"] .crab-design-form-footer { grid-template-columns: minmax(0,1fr); }
}
`;
