import { css } from '@crab-dev/css';
import token from './token.js';

// Tahoe tab views use a persistent selected bezel. Hover/press belong to the
// control itself; the Material ink layer and underline are not part of it.
export const macosTabStyle = css`
    && {
        &::before { display: none; }
        border-radius: ${token.macos.tab['border-radius']};
        border: 1px solid transparent;
        color: ${token.item.color};
        background: transparent;
        box-shadow: none;
        &:not(:disabled):hover { background-color: ${token.macos.tab['background-color-hover']}; color: ${token.item.color}; }
        &[aria-selected='true'] {
            color: ${token.macos.tab['color-selected']};
            background-color: ${token.macos.tab['background-color-selected']};
            background-image: ${token.macos.tab['background-image']};
            border-color: ${token.macos.tab['border-color']};
            box-shadow: ${token.macos.tab['box-shadow']};
        }
        &:not(:disabled):active { background-color: ${token.macos.tab['background-color-active']}; }
        &:focus-visible { outline-offset: -3px; }
        @media (forced-colors: active) {
            background-image: none;
            &, &:not(:disabled):hover, &:not(:disabled):active { color: CanvasText; background: Canvas; }
            &[aria-selected='true'], &[aria-selected='true']:hover, &[aria-selected='true']:active {
                forced-color-adjust: none;
                color: HighlightText; background: Highlight; border-color: Highlight; box-shadow: none;
            }
            &:focus-visible { outline-color: CanvasText; }
            &[aria-selected='true']:focus-visible { outline-color: HighlightText; outline-offset: calc(-1 * ${token.tab['outline-width-focus']} - 1px); }
        }
    }
`;
export const macosBarStyle = css`
    && {
    flex: 0 1 auto;
    width: fit-content;
    max-width: 100%;
    border: 0;
    border-radius: ${token.bar['border-radius']};
    padding: ${token.bar.padding};
    background: ${token.bar['background-color']};
    }
`;

