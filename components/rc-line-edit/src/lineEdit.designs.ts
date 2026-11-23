import { css } from "@crab-dev/css";
import semantic from "@crab-dev/rc-token-semantic";
import token, { vars } from "./token.js";

export const shadcnOutlineStyle = css`
    &:not([data-disabled="true"]) {
        ${vars['field.outlined.border-color']}: color-mix(in oklch, ${semantic.color.text.secondary} 72%, ${semantic.color.surface.content});
        ${vars['field.outlined.border-color-hover']}: ${semantic.color.text.secondary};
    }
`;

export const inlineFieldStyle = css`
    &&[data-labeled="true"] {
        grid-template-columns: min(${token.field.layout.label.width}, 30%) minmax(0, 1fr);
        column-gap: ${token.field.layout['column-gap']};
        > label {
            grid-area: 1 / 1;
            align-self: center;
            justify-self: end;
            margin: 0;
        }
        > [data-field-control] { grid-area: 1 / 2; }
        > [data-field-support] { grid-area: 2 / 2; padding-inline: 0; }
    }
`;

// Share the input's actual grid column with the resting label. Prefixes,
// suffixes and actions can change width without measuring text in JavaScript.
export const floatingFieldStyle = css`
    &&[data-labeled="true"] {
        grid-template-columns: auto minmax(0, 1fr) auto auto auto;
        > [data-field-control] {
            grid-area: 1 / 1 / 2 / -1;
            display: grid;
            grid-template-columns: subgrid;
            column-gap: 0;
            padding-inline: ${token.field.outline['padding-inline']};
            min-height: max(${token.field.outline.height}, ${token.field.control.height});
            border-style: none;
            border-radius: ${token.field.outline['border-radius']};
            background: transparent;
            box-shadow: none;
            > input { grid-area: 1 / 2; }
            > [data-field-prefix] { grid-area: 1 / 1; margin-inline-end: ${token.icon.gap}; }
            > button { grid-area: 1 / 3; }
            > [data-field-suffix] { grid-area: 1 / 4; margin-inline-start: ${token.icon.gap}; }
            > button:last-child { grid-column: 5; }
            > fieldset {
                display: block;
                transition: border-color ${semantic.motion.effects.fast};
            }
            legend {
                font-size: ${semantic.typography.body.small['font-size']};
                margin-inline-start: calc(${token.field.outline['padding-inline']} - ${token.field.outline.notch['padding-inline']} - ${token.root['border-width']});
                transition: max-width ${semantic.motion.layout}, padding-inline ${semantic.motion.layout};
                transition-timing-function: linear(0, 0 25%, 1);
            }
        }
        > label {
            grid-area: 1 / 2 / 2 / 3;
            position: absolute;
            inset-inline: 0;
            top: 50%;
            margin: 0;
            max-width: 100%;
            align-self: start;
            justify-self: start;
            transform: translateY(-50%);
            font-size: ${token.field.input['font-size']};
            line-height: ${token.field.input['line-height']};
        }
        input::placeholder { opacity: 0; }
        input:focus::placeholder {
            opacity: 1;
            transition: opacity ${semantic.motion.layout};
            transition-timing-function: step-end;
        }
        &:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) {
            > label {
                grid-column: 1 / -1;
                inset-inline: ${token.field.outline['padding-inline']};
                max-width: calc(100% - 2 * ${token.field.outline['padding-inline']});
                top: 0;
                transform: translateY(-50%);
                font-size: ${semantic.typography.body.small['font-size']};
                line-height: ${semantic.typography.body.small['line-height']};
            }
            legend {
                box-sizing: border-box;
                max-width: calc(100% - 2 * ${token.field.outline['padding-inline']} + 2 * ${token.field.outline.notch['padding-inline']});
                padding-inline: ${token.field.outline.notch['padding-inline']};
                transition: none;
            }
        }
        &:has(input:not(:placeholder-shown)) > label { transition: color ${semantic.motion.effects.fast}; }
        > [data-field-support] { grid-area: 2 / 1 / 3 / -1; padding-inline: ${token.field.outline['padding-inline']}; }
        @media (prefers-reduced-motion: reduce) {
            > label, input:focus::placeholder, > [data-field-control] > fieldset, > [data-field-control] legend { transition: none; }
        }
        @media (forced-colors: active) {
            > [data-field-control] > fieldset { border-color: CanvasText; }
            &:focus-within > [data-field-control] > fieldset { border-color: Highlight; }
            &[data-disabled="true"] > [data-field-control] > fieldset { border-color: GrayText; }
        }
    }
`;
