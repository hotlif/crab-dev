import { css } from "@crab-dev/css";
import semanticToken from "@crab-dev/rc-token-semantic";
import token from "./token.js";

export const containerBaseStyle = css`
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    border-radius: ${token.root['border-radius']};
    border-width: ${token.root['border-width']};
    border-style: ${token.root['border-style']};
    border-color: ${token.root['border-color']};
    background-color: ${token.root['background-color']};
    color: ${token.text.color};
    box-shadow: ${token.root['box-shadow']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    outline: none;
    box-sizing: border-box;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.root['border-color-hover']};
    }
    &:focus-within {
        border-color: ${token.root['border-color-focus']};
        box-shadow: ${token.root['box-shadow-focus-within']};
    }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.root['opacity-disabled']};
    }
    @media (pointer: coarse) {
        && { padding-block: 0; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(input:focus-visible) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; opacity: 1; }
    }
`

export const errorStyle = css`
    border-color: ${token.status['border-color-error']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-error']};
    }
    &:focus-within {
        border-color: ${token.status['border-color-error']};
        box-shadow: ${token.status['box-shadow-error']};
    }
`

export const warningStyle = css`
    border-color: ${token.status.warning['border-color']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status.warning['border-color']};
    }
    &:focus-within {
        border-color: ${token.status.warning['border-color']};
        box-shadow: ${token.status.warning['box-shadow-focus-within']};
    }
`

export const borderlessStyle = css`
    border-width: 0;
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    height: auto;
    padding: 0;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: transparent;
    }
    &:focus-within {
        border-color: transparent;
        box-shadow: none;
    }
    /* 无边框模式没有自身的轮廓或底线，保留独立的键盘焦点提示。 */
    &:has(input:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
`

export const inputBaseStyle = css`
    box-sizing: border-box;
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    border: unset;
    border-radius: inherit;
    outline: none;
    background-color: transparent;
    color: inherit;
    font-family: inherit;
    &::placeholder {
        font-size: inherit;
        color: ${token.placeholder.color};
    }
    &:disabled {
        cursor: not-allowed;
    }
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }
`

export const borderlessInputStyle = css`
    font-size: inherit;
    line-height: inherit;
`

export const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: ${token.icon.color};
    & > svg {
        width: ${token.field.icon.width};
        height: ${token.field.icon.height};
    }
`

export const prefixStyle = css`
    margin-inline-end: ${token.icon.gap};
`

export const suffixStyle = css`
    margin-inline-start: ${token.icon.gap};
`

export const actionButtonStyle = css`
    flex-shrink: 0;
    margin-inline-start: ${token.icon.gap};
    && {
        padding: 0;
        min-width: ${token.action['min-width']};
        height: ${token.action.height};
        color: ${token.icon.color};
    }
    &&[aria-disabled="true"] { opacity: ${token.action['opacity-disabled']}; }
    @media (pointer: coarse) {
        && { min-width: ${token.action.touch['min-width']}; height: ${token.action.touch.height}; }
    }
`

export const countStyle = css`
    flex-shrink: 0;
    margin-inline-start: ${token.icon.gap};
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`

export const legendRequiredStyle = css`
    margin-inline-start: ${token.field.required.gap};
