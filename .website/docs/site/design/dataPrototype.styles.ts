import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-data-prototype { max-inline-size: 72rem; margin-inline: auto; }
.crab-data-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-data-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-data-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-data-prototype .crab-design-body { container-type: inline-size; }
.crab-data-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: .7rem;
    min-inline-size: 0;
    padding: clamp(.75rem, 2.3cqi, 1.25rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-data-stage > :is(button, a) { justify-self: start; }
.crab-data-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem .65rem; }
.crab-data-status, .crab-data-rules dd { margin: 0; color: ${token.color.text.secondary}; font-size: .875rem; overflow-wrap: anywhere; }
.crab-data-status { min-block-size: 1.45rem; }
.crab-data-rules { display: grid; gap: .5rem; margin: 0; }
.crab-data-rules > div { display: grid; grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr); gap: .25rem .75rem; align-items: baseline; }
.crab-data-viewport {
    inline-size: 100%;
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
}
.crab-data-table-pro { inline-size: 100%; block-size: 31rem; min-inline-size: 0; }
.crab-data-table-value { min-inline-size: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.crab-data-chart { padding: .6rem; min-inline-size: 0; }
.crab-data-chart-unit { margin: 0 0 .25rem; color: ${token.color.text.secondary}; font-size: .75rem; text-align: end; }
.crab-data-prototype[data-prototype-design="md3"] .crab-data-stage { border-color: transparent; background: ${token.color.surface.low}; }
.crab-data-prototype[data-prototype-design="macos"] { max-inline-size: 61rem; }
.crab-data-prototype[data-prototype-design="macos"] .crab-data-stage { gap: .6rem; }
.crab-data-prototype[data-prototype-design="shadcn"] .crab-data-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 24rem) {
    .crab-data-rules > div { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) {
    .crab-data-prototype[data-prototype-design="md3"] .crab-data-stage, .crab-data-viewport { border-color: CanvasText; }
}
`;
