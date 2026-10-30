import { css } from '@crab-dev/css';
import token from './token.js';

export const overlayStyle = css`
    inline-size: ${token.overlay.width};
    /* 浮层滚动条会占用父容器宽度，必须同时约束在父级可用空间内。 */
    max-inline-size: min(100%, calc(100vw - ${token.overlay.viewport.gap} * 2));
    padding: ${token.overlay.padding};
    box-sizing: border-box;
`;

export const footerStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.field.parameter.gap};
    margin-block-start: ${token.field.gap};
    padding-block-start: ${token.field.gap};
    border-block-start: 1px solid ${token.divider.color};
`;

export const expressionStyle = css`
    font-family: ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace;
    font-size: ${token.expression['font-size']};
    color: ${token.expression.color};
    background-color: ${token.expression['background-color']};
    border-radius: ${token.expression['border-radius']};
    padding: ${token.expression.padding};
    text-align: start;
    unicode-bidi: isolate;
    user-select: all;
    /* 指定值很多时(如几十个分钟值)表达式可能超宽,折行展示而非撑破弹层 */
    overflow-wrap: anywhere;
`;

export const describeStyle = css`
    color: ${token.describe.color};
    font-size: ${token.describe['font-size']};
    font-weight: ${token.describe['font-weight']};
    line-height: ${token.describe['line-height']};
`;

export const previewStyle = css`
    color: ${token.preview.color};
    font-size: ${token.preview['font-size']};

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        margin-block-start: ${token['mode-row'].gap};
    }

    li {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: ${token['mode-row'].gap};
        color: ${token.preview.time.color};
        font-variant-numeric: tabular-nums;
        line-height: ${token.preview['line-height']};
    }
`;

export const previewHeadingStyle = css`
    display: flex;
    justify-content: space-between;
    gap: ${token['mode-row'].gap};
    flex-wrap: wrap;
`;