`;

export const fieldStyle = css`
    position: relative;
    display: inline-grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    min-width: 0;
    max-width: 100%;
    row-gap: ${token.field.layout['row-gap']};
    & > label {
        display: inline-flex;
        align-items: center;
        gap: ${token.field.required.gap};
        & > [data-field-label-text] {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        & > [data-required-marker] {
            flex-shrink: 0;
            order: ${semanticToken.field.required.order};
            color: ${token.field.required.color};
        }
    }
    &[data-labeled="true"] > [data-field-support] { grid-column: 1; grid-row: ${semanticToken.field.layout['support-row']}; }
    &[data-labeled="true"] > [data-field-control] {
        grid-column: 1;
        grid-row: ${semanticToken.field.layout['control-row']};
        min-height: max(${token.field.control['min-height']}, ${token.field.control.height});
        padding-inline: ${token.field.control['padding-inline']};
        padding-block: 0;
        column-gap: ${token.field.control['column-gap']};
        &[data-prefix="true"] { padding-inline-start: ${token.field.control['padding-inline-start']}; }
        &[data-suffix="true"] { padding-inline-end: ${token.field.control['padding-inline-end']}; }
        & > [data-field-prefix], & > [data-field-suffix] {
            min-width: ${token.field.icon.width};
            margin: 0;
            justify-content: center;
        }
        & > button { margin: 0; }
        & > [data-field-prefix] svg, & > [data-field-suffix] svg, & > button svg {
            width: ${token.field.icon.width};
            height: ${token.field.icon.height};
        }
    }
    &[data-labeled="true"] input {
        font-size: ${token.field.input['font-size']};
        line-height: ${token.field.input['line-height']};
    }
    &[data-labeled="true"] > label {
        grid-column: 1;
        grid-row: ${semanticToken.field.layout['label-row']};
        z-index: 1;
        align-self: ${semanticToken.field.label.align};
        justify-self: start;
        margin-inline: ${semanticToken.field.label['margin-inline']};
        max-width: calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: text;
        color: ${token.field.label.color};
        font-size: ${token.field.label['font-size']};
        line-height: ${token.field.label['line-height']};
        transition: ${token.field.transition};
    }
    &[data-labeled="true"][data-prefix="true"] > label {
        margin-inline-start: ${semanticToken.field.label['prefix-margin-inline']};
    }
    &[data-labeled="true"]:not(:focus-within) input:not(:disabled):placeholder-shown::placeholder {
        color: ${token.field.placeholder.color};
    }
    &[data-labeled="true"][data-disabled="true"] input:placeholder-shown::placeholder {
        color: ${token.field.placeholder['color-disabled']};
    }
    &[data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        align-self: ${semanticToken.field.label.floating.align};
        margin-inline-start: ${semanticToken.field.label.floating['margin-inline']};
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
        transform: ${token.field.label.floating.transform};
    }
    &:focus-within > label { color: ${token.field.label['color-focus']}; }
    &[data-labeled="true"][data-appearance="filled"] input {
        padding-top: ${token.field.input.filled['padding-top']};
    }
    &[data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        margin-block-start: ${token.field.label.filled['margin-top']};
        transform: none;
    }
    &[data-labeled="true"][data-appearance="filled"][data-prefix="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        margin-inline-start: ${semanticToken.field.label['prefix-margin-inline']};
    }
    &[data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) legend {
        max-width: calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']});
        padding-inline: ${token.field.outline.legend.padding};
    }
    &[data-status="error"] > label { color: ${token.field['color-error']}; }
    &[data-status="warning"] > label { color: ${token.field['color-warning']}; }
    &[data-disabled="true"] > label { cursor: not-allowed; color: ${token.field['color-disabled']}; }
    &&[data-disabled="true"] > label > [data-required-marker] { color: inherit; }
    &[data-disabled="true"] > [data-field-support] { color: ${token.field['color-disabled']}; }
    @media (prefers-reduced-motion: reduce) { & > label { transition: none; } }
    @media (forced-colors: active) {
        & > label { color: CanvasText; }
        &:focus-within > label { color: Highlight; background: Canvas; }
        &[data-disabled="true"] > label { color: GrayText; }
        && > label > [data-required-marker] { color: inherit; }
    }
`;

export const labeledControlStyle = css`
    position: relative;
    &[data-appearance="outlined"] {
        border-color: ${token.field.outlined['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-hover']}; }
        &:focus-within { border-color: ${token.field.outlined['border-color-focus']}; box-shadow: ${token.field.outlined['box-shadow-focus']}; }
    }
    &&[data-appearance="outlined"][data-status="error"] {
        border-color: ${token.field.outlined['border-color-error']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-error']}; }
    }
    &&[data-appearance="outlined"][data-status="warning"] {
        border-color: ${token.field.outlined['border-color-warning']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-warning']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-warning']}; }
    }
    & > fieldset {
        display: ${semanticToken.field.outline.display};
        position: absolute;
        inset: calc(0px - ${token.field.outline.legend.height} / 2) 0 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        border: ${token.root['border-width']} solid ${token.root['border-color']};
        border-radius: inherit;
        pointer-events: none;
    }
    & > fieldset > legend {
        visibility: hidden;
        overflow: hidden;
        max-width: 0;
        height: ${token.field.outline.legend.height};
        margin-inline-start: ${token.field.outline.legend.margin};
        padding: 0;
        color: transparent;
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.outline.legend['line-height']};
        white-space: nowrap;
    }
    &:hover:not(:focus-within):not([aria-disabled="true"]) > fieldset { border-color: ${token.root['border-color-hover']}; }
    &:focus-within > fieldset { border-color: ${token.root['border-color-focus']}; border-width: ${token.field.outline['border-width-focus']}; }
    &&[data-status="error"] > fieldset { border-color: ${token.status['border-color-error']}; }
    &&[data-status="warning"] > fieldset { border-color: ${token.status.warning['border-color']}; }
    &&[data-status="error"]:hover:not([aria-disabled="true"]) > fieldset { border-color: ${token.status['border-color-error']}; }
    &&[data-status="warning"]:hover:not([aria-disabled="true"]) > fieldset { border-color: ${token.status.warning['border-color']}; }
    &[data-appearance="filled"] > fieldset { display: none; }
    &&[aria-disabled="true"] {
        opacity: 1;
        color: ${token.field['color-disabled']};
        border-color: ${token.field['border-color-disabled']};
        box-shadow: none;
        & > fieldset { border-color: ${token.field['border-color-disabled']}; }
        & input::placeholder { color: ${token.field['color-disabled']}; }
        & > div, & button { color: ${token.field['color-disabled']}; }
    }
    &&[data-appearance="outlined"][aria-disabled="true"]:has(fieldset) { border-color: ${token.field.outlined['border-color']}; }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        & > fieldset { display: none; }
        &&[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
    }
