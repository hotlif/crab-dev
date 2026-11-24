import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-picker-prototype { max-inline-size: 61rem; margin-inline: auto; }
.crab-picker-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-picker-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-picker-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-picker-prototype .crab-design-body { container-type: inline-size; }
.crab-picker-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(15rem, 1fr);
    align-items: start;
    gap: .8rem;
}
.crab-picker-panel {
    display: grid;
    gap: .85rem;
    padding: clamp(.85rem, 2.3cqi, 1.35rem);
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-picker-panel > :is(button, a) { justify-self: start; }
.crab-picker-panel :is(h3, p) { margin: 0; }
.crab-picker-layout .crab-picker-heading, .crab-picker-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .55rem .75rem;
}
.crab-picker-heading { justify-content: space-between; }
.crab-picker-support, .crab-picker-rules dd { color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-picker-range, .crab-picker-manual {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: .55rem;
}
.crab-picker-manual { grid-template-columns: minmax(0, 1fr) auto; }
.crab-picker-rules { display: grid; gap: .42rem; margin: 0; }
.crab-picker-rules > div {
    display: grid;
    grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr);
    gap: .25rem .75rem;
    align-items: baseline;
}
.crab-picker-rules dd { margin: 0; overflow-wrap: anywhere; }
.crab-picker-color-previews {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: .45rem;
}
.crab-picker-chart {
    margin: 0;
    min-inline-size: 0;
    padding: .5rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: .55rem;
    background: Canvas;
    color: CanvasText;
    color-scheme: light;
}
.crab-picker-chart[data-chart-mode="dark"] { color-scheme: dark; }
.crab-picker-chart figcaption { font-size: .78rem; }
.crab-picker-chart ul {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: .18rem;
    block-size: 7rem;
    margin: .5rem 0 0;
    padding: 0;
    list-style: none;
}
.crab-picker-chart li {
    display: grid;
    grid-template-rows: 1rem minmax(0, 1fr) 1rem;
    align-items: end;
    justify-items: center;
    min-inline-size: 0;
    font-size: .65rem;
    font-variant-numeric: tabular-nums;
}
.crab-picker-chart li i {
    inline-size: min(80%, 1.55rem);
    border-start-start-radius: .2rem;
    border-start-end-radius: .2rem;
}
.crab-picker-occurrences { margin: 0; padding-inline-start: 1.3rem; }
.crab-picker-occurrences > li { padding-block: .3rem; font-variant-numeric: tabular-nums; }
.crab-picker-occurrences > li + li, .crab-picker-readonly {
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-picker-readonly { display: grid; gap: .65rem; padding-block-start: .7rem; }
.crab-picker-prototype[data-prototype-design="md3"] .crab-picker-panel {
    border-color: transparent;
    background: ${token.color.surface.low};
}
.crab-picker-prototype[data-prototype-design="macos"] { max-inline-size: 55rem; }
.crab-picker-prototype[data-prototype-design="macos"] .crab-picker-panel { gap: .65rem; }
.crab-picker-prototype[data-prototype-design="shadcn"] .crab-picker-panel { border-radius: ${token.radius.lg}; }
@container (max-width: 42rem) {
    .crab-picker-layout { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 26rem) {
    .crab-picker-range, .crab-picker-manual { grid-template-columns: minmax(0, 1fr); }
    .crab-picker-manual > button { justify-self: start; }
}
@media (forced-colors: active) {
    .crab-picker-prototype[data-prototype-design="md3"] .crab-picker-panel { border-color: CanvasText; }
    .crab-picker-chart li i { border: 1px solid CanvasText; }
}
`;
