import { css } from '@crab-dev/css';
import token from './token.js';

export const rootStyle = css`
    font-family: ${token.root['font-family']};
    line-height: ${token.root['line-height']};
    display: inline-flex;
    flex-direction: column;
    gap: ${token.legend.gap};
`;

export const legendStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: ${token.legend['column-gap']};
    row-gap: ${token.legend['row-gap']};
`;

export const legendItemStyle = css`
    @media (pointer: coarse) { min-width: ${token.legend.item.touch['min-width']}; min-height: ${token.legend.item.touch['min-height']}; }
    display: inline-flex;
    align-items: center;
    gap: ${token.legend.item.gap};
    padding: ${token.legend.item.padding};
    border: 0;
    background: transparent;
    border-radius: ${token.legend.item['border-radius']};
    font-size: ${token.legend.label['font-size']};
    color: ${token.legend.label.color};
    cursor: pointer;
    transition: ${token.legend.item.transition};
    &:hover {
        background-color: ${token.legend.item['background-color-hover']};
    }
    &:active { background-color: ${token.legend.item['background-color-pressed']}; }
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        box-shadow: ${token.root['box-shadow-focus']};
    }
    /* 强制颜色不绘制 box-shadow，系统焦点轮廓须覆盖上面的普通模式重置。 */
    @media (forced-colors: active) {
        &:focus-visible { outline: ${token.root['outline-width-focus']} solid Highlight; }
    }
    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const legendItemHiddenStyle = css`
    opacity: ${token.legend.item['opacity-hidden']};
    text-decoration: line-through;
    /* 隐藏状态仍由划线表达；不能把键盘焦点轮廓一起减淡。 */
    &:focus-visible { opacity: 1; }
`;

export const legendSwatchStyle = css`
    inline-size: ${token.legend.swatch['inline-size']};
    block-size: ${token.legend.swatch['block-size']};
    border-radius: ${token.legend.swatch['border-radius']};
    flex-shrink: 0;
`;

export const legendSwatchHiddenStyle = css`
    filter: grayscale(1);
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

export const barButtonStyle = css`
    position: absolute;
    padding: 0;
    border: 0;
    background: transparent;
    border-radius: ${token.bar['border-radius']};
    pointer-events: none;
    &:focus-visible {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        /* 柱间距可能仅2px；表面色隔离边避免焦点轮廓直接贴住相近系列色。 */
        box-shadow: 0 0 0 calc(${token.root['outline-width-focus']} + ${token.root['outline-width-focus']}) ${token.palette.canvas['background-color']};
    }
    /* 覆盖按钮保持具体柱体的焦点位置，不能仅依靠整类目的悬浮提示。 */
    @media (forced-colors: active) {
        &:focus-visible { outline: ${token.root['outline-width-focus']} solid Highlight; }
    }
`;

export const tooltipStyle = css`
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    row-gap: ${token.tooltip.rows['row-gap']};
    padding: ${token.tooltip.padding};
    background-color: ${token.tooltip['background-color']};
    border: ${token.tooltip['border-width']} solid ${token.tooltip['border-color']};
    border-radius: ${token.tooltip['border-radius']};
    box-shadow: ${token.tooltip['box-shadow']};
    font-size: ${token.tooltip['font-size']};
    line-height: ${token.tooltip['line-height']};
    white-space: nowrap;
`;

export const tooltipCategoryStyle = css`
    color: ${token.tooltip.category.color};
`;

export const tooltipRowStyle = css`
    display: flex;
    align-items: center;
    column-gap: ${token.tooltip.row['column-gap']};
`;

export const tooltipKeyStyle = css`
    inline-size: ${token.tooltip.key['inline-size']};
    block-size: ${token.tooltip.key['block-size']};
    border-radius: ${token.tooltip.key['border-radius']};
    flex-shrink: 0;
`;

export const tooltipNameStyle = css`
    color: ${token.tooltip.name.color};
`;

export const tooltipValueStyle = css`
    margin-inline-start: auto;
    padding-inline-start: ${token.tooltip.value['padding-inline-start']};
    color: ${token.tooltip.value.color};
    font-weight: ${token.tooltip.value['font-weight']};
    font-variant-numeric: tabular-nums;
`;

export const emptyStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const visuallyHiddenStyle = css`
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
`;