`;

export const filledControlStyle = css`
    && {
        border-radius: ${token.field.filled['border-radius']};
        border-width: ${token.field.filled['border-width']};
        border-color: ${token.field.filled['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &&:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.field.filled['border-color-hover']};
        background: ${token.field.filled['background-color-hover']};
    }
    &&:focus-within {
        border-color: ${token.field.filled['border-color-focus']};
        box-shadow: ${token.field.filled['box-shadow-focus']};
    }
    &&[data-status="error"] {
        border-color: ${token.status['border-color-error']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.status['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-error']}; }
    }
    &&[data-status="warning"] {
        border-color: ${token.status.warning['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.status.warning['border-color']}; }
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-warning']}; }
    }
    &&&[aria-disabled="true"] {
        opacity: 1;
        color: ${token.field['color-disabled']};
        border-color: ${token.field.filled['border-color-disabled']};
        background: ${token.field.filled['background-color-disabled']};
        box-shadow: none;
        & > div, & button { color: ${token.field['color-disabled']}; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; box-shadow: none; }
        &&&[aria-disabled="true"] { border-color: GrayText; background: Canvas; color: GrayText; }
    }
`;

export const supportingStyle = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${token.icon.gap};
    padding-inline: ${token.field.support['padding-inline']};
    color: ${token.field.label['color']};
    font-size: ${token.field.support['font-size']};
    line-height: ${token.field.support['line-height']};
    overflow-wrap: anywhere;
    & > span:first-child { min-width: 0; }
    &[data-status="error"] { color: ${token.field['color-error']}; }
    &[data-status="warning"] { color: ${token.field['color-warning']}; }
    @media (forced-colors: active) { color: CanvasText; }
`;
