import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from './token.js';

export const baseStyle = css`
    display: flex;
    align-items: flex-start;
    box-sizing: border-box;
    padding: ${token.root.padding};
    border-radius: ${token.root["border-radius"]};
    border: 1px solid transparent;
    font-size: ${token.root["font-size"]};
    line-height: ${token.root["line-height"]};
    height: auto;
    min-height: 0;
    interpolate-size: allow-keywords;
    transition: ${token.root.transition}, height ${token.motion.collapse.transition},
        padding-block ${token.motion.collapse.transition}, border-block-width ${token.motion.collapse.transition},
        opacity ${token.interaction.transition};
    &[data-state="closed"] {
        height: 0;
        padding-block: 0;
        border-block-width: 0;
        opacity: 0;
        overflow: clip;
        pointer-events: none;
    }
    word-break: break-word;
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { border-color: CanvasText; }
`;

export const successStyle = css`
    color: ${token.success.color};
    background-color: ${token.success["background-color"]};
    border-color: ${token.success['border-color']};
`;

export const warningStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning["background-color"]};
    border-color: ${token.warning['border-color']};
`;

export const errorStyle = css`
    color: ${token.root['color-error']};
    background-color: ${token.root['background-color-error']};
    border-color: ${token.root['border-color-error']};
`;

export const infoStyle = css`
    color: ${token.info.color};
    background-color: ${token.info["background-color"]};
    border-color: ${token.info['border-color']};
`;

export const successIconStyle = css`color: ${token.success.icon.color};`;

export const warningIconStyle = css`color: ${token.warning.icon.color};`;

export const errorIconStyle = css`color: ${token.icon['color-error']};`;

export const infoIconStyle = css`color: ${token.info.icon.color};`;

export const iconStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-inline-end: ${token.icon["margin-right"]};
    height: calc(${token.root["font-size"]} * ${token.root["line-height"]});
    > svg {
        width: ${token.icon.width};
        height: ${token.icon.width};
    }
`;

export const iconWithTitleStyle = css`
    height: calc(${token.title["font-size"]} * ${token.root["line-height"]});
    > svg {
        width: ${token.icon['with-title'].width};
        height: ${token.icon['with-title'].width};
    }
`;

export const contentStyle = css`
    flex: 1;
    min-width: 0;
`;

export const titleStyle = css`
    font-size: ${token.title["font-size"]};
    font-weight: ${token.title["font-weight"]};
    margin-bottom: ${token.title["margin-bottom"]};
`;

export const closeButtonStyle = css`
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-active']};
    /* Button owns the centered coarse-pointer hit layer. Expanding the visual
       close box would push its glyph below the first line and grow the banner. */
    ${buttonVars['root.touch.min-width']}: ${token.interaction.touch['min-width']};
    ${buttonVars['root.touch.min-height']}: ${token.interaction.touch['min-height']};
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } &[aria-selected='true'], &[aria-current='page'] { outline: 2px solid Highlight; } }
    @media (prefers-reduced-motion: reduce) { transition: none; }

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-inline-start: ${token.icon["margin-right"]};
    height: calc(${token.root["font-size"]} * ${token.root["line-height"]});
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${token.close.color};
    &:hover {
        color: ${token.close['color-hover']};
    }
`;

export const closeButtonWithTitleStyle = css`
    height: calc(${token.title["font-size"]} * ${token.root["line-height"]});
`;

// Button's public children preserve custom close content and its dimensions.
// A flex child avoids an inline SVG baseline adding font descent to alignment.
export const closeIconStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;
