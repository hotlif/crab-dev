import { css } from '@crab-dev/css';
import token from './token.js';

// Checkable tags are a Web extension of a compact Mac toggle button, not M3
// filter chips. Keep the caller's symbol stable when selection changes.
export const macosCheckableStyle = css`
    && {
        &::after { display: none; }
        border-radius: ${token.macos.checkable['border-radius']};
        background-color: ${token.macos.checkable['background-color']};
        color: ${token.default.color};
        box-shadow: ${token.macos.checkable['box-shadow']};
        &:not([aria-disabled='true']):hover { background-color: ${token.macos.checkable['background-color-hover']}; }
        &[aria-checked='true'] {
            color: ${token.macos.checkable['color-selected']};
            background-color: ${token.macos.checkable['background-color-selected']};
            border-color: transparent;
        }
        &:not([aria-disabled='true']):active { box-shadow: none; }
        @media (forced-colors: active) {
            box-shadow: none;
            &[aria-checked='true'] { color: HighlightText; background: Highlight; border-color: Highlight; }
        }
    }
`;

