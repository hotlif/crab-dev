import { css } from '@crab-dev/css';
import token from './token.js';

export const baseStyle = css`
    box-sizing: border-box;
    border: 0;
`;

export const variantDashedStyle = css`
    --rc-divider-stroke-dasharray: calc(${token.line['border-width']} * 3)
        calc(${token.line['border-width']} * 3);
`;

export const variantDottedStyle = css`
    /* At DPR 1, a one-pixel round cap can cover two neighboring pixels.
       Three stroke widths leave an actual background pixel between dots. */
    --rc-divider-stroke-dasharray: 0 calc(${token.line['border-width']} * 3);
    --rc-divider-stroke-linecap: round;
`;

export const lineStyle = css`
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: hidden;
    fill: none;
    stroke: ${token.line['border-color']};
    stroke-width: ${token.line['border-width']};
    stroke-dasharray: var(--rc-divider-stroke-dasharray, none);
    stroke-linecap: var(--rc-divider-stroke-linecap, butt);

    @media (forced-colors: active) {
        stroke: CanvasText;
    }
`;

export const spacingNoneStyle = css`
    --rc-divider-spacing: ${token.spacing.none.margin};
`;

export const spacingSmallStyle = css`
    --rc-divider-spacing: ${token.spacing.small.margin};
`;

export const spacingLargeStyle = css`
    --rc-divider-spacing: ${token.spacing.large.margin};
`;

export const horizontalStyle = css`
    display: block;
    inline-size: 100%;
    min-inline-size: 100%;
    block-size: ${token.line['border-width']};
    margin-block: var(--rc-divider-spacing, ${token.spacing.medium.margin});
`;

export const verticalStyle = css`
    display: inline-block;
    flex-shrink: 0;
    inline-size: ${token.line['border-width']};
    block-size: ${token.vertical['block-size']};
    margin-inline: var(--rc-divider-spacing, ${token.spacing.medium.margin});
    vertical-align: middle;
`;

export const withTextStyle = css`
    display: flex;
    align-items: center;
    inline-size: 100%;
    min-inline-size: 100%;
    margin-block: var(--rc-divider-spacing, ${token.spacing.medium.margin});
    color: ${token.text.color};
    font-size: ${token.text['font-size']};
    font-weight: ${token.text['font-weight']};
    white-space: nowrap;

    & > svg {
        flex: 1 1 0;
        inline-size: 0;
        min-inline-size: 0;
        block-size: ${token.line['border-width']};
    }

    & > svg:first-child {
        margin-inline-end: ${token.text.gap};
    }

    & > svg:last-child {
        margin-inline-start: ${token.text.gap};
    }
`;

export const textAlignStartStyle = css`
    & > svg:first-child {
        flex: 0 0 var(--rc-divider-text-offset, ${token.text['flex-basis']});
    }
`;

export const textAlignEndStyle = css`
    & > svg:last-child {
        flex: 0 0 var(--rc-divider-text-offset, ${token.text['flex-basis']});
    }
`;

export const textPlainStyle = css`
    color: ${token.text['color-plain']};
    font-weight: ${token.text['font-weight-plain']};
`;

export const textStyle = css`
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
`;
