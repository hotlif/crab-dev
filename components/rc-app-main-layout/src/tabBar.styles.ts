import { css } from "@crab-dev/css";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "./token.js";

export const barStyle = css`
    display: flex;
    align-items: flex-end;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    padding-inline: ${token.tab.item.curve.width};
    isolation: isolate;
    &::-webkit-scrollbar { display: none; }
`;

export const tabItemStyle = css`
    display: inline-flex;
    align-items: center;
    height: ${token.tab.item.height};
    min-width: ${token.tab.item['min-width']};
    max-width: ${token.tab.item['max-width']};
    flex: 0 1 ${token.tab.item['max-width']};
    padding: ${token.tab.item.padding};
    gap: ${token.tab.item.gap};
    position: relative;
    box-sizing: border-box;
    border-radius: ${token.tab.item['border-radius']} ${token.tab.item['border-radius']} 0 0;
    background: transparent;
    transition: background-color ${token.motion.interaction.transition};
    &:hover { background-color: ${token.tab.item['background-color-hover']}; }
    &::after {
        content: '';
        position: absolute;
        inset-inline-end: 0;
        top: 25%;
        height: 50%;
        width: ${token.tab.item.separator.width};
        background: ${token.tab.item.separator['background-color']};
        pointer-events: none;
    }
    &:last-child::after, &:hover::after, &:has(+ [data-active])::after { opacity: 0; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (pointer: coarse) { height: ${token.tab.item.touch.height}; }
`;

export const tabItemActiveStyle = css`
    &, &:hover { background-color: ${token.tab.item['background-color']}; }
    z-index: 2;
    &::after { opacity: 0; }
    &::before, & > .tab-active-right-curve {
        content: '';
        position: absolute;
        bottom: 0;
        width: ${token.tab.item.curve.width};
        height: ${token.tab.item.curve.width};
        pointer-events: none;
    }
    &::before {
        left: calc(-1 * ${token.tab.item.curve.width});
        background: radial-gradient(circle at 0 0,
            transparent ${token.tab.item.curve.width},
            ${token.tab.item['background-color']} calc(${token.tab.item.curve.width} + 0.5px));
    }
    & > .tab-active-right-curve {
        right: calc(-1 * ${token.tab.item.curve.width});
        background: radial-gradient(circle at 100% 0,
            transparent ${token.tab.item.curve.width},
            ${token.tab.item['background-color']} calc(${token.tab.item.curve.width} + 0.5px));
    }
    @media (forced-colors: active) { outline: ${token.tab.item['outline-width-focus']} solid Highlight; outline-offset: ${token.tab.item['outline-offset-focus']}; }
`;

export const tabButtonStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: 0;
        ${buttonVars['text.background-color-hover']}: transparent;
        ${buttonVars['text.background-color-focus']}: transparent;
        ${buttonVars['text.background-color-active']}: transparent;
        flex: 1 1 auto;
        min-width: 0;
        height: 100%;
        padding: 0;
        gap: ${token.tab.item.gap};
        border: 0;
        border-radius: 0;
        background: transparent;
        color: ${token.tab.item.color};
        font-family: ${token.tab['font-family']};
        font-size: ${token.tab['font-size']};
        font-weight: ${token.tab['font-weight']};
        line-height: ${token.tab['line-height']};
        text-align: start;
        transition: color ${token.motion.interaction.transition};
        touch-action: pan-x pan-y;
        justify-content: flex-start;
        &[aria-selected='true'] {
            color: ${token.tab.item['color-active']};
            font-weight: ${token.tab['font-weight-active']};
        }
        &:focus-visible {
            outline: ${token.tab.item['outline-width-focus']} solid ${token.tab.item['outline-color-focus']};
            outline-offset: ${token.tab.item['outline-offset-focus']};
        }
        & > span:not([aria-hidden]) {
            display: flex;
            align-self: stretch;
            min-width: 0;
            width: 100%;
        }
        @media (prefers-reduced-motion: reduce) { transition: none; }
    }
`;

export const tabLabelStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tab.item.gap};
    min-width: 0;
    width: 100%;
`;

export const titleStyle = css`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const tabItemDraggingStyle = css`
    z-index: 10;
    transition: none !important;
    cursor: grabbing;
    box-shadow: ${token.tab.item["box-shadow-dragging"]};
`;

export const tabItemSnappingStyle = css`
    z-index: 10;
    transition: transform ${token.tab.item.motion.reorder.transition}, box-shadow ${token.motion.interaction.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    box-shadow: ${token.tab.item["box-shadow-snapping"]};
`;

export const tabItemShiftableStyle = css`
    transition: transform ${token.tab.item.motion.reorder.transition}, background-color ${token.motion.interaction.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    will-change: transform;
`;

export const iconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.tab.item.icon.width};
    height: ${token.tab.item.icon.width};

    & > svg, & > img {
        width: 100%;
        height: 100%;
    }
`;

export const closeBtnStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.tab.item.close['border-radius']};
        ${buttonVars['text.background-color-hover']}: ${token.tab.item.close['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.tab.item.close['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.tab.item.close['background-color-hover']};
        flex: 0 0 auto;
        width: ${token.tab.item.close.width};
        height: ${token.tab.item.close.width};
        color: ${token.tab.item.close.color};
        border-radius: ${token.tab.item.close['border-radius']};
        padding: 0;
        &:hover { color: ${token.tab.item.close['color-hover']}; }
        &:focus-visible { outline-offset: ${token.tab.item['outline-offset-focus']}; }
        & > span:first-child {
            inset: auto;
            top: 50%;
            left: 50%;
            width: ${token.tab.item.close.touch.width};
            height: ${token.tab.item.close.touch.width};
            transform: translate(-50%, -50%);
        }
        @media (pointer: coarse) {
            width: ${token.tab.item.close.touch.width};
            height: ${token.tab.item.close.touch.width};
        }
        & svg {
            width: ${token.tab.item.close.icon.width};
            height: ${token.tab.item.close.icon.width};
        }
    }
`;
