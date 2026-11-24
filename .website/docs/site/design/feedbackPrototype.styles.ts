import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-feedback-prototype { max-inline-size: 60rem; margin-inline: auto; }
.crab-feedback-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-feedback-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-feedback-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-feedback-prototype .crab-design-body { container-type: inline-size; }
.crab-feedback-panel {
    display: grid;
    gap: .85rem;
    padding: clamp(.8rem, 2.4cqi, 1.35rem);
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-feedback-form { display: grid; gap: .65rem; }
.crab-feedback-notice-list {
    display: grid;
    justify-items: start;
    gap: .18rem;
    margin: 0;
    padding: 0;
    list-style: none;
}
.crab-feedback-notice-actions { margin-block-start: .45rem; }
.crab-feedback-message-preview { grid-template-rows: auto 1fr; align-items: end; }
.crab-feedback-panel > :is(button, a) { justify-self: start; }
.crab-feedback-panel :is(h3, p) { margin: 0; }
.crab-feedback-actions, .crab-feedback-toast-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .45rem .65rem;
}
.crab-feedback-support, .crab-feedback-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-feedback-rules { display: grid; gap: .48rem; margin: 0; }
.crab-feedback-rules > div {
    display: grid;
    grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr);
    align-items: baseline;
    gap: .22rem .8rem;
}
.crab-feedback-rules dd { margin: 0; }
.crab-feedback-visible-status {
    padding-block: .65rem 0;
    border-block-start: 1px solid ${token.color.border.subtle};
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-feedback-sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    clip-path: inset(50%);
    overflow: hidden;
    white-space: nowrap;
}
.crab-feedback-two-col {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(12rem, 1fr);
    align-items: start;
    gap: .8rem;
}
.crab-feedback-preview {
    display: grid;
    align-items: start;
    gap: .6rem;
    min-inline-size: 0;
    min-block-size: 7rem;
    padding: .65rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
}
.crab-feedback-notice-stack, .crab-feedback-toast-location {
    display: grid;
    justify-items: start;
    min-inline-size: 0;
    padding-block-end: .65rem;
}
.crab-feedback-prototype[data-prototype-design="md3"] .crab-feedback-panel {
    background: ${token.color.surface.low};
    border-color: transparent;
}
.crab-feedback-prototype[data-prototype-design="md3"] .crab-feedback-toast-location { justify-items: center; }
.crab-feedback-prototype[data-prototype-design="macos"] { max-inline-size: 54rem; }
.crab-feedback-prototype[data-prototype-design="macos"] :is(.crab-feedback-toast-location, .crab-feedback-notice-stack) { justify-items: end; }
.crab-feedback-prototype[data-prototype-design="macos"] .crab-feedback-panel { gap: .65rem; }
.crab-feedback-prototype[data-prototype-design="shadcn"] .crab-feedback-panel { border-radius: ${token.radius.lg}; }
.crab-feedback-prototype[data-prototype-design="shadcn"] .crab-feedback-toast-location { justify-items: end; }
.crab-feedback-truncated {
    display: block;
    inline-size: 100%;
    max-inline-size: 15rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
    font-family: monospace;
}
.crab-feedback-path-button { min-inline-size: 0; max-inline-size: 100%; justify-self: start; }
.crab-feedback-full-path {
    margin: 0;
    padding: .5rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
    font-family: monospace;
    overflow-wrap: anywhere;
}
@container (max-width: 37rem) {
    .crab-feedback-two-col { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 24rem) {
    .crab-feedback-rules > div { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) {
    .crab-feedback-prototype[data-prototype-design="md3"] .crab-feedback-panel,
    .crab-feedback-preview { border-color: CanvasText; }
}
`;
