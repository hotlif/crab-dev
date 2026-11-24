import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-loading-prototype { max-inline-size: 59rem; margin-inline: auto; }
.crab-loading-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-loading-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-loading-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-loading-prototype .crab-design-body { container-type: inline-size; }
.crab-loading-stage {
    display: grid;
    gap: .8rem;
    padding: clamp(.8rem, 2.4cqi, 1.3rem);
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-loading-stage > :is(button, a) { justify-self: start; }
.crab-loading-stage :is(h3, p) { margin: 0; overflow-wrap: anywhere; }
.crab-loading-actions { display: flex; flex-wrap: wrap; gap: .45rem .65rem; align-items: center; }
.crab-loading-support, .crab-loading-rules dd { color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-loading-rules { display: grid; gap: .5rem; margin: 0; }
.crab-loading-rules > div {
    display: grid;
    grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr);
    gap: .25rem .75rem;
    align-items: baseline;
}
.crab-loading-rules dd { margin: 0; overflow-wrap: anywhere; }
.crab-loading-surface {
    display: grid;
    gap: .55rem;
    min-inline-size: 0;
    padding: .7rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
}
.crab-loading-surface > :is(button, a) { justify-self: start; }
.crab-loading-content { display: grid; gap: .65rem; }
.crab-loading-content :focus-visible { outline-offset: 3px; }
.crab-loading-list {
    display: grid;
    margin: 0;
    padding: 0;
    min-inline-size: 0;
    list-style: none;
}
.crab-loading-list li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: .65rem;
    min-block-size: 3.45rem;
    padding: .4rem 0;
    overflow-wrap: anywhere;
}
.crab-loading-list li + li { border-block-start: 1px solid ${token.color.border.subtle}; }
.crab-loading-list li strong { display: block; line-height: 1.35; }
.crab-loading-list-surface { min-block-size: 11.8rem; align-content: start; }
.crab-loading-skeleton-label { display: grid; gap: .5rem; }
.crab-loading-type-icon {
    display: grid;
    place-items: center;
    inline-size: 2.2rem;
    block-size: 2.2rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    background: ${token.color.surface.low};
    color: ${token.color.text.primary};
    font-size: .74rem;
}
.crab-loading-status { min-block-size: 1.5rem; }
.crab-loading-prototype[data-prototype-design="md3"] .crab-loading-stage { border-color: transparent; background: ${token.color.surface.low}; }
.crab-loading-prototype[data-prototype-design="macos"] { max-inline-size: 53rem; }
.crab-loading-prototype[data-prototype-design="macos"] .crab-loading-stage { gap: .65rem; }
.crab-loading-prototype[data-prototype-design="shadcn"] .crab-loading-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 24rem) {
    .crab-loading-rules > div { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) {
    .crab-loading-prototype[data-prototype-design="md3"] .crab-loading-stage,
    .crab-loading-surface { border-color: CanvasText; }
}
`;
