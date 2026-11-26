import { css } from '@crab-dev/css';
import token from './token.js';

export const rootStyle = css`
    display: inline-flex;
    flex-direction: column;
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
    border-radius: ${token.swatch['block-size']};
    /* 保留和画布相同的系列色，主题在强制颜色模式下映射系统色。 */
    @media (forced-colors: active) { forced-color-adjust: none; }
`;

export const canvasWrapStyle = css`
    position: relative;
    line-height: 0;
`;

export const keyboardLayerStyle = css`
    position: absolute;
    inset: 0;
    pointer-events: none;
`;

export const pointButtonStyle = css`
    position: absolute;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    pointer-events: none;
    &:focus-visible {
        z-index: 1;
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        box-shadow: 0 0 0 calc(2 * ${token.root['outline-width-focus']}) ${token.palette.canvas['background-color']};
    }
    @media (forced-colors: active) {
        background: transparent;
        &:focus-visible { outline-color: Highlight; }
    }
`;

export const tooltipStyle = css`
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: ${token.tooltip.gap};
    box-sizing: border-box;
    max-inline-size: 100%;
    padding: ${token.tooltip.padding};
    border: 1px solid ${token.tooltip['border-color']};
    border-radius: ${token.tooltip['border-radius']};
    background: ${token.tooltip['background-color']};
    color: ${token.tooltip.color};
    box-shadow: ${token.tooltip['box-shadow']};
    line-height: ${token.root['line-height']};
    overflow-wrap: anywhere;
    pointer-events: none;
    @media (forced-colors: active) { border-color: CanvasText; }
`;

export const tooltipTitleStyle = css`
    font-weight: ${token.tooltip.value['font-weight']};
`;

export const tooltipRowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.tooltip.gap};
`;

export const tooltipNameStyle = css`
    min-inline-size: 0;
`;

export const tooltipValueStyle = css`
    margin-inline-start: auto;
    color: ${token.tooltip.value.color};
    font-weight: ${token.tooltip.value['font-weight']};
    font-variant-numeric: tabular-nums;
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
