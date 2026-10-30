import { css } from '@crab-dev/css';
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import token from './token.js';

export const baseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: ${token.root.padding};
    border-radius: ${token.root["border-radius"]};
    border: 1px solid ${token.root["border-color"]};
    background-color: ${token.root["background-color"]};
    box-shadow: ${token.root["box-shadow"]};
    font-size: ${token.root["font-size"]};
    line-height: ${token.root["line-height"]};
    color: ${token.text.color};
    pointer-events: all;
    grid-area: 1 / 1;
    overflow: hidden;
    max-width: min(100%, calc(100vw - ${token.stack.translate} * 2));
    box-sizing: border-box;
    opacity: 1;
    translate: 0 0;
    &[data-stack="1"] { translate: 0 ${token.stack.translate}; }
    &[data-stack="2"] { translate: 0 calc(${token.stack.translate} * 2); }
    &[data-stack="3"] { translate: 0 calc(${token.stack.translate} * 3); }
    transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition};
    @starting-style {
        &[data-state="open"] { opacity: 0; translate: 0 -100%; }
    }
    &[data-state="closed"] { opacity: 0; translate: 0 -100%; pointer-events: none; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }
`;

export const progressStyle = css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${token.progress.height};
    transform-origin: left;
    background: linear-gradient(90deg, ${token.progress.start.color} 0%, ${token.progress.end.color} 100%);
    border-top-right-radius: 0;
    border-bottom-left-radius: inherit;
    animation: message-countdown ${token.progress['animation-duration']} linear ${token.progress['animation-delay']} forwards;
    &[data-paused="true"] { animation-play-state: paused; }
    @keyframes message-countdown { from { transform: scaleX(1); } to { transform: scaleX(0); } }
    @media (prefers-reduced-motion: reduce) { animation: none; }
    @media (forced-colors: active) { background: Highlight; }
`;

export const iconBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-inline-end: ${token.icon["margin-right"]};
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
    }
`;

export const contentStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
`;

export const successIconStyle = css`
    color: ${token.success.icon.color};
`;

export const warningIconStyle = css`
    color: ${token.warning.icon.color};
`;

export const errorIconStyle = css`
    color: ${token.icon['color-error']};
`;

export const infoIconStyle = css`
    color: ${token.info.icon.color};
`;

export const loadingIconStyle = css`
    color: ${token.info.icon.color};
`;

export const loadingIndicatorStyle = css`
    --rc-spin-size: ${token.icon.width};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;