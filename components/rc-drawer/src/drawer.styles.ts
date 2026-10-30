import { css } from "@crab-dev/css";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "./token.js";

export const dialogResetStyle = css`
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: transparent;
    overflow: hidden;

    &::backdrop {
        background-color: transparent;
    }
`;

export const overlayStyle = css`
    position: fixed;
    inset: 0;
    background-color: ${token.overlay['background-color']};
    opacity: 1;
    transition: opacity ${token.motion.fade.transition};
    @starting-style { opacity: 0; }
    &[data-state="closed"] {
        opacity: 0;
        transition: opacity ${token.motion.fade.transition};
    }

    @media (prefers-reduced-motion: reduce) {
        &, &[data-state="closed"] { transition: none; }
    }
`;

export const panelBaseStyle = css`
    position: fixed;
    display: flex;
    flex-direction: column;
    background-color: ${token.root['background-color']};
    box-shadow: ${token.root['box-shadow']};
    overflow: hidden;
    box-sizing: border-box;
    max-width: 100vw;
    max-height: 100dvh;
    translate: 0 0;
    transition: translate ${token.motion.expand.transition};
    @starting-style {
        &[data-placement="left"] { translate: -100% 0; }
        &[data-placement="right"] { translate: 100% 0; }
        &:dir(rtl)[data-placement="left"] { translate: 100% 0; }
        &:dir(rtl)[data-placement="right"] { translate: -100% 0; }
        &[data-placement="top"] { translate: 0 -100%; }
        &[data-placement="bottom"] { translate: 0 100%; }
    }
    &[data-state="closed"] { transition: translate ${token.motion.exit.transition}; }
    &[data-placement="left"][data-state="closed"] { translate: -100% 0; }
    &[data-placement="right"][data-state="closed"] { translate: 100% 0; }
    &:dir(rtl)[data-placement="left"][data-state="closed"] { translate: 100% 0; }
    &:dir(rtl)[data-placement="right"][data-state="closed"] { translate: -100% 0; }
    &[data-placement="top"][data-state="closed"] { translate: 0 -100%; }
    &[data-placement="bottom"][data-state="closed"] { translate: 0 100%; }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
    @media (prefers-reduced-motion: reduce) {
        &, &[data-state="closed"] { transition: none; }
    }
`;

export const panelPlacementLeftStyle = css`
    border-inline-end: 1px solid ${token.root['border-color']};
    border-start-end-radius: ${token.root['border-radius']};
    border-end-end-radius: ${token.root['border-radius']};
    inset-block: 0;
    inset-inline-start: 0;
    height: 100dvh;
`;

export const panelPlacementRightStyle = css`
    border-inline-start: 1px solid ${token.root['border-color']};
    border-start-start-radius: ${token.root['border-radius']};
    border-end-start-radius: ${token.root['border-radius']};
    inset-block: 0;
    inset-inline-end: 0;
    height: 100dvh;
`;

export const panelPlacementTopStyle = css`
    border-block-end: 1px solid ${token.root['border-color']};
    border-end-start-radius: ${token.root['border-radius']};
    border-end-end-radius: ${token.root['border-radius']};
    inset-inline: 0;
    inset-block-start: 0;
    width: 100vw;
`;

export const panelPlacementBottomStyle = css`
    border-block-start: 1px solid ${token.root['border-color']};
    border-start-start-radius: ${token.root['border-radius']};
    border-start-end-radius: ${token.root['border-radius']};
    inset-inline: 0;
    inset-block-end: 0;
    width: 100vw;
`;

export const panelSizeSmallHorizontalStyle = css`
    width: ${token.size.small.width};
`;

export const panelSizeMediumHorizontalStyle = css`
    width: ${token.size.medium.width};
`;

export const panelSizeLargeHorizontalStyle = css`
    width: ${token.size.large.width};
`;

export const panelSizeSmallVerticalStyle = css`
    height: ${token.size.small.height};
`;

export const panelSizeMediumVerticalStyle = css`
    height: ${token.size.medium.height};
`;

export const panelSizeLargeVerticalStyle = css`
    height: ${token.size.large.height};
`;

export const headerStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.footer.gap};
    padding: ${token.header.padding};
    border-block-end: 1px solid ${token.header['border-color']};
    flex-shrink: 0;
`;

export const titleStyle = css`
    flex: 1;
    min-width: 0;
    font-weight: ${token.header.title['font-weight']};
    font-size: ${token.header.title['font-size']};
    line-height: ${token.header.title['line-height']};
    letter-spacing: ${token.header.title["letter-spacing"]};
    color: ${token.header.title.color};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const bodyStyle = css`
    flex: 1;
    min-height: 0;
    padding: ${token.body.padding};
    overflow: auto;
`;

export const footerStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.footer.gap};
    padding: ${token.footer.padding};
    border-block-start: 1px solid ${token.footer['border-color']};
    flex-shrink: 0;
`;

export const closeButtonStyle = css`
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-active']};
    ${buttonVars['icon.width']}: ${token.close.icon.width};
    width: ${token.close.width};
    height: ${token.close.width};
    flex-shrink: 0;
`;
