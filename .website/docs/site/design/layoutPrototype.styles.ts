import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-layout-prototype { margin-inline: auto; max-inline-size: 62rem; }
.crab-layout-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-layout-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-layout-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-layout-prototype .crab-design-body, .crab-layout-page { container-type: inline-size; }
.crab-layout-stage, .crab-layout-detail, .crab-layout-snapshot {
    display: grid;
    align-content: start;
    gap: .65rem;
    min-inline-size: 0;
    padding: clamp(.85rem, 2.2cqi, 1.25rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-layout-stage > :is(button, a) { justify-self: start; }
.crab-layout-stage :is(h3, h4, p) { margin: 0; }
.crab-layout-rules { display: grid; gap: .55rem; margin: 0; }
.crab-layout-rules > div { display: grid; grid-template-columns: 6rem minmax(0, 1fr); gap: .35rem .75rem; }
.crab-layout-secondary, .crab-layout-rules dd {
    margin: 0;
    color: ${token.color.text.secondary};
    overflow-wrap: anywhere;
    font-size: .875rem;
}
.crab-layout-workspace {
    block-size: clamp(29rem, 74svh, 37rem);
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    overflow: hidden;
}
.crab-layout-page { display: grid; gap: .75rem; min-inline-size: 0; padding: .7rem; }
.crab-layout-workspace-columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(10rem, .75fr); gap: .65rem; }
.crab-layout-detail, .crab-layout-snapshot {
    gap: .45rem;
    padding: .65rem;
    border-radius: ${token.radius.lg};
    overflow-wrap: anywhere;
}
.crab-layout-list { list-style: none; padding: 0; margin: 0; }
.crab-layout-list > li { padding-block: .25rem; overflow-wrap: anywhere; }
.crab-layout-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .35rem .6rem; }
.crab-layout-split-scope { display: grid; gap: .6rem; min-inline-size: 0; }
.crab-layout-split-scope .crab-layout-actions { justify-content: space-between; }
.crab-layout-split-scope .crab-layout-split-frame {
    block-size: 18rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
}
.crab-layout-split-scope[data-split-direction="vertical"] .crab-layout-split-frame { block-size: 24rem; }
.crab-layout-snapshot { padding: 0 0 .45rem; overflow: hidden; }
.crab-layout-snapshot-toolbar {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
}
.crab-layout-snapshot-toolbar > button { min-inline-size: min(100%, 11rem); justify-self: start; }
.crab-layout-snapshot-toolbar > p { min-block-size: 1.5rem; overflow-wrap: anywhere; }
@container (max-width: 27rem) {
    .crab-layout-snapshot-toolbar { grid-template-columns: minmax(0, 1fr); }
}
.crab-layout-snapshot > :is(h3, p, button) { margin-inline: .6rem; }
.crab-layout-snapshot > button { justify-self: start; }
.crab-layout-snapshot-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    background-color: ${token.color.surface.low};
    background-size: 200% 200%;
    background-repeat: no-repeat;
}
.crab-layout-prototype[data-prototype-design="md3"] .crab-layout-stage {
    border-color: transparent;
    background: ${token.color.surface.low};
}
.crab-layout-prototype[data-prototype-design="macos"] { max-inline-size: 58rem; }
.crab-layout-prototype[data-prototype-design="macos"] .crab-layout-stage { gap: .55rem; }
.crab-layout-prototype[data-prototype-design="shadcn"] .crab-layout-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 32rem) {
    .crab-layout-workspace-columns { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 25rem) { .crab-layout-rules > div { grid-template-columns: minmax(0, 1fr); } }
@media (forced-colors: active) {
    .crab-layout-prototype[data-prototype-design="md3"] .crab-layout-stage { border-color: CanvasText; }
    .crab-layout-snapshot-image { border-block-end: 1px solid CanvasText; }
}
`;
