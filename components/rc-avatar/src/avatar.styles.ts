import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from './token.js';

export const baseStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    flex-shrink: 0;
    border: 1px solid transparent;
    vertical-align: middle;
    line-height: 1;
    font-family: inherit;
    user-select: none;
    transition: ${token.root.transition};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const disabledStyle = css`
    &[aria-disabled='true'], &[data-disabled] {
        opacity: ${token.root['opacity-disabled']};
        cursor: not-allowed;
        pointer-events: none;
    }
`;

export const interactiveStyle = css`
    cursor: pointer;

    &:hover:not([aria-disabled='true']) {
        box-shadow: 0 0 0 1px ${token.root['border-color-hover']};
    }

    &:focus-visible {
        outline: ${token.interaction['outline-width-focus']} solid ${token.ring['color-focus']};
        outline-offset: ${token.interaction['outline-offset-focus']};
    }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } }

    &:active:not([aria-disabled='true']) {
        transform: scale(0.96);
    }

    @media (prefers-reduced-motion: reduce) {
        &:active:not([aria-disabled='true']) {
            transform: none;
        }
    }
`;

export const actionStyle = css`
    && {
        /* The action follows its actual avatar, including inside a stretch grid.
           Coarse-pointer reach belongs to Button's independent hit layer. */
        min-width: 0;
        min-height: 0;
        width: max-content;
        height: max-content;
        aspect-ratio: auto;
        padding: 0;
        border: 0;
        vertical-align: middle;
        ${buttonVars['root.touch.min-width']}: ${token.interaction.touch['min-width']};
        ${buttonVars['root.touch.min-height']}: ${token.interaction.touch['min-height']};
        ${buttonVars['root.outline-color-focus']}: ${token.interaction['outline-color-focus']};
        ${buttonVars['root.outline-width-focus']}: ${token.interaction['outline-width-focus']};
        ${buttonVars['root.outline-offset-focus']}: ${token.interaction['outline-offset-focus']};
        ${buttonVars['root.border-radius']}: ${token.shape.square['border-radius']};
        > span:last-child { display: inline-flex; }
    }
`;

export const borderedStyle = css`
    border-color: ${token.root['border-color']};
`;

export const noBorderStyle = css`
    border-color: transparent;
`;

export const circleStyle = css`
    border-radius: 50%;
`;

export const squareStyle = css`
    border-radius: ${token.shape.square['border-radius']};
`;

export const sizeSmallStyle = css`
    width: ${token.size.small.width};
    height: ${token.size.small.width};
    font-size: ${token.size.small['font-size']};
`;

export const sizeMiddleStyle = css`
    width: ${token.size.medium.width};
    height: ${token.size.medium.width};
    font-size: ${token.size.medium['font-size']};
`;

export const sizeLargeStyle = css`
    width: ${token.size.large.width};
    height: ${token.size.large.width};
    font-size: ${token.size.large['font-size']};
`;

export const variantDefaultStyle = css`
    color: ${token.default.color};
    background-color: ${token.default['background-color']};
`;

export const variantPrimaryStyle = css`
    color: ${token.primary.color};
    background-color: ${token.primary['background-color']};
`;

export const variantSuccessStyle = css`
    color: ${token.success.color};
    background-color: ${token.success['background-color']};
`;

export const variantWarningStyle = css`
    color: ${token.warning.color};
    background-color: ${token.warning['background-color']};
`;

export const variantErrorStyle = css`
    color: ${token.root['color-error']};
    background-color: ${token.root['background-color-error']};
`;

export const forcedFallbackStyle = css`
    @media (forced-colors: active) {
        forced-color-adjust: none;
        color: CanvasText !important;
        background-color: Canvas !important;
        border-color: CanvasText !important;
    }
`;

export const forcedPrimaryStyle = css`
    @media (forced-colors: active) {
        forced-color-adjust: none;
        color: HighlightText !important;
        background-color: Highlight !important;
        border-color: CanvasText !important;
    }
`;

export const imageStyle = css`
    display: block;
    width: 100%;
    height: 100%;
`;

export const fitCoverStyle = css`
    object-fit: cover;
`;

export const fitContainStyle = css`
    object-fit: contain;
`;

export const fitFillStyle = css`
    object-fit: fill;
`;

export const fitNoneStyle = css`
    object-fit: none;
`;

export const fitScaleDownStyle = css`
    object-fit: scale-down;
`;

export const contentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: ${token.content['max-width']};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: ${token.content['font-weight']};
`;

export const iconWrapStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;

    > svg {
        width: 1em;
        height: 1em;
    }
`;

export const iconSmallStyle = css`
    font-size: ${token.icon.small['font-size']};
`;

export const iconMiddleStyle = css`
    font-size: ${token.icon.medium['font-size']};
`;

export const iconLargeStyle = css`
    font-size: ${token.icon.large['font-size']};
`;
