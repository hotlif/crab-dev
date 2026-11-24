import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-editor-prototype { max-inline-size: 71rem; margin-inline: auto; }
.crab-editor-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-editor-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-editor-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-editor-prototype .crab-design-body { container-type: inline-size; }
.crab-editor-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: .8rem;
    min-inline-size: 0;
    padding: clamp(.75rem, 2.3cqi, 1.25rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-editor-stage > :is(button, a) { justify-self: start; }
.crab-editor-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem .65rem; }
.crab-editor-status, .crab-editor-rules dd, .crab-editor-hint { margin: 0; color: ${token.color.text.secondary}; font-size: .875rem; overflow-wrap: anywhere; }
.crab-editor-status { min-block-size: 1.45rem; }
.crab-editor-rules { display: grid; gap: .5rem; margin: 0; }
.crab-editor-rules > div { display: grid; grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr); gap: .25rem .75rem; align-items: baseline; }
.crab-editor-viewport {
    box-sizing: border-box;
    display: grid;
    width: 100%;
    min-height: 15rem;
    min-width: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    background: ${token.color.surface.content};
    overflow: hidden;
    position: relative;
}
.crab-editor-viewport > canvas { display: block; }
.crab-editor-viewport:focus-visible, .crab-editor-node:focus-visible {
    outline: 2px solid ${token.color.border.focus};
    outline-offset: 3px;
}
.crab-editor-placeholder { min-block-size: 16rem; display: grid; align-items: center; padding: .8rem; }
.crab-editor-modebar { display: flex; flex-wrap: wrap; gap: .45rem .65rem; align-items: center; }
.crab-editor-pdf-editor { block-size: 31rem; min-inline-size: 0; max-inline-size: 100%; }
.crab-editor-pdf-shell { min-inline-size: 0; }
.crab-editor-view-status { font-variant-numeric: tabular-nums; }
.crab-editor-prototype[data-prototype-design="md3"] .crab-editor-stage { border-color: transparent; background: ${token.color.surface.low}; }
.crab-editor-prototype[data-prototype-design="macos"] { max-inline-size: 63rem; }
.crab-editor-prototype[data-prototype-design="macos"] .crab-editor-stage { gap: .6rem; }
.crab-editor-prototype[data-prototype-design="shadcn"] .crab-editor-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 24rem) {
    .crab-editor-rules > div { grid-template-columns: minmax(0, 1fr); }
    .crab-editor-pdf-editor { block-size: 24rem; }
}
@media (forced-colors: active) {
    .crab-editor-prototype[data-prototype-design="md3"] .crab-editor-stage, .crab-editor-viewport { border-color: CanvasText; }
    .crab-editor-viewport:focus-visible, .crab-editor-node:focus-visible { outline-color: Highlight; }
}
`;
