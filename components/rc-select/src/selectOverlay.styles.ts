import { TokenVars as checkboxVars } from "@crab-dev/rc-checkbox";
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import { css } from "@crab-dev/css";
import token from "./token.js";

export const overlayStyle = css`
    padding: ${token.dropdown.padding};
    overflow: hidden;
`;

export const optionStyle = css`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${token.option['padding-block']} 8px;
    border-radius: ${token.option['border-radius']};
    cursor: pointer;
    user-select: none;
    height: max(${token.option.height}, calc(1lh + 2 * ${token.option['padding-block']}));
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }
    box-sizing: border-box;
    font-size: ${token.option['font-size']};
    line-height: ${token.option['line-height']};
    outline: none;
    transition: ${token.root.transition};

    &:hover:not([aria-disabled='true']) {
        background-color: ${token.option['background-color-hover']};
    }

    &:active:not([aria-disabled='true']) {
        background-color: ${token.option['background-color-active']};
    }

    /* Selection stays visible beneath independent hover, pressed and active-descendant feedback. */
    &[aria-selected="true"] {
        background-color: ${token.option["background-color-selected"]};
        color: ${token.option['color-selected']};
    }
    &[aria-selected="true"]:hover:not([aria-disabled='true']) {
        background-color: ${token.option.selection['background-color-hover']};
    }
    &[aria-selected="true"]:active:not([aria-disabled='true']) {
        background-color: ${token.option.selection['background-color-active']};
    }
    &[data-highlighted="true"] {
        outline: ${token.option.activity['outline-width']} solid ${token.option.activity['outline-color']};
        outline-offset: ${token.option.activity['outline-offset']};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
    @media (forced-colors: active) {
        forced-color-adjust: none;
        background: Canvas;
        color: CanvasText;
        &:hover:not([aria-disabled='true']), &:active:not([aria-disabled='true']) { background: Canvas; }
        &[aria-selected='true'] { background: Highlight; color: HighlightText; }
        &[aria-selected='true']:hover:not([aria-disabled='true']),
        &[aria-selected='true']:active:not([aria-disabled='true']) { background: Highlight; color: HighlightText; }
        &[data-highlighted='true'] { outline-color: CanvasText; }
        &[aria-selected='true'][data-highlighted='true'] { outline-color: HighlightText; }
        &[aria-disabled='true'] { color: GrayText; }
    }
`;

export const optionHighlightStyle = css`
    background-color: ${token.option.highlight['background-color']};
`;

export const measureStyle = css`
    position: absolute;
    visibility: hidden;
    pointer-events: none;
    width: 1px;
    overflow: hidden;
`;

export const optionSelectedStyle = css`
    font-weight: 500;
`;

export const optionSelectedSingleStyle = css`
    font-weight: 500;
    color: ${token.option["color-selected"]};
`;

export const optionDisabledStyle = css`
    opacity: ${token.root['opacity-disabled']};
    cursor: not-allowed;
    pointer-events: none;
    @media (forced-colors: active) { opacity: 1; }
`;

export const optionLabelStyle = css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
`;

export const checkIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-inline-start: 8px;
    color: ${token.option["color-selected"]};
`;

export const checkboxIndicatorStyle = css`
    /* The option row owns the hit area; its checkbox is a decorative indicator. */
    ${checkboxVars['control.target.width']}: ${token.option.checkbox.width};
    ${checkboxVars['root.touch.min-width']}: ${token.option.checkbox.width};
    ${checkboxVars['root.touch.min-height']}: ${token.option.checkbox.width};
    display: inline-flex;
    flex-shrink: 0;
    margin-inline-end: 8px;
    pointer-events: none;
`;

export const emptyStyle = css`
    padding: 24px 8px;
    color: ${token.text["color-placeholder"]};
    text-align: center;
    font-size: ${token.option['font-size']};
`;

export const groupLabelStyle = css`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    height: var(--select-option-measured-height, ${token.option.height});
    @media (pointer: coarse) { min-height: ${token.root.touch['min-height']}; }
    box-sizing: border-box;
    font-size: ${token.group["font-size"]};
    color: ${token.group.color};
    font-weight: 500;
    user-select: none;
`;

export const groupedOptionStyle = css`
    padding-inline-start: 20px;
`;

export const virtualTopSpacerStyle = css`
    display: block;
    width: 100%;
    height: var(--crab-rc-virtual-top-padding-height, 0px);
`;

export const virtualBottomSpacerStyle = css`
    display: block;
    width: 100%;
    height: var(--crab-rc-virtual-bottom-padding-height, 0px);
`;

export const loadingStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 8px;
    color: ${token.root["color-loading"]};
    --rc-spin-size: 20px;
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;
