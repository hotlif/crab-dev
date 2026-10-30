import { css } from '@crab-dev/css';
import token, { vars } from './token.js';

export const statusWrapStyle = css`
    display: inline-flex;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    gap: ${token.status.text.gap};
    color: ${token.status.text.color};
    font-size: ${token.status.text['font-size']};
    line-height: 1.5;
    vertical-align: middle;
`;

export const wrapperStyle = css`
    position: relative;
    display: inline-flex;
    /* Anchor the indicator to the actual host rather than a stretched grid row. */
    width: fit-content;
    height: fit-content;
    min-width: 0;
    max-width: 100%;
    line-height: 1;
    vertical-align: middle;
`;

export const standaloneStyle = css`
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    line-height: 1;
`;

export const indicatorPositionedStyle = css`
    position: absolute;
    top: 0;
    inset-inline-end: 0;
    ${vars['indicator.anchor.left']}: 50%;
    ${vars['indicator.offset.left']}: 0px;
    ${vars['indicator.offset.top']}: 0px;
    transform: ${token.indicator.transform};
    transform-origin: 100% 0%;
    z-index: 1;
    pointer-events: none;

    &:dir(rtl) {
        ${vars['indicator.anchor.left']}: -50%;
        transform-origin: 0% 0%;
    }
`;

export const countBaseStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: ${token.count.color};
    background-color: ${token.count['background-color']};
    font-weight: ${token.count['font-weight']};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    line-height: 1;
    transition: ${token.root.transition};
`;

export const countBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

export const countSizeDefaultStyle = css`
    height: ${token.size.default.height};
    min-width: ${token.size.default['min-width']};
    padding: ${token.size.default.padding};
    border-radius: calc(${token.size.default.height} / 2);
    font-size: ${token.size.default['font-size']};
`;

export const countSizeSmallStyle = css`
    height: ${token.size.small.height};
    min-width: ${token.size.small['min-width']};
    padding: ${token.size.small.padding};
    border-radius: calc(${token.size.small.height} / 2);
    font-size: ${token.size.small['font-size']};
`;

export const dotBaseStyle = css`
    display: inline-block;
    box-sizing: border-box;
    border-radius: 50%;
    background-color: ${token.count['background-color']};
    transition: ${token.root.transition};
    flex-shrink: 0;
`;

export const dotSizeDefaultStyle = css`
    width: ${token.dot.default.width};
    height: ${token.dot.default.width};
`;

export const dotSizeSmallStyle = css`
    width: ${token.dot.small.width};
    height: ${token.dot.small.width};
`;

export const dotBorderStyle = css`
    box-shadow: 0 0 0 2px ${token.count['border-color']};
`;

export const forcedColorStyle = css`
    @media (forced-colors: active) {
        forced-color-adjust: none;
        color: HighlightText !important;
        background-color: Highlight !important;
        box-shadow: none !important;
        outline: 1px solid Canvas;
        outline-offset: 0;
    }
`;

export const colorDefaultStyle = css`
    background-color: ${token.status.default.color};
`;

export const colorProcessingStyle = css`
    background-color: ${token.status.processing.color};
`;

export const colorSuccessStyle = css`
    background-color: ${token.status.success.color};
`;

export const colorWarningStyle = css`
    background-color: ${token.status.warning.color};
`;

export const colorErrorStyle = css`
    background-color: ${token.status['color-error']};
`;

export const countColorDefaultStyle = css`
    color: ${token.count.default.color};
    background-color: ${token.count.default['background-color']};
`;

export const countColorProcessingStyle = css`
    color: ${token.count.processing.color};
    background-color: ${token.count.processing['background-color']};
`;

export const countColorSuccessStyle = css`
    color: ${token.count.success.color};
    background-color: ${token.count.success['background-color']};
`;

export const countColorWarningStyle = css`
    color: ${token.count.warning.color};
    background-color: ${token.count.warning['background-color']};
`;

export const countColorErrorStyle = css`
    color: ${token.count['color-error']};
    background-color: ${token.count['background-color-error']};
`;

export const processingDotStyle = css`
    position: relative;
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        box-shadow: 0 0 0 0 currentColor;
        opacity: 0.6;
        background-color: inherit;
        animation: badge-pulse 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes badge-pulse {
        0% {
            transform: scale(1);
            opacity: 0.6;
        }
        100% {
            transform: scale(2.4);
            opacity: 0;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        &::after {
            animation: none;
        }
    }
`;

export const statusTextStyle = css`
    display: inline-block;
    min-width: 0;
    overflow-wrap: anywhere;
`;

export const numericCountStyle = css`
    direction: ltr;
    unicode-bidi: isolate;
`;
