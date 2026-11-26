import { css } from '@crab-dev/css';
import token from './token.js';

export const plotStyle = css`
    position: relative;
    line-height: 0;
`;

export const keyboardLayerStyle = css`
    position: absolute;
    inset: 0;
    pointer-events: none;
`;

export const sliceButtonStyle = css`
    position: absolute;
    width: 10px;
    height: 10px;
    transform: translate(-50%, -50%);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    pointer-events: none;
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        box-shadow: 0 0 0 calc(2 * ${token.root['outline-width-focus']}) ${token.palette.canvas['background-color']};
    }
    @media (forced-colors: active) {
        &:focus-visible {
            /* 扇区本身也可能是 Highlight，实心 Canvas 圆点确保仍能定位焦点。 */
            forced-color-adjust: none;
            background-color: Canvas;
            outline-color: Highlight;
            box-shadow: none;
        }
    }
`;

export const tooltipStyle = css`
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: ${token.tooltip.gap};
    box-sizing: border-box;
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

export const tooltipValueStyle = css`
    color: ${token.tooltip.value.color};
    font-weight: ${token.tooltip.value['font-weight']};
    font-variant-numeric: tabular-nums;
`;
