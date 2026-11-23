import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-number-edit-prototype] { max-inline-size: 59rem; margin-inline: auto; }
[data-number-edit-prototype] .crab-design-hero {
    min-height: auto; padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0; border: 0; background: transparent;
}
[data-number-edit-prototype] .crab-design-hero > div:first-child { max-inline-size: 100%; }
[data-number-edit-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-number-edit-prototype] .crab-design-body { container-type: inline-size; }
.crab-number-edit-layout, .crab-number-edit-examples { display: grid; align-items: start; gap: .8rem; }
.crab-number-edit-layout { grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); }
.crab-number-edit-examples { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.crab-number-edit-panel {
    min-inline-size: 0;
    padding: clamp(.85rem, 2.5cqi, 1.4rem);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-number-edit-form, .crab-number-edit-receipt, .crab-number-edit-rules { display: grid; gap: 1rem; }
.crab-number-edit-field { display: grid; min-inline-size: 0; }
.crab-number-edit-unit { font-size: .8125rem; color: ${token.color.text.secondary}; white-space: nowrap; }
.crab-number-edit-actions { display: flex; align-items: center; flex-wrap: wrap; gap: .5rem; }
.crab-number-edit-actions p { flex: 1 1 9rem; color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-number-edit-actions > button { margin-inline-start: auto; }
.crab-number-edit-receipt p, .crab-number-edit-rules dd { color: ${token.color.text.secondary}; font-size: .875rem; }
.crab-number-edit-receipt dl, .crab-number-edit-rules dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .55rem 1rem; margin: 0; }
.crab-number-edit-receipt dt { color: ${token.color.text.secondary}; }
.crab-number-edit-receipt dd { font-variant-numeric: tabular-nums; font-weight: 650; }
.crab-number-edit-panel dd { margin: 0; }
.crab-number-edit-rules > a { justify-self: start; }
[data-number-edit-prototype][data-prototype-design="md3"] .crab-number-edit-panel {
    border-color: transparent; background: ${token.color.surface.low};
}
[data-number-edit-prototype][data-prototype-design="md3"] [data-field-root][data-field-layout="floating"][data-labeled="true"] {
    margin-block-start: .5rem;
}
[data-number-edit-prototype][data-prototype-design="md3"] [data-field-root][data-field-layout="floating"][data-labeled="true"] > label {
    grid-column: 1 / -1;
    inset-inline: .75rem auto;
    inset-block-start: 0;
    padding-inline: .25rem;
    z-index: 2;
    font-size: ${token.typography.body.small["font-size"]};
    line-height: ${token.typography.body.small["line-height"]};
    background: ${token.color.surface.low};
}
[data-number-edit-prototype][data-prototype-design="macos"] { max-inline-size: 54rem; }
[data-number-edit-prototype][data-prototype-design="macos"] .crab-number-edit-form { gap: .8rem; }
[data-number-edit-prototype][data-prototype-design="macos"] .crab-number-edit-actions {
    padding-block-start: .7rem; border-block-start: 1px solid ${token.color.border.subtle};
}
[data-number-edit-prototype][data-prototype-design="shadcn"] .crab-number-edit-panel { border-radius: ${token.radius.lg}; }
@container (max-width: 42rem) {
    .crab-number-edit-layout, .crab-number-edit-examples { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 24rem) {
    .crab-number-edit-rules dl { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
    .crab-number-edit-rules dd + dt { margin-block-start: .45rem; }
}
`;
