import { globalStyle } from "@crab-dev/css";
import { TokenVars as field } from "@crab-dev/rc-line-edit";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-line-edit-prototype] .crab-design-body { container-type: inline-size; }
[data-line-edit-prototype] [data-field-control]:not([aria-disabled="true"]) { cursor: text; }
[data-line-edit-prototype] [data-field-control] > [data-field-suffix] > .crab-line-edit-clear {
    padding: 0;
    min-inline-size: var(${field["action.min-width"]});
    block-size: var(${field["action.height"]});
    color: ${token.color.text.secondary};
}
@media (pointer: coarse) {
    [data-line-edit-prototype] [data-field-control] > [data-field-suffix] > .crab-line-edit-clear {
        min-inline-size: ${token.size["touch-target"]};
        block-size: ${token.size["touch-target"]};
    }
}
#line-edit-placeholder { scroll-margin-block-start: 5rem; }

.crab-line-edit-board {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(13rem, 1fr);
    align-items: stretch;
    gap: 1rem;
}

.crab-line-edit-form, .crab-line-edit-controls, .crab-line-edit-samples > div, .crab-line-edit-rules {
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    min-inline-size: 0;
    overflow-wrap: anywhere;
}

.crab-line-edit-form, .crab-line-edit-controls {
    display: grid;
    align-content: start;
    gap: 1rem;
    padding: clamp(.9rem, 2.2cqi, 1.5rem);
}

.crab-line-edit-fields { display: grid; align-items: start; gap: 1rem; min-inline-size: 0; }
.crab-line-edit-counted { display: grid; gap: .25rem; min-inline-size: 0; }
.crab-line-edit-field-support {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: .5rem;
    padding-inline: ${token.field.support["padding-inline"]};
    color: ${token.color.text.secondary};
    font-size: ${token.typography.body.small["font-size"]};
    line-height: ${token.typography.body.small["line-height"]};
    overflow-wrap: anywhere;
}
.crab-line-edit-field-support [role="alert"] { color: ${token.color.feedback.error.text}; }
.crab-line-edit-count { white-space: nowrap; }
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-field-support { padding-inline: 16px; }
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) {
    --crab-line-edit-label-column: 6rem;
    --crab-line-edit-label-gap: .65rem;
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) [data-field-root][data-labeled="true"] {
    grid-template-columns: var(--crab-line-edit-label-column) minmax(0, 1fr);
    column-gap: var(--crab-line-edit-label-gap);
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) [data-field-root][data-labeled="true"] > label {
    grid-area: 1 / 1;
    align-self: center;
    justify-self: end;
    margin: 0;
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) [data-field-root][data-labeled="true"] > [data-field-control] {
    grid-area: 1 / 2;
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) [data-field-root][data-labeled="true"] > [data-field-support] {
    grid-row: 2;
    grid-column: var(--crab-line-edit-support-column, 2);
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) .crab-line-edit-field-support {
    margin-inline-start: var(--crab-line-edit-support-offset, calc(var(--crab-line-edit-label-column) + var(--crab-line-edit-label-gap)));
}
.crab-line-edit-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: .75rem;
    border-block-start: 1px solid ${token.color.border.subtle};
    padding-block-start: .85rem;
}
.crab-line-edit-footer p { flex: 1 1 7rem; min-block-size: 1.3em; color: ${token.color.feedback.success.text}; font-size: .875rem; }
.crab-line-edit-footer > .crab-design-actions { margin-inline-start: auto; }

.crab-line-edit-controls { background: ${token.color.surface.low}; }
.crab-line-edit-controls .crab-design-actions { gap: .55rem; }
.crab-line-edit-readout {
    margin: 0;
    border-block-start: 1px solid ${token.color.border.subtle};
    padding-block-start: .8rem;
}
.crab-line-edit-readout dt, .crab-line-edit-affix { color: ${token.color.text.secondary}; font-size: .8125rem; }
.crab-line-edit-readout dd { margin: .25rem 0 0; font-weight: 600; }

.crab-line-edit-samples { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; }
.crab-line-edit-samples > div { display: grid; align-content: start; gap: .85rem; padding: 1rem; }
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) .crab-line-edit-samples {
    --crab-line-edit-label-column: 5rem;
    --crab-line-edit-label-gap: .5rem;
    --crab-line-edit-support-column: 1 / -1;
    --crab-line-edit-support-offset: 0px;
    gap: .65rem;
}
[data-line-edit-prototype]:is([data-prototype-design="macos"], [data-prototype-design="shadcn"]) .crab-line-edit-samples > div {
    gap: .5rem;
    padding: .75rem .875rem;
}
[data-line-edit-prototype] .crab-line-edit-samples h3 { font-size: .95rem; }
.crab-line-edit-rules { padding: clamp(.9rem, 2.2cqi, 1.5rem); }
.crab-line-edit-rules dl {
    display: grid;
    grid-template-columns: minmax(6rem, .18fr) minmax(0, 1fr);
    row-gap: .65rem;
    column-gap: 1rem;
    margin-block-end: 0;
    font-size: .875rem;
}
.crab-line-edit-rules dt { font-weight: 650; }
.crab-line-edit-rules dd { margin: 0; color: ${token.color.text.secondary}; }

[data-line-edit-prototype][data-prototype-design="macos"] .crab-line-edit-form {
    gap: 0;
    padding: 0;
    box-shadow: ${token.shadow.control};
}
[data-line-edit-prototype][data-prototype-design="macos"] .crab-line-edit-form h3 {
    text-align: center;
    background: ${token.color.surface.low};
    border-block-end: 1px solid ${token.color.border.subtle};
    padding: .6rem 1rem;
    border-start-start-radius: ${token.shape.card};
    border-start-end-radius: ${token.shape.card};
}
[data-line-edit-prototype][data-prototype-design="macos"] .crab-line-edit-fields {
    grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
    padding: 1rem;
}
[data-line-edit-prototype][data-prototype-design="macos"] .crab-line-edit-footer { padding: .65rem 1rem; }

[data-line-edit-prototype][data-prototype-design="shadcn"] .crab-line-edit-board { grid-template-columns: minmax(0, 1.4fr) minmax(13rem, 1fr); }
[data-line-edit-prototype][data-prototype-design="shadcn"] [data-field-root]:not([data-disabled="true"]) {
    ${field["field.outlined.border-color"]}: color-mix(in oklch, ${token.color.text.secondary} 72%, ${token.color.surface.content});
    ${field["field.outlined.border-color-hover"]}: ${token.color.text.secondary};
}
[data-line-edit-prototype][data-prototype-design="shadcn"] .crab-line-edit-controls { background: ${token.color.surface.content}; }
[data-line-edit-prototype][data-prototype-design="shadcn"] .crab-line-edit-footer > .crab-design-actions { margin-inline-start: 0; }

@container (max-width: 48rem) {
    .crab-line-edit-samples { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (max-width: 36rem) {
    .crab-line-edit-board, [data-line-edit-prototype][data-prototype-design="shadcn"] .crab-line-edit-board { grid-template-columns: minmax(0, 1fr); }
}
@container (max-width: 28rem) {
    .crab-line-edit-samples, .crab-line-edit-rules dl { grid-template-columns: minmax(0, 1fr); }
    .crab-line-edit-rules dl { row-gap: .3rem; }
    .crab-line-edit-rules dd + dt { margin-block-start: .45rem; }
}
`;
