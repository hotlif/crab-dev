import { css } from '@crab-dev/css';
import token from './token.js';

export const rootStyle = css`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    min-inline-size: 0;
    gap: ${token.root.gap};
    font-family: ${token.root['font-family']};
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
`;

export const legendStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: ${token.root.gap};
    row-gap: ${token.legend['row-gap']};
`;

export const legendItemStyle = css`
    display: inline-flex;
    align-items: center;
    min-inline-size: 0;
    max-inline-size: 100%;
    gap: ${token.legend.item.gap};
    padding: ${token.legend.item.padding};
    border: 0;
    border-radius: ${token.legend.item['border-radius']};
    background-color: transparent;
    color: ${token.legend.item.color};
    font: inherit;
    overflow-wrap: anywhere;
    cursor: pointer;
    transition: background-color ${token.legend.item.transition};
    &:hover { background-color: ${token.legend.item['background-color-hover']}; }
    &:active { background-color: ${token.legend.item['background-color-pressed']}; }
    &[aria-pressed='false'] { text-decoration: line-through; }
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
    }
    @media (pointer: coarse) {
        min-width: ${token.legend.item.touch['min-width']};
        min-height: ${token.legend.item.touch['min-height']};
    }
    @media (forced-colors: active) {
        &:focus-visible { outline-color: Highlight; }
    }
    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const swatchStyle = css`
    flex: none;
    inline-size: ${token.swatch['inline-size']};
    block-size: ${token.swatch['block-size']};
    border-radius: 50%;
    @media (forced-colors: active) { forced-color-adjust: none; }
`;

export const emptyStyle = css`
    display: grid;
    place-items: center;
`;

export const visuallyHiddenStyle = css`
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;
