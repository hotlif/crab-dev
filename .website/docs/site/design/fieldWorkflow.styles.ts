import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-field-workflow {
    --crab-field-panel: ${token.color.surface.content};
    --crab-field-inset: ${token.color.surface.low};
    --crab-field-panel-radius: ${token.shape.card};
    --crab-field-panel-gap: .9rem;
    max-inline-size: 61rem;
    margin-inline: auto;
}
.crab-field-workflow .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
.crab-field-workflow .crab-design-hero > div:first-child { max-inline-size: 100%; }
.crab-field-workflow :is(.crab-design-hero-art, .crab-design-status) { display: none; }
.crab-field-workflow .crab-design-body { container-type: inline-size; }
.crab-field-workflow-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(13rem, .53fr);
    align-items: start;
    gap: .8rem;
}
.crab-field-workflow-panel {
    display: grid;
    align-content: start;
    min-inline-size: 0;
    gap: var(--crab-field-panel-gap);
    padding: clamp(.9rem, 2.6cqi, 1.35rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: var(--crab-field-panel-radius);
    background: var(--crab-field-panel);
}
.crab-field-workflow-panel h3 { margin: 0; }
.crab-field-workflow-heading {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem .85rem;
    align-items: baseline;
    justify-content: space-between;
}
.crab-field-workflow-support, .crab-field-workflow-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-field-workflow-panel p { margin: 0; }
.crab-field-workflow-aside > button, .crab-field-workflow-rules > a,
.crab-field-workflow-search > button { justify-self: start; }
.crab-field-workflow-aside > p { font-size: .875rem; }
.crab-field-workflow-filter {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: .6rem 1rem;
    align-items: center;
}
.crab-field-workflow-filter-actions, .crab-field-workflow-form-footer {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem;
    align-items: center;
}
.crab-field-workflow-search {
    display: grid;
    gap: .55rem;
    align-items: start;
    min-inline-size: 0;
    padding: .7rem;
    border: 1px solid ${token.color.border.subtle};
    border-radius: var(--crab-field-panel-radius);
    background: var(--crab-field-inset);
}
.crab-field-workflow-option-list {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    justify-items: start;
    gap: .35rem;
    min-inline-size: 0;
    overflow-wrap: anywhere;
}
.crab-field-workflow-result {
    display: grid;
    gap: .35rem;
    padding-block-start: .65rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-field-workflow-rows { padding: 0; margin: 0; list-style: none; }
.crab-field-workflow-rows li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, .8fr);
    gap: .3rem .8rem;
    align-items: baseline;
    padding-block: .45rem;
    font-size: .875rem;
    overflow-wrap: anywhere;
}
.crab-field-workflow-rows li + li { border-block-start: 1px solid ${token.color.border.subtle}; }
.crab-field-workflow-rows li div { display: grid; gap: .15rem; }
.crab-field-workflow-rows li div > span { color: ${token.color.text.secondary}; font-size: .75rem; }
.crab-field-workflow .crab-field-workflow-form { row-gap: .8rem; }
.crab-field-workflow-form-footer {
    justify-content: flex-end;
    padding-block-start: .6rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-field-workflow-submission { min-block-size: 1.25rem; }
.crab-field-workflow-error {
    display: grid;
    gap: .2rem;
    padding: .6rem .75rem;
    border: 1px solid ${token.color.feedback.error.border};
    border-radius: .5rem;
    color: ${token.color.feedback.error.text};
    background: ${token.color.feedback.error.background};
    overflow-wrap: anywhere;
    font-size: .875rem;
}
.crab-field-workflow-record, .crab-field-workflow-rules dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .45rem .85rem;
    margin: 0;
}
.crab-field-workflow-record { font-size: .875rem; }
.crab-field-workflow-record dt { color: ${token.color.text.secondary}; }
.crab-field-workflow-record dd, .crab-field-workflow-rules dd { margin: 0; overflow-wrap: anywhere; }
.crab-field-workflow[data-prototype-design="md3"] {
    --crab-field-panel: ${token.color.surface.low};
    --crab-field-inset: ${token.color.surface.content};
}
.crab-field-workflow[data-prototype-design="md3"] .crab-field-workflow-panel { border-color: transparent; }
.crab-field-workflow[data-prototype-design="macos"] {
    --crab-field-panel-gap: .68rem;
    max-inline-size: 55rem;
}
.crab-field-workflow[data-prototype-design="macos"] .crab-field-workflow-rows li { padding-block: .35rem; }
.crab-field-workflow[data-prototype-design="shadcn"] {
    --crab-field-inset: ${token.color.surface.content};
    --crab-field-panel-radius: ${token.radius.lg};
}
@container (max-width: 43rem) {
    .crab-field-workflow-layout { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 32rem) {
    .crab-field-workflow-filter { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 24rem) {
    .crab-field-workflow-rows li, .crab-field-workflow-rules dl { grid-template-columns: minmax(0, 1fr); }
    .crab-field-workflow-rules dd + dt { margin-block-start: .4rem; }
}
@media (forced-colors: active) {
    .crab-field-workflow[data-prototype-design="md3"] .crab-field-workflow-panel,
    .crab-field-workflow-error { border-color: CanvasText; }
}
`;
