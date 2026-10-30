import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { css } from '@crab-dev/css';
import token from './token.js';

export const baseStyle = css`
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    transition: ${token.root.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) {
        /* Keep system ink and its surface together, including the label and
           icon descendants. Automatic text backplates can otherwise hide a
           primary label. Override custom inline colors only in this mode. */
        forced-color-adjust: none;
        color: CanvasText !important;
        background-color: Canvas !important;
        border-color: CanvasText !important;
    }
    border: 1px solid transparent;
    font-family: inherit;
`;

export const closeButtonStyle = css`
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-active']};
    ${buttonVars['root.outline-color-focus']}: ${token.close['outline-color-focus']};
    ${buttonVars['root.outline-width-focus']}: ${token.close['outline-width-focus']};
    ${buttonVars['root.outline-offset-focus']}: ${token.close['outline-offset-focus']};
    ${buttonVars['shape.default.border-radius']}: ${token.close['border-radius']};
    ${buttonVars['shape.default.border-radius-active']}: ${token.close['border-radius']};
    ${buttonVars['root.touch.min-width']}: ${token.interaction.touch['min-width']};
    ${buttonVars['root.touch.min-height']}: ${token.interaction.touch['min-height']};
    && {
        flex-shrink: 0;
        width: min(${token.close.control.width}, var(--tag-close-available-size));
        height: min(${token.close.control.width}, var(--tag-close-available-size));
        min-width: 0;
        min-height: 0;
        padding: 0;
        color: ${token.close.color};
    }
    &:hover { color: ${token.close['color-hover']}; }
`;

export const noBorderStyle = css`
    border-color: transparent;
`;

export const primaryColorStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary['background-color']};
`;

export const primaryBorderStyle = css`
    border-color: ${token.primary['border-color']};
`;

export const successColorStyle = css`
    color: ${token.success.color};
    background-color: ${token.success['background-color']};
`;

export const successBorderStyle = css`
    border-color: ${token.success['border-color']};
`;

export const warningColorStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning['background-color']};
`;

export const warningBorderStyle = css`
    border-color: ${token.warning['border-color']};
`;

export const errorColorStyle = css`
    color: ${token.root['color-error']};
    background-color: ${token.root['background-color-error']};
`;

export const errorBorderStyle = css`
    border-color: ${token.root['border-color-error']};
`;

export const defaultColorStyle = css`
    color: ${token.default.color};
    background-color: ${token.default['background-color']};
`;

export const defaultBorderStyle = css`
    border-color: ${token.default['border-color']};
`;
