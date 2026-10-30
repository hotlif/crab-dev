import { css } from "@crab-dev/css";
import token from "../token.js";

export const collapsedRootStyle = css`
    display: flex;
    flex-direction: column;
    list-style-type: none;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    transition: ${token.vertical.collapsed.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const collapsedItemStyle = css`
    list-style-type: none;
`;

export const collapsedItemButtonStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: ${token.vertical.collapsed.item.title.height};
    padding-inline: ${token.vertical.collapsed.item.title["padding-inline"]};
    margin-top: ${token.vertical.item.title["margin-top"]};
    margin-bottom: ${token.vertical.item.title["margin-bottom"]};
    color: ${token.vertical.item.title.color};
    font-size: ${token.vertical.item.title["font-size"]};
    border-radius: ${token.vertical.item.title["border-radius"]};
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
    transition: ${token.vertical.item.title.transition};

    &:hover {
        background-color: ${token.vertical.item.title["background-color-hover"]};
        color: ${token.vertical.item.title["color-hover"]};
    }

    &:active {
        background-color: ${token.vertical.item.title["background-color-active"]};
        color: ${token.vertical.item.title["color-active"]};
    }

    &:focus-visible {
        outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']};
        outline-offset: -2px;
    }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const collapsedItemSelectStyle = css`
    background-color: ${token.vertical.item.title["background-color-selected"]};
    color: ${token.vertical.item.title["color-selected"]};
    font-weight: ${token.vertical.item.title["font-weight-selected"]};
    [data-menu-icon] { color: inherit; }
    &:hover, &:focus-visible {
        background-color: ${token.vertical.item.selection['background-color-hover']};
        color: ${token.vertical.item.title['color-selected']};
    }
    &:active { background-color: ${token.vertical.item.selection['background-color-pressed']}; }
    @media (forced-colors: active) {
        &, &:hover, &:active, &:focus-visible {
            forced-color-adjust: none;
            color: HighlightText;
            background-color: Highlight;
        }
    }
`;

export const collapsedItemOpenStyle = css`
    background-color: ${token.vertical.item.title["background-color-open"]};
    color: ${token.vertical.item.title["color-open"]};
`;

export const collapsedIconStyle = css`
    color: ${token.vertical.item.icon.color};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.vertical.collapsed.item.icon.width};
    height: ${token.vertical.collapsed.item.icon.width};
    flex-shrink: 0;
    line-height: 1;

    & > svg,
    & > img {
        width: 100%;
        height: 100%;
        display: block;
    }
`;

export const collapsedFallbackTextStyle = css`
    font-size: inherit;
    font-weight: inherit;
    line-height: 1;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const submenuFloatStyle = css`
    min-width: ${token.vertical.submenu["min-width"]};
    padding: ${token.vertical.submenu.padding};
    background-color: ${token.vertical.submenu["background-color"]};
    box-shadow: ${token.vertical.submenu["box-shadow"]};
    border-radius: ${token.vertical.submenu["border-radius"]};
    z-index: ${token.vertical.submenu["z-index"]};
    box-sizing: border-box;

    list-style: none;
    margin: 0;
`;

export const tooltipStyle = css`
    background-color: ${token.vertical.tooltip["background-color"]};
    color: ${token.vertical.tooltip.color};
    padding-inline: ${token.vertical.tooltip["padding-inline"]};
    padding-block: ${token.vertical.tooltip["padding-block"]};
    border-radius: ${token.vertical.tooltip["border-radius"]};
    font-size: ${token.vertical.tooltip["font-size"]};
    z-index: ${token.vertical.tooltip["z-index"]};
    pointer-events: none;
    white-space: nowrap;
`;
