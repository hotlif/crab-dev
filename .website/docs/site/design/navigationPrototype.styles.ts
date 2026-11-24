import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-navigation-prototype { max-inline-size: 61rem; margin-inline: auto; }
.crab-navigation-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-navigation-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-navigation-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-navigation-prototype .crab-design-body { container-type: inline-size; }
.crab-navigation-stage {
    display: grid;
    gap: .75rem;
    min-inline-size: 0;
    padding: clamp(.9rem, 2.5cqi, 1.35rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-navigation-stage > :is(button, a) { justify-self: start; }
.crab-navigation-stage :is(h3, p) { margin: 0; }
.crab-navigation-heading {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    gap: .55rem;
}
.crab-navigation-heading > span, .crab-navigation-status, .crab-navigation-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-navigation-tab-body {
    display: grid;
    align-content: start;
    gap: .65rem;
    padding: clamp(.75rem, 1.8cqi, 1rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: .55rem;
    overflow-wrap: anywhere;
    min-inline-size: 0;
}
.crab-navigation-tab-body > button { justify-self: start; }
.crab-navigation-wrap-label {
    white-space: normal;
    overflow-wrap: anywhere;
    text-align: start;
}
.crab-navigation-tab-body h3:focus-visible,
.crab-navigation-status:focus-visible {
    outline: 2px solid ${token.color.border.focus};
    outline-offset: 3px;
    border-radius: .22rem;
}
.crab-navigation-list { display: grid; gap: .28rem; list-style: none; padding: 0; margin: 0; }
.crab-navigation-list > li { padding: .32rem 0; font-size: .875rem; overflow-wrap: anywhere; }
.crab-navigation-list > li + li { border-block-start: 1px solid ${token.color.border.subtle}; }
.crab-navigation-results { max-block-size: 18rem; overflow-y: auto; }
.crab-navigation-results > li { display: grid; grid-template-columns: 4rem minmax(0, 1fr); gap: .65rem; }
.crab-navigation-results li > span { color: ${token.color.text.secondary}; font-variant-numeric: tabular-nums; }
.crab-navigation-rules { display: grid; gap: .55rem; margin: 0; }
.crab-navigation-rules > div { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: .4rem .75rem; }
.crab-navigation-rules dd { margin: 0; }
.crab-navigation-tree { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(12rem, 1fr); align-items: start; gap: .8rem; }
.crab-navigation-tree-control { display: grid; min-inline-size: 0; gap: .65rem; }
.crab-navigation-tree-view {
    block-size: 17rem;
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: .45rem;
    overflow: hidden;
}
.crab-navigation-tree-view > p { padding: .75rem; }
.crab-navigation-prototype[data-prototype-design="md3"] .crab-navigation-stage {
    border-color: transparent;
    background: ${token.color.surface.low};
}
.crab-navigation-prototype[data-prototype-design="macos"] { max-inline-size: 55rem; }
.crab-navigation-prototype[data-prototype-design="macos"] .crab-navigation-stage { gap: .58rem; }
.crab-navigation-prototype[data-prototype-design="shadcn"] .crab-navigation-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 35rem) { .crab-navigation-tree { grid-template-columns: minmax(0, 1fr); } }
@container (max-width: 24rem) { .crab-navigation-rules > div { grid-template-columns: minmax(0, 1fr); } }
@media (forced-colors: active) {
    .crab-navigation-prototype[data-prototype-design="md3"] .crab-navigation-stage { border-color: CanvasText; }
    .crab-navigation-tab-body h3:focus-visible,
    .crab-navigation-status:focus-visible { outline-color: Highlight; }
}
`;
