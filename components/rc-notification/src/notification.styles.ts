import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from './token.js';

const colorBackground = token.root["background-color"];
const colorText = token.text.color;
const colorProgressStart = token.progress.start.color;
const colorProgressEnd = token.progress.end.color;

const dimensionPadding = token.root.padding;
const dimensionBorderRadius = token.root["border-radius"];
const dimensionTitleMarginBottom = token.title["margin-bottom"];
const dimensionProgressHeight = token.progress.height;

const typographyTitleFontSize = token.title["font-size"];
const typographyTitleLineHeight = token.title["line-height"];
const typographyContentFontSize = token.content["font-size"];

const opacityClose = token.close.opacity;

export const notificationStyle = css`
    position: relative;
    display: flex;
    flex-direction: column;
    width: ${token.root.width};
    min-width: 0;
    padding: ${dimensionPadding};
    border-radius: ${dimensionBorderRadius};
    isolation: isolate;
    background-color: ${colorBackground};
    box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.root["box-shadow"]};
    z-index: ${token.stack.front["z-index"]};
    grid-area: 1 / 1;
    overflow: hidden;
    pointer-events: auto;
    box-sizing: border-box;
    max-width: min(100%, calc(100vw - ${token.stack.translate} * 2));
    max-height: calc(100dvh - ${token.stack.translate} * 2 - ${token.stack.gap} * 2);
    opacity: 1;
    scale: 1;
    transform-origin: center bottom;
    translate: 0 ${token.stack.translate};
    &[data-stack="2"] {
        translate: 0 calc(${token.stack.translate} + ${token.stack.gap});
        scale: ${token.stack.second.scale};
        z-index: ${token.stack.second["z-index"]};
        background-color: ${token.stack.second["background-color"]};
        box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.stack["box-shadow"]};
    }
    &[data-stack="3"] {
        translate: 0 calc(${token.stack.translate} + ${token.stack.gap} * 2);
        scale: ${token.stack.third.scale};
        z-index: ${token.stack.third["z-index"]};
        background-color: ${token.stack.third["background-color"]};
        box-shadow: inset 0 0 0 1px ${token.root["border-color"]}, ${token.stack["box-shadow"]};
    }
    &[data-stack="2"], &[data-stack="3"] {
        pointer-events: none;
        & > * { visibility: hidden; }
    }
    &[data-direction^="bottom"] {
        transform-origin: center top;
        translate: 0 calc(${token.stack.translate} * -1);
        &[data-stack="2"] { translate: 0 calc((${token.stack.translate} + ${token.stack.gap}) * -1); }
        &[data-stack="3"] { translate: 0 calc((${token.stack.translate} + ${token.stack.gap} * 2) * -1); }
    }
    transition:
        opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition},
        scale ${token.motion.spatial.transition}, background-color ${token.motion.interaction.transition},
        box-shadow ${token.motion.interaction.transition};
    @starting-style {
        &[data-state="open"] { opacity: 0; translate: 0 -100%; }
        &[data-direction^="bottom"] { translate: 0 100%; }
        &[data-direction$="Left"] { translate: -120% 0; }
        &[data-direction$="Right"] { translate: 120% 0; }
    }
    &[data-state="closed"] { opacity: 0; translate: 0 -100%; pointer-events: none; }
    &[data-direction^="bottom"][data-state="closed"] { translate: 0 100%; }
    &[data-direction$="Left"][data-state="closed"] { translate: -120% 0; }
    &[data-direction$="Right"][data-state="closed"] { translate: 120% 0; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
`;

export const headerStyle = css`
    display: flex;
    align-items: flex-start;
    gap: ${token.title["margin-bottom"]};
    flex-shrink: 0;
    color: ${colorText};
    font-size: ${typographyTitleFontSize};
    line-height: ${typographyTitleLineHeight};
    margin-bottom: ${dimensionTitleMarginBottom};
`;

export const titleStyle = css`
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
`;

export const closeStyle = css`
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-active']};
    display: flex;
    align-items: center;
    opacity: ${opacityClose};
    user-select: none;
    cursor: pointer;
`;

export const contentStyle = css`
    color: ${colorText};
    font-size: ${typographyContentFontSize};
    line-height: ${token.content["line-height"]};
    min-height: 0;
    overflow: auto;
    overflow-wrap: anywhere;
`;

export const progressStyle = css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${dimensionProgressHeight};
    transform-origin: left;
    background: linear-gradient(90deg, ${colorProgressStart} 0%, ${colorProgressEnd} 100%);
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
    animation: notification-countdown ${token.progress['animation-duration']} linear ${token.progress['animation-delay']} forwards;
    &[data-paused="true"] { animation-play-state: paused; }
    @keyframes notification-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    @media (prefers-reduced-motion: reduce) { animation: none; }
    @media (forced-colors: active) { background: Highlight; }
`;
