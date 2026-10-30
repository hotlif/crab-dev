import { css } from '@crab-dev/css';
import token from './token.js';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';

export const rootStyle = css`
    font-size: ${token.root['font-size']};
    line-height: ${token.root['line-height']};
`;

export const listStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
    gap: ${token.root.gap};
`;

export const itemStyle = css`
    display: inline-flex;
    align-items: center;
    min-width: 0;
`;

export const linkStyle = css`
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (forced-colors: active) { &:focus-visible { outline-color: Highlight; } &[aria-selected='true'], &[aria-current='page'] { outline: 2px solid Highlight; } }
    @media (prefers-reduced-motion: reduce) { transition: none; }

    color: ${token.item.color};
    text-decoration: none;
    transition: color ${token.interaction.transition};
    display: inline-flex; align-items: center;

    &:hover {
        color: ${token.item['color-hover']};
        text-decoration: underline;
    }
`;

export const currentStyle = css`
    color: ${token.item['color-active']};
    font-weight: ${token.item.current['font-weight']};
`;

export const actionStyle = css`
    /* Path navigation owns its text geometry. The action still uses Button's
       native semantics, hit target, focus and press lifecycle. */
    ${buttonVars['text.color']}: ${token.item.color};
    ${buttonVars['text.background-color-hover']}: transparent;
    ${buttonVars['text.background-color-focus']}: transparent;
    ${buttonVars['text.background-color-active']}: transparent;
    ${buttonVars['root.color-disabled']}: ${token.item['color-disabled']};
    ${buttonVars['root.outline-color-focus']}: ${token.interaction['outline-color-focus']};
    ${buttonVars['root.outline-width-focus']}: ${token.interaction['outline-width-focus']};
    ${buttonVars['root.outline-offset-focus']}: ${token.interaction['outline-offset-focus']};
    && {
        font: inherit;
        line-height: inherit;
        color: ${token.item.color};
        height: auto;
        min-height: 0;
        min-width: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        white-space: normal;
        text-align: start;
    }
    &:hover:not(:disabled) { color: ${token.item['color-hover']}; text-decoration: underline; }
    @media (pointer: coarse) { && { min-height: ${token.interaction.touch['min-height']}; min-width: ${token.interaction.touch['min-width']}; } }
`;

export const disabledStyle = css`
    color: ${token.item['color-disabled']};
    cursor: not-allowed;
    pointer-events: none;
`;

export const separatorStyle = css`
    color: ${token.separator.color};
    padding: ${token.separator.padding};
    user-select: none;
`;

export const ellipsisStyle = css`
    color: ${token.ellipsis.color};
`;
