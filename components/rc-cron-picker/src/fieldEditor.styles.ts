import { css } from '@crab-dev/css';
import token from './token.js';

export const editorStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    min-inline-size: 0;
`;

export const parametersStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${token.field.parameter['min-width']}, 1fr));
    gap: ${token.field.parameter.gap};
    > * { min-inline-size: 0; }
`;

export const inputStyle = css`
    inline-size: 100%;
    min-inline-size: 0;
`;

export const hintStyle = css`
    margin: 0;
    color: ${token.field.hint.color};
    font-size: ${token.field.hint['font-size']};
    line-height: ${token.field.hint['line-height']};
`;

export const selectionHeadingStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: ${token['mode-row'].gap};
    margin-block-end: ${token['value-grid'].gap};
    color: ${token['mode-row'].text.color};
    font-size: ${token['mode-row']['font-size']};
`;

export const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${token['value-grid']['min-width']}, 1fr));
    gap: ${token['value-grid'].gap};
    row-gap: calc(${token['value-grid'].target.padding} * 2);
    max-block-size: ${token['value-grid']['max-height']};
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: ${token['value-grid'].target.padding} ${token['value-grid']['padding-focus']};
    scrollbar-gutter: stable;
`;

export const namedGridStyle = css`
    grid-template-columns: repeat(auto-fit, minmax(${token['value-grid'].named['min-width']}, 1fr));
`;

export const gridTagStyle = css`
    justify-content: center;
    text-align: center;
    margin: 0;
    font-variant-numeric: tabular-nums;
    /* 保持 32px chip 外观，向上下扩展命中区至 48px；行距防止目标重叠。 */
    overflow: visible;
    &::before {
        content: '';
        position: absolute;
        inset-inline: 0;
        inset-block: calc(-1 * ${token['value-grid'].target.padding});
    }
    @media (pointer: coarse) {
        &::before { inset-block: 0; }
    }
`;
