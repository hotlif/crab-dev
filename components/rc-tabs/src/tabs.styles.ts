import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import { css } from '@crab-dev/css';
import token from './token.js';

export const rootStyle = css`
    display: flex;
    flex-direction: column;
    min-width: 0;
    font-weight: ${token.root['font-weight']};
`;

export const barWrapperStyle = css`
    display: flex;
    align-items: stretch;
    gap: ${token.bar.gap};
    min-width: 0;
`;

export const barStyle = css`
    position: relative;
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const barListStyle = css`
    display: flex;
    box-sizing: border-box;
    align-items: stretch;
    flex: 0 0 auto;
    width: max-content;
    gap: ${token.bar.gap};
    min-width: 100%;
    /* Reserve the last border when native RTL scroll ranges round fractional
       content widths down. Border-box keeps a fitting list from overflowing. */
    padding-inline-end: 1px;
`;

export const barLineStyle = css`
    border-bottom: 1px solid ${token.bar['border-color']};
    background: ${token.bar['background-color']};
    border-radius: ${token.bar['border-radius']};
    padding: ${token.bar.padding};
`;

export const itemLineStyle = css`
    border-radius: ${token.item['border-radius']};
    &[aria-selected='true'] {
        background: ${token.item['background-color-active']};
        box-shadow: ${token.item['box-shadow-active']};
    }
`;

export const barCenteredStyle = css`
    justify-content: center;
`;

export const itemBaseStyle = css`
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${token.item.icon.gap};
    flex: 0 0 auto;
    border: 0;
    background: transparent;
    color: ${token.item.color};
    cursor: pointer;
    white-space: nowrap;
    font: inherit;
    font-weight: inherit;
    line-height: ${token.root['line-height']};
    transition: ${token.motion.color};

    @media (prefers-reduced-motion: reduce) { transition: none; }

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: currentColor;
        opacity: 0;
        transition: ${token['state-layer'].transition};
    }
    &:not(:disabled):hover::before { opacity: ${token['state-layer']['opacity-hover']}; }
    &:not(:disabled):focus-visible::before { opacity: ${token['state-layer']['opacity-focus']}; }
    &:not(:disabled):active::before { opacity: ${token['state-layer']['opacity-pressed']}; }
    &:not(:disabled):not([aria-selected='true']):hover { color: ${token.item['color-hover']}; }
    @media (prefers-reduced-motion: reduce) { &::before { transition: none; } }
    @media (forced-colors: active) { &::before { display: none; } }


    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.tab['outline-width-focus']} solid ${token.tab['outline-color-focus']};
        outline-offset: ${token.tab['outline-offset-focus']};
    }

    @media (forced-colors: active) {
        /* Keep selection inside the real scrolling bar. Keyboard focus uses
           a distinct system foreground ring; selected pills override it below. */
        &[aria-selected='true'], &[aria-current='page'] {
            outline: 2px solid Highlight;
            outline-offset: -2px;
        }
        &:focus-visible {
            outline: ${token.tab['outline-width-focus']} solid CanvasText;
            outline-offset: calc(-1 * ${token.tab['outline-width-focus']} - 1px);
        }
    }
`;

export const itemSmallStyle = css`
    height: ${token.size.small.height};
    padding: 0 ${token.size.small['padding-inline']};
    font-size: ${token.size.small['font-size']};
`;

export const itemMediumStyle = css`
    height: ${token.size.medium.height};
    padding: 0 ${token.size.medium['padding-inline']};
    font-size: ${token.size.medium['font-size']};
`;

export const itemLargeStyle = css`
    height: ${token.size.large.height};
    padding: 0 ${token.size.large['padding-inline']};
    font-size: ${token.size.large['font-size']};
`;

export const itemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.item.icon.width};
    height: ${token.item.icon.width};
    & > svg, & > img { width: 100%; height: 100%; }
`;

export const itemActiveStyle = css`
    color: ${token.item['color-active']};
`;

export const itemDisabledStyle = css`
    color: ${token.item.color};
    opacity: ${token.item['opacity-disabled']};
    cursor: not-allowed;
`;

export const itemCardStyle = css`
    background: ${token.card['background-color']};
    border: 1px solid transparent;
    border-bottom: 0;
    border-top-left-radius: ${token.card['border-radius']};
    border-top-right-radius: ${token.card['border-radius']};

`;

export const itemCardActiveStyle = css`
    background: ${token.card['background-color-active']};
    border-color: ${token.card['border-color']};

`;

export const itemPillStyle = css`
    border-radius: ${token.pill['border-radius']};

`;

export const itemPillActiveStyle = css`
    background: ${token.pill['background-color-active']};
    color: ${token.pill['color-active']};

    @media (forced-colors: active) {
        forced-color-adjust: none;
        background: Highlight;
        color: HighlightText;
        /* Selection already uses Highlight. A contrasting contained ring
           distinguishes keyboard focus without escaping the scrolling bar. */
        &:focus-visible {
            outline: ${token.tab['outline-width-focus']} solid HighlightText;
            outline-offset: calc(-1 * ${token.tab['outline-width-focus']} - 1px);
        }
    }

`;

export const indicatorLabelStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: ${token.indicator['min-width']};
    align-self: stretch;
    position: relative;
`;

export const indicatorStyle = css`
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    height: ${token.indicator.height};
    border-radius: ${token.indicator['border-radius']} ${token.indicator['border-radius']} 0 0;
    background: ${token.indicator.color};
    pointer-events: none;
    transform-origin: left bottom;
    opacity: 0;
    transition: ${token.indicator.transition};
    [aria-selected='true'] > span > & { opacity: 1; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { background: Highlight; }
`;

export const tabItemWrapperStyle = css`
    position: relative;
    display: inline-flex;
    flex: 0 0 auto;
`;

export const closeSpaceStyle = css`
    display: inline-flex;
    min-width: ${token.close.touch.width};
    min-height: ${token.close.touch.width};
    margin-inline-start: ${token.close.gap};
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
`;

export const closeButtonStyle = css`
    /* This utility action owns neutral feedback; Button owns state selectors. */
    ${buttonVars['text.color']}: ${token.close.color};
    ${buttonVars['text.background-color-hover']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.close['background-color-hover']};
    ${buttonVars['text.background-color-active']}: ${token.close['background-color-hover']};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    inset-block-start: 50%;
    translate: 0 -50%;
    margin: 0;
    width: ${token.close.touch.width};
    height: ${token.close.touch.width};
    min-width: ${token.close.touch.width};
    min-height: ${token.close.touch.width};
    & svg { width: ${token.close.width}; height: ${token.close.width}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    padding: 0;
    border: 0;
    background: transparent;
    color: ${token.close.color};
    cursor: pointer;
    border-radius: ${token.close['border-radius']};
    transition: ${token.motion.color};
    @media (prefers-reduced-motion: reduce) { transition: none; }

    &:hover {
        color: ${token.close['color-hover']};
    }

    &:focus {
        outline: none;
    }

    &:focus-visible {
        outline: ${token.close['outline-width-focus']} solid ${token.close['outline-color-focus']};
        outline-offset: ${token.close['outline-offset-focus']};
    }
`;

export const extraStyle = css`
    display: inline-flex;
    align-items: center;
    flex: 0 0 auto;
`;

export const contentStyle = css`
    padding-top: ${token.content['padding-top']};
    min-height: 0;
`;
