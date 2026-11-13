import { css } from '@crab-dev/css';
import token from './token.js';

// Standard AppKit segmented bezel: one recessed track, independent selection.
// A toolbar can supply a shared glass container; segments never blur each other.
export const macosSegmentStyle = css`
    && {
        &::before { display: none; }
        border: 1px solid transparent;
        &:not(:has(input:disabled)):hover { background-color: ${token.macos.item['background-color-hover']}; }
        &[data-selected] {
            background-color: ${token.thumb['background-color']};
            background-image: ${token.macos.item['background-image']};
            border-color: ${token.macos.item['border-color']};
            box-shadow: ${token.macos.item['box-shadow']};
        }
        &:not(:has(input:disabled)):active { background-color: ${token.macos.item['background-color-active']}; }
        &:has(input:disabled) { background-image: none; box-shadow: none; }
        @media (forced-colors: active) {
            background-image: none;
            &[data-selected] { color: HighlightText; background: Highlight; border-color: Highlight; box-shadow: none; }
        }
    }
`;

