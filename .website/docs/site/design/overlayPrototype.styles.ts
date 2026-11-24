import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-overlay-prototype { max-inline-size: 60rem; margin-inline: auto; }
.crab-overlay-prototype .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-overlay-prototype .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-overlay-prototype :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-overlay-prototype .crab-design-body { container-type: inline-size; }
.crab-overlay-stage {
    display: grid;
    gap: .75rem;
    min-inline-size: 0;
    padding: clamp(.9rem, 2.5cqi, 1.4rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-overlay-stage > :is(button, a) { justify-self: start; }
.crab-overlay-stage :is(h3, p) { margin: 0; }
.crab-overlay-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: .5rem 1.2rem;
}
.crab-overlay-row h3 { font-size: 1rem; }
.crab-overlay-row p, .crab-overlay-support, .crab-overlay-rules dd, .crab-overlay-details dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-overlay-actions { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; }
.crab-overlay-modal-actions { justify-content: flex-end; margin-block-start: .8rem; }
.crab-overlay-rules, .crab-overlay-details, .crab-overlay-rows { display: grid; gap: .65rem; margin: 0; padding: 0; }
.crab-overlay-rules > div, .crab-overlay-details > div {
    display: grid;
    grid-template-columns: minmax(5.5rem, auto) minmax(0, 1fr);
    align-items: baseline;
    gap: .3rem .8rem;
}
.crab-overlay-rules dd, .crab-overlay-details dd { margin: 0; }
.crab-overlay-details {
    min-inline-size: 0;
    max-block-size: 13rem;
    overflow-y: auto;
    padding: .75rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-overlay-dialog-fields { display: grid; gap: .8rem; min-inline-size: 0; }
.crab-overlay-dialog-fields > button { justify-self: start; }
.crab-overlay-notice {
    color: ${token.color.feedback.error.text};
    border: 1px solid ${token.color.feedback.error.border};
    padding: .65rem .75rem;
    border-radius: .45rem;
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-overlay-notice p { margin: 0 0 .5rem; }
.crab-overlay-rows { list-style: none; }
.crab-overlay-rows li + li { border-block-start: 1px solid ${token.color.border.subtle}; padding-block-start: .65rem; }
.crab-overlay-edge-slot { min-block-size: 2.5rem; }
.crab-overlay-edge-wrapper[data-edge] { position: fixed; z-index: 100; }
.crab-overlay-edge-wrapper[data-edge^="top"] { inset-block-start: 4.6rem; }
.crab-overlay-edge-wrapper[data-edge^="bottom"] { inset-block-end: .65rem; }
.crab-overlay-edge-wrapper[data-edge$="start"] { inset-inline-start: .65rem; }
.crab-overlay-edge-wrapper[data-edge$="end"] { inset-inline-end: .65rem; }
.crab-overlay-inspector, .crab-overlay-command-menu {
    display: grid;
    gap: .55rem;
    min-inline-size: min(15rem, calc(100dvw - 1.35rem));
    max-inline-size: min(18rem, calc(100dvw - 1.35rem));
    padding: .65rem;
    font-size: .875rem;
}
.crab-overlay-inspector :is(h3, p) { margin: 0; }
.crab-overlay-inspector > button { justify-self: start; }
.crab-overlay-command-group { display: grid; gap: .15rem; }
.crab-overlay-command-group + .crab-overlay-command-group { border-block-start: 1px solid ${token.color.border.subtle}; padding-block-start: .4rem; }
.crab-overlay-command-group > span { font-size: .75rem; padding: .18rem .55rem; }
.crab-overlay-command-group .crab-overlay-command {
    justify-content: flex-start;
    min-block-size: 2.2rem;
    font-size: .875rem;
    text-align: start;
    white-space: normal;
}
.crab-overlay-command[aria-disabled="true"] {
    display: grid;
    align-content: center;
    padding-inline: .65rem;
    color: ${token.color.text.secondary};
    border-radius: ${token.radius.lg};
}
.crab-overlay-command[aria-disabled="true"]:focus-visible {
    outline: 2px solid ${token.color.border.focus};
    outline-offset: -2px;
}
.crab-overlay-prototype[data-prototype-design="md3"] .crab-overlay-stage {
    border-color: transparent;
    background: ${token.color.surface.low};
}
.crab-overlay-prototype[data-prototype-design="macos"] { max-inline-size: 54rem; }
.crab-overlay-prototype[data-prototype-design="macos"] .crab-overlay-stage { gap: .6rem; }
.crab-overlay-prototype[data-prototype-design="shadcn"] .crab-overlay-stage { border-radius: ${token.radius.lg}; }
@container (max-width: 25rem) {
    .crab-overlay-rules > div { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) {
    .crab-overlay-prototype[data-prototype-design="md3"] .crab-overlay-stage { border-color: CanvasText; }
    .crab-overlay-command[aria-disabled="true"]:focus-visible { outline-color: Highlight; }
}
`;
