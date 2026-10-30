import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import { css } from "@crab-dev/css";
import semanticToken from "@crab-dev/rc-token-semantic";
import token, { vars } from "./token.js";

export const controlStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    border: ${token.root['border-width']} ${token.root['border-style']} ${token.root['border-color']};
    border-radius: ${token.root['border-radius']};
    background-color: ${token.root['background-color']};
    box-shadow: ${token.root['box-shadow']};
    color: ${token.text.color};
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: ${token.root.transition};

    &:hover:not([aria-disabled="true"]):not(:focus-within):not([aria-expanded="true"]):not([data-status]) {
        border-color: ${token.root["border-color-hover"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-focus"]};
        box-shadow: ${token.root['box-shadow-focus']};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
    @media (pointer: coarse) {
        && {
            min-height: max(${token.field['min-height']}, calc(${token.root.touch['min-height']} + 2 * ${token.root['border-width']}));
            padding-block: 0;
            ${vars['clear.width']}: ${token.clear.touch.width};
        }
    }
    @media (forced-colors: active) {
        border-color: ButtonText;
        &:is(:focus-within, [aria-expanded="true"]) {
            outline: ${token.root['outline-width-focus']} solid Highlight;
            outline-offset: ${token.root['outline-offset-focus']};
        }
        &[aria-disabled='true'] { border-color: GrayText; color: GrayText; }
    }
`;

export const fieldControlStyle = css`
    grid-column: 1;
    grid-row: 1;
    &[data-labeled="true"] { grid-row: ${semanticToken.field.layout['control-row']}; }
    &[data-appearance="filled"][data-labeled="true"] > [data-role="select-value"] {
        padding-top: ${semanticToken.field.input['filled-padding-top']};
    }
    &[data-appearance="filled"] {
        border-radius: ${semanticToken.field.filled['border-radius']};
        border-width: ${semanticToken.field.filled['border-width']};
        border-color: ${semanticToken.field.filled['border-color']};
        background: ${semanticToken.field.filled['background-color']};
    }
    &[data-appearance="filled"]:hover:not([aria-disabled="true"]):not(:focus-within):not([aria-expanded="true"]) {
        background: ${semanticToken.field.filled['background-color-hover']};
        &:not([data-status]) { border-color: ${semanticToken.field.filled['border-color-hover']}; }
    }
    &[data-appearance="filled"]:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${semanticToken.field.filled['border-color-focus']};
        box-shadow: ${semanticToken.field.filled['shadow-focus']};
    }
    &&[data-appearance="filled"][data-status="error"] {
        border-color: ${token.root['border-color-error']};
        &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${semanticToken.field.filled['shadow-error']}; }
    }
    &&[data-appearance="filled"][data-status="warning"] {
        border-color: ${token.root['border-color-warning']};
        &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${semanticToken.field.filled['shadow-warning']}; }
    }
    &&[data-appearance="outlined"][data-labeled="true"] {
        border-color: ${semanticToken.field.outlined['border-color']};
        &:hover:not([aria-disabled="true"]):not(:focus-within):not([aria-expanded="true"]) { border-color: ${semanticToken.field.outlined['border-color-hover']}; }
        &:is(:focus-within, [aria-expanded="true"]) {
            border-color: ${semanticToken.field.outlined['border-color-focus']};
            box-shadow: ${semanticToken.field.outlined['shadow-focus']};
        }
        &[data-status="error"] {
            border-color: ${semanticToken.field.outlined['border-color-error']};
            &:hover { border-color: ${semanticToken.field.outlined['border-color-error']}; }
            &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${semanticToken.field.outlined['shadow-error']}; }
        }
        &[data-status="warning"] {
            border-color: ${semanticToken.field.outlined['border-color-warning']};
            &:hover { border-color: ${semanticToken.field.outlined['border-color-warning']}; }
            &:is(:focus-within, [aria-expanded="true"]) { box-shadow: ${semanticToken.field.outlined['shadow-warning']}; }
        }
    }
    & > fieldset {
        display: ${semanticToken.field.outline.display};
        position: absolute;
        inset: calc(0px - ${semanticToken.field.label.floating['line-height']} / 2) 0 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        pointer-events: none;
        border: ${token.root['border-width']} solid ${token.root['border-color']};
        border-radius: inherit;
    }
    & > fieldset > legend {
        visibility: hidden;
        overflow: hidden;
        max-width: 0;
        height: ${semanticToken.field.label.floating['line-height']};
        margin-inline-start: ${semanticToken.field.outline['legend-margin']};
        padding: 0;
        font-size: ${semanticToken.field.label.floating['font-size']};
        line-height: 1;
        white-space: nowrap;
    }
    &:is(:focus-within, [data-floating="true"]) > fieldset > legend {
        max-width: 100%;
        padding-inline: ${semanticToken.field.outline['legend-padding']};
    }
    &:hover:not([aria-disabled="true"]) > fieldset { border-color: ${token.root['border-color-hover']}; }
    &:is(:focus-within, [aria-expanded="true"]) > fieldset {
        border-color: ${token.root['border-color-focus']};
        border-width: ${token.field.outline['border-width-focus']};
    }
    &&[data-status="error"] > fieldset { border-color: ${token.root['border-color-error']}; }
    &&[data-status="warning"] > fieldset { border-color: ${token.root['border-color-warning']}; }
    &&[aria-disabled="true"] {
        opacity: 1;
        color: ${semanticToken.field.disabled.color};
        border-color: ${semanticToken.field.disabled['border-color']};
        box-shadow: none;
        & > fieldset { border-color: ${semanticToken.field.disabled['border-color']}; }
        & [data-role="select-suffix"] { color: inherit; }
        & [data-role="select-value"] { color: inherit; }
        & [data-role="select-placeholder"], & [data-role="select-suffix"] button { color: inherit; }
        & [data-role="select-suffix"] button span { color: inherit; }
        &[data-appearance="filled"] {
            border-color: ${semanticToken.field.disabled['filled-border-color']};
            background: ${semanticToken.field.disabled['filled-background']};
        }
        &[data-appearance="outlined"][data-labeled="true"] { border-color: ${semanticToken.field.outlined['border-color']}; }
    }
    @media (forced-colors: active) {
        && { border-color: CanvasText; background: Canvas; }
        & > fieldset { display: none; }
        &[aria-disabled="true"] { border-color: GrayText; }
    }
