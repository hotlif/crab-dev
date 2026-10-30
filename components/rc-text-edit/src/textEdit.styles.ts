import { css } from "@crab-dev/css";
import semanticToken from "@crab-dev/rc-token-semantic";
import token, { vars } from "./token.js";

export const containerBaseStyle = css`
    display: inline-flex;
    flex-direction: column;
    position: relative;
    min-width: 0;
    max-width: 100%;
    width: 100%;
    border-radius: ${token.root['border-radius']};
    border-width: ${token.root['border-width']};
    border-style: ${token.root['border-style']};
    border-color: ${token.root['border-color']};
    background-color: ${token.root['background-color']};
    color: ${token.text.color};
    font-family: ${token.text['font-family']};
    box-shadow: ${token.root['box-shadow']};
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    outline: none;
    box-sizing: border-box;
    &:has(> button) { min-height: max(${token.field.control['min-height']}, calc(${token.clear.height} + 2 * ${token.clear['inset-block-start']})); }
    @media (pointer: coarse) {
        &:has(> button) { min-height: max(${token.field.control['min-height']}, calc(${token.clear.touch.height} + 2 * ${token.clear['inset-block-start']})); }
    }
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.root['border-color-hover']};
    }
    &:focus-within {
        border-color: ${token.root['border-color-focus']};
        box-shadow: ${token.root['box-shadow-focus-within']};
    }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        color: ${token.field['color-disabled']};
        border-color: ${token.field['border-color-disabled']};
        box-shadow: none;
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; box-shadow: none; }
        &:has(textarea:focus-visible) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled="true"] { border-color: GrayText; color: GrayText; }
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
    border-color: ${token.status['border-color-warning']};
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-warning']};
    }
    &:focus-within {
        border-color: ${token.status['border-color-warning']};
        box-shadow: ${token.status['box-shadow-warning']};
    }
`

export const borderlessStyle = css`
    ${vars['field.control.min-height']}: 0px;
    border-width: 0;
    border-color: transparent;
    background-color: transparent;
    box-shadow: none;
    padding: 0;
    &:hover:not(:focus-within):not([aria-disabled="true"]) {
        border-color: transparent;
    }
    &:focus-within {
        border-color: transparent;
        box-shadow: none;
    }
    &:has(textarea:focus-visible) {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    @media (forced-colors: active) {
        &:has(textarea:focus-visible) { outline-color: Highlight; }
    }
`

export const textareaBaseStyle = css`
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: unset;
    border-radius: inherit;
    outline: none;
    background-color: transparent;
    color: inherit;
    caret-color: ${token.root['border-color-focus']};
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

export const borderlessTextareaStyle = css`
    font-size: inherit;
    line-height: inherit;
`

export const autoSizeStyle = css`
    field-sizing: content;
    resize: none;
`

export const clearSpaceStyle = css`
    box-sizing: border-box;
    padding-inline-end: calc(${token.clear.width} + ${token.icon.gap});
    @media (pointer: coarse) {
        padding-inline-end: calc(${token.clear.touch.width} + ${token.icon.gap});
    }
`

export const clearButtonStyle = css`
    && {
        position: absolute;
        width: ${token.clear.width};
        height: ${token.clear.height};
        padding: 0;
        color: ${token.icon.color};
    }
    inset-block-start: ${token.clear['inset-block-start']};
    inset-inline-end: ${token.clear['inset-inline-end']};
    @media (pointer: coarse) {
        && { width: ${token.clear.touch.width}; height: ${token.clear.touch.height}; }
    }
`

export const countStyle = css`
    flex-shrink: 0;
    font-size: ${token.count['font-size']};
    color: ${token.count.color};
    white-space: nowrap;
    user-select: none;
