import { css } from '@crab-dev/css';
import token from './token.js';

export const baseStyle = css`
    &:focus-visible { outline: ${token.interaction['outline-width-focus']} solid ${token.interaction['outline-color-focus']}; outline-offset: ${token.interaction['outline-offset-focus']}; }
    @media (pointer: coarse) { min-width: ${token.interaction.touch['min-width']}; min-height: ${token.interaction.touch['min-height']}; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
    @media (forced-colors: active) {
        && {
            /* Keep the system foreground/background pair together. Automatic
               text backplates otherwise conceal text on the selected fill. */
            forced-color-adjust: none;
            color: ButtonText;
            background-color: ButtonFace;
            border-color: ButtonText;
            &::after { display: none; }
            &[aria-checked="true"] {
                color: HighlightText;
                background-color: Highlight;
                border-color: Highlight;
            }
            &[aria-disabled="true"] {
                opacity: 1;
                color: GrayText;
                background-color: ButtonFace;
                border-color: GrayText;
            }
            &:focus-visible { outline-color: Highlight; }
        }
    }

    display: inline-flex;
    position: relative;
    isolation: isolate;
    overflow: hidden;
    align-items: center;
    box-sizing: border-box;
    white-space: nowrap;
    line-height: 1;
    vertical-align: middle;
    height: ${token.checkable.height};
    padding: ${token.size.medium.padding};
    border-radius: ${token.size.medium['border-radius']};
    gap: ${token.size.medium.gap};
    border: 1px solid ${token.default['border-color']};
    font-size: ${token.checkable['font-size']};
    cursor: pointer;
    user-select: none;
    transition: ${token.root.transition};
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        background: currentColor;
        opacity: 0;
        transition: opacity ${token.checkable.state.transition};
    }
    &:hover:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-hover']}; }
    &:focus-visible:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-focus']}; }
    &:active:not([aria-disabled="true"])::after { opacity: ${token.checkable.state['opacity-active']}; }
    &[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: ${token.checkable['opacity-disabled']};
    }
`;

export const checkedStyle = css`
    color: ${token.checkable['color-selected']};
    background-color: ${token.checkable['background-color-selected']};
    border-color: ${token.checkable['border-color-selected']};
`;

export const uncheckedStyle = css`
    color: ${token.default.color};
    background-color: ${token.default['background-color']};
    border-color: ${token.default['border-color']};
`;

export const iconStyle = css`
    display: inline-flex;
    align-items: center;
    > svg { width: ${token.checkable.icon.width}; height: ${token.checkable.icon.width}; }
`;