`;

export const fieldLayoutStyle = css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    row-gap: ${semanticToken.field.layout['row-gap']};
    min-width: 0;
    & > [data-role="select-label"] {
        display: inline-flex;
        gap: ${semanticToken.field.required.gap};
        position: relative;
        z-index: 1;
        grid-column: 1;
        grid-row: ${semanticToken.field.layout['label-row']};
        align-self: ${semanticToken.field.label.align};
        justify-self: start;
        min-width: 0;
        max-width: calc(100% - 2 * ${token.field['padding-inline']} - ${token.clear.width} - ${token.field.gap});
        margin-inline: ${semanticToken.field.label['margin-inline']};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        pointer-events: none;
        color: ${token.field.label.color};
        font-size: ${semanticToken.field.label['font-size']};
        line-height: ${semanticToken.field.label['line-height']};
        transition: ${token.field.transition};
        & > [data-required-marker] {
            flex-shrink: 0;
            order: ${semanticToken.field.required.order};
            color: ${semanticToken.field.required.color};
        }
        & > [id] { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    }
    &:is(:focus-within, [data-floating="true"]) > [data-role="select-label"] {
        align-self: ${semanticToken.field.label.floating.align};
        font-size: ${semanticToken.field.label.floating['font-size']};
        line-height: ${semanticToken.field.label.floating['line-height']};
        transform: ${semanticToken.field.label.floating.transform};
    }
    &[data-appearance="filled"]:is(:focus-within, [data-floating="true"]) > [data-role="select-label"] {
        margin-block-start: ${semanticToken.field.label.filled.offset};
        transform: none;
    }
    &:is(:focus-within, [data-open="true"]) > [data-role="select-label"] { color: ${token.field.label['color-focus']}; }
    &[data-status="error"] > [data-role="select-label"] { color: ${token.field['color-error']}; }
    &[data-status="warning"] > [data-role="select-label"] { color: ${token.field['color-warning']}; }
    &[data-disabled="true"] > [data-role="select-label"] { color: ${semanticToken.field.disabled.color}; }
    &[data-disabled="true"] > [data-role="select-label"] > [data-required-marker] { color: inherit; }
    &[data-labeled="true"][data-floating="false"]:not(:focus-within) [data-role="select-placeholder"] { color: ${semanticToken.field.label['empty-placeholder-color']}; }
    @media (prefers-reduced-motion: reduce) { & > [data-role="select-label"] { transition: none; } }
    @media (forced-colors: active) {
        & > [data-role="select-label"] { color: CanvasText; }
        & > [data-role="select-label"] > [data-required-marker] { color: inherit; }
        &[data-disabled="true"] > [data-role="select-label"] { color: GrayText; }
    }
`;

export const controlDisabledStyle = css`
    opacity: ${token.root['opacity-disabled']};
    cursor: not-allowed;
    pointer-events: none;
`;

export const controlErrorStyle = css`
    border-color: ${token.root["border-color-error"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.root["border-color-error"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-error"]};
        box-shadow: ${token.root.validation['box-shadow-error']};
    }
`;

export const controlWarningStyle = css`
    border-color: ${token.root["border-color-warning"]};

    &:hover:not([aria-disabled="true"]) {
        border-color: ${token.root["border-color-warning"]};
    }

    &:is(:focus-within, [aria-expanded="true"]) {
        border-color: ${token.root["border-color-warning"]};
        box-shadow: ${token.root.validation['box-shadow-warning']};
    }
`;

export const valueWrapStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
`;

export const singleValueStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const placeholderStyle = css`
    color: ${token.text["color-placeholder"]};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const searchInputStyle = css`
    flex: 1;
    min-width: 0;
    /* The Select field owns focus, including forced colors; avoid a second ring. */
    &&:focus-within { outline: none; }
`;

export const caretStyle = css`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.icon.width};
    height: ${token.icon.width};
    color: ${token.icon.color};
    & > svg { width: 100%; height: 100%; }
    transition: transform ${token.motion.spatial.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const caretOpenStyle = css`
    transform: rotate(180deg);
`;

export const tagLabelStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
`;

export const suffixWrapStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: ${token.field.gap};
    margin-inline-start: ${token.field.gap};
`;

export const actionStyle = css`
    flex-shrink: 0;
    && {
        ${buttonVars['icon.width']}: ${token.icon.width};
        padding: 0;
        width: ${token.clear.width};
        min-width: ${token.clear.width};
        height: ${token.clear.height};
        color: ${token.clear.color};
    }
    &&:hover { color: ${token.clear['color-hover']}; }
    /* 字段容器已经应用禁用透明度。 */
    &&:disabled > span { opacity: 1; }
    @media (pointer: coarse) {
        && {
            width: ${token.clear.touch.width};
            min-width: ${token.clear.touch.width};
            height: ${token.clear.touch.width};
        }
    }
`;

export const loadingIconStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.root["color-loading"]};
    flex-shrink: 0;
    --rc-spin-size: ${token.icon.width};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;