`

export const fieldStyle = css`
    display: inline-grid;
    font-family: ${token.text['font-family']};
    position: relative;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    row-gap: ${token.field.layout['row-gap']};
    & > label {
        display: inline-flex;
        align-items: center;
        gap: ${token.field.required.gap};
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        color: ${token.field.label.color};
        font-size: ${token.field.label['font-size']};
        line-height: ${token.field.label['line-height']};
        cursor: text;
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
    & > [data-control] { grid-column: 1; grid-row: 2; }
    & > [data-support] { grid-column: 1; grid-row: 3; }
    &[data-labeled="false"] > [data-control] { grid-row: 1; }
    &[data-labeled="false"] > [data-support] { grid-row: 2; }
    &[data-bordered="true"][data-labeled="true"] > [data-control] {
        grid-row: ${semanticToken.field.layout['control-row']};
        cursor: text;
        & > button { inset-block-start: ${token.field.input.multiline['padding-block']}; inset-inline-end: ${token.field.control['padding-inline']}; }
    }
    &[data-bordered="true"][data-labeled="true"] > [data-support] {
        grid-row: ${semanticToken.field.layout['support-row']};
    }
    &[data-bordered="true"][data-labeled="true"] > label {
        grid-row: ${semanticToken.field.layout['label-row']};
        position: relative;
        align-self: start;
        justify-self: start;
        z-index: 2;
        top: ${token.field.label.multiline.top};
        margin-inline: ${semanticToken.field.label['margin-inline']};
        max-width: calc(100% - 2 * ${semanticToken.field.label['margin-inline']});
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: ${token.field.transition};
    }
    &[data-bordered="true"][data-labeled="true"]:not(:focus-within) textarea:placeholder-shown::placeholder {
        color: ${token.field.placeholder.color};
    }
    &[data-bordered="true"][data-labeled="true"]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: 0;
        align-self: ${semanticToken.field.label.floating.align};
        margin-inline: ${semanticToken.field.label.floating['margin-inline']};
        transform: ${token.field.label.floating.transform};
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"] > [data-control] {
        border-color: ${token.field.outlined['border-color']};
        &:hover:not(:focus-within):not([aria-disabled="true"]) { border-color: ${token.field.outlined['border-color-hover']}; }
        &:focus-within { border-color: ${token.field.outlined['border-color-focus']}; box-shadow: ${token.field.outlined['box-shadow-focus']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"][data-status="error"]:not([aria-disabled="true"]) > [data-control] {
        border-color: ${token.field.outlined['border-color-error']};
        &:hover { border-color: ${token.field.outlined['border-color-error']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-error']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="outlined"][data-status="warning"]:not([aria-disabled="true"]) > [data-control] {
        border-color: ${token.field.outlined['border-color-warning']};
        &:hover { border-color: ${token.field.outlined['border-color-warning']}; }
        &:focus-within { box-shadow: ${token.field.outlined['box-shadow-warning']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"] > [data-control] {
        padding-block-start: ${token.field.input.multiline.filled['padding-top']};
        padding-block-end: ${token.field.input.multiline.filled.padding};
        & > button { inset-block-start: ${token.field.input.multiline.filled['padding-top']}; }
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > label {
        top: ${token.field.label.filled.top};
        transform: none;
    }
    &:focus-within:not([aria-disabled="true"]) > label { color: ${token.field.label['color-focus']}; }
    &[data-status="error"]:not([aria-disabled="true"]) > label { color: ${token.field['color-error']}; }
    &[data-status="warning"]:not([aria-disabled="true"]) > label { color: ${token.field['color-warning']}; }
    &[aria-disabled="true"] > label { color: ${token.field['color-disabled']}; cursor: not-allowed; }
    &&[aria-disabled="true"] > label > [data-required-marker] { color: inherit; }
    &[aria-disabled="true"] > [data-support] { color: ${token.field['color-disabled']}; }
    &[data-bordered="true"][data-labeled="true"][aria-disabled="true"] > [data-control] {
        border-color: ${token.field.outlined['border-color']};
    }
    &[data-bordered="true"][data-labeled="true"][data-appearance="filled"][aria-disabled="true"] > [data-control] {
        border-color: ${token.field.filled['border-color-disabled']};
    }
    @media (prefers-reduced-motion: reduce) { & > label { transition: none; } }
    @media (forced-colors: active) {
        & > label { color: CanvasText; }
        &:focus-within > label { color: Highlight; }
        &[aria-disabled="true"] > label { color: GrayText; }
        && > label > [data-required-marker] { color: inherit; }
    }
`;

export const legendRequiredStyle = css`
    margin-inline-start: ${token.field.required.gap};
`;

export const outlineStyle = css`
    display: ${semanticToken.field.outline.display};
    position: absolute;
    z-index: 1;
    pointer-events: none;
    inset: calc(${token.field.label.floating['line-height']} / -2) 0 0;
    min-width: 0;
    margin: 0;
    padding: 0;
    border: ${token.root['border-width']} solid ${token.root['border-color']};
    border-radius: inherit;
    box-sizing: border-box;
    & > legend {
        width: auto;
        max-width: 0;
        height: ${token.field.label.floating['line-height']};
        margin-inline-start: ${token.field.outline.legend.margin};
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        visibility: hidden;
        font-size: ${token.field.label.floating['font-size']};
        line-height: ${token.field.label.floating['line-height']};
    }
    [data-control]:is(:focus-within, :has(textarea:not(:placeholder-shown))) > & > legend {
        max-width: calc(100% - 2 * ${token.field.control['padding-inline']});
        padding-inline: ${token.field.outline.legend.padding};
    }
    [data-control]:hover:not(:focus-within):not([aria-disabled="true"]) > & { border-color: ${token.root['border-color-hover']}; }
    [data-control]:focus-within > & { border-color: ${token.root['border-color-focus']}; border-width: ${token.field.outline['border-width-focus']}; }
    [data-control][data-status="error"]:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-error']}; }
    [data-control][data-status="warning"]:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-warning']}; }
    [data-control][data-status="error"]:hover:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-error']}; }
    [data-control][data-status="warning"]:hover:not([aria-disabled="true"]) > & { border-color: ${token.status['border-color-warning']}; }
    [data-control][aria-disabled="true"] > & { border-color: ${token.field['border-color-disabled']}; }
    @media (forced-colors: active) {
        [data-control] > & { border-color: CanvasText; }
        [data-control]:focus-within > & { border-color: Highlight; }
        [data-control][aria-disabled="true"] > & { border-color: GrayText; }
    }
`;

export const appearanceStyle = css`
    &[data-appearance="filled"] {
        border-radius: ${token.field.filled['border-radius']};
        border-width: ${token.field.filled['border-width']};
        border-color: ${token.field.filled['border-color']};
        background: ${token.field.filled['background-color']};
        box-shadow: none;
    }
    &[data-appearance="filled"]:hover:not([aria-disabled="true"]):not(:focus-within) {
        background: ${token.field.filled['background-color-hover']};
        border-color: ${token.field.filled['border-color-hover']};
    }
    &[data-appearance="filled"]:focus-within {
        border-color: ${token.field.filled['border-color-focus']};
        box-shadow: ${token.field.filled['box-shadow-focus']};
    }
    &&[data-appearance="filled"][data-status="error"]:not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-error']};
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-error']}; }
    }
    &&[data-appearance="filled"][data-status="warning"]:not([aria-disabled="true"]) {
        border-color: ${token.status['border-color-warning']};
        &:focus-within { box-shadow: ${token.field.filled['box-shadow-warning']}; }
    }
    &[data-appearance="filled"][aria-disabled="true"] {
        background: ${token.field.filled['background-color-disabled']};
        border-color: ${token.field.filled['border-color-disabled']};
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; }
        &[aria-disabled="true"] { border-color: GrayText; }
    }
`;

export const supportingStyle = css`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: ${token.icon.gap};
    padding-inline: ${token.field.support['padding-inline']};
    color: ${token.field.label.color};
    font-size: ${token.field.label.floating['font-size']};
    line-height: ${token.field.support['line-height']};
    overflow-wrap: anywhere;
    & > span:first-child { min-width: 0; }
    &[data-status="error"] { color: ${token.field['color-error']}; }
    &[data-status="warning"] { color: ${token.field['color-warning']}; }
    @media (forced-colors: active) { color: CanvasText; }
`;
