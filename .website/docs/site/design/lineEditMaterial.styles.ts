import { globalStyle } from "@crab-dev/css";
import { TokenVars as field } from "@crab-dev/rc-line-edit";
import token, { vars as semantic } from "@crab-dev/rc-token-semantic";

// Keep the Material proposal inside the design workspace while using LineEdit's native input and label.
globalStyle`
[data-line-edit-prototype][data-prototype-design="md3"] .crab-design-hero {
    border: 0;
    border-radius: 1.5rem;
    background: ${token.color.surface.low};
    padding: clamp(1rem, 3vw, 2rem);
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-design-hero h1 {
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    font-weight: 500;
}

[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-board { gap: .75rem; }
[data-line-edit-prototype][data-prototype-design="md3"] :is(.crab-line-edit-form, .crab-line-edit-controls, .crab-line-edit-rules) {
    border-color: transparent;
    border-radius: 1.5rem;
    background: ${token.color.surface.low};
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-form {
    gap: 1.5rem;
    padding: clamp(1rem, 3cqi, 2rem);
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-form h3 {
    font-size: ${token.typography.title.large["font-size"]};
    font-weight: 500;
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-controls {
    background: ${token.color.surface.container};
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-footer {
    border-block-start: 0;
    padding-block-start: 0;
}
[data-line-edit-prototype][data-prototype-design="md3"] .crab-line-edit-samples > div {
    padding: 1.25rem;
    border-radius: 1rem;
    background: ${token.color.surface.low};
}
.crab-line-edit-appearance { display: grid; justify-items: start; gap: .6rem; }

[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root] {
    ${semantic["field.layout.control-row"]}: 1;
    ${semantic["field.layout.support-row"]}: 2;
    ${semantic["field.outline.display"]}: block;
    ${field["field.control.min-height"]}: 56px;
    ${field["field.control.padding-inline"]}: 16px;
    ${field["field.control.padding-inline-start"]}: 16px;
    ${field["field.input.font-size"]}: ${token.typography.body.large["font-size"]};
    ${field["field.input.line-height"]}: ${token.typography.body.large["line-height"]};
    ${field["field.input.filled.padding-top"]}: 16px;
    ${field["field.support.padding-inline"]}: 16px;
    ${field["field.outline.border-width-focus"]}: 2px;
    ${field["field.outline.legend.margin"]}: 11px;
    ${field["field.outline.legend.padding"]}: 4px;
    ${field["field.filled.border-radius"]}: 4px 4px 0 0;
    ${field["field.filled.background-color"]}: ${token.color.surface.highest};
    ${field["root.border-radius"]}: 4px;
    position: relative;
    row-gap: .25rem;
}

[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-labeled="true"] > label {
    position: absolute;
    inset-inline-start: 16px;
    inset-block-start: 28px;
    align-self: auto;
    margin: 0;
    max-inline-size: calc(100% - 32px);
    font-size: ${token.typography.body.large["font-size"]};
    line-height: ${token.typography.body.large["line-height"]};
    transform: translateY(-50%);
    transition: inset-block-start ${token.motion.layout}, font-size ${token.motion.layout},
        line-height ${token.motion.layout}, transform ${token.motion.layout}, color ${token.motion.effects.fast};
}
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root] > label [data-required-marker] { color: inherit; }
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-prefix="true"]:not(:focus-within):not(:has(input:not(:placeholder-shown))) [data-field-prefix] {
    visibility: hidden;
}
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
    inset-block-start: 0;
    font-size: ${token.typography.body.small["font-size"]};
    line-height: ${token.typography.body.small["line-height"]};
}
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
    inset-block-start: 8px;
    margin: 0;
    transform: none;
}
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root]:not(:focus-within) input::placeholder { color: transparent; }
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root] input { caret-color: ${token.color.brand.primary}; }
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-status="error"] input {
    caret-color: ${token.color.feedback.error.text};
}

[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root] > [data-appearance="outlined"] {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
}
[data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-disabled="true"] > [data-appearance="outlined"] {
    border-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
    [data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-labeled="true"] > label { transition: none; }
}

@media (forced-colors: active) {
    [data-line-edit-prototype][data-prototype-design="md3"] [data-field-root] > [data-appearance="outlined"] { border-color: CanvasText; }
    [data-line-edit-prototype][data-prototype-design="md3"] [data-field-root][data-disabled="true"] > [data-appearance="outlined"] { border-color: GrayText; }
    [data-line-edit-prototype][data-prototype-design="md3"] [data-field-root]:not(:focus-within) input::placeholder {
        visibility: hidden;
    }
}
`;
