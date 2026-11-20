import { globalStyle } from "@crab-dev/css";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-matrix { min-width: 0; container: button-matrix / inline-size; scroll-margin-block-start: 5rem; }
.crab-design-states { width: 100%; margin: 0; border-spacing: 0; background: ${token.color.surface.content}; border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; overflow: hidden; font-size: .85rem; }
.crab-design-states :is(th, td) { padding: .7rem .35rem; text-align: center; vertical-align: middle; }
.crab-design-states tr > :first-child { padding-inline-start: 1rem; text-align: start; }
.crab-design-states thead { color: ${token.color.text.secondary}; background: ${token.color.surface.low}; }
.crab-design-states thead th { font-size: .78rem; font-weight: 550; }
.crab-design-states tbody :is(td, th) { border-block-start: 1px solid ${token.color.border.subtle}; }
.crab-design-states tbody th { font-weight: 600; }
.crab-design-states th small { display: block; font-size: .72rem; font-weight: 400; }
.crab-design-cell-label { display: none; }
.crab-design-swatch, .crab-design-swatch > span { display: inline-flex; vertical-align: middle; }
.crab-design-swatch { pointer-events: none; }
.crab-design-swatch[data-state="hover"] { --crab-sample-tint: calc(var(${buttonVars["state-layer.opacity-hover"]}, ${token.state.opacity.hover}) * 100%); }
.crab-design-swatch[data-state="press"] { --crab-sample-tint: calc(var(${buttonVars["state-layer.opacity-active"]}, .1) * 100%); }
.crab-design-matrix .crab-design-states .crab-design-swatch:is([data-state="hover"], [data-state="press"]) button,
.crab-design-workspace[data-prototype-design="md3"] .crab-design-swatch[data-state="focus"] button {
    --crab-sample-layer: color-mix(in srgb, var(--crab-sample-ink, currentColor) var(--crab-sample-tint), transparent);
    background-image: linear-gradient(var(--crab-sample-layer), var(--crab-sample-layer));
}
.crab-design-swatch[data-state="focus"] button {
    outline: var(${buttonVars["root.outline-width-focus"]}, 3px) solid var(${buttonVars["root.outline-color-focus"]}, ${token.color.secondary.primary});
    outline-offset: var(${buttonVars["root.outline-offset-focus"]}, 2px);
}
[data-prototype-design="md3"] .crab-design-swatch[data-state="focus"] button {
    --crab-sample-tint: calc(var(${buttonVars["state-layer.opacity-focus"]}, .1) * 100%);
}
[data-prototype-design="macos"] .crab-design-swatch[data-state="focus"] button {
    outline-color: var(${buttonVars["macos.control.outline-color"]}, var(${buttonVars["root.outline-color-focus"]}, ${token.color.focus.ring}));
}
.crab-design-workspace .crab-design-swatch-note {
    border-inline: 1px solid var(--crab-prototype-rule);
    padding: .75rem 1rem;
    background: var(--crab-prototype-paper);
    color: ${token.color.text.secondary};
    font-size: .82rem;
}
[data-prototype-design="macos"] .crab-design-states { --crab-sample-ink: ${token.color.text.primary}; }
[data-prototype-design="macos"] .crab-design-swatch[data-state="hover"] { --crab-sample-tint: 4%; }
[data-prototype-design="macos"] .crab-design-swatch[data-state="press"] button { box-shadow: var(${buttonVars["macos.control.box-shadow-active"]}, inset 0 1px 3px color-mix(in oklch, ${token.color.text.primary} 12%, transparent)); }
@container button-matrix (max-width: 55rem) {
    .crab-design-states, .crab-design-states tbody { display: grid; }
    .crab-design-states { border: 0; border-radius: 0; background: transparent; overflow: visible; }
    .crab-design-states tbody { gap: .65rem; }
    .crab-design-states thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .crab-design-states tbody tr { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); border: 1px solid ${token.color.border.subtle}; border-radius: ${token.shape.card}; background: ${token.color.surface.content}; overflow: hidden; }
    .crab-design-states tbody th { grid-column: 1/-1; padding-block: .55rem; border: 0; background: ${token.color.surface.low}; }
    .crab-design-states th small { display: inline; margin-inline-start: .5rem; }
    .crab-design-states td { display: grid; justify-items: center; align-items: center; gap: .55rem; padding-block: .65rem .85rem; }
    .crab-design-cell-label { display: block; color: ${token.color.text.secondary}; font-size: .72rem; }
}
@container button-matrix (max-width: 40rem) {
    .crab-design-states tbody tr { grid-template-columns: repeat(3,minmax(0,1fr)); }
}
@container button-matrix (max-width: 20rem) {
    .crab-design-states tbody tr { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (forced-colors: active) {
    .crab-design-matrix .crab-design-states .crab-design-swatch[data-state] button { background-image: none; }
    .crab-design-matrix .crab-design-swatch[data-state="focus"] button { outline-color: Highlight; }
    .crab-design-swatch[data-state="press"] button { outline: 1px solid Highlight; outline-offset: -3px; }
}
`;
