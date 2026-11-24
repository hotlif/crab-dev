import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-content-prototype { max-inline-size: 62rem; margin-inline: auto; }
.crab-content-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-content-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-content-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-content-prototype .crab-design-body { container-type: inline-size; }
.crab-content-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: .8rem;
    min-inline-size: 0;
    padding: clamp(.8rem, 2.4cqi, 1.35rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-content-stage > :is(button, a) { justify-self: start; }
.crab-content-stage :is(.crab-content-caption, .crab-content-status) { margin: 0; }
.crab-content-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .45rem .65rem; }
.crab-content-caption, .crab-content-status, .crab-content-rules dd { color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-content-rules { display: grid; gap: .5rem; margin: 0; }
.crab-content-rules > div { display: grid; grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr); gap: .25rem .75rem; align-items: baseline; }
.crab-content-rules dd { margin: 0; overflow-wrap: anywhere; }
.crab-content-prototype[data-prototype-design="md3"] .crab-content-stage { border-color: transparent; background: ${token.color.surface.low}; }
.crab-content-prototype[data-prototype-design="macos"] { max-inline-size: 55rem; }
.crab-content-prototype[data-prototype-design="macos"] .crab-content-stage { gap: .6rem; }
.crab-content-prototype[data-prototype-design="shadcn"] .crab-content-stage { border-radius: ${token.radius.lg}; }
.crab-content-roster {
    display: grid;
    margin: 0;
    padding: 0;
    list-style: none;
}
.crab-content-roster > li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: .65rem;
    min-inline-size: 0;
    padding-block: .48rem;
    overflow-wrap: anywhere;
}
.crab-content-roster > li + li { border-block-start: 1px solid ${token.color.border.subtle}; }
.crab-content-roster[data-dense="true"] > li { gap: .45rem; padding-block: .25rem; }
.crab-content-roster li strong { display: block; }
.crab-content-region {
    display: grid;
    gap: .6rem;
    min-inline-size: 0;
    padding: .7rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    overflow-wrap: anywhere;
}
.crab-content-region > :is(h3, p) { margin: 0; }
.crab-content-region > :is(button, a) { justify-self: start; }
.crab-content-nav { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.crab-content-unread-tab { min-inline-size: 8.5rem; }
.crab-content-card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .75rem;
    align-items: start;
}
.crab-content-card-grid > * { min-inline-size: 0; overflow-wrap: anywhere; }
.crab-content-card-grid p { margin: .35rem 0 0; }
.crab-content-card-title { margin: 0; font: inherit; }
.crab-content-code-key { font-family: monospace; font-size: .82em; overflow-wrap: anywhere; }
.crab-content-reader-layout { display: grid; grid-template-columns: 9rem minmax(0, 1fr); gap: .9rem; align-items: start; }
.crab-content-reader-layout > article { min-inline-size: 0; max-inline-size: 66ch; }
.crab-content-toc { display: grid; gap: .45rem; font-size: .9rem; }
.crab-content-scroll {
    display: block;
    max-inline-size: 100%;
    overflow-x: auto;
    margin-block: .65rem;
}
.crab-content-scroll > table { min-inline-size: 25rem; }
.crab-content-scroll > pre { min-inline-size: max-content; }
.crab-content-prototype :is(.crab-content-scroll, [data-content-focus]):focus-visible {
    outline: 2px solid ${token.color.border.focus};
    outline-offset: 3px;
}
.crab-content-tag-groups { display: grid; gap: .65rem; }
.crab-content-tag-long { white-space: normal; overflow-wrap: anywhere; }
.crab-content-device-tags > li { grid-template-columns: minmax(0, 1fr) auto; }
@container (max-width: 42rem) {
    .crab-content-card-grid { grid-template-columns: minmax(0, 1fr); }
    .crab-content-reader-layout { grid-template-columns: minmax(0, 1fr); }
    .crab-content-toc { grid-row: 1; grid-template-columns: repeat(auto-fit, minmax(6.3rem, 1fr)); }
}
@container (max-width: 24rem) {
    .crab-content-rules > div { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) {
    .crab-content-prototype[data-prototype-design="md3"] .crab-content-stage, .crab-content-region { border-color: CanvasText; }
    .crab-content-prototype :is(.crab-content-scroll, [data-content-focus]):focus-visible { outline-color: Highlight; }
}
`;
