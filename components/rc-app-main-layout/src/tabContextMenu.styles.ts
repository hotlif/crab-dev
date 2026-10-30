import { css } from "@crab-dev/css";
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from "./token.js";

export const menuStyle = css`
    position: fixed;
    min-width: ${token.tab['context-menu']['min-width']};
    padding: ${token.tab['context-menu'].padding};
    background-color: ${token.tab['context-menu']["background-color"]};
    border: 1px solid ${token.tab['context-menu']["border-color"]};
    border-radius: ${token.tab['context-menu']["border-radius"]};
    box-shadow: ${token.tab['context-menu']["box-shadow"]};
    z-index: ${token.tab['context-menu']['z-index']};
    list-style: none;
    margin: 0;
    user-select: none;
    box-sizing: border-box;
    opacity: 1;
    transition: opacity ${token.motion.interaction.transition};
    @starting-style { opacity: 0; }
    &[data-state="closed"] { opacity: 0; pointer-events: none; }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const itemBaseStyle = css`
    /* Menu rows share their neutral feedback container across input states. */
    ${buttonVars['text.color']}: ${token.tab['context-menu'].item.color};
    ${buttonVars['text.background-color-hover']}: ${token.tab['context-menu'].item['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.tab['context-menu'].item['background-color-hover']};
    ${buttonVars['text.background-color-active']}: ${token.tab['context-menu'].item['background-color-hover']};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${token.tab['context-menu'].item.gap};
    height: ${token.tab['context-menu'].item.height};
    padding: ${token.tab['context-menu'].item.padding};
    font-size: ${token.tab['context-menu'].item["font-size"]};
    color: ${token.tab['context-menu'].item.color};
    border-radius: ${token.tab['context-menu'].item["border-radius"]};
    cursor: pointer;
    white-space: nowrap;
    background: transparent;
    border: none;
    width: 100%;
    text-align: start;
    box-sizing: border-box;
    transition: background-color ${token.motion.interaction.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: -2px;
    }
`;

export const itemDisabledStyle = css`
    color: ${token.tab['context-menu'].item['color-disabled']};
    cursor: not-allowed;

    &:hover {
        background-color: transparent;
    }
`;

export const separatorStyle = css`
    height: 1px;
    margin: ${token.tab['context-menu'].separator.margin};
    background-color: ${token.tab['context-menu'].separator["background-color"]};
    list-style: none;
`;

export const itemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.tab['context-menu'].item.icon.width};
    height: ${token.tab['context-menu'].item.icon.width};
    flex-shrink: 0;
    color: ${token.tab['context-menu'].item.icon.color};

    & > svg, & > img {
        width: 100%;
        height: 100%;
    }
`;

export const itemIconDisabledStyle = css`
    color: ${token.tab['context-menu'].item['color-disabled']};
`;
