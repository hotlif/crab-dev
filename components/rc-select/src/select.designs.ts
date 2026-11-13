import { css } from '@crab-dev/css';
import token from './token.js';

// macOS popup menus keep a leading check column; the active row owns the
// accent highlight. The persistent check, not a second tonal fill, marks value.
export const macosOptionStyle = css`
    &&& {
        color: ${token.macos.option.color};
        background-color: transparent;
        outline: none;
        font-weight: inherit;
        &:is(:hover, :active, [data-highlighted='true']):not([aria-disabled='true']) {
            color: ${token.macos.option['color-active']};
            background-color: ${token.macos.option['background-color-active']};
        }
        > [data-select-check] {
            order: -1;
            margin-inline: 0 ${token.macos.check['margin-inline-end']};
            color: inherit;
            visibility: hidden;
        }
        &[aria-selected='true'] > [data-select-check] { visibility: visible; }
        @media (forced-colors: active) {
            color: CanvasText;
            background: Canvas;
            &:is(:hover, :active, [data-highlighted='true']):not([aria-disabled='true']) { color: HighlightText; background: Highlight; }
            &[aria-disabled='true'] { color: GrayText; }
        }
    }
`;
