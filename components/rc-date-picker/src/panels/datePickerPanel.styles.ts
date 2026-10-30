import { css } from '@crab-dev/css';
import token from '../token.js';
import semantic from '@crab-dev/rc-token-semantic';

export const isOutOfRangeStyle = css`
    &:not(:disabled) { color: ${semantic.color.text.tertiary}; }
`;

export const centerFlexStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const panelStyle = css`
    width: calc(${token.cell.content.width} * 7);
    @media (pointer: coarse) { width: calc(${token.cell.touch.width} * 7); }
    max-width: min(100%, ${token.panel['max-width']});
    font-size: ${token.panel['font-size']};
    color: ${semantic.color.text.primary};
    user-select: none;
`;

export const headerStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: ${semantic.space['component-gap']};
`;

export const monthStyle = css`
    display: grid;
    gap: ${semantic.space['inline-gap']};
    text-align: center;
    white-space: nowrap;
    font-weight: ${semantic.font.weight.heading};
    line-height: ${token.header['line-height']};
`;

export const timezoneStyle = css`
    font-size: ${semantic.font.size.caption};
    font-weight: ${semantic.font.weight.body};
    color: ${semantic.color.text.secondary};
`;

export const navigationStyle = css`
    width: ${token.navigation.width};
    height: ${token.navigation.width};
    padding: 0;
`;

export const calendarCellStyle = css`
    text-align: center;
    vertical-align: middle;
    padding: 0;
`;

export const calendarHeaderCellContentStyle = css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${token.header.cell.height};
    font-size: ${token.header["font-size"]};
    font-weight: ${token.header["font-weight"]};
    line-height: ${token.header.cell.height};
    box-sizing: border-box;
`;

export const calendarDateCellContentStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${token.cell["border-radius"]};
    width: min(${token.cell.content.width}, 100%);
    min-width: 0;
    height: ${token.cell.content.width};
    @media (pointer: coarse) { min-height: ${token.cell.touch.width}; min-width: min(${token.cell.touch.width}, 100%); }
    line-height: ${token.cell.content.width};
    font-size: ${token.cell["font-size"]};
    font-weight: ${token.cell["font-weight"]};
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    /* 常驻过渡：hover 进出与选中切换获得对称、即时的颜色反馈 */
    transition: background-color ${token.cell.transition}, color ${token.cell.transition};
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) { &[aria-pressed="true"] { outline: 2px solid Highlight; } }
`;

export const todayStyle = css`
    &&:not([aria-pressed="true"]):not(:disabled) {
        color: ${token.cell.today.color};
        border: ${token.cell.today['border-width']} solid ${token.cell.today['border-color']};
    }
`;

export const calendarTableStyle = css`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
`;
