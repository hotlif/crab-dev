import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-slider-prototype] { --crab-slider-surface: ${token.color.surface.content}; max-inline-size: 61rem; margin-inline: auto; }
[data-slider-prototype] .crab-design-hero {
    min-height: auto; padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0; border: 0; background: transparent;
}
[data-slider-prototype] .crab-design-hero > div:first-child { max-inline-size: 100%; }
[data-slider-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-slider-prototype] .crab-design-body { container-type: inline-size; }
.crab-slider-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: .8rem; align-items: start; }
.crab-slider-panel {
    display: grid;
    gap: .85rem;
    min-inline-size: 0;
    padding: clamp(.9rem, 2.5cqi, 1.4rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: var(--crab-slider-surface);
}
.crab-slider-heading { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .25rem .75rem; align-items: baseline; }
.crab-slider-current { font-size: 1.5rem; font-variant-numeric: tabular-nums; font-weight: 700; }
.crab-slider-control p, .crab-slider-chart p, .crab-slider-rules dd { font-size: .875rem; color: ${token.color.text.secondary}; }
.crab-slider-control > button, .crab-slider-rules > a { justify-self: start; }
.crab-slider-track-area, .crab-slider-disabled > [role="slider"] { margin-inline: .45rem; }
.crab-slider-scale, .crab-slider-axis { color: ${token.color.text.secondary}; font-size: .75rem; font-variant-numeric: tabular-nums; }
.crab-slider-scale { display: flex; justify-content: space-between; }
.crab-slider-graph { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .55rem; margin-block-end: 1.35rem; }
.crab-slider-axis { display: flex; flex-direction: column; justify-content: space-between; text-align: end; }
.crab-slider-plot {
    position: relative;
    block-size: clamp(7.5rem, 24cqi, 10.5rem);
    border-block-end: 1px solid ${token.color.border.subtle};
}
.crab-slider-threshold-line {
    position: absolute; z-index: 2; inset-inline: 0;
    border-block-start: 1px dashed ${token.color.feedback.error.text};
    pointer-events: none;
}
.crab-slider-bars {
    display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: clamp(.15rem, 1cqi, .65rem);
    block-size: 100%; padding: 0; margin: 0; list-style: none; text-align: center;
}
.crab-slider-bars li { position: relative; display: grid; justify-items: center; align-items: end; min-inline-size: 0; }
.crab-slider-bar {
    position: relative;
    inline-size: min(70%, 2.35rem);
    background: ${token.color.brand.primary};
    border-start-start-radius: .24rem; border-start-end-radius: .24rem;
}
.crab-slider-bars [data-threshold-crossed="true"] .crab-slider-bar { background: ${token.color.feedback.error.text}; }
.crab-slider-bar > span, .crab-slider-time { font-size: .69rem; font-variant-numeric: tabular-nums; white-space: nowrap; }
.crab-slider-bar > span {
    position: absolute; z-index: 3; inset-inline: 0; inset-block-start: -1.2em;
    font-weight: 650; background: var(--crab-slider-surface);
}
.crab-slider-time { position: absolute; inset-block-start: calc(100% + .25rem); color: ${token.color.text.secondary}; }
.crab-slider-legend { display: flex; align-items: baseline; gap: .45rem; }
.crab-slider-legend span { flex: 0 0 1rem; border-block-start: 1px dashed ${token.color.feedback.error.text}; }
.crab-slider-disabled { max-inline-size: 31rem; }
.crab-slider-rules dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .5rem 1rem; margin: 0; }
.crab-slider-rules dd { margin: 0; }
[data-slider-prototype][data-prototype-design="md3"] { --crab-slider-surface: ${token.color.surface.low}; }
[data-slider-prototype][data-prototype-design="md3"] .crab-slider-panel { border-color: transparent; }
[data-slider-prototype][data-prototype-design="macos"] { max-inline-size: 54rem; }
[data-slider-prototype][data-prototype-design="macos"] .crab-slider-panel { gap: .65rem; }
[data-slider-prototype][data-prototype-design="macos"] .crab-slider-current { font-size: 1.25rem; }
[data-slider-prototype][data-prototype-design="shadcn"] .crab-slider-panel { border-radius: ${token.radius.lg}; }
[data-slider-prototype][data-prototype-design="shadcn"] [data-threshold-crossed="false"] .crab-slider-bar { background: ${token.color.text.primary}; }
@container (max-width: 41rem) { .crab-slider-layout { grid-template-columns: minmax(0, 1fr); } }
@container (max-width: 24rem) {
    .crab-slider-rules dl { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
    .crab-slider-rules dd + dt { margin-block-start: .4rem; }
}
`;
